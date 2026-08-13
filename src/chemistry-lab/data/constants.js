export const VESSEL_STATS = {
  glass: { name: 'Standard Glass', maxTemp: 800, maxPress: 5 },
  reinforced: { name: 'Reinforced Glass', maxTemp: 1500, maxPress: 50 },
  ceramic: { name: 'Industrial Ceramic', maxTemp: 3000, maxPress: 500 },
};

export const PHYSICS_CONSTANTS = {
  TICK_RATE_MS: 100,
  CONDUCTIVITY_FACTOR: 0.01,
  BASE_REACTION_RATE: 0.5,
  TEMP_SNAP_THRESHOLD: 0.5,
  MAX_SPEED_FACTOR: 50
};

export const SAFETY_CONSTANTS = {
  TOXIC_GASES: ['CHLORINE', 'SO2', 'AMMONIA', 'HYDROGEN']
};
