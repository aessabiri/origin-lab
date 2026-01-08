export const REACTIONS = [
  // Vinegar + Baking Soda -> CO2 + Water
  {
    inputs: { VINEGAR: 1, BAKING_SODA: 1 },
    conditions: { tempMin: 0, pressureMin: 1 },
    outputs: { CO2: 1, H2O: 1 },
    visual: 'bubble',
    heat: -20 // Endothermic (Cooling)
  },
  // Iron + Oxygen -> Iron Oxide (Rust)
  {
    inputs: { IRON: 4, OXYGEN: 3 },
    conditions: { tempMin: 100 },
    outputs: { IRON_OXIDE: 2 }, // 4Fe + 3O2 -> 2Fe2O3
    visual: 'solidify',
    heat: 30 // Exothermic
  },
  // Sulfur + Oxygen -> Sulfur Dioxide
  {
    inputs: { SULFUR: 1, OXYGEN: 1 },
    conditions: { tempMin: 100 },
    outputs: { SO2: 1 },
    visual: 'fume',
    heat: 50
  },
  // Hydrogen + Nitrogen -> Ammonia (Haber Process)
  {
    inputs: { HYDROGEN: 3, NITROGEN: 1 },
    conditions: { tempMin: 200, pressureMin: 50 },
    outputs: { AMMONIA: 2 },
    visual: 'steam',
    heat: 40
  },
  // Water + CO2 -> Carbonic Acid
  {
    inputs: { H2O: 1, CO2: 1 },
    conditions: { pressureMin: 5 },
    outputs: { CARBONIC_ACID: 1 },
    visual: 'dissolve',
    heat: 5
  },
  // Water + SO2 + Oxygen -> Sulfuric Acid (Simplified Contact Process)
  {
    inputs: { H2O: 1, SO2: 1, OXYGEN: 1 },
    conditions: { tempMin: 50 },
    outputs: { SULFURIC_ACID: 1 },
    visual: 'condense',
    heat: 80 // Highly Exothermic
  },
  // Carbon + Oxygen -> CO2 (Burning Charcoal)
  {
    inputs: { CARBON: 1, OXYGEN: 1 },
    conditions: { tempMin: 200 },
    outputs: { CO2: 1 },
    visual: 'fume',
    heat: 100 // Fire
  },
  // Hydrogen + Oxygen -> Water (Combustion)
  {
    inputs: { HYDROGEN: 2, OXYGEN: 1 },
    conditions: { tempMin: 100 },
    outputs: { H2O: 2 },
    visual: 'bubble', // Should be explosion theoretically, but 'bubble' works for now
    heat: 200 // BOOM
  },
  // Iron + Sulfur -> Iron Sulfide
  {
    inputs: { IRON: 1, SULFUR: 1 },
    conditions: { tempMin: 150 },
    outputs: { IRON_SULFIDE: 1 },
    visual: 'solidify',
    heat: 40
  },
  // Iron + Carbon -> Steel
  {
    inputs: { IRON: 5, CARBON: 1 }, // Steel is mostly Iron
    conditions: { tempMin: 500 },
    outputs: { STEEL: 5 },
    visual: 'solidify',
    heat: 0
  },
  // Ammonia + Water -> Ammonium Hydroxide
  {
    inputs: { AMMONIA: 1, H2O: 1 },
    conditions: {}, // Spontaneous dissolving
    outputs: { AMMONIUM_HYDROXIDE: 1 },
    visual: 'dissolve',
    heat: 10
  },
  // Solvay Process: Salt + Water + Ammonia + CO2 -> Baking Soda
  {
    inputs: { NaCl: 1, H2O: 1, AMMONIA: 1, CO2: 1 },
    conditions: { tempMax: 50 }, // Usually done at room temp or cool
    outputs: { BAKING_SODA: 1 },
    visual: 'solidify',
    heat: -10
  },
  // Chloralkali Process: Salt + Water -> NaOH + Chlorine + Hydrogen
  {
    inputs: { NaCl: 2, H2O: 2 },
    conditions: { tempMin: 100 },
    outputs: { SODIUM_HYDROXIDE: 2, CHLORINE: 1, HYDROGEN: 1 },
    visual: 'bubble',
    heat: 0 // Powered by external energy usually
  },
  // HCl Synthesis: Hydrogen + Chlorine -> Hydrochloric Acid
  {
    inputs: { HYDROGEN: 1, CHLORINE: 1 },
    conditions: { pressureMin: 2 }, // Requires pressure to force reaction without explosion
    outputs: { HYDROCHLORIC_ACID: 1 },
    visual: 'fume',
    heat: 60
  },
  // Ostwald Process: Ammonia + Oxygen -> Nitric Acid + Water
  {
    inputs: { AMMONIA: 1, OXYGEN: 2 },
    conditions: { tempMin: 200 }, // Platinum catalyst simulated by heat
    outputs: { NITRIC_ACID: 1, H2O: 1 },
    visual: 'fume',
    heat: 50
  },
  // Acetone Synthesis (Simplified Cracking): Vinegar + Carbon -> Acetone
  {
    inputs: { VINEGAR: 2, CARBON: 1 },
    conditions: { tempMin: 300 },
    outputs: { ACETONE: 1, CO2: 1, H2O: 1 },
    visual: 'distill',
    heat: -20
  },
  // Esterification: Ethanol + Vinegar -> Ethyl Acetate
  {
    inputs: { ETHANOL: 1, VINEGAR: 1 },
    conditions: { tempMin: 60 },
    outputs: { ETHYL_ACETATE: 1, H2O: 1 },
    visual: 'distill',
    heat: 5
  },
  // Methanol Synthesis: CO2 + Hydrogen -> Methanol
  {
    inputs: { CO2: 1, HYDROGEN: 3 },
    conditions: { tempMin: 200, pressureMin: 30 },
    outputs: { METHANOL: 1, H2O: 1 },
    visual: 'condense',
    heat: 20
  },
  // Dehydration: Ethanol -> Ethylene
  {
    inputs: { ETHANOL: 1 },
    conditions: { tempMin: 170 },
    outputs: { ETHYLENE: 1, H2O: 1 },
    visual: 'fume',
    heat: -10
  },
  // Polymerization: Ethylene -> Polyethylene
  {
    inputs: { ETHYLENE: 5 },
    conditions: { tempMin: 100, pressureMin: 50 },
    outputs: { POLYETHYLENE: 1 }, // Simplified ratio
    visual: 'solidify',
    heat: 30
  },
  // Methane Synthesis (Sabatier Process): CO2 + Hydrogen -> Methane + Water
  {
    inputs: { CO2: 1, HYDROGEN: 4 },
    conditions: { tempMin: 300, pressureMin: 10 },
    outputs: { METHANE: 1, H2O: 2 },
    visual: 'fume',
    heat: 50
  },
  // Photosynthesis (Simplified): CO2 + Water -> Glucose + Oxygen
  {
    inputs: { CO2: 6, H2O: 6 },
    conditions: { tempMin: 100, pressureMin: 20 }, // High energy required
    outputs: { GLUCOSE: 1, OXYGEN: 6 },
    visual: 'solidify',
    heat: -50 // Endothermic
  },
  // Miller-Urey inspired Glycine Synthesis: Methane + Ammonia + Water -> Glycine + Hydrogen
  {
    inputs: { METHANE: 2, AMMONIA: 1, H2O: 2 },
    conditions: { tempMin: 400, pressureMin: 40 }, // High energy/lightning simulation
        outputs: { GLYCINE: 1, HYDROGEN: 5 },
        visual: 'solidify',
        heat: -30
      },
      // Neutralization: HCl + NaOH -> NaCl + H2O
      {
        inputs: { HYDROCHLORIC_ACID: 1, SODIUM_HYDROXIDE: 1 },
        conditions: {}, // Spontaneous
        outputs: { NaCl: 1, H2O: 1 },
        visual: 'steam', // It gets hot!
        heat: 58 // Standard enthalpy of neutralization is ~57 kJ/mol
      }
    ];
    