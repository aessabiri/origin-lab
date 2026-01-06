export const CHEMICALS = {
  // --- Elementary (Backbone) ---
  H2O: {
    id: 'H2O',
    name: 'Water',
    color: '#3b82f6', // blue-500
    state: 'liquid',
    density: 1.0,
    description: 'Universal solvent.',
  },
  NaCl: {
    id: 'NaCl',
    name: 'Salt',
    color: '#f3f4f6', // gray-100
    state: 'solid',
    density: 2.16,
    description: 'Table salt.',
  },
  VINEGAR: {
    id: 'VINEGAR',
    name: 'Vinegar',
    color: '#fbbf24', // amber-400
    state: 'liquid',
    density: 1.01,
    description: 'Acetic acid solution.',
  },
  BAKING_SODA: {
    id: 'BAKING_SODA',
    name: 'Baking Soda',
    color: '#ffffff',
    state: 'solid',
    density: 2.2,
    description: 'Sodium bicarbonate.',
  },
  CARBON: {
    id: 'CARBON',
    name: 'Carbon',
    color: '#1f2937', // gray-800
    state: 'solid',
    density: 2.26,
    description: 'Charcoal or graphite. Basis of life.',
  },
  SULFUR: {
    id: 'SULFUR',
    name: 'Sulfur',
    color: '#facc15', // yellow-400
    state: 'solid',
    density: 2.07,
    description: 'A bright yellow, brittle non-metal.',
  },
  IRON: {
    id: 'IRON',
    name: 'Iron',
    color: '#6b7280', // gray-500
    state: 'solid',
    density: 7.87,
    description: 'A strong, magnetic metal.',
  },
  ETHANOL: {
    id: 'ETHANOL',
    name: 'Ethanol',
    color: '#d1d5db', // gray-300
    state: 'liquid',
    density: 0.78,
    description: 'A versatile organic solvent and fuel.',
  },
  OXYGEN: {
    id: 'OXYGEN',
    name: 'Oxygen',
    color: '#93c5fd', // blue-300 (pale)
    state: 'gas',
    density: 0.0014,
    description: 'Highly reactive gas essential for life.',
  },
  HYDROGEN: {
    id: 'HYDROGEN',
    name: 'Hydrogen',
    color: '#f87171', // red-400 (glow tint)
    state: 'gas',
    density: 0.00008,
    description: 'Lightest and most abundant element.',
  },
  NITROGEN: {
    id: 'NITROGEN',
    name: 'Nitrogen',
    color: '#a5b4fc', // indigo-300
    state: 'gas',
    density: 0.0012,
    description: 'Inert gas making up most of the atmosphere.',
  },

  // --- Discovered (Intermediate/Complex) ---
  CO2: {
    id: 'CO2',
    name: 'Carbon Dioxide',
    color: '#9ca3af', // gray-400
    state: 'gas',
    density: 0.0019,
    description: 'Product of combustion and respiration.',
  },
  IRON_OXIDE: {
    id: 'IRON_OXIDE',
    name: 'Iron Oxide (Rust)',
    color: '#7f1d1d', // red-900
    state: 'solid',
    density: 5.24,
    description: 'Oxidized iron.',
  },
  SO2: {
    id: 'SO2',
    name: 'Sulfur Dioxide',
    color: '#fde047', // yellow-300 (pale gas)
    state: 'gas',
    density: 0.0029,
    description: 'Toxic gas from burning sulfur.',
  },
  AMMONIA: {
    id: 'AMMONIA',
    name: 'Ammonia',
    color: '#bae6fd', // sky-200
    state: 'gas',
    density: 0.0007,
    description: 'Pungent gas used in fertilizers.',
  },
  CARBONIC_ACID: {
    id: 'CARBONIC_ACID',
    name: 'Carbonic Acid',
    color: '#d1fae5', // emerald-100
    state: 'liquid',
    density: 1.0,
    description: 'Soda water.',
  },
  SULFURIC_ACID: {
    id: 'SULFURIC_ACID',
    name: 'Sulfuric Acid',
    color: '#fcd34d', // amber-300 (viscous)
    state: 'liquid',
    density: 1.83,
    description: 'Strong mineral acid.',
  }
};

export const ELEMENTARY_IDS = [
  'H2O', 'NaCl', 'VINEGAR', 'BAKING_SODA', 
  'CARBON', 'SULFUR', 'IRON', 'ETHANOL', 
  'OXYGEN', 'HYDROGEN', 'NITROGEN'
];