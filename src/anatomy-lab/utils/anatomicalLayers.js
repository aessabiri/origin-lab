import * as THREE from 'three';

/**
 * High-Fidelity Anatomical Systems Generator
 * Constructs Micro-Ossicles, Multi-Chamber Cardiac Complex, Full Systemic Vascular Tree,
 * Gyri-Folded Neocortex & Brachial/Thoracic Connectome, and Upper-Body Articular Ligaments.
 * Designed to pair seamlessly with the 462-node LUMC clinical CT scan (lumc_lower_limb.glb).
 */

export function createProceduralMicroBones(materials) {
  const group = new THREE.Group();
  group.name = 'ProceduralMicroBones';
  const meshes = [];

  // 1. Hyoid Bone (U-shaped lingual bone at C3 anterior neck)
  const hyoidGeo = new THREE.TorusGeometry(0.019, 0.004, 10, 24, Math.PI * 0.9);
  const hyoidMesh = new THREE.Mesh(hyoidGeo, materials.corticalBone);
  hyoidMesh.name = 'hyoid_bone';
  hyoidMesh.position.set(0, 1.47, 0.042);
  hyoidMesh.rotation.set(Math.PI * 0.45, 0, Math.PI);
  group.add(hyoidMesh);
  meshes.push(hyoidMesh);

  // 2. Bilateral Auditory Ossicles (Malleus, Incus, Stapes) inside temporal petrous bone
  [-1, 1].forEach((side) => {
    const sideSuffix = side === -1 ? '_r' : '_l';
    const xBase = side * 0.058;
    const yBase = 1.595;
    const zBase = -0.008;

    const malleusGeo = new THREE.CylinderGeometry(0.0014, 0.0026, 0.0075, 8);
    const malleusMesh = new THREE.Mesh(malleusGeo, materials.corticalBone);
    malleusMesh.name = `malleus${sideSuffix}`;
    malleusMesh.position.set(xBase, yBase, zBase);
    group.add(malleusMesh);
    meshes.push(malleusMesh);

    const incusGeo = new THREE.BoxGeometry(0.0038, 0.0048, 0.0028);
    const incusMesh = new THREE.Mesh(incusGeo, materials.corticalBone);
    incusMesh.name = `incus${sideSuffix}`;
    incusMesh.position.set(xBase + side * 0.003, yBase - 0.0018, zBase);
    group.add(incusMesh);
    meshes.push(incusMesh);

    const stapesGeo = new THREE.TorusGeometry(0.0022, 0.0007, 8, 12);
    const stapesMesh = new THREE.Mesh(stapesGeo, materials.corticalBone);
    stapesMesh.name = `stapes${sideSuffix}`;
    stapesMesh.position.set(xBase + side * 0.0048, yBase - 0.0028, zBase);
    group.add(stapesMesh);
    meshes.push(stapesMesh);
  });

  return { group, meshes };
}

/**
 * Spinal Intervertebral Discs & Upper-Limb Joint Capsules (Complements LUMC Lower-Limb Ligaments)
 */
export function createCartilageAndLigamentsLayer(materials) {
  const group = new THREE.Group();
  group.name = 'LayerLigamentsCartilage';

  const cartMat = materials.hyalineCartilage;
  const ligMat = materials.ligamentFascia;
  const tendonMat = materials.denseTendon;

  // 1. Cervical, Thoracic & Lumbar Intervertebral Fibrocartilage Discs (23 discs C2-S1)
  for (let i = 0; i < 6; i++) {
    const discGeo = new THREE.CylinderGeometry(0.016, 0.017, 0.0045, 18);
    const disc = new THREE.Mesh(discGeo, cartMat);
    disc.position.set(0, 1.435 + i * 0.017, -0.018);
    group.add(disc);
  }
  for (let i = 0; i < 12; i++) {
    const r = 0.019 + (11 - i) * 0.0005;
    const discGeo = new THREE.CylinderGeometry(r, r + 0.001, 0.006, 20);
    const disc = new THREE.Mesh(discGeo, cartMat);
    disc.position.set(0, 1.155 + i * 0.0225, -0.032);
    group.add(disc);
  }
  for (let i = 0; i < 5; i++) {
    const r = 0.025 + (4 - i) * 0.001;
    const discGeo = new THREE.CylinderGeometry(r, r + 0.0015, 0.0095, 22);
    const disc = new THREE.Mesh(discGeo, cartMat);
    disc.position.set(0, 0.965 + i * 0.034, -0.032);
    group.add(disc);
  }

  // 2. Pubic Symphysis Fibrocartilage Pad
  const symphysis = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.036, 0.016), cartMat);
  symphysis.position.set(0, 0.855, 0.052);
  group.add(symphysis);

  // 3. Upper-Limb Glenohumeral, Elbow & Flexor Retinaculum Ligaments (Bilateral)
  [-1, 1].forEach((side) => {
    // Glenohumeral joint capsule & coracoacromial arch
    const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 16), ligMat);
    shoulderCap.scale.set(1.1, 0.95, 0.9);
    shoulderCap.position.set(side * 0.185, 1.385, -0.022);
    group.add(shoulderCap);

    // Bicipital long-head tendon & Elbow collateral ligaments
    const elbowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.195, 1.37, -0.015),
      new THREE.Vector3(side * 0.215, 1.13, -0.03),
      new THREE.Vector3(side * 0.225, 1.07, -0.022),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(elbowCurve, 16, 0.0045, 8, false), tendonMat));

    // Carpal Transverse Ligament (Flexor Retinaculum at Wrist)
    const wristBand = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.019, 0.018, 16), ligMat);
    wristBand.position.set(side * 0.245, 0.835, 0.012);
    wristBand.rotation.z = side * 0.12;
    group.add(wristBand);
  });

  return group;
}

/**
 * Multi-Chamber Sculpted Heart & Systemic Arterial/Venous Circulation
 * (Complements LUMC Lower-Limb 46 Arteries & 42 Veins)
 */
export function createVascularLoopLayer(materials) {
  const group = new THREE.Group();
  group.name = 'LayerVascularLoop';

  const myocardiumMat = materials.cardiacMyocardium || materials.arteryBlood;
  const arteryMat = materials.arteryBlood;
  const veinMat = materials.veinBlood;

  // 1. MULTI-CHAMBER SCULPTED HEART (Left/Right Ventricles, Left/Right Atria, Coronary Vessels)
  const heartGroup = new THREE.Group();
  heartGroup.name = 'CardiacChamber';
  heartGroup.position.set(0.018, 1.275, 0.032);
  heartGroup.rotation.set(0.22, -0.28, -0.38);

  // Left Ventricle (Dominant muscular apex)
  const lvGeo = new THREE.SphereGeometry(0.036, 28, 24);
  lvGeo.scale(0.88, 1.42, 0.92);
  const lvMesh = new THREE.Mesh(lvGeo, myocardiumMat);
  lvMesh.position.set(0.01, -0.012, 0.004);
  heartGroup.add(lvMesh);

  // Right Ventricle (Anterior crescentic chamber)
  const rvGeo = new THREE.SphereGeometry(0.031, 24, 20);
  rvGeo.scale(0.92, 1.28, 0.85);
  const rvMesh = new THREE.Mesh(rvGeo, myocardiumMat);
  rvMesh.position.set(-0.014, -0.006, 0.014);
  heartGroup.add(rvMesh);

  // Left Atrium (Posterior-superior chamber)
  const laGeo = new THREE.SphereGeometry(0.024, 20, 16);
  laGeo.scale(1.05, 0.9, 0.95);
  const laMesh = new THREE.Mesh(laGeo, myocardiumMat);
  laMesh.position.set(0.015, 0.028, -0.012);
  heartGroup.add(laMesh);

  // Right Atrium & Vena Cava Sinus
  const raGeo = new THREE.SphereGeometry(0.025, 20, 16);
  raGeo.scale(0.95, 1.05, 0.95);
  const raMesh = new THREE.Mesh(raGeo, veinMat);
  raMesh.position.set(-0.022, 0.022, 0.002);
  heartGroup.add(raMesh);

  // Left Anterior Descending (LAD) & Right Coronary Artery (RCA) Sulcus Vessels
  const ladCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.002, 0.02, 0.028),
    new THREE.Vector3(-0.002, 0.0, 0.035),
    new THREE.Vector3(0.006, -0.028, 0.03),
    new THREE.Vector3(0.012, -0.046, 0.012),
  ]);
  heartGroup.add(new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 18, 0.0026, 8, false), arteryMat));

  const rcaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.005, 0.018, 0.026),
    new THREE.Vector3(-0.026, 0.005, 0.022),
    new THREE.Vector3(-0.024, -0.018, 0.014),
  ]);
  heartGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rcaCurve, 14, 0.0022, 8, false), arteryMat));

  group.add(heartGroup);

  // 2. ASCENDING AORTA, AORTIC ARCH, DESCENDING THORACIC & ABDOMINAL AORTA
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.012, 1.305, 0.034),
    new THREE.Vector3(0.002, 1.355, 0.028),
    new THREE.Vector3(0.016, 1.375, 0.002),
    new THREE.Vector3(0.012, 1.335, -0.022),
    new THREE.Vector3(0.006, 1.18, -0.024),
    new THREE.Vector3(0.002, 0.98, -0.018),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 36, 0.0105, 12, false), arteryMat));

  // Pulmonary Trunk & Left/Right Pulmonary Outflow
  [-1, 1].forEach((side) => {
    const pulmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.008, 1.305, 0.044),
      new THREE.Vector3(0.012, 1.335, 0.026),
      new THREE.Vector3(side * 0.065, 1.325, 0.008),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(pulmCurve, 14, 0.0065, 8, false), veinMat));
  });

  // 3. SUPERIOR & INFERIOR VENA CAVA + JUGULAR VEINS
  const svcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.016, 1.42, 0.012),
    new THREE.Vector3(-0.014, 1.35, 0.02),
    new THREE.Vector3(-0.008, 1.30, 0.028),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(svcCurve, 16, 0.0085, 10, false), veinMat));

  const ivcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.012, 0.96, -0.012),
    new THREE.Vector3(-0.014, 1.14, -0.01),
    new THREE.Vector3(-0.008, 1.26, 0.022),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(ivcCurve, 22, 0.0095, 10, false), veinMat));

  // 4. BILATERAL CAROTID, JUGULAR, SUBCLAVIAN, BRACHIAL, RADIAL & ULNAR VESSELS + RENAL ARTERIES
  [-1, 1].forEach((side) => {
    // Common, Internal & External Carotid Arteries
    const carotidCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.012, 1.37, 0.012),
      new THREE.Vector3(side * 0.024, 1.46, 0.008),
      new THREE.Vector3(side * 0.028, 1.56, 0.002),
      new THREE.Vector3(side * 0.022, 1.62, 0.018),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(carotidCurve, 20, 0.0042, 8, false), arteryMat));

    // Internal Jugular Vein
    const jugularCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.018, 1.38, 0.014),
      new THREE.Vector3(side * 0.031, 1.46, 0.006),
      new THREE.Vector3(side * 0.034, 1.56, -0.004),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(jugularCurve, 18, 0.0048, 8, false), veinMat));

    // Subclavian -> Axillary -> Brachial -> Radial Artery (Full Arm)
    const brachialCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.015, 1.365, 0.005),
      new THREE.Vector3(side * 0.11, 1.39, -0.008),
      new THREE.Vector3(side * 0.185, 1.36, -0.022),
      new THREE.Vector3(side * 0.205, 1.18, -0.026),
      new THREE.Vector3(side * 0.222, 1.05, -0.018),
      new THREE.Vector3(side * 0.242, 0.84, 0.01),
      new THREE.Vector3(side * 0.252, 0.76, 0.025),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(brachialCurve, 28, 0.0038, 8, false), arteryMat));

    // Ulnar Artery Branch (Forearm)
    const ulnarCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.222, 1.05, -0.018),
      new THREE.Vector3(side * 0.215, 0.94, -0.012),
      new THREE.Vector3(side * 0.232, 0.83, 0.006),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(ulnarCurve, 16, 0.0028, 6, false), arteryMat));

    // Cephalic & Basilic Arm Veins
    const armVeinCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.018, 1.36, 0.012),
      new THREE.Vector3(side * 0.175, 1.37, -0.014),
      new THREE.Vector3(side * 0.215, 1.15, -0.018),
      new THREE.Vector3(side * 0.238, 0.85, 0.014),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(armVeinCurve, 24, 0.0035, 8, false), veinMat));

    // Renal Arteries & Veins (L1-L2 level)
    const renalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.12, -0.02),
      new THREE.Vector3(side * 0.045, 1.115, -0.025),
      new THREE.Vector3(side * 0.068, 1.11, -0.032),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(renalCurve, 10, 0.0036, 6, false), arteryMat));

    // Common & External Iliac Bridge (connects Abdominal Aorta at Y=0.98 to LUMC Lower Limb Arteries)
    const iliacCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.002, 0.98, -0.018),
      new THREE.Vector3(side * 0.038, 0.91, -0.005),
      new THREE.Vector3(side * 0.068, 0.83, 0.018),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(iliacCurve, 14, 0.0062, 8, false), arteryMat));

    const iliacVeinCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.012, 0.96, -0.012),
      new THREE.Vector3(side * 0.034, 0.90, -0.01),
      new THREE.Vector3(side * 0.064, 0.82, 0.012),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(iliacVeinCurve, 14, 0.0065, 8, false), veinMat));
  });

  return { group, heartMesh: heartGroup };
}

/**
 * Gyri-Sculpted Cortical Brain, Cerebellum, Spinal Cord & Systemic Connectome
 * (Complements LUMC Lower-Limb 47 Clinical Nerve Trunks)
 */
export function createNeuralConnectomeLayer(materials) {
  const group = new THREE.Group();
  group.name = 'LayerNeuralConnectome';

  const brainMat = materials.corticalBrainMatter || materials.nerveMyelin;
  const nerveMat = materials.nerveMyelin;

  // 1. GYRI-SCULPTED LEFT & RIGHT CEREBRAL HEMISPHERES
  [-1, 1].forEach((side) => {
    const hemiGeo = new THREE.SphereGeometry(0.054, 36, 28);
    const pos = hemiGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      // Flatten medial longitudinal fissure wall
      if (side === -1 && v.x > 0.005) v.x *= 0.25;
      if (side === 1 && v.x < -0.005) v.x *= 0.25;
      // Elongate anteroposteriorly (frontal to occipital lobe)
      v.x *= 0.82;
      v.y *= 1.02;
      v.z *= 1.32;
      // Procedural cortical gyri & sulci folding perturbation
      const sulci =
        Math.sin(v.x * 160 + v.z * 90) *
        Math.cos(v.y * 140 - v.z * 110) *
        0.0024;
      v.addScaledVector(v.clone().normalize(), sulci);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    hemiGeo.computeVertexNormals();
    const hemiMesh = new THREE.Mesh(hemiGeo, brainMat);
    hemiMesh.position.set(side * 0.026, 1.632, 0.008);
    group.add(hemiMesh);
  });

  // 2. FOLIA-STRIATED CEREBELLUM (Posterior Cranial Fossa)
  const cerebellumGeo = new THREE.SphereGeometry(0.032, 28, 20);
  const cPos = cerebellumGeo.attributes.position;
  for (let i = 0; i < cPos.count; i++) {
    let x = cPos.getX(i) * 1.48;
    let y = cPos.getY(i) * 0.78;
    let z = cPos.getZ(i) * 0.88;
    const folia = Math.sin(y * 320) * 0.0012;
    cPos.setXYZ(i, x, y, z + folia);
  }
  cerebellumGeo.computeVertexNormals();
  const cerebellum = new THREE.Mesh(cerebellumGeo, brainMat);
  cerebellum.position.set(0, 1.568, -0.044);
  group.add(cerebellum);

  // 3. BRAINSTEM (Pons, Medulla) & SPINAL CORD WITH CAUDA EQUINA
  const cordCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.585, -0.012),
    new THREE.Vector3(0, 1.52, -0.022),
    new THREE.Vector3(0, 1.38, -0.034),
    new THREE.Vector3(0, 1.18, -0.038),
    new THREE.Vector3(0, 0.98, -0.032),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 32, 0.0068, 10, false), nerveMat));

  // 4. BILATERAL BRACHIAL PLEXUS (Median, Ulnar, Radial Nerves) & 12 INTERCOSTAL NERVES
  [-1, 1].forEach((side) => {
    // Brachial Plexus & Median Nerve (C5-T1 down to hand)
    const medianCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.44, -0.024),
      new THREE.Vector3(side * 0.095, 1.40, -0.018),
      new THREE.Vector3(side * 0.185, 1.36, -0.024),
      new THREE.Vector3(side * 0.208, 1.16, -0.026),
      new THREE.Vector3(side * 0.225, 1.02, -0.015),
      new THREE.Vector3(side * 0.244, 0.82, 0.012),
      new THREE.Vector3(side * 0.252, 0.74, 0.026),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(medianCurve, 28, 0.0032, 8, false), nerveMat));

    // Radial & Ulnar Nerve Branches
    const ulnarNerveCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.185, 1.36, -0.024),
      new THREE.Vector3(side * 0.215, 1.08, -0.032),
      new THREE.Vector3(side * 0.232, 0.83, 0.004),
    ]);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(ulnarNerveCurve, 18, 0.0024, 6, false), nerveMat));

    // 8 Thoracic Intercostal Nerve Arcs wrapping ribcage
    for (let r = 0; r < 8; r++) {
      const y = 1.35 - r * 0.026;
      const icCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, y, -0.035),
        new THREE.Vector3(side * 0.085, y - 0.008, -0.025),
        new THREE.Vector3(side * 0.125, y - 0.018, 0.015),
        new THREE.Vector3(side * 0.075, y - 0.024, 0.068),
      ]);
      group.add(new THREE.Mesh(new THREE.TubeGeometry(icCurve, 12, 0.0016, 6, false), nerveMat));
    }
  });

  // 5. SYNAPTIC ACTION POTENTIAL IMPULSE PARTICLES
  const particleCount = 240;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    if (i < 120) {
      // Neocortex synaptic cloud
      const radius = 0.052 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 1.63 + radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = 0.008 + radius * Math.cos(phi) * 1.2;
    } else {
      // Spinal & peripheral action potentials
      const progress = (i - 120) / 120;
      positions[i * 3] = (Math.random() - 0.5) * 0.014;
      positions[i * 3 + 1] = 1.56 - progress * 0.62;
      positions[i * 3 + 2] = -0.032 + (Math.random() - 0.5) * 0.01;
    }
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const synMat = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.009,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const synPoints = new THREE.Points(particleGeo, synMat);
  group.add(synPoints);

  return { group, synPoints };
}
