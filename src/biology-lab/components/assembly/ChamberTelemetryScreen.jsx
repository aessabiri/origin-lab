import React from 'react';

/**
 * Live Scientific Telemetry & Molecular Interaction Monitor
 * Mounted alongside the 3D Bioreactor Chamber to visualize real-time biochemical cascades.
 */
const ChamberTelemetryScreen = ({
  title = 'LIVE REACTION TELEMETRY',
  subtitle = 'MOLECULAR INTERACTION STREAM',
  accentColor = '#22d3ee',
  isRunning = false,
  isComplete = false,
  progress = 0,
  elapsedSec = 0,
  reactionRate = 0,
  o2Level = 21,
  morphogenLevel = 65,
  steps = [], // [{ id, label, sublabel, progress: 0..100, active: bool, done: bool, color }]
  interactions = [], // [{ id, time, tag, text, color }]
}) => {
  const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const secs = String(Math.floor(elapsedSec % 60)).padStart(2, '0');

  return (
    <div className="flex flex-col h-full bg-[#050912] border-l border-slate-800/90 text-slate-200 font-mono select-none overflow-hidden">
      {/* CRT / Lab Monitor Header */}
      <div className="px-3 py-2 bg-[#070d1a] border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isComplete
                  ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                  : isRunning
                  ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]'
                  : 'bg-slate-600'
              }`}
            />
            <span className="text-[9.5px] font-black tracking-wider text-white uppercase truncate">
              {title}
            </span>
          </div>
          <span className="text-[8px] text-slate-400 uppercase tracking-widest block mt-0.5">
            {subtitle}
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-black text-cyan-300 tabular-nums">
            {mins}:{secs}
          </div>
          <div className="text-[7.5px] text-slate-500 uppercase">T+ ELAPSED</div>
        </div>
      </div>

      {/* Live Kinetics Bar */}
      <div className="grid grid-cols-3 gap-1.5 px-2.5 py-2 bg-[#060b15] border-b border-slate-800/80 shrink-0">
        <div className="p-1.5 rounded bg-[#0a1222] border border-slate-800">
          <div className="text-[7.5px] text-slate-400 uppercase">VELOCITY</div>
          <div className="text-[11px] font-black text-emerald-300 tabular-nums">
            {reactionRate.toFixed(1)}%/s
          </div>
        </div>
        <div className="p-1.5 rounded bg-[#0a1222] border border-slate-800">
          <div className="text-[7.5px] text-slate-400 uppercase">pO₂ TENSION</div>
          <div
            className={`text-[11px] font-black tabular-nums ${
              o2Level < 12 ? 'text-rose-400' : 'text-cyan-300'
            }`}
          >
            {o2Level}%
          </div>
        </div>
        <div className="p-1.5 rounded bg-[#0a1222] border border-slate-800">
          <div className="text-[7.5px] text-slate-400 uppercase">MORPHOGEN</div>
          <div className="text-[11px] font-black text-amber-300 tabular-nums">
            {morphogenLevel}%
          </div>
        </div>
      </div>

      {/* Morphogenetic Pathway Cascade */}
      <div className="px-2.5 py-2 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
            Active Pathway Cascade
          </span>
          <span className="text-[9px] font-black" style={{ color: accentColor }}>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="space-y-1.5">
          {steps.map((step, i) => {
            const pct = Math.max(0, Math.min(100, Math.round(step.progress || 0)));
            const col = step.color || accentColor;
            return (
              <div
                key={step.id || i}
                className={`px-2 py-1 rounded border transition-all ${
                  step.active
                    ? 'bg-[#0b162a] border-cyan-500/50'
                    : step.done
                    ? 'bg-emerald-950/25 border-emerald-500/30'
                    : 'bg-[#070c16] border-slate-800/80 opacity-65'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[8.5px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        step.active ? 'animate-ping' : ''
                      }`}
                      style={{ backgroundColor: step.done ? '#10b981' : col }}
                    />
                    <span className="font-bold text-slate-100 truncate">{step.label}</span>
                  </div>
                  <span className="text-[8px] font-black tabular-nums shrink-0" style={{ color: step.done ? '#10b981' : col }}>
                    {pct}%
                  </span>
                </div>
                {step.sublabel && (
                  <div className="text-[7.5px] text-slate-400 truncate pl-3 mt-0.5">
                    {step.sublabel}
                  </div>
                )}
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: step.done ? '#10b981' : col,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Molecular Interaction Log */}
      <div className="flex-1 min-h-0 flex flex-col px-2.5 py-2 overflow-hidden">
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
            Real-Time Molecular Interactions
          </span>
          <span className="text-[7.5px] text-cyan-400 uppercase">LIVE STREAM</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {interactions.length === 0 ? (
            <div className="text-[8.5px] text-slate-500 italic py-4 text-center border border-dashed border-slate-800 rounded">
              Infuse substrates and start bioreactor to observe live molecular binding...
            </div>
          ) : (
            interactions.map((ev) => (
              <div
                key={ev.id}
                className="p-1.5 rounded bg-[#080f1d] border border-slate-800/90 text-[8.5px] leading-snug"
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className="px-1 py-0.2 rounded text-[7px] font-black uppercase"
                    style={{
                      backgroundColor: `${ev.color || '#22d3ee'}20`,
                      color: ev.color || '#22d3ee',
                    }}
                  >
                    {ev.tag}
                  </span>
                  <span className="text-[7.5px] text-slate-500 tabular-nums">{ev.time}</span>
                </div>
                <div className="text-slate-200">{ev.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChamberTelemetryScreen;
