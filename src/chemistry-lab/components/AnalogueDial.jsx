import React from 'react';

const AnalogueDial = ({ 
  label, 
  value, 
  min, 
  max, 
  unit, 
  color = '#3b82f6', 
  onChange, 
  disabled = false 
}) => {
  // Normalize value to 0-1 range for rotation
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
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
      const sensitivity = range / 200; // Pixels to full range
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

  // Generate tick marks
  const renderTicks = () => {
    const ticks = [];
    const tickCount = 10; // Number of major intervals
    for (let i = 0; i <= tickCount; i++) {
        const percent = i / tickCount;
        const deg = startAngle + (percent * angleRange);
        // Convert polar to cartesian for SVG lines
        // Center is 50, 50. Radius is 40.
        // x = cx + r * cos(a)
        // y = cy + r * sin(a)
        // SVG rotation is usually clockwise from 3 o'clock (0deg). Our -135 is roughly 7:30.
        // Math.cos takes radians.
        
        // We can just use transform rotate on the lines for simplicity in SVG
        const isMajor = true; 
        
        ticks.push(
            <line 
                key={i}
                x1="50" y1="10" 
                x2="50" y2={isMajor ? "18" : "14"} 
                stroke={i === tickCount && color === '#ef4444' ? 'red' : '#9ca3af'} // Red zone for last tick if heat
                strokeWidth={isMajor ? "2" : "1"}
                transform={`rotate(${deg}, 50, 50)`}
            />
        );
    }
    return ticks;
  };

  return (
    <div className="flex flex-col items-center select-none group">
      <div 
        className={`relative w-20 h-20 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-ns-resize hover:scale-105'} transition-transform`}
        onMouseDown={handleMouseDown}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
                {/* Metallic Bezel Gradient */}
                <linearGradient id="bezel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#555" />
                    <stop offset="50%" stopColor="#eee" />
                    <stop offset="100%" stopColor="#333" />
                </linearGradient>
                {/* Face Gradient */}
                <radialGradient id="face-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="80%" stopColor="#1f2937" />
                    <stop offset="100%" stopColor="#000" />
                </radialGradient>
                {/* Needle Shadow */}
                <filter id="dropShadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                    <feOffset dx="1" dy="1" result="offsetblur" />
                    <feMerge> 
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" /> 
                    </feMerge>
                </filter>
            </defs>

            {/* Bezel */}
            <circle cx="50" cy="50" r="48" fill="url(#bezel-grad)" stroke="#111" strokeWidth="1" />
            
            {/* Dark Face */}
            <circle cx="50" cy="50" r="44" fill="url(#face-grad)" stroke="#000" strokeWidth="1" />

            {/* Color Arc (Active Range) */}
            {/* Simple arc representing 'on' state could be complex, skipping for cleaner look or adding subtle glow */}
            
            {/* Ticks */}
            {renderTicks()}

            {/* Label Text */}
            <text x="50" y="70" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="monospace" fontWeight="bold">{label}</text>
            <text x="50" y="80" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="monospace">{unit}</text>

            {/* Needle */}
            <g transform={`rotate(${rotation}, 50, 50)`} filter="url(#dropShadow)">
                <path d="M 48 50 L 50 15 L 52 50 L 50 55 Z" fill={color} />
                <circle cx="50" cy="50" r="3" fill="#333" stroke="#111" strokeWidth="0.5" />
            </g>

            {/* Glass Reflection / Glare */}
            <path d="M 50 6 A 44 44 0 0 1 90 35 A 60 60 0 0 0 10 35 A 44 44 0 0 1 50 6" fill="white" opacity="0.1" pointerEvents="none" />
        </svg>
      </div>
      
      {/* Digital Readout Box */}
      <div className="mt-1 bg-black/40 px-2 py-0.5 rounded border border-gray-700 text-[10px] font-mono font-bold text-center min-w-[40px] shadow-inner">
        <span className={value > max * 0.9 ? 'text-red-500 animate-pulse' : 'text-gray-200'}>
            {value}
        </span>
      </div>
    </div>
  );
};

export default AnalogueDial;