import React, { useState } from 'react';
import Vessel from './Vessel';
import Condenser from './Condenser';
import EquipmentPalette from './EquipmentPalette';
import MissionTracker from './MissionTracker';
import MissionHint from './MissionHint';
import { useChemistryStore } from '../store';

const Workstation = () => {
  const vessels = useChemistryStore(state => state.vessels);
  const isFumeHoodOn = useChemistryStore(state => state.isFumeHoodOn);
  const toggleFumeHood = useChemistryStore(state => state.toggleFumeHood);
  const createVessel = useChemistryStore(state => state.createVessel);
  const removeVessel = useChemistryStore(state => state.removeVessel);
  const gameMode = useChemistryStore(state => state.gameMode);
  const setGameMode = useChemistryStore(state => state.setGameMode);

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    
    try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'equipment') {
            createVessel(parsed.data);
        }
    } catch (err) {
        // Not JSON or not equipment
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div 
        className="flex-1 bg-slate-800 p-8 flex items-center justify-center overflow-hidden relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
    >
       {/* Background Lab Accents */}
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
       
       {/* Mission Tracker (Overlay) */}
       <MissionTracker />
       <MissionHint />

       {/* Fume Hood Visual Effect */}
       {isFumeHoodOn && (
         <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent" />
            <div className="absolute bottom-4 right-4 text-cyan-400 text-xs font-mono animate-pulse flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-cyan-500/30">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                VENTILATION ACTIVE
            </div>
         </div>
       )}

       {/* Control Panel (Wall) */}
       <div className="absolute top-20 right-10 flex flex-col gap-4 z-30">
          <button 
            onClick={toggleFumeHood}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 shadow-lg ${isFumeHoodOn ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500'}`}
          >
            <span className="text-2xl">{isFumeHoodOn ? '🌪️' : '💨'}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase">Fume Hood</span>
          </button>

          <div className="relative">
              <button 
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 shadow-lg ${isPaletteOpen ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500'}`}
              >
                <span className="text-2xl">🛠️</span>
                <span className="text-[10px] font-bold tracking-widest uppercase">Equipment</span>
              </button>
              
              {/* Render Palette anchored here */}
              <EquipmentPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
          </div>

          {/* Game Mode Toggle */}
          <button 
            onClick={() => setGameMode(gameMode === 'sandbox' ? 'career' : 'sandbox')}
            className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 shadow-lg ${gameMode === 'sandbox' ? 'bg-purple-900/50 border-purple-500 text-purple-300' : 'bg-blue-900/50 border-blue-500 text-blue-300'}`}
          >
            <span className="text-xs font-bold uppercase tracking-widest">{gameMode === 'sandbox' ? 'Sandbox Mode' : 'Career Mode'}</span>
            <span className="text-[10px] opacity-70">{gameMode === 'sandbox' ? 'All Unlocked' : 'Missions Active'}</span>
          </button>
       </div>

       
       {/* Table Surface */}
       <div className="relative bg-slate-700/30 p-12 rounded-3xl border-b-8 border-slate-600 shadow-2xl flex gap-16 items-end min-h-[400px] backdrop-blur-sm overflow-x-auto max-w-full">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 opacity-50 rounded-t-3xl"></div>
          
          {Object.values(vessels).map((vessel) => (
              <div key={vessel.id} className="relative group">
                  <button 
                    onClick={() => removeVessel(vessel.id)}
                    className="absolute -top-4 -right-4 z-50 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                    title="Remove Vessel"
                  >
                    ✕
                  </button>
                  <Vessel 
                    id={vessel.id} 
                    hasTempControl={vessel.features?.hasTempControl} 
                    hasPressureControl={vessel.features?.hasPressureControl}
                    hasCondenser={vessel.features?.hasCondenser}
                  />
              </div>
          ))}
       </div>
    </div>
  );
};

export default Workstation;
