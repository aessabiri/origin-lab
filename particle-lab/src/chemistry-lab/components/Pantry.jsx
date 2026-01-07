import React, { useState } from 'react';
import { useChemistryStore } from '../store';
import { CHEMICALS, ELEMENTARY_IDS } from '../data/chemicals';
import ChemicalIcon from './ChemicalIcon';

const Pantry = () => {
  const inventory = useChemistryStore(state => state.inventory);
  const setInspectedChemical = useChemistryStore(state => state.setInspectedChemical);
  const [activeTab, setActiveTab] = useState('elementary');

  const handleDragStart = (e, chemicalId) => {
    e.dataTransfer.setData('chemicalId', chemicalId);
  };

  const visibleChemicals = activeTab === 'elementary' 
    ? ELEMENTARY_IDS 
    : inventory.filter(id => !ELEMENTARY_IDS.includes(id));

  return (
    <div className="w-full bg-gray-900 border-t border-gray-800 flex flex-col h-48 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-20">
      {/* Tabs */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('elementary')}
          className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'elementary' 
              ? 'bg-amber-500 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Elementary
        </button>
        <button
          onClick={() => setActiveTab('discovered')}
          className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'discovered' 
              ? 'bg-amber-500 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Discovered
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4 overflow-x-auto overflow-y-hidden">
        <div className="flex flex-row gap-4 h-full items-center">
          {visibleChemicals.length === 0 && (
            <div className="w-full text-center text-gray-500 italic">
              {activeTab === 'discovered' ? "No discoveries yet. Experiment!" : "No chemicals found."}
            </div>
          )}
          
          {visibleChemicals.map(chemId => {
            const chem = CHEMICALS[chemId];
            if (!chem) return null; // Safety check in case chemical is removed from definitions
            
            return (
              <div 
                key={chemId}
                draggable
                onDragStart={(e) => handleDragStart(e, chemId)}
                onDoubleClick={() => setInspectedChemical(chemId)}
                className="min-w-[80px] w-24 flex flex-col items-center gap-1 p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-400/50 hover:bg-gray-750 cursor-grab active:cursor-grabbing transition-all group"
                title={chem.description}
              >
                <div className="py-2">
                  <ChemicalIcon 
                    color={chem.color} 
                    state={chem.state} 
                    formula={chem.formula} 
                    iconType={chem.iconType}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs text-center text-gray-300 font-medium group-hover:text-white w-full truncate px-1">{chem.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pantry;