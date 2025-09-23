import { useState, useMemo, useCallback } from 'react';
import { useDrag } from '@use-gesture/react';
import { RECIPES, COMPOUND_PARTICLE_TYPES } from '../recipes.js';

export const useSelection = ({ particles, canvasRef }) => {
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
    const canDisassemble = selectedParticles.length === 1 && COMPOUND_PARTICLE_TYPES.has(selectedParticles[0].type);
    const canRevert = canDisassemble; // Same condition
    let assemblyRecipe = null;
    if (selectedParticles.length > 0 && !canDisassemble) {
      const composition = {};
      selectedParticles.forEach(p => { composition[p.type] = (composition[p.type] || 0) + 1; });
      for (const recipe of RECIPES) {
        const recipeKeys = Object.keys(recipe.ingredients);
        const compositionKeys = Object.keys(composition);
        if (recipeKeys.length !== compositionKeys.length) continue;
        const isExactMatch = recipeKeys.every(type => (composition[type] || 0) === recipe.ingredients[type]);
        if (isExactMatch) { assemblyRecipe = recipe; break; }
      }
    }
    return { canAssemble: !!assemblyRecipe, canDisassemble, canRevert, assemblyRecipe, selectedParticles };
  }, [selectedParticleIds, particles]);

  return { selectedParticleIds, setSelectedParticleIds, selectionBox, canvasBind, handleParticleClick, selectionInfo };
};