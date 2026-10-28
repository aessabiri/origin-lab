import React from 'react';
import { useChemistryStore } from '../store';
import AnalogueDial from './AnalogueDial';

const VesselControls = ({ id, hasTempControl, vessel, currentStats }) => {
  const toggleVesselLid = useChemistryStore(state => state.toggleVesselLid);
  const setVesselControl = useChemistryStore(state => state.setVesselControl);
  const clearVessel = useChemistryStore(state => state.clearVessel);

  return (
    <div className="w-full space-y-2.5 mt-2 bg-[#060b17]/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-inner">
      
      {/* Mechanical Lid Clamp Toggle Button */}
      <button 
        onClick={() => toggleVesselLid(id)}
        className={`w-full py-1.5 px-3 text-[11px] font-mono font-black uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border shadow-md active:scale-95 ${
          vessel.isOpen 
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
            : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${vessel.isOpen ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-rose-400 shadow-[0_0_6px_#f43f5e]'}`} />
        <span>{vessel.isOpen ? 'LID: OPEN / VENTED' : 'CHAMBER: SEALED'}</span>
      </button>

      {/* Analogue Rotary Dials Console */}
      <div className="flex gap-4 justify-center items-center py-1">
        {hasTempControl ? (
          <AnalogueDial 
            label="HEATER" 
            value={vessel.targetTemp ?? 20} 
            min={0} 
            max={currentStats.maxTemp + 200}
            unit="°C"
            color="#f97316" // Vibrant Orange-Red
            onChange={(val) => setVesselControl(id, 'targetTemp', val)}
          />
        ) : (
          <AnalogueDial 
            label="TEMP" 
            value={vessel.temp ?? 20} 
            min={0} 
            max={currentStats.maxTemp + 200}
            unit="°C"
            color="#38bdf8" // Sky Blue Readout
            disabled={true}
          />
        )}
        
        {/* Pressure Gauge Dial (Physics Governed) */}
        <AnalogueDial 
          label="PRESSURE" 
          value={vessel.pressure ?? 1} 
          min={0} 
          max={currentStats.maxPress + 20} 
          unit="atm"
          color="#a855f7" // Purple
          disabled={true}
        />
      </div>

      {/* Dump / Flush Button */}
      <button 
        onClick={() => clearVessel(id)} 
        className="text-[10px] font-mono font-bold text-rose-400/80 hover:text-rose-300 w-full text-center hover:bg-rose-500/10 py-1 rounded-lg transition-all border border-transparent hover:border-rose-500/20"
      >
        Flush Vessel Contents ✕
      </button>
      
      {/* Equipment Spec Tag */}
      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono pt-1.5 border-t border-slate-800">
        <span className="uppercase font-bold text-slate-400">{currentStats.name}</span>
        <span className="text-slate-600">Max: {currentStats.maxTemp}°C / {currentStats.maxPress}atm</span>
      </div>
    </div>
  );
};

export default React.memo(VesselControls);
