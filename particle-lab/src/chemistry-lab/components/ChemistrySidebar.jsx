import React, { useState } from 'react';
import { useChemistryStore } from '../store';
import { EQUIPMENT } from '../data/equipment';
import ResourceExchange from '../../components/ResourceExchange.jsx';
import ChemicalIcon from './ChemicalIcon.jsx';
import { MATTER_DEFINITIONS } from '../../constants/matterRegistry.js';

const ChemistrySidebar = () => {
  const [activeTab, setActiveTab] = useState('storage'); // 'storage' | 'equipment'
  const localInventory = useChemistryStore(state => state.localInventory);
  const addToLocalInventory = useChemistryStore(state => state.addToLocalInventory);
  
  const handleImport = (itemId, amount) => {
    addToLocalInventory(itemId, amount);
  };

  const handleDragStart = (e, chemicalId) => {
    // Vessel.jsx expects 'chemicalId' directly
    e.dataTransfer.setData('chemicalId', chemicalId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col border-r border-gray-800">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('storage')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'storage' ? 'bg-gray-800 text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Storage
        </button>
        <button 
          onClick={() => setActiveTab('equipment')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'equipment' ? 'bg-gray-800 text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Equipment
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* Storage Tab */}
        {activeTab === 'storage' && (
          <div className="absolute inset-0 flex flex-col">
            {/* Import Area (Top) */}
            <div className="h-1/2 border-b border-gray-800 relative">
               <div className="absolute top-2 left-2 z-10 bg-gray-900/80 px-2 py-1 rounded text-[10px] font-mono text-amber-500 uppercase">Global Import</div>
               <ResourceExchange 
                 labName="Chemistry Lab"
                 onImport={handleImport}
                 allowedCategories={['Atomic', 'Molecular']}
                 excludedCategories={['Fundamental']} 
               />
            </div>

            {/* Local Inventory List (Bottom) */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
               <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Local Bench</h3>
               
               {Object.keys(localInventory).length === 0 ? (
                 <div className="text-center mt-8 text-gray-600 text-xs italic">
                   Bench is empty.<br/>Import items from above.
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-2">
                   {Object.entries(localInventory).map(([id, amount]) => {
                     const chemical = MATTER_DEFINITIONS[id] || { name: id, color: '#999', formula: '?' };
                     return (
                       <div 
                         key={id}
                         draggable
                         onDragStart={(e) => handleDragStart(e, id)} 
                         className="p-2 bg-gray-800 border border-gray-700 rounded hover:border-amber-500 cursor-grab active:cursor-grabbing group relative flex flex-col items-center gap-2"
                       >
                          <ChemicalIcon 
                            id={id} 
                            color={chemical.color} 
                            state={chemical.state} 
                            formula={chemical.formula} 
                            iconType={chemical.iconType} 
                            className="w-12 h-12"
                          />
                          <div className="w-full text-center">
                            <div className="text-[10px] font-bold text-gray-200 truncate w-full">{chemical.name}</div>
                            <div className="text-[9px] text-emerald-500 font-mono">Available</div>
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 px-2 py-1 bg-black text-white text-[10px] rounded whitespace-nowrap pointer-events-none z-50 shadow-lg">
                             Drag to Vessel
                          </div>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="absolute inset-0 p-4 overflow-y-auto">
             <InventoryEquipmentList />
          </div>
        )}

      </div>
    </div>
  );
};

const InventoryEquipmentList = () => {
  const createVessel = useChemistryStore(state => state.createVessel);
  // Unlocked check removed: All equipment available all the time.
  
  const visibleEquipment = EQUIPMENT;

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'equipment', data: item }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="space-y-2">
        {visibleEquipment.map((item) => (
          <div 
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded border border-gray-700 hover:border-amber-500 hover:bg-gray-700 cursor-grab active:cursor-grabbing transition-all group"
          >
            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-lg">
               {item.icon === 'beaker' && '🥛'}
               {item.icon === 'flask' && '⚗️'}
               {item.icon === 'reactor' && '☢️'}
               {item.icon === 'crucible' && '🔥'}
               {item.icon === 'vial' && '🧪'}
               {item.icon === 'condenser' && '💧'}
            </div>
            <div className="flex-1">
                <h4 className="text-gray-200 text-xs font-bold">{item.name}</h4>
                <div className="text-[9px] text-gray-500 flex gap-2">
                    <span>{item.stats.maxVol}ml</span>
                </div>
            </div>
            <button 
                onClick={() => createVessel(item)}
                className="text-gray-500 hover:text-green-400 font-bold"
            >
                +
            </button>
          </div>
        ))}
    </div>
  );
}

export default ChemistrySidebar;