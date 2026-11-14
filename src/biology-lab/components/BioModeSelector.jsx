import React from 'react';
import { useBioStore } from '../store';

const BioModeSelector = ({ currentMode, setMode, activeStage, onSelectStop }) => {
  const {
    foldedProteins = [],
    assembledOrganelles = [],
    differentiatedCells = [],
    engineeredTissues = []
  } = useBioStore();

  const stops = [
    {
      id: 'organ',
      num: '5',
      label: 'Organs',
      icon: '🫀',
      val: `${engineeredTissues.length}/5`,
      desc: 'Stop 5: Fabricate Organs for Anatomy Drag-and-Snap'
    },
    {
      id: 'tissue',
      num: '4',
      label: 'Tissues',
      icon: '🕸️',
      val: `${engineeredTissues.length}/5`,
      desc: 'Stop 4: Bioprint Tissue & ECM Scaffolds'
    },
    {
      id: 'cell',
      num: '3',
      label: 'Cell',
      icon: '🧫',
      val: `${differentiatedCells.length}/9`,
      desc: 'Stop 3: Living Cell (Meet in the Middle)'
    },
    {
      id: 'organelle',
      num: '2',
      label: 'Organelle',
      icon: '⚙️',
      val: `${assembledOrganelles.length}/4`,
      desc: 'Stop 2: Assemble Sub-Cellular Organelles'
    },
    {
      id: 'molecule',
      num: '1',
      label: 'Protein',
      icon: '🧬',
      val: `${foldedProteins.length}/8`,
      desc: 'Stop 1: Gene & Protein Molecular Forge'
    }
  ];

  return (
    <div className="flex flex-row md:flex-col w-full md:w-20 md:h-full bg-[#080d18]/95 backdrop-blur-2xl p-2 border-b md:border-b-0 md:border-r border-teal-500/20 shadow-2xl z-20 select-none items-center justify-between md:justify-start gap-1.5 shrink-0">
      <div className="hidden md:flex flex-col items-center py-1.5 px-1 w-full rounded-xl bg-[#0c1424] border border-teal-500/25">
        <span className="text-[8px] font-mono font-black text-teal-400 uppercase tracking-wider">
          5-STOP
        </span>
        <span className="text-[7px] font-mono text-slate-400">ASSEMBLY</span>
      </div>

      {/* 5-Stop Assembly Sub-Tabs */}
      <div className="flex flex-row md:flex-col flex-1 gap-1.5 w-full justify-center md:justify-start">
        {stops.map((stop) => {
          const isActive = currentMode === 'organogenesis' && activeStage === stop.id;
          return (
            <button
              key={stop.id}
              onClick={() => onSelectStop && onSelectStop(stop.id)}
              title={stop.desc}
              className={`flex-1 md:flex-none md:w-full py-1.5 px-1 rounded-xl border transition-all duration-150 flex flex-col items-center gap-0.5 cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-b from-cyan-950/80 to-[#0f1d2e] border-cyan-400/70 shadow-[0_0_14px_rgba(34,211,238,0.25)]'
                  : 'bg-[#0b1220]/60 border-slate-800/80 hover:border-cyan-500/35 hover:bg-[#0f172a]'
              }`}
            >
              <span className="text-base leading-none">{stop.icon}</span>
              <span
                className={`text-[8px] font-mono font-bold uppercase tracking-tight leading-none ${
                  isActive ? 'text-cyan-200' : 'text-slate-400'
                }`}
              >
                {stop.num}. {stop.label}
              </span>
              <span
                className={`text-[7.5px] font-mono font-black px-1 rounded border ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {stop.val}
              </span>
            </button>
          );
        })}

        {/* Direct Codon & Folding Studio Sub-Tab */}
        <button
          onClick={() => setMode('folding')}
          title="3D Codon Sequencer & Protein Folding Studio"
          className={`flex-1 md:flex-none md:w-full md:mt-auto py-1.5 px-1 rounded-xl border transition-all duration-150 flex flex-col items-center gap-0.5 cursor-pointer ${
            currentMode === 'folding'
              ? 'bg-purple-950/70 border-purple-400/70 shadow-[0_0_14px_rgba(168,85,247,0.25)]'
              : 'bg-[#0b1220]/60 border-slate-800/80 hover:border-purple-400/40'
          }`}
        >
          <span className="text-base leading-none">🧪</span>
          <span
            className={`text-[8px] font-mono font-bold uppercase tracking-tight leading-none ${
              currentMode === 'folding' ? 'text-purple-200' : 'text-slate-400'
            }`}
          >
            Codons
          </span>
        </button>

        {/* Bio Goals & Sub-Recipes Sub-Tab */}
        <button
          onClick={() => setMode('goals')}
          title="Bio Lab Guide, Desired Organ Outcomes & Physics/Chemistry Sub-Recipes"
          className={`flex-1 md:flex-none md:w-full py-1.5 px-1 rounded-xl border transition-all duration-150 flex flex-col items-center gap-0.5 cursor-pointer ${
            currentMode === 'goals'
              ? 'bg-emerald-950/70 border-emerald-400/70 shadow-[0_0_14px_rgba(16,185,129,0.25)]'
              : 'bg-[#0b1220]/60 border-slate-800/80 hover:border-emerald-400/40'
          }`}
        >
          <span className="text-base leading-none">🎯</span>
          <span
            className={`text-[8px] font-mono font-bold uppercase tracking-tight leading-none ${
              currentMode === 'goals' ? 'text-emerald-200' : 'text-slate-400'
            }`}
          >
            Goals
          </span>
        </button>
      </div>
    </div>
  );
};

export default BioModeSelector;
