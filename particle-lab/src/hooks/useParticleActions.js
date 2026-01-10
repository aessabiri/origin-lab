import { useCallback } from 'react';
import { PARTICLE_CATEGORIES, COMPOSITION_MAP } from '../recipes.js';
import { MOLECULE_RECIPES } from '../constants/moleculeRecipes.js';
import { POLYPEPTIDE_RECIPES } from '../constants/polypeptideRecipes.js';
import { PARTICLE_NAMES } from '../constants/particles.js';
import { useStore } from '../store.js';

export const useParticleActions = ({
  selectionInfo,
  goals,
  setSelectedParticleIds,
}) => {
  const particles = useStore(state => state.particles);
  const setParticles = useStore(state => state.setParticles);
  const setBonds = useStore(state => state.setBonds);
  const setSecondaryParticles = useStore(state => state.setSecondaryParticles);
  const setDiscoveredAtoms = useStore(state => state.setDiscoveredAtoms);
  const setDiscoveredMolecules = useStore(state => state.setDiscoveredMolecules);
  const currentGoalIndex = useStore(state => state.currentGoalIndex);
  const setCurrentGoalIndex = useStore(state => state.setCurrentGoalIndex);
  const showMessage = useStore(state => state.showMessage);

  const disassembleParticle = useCallback((particleId, particleIndex) => {
    const particle = particles[particleIndex];
    if (!particle) return;

    const moleculeRecipe = MOLECULE_RECIPES.find(r => r.type === particle.type);
    const polypeptideRecipe = POLYPEPTIDE_RECIPES.find(r => r.type === particle.type);
    if (moleculeRecipe) {
      const newAtoms = [];
      Object.entries(moleculeRecipe.atoms).forEach(([atomType, count]) => {
        for (let i = 0; i < count; i++) {
          newAtoms.push({
            id: `${atomType}-${Date.now()}-${i}`,
            type: atomType,
            x: particle.x + (Math.random() - 0.5) * 100,
            y: particle.y + (Math.random() - 0.5) * 100,
            scale: 1,
          });
        }
      });

      setParticles([...particles.filter(p => p.id !== particleId), ...newAtoms]);
      setBonds([]);
      showMessage(`Disassembled ${PARTICLE_NAMES[particle.type]}!`);
      return;
    }

    if (polypeptideRecipe) {
      const newMolecules = [];
      Object.entries(polypeptideRecipe.molecules).forEach(([moleculeType, count]) => {
        for (let i = 0; i < count; i++) {
          newMolecules.push({
            id: `${moleculeType}-${Date.now()}-${i}`,
            type: moleculeType,
            x: particle.x + (Math.random() - 0.5) * 100,
            y: particle.y + (Math.random() - 0.5) * 100,
            scale: 1,
          });
        }
      });
      setParticles([...particles.filter(p => p.id !== particleId), ...newMolecules]);
      setBonds([]);
      showMessage(`Disassembled ${PARTICLE_NAMES[particle.type]}!`);
      return;
    }

    const ingredients = particle.composition || COMPOSITION_MAP.get(particle.type);
    if (!ingredients) return;

    const compositionArray = Array.isArray(ingredients)
      ? ingredients
      : Object.entries(ingredients).flatMap(([type, count]) => Array(count).fill({ type }));

    if (compositionArray.length === 0) return;

    const next = particles.filter(x => x.id !== particleId);
    const newComps = compositionArray.map((c, i) => ({
      id: `${c.type}-${Date.now()}-${i}`,
      type: c.type,
      x: particle.x + Math.cos(i * (2 * Math.PI / compositionArray.length)) * 40,
      y: particle.y + Math.sin(i * (2 * Math.PI / compositionArray.length)) * 40,
      scale: 1,
      composition: c.composition,
    }));
    setParticles([...next, ...newComps]);
    showMessage(`Disassembled ${PARTICLE_NAMES[particle.type]}!`);
  }, [particles, showMessage, setParticles, setBonds]);

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

    const { assemblyRecipe, selectedParticles, isMoleculeAssembly, isPolypeptideAssembly } = selectionInfo;
    const combinedIds = new Set(selectedParticles.map(p => p.id));

    if (isMoleculeAssembly || isPolypeptideAssembly) {
      const discoveredMolecules = useStore.getState().discoveredMolecules;
      if (!discoveredMolecules.some(m => m.type === assemblyRecipe.type)) {
        setDiscoveredMolecules([...discoveredMolecules, { id: assemblyRecipe.type, type: assemblyRecipe.type, discoveredAt: Date.now() }]);
      }

      const centerX = selectedParticles.reduce((sum, p) => sum + p.x, 0) / selectedParticles.length;
      const centerY = selectedParticles.reduce((sum, p) => sum + p.y, 0) / selectedParticles.length;

      const newMolecule = {
        id: `${assemblyRecipe.type}-${Date.now()}`,
        type: assemblyRecipe.type,
        x: centerX,
        y: centerY,
        scale: 1,
      };

      setParticles([...particles.filter(p => !combinedIds.has(p.id)), newMolecule]);
      const bonds = useStore.getState().bonds;
      setBonds(bonds.filter(b => !combinedIds.has(b.particleA_id) && !combinedIds.has(b.particleB_id)));

      if (goals && currentGoalIndex < goals.length && assemblyRecipe.type === goals[currentGoalIndex].type) {
        showMessage(`Goal Complete: Discover ${PARTICLE_NAMES[assemblyRecipe.type]}!`);
        setCurrentGoalIndex(currentGoalIndex + 1);
      } else {
        showMessage(`Success! You've created ${PARTICLE_NAMES[assemblyRecipe.type]}.`);
      }

      setSelectedParticleIds(new Set());
      return;
    }

    const discoveryUpdaterMap = {
      [PARTICLE_CATEGORIES.SECONDARY]: setSecondaryParticles,
      [PARTICLE_CATEGORIES.ATOM]: setDiscoveredAtoms,
      [PARTICLE_CATEGORIES.MOLECULE]: setDiscoveredMolecules,
    };

    const discoveryStateKeyMap = {
      [PARTICLE_CATEGORIES.SECONDARY]: 'secondaryParticles',
      [PARTICLE_CATEGORIES.ATOM]: 'discoveredAtoms',
      [PARTICLE_CATEGORIES.MOLECULE]: 'discoveredMolecules',
    };

    const updater = discoveryUpdaterMap[assemblyRecipe.category];
    if (updater) {
      const stateKey = discoveryStateKeyMap[assemblyRecipe.category];
      const currentDiscovered = useStore.getState()[stateKey];
      if (currentDiscovered && !currentDiscovered.some(p => p.type === assemblyRecipe.type)) {
        updater([...currentDiscovered, { id: assemblyRecipe.type, type: assemblyRecipe.type, discoveredAt: Date.now() }]);
      }
    }

    const next = particles.filter(p => !combinedIds.has(p.id));
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
    setParticles(next);

    if (goals && currentGoalIndex < goals.length && assemblyRecipe.type === goals[currentGoalIndex].type) {
      showMessage(`Goal Complete: ${goals[currentGoalIndex].name}!`);
      setCurrentGoalIndex(currentGoalIndex + 1);
    } else {
      showMessage(`${PARTICLE_NAMES[assemblyRecipe.type]} formed!`);
    }
    setSelectedParticleIds(new Set());
  }, [selectionInfo, showMessage, currentGoalIndex, setCurrentGoalIndex, setParticles, setSecondaryParticles, setDiscoveredAtoms, setDiscoveredMolecules, setSelectedParticleIds, particles, setBonds, goals]);

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

    const next = particles.filter(p => p.id !== particle.id);
    const newComps = elementaryConstituents.map((c, i) => ({
      id: `${c.type}-${Date.now()}-${i}`,
      type: c.type,
      x: particle.x + Math.cos(i * (2 * Math.PI / elementaryConstituents.length)) * 60,
      y: particle.y + Math.sin(i * (2 * Math.PI / elementaryConstituents.length)) * 60,
      scale: 1,
    }));
    setParticles([...next, ...newComps]);

    showMessage(`Reverted ${PARTICLE_NAMES[particle.type]} to elementary particles!`);
    setSelectedParticleIds(new Set());
  }, [selectionInfo, getElementaryComposition, showMessage, setParticles, setSelectedParticleIds]);

  return { handleAssemble, handleDisassemble, handleRevertToElementary };
};