import { ALL_206_BONES } from '../data/humanSkeletalDatabase.js';

/**
 * High-Precision Anatomical Bone Matcher
 * Maps 3D GLTF mesh nodes from LUMC clinical CT scan (both raw GLTF names and
 * THREE.PropertyBinding.sanitizeNodeName strings where '.' is stripped and ' ' -> '_')
 * and procedural geometry to ALL_206_BONES.
 */

const BONE_BY_ID = new Map();
ALL_206_BONES.forEach((bone) => BONE_BY_ID.set(bone.id, bone));

/**
 * Restores a GLTFLoader-sanitized node name (e.g. 'Medial_cuneiform_boner' or 'Rib_1str')
 * into a normalized human-readable form with explicit '.r' / '.l' suffix when applicable.
 */
export function normalizeGLTFNodeName(rawInput, parentGroupName = '') {
  if (!rawInput) return '';
  let s = String(rawInput).trim();

  // Direct bone IDs should stay untouched
  if (BONE_BY_ID.has(s)) return s;

  // Replace underscores with spaces except for explicit _l / _r suffixes
  const hasExplicitLeft = /(\.l\.?$|\bleft\b|_l$)/i.test(s);
  const hasExplicitRight = /(\.r\.?$|\bright\b|_r$)/i.test(s);

  let cleaned = s.replace(/_/g, ' ');

  if (!hasExplicitLeft && !hasExplicitRight) {
    const parentLower = String(parentGroupName || '').toLowerCase();
    if (parentLower.includes('bones_right') || parentLower.includes('cartilages_right')) {
      // Strip trailing 'r' if GLTFLoader merged '.r' into the word (e.g. 'Femurr' -> 'Femur.r')
      cleaned = cleaned.replace(/r$/i, '') + '.r';
    } else if (parentLower.includes('bones_left') || parentLower.includes('cartilages_left') || parentLower.includes('mirroredleft')) {
      cleaned = cleaned.replace(/[rl]$/i, '') + '.l';
    } else if (
      /(bone|muscle|artery|vein|nerve|ligament|fascia|bursa|tendon|head|part|belly|femur|tibia|fibula|humerus|radius|ulna|clavicle|scapula|patella|talus|calcaneus|scaphoid|capitate|hamate|pisiform|trapezium|trapezoid|triquetrum|finger|foot|hand|canine|incisor|premolar|tooth|\))[rl]$/i.test(
        cleaned
      )
    ) {
      const sideChar = cleaned.slice(-1).toLowerCase();
      cleaned = cleaned.slice(0, -1) + '.' + sideChar;
    }
  }

  return cleaned;
}

/**
 * Determines whether a Three.js Object3D or node name belongs to the right side of the body.
 */
export function isRightSideAnatomyNode(nodeOrName) {
  if (!nodeOrName) return false;
  if (typeof nodeOrName === 'object') {
    let curr = nodeOrName.parent;
    while (curr) {
      const pName = (curr.name || '').toLowerCase();
      if (pName.includes('bones_right') || pName.includes('cartilages_right')) return true;
      if (pName.includes('mirroredleft') || pName.includes('bones_left')) return false;
      curr = curr.parent;
    }
    const raw = nodeOrName.userData?.name || nodeOrName.name || '';
    const norm = normalizeGLTFNodeName(raw, nodeOrName.parent?.name);
    return /(\.r\.?$|\bright\b|_r$)/i.test(norm);
  }
  const norm = normalizeGLTFNodeName(String(nodeOrName));
  return /(\.r\.?$|\bright\b|_r$)/i.test(norm);
}

/**
 * Match a 3D Mesh name (raw or GLTFLoader-sanitized) to a bone entry from ALL_206_BONES
 * @param {string} rawNodeName
 * @param {string} [parentGroupName]
 * @returns {object|null}
 */
export function matchMeshToBone(rawNodeName, parentGroupName = '') {
  if (!rawNodeName) return null;

  // Direct ID check if node was assigned id
  if (BONE_BY_ID.has(rawNodeName)) {
    return BONE_BY_ID.get(rawNodeName);
  }

  const normalized = normalizeGLTFNodeName(rawNodeName, parentGroupName);
  const n = normalized.toLowerCase();

  const nodeIsLeft = /(\.l\.?$|\bleft\b|\bl\b|_l$)/i.test(n);

  // 1. Vertebrae
  if (n.includes('atlas') || n.includes('c1')) return BONE_BY_ID.get('vertebra_c1') || null;
  if (n.includes('axis') || n.includes('c2')) return BONE_BY_ID.get('vertebra_c2') || null;
  if (n.includes('cervical')) {
    const m = n.match(/c(\d+)/);
    if (m) return BONE_BY_ID.get(`vertebra_c${m[1]}`) || null;
  }
  if (n.includes('thoracic')) {
    const m = n.match(/t(\d+)/);
    if (m) return BONE_BY_ID.get(`vertebra_t${m[1]}`) || null;
  }
  if (n.includes('lumbar')) {
    const m = n.match(/l(\d+)/);
    if (m) return BONE_BY_ID.get(`vertebra_l${m[1]}`) || null;
  }

  // 2. Cranium & Face
  if (n.includes('frontal')) return BONE_BY_ID.get('frontal_bone') || null;
  if (n.includes('occipital')) return BONE_BY_ID.get('occipital_bone') || null;
  if (n.includes('sphenoid')) return BONE_BY_ID.get('sphenoid_bone') || null;
  if (n.includes('ethmoid')) return BONE_BY_ID.get('ethmoid_bone') || null;
  if (n.includes('mandible')) return BONE_BY_ID.get('mandible') || null;
  if (n.includes('vomer')) return BONE_BY_ID.get('vomer') || null;
  if (n.includes('sacrum')) return BONE_BY_ID.get('sacrum') || null;
  if (n.includes('coccyx')) return BONE_BY_ID.get('coccyx') || null;

  // Parietal & Temporal
  if (n.includes('parietal')) {
    return nodeIsLeft ? BONE_BY_ID.get('parietal_bone_l') : BONE_BY_ID.get('parietal_bone_r');
  }
  if (n.includes('temporal')) {
    return nodeIsLeft ? BONE_BY_ID.get('temporal_bone_l') : BONE_BY_ID.get('temporal_bone_r');
  }

  // Facial Bones
  if (n.includes('maxilla')) return nodeIsLeft ? BONE_BY_ID.get('maxilla_l') : BONE_BY_ID.get('maxilla_r');
  if (n.includes('zygomatic')) return nodeIsLeft ? BONE_BY_ID.get('zygomatic_l') : BONE_BY_ID.get('zygomatic_r');
  if (n.includes('nasal') && !n.includes('concha')) return nodeIsLeft ? BONE_BY_ID.get('nasal_l') : BONE_BY_ID.get('nasal_r');
  if (n.includes('lacrimal')) return nodeIsLeft ? BONE_BY_ID.get('lacrimal_l') : BONE_BY_ID.get('lacrimal_r');
  if (n.includes('palatine')) return nodeIsLeft ? BONE_BY_ID.get('palatine_l') : BONE_BY_ID.get('palatine_r');
  if (n.includes('concha')) return nodeIsLeft ? BONE_BY_ID.get('nasal_concha_l') : BONE_BY_ID.get('nasal_concha_r');

  // Sternum
  if (n.includes('sternum') || n.includes('manubrium') || n.includes('gladiolus') || n.includes('xiphoid')) {
    return BONE_BY_ID.get('sternum') || null;
  }

  // 3. Ribs
  if (n.includes('rib') && !n.includes('cart')) {
    const numMatch = n.match(/(\d+)/);
    if (numMatch) {
      const ribId = `rib_${numMatch[1]}_${nodeIsLeft ? 'l' : 'r'}`;
      if (BONE_BY_ID.has(ribId)) return BONE_BY_ID.get(ribId);
    }
  }

  // 4. Upper Limb & Pectoral Girdle
  if (n.includes('clavicle')) return nodeIsLeft ? BONE_BY_ID.get('clavicle_l') : BONE_BY_ID.get('clavicle_r');
  if (n.includes('scapula')) return nodeIsLeft ? BONE_BY_ID.get('scapula_l') : BONE_BY_ID.get('scapula_r');
  if (n.includes('humerus')) return nodeIsLeft ? BONE_BY_ID.get('humerus_l') : BONE_BY_ID.get('humerus_r');
  if (n.includes('radius')) return nodeIsLeft ? BONE_BY_ID.get('radius_l') : BONE_BY_ID.get('radius_r');
  if (n.includes('ulna')) return nodeIsLeft ? BONE_BY_ID.get('ulna_l') : BONE_BY_ID.get('ulna_r');

  // Carpals
  const carpals = ['scaphoid', 'lunate', 'triquetrum', 'pisiform', 'trapezium', 'trapezoid', 'capitate', 'hamate'];
  for (const carpal of carpals) {
    if (n.includes(carpal)) {
      const id = `${carpal}_${nodeIsLeft ? 'l' : 'r'}`;
      if (BONE_BY_ID.has(id)) return BONE_BY_ID.get(id);
    }
  }

  // Metacarpals
  if (n.includes('metacarpal')) {
    const m = n.match(/(\d+)/);
    if (m) {
      const id = `metacarpal_${m[1]}_${nodeIsLeft ? 'l' : 'r'}`;
      if (BONE_BY_ID.has(id)) return BONE_BY_ID.get(id);
    }
  }

  // Hand Phalanges
  if (n.includes('finger') && !n.includes('foot')) {
    const fingerNum =
      n.match(/(\d+)/)?.[1] ||
      (n.includes('first')
        ? '1'
        : n.includes('second')
        ? '2'
        : n.includes('third')
        ? '3'
        : n.includes('fourth')
        ? '4'
        : n.includes('fifth')
        ? '5'
        : null);
    if (fingerNum) {
      const side = nodeIsLeft ? 'l' : 'r';
      if (n.includes('distal')) return BONE_BY_ID.get(`phalanx_hand_distal_${fingerNum}_${side}`) || null;
      if (n.includes('middle')) return BONE_BY_ID.get(`phalanx_hand_middle_${fingerNum}_${side}`) || null;
      if (n.includes('proximal')) return BONE_BY_ID.get(`phalanx_hand_proximal_${fingerNum}_${side}`) || null;
    }
  }

  // 5. Lower Limb & Pelvic Girdle
  if (n.includes('hip') || n.includes('pelvis') || n.includes('os coxae')) {
    return nodeIsLeft ? BONE_BY_ID.get('pelvis_l') : BONE_BY_ID.get('pelvis_r');
  }
  if (n.includes('femur')) return nodeIsLeft ? BONE_BY_ID.get('femur_l') : BONE_BY_ID.get('femur_r');
  if (n.includes('patella')) return nodeIsLeft ? BONE_BY_ID.get('patella_l') : BONE_BY_ID.get('patella_r');
  if (n.includes('tibia') && !n.includes('fibula')) return nodeIsLeft ? BONE_BY_ID.get('tibia_l') : BONE_BY_ID.get('tibia_r');
  if (n.includes('fibula')) return nodeIsLeft ? BONE_BY_ID.get('fibula_l') : BONE_BY_ID.get('fibula_r');

  // Tarsals
  if (n.includes('talus')) return nodeIsLeft ? BONE_BY_ID.get('talus_l') : BONE_BY_ID.get('talus_r');
  if (n.includes('calcaneus')) return nodeIsLeft ? BONE_BY_ID.get('calcaneus_l') : BONE_BY_ID.get('calcaneus_r');
  if (n.includes('cuboid')) return nodeIsLeft ? BONE_BY_ID.get('cuboid_l') : BONE_BY_ID.get('cuboid_r');
  if (n.includes('navicular')) return nodeIsLeft ? BONE_BY_ID.get('navicular_l') : BONE_BY_ID.get('navicular_r');
  if (n.includes('medial') && n.includes('cuneiform')) return nodeIsLeft ? BONE_BY_ID.get('medial_cuneiform_l') : BONE_BY_ID.get('medial_cuneiform_r');
  if (n.includes('intermediate') && n.includes('cuneiform')) return nodeIsLeft ? BONE_BY_ID.get('intermediate_cuneiform_l') : BONE_BY_ID.get('intermediate_cuneiform_r');
  if (n.includes('lateral') && n.includes('cuneiform')) return nodeIsLeft ? BONE_BY_ID.get('lateral_cuneiform_l') : BONE_BY_ID.get('lateral_cuneiform_r');

  // Metatarsals
  if (n.includes('metatarsal')) {
    const wordNums = { first: '1', second: '2', third: '3', fourth: '4', fifth: '5', '1st': '1', '2nd': '2', '3rd': '3', '4th': '4', '5th': '5' };
    let num = null;
    for (const [w, val] of Object.entries(wordNums)) {
      if (n.includes(w)) {
        num = val;
        break;
      }
    }
    if (num) {
      const id = `metatarsal_${num}_${nodeIsLeft ? 'l' : 'r'}`;
      if (BONE_BY_ID.has(id)) return BONE_BY_ID.get(id);
    }
  }

  // Foot Phalanges
  if (n.includes('foot') || n.includes('toe')) {
    const wordNums = { first: '1', second: '2', third: '3', fourth: '4', fifth: '5', '1st': '1', '2nd': '2', '3rd': '3', '4th': '4', '5th': '5' };
    let fingerNum = null;
    for (const [w, val] of Object.entries(wordNums)) {
      if (n.includes(w)) {
        fingerNum = val;
        break;
      }
    }
    if (fingerNum) {
      const side = nodeIsLeft ? 'l' : 'r';
      if (n.includes('distal')) return BONE_BY_ID.get(`phalanx_foot_distal_${fingerNum}_${side}`) || null;
      if (n.includes('middle')) return BONE_BY_ID.get(`phalanx_foot_middle_${fingerNum}_${side}`) || null;
      if (n.includes('proximal')) return BONE_BY_ID.get(`phalanx_foot_proximal_${fingerNum}_${side}`) || null;
    }
  }

  // Auditory ossicles & hyoid
  if (n.includes('malleus')) return nodeIsLeft ? BONE_BY_ID.get('malleus_l') : BONE_BY_ID.get('malleus_r');
  if (n.includes('incus')) return nodeIsLeft ? BONE_BY_ID.get('incus_l') : BONE_BY_ID.get('incus_r');
  if (n.includes('stapes')) return nodeIsLeft ? BONE_BY_ID.get('stapes_l') : BONE_BY_ID.get('stapes_r');
  if (n.includes('hyoid')) return BONE_BY_ID.get('hyoid_bone') || null;

  return null;
}
