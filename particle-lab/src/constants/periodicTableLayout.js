import { PARTICLE_TYPES } from './particles.js';

// Map atomic number to particle type for easy lookup
export const ATOMIC_NUMBER_TO_TYPE = {
  1: PARTICLE_TYPES.HYDROGEN,
  2: PARTICLE_TYPES.HELIUM,
  3: PARTICLE_TYPES.LITHIUM,
  4: PARTICLE_TYPES.BERYLLIUM,
  5: PARTICLE_TYPES.BORON,
  6: PARTICLE_TYPES.CARBON,
  7: PARTICLE_TYPES.NITROGEN,
  8: PARTICLE_TYPES.OXYGEN,
  9: PARTICLE_TYPES.FLUORINE,
  10: PARTICLE_TYPES.NEON,
  11: PARTICLE_TYPES.SODIUM,
  12: PARTICLE_TYPES.MAGNESIUM,
  13: PARTICLE_TYPES.ALUMINIUM,
  14: PARTICLE_TYPES.SILICON,
  15: PARTICLE_TYPES.PHOSPHORUS,
  16: PARTICLE_TYPES.SULFUR,
  17: PARTICLE_TYPES.CHLORINE,
  18: PARTICLE_TYPES.ARGON,
};

// Defines the grid layout of the periodic table. 0 is an empty spacer.
// -1 is the Lanthanide series placeholder, -2 is the Actinide series placeholder.
export const PERIODIC_TABLE_LAYOUT = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], // Period 1
  [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10], // Period 2
  [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18], // Period 3
];

// Lanthanide and Actinide series (using atomic numbers)
// The component will render placeholders for numbers not yet in ATOMIC_NUMBER_TO_TYPE
export const LANTHANIDE_SERIES = Array.from({ length: 15 }, (_, i) => 57 + i); // 57-71
export const ACTINIDE_SERIES = Array.from({ length: 15 }, (_, i) => 89 + i); // 89-103

// A separate list for isotopes and other special secondary particles
export const ISOTOPE_AND_SPECIAL_LIST = [
  PARTICLE_TYPES.PROTON,
  PARTICLE_TYPES.NEUTRON,
  PARTICLE_TYPES.PION_PLUS,
  PARTICLE_TYPES.PION_MINUS,
  PARTICLE_TYPES.LAMBDA_BARYON,
  PARTICLE_TYPES.J_PSI_MESON,
  PARTICLE_TYPES.DEUTERIUM,
  PARTICLE_TYPES.TRITIUM,
];