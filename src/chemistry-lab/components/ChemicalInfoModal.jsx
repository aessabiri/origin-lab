import React from 'react';
import { useChemistryStore } from '../store';
import { MATTER_DEFINITIONS } from '../../constants/matterRegistry';
import ChemicalIcon from './ChemicalIcon';
import MoleculeStructure from './MoleculeStructure';

const ChemicalInfoModal = () => {
  const inspectedChemicalId = useChemistryStore(state => state.inspectedChemical);
  const setInspectedChemical = useChemistryStore(state => state.setInspectedChemical);

  if (!inspectedChemicalId) return null;

  const chemical = MATTER_DEFINITIONS[inspectedChemicalId];
  if (!chemical) return null;

  const handleClose = () => setInspectedChemical(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" onClick={handleClose}>
      <div 
        className="bg-[#0b1224] p-7 rounded-3xl border border-emerald-500/40 w-[540px] shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative overflow-hidden text-white" 
        onClick={e => e.stopPropagation()}
      >
        {/* Holographic Scanline & Radial Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] [background-size:100%_4px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-emerald-500/10 via-cyan-500/5 to-transparent rounded-bl-full pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#060b17] rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
              <ChemicalIcon 
                color={chemical.color} 
                state={chemical.state} 
                formula={chemical.formula} 
                iconType={chemical.iconType}
                className="w-12 h-12"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-sans text-slate-100">{chemical.name}</h2>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                  {chemical.category || 'Compound'}
                </span>
              </div>
              <span className="text-base font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400">
                {chemical.formula || 'N/A'}
              </span>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main Info Columns */}
        <div className="flex gap-5 relative z-10 mb-6">
          
          {/* Left Column: Properties */}
          <div className="flex-1 space-y-3">
            
            {/* Description Card */}
            <div className="bg-[#060b17] p-3.5 rounded-2xl border border-slate-800/80 min-h-[70px] flex items-center shadow-inner">
              <p className="text-slate-300 italic text-xs leading-relaxed">
                "{chemical.description || 'Molecular species identified in universal catalog.'}"
              </p>
            </div>

            {/* Spec Grid */}
            <div className="grid grid-cols-2 gap-2">
              
              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Physical State</span>
                <span className="text-slate-200 text-xs font-bold capitalize flex items-center gap-1.5">
                  {chemical.state === 'solid' && '🪨 Solid'}
                  {chemical.state === 'liquid' && '💧 Liquid'}
                  {chemical.state === 'gas' && '💨 Gas'}
                  {!['solid', 'liquid', 'gas'].includes(chemical.state) && `${chemical.state || 'Unknown'}`}
                </span>
              </div>

              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Density</span>
                <span className="text-slate-200 text-xs font-mono font-bold">
                  {chemical.density ? `${chemical.density} g/cm³` : 'Standard'}
                </span>
              </div>

              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Boiling Point</span>
                <span className="text-slate-200 text-xs font-mono font-bold">
                  {chemical.boilingPoint !== undefined ? `${chemical.boilingPoint}°C` : 'N/A'}
                </span>
              </div>

              <div className="bg-[#070d1a] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">Melting Point</span>
                <span className="text-slate-200 text-xs font-mono font-bold">
                  {chemical.meltingPoint !== undefined ? `${chemical.meltingPoint}°C` : 'N/A'}
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: 2D Molecular Graph */}
          <div className="w-48 flex flex-col">
            <div className="bg-[#050914] rounded-2xl border border-slate-800 h-full flex flex-col overflow-hidden shadow-inner">
              <div className="bg-slate-900/80 px-3 py-1.5 border-b border-slate-800 flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-wider">Molecular Bond Map</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <div className="flex-1 w-full p-2 flex items-center justify-center relative">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0,transparent_70%)] pointer-events-none" />
                <MoleculeStructure chemicalId={inspectedChemicalId} className="w-full h-full" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800 relative z-10">
          <button 
            onClick={handleClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold transition-all border border-slate-700 active:scale-95"
          >
            Dismiss Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChemicalInfoModal);

