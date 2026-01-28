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
          {/* Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
          
          {/* Filaments (Stacked background numbers) */}
          <span className="absolute inset-0 flex items-center justify-center text-amber-950/20 pointer-events-none">8</span>
          
          {/* Active Digit */}
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
 * A circular meter with a needle and glass effect.
 */
export const AnalogGauge = ({ label, value, min = 0, max = 100, color = 'emerald' }) => {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const rotation = -135 + (percent * 2.7); // -135 to +135 degrees (270 deg total)
  
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
        {/* Outer Rim */}
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.5)] bg-zinc-900"></div>
        
        {/* SVG Arc and Ticks */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-2 -rotate-90">
          {/* Background Track */}
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" stroke="#18181b" strokeWidth="8" 
            strokeDasharray="188.5" strokeDashoffset="62.8" // 3/4 circle
            className="rotate-[135deg] origin-center"
          />
          {/* Active Track */}
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" stroke={activeColor} strokeWidth="8" 
            strokeDasharray="188.5" 
            strokeDashoffset={188.5 - (percent * 1.885)} 
            className="rotate-[135deg] origin-center transition-all duration-1000 ease-out opacity-40"
          />
          {/* Ticks */}
          {[...Array(9)].map((_, i) => (
            <line 
              key={i} x1="50" y1="15" x2="50" y2="20" 
              stroke="#3f3f46" strokeWidth="2"
              transform={`rotate(${-135 + (i * 33.75)} 50 50)`}
            />
          ))}
        </svg>

        {/* Center Hub */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-2 h-2 bg-zinc-700 rounded-full border border-zinc-900 z-20"></div>
           {/* Needle */}
           <div 
             className="absolute w-0.5 h-10 bg-red-600 origin-bottom transition-transform duration-700 ease-out z-10"
             style={{ 
                transform: `translateY(-50%) rotate(${rotation}deg)`,
                boxShadow: '0 0-5px rgba(220,38,38,0.5)'
             }}
           ></div>
        </div>

        {/* Glass Reflection */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30"></div>
      </div>
      
      <div className="mt-2 flex flex-col items-center">
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-mono font-bold text-white">{Math.floor(value)}</span>
      </div>
    </div>
  );
};

/**
 * Oscilloscope Display
 * Animated wave indicating activity.
 */
export const Oscilloscope = ({ color = 'emerald', active = true }) => {
  const colorMap = {
    emerald: 'stroke-emerald-500',
    amber: 'stroke-amber-500',
    red: 'stroke-red-500'
  };

  return (
    <div className="w-full h-16 bg-[#050505] border-2 border-zinc-800 rounded shadow-inner overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:10px_10px]"></div>
      <svg viewBox="0 0 200 60" className="w-full h-full relative z-10">
        <path 
          d="M 0 30 Q 25 10 50 30 T 100 30 T 150 30 T 200 30" 
          fill="none" 
          strokeWidth="2"
          className={`${colorMap[color]} transition-all ${active ? 'animate-wave' : 'opacity-20'}`}
        />
      </svg>
      {/* Scanline reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

/**
 * Bakelite Texture Wrapper
 * Provides a dark, speckled, vintage plastic look.
 */
export const BakelitePanel = ({ children, className = '' }) => (
  <div className={`
    bg-[#1a1a1a] 
    bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] 
    [background-size:4px_4px] 
    border-2 border-[#0a0a0a] 
    shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)]
    rounded-xl overflow-hidden
    ${className}
  `}>
    {children}
  </div>
);

/**
 * NeoSphere
 * A 3D-effect sphere used for atoms/particles.
 */
export const NeoSphere = ({ color, size = 40, label, glow = true }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    {/* Shadow */}
    <div className="absolute inset-0 rounded-full bg-black/40 blur-[2px] translate-y-[10%] scale-[0.9]"></div>
    
    {/* Main Sphere */}
    <div 
      className={`absolute inset-0 rounded-full shadow-lg ${color} border border-white/10`}
      style={{
        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
        boxShadow: glow ? `0 0 15px currentColor` : 'none'
      }}
    >
      <div className={`absolute inset-0 rounded-full ${color} opacity-80`}></div>
    </div>

    {/* Surface Detail / Gloss */}
    <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-white/20 rounded-full blur-[1px]"></div>

    {/* Label */}
    {label && (
      <span className="relative z-10 text-[10px] font-black text-white pointer-events-none drop-shadow-md">
        {label}
      </span>
    )}
  </div>
);

/**
 * NeoBond
 * SVG line(s) for chemical bonds.
 */
export const NeoBond = ({ x1, y1, x2, y2, type = 'single', color = 'stroke-gray-400' }) => {
  const isDouble = type === 'double';
  const isTriple = type === 'triple';

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: -1 }}>
      <defs>
        <filter id="bondGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {isDouble ? (
        <>
          <line x1={x1} y1={y1 - 2} x2={x2} y2={y2 - 2} className={color} strokeWidth="3" strokeLinecap="round" filter="url(#bondGlow)" />
          <line x1={x1} y1={y1 + 2} x2={x2} y2={y2 + 2} className={color} strokeWidth="3" strokeLinecap="round" filter="url(#bondGlow)" />
        </>
      ) : isTriple ? (
        <>
          <line x1={x1} y1={y1 - 4} x2={x2} y2={y2 - 4} className={color} strokeWidth="2" strokeLinecap="round" filter="url(#bondGlow)" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} className={color} strokeWidth="2" strokeLinecap="round" filter="url(#bondGlow)" />
          <line x1={x1} y1={y1 + 4} x2={x2} y2={y2 + 4} className={color} strokeWidth="2" strokeLinecap="round" filter="url(#bondGlow)" />
        </>
      ) : (
        <line x1={x1} y1={y1} x2={x2} y2={y2} className={color} strokeWidth="4" strokeLinecap="round" filter="url(#bondGlow)" opacity="0.6" />
      )}
    </svg>
  );
};

/**
 * Vintage Toggle Switch
 */
export const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
    <button 
      onClick={onChange}
      className={`w-10 h-16 bg-zinc-900 border-4 border-zinc-800 rounded-lg p-1 transition-all flex flex-col items-center justify-between shadow-inner`}
    >
      <div className={`w-6 h-6 rounded border-2 transition-all ${checked ? 'bg-zinc-800 border-zinc-700 order-last' : 'bg-red-900 border-red-800'}`}></div>
      <div className={`w-1 h-4 bg-zinc-800 rounded-full`}></div>
      <div className={`w-6 h-6 rounded border-2 transition-all ${!checked ? 'bg-zinc-800 border-zinc-700 order-first' : 'bg-emerald-900 border-emerald-800'}`}></div>
    </button>
  </div>
);