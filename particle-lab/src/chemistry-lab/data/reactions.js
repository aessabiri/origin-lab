import { MOLECULE_RECIPES } from '../../constants/moleculeRecipes.js';
import { PARTICLE_TYPES } from '../../constants/particles.js';

const MANUAL_REACTIONS = [
  // Vinegar + Baking Soda -> CO2 + Water
  {
    inputs: { 'vinegar': 1, 'baking-soda': 1 },
    conditions: { tempMin: 0, pressureMin: 1 },
    outputs: { 'carbon-dioxide': 1, 'water': 1 },
    visual: 'bubble',
    heat: -20 // Endothermic (Cooling)
  },
  // Iron + Oxygen -> Iron Oxide (Rust)
  {
    inputs: { 'iron': 4, 'oxygen': 3 },
    conditions: { tempMin: 100 },
    outputs: { 'iron-oxide': 2 }, // 4Fe + 3O2 -> 2Fe2O3
    visual: 'solidify',
    heat: 30 // Exothermic
  },
  // Sulfur + Oxygen -> Sulfur Dioxide
  {
    inputs: { 'sulfur': 1, 'oxygen': 1 },
    conditions: { tempMin: 100 },
    outputs: { 'sulfur-dioxide': 1 },
    visual: 'fume',
    heat: 50
  },
  // Hydrogen + Nitrogen -> Ammonia (Haber Process)
  {
    inputs: { 'hydrogen': 3, 'nitrogen': 1 },
    conditions: { tempMin: 200, pressureMin: 50 },
    outputs: { 'ammonia': 2 },
    visual: 'steam',
    heat: 40
  },
  // Water + CO2 -> Carbonic Acid
  {
    inputs: { 'water': 1, 'carbon-dioxide': 1 },
    conditions: { pressureMin: 5 },
    outputs: { 'carbonic-acid': 1 },
    visual: 'dissolve',
    heat: 5
  },
  // Water + SO2 + Oxygen -> Sulfuric Acid (Simplified Contact Process)
  {
    inputs: { 'water': 1, 'sulfur-dioxide': 1, 'oxygen': 1 },
    conditions: { tempMin: 50 },
    outputs: { 'sulfuric-acid': 1 },
    visual: 'condense',
    heat: 80 // Highly Exothermic
  },
  // Carbon + Oxygen -> CO2 (Burning Charcoal)
  {
    inputs: { 'carbon': 1, 'oxygen': 1 },
    conditions: { tempMin: 200 },
    outputs: { 'carbon-dioxide': 1 },
    visual: 'fume',
    heat: 100 // Fire
  },
  // Hydrogen + Oxygen -> Water (Combustion)
  {
    inputs: { 'hydrogen': 2, 'oxygen': 1 },
    conditions: { tempMin: 100 },
    outputs: { 'water': 2 },
    visual: 'bubble', // Should be explosion theoretically, but 'bubble' works for now
    heat: 200 // BOOM
  },
  // Iron + Sulfur -> Iron Sulfide
  {
    inputs: { 'iron': 1, 'sulfur': 1 },
    conditions: { tempMin: 150 },
    outputs: { 'iron-sulfide': 1 },
    visual: 'solidify',
    heat: 40
  },
  // Iron + Carbon -> Steel
  {
    inputs: { 'iron': 5, 'carbon': 1 }, // Steel is mostly Iron
    conditions: { tempMin: 500 },
    outputs: { 'steel': 5 },
    visual: 'solidify',
    heat: 0
  },
  // Ammonia + Water -> Ammonium Hydroxide
  {
    inputs: { 'ammonia': 1, 'water': 1 },
    conditions: {}, // Spontaneous dissolving
    outputs: { 'ammonium-hydroxide': 1 },
    visual: 'dissolve',
    heat: 10
  },
  // Solvay Process: Salt + Water + Ammonia + CO2 -> Baking Soda
  {
    inputs: { 'sodium-chloride': 1, 'water': 1, 'ammonia': 1, 'carbon-dioxide': 1 },
    conditions: { tempMax: 50 }, // Usually done at room temp or cool
    outputs: { 'baking-soda': 1 },
    visual: 'solidify',
    heat: -10
  },
  // Chloralkali Process: Salt + Water -> NaOH + Chlorine + Hydrogen
  {
    inputs: { 'sodium-chloride': 2, 'water': 2 },
    conditions: { tempMin: 100 },
    outputs: { 'sodium-hydroxide': 2, 'chlorine': 1, 'hydrogen': 1 },
    visual: 'bubble',
    heat: 0 // Powered by external energy usually
  },
  // HCl Synthesis: Hydrogen + Chlorine -> Hydrochloric Acid
  {
    inputs: { 'hydrogen': 1, 'chlorine': 1 },
    conditions: { pressureMin: 2 }, // Requires pressure to force reaction without explosion
    outputs: { 'hydrochloric-acid': 1 },
    visual: 'fume',
    heat: 60
  },
  // Ostwald Process: Ammonia + Oxygen -> Nitric Acid + Water
  {
    inputs: { 'ammonia': 1, 'oxygen': 2 },
    conditions: { tempMin: 200 }, // Platinum catalyst simulated by heat
    outputs: { 'nitric-acid': 1, 'water': 1 },
    visual: 'fume',
    heat: 50
  },
  // Acetone Synthesis (Simplified Cracking): Vinegar + Carbon -> Acetone
  {
    inputs: { 'vinegar': 2, 'carbon': 1 },
    conditions: { tempMin: 300 },
    outputs: { 'acetone': 1, 'carbon-dioxide': 1, 'water': 1 },
    visual: 'distill',
    heat: -20
  },
  // Esterification: Ethanol + Vinegar -> Ethyl Acetate
  {
    inputs: { 'ethanol': 1, 'vinegar': 1 },
    conditions: { tempMin: 60 },
    outputs: { 'ethyl-acetate': 1, 'water': 1 },
    visual: 'distill',
    heat: 5
  },
  // Methanol Synthesis: CO2 + Hydrogen -> Methanol
  {
    inputs: { 'carbon-dioxide': 1, 'hydrogen': 3 },
    conditions: { tempMin: 200, pressureMin: 30 },
    outputs: { 'methanol': 1, 'water': 1 },
    visual: 'condense',
    heat: 20
  },
  // Dehydration: Ethanol -> Ethylene
  {
    inputs: { 'ethanol': 1 },
    conditions: { tempMin: 170 },
    outputs: { 'ethylene': 1, 'water': 1 },
    visual: 'fume',
    heat: -10
  },
  // Polymerization: Ethylene -> Polyethylene
  {
    inputs: { 'ethylene': 5 },
    conditions: { tempMin: 100, pressureMin: 50 },
    outputs: { 'polyethylene': 1 }, // Simplified ratio
    visual: 'solidify',
    heat: 30
  },
  // Methane Synthesis (Sabatier Process): CO2 + Hydrogen -> Methane + Water
  {
    inputs: { 'carbon-dioxide': 1, 'hydrogen': 4 },
    conditions: { tempMin: 300, pressureMin: 10 },
    outputs: { 'methane': 1, 'water': 2 },
    visual: 'fume',
    heat: 50
  },
  // Photosynthesis (Simplified): CO2 + Water -> Glucose + Oxygen
  {
    inputs: { 'carbon-dioxide': 6, 'water': 6 },
    conditions: { tempMin: 100, pressureMin: 20 }, // High energy required
    outputs: { 'glucose': 1, 'oxygen': 6 },
    visual: 'solidify',
    heat: -50 // Endothermic
  },
  // Miller-Urey inspired Glycine Synthesis: Methane + Ammonia + Water -> Glycine + Hydrogen
  {
    inputs: { 'methane': 2, 'ammonia': 1, 'water': 2 },
    conditions: { tempMin: 400, pressureMin: 40 }, // High energy/lightning simulation
    outputs: { 'glycine': 1, 'hydrogen': 5 },
    visual: 'solidify',
    heat: -30
  },
  // Neutralization: HCl + NaOH -> NaCl + H2O
  {
    inputs: { 'hydrochloric-acid': 1, 'sodium-hydroxide': 1 },
    conditions: {}, // Spontaneous
    outputs: { 'sodium-chloride': 1, 'water': 1 },
    visual: 'steam', // It gets hot!
    heat: 58 // Standard enthalpy of neutralization is ~57 kJ/mol
  }
];

// --- Auto-Generation Logic ---

// Elements that exist as Diatomic Gases in the Chemistry Lab inventory
const DIATOMIC_ELEMENTS = new Set([
  PARTICLE_TYPES.HYDROGEN,
  PARTICLE_TYPES.OXYGEN,
  PARTICLE_TYPES.NITROGEN,
  PARTICLE_TYPES.CHLORINE,
  PARTICLE_TYPES.FLUORINE,
  // Bromine/Iodine omitted as they might be liquid/solid or not in basic list, 
  // but usually treated as diatomic in reaction stochiometry.
]);

// Helper to check if a reaction for this output already exists
const existingOutputs = new Set();
MANUAL_REACTIONS.forEach(r => {
  Object.keys(r.outputs).forEach(out => existingOutputs.add(out));
});

const generatedReactions = [];

MOLECULE_RECIPES.forEach(recipe => {
  if (existingOutputs.has(recipe.type)) return; // Skip if manually defined

  // Calculate stoichiometry
  // We need to convert Atom counts to Molecule counts.
  // If an atom is diatomic (e.g. H), we need H/2 molecules.
  // If H is odd, we must multiply the entire equation by 2 (or more) to get integer coefficients.
  
  let multiplier = 1;
  const atomIngredients = Object.entries(recipe.atoms);
  
  // check for odd counts of diatomic elements
  for (const [atom, count] of atomIngredients) {
    if (DIATOMIC_ELEMENTS.has(atom)) {
      if ((count * multiplier) % 2 !== 0) {
        multiplier *= 2;
      }
    }
  }

  const inputs = {};
  
  atomIngredients.forEach(([atom, count]) => {
    const totalAtoms = count * multiplier;
    if (DIATOMIC_ELEMENTS.has(atom)) {
      inputs[atom] = totalAtoms / 2;
    } else {
      inputs[atom] = totalAtoms;
    }
  });

  // Output count
  const outputs = { [recipe.type]: multiplier };

  // Heuristic for Conditions based on complexity
  const conditions = {
    tempMin: 50 + Object.keys(inputs).length * 20, // More ingredients -> more heat needed
    pressureMin: 1 + Object.keys(inputs).length // Slight pressure
  };

  generatedReactions.push({
    inputs,
    conditions,
    outputs,
    visual: 'fume', // Generic visual
    heat: 10 * multiplier // Generic exothermic
  });
});

export const REACTIONS = [...MANUAL_REACTIONS, ...generatedReactions];