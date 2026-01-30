import { useState, useMemo, useCallback } from 'react';
import { useDrag } from '@use-gesture/react';
import { RECIPES, COMPOUND_PARTICLE_TYPES } from '../../recipes.js';
import { MOLECULE_RECIPES } from '../../constants/moleculeRecipes.js';
import { POLYPEPTIDE_RECIPES } from '../../constants/polypeptideRecipes.js';
import { useParticleStore } from '../store.js';
import { generateGraphSignature } from '../utils/chemistryStructure.js';

export const useSelection = ({ canvasRef }) => {
  const particles = useParticleStore(state => state.particles);
  const bonds = useParticleStore(state => state.bonds);
  const MOLECULE_PARTICLE_TYPES = useMemo(() => new Set(MOLECULE_RECIPES.map(r => r.type)), []);

  const [selectedParticleIds, setSelectedParticleIds] = useState(new Set());
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0, visible: false });

  const handleParticleClick = useCallback((e, particleId) => {
    e.stopPropagation();
    setSelectedParticleIds(prev => {
      const newSelection = new Set(prev);
      if (e.ctrlKey || e.metaKey) {
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
    if (tap) {
      if (event.target === canvasRef.current) {
        setSelectedParticleIds(new Set());
      }
      return;
    }

    if (memo === undefined) {
      memo = event.target === canvasRef.current;
    }
    if (!memo) return;

    const [x, y] = initial;
    const box = {
      x: Math.min(x, x + mx),
      y: Math.min(y, y + my),
      width: Math.abs(mx),
      height: Math.abs(my),
      visible: active,
    };
    setSelectionBox(box);

    if (!active) {
      const selectedIds = new Set();
      particles.forEach(p => {
        const particleSize = COMPOUND_PARTICLE_TYPES.has(p.type) ? 96 : 64;
        const pBox = { x1: p.x, y1: p.y, x2: p.x + particleSize, y2: p.y + particleSize };
        const sBox = { x1: box.x, y1: box.y, x2: box.x + box.width, y2: box.y + box.height };

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
    
    const MOLECULE_TYPES = new Set(MOLECULE_RECIPES.map(r => r.type));
    const POLYPEPTIDE_TYPES = new Set(POLYPEPTIDE_RECIPES.map(r => r.type));

    const canDisassemble = selectedParticles.length === 1 && (
      COMPOUND_PARTICLE_TYPES.has(selectedParticles[0].type) || 
      MOLECULE_TYPES.has(selectedParticles[0].type) ||
      POLYPEPTIDE_TYPES.has(selectedParticles[0].type)
    );
    const canRevert = canDisassemble;

    let assemblyRecipe = null;
    let isMoleculeAssembly = false;
    let isPolypeptideAssembly = false;

    const checkCounts = (recipeObj, countObj) => {
      const recipeKeys = Object.keys(recipeObj || {});
      const countKeys = Object.keys(countObj || {});
      const allKeys = new Set([...recipeKeys, ...countKeys]);
      return Array.from(allKeys).every(key => (recipeObj[key] || 0) === (countObj[key] || 0));
    };

    if (selectedParticles.length > 0 && !canDisassemble) {
      const ingredientCounts = selectedParticles.reduce((acc, p) => ({ ...acc, [p.type]: (acc[p.type] || 0) + 1 }), {});

      for (const recipe of RECIPES) {
        const isExactMatch = checkCounts(recipe.ingredients, ingredientCounts);
        if (isExactMatch) { assemblyRecipe = recipe; break; }
      }

      if (!assemblyRecipe && bonds?.length > 0) {
        const selectedBonds = bonds.filter(bond =>
          selectedParticleIds.has(bond.particleA_id) && selectedParticleIds.has(bond.particleB_id)
        );

        const peptideBondCount = selectedBonds.filter(b => b.type === 'peptide').length;
        if (peptideBondCount > 0) {
          for (const polyRecipe of POLYPEPTIDE_RECIPES) {
            const moleculesMatch = checkCounts(polyRecipe.molecules, ingredientCounts);
            const peptideBondsMatch = (polyRecipe.peptideBonds || 0) === peptideBondCount;
            if (moleculesMatch && peptideBondsMatch && selectedBonds.length === peptideBondCount) {
              assemblyRecipe = polyRecipe;
              isPolypeptideAssembly = true;
              break;
            }
          }
        }

        if (!assemblyRecipe) {
          const bondCounts = selectedBonds.reduce((acc, b) => ({ ...acc, [b.type]: (acc[b.type] || 0) + 1 }), {});

          for (const moleculeRecipe of MOLECULE_RECIPES) {
            const atomsMatch = checkCounts(moleculeRecipe.atoms, ingredientCounts);
            const bondsMatch = checkCounts(moleculeRecipe.bonds, bondCounts);

            if (atomsMatch && bondsMatch) {
              // Structural Check
              if (moleculeRecipe.structure) {
                const recipeSignature = generateGraphSignature(moleculeRecipe.structure.nodes, moleculeRecipe.structure.edges);
                const userSignature = generateGraphSignature(selectedParticles, selectedBonds);

                if (recipeSignature === userSignature) {
                  assemblyRecipe = moleculeRecipe;
                  isMoleculeAssembly = true;
                  break;
                }
                // If structure doesn't match, continue looking (or fail if this was the only candidate)
              } else {
                // Fallback for recipes without explicit structure definition (legacy)
                assemblyRecipe = moleculeRecipe;
                isMoleculeAssembly = true;
                break;
              }
            }
          }
        }
      }
    }

    return { canAssemble: !!assemblyRecipe, canDisassemble, canRevert, assemblyRecipe, selectedParticles, isMoleculeAssembly, isPolypeptideAssembly };
  }, [selectedParticleIds, particles, bonds, MOLECULE_PARTICLE_TYPES]);

  return { selectedParticleIds, setSelectedParticleIds, selectionBox, canvasBind, handleParticleClick, selectionInfo };
};
