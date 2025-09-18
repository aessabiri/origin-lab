import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import ParticleIcon from './components/ParticleIcon.jsx';
import { PARTICLE_TYPES, PARTICLE_COLORS, PARTICLE_NAMES, PARTICLE_COLOR_MAP } from './constants/particles.js';
import InfoPanel from './components/InfoPanel.jsx';
import PeriodicTable from './components/PeriodicTable.jsx';

// --- Recipe Data (Inlined) ---

const PARTICLE_CATEGORIES = {
  SECONDARY: 'secondary',
  ATOM: 'atom',
  MOLECULE: 'molecule',
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
  'Anti-Leptons': [
    { id: 'e-antineutrino-1', type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO },
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
  { name: 'Induce Neutron Decay', type: PARTICLE_TYPES.DECAYING_NEUTRON },
  { name: 'Create an Excited Electron', type: PARTICLE_TYPES.EXCITED_ELECTRON },
  { name: 'Synthesize a Water Molecule', type: PARTICLE_TYPES.WATER },
  { name: 'Synthesize a Methane Molecule', type: PARTICLE_TYPES.METHANE },
  { name: 'Synthesize an Ammonia Molecule', type: PARTICLE_TYPES.AMMONIA },
  { name: 'Synthesize Carbon Dioxide', type: PARTICLE_TYPES.CARBON_DIOXIDE },
  { name: 'Synthesize Salt (NaCl)', type: PARTICLE_TYPES.SODIUM_CHLORIDE },
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

  const [visualEffects, setVisualEffects] = useState([]);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [infoPanelType, setInfoPanelType] = useState(null);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0, visible: false });
  const [currentGoalIndex, setCurrentGoalIndex] = useState(getInitialGoalIndex);
  const [isPeriodicTableVisible, setIsPeriodicTableVisible] = useState(false);
  const [selectedParticleIds, setSelectedParticleIds] = useState(new Set());
  const draggedIndexRef = useRef(null);

  const [secondaryParticles, setSecondaryParticles] = useState(() => getInitialState('particle-lab-secondary', []));
  const [discoveredAtoms, setDiscoveredAtoms] = useState(() => getInitialState('particle-lab-atoms', []));
  const [discoveredMolecules, setDiscoveredMolecules] = useState(() => getInitialState('particle-lab-molecules', []));

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
    } else if (assemblyRecipe.category === PARTICLE_CATEGORIES.MOLECULE) {
      setDiscoveredMolecules(prev => {
        if (!prev.some(p => p.type === assemblyRecipe.type)) return [...prev, { id: assemblyRecipe.type, type: assemblyRecipe.type }];
        return prev;
      });
    } else if (assemblyRecipe.category === PARTICLE_CATEGORIES.MOLECULE) {
      setDiscoveredMolecules(prev => {
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
  }, [selectionInfo, showMessage, currentGoalIndex]);

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

  const handleRemoveSelected = useCallback(() => {
    if (selectedParticleIds.size === 0) return;
    const count = selectedParticleIds.size;
    setParticles(prev => prev.filter(p => !selectedParticleIds.has(p.id)));
    setSelectedParticleIds(new Set());
    showMessage(`${count} particle(s) removed.`);
  }, [selectedParticleIds, showMessage]);

  const handleEmptyCanvas = useCallback(() => {
    if (particles.length === 0) return;
    setParticles([]);
    setSelectedParticleIds(new Set());
    showMessage('Canvas cleared.');
  }, [particles.length, showMessage]);

  const handleReset = useCallback(() => {
    setParticles([]);
    setSecondaryParticles([]);
    setDiscoveredAtoms([]);
    setDiscoveredMolecules([]);

    localStorage.removeItem('particle-lab-particles');
    localStorage.removeItem('particle-lab-secondary');
    localStorage.removeItem('particle-lab-atoms');
    localStorage.removeItem('particle-lab-goal-index');
    localStorage.removeItem('particle-lab-molecules');

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

  const handleShowInfo = useCallback((type) => setInfoPanelType(type), []);
  const handleCloseInfo = useCallback(() => setInfoPanelType(null), []);

  const triggerRadiationBurst = useCallback((x, y) => {
    const newEffects = Array.from({ length: 7 }).map((_, i) => ({
      id: `fx-${i}-${Date.now()}`,
      x: x + 48, // center of particle
      y: y + 48,
    }));
    setVisualEffects(prev => [...prev, ...newEffects]);
    newEffects.forEach(fx => {
      setTimeout(() => {
        setVisualEffects(prev => prev.filter(effect => effect.id !== fx.id));
      }, 700); // Animation duration
    });
  }, []);

  const decayTimeouts = useRef([]);
  useEffect(() => {
    // Clear previous timeouts on each render to avoid memory leaks
    decayTimeouts.current.forEach(clearTimeout);
    decayTimeouts.current = [];

    particles.forEach(p => {
      if (p.type === PARTICLE_TYPES.EXCITED_ELECTRON) {
        const timeoutId = setTimeout(() => {
          setParticles(prev => {
            const particleToDecay = prev.find(part => part.id === p.id);
            if (!particleToDecay) return prev;

            const otherParticles = prev.filter(part => part.id !== p.id);
            const newElectron = { ...particleToDecay, type: PARTICLE_TYPES.ELECTRON, id: `electron-${Date.now()}` };
            const newPhoton = {
              id: `photon-${Date.now()}`,
              type: PARTICLE_TYPES.PHOTON,
              x: particleToDecay.x + 50,
              y: particleToDecay.y - 50,
              scale: 1,
            };
            return [...otherParticles, newElectron, newPhoton];
          });
          triggerRadiationBurst(p.x, p.y);
          showMessage('Excited Electron decayed!');
        }, 3000); // 3-second lifetime
        decayTimeouts.current.push(timeoutId);
      }
    });

    return () => decayTimeouts.current.forEach(clearTimeout);
  }, [particles, showMessage, triggerRadiationBurst]);

  useEffect(() => {
    particles.forEach(p => {
      if (p.type === PARTICLE_TYPES.DECAYING_NEUTRON) {
        const timeoutId = setTimeout(() => {
          setParticles(prev => {
            const particleToDecay = prev.find(part => part.id === p.id);
            if (!particleToDecay) return prev;

            const otherParticles = prev.filter(part => part.id !== p.id);
            const newProton = { ...particleToDecay, type: PARTICLE_TYPES.PROTON, id: `proton-${Date.now()}` };
            const newElectron = { id: `electron-${Date.now()}`, type: PARTICLE_TYPES.ELECTRON, x: particleToDecay.x + 50, y: particleToDecay.y + 50, scale: 1 };
            const newAntiNeutrino = { id: `e-antineutrino-${Date.now()}`, type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, x: particleToDecay.x - 50, y: particleToDecay.y - 50, scale: 1 };

            return [...otherParticles, newProton, newElectron, newAntiNeutrino];
          });
          triggerRadiationBurst(p.x, p.y);
          showMessage('Beta Decay! Neutron became a Proton.');
        }, 4000); // 4-second lifetime
        decayTimeouts.current.push(timeoutId);
      }
    });
  }, [particles, showMessage, triggerRadiationBurst]);

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
      localStorage.setItem('particle-lab-molecules', JSON.stringify(discoveredMolecules));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [particles, secondaryParticles, discoveredAtoms, discoveredMolecules]);

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
      @keyframes shake {
        0%, 100% { transform: translate(0, 0) rotate(0); }
        25% { transform: translate(2px, -1px) rotate(1deg); }
        50% { transform: translate(-2px, 1px) rotate(-1deg); }
        75% { transform: translate(1px, 2px) rotate(0.5deg); }
      }
      @keyframes jiggle {
        0%, 100% { transform: translate(0, 0) rotate(0); }
        10% { transform: translate(-1px, -2px) rotate(-2deg); }
        20% { transform: translate(-3px, 0px) rotate(3deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(2deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-2deg); }
        80% { transform: translate(-1px, -1px) rotate(3deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
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
      @keyframes fade-out-and-disperse {
        from {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        to {
          transform: translate(calc(-50% + (var(--i) - 0.5) * 120px), calc(-50% + (var(--j) - 0.5) * 120px)) scale(0);
          opacity: 0;
        }
      }
      .radiation-particle {
        position: absolute;
        width: 8px; height: 8px;
        background: radial-gradient(circle, #fff, #60a5fa);
        border-radius: 50%; box-shadow: 0 0 10px #60a5fa; pointer-events: none;
        animation: fade-out-and-disperse 0.7s ease-out forwards;
      }
    `}</style>
    <div className="flex flex-col md:flex-row h-screen font-inter bg-gray-900 text-white p-4 gap-4">
      <div
        {...canvasBind()}
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative flex-1 bg-gray-800 border-4 border-dashed border-gray-700 rounded-2xl shadow-xl overflow-hidden touch-none"
      >
        <div className="absolute top-4 left-4 flex flex-col items-start gap-4">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold text-white">Particle Lab</h1>
            <div className="flex items-center flex-wrap gap-2 bg-gray-900/50 p-2 rounded-xl border border-gray-700">
              {/* Transformation Group */}
              <button
                onClick={handleAssemble}
                disabled={!selectionInfo.canAssemble}
                className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-green-500 to-green-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Assemble</button>
              <button
                onClick={handleDisassemble}
                disabled={!selectionInfo.canDisassemble}
                className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v2a1 1 0 002 0V4zm11 1a1 1 0 100-2h-2a1 1 0 100 2h2zm-4 0a1 1 0 100-2h-2a1 1 0 100 2h2zM9 9a1 1 0 100-2H7a1 1 0 100 2h2zm4-1a1 1 0 10-2 0v2a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
                Disassemble</button>
              <button
                onClick={handleRevertToElementary}
                disabled={!selectionInfo.canRevert}
                className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-red-500 to-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                Revert</button>

              {/* Separator */}
              <div className="h-6 w-px bg-gray-600 mx-2"></div>

              {/* Deletion Group */}
              <button
                onClick={handleRemoveSelected}
                disabled={selectedParticleIds.size === 0}
                className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-orange-500 to-orange-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Remove</button>
              <button
                onClick={handleEmptyCanvas}
                disabled={particles.length === 0}
                className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-gray-600 to-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Empty Canvas</button>
            </div>
          </div>
          {currentGoalIndex < GOALS.length && (
            <div className="bg-gray-900/70 backdrop-blur-sm p-3 rounded-lg border border-gray-600 shadow-lg">
              <p className="text-sm text-gray-400 font-semibold">Current Goal:</p>
              <p className="text-lg text-amber-300 font-bold">{GOALS[currentGoalIndex].name}</p>
            </div>
          )}
          {currentGoalIndex >= GOALS.length && (
            <div className="bg-green-900/70 backdrop-blur-sm p-3 rounded-lg border border-green-600 shadow-lg">
              <p className="text-lg text-green-300 font-bold">All goals completed! Sandbox mode unlocked.</p>
            </div>
          )}
        </div>
        <div
          className="absolute top-4 right-4 z-10 p-2 bg-gray-700 rounded-lg shadow-md transition-opacity duration-300"
          style={{ opacity: message ? 1 : 0 }}
        >
          <p className="text-sm font-semibold text-white">{message}</p>
        </div>

        {visualEffects.map(fx => (
          <div
            key={fx.id}
            className="radiation-particle"
            style={{
              left: fx.x,
              top: fx.y,
              '--i': Math.random(),
              '--j': Math.random(),
            }}
          />
        ))}

        <div className="absolute bottom-4 left-4 z-10">
          {isHintVisible && currentGoalIndex < GOALS.length && (() => {
            const currentGoal = GOALS[currentGoalIndex];
            const hintRecipe = RECIPES.find(r => r.type === currentGoal.type);
            if (!hintRecipe) return null;

            return (
              <div className="absolute bottom-full mb-2 w-64 bg-gray-900/80 backdrop-blur-md p-4 rounded-lg shadow-xl border border-gray-700">
                <h4 className="font-bold text-amber-300 mb-2">Recipe for {PARTICLE_NAMES[currentGoal.type]}</h4>
                <ul>
                  {Object.entries(hintRecipe.ingredients).map(([type, count]) => (
                    <li key={type} className="flex justify-between text-gray-300">
                      <span>{PARTICLE_NAMES[type]}</span>
                      <span className="font-mono font-bold">x {count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
          <button
            onClick={() => setIsHintVisible(prev => !prev)}
            className="p-3 text-yellow-300 bg-gray-700 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400"
            aria-label="Show hint"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </button>
        </div>

        {selectionBox.visible && (
          <div
            className="absolute bg-blue-500/20 border-2 border-blue-400 pointer-events-none"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: selectionBox.width,
              height: selectionBox.height,
            }}
          />
        )}

        {!isPeriodicTableVisible && (
          <button
            onClick={() => setIsPeriodicTableVisible(true)}
            className="absolute bottom-4 right-4 px-4 py-2 text-white font-semibold rounded-lg shadow-xl bg-gradient-to-br from-blue-500 to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 z-10"
          >
            Show Periodic Table
          </button>
        )}

        <InfoPanel particleType={infoPanelType} onClose={handleCloseInfo} />

        <PeriodicTable
          isVisible={isPeriodicTableVisible}
          onClose={() => setIsPeriodicTableVisible(false)}
          discoveredParticles={[...secondaryParticles, ...discoveredAtoms]}
          onDragStart={handleDragStart}
          onParticleClick={handleShowInfo}
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
              onDoubleClick={() => handleShowInfo(particle.type)}
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

        <div className="mb-6">
          <h3 className="text-lg font-bold text-amber-300 mb-3 text-center border-b-2 border-gray-700 pb-2">Discovered Molecules</h3>
          <div className="flex flex-wrap justify-center gap-4 min-h-[96px]">
            {discoveredMolecules.length > 0 ? (
              discoveredMolecules.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, p)}
                  className="particle-palette-item cursor-grab group flex flex-col items-center"
                >
                  <div className="icon-container relative flex items-center justify-center w-20 h-20">
                    <div className="w-full h-full">
                      <ParticleIcon type={p.type} color={PARTICLE_COLORS[p.type]} isCompound />
                    </div>
                  </div>
                  <p className="text-center text-sm font-semibold mt-1 text-gray-300 group-hover:text-white transition-colors">{PARTICLE_NAMES[p.type]}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center w-full my-auto text-sm">Combine atoms to form molecules.</p>
            )}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full mt-auto text-center px-4 py-3 text-white font-bold rounded-lg shadow-xl bg-gradient-to-br from-indigo-500 to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Reset Lab
        </button>
      </div>
    </div>
    </>
  );
};

export default App;
