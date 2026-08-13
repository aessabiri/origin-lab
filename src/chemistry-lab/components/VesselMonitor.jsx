import React from 'react';

const VesselMonitor = ({ id, vessel, totalVolume, phValue, mixtureName, onConfigure }) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-2 w-full mb-2 shadow-lg relative overflow-hidden group min-w-[220px]">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
        
        <div className="flex justify-between items-end border-b border-gray-800 pb-1 mb-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase">MONITOR-0{id.length}</span>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={onConfigure}
                    className="text-gray-600 hover:text-amber-400 transition-colors"
                    title="Configure Vessel"
                >
                    ⚙️
                </button>
                <div className={`w-1.5 h-1.5 rounded-full ${vessel.temp > 100 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
        </div>
        
        <div className="flex flex-col">
            <span className="text-xs text-cyan-400 font-mono truncate tracking-tight h-4">{mixtureName}</span>
            <div className="flex justify-between items-end mt-1">
                <span className={`text-lg font-bold font-mono ${vessel.temp > 100 ? 'text-red-400' : 'text-white'}`}>
                    {vessel.temp}°C
                </span>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 font-mono">{totalVolume}ml</span>
                    <span className={`text-xs font-mono font-bold ${phValue < 3 ? 'text-red-400' : phValue > 11 ? 'text-purple-400' : 'text-green-400'}`}>
                       pH {phValue.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default VesselMonitor;
