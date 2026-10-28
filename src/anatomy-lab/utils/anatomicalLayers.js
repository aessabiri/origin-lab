import * as THREE from 'three';

/**
 * Procedural High-Fidelity Anatomical Layers Generator
 * Constructs Articular Cartilage/Ligaments, Pulsatile Vascular Loop, Neural Connectome,
 * and Middle-Ear Ossicle / Hyoid micro-scaffolds.
 */

export function createProceduralMicroBones(materials) {
  const group = new THREE.Group();
  group.name = 'ProceduralMicroBones';
  const meshes = [];

  // 1. Hyoid Bone (floating at neck level C3, anterior)
  const hyoidGeo = new THREE.TorusGeometry(0.022, 0.005, 8, 16, Math.PI * 0.85);
  const hyoidMesh = new THREE.Mesh(hyoidGeo, materials.corticalBone);
  hyoidMesh.name = 'hyoid_bone';
  hyoidMesh.position.set(0, 1.42, 0.045);
  hyoidMesh.rotation.set(0.2, 0, 0);
  group.add(hyoidMesh);
  meshes.push(hyoidMesh);

  // 2. Auditory Ossicles (Malleus, Incus, Stapes) left & right
  [-1, 1].forEach((side) => {
    const sideSuffix = side === -1 ? '_l' : '_r';
    const xBase = side * 0.065;
    const yBase = 1.58;
    const zBase = -0.01;

    // Malleus (Hammer)
    const malleusGeo = new THREE.CylinderGeometry(0.0015, 0.003, 0.008, 6);
    const malleusMesh = new THREE.Mesh(malleusGeo, materials.corticalBone);
    malleusMesh.name = `malleus${sideSuffix}`;
    malleusMesh.position.set(xBase, yBase, zBase);
    group.add(malleusMesh);
    meshes.push(malleusMesh);

    // Incus (Anvil)
    const incusGeo = new THREE.BoxGeometry(0.004, 0.005, 0.003);
    const incusMesh = new THREE.Mesh(incusGeo, materials.corticalBone);
    incusMesh.name = `incus${sideSuffix}`;
    incusMesh.position.set(xBase + side * 0.003, yBase - 0.002, zBase);
    group.add(incusMesh);
    meshes.push(incusMesh);

    // Stapes (Stirrup)
    const stapesGeo = new THREE.TorusGeometry(0.0025, 0.0008, 6, 8);
    const stapesMesh = new THREE.Mesh(stapesGeo, materials.corticalBone);
    stapesMesh.name = `stapes${sideSuffix}`;
    stapesMesh.position.set(xBase + side * 0.005, yBase - 0.003, zBase);
    group.add(stapesMesh);
    meshes.push(stapesMesh);
  });

  return { group, meshes };
}

/**
 * Articular Cartilage & Ligaments Layer
 */
export function createCartilageAndLigamentsLayer(materials) {
  const group = new THREE.Group();
  group.name = 'LayerLigamentsCartilage';

  const cartMat = materials.hyalineCartilage;
  const ligMat = materials.ligamentFascia;

  // 1. Intervertebral Discs along spine (Lumbar & Thoracic)
  for (let i = 0; i < 5; i++) {
    const discGeo = new THREE.CylinderGeometry(0.026 - i * 0.001, 0.028 - i * 0.001, 0.009, 16);
    const disc = new THREE.Mesh(discGeo, cartMat);
    disc.position.set(0, 0.98 + i * 0.045, -0.01);
    group.add(disc);
  }
  for (let i = 0; i < 12; i++) {
    const discGeo = new THREE.CylinderGeometry(0.022, 0.024, 0.007, 16);
    const disc = new THREE.Mesh(discGeo, cartMat);
    disc.position.set(0, 1.22 + i * 0.025, -0.02);
    group.add(disc);
  }

  // 2. Knee Menisci & Patellar Ligament (Left & Right)
  [-1, 1].forEach((side) => {
    // Meniscus
    const menGeo = new THREE.TorusGeometry(0.028, 0.006, 8, 16, Math.PI * 0.95);
    const meniscus = new THREE.Mesh(menGeo, cartMat);
    meniscus.rotation.x = Math.PI / 2;
    meniscus.position.set(side * 0.09, 0.48, 0);
    group.add(meniscus);

    // Patellar Ligament
    const ligGeo = new THREE.CylinderGeometry(0.012, 0.01, 0.06, 8);
    const patellarLig = new THREE.Mesh(ligGeo, ligMat);
    patellarLig.position.set(side * 0.09, 0.45, 0.03);
    group.add(patellarLig);
  });

  // 3. Pubic Symphysis (Anterior pelvis)
  const symphysisGeo = new THREE.BoxGeometry(0.015, 0.035, 0.012);
  const symphysis = new THREE.Mesh(symphysisGeo, cartMat);
  symphysis.position.set(0, 0.88, 0.06);
  group.add(symphysis);

  return group;
}

/**
 * Pulsatile Vascular Loop (Cardiovascular Tree)
 */
export function createVascularLoopLayer(materials) {
  const group = new THREE.Group();
  group.name = 'LayerVascularLoop';

  const arteryMat = materials.arteryBlood;
  const veinMat = materials.veinBlood;

  // 1. Heart Cardiac Mass (4 chambers, positioned in mediastinum)
  const heartGeo = new THREE.DodecahedronGeometry(0.048, 1);
  const heartMesh = new THREE.Mesh(heartGeo, arteryMat);
  heartMesh.name = 'CardiacChamber';
  heartMesh.position.set(-0.015, 1.28, 0.03);
  heartMesh.rotation.set(0.2, 0.1, -0.2);
  group.add(heartMesh);

  // 2. Ascending Aorta & Arch
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.01, 1.30, 0.03),
    new THREE.Vector3(0.00, 1.34, 0.02),
    new THREE.Vector3(0.015, 1.36, 0.00),
    new THREE.Vector3(0.00, 1.33, -0.02),
    new THREE.Vector3(0.00, 1.05, -0.015),
  ]);
  const aortaGeo = new THREE.TubeGeometry(aortaCurve, 24, 0.012, 8, false);
  const aortaMesh = new THREE.Mesh(aortaGeo, arteryMat);
  group.add(aortaMesh);

  // 3. Common Carotid Arteries (L & R up to cranium)
  [-1, 1].forEach((side) => {
    const carotidCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.01, 1.35, 0.01),
      new THREE.Vector3(side * 0.025, 1.45, 0.01),
      new THREE.Vector3(side * 0.03, 1.55, 0.00),
    ]);
    const carotidGeo = new THREE.TubeGeometry(carotidCurve, 16, 0.005, 6, false);
    group.add(new THREE.Mesh(carotidGeo, arteryMat));
  });

  // 4. Subclavian / Brachial Arteries (Limbs)
  [-1, 1].forEach((side) => {
    const armArteryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.02, 1.35, 0.0),
      new THREE.Vector3(side * 0.15, 1.33, 0.0),
      new THREE.Vector3(side * 0.22, 1.15, 0.0),
      new THREE.Vector3(side * 0.25, 0.95, 0.01),
    ]);
    const armArteryGeo = new THREE.TubeGeometry(armArteryCurve, 20, 0.004, 6, false);
    group.add(new THREE.Mesh(armArteryGeo, arteryMat));
  });

  // 5. Iliac & Femoral Arteries (Lower Limbs)
  [-1, 1].forEach((side) => {
    const legArteryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 1.05, -0.015),
      new THREE.Vector3(side * 0.04, 0.92, 0.01),
      new THREE.Vector3(side * 0.075, 0.75, 0.02),
      new THREE.Vector3(side * 0.09, 0.48, 0.0),
      new THREE.Vector3(side * 0.09, 0.20, -0.01),
    ]);
    const legArteryGeo = new THREE.TubeGeometry(legArteryCurve, 24, 0.006, 6, false);
    group.add(new THREE.Mesh(legArteryGeo, arteryMat));
  });

  // 6. Inferior Vena Cava (Venous system in blue)
  const vclCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.018, 0.92, -0.01),
    new THREE.Vector3(0.018, 1.15, -0.01),
    new THREE.Vector3(0.015, 1.28, 0.02),
  ]);
  const vcGeo = new THREE.TubeGeometry(vclCurve, 16, 0.009, 8, false);
  group.add(new THREE.Mesh(vcGeo, veinMat));

  return { group, heartMesh };
}

/**
 * Neural Connectome Layer (Brain & Spinal Cord)
 */
export function createNeuralConnectomeLayer(materials) {
  const group = new THREE.Group();
  group.name = 'LayerNeuralConnectome';

  const nerveMat = materials.nerveMyelin;

  // 1. Cerebral Hemispheres (Bilateral brain mass inside cranium)
  [-1, 1].forEach((side) => {
    const cerebrumGeo = new THREE.SphereGeometry(0.052, 16, 16);
    cerebrumGeo.scale(0.85, 1.1, 1.25);
    const cerebrum = new THREE.Mesh(cerebrumGeo, nerveMat);
    cerebrum.position.set(side * 0.03, 1.62, 0.01);
    group.add(cerebrum);
  });

  // Cerebellum (Posterior-inferior)
  const cerebellumGeo = new THREE.SphereGeometry(0.032, 12, 12);
  cerebellumGeo.scale(1.4, 0.8, 0.9);
  const cerebellum = new THREE.Mesh(cerebellumGeo, nerveMat);
  cerebellum.position.set(0, 1.55, -0.04);
  group.add(cerebellum);

  // 2. Brainstem & Spinal Cord (Passing down through vertebral canal to L2)
  const cordCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.54, -0.02),
    new THREE.Vector3(0, 1.48, -0.02),
    new THREE.Vector3(0, 1.35, -0.025),
    new THREE.Vector3(0, 1.15, -0.025),
    new THREE.Vector3(0, 1.00, -0.018), // Conus medullaris at L1-L2
  ]);
  const cordGeo = new THREE.TubeGeometry(cordCurve, 24, 0.007, 8, false);
  const cordMesh = new THREE.Mesh(cordGeo, nerveMat);
  group.add(cordMesh);

  // 3. Cauda Equina & Sciatic Nerve Trunks (Radiating from L2 down into legs)
  [-1, 1].forEach((side) => {
    const sciaticCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.00, -0.018),
      new THREE.Vector3(side * 0.035, 0.92, -0.02),
      new THREE.Vector3(side * 0.065, 0.72, -0.03),
      new THREE.Vector3(side * 0.08, 0.48, -0.02),
    ]);
    const sciaticGeo = new THREE.TubeGeometry(sciaticCurve, 16, 0.004, 6, false);
    group.add(new THREE.Mesh(sciaticGeo, nerveMat));
  });

  // 4. Synaptic Action Potential Glowing Particles (Brain & Spinal column)
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    // 60% in brain, 40% in spinal cord
    if (i < 100) {
      const radius = 0.05 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 1.62 + radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = 0.01 + radius * Math.cos(phi);
    } else {
      const progress = (i - 100) / 80;
      positions[i * 3] = (Math.random() - 0.5) * 0.01;
      positions[i * 3 + 1] = 1.54 - progress * 0.54;
      positions[i * 3 + 2] = -0.02 + (Math.random() - 0.5) * 0.008;
    }
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const synMat = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.008,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const synPoints = new THREE.Points(particleGeo, synMat);
  group.add(synPoints);

  return { group, synPoints };
}
