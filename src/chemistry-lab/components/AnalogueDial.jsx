import React, { useState, useRef, useCallback } from 'react';

const AnalogueDial = ({ 
  label, 
  value = 0, 
  min = 0, 
  max = 100, 
  unit = '', 
  color = '#10b981', 
  onChange, 
  disabled = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(value);
  const dialRef = useRef(null);

  // Normalize value to 0-1 range for rotation
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  // Rotation: -135deg (min) to +135deg (max) => Total 270deg range
  const angleRange = 270;
  const startAngle = -135;
  const rotation = startAngle + (normalized * angleRange);

  const handleMouseDown = (e) => {
    if (disabled || !onChange) return;
    
    const startY = e.clientY;
    const startVal = value;
    
    const handleMouseMove = (moveEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const range = max - min;
      const sensitivity = range / 200;
      const newVal = Math.max(min, Math.min(max, startVal + (deltaY * sensitivity)));
      onChange(Math.round(newVal));
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleWheel = useCallback((e) => {
    if (disabled || !onChange) return;
    e.preventDefault();
    const step = (max - min) > 100 ? 5 : 1;
    const delta = e.deltaY < 0 ? step : -step;
    const newVal = Math.max(min, Math.min(max, value + delta));
    onChange(Math.round(newVal));
  }, [disabled, onChange, max, min, value]);

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const parsed = parseFloat(editVal);
      if (!isNaN(parsed) && onChange) {
        onChange(Math.max(min, Math.min(max, Math.round(parsed))));
      }
      setIsEditing(false);
    }
  };

  // Generate tick marks
  const renderTicks = () => {
    const ticks = [];
    const tickCount = 12;
    for (let i = 0; i <= tickCount; i++) {
      const percent = i / tickCount;
      const deg = startAngle + (percent * angleRange);
      const isMajor = i % 3 === 0;
      const isActive = percent <= normalized;
      
      ticks.push(
        <line 
          key={i}
          x1="50" y1="12" 
          x2="50" y2={isMajor ? "19" : "15"} 
          stroke={isActive ? color : '#334155'} 
          strokeWidth={isMajor ? "2" : "1"}
          strokeLinecap="round"
          transform={`rotate(${deg}, 50, 50)`}
          className="transition-colors duration-150"
        />
      );
    }
    return ticks;
  };

  return (
    <div className="flex flex-col items-center select-none group">
      <div 
        ref={dialRef}
        className={`relative w-20 h-20 rounded-full transition-transform duration-200 ${
          disabled ? 'cursor-not-allowed opacity-70' : 'cursor-ns-resize hover:scale-105 active:scale-95'
        }`}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        title={disabled ? `${label}: ${value} ${unit}` : `Drag up/down or scroll to adjust ${label}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(0,0,0,0.8)]">
          <defs>
            <linearGradient id={`bezel-grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            
            <radialGradient id={`dial-glow-${label}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0.9" />
            </radialGradient>

            <filter id={`dial-shadow-${label}`}>
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.7"/>
            </filter>
          </defs>

          {/* Outer Bezel Rim */}
          <circle cx="50" cy="50" r="48" fill="url(#bezel-grad-${label})" stroke="#334155" strokeWidth="1.5" />
          
          {/* Inner Glowing Face */}
          <circle cx="50" cy="50" r="43" fill={`url(#dial-glow-${label})`} stroke="#1e293b" strokeWidth="1" />

          {/* Background Arc */}
          <circle 
            cx="50" cy="50" r="35" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="3" 
            strokeDasharray="165 220"
            strokeDashoffset="-30"
            strokeLinecap="round"
          />

          {/* Active Arc */}
          <circle 
            cx="50" cy="50" r="35" 
            fill="none" 
            stroke={color} 
            strokeWidth="3.5" 
            strokeDasharray={`${normalized * 165} 220`}
            strokeDashoffset="-30"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            className="transition-all duration-100"
          />

          {/* Ticks */}
          {renderTicks()}

          {/* Label Text */}
          <text x="50" y="68" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="900" letterSpacing="0.5">
            {label}
          </text>

          {/* Needle */}
          <g transform={`rotate(${rotation}, 50, 50)`} filter={`url(#dial-shadow-${label})`} className="transition-transform duration-75 ease-out">
            {/* Needle Body */}
            <path d="M 48.5 50 L 50 16 L 51.5 50 L 50 53 Z" fill={color} />
            <circle cx="50" cy="50" r="4.5" fill="#0f172a" stroke={color} strokeWidth="1.5" />
            <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
          </g>

          {/* Glass Glare */}
          <path d="M 50 8 A 42 42 0 0 1 88 35 A 55 55 0 0 0 12 35 A 42 42 0 0 1 50 8" fill="white" opacity="0.06" pointerEvents="none" />
        </svg>
      </div>
      
      {/* Digital Readout Pill */}
      <div 
        onClick={() => { if (!disabled) { setIsEditing(true); setEditVal(value); } }}
        className={`mt-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-mono font-black text-center min-w-[54px] transition-all shadow-inner ${
          disabled 
            ? 'bg-[#0a0f1d] border-slate-800 text-slate-400' 
            : 'bg-[#070c18] border-slate-700/80 hover:border-emerald-500/50 hover:bg-[#0c1424] cursor-pointer'
        }`}
      >
        {isEditing ? (
          <input
            type="number"
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            onKeyDown={handleInputSubmit}
            onBlur={handleInputSubmit}
            autoFocus
            className="w-12 bg-transparent text-emerald-400 font-mono text-center outline-none"
          />
        ) : (
          <span style={{ color }}>
            {value} <span className="text-[9px] text-slate-500 font-normal">{unit}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(AnalogueDial);