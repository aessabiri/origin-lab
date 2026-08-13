import React from 'react';

const ActionToolbar = ({
  onAssemble,
  onDisassemble,
  onRevert,
  onRemoveSelected,
  onBreakBonds,
  onAddSingleBond,
  onAddDoubleBond,
  onAddTripleBond,
  onAddPeptideBond,
  canAssemble,
  canDisassemble,
  canRevert,
  canRemove,
  canBreakBonds,
  canAddBond,
  canAddPeptideBond,
}) => {
  const hasActions = canAssemble || canDisassemble || canRevert || canAddBond || canAddPeptideBond || canBreakBonds || canRemove;

  if (!hasActions) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0b0f17]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl text-slate-400 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse"></span>
        <span>Select particles or drag atoms to interact</span>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-2 p-1.5 rounded-2xl bg-[#0b0f17]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      
      {/* Transformation Cluster */}
      {canAssemble && (
        <button
          onClick={onAssemble}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider text-white rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition-all duration-150 border border-emerald-400/40 animate-pulse"
          title="Synthesize selected components into higher structure"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Assemble</span>
        </button>
      )}

      {canDisassemble && (
        <button
          onClick={onDisassemble}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider text-white rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 active:scale-95 transition-all duration-150 border border-amber-400/40"
          title="Break down into immediate constituent parts"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v2a1 1 0 002 0V4zm11 1a1 1 0 100-2h-2a1 1 0 100 2h2zm-4 0a1 1 0 100-2h-2a1 1 0 100 2h2zM9 9a1 1 0 100-2H7a1 1 0 100 2h2zm4-1a1 1 0 10-2 0v2a1 1 0 102 0V8z" clipRule="evenodd" />
          </svg>
          <span>Disassemble</span>
        </button>
      )}

      {canRevert && (
        <button
          onClick={onRevert}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-rose-200 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 hover:text-white active:scale-95 transition-all"
          title="Revert completely to elementary quarks & leptons"
        >
          <svg className="w-4 h-4 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>To Quarks</span>
        </button>
      )}

      {/* Chemical Bonding Group */}
      {canAddBond && (
        <div className="flex items-center gap-1.5 pl-1 border-l border-slate-700/60">
          <button
            onClick={onAddSingleBond}
            className="px-3 py-2 text-xs font-mono font-black text-cyan-200 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            title="Create single covalent bond (—)"
          >
            <span className="text-cyan-400 font-bold text-sm">—</span>
            <span>Single</span>
          </button>
          <button
            onClick={onAddDoubleBond}
            className="px-3 py-2 text-xs font-mono font-black text-cyan-200 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            title="Create double covalent bond (=)"
          >
            <span className="text-cyan-400 font-bold text-sm">=</span>
            <span>Double</span>
          </button>
          <button
            onClick={onAddTripleBond}
            className="px-3 py-2 text-xs font-mono font-black text-cyan-200 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            title="Create triple covalent bond (≡)"
          >
            <span className="text-cyan-400 font-bold text-sm">≡</span>
            <span>Triple</span>
          </button>
        </div>
      )}

      {canAddPeptideBond && (
        <div className="flex items-center gap-1 pl-1 border-l border-slate-700/60">
          <button
            onClick={onAddPeptideBond}
            className="px-3 py-2 text-xs font-black uppercase tracking-wider text-pink-200 rounded-xl bg-pink-950/70 hover:bg-pink-900 border border-pink-500/40 hover:border-pink-400 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
            title="Form peptide bond between amino acids (~)"
          >
            <span className="text-pink-400">🧬</span>
            <span>Peptide Bond</span>
          </button>
        </div>
      )}

      {/* Destructive / Cleanup */}
      {(canBreakBonds || canRemove) && (
        <div className="flex items-center gap-1.5 pl-1 border-l border-slate-700/60">
          {canBreakBonds && (
            <button
              onClick={onBreakBonds}
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-purple-200 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-600/40 hover:border-purple-400 transition-all flex items-center gap-1"
              title="Sever bonds connected to selection"
            >
              <span className="text-purple-400">✂️</span>
              <span>Break Bonds</span>
            </button>
          )}

          {canRemove && (
            <button
              onClick={onRemoveSelected}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-orange-200 rounded-xl bg-orange-950/60 hover:bg-orange-900 border border-orange-600/40 hover:border-orange-400 transition-all"
              title="Delete selected particles"
            >
              <svg className="w-4 h-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Purge</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default React.memo(ActionToolbar);