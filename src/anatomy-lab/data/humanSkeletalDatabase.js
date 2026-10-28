/**
 * Comprehensive Human Skeletal Database (All 206 Individual Bones)
 * Categorized anatomically with Latin nomenclature, articulation landmarks,
 * ossification type, and biomechanical load-bearing function.
 */

export const SKELETAL_REGIONS = {
  AXIAL: 'Axial Skeleton (80 Bones)',
  APPENDICULAR: 'Appendicular Skeleton (126 Bones)',
};

export const BONE_SUBGROUPS = {
  // Axial
  CRANIUM: { id: 'cranium', name: 'Cranium (Neurocranium)', count: 8, region: 'axial' },
  FACE: { id: 'face', name: 'Facial Bones (Viscerocranium)', count: 14, region: 'axial' },
  AUDITORY: { id: 'auditory', name: 'Auditory Ossicles (Middle Ear)', count: 6, region: 'axial' },
  HYOID: { id: 'hyoid', name: 'Hyoid Apparatus', count: 1, region: 'axial' },
  VERTEBRAE_CERVICAL: { id: 'vertebrae_cervical', name: 'Cervical Spine (C1–C7)', count: 7, region: 'axial' },
  VERTEBRAE_THORACIC: { id: 'vertebrae_thoracic', name: 'Thoracic Spine (T1–T12)', count: 12, region: 'axial' },
  VERTEBRAE_LUMBAR: { id: 'vertebrae_lumbar', name: 'Lumbar Spine (L1–L5)', count: 5, region: 'axial' },
  SACRUM_COCCYX: { id: 'sacrum_coccyx', name: 'Sacrum & Coccyx', count: 2, region: 'axial' },
  STERNUM: { id: 'sternum', name: 'Sternum (Breastbone)', count: 1, region: 'axial' },
  RIBS: { id: 'ribs', name: 'Ribcage (12 Pairs)', count: 24, region: 'axial' },

  // Appendicular - Upper
  PECTORAL: { id: 'pectoral', name: 'Pectoral Girdle (Shoulder)', count: 4, region: 'appendicular' },
  ARM_UPPER: { id: 'arm_upper', name: 'Humerus (Upper Arm)', count: 2, region: 'appendicular' },
  FOREARM: { id: 'forearm', name: 'Radius & Ulna (Forearm)', count: 4, region: 'appendicular' },
  CARPALS: { id: 'carpals', name: 'Carpal Bones (Wrist)', count: 16, region: 'appendicular' },
  METACARPALS: { id: 'metacarpals', name: 'Metacarpal Bones (Palm)', count: 10, region: 'appendicular' },
  HAND_PHALANGES: { id: 'hand_phalanges', name: 'Hand Phalanges (Fingers)', count: 28, region: 'appendicular' },

  // Appendicular - Lower
  PELVIS: { id: 'pelvis', name: 'Pelvic Girdle (Os Coxae)', count: 2, region: 'appendicular' },
  THIGH: { id: 'thigh', name: 'Femur (Thigh)', count: 2, region: 'appendicular' },
  PATELLA: { id: 'patella', name: 'Patella (Kneecap)', count: 2, region: 'appendicular' },
  LEG_LOWER: { id: 'leg_lower', name: 'Tibia & Fibula (Shin)', count: 4, region: 'appendicular' },
  TARSALS: { id: 'tarsals', name: 'Tarsal Bones (Ankle & Heel)', count: 14, region: 'appendicular' },
  METATARSALS: { id: 'metatarsals', name: 'Metatarsal Bones (Foot Arch)', count: 10, region: 'appendicular' },
  FOOT_PHALANGES: { id: 'foot_phalanges', name: 'Foot Phalanges (Toes)', count: 28, region: 'appendicular' },
};

export const ALL_206_BONES = [
  // ==========================================
  // AXIAL: CRANIUM (8)
  // ==========================================
  {
    id: 'frontal_bone',
    name: 'Frontal Bone',
    latinName: 'Os frontale',
    region: 'axial',
    subgroup: 'cranium',
    side: 'axial',
    ossification: 'intramembranous',
    landmarks: 'Supraorbital margin, Glabella, Frontal sinus',
    articulations: ['parietal_l', 'parietal_r', 'sphenoid_bone', 'ethmoid_bone', 'nasal_bone_l', 'nasal_bone_r'],
    clinicalSignificance: 'Protects the frontal lobes of the cerebrum, center of executive function.',
    meshNode: 'cranium_frontal',
  },
  {
    id: 'parietal_bone_l',
    name: 'Left Parietal Bone',
    latinName: 'Os parietale sinister',
    region: 'axial',
    subgroup: 'cranium',
    side: 'left',
    ossification: 'intramembranous',
    landmarks: 'Sagittal border, Coronal border, Parietal eminence',
    articulations: ['frontal_bone', 'occipital_bone', 'parietal_bone_r', 'temporal_bone_l'],
    clinicalSignificance: 'Forms roof and sides of cranium; protects sensory parietal lobe.',
    meshNode: 'cranium_parietal_l',
  },
  {
    id: 'parietal_bone_r',
    name: 'Right Parietal Bone',
    latinName: 'Os parietale dexter',
    region: 'axial',
    subgroup: 'cranium',
    side: 'right',
    ossification: 'intramembranous',
    landmarks: 'Sagittal border, Coronal border, Parietal eminence',
    articulations: ['frontal_bone', 'occipital_bone', 'parietal_bone_l', 'temporal_bone_r'],
    clinicalSignificance: 'Bilateral cranial vault shield.',
    meshNode: 'cranium_parietal_r',
  },
  {
    id: 'occipital_bone',
    name: 'Occipital Bone',
    latinName: 'Os occipitale',
    region: 'axial',
    subgroup: 'cranium',
    side: 'axial',
    ossification: 'endochondral/intramembranous',
    landmarks: 'Foramen magnum, External occipital protuberance (Inion), Occipital condyles',
    articulations: ['vertebra_c1', 'parietal_bone_l', 'parietal_bone_r', 'temporal_bone_l', 'temporal_bone_r', 'sphenoid_bone'],
    clinicalSignificance: 'Foramen magnum transmits the brainstem into the spinal cord; condyles articulate with C1 Atlas.',
    meshNode: 'cranium_occipital',
  },
  {
    id: 'temporal_bone_l',
    name: 'Left Temporal Bone',
    latinName: 'Os temporale sinister',
    region: 'axial',
    subgroup: 'cranium',
    side: 'left',
    ossification: 'endochondral/intramembranous',
    landmarks: 'Mastoid process, Styloid process, External acoustic meatus, Zygomatic process',
    articulations: ['parietal_bone_l', 'occipital_bone', 'sphenoid_bone', 'mandible'],
    clinicalSignificance: 'Houses middle and inner ear auditory apparatus and cochlea.',
    meshNode: 'cranium_temporal_l',
  },
  {
    id: 'temporal_bone_r',
    name: 'Right Temporal Bone',
    latinName: 'Os temporale dexter',
    region: 'axial',
    subgroup: 'cranium',
    side: 'right',
    ossification: 'endochondral/intramembranous',
    landmarks: 'Mastoid process, Styloid process, External acoustic meatus',
    articulations: ['parietal_bone_r', 'occipital_bone', 'sphenoid_bone', 'mandible'],
    clinicalSignificance: 'Bilateral hearing and vestibular balance housing.',
    meshNode: 'cranium_temporal_r',
  },
  {
    id: 'sphenoid_bone',
    name: 'Sphenoid Bone',
    latinName: 'Os sphenoidale',
    region: 'axial',
    subgroup: 'cranium',
    side: 'axial',
    ossification: 'endochondral',
    landmarks: 'Sella turcica, Greater wings, Lesser wings, Pterygoid processes',
    articulations: ['frontal_bone', 'occipital_bone', 'temporal_bone_l', 'temporal_bone_r', 'ethmoid_bone', 'vomer'],
    clinicalSignificance: 'The central keystone of the skull; sella turcica protects the master pituitary gland.',
    meshNode: 'cranium_sphenoid',
  },
  {
    id: 'ethmoid_bone',
    name: 'Ethmoid Bone',
    latinName: 'Os ethmoidale',
    region: 'axial',
    subgroup: 'cranium',
    side: 'axial',
    ossification: 'endochondral',
    landmarks: 'Cribriform plate, Crista galli, Perpendicular plate',
    articulations: ['frontal_bone', 'sphenoid_bone', 'vomer', 'nasal_bone_l', 'nasal_bone_r'],
    clinicalSignificance: 'Cribriform plate transmits olfactory nerves (Cranial Nerve I) for scent perception.',
    meshNode: 'cranium_ethmoid',
  },

  // ==========================================
  // AXIAL: FACE (14)
  // ==========================================
  {
    id: 'mandible',
    name: 'Mandible (Jawbone)',
    latinName: 'Mandibula',
    region: 'axial',
    subgroup: 'face',
    side: 'axial',
    ossification: 'intramembranous',
    landmarks: 'Mandibular condyle, Coronoid process, Mental protuberance, Alveolar arch',
    articulations: ['temporal_bone_l', 'temporal_bone_r'],
    clinicalSignificance: 'Strongest and only freely movable bone of the skull (Temporomandibular Joint - TMJ).',
    meshNode: 'mandible',
  },
  {
    id: 'vomer',
    name: 'Vomer',
    latinName: 'Vomer',
    region: 'axial',
    subgroup: 'face',
    side: 'axial',
    ossification: 'intramembranous',
    landmarks: 'Ala of vomer, Vertical plate',
    articulations: ['sphenoid_bone', 'ethmoid_bone', 'maxilla_l', 'maxilla_r', 'palatine_l', 'palatine_r'],
    clinicalSignificance: 'Forms the posterior part of the nasal septum separating left and right airways.',
    meshNode: 'face_vomer',
  },
  { id: 'maxilla_l', name: 'Left Maxilla', latinName: 'Maxilla sinistra', region: 'axial', subgroup: 'face', side: 'left', ossification: 'intramembranous', landmarks: 'Infraorbital foramen, Palatine process', articulations: ['maxilla_r', 'frontal_bone', 'zygomatic_l'], clinicalSignificance: 'Upper jaw and floor of orbit.', meshNode: 'maxilla_l' },
  { id: 'maxilla_r', name: 'Right Maxilla', latinName: 'Maxilla dextra', region: 'axial', subgroup: 'face', side: 'right', ossification: 'intramembranous', landmarks: 'Infraorbital foramen, Palatine process', articulations: ['maxilla_l', 'frontal_bone', 'zygomatic_r'], clinicalSignificance: 'Upper jaw and floor of orbit.', meshNode: 'maxilla_r' },
  { id: 'zygomatic_l', name: 'Left Zygomatic Bone', latinName: 'Os zygomaticum sinistrum', region: 'axial', subgroup: 'face', side: 'left', ossification: 'intramembranous', landmarks: 'Temporal process, Zygomaticofacial foramen', articulations: ['maxilla_l', 'frontal_bone', 'temporal_bone_l'], clinicalSignificance: 'Forms prominence of the cheek.', meshNode: 'zygomatic_l' },
  { id: 'zygomatic_r', name: 'Right Zygomatic Bone', latinName: 'Os zygomaticum dextrum', region: 'axial', subgroup: 'face', side: 'right', ossification: 'intramembranous', landmarks: 'Temporal process', articulations: ['maxilla_r', 'frontal_bone', 'temporal_bone_r'], clinicalSignificance: 'Cheekbone and lateral orbital wall.', meshNode: 'zygomatic_r' },
  { id: 'nasal_l', name: 'Left Nasal Bone', latinName: 'Os nasale sinistrum', region: 'axial', subgroup: 'face', side: 'left', ossification: 'intramembranous', landmarks: 'Internasal suture', articulations: ['nasal_r', 'frontal_bone', 'maxilla_l'], clinicalSignificance: 'Bridge of the nose.', meshNode: 'nasal_l' },
  { id: 'nasal_r', name: 'Right Nasal Bone', latinName: 'Os nasale dextrum', region: 'axial', subgroup: 'face', side: 'right', ossification: 'intramembranous', landmarks: 'Internasal suture', articulations: ['nasal_l', 'frontal_bone', 'maxilla_r'], clinicalSignificance: 'Bridge of the nose.', meshNode: 'nasal_r' },
  { id: 'lacrimal_l', name: 'Left Lacrimal Bone', latinName: 'Os lacrimale sinistrum', region: 'axial', subgroup: 'face', side: 'left', ossification: 'intramembranous', landmarks: 'Lacrimal sulcus', articulations: ['ethmoid_bone', 'maxilla_l', 'frontal_bone'], clinicalSignificance: 'Houses the lacrimal sac for tear drainage.', meshNode: 'lacrimal_l' },
  { id: 'lacrimal_r', name: 'Right Lacrimal Bone', latinName: 'Os lacrimale dextrum', region: 'axial', subgroup: 'face', side: 'right', ossification: 'intramembranous', landmarks: 'Lacrimal sulcus', articulations: ['ethmoid_bone', 'maxilla_r', 'frontal_bone'], clinicalSignificance: 'Tear drainage pathway.', meshNode: 'lacrimal_r' },
  { id: 'palatine_l', name: 'Left Palatine Bone', latinName: 'Os palatinum sinistrum', region: 'axial', subgroup: 'face', side: 'left', ossification: 'intramembranous', landmarks: 'Horizontal plate, Pyramidal process', articulations: ['maxilla_l', 'sphenoid_bone', 'vomer'], clinicalSignificance: 'Forms posterior hard palate.', meshNode: 'palatine_l' },
  { id: 'palatine_r', name: 'Right Palatine Bone', latinName: 'Os palatinum dextrum', region: 'axial', subgroup: 'face', side: 'right', ossification: 'intramembranous', landmarks: 'Horizontal plate', articulations: ['maxilla_r', 'sphenoid_bone', 'vomer'], clinicalSignificance: 'Forms posterior hard palate.', meshNode: 'palatine_r' },
  { id: 'nasal_concha_l', name: 'Left Inferior Nasal Concha', latinName: 'Concha nasalis inferior sinistra', region: 'axial', subgroup: 'face', side: 'left', ossification: 'endochondral', landmarks: 'Ethmoidal process', articulations: ['maxilla_l', 'palatine_l', 'ethmoid_bone'], clinicalSignificance: 'Turbinates inhaled air to warm and humidify it.', meshNode: 'concha_l' },
  { id: 'nasal_concha_r', name: 'Right Inferior Nasal Concha', latinName: 'Concha nasalis inferior dextra', region: 'axial', subgroup: 'face', side: 'right', ossification: 'endochondral', landmarks: 'Ethmoidal process', articulations: ['maxilla_r', 'palatine_r', 'ethmoid_bone'], clinicalSignificance: 'Airflow warming and filtration.', meshNode: 'concha_r' },

  // ==========================================
  // AXIAL: AUDITORY OSSICLES (6) & HYOID (1)
  // ==========================================
  { id: 'malleus_l', name: 'Left Malleus (Hammer)', latinName: 'Malleus sinister', region: 'axial', subgroup: 'auditory', side: 'left', ossification: 'endochondral', landmarks: 'Manubrium, Head', articulations: ['incus_l'], clinicalSignificance: 'Transfers tympanic vibrations to incus.', meshNode: 'malleus_l' },
  { id: 'malleus_r', name: 'Right Malleus (Hammer)', latinName: 'Malleus dexter', region: 'axial', subgroup: 'auditory', side: 'right', ossification: 'endochondral', landmarks: 'Manubrium, Head', articulations: ['incus_r'], clinicalSignificance: 'Auditory vibration conduction.', meshNode: 'malleus_r' },
  { id: 'incus_l', name: 'Left Incus (Anvil)', latinName: 'Incus sinister', region: 'axial', subgroup: 'auditory', side: 'left', ossification: 'endochondral', landmarks: 'Body, Short crus, Long crus', articulations: ['malleus_l', 'stapes_l'], clinicalSignificance: 'Bridge ossicle of middle ear.', meshNode: 'incus_l' },
  { id: 'incus_r', name: 'Right Incus (Anvil)', latinName: 'Incus dexter', region: 'axial', subgroup: 'auditory', side: 'right', ossification: 'endochondral', landmarks: 'Body, Short crus, Long crus', articulations: ['malleus_r', 'stapes_r'], clinicalSignificance: 'Auditory vibration conduction.', meshNode: 'incus_r' },
  { id: 'stapes_l', name: 'Left Stapes (Stirrup)', latinName: 'Stapes sinister', region: 'axial', subgroup: 'auditory', side: 'left', ossification: 'endochondral', landmarks: 'Head, Base (footplate)', articulations: ['incus_l'], clinicalSignificance: 'Smallest bone in the human body; strikes oval window.', meshNode: 'stapes_l' },
  { id: 'stapes_r', name: 'Right Stapes (Stirrup)', latinName: 'Stapes dexter', region: 'axial', subgroup: 'auditory', side: 'right', ossification: 'endochondral', landmarks: 'Head, Base (footplate)', articulations: ['incus_r'], clinicalSignificance: 'Transfers sound waves into cochlear perilymph fluid.', meshNode: 'stapes_r' },
  { id: 'hyoid_bone', name: 'Hyoid Bone', latinName: 'Os hyoideum', region: 'axial', subgroup: 'hyoid', side: 'axial', ossification: 'endochondral', landmarks: 'Greater horn, Lesser horn, Body', articulations: [], clinicalSignificance: 'Only bone in human body that does not articulate with any other bone; anchor for tongue and swallowing muscles.', meshNode: 'hyoid' },

  // ==========================================
  // AXIAL: VERTEBRAL COLUMN (26)
  // ==========================================
  // Cervical (7)
  { id: 'vertebra_c1', name: 'C1 Atlas', latinName: 'Atlas', region: 'axial', subgroup: 'vertebrae_cervical', side: 'axial', ossification: 'endochondral', landmarks: 'Superior articular facet, Anterior arch', articulations: ['occipital_bone', 'vertebra_c2'], clinicalSignificance: 'Supports head globe; permits "Yes" nodding movement.', meshNode: 'spine_c1' },
  { id: 'vertebra_c2', name: 'C2 Axis', latinName: 'Axis', region: 'axial', subgroup: 'vertebrae_cervical', side: 'axial', ossification: 'endochondral', landmarks: 'Dens (Odontoid process), Bifid spinous process', articulations: ['vertebra_c1', 'vertebra_c3'], clinicalSignificance: 'Pivot pin enabling 180° "No" head rotation.', meshNode: 'spine_c2' },
  { id: 'vertebra_c3', name: 'C3 Vertebra', latinName: 'Vertebra cervicalis III', region: 'axial', subgroup: 'vertebrae_cervical', side: 'axial', ossification: 'endochondral', landmarks: 'Transverse foramen, Uncinate process', articulations: ['vertebra_c2', 'vertebra_c4'], clinicalSignificance: 'Phrenic nerve roots (C3–C5 keep the diaphragm alive).', meshNode: 'spine_c3' },
  { id: 'vertebra_c4', name: 'C4 Vertebra', latinName: 'Vertebra cervicalis IV', region: 'axial', subgroup: 'vertebrae_cervical', side: 'axial', ossification: 'endochondral', landmarks: 'Bifid spinous process', articulations: ['vertebra_c3', 'vertebra_c5'], clinicalSignificance: 'Phrenic motor nerve contribution.', meshNode: 'spine_c4' },
  { id: 'vertebra_c5', name: 'C5 Vertebra', latinName: 'Vertebra cervicalis V', region: 'axial', subgroup: 'vertebrae_cervical', side: 'axial', ossification: 'endochondral', landmarks: 'Transverse foramen', articulations: ['vertebra_c4', 'vertebra_c6'], clinicalSignificance: 'Deltoid and biceps motor outflow.', meshNode: 'spine_c5' },
  { id: 'vertebra_c6', name: 'C6 Vertebra', latinName: 'Vertebra cervicalis VI', region: 'axial', subgroup: 'vertebrae_cervical', side: 'axial', ossification: 'endochondral', landmarks: 'Carotid tubercle of Chassaignac', articulations: ['vertebra_c5', 'vertebra_c7'], clinicalSignificance: 'Wrist extensor reflex roots.', meshNode: 'spine_c6' },
  { id: 'vertebra_c7', name: 'C7 Vertebra Prominens', latinName: 'Vertebra prominens', region: 'axial', subgroup: 'vertebrae_cervical', side: 'axial', ossification: 'endochondral', landmarks: 'Long non-bifid spinous process', articulations: ['vertebra_c6', 'vertebra_t1'], clinicalSignificance: 'Primary palpable anatomic landmark at base of neck.', meshNode: 'spine_c7' },

  // Thoracic (12)
  ...Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    return {
      id: `vertebra_t${num}`,
      name: `T${num} Thoracic Vertebra`,
      latinName: `Vertebra thoracica ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][i]}`,
      region: 'axial',
      subgroup: 'vertebrae_thoracic',
      side: 'axial',
      ossification: 'endochondral',
      landmarks: 'Costal facets, Demifacets, Heart-shaped body',
      articulations: [i === 0 ? 'vertebra_c7' : `vertebra_t${num - 1}`, i === 11 ? 'vertebra_l1' : `vertebra_t${num + 1}`, `rib_${num}_l`, `rib_${num}_r`],
      clinicalSignificance: 'Articulates with bilateral ribs to stabilize the thoracic cage.',
      meshNode: `spine_t${num}`,
    };
  }),

  // Lumbar (5)
  ...Array.from({ length: 5 }, (_, i) => {
    const num = i + 1;
    return {
      id: `vertebra_l${num}`,
      name: `L${num} Lumbar Vertebra`,
      latinName: `Vertebra lumbalis ${['I','II','III','IV','V'][i]}`,
      region: 'axial',
      subgroup: 'vertebrae_lumbar',
      side: 'axial',
      ossification: 'endochondral',
      landmarks: 'Massive kidney-shaped body, Hatchet spinous process, Mamillary process',
      articulations: [i === 0 ? 'vertebra_t12' : `vertebra_l${num - 1}`, i === 4 ? 'sacrum' : `vertebra_l${num + 1}`],
      clinicalSignificance: 'Absorbs total upper-body axial compressive loads; primary site of disc herniation.',
      meshNode: `spine_l${num}`,
    };
  }),

  // Sacrum & Coccyx
  {
    id: 'sacrum',
    name: 'Sacrum (S1–S5 Fused)',
    latinName: 'Os sacrum',
    region: 'axial',
    subgroup: 'sacrum_coccyx',
    side: 'axial',
    ossification: 'endochondral',
    landmarks: 'Promontory, Anterior sacral foramina, Auricular surface, Sacral hiatus',
    articulations: ['vertebra_l5', 'coccyx', 'pelvis_l', 'pelvis_r'],
    clinicalSignificance: 'Key stone of pelvic arch; transmits all spine axial weight to the ilia.',
    meshNode: 'sacrum',
  },
  {
    id: 'coccyx',
    name: 'Coccyx (Tailbone Co1–Co4)',
    latinName: 'Os coccygis',
    region: 'axial',
    subgroup: 'sacrum_coccyx',
    side: 'axial',
    ossification: 'endochondral',
    landmarks: 'Coccygeal cornua',
    articulations: ['sacrum'],
    clinicalSignificance: 'Vestigial tailbone; attachment for pelvic floor muscular sling.',
    meshNode: 'coccyx',
  },

  // ==========================================
  // AXIAL: THORACIC CAGE (STERNUM 1 + RIBS 24 = 25)
  // ==========================================
  {
    id: 'sternum',
    name: 'Sternum (Breastbone: Manubrium, Body, Xiphoid)',
    latinName: 'Sternum',
    region: 'axial',
    subgroup: 'sternum',
    side: 'axial',
    ossification: 'endochondral',
    landmarks: 'Jugular notch, Sternal angle (of Louis), Manubrium, Body, Xiphoid process',
    articulations: ['clavicle_l', 'clavicle_r', 'rib_1_l', 'rib_1_r', 'rib_2_l', 'rib_2_r'],
    clinicalSignificance: 'Anterior central anchor of thoracic cage; protects heart, aortic arch, and lungs.',
    meshNode: 'sternum',
  },

  // 24 Ribs (Pairs 1–12 L/R)
  ...Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const ribType = num <= 7 ? 'True' : num <= 10 ? 'False' : 'Floating';
    return [
      {
        id: `rib_${num}_l`,
        name: `Left Rib ${num} (${ribType})`,
        latinName: `Costa ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][i]} sinistra`,
        region: 'axial',
        subgroup: 'ribs',
        side: 'left',
        ossification: 'endochondral',
        landmarks: 'Head, Neck, Tubercle, Costal groove',
        articulations: [`vertebra_t${num}`],
        clinicalSignificance: `Protects cardiopulmonary organs. Costal groove protects intercostal neurovascular bundle.`,
        meshNode: `rib_${num}_l`,
      },
      {
        id: `rib_${num}_r`,
        name: `Right Rib ${num} (${ribType})`,
        latinName: `Costa ${['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][i]} dextra`,
        region: 'axial',
        subgroup: 'ribs',
        side: 'right',
        ossification: 'endochondral',
        landmarks: 'Head, Neck, Tubercle, Costal groove',
        articulations: [`vertebra_t${num}`],
        clinicalSignificance: `Protects cardiopulmonary organs. Intercostal muscles expand chest during breathing.`,
        meshNode: `rib_${num}_r`,
      }
    ];
  }).flat(),

  // ==========================================
  // APPENDICULAR: PECTORAL GIRDLE & UPPER LIMBS (64)
  // ==========================================
  { id: 'clavicle_l', name: 'Left Clavicle (Collarbone)', latinName: 'Clavicula sinistra', region: 'appendicular', subgroup: 'pectoral', side: 'left', ossification: 'intramembranous', landmarks: 'Sternal end, Acromial end, Conoid tubercle', articulations: ['sternum_manubrium', 'scapula_l'], clinicalSignificance: 'Only horizontal long bone; most commonly fractured bone in human skeleton.', meshNode: 'clavicle_l' },
  { id: 'clavicle_r', name: 'Right Clavicle (Collarbone)', latinName: 'Clavicula dextra', region: 'appendicular', subgroup: 'pectoral', side: 'right', ossification: 'intramembranous', landmarks: 'Sternal end, Acromial end, Conoid tubercle', articulations: ['sternum_manubrium', 'scapula_r'], clinicalSignificance: 'Transfers upper limb forces to axial sternum.', meshNode: 'clavicle_r' },
  { id: 'scapula_l', name: 'Left Scapula (Shoulder Blade)', latinName: 'Scapula sinistra', region: 'appendicular', subgroup: 'pectoral', side: 'left', ossification: 'endochondral', landmarks: 'Spine, Acromion, Coracoid process, Glenoid cavity', articulations: ['clavicle_l', 'humerus_l'], clinicalSignificance: 'Glenoid cavity anchors shoulder ball-and-socket joint.', meshNode: 'scapula_l' },
  { id: 'scapula_r', name: 'Right Scapula (Shoulder Blade)', latinName: 'Scapula dextra', region: 'appendicular', subgroup: 'pectoral', side: 'right', ossification: 'endochondral', landmarks: 'Spine, Acromion, Coracoid process, Glenoid cavity', articulations: ['clavicle_r', 'humerus_r'], clinicalSignificance: 'Provides anchor for 17 muscular attachments.', meshNode: 'scapula_r' },

  { id: 'humerus_l', name: 'Left Humerus', latinName: 'Humerus sinister', region: 'appendicular', subgroup: 'arm_upper', side: 'left', ossification: 'endochondral', landmarks: 'Head, Greater tubercle, Lesser tubercle, Deltoid tuberosity, Medial/Lateral epicondyles', articulations: ['scapula_l', 'radius_l', 'ulna_l'], clinicalSignificance: 'Major upper arm bone transmitting glenohumeral kinetic chain.', meshNode: 'humerus_l' },
  { id: 'humerus_r', name: 'Right Humerus', latinName: 'Humerus dexter', region: 'appendicular', subgroup: 'arm_upper', side: 'right', ossification: 'endochondral', landmarks: 'Head, Greater tubercle, Lesser tubercle, Deltoid tuberosity, Medial/Lateral epicondyles', articulations: ['scapula_r', 'radius_r', 'ulna_r'], clinicalSignificance: 'Radial nerve spiral groove wraps around mid-shaft.', meshNode: 'humerus_r' },

  { id: 'radius_l', name: 'Left Radius', latinName: 'Radius sinister', region: 'appendicular', subgroup: 'forearm', side: 'left', ossification: 'endochondral', landmarks: 'Radial head, Radial tuberosity, Styloid process', articulations: ['humerus_l', 'ulna_l', 'scaphoid_l', 'lunate_l'], clinicalSignificance: 'Lateral forearm bone pivoting around ulna for pronation/supination.', meshNode: 'radius_l' },
  { id: 'radius_r', name: 'Right Radius', latinName: 'Radius dexter', region: 'appendicular', subgroup: 'forearm', side: 'right', ossification: 'endochondral', landmarks: 'Radial head, Radial tuberosity, Styloid process', articulations: ['humerus_r', 'ulna_r', 'scaphoid_r', 'lunate_r'], clinicalSignificance: 'Colles fracture site upon fall onto outstretched hand (FOOSH).', meshNode: 'radius_r' },
  { id: 'ulna_l', name: 'Left Ulna', latinName: 'Ulna sinistra', region: 'appendicular', subgroup: 'forearm', side: 'left', ossification: 'endochondral', landmarks: 'Olecranon, Trochlear notch, Coronoid process, Styloid process', articulations: ['humerus_l', 'radius_l'], clinicalSignificance: 'Forms hinge of the elbow joint via Olecranon process.', meshNode: 'ulna_l' },
  { id: 'ulna_r', name: 'Right Ulna', latinName: 'Ulna dextra', region: 'appendicular', subgroup: 'forearm', side: 'right', ossification: 'endochondral', landmarks: 'Olecranon, Trochlear notch, Coronoid process, Styloid process', articulations: ['humerus_r', 'radius_r'], clinicalSignificance: 'Medial stabilizing forearm pillar.', meshNode: 'ulna_r' },

  // Carpals (16: 8 L + 8 R)
  ...['scaphoid', 'lunate', 'triquetrum', 'pisiform', 'trapezium', 'trapezoid', 'capitate', 'hamate'].flatMap((carp) => [
    { id: `${carp}_l`, name: `Left ${carp.charAt(0).toUpperCase() + carp.slice(1)}`, latinName: `Os ${carp} sinistrum`, region: 'appendicular', subgroup: 'carpals', side: 'left', ossification: 'endochondral', landmarks: 'Articular facets', articulations: ['radius_l'], clinicalSignificance: carp === 'scaphoid' ? 'Avascular necrosis risk on waist fracture.' : 'Wrist carpal tunnel arch.', meshNode: `${carp}_l` },
    { id: `${carp}_r`, name: `Right ${carp.charAt(0).toUpperCase() + carp.slice(1)}`, latinName: `Os ${carp} dextrum`, region: 'appendicular', subgroup: 'carpals', side: 'right', ossification: 'endochondral', landmarks: 'Articular facets', articulations: ['radius_r'], clinicalSignificance: carp === 'scaphoid' ? 'Avascular necrosis risk on waist fracture.' : 'Wrist carpal tunnel arch.', meshNode: `${carp}_r` }
  ]),

  // Metacarpals (10: 5 L + 5 R)
  ...Array.from({ length: 5 }, (_, i) => {
    const num = i + 1;
    return [
      { id: `metacarpal_${num}_l`, name: `Left Metacarpal ${num}`, latinName: `Os metacarpale ${['I','II','III','IV','V'][i]} sinistrum`, region: 'appendicular', subgroup: 'metacarpals', side: 'left', ossification: 'endochondral', landmarks: 'Base, Shaft, Head', articulations: [], clinicalSignificance: num === 1 ? 'Saddle joint of thumb with trapezium enabling opposable dexterity.' : 'Palm framework.', meshNode: `metacarpal_${num}_l` },
      { id: `metacarpal_${num}_r`, name: `Right Metacarpal ${num}`, latinName: `Os metacarpale ${['I','II','III','IV','V'][i]} dextrum`, region: 'appendicular', subgroup: 'metacarpals', side: 'right', ossification: 'endochondral', landmarks: 'Base, Shaft, Head', articulations: [], clinicalSignificance: num === 1 ? 'Enables precision tool use.' : 'Boxer fracture site on 5th metacarpal.', meshNode: `metacarpal_${num}_r` }
    ];
  }).flat(),

  // Hand Phalanges (28: 14 L + 14 R)
  ...['proximal', 'middle', 'distal'].flatMap((tier) => {
    const digits = tier === 'middle' ? [2, 3, 4, 5] : [1, 2, 3, 4, 5];
    return digits.flatMap((d) => [
      { id: `phalanx_hand_${tier}_${d}_l`, name: `Left Hand ${tier.charAt(0).toUpperCase() + tier.slice(1)} Phalanx ${d}`, latinName: `Phalanx ${tier} ${d} manus sinistrae`, region: 'appendicular', subgroup: 'hand_phalanges', side: 'left', ossification: 'endochondral', landmarks: 'Trochlea, Base', articulations: [], clinicalSignificance: 'Fine tactile motor manipulation.', meshNode: `phalanx_hand_${tier}_${d}_l` },
      { id: `phalanx_hand_${tier}_${d}_r`, name: `Right Hand ${tier.charAt(0).toUpperCase() + tier.slice(1)} Phalanx ${d}`, latinName: `Phalanx ${tier} ${d} manus dextrae`, region: 'appendicular', subgroup: 'hand_phalanges', side: 'right', ossification: 'endochondral', landmarks: 'Trochlea, Base', articulations: [], clinicalSignificance: 'Fine tactile motor manipulation.', meshNode: `phalanx_hand_${tier}_${d}_r` }
    ]);
  }),

  // ==========================================
  // APPENDICULAR: PELVIS & LOWER LIMBS (62)
  // ==========================================
  { id: 'pelvis_l', name: 'Left Os Coxae (Hip Bone: Ilium, Ischium, Pubis)', latinName: 'Os coxae sinistrum', region: 'appendicular', subgroup: 'pelvis', side: 'left', ossification: 'endochondral', landmarks: 'Acetabulum, Iliac crest, ASIS, Ischial tuberosity, Pubic symphysis', articulations: ['sacrum', 'pelvis_r', 'femur_l'], clinicalSignificance: 'Transfers axial spinal load into femoral head; anchors 35 postural muscles.', meshNode: 'pelvis_l' },
  { id: 'pelvis_r', name: 'Right Os Coxae (Hip Bone: Ilium, Ischium, Pubis)', latinName: 'Os coxae dextrum', region: 'appendicular', subgroup: 'pelvis', side: 'right', ossification: 'endochondral', landmarks: 'Acetabulum, Iliac crest, ASIS, Ischial tuberosity, Pubic symphysis', articulations: ['sacrum', 'pelvis_l', 'femur_r'], clinicalSignificance: 'Anterior/Posterior tilt and lateral drop dictate spinal curvature.', meshNode: 'pelvis_r' },

  { id: 'femur_l', name: 'Left Femur (Thighbone)', latinName: 'Femur sinistrum', region: 'appendicular', subgroup: 'thigh', side: 'left', ossification: 'endochondral', landmarks: 'Femoral head, Neck, Greater trochanter, Lesser trochanter, Medial/Lateral condyles', articulations: ['pelvis_l', 'patella_l', 'tibia_l'], clinicalSignificance: 'Longest, strongest bone in human body; carries 30x body weight on impact.', meshNode: 'femur_l' },
  { id: 'femur_r', name: 'Right Femur (Thighbone)', latinName: 'Femur dextrum', region: 'appendicular', subgroup: 'thigh', side: 'right', ossification: 'endochondral', landmarks: 'Femoral head, Neck, Greater trochanter, Lesser trochanter, Medial/Lateral condyles', articulations: ['pelvis_r', 'patella_r', 'tibia_r'], clinicalSignificance: 'Angle of inclination (125°) dictates Q-angle and knee valgus loading.', meshNode: 'femur_r' },

  { id: 'patella_l', name: 'Left Patella (Kneecap)', latinName: 'Patella sinistra', region: 'appendicular', subgroup: 'patella', side: 'left', ossification: 'endochondral', landmarks: 'Apex, Base, Articular facets', articulations: ['femur_l'], clinicalSignificance: 'Largest sesamoid bone; multiplies quadriceps extension torque by 30%.', meshNode: 'patella_l' },
  { id: 'patella_r', name: 'Right Patella (Kneecap)', latinName: 'Patella dextra', region: 'appendicular', subgroup: 'patella', side: 'right', ossification: 'endochondral', landmarks: 'Apex, Base, Articular facets', articulations: ['femur_r'], clinicalSignificance: 'Increases quadriceps extensor mechanical advantage.', meshNode: 'patella_r' },

  { id: 'tibia_l', name: 'Left Tibia (Shinbone)', latinName: 'Tibia sinistra', region: 'appendicular', subgroup: 'leg_lower', side: 'left', ossification: 'endochondral', landmarks: 'Tibial plateau, Tibial tuberosity, Anterior border, Medial malleolus', articulations: ['femur_l', 'fibula_l', 'talus_l'], clinicalSignificance: 'Primary weight-bearing bone of the lower leg; medial malleolus forms ankle mortise.', meshNode: 'tibia_l' },
  { id: 'tibia_r', name: 'Right Tibia (Shinbone)', latinName: 'Tibia dextra', region: 'appendicular', subgroup: 'leg_lower', side: 'right', ossification: 'endochondral', landmarks: 'Tibial plateau, Tibial tuberosity, Anterior border, Medial malleolus', articulations: ['femur_r', 'fibula_r', 'talus_r'], clinicalSignificance: 'Subject to tibial torsion during foot overpronation.', meshNode: 'tibia_r' },
  { id: 'fibula_l', name: 'Left Fibula (Calfbone)', latinName: 'Fibula sinistra', region: 'appendicular', subgroup: 'leg_lower', side: 'left', ossification: 'endochondral', landmarks: 'Fibular head, Lateral malleolus', articulations: ['tibia_l', 'talus_l'], clinicalSignificance: 'Non-weight-bearing lateral strut; lateral malleolus prevents ankle eversion.', meshNode: 'fibula_l' },
  { id: 'fibula_r', name: 'Right Fibula (Calfbone)', latinName: 'Fibula dextra', region: 'appendicular', subgroup: 'leg_lower', side: 'right', ossification: 'endochondral', landmarks: 'Fibular head, Lateral malleolus', articulations: ['tibia_r', 'talus_r'], clinicalSignificance: 'Anchor for lateral ankle collateral ligaments.', meshNode: 'fibula_r' },

  // Tarsals (14: 7 L + 7 R)
  ...['talus', 'calcaneus', 'navicular', 'medial_cuneiform', 'intermediate_cuneiform', 'lateral_cuneiform', 'cuboid'].flatMap((tars) => [
    { id: `${tars}_l`, name: `Left ${tars.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`, latinName: `Os ${tars} sinistrum`, region: 'appendicular', subgroup: 'tarsals', side: 'left', ossification: 'endochondral', landmarks: 'Trochlea, Sustentaculum tali, Tuberosity', articulations: [], clinicalSignificance: tars === 'talus' ? 'Distributes body weight between calcaneus and navicular.' : 'Forms foot arches.', meshNode: `${tars}_l` },
    { id: `${tars}_r`, name: `Right ${tars.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`, latinName: `Os ${tars} dextrum`, region: 'appendicular', subgroup: 'tarsals', side: 'right', ossification: 'endochondral', landmarks: 'Trochlea, Sustentaculum tali, Tuberosity', articulations: [], clinicalSignificance: tars === 'calcaneus' ? 'Heel bone lever arm for Achilles tendon.' : 'Medial longitudinal arch keystone.', meshNode: `${tars}_r` }
  ]),

  // Metatarsals (10: 5 L + 5 R)
  ...Array.from({ length: 5 }, (_, i) => {
    const num = i + 1;
    return [
      { id: `metatarsal_${num}_l`, name: `Left Metatarsal ${num}`, latinName: `Os metatarsale ${['I','II','III','IV','V'][i]} sinistrum`, region: 'appendicular', subgroup: 'metatarsals', side: 'left', ossification: 'endochondral', landmarks: 'Base, Shaft, Head', articulations: [], clinicalSignificance: num === 1 ? 'Primary push-off fulcrum in bipedal gait.' : 'Transverse foot arch.', meshNode: `metatarsal_${num}_l` },
      { id: `metatarsal_${num}_r`, name: `Right Metatarsal ${num}`, latinName: `Os metatarsale ${['I','II','III','IV','V'][i]} dextrum`, region: 'appendicular', subgroup: 'metatarsals', side: 'right', ossification: 'endochondral', landmarks: 'Base, Shaft, Head', articulations: [], clinicalSignificance: num === 1 ? 'Bears 50% of forefoot load.' : 'Jones fracture site on 5th tuberosity.', meshNode: `metatarsal_${num}_r` }
    ];
  }).flat(),

  // Foot Phalanges (28: 14 L + 14 R)
  ...['proximal', 'middle', 'distal'].flatMap((tier) => {
    const digits = tier === 'middle' ? [2, 3, 4, 5] : [1, 2, 3, 4, 5];
    return digits.flatMap((d) => [
      { id: `phalanx_foot_${tier}_${d}_l`, name: `Left Foot ${tier.charAt(0).toUpperCase() + tier.slice(1)} Phalanx ${d}`, latinName: `Phalanx ${tier} ${d} pedis sinistri`, region: 'appendicular', subgroup: 'foot_phalanges', side: 'left', ossification: 'endochondral', landmarks: 'Head, Base', articulations: [], clinicalSignificance: 'Bipedal toe-off stabilization.', meshNode: `phalanx_foot_${tier}_${d}_l` },
      { id: `phalanx_foot_${tier}_${d}_r`, name: `Right Foot ${tier.charAt(0).toUpperCase() + tier.slice(1)} Phalanx ${d}`, latinName: `Phalanx ${tier} ${d} pedis dextri`, region: 'appendicular', subgroup: 'foot_phalanges', side: 'right', ossification: 'endochondral', landmarks: 'Head, Base', articulations: [], clinicalSignificance: 'Dynamic balance equilibrium.', meshNode: `phalanx_foot_${tier}_${d}_r` }
    ]);
  }),
];

// Exact Verification Constant
export const TOTAL_BONE_COUNT = ALL_206_BONES.length;
