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
  },
  // Carbon + Oxygen -> CO2 (Burning Charcoal)
  {
    inputs: { CARBON: 1, OXYGEN: 1 },
    conditions: { tempMin: 200 },
    outputs: { CO2: 1 },
    visual: 'fume',
  },
  // Hydrogen + Oxygen -> Water (Combustion)
  {
    inputs: { HYDROGEN: 2, OXYGEN: 1 },
    conditions: { tempMin: 100 },
    outputs: { H2O: 2 },
    visual: 'bubble', // Should be explosion theoretically, but 'bubble' works for now
  },
  // Iron + Sulfur -> Iron Sulfide
  {
    inputs: { IRON: 1, SULFUR: 1 },
    conditions: { tempMin: 150 },
    outputs: { IRON_SULFIDE: 1 },
    visual: 'solidify',
  },
  // Iron + Carbon -> Steel
  {
    inputs: { IRON: 1, CARBON: 1 },
    conditions: { tempMin: 500 }, // Needs high heat
    outputs: { STEEL: 1 },
    visual: 'solidify',
  },
  // Ammonia + Water -> Ammonium Hydroxide
  {
    inputs: { AMMONIA: 1, H2O: 1 },
    conditions: {}, // Spontaneous dissolving
    outputs: { AMMONIUM_HYDROXIDE: 1 },
    visual: 'dissolve',
  },
  // Solvay Process: Salt + Water + Ammonia + CO2 -> Baking Soda
  {
    inputs: { NaCl: 1, H2O: 1, AMMONIA: 1, CO2: 1 },
    conditions: { tempMax: 50 }, // Usually done at room temp or cool
    outputs: { BAKING_SODA: 1 },
    visual: 'solidify',
  },
  // Chloralkali Process: Salt + Water -> NaOH + Chlorine + Hydrogen
  {
    inputs: { NaCl: 1, H2O: 1 },
    conditions: { tempMin: 100 }, // Simulating electrolysis/energy input
    outputs: { SODIUM_HYDROXIDE: 1, CHLORINE: 1, HYDROGEN: 1 },
    visual: 'bubble',
  },
  // HCl Synthesis: Hydrogen + Chlorine -> Hydrochloric Acid
  {
    inputs: { HYDROGEN: 1, CHLORINE: 1 },
    conditions: { pressureMin: 2 }, // Requires pressure to force reaction without explosion
    outputs: { HYDROCHLORIC_ACID: 1 },
    visual: 'fume',
  },
  // Ostwald Process: Ammonia + Oxygen -> Nitric Acid + Water
  {
    inputs: { AMMONIA: 1, OXYGEN: 2 },
    conditions: { tempMin: 200 }, // Platinum catalyst simulated by heat
    outputs: { NITRIC_ACID: 1, H2O: 1 },
    visual: 'fume',
  },
  // Acetone Synthesis (Simplified Cracking): Vinegar + Carbon -> Acetone
  {
    inputs: { VINEGAR: 2, CARBON: 1 },
    conditions: { tempMin: 300 },
    outputs: { ACETONE: 1, CO2: 1, H2O: 1 },
    visual: 'distill',
  }
];