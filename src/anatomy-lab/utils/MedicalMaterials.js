import * as THREE from 'three';

/**
 * Photorealistic Studio PBR Medical Materials & Subsurface-Approximated Shaders
 * Uses DoubleSide rendering to guarantee zero normal-inversion artifacts on bilaterally mirrored limbs (.l).
 */
export function createMedicalMaterials() {
  // 1. Warm Cortical Bone (Medical-grade museum osteology with periosteal sheen)
  const corticalBone = new THREE.MeshPhysicalMaterial({
    color: 0xe5dec9,
    roughness: 0.34,
    metalness: 0.03,
    clearcoat: 0.24,
    clearcoatRoughness: 0.32,
    reflectivity: 0.55,
    side: THREE.DoubleSide,
  });

  // Highlighted Selected Bone (Gold / Amber Rim)
  const boneSelected = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xd97706,
    emissiveIntensity: 0.5,
    roughness: 0.22,
    metalness: 0.1,
    clearcoat: 0.55,
    side: THREE.DoubleSide,
  });

  // Ghost Hologram (Translucent Neon Cyan for Unplaced Bones)
  const ghostBone = new THREE.MeshPhysicalMaterial({
    color: 0x22d3ee,
    emissive: 0x0891b2,
    emissiveIntensity: 0.38,
    roughness: 0.15,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  // 2. Hyaline Articular Cartilage & Costal Discs (Translucent ice-blue)
  const hyalineCartilage = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.12,
    roughness: 0.22,
    metalness: 0.04,
    clearcoat: 0.6,
    transparent: true,
    opacity: 0.86,
    side: THREE.DoubleSide,
  });

  // 3. Striated Skeletal Muscle (Deep crimson with anisotropic-like fibrous sheen)
  const striatedMuscle = new THREE.MeshPhysicalMaterial({
    color: 0x991b1b,
    emissive: 0x450a0a,
    emissiveIntensity: 0.12,
    roughness: 0.48,
    metalness: 0.08,
    sheen: 0.55,
    sheenColor: new THREE.Color(0xfca5a5),
    clearcoat: 0.15,
    side: THREE.DoubleSide,
  });

  // Hypertonic / Spastic Overactive Muscle (Warm Amber-Red Heatmap)
  const muscleTight = new THREE.MeshPhysicalMaterial({
    color: 0xef4444,
    emissive: 0x991b1b,
    emissiveIntensity: 0.45,
    roughness: 0.4,
    metalness: 0.12,
    sheen: 0.65,
    sheenColor: new THREE.Color(0xfecaca),
    side: THREE.DoubleSide,
  });

  // Inhibited / Atrophied Underactive Muscle (Cool Cyan-Blue Heatmap)
  const muscleWeak = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    emissive: 0x075985,
    emissiveIntensity: 0.38,
    roughness: 0.44,
    metalness: 0.1,
    sheen: 0.5,
    sheenColor: new THREE.Color(0xbae6fd),
    side: THREE.DoubleSide,
  });

  // 4. Dense Fibrous Tendon, Ligament & Fascia (Pearly collagenous white)
  const denseTendon = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    emissive: 0x334155,
    emissiveIntensity: 0.1,
    roughness: 0.28,
    metalness: 0.06,
    clearcoat: 0.35,
    clearcoatRoughness: 0.25,
    side: THREE.DoubleSide,
  });

  const ligamentFascia = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    roughness: 0.34,
    metalness: 0.05,
    clearcoat: 0.3,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
  });

  // 5. Myelinated Nerve Tracts & Plexuses (Bio-luminescent golden-amber)
  const nerveMyelin = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.55,
    roughness: 0.24,
    metalness: 0.15,
    clearcoat: 0.4,
    side: THREE.DoubleSide,
  });

  // 6. Cortical Brain Grey/White Matter (Gyri-folded neocortex with subtle neural glow)
  const corticalBrainMatter = new THREE.MeshPhysicalMaterial({
    color: 0xf4b8c4,
    emissive: 0x831843,
    emissiveIntensity: 0.22,
    roughness: 0.36,
    metalness: 0.04,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
    sheen: 0.45,
    sheenColor: new THREE.Color(0xfde047),
    side: THREE.DoubleSide,
  });

  // 7. Cardiac Myocardium (Wet, glossy epicardial muscle wall)
  const cardiacMyocardium = new THREE.MeshPhysicalMaterial({
    color: 0xb91c1c,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.32,
    roughness: 0.26,
    metalness: 0.08,
    clearcoat: 0.85,
    clearcoatRoughness: 0.15,
    sheen: 0.6,
    sheenColor: new THREE.Color(0xf87171),
    side: THREE.DoubleSide,
  });

  // 8. Vascular Tree (Oxygenated Arterial Crimson & Deoxygenated Venous Azure)
  const arteryBlood = new THREE.MeshPhysicalMaterial({
    color: 0xef4444,
    emissive: 0x991b1b,
    emissiveIntensity: 0.42,
    roughness: 0.25,
    clearcoat: 0.75,
    side: THREE.DoubleSide,
  });

  const veinBlood = new THREE.MeshPhysicalMaterial({
    color: 0x3b82f6,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.38,
    roughness: 0.28,
    clearcoat: 0.7,
    side: THREE.DoubleSide,
  });

  return {
    corticalBone,
    boneSelected,
    ghostBone,
    hyalineCartilage,
    striatedMuscle,
    muscleTight,
    muscleWeak,
    denseTendon,
    ligamentFascia,
    nerveMyelin,
    corticalBrainMatter,
    cardiacMyocardium,
    arteryBlood,
    veinBlood,
  };
}
