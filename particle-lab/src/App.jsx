import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import ParticleIcon from './components/ParticleIcon.jsx';
import { PARTICLE_TYPES, PARTICLE_COLORS, PARTICLE_NAMES, PARTICLE_COLOR_MAP } from './constants/particles.js';
import PeriodicTable from './components/PeriodicTable.jsx';

// --- Recipe Data (Inlined) ---

const PARTICLE_CATEGORIES = {
  SECONDARY: 'secondary',
  ATOM: 'atom',
};

const RECIPES = [
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
];

// Create a map for quick lookup of a particle's composition for deconstruction.
const COMPOSITION_MAP = new Map(
  RECIPES.map(recipe => [recipe.type, recipe.ingredients])
);

// --- End of Inlined Data ---

const elementaryParticleGroups = {
  Quarks: [
    { id: 'up-1', type: PARTICLE_TYPES.UP_QUARK },
    { id: 'down-1', type: PARTICLE_TYPES.DOWN_QUARK },
    { id: 'charm-1', type: PARTICLE_TYPES.CHARM_QUARK },
    { id: 'strange-1', type: PARTICLE_TYPES.STRANGE_QUARK },
    { id: 'top-1', type: PARTICLE_TYPES.TOP_QUARK },
    { id: 'bottom-1', type: PARTICLE_TYPES.BOTTOM_QUARK },
  ],
  'Anti-Quarks': [
    { id: 'anti-up-1', type: PARTICLE_TYPES.ANTI_UP_QUARK },
    { id: 'anti-down-1', type: PARTICLE_TYPES.ANTI_DOWN_QUARK },
  ],
  Leptons: [
    { id: 'electron-1', type: PARTICLE_TYPES.ELECTRON },
    { id: 'electron-neutrino-1', type: PARTICLE_TYPES.ELECTRON_NEUTRINO },
  ],
  Bosons: [
    { id: 'photon-1', type: PARTICLE_TYPES.PHOTON },
    { id: 'gluon-1', type: PARTICLE_TYPES.GLUON },
    { id: 'w-boson-1', type: PARTICLE_TYPES.W_BOSON },
    { id: 'z-boson-1', type: PARTICLE_TYPES.Z_BOSON },
  ]
};

const GOALS = [
  { name: 'Synthesize a Proton', type: PARTICLE_TYPES.PROTON },
  { name: 'Synthesize a Neutron', type: PARTICLE_TYPES.NEUTRON },
  { name: 'Synthesize a Pion+', type: PARTICLE_TYPES.PION_PLUS },
  { name: 'Form a Hydrogen Atom', type: PARTICLE_TYPES.HYDROGEN },
  { name: 'Form a Deuterium Atom', type: PARTICLE_TYPES.DEUTERIUM },
  { name: 'Form a Helium Atom', type: PARTICLE_TYPES.HELIUM },
  { name: 'Form a Carbon Atom', type: PARTICLE_TYPES.CARBON },
  { name: 'Form a Nitrogen Atom', type: PARTICLE_TYPES.NITROGEN },
  { name: 'Form an Oxygen Atom', type: PARTICLE_TYPES.OXYGEN },
  { name: 'Form a Neon Atom', type: PARTICLE_TYPES.NEON },
  { name: 'Form a Sodium Atom', type: PARTICLE_TYPES.SODIUM },
  { name: 'Form a Silicon Atom', type: PARTICLE_TYPES.SILICON },
  { name: 'Form an Argon Atom', type: PARTICLE_TYPES.ARGON },
];

const getInitialGoalIndex = () => {
  const savedIndex = localStorage.getItem('particle-lab-goal-index');
  return savedIndex ? parseInt(savedIndex, 10) : 0;
};

const COMPOUND_PARTICLE_TYPES = new Set(RECIPES.map(r => r.type));

const getInitialState = (key, defaultValue) => {
  try {
    const savedItem = localStorage.getItem(key);
    return savedItem ? JSON.parse(savedItem) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

const App = () => {
  const [particles, setParticles] = useState(() => getInitialState('particle-lab-particles', []));

  const [currentGoalIndex, setCurrentGoalIndex] = useState(getInitialGoalIndex);
  const [isPeriodicTableVisible, setIsPeriodicTableVisible] = useState(false);
  const [selectedParticleIds, setSelectedParticleIds] = useState(new Set());
  const draggedIndexRef = useRef(null);

  const [secondaryParticles, setSecondaryParticles] = useState(() => getInitialState('particle-lab-secondary', []));
  const [discoveredAtoms, setDiscoveredAtoms] = useState(() => getInitialState('particle-lab-atoms', []));

  const canvasRef = useRef(null);
  const [message, setMessage] = useState('');

  const showMessage = useCallback((text) => {
    setMessage(text);
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, []);

  const updateParticleScale = useCallback((id, newScale) => {
    setParticles(prev => prev.map(p => p.id === id ? { ...p, scale: newScale } : p));
  }, []);

  // safe initialization: if particles is empty, use safe defaults
  const [springs, api] = useSprings(particles.length, i => ({
    x: particles[i]?.x ?? 0,
    y: particles[i]?.y ?? 0,
    scale: particles[i]?.scale ?? 1,
  }), [particles.length]);

  // Drag binding (use-gesture)
  const bind = useDrag(({ args: [index], active, offset: [ox, oy], tap }) => {
    if (tap) return; // Let onDoubleClick handle taps, not the drag gesture.

    draggedIndexRef.current = active ? index : null;

    api.start(i => {
      if (i === index) {
        return {
          x: ox,
          y: oy,
          scale: active ? 1.1 : 1,
          immediate: active,
        };
      }
    });

    if (!active) {
      setParticles(prev => prev.map((p, i) => i === index ? { ...p, x: ox, y: oy, scale: 1 } : p));

      // Combination logic is now handled by the "Assemble" button
    }
  }, {
    from: ({ args: [index] }) => [springs[index].x.get(), springs[index].y.get()],
    filterTaps: true,
    pointer: { touch: true },
  });

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (!data.type) return;
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasBounds.left - 25;
      const newY = e.clientY - canvasBounds.top - 25;
      const newParticle = {
        id: `${data.type}-${Date.now()}`,
        type: data.type,
        x: newX,
        y: newY,
        scale: 1,
      };
      setParticles(prev => [...prev, newParticle]);
      showMessage(`Added ${PARTICLE_NAMES[data.type]} to the lab!`);
    } catch (err) {
      // ignore invalid drops
      console.error('drop parse failed', err);
    }
  }, [showMessage]);

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDragStart = useCallback((e, particle) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: particle.type }));
    showMessage(`Dragging ${PARTICLE_NAMES[particle.type]}`);
  }, [showMessage]);

  const disassembleParticle = useCallback((particleId, particleIndex) => {
    const particle = particles[particleIndex];
    if (!particle) return;

    // Use the particle's own composition if it exists (from a previous combination),
    // otherwise, look up its recipe for deconstruction.
    const ingredients = particle.composition || COMPOSITION_MAP.get(particle.type);
    if (!ingredients) return;

    // The stored composition is an array, but a recipe is an object.
    // Standardize to an array of particle types.
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
  }, [particles, showMessage]);

  const selectionInfo = useMemo(() => {
    const selectedParticles = particles.filter(p => selectedParticleIds.has(p.id));

    // Disassemble/Revert logic
    const canDisassemble = selectedParticles.length === 1 && COMPOUND_PARTICLE_TYPES.has(selectedParticles[0].type);
    const canRevert = canDisassemble; // Same condition

    // Assemble logic
    let assemblyRecipe = null;
    if (selectedParticles.length > 0 && !canDisassemble) {
      const composition = {};
      selectedParticles.forEach(p => {
        composition[p.type] = (composition[p.type] || 0) + 1;
      });

      for (const recipe of RECIPES) {
        const recipeKeys = Object.keys(recipe.ingredients);
        const compositionKeys = Object.keys(composition);

        if (recipeKeys.length !== compositionKeys.length) continue;

        const isExactMatch = recipeKeys.every(
          type => (composition[type] || 0) === recipe.ingredients[type]
        );

        if (isExactMatch) {
          assemblyRecipe = recipe;
          break;
        }
      }
    }

    return {
      canAssemble: !!assemblyRecipe,
      canDisassemble,
      canRevert,
      assemblyRecipe,
      selectedParticles,
    };
  }, [selectedParticleIds, particles]);

  const handleAssemble = useCallback(() => {
    if (!selectionInfo.canAssemble) return;

    const { assemblyRecipe, selectedParticles } = selectionInfo;
    const combinedIds = new Set(selectedParticles.map(p => p.id));

    if (assemblyRecipe.category === PARTICLE_CATEGORIES.SECONDARY) {
      setSecondaryParticles(prev => {
        if (!prev.some(p => p.type === assemblyRecipe.type)) return [...prev, { id: assemblyRecipe.type, type: assemblyRecipe.type }];
        return prev;
      });
    } else if (assemblyRecipe.category === PARTICLE_CATEGORIES.ATOM) {
      setDiscoveredAtoms(prev => {
        if (!prev.some(p => p.type === assemblyRecipe.type)) return [...prev, { id: assemblyRecipe.type, type: assemblyRecipe.type }];
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

    // Check if the new particle completes the current goal
    if (currentGoalIndex < GOALS.length && assemblyRecipe.type === GOALS[currentGoalIndex].type) {
      showMessage(`Goal Complete: ${GOALS[currentGoalIndex].name}!`);
      setCurrentGoalIndex(prev => prev + 1);
    } else {
    showMessage(`${PARTICLE_NAMES[assemblyRecipe.type]} formed!`);
    }
    setSelectedParticleIds(new Set());
  }, [selectionInfo, showMessage]);

  const handleDisassemble = useCallback(() => {
    if (!selectionInfo.canDisassemble) return;
    const particle = selectionInfo.selectedParticles[0];
    const particleIndex = particles.findIndex(p => p.id === particle.id);
    if (particleIndex !== -1) {
      disassembleParticle(particle.id, particleIndex);
    }
    setSelectedParticleIds(new Set());
  }, [selectionInfo, particles, disassembleParticle]);

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
  }, [selectionInfo, getElementaryComposition, showMessage]);

  const handleReset = useCallback(() => {
    setParticles([]);
    setSecondaryParticles([]);
    setDiscoveredAtoms([]);

    localStorage.removeItem('particle-lab-particles');
    localStorage.removeItem('particle-lab-secondary');
    localStorage.removeItem('particle-lab-atoms');
    localStorage.removeItem('particle-lab-goal-index');

    showMessage('Lab has been reset!');
  }, [showMessage]);

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

  useEffect(() => {
    api.start(i => {
      // If this particle is being dragged, let the gesture handler control it.
      if (i === draggedIndexRef.current) {
        return {}; // Return an empty object to skip updating this spring
      }

      return {
        x: particles[i]?.x ?? 0,
        y: particles[i]?.y ?? 0,
        scale: particles[i]?.scale ?? 1,
        immediate: false,
      };
    });
  }, [particles, api]); // Note: draggedIndexRef is intentionally not in the dependency array

  useEffect(() => {
    try {
      localStorage.setItem('particle-lab-particles', JSON.stringify(particles));
      localStorage.setItem('particle-lab-secondary', JSON.stringify(secondaryParticles));
      localStorage.setItem('particle-lab-atoms', JSON.stringify(discoveredAtoms));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [particles, secondaryParticles, discoveredAtoms]);

  useEffect(() => {
    localStorage.setItem('particle-lab-goal-index', currentGoalIndex.toString());
  }, [currentGoalIndex]);


  return (
    <>
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px -5px var(--glow-color), inset 0 0 10px -5px var(--glow-color); }
        50% { box-shadow: 0 0 30px 0px var(--glow-color), inset 0 0 20px 0px var(--glow-color); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes spring {
        0%, 100% { transform: scale(1); }
        20% { transform: scale(0.9, 1.1); }
        40% { transform: scale(1.1, 0.9); }
        60% { transform: scale(0.95, 1.05); }
        80% { transform: scale(1.05, 0.95); }
      }

      .particle-palette-item {
        perspective: 800px;
      }
      .particle-palette-item .icon-container {
        transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-style: preserve-3d;
      }
      .particle-palette-item:hover .icon-container {
        transform: rotateY(25deg) rotateX(10deg) scale3d(1.1, 1.1, 1.1);
      }
    `}</style>
    <div className="flex flex-col md:flex-row h-screen font-inter bg-gray-900 text-white p-4 gap-4">
      <div
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => setSelectedParticleIds(new Set())}
        className="relative flex-1 bg-gray-800 border-4 border-dashed border-gray-700 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="absolute top-4 left-4 flex items-center gap-8">
          <h1 className="text-3xl font-bold text-white">Particle Lab</h1>
          <div className="flex gap-2">
            <button
              onClick={handleAssemble}
              disabled={!selectionInfo.canAssemble}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >Assemble</button>
            <button
              onClick={handleDisassemble}
              disabled={!selectionInfo.canDisassemble}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >Disassemble</button>
            <button
              onClick={handleRevertToElementary}
              disabled={!selectionInfo.canRevert}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >Revert to Elementary</button>
          </div>
        </div>

        {currentGoalIndex < GOALS.length && (
          <div className="absolute top-20 left-4 bg-gray-900/70 backdrop-blur-sm p-3 rounded-lg border border-gray-600 shadow-lg">
            <p className="text-sm text-gray-400 font-semibold">Current Goal:</p>
            <p className="text-lg text-amber-300 font-bold">{GOALS[currentGoalIndex].name}</p>
          </div>
        )}
        {currentGoalIndex >= GOALS.length && (
          <div className="absolute top-20 left-4 bg-green-900/70 backdrop-blur-sm p-3 rounded-lg border border-green-600 shadow-lg">
            <p className="text-lg text-green-300 font-bold">All goals completed! Sandbox mode unlocked.</p>
          </div>
        )}
        <div
          className="absolute top-4 right-4 z-10 p-2 bg-gray-700 rounded-lg shadow-md transition-opacity duration-300"
          style={{ opacity: message ? 1 : 0 }}
        >
          <p className="text-sm font-semibold text-white">{message}</p>
        </div>

        {!isPeriodicTableVisible && (
          <button
            onClick={() => setIsPeriodicTableVisible(true)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-10"
          >
            Show Periodic Table
          </button>
        )}

        <PeriodicTable
          isVisible={isPeriodicTableVisible}
          onClose={() => setIsPeriodicTableVisible(false)}
          discoveredParticles={[...secondaryParticles, ...discoveredAtoms]}
          onDragStart={handleDragStart}
        />

        {springs.map((props, i) => {
          const particle = particles[i];
          if (!particle) return null;

          const isSelected = selectedParticleIds.has(particle.id);
          const isCompound = COMPOUND_PARTICLE_TYPES.has(particle.type);

          const isQuark = particle.type?.endsWith?.('quark');
          const particleSizeClass = isCompound ? 'w-24 h-24 text-xl' : 'w-16 h-16 text-sm';
          const particleColorClass = PARTICLE_COLORS[particle.type] || 'bg-gray-400';

          return (
            <animated.div
              {...bind(i)}
              key={particle.id}
              style={{
                x: props.x,
                y: props.y,
                scale: props.scale,
                touchAction: 'none'
              }}
              className={`absolute cursor-grab rounded-full shadow-lg transition-colors duration-300 flex items-center justify-center font-bold text-white ${particleSizeClass} ${particleColorClass} ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
              onClick={(e) => handleParticleClick(e, particle.id)}
              onMouseEnter={() => updateParticleScale(particle.id, 1.2)}
              onMouseLeave={() => updateParticleScale(particle.id, 1)}
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="w-full h-full">
                  <ParticleIcon type={particle.type} color={particleColorClass} isCompound={isCompound} />
                </div>
                <span className="text-white text-center p-1 absolute bottom-2">
                  {PARTICLE_NAMES[particle.type]}
                </span>
              </div>
            </animated.div>
          );
        })}
      </div>

      <div className="flex flex-col w-full md:w-80 bg-gray-800 rounded-2xl p-4 shadow-xl overflow-y-auto">
        {Object.entries(elementaryParticleGroups).map(([groupName, particles]) => (
          <div key={groupName} className="mb-6">
            <h3 className="text-lg font-bold text-amber-300 mb-3 text-center border-b-2 border-gray-700 pb-2">{groupName}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {particles.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, p)}
                  className="particle-palette-item cursor-grab group flex flex-col items-center"
                >
                  <div className="icon-container relative flex items-center justify-center w-20 h-20">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        '--glow-color': PARTICLE_COLOR_MAP[PARTICLE_COLORS[p.type]?.replace('bg-', '')] || '#9ca3af',
                        animation: `${p.type.includes('boson') || p.type.includes('photon') ? 'pulse-glow 2s infinite ease-in-out' : 'none'}`
                      }}
                    />
                    <div className="w-full h-full" style={{ animation: `${p.type.includes('quark') ? 'float 4s infinite ease-in-out' : ''} ${p.type === PARTICLE_TYPES.GLUON ? 'spring 1s infinite linear' : ''}` }}>
                      <ParticleIcon type={p.type} color={PARTICLE_COLORS[p.type]} />
                    </div>
                  </div>
                  <p className="text-center text-sm font-semibold mt-1 text-gray-300 group-hover:text-white transition-colors">{PARTICLE_NAMES[p.type]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleReset}
          className="w-full mt-auto pt-4 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold transition-colors"
        >
          Reset Lab
        </button>
      </div>
    </div>
    </>
  );
};

export default App;
