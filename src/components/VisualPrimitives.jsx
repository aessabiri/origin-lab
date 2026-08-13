import React from 'react';

/**
 * Nixie Tube Display
 * Renders numbers with a vintage neon glow effect.
 */
export const NixieTube = ({ value, digits = 3, size = 'md' }) => {
  const strValue = String(Math.floor(value)).padStart(digits, '0');
  
  const sizeClasses = {
    sm: 'text-2xl h-10 w-6',
    md: 'text-4xl h-14 w-10',
    lg: 'text-6xl h-20 w-14'
  };

  return (
    <div className="flex gap-1 bg-black/40 p-2 rounded-lg border-b-4 border-black/60 shadow-inner">
      {strValue.split('').map((char, i) => (
        <div 
          key={i} 
          className={`${sizeClasses[size]} relative bg-zinc-900 border border-amber-900/30 rounded flex items-center justify-center font-mono overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
          <span className="absolute inset-0 flex items-center justify-center text-amber-950/20 pointer-events-none">8</span>
          <span className="relative z-10 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse">
            {char}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Analog Gauge (High Precision SVG)
 */
export const AnalogGauge = ({ label, value, min = 0, max = 100, color = 'emerald' }) => {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const rotation = -135 + (percent * 2.7); 
  
  const colorMap = {
    emerald: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
    blue: '#3b82f6'
  };
  const activeColor = colorMap[color] || colorMap.emerald;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.5)] bg-zinc-900"></div>
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-2 -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#18181b" strokeWidth="8" strokeDasharray="188.5" strokeDashoffset="62.8" className="rotate-[135deg] origin-center" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={activeColor} strokeWidth="8" strokeDasharray="188.5" strokeDashoffset={188.5 - (percent * 1.885)} className="rotate-[135deg] origin-center transition-all duration-1000 ease-out opacity-40" />
          {[...Array(9)].map((_, i) => (
            <line key={i} x1="50" y1="15" x2="50" y2="20" stroke="#3f3f46" strokeWidth="2" transform={`rotate(${-135 + (i * 33.75)} 50 50)`} />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-2 h-2 bg-zinc-700 rounded-full border border-zinc-900 z-20"></div>
           <div className="absolute w-0.5 h-10 bg-red-600 origin-bottom transition-transform duration-700 ease-out z-10" style={{ transform: `translateY(-50%) rotate(${rotation}deg)`, boxShadow: '0 0 5px rgba(220,38,38,0.5)' }}></div>
        </div>
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30"></div>
      </div>
      <div className="mt-2 flex flex-col items-center text-center">
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-mono font-bold text-white">{Math.floor(value)}</span>
      </div>
    </div>
  );
};

/**
 * Oscilloscope Display
 */
export const Oscilloscope = ({ color = 'emerald', active = true }) => {
  const colorMap = { emerald: 'stroke-emerald-500', amber: 'stroke-amber-500', red: 'stroke-red-500' };
  return (
    <div className="w-full h-16 bg-[#050505] border-2 border-zinc-800 rounded shadow-inner overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:10px_10px]"></div>
      <svg viewBox="0 0 200 60" className="w-full h-full relative z-10">
        <path d="M 0 30 Q 25 10 50 30 T 100 30 T 150 30 T 200 30" fill="none" strokeWidth="2" className={`${colorMap[color]} transition-all ${active ? 'animate-wave' : 'opacity-20'}`} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

/**
 * Bakelite Texture Wrapper
 */
export const BakelitePanel = ({ children, className = '' }) => (
  <div className={`bg-[#1a1a1a] bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:4px_4px] border-2 border-[#0a0a0a] shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

/**
 * NeoSphere
 */
export const NeoSphere = ({ color, size = 40, label, glow = true, x, y, r }) => {
  // Support both x/y/r props (SVG) and style-based positioning (DOM)
  const isSvg = x !== undefined && y !== undefined;
  
  const content = (
    <g transform={isSvg ? `translate(${x},${y})` : ''}>
      <circle r={r || size/2} fill="black" opacity="0.4" transform="translate(1, 2)" />
      <circle 
        r={r || size/2} 
        fill={color} 
        className={glow ? 'shadow-lg' : ''}
        style={{ filter: glow ? 'drop-shadow(0 0 5px currentColor)' : 'none' }}
      />
      <circle r={r || size/2} fill="url(#neo-grad)" opacity="0.4" />
      {label && <text y={isSvg ? 4 : '0.35em'} textAnchor="middle" fill="white" fontSize={r ? r * 0.8 : 12} fontWeight="bold">{label}</text>}
    </g>
  );

  if (isSvg) return content;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="neo-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
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
export const NeoBond = ({ x1, y1, x2, y2, type = 'single', color = 'stroke-gray-400' }) => {
  const widthMap = { single: 6, double: 10, triple: 14 };
  const innerWidthMap = { single: 2, double: 4, triple: 6 };
  return (
    <g className="pointer-events-none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={color} strokeWidth={widthMap[type]} strokeLinecap="round" opacity="0.3" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={innerWidthMap[type]} strokeLinecap="round" opacity="0.6" />
    </g>
  );
};

/**
 * Vintage Toggle Switch
 */
export const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
    <button onClick={onChange} className={`w-10 h-16 bg-zinc-900 border-4 border-zinc-800 rounded-lg p-1 transition-all flex flex-col items-center justify-between shadow-inner`}>
      <div className={`w-6 h-6 rounded border-2 transition-all ${checked ? 'bg-zinc-800 border-zinc-700 order-last' : 'bg-red-900 border-red-800'}`}></div>
      <div className={`w-1 h-4 bg-zinc-800 rounded-full`}></div>
      <div className={`w-6 h-6 rounded border-2 transition-all ${!checked ? 'bg-zinc-800 border-zinc-700 order-first' : 'bg-emerald-900 border-emerald-800'}`}></div>
    </button>
  </div>
);
