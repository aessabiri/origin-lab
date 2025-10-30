import { PARTICLE_TYPES } from './particles.js';

const GOALS_FAST = [
  { name: 'Create a Proton', type: PARTICLE_TYPES.PROTON },
  { name: 'Create a Neutron', type: PARTICLE_TYPES.NEUTRON },
  { name: 'Create Hydrogen', type: PARTICLE_TYPES.HYDROGEN },
  { name: 'Create Carbon', type: PARTICLE_TYPES.CARBON },
  { name: 'Create Oxygen', type: PARTICLE_TYPES.OXYGEN },
  { name: 'Create Nitrogen', type: PARTICLE_TYPES.NITROGEN },
  { name: 'Create Water', type: PARTICLE_TYPES.WATER },
  { name: 'Create Glycine', type: PARTICLE_TYPES.GLYCINE },
  { name: 'Create Adenine', type: PARTICLE_TYPES.ADENINE },
  { name: 'Create Guanine', type: PARTICLE_TYPES.GUANINE },
  { name: 'Create Cytosine', type: PARTICLE_TYPES.CYTOSINE },
  { name: 'Create Thymine', type: PARTICLE_TYPES.THYMINE },
  { name: 'Create DNA', type: PARTICLE_TYPES.DNA },
];

const GOALS_MEDIUM = [
  { name: 'Create a Proton', type: PARTICLE_TYPES.PROTON },
  { name: 'Create a Neutron', type: PARTICLE_TYPES.NEUTRON },
  { name: 'Create Hydrogen', type: PARTICLE_TYPES.HYDROGEN },
  { name: 'Create Deuterium', type: PARTICLE_TYPES.DEUTERIUM },
  { name: 'Create Helium', type: PARTICLE_TYPES.HELIUM },
  { name: 'Create Carbon', type: PARTICLE_TYPES.CARBON },
  { name: 'Create Oxygen', type: PARTICLE_TYPES.OXYGEN },
  { name: 'Create Nitrogen', type: PARTICLE_TYPES.NITROGEN },
  { name: 'Create Water', type: PARTICLE_TYPES.WATER },
  { name: 'Create Ammonia', type: PARTICLE_TYPES.AMMONIA },
  { name: 'Create Methane', type: PARTICLE_TYPES.METHANE },
  { name: 'Create Carbon Dioxide', type: PARTICLE_TYPES.CARBON_DIOXIDE },
  { name: 'Create Glycine', type: PARTICLE_TYPES.GLYCINE },
  { name: 'Create Alanine', type: PARTICLE_TYPES.ALANINE },
  { name: 'Create Adenine', type: PARTICLE_TYPES.ADENINE },
  { name: 'Create Guanine', type: PARTICLE_TYPES.GUANINE },
  { name: 'Create Cytosine', type: PARTICLE_TYPES.CYTOSINE },
  { name: 'Create Thymine', type: PARTICLE_TYPES.THYMINE },
  { name: 'Create Uracil', type: PARTICLE_TYPES.URACIL },
  { name: 'Create RNA', type: PARTICLE_TYPES.RNA },
  { name: 'Create DNA', type: PARTICLE_TYPES.DNA },
];

const GOALS_SLOW = [
  // Elementary
  { name: 'Create a Proton', type: PARTICLE_TYPES.PROTON },
  { name: 'Create a Neutron', type: PARTICLE_TYPES.NEUTRON },
  { name: 'Create Pion+', type: PARTICLE_TYPES.PION_PLUS },
  // Atoms
  { name: 'Create Hydrogen', type: PARTICLE_TYPES.HYDROGEN },
  { name: 'Create Deuterium', type: PARTICLE_TYPES.DEUTERIUM },
  { name: 'Create Tritium', type: PARTICLE_TYPES.TRITIUM },
  { name: 'Create Helium', type: PARTICLE_TYPES.HELIUM },
  { name: 'Create Lithium', type: PARTICLE_TYPES.LITHIUM },
  { name: 'Create Carbon', type: PARTICLE_TYPES.CARBON },
  { name: 'Create Nitrogen', type: PARTICLE_TYPES.NITROGEN },
  { name: 'Create Oxygen', type: PARTICLE_TYPES.OXYGEN },
  { name: 'Create Fluorine', type: PARTICLE_TYPES.FLUORINE },
  { name: 'Create Sodium', type: PARTICLE_TYPES.SODIUM },
  { name: 'Create Chlorine', type: PARTICLE_TYPES.CHLORINE },
  // Simple Molecules
  { name: 'Create Water', type: PARTICLE_TYPES.WATER },
  { name: 'Create Ammonia', type: PARTICLE_TYPES.AMMONIA },
  { name: 'Create Methane', type: PARTICLE_TYPES.METHANE },
  { name: 'Create Carbon Dioxide', type: PARTICLE_TYPES.CARBON_DIOXIDE },
  { name: 'Create Oxygen Gas', type: PARTICLE_TYPES.OXYGEN_GAS },
  { name: 'Create Nitrogen Gas', type: PARTICLE_TYPES.NITROGEN_GAS },
  { name: 'Create Salt (NaCl)', type: PARTICLE_TYPES.SODIUM_CHLORIDE },
  { name: 'Create Hydrochloric Acid', type: PARTICLE_TYPES.HYDROCHLORIC_ACID },
  // Amino Acids
  { name: 'Create Glycine', type: PARTICLE_TYPES.GLYCINE },
  { name: 'Create Alanine', type: PARTICLE_TYPES.ALANINE },
  { name: 'Create Serine', type: PARTICLE_TYPES.SERINE },
  { name: 'Create Valine', type: PARTICLE_TYPES.VALINE },
  { name: 'Create Leucine', type: PARTICLE_TYPES.LEUCINE },
  // Peptides
  { name: 'Create Glycylglycine', type: PARTICLE_TYPES.GLYCYLGLYCINE },
  // Organic Molecules
  { name: 'Create Acetic Acid', type: PARTICLE_TYPES.ACETIC_ACID },
  { name: 'Create Ethanol', type: PARTICLE_TYPES.ETHANOL },
  { name: 'Create Glucose', type: PARTICLE_TYPES.GLUCOSE },
  // Nucleobases
  { name: 'Create Adenine', type: PARTICLE_TYPES.ADENINE },
  { name: 'Create Guanine', type: PARTICLE_TYPES.GUANINE },
  { name: 'Create Cytosine', type: PARTICLE_TYPES.CYTOSINE },
  { name: 'Create Thymine', type: PARTICLE_TYPES.THYMINE },
  { name: 'Create Uracil', type: PARTICLE_TYPES.URACIL },
  // Nucleic Acids
  { name: 'Create RNA', type: PARTICLE_TYPES.RNA },
  { name: 'Create DNA', type: PARTICLE_TYPES.DNA },
];

export const GOAL_PATHS = {
  fast: GOALS_FAST,
  medium: GOALS_MEDIUM,
  slow: GOALS_SLOW,
};

export const GOALS = GOALS_MEDIUM; // Default path