import React, { useMemo } from 'react';
import ActionToolbar from './ActionToolbar.jsx';
import ActionMenu from './ActionMenu.jsx';
import PeriodicTable from './PeriodicTable.jsx';
import { PARTICLE_NAMES } from '../../constants/particles.js';
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
  isPeriodicTablePinned,
  
  // Data
  discoveredAtoms = []
}) => {
  // Global Stores
  const { setIsCodexVisible, isSandboxMode, setIsSandboxMode } = useStore();
  const {
    isPaletteVisible, setIsPaletteVisible,
    isHintVisible,
    isActionMenuVisible, setIsActionMenuVisible,
    isSettingsVisible, setIsSettingsVisible,
    isExchangeHubVisible, setIsExchangeHubVisible,
    message,
    openExclusive,
    handleReset,
    setIsPeriodicTablePinned,
    setIsPeriodicTableVisible
  } = useParticleStore();

  const handleToggleSandbox = () => {
    setIsSandboxMode(!isSandboxMode);
  };

  // --- Helper for Periodic Table Data ---
  const discoveredParticlesForPeriodicTable = useMemo(() => {
    const secondaryParticles = useParticleStore.getState().secondaryParticles || [];
    
    if (isSandboxMode) {
      return []; 
    } else {
      return [...secondaryParticles, ...discoveredAtoms];
    }
  }, [isSandboxMode, discoveredAtoms]);

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
        <ActionMenu
          isVisible={isActionMenuVisible}
          onClose={() => setIsActionMenuVisible(false)}
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
          className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-2 border-indigo-500 group"
          title="Periodic Table"
        >
          <div className="grid grid-cols-3 gap-0.5 p-1">
            <div className="w-2 h-2 rounded-sm bg-red-500"></div>
            <div className="w-2 h-2"></div>
            <div className="w-2 h-2 rounded-sm bg-blue-500"></div>
            <div className="w-2 h-2 rounded-sm bg-green-500"></div>
            <div className="w-2 h-2 rounded-sm bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-sm bg-purple-500"></div>
            <div className="w-2 h-2 rounded-sm bg-pink-500"></div>
            <div className="w-2 h-2 rounded-sm bg-orange-500"></div>
            <div className="w-2 h-2 rounded-sm bg-cyan-500"></div>
          </div>
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
            discoveredParticles={discoveredParticlesForPeriodicTable}
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
