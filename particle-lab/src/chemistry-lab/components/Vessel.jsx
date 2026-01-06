import React, { useMemo, useState, useEffect } from 'react';
import { useChemistryStore } from '../store';
import { CHEMICALS } from '../data/chemicals';
import QuantityModal from './QuantityModal';

const Vessel = ({ id, hasTempControl, hasPressureControl }) => {
  const vessel = useChemistryStore(state => state.vessels[id]);
  const addToVessel = useChemistryStore(state => state.addToVessel);
  const setVesselControl = useChemistryStore(state => state.setVesselControl);
  const clearVessel = useChemistryStore(state => state.clearVessel);
  const bottleVessel = useChemistryStore(state => state.bottleVessel);
  const breakVessel = useChemistryStore(state => state.breakVessel);
  const repairVessel = useChemistryStore(state => state.repairVessel);

  const [modalState, setModalState] = useState({ isOpen: false, chemicalId: null });

  // Safety Checks (The "Realism" Loop)
  useEffect(() => {
    if (vessel.status === 'broken') return;

    const vesselType = vessel.type || (id === 'chamber' ? 'reinforced' : 'glass');

    // 1. Overpressure Logic: Standard glass cannot hold pressure
    if (vesselType === 'glass' && vessel.pressure > 5) {
       breakVessel(id);
    }

    // 2. Thermal Shock Logic: Cheap glass melts/cracks
    if (vesselType === 'glass' && vessel.temp > 800) {
       breakVessel(id);
    }
  }, [vessel.pressure, vessel.temp, vessel.status, vessel.type, id, breakVessel]);

  // Naming Logic
  const mixtureName = useMemo(() => {
     const entries = Object.entries(vessel.contents);
     if (entries.length === 0) return 'Empty';
     if (entries.length === 1) return CHEMICALS[entries[0][0]]?.name || 'Unknown';

     // Find dominant
     const sorted = entries.sort((a, b) => b[1] - a[1]);
     const dominantId = sorted[0][0];
     const dominant = CHEMICALS[dominantId];
     
     // Special Naming
     if (dominantId === 'H2O' && entries.length > 1) {
        const soluteId = sorted[1][0];
        const solute = CHEMICALS[soluteId];
        return `Aq. ${solute?.name || 'Solution'}`;
     }
     
     if (dominant?.state === 'liquid') return `${dominant.name} Mix`;
     return 'Sludge';
  }, [vessel.contents]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (vessel.status === 'broken') return;
    const chemicalId = e.dataTransfer.getData('chemicalId');
    if (chemicalId) {
      setModalState({ isOpen: true, chemicalId });
    }
  };

  const handleConfirmPour = (amount) => {
    if (modalState.chemicalId) {
      addToVessel(id, modalState.chemicalId, amount);
    }
    setModalState({ isOpen: false, chemicalId: null });
  };

  const handleDragOver = (e) => e.preventDefault();

  const totalVolume = Object.values(vessel.contents).reduce((a, b) => a + b, 0);
  const fillPercentage = Math.min((totalVolume / vessel.maxVol) * 100, 100);

  const fluidColor = useMemo(() => {
    if (totalVolume === 0) return 'transparent';
    const entries = Object.entries(vessel.contents);
    if (entries.length === 0) return 'transparent';
    const dominant = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return CHEMICALS[dominant[0]]?.color || '#3b82f6';
  }, [vessel.contents, totalVolume]);

  const handleBottle = () => {
    bottleVessel(id);
  };

  if (vessel.status === 'broken') {
      return (
          <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-xl border border-red-900/50 shadow-lg min-w-[200px] h-[350px] justify-center opacity-75">
             <div className="text-red-500 font-bold animate-pulse text-sm tracking-widest">CRITICAL FAILURE</div>
             <div className="text-6xl filter grayscale brightness-50">⚗️</div>
             <p className="text-xs text-gray-500 text-center px-2">
                Vessel destroyed by {vessel.pressure > 5 ? 'overpressure' : 'thermal shock'}.
             </p>
             <button 
                onClick={() => repairVessel(id)}
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors border border-gray-600"
             >
                Replace Glassware
             </button>
          </div>
      )
   }

  return (
    <>
      <QuantityModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, chemicalId: null })}
        onConfirm={handleConfirmPour}
        chemicalName={CHEMICALS[modalState.chemicalId]?.name || 'Unknown'}
      />
      
      <div className="flex flex-col items-center gap-2 relative">
        {/* THE DIGITAL SCREEN */}
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-2 w-full mb-2 shadow-lg relative overflow-hidden group">
            {/* Screen Glare */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-end border-b border-gray-800 pb-1 mb-1">
                <span className="text-[10px] text-gray-500 font-mono uppercase">MONITOR-0{id.length}</span>
                <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${vessel.temp > 100 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="text-[10px] text-gray-500">ON</span>
                </div>
            </div>
            
            <div className="flex flex-col">
                <span className="text-xs text-cyan-400 font-mono truncate tracking-tight">{mixtureName}</span>
                <div className="flex justify-between items-end mt-1">
                    <span className={`text-lg font-bold font-mono ${vessel.temp > 100 ? 'text-red-400' : 'text-white'}`}>
                        {vessel.temp}°C
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{totalVolume}ml</span>
                </div>
            </div>
        </div>

        {/* Cable connecting screen to vessel */}
        <div className="w-1 h-4 bg-gray-700 absolute top-[76px] z-0"></div>

        <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-lg min-w-[200px] z-10">
          {/* The Vessel Container */}
          <div 
            className="relative w-32 h-40 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-b-2xl rounded-t-md overflow-hidden backdrop-blur-md shadow-inner group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div 
              className="absolute bottom-0 w-full transition-all duration-500 ease-out"
              style={{ 
                height: `${fillPercentage}%`, 
                backgroundColor: fluidColor, 
                opacity: 0.8,
                boxShadow: `0 0 20px ${fluidColor}`
              }} 
            />
            
            {/* Bubbles */}
            {vessel.temp > 80 && totalVolume > 0 && (
                <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-50 animate-pulse">
                    <span className="text-white">°ºo O</span>
                </div>
            )}

            <div className="absolute top-2 w-full text-center text-xs text-white/70 font-mono pointer-events-none drop-shadow-md mix-blend-difference">
               {/* Simplified label inside glass removed, moved to screen */}
            </div>
            
            {totalVolume > 0 && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={handleBottle}
                  className="bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg transform hover:scale-105 transition-all"
                >
                  Bottle
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="w-full space-y-3 mt-2 bg-gray-900/50 p-2 rounded-lg">
            {hasTempControl && (
              <div className="flex flex-col gap-1">
                <input 
                  type="range" min="0" max="1000" value={vessel.targetTemp || 20} 
                  onChange={(e) => setVesselControl(id, 'targetTemp', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>HEATER</span>
                    <span>{vessel.targetTemp || 20}°C / 1000°C</span>
                </div>
              </div>
            )}
            {hasPressureControl && (
              <div className="flex flex-col gap-1">
                <input 
                  type="range" min="1" max="100" value={vessel.pressure} 
                  onChange={(e) => setVesselControl(id, 'pressure', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>PRESS</span>
                    <span>100 atm</span>
                </div>
              </div>
            )}
            <button 
                onClick={() => clearVessel(id)} 
                className="text-xs text-red-400 hover:text-red-300 w-full text-center hover:bg-red-900/20 py-1 rounded transition-colors"
            >
                Dump Contents
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vessel;
