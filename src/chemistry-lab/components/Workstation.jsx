import React from 'react';
import Vessel from './Vessel';
import { useChemistryStore } from '../store';
import { EQUIPMENT } from '../data/equipment';

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

  const handleQuickDeploy = (equipmentId) => {
    const item = EQUIPMENT.find(e => e.id === equipmentId) || EQUIPMENT[0];
    createVessel(item);
  };

  return (
    <div 
      className="flex-1 bg-[#050814] p-6 flex flex-col items-center justify-center overflow-hidden relative select-none"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Sci-Fi Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      
      {/* Ambient Floor Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-emerald-500/8 via-teal-500/3 to-transparent pointer-events-none" />

      {/* Fume Hood Visual Effect & Air-Curtain */}
      {isFumeHoodOn && (
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-teal-500/20 via-teal-500/5 to-transparent animate-pulse" />
          <div className="absolute top-4 right-6 text-teal-300 text-xs font-mono font-black flex items-center gap-2 bg-[#08101e]/90 px-3.5 py-1.5 rounded-full border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.3)] backdrop-blur-md">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-ping" />
            VENTILATION SYSTEM ACTIVE
          </div>
        </div>
      )}

      {/* Main Laboratory Bench Surface */}
      <div className="relative w-full max-w-6xl bg-gradient-to-b from-[#0b1224]/90 to-[#060b17]/95 p-8 rounded-3xl border border-emerald-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex gap-10 items-end justify-center min-h-[500px] backdrop-blur-2xl overflow-x-auto custom-scrollbar z-10">
        
        {/* Top Rim Circuit Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/30 via-teal-400 to-emerald-500/30 rounded-t-3xl shadow-[0_0_20px_rgba(45,212,191,0.6)]" />

        {vesselList.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-16 px-12 text-slate-500 gap-4">
            <div className="w-20 h-20 rounded-3xl bg-[#081020] border border-slate-800 flex items-center justify-center text-4xl shadow-inner animate-pulse">
              ⚗️
            </div>
            
            <div className="text-center space-y-1">
              <span className="text-sm font-mono uppercase tracking-widest text-slate-300 font-black">
                Workbench Ready
              </span>
              <p className="text-xs font-sans text-slate-400 max-w-md">
                Deploy reaction apparatus to begin synthesis, distillation, and phase transitions.
              </p>
            </div>

            {/* Quick Deploy Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
              <button
                onClick={() => handleQuickDeploy('beaker_std')}
                className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>🥛</span>
                <span>+ Beaker</span>
              </button>

              <button
                onClick={() => handleQuickDeploy('spark_chamber')}
                className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>⚡</span>
                <span>+ Spark Chamber</span>
              </button>

              <button
                onClick={() => handleQuickDeploy('electrochemical_cell')}
                className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>🔋</span>
                <span>+ Electrochemical</span>
              </button>

              <button
                onClick={() => handleQuickDeploy('distillation_setup')}
                className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-2xl border border-slate-700 hover:border-sky-500/50 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>💧</span>
                <span>+ Distillation</span>
              </button>

              <button
                onClick={() => handleQuickDeploy('reactor_reinforced')}
                className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>☢️</span>
                <span>+ Reactor</span>
              </button>
            </div>
          </div>
        ) : (
          vesselList.map((vessel) => (
            <div key={vessel.id} className="relative group shrink-0 animate-scale-up">
              {/* Remove Docked Apparatus Button */}
              <button 
                onClick={() => removeVessel(vessel.id)}
                className="absolute -top-3 -right-2 z-50 bg-rose-600/90 hover:bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-slate-900 active:scale-90"
                title="Dismantle Apparatus"
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

