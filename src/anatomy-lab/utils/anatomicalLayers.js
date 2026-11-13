import * as THREE from 'three';

/**
 * Procedural Micro-Bone & Synaptic Particle Supplements for the Z-Anatomy HD Atlas
 * - Generates the 7 micro-bones (Hyoid + 6 Middle-Ear Auditory Ossicles) that are sub-millimeter in CT scans
 * - Generates the glowing 240-particle Synaptic Action-Potential Cloud overlaid on nervous.glb
 */

export function createProceduralMicroBones(materials) {
  const group = new THREE.Group();
  group.name = 'ProceduralMicroBones';
  const meshes = [];

  // 1. Hyoid Bone (Horseshoe U-shaped bone at anterior neck C3 level, Y = 1.47m)
  const hyoidGeo = new THREE.TorusGeometry(0.016, 0.0032, 12, 24, Math.PI * 1.15);
  const hyoidMesh = new THREE.Mesh(hyoidGeo, materials.corticalBone);
  hyoidMesh.name = 'hyoid_bone';
  hyoidMesh.userData.boneId = 'hyoid_bone';
  hyoidMesh.rotation.x = Math.PI / 2;
  hyoidMesh.rotation.z = -Math.PI * 0.075;
  hyoidMesh.position.set(0, 1.47, 0.032);
  group.add(hyoidMesh);
  meshes.push(hyoidMesh);

  // 2. Auditory Ossicles (Malleus, Incus, Stapes - Left & Right middle ear inside temporal bone, Y = 1.59m)
  const ossicleDefs = [
    { id: 'malleus_r', pos: [-0.055, 1.592, 0.005], r: 0.0028 },
    { id: 'incus_r', pos: [-0.052, 1.594, 0.002], r: 0.0026 },
    { id: 'stapes_r', pos: [-0.049, 1.592, 0.000], r: 0.0022 },
    { id: 'malleus_l', pos: [0.055, 1.592, 0.005], r: 0.0028 },
    { id: 'incus_l', pos: [0.052, 1.594, 0.002], r: 0.0026 },
    { id: 'stapes_l', pos: [0.049, 1.592, 0.000], r: 0.0022 },
  ];

  ossicleDefs.forEach((def) => {
    const geo = new THREE.OctahedronGeometry(def.r, 2);
    const mesh = new THREE.Mesh(geo, materials.corticalBone);
    mesh.name = def.id;
    mesh.userData.boneId = def.id;
    mesh.position.set(...def.pos);
    group.add(mesh);
    meshes.push(mesh);
  });

  return { group, meshes };
}

export function createSynapticParticleCloud() {
  const particleCount = 240;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const isBrain = i < 150;
    if (isBrain) {
      const u = ((i * 73) % 100) / 100;
      const v = ((i * 37) % 100) / 100;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const r = 0.042;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 1.615 + r * Math.cos(phi) * 0.78;
      positions[i * 3 + 2] = 0.005 + r * Math.sin(phi) * Math.sin(theta);
    } else {
      const frac = (i - 150) / 90;
      positions[i * 3] = Math.sin(i * 2.4) * 0.015;
      positions[i * 3 + 1] = 0.96 + frac * 0.60;
      positions[i * 3 + 2] = -0.022 + Math.cos(i * 1.7) * 0.006;
    }
  }
  const synGeo = new THREE.BufferGeometry();
  synGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const synMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.009,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const synPoints = new THREE.Points(synGeo, synMat);
  synPoints.name = 'SynapticActionPotentials';
  return synPoints;
}
