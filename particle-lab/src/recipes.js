import { PARTICLE_TYPES } from './constants/particles.js';
import { MOLECULE_RECIPES } from './components/moleculeRecipes.js';

export const PARTICLE_CATEGORIES = {
  SECONDARY: 'secondary',
  ATOM: 'atom',
  MOLECULE: 'molecule',
};

export const RECIPES = [
  // Hadrons
  {
    type: PARTICLE_TYPES.PROTON,
    category: PARTICLE_CATEGORIES.SECONDARY,
    ingredients: {
      [PARTICLE_TYPES.UP_QUARK]: 2,
      [PARTICLE_TYPES.DOWN_QUARK]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.NEUTRON,
    category: PARTICLE_CATEGORIES.SECONDARY,
    ingredients: {
      [PARTICLE_TYPES.UP_QUARK]: 1,
      [PARTICLE_TYPES.DOWN_QUARK]: 2,
    },
  },
  {
    type: PARTICLE_TYPES.DECAYING_NEUTRON,
    category: PARTICLE_CATEGORIES.SECONDARY,
    ingredients: {
      [PARTICLE_TYPES.NEUTRON]: 1,
      [PARTICLE_TYPES.W_BOSON]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.EXCITED_ELECTRON,
    category: PARTICLE_CATEGORIES.SECONDARY, // Technically not, but fits for game logic
    ingredients: {
      [PARTICLE_TYPES.ELECTRON]: 1,
      [PARTICLE_TYPES.PHOTON]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.PION_PLUS,
    category: PARTICLE_CATEGORIES.SECONDARY,
    ingredients: {
      [PARTICLE_TYPES.UP_QUARK]: 1,
      [PARTICLE_TYPES.ANTI_DOWN_QUARK]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.PION_MINUS,
    category: PARTICLE_CATEGORIES.SECONDARY,
    ingredients: {
      [PARTICLE_TYPES.DOWN_QUARK]: 1,
      [PARTICLE_TYPES.ANTI_UP_QUARK]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.LAMBDA_BARYON,
    category: PARTICLE_CATEGORIES.SECONDARY,
    ingredients: {
      [PARTICLE_TYPES.UP_QUARK]: 1,
      [PARTICLE_TYPES.DOWN_QUARK]: 1,
      [PARTICLE_TYPES.STRANGE_QUARK]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.J_PSI_MESON,
    category: PARTICLE_CATEGORIES.SECONDARY,
    ingredients: {
      [PARTICLE_TYPES.CHARM_QUARK]: 1,
      [PARTICLE_TYPES.ANTI_CHARM_QUARK]: 1,
    },
  },
  // Atoms
  {
    type: PARTICLE_TYPES.HYDROGEN,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 1,
      [PARTICLE_TYPES.ELECTRON]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.DEUTERIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 1,
      [PARTICLE_TYPES.NEUTRON]: 1,
      [PARTICLE_TYPES.ELECTRON]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.TRITIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 1,
      [PARTICLE_TYPES.NEUTRON]: 2,
      [PARTICLE_TYPES.ELECTRON]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.HELIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 2,
      [PARTICLE_TYPES.NEUTRON]: 2,
      [PARTICLE_TYPES.ELECTRON]: 2,
    },
  },
  {
    type: PARTICLE_TYPES.LITHIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 3,
      [PARTICLE_TYPES.NEUTRON]: 4,
      [PARTICLE_TYPES.ELECTRON]: 3,
    },
  },
  {
    type: PARTICLE_TYPES.BERYLLIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 4,
      [PARTICLE_TYPES.NEUTRON]: 5,
      [PARTICLE_TYPES.ELECTRON]: 4,
    },
  },
  {
    type: PARTICLE_TYPES.BORON,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 5,
      [PARTICLE_TYPES.NEUTRON]: 6,
      [PARTICLE_TYPES.ELECTRON]: 5,
    },
  },
  {
    type: PARTICLE_TYPES.CARBON,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 6,
      [PARTICLE_TYPES.NEUTRON]: 6,
      [PARTICLE_TYPES.ELECTRON]: 6,
    },
  },
  {
    type: PARTICLE_TYPES.NITROGEN,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 7,
      [PARTICLE_TYPES.NEUTRON]: 7,
      [PARTICLE_TYPES.ELECTRON]: 7,
    },
  },
  {
    type: PARTICLE_TYPES.OXYGEN,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 8,
      [PARTICLE_TYPES.NEUTRON]: 8,
      [PARTICLE_TYPES.ELECTRON]: 8,
    },
  },
  {
    type: PARTICLE_TYPES.FLUORINE,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 9,
      [PARTICLE_TYPES.NEUTRON]: 10,
      [PARTICLE_TYPES.ELECTRON]: 9,
    },
  },
  {
    type: PARTICLE_TYPES.NEON,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 10,
      [PARTICLE_TYPES.NEUTRON]: 10,
      [PARTICLE_TYPES.ELECTRON]: 10,
    },
  },
  {
    type: PARTICLE_TYPES.SODIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 11,
      [PARTICLE_TYPES.NEUTRON]: 12,
      [PARTICLE_TYPES.ELECTRON]: 11,
    },
  },
  {
    type: PARTICLE_TYPES.MAGNESIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 12,
      [PARTICLE_TYPES.NEUTRON]: 12,
      [PARTICLE_TYPES.ELECTRON]: 12,
    },
  },
  {
    type: PARTICLE_TYPES.ALUMINIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 13,
      [PARTICLE_TYPES.NEUTRON]: 14,
      [PARTICLE_TYPES.ELECTRON]: 13,
    },
  },
  {
    type: PARTICLE_TYPES.SILICON,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 14,
      [PARTICLE_TYPES.NEUTRON]: 14,
      [PARTICLE_TYPES.ELECTRON]: 14,
    },
  },
  {
    type: PARTICLE_TYPES.PHOSPHORUS,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 15,
      [PARTICLE_TYPES.NEUTRON]: 16,
      [PARTICLE_TYPES.ELECTRON]: 15,
    },
  },
  {
    type: PARTICLE_TYPES.SULFUR,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 16,
      [PARTICLE_TYPES.NEUTRON]: 16,
      [PARTICLE_TYPES.ELECTRON]: 16,
    },
  },
  {
    type: PARTICLE_TYPES.CHLORINE,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 17,
      [PARTICLE_TYPES.NEUTRON]: 18,
      [PARTICLE_TYPES.ELECTRON]: 17,
    },
  },
  {
    type: PARTICLE_TYPES.ARGON,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 18,
      [PARTICLE_TYPES.NEUTRON]: 22,
      [PARTICLE_TYPES.ELECTRON]: 18,
    },
  },
  {
    type: PARTICLE_TYPES.POTASSIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 19,
      [PARTICLE_TYPES.NEUTRON]: 20,
      [PARTICLE_TYPES.ELECTRON]: 19,
    },
  },
  {
    type: PARTICLE_TYPES.CALCIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 20,
      [PARTICLE_TYPES.NEUTRON]: 20,
      [PARTICLE_TYPES.ELECTRON]: 20,
    },
  },
  {
    type: PARTICLE_TYPES.SCANDIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 21,
      [PARTICLE_TYPES.NEUTRON]: 24,
      [PARTICLE_TYPES.ELECTRON]: 21,
    },
  },
  {
    type: PARTICLE_TYPES.TITANIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 22,
      [PARTICLE_TYPES.NEUTRON]: 26,
      [PARTICLE_TYPES.ELECTRON]: 22,
    },
  },
  {
    type: PARTICLE_TYPES.VANADIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 23,
      [PARTICLE_TYPES.NEUTRON]: 28,
      [PARTICLE_TYPES.ELECTRON]: 23,
    },
  },
  {
    type: PARTICLE_TYPES.CHROMIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 24,
      [PARTICLE_TYPES.NEUTRON]: 28,
      [PARTICLE_TYPES.ELECTRON]: 24,
    },
  },
  {
    type: PARTICLE_TYPES.MANGANESE,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 25,
      [PARTICLE_TYPES.NEUTRON]: 30,
      [PARTICLE_TYPES.ELECTRON]: 25,
    },
  },
  {
    type: PARTICLE_TYPES.IRON,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 26,
      [PARTICLE_TYPES.NEUTRON]: 30,
      [PARTICLE_TYPES.ELECTRON]: 26,
    },
  },
  {
    type: PARTICLE_TYPES.COBALT,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 27,
      [PARTICLE_TYPES.NEUTRON]: 32,
      [PARTICLE_TYPES.ELECTRON]: 27,
    },
  },
  {
    type: PARTICLE_TYPES.NICKEL,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 28,
      [PARTICLE_TYPES.NEUTRON]: 31,
      [PARTICLE_TYPES.ELECTRON]: 28,
    },
  },
  {
    type: PARTICLE_TYPES.COPPER,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 29,
      [PARTICLE_TYPES.NEUTRON]: 34,
      [PARTICLE_TYPES.ELECTRON]: 29,
    },
  },
  {
    type: PARTICLE_TYPES.ZINC,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 30,
      [PARTICLE_TYPES.NEUTRON]: 35,
      [PARTICLE_TYPES.ELECTRON]: 30,
    },
  },
  {
    type: PARTICLE_TYPES.GALLIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 31,
      [PARTICLE_TYPES.NEUTRON]: 39,
      [PARTICLE_TYPES.ELECTRON]: 31,
    },
  },
  {
    type: PARTICLE_TYPES.GERMANIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 32,
      [PARTICLE_TYPES.NEUTRON]: 41,
      [PARTICLE_TYPES.ELECTRON]: 32,
    },
  },
  {
    type: PARTICLE_TYPES.ARSENIC,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 33,
      [PARTICLE_TYPES.NEUTRON]: 42,
      [PARTICLE_TYPES.ELECTRON]: 33,
    },
  },
  {
    type: PARTICLE_TYPES.SELENIUM,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 34,
      [PARTICLE_TYPES.NEUTRON]: 45,
      [PARTICLE_TYPES.ELECTRON]: 34,
    },
  },
  {
    type: PARTICLE_TYPES.BROMINE,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 35,
      [PARTICLE_TYPES.NEUTRON]: 45,
      [PARTICLE_TYPES.ELECTRON]: 35,
    },
  },
  {
    type: PARTICLE_TYPES.KRYPTON,
    category: PARTICLE_CATEGORIES.ATOM,
    ingredients: {
      [PARTICLE_TYPES.PROTON]: 36,
      [PARTICLE_TYPES.NEUTRON]: 48,
      [PARTICLE_TYPES.ELECTRON]: 36,
    },
  },
  // Molecules
  {
    type: PARTICLE_TYPES.WATER,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.HYDROGEN]: 2,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.METHANE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 4,
    },
  },
  {
    type: PARTICLE_TYPES.AMMONIA,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 3,
    },
  },
  {
    type: PARTICLE_TYPES.CARBON_DIOXIDE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
  },
  {
    type: PARTICLE_TYPES.SODIUM_CHLORIDE,
    category: PARTICLE_CATEGORIES.MOLECULE, // Ionic compound, but fits game logic
    ingredients: {
      [PARTICLE_TYPES.SODIUM]: 1,
      [PARTICLE_TYPES.CHLORINE]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.HYDROCHLORIC_ACID,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.HYDROGEN]: 1,
      [PARTICLE_TYPES.CHLORINE]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.CARBON_MONOXIDE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.HYDROGEN_SULFIDE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.HYDROGEN]: 2,
      [PARTICLE_TYPES.SULFUR]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.HYDROGEN_PEROXIDE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.HYDROGEN]: 2,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
  },
  {
    type: PARTICLE_TYPES.OZONE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.OXYGEN]: 3,
    },
  },
  {
    type: PARTICLE_TYPES.NITROUS_OXIDE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.NITROGEN]: 2,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
  },
  {
    type: PARTICLE_TYPES.SILICON_DIOXIDE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.SILICON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
  },
];

// Create a map for quick lookup of a particle's composition for deconstruction.
export const COMPOSITION_MAP = new Map(
  RECIPES.map(recipe => [recipe.type, recipe.ingredients])
);

export const FULL_COMPOSITION_MAP = new Map([
  ...RECIPES.map(recipe => [recipe.type, recipe.ingredients]),
  ...MOLECULE_RECIPES.map(recipe => [recipe.type, recipe.atoms])
]);

export const COMPOUND_PARTICLE_TYPES = new Set(
  [
    ...RECIPES.map(r => r.type),
    ...MOLECULE_RECIPES.map(r => r.type)
  ]
);