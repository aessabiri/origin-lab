import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import ParticleIcon from './components/ParticleIcon.jsx';
import { PARTICLE_TYPES, PARTICLE_COLORS, PARTICLE_NAMES, PARTICLE_COLOR_MAP } from './constants/particles.js';
import { COMPOUND_PARTICLE_TYPES, MOLECULE_PARTICLE_TYPES } from './recipes.js';
import { GOALS, elementaryParticleGroups } from './gameData.js';
import InfoPanel from './components/InfoPanel.jsx';
import PeriodicTable from './components/PeriodicTable.jsx';
import ActionToolbar from './components/ActionToolbar.jsx';
import { usePersistentState } from './hooks/usePersistentState.js';
import { useParticleActions } from './hooks/useParticleActions.js';
import { useSelection } from './hooks/useSelection.js';
import { MOLECULE_RECIPES } from './components/moleculeRecipes.js';
import { useDecay } from './hooks/useDecay.js';

const LOCAL_STORAGE_KEYS = {
  PARTICLES: 'particle-lab-particles',
  SECONDARY: 'particle-lab-secondary',
  ATOMS: 'particle-lab-atoms',
  MOLECULES: 'particle-lab-molecules',
  BONDS: 'particle-lab-bonds',
  GOAL_INDEX: 'particle-lab-goal-index',
};

const App = () => {
  const [particles, setParticles] = usePersistentState(LOCAL_STORAGE_KEYS.PARTICLES, []);
  const [bonds, setBonds] = usePersistentState(LOCAL_STORAGE_KEYS.BONDS, []);

  const [visualEffects, setVisualEffects] = useState([]);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [infoPanelType, setInfoPanelType] = useState(null);
  const [currentGoalIndex, setCurrentGoalIndex] = usePersistentState(LOCAL_STORAGE_KEYS.GOAL_INDEX, 0);
  const draggedIndexRef = useRef(null);

  const [secondaryParticles, setSecondaryParticles] = usePersistentState(LOCAL_STORAGE_KEYS.SECONDARY, []);
  const [discoveredAtoms, setDiscoveredAtoms] = usePersistentState(LOCAL_STORAGE_KEYS.ATOMS, []);
  const [discoveredMolecules, setDiscoveredMolecules] = usePersistentState(LOCAL_STORAGE_KEYS.MOLECULES, []);

  const canvasRef = useRef(null);

  const [isPeriodicTableVisible, setIsPeriodicTableVisible] = useState(false);
  const {
    selectedParticleIds,
    setSelectedParticleIds,
    selectionBox,
    canvasBind,
    handleParticleClick,
    selectionInfo,
  } = useSelection({ particles, bonds, canvasRef });
  const [message, setMessage] = useState('');

  const showMessage = useCallback((text) => {
    setMessage(text);
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, []);

  // safe initialization: if particles is empty, use safe defaults
  const [springs, api] = useSprings(particles.length, i => ({
    x: particles[i]?.x ?? 0,
    y: particles[i]?.y ?? 0,
    scale: particles[i]?.scale ?? 1,
  }), [particles]);

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

  const {
    handleAssemble,
    handleDisassemble,
    handleRevertToElementary,
  } = useParticleActions({
    particles,
    bonds, // Pass bonds to the hook
    setBonds,
    setParticles,
    selectionInfo,
    setSecondaryParticles,
    setDiscoveredAtoms,
    setDiscoveredMolecules,
    currentGoalIndex,
    setCurrentGoalIndex,
    showMessage,
    setSelectedParticleIds,
  });

  const handleAddBond = useCallback((bondType) => {
    if (selectedParticleIds.size !== 2) return;

    const [particleA_id, particleB_id] = Array.from(selectedParticleIds);

    const newBond = {
      id: `bond-${Date.now()}`,
      type: bondType, // 'single' or 'double'
      particleA_id,
      particleB_id,
    };

    setBonds(prev => [...prev, newBond]);
    setSelectedParticleIds(new Set()); // Deselect particles after creating bond
    showMessage(`Created a ${bondType} bond!`);
  }, [selectedParticleIds, setBonds, showMessage, setSelectedParticleIds]);

  const handleBreakBonds = useCallback(() => {
    if (selectedParticleIds.size === 0) return;

    setBonds(prevBonds => prevBonds.filter(bond =>
      !selectedParticleIds.has(bond.particleA_id) && !selectedParticleIds.has(bond.particleB_id)
    ));

    showMessage('Bonds broken.');
  }, [selectedParticleIds, setBonds, showMessage]);

  const handleRemoveSelected = useCallback(() => {
    if (selectedParticleIds.size === 0) return;
    const count = selectedParticleIds.size;
    setParticles(prev => prev.filter(p => !selectedParticleIds.has(p.id)));
    setSelectedParticleIds(new Set());
    showMessage(`${count} particle(s) removed.`);
  }, [selectedParticleIds, showMessage]);
  
  // When removing particles, also remove any bonds connected to them
  const handleRemoveSelectedWithBonds = useCallback(() => {
    setBonds(prevBonds => prevBonds.filter(bond => !selectedParticleIds.has(bond.particleA_id) && !selectedParticleIds.has(bond.particleB_id)));
    handleRemoveSelected();
  }, [handleRemoveSelected, selectedParticleIds, setBonds]);
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
    setBonds([]);
    setCurrentGoalIndex(0);

    showMessage('Lab has been reset!');
  }, [setParticles, setSecondaryParticles, setDiscoveredAtoms, setDiscoveredMolecules, setCurrentGoalIndex, showMessage]);

  const canBreakBonds = useMemo(() => {
    if (selectedParticleIds.size === 0) return false;
    const selectedIds = Array.from(selectedParticleIds);
    return bonds.some(bond =>
      selectedIds.includes(bond.particleA_id) || selectedIds.includes(bond.particleB_id)
    );
  }, [bonds, selectedParticleIds]);

  const assemblableParticleIds = useMemo(() => {
    const assemblableIds = new Set();
    if (particles.length === 0) {
      return assemblableIds;
    }

    // 1. Build an adjacency list for all particles connected by bonds.
    const adj = new Map();
    particles.forEach(p => adj.set(p.id, []));
    bonds.forEach(b => {
      adj.get(b.particleA_id)?.push(b.particleB_id);
      adj.get(b.particleB_id)?.push(b.particleA_id);
    });

    // 2. Find all connected groups of particles (molecules).
    const visited = new Set();
    for (const particle of particles) {
      if (!visited.has(particle.id)) {
        const group = new Set();
        const queue = [particle.id];
        visited.add(particle.id);

        while (queue.length > 0) {
          const u = queue.shift();
          group.add(u);
          adj.get(u)?.forEach(v => {
            if (!visited.has(v)) {
              visited.add(v);
              queue.push(v);
            }
          });
        }

        // 3. For each group, check if it matches a molecule recipe.
        const groupParticles = particles.filter(p => group.has(p.id));
        const groupBonds = bonds.filter(b => group.has(b.particleA_id) && group.has(b.particleB_id));
        const atomCounts = groupParticles.reduce((acc, p) => ({ ...acc, [p.type]: (acc[p.type] || 0) + 1 }), {});
        const bondCounts = groupBonds.reduce((acc, b) => ({ ...acc, [b.type]: (acc[b.type] || 0) + 1 }), { single: 0, double: 0 });

        const recipeMatch = MOLECULE_RECIPES.find(r => {
          const checkCounts = (recipeObj, countObj) => {
            const recipeKeys = Object.keys(recipeObj);
            const countKeys = Object.keys(countObj);
            if (recipeKeys.length !== countKeys.length) return false;
            // Check that all keys in recipe have matching counts in the user's structure.
            // This is robust against key order.
            return recipeKeys.every(key => recipeObj[key] === (countObj[key] || 0));
          };

          const atomsMatch = checkCounts(r.atoms, atomCounts);
          const bondsMatch = checkCounts(r.bonds, bondCounts);
          return atomsMatch && bondsMatch;
        });

        if (recipeMatch) {
          group.forEach(id => assemblableIds.add(id));
        }
      }
    }
    return assemblableIds;
  }, [particles, bonds]);

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

  useDecay(
    particles,
    setParticles,
    showMessage,
    triggerRadiationBurst
  );

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
            <ActionToolbar
              onAssemble={handleAssemble}
              onDisassemble={handleDisassemble}
              onRevert={handleRevertToElementary}
              onRemoveSelected={handleRemoveSelectedWithBonds}
              onEmptyCanvas={handleEmptyCanvas}
              onBreakBonds={handleBreakBonds}
              onAddSingleBond={() => handleAddBond('single')}
              onAddDoubleBond={() => handleAddBond('double')}
              canAssemble={selectionInfo.canAssemble}
              canDisassemble={selectionInfo.canDisassemble}
              canRevert={selectionInfo.canRevert}
              canBreakBonds={canBreakBonds}
              canAddBond={selectedParticleIds.size === 2}
              canRemove={selectedParticleIds.size > 0}
              canEmpty={particles.length > 0}
            />
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

        {/* --- Bond Rendering Layer (SVG) --- */}
        <animated.svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          {bonds.map(bond => {
            const particleAIndex = particles.findIndex(p => p.id === bond.particleA_id);
            const particleBIndex = particles.findIndex(p => p.id === bond.particleB_id);

            if (particleAIndex === -1 || particleBIndex === -1) {
              return null; // A particle was deleted, don't render the bond
            }

            const particleA = particles[particleAIndex];
            const particleB = particles[particleBIndex];

            const springA = springs[particleAIndex];
            const springB = springs[particleBIndex];

            const centerOffsetA = COMPOUND_PARTICLE_TYPES.has(particleA.type) ? 48 : 32;
            const centerOffsetB = COMPOUND_PARTICLE_TYPES.has(particleB.type) ? 48 : 32;

            return (
              <animated.line
                key={bond.id}
                x1={springA.x.to(x => x + centerOffsetA)}
                y1={springA.y.to(y => y + centerOffsetA)}
                x2={springB.x.to(x => x + centerOffsetB)}
                y2={springB.y.to(y => y + centerOffsetB)}
                stroke="white"
                strokeWidth={bond.type === 'double' ? 6 : 3}
                strokeLinecap="round"
              />
            );
          })}
        </animated.svg>

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
          const isCompound = COMPOUND_PARTICLE_TYPES.has(particle.type) || MOLECULE_PARTICLE_TYPES.has(particle.type);
          const isAssemblable = assemblableParticleIds.has(particle.id);

          const isQuark = particle.type?.endsWith?.('quark');
          const particleSizeClass = isCompound ? 'w-24 h-24 text-xl' : 'w-16 h-16 text-sm';
          const particleColorClass = PARTICLE_COLORS[particle.type] || 'bg-gray-500';

          return (
            <animated.div
              {...bind(i)}
              key={particle.id}
              style={{
                x: props.x,
                y: props.y,
                scale: props.scale,
                zIndex: isSelected ? 10 : 1,
                touchAction: 'none'
              }}
              className={`absolute cursor-grab rounded-full shadow-lg transition-colors duration-300 flex items-center justify-center font-bold text-white ${particleSizeClass} ${particleColorClass} ${isSelected ? 'ring-4 ring-yellow-400' : ''} ${isAssemblable ? 'glow-for-assembly' : ''}`}
              onClick={(e) => handleParticleClick(e, particle.id)}
              onDoubleClick={() => handleShowInfo(particle.type)}
              onMouseEnter={() => api.start(j => (j === i ? { scale: 1.2 } : {}))}
              onMouseLeave={() => api.start(j => (j === i ? { scale: 1 } : {}))}
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
