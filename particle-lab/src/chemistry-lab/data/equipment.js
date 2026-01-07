export const EQUIPMENT = [
  {
    id: 'beaker_std',
    name: 'Standard Beaker',
    type: 'glass',
    icon: 'beaker',
    cost: 0,
    stats: { maxTemp: 800, maxPress: 5, maxVol: 500, isOpen: true },
    features: { hasTempControl: false, hasPressureControl: false },
    description: 'Basic open container. Good for mixing, bad for gases.'
  },
  {
    id: 'flask_volumetric',
    name: 'Reaction Flask',
    type: 'glass',
    icon: 'flask',
    cost: 0,
    stats: { maxTemp: 800, maxPress: 50, maxVol: 500, isOpen: false },
    features: { hasTempControl: true, hasPressureControl: false },
    description: 'Heatable flask with a narrow neck. Can be sealed.'
  },
  {
    id: 'reactor_reinforced',
    name: 'High-Pressure Reactor',
    type: 'reinforced',
    icon: 'reactor',
    cost: 0,
    stats: { maxTemp: 1500, maxPress: 100, maxVol: 1000, isOpen: false },
    features: { hasTempControl: true, hasPressureControl: true },
    description: 'Reinforced walls allow for high pressure synthesis.'
  },
  {
    id: 'crucible_ceramic',
    name: 'Ceramic Crucible',
    type: 'ceramic',
    icon: 'crucible',
    cost: 0,
    stats: { maxTemp: 3000, maxPress: 50, maxVol: 200, isOpen: true },
    features: { hasTempControl: true, hasPressureControl: false },
    description: 'Extreme heat resistance for melting metals.'
  },
  {
    id: 'cryo_vial',
    name: 'Cryo-Container',
    type: 'reinforced',
    icon: 'vial',
    cost: 0,
    stats: { maxTemp: 100, maxPress: 200, maxVol: 100, isOpen: false },
    features: { hasTempControl: true, hasPressureControl: true }, // "Heater" can act as cooler logic later
    description: 'Small volume, high pressure. Ideal for gas storage.'
  },
  {
    id: 'distillation_setup',
    name: 'Distillation Kit',
    type: 'glass',
    icon: 'condenser',
    cost: 0,
    stats: { maxTemp: 800, maxPress: 10, maxVol: 500, isOpen: false },
    features: { hasTempControl: true, hasPressureControl: false, hasCondenser: true }, // Special flag
    description: 'Reaction flask with an attached Liebig condenser for separation.'
  }
];
