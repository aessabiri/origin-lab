/**
 * Scientifically Grounded Ossification & Mechanobiology Engine
 * Models both Endochondral (Long Bone / Femur) and Intramembranous (Cranial Vault) ossification.
 */

export const OSSIFICATION_ELEMENTS = [
  { id: 'mesenchymal_cells', name: 'Mesenchymal Stem Cells', symbol: 'MSC', category: 'Stem Cell', color: '#38bdf8', role: 'Pluripotent mesoderm progenitors' },
  { id: 'collagen_ii', name: 'Type-II Collagen & GAGs', symbol: 'Col-II', category: 'Cartilage ECM', color: '#60a5fa', role: 'Builds hyaline cartilage template' },
  { id: 'vegf_a', name: 'VEGF-A Angiogenic Factor', symbol: 'VEGF', category: 'Morphogen', color: '#f43f5e', role: 'Triggers periosteal blood vessel invasion' },
  { id: 'oxygen', name: 'Dissolved Oxygen (O₂)', symbol: 'O₂', category: 'Gas', color: '#22d3ee', role: 'Fuels osteoblast aerobic respiration' },
  { id: 'collagen_i', name: 'Type-I Collagen Triple Helix', symbol: 'Col-I', category: 'Osteoid ECM', color: '#f59e0b', role: 'Provides tensile flexibility (90% of osteoid)' },
  { id: 'calcium', name: 'Calcium Ions (Ca²⁺)', symbol: 'Ca²⁺', category: 'Mineral', color: '#e2e8f0', role: 'Nucleates hydroxyapatite crystals' },
  { id: 'phosphate', name: 'Phosphate Ions (PO₄³⁻)', symbol: 'PO₄', category: 'Mineral', color: '#fb923c', role: 'Bonds Ca²⁺ into Ca₁₀(PO₄)₆(OH)₂' },
  { id: 'osteoclasts', name: 'Osteoclasts (HCl + Cathepsin K)', symbol: 'OCL', category: 'Resorber', color: '#c084fc', role: 'Carves medullary marrow cavity & remodels bone' },
];

export const createInitialOssificationState = (pathway = 'endochondral', { prefilled = true } = {}) => ({
  pathway, // 'endochondral' | 'intramembranous'
  // Reactor Dials
  morphogenBmpWnt: 65,     // 0..100 (BMP-2 / Wnt / FGF)
  o2Perfusion: 21,         // 0..40 %
  mechanicalLoadN: 450,    // 0..1200 Newtons (Wolff's Law)
  crossSectionCut: false,

  // Master Genetic Switches
  sox9Active: false,       // Chondroblast commitment (Endochondral)
  runx2Active: false,      // Osteoblast commitment
  vegfTriggered: false,    // Angiogenesis / Primary Ossification Center
  osteoclastsActive: false,// Medullary cavity resorption
  growthPlateFused: false, // Epiphyseal plate closure

  // Unlocked Element Reservoirs (0..100% concentration in bioreactor)
  elements: {
    mesenchymal_cells: 100,
    collagen_ii: prefilled ? 100 : 0,
    vegf_a: prefilled ? 100 : 0,
    oxygen: 100,
    collagen_i: prefilled ? 100 : 0,
    calcium: prefilled ? 100 : 0,
    phosphate: prefilled ? 100 : 0,
    osteoclasts: prefilled ? 100 : 0,
  },

  // Live Tissue Metrics (0..100)
  condensation: 0,
  cartilageTemplate: 0,
  vascularization: 0,
  osteoidCollagen: 0,
  mineralization: 0,
  marrowCavity: 0,
  wolffAlignment: 0,
});

export function getOssificationPhase(state) {
  if (state.mineralization >= 85 && state.marrowCavity >= 60) {
    return {
      index: 6,
      code: 'PHASE 06 // REMODELED CORTICAL BONE',
      title: 'Mature Living Bone (Haversian + Marrow)',
      detail: 'Osteocytes sense load via canaliculi; Osteoclasts & Osteoblasts remodel trabeculae (Wolff’s Law).',
    };
  }
  if (state.mineralization >= 40) {
    return {
      index: 5,
      code: 'PHASE 05 // HYDROXYAPATITE MINERALIZATION',
      title: 'Ca₁₀(PO₄)₆(OH)₂ Crystal Deposition',
      detail: 'Calcium & Phosphate crystallize inside Type-I Collagen gaps, trapping Osteocytes.',
    };
  }
  if (state.osteoidCollagen >= 30) {
    return {
      index: 4,
      code: 'PHASE 04 // OSTEOID SECRETION',
      title: 'RUNX2 Osteoblasts Weaving Type-I Collagen',
      detail: 'Unmineralized organic osteoid forms—flexible like rubber until Ca²⁺ & PO₄³⁻ are infused.',
    };
  }
  if (state.vascularization >= 25 || (state.pathway === 'intramembranous' && state.runx2Active)) {
    return {
      index: 3,
      code: 'PHASE 03 // VASCULAR INVASION',
      title: 'VEGF-A Angiogenesis & Primary Ossification',
      detail: 'Blood vessels invade the hypoxic core, delivering O₂ and Osteoprogenitor cells.',
    };
  }
  if (state.pathway === 'endochondral' && (state.sox9Active || state.cartilageTemplate > 10)) {
    return {
      index: 2,
      code: 'PHASE 02 // HYALINE CARTILAGE MODEL',
      title: 'SOX9 Chondroblasts & Epiphyseal Plates',
      detail: 'Chondrocytes stack into growth plates and build the hyaline cartilage template.',
    };
  }
  return {
    index: 1,
    code: 'PHASE 01 // MESENCHYMAL CONDENSATION',
    title: 'Stem Cell Condensation & Hox Blueprint',
    detail: 'Apply BMP-2/Wnt morphogens, then flip SOX9 (Endochondral) or RUNX2 (Intramembranous).',
  };
}

export function evaluateMechanicalStressTest(state) {
  const col = state.osteoidCollagen;
  const min = state.mineralization;
  const marrow = state.marrowCavity;

  if (col < 20 && min < 20) {
    return {
      status: 'COLLAPSE',
      label: 'Soft Cartilage / Uncondensed Tissue',
      color: '#f43f5e',
      detail: 'No Type-I Collagen or Hydroxyapatite matrix yet. Tissue compresses under load.',
    };
  }
  if (col >= 40 && min < 30) {
    return {
      status: 'BENDS_RUBBER',
      label: 'Flexible Osteoid (Bends Under Load)',
      color: '#f59e0b',
      detail: 'Collagen-I provides tensile strength, but without Ca₁₀(PO₄)₆(OH)₂ mineral it bends like rubber.',
    };
  }
  if (min >= 40 && col < 25) {
    return {
      status: 'BRITTLE_SHATTER',
      label: 'Brittle Mineral (Shatters Like Chalk)',
      color: '#ef4444',
      detail: 'Pure mineral without Type-I Collagen fibers lacks tensile toughness and fractures.',
    };
  }
  if (col >= 50 && min >= 75) {
    const hollowBonus = marrow >= 50 ? ' Hollow medullary cavity cuts weight by ~38%!' : '';
    return {
      status: 'CERTIFIED',
      label: 'Composite Cortical Bone (PASS)',
      color: '#10b981',
      detail: `Collagen-I + Hydroxyapatite composite withstands ${state.mechanicalLoadN} N.${hollowBonus}`,
    };
  }
  return {
    status: 'MINERALIZING',
    label: 'Partial Mineralization',
    color: '#38bdf8',
    detail: 'Continue infusing Ca²⁺ and PO₄³⁻ with adequate O₂ perfusion to reach full cortical strength.',
  };
}

export function stepOssification(prev, dt = 0.25) {
  const s = { ...prev };
  const hasMsc = s.elements.mesenchymal_cells > 5;
  const hasCol2 = s.elements.collagen_ii > 5;
  const hasCol1 = s.elements.collagen_i > 5;
  const hasCa = s.elements.calcium > 5;
  const hasPo4 = s.elements.phosphate > 5;

  // 1. Condensation driven by BMP-2 / Wnt morphogen dial
  if (hasMsc && s.morphogenBmpWnt >= 30) {
    s.condensation = Math.min(100, s.condensation + (s.morphogenBmpWnt / 100) * 32 * dt);
  }

  // 2. Endochondral Cartilage Template (SOX9)
  if (s.pathway === 'endochondral' && s.sox9Active && s.condensation >= 35 && hasCol2) {
    s.cartilageTemplate = Math.min(100, s.cartilageTemplate + 28 * dt);
  }

  // 3. Angiogenesis (VEGF-A + O2)
  const templateReady = s.pathway === 'intramembranous' ? s.condensation >= 40 : s.cartilageTemplate >= 45;
  if (s.vegfTriggered && templateReady && s.o2Perfusion >= 12) {
    s.vascularization = Math.min(100, s.vascularization + (s.o2Perfusion / 21) * 26 * dt);
  }

  // 4. Osteoid Secretion (RUNX2 + O2 + Type-I Collagen)
  const vascReady = s.pathway === 'intramembranous' ? s.condensation >= 40 : s.vascularization >= 35;
  if (s.runx2Active && vascReady && s.o2Perfusion >= 14 && hasCol1) {
    s.osteoidCollagen = Math.min(100, s.osteoidCollagen + 26 * dt);
  }

  // 5. Hydroxyapatite Mineralization (Ca2+ + PO4^3- + Osteoid)
  if (s.osteoidCollagen >= 35 && hasCa && hasPo4 && s.o2Perfusion >= 15) {
    s.mineralization = Math.min(100, s.mineralization + 24 * dt);
  }

  // 6. Osteoclast Medullary Resorption + Wolff's Law Alignment
  if (s.osteoclastsActive && s.mineralization >= 45 && s.elements.osteoclasts > 5) {
    s.marrowCavity = Math.min(100, s.marrowCavity + 24 * dt);
  }
  if (s.mineralization >= 50 && s.mechanicalLoadN >= 150) {
    s.wolffAlignment = Math.min(100, s.wolffAlignment + (s.mechanicalLoadN / 600) * 22 * dt);
  }

  return s;
}
