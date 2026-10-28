import React from 'react';

/**
 * High-Precision Digital Telemetry Tube
 * Renders glowing digital numerals with crisp ambient highlights
 */
export const NixieTube = ({ value, digits = 3, size = 'md' }) => {
  const strValue = String(Math.floor(value)).padStart(digits, '0');
  
  const sizeClasses = {
    sm: 'text-lg h-8 w-6',
    md: 'text-2xl h-11 w-8',
    lg: 'text-4xl h-16 w-12'
  };

  return (
    <div className="flex gap-1.5 bg-[#060a14]/90 p-2 rounded-xl border border-cyan-500/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
      {strValue.split('').map((char, i) => (
        <div 
          key={i} 
          className={`${sizeClasses[size]} relative bg-[#090f1d] border border-cyan-500/30 rounded-lg flex items-center justify-center font-mono overflow-hidden shadow-inner`}
        >
          {/* Subtle Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:100%_3px] pointer-events-none" />
          {/* Ghost Number Backplate */}
          <span className="absolute inset-0 flex items-center justify-center text-cyan-950/40 font-black pointer-events-none select-none">
            8
          </span>
          {/* Active Glowing Numeral */}
          <span className="relative z-10 text-cyan-300 font-black drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            {char}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Precision Digital Telemetry Gauge (High Precision SVG Arc)
 */
export const AnalogGauge = ({ label, value, min = 0, max = 100, color = 'emerald' }) => {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const rotation = -135 + (percent * 2.7); 
  
  const colorMap = {
    emerald: { stroke: '#10b981', glow: 'rgba(16,185,129,0.5)', text: 'text-emerald-400' },
    amber: { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.5)', text: 'text-amber-400' },
    red: { stroke: '#ef4444', glow: 'rgba(239,68,68,0.5)', text: 'text-rose-400' },
    blue: { stroke: '#38bdf8', glow: 'rgba(56,189,248,0.5)', text: 'text-cyan-400' }
  };
  const activeColor = colorMap[color] || colorMap.emerald;

  return (
    <div className="flex flex-col items-center group select-none">
      <div className="relative w-24 h-24">
        {/* Bezel Ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/25 shadow-[0_4px_16px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] bg-[#090e1b]"></div>
        
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-2 -rotate-90">
          {/* Track Arc */}
          <circle 
            cx="50" cy="50" r="38" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="6" 
            strokeDasharray="179" 
            strokeDashoffset="59.7" 
            className="rotate-[135deg] origin-center" 
          />
          {/* Active Value Arc */}
          <circle 
            cx="50" cy="50" r="38" 
            fill="none" 
            stroke={activeColor.stroke} 
            strokeWidth="6" 
            strokeDasharray="179" 
            strokeDashoffset={179 - (percent * 1.79)} 
            strokeLinecap="round"
            className="rotate-[135deg] origin-center transition-all duration-700 ease-out" 
            style={{ filter: `drop-shadow(0 0 4px ${activeColor.glow})` }}
          />
          {/* Tick Markers */}
          {[...Array(9)].map((_, i) => (
            <line 
              key={i} 
              x1="50" y1="17" x2="50" y2="21" 
              stroke="#475569" 
              strokeWidth="1.5" 
              transform={`rotate(${-135 + (i * 33.75)} 50 50)`} 
            />
          ))}
        </svg>

        {/* Center Pivot & Needle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-2.5 h-2.5 bg-slate-300 rounded-full border border-slate-900 shadow-md z-20"></div>
           <div 
             className="absolute w-0.5 h-10 bg-gradient-to-t from-cyan-500 to-white origin-bottom transition-transform duration-500 ease-out z-10" 
             style={{ 
               transform: `translateY(-50%) rotate(${rotation}deg)`, 
               boxShadow: `0 0 6px ${activeColor.stroke}` 
             }}
           />
        </div>
      </div>
      
      {/* Telemetry Labels */}
      <div className="mt-2 flex flex-col items-center text-center">
        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-xs font-mono font-black ${activeColor.text}`}>
          {Math.floor(value)}
        </span>
      </div>
    </div>
  );
};

/**
 * High-Precision Telemetry Oscilloscope
 */
export const Oscilloscope = ({ color = 'emerald', active = true }) => {
  const colorMap = { 
    emerald: 'stroke-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]', 
    amber: 'stroke-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]', 
    red: 'stroke-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]',
    teal: 'stroke-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]'
  };

  return (
    <div className="w-full h-16 bg-[#060a14] border border-cyan-500/25 rounded-xl shadow-inner overflow-hidden relative">
      {/* Precision Telemetry Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(rgba(56,189,248,0.06)_1px,transparent_1px)] [background-size:12px_12px]" />
      <svg viewBox="0 0 200 60" className="w-full h-full relative z-10">
        <path 
          d="M 0 30 Q 25 10 50 30 T 100 30 T 150 30 T 200 30" 
          fill="none" 
          strokeWidth="2" 
          className={`${colorMap[color] || colorMap.emerald} transition-all ${active ? 'animate-wave' : 'opacity-25'}`} 
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};

/**
 * Quantum Telemetry Panel (Formerly BakelitePanel)
 * Upgraded into a cohesive OLED Sci-Fi Glassmorphic Card
 */
export const BakelitePanel = ({ children, className = '' }) => (
  <div className={`bg-[#0c1220]/90 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

/**
 * NeoSphere
 */
export const NeoSphere = ({ color, size = 40, label, glow = true, x, y, r }) => {
  const isSvg = x !== undefined && y !== undefined;
  
  const content = (
    <g transform={isSvg ? `translate(${x},${y})` : ''}>
      <circle r={r || size/2} fill="black" opacity="0.4" transform="translate(1, 2)" />
      <circle 
        r={r || size/2} 
        fill={color} 
        style={{ filter: glow ? `drop-shadow(0 0 6px ${color})` : 'none' }}
      />
      <circle r={r || size/2} fill="url(#neo-grad)" opacity="0.35" />
      {label && (
        <text 
          y={isSvg ? 4 : '0.35em'} 
          textAnchor="middle" 
          fill="#ffffff" 
          fontSize={r ? r * 0.8 : 12} 
          fontWeight="900"
          fontFamily="monospace"
        >
          {label}
        </text>
      )}
    </g>
  );

  if (isSvg) return content;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="neo-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="100%" stopColor="black" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <g transform="translate(50,50)">{content}</g>
      </svg>
    </div>
  );
};

/**
 * NeoBond
 */
export const NeoBond = ({ x1, y1, x2, y2, type = 'single', color = 'stroke-cyan-500/40' }) => {
  const widthMap = { single: 5, double: 8, triple: 12 };
  const innerWidthMap = { single: 2, double: 3, triple: 5 };
  return (
    <g className="pointer-events-none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={color} strokeWidth={widthMap[type]} strokeLinecap="round" opacity="0.4" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={innerWidthMap[type]} strokeLinecap="round" opacity="0.75" />
    </g>
  );
};

/**
 * Precision Telemetry Toggle Switch
 */
export const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex flex-col items-center gap-2 select-none">
    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <button 
      onClick={onChange} 
      className={`w-12 h-6 rounded-full p-0.5 transition-all duration-300 flex items-center border ${
        checked 
          ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] justify-end' 
          : 'bg-slate-900 border-slate-700 justify-start'
      }`}
    >
      <div className={`w-4.5 h-4.5 rounded-full transition-all duration-300 shadow-md ${
        checked 
          ? 'bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
          : 'bg-slate-500'
      }`} />
    </button>
  </div>
);
