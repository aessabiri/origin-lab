import React, { useRef, useState } from 'react';
import BioElementShapeCard from './BioElementShapeCard';

/**
 * Interactive Nuclear-Facility Rotary Potentiometer Knob.
 * Supports direct pointer drag on the knob, scroll wheel, and +/- fine step buttons.
 */
export const RotaryDial = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  optimalMin = null,
  optimalMax = null,
  accent = '#22d3ee',
  onChange,
}) => {
  const dragStartRef = useRef(null);
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angleDeg = -135 + pct * 270;

  const clampStep = (raw) => {
    const clamped = Math.max(min, Math.min(max, raw));
    return Math.round(clamped / step) * step;
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { y: e.clientY, startVal: value };
  };

  const onPointerMove = (e) => {
    if (!dragStartRef.current) return;
    const dy = dragStartRef.current.y - e.clientY;
    const delta = (dy / 90) * (max - min);
    onChange(clampStep(dragStartRef.current.startVal + delta));
  };

  const onPointerUp = (e) => {
    if (dragStartRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      dragStartRef.current = null;
    }
  };

  const optStartPct = optimalMin !== null ? (optimalMin - min) / (max - min) : null;
  const optEndPct = optimalMax !== null ? (optimalMax - min) / (max - min) : null;

  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-[#080d16] border border-slate-700/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.75)] select-none">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={(e) => {
          e.preventDefault();
          onChange(clampStep(value + (e.deltaY < 0 ? step : -step)));
        }}
        title={`Drag up/down or scroll to adjust ${label}`}
        className="relative w-16 h-16 cursor-ns-resize touch-none"
      >
        <svg viewBox="0 0 80 80" className="w-16 h-16">
          {/* Scale Ticks */}
          {Array.from({ length: 11 }).map((_, idx) => {
            const ta = ((-135 + idx * 27) * Math.PI) / 180;
            const x1 = 40 + Math.sin(ta) * 33;
            const y1 = 40 - Math.cos(ta) * 33;
            const x2 = 40 + Math.sin(ta) * 37;
            const y2 = 40 - Math.cos(ta) * 37;
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={idx === 0 || idx === 10 ? '#f43f5e' : '#64748b'}
                strokeWidth="1.5"
              />
            );
          })}

          {/* Optimal Operating Green Band */}
          {optStartPct !== null && optEndPct !== null && (
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              opacity="0.45"
              strokeDasharray={`${(optEndPct - optStartPct) * 141} 200`}
              strokeDashoffset={-optStartPct * 141}
              transform="rotate(135 40 40)"
            />
          )}

          {/* Active Value Arc */}
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeDasharray={`${pct * 141} 200`}
            strokeLinecap="round"
            transform="rotate(135 40 40)"
          />

          {/* Machined Metallic Knob Body */}
          <circle cx="40" cy="40" r="22" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <circle cx="40" cy="40" r="18" fill="#0f172a" stroke="#334155" strokeWidth="1" />

          {/* Rotating Indicator Notch */}
          <g transform={`rotate(${angleDeg} 40 40)`}>
            <line
              x1="40"
              y1="40"
              x2="40"
              y2="21"
              stroke={accent}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="40" cy="40" r="4" fill="#94a3b8" />
          </g>
        </svg>
      </div>

      {/* 7-Segment-Style Digital Readout + Fine +/- */}
      <div className="flex items-center gap-1 mt-0.5">
        <button
          type="button"
          onClick={() => onChange(clampStep(value - step))}
          className="w-4 h-4 rounded bg-slate-800 hover:bg-slate-700 text-[9px] font-mono text-slate-300 cursor-pointer"
        >
          -
        </button>
        <div className="px-1.5 py-0.5 rounded bg-black border border-slate-700 font-mono text-[10px] font-black text-emerald-400 min-w-[42px] text-center">
          {value}
          {unit}
        </div>
        <button
          type="button"
          onClick={() => onChange(clampStep(value + step))}
          className="w-4 h-4 rounded bg-slate-800 hover:bg-slate-700 text-[9px] font-mono text-slate-300 cursor-pointer"
        >
          +
        </button>
      </div>

      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
};

/**
 * Analog Moving-Needle Telemetry Gauge.
 */
export const AnalogMeter = ({ label, value = 0, accent = '#22d3ee' }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const angle = -75 + (clamped / 100) * 150;
  return (
    <div className="flex flex-col items-center px-2 py-1.5 rounded-lg bg-[#05080f] border border-slate-700/80 shadow-inner min-w-[76px]">
      <svg viewBox="0 0 80 46" className="w-16 h-9">
        <path
          d="M 10 40 A 30 30 0 0 1 70 40"
          fill="none"
          stroke="#1e293b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 10 40 A 30 30 0 0 1 70 40"
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeDasharray={`${(clamped / 100) * 94} 100`}
          strokeLinecap="round"
        />
        <g transform={`rotate(${angle} 40 40)`}>
          <line x1="40" y1="40" x2="40" y2="14" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="40" r="3.5" fill="#94a3b8" />
        </g>
      </svg>
      <div className="text-[9.5px] font-mono font-black text-white -mt-1">{Math.round(clamped)}%</div>
      <div className="text-[7.5px] font-mono text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );
};

/**
 * Physical Illuminated Reactor Breaker Switch with Status LED & Guarded Bezel.
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
    className={`px-2.5 py-2 rounded-lg border-2 text-left transition-all flex items-center justify-between gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
      disabled
        ? 'bg-[#070b14] border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
        : active
        ? 'bg-[#0d1f2d] border-cyan-400/80 text-white shadow-[0_0_14px_rgba(34,211,238,0.22)] cursor-pointer active:translate-y-px'
        : 'bg-[#111827] border-slate-700 hover:border-slate-500 text-slate-200 cursor-pointer active:translate-y-px'
    }`}
  >
    <div className="min-w-0">
      <div className="text-[9px] font-mono font-black uppercase tracking-wider truncate">
        {label}
      </div>
      {sublabel && (
        <div className="text-[7.5px] font-mono text-slate-400 truncate">{sublabel}</div>
      )}
    </div>
    <div className="flex flex-col items-center gap-0.5 shrink-0">
      <span
        className="w-3 h-3 rounded-full border border-black"
        style={{
          backgroundColor: active ? ledColor : '#1e293b',
          boxShadow: active ? `0 0 9px ${ledColor}` : 'none',
        }}
      />
      <span className="text-[6.5px] font-mono text-slate-500">{active ? 'ON' : 'OFF'}</span>
    </div>
  </button>
);

/**
 * Nuclear-Facility-Style 2-Tab Bioreactor Control Console:
 * - Annunciator Alarm Tile Strip
 * - Tab 1: Control Deck (Rotary Potentiometers, Illuminated Breakers, Analog Meters)
 * - Tab 2: Required Elements (Real SVG Shape Cards, all unlocked)
 */
const ReactorControlPanel = ({
  deckTitle = 'REACTOR CONSOLE',
  annunciators = [],
  elements = [],
  elementLevels = {},
  onInfuseElement,
  onPrimeAll,
  rightAction = null,
  children,
}) => {
  const [activeTab, setActiveTab] = useState('deck');

  return (
    <div className="bg-gradient-to-b from-[#111827] to-[#080d16] border-t-2 border-slate-600/80 px-3.5 py-2.5 flex flex-col gap-2 shrink-0 shadow-[0_-10px_28px_rgba(0,0,0,0.65)]">
      {/* Top Industrial Bezel + Annunciator Alarm Tiles */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/70 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-500 border border-slate-300/30" />
          <span className="text-[8.5px] font-mono font-black text-slate-400 uppercase tracking-widest mr-1">
            {deckTitle}
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('deck')}
            className={`px-2.5 py-1 rounded font-mono text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
              activeTab === 'deck'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-[#070b14] border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            🎛️ Control Board
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('elements')}
            className={`px-2.5 py-1 rounded font-mono text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
              activeTab === 'elements'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-[#070b14] border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            ⚛️ Elements ({elements.length})
          </button>
        </div>

        {/* Classic Nuclear Annunciator Lamp Tiles */}
        {annunciators.length > 0 && (
          <div className="hidden xl:flex items-center gap-1 bg-black/60 p-1 rounded border border-slate-700/80">
            {annunciators.map((tile, idx) => {
              const cls =
                tile.state === 'alarm'
                  ? 'bg-rose-600/30 border-rose-400 text-rose-200 animate-pulse'
                  : tile.state === 'warn'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                  : tile.state === 'ok'
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                  : 'bg-[#0a0f1a] border-slate-800 text-slate-600';
              return (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 rounded-sm border font-mono text-[7.5px] font-black uppercase tracking-wider ${cls}`}
                >
                  {tile.label}
                </span>
              );
            })}
          </div>
        )}

        {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
      </div>

      {/* Tab 1: Nuclear Facility Control Board */}
      {activeTab === 'deck' && <div>{children}</div>}

      {/* Tab 2: Visual Shape Cards for All Required Elements */}
      {activeTab === 'elements' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[8.5px] font-mono text-slate-400 uppercase">
              Click any substrate shape to infuse into the bioreactor chamber (All Unlocked)
            </span>
            {onPrimeAll && (
              <button
                type="button"
                onClick={onPrimeAll}
                className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400 text-cyan-200 font-mono text-[8.5px] font-black uppercase cursor-pointer"
              >
                ⚡ Infuse All Substrates
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {elements.map((el) => (
              <BioElementShapeCard
                key={el.id}
                element={el}
                level={elementLevels[el.id] ?? 0}
                onInfuse={onInfuseElement}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactorControlPanel;
