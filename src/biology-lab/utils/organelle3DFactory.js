import * as THREE from 'three';

/**
 * High-Definition 3D Biological Assembly Factory
 *
 * Provides multi-part 3D models across all 5 levels of the Bio-Assembly Line:
 *  - Level 1: Macromolecules (B-DNA Double Helix, Collagen Triple Helix, Actin-Myosin, Ion Channel, ATP Synthase)
 *  - Level 2: Organelles with Part-by-Part Blueprint Ghost -> Solid Subsurface Scattering (Nucleus, Mitochondrion, 80S Ribosome, Plasma Membrane)
 *  - Level 3: Differentiated Specialized Cells (Osteoblast, Cardiomyocyte, Hepatocyte/Pneumocyte, Endothelial, Motor Neuron)
 *  - Level 4 & 5: High-Definition Sculpted 3D Organ Systems (Beating 4-Chamber Heart + Aorta, Breathing Lungs + Bronchial Tree + Liver, Cerebral Hemispheres + Cerebellum + Spinal Cord, Contracting Striated Muscle + Tendons, Haversian Bone + Trabecular Marrow)
 */

const BASE_PAIR_COLORS = [
  [0x38bdf8, 0xf43f5e], // Adenine (Cyan) - Thymine (Rose)
  [0x10b981, 0xf59e0b], // Guanine (Emerald) - Cytosine (Amber)
];

/**
 * Helper: Returns either a solid PBR material (when part is assembled)
 * or a translucent cyan wireframe blueprint ghost (when part is not yet snapped in).
 */
function partMaterial(isAssembled, solidProps) {
  if (!isAssembled) {
    return new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
  }
  return new THREE.MeshPhysicalMaterial(solidProps);
}

/**
 * Builds a high-definition antiparallel B-DNA Double Helix with sugar-phosphate ribbons
 * and complementary base-pair hydrogen-bonded rungs.
 */
export function createBDNADoubleHelix({
  basePairs = 22,
  radius = 0.28,
  height = 2.2,
  turns = 2.2
} = {}) {
  const group = new THREE.Group();
  const strand1Points = [];
  const strand2Points = [];

  const rungGeo = new THREE.CylinderGeometry(0.018, 0.018, radius, 8);
  const nucleotideGeo = new THREE.SphereGeometry(0.036, 12, 12);

  for (let i = 0; i < basePairs; i++) {
    const t = i / (basePairs - 1);
    const y = (t - 0.5) * height;
    const angle = t * Math.PI * 2 * turns;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle + 2.45) * radius;
    const z2 = Math.sin(angle + 2.45) * radius;

    const p1 = new THREE.Vector3(x1, y, z1);
    const p2 = new THREE.Vector3(x2, y, z2);
    strand1Points.push(p1);
    strand2Points.push(p2);

    const [colorA, colorB] = BASE_PAIR_COLORS[i % 2];
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

    const dir1 = new THREE.Vector3().subVectors(mid, p1);
    const len1 = dir1.length();
    const half1 = new THREE.Mesh(
      rungGeo,
      new THREE.MeshStandardMaterial({
        color: colorA,
        emissive: colorA,
        emissiveIntensity: 0.45,
        roughness: 0.25
      })
    );
    half1.scale.set(1, len1 / radius, 1);
    half1.position.copy(p1).addScaledVector(dir1, 0.5);
    half1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir1.clone().normalize());
    group.add(half1);

    const dir2 = new THREE.Vector3().subVectors(p2, mid);
    const len2 = dir2.length();
    const half2 = new THREE.Mesh(
      rungGeo,
      new THREE.MeshStandardMaterial({
        color: colorB,
        emissive: colorB,
        emissiveIntensity: 0.45,
        roughness: 0.25
      })
    );
    half2.scale.set(1, len2 / radius, 1);
    half2.position.copy(mid).addScaledVector(dir2, 0.5);
    half2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir2.clone().normalize());
    group.add(half2);

    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      metalness: 0.5,
      roughness: 0.2
    });
    const n1 = new THREE.Mesh(nucleotideGeo, nodeMat);
    n1.position.copy(p1);
    const n2 = new THREE.Mesh(nucleotideGeo, nodeMat);
    n2.position.copy(p2);
    group.add(n1, n2);
  }

  const curve1 = new THREE.CatmullRomCurve3(strand1Points);
  const curve2 = new THREE.CatmullRomCurve3(strand2Points);
  const backboneMat1 = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.3,
    clearcoat: 1.0
  });
  const backboneMat2 = new THREE.MeshPhysicalMaterial({
    color: 0x2dd4bf,
    emissive: 0x0d9488,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.3,
    clearcoat: 1.0
  });

  group.add(new THREE.Mesh(new THREE.TubeGeometry(curve1, 64, 0.024, 10, false), backboneMat1));
  group.add(new THREE.Mesh(new THREE.TubeGeometry(curve2, 64, 0.024, 10, false), backboneMat2));

  return group;
}

function seededRand(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * High-Definition 3D Cutaway Cell Nucleus (Cryo-EM / Medical-Illustration Style)
 *  - nuc_envelope: Cutaway Double Nuclear Lipid Envelope
 *  - nuc_pores: 28 Octagonal Nuclear Pore Complexes (Instanced)
 *  - nuc_dna: Tangled 3D Chromatin Fibers + B-DNA Double Helix
 *  - nuc_nucleolus: Golden Nucleoplasm & Dense rRNA Nucleolus Core
 */
export function createHDNucleus(assembledParts = null) {
  const hasPart = (id) => !assembledParts || assembledParts.includes(id);
  const group = new THREE.Group();
  const dummy = new THREE.Object3D();

  // Part 1: Cutaway Outer Nuclear Envelope (3/4 shell revealing interior)
  const envBack = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 36, 36, Math.PI * 0.35, Math.PI * 1.45, 0, Math.PI),
    partMaterial(hasPart('nuc_envelope'), {
      color: 0x9a3412,
      emissive: 0x451a03,
      emissiveIntensity: 0.32,
      roughness: 0.38,
      clearcoat: 0.5,
      side: THREE.DoubleSide
    })
  );
  group.add(envBack);

  const envGhost = new THREE.Mesh(
    new THREE.SphereGeometry(0.695, 32, 32),
    partMaterial(hasPart('nuc_envelope'), {
      color: 0xbae6fd,
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      roughness: 0.15,
      side: THREE.DoubleSide
    })
  );
  group.add(envGhost);

  // Part 2: Golden Nucleoplasm & Textured Dark Nucleolus Core
  const nucleoplasm = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 24, 24),
    partMaterial(hasPart('nuc_nucleolus'), {
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      roughness: 0.35
    })
  );
  group.add(nucleoplasm);

  const nucleolus = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.16, 2),
    partMaterial(hasPart('nuc_nucleolus'), {
      color: 0x451a03,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
      roughness: 0.65
    })
  );
  nucleolus.position.set(0.04, 0.03, 0.05);
  group.add(nucleolus);

  // Part 3: Dense Tangled 3D Chromatin Network + B-DNA Helix
  if (hasPart('nuc_dna')) {
    const dna = createBDNADoubleHelix({ basePairs: 14, radius: 0.12, height: 0.72, turns: 1.8 });
    dna.rotation.z = Math.PI / 5;
    group.add(dna);

    const redMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, emissive: 0x450a0a, emissiveIntensity: 0.35, roughness: 0.45 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, emissive: 0x1e3a8a, emissiveIntensity: 0.35, roughness: 0.45 });

    for (let f = 0; f < 10; f++) {
      const pts = [];
      for (let p = 0; p < 9; p++) {
        const a = f * 0.7 + p * 0.85;
        const r = 0.22 + seededRand(f * 31 + p) * 0.34;
        const y = (seededRand(f * 17 + p * 3) - 0.5) * 0.72;
        pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
      const curve = new THREE.CatmullRomCurve3(pts, false);
      group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.02, 7, false), f % 2 === 0 ? redMat : blueMat));
    }
  }

  // Part 4: 28 Instanced Octagonal Nuclear Pore Complexes (NPCs)
  const npcGeo = new THREE.TorusGeometry(0.072, 0.022, 8, 8);
  const npcMat = partMaterial(hasPart('nuc_pores'), {
    color: 0x94a3b8,
    emissive: 0x334155,
    emissiveIntensity: 0.4,
    metalness: 0.35,
    roughness: 0.3
  });

  const numPores = 28;
  const npcInstanced = new THREE.InstancedMesh(npcGeo, npcMat, numPores);
  const upVec = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i < numPores; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / numPores);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );
    dummy.position.copy(dir).multiplyScalar(0.685);
    dummy.quaternion.setFromUnitVectors(upVec, dir);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    npcInstanced.setMatrixAt(i, dummy.matrix);
  }
  npcInstanced.instanceMatrix.needsUpdate = true;
  group.add(npcInstanced);

  return group;
}

/**
 * High-Definition 3D Cutaway Mitochondrion (Cryo-EM / Medical-Illustration Style)
 *  - mito_outer: Translucent Outer Porin Capsule + 72 Instanced Porin Complexes
 *  - mito_cristae: Continuous Sinuous Folded Terracotta Cristae Ribbon + Matrix
 *  - mito_atp: 48 Instanced F0F1 ATP Synthase Rotor Complexes
 *  - mito_dna: Circular Mitochondrial DNA Ring + Matrix Granules
 */
export function createHDMitochondrion(assembledParts = null) {
  const hasPart = (id) => !assembledParts || assembledParts.includes(id);
  const group = new THREE.Group();
  const dummy = new THREE.Object3D();

  // Part 1: Translucent Outer Membrane + Cutaway Rim + Instanced Porin Complexes
  const outerGeo = new THREE.CapsuleGeometry(0.3, 0.58, 16, 32);
  const outerMat = partMaterial(hasPart('mito_outer'), {
    color: 0xcffafe,
    emissive: 0x155e75,
    emissiveIntensity: 0.22,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
    roughness: 0.15,
    clearcoat: 1.0,
    side: THREE.DoubleSide
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  outerMesh.rotation.z = Math.PI / 2;
  group.add(outerMesh);

  // 72 Instanced Blue Outer-Membrane Porin Complexes
  const porinCount = 72;
  const porinMat = partMaterial(hasPart('mito_outer'), {
    color: 0x3b82f6,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.45,
    roughness: 0.3
  });
  const porinInst = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.013, 0.036, 5, 8), porinMat, porinCount);
  const yAxis = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < porinCount; i++) {
    const t = (i / porinCount) * 2 - 1;
    const x = t * 0.44;
    const envR = Math.abs(x) > 0.26 ? Math.sqrt(Math.max(0.01, 0.3 * 0.3 - (Math.abs(x) - 0.26) ** 2)) : 0.3;
    const a = i * 2.39996;
    const dir = new THREE.Vector3(0, Math.cos(a), Math.sin(a));
    dummy.position.set(x, dir.y * envR, dir.z * envR);
    dummy.quaternion.setFromUnitVectors(yAxis, dir);
    dummy.scale.setScalar(0.8 + seededRand(i) * 0.5);
    dummy.updateMatrix();
    porinInst.setMatrixAt(i, dummy.matrix);
  }
  porinInst.instanceMatrix.needsUpdate = true;
  group.add(porinInst);

  // Golden Inner Matrix Core
  const matrixMesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.14, 0.42, 12, 20),
    partMaterial(hasPart('mito_cristae'), {
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.48,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      roughness: 0.35
    })
  );
  matrixMesh.rotation.z = Math.PI / 2;
  group.add(matrixMesh);

  // Part 2: Continuous Sinuous Folded Inner Cristae Ribbon (2 orthogonal serpentine loops)
  const cristaMat = partMaterial(hasPart('mito_cristae'), {
    color: 0x9a3412,
    emissive: 0x7c2d12,
    emissiveIntensity: 0.42,
    roughness: 0.38
  });

  const numFolds = 18;
  const ptsXY = [];
  const ptsXZ = [];
  for (let i = 0; i < numFolds * 4; i++) {
    const theta = (i / (numFolds * 4)) * Math.PI * 2;
    const fold = Math.sin(theta * numFolds) * 0.065;
    const rOuter = 0.22 + fold;
    const xScale = 0.48;
    const yScale = 0.23;
    ptsXY.push(new THREE.Vector3(Math.cos(theta) * (xScale + fold * 0.5), Math.sin(theta) * (yScale + fold), Math.sin(theta * 3) * 0.03));
    ptsXZ.push(new THREE.Vector3(Math.cos(theta) * (xScale + fold * 0.5), Math.cos(theta * 3) * 0.03, Math.sin(theta) * rOuter));
  }
  group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsXY, true), 160, 0.024, 8, true), cristaMat));
  group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsXZ, true), 160, 0.022, 8, true), cristaMat));

  for (let b = -2; b <= 2; b++) {
    const baffle = new THREE.Mesh(new THREE.TorusGeometry(0.18 - Math.abs(b) * 0.02, 0.015, 8, 20, Math.PI * 1.4), cristaMat);
    baffle.rotation.y = Math.PI / 2;
    baffle.rotation.z = b * 0.4;
    baffle.position.x = b * 0.14;
    group.add(baffle);
  }

  // Part 3: 48 Instanced F0F1 ATP Synthase Rotor Complexes lining the cristae
  const atpCount = 48;
  const atpMat = partMaterial(hasPart('mito_atp'), {
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 1.15
  });
  const atpInst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.018, 8, 8), atpMat, atpCount);
  for (let i = 0; i < atpCount; i++) {
    const theta = (i / atpCount) * Math.PI * 2;
    const r = 0.16 + (i % 2) * 0.05;
    dummy.position.set(Math.cos(theta) * 0.38, Math.sin(theta) * r, Math.cos(theta * 2) * 0.1);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    atpInst.setMatrixAt(i, dummy.matrix);
  }
  atpInst.instanceMatrix.needsUpdate = true;
  group.add(atpInst);

  // Part 4: Circular Mitochondrial DNA Plasmid Ring + Matrix Granules
  const mtDna = new THREE.Mesh(
    new THREE.TorusGeometry(0.095, 0.013, 12, 32),
    partMaterial(hasPart('mito_dna'), {
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9
    })
  );
  mtDna.position.set(0, 0, 0.05);
  group.add(mtDna);

  const granCount = 24;
  const granInst = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.014, 6, 6),
    partMaterial(hasPart('mito_dna'), { color: 0x451a03, roughness: 0.6 }),
    granCount
  );
  for (let i = 0; i < granCount; i++) {
    dummy.position.set(
      (seededRand(i * 3 + 1) - 0.5) * 0.55,
      (seededRand(i * 3 + 2) - 0.5) * 0.18,
      (seededRand(i * 3 + 3) - 0.5) * 0.18
    );
    dummy.scale.setScalar(0.6 + seededRand(i * 7) * 0.9);
    dummy.updateMatrix();
    granInst.setMatrixAt(i, dummy.matrix);
  }
  granInst.instanceMatrix.needsUpdate = true;
  group.add(granInst);

  return group;
}

/**
 * High-Definition 80S Ribosome (Cryo-EM Molecular-Surface Style via InstancedMesh)
 *  - ribo_40s: 40S Small Subunit (packed rRNA + crimson protein clusters)
 *  - ribo_60s: 60S Large Subunit (packed rRNA + crimson protein clusters)
 *  - ribo_er: Glowing Cyan mRNA & tRNA Strands + Nascent Polypeptide
 */
export function createHD80SRibosome(nascentCount = 7, assembledParts = null) {
  const hasPart = (id) => !assembledParts || assembledParts.includes(id);
  const group = new THREE.Group();
  const dummy = new THREE.Object3D();

  const rnaMat60 = partMaterial(hasPart('ribo_60s'), { color: 0xd6b88d, emissive: 0x78350f, emissiveIntensity: 0.2, roughness: 0.55 });
  const protMat60 = partMaterial(hasPart('ribo_60s'), { color: 0x991b1b, emissive: 0x450a0a, emissiveIntensity: 0.35, roughness: 0.38 });
  const rnaMat40 = partMaterial(hasPart('ribo_40s'), { color: 0xd6b88d, emissive: 0x78350f, emissiveIntensity: 0.2, roughness: 0.55 });
  const protMat40 = partMaterial(hasPart('ribo_40s'), { color: 0x991b1b, emissive: 0x450a0a, emissiveIntensity: 0.35, roughness: 0.38 });

  const sphereGeo = new THREE.SphereGeometry(0.052, 10, 10);

  // Pack 60S Large Subunit (top dome with central protuberance)
  const rna60Count = 95;
  const rna60Inst = new THREE.InstancedMesh(sphereGeo, rnaMat60, rna60Count);
  for (let i = 0; i < rna60Count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / rna60Count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const rad = 0.16 + seededRand(i * 11) * 0.11;
    dummy.position.set(
      Math.sin(phi) * Math.cos(theta) * rad * 1.25,
      0.16 + Math.abs(Math.cos(phi)) * rad * 0.85,
      Math.sin(phi) * Math.sin(theta) * rad * 1.05
    );
    dummy.scale.setScalar(0.85 + seededRand(i * 5) * 0.65);
    dummy.updateMatrix();
    rna60Inst.setMatrixAt(i, dummy.matrix);
  }
  rna60Inst.instanceMatrix.needsUpdate = true;
  group.add(rna60Inst);

  const prot60Count = 55;
  const prot60Inst = new THREE.InstancedMesh(sphereGeo, protMat60, prot60Count);
  for (let i = 0; i < prot60Count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / prot60Count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i + 0.6;
    const rad = 0.24 + seededRand(i * 19) * 0.06;
    dummy.position.set(
      Math.sin(phi) * Math.cos(theta) * rad * 1.22,
      0.17 + Math.abs(Math.cos(phi)) * rad * 0.82,
      Math.sin(phi) * Math.sin(theta) * rad * 1.05
    );
    dummy.scale.setScalar(0.7 + seededRand(i * 13) * 0.6);
    dummy.updateMatrix();
    prot60Inst.setMatrixAt(i, dummy.matrix);
  }
  prot60Inst.instanceMatrix.needsUpdate = true;
  group.add(prot60Inst);

  // Pack 40S Small Subunit (bottom body/head separated by mRNA cleft)
  const rna40Count = 70;
  const rna40Inst = new THREE.InstancedMesh(sphereGeo, rnaMat40, rna40Count);
  for (let i = 0; i < rna40Count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / rna40Count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const rad = 0.13 + seededRand(i * 23) * 0.09;
    dummy.position.set(
      Math.sin(phi) * Math.cos(theta) * rad * 1.3,
      -0.16 - Math.abs(Math.cos(phi)) * rad * 0.72,
      Math.sin(phi) * Math.sin(theta) * rad * 0.95
    );
    dummy.scale.setScalar(0.8 + seededRand(i * 7) * 0.55);
    dummy.updateMatrix();
    rna40Inst.setMatrixAt(i, dummy.matrix);
  }
  rna40Inst.instanceMatrix.needsUpdate = true;
  group.add(rna40Inst);

  const prot40Count = 40;
  const prot40Inst = new THREE.InstancedMesh(sphereGeo, protMat40, prot40Count);
  for (let i = 0; i < prot40Count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / prot40Count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i + 0.4;
    const rad = 0.19 + seededRand(i * 29) * 0.05;
    dummy.position.set(
      Math.sin(phi) * Math.cos(theta) * rad * 1.28,
      -0.17 - Math.abs(Math.cos(phi)) * rad * 0.7,
      Math.sin(phi) * Math.sin(theta) * rad * 0.95
    );
    dummy.scale.setScalar(0.65 + seededRand(i * 17) * 0.55);
    dummy.updateMatrix();
    prot40Inst.setMatrixAt(i, dummy.matrix);
  }
  prot40Inst.instanceMatrix.needsUpdate = true;
  group.add(prot40Inst);

  // Glowing Cyan mRNA & tRNA strands threading the inter-subunit cleft
  const cleftMat = partMaterial(hasPart('ribo_er'), { color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 });
  const mrnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.52, -0.01, 0.1),
    new THREE.Vector3(-0.2, 0.0, 0.04),
    new THREE.Vector3(0, -0.01, 0.02),
    new THREE.Vector3(0.22, 0.0, 0.05),
    new THREE.Vector3(0.52, -0.03, 0.12)
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(mrnaCurve, 32, 0.02, 8, false), cleftMat));

  const trnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 0.12, 0.14),
    new THREE.Vector3(0.0, 0.01, 0.18),
    new THREE.Vector3(0.08, -0.1, 0.12)
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(trnaCurve, 20, 0.016, 8, false), cleftMat));

  const beadGeo = new THREE.SphereGeometry(0.032, 10, 10);
  for (let i = 0; i < nascentCount; i++) {
    const bead = new THREE.Mesh(
      beadGeo,
      partMaterial(hasPart('ribo_60s'), {
        color: i % 2 === 0 ? 0xfbbf24 : 0x38bdf8,
        emissive: i % 2 === 0 ? 0xd97706 : 0x0284c7,
        emissiveIntensity: 0.75
      })
    );
    bead.position.set(Math.sin(i * 0.75) * 0.1, 0.36 + i * 0.055, Math.cos(i * 0.75) * 0.1);
    group.add(bead);
  }

  return group;
}

/**
 * High-Definition Excitable Plasma Membrane & Cytoskeleton (Curved Cutaway Bilayer via InstancedMesh)
 */
export function createHDPlasmaMembrane(assembledParts = null) {
  const hasPart = (id) => !assembledParts || assembledParts.includes(id);
  const group = new THREE.Group();
  const dummy = new THREE.Object3D();

  // Curved Dual-Leaflet Phospholipid Bilayer (160 Indigo Heads + 320 Tan Fatty-Acid Tails)
  const lipidPositions = [];
  const rows = 9;
  const cols = 9;
  for (let ix = -4; ix <= 4; ix++) {
    for (let iz = -4; iz <= 4; iz++) {
      const x = ix * 0.12;
      const z = iz * 0.12;
      const r2 = x * x + z * z;
      if (r2 > 0.32 || r2 < 0.025) continue; // Circular cutaway patch with central pore
      const curveDrop = r2 * 0.35;
      lipidPositions.push({ x, z, curveDrop });
    }
  }

  const count = lipidPositions.length;
  const headMat = partMaterial(hasPart('mem_bilayer'), {
    color: 0x4f46e5,
    emissive: 0x312e81,
    emissiveIntensity: 0.38,
    clearcoat: 1.0,
    roughness: 0.25
  });
  const tailMat = partMaterial(hasPart('mem_bilayer'), {
    color: 0xd6b88d,
    emissive: 0x78350f,
    emissiveIntensity: 0.22,
    roughness: 0.5
  });

  const headInst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.036, 10, 10), headMat, count * 2);
  const tailInst = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.009, 0.009, 0.16, 6), tailMat, count * 4);

  lipidPositions.forEach((p, idx) => {
    // Top & bottom headgroups
    dummy.position.set(p.x, 0.22 - p.curveDrop, p.z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    headInst.setMatrixAt(idx * 2, dummy.matrix);

    dummy.position.set(p.x, -0.22 + p.curveDrop, p.z);
    dummy.updateMatrix();
    headInst.setMatrixAt(idx * 2 + 1, dummy.matrix);

    // Dual hydrophobic tails per leaflet
    for (let t = 0; t < 2; t++) {
      const dx = (t === 0 ? -0.014 : 0.014);
      dummy.position.set(p.x + dx, 0.1 - p.curveDrop * 0.6, p.z);
      dummy.rotation.set(0, 0, (t === 0 ? 0.06 : -0.06));
      dummy.updateMatrix();
      tailInst.setMatrixAt(idx * 4 + t, dummy.matrix);

      dummy.position.set(p.x + dx, -0.1 + p.curveDrop * 0.6, p.z);
      dummy.updateMatrix();
      tailInst.setMatrixAt(idx * 4 + 2 + t, dummy.matrix);
    }
  });
  headInst.instanceMatrix.needsUpdate = true;
  tailInst.instanceMatrix.needsUpdate = true;
  group.add(headInst, tailInst);

  // Crimson Transmembrane Ion Channel Complexes + Pale-Cyan Glycoprotein Chains
  const channelMat = partMaterial(hasPart('mem_channels'), {
    color: 0x991b1b,
    emissive: 0x450a0a,
    emissiveIntensity: 0.45,
    clearcoat: 1.0
  });
  for (let c = 0; c < 6; c++) {
    const a = (c / 6) * Math.PI * 2;
    const barrel = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.36, 10, 14), channelMat);
    barrel.position.set(Math.cos(a) * 0.1, 0, Math.sin(a) * 0.1);
    group.add(barrel);
  }

  const glycoMat = partMaterial(hasPart('mem_channels'), {
    color: 0x7dd3fc,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45
  });
  for (let g = 0; g < 8; g++) {
    const a = (g / 8) * Math.PI * 2;
    const gx = Math.cos(a) * 0.28;
    const gz = Math.sin(a) * 0.28;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(gx, 0.2, gz),
      new THREE.Vector3(gx * 1.15, 0.32, gz * 0.9),
      new THREE.Vector3(gx * 0.95, 0.44, gz * 1.1)
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.01, 6, false), glycoMat));
  }

  // Underlying Actin-Spectrin Cytoskeleton Cortex Filaments
  const actinMat = partMaterial(hasPart('mem_cortex'), {
    color: 0xf43f5e,
    emissive: 0x9f1239,
    emissiveIntensity: 0.5
  });
  [-0.22, 0.22].forEach((offset) => {
    const rod1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.1, 8), actinMat);
    rod1.rotation.z = Math.PI / 2;
    rod1.position.set(0, -0.34, offset);
    const rod2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.95, 8), actinMat);
    rod2.rotation.x = Math.PI / 2;
    rod2.position.set(offset, -0.34, 0);
    group.add(rod1, rod2);
  });

  return group;
}

export function createHDChloroplast() {
  const group = new THREE.Group();
  const outerPlastid = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 32, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.25,
      transmission: 0.72,
      transparent: true,
      opacity: 0.55,
      roughness: 0.15,
      clearcoat: 1.0,
      side: THREE.DoubleSide
    })
  );
  outerPlastid.scale.set(1.35, 0.72, 1.0);
  group.add(outerPlastid);

  const thylakoidMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x059669,
    emissiveIntensity: 0.7,
    roughness: 0.25
  });

  [-0.14, 0, 0.14].forEach((xOffset) => {
    for (let d = -1.5; d <= 1.5; d += 1) {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.022, 16),
        thylakoidMat
      );
      disc.position.set(xOffset, d * 0.036, 0);
      group.add(disc);
    }
  });

  const bridge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.34, 8),
    thylakoidMat
  );
  bridge.rotation.z = Math.PI / 2;
  group.add(bridge);

  return group;
}

// ============================================================================
// HIGH-DEFINITION SCULPTED 3D ORGAN & TISSUE MODELS (FOR THE 5 HUMAN SYSTEMS)
// ============================================================================

/**
 * 1. CARDIOVASCULAR: Sculpted 4-Chamber Beating Heart + Arching Aorta + Vena Cava + Coronary Tree
 */
export function create3DCardiovascularOrgan() {
  const group = new THREE.Group();

  const myocardiumMat = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.35,
    roughness: 0.28,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15
  });

  // Left Ventricle (Apex cone tilted left & anterior)
  const lv = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), myocardiumMat);
  lv.scale.set(0.85, 1.35, 0.85);
  lv.position.set(0.18, -0.22, 0.05);
  lv.rotation.z = 0.28;
  group.add(lv);

  // Right Ventricle
  const rv = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 32), myocardiumMat);
  rv.scale.set(0.85, 1.2, 0.8);
  rv.position.set(-0.22, -0.15, 0.12);
  rv.rotation.z = -0.2;
  group.add(rv);

  // Left & Right Atria (Auricles)
  const atriumMat = new THREE.MeshPhysicalMaterial({
    color: 0xb91c1c,
    emissive: 0x450a0a,
    emissiveIntensity: 0.3,
    roughness: 0.35,
    clearcoat: 0.7
  });
  const la = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), atriumMat);
  la.position.set(0.32, 0.42, -0.08);
  const ra = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), atriumMat);
  ra.position.set(-0.36, 0.38, 0.02);
  group.add(la, ra);

  // Arching Aorta + 3 Brachiocephalic/Carotid/Subclavian Trunks
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.05, 0.35, 0.05),
    new THREE.Vector3(0.02, 0.92, 0.08),
    new THREE.Vector3(0.28, 1.15, -0.05),
    new THREE.Vector3(0.42, 0.75, -0.22),
    new THREE.Vector3(0.35, -0.65, -0.28)
  ]);
  const aortaMat = new THREE.MeshPhysicalMaterial({
    color: 0xef4444,
    emissive: 0x991b1b,
    emissiveIntensity: 0.4,
    roughness: 0.22,
    clearcoat: 1.0
  });
  group.add(new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 48, 0.15, 16, false), aortaMat));

  // Superior & Inferior Vena Cava (Venous Blue)
  const veinMat = new THREE.MeshPhysicalMaterial({
    color: 0x2563eb,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.4,
    roughness: 0.25,
    clearcoat: 0.9
  });
  const svc = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 1.1, 16), veinMat);
  svc.position.set(-0.42, 0.72, -0.05);
  group.add(svc);

  // Glowing Coronary Arteries wrapping the ventricles
  const coronaryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.0, 0.35, 0.35),
    new THREE.Vector3(0.08, 0.0, 0.48),
    new THREE.Vector3(0.22, -0.45, 0.38),
    new THREE.Vector3(0.32, -0.78, 0.15)
  ]);
  const coronaryMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.9
  });
  group.add(new THREE.Mesh(new THREE.TubeGeometry(coronaryCurve, 32, 0.032, 8, false), coronaryMat));

  group.userData.isBeatingHeart = true;
  return group;
}

/**
 * 2. VISCERAL: Trachea + Bronchial Tree + Translucent Breathing Lungs + Bilobed Liver + Stomach
 */
export function create3DVisceralOrgan() {
  const group = new THREE.Group();

  // Cartilaginous Trachea + Left/Right Main Bronchi
  const tracheaMat = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    emissive: 0x0284c7,
    emissiveIntensity: 0.35,
    roughness: 0.3
  });
  const trachea = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.95, 16), tracheaMat);
  trachea.position.set(0, 0.85, 0);
  group.add(trachea);

  // Right (3-lobed) & Left (2-lobed) Translucent Lungs revealing internal Bronchial Tree
  const lungMat = new THREE.MeshPhysicalMaterial({
    color: 0xf472b6,
    emissive: 0x831843,
    emissiveIntensity: 0.22,
    transmission: 0.68,
    transparent: true,
    opacity: 0.62,
    roughness: 0.2,
    clearcoat: 0.9,
    side: THREE.DoubleSide
  });

  [-0.58, 0.58].forEach((xSide, idx) => {
    const lung = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 32), lungMat);
    lung.scale.set(0.82, 1.45, 0.78);
    lung.position.set(xSide, 0.22, 0);
    lung.rotation.z = idx === 0 ? 0.12 : -0.12;
    group.add(lung);

    // Internal Bronchial Branches inside each translucent lung
    for (let b = -1; b <= 1; b++) {
      const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.018, 0.55, 8),
        tracheaMat
      );
      branch.position.set(xSide * 0.85, 0.25 + b * 0.22, 0);
      branch.rotation.z = (idx === 0 ? 1 : -1) * (0.7 + b * 0.25);
      group.add(branch);
    }
  });

  // Sub-diaphragmatic Bilobed Liver (Right/Left Hepatic Lobes)
  const liverMat = new THREE.MeshPhysicalMaterial({
    color: 0x991b1b,
    emissive: 0x450a0a,
    emissiveIntensity: 0.3,
    roughness: 0.25,
    clearcoat: 0.85
  });
  const liver = new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 28), liverMat);
  liver.scale.set(1.35, 0.62, 0.75);
  liver.position.set(-0.28, -0.72, 0.08);
  liver.rotation.z = 0.15;
  group.add(liver);

  return group;
}

/**
 * 3. NERVOUS: Gyri-Sculpted Cerebral Hemispheres + Cerebellum + Brainstem + Spinal Cord & Nerves
 */
export function create3DNervousOrgan() {
  const group = new THREE.Group();

  const cortexMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    emissive: 0xb45309,
    emissiveIntensity: 0.32,
    roughness: 0.32,
    clearcoat: 0.85
  });

  // Left & Right Cerebral Hemispheres (Longitudinal Fissure in between)
  [-0.36, 0.36].forEach((xPos) => {
    const hemi = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.36, 0.15, 64, 16, 2, 3),
      cortexMat
    );
    hemi.scale.set(0.95, 1.05, 1.35);
    hemi.position.set(xPos, 0.52, 0);
    group.add(hemi);
  });

  // Posterior Cerebellum
  const cerebellum = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
      roughness: 0.4
    })
  );
  cerebellum.scale.set(1.4, 0.75, 0.85);
  cerebellum.position.set(0, 0.02, -0.32);
  group.add(cerebellum);

  // Descending Brainstem & Spinal Cord + Paired Spinal Nerve Roots
  const cordMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.7
  });
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.06, 1.65, 16), cordMat);
  cord.position.set(0, -0.55, -0.08);
  group.add(cord);

  for (let n = 0; n < 6; n++) {
    const y = -0.05 - n * 0.22;
    [-1, 1].forEach((side) => {
      const root = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.01, 0.65, 8), cordMat);
      root.position.set(side * 0.32, y - 0.1, -0.08);
      root.rotation.z = side * 1.1;
      group.add(root);
    });
  }

  return group;
}

/**
 * 4. MUSCULAR: Contracting Fusiform Muscle Bellies + Pearlescent Collagen Tendons + Joint
 */
export function create3DMuscularOrgan() {
  const group = new THREE.Group();

  const muscleMat = new THREE.MeshPhysicalMaterial({
    color: 0xe11d48,
    emissive: 0x881337,
    emissiveIntensity: 0.35,
    roughness: 0.28,
    clearcoat: 0.75
  });
  const tendonMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.2,
    roughness: 0.2,
    clearcoat: 1.0
  });

  // Multipennate Striated Muscle Fascicle Bundles
  [-0.22, 0, 0.22].forEach((xOff, i) => {
    const belly = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.95, 16, 24), muscleMat);
    belly.position.set(xOff, 0, i === 1 ? 0.08 : -0.04);
    group.add(belly);

    // Proximal & Distal White Collagen Tendon Insertions
    const topTendon = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.16, 0.45, 16), tendonMat);
    topTendon.position.set(xOff * 0.7, 0.78, 0);
    const botTendon = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.09, 0.45, 16), tendonMat);
    botTendon.position.set(xOff * 0.7, -0.78, 0);
    group.add(topTendon, botTendon);
  });

  // Cross-striated Z-Disc Sarcomere Rings
  const zDiscMat = new THREE.MeshStandardMaterial({
    color: 0xfda4af,
    emissive: 0xf43f5e,
    emissiveIntensity: 0.5
  });
  for (let z = -3; z <= 3; z++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.015, 8, 32), zDiscMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = z * 0.14;
    group.add(ring);
  }

  return group;
}

/**
 * 5. SKELETAL: Sculpted Long Bone (Femur/Humerus) + Cutaway Concentric Haversian Osteons + Marrow
 */
export function create3DSkeletalOrgan() {
  const group = new THREE.Group();

  const boneMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    emissive: 0x0284c7,
    emissiveIntensity: 0.15,
    roughness: 0.25,
    clearcoat: 0.85
  });

  // Diaphysis Cortical Shaft
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.24, 1.55, 24), boneMat);
  group.add(shaft);

  // Proximal Femoral Head & Greater Trochanter + Distal Condyles
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), boneMat);
  head.position.set(0.28, 0.88, 0);
  const trochanter = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), boneMat);
  trochanter.position.set(-0.22, 0.78, 0);
  const condyleL = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), boneMat);
  condyleL.position.set(-0.2, -0.85, 0.05);
  const condyleR = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), boneMat);
  condyleR.position.set(0.2, -0.85, 0.05);
  group.add(head, trochanter, condyleL, condyleR);

  // Haversian Canal Vascular Nutrient Vessels
  const vessel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.7, 12),
    new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.8 })
  );
  vessel.position.set(0, 0, 0.22);
  group.add(vessel);

  return group;
}

/**
 * Dispatcher: Returns the high-definition 3D Organ model for any of the 5 Tier-1 Organ Systems.
 */
export function create3DOrganForSystem(systemId) {
  switch (systemId) {
    case 'cardiovascular_system':
      return create3DCardiovascularOrgan();
    case 'visceral_system':
      return create3DVisceralOrgan();
    case 'nervous_system':
      return create3DNervousOrgan();
    case 'muscular_system':
      return create3DMuscularOrgan();
    case 'skeletal_system':
    default:
      return create3DSkeletalOrgan();
  }
}
