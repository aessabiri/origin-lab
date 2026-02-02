import React, { useMemo } from 'react';
import { useChemistryStore } from '../store';
import { MATTER_DEFINITIONS } from '../../constants/matterRegistry';

const Condenser = () => {
  const condenser = useChemistryStore(state => state.condenser);
  const emptyCondenser = useChemistryStore(state => state.emptyCondenser);
  const toggleCondenserValve = useChemistryStore(state => state.toggleCondenserValve);
  
  const totalVolume = Object.values(condenser.contents).reduce((a, b) => a + b, 0);
  const fillPercentage = Math.min((totalVolume / condenser.maxVol) * 100, 100);

  const dominantColor = useMemo(() => {
    const dominant = Object.entries(condenser.contents).sort((a,b) => b[1] - a[1])[0];
    if (!dominant) return '#3b82f6';
    return MATTER_DEFINITIONS[dominant[0]]?.color || '#3b82f6';
  }, [condenser.contents]);

  const handleCollect = () => {
      emptyCondenser();
  };

  return (
    <div className="relative flex flex-col items-center justify-end h-[300px] -ml-8 mb-4 pointer-events-none">
        
        {/* GLASSWARE SVG LAYER */}
        <svg width="140" height="280" viewBox="0 0 140 280" className="drop-shadow-lg z-10 overflow-visible">
            <defs>
                <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="20%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="80%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                </linearGradient>
                <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={dominantColor} stopOpacity="0.8"/>
                    <stop offset="100%" stopColor={dominantColor} stopOpacity="0.9"/>
                </linearGradient>
            </defs>

            {/* 1. Connection Tube (Arching from left flask) */}
            {/* Starts at (-20, 100) assuming flask neck is there, arches to (70, 40) top of condenser */}
            <path d="M -30 140 Q -30 80 20 60 T 70 60" 
                  fill="none" 
                  stroke="rgba(200,200,200,0.3)" 
                  strokeWidth="12" 
                  strokeLinecap="round"
            />
            {/* Inner path for vapor */}
            <path d="M -30 140 Q -30 80 20 60 T 70 60" 
                  fill="none" 
                  stroke={condenser.isActive ? "rgba(200,255,255,0.4)" : "rgba(100,100,100,0.1)"} 
                  strokeWidth="4" 
                  strokeDasharray={condenser.isActive ? "none" : "4 2"}
                  className="transition-all duration-500"
            />

            {/* 2. Condenser Body (Vertical Column) */}
            <g transform="translate(55, 60)">
                {/* Outer Jacket */}
                <rect x="0" y="0" width="30" height="140" rx="4" fill="url(#glass-gradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                
                {/* Cooling Water (Static Blue Tint) */}
                <rect x="2" y="2" width="26" height="136" rx="2" fill="rgba(0,255,255,0.05)" />

                {/* Inner Spiral Tube */}
                <path d="M 15 0 V 10 Q 25 15 15 20 Q 5 25 15 30 Q 25 35 15 40 Q 5 45 15 50 Q 25 55 15 60 Q 5 65 15 70 Q 25 75 15 80 Q 5 85 15 90 Q 25 95 15 100 Q 5 105 15 110 Q 25 115 15 120 V 140" 
                      fill="none" 
                      stroke={condenser.isActive ? "cyan" : "rgba(255,255,255,0.2)"} 
                      strokeWidth="2" 
                      className={condenser.isActive ? "animate-pulse" : ""}
                />
            </g>

            {/* 3. Collection Flask (Bottom) */}
            <g transform="translate(45, 200)">
                {/* Flask Shape */}
                <path d="M 25 0 V 10 L 50 60 H 0 L 25 10 V 0" fill="url(#glass-gradient)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                
                {/* Liquid Level */}
                {totalVolume > 0 && (
                    <path d={`M 50 60 H 0 L ${25 - (fillPercentage * 0.25)} ${60 - (fillPercentage * 0.5)} H ${25 + (fillPercentage * 0.25)} L 50 60`} 
                          fill="url(#liquid-gradient)" 
                          className="transition-all duration-500"
                    />
                )}
            </g>
        </svg>

        {/* INTERACTIVE LAYER (Pointer Events On) */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
            {/* Valve Button */}
            <div className="absolute top-[80px] right-[20px]">
                <button 
                    onClick={toggleCondenserValve}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md transition-all active:scale-95 ${condenser.isActive ? 'bg-green-900/80 border-green-400 text-green-400' : 'bg-red-900/80 border-red-400 text-red-400'}`}
                    title="Toggle Condenser Valve"
                >
                    <span className="text-xs font-bold">{condenser.isActive ? 'ON' : 'OFF'}</span>
                </button>
            </div>

            {/* Collect Button (Over Flask) */}
            <div className="absolute bottom-[20px] left-[55px] w-[50px] h-[50px]">
                {totalVolume > 0 && (
                    <button 
                        onClick={handleCollect}
                        className="w-full h-full opacity-0 hover:opacity-100 bg-amber-500/80 hover:bg-amber-500 text-white text-[10px] font-bold rounded-b-xl flex items-center justify-center transition-all backdrop-blur-sm"
                    >
                        COLLECT
                        <br/>
                        {Math.round(totalVolume)}ml
                    </button>
                )}
            </div>
        </div>

    </div>
  );
};

export default Condenser;