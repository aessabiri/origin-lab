export const CHEMICAL_TYPES = {
  WATER: 'WATER',
  SALT: 'SALT',
  FLASK: 'FLASK',
  SALT_WATER: 'SALT_WATER',
};

export const CHEMICAL_INFO = {
  [CHEMICAL_TYPES.WATER]: {
    name: 'Water',
    description: 'H₂O, the universal solvent.',
    size: 64,
  },
  [CHEMICAL_TYPES.SALT]: {
    name: 'Salt',
    description: 'NaCl, a common ionic compound.',
    size: 64,
  },
  [CHEMICAL_TYPES.FLASK]: {
    name: 'Flask',
    description: 'A container for mixing chemicals.',
    size: 128,
  },
  [CHEMICAL_TYPES.SALT_WATER]: {
    name: 'Salt Water',
    description: 'A solution of salt in water.',
    size: 64,
  },
};

export const elementaryChemicals = [
  { id: 'water', type: CHEMICAL_TYPES.WATER },
  { id: 'salt', type: CHEMICAL_TYPES.SALT },
  { id: 'flask', type: CHEMICAL_TYPES.FLASK },
];
