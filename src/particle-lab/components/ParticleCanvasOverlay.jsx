import React, { useMemo } from 'react';
import ActionToolbar from './ActionToolbar.jsx';
import PeriodicTable from './PeriodicTable.jsx';
import { useParticleStore } from '../store.js';
import { useStore } from '../../store.js';

const ParticleCanvasOverlay = ({
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
  
  selectionInfo,
  canBreakBonds,
  canAddBond,
  canAddPeptideBond,
  selectedParticleIds,
  hasParticles,
  
  isPeriodicTableVisible,
  isPeriodicTablePinned,
  discoveredAtoms = []
}) => {
  const { setIsCodexVisible, isSandboxMode } = useStore();
  const {
    isPaletteVisible, setIsPaletteVisible,
    message,
    openExclusive,
    setIsPeriodicTablePinned,
    setIsPeriodicTableVisible,
    particles,
    bonds
  } = useParticleStore();

  const discoveredParticlesForPeriodicTable = useMemo(() => {
    const secondaryParticles = useParticleStore.getState().secondaryParticles || [];
    if (isSandboxMode) {
      return []; 
    } else {
      return [...secondaryParticles, ...discoveredAtoms];
    }
  }, [isSandboxMode, discoveredAtoms]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      
      {/* 1. Palette Toggle (Right Edge) */}
      <button
        onClick={() => setIsPaletteVisible(!isPaletteVisible)}
        className="absolute top-1/2 -translate-y-1/2 right-0 z-20 bg-[#0b0f17]/90 hover:bg-cyan-950/80 border-l border-y border-cyan-500/30 p-2.5 rounded-l-xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-auto group"
        aria-label={isPaletteVisible ? 'Hide palette' : 'Show palette'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isPaletteVisible ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          )}
        </svg>
      </button>

      {/* 2. Top-Left Floating Action Toolbar */}
      <div className="absolute top-4 left-4 flex flex-col items-start gap-4 pointer-events-auto">
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

      {/* 3. Top-Right Canvas Status HUD & Toast */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Canvas Telemetry HUD */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#0b0f17]/85 backdrop-blur-xl border border-cyan-500/20 shadow-lg text-[11px] font-mono text-slate-300 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Atoms: <strong className="text-cyan-300 font-bold">{particles.length}</strong></span>
          </div>
          <div className="h-3 w-px bg-slate-700"></div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Bonds: <strong className="text-emerald-300 font-bold">{bonds.length}</strong></span>
          </div>
          {selectedParticleIds.size > 0 && (
            <>
              <div className="h-3 w-px bg-slate-700"></div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Selected: <strong className="text-amber-300 font-bold">{selectedParticleIds.size}</strong></span>
              </div>
            </>
          )}
        </div>

        {/* Floating Message Toast */}
        {message && (
          <div className="p-3 bg-[#0c1322]/95 backdrop-blur-2xl rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/40 animate-fade-in flex items-center gap-2 max-w-sm">
            <span className="text-cyan-400 text-sm">💡</span>
            <p className="text-xs font-sans font-semibold text-cyan-100">{message}</p>
          </div>
        )}
      </div>

      {/* 4. Bottom-Right Floating Glass Action Dock */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2.5 z-30 pointer-events-auto">
        
        {/* Empty Canvas Button */}
        {hasParticles && (
          <button
            onClick={onEmptyCanvas}
            className="w-11 h-11 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white rounded-xl backdrop-blur-xl border border-rose-500/40 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
            title="Purge Canvas"
            aria-label="Empty Canvas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* Periodic Table Button */}
        <button
          onClick={() => openExclusive('isPeriodicTableVisible', 'isPeriodicTableVisible')}
          className="w-11 h-11 bg-[#0f172a]/90 hover:bg-indigo-950 text-indigo-300 hover:text-white rounded-xl backdrop-blur-xl border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
          title="Periodic Table of Elements"
        >
          <div className="grid grid-cols-3 gap-0.5 p-1">
            <div className="w-1.5 h-1.5 rounded-sm bg-rose-500"></div>
            <div className="w-1.5 h-1.5"></div>
            <div className="w-1.5 h-1.5 rounded-sm bg-cyan-500"></div>
            <div className="w-1.5 h-1.5 rounded-sm bg-emerald-500"></div>
            <div className="w-1.5 h-1.5 rounded-sm bg-amber-500"></div>
            <div className="w-1.5 h-1.5 rounded-sm bg-purple-500"></div>
            <div className="w-1.5 h-1.5 rounded-sm bg-pink-500"></div>
            <div className="w-1.5 h-1.5 rounded-sm bg-orange-500"></div>
            <div className="w-1.5 h-1.5 rounded-sm bg-teal-500"></div>
          </div>
        </button>

        {/* Universal Codex Button */}
        <button
          onClick={() => setIsCodexVisible(true)}
          className="px-3.5 h-11 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl backdrop-blur-xl border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          title="Open Universal Codex"
        >
          <span className="text-lg">📖</span>
          <span className="text-xs font-black uppercase tracking-wider font-sans">Codex</span>
        </button>
      </div>

      {/* 5. Modals (Periodic Table) */}
      {isPeriodicTableVisible && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 flex items-center justify-center pointer-events-auto p-4 animate-fade-in" 
          onClick={() => !isPeriodicTablePinned && setIsPeriodicTableVisible(false)}
        >
          <PeriodicTable
            onClose={() => setIsPeriodicTableVisible(false)}
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

export default React.memo(ParticleCanvasOverlay);
