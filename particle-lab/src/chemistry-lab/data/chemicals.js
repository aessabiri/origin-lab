export const CHEMICALS = {
  // --- Elementary (Backbone) ---
  H2O: {
    id: 'H2O',
    name: 'Water',
    formula: 'H₂O',
    color: '#3b82f6', // blue-500
    state: 'liquid',
    density: 1.0,
    description: 'Universal solvent.',
    iconType: 'liquid',
    boilingPoint: 100,
    meltingPoint: 0,
    ph: 7.0
  },
  NaCl: {
    id: 'NaCl',
    name: 'Salt',
    formula: 'NaCl',
    color: '#f3f4f6', // gray-100
    state: 'solid',
    density: 2.16,
    description: 'Table salt.',
    iconType: 'crystal',
    boilingPoint: 1465,
    meltingPoint: 801,
    ph: 7.0,
    solubility: 36
  },
  VINEGAR: {
    id: 'VINEGAR',
    name: 'Vinegar',
    formula: 'CH₃COOH',
    color: '#fbbf24', // amber-400
    state: 'liquid',
    density: 1.01,
    description: 'Acetic acid solution.',
    iconType: 'bottle',
    boilingPoint: 118,
    meltingPoint: 16,
    ph: 2.5
  },
  BAKING_SODA: {
    id: 'BAKING_SODA',
    name: 'Baking Soda',
    formula: 'NaHCO₃',
    color: '#ffffff',
    state: 'solid',
    density: 2.2,
    description: 'Sodium bicarbonate.',
    iconType: 'powder',
    boilingPoint: 851, // Decomposes before boiling usually
    meltingPoint: 50, // Decomposes
    ph: 8.5,
    solubility: 9
  },
  UNIVERSAL_INDICATOR: {
    id: 'UNIVERSAL_INDICATOR',
    name: 'Universal Indicator',
    formula: 'Solution',
    color: '#22c55e', // green-500 (start neutral)
    state: 'liquid',
    density: 1.0,
    description: 'Changes color based on pH (Red=Acid, Purple=Base).',
    iconType: 'bottle',
    boilingPoint: 100,
    meltingPoint: 0,
    ph: 7.0
  },
  CARBON: {
    id: 'CARBON',
    name: 'Carbon',
    formula: 'C',
    color: '#1f2937', // gray-800
    state: 'solid',
    density: 2.26,
    description: 'Charcoal or graphite. Basis of life.',
    iconType: 'rock',
    boilingPoint: 4827,
    meltingPoint: 3550,
    ph: 7.0,
    solubility: 0 // Insoluble
  },
  SULFUR: {
    id: 'SULFUR',
    name: 'Sulfur',
    formula: 'S',
    color: '#facc15', // yellow-400
    state: 'solid',
    density: 2.07,
    description: 'A bright yellow, brittle non-metal.',
    iconType: 'powder',
    boilingPoint: 444,
    meltingPoint: 115,
    ph: 7.0,
    solubility: 0
  },
  IRON: {
    id: 'IRON',
    name: 'Iron',
    formula: 'Fe',
    color: '#6b7280', // gray-500
    state: 'solid',
    density: 7.87,
    description: 'A strong, magnetic metal.',
    iconType: 'bar',
    boilingPoint: 2862,
    meltingPoint: 1538,
    ph: 7.0,
    solubility: 0
  },
  ETHANOL: {
    id: 'ETHANOL',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    color: '#d1d5db', // gray-300
    state: 'liquid',
    density: 0.78,
    description: 'A versatile organic solvent and fuel.',
    iconType: 'bottle',
    boilingPoint: 78,
    meltingPoint: -114,
    ph: 7.33
  },
  OXYGEN: {
    id: 'OXYGEN',
    name: 'Oxygen',
    formula: 'O₂',
    color: '#93c5fd', // blue-300 (pale)
    state: 'gas',
    density: 0.0014,
    description: 'Highly reactive gas essential for life.',
    iconType: 'cylinder',
    boilingPoint: -183,
    meltingPoint: -218,
    ph: 7.0
  },
  HYDROGEN: {
    id: 'HYDROGEN',
    name: 'Hydrogen',
    formula: 'H₂',
    color: '#f87171', // red-400 (glow tint)
    state: 'gas',
    density: 0.00008,
    description: 'Lightest and most abundant element.',
    iconType: 'cylinder',
    boilingPoint: -252,
    meltingPoint: -259,
    ph: 7.0
  },
  NITROGEN: {
    id: 'NITROGEN',
    name: 'Nitrogen',
    formula: 'N₂',
    color: '#a5b4fc', // indigo-300
    state: 'gas',
    density: 0.0012,
    description: 'Inert gas making up most of the atmosphere.',
    iconType: 'cylinder',
    boilingPoint: -195,
    meltingPoint: -210,
    ph: 7.0
  },
  MAGNESIUM: {
    id: 'MAGNESIUM',
    name: 'Magnesium',
    formula: 'Mg',
    color: '#e5e7eb', // gray-200
    state: 'solid',
    density: 1.74,
    description: 'Lightweight flammable metal.',
    iconType: 'bar',
    boilingPoint: 1090,
    meltingPoint: 650,
    ph: 7.0,
    solubility: 0
  },
  POTASSIUM_PERMANGANATE: {
    id: 'POTASSIUM_PERMANGANATE',
    name: 'Potassium Permanganate',
    formula: 'KMnO₄',
    color: '#7e22ce', // purple-700
    state: 'solid',
    density: 2.7,
    description: 'Strong oxidizer (deep purple).',
    iconType: 'crystal',
    boilingPoint: 240, // Decomposes
    meltingPoint: 240,
    ph: 7.0,
    solubility: 6.4
  },

  // --- Discovered (Intermediate/Complex) ---
  CHLORINE: {
    id: 'CHLORINE',
    name: 'Chlorine',
    formula: 'Cl₂',
    color: '#bef264', // lime-300
    state: 'gas',
    density: 0.0032,
    description: 'Toxic yellow-green gas.',
    iconType: 'cloud',
    boilingPoint: -34,
    meltingPoint: -101,
    ph: 4.0
  },
  SODIUM_HYDROXIDE: {
    id: 'SODIUM_HYDROXIDE',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    color: '#f1f5f9', // slate-100 (white pellets)
    state: 'solid',
    density: 2.13,
    description: 'Caustic soda (Lye). Strong base.',
    iconType: 'crystal',
    boilingPoint: 1388,
    meltingPoint: 318,
    ph: 14.0,
    solubility: 100
  },
  HYDROCHLORIC_ACID: {
    id: 'HYDROCHLORIC_ACID',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    color: '#f0fdf4', // green-50 (fuming)
    state: 'liquid',
    density: 1.18,
    description: 'Strong acid found in the stomach.',
    iconType: 'vial',
    boilingPoint: 48, // For concentrated solution
    meltingPoint: -27,
    ph: 1.0
  },
  NITRIC_ACID: {
    id: 'NITRIC_ACID',
    name: 'Nitric Acid',
    formula: 'HNO₃',
    color: '#fef08a', // yellow-200
    state: 'liquid',
    density: 1.51,
    description: 'Highly corrosive mineral acid.',
    iconType: 'vial',
    boilingPoint: 83,
    meltingPoint: -42,
    ph: 1.0
  },
  ACETONE: {
    id: 'ACETONE',
    name: 'Acetone',
    formula: 'C₃H₆O',
    color: '#ffffff', // clear
    state: 'liquid',
    density: 0.78,
    description: 'Organic solvent and cleaner.',
    iconType: 'bottle',
    boilingPoint: 56,
    meltingPoint: -95,
    ph: 7.0
  },
  CO2: {
    id: 'CO2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    color: '#9ca3af', // gray-400
    state: 'gas',
    density: 0.0019,
    description: 'Product of combustion and respiration.',
    iconType: 'cloud',
    boilingPoint: -78, // Sublimation
    sublimationPoint: -78,
    ph: 5.5 // Acidic when dissolved
  },
  IRON_OXIDE: {
    id: 'IRON_OXIDE',
    name: 'Iron Oxide',
    formula: 'Fe₂O₃',
    color: '#7f1d1d', // red-900
    state: 'solid',
    density: 5.24,
    description: 'Oxidized iron (Rust).',
    iconType: 'powder',
    boilingPoint: 1987, // Decomposes
    meltingPoint: 1566,
    ph: 7.0,
    solubility: 0
  },
  SO2: {
    id: 'SO2',
    name: 'Sulfur Dioxide',
    formula: 'SO₂',
    color: '#fde047', // yellow-300 (pale gas)
    state: 'gas',
    density: 0.0029,
    description: 'Toxic gas from burning sulfur.',
    iconType: 'cloud',
    boilingPoint: -10,
    meltingPoint: -72,
    ph: 4.5
  },
  AMMONIA: {
    id: 'AMMONIA',
    name: 'Ammonia',
    formula: 'NH₃',
    color: '#bae6fd', // sky-200
    state: 'gas',
    density: 0.0007,
    description: 'Pungent gas used in fertilizers.',
    iconType: 'cloud',
    boilingPoint: -33,
    meltingPoint: -77,
    ph: 11.5
  },
  CARBONIC_ACID: {
    id: 'CARBONIC_ACID',
    name: 'Carbonic Acid',
    formula: 'H₂CO₃',
    color: '#d1fae5', // emerald-100
    state: 'liquid',
    density: 1.0,
    description: 'Soda water.',
    iconType: 'bottle',
    boilingPoint: 100, // Mostly water
    meltingPoint: 0,
    ph: 4.0
  },
  SULFURIC_ACID: {
    id: 'SULFURIC_ACID',
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    color: '#fcd34d', // amber-300 (viscous)
    state: 'liquid',
    density: 1.83,
    description: 'Strong mineral acid.',
    iconType: 'vial',
    boilingPoint: 337,
    meltingPoint: 10,
    ph: 0.5
  },
  IRON_SULFIDE: {
    id: 'IRON_SULFIDE',
    name: 'Iron Sulfide',
    formula: 'FeS',
    color: '#4b5563', // gray-600
    state: 'solid',
    density: 4.84,
    description: 'Pyrite-like compound.',
    iconType: 'rock',
    boilingPoint: 1194, // Decomposes
    meltingPoint: 1194,
    ph: 7.0,
    solubility: 0
  },
  STEEL: {
    id: 'STEEL',
    name: 'Steel',
    formula: 'Fe-C',
    color: '#94a3b8', // slate-400
    state: 'solid',
    density: 7.85,
    description: 'Hardened iron alloy.',
    iconType: 'bar',
    boilingPoint: 2800,
    meltingPoint: 1370,
    ph: 7.0,
    solubility: 0
  },
  AMMONIUM_HYDROXIDE: {
    id: 'AMMONIUM_HYDROXIDE',
    name: 'Ammonium Hydroxide',
    formula: 'NH₄OH',
    color: '#e0f2fe', // sky-100
    state: 'liquid',
    density: 0.9,
    description: 'Household ammonia cleaner.',
    iconType: 'bottle',
    boilingPoint: 27, // Ammonia comes out
    meltingPoint: -57,
    ph: 10.5
  },
  ETHYL_ACETATE: {
    id: 'ETHYL_ACETATE',
    name: 'Ethyl Acetate',
    formula: 'CH₃COOCH₂CH₃',
    color: '#ffffff',
    state: 'liquid',
    density: 0.9,
    description: 'Sweet-smelling ester (solvent).',
    iconType: 'bottle',
    boilingPoint: 77,
    meltingPoint: -84,
    ph: 7.0
  },
  METHANOL: {
    id: 'METHANOL',
    name: 'Methanol',
    formula: 'CH₃OH',
    color: '#f8fafc',
    state: 'liquid',
    density: 0.79,
    description: 'Simple wood alcohol.',
    iconType: 'bottle',
    boilingPoint: 64,
    meltingPoint: -97,
    ph: 7.0
  },
  ETHYLENE: {
    id: 'ETHYLENE',
    name: 'Ethylene',
    formula: 'C₂H₄',
    color: '#cbd5e1',
    state: 'gas',
    density: 0.0011,
    description: 'Fundamental building block for plastics.',
    iconType: 'cylinder',
    boilingPoint: -103,
    meltingPoint: -169,
    ph: 7.0
  },
  POLYETHYLENE: {
    id: 'POLYETHYLENE',
    name: 'Polyethylene',
    formula: '(C₂H₄)n',
    color: '#f1f5f9',
    state: 'solid',
    density: 0.92,
    description: 'Common plastic (polythene).',
    iconType: 'rock',
    boilingPoint: 360, // Degradation
    meltingPoint: 115,
    ph: 7.0,
    solubility: 0
  },
  METHANE: {
    id: 'METHANE',
    name: 'Methane',
    formula: 'CH₄',
    color: '#f1f5f9',
    state: 'gas',
    density: 0.0006,
    description: 'Primary component of natural gas.',
    iconType: 'cylinder',
    boilingPoint: -161,
    meltingPoint: -182,
    ph: 7.0
  },
  GLUCOSE: {
    id: 'GLUCOSE',
    name: 'Glucose',
    formula: 'C₆H₁₂O₆',
    color: '#ffffff',
    state: 'solid',
    density: 1.54,
    description: 'Simple sugar, essential energy source.',
    iconType: 'crystal',
    boilingPoint: 527,
    meltingPoint: 146,
    ph: 7.0,
    solubility: 90
  },
  GLYCINE: {
    id: 'GLYCINE',
    name: 'Glycine',
    formula: 'C₂H₅NO₂',
    color: '#fdf2f8', // pink-50
    state: 'solid',
    density: 1.16,
    description: 'The simplest amino acid.',
    iconType: 'crystal',
    boilingPoint: 233,
    meltingPoint: 233, // Decomposes
    ph: 6.0,
    solubility: 25
  }
};

export const ELEMENTARY_IDS = [
  'H2O', 'NaCl', 'VINEGAR', 'BAKING_SODA', 
  'CARBON', 'SULFUR', 'IRON', 'ETHANOL', 
  'OXYGEN', 'HYDROGEN', 'NITROGEN',
  'MAGNESIUM', 'POTASSIUM_PERMANGANATE', 'UNIVERSAL_INDICATOR'
];
