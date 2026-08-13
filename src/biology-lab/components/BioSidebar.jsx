import React from 'react';
import { useBioStore } from '../store';
import { BakelitePanel, NixieTube, AnalogGauge, ToggleSwitch, Oscilloscope } from '../../components/VisualPrimitives';

const BioSidebar = () => {
  const { soup, agents, isRunning, toggleRunning, resetSimulation, importResource } = useBioStore();

  const handleFeed = () => importResource('glucose', 50);
  const handlePoison = () => importResource('arsenic', 1);

  return (
    <div className="w-full md:w-80 bg-[#0a0a0a] flex flex-col shadow-2xl z-10 border-l-8 border-black">
      {/* Header Panel */}
      <BakelitePanel className="m-4 p-6 rounded-none border-b-4 border-black/50">
        <h2 className="text-xl font-black text-amber-500 tracking-[0.2em] uppercase italic">Diagnostic</h2>
        <p className="text-zinc-600 text-[10px] font-mono tracking-widest">BIOS_MONITORING_STATION_v4</p>
      </BakelitePanel>

      <div className="px-4 flex-1 overflow-y-auto space-y-6 pb-8 custom-scrollbar">
        
        {/* Simulation Main Controls */}
        <div className="flex justify-center gap-8 py-4 bg-zinc-900/50 rounded-xl border border-white/5 shadow-inner">
           <ToggleSwitch label="Power" checked={isRunning} onChange={toggleRunning} />
           <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Wipe</span>
              <button 
                onClick={resetSimulation}
                className="w-12 h-12 bg-red-950 rounded-full border-4 border-zinc-800 shadow-lg active:scale-95 transition-all flex items-center justify-center text-red-500 font-bold"
              >
                EXT
              </button>
           </div>
        </div>

        {/* Nixie Counter & Vitals */}
        <div className="space-y-4">
           <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Biomass Count</span>
              <NixieTube value={agents.length} digits={3} />
           </div>
           <div className="px-2">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Activity_Monitor</span>
              <Oscilloscope active={isRunning} color={agents.length > 50 ? 'amber' : 'emerald'} />
           </div>
        </div>

        {/* Analog Gauges - Redesigned Grid */}
        <div className="grid grid-cols-2 gap-4">
           <BakelitePanel className="p-3 flex items-center justify-center">
              <AnalogGauge label="Glucose" value={soup.glucose} color="amber" />
           </BakelitePanel>
           <BakelitePanel className="p-3 flex items-center justify-center">
              <AnalogGauge label="Aminos" value={soup.aminoAcids} color="emerald" />
           </BakelitePanel>
           <BakelitePanel className="p-3 flex items-center justify-center">
              <AnalogGauge label="Lipids" value={soup.lipids} color="emerald" />
           </BakelitePanel>
           <BakelitePanel className="p-3 flex items-center justify-center">
              <AnalogGauge label="Stressor" value={useBioStore.getState().toxins.length * 10} color="red" />
           </BakelitePanel>
        </div>

        {/* Dispenser Controls */}
        <div className="space-y-3">
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Manual Override Dispensers</span>
           <button
             onClick={handleFeed}
             className="w-full group bg-gradient-to-b from-zinc-800 to-zinc-900 p-4 rounded border-2 border-zinc-700 shadow-xl active:translate-y-1 transition-all flex justify-between items-center"
           >
             <div className="flex flex-col items-start text-left">
                <span className="text-xs font-black text-amber-500 uppercase">Inject Nutrients</span>
                <span className="text-[8px] text-zinc-600 font-mono">GLU_RELEASE_CMD_01</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🍬</div>
           </button>

           <button
             onClick={handlePoison}
             className="w-full group bg-gradient-to-b from-zinc-800 to-zinc-900 p-4 rounded border-2 border-zinc-700 shadow-xl active:translate-y-1 transition-all flex justify-between items-center"
           >
             <div className="flex flex-col items-start text-left">
                <span className="text-xs font-black text-red-600 uppercase">Release Stressor</span>
                <span className="text-[8px] text-zinc-600 font-mono">TOX_SAMPLE_EMIT</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-red-500">☠️</div>
           </button>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="p-4 bg-black flex justify-center items-center gap-2 opacity-30 grayscale grayscale-100">
         <div className="w-2 h-2 bg-white rounded-full"></div>
         <span className="text-[10px] font-black tracking-[0.5em] text-white">ORIGIN LABORATORIES</span>
      </div>
    </div>
  );
};

export default BioSidebar;