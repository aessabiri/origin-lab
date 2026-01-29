import React from 'react';
import { useBioStore } from '../store';
import { BakelitePanel } from '../../components/VisualPrimitives';

const BioModeSelector = ({ currentMode, setMode }) => {
  const { agents, isRunning, synthesizedProteins, currentCellDesign } = useBioStore();

  const modes = [
    { id: 'assembly', label: 'Cell Assembly', icon: '🦠', val: currentCellDesign.organelles.length, unit: 'COMP' },
    { id: 'folding', label: 'Protein Lab', icon: '🧬', val: synthesizedProteins.length, unit: 'SEQ' },
    { id: 'simulation', label: 'Incubation Chamber', icon: '🧫', val: agents.length, unit: 'AGENTS' },
    { id: 'inventory', label: 'Bio-Storage', icon: '📦', val: 'LOAD', unit: 'SYS' }
  ];

  return (
    <div className="flex flex-col w-72 h-full bg-[#121212] p-4 border-r-8 border-black shadow-[inset_-4px_0_20px_rgba(0,0,0,0.8)] z-20">
      <div className="mb-8 px-4 py-2 bg-zinc-900 border-2 border-zinc-800 rounded shadow-inner">
        <h2 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-1">Central Terminal</h2>
        <div className="flex items-center gap-2">
           <div className={`w-3 h-3 rounded-full animate-pulse ${isRunning ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></div>
           <span className="text-xs font-mono text-zinc-400">SYS_STATUS: {isRunning ? 'EXECUTING' : 'IDLE'}</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              className="w-full text-left outline-none group"
            >
              <BakelitePanel className={`p-4 transition-all duration-300 relative ${isActive ? 'ring-2 ring-amber-500/50 scale-[1.02]' : 'opacity-70 hover:opacity-100 grayscale hover:grayscale-0'}`}>
                {/* Vintage ID Plate */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/40 rounded border border-white/5 text-[8px] font-mono text-zinc-500">
                  MOD_{mode.id.toUpperCase().slice(0,3)}
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-lg bg-black/40 border border-white/5 shadow-inner transition-colors ${isActive ? 'text-amber-400' : 'text-zinc-600'}`}>
                    {mode.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-black uppercase tracking-widest text-sm mb-1 transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                      {mode.label}
                    </h3>
                    <div className="flex items-baseline gap-2">
                       <span className={`text-xl font-mono ${isActive ? 'text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 'text-zinc-700'}`}>
                         {mode.val}
                       </span>
                       <span className="text-[8px] font-bold text-zinc-600 tracking-tighter">{mode.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Active Indicator Light */}
                <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-zinc-900'}`}></div>
              </BakelitePanel>
            </button>
          );
        })}
      </div>

      {/* Decorative Feet/Bolts */}
      <div className="mt-8 flex justify-between px-4">
         <div className="w-4 h-4 bg-zinc-800 rounded-full border-2 border-black shadow-lg"></div>
         <div className="w-4 h-4 bg-zinc-800 rounded-full border-2 border-black shadow-lg"></div>
      </div>
    </div>
  );
};

export default BioModeSelector;