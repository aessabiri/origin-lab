import * as THREE from 'three';

let cachedStructures = null;
let loadPromise = null;

/**
 * Loads and caches the bundled AlphaFold DB Cα structures JSON.
 */
export async function loadAlphaFoldStructures() {
  if (cachedStructures) return cachedStructures;
  if (!loadPromise) {
    loadPromise = fetch('/proteins/alphafold_structures.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        cachedStructures = data || {};
        return cachedStructures;
      })
      .catch(() => {
        cachedStructures = {};
        return cachedStructures;
      });
  }
  return loadPromise;
}

export function getCachedAlphaFoldStructure(molId) {
  return cachedStructures?.[molId] || null;
}

/**
 * Standard DeepMind AlphaFold pLDDT confidence color scale.
 */
export function plddtToColor(plddt) {
  if (plddt >= 90) return new THREE.Color('#0053d6'); // Very high (dark blue)
  if (plddt >= 70) return new THREE.Color('#65cbf3'); // Confident (cyan)
  if (plddt >= 50) return new THREE.Color('#ffdb13'); // Low (yellow)
  return new THREE.Color('#ff7d45'); // Very low (orange)
}

/**
 * Builds a Three.js Group rendering the real AlphaFold DB polypeptide backbone
 * with animated folding interpolation (foldProgress: 0 = unfolded coil -> 1 = native fold).
 */
export function buildAlphaFoldProteinGroup(
  structure,
  { foldProgress = 1, colorMode = 'plddt', accentColor = '#38bdf8' } = {}
) {
  const group = new THREE.Group();
  if (!structure?.atoms?.length) return group;

  const atoms = structure.atoms;
  const n = atoms.length;

  // Normalize scale so any protein fits neatly inside a ~2.2 unit radius
  let maxR = 1;
  for (let i = 0; i < n; i++) {
    const [x, y, z] = atoms[i];
    const r = Math.hypot(x, y, z);
    if (r > maxR) maxR = r;
  }
  const normScale = 1.15 / maxR;
  const t = Math.max(0, Math.min(1, foldProgress));
  // Smooth ease-out cubic for folding transition
  const ease = 1 - Math.pow(1 - t, 3);

  const points = [];
  const colors = [];
  const baseAccent = new THREE.Color(accentColor);

  for (let i = 0; i < n; i++) {
    const [nx, ny, nz, plddt] = atoms[i];
    const u = n > 1 ? i / (n - 1) - 0.5 : 0;

    // Unfolded nascent polypeptide chain emerging from ribosome
    const ux = u * 2.4;
    const uy = Math.sin(i * 0.45) * 0.28 + Math.cos(i * 0.12) * 0.15;
    const uz = Math.cos(i * 0.45) * 0.28;

    const px = THREE.MathUtils.lerp(ux, nx * normScale, ease);
    const py = THREE.MathUtils.lerp(uy, ny * normScale, ease);
    const pz = THREE.MathUtils.lerp(uz, nz * normScale, ease);
    points.push(new THREE.Vector3(px, py, pz));

    if (colorMode === 'plddt') {
      colors.push(plddtToColor(plddt));
    } else if (colorMode === 'goodsell') {
      const c = baseAccent.clone().offsetHSL((i / n) * 0.12 - 0.06, 0.05, 0.05);
      colors.push(c);
    } else {
      // Cryo-EM SSS gradient
      const c = new THREE.Color('#38bdf8').lerp(baseAccent, 0.35 + (i / n) * 0.55);
      colors.push(c);
    }
  }

  // Smooth Cα backbone ribbon tube
  const curve = new THREE.CatmullRomCurve3(points);
  const tubularSegments = Math.min(480, Math.max(64, n * 2));
  const tubeGeo = new THREE.TubeGeometry(curve, tubularSegments, 0.024, 7, false);

  // Apply vertex colors along the backbone tube
  const posAttr = tubeGeo.attributes.position;
  const vCount = posAttr.count;
  const vColors = new Float32Array(vCount * 3);
  const ringVerts = 8; // radialSegments + 1
  for (let i = 0; i < vCount; i++) {
    const segIdx = Math.min(tubularSegments, Math.floor(i / ringVerts));
    const atomIdx = Math.min(n - 1, Math.floor((segIdx / tubularSegments) * (n - 1)));
    const c = colors[atomIdx];
    vColors[i * 3] = c.r;
    vColors[i * 3 + 1] = c.g;
    vColors[i * 3 + 2] = c.b;
  }
  tubeGeo.setAttribute('color', new THREE.BufferAttribute(vColors, 3));

  const tubeMat =
    colorMode === 'goodsell'
      ? new THREE.MeshToonMaterial({ vertexColors: true })
      : new THREE.MeshPhysicalMaterial({
          vertexColors: true,
          roughness: 0.25,
          metalness: 0.08,
          clearcoat: 0.65,
          clearcoatRoughness: 0.2,
        });

  const backbone = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(backbone);

  // Instanced Cα residue nodes (only render every 1-2 residues for crisp atomic feel)
  const sphereGeo = new THREE.SphereGeometry(0.032, 8, 8);
  const sphereMat = new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 0.1,
  });
  const inst = new THREE.InstancedMesh(sphereGeo, sphereMat, n);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    dummy.position.copy(points[i]);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
    inst.setColorAt(i, colors[i]);
  }
  inst.instanceMatrix.needsUpdate = true;
  if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  group.add(inst);

  return group;
}
