import { useCallback } from 'react';
import { PARTICLE_CATEGORIES, COMPOSITION_MAP } from '../recipes.js';
import { GOALS } from '../gameData.js';
import { PARTICLE_NAMES } from '../constants/particles.js';

export const useParticleActions = ({
  particles,
  setParticles,
  selectionInfo,
  setSecondaryParticles,
  setDiscoveredAtoms,
  setDiscoveredMolecules,
  currentGoalIndex,
  setCurrentGoalIndex,
  showMessage,
  setSelectedParticleIds,
}) => {
  const disassembleParticle = useCallback((particleId, particleIndex) => {
    const particle = particles[particleIndex];
    if (!particle) return;

    const ingredients = particle.composition || COMPOSITION_MAP.get(particle.type);
    if (!ingredients) return;

    const compositionArray = Array.isArray(ingredients)
      ? ingredients
      : Object.entries(ingredients).flatMap(([type, count]) => Array(count).fill({ type }));

    if (compositionArray.length === 0) return;

    setParticles(prev => {
      const next = prev.filter(x => x.id !== particleId);
      const newComps = compositionArray.map((c, i) => ({
        id: `${c.type}-${Date.now()}-${i}`,
        type: c.type,
        x: particle.x + Math.cos(i * (2 * Math.PI / compositionArray.length)) * 40,
        y: particle.y + Math.sin(i * (2 * Math.PI / compositionArray.length)) * 40,
        scale: 1,
        composition: c.composition,
      }));
      return [...next, ...newComps];
    });
    showMessage(`Disassembled ${PARTICLE_NAMES[particle.type]}!`);
  }, [particles, showMessage, setParticles]);

  const getElementaryComposition = useCallback((particleType) => {
    const elementaryParticles = [];
    const recurse = (type) => {
      const ingredients = COMPOSITION_MAP.get(type);
      if (!ingredients) {
        elementaryParticles.push({ type });
        return;
      }
      Object.entries(ingredients).forEach(([ingredientType, count]) => {
        for (let i = 0; i < count; i++) {
          recurse(ingredientType);
        }
      });
    };
    recurse(particleType);
    return elementaryParticles;
  }, []);

  const handleAssemble = useCallback(() => {
    if (!selectionInfo.canAssemble) return;

    const { assemblyRecipe, selectedParticles } = selectionInfo;
    const combinedIds = new Set(selectedParticles.map(p => p.id));

    const discoveryUpdaterMap = {
      [PARTICLE_CATEGORIES.SECONDARY]: setSecondaryParticles,
      [PARTICLE_CATEGORIES.ATOM]: setDiscoveredAtoms,
      [PARTICLE_CATEGORIES.MOLECULE]: setDiscoveredMolecules,
    };

    const updater = discoveryUpdaterMap[assemblyRecipe.category];
    if (updater) {
      updater(prev => {
        if (!prev.some(p => p.type === assemblyRecipe.type)) {
          return [...prev, { id: assemblyRecipe.type, type: assemblyRecipe.type }];
        }
        return prev;
      });
    }

    setParticles(prev => {
      const next = prev.filter(p => !combinedIds.has(p.id));
      const centerX = selectedParticles.reduce((s, p) => s + p.x, 0) / selectedParticles.length;
      const centerY = selectedParticles.reduce((s, p) => s + p.y, 0) / selectedParticles.length;
      next.push({
        id: `compound-${Date.now()}`,
        type: assemblyRecipe.type,
        x: centerX,
        y: centerY,
        scale: 1,
        composition: selectedParticles.map(p => ({ type: p.type, composition: p.composition })),
      });
      return next;
    });

    if (currentGoalIndex < GOALS.length && assemblyRecipe.type === GOALS[currentGoalIndex].type) {
      showMessage(`Goal Complete: ${GOALS[currentGoalIndex].name}!`);
      setCurrentGoalIndex(prev => prev + 1);
    } else {
      showMessage(`${PARTICLE_NAMES[assemblyRecipe.type]} formed!`);
    }
    setSelectedParticleIds(new Set());
  }, [selectionInfo, showMessage, currentGoalIndex, setCurrentGoalIndex, setParticles, setSecondaryParticles, setDiscoveredAtoms, setDiscoveredMolecules, setSelectedParticleIds]);

  const handleDisassemble = useCallback(() => {
    if (!selectionInfo.canDisassemble) return;
    const particle = selectionInfo.selectedParticles[0];
    const particleIndex = particles.findIndex(p => p.id === particle.id);
    if (particleIndex !== -1) {
      disassembleParticle(particle.id, particleIndex);
    }
    setSelectedParticleIds(new Set());
  }, [selectionInfo, particles, disassembleParticle, setSelectedParticleIds]);

  const handleRevertToElementary = useCallback(() => {
    if (!selectionInfo.canRevert) return;
    const particle = selectionInfo.selectedParticles[0];

    const elementaryConstituents = getElementaryComposition(particle.type);

    setParticles(prev => {
      const next = prev.filter(p => p.id !== particle.id);
      const newComps = elementaryConstituents.map((c, i) => ({
        id: `${c.type}-${Date.now()}-${i}`,
        type: c.type,
        x: particle.x + Math.cos(i * (2 * Math.PI / elementaryConstituents.length)) * 60,
        y: particle.y + Math.sin(i * (2 * Math.PI / elementaryConstituents.length)) * 60,
        scale: 1,
      }));
      return [...next, ...newComps];
    });

    showMessage(`Reverted ${PARTICLE_NAMES[particle.type]} to elementary particles!`);
    setSelectedParticleIds(new Set());
  }, [selectionInfo, getElementaryComposition, showMessage, setParticles, setSelectedParticleIds]);

  return { handleAssemble, handleDisassemble, handleRevertToElementary };
};