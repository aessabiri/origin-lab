import { PARTICLE_TYPES } from './particles.js';

export const QUESTS = [
  // --- PARTICLE ERA ---
  {
    id: 'quest_p1',
    title: 'The First Nucleon',
    description: 'Fuse Quarks to create a Proton.',
    category: 'Physics',
    requirements: { [PARTICLE_TYPES.PROTON]: 1 },
    rewards: { xp: 100, message: 'Proton created! The foundation of matter.' }
  },
  {
    id: 'quest_p2',
    title: 'Atomic Dawn',
    description: 'Combine a Proton and Electron to form Hydrogen.',
    category: 'Physics',
    requirements: { [PARTICLE_TYPES.HYDROGEN]: 1 },
    rewards: { xp: 200, message: 'Hydrogen created! The universe lights up.' }
  },
  {
    id: 'quest_p3',
    title: 'Stellar Fuel',
    description: 'Fuse Hydrogen atoms to create Helium.',
    category: 'Physics',
    requirements: { [PARTICLE_TYPES.HELIUM]: 1 },
    rewards: { xp: 500, message: 'Helium created! Stars can now burn.' }
  },
  
  // --- CHEMISTRY ERA ---
  {
    id: 'quest_c1',
    title: 'Simple Bonds',
    description: 'Combine Hydrogen and Oxygen to create Water.',
    category: 'Chemistry',
    requirements: { [PARTICLE_TYPES.WATER]: 1 },
    rewards: { xp: 800, message: 'Water created! The solvent of life.' }
  },
  {
    id: 'quest_c2',
    title: 'Organic Origins',
    description: 'Synthesize Methane from Carbon and Hydrogen.',
    category: 'Chemistry',
    requirements: { [PARTICLE_TYPES.METHANE]: 1 },
    rewards: { xp: 1000, message: 'Methane created! Organic chemistry begins.' }
  },
  {
    id: 'quest_c3',
    title: 'Primordial Soup',
    description: 'Create Amino Acids (Glycine) from simple molecules.',
    category: 'Chemistry',
    requirements: { [PARTICLE_TYPES.GLYCINE]: 1 },
    rewards: { xp: 2000, message: 'Glycine created! The building blocks of proteins.' }
  },

  // --- BIOLOGY ERA ---
  {
    id: 'quest_b1',
    title: 'Cellular Structure',
    description: 'Assemble a Cell Membrane (Lipids).',
    category: 'Biology',
    requirements: { [PARTICLE_TYPES.MEMBRANE]: 1 },
    rewards: { xp: 3000, message: 'Membrane created! A container for life.' }
  },
  {
    id: 'quest_b2',
    title: 'Energy Source',
    description: 'Synthesize ATP to power your cell.',
    category: 'Biology',
    requirements: { [PARTICLE_TYPES.ATP]: 1 },
    rewards: { xp: 4000, message: 'ATP created! The spark of life.' }
  },
  {
    id: 'quest_b3',
    title: 'Genetic Code',
    description: 'Assemble a DNA strand.',
    category: 'Biology',
    requirements: { [PARTICLE_TYPES.DNA]: 1 },
    rewards: { xp: 5000, message: 'DNA created! The blueprint of life.' }
  },
  {
    id: 'quest_b4',
    title: 'It Lives!',
    description: 'Inject a viable LUCA into the Incubation Chamber and ensure it survives.',
    category: 'Biology',
    requirements: { 'LUCA_SURVIVAL': 1 }, // Special trigger
    rewards: { xp: 10000, message: 'LUCA is stable! Evolution can begin.' }
  }
];
