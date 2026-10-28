import React from 'react';

const VesselMonitor = ({ id, vessel, totalVolume, phValue, mixtureName, onConfigure }) => {
  const maxVol = vessel.maxVol || 500;
  const volPercent = Math.min(100, (totalVolume / maxVol) * 100);
  const isOverheating = vessel.temp > 100;
  const isHighPressure = vessel.pressure > 3;

  // Determine pH color & label
  let phLabel = 'Neutral';
  let phColor = 'text-emerald-400';
  let phBadgeBg = 'bg-emerald-500/10 border-emerald-500/30';
  if (phValue < 3) {
    phLabel = 'Strong Acid';
    phColor = 'text-rose-400';
    phBadgeBg = 'bg-rose-500/15 border-rose-500/40';
  } else if (phValue < 6.5) {
    phLabel = 'Weak Acid';
    phColor = 'text-amber-400';
    phBadgeBg = 'bg-amber-500/15 border-amber-500/40';
  } else if (phValue > 11.5) {
    phLabel = 'Strong Base';
    phColor = 'text-purple-400';
    phBadgeBg = 'bg-purple-500/15 border-purple-500/40';
  } else if (phValue > 7.5) {
    phLabel = 'Weak Base';
    phColor = 'text-cyan-400';
    phBadgeBg = 'bg-cyan-500/15 border-cyan-500/40';
  }

  // pH Indicator bar position (0 to 14 mapped to 0% to 100%)
  const phPercent = Math.max(0, Math.min(100, (phValue / 14) * 100));

  return (
    <div className="w-full bg-[#080d1a]/95 backdrop-blur-xl border border-slate-700/80 hover:border-emerald-500/40 rounded-2xl p-3 mb-2 shadow-[0_8px_25px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-300 group min-w-[230px]">
      
      {/* Subtle Hologram Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] [background-size:100%_4px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 via-teal-500/3 to-transparent pointer-events-none rounded-bl-full" />

      {/* Top Header Bar */}
      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">
            BAY-{id.slice(-4).toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {/* Reaction State Pill */}
          {vessel.activeVisual && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              {vessel.activeVisual.toUpperCase()}
            </span>
          )}

          {/* Config / Upgrade Button */}
          <button 
            onClick={onConfigure}
            className="p-1 rounded-md text-slate-500 hover:text-emerald-300 hover:bg-slate-800 transition-colors"
            title="Configure / Upgrade Vessel"
          >
            <span className="text-xs">⚙️</span>
          </button>
        </div>
      </div>

      {/* Mixture Title */}
      <div className="relative z-10 mb-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-300 truncate max-w-[170px]" title={mixtureName}>
            {mixtureName}
          </span>
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${phBadgeBg} ${phColor}`}>
            {phLabel}
          </span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        
        {/* Metric 1: Temperature */}
        <div className="bg-[#050914]/80 p-2 rounded-xl border border-slate-800/60 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase">
            <span>TEMP</span>
            <span>🌡️</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-base font-mono font-black ${isOverheating ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
              {vessel.temp}
            </span>
            <span className="text-[10px] font-mono text-slate-500">°C</span>
          </div>
        </div>

        {/* Metric 2: Volume */}
        <div className="bg-[#050914]/80 p-2 rounded-xl border border-slate-800/60 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase">
            <span>VOLUME</span>
            <span>💧</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-mono font-black text-cyan-300">
              {Math.round(totalVolume)}
            </span>
            <span className="text-[10px] font-mono text-slate-500">/{maxVol}ml</span>
          </div>
          {/* Volume Mini-Bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
              style={{ width: `${volPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Dynamic pH Spectrum Gauge Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 relative z-10">
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mb-1">
          <span>pH SPECTRUM</span>
          <span className={`font-black ${phColor}`}>{phValue.toFixed(2)}</span>
        </div>
        
        {/* Continuous Gradient Spectrum */}
        <div className="relative w-full h-1.5 rounded-full overflow-hidden bg-slate-800 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-600 opacity-85" />
          {/* Indicator Pointer */}
          <div 
            className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-[0_0_6px_#fff] transition-all duration-300 transform -translate-x-1/2"
            style={{ left: `${phPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
};

export default React.memo(VesselMonitor);

