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
  {
    type: PARTICLE_TYPES.HYDROGEN_FLUORIDE,
    category: PARTICLE_CATEGORIES.MOLECULE,
    ingredients: {
      [PARTICLE_TYPES.HYDROGEN]: 1,
      [PARTICLE_TYPES.FLUORINE]: 1,
    },
  },
];

// Create a map for quick lookup of a particle's composition for deconstruction.
export const COMPOSITION_MAP = new Map(
  RECIPES.map(recipe => [recipe.type, recipe.ingredients])
);

export const COMPOUND_PARTICLE_TYPES = new Set(
  RECIPES.map(r => r.type)
);

export const MOLECULE_PARTICLE_TYPES = new Set(
  MOLECULE_RECIPES.map(r => r.type)
);