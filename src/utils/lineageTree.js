import { PARTICLE_TYPES } from '../constants/particles.js';
import { RECIPES } from '../recipes.js';
import { MOLECULE_RECIPES } from '../constants/moleculeRecipes.js';
import { POLYPEPTIDE_RECIPES } from '../constants/polypeptideRecipes.js';
import { getMatterInfo } from '../constants/matterRegistry.js';

// Get direct constituent ingredients for any particle / molecule / organelle
export const getDirectIngredients = (type) => {
  if (!type) return [];

  // 1. Check in RECIPES (Hadrons, Atoms, Organelles, Alloys)
  const recipe = RECIPES.find(r => r.type === type);
  if (recipe && recipe.ingredients) {
    return Object.entries(recipe.ingredients).map(([childType, count]) => ({
      type: childType,
      count: Number(count),
    }));
  }

  // 2. Check in MOLECULE_RECIPES
  const moleculeRecipe = MOLECULE_RECIPES.find(r => r.type === type);
  if (moleculeRecipe && moleculeRecipe.atoms) {
    return Object.entries(moleculeRecipe.atoms).map(([atomType, count]) => ({
      type: atomType,
      count: Number(count),
    }));
  }

  // 3. Check in POLYPEPTIDE_RECIPES
  const polypeptideRecipe = POLYPEPTIDE_RECIPES.find(r => r.type === type);
  if (polypeptideRecipe && polypeptideRecipe.molecules) {
    return Object.entries(polypeptideRecipe.molecules).map(([molType, count]) => ({
      type: molType,
      count: Number(count),
    }));
  }

  // 4. Hardcoded Elementary Particles (No constituents)
  const elementaryTypes = new Set([
    PARTICLE_TYPES.UP_QUARK,
    PARTICLE_TYPES.DOWN_QUARK,
    PARTICLE_TYPES.CHARM_QUARK,
    PARTICLE_TYPES.STRANGE_QUARK,
    PARTICLE_TYPES.TOP_QUARK,
    PARTICLE_TYPES.BOTTOM_QUARK,
    PARTICLE_TYPES.ANTI_UP_QUARK,
    PARTICLE_TYPES.ANTI_DOWN_QUARK,
    PARTICLE_TYPES.ANTI_CHARM_QUARK,
    PARTICLE_TYPES.ELECTRON,
    PARTICLE_TYPES.POSITRON,
    PARTICLE_TYPES.MUON,
    PARTICLE_TYPES.TAU,
    PARTICLE_TYPES.ELECTRON_NEUTRINO,
    PARTICLE_TYPES.ELECTRON_ANTINEUTRINO,
    PARTICLE_TYPES.PHOTON,
    PARTICLE_TYPES.GLUON,
    PARTICLE_TYPES.W_BOSON,
    PARTICLE_TYPES.Z_BOSON,
    PARTICLE_TYPES.HIGGS_BOSON,
  ]);

  if (elementaryTypes.has(type)) {
    return [];
  }

  return [];
};

// Build recursive tree
export const buildLineageTree = (rootType, count = 1, visited = new Set()) => {
  if (!rootType) return null;

  const info = getMatterInfo(rootType) || {};
  const directIngredients = getDirectIngredients(rootType);

  const node = {
    type: rootType,
    count,
    name: info.name || rootType,
    color: info.color || '#38bdf8',
    category: info.category || 'Matter',
    source: info.source || 'Database',
    description: info.description || '',
    mass: info.mass || '',
    charge: info.charge ?? 0,
    children: []
  };

  if (directIngredients.length > 0 && !visited.has(rootType)) {
    const nextVisited = new Set(visited).add(rootType);
    node.children = directIngredients.map(ing => 
      buildLineageTree(ing.type, ing.count, nextVisited)
    );
  }

  return node;
};

// Aggregate total fundamental quarks, leptons, and charge
export const aggregateFundamentalConstituents = (type) => {
  const totals = {
    [PARTICLE_TYPES.UP_QUARK]: 0,
    [PARTICLE_TYPES.DOWN_QUARK]: 0,
    [PARTICLE_TYPES.ELECTRON]: 0,
    other: {}
  };

  let totalCharge = 0;

  function traverse(currentType, multiplier) {
    const children = getDirectIngredients(currentType);
    if (children.length === 0) {
      if (totals[currentType] !== undefined) {
        totals[currentType] += multiplier;
      } else {
        totals.other[currentType] = (totals.other[currentType] || 0) + multiplier;
      }

      if (currentType === PARTICLE_TYPES.UP_QUARK) totalCharge += multiplier * (2 / 3);
      else if (currentType === PARTICLE_TYPES.DOWN_QUARK) totalCharge += multiplier * (-1 / 3);
      else if (currentType === PARTICLE_TYPES.ELECTRON) totalCharge += multiplier * (-1);
      else if (currentType === PARTICLE_TYPES.POSITRON) totalCharge += multiplier * (+1);
      else if (currentType === PARTICLE_TYPES.ANTI_UP_QUARK) totalCharge += multiplier * (-2 / 3);
      else if (currentType === PARTICLE_TYPES.ANTI_DOWN_QUARK) totalCharge += multiplier * (+1 / 3);
      return;
    }

    children.forEach(child => {
      traverse(child.type, multiplier * child.count);
    });
  }

  traverse(type, 1);

  return {
    upQuarks: totals[PARTICLE_TYPES.UP_QUARK],
    downQuarks: totals[PARTICLE_TYPES.DOWN_QUARK],
    electrons: totals[PARTICLE_TYPES.ELECTRON],
    other: totals.other,
    netCharge: Math.round(totalCharge * 100) / 100
  };
};
