export const MISSIONS = [
  {
    id: 'mission_01',
    title: 'Welcome to the Lab',
    description: 'Let\'s start simple. Create Carbon Dioxide (CO2) by mixing Vinegar and Baking Soda.',
    requirements: { CO2: 1 },
    rewards: {
      unlockChemicals: ['HYDROGEN', 'OXYGEN'],
      unlockEquipment: ['flask_volumetric'],
      message: 'Unlocks: Hydrogen, Oxygen, Reaction Flask'
    },
    hint: {
        vessel: 'Standard Beaker (Open)',
        ingredients: ['Vinegar', 'Baking Soda'],
        process: 'Pour both ingredients into the beaker. No heat required.',
        tip: 'The lid must be OPEN to pour ingredients in.'
    }
  },
  {
    id: 'mission_02',
    title: 'Combustion',
    description: 'Use the Reaction Flask to burn Hydrogen and Oxygen together to create Water (H2O). Watch the temperature!',
    requirements: { H2O: 1 },
    rewards: {
      unlockChemicals: ['IRON', 'SULFUR'],
      message: 'Unlocks: Iron, Sulfur'
    },
    hint: {
        vessel: 'Reaction Flask',
        ingredients: ['Hydrogen (2x)', 'Oxygen (1x)'],
        process: '1. Pour ingredients. 2. CLOSE LID. 3. Heat to >100°C to ignite.',
        tip: 'Combustion releases energy. Turn off the heater once it starts!'
    }
  },
  {
    id: 'mission_03',
    title: 'Oxidation',
    description: 'Expose Iron to Oxygen to create Rust (Iron Oxide).',
    requirements: { IRON_OXIDE: 1 },
    rewards: {
      unlockChemicals: ['NITROGEN'],
      unlockEquipment: ['reactor_reinforced'],
      message: 'Unlocks: Nitrogen, High-Pressure Reactor'
    },
    hint: {
        vessel: 'Any Vessel',
        ingredients: ['Iron', 'Oxygen'],
        process: 'Heat to >100°C.',
        tip: 'Iron is a solid, Oxygen is a gas. They need contact and heat.'
    }
  },
  {
    id: 'mission_04',
    title: 'Industrial Ammonia',
    description: 'Synthesize Ammonia using Nitrogen and Hydrogen in the High-Pressure Reactor (Haber Process). Needs Heat and Pressure.',
    requirements: { AMMONIA: 1 },
    rewards: {
      unlockChemicals: ['NaCl', 'CHLORINE'],
      message: 'Unlocks: Salt, Chlorine'
    },
    hint: {
        vessel: 'High-Pressure Reactor (Sealed)',
        ingredients: ['Hydrogen (3x)', 'Nitrogen (1x)'],
        process: '1. Seal Lid. 2. Heat to >200°C. 3. Wait for Pressure >50atm.',
        tip: 'The High-Pressure Reactor is required to contain the 50atm needed.'
    }
  },
  {
    id: 'mission_05',
    title: 'Acids',
    description: 'Create Hydrochloric Acid (HCl) from Hydrogen and Chlorine.',
    requirements: { HYDROCHLORIC_ACID: 1 },
    rewards: {
      unlockChemicals: ['ETHANOL'],
      unlockEquipment: ['distillation_setup'],
      message: 'Unlocks: Ethanol, Distillation Kit'
    },
    hint: {
        vessel: 'Reaction Flask (Sealed)',
        ingredients: ['Hydrogen', 'Chlorine'],
        process: 'Seal lid. Pressurize to >2atm (heat slightly).',
        tip: 'Gases react better under pressure.'
    }
  },
  {
    id: 'mission_06',
    title: 'Purification',
    description: 'Boil Ethanol in the Distillation Kit and collect the pure condensed liquid.',
    requirements: { ETHANOL: 1 }, // Collecting it from condenser triggers this
    rewards: {
      unlockChemicals: ['ETHYLENE'],
      message: 'Unlocks: Ethylene (The Plastic Age)'
    },
    hint: {
        vessel: 'Distillation Kit',
        ingredients: ['Ethanol'],
        process: '1. Pour Ethanol. 2. Seal Lid. 3. OPEN CONDENSER VALVE. 4. Heat >78°C.',
        tip: 'If you forget to open the valve, the flask might explode from pressure.'
    }
  }
];

export const STARTING_CHEMICALS = ['VINEGAR', 'BAKING_SODA'];
export const STARTING_EQUIPMENT = ['beaker_std'];
