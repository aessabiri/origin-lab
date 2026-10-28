import React, { useMemo } from 'react';
import { useChemistryStore } from '../store';
import { MATTER_DEFINITIONS } from '../../constants/matterRegistry';

const Condenser = () => {
  const condenser = useChemistryStore(state => state.condenser);
  const emptyCondenser = useChemistryStore(state => state.emptyCondenser);
  const toggleCondenserValve = useChemistryStore(state => state.toggleCondenserValve);
  
  const totalVolume = Object.values(condenser.contents || {}).reduce((a, b) => a + b, 0);
  const fillPercentage = Math.min((totalVolume / (condenser.maxVol || 300)) * 100, 100);

  const dominantInfo = useMemo(() => {
    const entries = Object.entries(condenser.contents || {}).sort((a,b) => b[1] - a[1]);
    if (entries.length === 0) return { name: 'Distillate', color: '#06b6d4' };
    const id = entries[0][0];
    const def = MATTER_DEFINITIONS[id];
    return {
      name: def?.name || id,
      color: def?.color || '#06b6d4'
    };
  }, [condenser.contents]);

  const handleCollect = () => {
    emptyCondenser();
  };

  return (
    <div className="relative flex flex-col items-center justify-end h-[320px] -ml-6 mb-2 pointer-events-none select-none z-20">
      
      {/* GLASSWARE SVG LAYER */}
      <svg width="150" height="300" viewBox="0 0 150 300" className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)] z-10 overflow-visible">
        <defs>
          <linearGradient id="condenser-glass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="80%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>

          <linearGradient id="coolant-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="distillate-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="20%" stopColor={dominantInfo.color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={dominantInfo.color} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* 1. Vapor Connection Arm (Arching from left reaction vessel) */}
        <path 
          d="M -25 130 Q -20 65 35 48 T 80 50" 
          fill="none" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="12" 
          strokeLinecap="round"
        />
        <path 
          d="M -25 130 Q -20 65 35 48 T 80 50" 
          fill="none" 
          stroke={condenser.isActive ? "#22d3ee" : "rgba(255,255,255,0.15)"} 
          strokeWidth="3.5" 
          strokeDasharray={condenser.isActive ? "6 3" : "none"}
          className={condenser.isActive ? "animate-pulse" : ""}
        />

        {/* 2. Liebig Column Outer Jacket */}
        <g transform="translate(65, 50)">
          {/* Water Jacket Body */}
          <rect x="0" y="0" width="30" height="150" rx="6" fill="url(#condenser-glass)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          
          {/* Coolant Liquid */}
          <rect x="2" y="2" width="26" height="146" rx="4" fill="url(#coolant-glow)" />

          {/* Coolant Ports */}
          <rect x="-8" y="15" width="8" height="6" rx="2" fill="url(#condenser-glass)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <rect x="30" y="125" width="8" height="6" rx="2" fill="url(#condenser-glass)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

          {/* Internal Condensing Spiral */}
          <path 
            d="M 15 0 V 10 Q 25 16 15 22 Q 5 28 15 34 Q 25 40 15 46 Q 5 52 15 58 Q 25 64 15 70 Q 5 76 15 82 Q 25 88 15 94 Q 5 100 15 106 Q 25 112 15 118 Q 5 124 15 130 V 150" 
            fill="none" 
            stroke={condenser.isActive ? "#67e8f9" : "rgba(255,255,255,0.3)"} 
            strokeWidth="2.5" 
            strokeLinecap="round"
            className={condenser.isActive ? "animate-pulse" : ""}
          />

          {/* Animated Distillate Droplet Drip */}
          {condenser.isActive && totalVolume > 0 && (
            <circle cx="15" cy="145" r="2" fill="#67e8f9" className="animate-ping" />
          )}
        </g>

        {/* 3. Collection Flask (Bottom) */}
        <g transform="translate(55, 205)">
          <clipPath id="distillate-flask-clip">
            <path d="M 25 0 V 12 L 48 65 Q 25 72 2 65 L 25 12 V 0 Z" />
          </clipPath>

          {/* Flask Body */}
          <path d="M 25 0 V 12 L 48 65 Q 25 72 2 65 L 25 12 V 0" fill="url(#condenser-glass)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />

          {/* Liquid Contents */}
          {totalVolume > 0 && (
            <g clipPath="url(#distillate-flask-clip)">
              <rect 
                x="0" 
                y={68 - (fillPercentage * 0.55)} 
                width="50" 
                height="70" 
                fill="url(#distillate-liquid)" 
                className="transition-all duration-300"
              />
              <ellipse cx="25" cy={68 - (fillPercentage * 0.55)} rx={10 + (fillPercentage * 0.12)} ry="2" fill="rgba(255,255,255,0.4)" />
            </g>
          )}
        </g>
      </svg>

      {/* INTERACTIVE CONTROLS LAYER */}
      <div className="absolute inset-0 pointer-events-auto flex flex-col justify-between p-2">
        
        {/* Coolant Valve Toggle */}
        <div className="absolute top-[80px] right-[4px]">
          <button 
            onClick={toggleCondenserValve}
            className={`px-2 py-1 rounded-xl border text-[10px] font-mono font-black shadow-lg transition-all active:scale-95 flex items-center gap-1 ${
              condenser.isActive 
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Cooling Circulation"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${condenser.isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{condenser.isActive ? 'FLOW ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Collection Flask Overlay Button */}
        <div className="absolute bottom-[16px] left-[55px] w-[50px] h-[65px] flex flex-col items-center justify-end">
          {totalVolume > 0 && (
            <button 
              onClick={handleCollect}
              className="w-full py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-[9px] font-mono font-black rounded-lg shadow-xl transform hover:scale-105 active:scale-95 transition-all text-center leading-tight border border-amber-300/40"
              title="Harvest distillate into Global Inventory"
            >
              HARVEST
              <div className="text-[8px] font-normal text-amber-100 opacity-90">{Math.round(totalVolume)}ml</div>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default React.memo(Condenser);