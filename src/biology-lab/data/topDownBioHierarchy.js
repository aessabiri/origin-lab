/**
 * BIO-ASSEMBLY LINE HIERARCHY (Elementary Chemistry -> Macromolecules -> Organelles -> Cells -> Tissues -> 3D Organs)
 *
 * Supports both:
 *  - TOP-DOWN inspection: Start at a Macro Human Organ (Level 5), inspect what Tissue (Level 4) it needs,
 *    what Cell (Level 3) that needs, what Organelles (Level 2) that needs, down to Molecular Building Blocks (Level 1).
 *  - BOTTOM-UP assembly: Snap together building blocks at each level to construct the level above it.
 */

// ============================================================================
// LEVEL 1: MOLECULAR BUILDING BLOCKS (From Physics Atoms & Chemistry Lab)
// ============================================================================
export const LEVEL_1_MACROMOLECULES = {
  phospholipid_bilayer: {
    id: 'phospholipid_bilayer',
    name: 'Phospholipid Bilayer Sheet',
    icon: '🫧',
    color: '#38bdf8',
    fromChemistry: ['2× Fatty Acid Chains (C, H)', 'Glycerol Backbone (C₃H₈O₃)', 'Phosphate Head (PO₄³⁻)'],
    chemistryOrder: {
      compoundId: 'phospholipid',
      title: 'Phospholipid Bilayer Synthesis',
      equation: '1 Glycerol + 2 Fatty Acid + 1 Phosphoric Acid → 1 Phospholipid + 2 H₂O',
      inputs: { glycerol: 1, 'fatty-acid': 2, 'phosphoric-acid': 1 },
      tempC: 85,
      pressureAtm: 2,
      vesselType: 'beaker_std'
    },
    role: 'Forms semi-permeable outer/inner membranes for organelles and cells.'
  },
  bdna_chromatin: {
    id: 'bdna_chromatin',
    name: 'B-DNA Double Helix & mRNA',
    icon: '🧬',
    color: '#a855f7',
    fromChemistry: ['Deoxyribose Sugar (C₅H₁₀O₄)', 'Phosphate Backbone (P, O)', 'A–T & G–C Base Pairs (N)'],
    chemistryOrder: {
      compoundId: 'dna',
      title: 'Deoxyribonucleic Acid (B-DNA) Polymerization',
      equation: '1 Adenine + 1 Ribose + 1 Phosphoric Acid → 1 DNA/RNA Nucleotide + 2 H₂O',
      inputs: { adenine: 1, ribose: 1, 'phosphoric-acid': 1 },
      tempC: 65,
      pressureAtm: 2,
      vesselType: 'reactor_reinforced'
    },
    role: 'Stores the genetic blueprint and transcribes mRNA for protein synthesis.'
  },
  atp_synthase: {
    id: 'atp_synthase',
    name: 'F₀F₁ ATP Synthase Rotary Motor',
    icon: '⚡',
    color: '#f59e0b',
    fromChemistry: ['Amino Acid Polypeptide', 'Adenosine Diphosphate (ADP)', 'Inorganic Phosphate (Pᵢ) + H⁺'],
    chemistryOrder: {
      compoundId: 'nadh',
      title: 'High-Energy Phosphate & NADH Coenzyme Synthesis',
      equation: '1 Nucleotide-A + 2 Phosphoric Acid → 1 ATP / NADH Bio-Carrier',
      inputs: { 'nucleotide-a': 1, 'phosphoric-acid': 2 },
      tempC: 55,
      pressureAtm: 2,
      vesselType: 'electrochemical_cell'
    },
    role: 'Molecular turbine that synthesizes cellular ATP energy currency.'
  },
  collagen_i: {
    id: 'collagen_i',
    name: 'Type-I Triple-Helix Collagen',
    icon: '🪢',
    color: '#22d3ee',
    fromChemistry: ['Glycine (Gly)', 'Proline (Pro)', 'Hydroxyproline (Hyp) + Vitamin C'],
    chemistryOrder: {
      compoundId: 'glycine',
      title: 'Glycine & Proline Precursor Synthesis (Strecker / Spark)',
      equation: '2 Methane + 1 Ammonia + 2 Water → 1 Glycine + 5 H₂',
      inputs: { methane: 2, ammonia: 1, water: 2 },
      tempC: 120,
      pressureAtm: 5,
      vesselType: 'spark_chamber'
    },
    role: 'High-tensile structural protein rope for bone osteoid, tendons, and organ walls.'
  },
  actin_myosin: {
    id: 'actin_myosin',
    name: 'Actin-Myosin Contractile Filaments',
    icon: '💪',
    color: '#f43f5e',
    fromChemistry: ['Globular Actin (G-Actin)', 'Myosin-II Heavy Chains', 'Ca²⁺ + ATP Trigger'],
    chemistryOrder: {
      compoundId: 'glutamic-acid',
      title: 'Contractile Amino Acid Synthesis (Glutamate & Lysine)',
      equation: '1 Citric Acid + 1 Ammonia → 1 Glutamic Acid + CO₂ + H₂O',
      inputs: { 'citric-acid': 1, ammonia: 1 },
      tempC: 90,
      pressureAtm: 2,
      vesselType: 'beaker_std'
    },
    role: 'Molecular rachet motors that contract heart and skeletal muscle cells.'
  },
  hemoglobin: {
    id: 'hemoglobin',
    name: 'Hemoglobin α₂β₂ Heme Complex',
    icon: '🩸',
    color: '#ef4444',
    fromChemistry: ['4× Globin Polypeptides', '4× Porphyrin Heme Rings', 'Ferrous Iron (Fe²⁺) Core'],
    chemistryOrder: {
      compoundId: 'heme',
      title: 'Ferroprotoporphyrin IX (Heme) Chelation',
      equation: '4 Glycine + 1 Iron (Fe²⁺) → 1 Porphyrin Heme Ring',
      inputs: { glycine: 4, iron: 1 },
      tempC: 110,
      pressureAtm: 3,
      vesselType: 'reactor_reinforced'
    },
    role: 'Binds and transports O₂ from lung alveoli to all perfused tissues.'
  },
  ion_channel: {
    id: 'ion_channel',
    name: 'Voltage-Gated Na⁺/K⁺ Ion Channel',
    icon: '🔌',
    color: '#eab308',
    fromChemistry: ['4× Transmembrane α-Helix Domains', 'S4 Arginine Voltage Sensor', 'Na⁺ & K⁺ Ions'],
    chemistryOrder: {
      compoundId: 'arginine',
      title: 'S4 Voltage-Sensor Arginine & Electrolyte Synthesis',
      equation: '1 Glutamic Acid + 2 Ammonia → 1 Arginine + 2 H₂O',
      inputs: { 'glutamic-acid': 1, ammonia: 2 },
      tempC: 95,
      pressureAtm: 3,
      vesselType: 'electrochemical_cell'
    },
    role: 'Fires rapid electrical action potentials along nerve axons and heart cells.'
  }
};

// ============================================================================
// LEVEL 2: ORGANELLES (Assembled Part-by-Part from Level 1 Macromolecules)
// ============================================================================
export const LEVEL_2_ORGANELLES = {
  nucleus: {
    id: 'nucleus',
    name: 'Cell Nucleus',
    subtitle: 'Genomic Command Center',
    icon: '🟣',
    color: '#38bdf8',
    parts: [
      { id: 'nuc_envelope', label: 'Double Nuclear Lipid Envelope', blockId: 'phospholipid_bilayer' },
      { id: 'nuc_pores', label: '14 Octagonal Nuclear Pore Complexes', blockId: 'collagen_i' },
      { id: 'nuc_dna', label: 'Helical B-DNA Chromatin Genome', blockId: 'bdna_chromatin' },
      { id: 'nuc_nucleolus', label: 'Dense rRNA Nucleolus Core', blockId: 'bdna_chromatin' }
    ],
    description: 'Houses the B-DNA double helix and exports mRNA transcripts through nuclear pores.'
  },
  mitochondrion: {
    id: 'mitochondrion',
    name: 'Mitochondrion',
    subtitle: 'Oxidative ATP Powerhouse',
    icon: '🟠',
    color: '#f59e0b',
    parts: [
      { id: 'mito_outer', label: 'Outer Porin Phospholipid Capsule', blockId: 'phospholipid_bilayer' },
      { id: 'mito_cristae', label: 'Folded Inner Cristae Baffles', blockId: 'phospholipid_bilayer' },
      { id: 'mito_atp', label: 'F₀F₁ ATP Synthase Rotor Array', blockId: 'atp_synthase' },
      { id: 'mito_dna', label: 'Circular Mitochondrial DNA Ring', blockId: 'bdna_chromatin' }
    ],
    description: 'Uses proton gradients across folded cristae to spin ATP Synthase turbines.'
  },
  ribosome: {
    id: 'ribosome',
    name: '80S Ribosome & Rough ER',
    subtitle: 'Polypeptide Translation Factory',
    icon: '🔵',
    color: '#06b6d4',
    parts: [
      { id: 'ribo_40s', label: '40S Small mRNA-Decoding Subunit', blockId: 'bdna_chromatin' },
      { id: 'ribo_60s', label: '60S Large Peptidyl-Transferase Subunit', blockId: 'bdna_chromatin' },
      { id: 'ribo_er', label: 'Rough Endoplasmic Reticulum Membrane', blockId: 'phospholipid_bilayer' }
    ],
    description: 'Reads mRNA codons 3 bases at a time and links amino acids into folded proteins.'
  },
  plasma_membrane: {
    id: 'plasma_membrane',
    name: 'Excitable Plasma Membrane & Cortex',
    subtitle: 'Selective Barrier & Cytoskeleton',
    icon: '🟢',
    color: '#10b981',
    parts: [
      { id: 'mem_bilayer', label: 'Dual-Leaflet Phospholipid Bilayer', blockId: 'phospholipid_bilayer' },
      { id: 'mem_cortex', label: 'Actin-Spectrin Cytoskeletal Cortex', blockId: 'actin_myosin' },
      { id: 'mem_channels', label: 'Transmembrane Na⁺/K⁺ Ion Pores', blockId: 'ion_channel' }
    ],
    description: 'Encloses the cytoplasm, anchors the cytoskeleton, and regulates ion gradients.'
  }
};

// ============================================================================
// LEVEL 3: SPECIALIZED HUMAN CELLS (Assembled from Level 2 Organelles + Level 1 Proteins)
// ============================================================================
export const LEVEL_3_CELLS = {
  osteoblast: {
    id: 'osteoblast',
    name: 'Osteoblast (Bone-Forming Cell)',
    germLayer: 'Mesoderm',
    morphogenSignal: 'BMP4 + Runx2',
    optimalMorphogens: { bmpShh: 82, wntFgf: 60 },
    icon: '🦴',
    color: '#38bdf8',
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'plasma_membrane'],
    requiredProteins: ['collagen_i', 'atp_synthase'],
    parts: [
      { id: 'cell_ost_nuc', label: 'Nucleus (Runx2 Bone Transcription)', refLevel: 2, refId: 'nucleus' },
      { id: 'cell_ost_ribo', label: 'Rough ER & 80S Ribosomes', refLevel: 2, refId: 'ribosome' },
      { id: 'cell_ost_mito', label: 'Mitochondria Cluster', refLevel: 2, refId: 'mitochondrion' },
      { id: 'cell_ost_col', label: 'Type-I Collagen Secretory Granules', refLevel: 1, refId: 'collagen_i' }
    ],
    role: 'Secretes triple-helix Type-I collagen and nucleates calcium phosphate bone mineral.'
  },
  cardiomyocyte: {
    id: 'cardiomyocyte',
    name: 'Cardiomyocyte & Striated Myocyte',
    germLayer: 'Mesoderm',
    morphogenSignal: 'Wnt3a + Nkx2.5',
    optimalMorphogens: { bmpShh: 52, wntFgf: 78 },
    icon: '🫀',
    color: '#f43f5e',
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'plasma_membrane'],
    requiredProteins: ['actin_myosin', 'atp_synthase'],
    parts: [
      { id: 'cell_car_nuc', label: 'Central Nucleus', refLevel: 2, refId: 'nucleus' },
      { id: 'cell_car_mito', label: 'High-Density Mitochondria (40% Vol)', refLevel: 2, refId: 'mitochondrion' },
      { id: 'cell_car_mem', label: 'Sarcolemma & Intercalated Discs', refLevel: 2, refId: 'plasma_membrane' },
      { id: 'cell_car_sarc', label: 'Actin-Myosin Sarcomere Bundles', refLevel: 1, refId: 'actin_myosin' }
    ],
    role: 'Contracts rhythmically using ATP and Actin-Myosin crossbridges to pump blood and move bones.'
  },
  hepatocyte: {
    id: 'hepatocyte',
    name: 'Pneumocyte & Hepatocyte (Visceral Cell)',
    germLayer: 'Endoderm',
    morphogenSignal: 'FGF2 + HNF4α',
    optimalMorphogens: { bmpShh: 42, wntFgf: 85 },
    icon: '🫁',
    color: '#10b981',
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'plasma_membrane'],
    requiredProteins: ['hemoglobin', 'atp_synthase'],
    parts: [
      { id: 'cell_hep_nuc', label: 'Metabolic Nucleus', refLevel: 2, refId: 'nucleus' },
      { id: 'cell_hep_mito', label: 'Detox & Respiratory Mitochondria', refLevel: 2, refId: 'mitochondrion' },
      { id: 'cell_hep_ribo', label: 'Dense ER & 80S Ribosome Array', refLevel: 2, refId: 'ribosome' },
      { id: 'cell_hep_heme', label: 'Gas-Exchange Hemoglobin Interface', refLevel: 1, refId: 'hemoglobin' }
    ],
    role: 'Forms lung alveolar gas-exchange walls and liver metabolic lobules.'
  },
  endothelial_cell: {
    id: 'endothelial_cell',
    name: 'Vascular Endothelial & Red Blood Cell',
    germLayer: 'Mesoderm',
    morphogenSignal: 'VEGF-A + EPO',
    optimalMorphogens: { bmpShh: 35, wntFgf: 92 },
    icon: '🩸',
    color: '#ef4444',
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'plasma_membrane'],
    requiredProteins: ['hemoglobin', 'collagen_i'],
    parts: [
      { id: 'cell_endo_mem', label: 'Anti-Thrombotic Plasma Membrane', refLevel: 2, refId: 'plasma_membrane' },
      { id: 'cell_endo_nuc', label: 'Endothelial Nucleus', refLevel: 2, refId: 'nucleus' },
      { id: 'cell_endo_hb', label: 'Tetrameric Hemoglobin O₂ Carrier', refLevel: 1, refId: 'hemoglobin' },
      { id: 'cell_endo_col', label: 'Basal Lamina Collagen Anchor', refLevel: 1, refId: 'collagen_i' }
    ],
    role: 'Lines all arteries, veins, and capillaries while carrying oxygenated hemoglobin.'
  },
  motor_neuron: {
    id: 'motor_neuron',
    name: 'Multipolar Motor & Cortical Neuron',
    germLayer: 'Ectoderm',
    morphogenSignal: 'Sonic Hedgehog (Shh)',
    optimalMorphogens: { bmpShh: 15, wntFgf: 72 },
    icon: '🧠',
    color: '#f59e0b',
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'plasma_membrane'],
    requiredProteins: ['ion_channel', 'atp_synthase'],
    parts: [
      { id: 'cell_neu_soma', label: 'Soma Nucleus & Nissl Ribosomes', refLevel: 2, refId: 'nucleus' },
      { id: 'cell_neu_axon', label: 'Myelinated Axonal Membrane', refLevel: 2, refId: 'plasma_membrane' },
      { id: 'cell_neu_mito', label: 'Synaptic Boutique Mitochondria', refLevel: 2, refId: 'mitochondrion' },
      { id: 'cell_neu_nav', label: 'Nodes of Ranvier Na⁺/K⁺ Channels', refLevel: 1, refId: 'ion_channel' }
    ],
    role: 'Transmits 120 m/s electrical action potentials across the brain, spinal cord, and nerves.'
  }
};

// ============================================================================
// LEVEL 4: ENGINEERED TISSUES (Assembled from Level 3 Cells + Level 1 ECM)
// ============================================================================
export const LEVEL_4_TISSUES = {
  osteoid: {
    id: 'osteoid',
    name: 'Calcified Haversian Bone Tissue',
    icon: '🦴',
    color: '#38bdf8',
    formula: 'Ca₁₀(PO₄)₆(OH)₂ + Type-I Collagen',
    requiredCells: ['osteoblast'],
    requiredProteins: ['collagen_i'],
    compounds: { calcium: 2, 'phosphoric-acid': 2 },
    ecmArchitecture: 'Concentric Haversian osteon rings reinforced with hydroxyapatite mineral crystals.',
    parts: [
      { id: 'tis_ost_cells', label: 'Osteoblast & Osteocyte Lacunae Network', refLevel: 3, refId: 'osteoblast' },
      { id: 'tis_ost_col', label: 'Cross-Linked Type-I Collagen Osteoid', refLevel: 1, refId: 'collagen_i' },
      { id: 'tis_ost_min', label: 'Hydroxyapatite Mineral Ca₁₀(PO₄)₆(OH)₂', refLevel: 1, refId: 'atp_synthase' }
    ]
  },
  myofibril: {
    id: 'myofibril',
    name: 'Striated Muscle & Tendon Tissue',
    icon: '💪',
    color: '#f43f5e',
    formula: 'Actin-Myosin II + Endomysial Collagen I',
    requiredCells: ['cardiomyocyte'],
    requiredProteins: ['actin_myosin', 'collagen_i'],
    compounds: { glucose: 2, glycine: 2 },
    ecmArchitecture: 'Bundled myofibril fascicles anchored to bone via dense collagenous tendons.',
    parts: [
      { id: 'tis_myo_cells', label: 'Aligned Striated Myocyte Fascicles', refLevel: 3, refId: 'cardiomyocyte' },
      { id: 'tis_myo_sarc', label: 'Contractile Actin-Myosin Filaments', refLevel: 1, refId: 'actin_myosin' },
      { id: 'tis_myo_tendon', label: 'Collagenous Tendon & Ligament Sheath', refLevel: 1, refId: 'collagen_i' }
    ]
  },
  visceral: {
    id: 'visceral',
    name: 'Alveolar & Hepatic Parenchyma Tissue',
    icon: '🫁',
    color: '#10b981',
    formula: 'Endodermal Lobules + Capillary Surfactant ECM',
    requiredCells: ['hepatocyte'],
    requiredProteins: ['hemoglobin', 'collagen_i'],
    compounds: { water: 3, phospholipid: 2 },
    ecmArchitecture: '0.2 µm alveolar gas-exchange sacs and fenestrated hepatic sinusoids.',
    parts: [
      { id: 'tis_vis_cells', label: 'Pneumocyte & Hepatocyte Epithelium', refLevel: 3, refId: 'hepatocyte' },
      { id: 'tis_vis_ecm', label: 'Basement Membrane Collagen Matrix', refLevel: 1, refId: 'collagen_i' },
      { id: 'tis_vis_cap', label: 'Oxygenated Hemoglobin Perfusion Bed', refLevel: 1, refId: 'hemoglobin' }
    ]
  },
  endothelial: {
    id: 'endothelial',
    name: 'Cardiac Myocardium & Vascular Wall',
    icon: '🫀',
    color: '#ef4444',
    formula: 'Syncytial Myocardium + Elastin Endothelium',
    requiredCells: ['cardiomyocyte', 'endothelial_cell'],
    requiredProteins: ['actin_myosin', 'hemoglobin'],
    compounds: { heme: 1, iron: 1 },
    ecmArchitecture: 'Autorhythmic cardiac muscle coupled to elastic arterial/venous endothelium.',
    parts: [
      { id: 'tis_end_myo', label: 'Syncytial Cardiomyocyte Wall', refLevel: 3, refId: 'cardiomyocyte' },
      { id: 'tis_end_vasc', label: 'Vascular Endothelial Lumen Lining', refLevel: 3, refId: 'endothelial_cell' },
      { id: 'tis_end_hb', label: 'Coronary Hemoglobin Blood Supply', refLevel: 1, refId: 'hemoglobin' }
    ]
  },
  neural: {
    id: 'neural',
    name: 'Cortical Gray Matter & Myelinated Tracts',
    icon: '🧠',
    color: '#f59e0b',
    formula: 'Sphingomyelin Sheaths + NaV1.6 Nodes',
    requiredCells: ['motor_neuron'],
    requiredProteins: ['ion_channel', 'atp_synthase'],
    compounds: { phospholipid: 2, 'glutamic-acid': 2 },
    ecmArchitecture: '6-layered neocortical columns and myelinated spinal white-matter tracts.',
    parts: [
      { id: 'tis_neu_cells', label: 'Pyramidal & Motor Neuron Network', refLevel: 3, refId: 'motor_neuron' },
      { id: 'tis_neu_myelin', label: 'Multilamellar Myelin Lipid Insulation', refLevel: 1, refId: 'phospholipid_bilayer' },
      { id: 'tis_neu_nav', label: 'High-Density Voltage Ion Channel Array', refLevel: 1, refId: 'ion_channel' }
    ]
  }
};

// ============================================================================
// LEVEL 5 (TOP): MACRO 3D HUMAN ORGAN SYSTEMS (Real Z-Anatomy GLB Models!)
// ============================================================================
export const TIER_1_ORGAN_SYSTEMS = [
  {
    id: 'skeletal_system',
    anatomyTissueId: 'osteoid',
    glbModel: '/models/lumc_skeleton.glb',
    name: '206-Bone Human Skeleton',
    latinName: 'Systema skeletale (206 Ossa)',
    icon: '🦴',
    color: '#38bdf8',
    meshCount: 229,
    requiredTissue: 'osteoid',
    requiredCells: ['osteoblast'],
    requiredProteins: ['collagen_i', 'atp_synthase'],
    subParts: [
      { id: 'skel_cranium', label: 'Cranial & Facial Skull (29 Bones)' },
      { id: 'skel_spine_ribs', label: 'Vertebral Column & Ribcage (51 Bones)' },
      { id: 'skel_upper_limbs', label: 'Pectoral Girdle & Upper Limbs (64 Bones)' },
      { id: 'skel_lower_limbs', label: 'Pelvic Girdle & Lower Limbs (62 Bones)' }
    ],
    description:
      'Complete 206-bone human endoskeleton and 23 intervertebral discs mineralized from Haversian osteoid tissue.',
    clinicalNote: 'Deploys all 206 clinical CT bones into the 3D Human Anatomy Atlas.'
  },
  {
    id: 'muscular_system',
    anatomyTissueId: 'myofibril',
    glbModel: '/models/joints.glb',
    name: 'Muscular System & 349 Ligaments',
    latinName: 'Systema musculare et syndesmologia',
    icon: '💪',
    color: '#f43f5e',
    meshCount: 389,
    requiredTissue: 'myofibril',
    requiredCells: ['cardiomyocyte', 'osteoblast'],
    requiredProteins: ['actin_myosin', 'collagen_i', 'atp_synthase'],
    subParts: [
      { id: 'musc_axial', label: 'Axial Postural & Core Myofascial Slings' },
      { id: 'musc_upper', label: 'Brachial & Forearm Flexor/Extensor Bellies' },
      { id: 'musc_lower', label: 'Quadriceps, Hamstring & Gastrocnemius Bellies' },
      { id: 'musc_ligaments', label: '349 Articular Joint Capsules & Ligaments' }
    ],
    description:
      'Bilateral skeletal muscle groups, tendons, and 349 Z-Anatomy joint capsules & ligaments.',
    clinicalNote: 'Deploys all muscles and 349 articular ligaments into the 3D Human Anatomy Atlas.'
  },
  {
    id: 'visceral_system',
    anatomyTissueId: 'visceral',
    glbModel: '/models/visceral.glb',
    name: 'Lungs, Liver, Stomach & Kidneys',
    latinName: 'Splanchnologia (Pulmones, Hepar, Gaster, Renes)',
    icon: '🫁',
    color: '#10b981',
    meshCount: 276,
    requiredTissue: 'visceral',
    requiredCells: ['hepatocyte', 'endothelial_cell'],
    requiredProteins: ['hemoglobin', 'collagen_i', 'atp_synthase'],
    subParts: [
      { id: 'visc_airway', label: 'Cartilaginous Trachea & Bronchial Tree' },
      { id: 'visc_lungs', label: 'Right (3-Lobed) & Left (2-Lobed) Lungs' },
      { id: 'visc_liver', label: 'Hepatic Lobes, Gallbladder & Bile Ducts' },
      { id: 'visc_gi_renal', label: 'Stomach, Spleen, Pancreas & Kidneys' }
    ],
    description:
      'High-definition respiratory, digestive, urinary, and lymphatic visceral organs.',
    clinicalNote: 'Deploys 118 HD visceral organs + 158 lymphatic vessels into the 3D Human Anatomy Atlas.'
  },
  {
    id: 'cardiovascular_system',
    anatomyTissueId: 'endothelial',
    glbModel: '/models/cardiovascular.glb',
    name: '4-Chamber Heart & Vascular Tree',
    latinName: 'Systema cardiovasculare (Cor et Vasa)',
    icon: '🫀',
    color: '#ef4444',
    meshCount: 676,
    requiredTissue: 'endothelial',
    requiredCells: ['cardiomyocyte', 'endothelial_cell'],
    requiredProteins: ['actin_myosin', 'hemoglobin', 'atp_synthase'],
    subParts: [
      { id: 'cardio_ventricles', label: 'Left & Right Muscular Ventricles' },
      { id: 'cardio_atria', label: 'Left & Right Venous Atria (Auricles)' },
      { id: 'cardio_valves', label: 'Tricuspid, Mitral, Aortic & Pulmonary Valves' },
      { id: 'cardio_vessels', label: 'Aortic Arch, Vena Cava & Coronary Tree' }
    ],
    description:
      'Beating 4-chamber heart (atria, ventricles, valves, coronary arteries) and systemic arterial-venous tree.',
    clinicalNote: 'Deploys 676 HD cardiovascular structures & 72 BPM heartbeat into the 3D Anatomy Atlas.'
  },
  {
    id: 'nervous_system',
    anatomyTissueId: 'neural',
    glbModel: '/models/nervous.glb',
    name: 'Brain, Spinal Cord & Nerves',
    latinName: 'Systema nervosum (Encephalon et Medulla)',
    icon: '🧠',
    color: '#f59e0b',
    meshCount: 580,
    requiredTissue: 'neural',
    requiredCells: ['motor_neuron', 'endothelial_cell'],
    requiredProteins: ['ion_channel', 'atp_synthase'],
    subParts: [
      { id: 'nerv_cortex', label: 'Left & Right Cerebral Cortex Hemispheres' },
      { id: 'nerv_cerebellum', label: 'Cerebellum, Pons & Medulla Brainstem' },
      { id: 'nerv_limbic', label: 'Thalamus, Hippocampus & Corpus Callosum' },
      { id: 'nerv_spinal', label: 'Spinal Cord & 43 Pairs of Cranial/Spinal Nerves' }
    ],
    description:
      'Cerebral hemispheres, cerebellum, brainstem, spinal cord, cranial nerves, and peripheral plexuses.',
    clinicalNote: 'Deploys 580 HD neural structures & 40 Hz Gamma EEG into the 3D Anatomy Atlas.'
  }
];

// Keep named exports for backwards compatibility across all tests
export const TIER_2_TISSUE_SCAFFOLDS = LEVEL_4_TISSUES;
export const TIER_3_CELL_LINEAGES = LEVEL_3_CELLS;

export const TIER_4_FOLDED_PROTEINS = {
  collagen_i: {
    id: 'collagen_i',
    geneId: 'col1a1',
    name: 'Type-I Triple-Helix Collagen (COL1A1)',
    motif: '(Gly-Pro-Hyp)ₙ Left-Handed Polyproline II',
    secondaryStructure: 'Triple Helix (300 nm rod)',
    freeEnergyKcal: -48.6,
    chaperonin: 'HSP47 + Prolyl 4-Hydroxylase',
    dna: 'ATGGGTCCACCAGGTCCACCAGGTCCACCAGGTTAG',
    icon: '🪢',
    color: '#38bdf8',
    usedInTissues: ['osteoid', 'myofibril', 'visceral']
  },
  actin_myosin: {
    id: 'actin_myosin',
    geneId: 'myh7',
    name: 'Actin-Myosin II Sarcomere Motor (MYH7)',
    motif: 'P-Loop NTPase + Coiled-Coil α-Helix',
    secondaryStructure: '68% α-Helix / 18% β-Sheet',
    freeEnergyKcal: -62.4,
    chaperonin: 'UNC-45B + HSP90',
    dna: 'ATGGCCGAGCTGAAGCTGCTGGAGGAGGAGCGCAAGTAG',
    icon: '💪',
    color: '#f43f5e',
    usedInTissues: ['myofibril', 'endothelial']
  },
  hemoglobin: {
    id: 'hemoglobin',
    geneId: 'hbb',
    name: 'Hemoglobin α₂β₂ Heme Pocket (HBB)',
    motif: 'Globin Fold (8 α-Helices + Fe²⁺ Porphyrin)',
    secondaryStructure: '78% α-Helix (Globin)',
    freeEnergyKcal: -54.2,
    chaperonin: 'AHSP (Alpha-Hemoglobin Stabilizing Protein)',
    dna: 'ATGGTGCTGTCCCTGTTCGACAAGGTGAAGCACCTGAAGACCTAG',
    icon: '🩸',
    color: '#10b981',
    usedInTissues: ['visceral', 'endothelial']
  },
  ion_channel: {
    id: 'ion_channel',
    geneId: 'scn9a',
    name: 'Voltage-Gated Na⁺/K⁺ Channel (NaV1.7)',
    motif: '4x6 Transmembrane α-Helices + S4 Arg Sensor',
    secondaryStructure: 'Transmembrane α-Bundle + P-Loop Filter',
    freeEnergyKcal: -71.0,
    chaperonin: 'Calnexin / ER Translocon Sec61',
    dna: 'ATGCGTCGCCTGATCTTCGTGCTGGTCATCGGCCAGTAG',
    icon: '🔌',
    color: '#f59e0b',
    usedInTissues: ['neural']
  },
  atp_synthase: {
    id: 'atp_synthase',
    geneId: 'atp5f1a',
    name: 'F₀F₁ ATP Synthase Rotary Motor (ATP5F1A)',
    motif: 'c-Ring Proton Turbine + α₃β₃ Catalytic Hexamer',
    secondaryStructure: 'Alternating α/β Rossmann Fold',
    freeEnergyKcal: -84.5,
    chaperonin: 'GroEL / GroES (HSP60/HSP10)',
    dna: 'ATGGCCATCACCGGCCGTGTCATCGGCGCCCTGAAGTAG',
    icon: '⚡',
    color: '#a855f7',
    usedInTissues: ['osteoid', 'myofibril', 'visceral', 'endothelial', 'neural']
  }
};

export const TIER_5_DNA_GENES = Object.values(TIER_4_FOLDED_PROTEINS).map((p) => ({
  id: p.geneId,
  proteinId: p.id,
  name: `${p.name.split(' (')[1]?.replace(')', '') || p.id.toUpperCase()} Coding Gene`,
  proteinName: p.name,
  dna: p.dna,
  mrna: p.dna.replace(/T/g, 'U'),
  codonCount: Math.floor(p.dna.length / 3),
  organelleRequirement: 'Nucleus (RNA Pol II) + 80S Ribosome + Mitochondrion (ATP)'
}));

export function evaluateMorphogenGradientMatch(cellId, bmpShh = 50, wntFgf = 50) {
  const lineage = LEVEL_3_CELLS[cellId];
  if (!lineage || !lineage.optimalMorphogens) {
    return { matchPercent: 0, isLocked: false };
  }
  const d1 = Math.abs(bmpShh - lineage.optimalMorphogens.bmpShh);
  const d2 = Math.abs(wntFgf - lineage.optimalMorphogens.wntFgf);
  const dist = Math.sqrt(d1 * d1 + d2 * d2);
  const matchPercent = Math.max(0, Math.min(100, Math.round(100 - dist * 1.15)));
  return {
    matchPercent,
    isLocked: matchPercent >= 80,
    optimal: lineage.optimalMorphogens
  };
}

const CODON_TO_AA = {
  AUG: 'Met', GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  GCC: 'Ala', GCU: 'Ala', GCA: 'Ala', GCG: 'Ala',
  GAG: 'Glu', GAA: 'Glu', CUG: 'Leu', CUC: 'Leu', UUC: 'Phe',
  AAG: 'Lys', AAA: 'Lys', CGC: 'Arg', CGU: 'Arg',
  GUG: 'Val', GUC: 'Val', GUU: 'Val',
  UCC: 'Ser', UCU: 'Ser', GAC: 'Asp', GAU: 'Asp',
  CAC: 'His', CAU: 'His', ACC: 'Thr', ACU: 'Thr',
  AUC: 'Ile', AUU: 'Ile', CAG: 'Gln', CAA: 'Gln',
  UAG: 'STOP', UAA: 'STOP', UGA: 'STOP'
};

const COMPLEMENT_RNA = { A: 'U', U: 'A', G: 'C', C: 'G' };

export function computeRibosomeStep(dnaString = '', stepIndex = 0) {
  const mrna = dnaString.toUpperCase().replace(/[^ATCGU]/g, '').replace(/T/g, 'U');
  const codons = mrna.match(/.{1,3}/g) || [];
  const clampedStep = Math.max(0, Math.min(codons.length - 1, stepIndex));

  const eSiteCodon = clampedStep > 0 ? codons[clampedStep - 1] : null;
  const pSiteCodon = codons[clampedStep] || 'AUG';
  const aSiteCodon = clampedStep + 1 < codons.length ? codons[clampedStep + 1] : null;

  const anticodon = pSiteCodon
    .split('')
    .map((base) => COMPLEMENT_RNA[base] || 'N')
    .join('');

  const nascentChain = codons
    .slice(0, clampedStep + 1)
    .map((c) => CODON_TO_AA[c] || 'Xaa')
    .filter((aa) => aa !== 'STOP');

  return {
    codons,
    totalCodons: codons.length,
    stepIndex: clampedStep,
    eSiteCodon,
    pSiteCodon,
    aSiteCodon,
    tRnaAnticodon: `3'-${anticodon}-5'`,
    currentAminoAcid: CODON_TO_AA[pSiteCodon] || 'Xaa',
    nascentChain,
    isComplete: clampedStep >= codons.length - 1 || CODON_TO_AA[pSiteCodon] === 'STOP',
    atpGtpConsumed: (clampedStep + 1) * 3
  };
}

export function evaluateOrganSystemChain(organSystemId, bioState = {}, anatomyState = {}) {
  const sys =
    TIER_1_ORGAN_SYSTEMS.find((s) => s.id === organSystemId) || TIER_1_ORGAN_SYSTEMS[0];
  const foldedProteins = bioState.foldedProteins || [];
  const differentiatedCells = bioState.differentiatedCells || [];
  const engineeredTissues = bioState.engineeredTissues || [];
  const transcribedGenes = bioState.transcribedGenes || [];
  const bioprintedTissues = anatomyState.bioprintedTissues || {};

  const organellesPresent = new Set(
    (bioState.currentCellDesign?.organelles || []).map((o) => o.type)
  );
  const coreOrganellesReady =
    organellesPresent.has('nucleus') &&
    organellesPresent.has('mitochondrion') &&
    (organellesPresent.has('ribosome') || organellesPresent.size >= 4);

  const missingGenes = sys.requiredProteins
    .map((pid) => TIER_4_FOLDED_PROTEINS[pid]?.geneId)
    .filter((gid) => gid && !transcribedGenes.includes(gid));

  const missingProteins = sys.requiredProteins.filter((pid) => !foldedProteins.includes(pid));
  const missingCells = sys.requiredCells.filter((cid) => !differentiatedCells.includes(cid));
  const tissueReady = engineeredTissues.includes(sys.requiredTissue);
  const deployedIn3D = Boolean(bioprintedTissues[sys.anatomyTissueId]);

  const totalSteps =
    1 + sys.requiredProteins.length * 2 + sys.requiredCells.length + 1 + 1;
  const completedSteps =
    (coreOrganellesReady ? 1 : 0) +
    (sys.requiredProteins.length - missingGenes.length) +
    (sys.requiredProteins.length - missingProteins.length) +
    (sys.requiredCells.length - missingCells.length) +
    (tissueReady ? 1 : 0) +
    (deployedIn3D ? 1 : 0);

  return {
    system: sys,
    coreOrganellesReady,
    missingGenes,
    missingProteins,
    missingCells,
    tissueReady,
    deployedIn3D,
    readinessPercent: Math.round((completedSteps / Math.max(1, totalSteps)) * 100)
  };
}

export function evaluateChaperoninFolding(proteinId, tempC = 37.0, pH = 7.4) {
  const prot = TIER_4_FOLDED_PROTEINS[proteinId] || TIER_4_FOLDED_PROTEINS.collagen_i;
  const tempPenalty = Math.abs(tempC - 37.0) * 1.8;
  const phPenalty = Math.abs(pH - 7.4) * 18.0;
  const effectiveDeltaG = Number((prot.freeEnergyKcal + tempPenalty + phPenalty).toFixed(1));
  const isNativeFold = effectiveDeltaG <= -25.0;
  const stateLabel =
    effectiveDeltaG <= -40
      ? 'Native Minimum (Chaperonin Locked)'
      : effectiveDeltaG <= -20
      ? 'Molten Globule Intermediate'
      : 'Denatured / Misfolded Random Coil';

  return {
    effectiveDeltaG,
    targetDeltaG: prot.freeEnergyKcal,
    isNativeFold,
    stateLabel
  };
}

export function evaluateECMScaffoldBiophysics(
  tissueId,
  crossLinkDensity = 80,
  perfusionMmHg = 95
) {
  const optimalCrossLink = tissueId === 'osteoid' ? 92 : tissueId === 'neural' ? 55 : 78;
  const dCross = Math.abs(crossLinkDensity - optimalCrossLink);
  const dPerf = Math.abs(perfusionMmHg - 95);
  const viabilityScore = Math.max(
    0,
    Math.min(100, Math.round(100 - dCross * 0.7 - dPerf * 0.6))
  );
  return {
    viabilityScore,
    isViable: viabilityScore >= 75,
    optimalCrossLink,
    optimalPerfusion: 95
  };
}

/**
 * Evaluates live physiological bench-test telemetry for an assembled Stage-5 Macro Organ System.
 */
export function evaluateOrganPhysiologyBenchTest(systemId, readinessPercent = 100) {
  const ratio = Math.max(0.1, Math.min(1, readinessPercent / 100));
  switch (systemId) {
    case 'cardiovascular_system':
      return {
        primaryMetric: `${(5.2 * ratio).toFixed(1)} L/min`,
        primaryLabel: 'Cardiac Output (CO)',
        secondaryMetric: `${Math.round(66 * ratio)}%`,
        secondaryLabel: 'Ejection Fraction (LVEF)',
        tertiaryMetric: `${Math.round(72 * ratio)} BPM`,
        tertiaryLabel: 'Sinus Rhythm',
        passed: readinessPercent >= 75
      };
    case 'visceral_system':
      return {
        primaryMetric: `${Math.round(260 * ratio)} mL/min`,
        primaryLabel: 'Alveolar VO₂ Uptake',
        secondaryMetric: `${Math.round(125 * ratio)} mL/min`,
        secondaryLabel: 'Glomerular Filtration (GFR)',
        tertiaryMetric: `${(98.5 * ratio).toFixed(1)}%`,
        tertiaryLabel: 'Arterial SpO₂',
        passed: readinessPercent >= 75
      };
    case 'nervous_system':
      return {
        primaryMetric: `${(40.0 * ratio).toFixed(1)} Hz`,
        primaryLabel: 'Cortical Gamma EEG',
        secondaryMetric: `${Math.round(120 * ratio)} m/s`,
        secondaryLabel: 'Saltatory Axon Velocity',
        tertiaryMetric: `-70 mV`,
        tertiaryLabel: 'Resting Potential',
        passed: readinessPercent >= 75
      };
    case 'muscular_system':
      return {
        primaryMetric: `${Math.round(1850 * ratio)} N`,
        primaryLabel: 'Peak Tetanic Force',
        secondaryMetric: `${(2.2 * ratio).toFixed(2)} µm`,
        secondaryLabel: 'Sarcomere Length',
        tertiaryMetric: `${Math.round(95 * ratio)}%`,
        tertiaryLabel: 'Tendon Tensile Integrity',
        passed: readinessPercent >= 75
      };
    case 'skeletal_system':
    default:
      return {
        primaryMetric: `${Math.round(195 * ratio)} MPa`,
        primaryLabel: 'Cortical Compressive Yield',
        secondaryMetric: `${(1.25 * ratio).toFixed(2)} g/cm³`,
        secondaryLabel: 'Bone Mineral Density (BMD)',
        tertiaryMetric: `206 / 206`,
        tertiaryLabel: 'Articular Alignment',
        passed: readinessPercent >= 75
      };
  }
}

