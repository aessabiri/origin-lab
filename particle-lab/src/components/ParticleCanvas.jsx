import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import ParticleIcon from './ParticleIcon.jsx';
import { PARTICLE_TYPES, PARTICLE_COLORS, PARTICLE_NAMES, CODEX_PARTICLES_BY_CATEGORY, PARTICLE_INFO, elementaryParticleGroups } from '../constants/particles.js';
import { COMPOUND_PARTICLE_TYPES } from '../recipes.js';
import PeriodicTable from './PeriodicTable.jsx';
import ActionToolbar from './ActionToolbar.jsx';
import ActionMenu from './ActionMenu.jsx';
import Codex from './Codex.jsx';
import { useParticleActions } from '../hooks/useParticleActions.js';
import { useSelection } from '../hooks/useSelection.js';
import { MOLECULE_RECIPES } from '../constants/moleculeRecipes.js';
import { GOAL_PATHS } from '../constants/goalPaths.js';
import { RECIPES, PARTICLE_CATEGORIES } from '../recipes.js';
import { useDecay } from '../hooks/useDecay.js';
import { useStore } from '../store.js';

const MOLECULE_PARTICLE_TYPES = new Set(
  MOLECULE_RECIPES.map(r => r.type)
);

const ParticleCanvas = ({ onDragStart }) => {
  const {
    particles, setParticles,
    bonds, setBonds,
    secondaryParticles,
    discoveredAtoms,
    discoveredMolecules,
    currentGoalIndex,
    uiScale, setUiScale,
    isPeriodicTablePinned, setIsPeriodicTablePinned,
    goalPath,
    isSandboxMode,
    isPaletteVisible, setIsPaletteVisible,
    isCodexVisible, setIsCodexVisible,
    isHintVisible,
    isActionMenuVisible, setIsActionMenuVisible,
    isSettingsVisible, setIsSettingsVisible,
    isResetConfirmVisible, setIsResetConfirmVisible,
    isPeriodicTableVisible, setIsPeriodicTableVisible,
    message, showMessage,
    openExclusive,
    handleReset, executeReset,
    handleSetGoalPath, handleToggleSandbox,
    handleEmptyCanvas,
    setInfoPanelType,
    setCurrentGoalIndex
  } = useStore();

  const [visualEffects, setVisualEffects] = useState([]);
  const draggedIndexRef = useRef(null);
  const canvasRef = useRef(null);
  const goals = useMemo(() => GOAL_PATHS[goalPath] || GOAL_PATHS.medium, [goalPath]);

  const allDiscoveredParticles = useMemo(() => {
    if (isSandboxMode) {
      return Object.keys(PARTICLE_INFO).map(type => ({ type }));
    } else {
      const elementary = Object.values(elementaryParticleGroups).flat().map(p => ({ type: p.type }));
      return [...elementary, ...secondaryParticles, ...discoveredAtoms, ...discoveredMolecules];
    }
  }, [isSandboxMode, secondaryParticles, discoveredAtoms, discoveredMolecules]);

  const discoveredParticlesForPeriodicTable = useMemo(() => {
    if (isSandboxMode) {
      return Object.values(PARTICLE_TYPES)
        .filter(type => RECIPES.some(r => r.type === type && (r.category === PARTICLE_CATEGORIES.ATOM || r.category === PARTICLE_CATEGORIES.SECONDARY)))
        .map(type => ({ type }));
    } else {
      return [...secondaryParticles, ...discoveredAtoms];
    }
  }, [isSandboxMode, secondaryParticles, discoveredAtoms]);

  const allPossibleParticles = useMemo(() => CODEX_PARTICLES_BY_CATEGORY, []);

  const {
    selectedParticleIds,
    setSelectedParticleIds,
    selectionBox,
    canvasBind,
    handleParticleClick,
    selectionInfo,
  } = useSelection({ canvasRef });
  
  const [springs, api] = useSprings(particles.length, i => ({
    x: particles[i]?.x ?? 0,
    y: particles[i]?.y ?? 0,
    scale: particles[i]?.scale ?? 1,
  }), [particles]);

  const bind = useDrag(({ args: [index], active, offset: [ox, oy], tap }) => {
    if (tap) return;

    draggedIndexRef.current = active ? index : null;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const particle = particles[index];
    const baseSize = PARTICLE_INFO[particle.type]?.size || 64;
    const particleSize = baseSize * uiScale;

    const clampedX = Math.max(0, Math.min(ox, canvasBounds.width - particleSize));
    const clampedY = Math.max(0, Math.min(oy, canvasBounds.height - particleSize));

    api.start(i => {
      if (i === index) {
        return {
          x: clampedX,
          y: clampedY,
          scale: active ? 1.1 : 1,
          immediate: active,
        };
      }
    });

    if (!active) {
      setParticles(particles.map((p, i) => i === index ? { ...p, x: clampedX, y: clampedY, scale: 1 } : p));
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
      setParticles([...particles, newParticle]);
      showMessage(`Added ${PARTICLE_NAMES[data.type]} to the lab!`);
    } catch (err) {
      console.error('drop parse failed', err);
    }
  }, [particles, setParticles, showMessage]);

  const handleDragOver = (e) => { e.preventDefault(); };

  const {
    handleAssemble,
    handleDisassemble,
    handleRevertToElementary,
  } = useParticleActions({
    selectionInfo,
    goals,
    setSelectedParticleIds,
  });

  const handleAddBond = useCallback((bondType) => {
    if (selectedParticleIds.size !== 2) return;

    const [particleA_id, particleB_id] = Array.from(selectedParticleIds);

    const newBond = {
      id: `bond-${Date.now()}`,
      type: bondType,
      particleA_id,
      particleB_id,
    };

    setBonds([...bonds, newBond]);
    setSelectedParticleIds(new Set());
    showMessage(`Created a ${bondType} bond!`);
  }, [selectedParticleIds, bonds, setBonds, showMessage, setSelectedParticleIds]);

  const handleAddPeptideBond = useCallback(() => {
    if (selectedParticleIds.size !== 2) return;

    const [particleA_id, particleB_id] = Array.from(selectedParticleIds);

    const newBond = {
      id: `bond-${Date.now()}`,
      type: 'peptide',
      particleA_id,
      particleB_id,
    };

    setBonds([...bonds, newBond]);
    setSelectedParticleIds(new Set());
    showMessage('Peptide bond formed!');
  }, [selectedParticleIds, bonds, setBonds, showMessage, setSelectedParticleIds]);

  const handleBreakBonds = useCallback(() => {
    if (selectedParticleIds.size === 0) return;

    setBonds(bonds.filter(bond =>
      !selectedParticleIds.has(bond.particleA_id) && !selectedParticleIds.has(bond.particleB_id)
    ));

    showMessage('Bonds broken.');
  }, [selectedParticleIds, bonds, setBonds, showMessage]);

  const handleRemoveSelected = useCallback(() => {
    if (selectedParticleIds.size === 0) return;
    const count = selectedParticleIds.size;
    setParticles(particles.filter(p => !selectedParticleIds.has(p.id)))
    setSelectedParticleIds(new Set());
    showMessage(`${count} particle(s) removed.`);
  }, [selectedParticleIds, particles, setParticles, showMessage, setSelectedParticleIds]);
  
  const handleRemoveSelectedWithBonds = useCallback(() => {
    setBonds(bonds.filter(bond => !selectedParticleIds.has(bond.particleA_id) && !selectedParticleIds.has(bond.particleB_id)));
    handleRemoveSelected();
  }, [handleRemoveSelected, selectedParticleIds, bonds, setBonds]);

  const canBreakBonds = useMemo(() => {
    if (selectedParticleIds.size === 0) return false;
    const selectedIds = Array.from(selectedParticleIds);
    return bonds.some(bond =>
      selectedIds.includes(bond.particleA_id) || selectedIds.includes(bond.particleB_id)
    );
  }, [bonds, selectedParticleIds]);

  const canAddPeptideBond = useMemo(() => {
    if (selectedParticleIds.size !== 2) return false;
    const selected = particles.filter(p => selectedParticleIds.has(p.id));
    const aminoAcidTypes = new Set([
      PARTICLE_TYPES.GLYCINE,
      PARTICLE_TYPES.ALANINE,
      PARTICLE_TYPES.VALINE,
      PARTICLE_TYPES.LEUCINE,
      PARTICLE_TYPES.SERINE,
    ]);
    const areBothAminoAcids = selected.every(p => aminoAcidTypes.has(p.type));
    if (areBothAminoAcids) return true;

    const hasCarboxyl = selected.some(p => p.type === PARTICLE_TYPES.FORMIC_ACID);
    const hasAmino = selected.some(p => p.type === PARTICLE_TYPES.AMMONIA);

    return areBothAminoAcids;
  }, [particles, selectedParticleIds]);
  
  const assemblableMoleculeIds = useMemo(() => {
    const assemblableIds = new Set();
    if (!bonds.length) return assemblableIds;

    const doCountsMatch = (recipeCounts = {}, groupCounts = {}) => {
      const allKeys = new Set([...Object.keys(recipeCounts), ...Object.keys(groupCounts)]);
      return Array.from(allKeys).every(key => (recipeCounts[key] || 0) === (groupCounts[key] || 0));
    };

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

        const groupBonds = bonds.filter(b => groupIds.has(b.particleA_id) && groupIds.has(b.particleB_id));
        if (groupBonds.length > 0) {
          const groupParticles = particles.filter(p => groupIds.has(p.id));

          const atomCounts = groupParticles.reduce((acc, p) => ({ ...acc, [p.type]: (acc[p.type] || 0) + 1 }), {});
          const bondCounts = groupBonds.reduce((acc, b) => ({ ...acc, [b.type]: (acc[b.type] || 0) + 1 }), {});

          const recipeMatch = MOLECULE_RECIPES.find(r => doCountsMatch(r.atoms, atomCounts) && doCountsMatch(r.bonds, bondCounts));

          if (recipeMatch) {
            groupIds.forEach(id => assemblableIds.add(id));
          }
        }
      }
    }
    return assemblableIds;
  }, [particles, bonds]);

  const handleShowInfo = useCallback((type) => setInfoPanelType(type), [setInfoPanelType]);

  const triggerRadiationBurst = useCallback((x, y) => {
    const newEffects = Array.from({ length: 7 }).map((_, i) => ({
      id: `fx-${i}-${Date.now()}`,
      x: x + 48,
      y: y + 48,
    }));
    setVisualEffects(prev => [...prev, ...newEffects]);
    newEffects.forEach(fx => {
      setTimeout(() => {
        setVisualEffects(prev => prev.filter(effect => effect.id !== fx.id));
      }, 700);
    });
  }, []);

  useDecay(triggerRadiationBurst);

  useEffect(() => {
    api.start(i => {
      if (i === draggedIndexRef.current) {
        return {};
      }
      return {
        x: particles[i]?.x ?? 0,
        y: particles[i]?.y ?? 0,
        scale: particles[i]?.scale ?? 1,
        immediate: false,
      };
    });
  }, [particles, api]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvasBounds = canvasRef.current.getBoundingClientRect();

      setParticles(particles.map(p => {
        const baseSize = PARTICLE_INFO[p.type]?.size || 64;
        const particleSize = baseSize * uiScale;

        const clampedX = Math.max(0, Math.min(p.x, canvasBounds.width - particleSize));
        const clampedY = Math.max(0, Math.min(p.y, canvasBounds.height - particleSize));

        if (clampedX !== p.x || clampedY !== p.y) {
          return { ...p, x: clampedX, y: clampedY };
        }
        return p;
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [uiScale, particles, setParticles]);

  return (
    <div
      {...canvasBind()}
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative flex-1 bg-gray-800 border-4 border-dashed border-gray-700 rounded-2xl shadow-xl overflow-hidden touch-none"
    >
      <button
        onClick={() => setIsPaletteVisible(!isPaletteVisible)}
        className="absolute top-1/2 -translate-y-1/2 right-0 z-20 bg-gray-700/50 hover:bg-gray-600/70 p-3 rounded-l-lg transition-all"
        aria-label={isPaletteVisible ? 'Hide palette' : 'Show palette'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isPaletteVisible ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          )}
        </svg>
      </button>

      <div className="absolute top-4 left-4 flex flex-col items-start gap-4">
        <div className="flex items-center">
          <ActionToolbar
            onAssemble={handleAssemble}
            onDisassemble={handleDisassemble}
            onRevert={handleRevertToElementary}
            onRemoveSelected={handleRemoveSelectedWithBonds}
            onBreakBonds={handleBreakBonds}
            onAddSingleBond={() => handleAddBond('single')}
            onAddDoubleBond={() => handleAddBond('double')}
            onAddPeptideBond={handleAddPeptideBond}
            canAssemble={selectionInfo.canAssemble}
            canDisassemble={selectionInfo.canDisassemble}
            canRevert={selectionInfo.canRevert}
            canBreakBonds={canBreakBonds}
            canAddBond={selectedParticleIds.size === 2 && !selectionInfo.isMoleculeAssembly && !canAddPeptideBond}
            canAddPeptideBond={canAddPeptideBond}
            canRemove={selectedParticleIds.size > 0}
          />
        </div>
        {!isSandboxMode && (
          <>
            {currentGoalIndex < goals.length && (
              <div className="bg-gray-900/70 backdrop-blur-sm p-3 rounded-lg border border-gray-600 shadow-lg">
                <p className="text-sm text-gray-400 font-semibold">Current Goal:</p>
                <p className="text-lg text-amber-300 font-bold">{goals[currentGoalIndex].name}</p>
              </div>
            )}
            {currentGoalIndex >= goals.length && (
              <div className="bg-green-900/70 backdrop-blur-sm p-3 rounded-lg border border-green-600 shadow-lg">
                <p className="text-lg text-green-300 font-bold">All goals completed! Sandbox mode unlocked.</p>
              </div>
            )}
          </>
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

      <animated.svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {bonds.map(bond => {
          const particleAIndex = particles.findIndex(p => p.id === bond.particleA_id);
          const particleBIndex = particles.findIndex(p => p.id === bond.particleB_id);

          if (particleAIndex === -1 || particleBIndex === -1) {
            return null;
          }

          const particleA = particles[particleAIndex];
          const particleB = particles[particleBIndex];

          const springA = springs[particleAIndex];
          const springB = springs[particleBIndex];

          const sizeA = (COMPOUND_PARTICLE_TYPES.has(particleA.type) || MOLECULE_PARTICLE_TYPES.has(particleA.type) ? 96 : 64) * uiScale;
          const sizeB = (COMPOUND_PARTICLE_TYPES.has(particleB.type) || MOLECULE_PARTICLE_TYPES.has(particleB.type) ? 96 : 64) * uiScale;

          const centerOffsetA = sizeA / 2;
          const centerOffsetB = sizeB / 2;

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

      {isSettingsVisible && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setIsSettingsVisible(false)}>
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-80" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-center mb-4">Settings</h3>
            <div className="flex items-center justify-between">
              <span className="font-semibold">UI Scale</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUiScale(uiScale - 0.1)}
                  className="w-10 h-10 flex items-center justify-center text-2xl font-bold bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center font-mono text-lg">{(uiScale * 100).toFixed(0)}%</span>
                <button
                  onClick={() => setUiScale(uiScale + 0.1)}
                  className="w-10 h-10 flex items-center justify-center text-2xl font-bold bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsVisible(false)}
              className="w-full mt-6 text-center px-4 py-2 text-white font-bold rounded-lg shadow-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isResetConfirmVisible && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setIsResetConfirmVisible(false)}>
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-center mb-4 text-red-400">Confirm Reset</h3>
            <p className="text-center text-gray-300 mb-6">Are you sure you want to reset the entire lab? All your discoveries and progress will be lost.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsResetConfirmVisible(false)}
                className="px-6 py-2 text-white font-bold rounded-lg shadow-lg bg-gray-600 hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeReset}
                className="px-6 py-2 text-white font-bold rounded-lg shadow-lg bg-red-700 hover:bg-red-600 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-10">
        {isHintVisible && !isSandboxMode && currentGoalIndex < goals.length && (() => {
          const currentGoal = goals[currentGoalIndex];
          let hintRecipe = RECIPES.find(r => r.type === currentGoal.type) || MOLECULE_RECIPES.find(r => r.type === currentGoal.type);
          if (!hintRecipe) return null;

          return (
            <div className="absolute bottom-full mb-2 w-64 bg-gray-900/80 backdrop-blur-md p-4 rounded-lg shadow-xl border border-gray-700">
              <h4 className="font-bold text-amber-300 mb-2">Recipe for {PARTICLE_NAMES[currentGoal.type]}</h4>
              <ul>
                {Object.entries(hintRecipe.ingredients || hintRecipe.atoms).map(([type, count]) => (
                  <li key={type} className="flex justify-between text-gray-300">
                    <span>{PARTICLE_NAMES[type]}</span>
                    <span className="font-mono font-bold">x {count}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
        <ActionMenu
          isVisible={isActionMenuVisible}
          onClose={() => setIsActionMenuVisible(false)}
          onSetGoalPath={handleSetGoalPath}
          onOpenCodex={() => openExclusive('isCodexVisible', 'isCodexVisible')}
          onOpenPeriodicTable={() => openExclusive('isPeriodicTableVisible', 'isPeriodicTableVisible')}
          onOpenSettings={() => openExclusive('isSettingsVisible', 'isSettingsVisible')}
          onEmptyCanvas={() => { handleEmptyCanvas(); setIsActionMenuVisible(false); }}
          onReset={() => { handleReset(); setIsActionMenuVisible(false); }}
          onToggleSandbox={handleToggleSandbox}
          isSandbox={isSandboxMode}
          hasParticles={particles.length > 0}
        />
        <div className="flex gap-2">
          <button
            onClick={() => openExclusive('isHintVisible', 'isHintVisible')}
            className="p-3 text-yellow-300 bg-gray-700 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400"
            aria-label="Show hint"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </button>
          <button
            onClick={() => openExclusive('isActionMenuVisible', 'isActionMenuVisible')}
            className="p-3 text-blue-300 bg-gray-700 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-400"
            aria-label="Show actions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
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

      {isPeriodicTableVisible && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center" onClick={() => !isPeriodicTablePinned && setIsPeriodicTableVisible(false)}>
          <PeriodicTable
            onClose={() => setIsPeriodicTableVisible(false)}
            discoveredParticles={discoveredParticlesForPeriodicTable}
            onDragStart={onDragStart}
            onParticleClick={handleShowInfo}
            isPinned={isPeriodicTablePinned}
            onPinToggle={() => setIsPeriodicTablePinned(!isPeriodicTablePinned)}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <Codex
        isVisible={isCodexVisible}
        onClose={() => setIsCodexVisible(false)}
        particleCategories={allPossibleParticles}
        discoveredParticles={allDiscoveredParticles}
        onParticleClick={handleShowInfo}
        onDragStart={onDragStart}
      />

      {springs.map((props, i) => {
        const particle = particles[i];
        if (!particle) return null;

        const isSelected = selectedParticleIds.has(particle.id);
        const isCompound = COMPOUND_PARTICLE_TYPES.has(particle.type) || MOLECULE_PARTICLE_TYPES.has(particle.type);
        const isAssemblable = assemblableMoleculeIds.has(particle.id);

        const baseSize = PARTICLE_INFO[particle.type]?.size || 64;

        return (
          <animated.div
            {...bind(i)}
            key={particle.id}
            style={{
              x: props.x,
              y: props.y,
              scale: props.scale,
              zIndex: isSelected ? 10 : 1,
              touchAction: 'none',
              width: `${baseSize * uiScale}px`,
              height: `${baseSize * uiScale}px`,
            }}
            className={`absolute cursor-grab transition-colors duration-300 flex items-center justify-center font-bold text-white ${isSelected ? 'ring-2 ring-yellow-300 rounded-lg' : ''} ${isAssemblable ? 'molecule-glow' : ''}`}
            onClick={(e) => handleParticleClick(e, particle.id)}
            onDoubleClick={() => handleShowInfo(particle.type)}
            onMouseEnter={() => api.start(j => (j === i ? { scale: 1.2 } : {}))}
            onMouseLeave={() => api.start(j => (j === i ? { scale: 1 } : {}))}
          >
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-full h-full">
                <ParticleIcon type={particle.type} color={PARTICLE_COLORS[particle.type]} isCompound={isCompound} />
              </div>
              <span className="text-white text-center p-1 absolute -bottom-6 text-sm">
                {PARTICLE_NAMES[particle.type]}
              </span>
            </div>
          </animated.div>
        );
      })}
    </div>
  );
};

export default ParticleCanvas;
