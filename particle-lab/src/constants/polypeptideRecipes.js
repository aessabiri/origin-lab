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
  {
    name: 'Glycyl-Alanine',
    type: PARTICLE_TYPES.GLYCYL_ALANINE,
    molecules: {
      [PARTICLE_TYPES.GLYCINE]: 1,
      [PARTICLE_TYPES.ALANINE]: 1,
    },
    peptideBonds: 1,
  },
  {
    name: 'Insulin (Chain A Frag)',
    type: PARTICLE_TYPES.INSULIN_FRAGMENT,
    molecules: {
      [PARTICLE_TYPES.GLYCINE]: 1,
      [PARTICLE_TYPES.ISOLEUCINE]: 1,
      [PARTICLE_TYPES.VALINE]: 1,
      [PARTICLE_TYPES.GLUTAMIC_ACID]: 1,
      [PARTICLE_TYPES.GLUTAMINE]: 1,
    },
    sequence: [PARTICLE_TYPES.GLYCINE, PARTICLE_TYPES.ISOLEUCINE, PARTICLE_TYPES.VALINE, PARTICLE_TYPES.GLUTAMIC_ACID, PARTICLE_TYPES.GLUTAMINE],
    peptideBonds: 4,
  },
  {
    name: 'Hemoglobin (Heme Pocket)',
    type: PARTICLE_TYPES.HEMOGLOBIN_POCKET,
    molecules: {
      [PARTICLE_TYPES.HISTIDINE]: 2,
      [PARTICLE_TYPES.VALINE]: 1,
      [PARTICLE_TYPES.LEUCINE]: 1,
    },
    sequence: [PARTICLE_TYPES.HISTIDINE, PARTICLE_TYPES.VALINE, PARTICLE_TYPES.LEUCINE, PARTICLE_TYPES.HISTIDINE],
    peptideBonds: 3,
  },
];