import React from 'react';
import { useBioStore } from '../store';

const BioModeSelector = ({ currentMode, setMode }) => {
  const { agents, isRunning, synthesizedProteins, currentCellDesign, morphogenesisConfig } = useBioStore();

  const modes = [
    { id: 'assembly', label: 'Cell Assembly', icon: '🦠', val: currentCellDesign.organelles.length, unit: 'COMP', desc: 'LUCA Chassis & 8 Organelle Classes' },
    { id: 'folding', label: 'Protein Lab', icon: '🧬', val: synthesizedProteins.length, unit: 'SEQ', desc: '3D Polypeptide Molecular Folding' },
    { id: 'simulation', label: 'Incubation Chamber', icon: '🧫', val: agents.length, unit: 'CELLS', desc: 'Archean Hydrothermal Ecosystem' },
    { id: 'morphogenesis', label: 'Cambrian Body Plan', icon: '🦎', val: morphogenesisConfig?.segments || 7, unit: 'SOMITES', desc: '3D Multicellular → Vertebrate Bridge' },
    { id: 'inventory', label: 'Bio-Storage', icon: '📦', val: 'OPEN', unit: 'LEDGER', desc: 'Enzymes & Biological Precursors' }
  ];

  return (
    <div className="flex flex-col w-72 h-full bg-[#080d18]/95 backdrop-blur-2xl p-4 border-r border-teal-500/20 shadow-2xl z-20 select-none">
      {/* Central Terminal Status Badge */}
      <div className="mb-6 px-4 py-3 bg-[#0c1424] border border-teal-500/30 rounded-2xl shadow-inner">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono font-black text-teal-400 uppercase tracking-widest">
            Biological Core
          </span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-mono text-slate-300 font-bold">
              {isRunning ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>
        <p className="text-[10px] font-mono text-slate-400 truncate">
          LUCA Prototyping & Ecology Studio
        </p>
      </div>
      
      {/* Navigation Modes List */}
      <div className="flex-1 space-y-3">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 group relative flex flex-col gap-1.5 ${
                isActive 
                  ? 'bg-gradient-to-r from-teal-950/60 to-[#0f1d2e] border-teal-400/50 shadow-[0_4px_20px_rgba(20,184,166,0.25)] scale-[1.02]' 
                  : 'bg-[#0b1220]/60 border-slate-800/80 hover:border-teal-500/30 hover:bg-[#0f172a]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl p-2 rounded-xl bg-[#070b14] border border-white/5">
                    {mode.icon}
                  </span>
                  <div>
                    <h3 className={`font-black text-xs uppercase tracking-wider transition-colors ${isActive ? 'text-teal-200' : 'text-slate-300 group-hover:text-white'}`}>
                      {mode.label}
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {mode.unit}
                    </span>
                  </div>
                </div>

                <span className={`font-mono font-black text-sm px-2 py-0.5 rounded-lg border ${
                  isActive 
                    ? 'bg-teal-500/20 border-teal-400/40 text-teal-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {mode.val}
                </span>
              </div>

              <p className="text-[9px] text-slate-400 font-sans leading-tight pl-1">
                {mode.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Footer System Telemetry */}
      <div className="mt-auto pt-4 border-t border-teal-500/15 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>BIO_SYS v0.3</span>
        <span className="text-teal-400/80">OLED SYNC</span>
      </div>
    </div>
  );
};

export default BioModeSelector;
