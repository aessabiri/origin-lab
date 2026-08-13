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
  const vesselList = Object.values(vessels || {});

  return (
    <div 
      className="flex-1 bg-[#060911] p-8 flex items-center justify-center overflow-hidden relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Sci-Fi Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      
      {/* Ambient Floor Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-500/5 via-teal-500/3 to-transparent pointer-events-none" />

      {/* Fume Hood Visual Effect */}
      {isFumeHoodOn && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-teal-500/15 to-transparent" />
          <div className="absolute bottom-6 right-6 text-teal-300 text-xs font-mono font-black animate-pulse flex items-center gap-2 bg-[#0c1424]/90 px-4 py-1.5 rounded-full border border-teal-500/40 shadow-xl">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-ping" />
            VENTILATION SYSTEM ACTIVE
          </div>
        </div>
      )}

      {/* Main Laboratory Bench Surface */}
      <div className="relative bg-gradient-to-b from-[#11192e]/80 to-[#0a101d]/95 p-10 rounded-3xl border border-emerald-500/25 shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex gap-12 items-end min-h-[440px] backdrop-blur-xl overflow-x-auto max-w-full custom-scrollbar z-10">
        
        {/* Top Rim Circuit Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/40 via-teal-400 to-emerald-500/40 rounded-t-3xl shadow-[0_0_15px_rgba(45,212,191,0.5)]" />

        {vesselList.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-12 text-slate-500 gap-3">
            <span className="text-4xl opacity-40">⚗️</span>
            <span className="text-sm font-mono uppercase tracking-widest text-slate-400 font-bold">
              Workbench Ready
            </span>
            <p className="text-xs font-sans text-slate-500 max-w-md text-center">
              Drag apparatus (Beakers, Flasks, Distillation Condensers) from the Equipment tab to begin chemical reactions.
            </p>
          </div>
        ) : (
          vesselList.map((vessel) => (
            <div key={vessel.id} className="relative group shrink-0">
              <button 
                onClick={() => removeVessel(vessel.id)}
                className="absolute -top-3 -right-3 z-50 bg-rose-600/90 hover:bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-black"
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
          ))
        )}
      </div>

    </div>
  );
};

export default React.memo(Workstation);
