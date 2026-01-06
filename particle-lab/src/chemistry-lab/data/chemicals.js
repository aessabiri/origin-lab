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
  },
  NaCl: {
    id: 'NaCl',
    name: 'Salt',
    formula: 'NaCl',
    color: '#f3f4f6', // gray-100
    state: 'solid',
    density: 2.16,
    description: 'Table salt.',
  },
  VINEGAR: {
    id: 'VINEGAR',
    name: 'Vinegar',
    formula: 'CH₃COOH',
    color: '#fbbf24', // amber-400
    state: 'liquid',
    density: 1.01,
    description: 'Acetic acid solution.',
  },
  BAKING_SODA: {
    id: 'BAKING_SODA',
    name: 'Baking Soda',
    formula: 'NaHCO₃',
    color: '#ffffff',
    state: 'solid',
    density: 2.2,
    description: 'Sodium bicarbonate.',
  },
  CARBON: {
    id: 'CARBON',
    name: 'Carbon',
    formula: 'C',
    color: '#1f2937', // gray-800
    state: 'solid',
    density: 2.26,
    description: 'Charcoal or graphite. Basis of life.',
  },
  SULFUR: {
    id: 'SULFUR',
    name: 'Sulfur',
    formula: 'S',
    color: '#facc15', // yellow-400
    state: 'solid',
    density: 2.07,
    description: 'A bright yellow, brittle non-metal.',
  },
  IRON: {
    id: 'IRON',
    name: 'Iron',
    formula: 'Fe',
    color: '#6b7280', // gray-500
    state: 'solid',
    density: 7.87,
    description: 'A strong, magnetic metal.',
  },
  ETHANOL: {
    id: 'ETHANOL',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    color: '#d1d5db', // gray-300
    state: 'liquid',
    density: 0.78,
    description: 'A versatile organic solvent and fuel.',
  },
  OXYGEN: {
    id: 'OXYGEN',
    name: 'Oxygen',
    formula: 'O₂',
    color: '#93c5fd', // blue-300 (pale)
    state: 'gas',
    density: 0.0014,
    description: 'Highly reactive gas essential for life.',
  },
  HYDROGEN: {
    id: 'HYDROGEN',
    name: 'Hydrogen',
    formula: 'H₂',
    color: '#f87171', // red-400 (glow tint)
    state: 'gas',
    density: 0.00008,
    description: 'Lightest and most abundant element.',
  },
  NITROGEN: {
    id: 'NITROGEN',
    name: 'Nitrogen',
    formula: 'N₂',
    color: '#a5b4fc', // indigo-300
    state: 'gas',
    density: 0.0012,
    description: 'Inert gas making up most of the atmosphere.',
  },
  MAGNESIUM: {
    id: 'MAGNESIUM',
    name: 'Magnesium',
    formula: 'Mg',
    color: '#e5e7eb', // gray-200
    state: 'solid',
    density: 1.74,
    description: 'Lightweight flammable metal.',
  },
  POTASSIUM_PERMANGANATE: {
    id: 'POTASSIUM_PERMANGANATE',
    name: 'Potassium Permanganate',
    formula: 'KMnO₄',
    color: '#7e22ce', // purple-700
    state: 'solid',
    density: 2.7,
    description: 'Strong oxidizer (deep purple).',
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
  },
  SODIUM_HYDROXIDE: {
    id: 'SODIUM_HYDROXIDE',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    color: '#f1f5f9', // slate-100 (white pellets)
    state: 'solid',
    density: 2.13,
    description: 'Caustic soda (Lye). Strong base.',
  },
  HYDROCHLORIC_ACID: {
    id: 'HYDROCHLORIC_ACID',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    color: '#f0fdf4', // green-50 (fuming)
    state: 'liquid',
    density: 1.18,
    description: 'Strong acid found in the stomach.',
  },
  NITRIC_ACID: {
    id: 'NITRIC_ACID',
    name: 'Nitric Acid',
    formula: 'HNO₃',
    color: '#fef08a', // yellow-200
    state: 'liquid',
    density: 1.51,
    description: 'Highly corrosive mineral acid.',
  },
  ACETONE: {
    id: 'ACETONE',
    name: 'Acetone',
    formula: 'C₃H₆O',
    color: '#ffffff', // clear
    state: 'liquid',
    density: 0.78,
    description: 'Organic solvent and cleaner.',
  },
  CO2: {
    id: 'CO2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    color: '#9ca3af', // gray-400
    state: 'gas',
    density: 0.0019,
    description: 'Product of combustion and respiration.',
  },
  IRON_OXIDE: {
    id: 'IRON_OXIDE',
    name: 'Iron Oxide',
    formula: 'Fe₂O₃',
    color: '#7f1d1d', // red-900
    state: 'solid',
    density: 5.24,
    description: 'Oxidized iron (Rust).',
  },
  SO2: {
    id: 'SO2',
    name: 'Sulfur Dioxide',
    formula: 'SO₂',
    color: '#fde047', // yellow-300 (pale gas)
    state: 'gas',
    density: 0.0029,
    description: 'Toxic gas from burning sulfur.',
  },
  AMMONIA: {
    id: 'AMMONIA',
    name: 'Ammonia',
    formula: 'NH₃',
    color: '#bae6fd', // sky-200
    state: 'gas',
    density: 0.0007,
    description: 'Pungent gas used in fertilizers.',
  },
  CARBONIC_ACID: {
    id: 'CARBONIC_ACID',
    name: 'Carbonic Acid',
    formula: 'H₂CO₃',
    color: '#d1fae5', // emerald-100
    state: 'liquid',
    density: 1.0,
    description: 'Soda water.',
  },
  SULFURIC_ACID: {
    id: 'SULFURIC_ACID',
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    color: '#fcd34d', // amber-300 (viscous)
    state: 'liquid',
    density: 1.83,
    description: 'Strong mineral acid.',
  },
  IRON_SULFIDE: {
    id: 'IRON_SULFIDE',
    name: 'Iron Sulfide',
    formula: 'FeS',
    color: '#4b5563', // gray-600
    state: 'solid',
    density: 4.84,
    description: 'Pyrite-like compound.',
  },
  STEEL: {
    id: 'STEEL',
    name: 'Steel',
    formula: 'Fe-C',
    color: '#94a3b8', // slate-400
    state: 'solid',
    density: 7.85,
    description: 'Hardened iron alloy.',
  },
  AMMONIUM_HYDROXIDE: {
    id: 'AMMONIUM_HYDROXIDE',
    name: 'Ammonium Hydroxide',
    formula: 'NH₄OH',
    color: '#e0f2fe', // sky-100
    state: 'liquid',
    density: 0.9,
    description: 'Household ammonia cleaner.',
  }
};

export const ELEMENTARY_IDS = [
  'H2O', 'NaCl', 'VINEGAR', 'BAKING_SODA', 
  'CARBON', 'SULFUR', 'IRON', 'ETHANOL', 
  'OXYGEN', 'HYDROGEN', 'NITROGEN',
  'MAGNESIUM', 'POTASSIUM_PERMANGANATE'
];