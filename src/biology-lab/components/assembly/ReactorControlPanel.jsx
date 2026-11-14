import React, { useState } from 'react';

/**
 * Tactile Nuclear-Reactor-Style Rotary Dial with SVG arc & numeric readout.
 */
export const RotaryDial = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  accent = '#22d3ee',
  onChange,
}) => {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angleDeg = -135 + pct * 270;

  return (
    <div className="flex flex-col items-center p-2 rounded-xl bg-[#070b14] border border-slate-700/70 shadow-inner">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg viewBox="0 0 64 64" className="w-14 h-14">
          <circle
            cx="32"
            cy="32"
            r="24"
            fill="#0b1220"
            stroke="#334155"
            strokeWidth="2.5"
          />
          {/* Gauge arc */}
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeDasharray={`${pct * 127} 170`}
            strokeLinecap="round"
            transform="rotate(135 32 32)"
          />
          {/* Knob indicator needle */}
          <g transform={`rotate(${angleDeg} 32 32)`}>
            <line
              x1="32"
              y1="32"
              x2="32"
              y2="12"
              stroke={accent}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="32" cy="32" r="4" fill="#cbd5e1" />
          </g>
        </svg>
      </div>
      <div className="text-[10px] font-mono font-black text-white -mt-1">
        {value}
        {unit}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-20 h-1.5 mt-1 accent-cyan-400 cursor-pointer"
      />
      <span className="text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-0.5 text-center">
        {label}
      </span>
    </div>
  );
};

/**
 * Physical Illuminated Reactor Breaker Button with Status LED.
 */
export const BreakerButton = ({
  label,
  sublabel,
  active = false,
  disabled = false,
  ledColor = '#10b981',
  onClick,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`px-2.5 py-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
      disabled
        ? 'bg-[#070b14] border-slate-800 text-slate-600 cursor-not-allowed opacity-55'
        : active
        ? 'bg-[#0f1f2e] border-cyan-400/80 text-white shadow-[0_0_12px_rgba(34,211,238,0.22)] cursor-pointer active:translate-y-px'
        : 'bg-[#0b1220] border-slate-700/80 hover:border-slate-500 text-slate-200 cursor-pointer active:translate-y-px'
    }`}
  >
    <div className="min-w-0">
      <div className="text-[9.5px] font-mono font-black uppercase tracking-wide truncate">
        {label}
      </div>
      {sublabel && (
        <div className="text-[8px] font-mono text-slate-400 truncate">{sublabel}</div>
      )}
    </div>
    <span
      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/50"
      style={{
        backgroundColor: active ? ledColor : '#1e293b',
        boxShadow: active ? `0 0 8px ${ledColor}` : 'none',
      }}
    />
  </button>
);

/**
 * Reusable 2-Tab Nuclear-Reactor-Style Bottom Control Panel:
 * Tab 1: Control Deck (Dials, Illuminated Breakers, Gauges)
 * Tab 2: Required Elements & Substrates (All unlocked)
 */
const ReactorControlPanel = ({
  deckTitle = 'BIOREACTOR CONTROL DECK',
  statusText = '',
  statusColor = '#22d3ee',
  elements = [],
  elementLevels = {},
  onInfuseElement,
  rightAction = null,
  children,
}) => {
  const [activeTab, setActiveTab] = useState('deck');

  return (
    <div className="bg-[#090e18] border-t-2 border-slate-700/80 px-4 py-2.5 flex flex-col gap-2 shrink-0 shadow-[0_-8px_24px_rgba(0,0,0,0.45)]">
      {/* Top Industrial Bezel Bar with 2 Tabs + Status LED */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('deck')}
            className={`px-3 py-1 rounded-lg font-mono text-[9.5px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
              activeTab === 'deck'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-[#070b14] border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            🎛️ Control Deck
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('elements')}
            className={`px-3 py-1 rounded-lg font-mono text-[9.5px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
              activeTab === 'elements'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-[#070b14] border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            ⚛️ Elements ({elements.length})
          </button>
          <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded bg-[#070b14] border border-slate-800 text-[9px] font-mono text-slate-300">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: statusColor }}
            />
            <span className="font-bold text-slate-400">{deckTitle}:</span>
            <span style={{ color: statusColor }}>{statusText}</span>
          </span>
        </div>

        {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
      </div>

      {/* Tab 1: Nuclear-Reactor Dials & Breakers */}
      {activeTab === 'deck' && <div>{children}</div>}

      {/* Tab 2: All Required Elements & Substrates (Unlocked) */}
      {activeTab === 'elements' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
          {elements.map((el) => {
            const level = elementLevels[el.id] ?? 100;
            return (
              <div
                key={el.id}
                className="p-2 rounded-xl bg-[#070b14] border border-slate-700/70 flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded font-mono text-[9px] font-black border border-white/10"
                    style={{ backgroundColor: `${el.color}22`, color: el.color }}
                  >
                    {el.symbol}
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 uppercase">
                    Unlocked • {Math.round(level)}%
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white truncate">{el.name}</div>
                  <div className="text-[8px] font-mono text-slate-400 truncate">{el.role}</div>
                </div>
                {onInfuseElement && (
                  <button
                    type="button"
                    onClick={() => onInfuseElement(el.id)}
                    className="w-full py-1 rounded-lg bg-[#0f172a] hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400 text-[8.5px] font-mono font-bold text-cyan-300 uppercase cursor-pointer"
                  >
                    ⚡ Infuse {el.symbol}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReactorControlPanel;
