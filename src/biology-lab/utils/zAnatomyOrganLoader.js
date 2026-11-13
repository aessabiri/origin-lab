import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { TIER_1_ORGAN_SYSTEMS } from '../data/topDownBioHierarchy.js';

const gltfCache = new Map();
let sharedLoader = null;

function getLoader() {
  if (!sharedLoader) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    sharedLoader = new GLTFLoader();
    sharedLoader.setDRACOLoader(dracoLoader);
  }
  return sharedLoader;
}

/**
 * Classifies a Z-Anatomy mesh name into one of the 4 organ sub-part IDs for part-by-part assembly.
 */
export function classifyMeshToOrganSubPart(systemId, meshName = '') {
  const n = meshName.toLowerCase();
  if (systemId === 'cardiovascular_system') {
    if (n.includes('ventricle') || n.includes('papillary') || n.includes('interventricular')) {
      return 'cardio_ventricles';
    }
    if (n.includes('atrium') || n.includes('auricle') || n.includes('pectinate')) {
      return 'cardio_atria';
    }
    if (n.includes('valve') || n.includes('cusp') || n.includes('chordae') || n.includes('fibrous')) {
      return 'cardio_valves';
    }
    return 'cardio_vessels';
  }

  if (systemId === 'visceral_system') {
    if (n.includes('trachea') || n.includes('bronch') || n.includes('laryn') || n.includes('cartilage')) {
      return 'visc_airway';
    }
    if (n.includes('lung') || n.includes('pulmon') || n.includes('lobe of right lung') || n.includes('lobe of left lung')) {
      return 'visc_lungs';
    }
    if (n.includes('liver') || n.includes('hepat') || n.includes('gallbladder') || n.includes('cystic') || n.includes('bile')) {
      return 'visc_liver';
    }
    return 'visc_gi_renal';
  }

  if (systemId === 'nervous_system') {
    if (n.includes('cerebr') || n.includes('gyrus') || n.includes('frontal') || n.includes('parietal') || n.includes('temporal') || n.includes('occipital') || n.includes('cortex')) {
      return 'nerv_cortex';
    }
    if (n.includes('cerebell') || n.includes('pons') || n.includes('medulla') || n.includes('midbrain') || n.includes('peduncle')) {
      return 'nerv_cerebellum';
    }
    if (n.includes('thalam') || n.includes('hippocamp') || n.includes('callosum') || n.includes('fornix') || n.includes('caudate') || n.includes('putamen') || n.includes('ventricle')) {
      return 'nerv_limbic';
    }
    return 'nerv_spinal';
  }

  if (systemId === 'muscular_system') {
    if (n.includes('ligament') || n.includes('capsule') || n.includes('meniscus') || n.includes('disc')) {
      return 'musc_ligaments';
    }
    if (n.includes('brachi') || n.includes('deltoid') || n.includes('carpi') || n.includes('triceps')) {
      return 'musc_upper';
    }
    if (n.includes('femor') || n.includes('tibia') || n.includes('gastrocnemius') || n.includes('soleus') || n.includes('glute')) {
      return 'musc_lower';
    }
    return 'musc_axial';
  }

  // skeletal_system
  if (n.includes('skull') || n.includes('frontal') || n.includes('parietal') || n.includes('temporal') || n.includes('occipital') || n.includes('mandible') || n.includes('maxilla') || n.includes('zygomatic')) {
    return 'skel_cranium';
  }
  if (n.includes('vertebra') || n.includes('rib') || n.includes('sternum') || n.includes('sacrum') || n.includes('atlas') || n.includes('axis')) {
    return 'skel_spine_ribs';
  }
  if (n.includes('humerus') || n.includes('radius') || n.includes('ulna') || n.includes('scapula') || n.includes('clavicle') || n.includes('carpal') || n.includes('metacarpal')) {
    return 'skel_upper_limbs';
  }
  return 'skel_lower_limbs';
}

/**
 * Filters a Z-Anatomy GLB scene so that for Cardiovascular & Nervous we focus on the
 * central organ (Heart & Great Vessels / Brain & Brainstem) rather than the full 1.7m body span,
 * making the organ fill the Biology Lab 3D viewport in high definition!
 */
function shouldIncludeMeshInFocusedOrganView(systemId, meshName = '', boxCenterY = 1.0) {
  const n = meshName.toLowerCase();
  if (
    /\b(penis|glans penis|corpus cavernosum|corpus spongiosum|testis|testicular|epididymis|scrotum|prepuce)\b/i.test(
      n
    )
  ) {
    return false;
  }
  if (systemId === 'cardiovascular_system') {
    // Focus on Heart chambers, valves, coronary vessels, aorta, vena cava, pulmonary trunk (Thoracic Y: 1.10m - 1.48m)
    const isCardiacName =
      n.includes('ventricle') ||
      n.includes('atrium') ||
      n.includes('auricle') ||
      n.includes('valve') ||
      n.includes('cusp') ||
      n.includes('coronary') ||
      n.includes('cardiac') ||
      n.includes('aort') ||
      n.includes('vena cava') ||
      n.includes('pulmonary') ||
      n.includes('pericard') ||
      n.includes('papillary') ||
      n.includes('chordae') ||
      n.includes('interventricular');
    return isCardiacName || (boxCenterY >= 1.15 && boxCenterY <= 1.42);
  }

  if (systemId === 'nervous_system') {
    // Focus on Brain, Cerebellum, Brainstem, Cranial nerves & Cervical Spinal Cord (Y >= 1.38m)
    return boxCenterY >= 1.38;
  }

  return true;
}

/**
 * Loads, caches, centers, and normalizes the real Z-Anatomy GLB model for a given Tier-1 Organ System.
 */
export async function loadZAnatomyOrganModel(systemId) {
  const sys =
    TIER_1_ORGAN_SYSTEMS.find((s) => s.id === systemId) || TIER_1_ORGAN_SYSTEMS[0];
  const url = sys.glbModel;

  if (!gltfCache.has(url)) {
    const loader = getLoader();
    const gltf = await new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });
    gltfCache.set(url, gltf.scene);
  }

  const cachedScene = gltfCache.get(url);
  const organGroup = new THREE.Group();
  const combinedBox = new THREE.Box3();

  cachedScene.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    const rawName = child.userData?.za_name || child.name || '';
    if (!child.geometry.boundingBox) {
      child.geometry.computeBoundingBox();
    }
    const center = new THREE.Vector3();
    child.geometry.boundingBox.getCenter(center);

    if (!shouldIncludeMeshInFocusedOrganView(systemId, rawName, center.y)) {
      return;
    }

    const meshClone = child.clone();
    meshClone.name = rawName;
    meshClone.userData.subPartId = classifyMeshToOrganSubPart(systemId, rawName);
    organGroup.add(meshClone);
    combinedBox.expandByObject(meshClone);
  });

  if (organGroup.children.length > 0 && !combinedBox.isEmpty()) {
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    combinedBox.getCenter(center);
    combinedBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 0.05);
    const targetScale = 2.35 / maxDim;

    organGroup.children.forEach((m) => {
      m.position.sub(center);
    });
    organGroup.scale.setScalar(targetScale);
  }

  return organGroup;
}

/**
 * Applies solid clinical PBR materials to assembled sub-parts and translucent cyan
 * wireframe blueprint materials to un-snapped sub-parts.
 */
export function applyOrganSubPartMaterials(
  organGroup,
  systemId,
  assembledSubParts = [],
  allComplete = false,
  clippingPlane = null
) {
  const clipPlanes = clippingPlane ? [clippingPlane] : [];

  organGroup.traverse((child) => {
    if (!child.isMesh) return;
    const subPartId =
      child.userData?.subPartId || classifyMeshToOrganSubPart(systemId, child.name);
    const isSnapped = allComplete || assembledSubParts.includes(subPartId);
    const n = (child.name || '').toLowerCase();

    if (!isSnapped) {
      child.material = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
        clippingPlanes: clipPlanes
      });
      return;
    }

    // Clinical Subsurface-Scattered PBR Material by tissue type
    let color = 0x38bdf8;
    let emissive = 0x0c4a6e;
    let roughness = 0.28;
    let transmission = 0.0;
    let opacity = 1.0;

    if (systemId === 'cardiovascular_system') {
      if (n.includes('vein') || n.includes('vena') || n.includes('right atrium') || n.includes('right ventricle')) {
        color = 0x2563eb;
        emissive = 0x1e3a8a;
      } else if (n.includes('valve') || n.includes('cusp') || n.includes('chordae')) {
        color = 0xfef3c7;
        emissive = 0x78350f;
      } else if (n.includes('coronary')) {
        color = 0xfbbf24;
        emissive = 0xb45309;
      } else {
        color = 0xdc2626;
        emissive = 0x7f1d1d;
      }
    } else if (systemId === 'visceral_system') {
      if (n.includes('trachea') || n.includes('bronch') || n.includes('cartilage')) {
        color = 0x7dd3fc;
        emissive = 0x0369a1;
      } else if (n.includes('lung')) {
        color = 0xf472b6;
        emissive = 0x831843;
        transmission = 0.45;
        opacity = 0.85;
      } else if (n.includes('liver') || n.includes('hepat')) {
        color = 0x991b1b;
        emissive = 0x450a0a;
      } else if (n.includes('gallbladder') || n.includes('bile')) {
        color = 0x10b981;
        emissive = 0x064e3b;
      } else {
        color = 0xfb7185;
        emissive = 0x881337;
      }
    } else if (systemId === 'nervous_system') {
      if (n.includes('ventricle') || n.includes('choroid')) {
        color = 0x38bdf8;
        emissive = 0x0284c7;
      } else if (n.includes('nerve') || n.includes('spinal') || n.includes('tract')) {
        color = 0xfacc15;
        emissive = 0x854d0e;
      } else {
        color = 0xf59e0b;
        emissive = 0x78350f;
      }
    } else if (systemId === 'muscular_system') {
      if (n.includes('ligament') || n.includes('tendon') || n.includes('capsule')) {
        color = 0xe2e8f0;
        emissive = 0x334155;
      } else {
        color = 0xe11d48;
        emissive = 0x881337;
      }
    } else {
      // skeletal_system
      color = 0xf8fafc;
      emissive = 0x1e293b;
      roughness = 0.25;
    }

    child.material = new THREE.MeshPhysicalMaterial({
      color,
      emissive,
      emissiveIntensity: 0.28,
      roughness,
      transmission,
      transparent: opacity < 1.0,
      opacity,
      clearcoat: 0.85,
      side: THREE.DoubleSide,
      clippingPlanes: clipPlanes,
      clipShadows: true
    });
  });
}
