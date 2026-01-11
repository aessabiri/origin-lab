import { generateGraphSignature } from './chemistryStructure.js';
import { MOLECULE_RECIPES } from '../constants/moleculeRecipes.js';

/**
 * Checks if two count objects match exactly.
 * @param {Object} recipeCounts - Expected counts from recipe
 * @param {Object} groupCounts - Actual counts from the particle group
 * @returns {boolean}
 */
const doCountsMatch = (recipeCounts = {}, groupCounts = {}) => {
  const allKeys = new Set([...Object.keys(recipeCounts), ...Object.keys(groupCounts)]);
  return Array.from(allKeys).every(key => (recipeCounts[key] || 0) === (groupCounts[key] || 0));
};

/**
 * Identifies all particles that are part of valid molecule structures.
 * 
 * @param {Array} particles - List of all particles on the canvas
 * @param {Array} bonds - List of all bonds between particles
 * @returns {Set<string>} - A Set of particle IDs that are part of a valid molecule
 */
export const findAssemblableMolecules = (particles, bonds) => {
  const assemblableIds = new Set();
  if (!bonds || !bonds.length) return assemblableIds;

  // Build Adjacency List
  const adj = new Map();
  particles.forEach(p => adj.set(p.id, []));
  bonds.forEach(bond => {
    if (adj.has(bond.particleA_id) && adj.has(bond.particleB_id)) {
      adj.get(bond.particleA_id).push(bond.particleB_id);
      adj.get(bond.particleB_id).push(bond.particleA_id);
    }
  });

  const visited = new Set();
  
  for (const particle of particles) {
    if (!visited.has(particle.id)) {
      // BFS to find connected component (molecule candidate)
      const groupIds = new Set();
      const queue = [particle.id];
      visited.add(particle.id);

      while (queue.length > 0) {
        const currentId = queue.shift();
        groupIds.add(currentId);
        (adj.get(currentId) || []).forEach(neighborId => {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push(neighborId);
          }
        });
      }

      // If we found a group connected by bonds
      const groupBonds = bonds.filter(b => groupIds.has(b.particleA_id) && groupIds.has(b.particleB_id));
      
      if (groupBonds.length > 0) {
        const groupParticles = particles.filter(p => groupIds.has(p.id));

        // Count Atoms and Bonds
        const atomCounts = groupParticles.reduce((acc, p) => ({ ...acc, [p.type]: (acc[p.type] || 0) + 1 }), {});
        const bondCounts = groupBonds.reduce((acc, b) => ({ ...acc, [b.type]: (acc[b.type] || 0) + 1 }), {});

        // Filter recipes by counts first (fast pass)
        const possibleRecipes = MOLECULE_RECIPES.filter(r => 
          doCountsMatch(r.atoms, atomCounts) && doCountsMatch(r.bonds, bondCounts)
        );

        let recipeMatch = null;

        // Check structure (slow pass)
        for (const recipe of possibleRecipes) {
          if (recipe.structure) {
            const recipeSignature = generateGraphSignature(recipe.structure.nodes, recipe.structure.edges);
            const userSignature = generateGraphSignature(groupParticles, groupBonds);
            
            if (recipeSignature === userSignature) {
              recipeMatch = recipe;
              break;
            }
          } else {
            // If no structure defined, counts are enough (legacy/simple molecules)
            recipeMatch = recipe;
            break;
          }
        }

        if (recipeMatch) {
          groupIds.forEach(id => assemblableIds.add(id));
        }
      }
    }
  }
  return assemblableIds;
};
