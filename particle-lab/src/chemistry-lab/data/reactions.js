export const REACTIONS = [
  // Vinegar + Baking Soda -> CO2 + Water
  {
    inputs: { VINEGAR: 1, BAKING_SODA: 1 },
    conditions: { tempMin: 0, pressureMin: 1 },
    outputs: { CO2: 1, H2O: 1 },
    visual: 'bubble',
  },
  // Iron + Oxygen -> Iron Oxide (Rust)
  {
    inputs: { IRON: 1, OXYGEN: 1 },
    conditions: { tempMin: 100 },
    outputs: { IRON_OXIDE: 1 },
    visual: 'solidify',
  },
  // Sulfur + Oxygen -> Sulfur Dioxide
  {
    inputs: { SULFUR: 1, OXYGEN: 1 },
    conditions: { tempMin: 100 },
    outputs: { SO2: 1 },
    visual: 'fume',
  },
  // Hydrogen + Nitrogen -> Ammonia (Haber Process)
  {
    inputs: { HYDROGEN: 3, NITROGEN: 1 },
    conditions: { tempMin: 200, pressureMin: 50 },
    outputs: { AMMONIA: 2 },
    visual: 'steam',
  },
  // Water + CO2 -> Carbonic Acid
  {
    inputs: { H2O: 1, CO2: 1 },
    conditions: { pressureMin: 5 },
    outputs: { CARBONIC_ACID: 1 },
    visual: 'dissolve',
  },
  // Water + SO2 + Oxygen -> Sulfuric Acid (Simplified Contact Process)
  {
    inputs: { H2O: 1, SO2: 1, OXYGEN: 1 },
    conditions: { tempMin: 50 },
    outputs: { SULFURIC_ACID: 1 },
    visual: 'condense',
  }
];