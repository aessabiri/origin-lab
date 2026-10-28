import * as THREE from 'three';

/**
 * Photorealistic Studio PBR Medical Materials & Hologram Shaders
 * Medical-grade anatomical shaders for bone, cartilage, striated muscle, dense tendon, nerve myelin, and ghost assembly holograms.
 */
export function createMedicalMaterials() {
  // 1. Warm Cortical Bone (Medical-grade museum osteology)
  const corticalBone = new THREE.MeshPhysicalMaterial({
    color: 0xded6c8,
    roughness: 0.38,
    metalness: 0.04,
    clearcoat: 0.20,
    clearcoatRoughness: 0.35,
    reflectivity: 0.5,
  });

  // Highlighted Selected Bone (Gold / Amber Rim)
  const boneSelected = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xd97706,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.5,
  });

  // Ghost Hologram (Translucent Neon Cyan for Unplaced Bones)
  const ghostBone = new THREE.MeshPhysicalMaterial({
    color: 0x22d3ee,
    emissive: 0x0891b2,
    emissiveIntensity: 0.35,
    roughness: 0.1,
    transmission: 0.85,
    transparent: true,
    opacity: 0.30,
    wireframe: false,
    ior: 1.15,
  });

  // 2. Hyaline Articular Cartilage & Costal Discs (Translucent ice-blue)
  const hyalineCartilage = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    roughness: 0.25,
    metalness: 0.05,
    transmission: 0.35,
    transparent: true,
    opacity: 0.88,
    ior: 1.45,
  });

  // 3. Striated Skeletal Muscle (Deep crimson with anatomical fibrous sheen)
  const striatedMuscle = new THREE.MeshPhysicalMaterial({
    color: 0x9b1c1c,
    roughness: 0.52,
    metalness: 0.10,
    sheen: 0.45,
    sheenColor: new THREE.Color(0xff6b6b),
    clearcoat: 0.08,
  });

  // Hypertonic / Spastic Overactive Muscle (Warm Amber-Red Heatmap)
  const muscleTight = new THREE.MeshPhysicalMaterial({
    color: 0xef4444,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.35,
    roughness: 0.45,
    metalness: 0.15,
    sheen: 0.6,
    sheenColor: new THREE.Color(0xfca5a5),
  });

  // Inhibited / Atrophied Underactive Muscle (Cool Cyan-Blue Heatmap)
  const muscleWeak = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    emissive: 0x0c4a6e,
    emissiveIntensity: 0.3,
    roughness: 0.48,
    metalness: 0.12,
    sheen: 0.5,
    sheenColor: new THREE.Color(0x7dd3fc),
  });

  // 4. Dense Fibrous Tendon & Ligament (Pearly white fascia)
  const denseTendon = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    roughness: 0.32,
    metalness: 0.08,
    clearcoat: 0.25,
    clearcoatRoughness: 0.3,
  });

  const ligamentFascia = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    roughness: 0.38,
    metalness: 0.06,
    transmission: 0.2,
    transparent: true,
    opacity: 0.9,
  });

  // 5. Myelinated Nerve Tracts & Neocortex (Luminescent amber-gold)
  const nerveMyelin = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xb45309,
    emissiveIntensity: 0.55,
    roughness: 0.20,
    metalness: 0.20,
  });

  // 6. Vascular Loop (Arterial crimson and Venous azure)
  const arteryBlood = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    emissive: 0x991b1b,
    emissiveIntensity: 0.4,
    roughness: 0.3,
    clearcoat: 0.6,
  });

  const veinBlood = new THREE.MeshPhysicalMaterial({
    color: 0x2563eb,
    emissive: 0x1e40af,
    emissiveIntensity: 0.35,
    roughness: 0.3,
    clearcoat: 0.6,
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
    arteryBlood,
    veinBlood,
  };
}
