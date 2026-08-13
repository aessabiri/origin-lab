import React from 'react';
import Vessel from './Vessel';
import { useChemistryStore } from '../store';

const Workstation = () => {
  const vessels = useChemistryStore(state => state.vessels);
  const isFumeHoodOn = useChemistryStore(state => state.isFumeHoodOn);
  const createVessel = useChemistryStore(state => state.createVessel);
  const removeVessel = useChemistryStore(state => state.removeVessel);

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
