import * as THREE from 'three';

/**
 * Cinematic Molecular Impostor Engine (Zero-Overhead Cryo-EM & Goodsell Rendering)
 *
 * Replaces high-poly sphere meshes and expensive multi-pass SSAO/transmission with:
 *  1. Instanced GPU Ray-Casted Sphere Impostors (1 draw call for thousands of atoms)
 *  2. Precomputed Cavity / Neighbor Ambient Occlusion (0 FPS runtime cost)
 *  3. Single-pass Wrap-Subsurface Scattering (Cryo-EM) + Goodsell Illustrative mode
 */

// CPK + Biochemical Color Palette (linear-friendly vibrant scientific tones)
export const BIO_ELEMENT_COLORS = {
  C: '#94a3b8',   // Carbon (slate-silver)
  N: '#3b82f6',   // Nitrogen (cobalt blue)
  O: '#ef4444',   // Oxygen (crimson)
  P: '#f97316',   // Phosphorus (amber-orange)
  S: '#eab308',   // Sulfur (gold)
  H: '#e2e8f0',   // Hydrogen (pearl)
  Fe: '#dc2626',  // Ferrous Iron (heme crimson)
  Na: '#a855f7',  // Sodium ion (violet)
  K: '#22d3ee',   // Potassium ion (cyan)
  A: '#22d3ee',   // Adenine
  T: '#f43f5e',   // Thymine
  G: '#10b981',   // Guanine
  C_BASE: '#f59e0b', // Cytosine
};

/**
 * Computes per-atom cavity/neighbor ambient occlusion in O(N^2) once at build time.
 * Atoms buried inside protein pockets or DNA grooves receive lower AO (darker crevices),
 * mimicking Multi-Scale SSAO at zero per-frame GPU cost.
 *
 * @param {Array<{x:number, y:number, z:number, r:number}>} atoms
 * @param {number} probeRadius
 * @returns {Float32Array} occlusion factor in [0.22, 1.0]
 */
export function computeAtomOcclusion(atoms, probeRadius = 0.28) {
  const n = atoms.length;
  const occ = new Float32Array(n);
  const cutoffSq = probeRadius * probeRadius;

  for (let i = 0; i < n; i++) {
    const a = atoms[i];
    let skyBlocked = 0;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const b = atoms[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 > 1e-6 && d2 < cutoffSq) {
        const d = Math.sqrt(d2);
        const weight = (1.0 - d / probeRadius) * (b.r / Math.max(a.r, 0.01));
        skyBlocked += weight * 0.14;
      }
    }
    occ[i] = Math.max(0.22, Math.min(1.0, 1.0 - skyBlocked));
  }
  return occ;
}

const IMPOSTOR_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aRadius;
  attribute vec3 aColor;
  attribute float aOcclusion;
  attribute float aEmissive;

  varying vec2 vQuadUv;
  varying vec3 vViewCenter;
  varying float vRadius;
  varying vec3 vColor;
  varying float vOcclusion;
  varying float vEmissive;

  void main() {
    // position.xy is in [-1, 1] quad corners
    vQuadUv = position.xy;
    vColor = aColor;
    vOcclusion = aOcclusion;
    vEmissive = aEmissive;

    // Transform atom center to view space
    vec4 viewCenter = modelViewMatrix * vec4(aOffset, 1.0);
    vViewCenter = viewCenter.xyz;

    // Account for uniform/average object scale in world/model matrix
    float scaleX = length(vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]));
    float scaledRadius = aRadius * scaleX;
    vRadius = scaledRadius;

    // Expand billboard in view space (slightly padded by 1.08x to avoid perspective edge clipping)
    vec3 billboardPos = viewCenter.xyz + vec3(position.xy * scaledRadius * 1.08, 0.0);
    gl_Position = projectionMatrix * vec4(billboardPos, 1.0);
  }
`;

const IMPOSTOR_FRAGMENT_SHADER = /* glsl */ `
  uniform mat4 projectionMatrix;
  uniform float uStyleMode; // 0.0 = Cryo-EM SSS, 1.0 = Goodsell Illustrative
  uniform float uTime;

  varying vec2 vQuadUv;
  varying vec3 vViewCenter;
  varying float vRadius;
  varying vec3 vColor;
  varying float vOcclusion;
  varying float vEmissive;

  void main() {
    // Ray-sphere intersection in view space on the billboard plane
    vec2 localXY = vQuadUv * 1.08;
    float r2 = dot(localXY, localXY);
    if (r2 > 1.0) discard;

    float zOffset = sqrt(max(0.0, 1.0 - r2));
    vec3 normal = normalize(vec3(localXY, zOffset));
    vec3 hitViewPos = vViewCenter + normal * vRadius;

    // Analytical depth write so intersecting atoms clip seamlessly
    vec4 clipPos = projectionMatrix * vec4(hitViewPos, 1.0);
    float ndcDepth = clipPos.z / clipPos.w;
    gl_FragDepth = ndcDepth * 0.5 + 0.5;

    vec3 viewDir = normalize(-hitViewPos);
    vec3 keyLight = normalize(vec3(0.55, 0.78, 0.62));
    vec3 rimLight = normalize(vec3(-0.65, -0.35, 0.45));

    float ndotl = dot(normal, keyLight);
    float rimNdotl = max(0.0, dot(normal, rimLight));
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.6);

    vec3 finalColor;

    if (uStyleMode > 0.5) {
      // --- DAVID GOODSELL / CELLPAINT ILLUSTRATIVE STYLE ---
      // Crisp silhouette outline + stepped cel shading + deep cavity AO
      float edge = max(0.0, dot(normal, viewDir));
      if (edge < 0.24) {
        finalColor = vec3(0.03, 0.05, 0.09); // Crisp ink outline
      } else {
        float cel = ndotl > 0.35 ? 1.05 : (ndotl > -0.15 ? 0.82 : 0.62);
        finalColor = vColor * cel * (0.45 + 0.55 * vOcclusion);
      }
    } else {
      // --- CRYO-EM / XVIVO SUBSURFACE SCATTERING STYLE ---
      // Wrap diffuse lighting simulates light penetrating organic macromolecules
      float wrap = 0.42;
      float wrapDiffuse = max(0.0, (ndotl + wrap) / (1.0 + wrap));

      // Blinn-Phong micro-specular (soft organic sheen, not harsh plastic)
      vec3 halfVec = normalize(keyLight + viewDir);
      float spec = pow(max(0.0, dot(normal, halfVec)), 36.0) * 0.32;

      // Subsurface rim translucency
      vec3 sssTint = mix(vColor, vec3(0.45, 0.92, 1.0), 0.35);
      vec3 sssGlow = sssTint * fresnel * (0.45 + 0.35 * rimNdotl);

      vec3 ambient = vColor * 0.16 * vOcclusion;
      vec3 diffuse = vColor * wrapDiffuse * (0.35 + 0.65 * vOcclusion);
      vec3 emissiveTerm = vColor * vEmissive * (0.85 + 0.15 * sin(uTime * 2.5));

      finalColor = ambient + diffuse + sssGlow + vec3(spec * vOcclusion) + emissiveTerm;
    }

    // Subtle gamma / tone-mapping polish
    finalColor = finalColor / (finalColor + vec3(0.18));
    finalColor = pow(max(finalColor, vec3(0.0)), vec3(0.92));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

/**
 * Creates a single-draw-call InstancedBufferGeometry mesh of ray-casted atom spheres.
 *
 * @param {Array<{x:number, y:number, z:number, r:number, color:string|number, emissive?:number}>} atoms
 * @param {object} options
 * @returns {THREE.Mesh}
 */
export function createAtomImpostorMesh(atoms, { styleMode = 0 } = {}) {
  const count = atoms.length;
  const baseQuad = new THREE.PlaneGeometry(2, 2, 1, 1);
  const instancedGeo = new THREE.InstancedBufferGeometry();
  instancedGeo.index = baseQuad.index;
  instancedGeo.attributes.position = baseQuad.attributes.position;
  instancedGeo.instanceCount = count;

  const offsets = new Float32Array(count * 3);
  const radii = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const emissives = new Float32Array(count);
  const occlusion = computeAtomOcclusion(atoms, 0.32);

  const tmpColor = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const a = atoms[i];
    offsets[i * 3] = a.x;
    offsets[i * 3 + 1] = a.y;
    offsets[i * 3 + 2] = a.z;
    radii[i] = a.r;
    tmpColor.set(a.color || '#38bdf8');
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
    emissives[i] = a.emissive || 0.0;
  }

  instancedGeo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
  instancedGeo.setAttribute('aRadius', new THREE.InstancedBufferAttribute(radii, 1));
  instancedGeo.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));
  instancedGeo.setAttribute('aOcclusion', new THREE.InstancedBufferAttribute(occlusion, 1));
  instancedGeo.setAttribute('aEmissive', new THREE.InstancedBufferAttribute(emissives, 1));

  // Generous bounding sphere so frustum culling never clips expanded billboards
  instancedGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 12);

  const material = new THREE.ShaderMaterial({
    vertexShader: IMPOSTOR_VERTEX_SHADER,
    fragmentShader: IMPOSTOR_FRAGMENT_SHADER,
    uniforms: {
      uStyleMode: { value: styleMode },
      uTime: { value: 0 },
    },
    extensions: {
      fragDepth: true,
    },
  });

  const mesh = new THREE.Mesh(instancedGeo, material);
  mesh.frustumCulled = false;
  mesh.userData.isImpostorMesh = true;
  mesh.userData.atomCount = count;
  baseQuad.dispose();
  return mesh;
}

/**
 * Creates a single-draw-call InstancedMesh of covalent/hydrogen bonds.
 *
 * @param {Array<{from:[number,number,number], to:[number,number,number], radius?:number, color?:string}>} bonds
 * @returns {THREE.InstancedMesh|null}
 */
export function createBondInstancedMesh(bonds) {
  if (!bonds || bonds.length === 0) return null;
  const geo = new THREE.CylinderGeometry(1, 1, 1, 10, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    roughness: 0.35,
    metalness: 0.15,
  });

  const mesh = new THREE.InstancedMesh(geo, mat, bonds.length);
  const dummy = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const tmpColor = new THREE.Color();

  for (let i = 0; i < bonds.length; i++) {
    const b = bonds[i];
    p1.set(b.from[0], b.from[1], b.from[2]);
    p2.set(b.to[0], b.to[1], b.to[2]);
    dir.subVectors(p2, p1);
    const len = dir.length();
    const r = b.radius || 0.014;

    dummy.position.copy(p1).addScaledVector(dir, 0.5);
    if (len > 1e-5) {
      dummy.quaternion.setFromUnitVectors(up, dir.normalize());
    }
    dummy.scale.set(r, len, r);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    tmpColor.set(b.color || '#64748b');
    mesh.setColorAt(i, tmpColor);
  }

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}

// ============================================================================
// REALISTIC ALL-ATOM & COARSE-GRAINED MACROMOLECULE GENERATORS
// ============================================================================

/**
 * Builds an authentic B-DNA Double Helix with:
 *  - True 10.5 bp/turn pitch & 136-degree glycosidic asymmetry (Major & Minor Grooves)
 *  - Sugar-phosphate backbone atom clusters (P, O, deoxyribose C5'/C4'/C3')
 *  - Purine (2-ring) & Pyrimidine (1-ring) planar base pairs + H-bonds
 */
export function buildRealisticBDNA({ basePairs = 24, styleMode = 0 } = {}) {
  const atoms = [];
  const bonds = [];

  const rise = 0.095;
  const totalHeight = (basePairs - 1) * rise;
  const radius = 0.36;
  const twistPerBp = (Math.PI * 2) / 10.5;
  const grooveAngle = 2.38; // ~136° asymmetry produces real Major & Minor grooves

  const pairs = [
    ['A', 'T', BIO_ELEMENT_COLORS.A, BIO_ELEMENT_COLORS.T],
    ['G', 'C_BASE', BIO_ELEMENT_COLORS.G, BIO_ELEMENT_COLORS.C_BASE],
    ['T', 'A', BIO_ELEMENT_COLORS.T, BIO_ELEMENT_COLORS.A],
    ['C_BASE', 'G', BIO_ELEMENT_COLORS.C_BASE, BIO_ELEMENT_COLORS.G],
  ];

  let prevP1 = null;
  let prevP2 = null;

  for (let i = 0; i < basePairs; i++) {
    const y = i * rise - totalHeight * 0.5;
    const theta = i * twistPerBp;
    const [, , colA, colB] = pairs[i % pairs.length];

    // Strand 1 & Strand 2 phosphate coordinates
    const p1 = [Math.cos(theta) * radius, y, Math.sin(theta) * radius];
    const p2 = [Math.cos(theta + grooveAngle) * radius, y, Math.sin(theta + grooveAngle) * radius];

    // Phosphate + 2 oxygens + deoxyribose sugar cluster
    atoms.push({ x: p1[0], y: p1[1], z: p1[2], r: 0.048, color: BIO_ELEMENT_COLORS.P });
    atoms.push({ x: p1[0] * 1.12, y: p1[1] + 0.025, z: p1[2] * 1.12, r: 0.032, color: BIO_ELEMENT_COLORS.O });
    atoms.push({ x: p1[0] * 0.88, y: p1[1] - 0.022, z: p1[2] * 0.88, r: 0.036, color: BIO_ELEMENT_COLORS.C });

    atoms.push({ x: p2[0], y: p2[1], z: p2[2], r: 0.048, color: BIO_ELEMENT_COLORS.P });
    atoms.push({ x: p2[0] * 1.12, y: p2[1] - 0.025, z: p2[2] * 1.12, r: 0.032, color: BIO_ELEMENT_COLORS.O });
    atoms.push({ x: p2[0] * 0.88, y: p2[1] + 0.022, z: p2[2] * 0.88, r: 0.036, color: BIO_ELEMENT_COLORS.C });

    if (prevP1) bonds.push({ from: prevP1, to: p1, radius: 0.018, color: '#38bdf8' });
    if (prevP2) bonds.push({ from: prevP2, to: p2, radius: 0.018, color: '#2dd4bf' });
    prevP1 = p1;
    prevP2 = p2;

    // Planar stacked nitrogenous base atoms spanning between p1 and p2
    const steps = 6;
    for (let s = 1; s < steps; s++) {
      const f = s / steps;
      const bx = p1[0] * (1 - f) + p2[0] * f;
      const by = y;
      const bz = p1[2] * (1 - f) + p2[2] * f;
      const isLeft = s <= 3;
      const baseCol = isLeft ? colA : colB;
      // Add slight perpendicular ring thickness
      const perpX = -(p2[2] - p1[2]) * 0.06;
      const perpZ = (p2[0] - p1[0]) * 0.06;

      atoms.push({
        x: bx,
        y: by,
        z: bz,
        r: s === 3 || s === 4 ? 0.032 : 0.038,
        color: baseCol,
        emissive: 0.12,
      });
      if (s === 2 || s === 4) {
        atoms.push({
          x: bx + perpX,
          y: by,
          z: bz + perpZ,
          r: 0.028,
          color: baseCol,
        });
      }
    }
    bonds.push({ from: p1, to: p2, radius: 0.009, color: '#94a3b8' });
  }

  const group = new THREE.Group();
  group.add(createAtomImpostorMesh(atoms, { styleMode }));
  const bondMesh = createBondInstancedMesh(bonds);
  if (bondMesh) group.add(bondMesh);
  group.userData.atomCount = atoms.length;
  return group;
}

/**
 * Builds a dense, multi-chain globular Hemoglobin alpha2-beta2 tetramer
 * with 4 helical globin subunits + 4 Porphyrin Heme rings & Fe2+ cores.
 */
function buildHemoglobin({ styleMode = 0 } = {}) {
  const atoms = [];
  const bonds = [];
  const subunitOffsets = [
    { pos: [-0.38, 0.34, 0.22], color: '#ef4444', seed: 0.0 },
    { pos: [0.38, 0.34, -0.22], color: '#f97316', seed: 1.5 },
    { pos: [-0.36, -0.34, -0.24], color: '#fb7185', seed: 3.1 },
    { pos: [0.36, -0.34, 0.24], color: '#e11d48', seed: 4.7 },
  ];

  subunitOffsets.forEach((sub) => {
    const [ox, oy, oz] = sub.pos;
    // Packed alpha-helical globin fold (~80 residues per subunit)
    let prev = null;
    for (let i = 0; i < 82; i++) {
      const t = i / 81;
      const helix = i * 1.45 + sub.seed;
      const lobe = t * Math.PI * 3.0;
      const x = ox + Math.cos(helix) * 0.14 + Math.sin(lobe) * 0.22;
      const y = oy + (t - 0.5) * 0.56 + Math.cos(lobe * 1.3) * 0.12;
      const z = oz + Math.sin(helix) * 0.14 + Math.cos(lobe) * 0.22;
      const cur = [x, y, z];
      atoms.push({ x, y, z, r: 0.056, color: sub.color });
      if (prev) bonds.push({ from: prev, to: cur, radius: 0.015, color: sub.color });
      prev = cur;
    }

    // Porphyrin Heme pocket + glowing Fe2+ core
    atoms.push({ x: ox, y: oy, z: oz, r: 0.068, color: BIO_ELEMENT_COLORS.Fe, emissive: 0.55 });
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      atoms.push({
        x: ox + Math.cos(a) * 0.11,
        y: oy + Math.sin(a) * 0.11,
        z: oz,
        r: 0.036,
        color: k % 2 === 0 ? BIO_ELEMENT_COLORS.N : BIO_ELEMENT_COLORS.C,
      });
    }
  });

  const group = new THREE.Group();
  group.add(createAtomImpostorMesh(atoms, { styleMode }));
  const bondMesh = createBondInstancedMesh(bonds);
  if (bondMesh) group.add(bondMesh);
  group.userData.atomCount = atoms.length;
  return group;
}

/**
 * Builds F0F1 ATP Synthase Rotary Motor (membrane c-ring + stalk + alpha3-beta3 crown).
 */
function buildATPSynthase({ styleMode = 0 } = {}) {
  const atoms = [];
  // F0 c-ring (10 transmembrane alpha-helices)
  for (let c = 0; c < 10; c++) {
    const a = (c / 10) * Math.PI * 2;
    for (let h = 0; h < 8; h++) {
      const y = -0.78 + h * 0.065;
      atoms.push({
        x: Math.cos(a) * 0.34,
        y,
        z: Math.sin(a) * 0.34,
        r: 0.055,
        color: c % 2 === 0 ? '#f59e0b' : '#d97706',
      });
    }
  }
  // Central gamma rotor shaft
  for (let y = -0.35; y <= 0.45; y += 0.06) {
    atoms.push({
      x: Math.sin(y * 8) * 0.04,
      y,
      z: Math.cos(y * 8) * 0.04,
      r: 0.058,
      color: '#fde047',
      emissive: 0.28,
    });
  }
  // F1 Hexameric alpha3-beta3 catalytic crown
  for (let lobe = 0; lobe < 6; lobe++) {
    const baseAngle = (lobe / 6) * Math.PI * 2;
    const isBeta = lobe % 2 === 0;
    const col = isBeta ? '#38bdf8' : '#0ea5e9';
    for (let i = 0; i < 36; i++) {
      const t = i / 35;
      const spiral = i * 0.95;
      const cx = Math.cos(baseAngle) * 0.28 + Math.cos(spiral) * 0.11;
      const cy = 0.25 + t * 0.55;
      const cz = Math.sin(baseAngle) * 0.28 + Math.sin(spiral) * 0.11;
      atoms.push({ x: cx, y: cy, z: cz, r: 0.058, color: col });
    }
  }
  // Peripheral stator arm
  for (let i = 0; i < 22; i++) {
    const t = i / 21;
    atoms.push({
      x: 0.48 + Math.sin(t * Math.PI) * 0.1,
      y: -0.6 + t * 1.45,
      z: 0,
      r: 0.046,
      color: '#a855f7',
    });
  }

  const group = new THREE.Group();
  group.add(createAtomImpostorMesh(atoms, { styleMode }));
  group.userData.atomCount = atoms.length;
  return group;
}

/**
 * Builds Type-I Triple-Helix Collagen (3 braided left-handed alpha-chains).
 */
function buildCollagenTripleHelix({ styleMode = 0 } = {}) {
  const atoms = [];
  const bonds = [];
  const chainColors = ['#22d3ee', '#38bdf8', '#818cf8'];

  for (let c = 0; c < 3; c++) {
    const phase = (c / 3) * Math.PI * 2;
    let prev = null;
    for (let i = 0; i < 64; i++) {
      const t = i / 63;
      const y = (t - 0.5) * 2.2;
      const superAngle = t * Math.PI * 6 + phase;
      const subAngle = -t * Math.PI * 24; // opposite-handed local helix
      const x = Math.cos(superAngle) * 0.16 + Math.cos(subAngle) * 0.05;
      const z = Math.sin(superAngle) * 0.16 + Math.sin(subAngle) * 0.05;
      const cur = [x, y, z];
      // Every 3rd residue is Glycine (smaller), others Proline/Hydroxyproline
      const isGly = i % 3 === 0;
      atoms.push({ x, y, z, r: isGly ? 0.044 : 0.058, color: chainColors[c] });
      if (prev) bonds.push({ from: prev, to: cur, radius: 0.016, color: chainColors[c] });
      prev = cur;
    }
  }

  const group = new THREE.Group();
  group.add(createAtomImpostorMesh(atoms, { styleMode }));
  const bondMesh = createBondInstancedMesh(bonds);
  if (bondMesh) group.add(bondMesh);
  group.userData.atomCount = atoms.length;
  return group;
}

/**
 * Builds Actin-Myosin Contractile Filament (helical F-actin + Myosin S1 motor heads).
 */
function buildActinMyosin({ styleMode = 0 } = {}) {
  const atoms = [];
  // Double-helical F-actin monomers
  for (let i = 0; i < 34; i++) {
    const x = (i / 33 - 0.5) * 2.2;
    const angle = i * 0.48;
    for (let strand = 0; strand < 2; strand++) {
      const a = angle + strand * Math.PI;
      const cy = Math.cos(a) * 0.14;
      const cz = Math.sin(a) * 0.14;
      // Each G-actin monomer is a compact 7-bead globular cluster
      for (let b = 0; b < 7; b++) {
        const ba = (b / 7) * Math.PI * 2;
        atoms.push({
          x: x + Math.cos(ba) * 0.04,
          y: cy + Math.sin(ba) * 0.045,
          z: cz + (b % 2 === 0 ? 0.03 : -0.03),
          r: 0.05,
          color: strand === 0 ? '#f43f5e' : '#fb7185',
        });
      }
    }
  }
  // 2 Myosin-II S1 lever-arm heads gripping the filament
  [-0.45, 0.45].forEach((mx) => {
    for (let k = 0; k < 18; k++) {
      const t = k / 17;
      atoms.push({
        x: mx + Math.sin(t * 2.2) * 0.16,
        y: -0.22 - t * 0.42,
        z: Math.cos(t * 3.0) * 0.09,
        r: 0.062,
        color: '#f59e0b',
        emissive: k < 4 ? 0.25 : 0.0,
      });
    }
  });

  const group = new THREE.Group();
  group.add(createAtomImpostorMesh(atoms, { styleMode }));
  group.userData.atomCount = atoms.length;
  return group;
}

/**
 * Builds Voltage-Gated Na+/K+ Ion Channel (4 transmembrane helix bundles + central pore + ions).
 */
function buildIonChannel({ styleMode = 0 } = {}) {
  const atoms = [];
  // 4 symmetric domains around central selectivity pore
  for (let d = 0; d < 4; d++) {
    const domAngle = (d / 4) * Math.PI * 2;
    // 4 transmembrane alpha-helices per domain
    for (let h = 0; h < 4; h++) {
      const rOff = h === 0 ? 0.24 : 0.44;
      const aOff = domAngle + (h - 1.5) * 0.28;
      for (let z = 0; z < 12; z++) {
        const y = (z / 11 - 0.5) * 1.15;
        atoms.push({
          x: Math.cos(aOff) * rOff + Math.sin(z * 1.4) * 0.03,
          y,
          z: Math.sin(aOff) * rOff + Math.cos(z * 1.4) * 0.03,
          r: 0.056,
          color: h === 3 ? '#eab308' : '#38bdf8', // S4 voltage sensor in gold
        });
      }
    }
  }
  // Na+ / K+ ions traversing the central pore
  [-0.45, -0.15, 0.15, 0.45].forEach((iy, idx) => {
    atoms.push({
      x: 0,
      y: iy,
      z: 0,
      r: 0.065,
      color: idx % 2 === 0 ? BIO_ELEMENT_COLORS.Na : BIO_ELEMENT_COLORS.K,
      emissive: 0.65,
    });
  });

  const group = new THREE.Group();
  group.add(createAtomImpostorMesh(atoms, { styleMode }));
  group.userData.atomCount = atoms.length;
  return group;
}

/**
 * Builds a high-density Phospholipid Bilayer patch with polar heads & kinked fatty-acid tails.
 */
function buildPhospholipidBilayer({ styleMode = 0 } = {}) {
  const atoms = [];
  const grid = 8;
  const spacing = 0.17;
  for (let gx = 0; gx < grid; gx++) {
    for (let gz = 0; gz < grid; gz++) {
      const x = (gx - (grid - 1) * 0.5) * spacing;
      const z = (gz - (grid - 1) * 0.5) * spacing;
      const wave = Math.sin(gx * 0.7 + gz * 0.5) * 0.04;

      // Top & Bottom leaflets
      [1, -1].forEach((dir) => {
        const headY = dir * 0.42 + wave;
        atoms.push({ x, y: headY, z, r: 0.062, color: '#38bdf8' }); // Phosphate head
        atoms.push({ x: x + 0.03, y: headY - dir * 0.07, z, r: 0.042, color: '#f97316' }); // Glycerol
        // 2 hydrophobic acyl tails
        for (let t = 1; t <= 4; t++) {
          const ty = headY - dir * (0.09 + t * 0.072);
          atoms.push({ x: x - 0.025 + Math.sin(t + gx) * 0.015, y: ty, z: z - 0.02, r: 0.032, color: '#cbd5e1' });
          atoms.push({ x: x + 0.025, y: ty, z: z + 0.02, r: 0.032, color: '#94a3b8' });
        }
      });
    }
  }

  const group = new THREE.Group();
  group.add(createAtomImpostorMesh(atoms, { styleMode }));
  group.userData.atomCount = atoms.length;
  return group;
}

/**
 * Unified factory for all Level 1 Macromolecules in TopDownOrganogenesisLab.
 */
export function buildRealisticMacromolecule(moleculeId, { styleMode = 0 } = {}) {
  switch (moleculeId) {
    case 'bdna_chromatin':
      return buildRealisticBDNA({ basePairs: 24, styleMode });
    case 'hemoglobin':
      return buildHemoglobin({ styleMode });
    case 'atp_synthase':
      return buildATPSynthase({ styleMode });
    case 'collagen_i':
      return buildCollagenTripleHelix({ styleMode });
    case 'actin_myosin':
      return buildActinMyosin({ styleMode });
    case 'ion_channel':
      return buildIonChannel({ styleMode });
    case 'phospholipid_bilayer':
      return buildPhospholipidBilayer({ styleMode });
    default:
      return buildHemoglobin({ styleMode });
  }
}

/**
 * Generates chemically accurate CPK atom & bond geometry for each sub-ingredient
 * (tetrahedral PO4, bicyclic purine, furanose pentagon, hydrocarbon acyl chain, amino acids, Fe2+).
 */
export function getSubIngredientSpec(subId) {
  const atoms = [];
  const bonds = [];
  const C = BIO_ELEMENT_COLORS.C;
  const N = BIO_ELEMENT_COLORS.N;
  const O = BIO_ELEMENT_COLORS.O;
  const P = BIO_ELEMENT_COLORS.P;
  const Fe = BIO_ELEMENT_COLORS.Fe;

  const link = (a, b, col = '#94a3b8') =>
    bonds.push({ from: [a.x, a.y, a.z], to: [b.x, b.y, b.z], radius: 0.018, color: col });

  switch (subId) {
    case 'phosphoric-acid': {
      // Tetrahedral PO4^3-
      const p = { x: 0, y: 0, z: 0, r: 0.095, color: P, emissive: 0.18 };
      const dirs = [
        [0, 0.16, 0],
        [0.15, -0.06, 0.08],
        [-0.15, -0.06, 0.08],
        [0, -0.06, -0.16],
      ];
      atoms.push(p);
      dirs.forEach(([x, y, z]) => {
        const ox = { x, y, z, r: 0.072, color: O };
        atoms.push(ox);
        link(p, ox, P);
      });
      break;
    }
    case 'adenine': {
      // Purine bicyclic aromatic ring (6-ring + 5-ring)
      const ring6 = [];
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const atom = {
          x: Math.cos(a) * 0.14 - 0.06,
          y: Math.sin(a) * 0.14,
          z: 0,
          r: 0.058,
          color: i % 2 === 0 ? N : C,
        };
        ring6.push(atom);
        atoms.push(atom);
      }
      for (let i = 0; i < 6; i++) link(ring6[i], ring6[(i + 1) % 6], '#a855f7');
      const n7 = { x: 0.16, y: 0.09, z: 0, r: 0.058, color: N };
      const c8 = { x: 0.23, y: 0, z: 0, r: 0.056, color: C };
      const n9 = { x: 0.16, y: -0.09, z: 0, r: 0.058, color: N };
      atoms.push(n7, c8, n9);
      link(ring6[0], n7, '#a855f7');
      link(n7, c8, '#a855f7');
      link(c8, n9, '#a855f7');
      link(n9, ring6[5], '#a855f7');
      break;
    }
    case 'ribose': {
      // 5-membered furanose pentagon ring
      const ring5 = [];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const atom = {
          x: Math.cos(a) * 0.13,
          y: Math.sin(a) * 0.13,
          z: (i % 2) * 0.025,
          r: 0.06,
          color: i === 0 ? O : C,
        };
        ring5.push(atom);
        atoms.push(atom);
      }
      for (let i = 0; i < 5; i++) link(ring5[i], ring5[(i + 1) % 5], '#22d3ee');
      break;
    }
    case 'fatty-acid': {
      // Long zig-zag hydrophobic hydrocarbon chain + COOH head
      let prev = null;
      for (let i = 0; i < 8; i++) {
        const atom = {
          x: (i - 3.5) * 0.085,
          y: (i % 2 === 0 ? 0.045 : -0.045),
          z: 0,
          r: i === 0 ? 0.068 : 0.054,
          color: i === 0 ? O : C,
        };
        atoms.push(atom);
        if (prev) link(prev, atom, '#0ea5e9');
        prev = atom;
      }
      const o2 = { x: -3.5 * 0.085 - 0.04, y: -0.09, z: 0.04, r: 0.064, color: O };
      atoms.push(o2);
      link(atoms[1], o2, O);
      break;
    }
    case 'glycerol': {
      // 3-carbon backbone + 3 OH oxygens
      let prev = null;
      for (let i = 0; i < 3; i++) {
        const c = { x: (i - 1) * 0.12, y: (i % 2) * 0.05, z: 0, r: 0.062, color: C };
        const o = { x: (i - 1) * 0.12, y: (i % 2) * 0.05 + 0.12, z: 0.03, r: 0.066, color: O };
        atoms.push(c, o);
        link(c, o, O);
        if (prev) link(prev, c, '#38bdf8');
        prev = c;
      }
      break;
    }
    case 'iron': {
      // Dense Fe2+ coordination sphere
      atoms.push({ x: 0, y: 0, z: 0, r: 0.145, color: Fe, emissive: 0.55 });
      break;
    }
    case 'arginine':
    case 'glutamic-acid':
    case 'glycine': {
      // Amino acid N - Ca - C(=O)O + side chain
      const n = { x: -0.14, y: 0.03, z: 0, r: 0.065, color: N };
      const ca = { x: 0, y: -0.02, z: 0, r: 0.068, color: C };
      const cCarb = { x: 0.13, y: 0.04, z: 0, r: 0.062, color: C };
      const o1 = { x: 0.21, y: 0.12, z: 0.03, r: 0.06, color: O };
      const o2 = { x: 0.2, y: -0.06, z: -0.03, r: 0.06, color: O };
      atoms.push(n, ca, cCarb, o1, o2);
      link(n, ca, N);
      link(ca, cCarb, C);
      link(cCarb, o1, O);
      link(cCarb, o2, O);
      if (subId !== 'glycine') {
        const sideLen = subId === 'arginine' ? 4 : 3;
        let prev = ca;
        for (let s = 1; s <= sideLen; s++) {
          const sa = {
            x: (s % 2 === 0 ? 0.03 : -0.03),
            y: -0.02 - s * 0.1,
            z: 0.02,
            r: 0.056,
            color: subId === 'arginine' && s >= 3 ? N : subId === 'glutamic-acid' && s === 3 ? O : C,
          };
          atoms.push(sa);
          link(prev, sa, subId === 'arginine' ? '#eab308' : '#f43f5e');
          prev = sa;
        }
      }
      break;
    }
    default: {
      // ADP / Nucleotide-A: purine + ribose + 2 phosphates
      const base = { x: -0.16, y: 0.05, z: 0, r: 0.072, color: N };
      const sug = { x: 0, y: 0, z: 0, r: 0.072, color: C };
      const p1 = { x: 0.15, y: 0.04, z: 0, r: 0.082, color: P, emissive: 0.22 };
      const p2 = { x: 0.29, y: -0.02, z: 0, r: 0.082, color: P, emissive: 0.35 };
      atoms.push(base, sug, p1, p2);
      link(base, sug, '#a855f7');
      link(sug, p1, '#f59e0b');
      link(p1, p2, '#f97316');
      break;
    }
  }
  return { atoms, bonds };
}

/**
 * Builds a 3D preview group of distinct CPK sub-ingredients arranged on the empty Protein Canvas.
 */
export function buildSubIngredientsPreviewGroup(subIds = [], { styleMode = 0 } = {}) {
  const allAtoms = [];
  const allBonds = [];
  const count = subIds.length;

  subIds.forEach((sid, idx) => {
    const spec = getSubIngredientSpec(sid);
    const angle = (idx / Math.max(1, count)) * Math.PI * 2;
    const ox = count === 1 ? 0 : Math.cos(angle) * 0.62;
    const oy = count === 1 ? 0 : Math.sin(angle * 1.4) * 0.22;
    const oz = count === 1 ? 0 : Math.sin(angle) * 0.62;

    spec.atoms.forEach((a) => {
      allAtoms.push({ ...a, x: a.x + ox, y: a.y + oy, z: a.z + oz });
    });
    spec.bonds.forEach((b) => {
      allBonds.push({
        ...b,
        from: [b.from[0] + ox, b.from[1] + oy, b.from[2] + oz],
        to: [b.to[0] + ox, b.to[1] + oy, b.to[2] + oz],
      });
    });
  });

  const group = new THREE.Group();
  if (allAtoms.length > 0) {
    group.add(createAtomImpostorMesh(allAtoms, { styleMode }));
  }
  const bondMesh = createBondInstancedMesh(allBonds);
  if (bondMesh) group.add(bondMesh);
  group.userData.atomCount = allAtoms.length;
  return group;
}

/**
 * Updates uStyleMode (0 = Cryo-EM SSS, 1 = Goodsell) and uTime across any impostor group.
 */
export function updateImpostorUniforms(root, { time, styleMode } = {}) {
  if (!root) return;
  root.traverse((obj) => {
    if (obj.userData?.isImpostorMesh && obj.material?.uniforms) {
      if (typeof time === 'number') obj.material.uniforms.uTime.value = time;
      if (typeof styleMode === 'number') obj.material.uniforms.uStyleMode.value = styleMode;
    }
  });
}
