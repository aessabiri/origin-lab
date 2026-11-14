import React from 'react';

/**
 * Shared Top Targets Bar for all 5 Bio-Assembly stops.
 * Targets remain greyed out until crafted/assembled, then become clickable 3D inspectors.
 */
const TopTargetsBar = ({
  label = 'Needed:',
  items = [],
  builtIds = [],
  activeId = null,
  onSelectBuilt,
  demiurgeSurvivalMode = false,
  onToggleSurvivalMode,
  onOpenAnatomy,
}) => {
  return (
    <div className="bg-[#0b1220] rounded-2xl px-3 py-2 border border-white/10 shrink-0 flex items-center justify-between gap-2 overflow-x-auto">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase pr-1 shrink-0">
          {label}
        </span>
        {items.map((item) => {
          const isBuilt = builtIds.includes(item.id);
          const isViewing = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (onSelectBuilt) onSelectBuilt(item.id, isBuilt);
              }}
              title={
                isBuilt
                  ? `${item.name} — Assembled! Click to inspect in 3D`
                  : `${item.name} — Not built yet (drag ingredients from left drawer)`
              }
              className={`px-2.5 py-1 rounded-xl border font-mono text-[9.5px] font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                isBuilt
                  ? isViewing
                    ? 'bg-cyan-500/25 border-cyan-400 text-white cursor-pointer'
                    : 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200 cursor-pointer hover:bg-emerald-500/25'
                  : isViewing
                  ? 'bg-[#0f172a] border-white/25 text-slate-300 opacity-75 cursor-pointer'
                  : 'bg-[#080d18] border-white/5 text-slate-500 opacity-40 grayscale cursor-pointer hover:opacity-65'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.shortName || item.name.split(' ')[0]}</span>
              {isBuilt && <span className="text-emerald-400">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {onToggleSurvivalMode && (
          <button
            onClick={onToggleSurvivalMode}
            title={
              demiurgeSurvivalMode
                ? 'Demiurge Survival Mode: requires Physics/Chem stock & prior-stop outputs'
                : 'Sandbox Mode: all ingredients free for rapid prototyping'
            }
            className={`px-2.5 py-1 rounded-xl border font-mono font-bold text-[9px] uppercase cursor-pointer transition-all ${
              demiurgeSurvivalMode
                ? 'bg-amber-500/20 border-amber-400/70 text-amber-200'
                : 'bg-[#0f172a] border-white/15 text-slate-300 hover:border-cyan-400/40'
            }`}
          >
            {demiurgeSurvivalMode ? '⚛️ Survival (Stock)' : '🧪 Sandbox (Free)'}
          </button>
        )}

        {onOpenAnatomy && (
          <button
            onClick={onOpenAnatomy}
            className="px-3 py-1 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-[9.5px] uppercase cursor-pointer shrink-0"
          >
            🦴 Anatomy →
          </button>
        )}
      </div>
    </div>
  );
};

export default TopTargetsBar;
