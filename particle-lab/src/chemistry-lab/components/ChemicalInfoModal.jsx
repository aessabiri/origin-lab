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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleClose}>
      <div 
        className="bg-gray-800 p-6 rounded-xl border border-gray-600 w-[500px] shadow-2xl relative overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700 shadow-inner">
                     <ChemicalIcon 
                        color={chemical.color} 
                        state={chemical.state} 
                        formula={chemical.formula} 
                        iconType={chemical.iconType}
                     />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{chemical.name}</h2>
                    <span className="text-lg font-mono text-amber-400 tracking-wide">{chemical.formula}</span>
                </div>
            </div>
            <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
            >
                ✕
            </button>
        </div>

        {/* Content */}
        <div className="flex gap-4 relative z-10 mb-4">
             {/* Left Column: Stats */}
             <div className="flex-1 space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 min-h-[80px]">
                    <p className="text-gray-300 italic text-sm">"{chemical.description}"</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-700/30 p-2 rounded border border-gray-700">
                        <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">State</span>
                        <span className="text-white text-sm capitalize flex items-center gap-2">
                            {chemical.state === 'solid' && '🪨 Solid'}
                            {chemical.state === 'liquid' && '💧 Liquid'}
                            {chemical.state === 'gas' && '💨 Gas'}
                        </span>
                    </div>
                    <div className="bg-gray-700/30 p-2 rounded border border-gray-700">
                        <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">Density</span>
                        <span className="text-white text-sm font-mono">{chemical.density} g/cm³</span>
                    </div>
                </div>
             </div>

             {/* Right Column: Structure */}
             <div className="w-48">
                 <div className="bg-black/40 rounded-lg border border-gray-600 h-40 flex flex-col overflow-hidden">
                     <div className="bg-gray-700/50 px-2 py-1 border-b border-gray-600">
                        <span className="text-[10px] text-gray-300 font-mono uppercase">Molecular Structure</span>
                     </div>
                     <MoleculeStructure chemicalId={inspectedChemicalId} className="flex-1 w-full" />
                 </div>
             </div>
        </div>

        {/* Footer Action */}
        <div className="mt-2 flex justify-end pt-4 border-t border-gray-700">
             <button 
                onClick={handleClose}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors border border-gray-600"
            >
                Close Panel
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChemicalInfoModal;
