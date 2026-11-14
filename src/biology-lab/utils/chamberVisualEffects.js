import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { applyOrganSubPartMaterials } from './zAnatomyOrganLoader';

/**
 * Configures cinematic PBR tone mapping, studio PMREM environment reflections,
 * and balanced warm-key + cyan-rim clinical lighting for bioreactor chambers.
 */
export function setupChamberStudioLighting(renderer, scene) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  let envRT = null;
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = new RoomEnvironment();
    envRT = pmrem.fromScene(env, 0.04);
    scene.environment = envRT.texture;
    env.dispose();
    pmrem.dispose();
  } catch {
    // Fallback cleanly in headless/mocked WebGL contexts
  }

  scene.add(new THREE.HemisphereLight(0xf8fafc, 0x0f172a, 0.95));

  const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.1);
  keyLight.position.set(3.8, 5.5, 4.8);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight('#22d3ee', 1.85, 11);
  rimLight.position.set(-2.6, 1.4, -1.8);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight('#38bdf8', 0.9, 9);
  fillLight.position.set(2.2, -1.4, 2.4);
  scene.add(fillLight);

  return () => {
    if (envRT) {
      envRT.dispose();
      envRT = null;
    }
    scene.environment = null;
  };
}

/**
 * Creates a post-processing EffectComposer with subtle UnrealBloomPass for bioluminescent
 * nuclei, laser scan halo, and arterial/venous manifolds. Falls back safely if unsupported.
 */
export function createChamberComposer(renderer, scene, camera, width, height) {
  try {
    scene.background = new THREE.Color('#060b16');
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.34, // subtle glow strength
      0.5,  // radius
      0.68  // threshold so only emissive/bright highlights bloom
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
    return {
      render: () => composer.render(),
      dispose: () => composer.dispose(),
    };
  } catch {
    return {
      render: () => renderer.render(scene, camera),
      dispose: () => {},
    };
  }
}

/**
 * Builds a sophisticated, modern bioreactor chassis with:
 * - Machined titanium & chrome caps + 8 hex bolts
 * - 4 tension rods + dual arterial/venous perfusion manifold pipes + optical sensor probes
 * - Graduated borosilicate glass cylinder with volume tick rings
 * - Bottom O2 sparger ring + rising micro-bubbles
 * - Animated laser bioprinting / cryo-scan halo ring
 * - Bioluminescent nutrient particle field
 */
export function buildSophisticatedChamberChassis(scene, initialLiquidColor = '#0ea5e9') {
  const chamberGroup = new THREE.Group();
  chamberGroup.scale.setScalar(0.92);
  scene.add(chamberGroup);

  const titaniumMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.88,
    roughness: 0.22,
  });
  const darkAnodizedMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    metalness: 0.82,
    roughness: 0.34,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.94,
    roughness: 0.14,
  });

  // Base & Top Collars
  const baseCap = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 0.22, 48), titaniumMat);
  baseCap.position.y = -1.44;
  chamberGroup.add(baseCap);

  const baseTrim = new THREE.Mesh(new THREE.CylinderGeometry(1.26, 1.32, 0.08, 48), darkAnodizedMat);
  baseTrim.position.y = -1.29;
  chamberGroup.add(baseTrim);

  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.36, 0.18, 48), titaniumMat);
  topCap.position.y = 1.44;
  chamberGroup.add(topCap);

  const topDome = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.15, 0.12, 36), darkAnodizedMat);
  topDome.position.y = 1.57;
  chamberGroup.add(topDome);

  // 8 Machined Hex Bolts on Top & Bottom Flanges
  const boltGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.06, 6);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const topBolt = new THREE.Mesh(boltGeo, chromeMat);
    topBolt.position.set(Math.cos(a) * 1.24, 1.54, Math.sin(a) * 1.24);
    chamberGroup.add(topBolt);

    const botBolt = new THREE.Mesh(boltGeo, chromeMat);
    botBolt.position.set(Math.cos(a) * 1.32, -1.32, Math.sin(a) * 1.32);
    chamberGroup.add(botBolt);
  }

  // 4 Chrome Structural Tension Rods
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 2.74, 12), chromeMat);
    rod.position.set(Math.cos(a) * 1.25, 0, Math.sin(a) * 1.25);
    chamberGroup.add(rod);
  }

  // Dual Arterial (Red) & Venous (Blue) Perfusion Manifold Pipes
  const arterialMat = new THREE.MeshStandardMaterial({
    color: '#ef4444',
    emissive: '#dc2626',
    emissiveIntensity: 0.45,
    roughness: 0.3,
  });
  const venousMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.45,
    roughness: 0.3,
  });
  const arterialPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.58, 12), arterialMat);
  arterialPipe.position.set(1.18, 0, 0.16);
  chamberGroup.add(arterialPipe);

  const venousPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.58, 12), venousMat);
  venousPipe.position.set(-1.18, 0, -0.16);
  chamberGroup.add(venousPipe);

  // Bottom O2 Perfusion Sparger Ring
  const spargerMat = new THREE.MeshStandardMaterial({
    color: '#22d3ee',
    emissive: '#06b6d4',
    emissiveIntensity: 0.65,
    metalness: 0.5,
    roughness: 0.2,
  });
  const spargerRing = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.024, 12, 48), spargerMat);
  spargerRing.rotation.x = Math.PI / 2;
  spargerRing.position.y = -1.16;
  chamberGroup.add(spargerRing);

  // Borosilicate Glass Cylinder
  chamberGroup.add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(1.12, 1.12, 2.54, 48, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: '#e2e8f0',
        transparent: true,
        opacity: 0.14,
        roughness: 0.05,
        metalness: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    )
  );

  // Graduated Volume Tick Rings on Glass
  const tickMat = new THREE.MeshBasicMaterial({
    color: '#38bdf8',
    transparent: true,
    opacity: 0.22,
  });
  [-0.85, -0.42, 0, 0.42, 0.85].forEach((ty) => {
    const tick = new THREE.Mesh(new THREE.TorusGeometry(1.125, 0.005, 6, 48), tickMat);
    tick.rotation.x = Math.PI / 2;
    tick.position.y = ty;
    chamberGroup.add(tick);
  });

  // Nutrient Culture Medium Liquid
  const liquidMat = new THREE.MeshPhysicalMaterial({
    color: initialLiquidColor,
    emissive: initialLiquidColor,
    emissiveIntensity: 0.16,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const liquidCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.06, 2.18, 48), liquidMat);
  liquidCyl.position.y = -0.13;
  chamberGroup.add(liquidCyl);

  // Laser Bioprinting / Telemetry Scan Halo Ring
  const scanRingMat = new THREE.MeshBasicMaterial({
    color: '#22d3ee',
    transparent: true,
    opacity: 0.0,
  });
  const scanRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.014, 10, 48), scanRingMat);
  scanRing.rotation.x = Math.PI / 2;
  chamberGroup.add(scanRing);

  // Rising O2 Micro-Bubbles
  const bubbleCount = 36;
  const bubbleGeo = new THREE.SphereGeometry(0.018, 8, 8);
  const bubbleMat = new THREE.MeshBasicMaterial({
    color: '#cffafe',
    transparent: true,
    opacity: 0.55,
  });
  const bubbles = [];
  for (let i = 0; i < bubbleCount; i++) {
    const b = new THREE.Mesh(bubbleGeo, bubbleMat);
    const angle = Math.random() * Math.PI * 2;
    const rad = 0.65 + (Math.random() - 0.5) * 0.28;
    b.userData = {
      angle,
      rad,
      y: -1.15 + Math.random() * 2.1,
      speed: 0.25 + Math.random() * 0.35,
      scale: 0.5 + Math.random() * 0.9,
    };
    b.scale.setScalar(b.userData.scale);
    b.position.set(Math.cos(angle) * rad, b.userData.y, Math.sin(angle) * rad);
    chamberGroup.add(b);
    bubbles.push(b);
  }

  // Bioluminescent Morphogen / Nutrient Particles
  const nutrientCount = 28;
  const nutrientGeo = new THREE.SphereGeometry(0.015, 6, 6);
  const nutrientMat = new THREE.MeshBasicMaterial({
    color: '#fbbf24',
    transparent: true,
    opacity: 0.55,
  });
  const nutrients = [];
  for (let i = 0; i < nutrientCount; i++) {
    const n = new THREE.Mesh(nutrientGeo, nutrientMat);
    n.userData = {
      angle: (i / nutrientCount) * Math.PI * 2,
      rad: 0.3 + Math.random() * 0.62,
      yBase: -0.9 + Math.random() * 1.8,
      speed: 0.4 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    };
    chamberGroup.add(n);
    nutrients.push(n);
  }

  const tissueRoot = new THREE.Group();
  chamberGroup.add(tissueRoot);

  const updateEffects = (timeSec, { isActive = false, o2Level = 21, morphogenLevel = 65, liquidColor } = {}) => {
    if (liquidColor) {
      liquidMat.color.set(liquidColor);
      liquidMat.emissive.set(liquidColor);
    }

    // Scan Ring sweeps vertically when synthesis/ossification is active
    scanRing.position.y = Math.sin(timeSec * 1.6) * 0.98;
    scanRingMat.opacity = isActive ? 0.45 + Math.sin(timeSec * 5) * 0.15 : 0.08;

    // Sparger glow responds to O2 Perfusion
    const o2Ratio = Math.max(0.05, Math.min(1.5, o2Level / 21));
    spargerMat.emissiveIntensity = 0.2 + o2Ratio * 0.65;

    // Animate O2 micro-bubbles
    const bubbleVelScale = o2Level < 8 ? 0.15 : o2Ratio;
    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      b.userData.y += 0.008 * b.userData.speed * bubbleVelScale;
      if (b.userData.y > 0.92) b.userData.y = -1.15;
      const wobble = Math.sin(timeSec * 3 + i) * 0.03;
      b.position.set(
        Math.cos(b.userData.angle + wobble) * b.userData.rad,
        b.userData.y,
        Math.sin(b.userData.angle + wobble) * b.userData.rad
      );
      b.visible = o2Level > 2;
    }

    // Animate bioluminescent morphogen particles
    const morphRatio = Math.max(0.1, morphogenLevel / 100);
    nutrientMat.opacity = 0.2 + morphRatio * 0.55;
    for (let i = 0; i < nutrients.length; i++) {
      const n = nutrients[i];
      const a = n.userData.angle + timeSec * 0.35 * n.userData.speed;
      n.position.set(
        Math.cos(a) * n.userData.rad,
        n.userData.yBase + Math.sin(timeSec * 1.5 + n.userData.phase) * 0.12,
        Math.sin(a) * n.userData.rad
      );
    }
  };

  return { chamberGroup, tissueRoot, liquidMat, updateEffects };
}

/**
 * Helper: Creates a realistic 3-strand Collagen Triple Helix fiber bundle
 */
function createCollagenHelixGroup(colorHex = '#f59e0b', height = 1.25, radius = 0.24) {
  const group = new THREE.Group();
  const strandColors = [colorHex, '#fde68a', '#fb923c'];
  for (let s = 0; s < 3; s++) {
    const pts = [];
    const phase = (s / 3) * Math.PI * 2;
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const angle = t * Math.PI * 4 + phase;
      const r = radius * (0.75 + Math.sin(t * Math.PI) * 0.35);
      pts.push(new THREE.Vector3(Math.cos(angle) * r, (t - 0.5) * height, Math.sin(angle) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 32, 0.016, 6, false),
      new THREE.MeshStandardMaterial({
        color: strandColors[s],
        emissive: colorHex,
        emissiveIntensity: 0.25,
        roughness: 0.35,
      })
    );
    group.add(tube);
  }
  return group;
}

/**
 * Helper: Creates a crystal-clear eukaryotic cell with visible internal organelles:
 * - Translucent lipid bilayer plasma membrane (depthWrite: false)
 * - Nuclear envelope + bright nucleolus + coiled chromatin
 * - Rough Endoplasmic Reticulum folds wrapping the nucleus
 * - Mitochondria capsules with cristae bands
 * - Golgi cisternae & secretory vesicles
 * - Cell-type specializations (cardiomyocyte striations, hepatocyte dual nuclei,
 *   pneumocyte lamellar bodies, enterocyte microvilli, podocyte pedicels,
 *   neuron dendrites + myelinated axon, osteoclast multi-nuclei + ruffled border).
 */
function createRealisticCellMesh(cellId = 'mesenchymal_cells', colorHex = '#38bdf8', scale = 1, isDividing = false) {
  const cell = new THREE.Group();
  const baseRadius = 0.115 * scale;

  // 1. Crystal-clear Plasma Membrane
  const membraneMat = new THREE.MeshPhysicalMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.22,
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const isElongated = cellId === 'cell_cardiomyocyte' || cellId === 'cell_myocyte';
  const membraneGeo = isElongated
    ? new THREE.CapsuleGeometry(baseRadius * 0.72, baseRadius * 1.35, 10, 20)
    : new THREE.SphereGeometry(baseRadius, 22, 22);
  const membrane = new THREE.Mesh(membraneGeo, membraneMat);
  if (isElongated) membrane.rotation.z = Math.PI / 2;
  cell.add(membrane);

  // Subtle rim wireframe equator for crisp membrane boundary
  const rimRing = new THREE.Mesh(
    new THREE.TorusGeometry(baseRadius * (isElongated ? 0.72 : 0.99), 0.0022 * scale, 6, 32),
    new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.35 })
  );
  cell.add(rimRing);

  // 2. Nucleus + Nucleolus + Chromatin
  const addNucleus = (nx, ny, nz, nrScale = 1) => {
    const nucGroup = new THREE.Group();
    nucGroup.position.set(nx, ny, nz);
    const nr = baseRadius * 0.36 * nrScale;

    const nuclearEnv = new THREE.Mesh(
      new THREE.SphereGeometry(nr, 16, 16),
      new THREE.MeshPhysicalMaterial({
        color: '#818cf8',
        emissive: '#4f46e5',
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.52,
        roughness: 0.2,
        depthWrite: false,
      })
    );
    nucGroup.add(nuclearEnv);

    const nucleolus = new THREE.Mesh(
      new THREE.SphereGeometry(nr * 0.42, 12, 12),
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        emissive: '#c084fc',
        emissiveIntensity: 0.95,
      })
    );
    nucleolus.position.set(nr * 0.15, nr * 0.1, 0);
    nucGroup.add(nucleolus);

    // Chromatin loop inside nucleus
    const chromLoop = new THREE.Mesh(
      new THREE.TorusGeometry(nr * 0.62, nr * 0.08, 6, 18),
      new THREE.MeshBasicMaterial({ color: '#e0e7ff', transparent: true, opacity: 0.75 })
    );
    chromLoop.rotation.set(0.8, 0.5, 0);
    nucGroup.add(chromLoop);
    cell.add(nucGroup);
  };

  if (cellId === 'cell_hepatocyte') {
    addNucleus(-baseRadius * 0.24, 0.01 * scale, 0, 0.78);
    addNucleus(baseRadius * 0.24, -0.01 * scale, 0, 0.78);
  } else if (cellId === 'osteoclasts') {
    addNucleus(-baseRadius * 0.28, baseRadius * 0.15, 0.01 * scale, 0.65);
    addNucleus(baseRadius * 0.28, baseRadius * 0.12, -0.01 * scale, 0.65);
    addNucleus(0, -baseRadius * 0.18, baseRadius * 0.15, 0.65);
  } else {
    addNucleus(0, 0, 0, 1);
  }

  // 3. Rough Endoplasmic Reticulum (concentric folded cisternae around nucleus)
  const erMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.45,
    roughness: 0.35,
  });
  for (let e = 0; e < 3; e++) {
    const erArc = new THREE.Mesh(
      new THREE.TorusGeometry(baseRadius * (0.48 + e * 0.09), 0.0055 * scale, 6, 18, Math.PI * 1.15),
      erMat
    );
    erArc.rotation.set(e * 0.55, e * 0.9, e * 0.4);
    cell.add(erArc);
  }

  // 4. Mitochondria (bean-shaped capsules with cristae bands)
  const mitoMat = new THREE.MeshStandardMaterial({
    color: '#fb923c',
    emissive: '#ea580c',
    emissiveIntensity: 0.55,
    roughness: 0.3,
  });
  const mitoCount = cellId === 'cell_cardiomyocyte' || cellId === 'cell_hepatocyte' ? 5 : 3;
  for (let m = 0; m < mitoCount; m++) {
    const ang = (m / mitoCount) * Math.PI * 2 + 0.4;
    const dist = baseRadius * 0.64;
    const mito = new THREE.Mesh(
      new THREE.CapsuleGeometry(baseRadius * 0.09, baseRadius * 0.18, 6, 10),
      mitoMat
    );
    mito.position.set(
      Math.cos(ang) * dist,
      ((m % 2) - 0.5) * baseRadius * 0.45,
      Math.sin(ang) * dist
    );
    mito.rotation.set(m * 0.8, ang, 0.6);
    cell.add(mito);
  }

  // 5. Golgi Apparatus (stacked crescent cisternae)
  const golgiMat = new THREE.MeshStandardMaterial({
    color: '#34d399',
    emissive: '#059669',
    emissiveIntensity: 0.5,
  });
  for (let g = 0; g < 3; g++) {
    const golgi = new THREE.Mesh(
      new THREE.TorusGeometry(baseRadius * (0.28 + g * 0.05), 0.005 * scale, 6, 14, Math.PI * 0.7),
      golgiMat
    );
    golgi.position.set(-baseRadius * 0.35, -baseRadius * 0.25, baseRadius * 0.22);
    golgi.rotation.set(0.4, 0.6, 0.2);
    cell.add(golgi);
  }

  // 6. Ribosomes / Cytoplasmic Vesicles
  const riboMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });
  const riboGeo = new THREE.SphereGeometry(baseRadius * 0.032, 6, 6);
  for (let r = 0; r < 6; r++) {
    const ra = (r / 6) * Math.PI * 2 + 1.1;
    const ribo = new THREE.Mesh(riboGeo, riboMat);
    ribo.position.set(
      Math.cos(ra) * baseRadius * 0.56,
      Math.sin(ra * 2) * baseRadius * 0.32,
      Math.sin(ra) * baseRadius * 0.56
    );
    cell.add(ribo);
  }

  // 7. Cell-Type Specializations
  if (cellId === 'cell_cardiomyocyte' || cellId === 'cell_myocyte') {
    // Internal striated actin-myosin myofibrils
    const myofibrilMat = new THREE.MeshStandardMaterial({
      color: '#fda4af',
      emissive: '#e11d48',
      emissiveIntensity: 0.35,
    });
    for (let f = -1; f <= 1; f += 2) {
      const fibril = new THREE.Mesh(
        new THREE.CylinderGeometry(baseRadius * 0.05, baseRadius * 0.05, baseRadius * 1.9, 8),
        myofibrilMat
      );
      fibril.rotation.z = Math.PI / 2;
      fibril.position.y = f * baseRadius * 0.28;
      cell.add(fibril);
    }
  } else if (cellId === 'cell_pneumocyte') {
    // Surfactant lamellar bodies inside cytoplasm
    const lamMat = new THREE.MeshStandardMaterial({
      color: '#a855f7',
      emissive: '#7e22ce',
      emissiveIntensity: 0.6,
    });
    for (let l = 0; l < 4; l++) {
      const a = (l / 4) * Math.PI * 2;
      const lam = new THREE.Mesh(new THREE.SphereGeometry(baseRadius * 0.13, 10, 10), lamMat);
      lam.position.set(Math.cos(a) * baseRadius * 0.58, baseRadius * 0.25, Math.sin(a) * baseRadius * 0.58);
      cell.add(lam);
    }
  } else if (cellId === 'cell_enterocyte') {
    // Apical microvilli brush border
    const villiMat = new THREE.MeshStandardMaterial({ color: '#f472b6', emissive: '#db2777', emissiveIntensity: 0.35 });
    for (let v = -3; v <= 3; v++) {
      const villus = new THREE.Mesh(
        new THREE.CylinderGeometry(baseRadius * 0.04, baseRadius * 0.04, baseRadius * 0.38, 6),
        villiMat
      );
      villus.position.set(v * baseRadius * 0.18, baseRadius * 1.05, 0);
      cell.add(villus);
    }
  } else if (cellId === 'cell_podocyte') {
    // Radiating pedicel foot processes
    const pedMat = new THREE.MeshStandardMaterial({ color: '#a78bfa', emissive: '#7c3aed', emissiveIntensity: 0.4 });
    for (let p = 0; p < 6; p++) {
      const pa = (p / 6) * Math.PI * 2;
      const ped = new THREE.Mesh(
        new THREE.CylinderGeometry(baseRadius * 0.04, baseRadius * 0.07, baseRadius * 0.65, 6),
        pedMat
      );
      ped.position.set(Math.cos(pa) * baseRadius * 1.15, -baseRadius * 0.15, Math.sin(pa) * baseRadius * 1.15);
      ped.rotation.z = Math.cos(pa) * 1.1;
      ped.rotation.x = Math.sin(pa) * 1.1;
      cell.add(ped);
    }
  } else if (cellId === 'cell_neuron') {
    // Dendritic arbor + myelinated axon
    const axonMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#d97706', emissiveIntensity: 0.55 });
    const axon = new THREE.Mesh(new THREE.CylinderGeometry(baseRadius * 0.06, baseRadius * 0.04, baseRadius * 2.1, 8), axonMat);
    axon.position.set(baseRadius * 1.45, 0, 0);
    axon.rotation.z = Math.PI / 2;
    cell.add(axon);
    // Myelin sheath segments
    const myelinMat = new THREE.MeshStandardMaterial({ color: '#22d3ee', emissive: '#0891b2', emissiveIntensity: 0.4 });
    [0.95, 1.55, 2.15].forEach((mx) => {
      const seg = new THREE.Mesh(new THREE.CapsuleGeometry(baseRadius * 0.13, baseRadius * 0.25, 6, 10), myelinMat);
      seg.position.set(baseRadius * mx, 0, 0);
      seg.rotation.z = Math.PI / 2;
      cell.add(seg);
    });
    // Dendrite branches
    for (let d = 0; d < 4; d++) {
      const da = (d / 4) * Math.PI * 2 + 0.4;
      const den = new THREE.Mesh(new THREE.CylinderGeometry(baseRadius * 0.025, baseRadius * 0.055, baseRadius * 0.85, 6), axonMat);
      den.position.set(-baseRadius * 0.85, Math.cos(da) * baseRadius * 0.55, Math.sin(da) * baseRadius * 0.55);
      den.rotation.z = 1.1;
      den.rotation.y = da;
      cell.add(den);
    }
  } else if (cellId === 'osteoclasts') {
    // Ruffled proton-pump (H+) resorption border
    const hMat = new THREE.MeshStandardMaterial({ color: '#c084fc', emissive: '#9333ea', emissiveIntensity: 0.7 });
    for (let r = -2; r <= 2; r++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(baseRadius * 0.1, baseRadius * 0.28, 8), hMat);
      cone.position.set(r * baseRadius * 0.25, -baseRadius * 1.02, 0);
      cone.rotation.x = Math.PI;
      cell.add(cone);
    }
  }

  if (isDividing) {
    const bud = new THREE.Mesh(new THREE.SphereGeometry(baseRadius * 0.55, 12, 12), membraneMat);
    bud.position.set(baseRadius * 0.9, baseRadius * 0.25, 0);
    cell.add(bud);
  }
  return cell;
}

/**
 * Helper: Creates a CPK-accurate Tetrahedral Phosphate, Diatomic O2, or Ca2+ Crystal
 */
function createMoleculeCluster(type) {
  const g = new THREE.Group();
  if (type === 'phosphate') {
    const pMat = new THREE.MeshStandardMaterial({ color: '#fb923c', emissive: '#ea580c', emissiveIntensity: 0.45 });
    const oMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.25 });
    const bondMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1' });
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.044, 14, 14), pMat));
    const dirs = [
      [1, 1, 1],
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1],
    ];
    dirs.forEach(([dx, dy, dz]) => {
      const v = new THREE.Vector3(dx, dy, dz).normalize().multiplyScalar(0.086);
      const o = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), oMat);
      o.position.copy(v);
      g.add(o);
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.084, 8), bondMat);
      bond.position.copy(v.clone().multiplyScalar(0.5));
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
      g.add(bond);
    });
  } else if (type === 'oxygen') {
    const oMat = new THREE.MeshStandardMaterial({ color: '#22d3ee', emissive: '#0891b2', emissiveIntensity: 0.55 });
    const bondMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0' });
    const a1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 14), oMat);
    a1.position.x = -0.042;
    const a2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 14), oMat);
    a2.position.x = 0.042;
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.075, 8), bondMat);
    b1.rotation.z = Math.PI / 2;
    b1.position.y = 0.012;
    const b2 = b1.clone();
    b2.position.y = -0.012;
    g.add(a1, a2, b1, b2);
  } else {
    // Ca2+ octahedral crystal core + hydration shell
    const caMat = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      emissive: '#38bdf8',
      emissiveIntensity: 0.45,
      metalness: 0.35,
      roughness: 0.18,
    });
    g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.056, 0), caMat));
    const shell = new THREE.Mesh(
      new THREE.TorusGeometry(0.085, 0.004, 6, 24),
      new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.55 })
    );
    shell.rotation.x = Math.PI / 3;
    g.add(shell);
  }
  return g;
}

/**
 * Helper: Creates a distinct 3D signaling protein dimer, lipid micelle, or actin-myosin complex.
 */
function createSignalingOrMatrixModel(id, colorHex = '#f43f5e') {
  const g = new THREE.Group();
  if (id === 'comp_surfactant' || id === 'comp_mucin' || id === 'comp_myelin_ions') {
    // Phospholipid / Myelin Micelle Ring (hydrophilic heads + hydrophobic tails)
    const headMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.45 });
    const tailMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.4 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), headMat);
      head.position.set(Math.cos(a) * 0.085, Math.sin(a) * 0.085, 0);
      g.add(head);
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.055, 6), tailMat);
      tail.position.set(Math.cos(a) * 0.052, Math.sin(a) * 0.052, 0);
      tail.rotation.z = a + Math.PI / 2;
      g.add(tail);
    }
    return g;
  }

  if (id === 'comp_atp_actin') {
    // Actin double filament + pulsing ATP energy sphere
    const actMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', emissive: '#d97706', emissiveIntensity: 0.45 });
    const atpMat = new THREE.MeshStandardMaterial({ color: '#fef08a', emissive: '#eab308', emissiveIntensity: 0.8 });
    const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), actMat);
    f1.rotation.z = 0.3;
    const f2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), actMat);
    f2.rotation.z = -0.3;
    const atp = new THREE.Mesh(new THREE.OctahedronGeometry(0.036, 1), atpMat);
    g.add(f1, f2, atp);
    return g;
  }

  // Growth Factor / Morphogen Protein Dimer (two folded domains + active receptor cleft)
  const domMat = new THREE.MeshPhysicalMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    clearcoat: 0.6,
  });
  const cleftMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    emissive: '#22d3ee',
    emissiveIntensity: 0.75,
  });
  const left = new THREE.Mesh(new THREE.DodecahedronGeometry(0.048, 1), domMat);
  left.position.set(-0.042, 0, 0);
  const right = new THREE.Mesh(new THREE.DodecahedronGeometry(0.048, 1), domMat);
  right.position.set(0.042, 0, 0);
  const cleft = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.009, 8, 18), cleftMat);
  cleft.position.y = 0.035;
  g.add(left, right, cleft);
  return g;
}

/**
 * Public factory: Builds a single centered 3D model for ANY biology element ID.
 * Shared 1:1 between the live 3D Bioreactor Chamber and the 3D Element Card Icon Renderer.
 */
export function createSingleElement3DModel(id, colorHex = '#38bdf8', opts = {}) {
  const { scale = 1, isDividing = false } = opts;

  if (id.startsWith('cell_') || id === 'mesenchymal_cells' || id === 'osteoclasts') {
    return createRealisticCellMesh(id, colorHex, scale, isDividing);
  }
  if (
    id === 'collagen_i' ||
    id === 'collagen_ii' ||
    id === 'comp_tendon_ecm' ||
    id === 'comp_gbm'
  ) {
    const colColor = id === 'collagen_ii' ? '#60a5fa' : id === 'comp_gbm' ? '#10b981' : '#f59e0b';
    const helix = createCollagenHelixGroup(colColor, 0.26 * scale, 0.055 * scale);
    helix.rotation.z = 0.45;
    return helix;
  }
  if (id === 'phosphate' || id === 'oxygen' || id === 'calcium') {
    const mol = createMoleculeCluster(id);
    mol.scale.setScalar(scale * 1.15);
    return mol;
  }
  const model = createSignalingOrMatrixModel(id, colorHex);
  model.scale.setScalar(scale * 1.15);
  return model;
}

/**
 * Builds realistic 3D biological elements inside the chamber during early/mid morphogenesis.
 * @param {string[]} elementIds - Active/infused element IDs
 * @param {object} opts - { progress: 0..1, cellColor, condenseRatio: 0..1 }
 */
export function buildRealisticElementCluster(elementIds, opts = {}) {
  const { progress = 0, cellColor = '#38bdf8', condenseRatio = progress } = opts;
  const group = new THREE.Group();
  const spread = 0.68 - condenseRatio * 0.42;

  elementIds.forEach((id, idx) => {
    const baseAngle = (idx / Math.max(1, elementIds.length)) * Math.PI * 2;

    if (id.startsWith('cell_') || id === 'mesenchymal_cells') {
      const count = 7 + Math.floor(progress * 7);
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i + baseAngle;
        const c = createRealisticCellMesh(id, cellColor, 0.88, progress > 0.12 && i % 3 === 0);
        c.position.set(
          Math.sin(phi) * Math.cos(theta) * spread * 0.72,
          Math.cos(phi) * spread * 0.85 - 0.08,
          Math.sin(phi) * Math.sin(theta) * spread * 0.72
        );
        c.rotation.set(i * 0.4, theta, 0);
        group.add(c);
      }
    } else if (
      id === 'collagen_i' ||
      id === 'collagen_ii' ||
      id === 'comp_tendon_ecm' ||
      id === 'comp_gbm'
    ) {
      const colColor = id === 'collagen_ii' ? '#60a5fa' : id === 'comp_gbm' ? '#10b981' : '#f59e0b';
      const helix = createCollagenHelixGroup(colColor, 1.15, 0.22 + (1 - condenseRatio) * 0.14);
      helix.position.y = -0.08;
      group.add(helix);
    } else if (id === 'phosphate' || id === 'oxygen' || id === 'calcium') {
      for (let m = 0; m < 7; m++) {
        const a = (m / 7) * Math.PI * 2 + baseAngle;
        const mol = createMoleculeCluster(id);
        mol.position.set(
          Math.cos(a) * (spread * 0.85),
          ((m % 5) - 2) * 0.24 - 0.08,
          Math.sin(a) * (spread * 0.85)
        );
        mol.rotation.set(m * 0.7, a, 0);
        group.add(mol);
      }
    } else if (id === 'osteoclasts') {
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2;
        const ocl = createRealisticCellMesh('osteoclasts', '#c084fc', 1.1, false);
        ocl.position.set(Math.cos(a) * 0.28, (k - 1.5) * 0.28 - 0.08, Math.sin(a) * 0.28);
        group.add(ocl);
      }
    } else {
      // Morphogens, Lipids, Myelin, ATP-Actin
      for (let m = 0; m < 6; m++) {
        const a = (m / 6) * Math.PI * 2 + baseAngle;
        const model = createSignalingOrMatrixModel(id, cellColor);
        model.position.set(
          Math.cos(a) * (spread + 0.08),
          ((m % 3) - 1) * 0.32 - 0.08,
          Math.sin(a) * (spread + 0.08)
        );
        model.rotation.set(m * 0.5, a, 0);
        group.add(model);
      }
    }
  });

  // Visual 3D Interaction Filaments (chemotactic signaling & mineral nucleation arcs)
  if (elementIds.length >= 2 && progress > 0.06) {
    const filamentMat = new THREE.MeshBasicMaterial({
      color: cellColor,
      transparent: true,
      opacity: 0.48,
    });
    const arcCount = Math.min(8, 3 + Math.floor(progress * 6));
    for (let i = 0; i < arcCount; i++) {
      const a1 = (i / arcCount) * Math.PI * 2;
      const a2 = a1 + 0.9;
      const y1 = ((i % 3) - 1) * 0.25 - 0.08;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(a1) * (spread + 0.1), y1, Math.sin(a1) * (spread + 0.1)),
        new THREE.Vector3(Math.cos((a1 + a2) * 0.5) * (spread * 0.45), y1 + 0.1, Math.sin((a1 + a2) * 0.5) * (spread * 0.45)),
        new THREE.Vector3(Math.cos(a2) * (spread * 0.35), y1 - 0.05, Math.sin(a2) * (spread * 0.35)),
      ]);
      group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.006, 5, false), filamentMat));
    }
  }

  return group;
}

/**
 * Builds branching 3D angiogenic capillary sprouts growing into the tissue core.
 */
export function buildVascularSproutTree(vascularRatio = 0.5) {
  const group = new THREE.Group();
  const vesselMat = new THREE.MeshStandardMaterial({
    color: '#ef4444',
    emissive: '#dc2626',
    emissiveIntensity: 0.55,
    roughness: 0.3,
  });

  const branches = Math.max(2, Math.round(vascularRatio * 8));
  for (let i = 0; i < branches; i++) {
    const a = (i / branches) * Math.PI * 2;
    const len = 0.25 + vascularRatio * 0.55;
    const yOff = ((i % 4) - 1.5) * 0.26 - 0.08;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a) * 0.42, yOff - 0.12, Math.sin(a) * 0.42),
      new THREE.Vector3(Math.cos(a + 0.25) * 0.24, yOff, Math.sin(a + 0.25) * 0.24),
      new THREE.Vector3(Math.cos(a - 0.15) * (0.28 - len * 0.28), yOff + 0.14 * vascularRatio, Math.sin(a - 0.15) * (0.28 - len * 0.28)),
    ]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.016, 6, false), vesselMat);
    group.add(tube);
  }
  return group;
}

/**
 * Applies a multi-stage morphogenetic material transition onto a loaded Z-Anatomy GLB organ:
 * - progress < 0.78: translucent holographic bio-scaffold + glowing wireframe morphing into shape
 * - 0.78 <= progress < 1.0: solidifying anatomical tissue
 * - isMatured: full hyper-realistic Z-Anatomy PBR materials
 */
export function applyMorphogeneticStageToOrgan(
  glb,
  { progress = 1, isMatured = true, zAnatomyId = 'cardiovascular_system', clipPlane = null, scaffoldColor = '#22d3ee' }
) {
  if (!glb) return;
  if (glb.userData.baseScale == null) {
    glb.userData.baseScale = glb.scale.x || 1;
  }

  if (isMatured || progress >= 0.96) {
    glb.scale.setScalar(glb.userData.baseScale * 0.88);
    if (glb.userData.isProceduralSkin) {
      glb.traverse((child) => {
        if (child.isMesh && child.userData.origMaterial) {
          child.material = child.userData.origMaterial;
        }
      });
      return;
    }
    applyOrganSubPartMaterials(glb, zAnatomyId, [], true, clipPlane);
    return;
  }

  // Emerging bio-scaffold phase (45% .. 95%)
  const phaseNorm = Math.max(0, Math.min(1, (progress - 0.42) / 0.54));
  const scaleFactor = 0.62 + phaseNorm * 0.26;
  glb.scale.setScalar(glb.userData.baseScale * scaleFactor);

  const isScaffoldWire = progress < 0.7;
  const mat = new THREE.MeshPhysicalMaterial({
    color: isScaffoldWire ? scaffoldColor : '#e2e8f0',
    emissive: scaffoldColor,
    emissiveIntensity: 0.65 - phaseNorm * 0.45,
    transparent: true,
    opacity: 0.28 + phaseNorm * 0.68,
    wireframe: isScaffoldWire,
    roughness: 0.35,
    clippingPlanes: clipPlane ? [clipPlane] : [],
    side: THREE.DoubleSide,
  });

  glb.traverse((child) => {
    if (child.isMesh) {
      if (glb.userData.isProceduralSkin && !child.userData.origMaterial) {
        child.userData.origMaterial = child.material;
      }
      child.material = mat;
    }
  });
}
