import React, { useMemo } from 'react';
import { useChemistryStore } from '../store';
import { CHEMICALS } from '../data/chemicals';

const Condenser = () => {
  const condenser = useChemistryStore(state => state.condenser);
  const bottleVessel = useChemistryStore(state => state.bottleVessel);
  const emptyCondenser = useChemistryStore(state => state.emptyCondenser);
  const toggleCondenserValve = useChemistryStore(state => state.toggleCondenserValve);
  
  const totalVolume = Object.values(condenser.contents).reduce((a, b) => a + b, 0);
  const fillPercentage = Math.min((totalVolume / condenser.maxVol) * 100, 100);

  const fluidColor = useMemo(() => {
    if (totalVolume === 0) return 'transparent';
    const entries = Object.entries(condenser.contents);
    if (entries.length === 0) return 'transparent';
    const dominant = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return CHEMICALS[dominant[0]]?.color || '#3b82f6';
  }, [condenser.contents, totalVolume]);

  const handleCollect = () => {
      emptyCondenser();
  };

  return (
    <div className="flex flex-col items-center gap-2 relative h-full justify-end pb-8">
        {/* The Coil Column */}
        <div className="w-16 h-48 bg-gray-800/50 border border-gray-600 rounded-lg relative overflow-hidden backdrop-blur-sm flex flex-col items-center justify-around py-2">
            {/* Glass Coil Visualization */}
            <svg width="40" height="180" viewBox="0 0 40 180" className="absolute top-0 left-1/2 -translate-x-1/2 opacity-50">
                <path d="M20 0 V10 Q40 20 20 30 Q0 40 20 50 Q40 60 20 70 Q0 80 20 90 Q40 100 20 110 Q0 120 20 130 Q40 140 20 150 V180" 
                      fill="none" stroke={condenser.isActive ? "cyan" : "gray"} strokeWidth="4" />
            </svg>
            
            {/* Drip Animation if active */}
            {totalVolume > 0 && condenser.isActive && (
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                </div>
            )}
        </div>

        {/* Valve Control */}
        <button 
            onClick={toggleCondenserValve}
            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${condenser.isActive ? 'bg-cyan-900 text-cyan-400 border border-cyan-700' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}
        >
            {condenser.isActive ? 'VALVE: OPEN' : 'VALVE: CLOSED'}
        </button>

        {/* Collection Flask */}
        <div className="relative w-24 h-24 bg-gray-800 border-2 border-gray-600 rounded-b-xl rounded-t-sm overflow-hidden shadow-lg group">
             <div 
              className="absolute bottom-0 w-full transition-all duration-500 ease-out"
              style={{ 
                height: `${fillPercentage}%`, 
                backgroundColor: fluidColor, 
                opacity: 0.8,
                boxShadow: `0 0 20px ${fluidColor}`
              }} 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <button 
                    onClick={handleCollect}
                    className="bg-green-600 hover:bg-green-500 text-white text-[10px] px-2 py-1 rounded"
                >
                    Collect
                </button>
            </div>
        </div>
        
        {/* Connection Tube to Flask (Left) */}
        <div className={`absolute top-10 -left-12 w-12 h-4 -z-10 border-t border-b transform rotate-12 origin-right transition-colors ${condenser.isActive ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 border-gray-700 opacity-50'}`} />
        
        <div className="text-[10px] text-gray-500 font-mono mt-1">CONDENSER</div>
        <div className="text-xs text-white font-mono">{Math.round(totalVolume)}ml</div>
    </div>
  );
};

export default Condenser;
