import { PARTICLE_TYPES } from '../constants/particles.js';

export const MOLECULE_RECIPES = [
  {
    type: PARTICLE_TYPES.GLYCINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 2,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 5,
    },
    bonds: {
      single: 7,
      double: 1,
    },
  },
  {
    type: PARTICLE_TYPES.ALANINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 3,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 7,
    },
    bonds: {
      single: 10,
      double: 1,
    },
  },
  {
    type: PARTICLE_TYPES.VALINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 5,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 11,
    },
    bonds: {
      single: 16,
      double: 1,
    },
  },
  {
    type: PARTICLE_TYPES.LEUCINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 6,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 13,
    },
    bonds: {
      single: 19,
      double: 1,
    },
  },
  {
    type: PARTICLE_TYPES.SERINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 3,
      [PARTICLE_TYPES.OXYGEN]: 3,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 7,
    },
    bonds: {
      single: 11,
      double: 1,
    },
  },
];