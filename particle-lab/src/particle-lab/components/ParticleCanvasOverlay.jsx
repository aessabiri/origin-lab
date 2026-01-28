import React, { useMemo } from 'react';
import ActionToolbar from './ActionToolbar.jsx';
import ActionMenu from './ActionMenu.jsx';
import PeriodicTable from './PeriodicTable.jsx';
import { PARTICLE_NAMES } from '../../constants/particles.js';
import { RECIPES } from '../../recipes.js';
import { MOLECULE_RECIPES } from '../../constants/moleculeRecipes.js';
import { GOAL_PATHS } from '../../constants/goalPaths.js';
import { useParticleStore } from '../store.js';
import { useStore } from '../../store.js';

const ParticleCanvasOverlay = ({
  // Actions passed from Canvas logic
  onAssemble,
  onDisassemble,
  onRevert,
  onRemoveSelected,
  onBreakBonds,
  onAddSingleBond,
  onAddDoubleBond,
  onAddTripleBond,
  onAddPeptideBond,
  onEmptyCanvas,
  onDragStart,
  onShowInfo,
  
  // State passed from Canvas logic
  selectionInfo,
  canBreakBonds,
  canAddBond,
  canAddPeptideBond,
  selectedParticleIds,
  hasParticles,
  
  // Visuals
  isPeriodicTableVisible,
  isPeriodicTablePinned
}) => {
  // Global Stores
  const { setIsCodexVisible } = useStore();
  const {
    currentGoalIndex,
    goalPath,
    isSandboxMode,
    isPaletteVisible, setIsPaletteVisible,
    isHintVisible,
    isActionMenuVisible, setIsActionMenuVisible,
    isSettingsVisible, setIsSettingsVisible,
    isExchangeHubVisible, setIsExchangeHubVisible,
    message,
    openExclusive,
    handleReset,
    handleSetGoalPath,
    handleToggleSandbox,
    setIsPeriodicTablePinned,
    setIsPeriodicTableVisible
  } = useParticleStore();

  const goals = useMemo(() => GOAL_PATHS[goalPath] || GOAL_PATHS.medium, [goalPath]);

  // --- Helper for Periodic Table Data ---
  const discoveredParticlesForPeriodicTable = useMemo(() => {
    // We access the store directly here to avoid passing huge arrays as props
    const state = useParticleStore.getState();
    const { isSandboxMode, secondaryParticles, discoveredAtoms } = state;
    if (isSandboxMode) {
      // In sandbox, we just need to know what exists in general? 
      // Actually, let's keep the logic consistent with original.
      // Ideally this data logic belongs in a hook, but for the UI overlay it's fine here or passed down.
      // We'll rely on the parent logic if we want strictly "dumb" UI, but accessing store is pragmatic.
      // Let's re-use the logic if we can, or just grab from store.
      // Ideally, the parent passes this data.
      return []; // Placeholder if we don't pass it.
    } else {
      return [...secondaryParticles, ...discoveredAtoms];
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 1. Palette Toggle */}
      <button
        onClick={() => setIsPaletteVisible(!isPaletteVisible)}
        className="absolute top-1/2 -translate-y-1/2 right-0 z-20 bg-gray-700/50 hover:bg-gray-600/70 p-3 rounded-l-lg transition-all pointer-events-auto"
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

      {/* 2. Top-Left Toolbar & Goals */}
      <div className="absolute top-4 left-4 flex flex-col items-start gap-4 pointer-events-auto">
        <div className="flex items-center">
          <ActionToolbar
            onAssemble={onAssemble}
            onDisassemble={onDisassemble}
            onRevert={onRevert}
            onRemoveSelected={onRemoveSelected}
            onBreakBonds={onBreakBonds}
            onAddSingleBond={onAddSingleBond}
            onAddDoubleBond={onAddDoubleBond}
            onAddTripleBond={onAddTripleBond}
            onAddPeptideBond={onAddPeptideBond}
            canAssemble={selectionInfo.canAssemble}
            canDisassemble={selectionInfo.canDisassemble}
            canRevert={selectionInfo.canRevert}
            canBreakBonds={canBreakBonds}
            canAddBond={canAddBond}
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

      {/* 3. Top-Right Message Toast */}
      <div
        className="absolute top-4 right-4 z-10 p-2 bg-gray-700 rounded-lg shadow-md transition-opacity duration-300 pointer-events-none"
        style={{ opacity: message ? 1 : 0 }}
      >
        <p className="text-sm font-semibold text-white">{message}</p>
      </div>

      {/* 4. Bottom-Left Context Menus */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto">
        {isHintVisible && !isSandboxMode && currentGoalIndex < goals.length && (() => {
          const currentGoal = goals[currentGoalIndex];
          let hintRecipe = RECIPES.find(r => r.type === currentGoal.type) || MOLECULE_RECIPES.find(r => r.type === currentGoal.type);
          if (!hintRecipe) return null;

          return (
            <div className="absolute bottom-full mb-2 w-64 bg-gray-900/80 backdrop-blur-md p-4 rounded-lg shadow-xl border border-gray-700">
              <h4 className="font-bold text-amber-300 mb-2">Recipe for {PARTICLE_NAMES[currentGoal.type]}</h4>
              <ul className="mb-2">
                {Object.entries(hintRecipe.ingredients || hintRecipe.atoms).map(([type, count]) => (
                  <li key={type} className="flex justify-between text-gray-300">
                    <span>{PARTICLE_NAMES[type]}</span>
                    <span className="font-mono font-bold">x {count}</span>
                  </li>
                ))}
              </ul>
              {hintRecipe.bonds && (
                <div className="border-t border-gray-600 pt-2 mb-2">
                  <p className="text-xs font-semibold text-gray-400 mb-1">Required Bonds:</p>
                  <ul>
                    {Object.entries(hintRecipe.bonds).map(([type, count]) => (
                      <li key={type} className="flex justify-between text-gray-300 text-sm">
                        <span className="capitalize">{type}</span>
                        <span className="font-mono font-bold">x {count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hintRecipe.structure && (
                <div className="border-t border-gray-600 pt-2">
                  <p className="text-xs text-amber-400 font-bold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Specific Structure Required
                  </p>
                </div>
              )}
            </div>
          );
        })()}
        
        <ActionMenu
          isVisible={isActionMenuVisible}
          onClose={() => setIsActionMenuVisible(false)}
          onSetGoalPath={handleSetGoalPath}
          onOpenCodex={() => { setIsCodexVisible(true); setIsActionMenuVisible(false); }}
          onOpenPeriodicTable={() => openExclusive('isPeriodicTableVisible', 'isPeriodicTableVisible')}
          onOpenSettings={() => openExclusive('isSettingsVisible', 'isSettingsVisible')}
          onOpenExchange={() => openExclusive('isExchangeHubVisible', 'isExchangeHubVisible')}
          onEmptyCanvas={() => { onEmptyCanvas(); setIsActionMenuVisible(false); }}
          onReset={() => { handleReset(); setIsActionMenuVisible(false); }}
          onToggleSandbox={handleToggleSandbox}
          isSandbox={isSandboxMode}
          hasParticles={hasParticles}
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

      {/* 5. Bottom-Right Tools */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-30 pointer-events-auto">
        <button
          onClick={() => openExclusive('isPeriodicTableVisible', 'isPeriodicTableVisible')}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-2 border-indigo-400"
          title="Periodic Table"
        >
          <span className="text-2xl">📊</span>
        </button>
        <button
          onClick={() => { setIsCodexVisible(true); setIsActionMenuVisible(false); }}
          className="w-12 h-12 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-2 border-amber-400"
          title="Universal Codex"
        >
          <span className="text-2xl">📖</span>
        </button>
      </div>

      {/* 6. Modals (Periodic Table) */}
      {isPeriodicTableVisible && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center pointer-events-auto" onClick={() => !isPeriodicTablePinned && setIsPeriodicTableVisible(false)}>
          <PeriodicTable
            onClose={() => setIsPeriodicTableVisible(false)}
            // Pass discovered atoms from global state logic or simpler store access
            discoveredParticles={useParticleStore.getState().discoveredAtoms || []}
            isSandboxMode={isSandboxMode}
            onDragStart={onDragStart}
            onParticleClick={onShowInfo}
            isPinned={isPeriodicTablePinned}
            onPinToggle={() => setIsPeriodicTablePinned(!isPeriodicTablePinned)}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ParticleCanvasOverlay;
