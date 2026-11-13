/**
 * TOP-DOWN BIOLOGICAL PRECISION HIERARCHY (Tier 1 Macro-Organs -> Tier 5 DNA Codons)
 *
 * Designed from Top (General Macro-Structure) to Bottom (Molecular & Genetic Sub-Elements):
 *   Tier 1: Macro-Anatomical Organ Systems & 206 Bones (3D Anatomy Atlas)
 *   Tier 2: Histogenesis Tissue Scaffolds & Extracellular Matrix (ECM)
 *   Tier 3: Specialized Differentiated Cell Lineages (Morphogen Gradients)
 *   Tier 4: Folded 3D Structural & Enzymatic Proteins (Chaperonin Folding)
 *   Tier 5: Organelles, Ribosomal mRNA Translation & DNA Coding Genes
 */

export const TIER_1_ORGAN_SYSTEMS = [
  {
    id: 'skeletal_system',
    anatomyTissueId: 'osteoid',
    name: '206-Bone Endoskeleton & Articular Discs',
    latinName: 'Systema skeletale (206 Ossa)',
    icon: '🦴',
    meshCount: 229,
    requiredTissue: 'osteoid',
    requiredCells: ['osteoblast'],
    requiredProteins: ['collagen_i', 'atp_synthase'],
    description:
      'Cortical and trabecular bone matrix mineralized with hydroxyapatite crystals around triple-helix Type-I collagen.',
    clinicalNote: 'Unlocks all 206 clinical CT bones + 23 intervertebral discs in the 3D Anatomy Lab.'
  },
  {
    id: 'muscular_system',
    anatomyTissueId: 'myofibril',
    name: 'Myofascial Slings & 349 Joint Ligaments',
    latinName: 'Systema musculare et syndesmologia',
    icon: '💪',
    meshCount: 389,
    requiredTissue: 'myofibril',
    requiredCells: ['cardiomyocyte', 'osteoblast'],
    requiredProteins: ['actin_myosin', 'collagen_i', 'atp_synthase'],
    description:
      'Contractile sarcomere arrays of actin and myosin filaments anchored to bone periosteum via dense collagenous tendons.',
    clinicalNote: 'Unlocks bilateral myofascial muscle slings and 349 Z-Anatomy joint ligaments.'
  },
  {
    id: 'visceral_system',
    anatomyTissueId: 'visceral',
    name: 'Visceral & Lymphatic Organ Systems',
    latinName: 'Splanchnologia (Pulmones, Hepar, Gaster, Renes)',
    icon: '🫁',
    meshCount: 276,
    requiredTissue: 'visceral',
    requiredCells: ['hepatocyte', 'endothelial_cell'],
    requiredProteins: ['hemoglobin', 'collagen_i', 'atp_synthase'],
    description:
      'Endodermal parenchymal organs (lungs, liver, stomach, kidneys, spleen) perfused by micro-capillary gas and metabolic exchange.',
    clinicalNote: 'Unlocks 118 HD visceral organs and 158 lymphatic nodes/vessels in 3D.'
  },
  {
    id: 'cardiovascular_system',
    anatomyTissueId: 'endothelial',
    name: '4-Chamber Heart & Arterial-Venous Tree',
    latinName: 'Systema cardiovasculare (Cor et Vasa)',
    icon: '🫀',
    meshCount: 676,
    requiredTissue: 'endothelial',
    requiredCells: ['cardiomyocyte', 'endothelial_cell'],
    requiredProteins: ['actin_myosin', 'hemoglobin', 'atp_synthase'],
    description:
      'Autorhythmic 4-chamber myocardium with tricuspid, mitral, aortic, and pulmonary valves pumping oxygenated hemoglobin.',
    clinicalNote: 'Unlocks 676 HD cardiovascular structures and 72 BPM systolic cardiac contraction.'
  },
  {
    id: 'nervous_system',
    anatomyTissueId: 'neural',
    name: 'Brain, Spinal Cord & Cranial/Spinal Connectome',
    latinName: 'Systema nervosum (Encephalon et Medulla)',
    icon: '🧠',
    meshCount: 580,
    requiredTissue: 'neural',
    requiredCells: ['motor_neuron', 'endothelial_cell'],
    requiredProteins: ['ion_channel', 'atp_synthase'],
    description:
      'Myelinated central and peripheral neural tracts propagating 40 Hz gamma action potentials via voltage-gated Na+/K+ channels.',
    clinicalNote: 'Unlocks 580 HD brain & nerve tracts and 40 Hz Gamma EEG consciousness.'
  }
];

export const TIER_2_TISSUE_SCAFFOLDS = {
  osteoid: {
    id: 'osteoid',
    name: 'Mineralized Osteoid ECM Scaffold',
    icon: '🦴',
    formula: 'Ca₁₀(PO₄)₆(OH)₂ + Type-I Collagen',
    requiredCells: ['osteoblast'],
    requiredProteins: ['collagen_i'],
    compounds: { calcium: 2, 'phosphoric-acid': 2 },
    ecmArchitecture: 'Concentric Haversian osteons with cross-linked hydroxyapatite nanocrystals'
  },
  myofibril: {
    id: 'myofibril',
    name: 'Striated Sarcomere & Tendon Matrix',
    icon: '💪',
    formula: 'Actin-Myosin II + Tropomyosin + Collagen I',
    requiredCells: ['cardiomyocyte'],
    requiredProteins: ['actin_myosin', 'collagen_i'],
    compounds: { glucose: 2, glycine: 2 },
    ecmArchitecture: 'Anisotropic Z-disc sarcomere bundles sheathed in endomysial collagen'
  },
  visceral: {
    id: 'visceral',
    name: 'Endodermal Parenchyma & Alveolar Basement ECM',
    icon: '🫁',
    formula: 'Type-IV Laminin + Surfactant Phospholipids',
    requiredCells: ['hepatocyte'],
    requiredProteins: ['hemoglobin', 'collagen_i'],
    compounds: { water: 3, phospholipid: 2 },
    ecmArchitecture: 'Fenestrated sinusoidal lobules and 0.2 µm alveolar-capillary gas membranes'
  },
  endothelial: {
    id: 'endothelial',
    name: 'Vascular Endothelium & Syncytial Myocardium',
    icon: '🫀',
    formula: 'Connexin-43 Gap Junctions + Elastin Lamellae',
    requiredCells: ['cardiomyocyte', 'endothelial_cell'],
    requiredProteins: ['actin_myosin', 'hemoglobin'],
    compounds: { heme: 1, iron: 1 },
    ecmArchitecture: 'Intercalated disc syncytium lined by anti-thrombotic glycocalyx endothelium'
  },
  neural: {
    id: 'neural',
    name: 'Myelinated Axonal & Cortical Neuropil',
    icon: '🧠',
    formula: 'Sphingomyelin + Nodes of Ranvier NaV1.6',
    requiredCells: ['motor_neuron'],
    requiredProteins: ['ion_channel', 'atp_synthase'],
    compounds: { phospholipid: 2, 'glutamic-acid': 2 },
    ecmArchitecture: 'Multilamellar myelin lipid sheaths with high-density voltage-gated ion nodes'
  }
};

export const TIER_3_CELL_LINEAGES = {
  osteoblast: {
    id: 'osteoblast',
    name: 'Osteoblast / Osteocyte',
    germLayer: 'Mesoderm (Sclerotome)',
    morphogenSignal: 'BMP4 + Runx2 / Osterix',
    optimalMorphogens: { bmpShh: 82, wntFgf: 60 },
    icon: '🦴',
    color: '#38bdf8',
    requiredProteins: ['collagen_i', 'atp_synthase'],
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'membrane'],
    role: 'Secretes Type-I collagen osteoid and alkaline phosphatase to nucleate bone mineral.'
  },
  cardiomyocyte: {
    id: 'cardiomyocyte',
    name: 'Striated Myocyte / Cardiomyocyte',
    germLayer: 'Mesoderm (Myotome & Splanchnic)',
    morphogenSignal: 'Wnt3a + Nkx2.5 + GATA4',
    optimalMorphogens: { bmpShh: 52, wntFgf: 78 },
    icon: '🫀',
    color: '#f43f5e',
    requiredProteins: ['actin_myosin', 'atp_synthase'],
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'membrane'],
    role: 'Generates rhythmic Ca²⁺-triggered power strokes across sarcomeric Z-discs.'
  },
  hepatocyte: {
    id: 'hepatocyte',
    name: 'Endodermal Hepatocyte & Pneumocyte',
    germLayer: 'Endoderm (Foregut)',
    morphogenSignal: 'FGF2 + HNF4α + Sox9',
    optimalMorphogens: { bmpShh: 42, wntFgf: 85 },
    icon: '🫁',
    color: '#10b981',
    requiredProteins: ['hemoglobin', 'atp_synthase'],
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'membrane'],
    role: 'Performs xenobiotic detoxification, plasma protein synthesis, and alveolar gas exchange.'
  },
  endothelial_cell: {
    id: 'endothelial_cell',
    name: 'Vascular Endothelial & Erythroid Precursor',
    germLayer: 'Mesoderm (Hemangioblast)',
    morphogenSignal: 'VEGF-A + Flk1 + EPO',
    optimalMorphogens: { bmpShh: 35, wntFgf: 92 },
    icon: '🩸',
    color: '#ef4444',
    requiredProteins: ['hemoglobin', 'collagen_i'],
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'membrane'],
    role: 'Forms capillary lumens and packages tetrameric hemoglobin for O₂/CO₂ transport.'
  },
  motor_neuron: {
    id: 'motor_neuron',
    name: 'Cholinergic Motor & Cortical Neuron',
    germLayer: 'Ectoderm (Neural Tube)',
    morphogenSignal: 'Sonic Hedgehog (Shh) + Retinoic Acid',
    optimalMorphogens: { bmpShh: 15, wntFgf: 72 },
    icon: '🧠',
    color: '#f59e0b',
    requiredProteins: ['ion_channel', 'atp_synthase'],
    requiredOrganelles: ['nucleus', 'mitochondrion', 'ribosome', 'membrane'],
    role: 'Propagates saltatory action potentials (120 m/s) and releases synaptic neurotransmitters.'
  }
};

/**
 * Evaluates Wolpert French-Flag morphogen gradient resonance (0-100%) for a target cell lineage.
 */
export function evaluateMorphogenGradientMatch(cellId, bmpShh = 50, wntFgf = 50) {
  const lineage = TIER_3_CELL_LINEAGES[cellId];
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

/**
 * Computes the 80S Ribosome E-Site, P-Site, and A-Site state at a given codon step index.
 */
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
    atpGtpConsumed: (clampedStep + 1) * 3 // 1 ATP (aminoacyl-tRNA charging) + 2 GTP (EF1A + EF2 translocation)
  };
}

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
    icon: '🧬',
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
    dna: 'ATGGCCGAGCTGVRGCTGCTGGAGGAGGAGCGCAAGTAG'.replace('VRG', 'AAG'),
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
    icon: '⚡',
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
    icon: '🔋',
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

/**
 * Evaluates the top-down readiness of a target Tier-1 Organ System given the current BioStore state.
 */
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

/**
 * Tier 4 Anfinsen Thermodynamic Folding Funnel Evaluator:
 * Computes effective ΔG (kcal/mol) and native fold stability at a given temperature (°C) and pH.
 */
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

/**
 * Tier 2 Histogenesis ECM Cross-Linking & Vascular Perfusion Evaluator:
 * Evaluates tensile modulus (MPa) and O2 perfusion viability for a 3D tissue scaffold.
 */
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

