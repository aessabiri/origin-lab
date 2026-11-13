import * as THREE from 'three';

/**
 * High-Definition 3D Organelle & Molecular Ultrastructure Factory
 *
 * Uses Physically Based Rendering (PBR) Subsurface Scattering approximations
 * (transmission, thickness, IOR 1.38, clearcoat, internal emissive ultrastructures)
 * inspired by Allen Cell Explorer, Mol*, and cellPACK.
 */

const BASE_PAIR_COLORS = [
  [0x38bdf8, 0xf43f5e], // Adenine (Cyan) - Thymine (Rose)
  [0x10b981, 0xf59e0b], // Guanine (Emerald) - Cytosine (Amber)
];

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
    // B-DNA major/minor groove offset (~2.4 radians instead of PI)
    const x2 = Math.cos(angle + 2.45) * radius;
    const z2 = Math.sin(angle + 2.45) * radius;

    const p1 = new THREE.Vector3(x1, y, z1);
    const p2 = new THREE.Vector3(x2, y, z2);
    strand1Points.push(p1);
    strand2Points.push(p2);

    const [colorA, colorB] = BASE_PAIR_COLORS[i % 2];
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

    // Half-rung 1 (p1 -> mid)
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

    // Half-rung 2 (mid -> p2)
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

    // Phosphate backbone nodes
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

  // Smooth sugar-phosphate backbone tubes
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

/**
 * High-Definition Cell Nucleus with Double Nuclear Envelope, 14 Octagonal Nuclear Pore
 * Complexes (NPCs), glowing Nucleolus, and helical B-DNA chromatin inside.
 */
export function createHDNucleus() {
  const group = new THREE.Group();

  // 1. Translucent Subsurface-Scattered Nuclear Envelope
  const envGeo = new THREE.SphereGeometry(0.68, 40, 40);
  const envMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    emissive: 0x0c4a6e,
    emissiveIntensity: 0.25,
    transmission: 0.72,
    transparent: true,
    opacity: 0.58,
    roughness: 0.15,
    ior: 1.38,
    clearcoat: 1.0,
    side: THREE.DoubleSide
  });
  group.add(new THREE.Mesh(envGeo, envMat));

  // 2. Dense Inner Nucleolus Core
  const nucleolus = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85,
      roughness: 0.3
    })
  );
  nucleolus.position.set(0.08, 0.05, 0.05);
  group.add(nucleolus);

  // 3. Internal B-DNA Double Helix Chromatin
  const dna = createBDNADoubleHelix({ basePairs: 16, radius: 0.16, height: 0.85, turns: 1.8 });
  dna.rotation.z = Math.PI / 5;
  group.add(dna);

  // 4. 14 Nuclear Pore Complexes (Octagonal NPC Rings on the nuclear surface)
  const npcGeo = new THREE.TorusGeometry(0.075, 0.02, 8, 8);
  const npcMat = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    emissive: 0x0369a1,
    emissiveIntensity: 0.5,
    metalness: 0.4,
    roughness: 0.25
  });

  // Fibonacci sphere distribution for NPCs
  const numPores = 14;
  for (let i = 0; i < numPores; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / numPores);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const pos = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    ).multiplyScalar(0.68);

    const pore = new THREE.Mesh(npcGeo, npcMat);
    pore.position.copy(pos);
    pore.lookAt(pos.clone().multiplyScalar(2));
    group.add(pore);
  }

  return group;
}

/**
 * High-Definition Mitochondrion with translucent outer membrane, folded inner Cristae
 * lamellae baffles, and glowing F0F1 ATP Synthase complexes.
 */
export function createHDMitochondrion() {
  const group = new THREE.Group();

  // 1. Outer Mitochondrial Membrane (Translucent Capsule)
  const outerGeo = new THREE.CapsuleGeometry(0.24, 0.44, 16, 32);
  const outerMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    emissive: 0x78350f,
    emissiveIntensity: 0.25,
    transmission: 0.72,
    transparent: true,
    opacity: 0.55,
    roughness: 0.15,
    clearcoat: 1.0,
    side: THREE.DoubleSide
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  outerMesh.rotation.z = Math.PI / 2;
  group.add(outerMesh);

  // 2. Folded Inner Cristae Lamellae Baffles + ATP Synthase Studs
  const cristaMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.65,
    roughness: 0.25
  });
  const atpMat = new THREE.MeshStandardMaterial({
    color: 0xFEF08A,
    emissive: 0xFACC15,
    emissiveIntensity: 1.2
  });
  const atpGeo = new THREE.SphereGeometry(0.022, 8, 8);

  for (let i = -3; i <= 3; i++) {
    const x = i * 0.085;
    const radiusAtX = 0.18 * (1 - Math.abs(i) * 0.08);
    const crista = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusAtX, radiusAtX, 0.022, 20),
      cristaMat
    );
    crista.rotation.z = Math.PI / 2;
    crista.position.set(x, (i % 2 === 0 ? 1 : -1) * 0.02, 0);
    group.add(crista);

    // ATP Synthase rotor studs on cristae
    const stud = new THREE.Mesh(atpGeo, atpMat);
    stud.position.set(x, radiusAtX * 0.75, 0);
    group.add(stud);
  }

  return group;
}

/**
 * High-Definition 80S Ribosome with 60S Large Subunit, 40S Small Subunit,
 * threaded mRNA codon strand, and nascent polypeptide bead chain emerging from the exit tunnel.
 */
export function createHD80SRibosome(nascentCount = 7) {
  const group = new THREE.Group();

  // 60S Large Subunit (Bioluminescent Cyan-Teal)
  const large60S = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x155e75,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      clearcoat: 0.8
    })
  );
  large60S.scale.set(1.25, 0.92, 1.05);
  large60S.position.set(0, 0.11, 0);
  group.add(large60S);

  // 40S Small Subunit
  const small40S = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      clearcoat: 0.8
    })
  );
  small40S.scale.set(1.3, 0.65, 0.9);
  small40S.position.set(0, -0.13, 0.03);
  group.add(small40S);

  // Threaded mRNA Strand passing through the 40S/60S cleft
  const mrnaPoints = [
    new THREE.Vector3(-0.48, -0.02, 0.08),
    new THREE.Vector3(-0.2, -0.02, 0.04),
    new THREE.Vector3(0, -0.02, 0.02),
    new THREE.Vector3(0.22, -0.02, 0.05),
    new THREE.Vector3(0.48, -0.05, 0.1)
  ];
  const mrnaCurve = new THREE.CatmullRomCurve3(mrnaPoints);
  const mrnaTube = new THREE.Mesh(
    new THREE.TubeGeometry(mrnaCurve, 32, 0.018, 8, false),
    new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.8
    })
  );
  group.add(mrnaTube);

  // Emerging Nascent Polypeptide Chain from the 60S Exit Tunnel
  const beadGeo = new THREE.SphereGeometry(0.038, 12, 12);
  for (let i = 0; i < nascentCount; i++) {
    const bead = new THREE.Mesh(
      beadGeo,
      new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xfbbf24 : 0x38bdf8,
        emissive: i % 2 === 0 ? 0xd97706 : 0x0284c7,
        emissiveIntensity: 0.75
      })
    );
    bead.position.set(
      Math.sin(i * 0.75) * 0.11,
      0.28 + i * 0.065,
      Math.cos(i * 0.75) * 0.11
    );
    group.add(bead);
  }

  return group;
}

/**
 * High-Definition Chloroplast with translucent double plastid envelope,
 * 3 stacked Thylakoid Grana columns, and Stroma Lamellae bridges.
 */
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

  // 3 Grana stacks, each with 4 stacked thylakoid discs
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

  // Stroma Lamellae bridge connecting the 3 Grana stacks
  const bridge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.34, 8),
    thylakoidMat
  );
  bridge.rotation.z = Math.PI / 2;
  group.add(bridge);

  return group;
}
