import { PARTICLE_TYPES } from './particles.js';

export const QUEST_CATEGORIES = {
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  BIOLOGY: 'Biology',
  COSMIC: 'Cosmic'
};

export const QUESTS = [
  // --- PHYSICS: PARTICLE ASSEMBLY ---
  {
    id: 'phys_proton',
    title: 'The First Nucleon',
    description: 'Fuse Quarks to create a Proton.',
    category: QUEST_CATEGORIES.PHYSICS,
    requirements: { [PARTICLE_TYPES.PROTON]: 1 },
    rewards: { xp: 100, message: 'Proton created! The foundation of matter.' }
  },
  {
    id: 'phys_neutron',
    title: 'Neutral Balance',
    description: 'Create a Neutron to stabilize your future nuclei.',
    category: QUEST_CATEGORIES.PHYSICS,
    requirements: { [PARTICLE_TYPES.NEUTRON]: 1 },
    rewards: { xp: 100 }
  },
  {
    id: 'phys_hydrogen',
    title: 'Atomic Dawn',
    description: 'Combine a Proton and Electron to form Hydrogen.',
    category: QUEST_CATEGORIES.PHYSICS,
    requirements: { [PARTICLE_TYPES.HYDROGEN]: 1 },
    rewards: { xp: 200, message: 'Hydrogen created! The universe lights up.' }
  },
  {
    id: 'phys_helium',
    title: 'Stellar Fuel',
    description: 'Fuse Hydrogen atoms to create Helium.',
    category: QUEST_CATEGORIES.PHYSICS,
    requirements: { [PARTICLE_TYPES.HELIUM]: 1 },
    rewards: { xp: 500, message: 'Helium created! Stars can now burn.' }
  },
  {
    id: 'phys_carbon',
    title: 'The Life Element',
    description: 'Form a Carbon atom using the Triple-Alpha process.',
    category: QUEST_CATEGORIES.PHYSICS,
    requirements: { [PARTICLE_TYPES.CARBON]: 1 },
    rewards: { xp: 1000 }
  },

  // --- CHEMISTRY: MOLECULAR SYNTHESIS ---
  {
    id: 'chem_co2',
    title: 'Welcome to the Lab',
    description: 'Create Carbon Dioxide (CO2) by mixing Vinegar and Baking Soda.',
    category: QUEST_CATEGORIES.CHEMISTRY,
    requirements: { [PARTICLE_TYPES.CARBON_DIOXIDE]: 1 },
    rewards: {
      xp: 500,
      unlockChemicals: ['hydrogen', 'oxygen', 'universal-indicator'],
      unlockEquipment: ['flask_volumetric'],
      message: 'Unlocks: Hydrogen, Oxygen, Indicator, Reaction Flask'
    },
    hint: 'Pour Vinegar and Baking Soda into an open beaker.'
  },
  {
    id: 'chem_water',
    title: 'Combustion',
    description: 'Burn Hydrogen and Oxygen together to create Water (H2O). Watch the temperature!',
    category: QUEST_CATEGORIES.CHEMISTRY,
    requirements: { [PARTICLE_TYPES.WATER]: 1 },
    rewards: {
      xp: 800,
      unlockChemicals: ['iron', 'sulfur'],
      message: 'Unlocks: Iron, Sulfur'
    },
    hint: 'Heat Hydrogen (2x) and Oxygen (1x) in a sealed flask to >100°C.'
  },
  {
    id: 'chem_rust',
    title: 'Oxidation',
    description: 'Expose Iron to Oxygen to create Rust (Iron Oxide).',
    category: QUEST_CATEGORIES.CHEMISTRY,
    requirements: { [PARTICLE_TYPES.IRON_OXIDE]: 1 },
    rewards: {
      xp: 1000,
      unlockChemicals: ['nitrogen'],
      unlockEquipment: ['reactor_reinforced'],
      message: 'Unlocks: Nitrogen, High-Pressure Reactor'
    }
  },
  {
    id: 'chem_ammonia',
    title: 'Industrial Ammonia',
    description: 'Synthesize Ammonia using Nitrogen and Hydrogen (Haber Process).',
    category: QUEST_CATEGORIES.CHEMISTRY,
    requirements: { [PARTICLE_TYPES.AMMONIA]: 1 },
    rewards: {
      xp: 1500,
      unlockChemicals: ['sodium-chloride', 'chlorine'],
      message: 'Unlocks: Salt, Chlorine'
    }
  },
  {
    id: 'chem_methane',
    title: 'The Sabatier Process',
    description: 'Convert CO2 and Hydrogen into Methane gas. Rocket fuel!',
    category: QUEST_CATEGORIES.CHEMISTRY,
    requirements: { [PARTICLE_TYPES.METHANE]: 1 },
    rewards: { xp: 2000 }
  },

  // --- BIOLOGY: THE ROAD TO DNA ---
  {
    id: 'bio_glycine',
    title: 'Building Blocks',
    description: 'Synthesize the amino acid Glycine.',
    category: QUEST_CATEGORIES.BIOLOGY,
    requirements: { [PARTICLE_TYPES.GLYCINE]: 1 },
    rewards: { xp: 2500 }
  },
  {
    id: 'bio_membrane',
    title: 'Cellular Structure',
    description: 'Assemble a Cell Membrane from phospholipids.',
    category: QUEST_CATEGORIES.BIOLOGY,
    requirements: { [PARTICLE_TYPES.MEMBRANE]: 1 },
    rewards: { xp: 3000, message: 'Membrane created! A container for life.' }
  },
  {
    id: 'bio_atp',
    title: 'Energy Source',
    description: 'Synthesize ATP to power your cell.',
    category: QUEST_CATEGORIES.BIOLOGY,
    requirements: { [PARTICLE_TYPES.ATP]: 1 },
    rewards: { xp: 4000, message: 'ATP created! The spark of life.' }
  },
  {
    id: 'bio_dna',
    title: 'Genetic Code',
    description: 'Assemble a DNA strand.',
    category: QUEST_CATEGORIES.BIOLOGY,
    requirements: { [PARTICLE_TYPES.DNA]: 1 },
    rewards: { xp: 5000, message: 'DNA created! The blueprint of life.' }
  },
  {
    id: 'bio_luca',
    title: 'It Lives!',
    description: 'Ensure your LUCA (Last Universal Common Ancestor) cell survives and replicates.',
    category: QUEST_CATEGORIES.BIOLOGY,
    requirements: { 'LUCA_SURVIVAL': 1 },
    rewards: { xp: 10000, message: 'LUCA is stable! Evolution can begin.' }
  }
];