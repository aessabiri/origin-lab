import React, { useState } from 'react';
import { useChemistryStore } from '../store';
import { CHEMICALS } from '../data/chemicals';
import { REACTIONS } from '../data/reactions';
import ChemicalIcon from './ChemicalIcon';

const ChemistryCodex = ({ isOpen, onClose }) => {
  const inventory = useChemistryStore(state => state.inventory);
  const [selectedId, setSelectedId] = useState(null);

  if (!isOpen) return null;

  // Group chemicals
  const allChemicals = Object.values(CHEMICALS).sort((a, b) => a.name.localeCompare(b.name));
  const discovered = allChemicals.filter(c => inventory.includes(c.id));
  const unknown = allChemicals.filter(c => !inventory.includes(c.id));

  const handleSelect = (id) => setSelectedId(id);

  const selectedChemical = selectedId ? CHEMICALS[selectedId] : (discovered[0] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-gray-700 w-3/4 h-3/4 rounded-2xl flex overflow-hidden shadow-2xl max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 bg-gray-800 z-10">
             <h2 className="text-xl font-bold text-amber-500 font-serif flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Chemical Codex
             </h2>
             <p className="text-xs text-gray-400 mt-1 pl-7">
               Discovered: <span className="text-white font-bold">{discovered.length}</span> / {allChemicals.length}
             </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-600">
            {discovered.map(chem => (
              <button
                key={chem.id}
                onClick={() => handleSelect(chem.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${selectedChemical?.id === chem.id ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'hover:bg-gray-700 text-gray-300 border border-transparent'}`}
              >
                <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{backgroundColor: chem.color}} />
                <span className="font-medium truncate">{chem.name}</span>
              </button>
            ))}
            
            {unknown.length > 0 && (
               <div className="mt-4 pt-4 border-t border-gray-700/50">
                 <h3 className="text-[10px] font-bold text-gray-500 px-3 mb-2 uppercase tracking-widest opacity-70">Undiscovered</h3>
                 {unknown.map(chem => (
                    <div key={chem.id} className="px-3 py-2 text-gray-600 flex items-center gap-3 cursor-not-allowed opacity-50 select-none">
                       <div className="w-2 h-2 rounded-full bg-gray-700" />
                       <span>?????????</span>
                    </div>
                 ))}
               </div>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-slate-900 p-8 flex flex-col items-center justify-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {selectedChemical ? (
            <div className="flex flex-col items-center animate-fadeIn w-full max-w-md">
              <div className="mb-8 transform scale-[2.0] drop-shadow-2xl">
                <ChemicalIcon 
                  color={selectedChemical.color}
                  state={selectedChemical.state}
                  formula={selectedChemical.formula}
                />
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-2 font-serif text-center drop-shadow-md">{selectedChemical.name}</h1>
              <div className="inline-block bg-gray-800/80 px-4 py-1 rounded-full text-amber-400 font-mono text-xl mb-8 border border-gray-600 shadow-inner">
                {selectedChemical.formula}
              </div>

              <div className="w-full bg-gray-800/40 p-6 rounded-xl border border-gray-700 backdrop-blur-md shadow-xl">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-700 pb-2">Properties</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mb-6">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase mb-1">State</span>
                    <span className="text-white capitalize font-medium flex items-center gap-2">
                      {selectedChemical.state}
                      {selectedChemical.state === 'liquid' && '💧'}
                      {selectedChemical.state === 'solid' && '💎'}
                      {selectedChemical.state === 'gas' && '☁️'}
                    </span>
                  </div>
                   <div>
                    <span className="text-gray-500 block text-xs uppercase mb-1">Density</span>
                    <span className="text-white font-medium">{selectedChemical.density} <span className="text-gray-500 text-xs">g/cm³</span></span>
                  </div>
                </div>
                
                 <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-700 pb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed italic mb-6">"{selectedChemical.description}"</p>

                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-700 pb-2">Synthesis</h3>
                <div className="text-sm text-gray-300">
                  {(() => {
                    const recipes = REACTIONS.filter(r => r.outputs[selectedChemical.id]);
                    
                    if (recipes.length === 0) {
                      return <p className="text-gray-500 italic">Foundational Element (Cannot be synthesized).</p>;
                    }

                    return recipes.map((recipe, idx) => (
                      <div key={idx} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 mb-2">
                        <div className="flex flex-wrap gap-2 items-center mb-2">
                           <span className="text-xs text-gray-400 uppercase">Ingredients:</span>
                           {Object.keys(recipe.inputs).map(inputId => (
                             <span key={inputId} className="bg-gray-700 px-2 py-0.5 rounded text-white text-xs">
                               {CHEMICALS[inputId]?.name || inputId}
                             </span>
                           ))}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-amber-400 font-mono">
                           {recipe.conditions.tempMin && (
                             <span className="flex items-center gap-1">
                               🔥 &gt; {recipe.conditions.tempMin}°C
                             </span>
                           )}
                           {recipe.conditions.pressureMin && (
                             <span className="flex items-center gap-1">
                               ⏲️ &gt; {recipe.conditions.pressureMin} atm
                             </span>
                           )}
                           {!recipe.conditions.tempMin && !recipe.conditions.pressureMin && (
                             <span className="text-gray-400">No special conditions</span>
                           )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <span className="text-4xl mb-4">🧪</span>
              <p>Select a chemical from the list to view its properties.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChemistryCodex;
