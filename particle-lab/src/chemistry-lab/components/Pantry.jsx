import React, { useState, useMemo } from 'react';
import { useChemistryStore } from '../store';
import { CHEMICALS, ELEMENTARY_IDS } from '../data/chemicals';
import { useInventory } from '../../store/inventory';
import ChemicalIcon from './ChemicalIcon';

// Map Inventory Keys -> Chemistry Lab Data Keys
const INVENTORY_TO_CHEMICAL_MAP = {
  // Elements
  'hydrogen': 'HYDROGEN',
  'helium': 'HELIUM', // Needs addition to data if used
  'carbon': 'CARBON',
  'nitrogen': 'NITROGEN',
  'oxygen': 'OXYGEN',
  'phosphorus': 'PHOSPHORUS', // Needs addition
  'sulfur': 'SULFUR',
  'iron': 'IRON',
  'magnesium': 'MAGNESIUM',
  // Compounds
  'water': 'H2O',
  'ammonia': 'AMMONIA',
  'methane': 'METHANE',
  'glucose': 'GLUCOSE',
  'glycine': 'GLYCINE',
  'ethanol': 'ETHANOL',
  'co2': 'CO2',
};

const Pantry = () => {
  const setInspectedChemical = useChemistryStore(state => state.setInspectedChemical);
  const gameMode = useChemistryStore(state => state.gameMode);
  const { elements, compounds } = useInventory();
  const [activeTab, setActiveTab] = useState('elementary');

  const handleDragStart = (e, chemicalId) => {
    e.dataTransfer.setData('chemicalId', chemicalId);
  };

  const inventoryItems = useMemo(() => {
    const items = [];
    // Process Elements
    Object.entries(elements).forEach(([key, count]) => {
      if (count > 0 && INVENTORY_TO_CHEMICAL_MAP[key]) {
        items.push({ id: INVENTORY_TO_CHEMICAL_MAP[key], count });
      }
    });
    // Process Compounds
    Object.entries(compounds).forEach(([key, count]) => {
      if (count > 0 && INVENTORY_TO_CHEMICAL_MAP[key]) {
        items.push({ id: INVENTORY_TO_CHEMICAL_MAP[key], count });
      }
    });
    return items;
  }, [elements, compounds]);

  const displayedChemicals = useMemo(() => {
    if (gameMode === 'sandbox') {
      return Object.keys(CHEMICALS).map(id => ({ id, count: Infinity }));
    }
    return inventoryItems;
  }, [gameMode, inventoryItems]);

  const filteredChemicals = displayedChemicals.filter(item => {
    const isElementary = ELEMENTARY_IDS.includes(item.id);
    return activeTab === 'elementary' ? isElementary : !isElementary;
  });

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
          Compounds
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4 overflow-x-auto overflow-y-hidden">
        <div className="flex flex-row gap-4 h-full items-center">
          {filteredChemicals.length === 0 && (
            <div className="w-full text-center text-gray-500 italic">
              {activeTab === 'elementary' 
                ? "No elements available. Synthesize atoms in the Particle Lab!" 
                : "No compounds available. Synthesize molecules in the Particle Lab!"}
            </div>
          )}
          
          {filteredChemicals.map(({ id: chemId, count }) => {
            const chem = CHEMICALS[chemId];
            if (!chem) return null;
            
            return (
              <div 
                key={chemId}
                draggable
                onDragStart={(e) => handleDragStart(e, chemId)}
                onDoubleClick={() => setInspectedChemical(chemId)}
                className="min-w-[80px] w-24 flex flex-col items-center gap-1 p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-400/50 hover:bg-gray-750 cursor-grab active:cursor-grabbing transition-all group relative"
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
                
                {gameMode !== 'sandbox' && (
                  <span className="absolute top-1 right-1 bg-gray-700 text-xs text-amber-400 px-1.5 py-0.5 rounded-full font-mono border border-gray-600">
                    x{count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pantry;