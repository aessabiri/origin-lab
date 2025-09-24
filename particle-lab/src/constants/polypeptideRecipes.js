import { PARTICLE_TYPES } from '../constants/particles.js';

export const POLYPEPTIDE_RECIPES = [
  {
    name: 'Glycylglycine',
    type: PARTICLE_TYPES.GLYCYLGLYCINE,
    // The ingredients are now other molecules
    molecules: {
      [PARTICLE_TYPES.GLYCINE]: 2,
    },
    // And the bonds are peptide bonds
    peptideBonds: 1,
  },
];