import React from 'react';
import { useChemistryStore } from '../store';
import AnalogueDial from './AnalogueDial';

const VesselControls = ({ id, hasTempControl, vessel, currentStats }) => {
  const toggleVesselLid = useChemistryStore(state => state.toggleVesselLid);
  const setVesselControl = useChemistryStore(state => state.setVesselControl);
  const clearVessel = useChemistryStore(state => state.clearVessel);

  return (
    <div className="w-full space-y-3 mt-2 bg-gray-900/50 p-2 rounded-lg">
      <button 
          onClick={() => toggleVesselLid(id)}
          className={`w-full py-1 text-xs font-bold rounded transition-colors ${vessel.isOpen ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}
      >
          {vessel.isOpen ? 'OPEN LID' : 'SEALED'}
      </button>

      <div className="flex gap-4 justify-center py-2">
          {hasTempControl && (
              <AnalogueDial 
                  label="TEMP" 
                  value={vessel.targetTemp || 20} 
                  min={0} 
                  max={currentStats.maxTemp + 200}
                  unit="°C"
                  color="#ef4444" // red-500
                  onChange={(val) => setVesselControl(id, 'targetTemp', val)}
              />
          )}
          
          {/* Pressure Dial (Always show pressure even if not controllable, for safety feedback) */}
          <AnalogueDial 
              label="PRESS" 
              value={vessel.pressure} 
              min={0} 
              max={currentStats.maxPress + 50} 
              unit="atm"
              color="#a855f7" // purple-500
              disabled={true} // Physics controls this
          />
      </div>

      <button 
          onClick={() => clearVessel(id)} 
          className="text-xs text-red-400 hover:text-red-300 w-full text-center hover:bg-red-900/20 py-1 rounded transition-colors"
      >
          Dump Contents
      </button>
      
      {/* Equipment Type Label */}
      <div className="text-[10px] text-gray-500 text-center font-mono uppercase tracking-widest pt-1 border-t border-gray-700">
          {currentStats.name}
      </div>
    </div>
  );
};

export default VesselControls;
