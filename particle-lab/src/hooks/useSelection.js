import { useState, useMemo, useCallback } from 'react';
import { useDrag } from '@use-gesture/react';
import { RECIPES, COMPOUND_PARTICLE_TYPES, MOLECULE_PARTICLE_TYPES } from '../recipes.js';
import { MOLECULE_RECIPES } from '../components/moleculeRecipes.js';
import { POLYPEPTIDE_RECIPES } from '../constants/polypeptideRecipes.js';

export const useSelection = ({ particles, bonds, canvasRef }) => {
  const [selectedParticleIds, setSelectedParticleIds] = useState(new Set());
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0, visible: false });

  const handleParticleClick = useCallback((e, particleId) => {
    e.stopPropagation();
    setSelectedParticleIds(prev => {
      const newSelection = new Set(prev);
      if (e.ctrlKey || e.metaKey) { // metaKey for Command on Mac
        if (newSelection.has(particleId)) {
          newSelection.delete(particleId);
        } else {
          newSelection.add(particleId);
        }
      } else {
        newSelection.clear();
        newSelection.add(particleId);
      }
      return newSelection;
    });
  }, []);

  const canvasBind = useDrag(({ active, event, initial, movement: [mx, my], tap, memo }) => {
    // If it's a simple tap on the canvas, clear selection.
    if (tap) {
      if (event.target === canvasRef.current) {
        setSelectedParticleIds(new Set());
      }
      return;
    }

    // On the first event of the drag, check if it started on the canvas background.
    // If not, memoize `false` to ignore the rest of this drag gesture.
    if (memo === undefined) {
      memo = event.target === canvasRef.current;
    }
    if (!memo) return; // Ignore drag if it didn't start on the canvas.

    const [x, y] = initial;
    const box = {
      x: Math.min(x, x + mx),
      y: Math.min(y, y + my),
      width: Math.abs(mx),
      height: Math.abs(my),
      visible: active,
    };
    setSelectionBox(box);

    if (!active) { // on drag end
      const selectedIds = new Set();
      particles.forEach(p => {
        const particleSize = COMPOUND_PARTICLE_TYPES.has(p.type) ? 96 : 64;
        const pBox = { x1: p.x, y1: p.y, x2: p.x + particleSize, y2: p.y + particleSize };
        const sBox = { x1: box.x, y1: box.y, x2: box.x + box.width, y2: box.y + box.height };

        // Check for overlap
        if (pBox.x1 < sBox.x2 && pBox.x2 > sBox.x1 && pBox.y1 < sBox.y2 && pBox.y2 > sBox.y1) {
          selectedIds.add(p.id);
        }
      });
      setSelectedParticleIds(selectedIds);
    }
    return memo;
  }, {
    transform: ([x, y]) => {
      if (!canvasRef.current) return [x, y];
      const bounds = canvasRef.current.getBoundingClientRect();
      return [x - bounds.left, y - bounds.top];
    },
    eventOptions: { passive: false },
  });

  const selectionInfo = useMemo(() => {
    const selectedParticles = particles.filter(p => selectedParticleIds.has(p.id));
    const canDisassemble = selectedParticles.length === 1 && (COMPOUND_PARTICLE_TYPES.has(selectedParticles[0].type) || MOLECULE_PARTICLE_TYPES.has(selectedParticles[0].type));
    const canRevert = canDisassemble; // Same condition

    let assemblyRecipe = null;
    let isMoleculeAssembly = false;
    let isPolypeptideAssembly = false;

    const checkCounts = (recipeObj, countObj) => {
      const recipeKeys = Object.keys(recipeObj);
      const countKeys = Object.keys(countObj);
      if (recipeKeys.length !== countKeys.length) return false;
      return recipeKeys.every(key => recipeObj[key] === (countObj[key] || 0));
    };

    if (selectedParticles.length > 0 && !canDisassemble) {
      // First, check for simple particle recipes
      const ingredientCounts = selectedParticles.reduce((acc, p) => ({ ...acc, [p.type]: (acc[p.type] || 0) + 1 }), {});

      for (const recipe of RECIPES) {
        const recipeKeys = Object.keys(recipe.ingredients);
        const compositionKeys = Object.keys(ingredientCounts);
        if (recipeKeys.length !== compositionKeys.length) continue;
        const isExactMatch = recipeKeys.every(type => (ingredientCounts[type] || 0) === recipe.ingredients[type]);
        if (isExactMatch) { assemblyRecipe = recipe; break; }
      }

      if (!assemblyRecipe && bonds?.length > 0) {
        const selectedBonds = bonds.filter(bond =>
          selectedParticleIds.has(bond.particleA_id) && selectedParticleIds.has(bond.particleB_id)
        );

        // Check for polypeptide recipes (molecules + peptide bonds)
        const peptideBondCount = selectedBonds.filter(b => b.type === 'peptide').length;
        if (peptideBondCount > 0) {
          for (const polyRecipe of POLYPEPTIDE_RECIPES) {
            const moleculesMatch = checkCounts(polyRecipe.molecules, ingredientCounts);
            const peptideBondsMatch = polyRecipe.peptideBonds === peptideBondCount;
            if (moleculesMatch && peptideBondsMatch) {
              assemblyRecipe = polyRecipe;
              isPolypeptideAssembly = true;
              break;
            }
          }
        }

        // If no polypeptide recipe, check for molecule recipes (atoms + covalent bonds)
        if (!assemblyRecipe) {
        const bondCounts = selectedBonds.reduce((acc, b) => ({ ...acc, [b.type]: (acc[b.type] || 0) + 1 }), { single: 0, double: 0 });

        for (const moleculeRecipe of MOLECULE_RECIPES) {
          const atomsMatch = checkCounts(moleculeRecipe.atoms, ingredientCounts);
          const bondsMatch = checkCounts(moleculeRecipe.bonds, bondCounts);

          if (atomsMatch && bondsMatch) {
            assemblyRecipe = moleculeRecipe;
            isMoleculeAssembly = true;
            break;
          }
        }
      }
      }
    }

    return { canAssemble: !!assemblyRecipe, canDisassemble, canRevert, assemblyRecipe, selectedParticles, isMoleculeAssembly, isPolypeptideAssembly };
  }, [selectedParticleIds, particles, bonds]);

  return { selectedParticleIds, setSelectedParticleIds, selectionBox, canvasBind, handleParticleClick, selectionInfo };
};