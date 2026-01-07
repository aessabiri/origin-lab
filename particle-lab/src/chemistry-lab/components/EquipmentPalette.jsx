import React from 'react';
import { EQUIPMENT } from '../data/equipment';
import { useChemistryStore } from '../store';

const EquipmentPalette = ({ isOpen, onClose }) => {
  const createVessel = useChemistryStore(state => state.createVessel);
  const unlockedEquipment = useChemistryStore(state => state.unlockedEquipment);

  if (!isOpen) return null;

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'equipment', data: item }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const visibleEquipment = EQUIPMENT.filter(item => unlockedEquipment.includes(item.id));

  return (
    <div className="absolute top-0 right-full mr-4 z-40 w-64 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="bg-gray-900 p-3 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-white font-bold text-sm tracking-wide">LAB EQUIPMENT</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {visibleEquipment.map((item) => (
          <div 
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="flex items-center gap-3 p-2 bg-gray-700/50 rounded border border-gray-600 hover:border-amber-500 hover:bg-gray-700 cursor-grab active:cursor-grabbing transition-all group"
          >
            {/* Icon Placeholder */}
            <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
               {item.icon === 'beaker' && '🥛'}
               {item.icon === 'flask' && '⚗️'}
               {item.icon === 'reactor' && '☢️'}
               {item.icon === 'crucible' && '🔥'}
               {item.icon === 'vial' && '🧪'}
               {item.icon === 'condenser' && '💧'}
            </div>
            
            {/* Info */}
            <div className="flex-1">
                <h4 className="text-gray-200 text-xs font-bold">{item.name}</h4>
                <div className="text-[10px] text-gray-400 flex gap-2 mt-1">
                    <span>🌡️ {item.stats.maxTemp}°C</span>
                    <span>📊 {item.stats.maxVol}ml</span>
                </div>
            </div>
            
            {/* Add Button (Mobile friendly fallback) */}
            <button 
                onClick={() => createVessel(item)}
                className="p-1 text-gray-500 hover:text-green-400"
                title="Add to Workspace"
            >
                +
            </button>
          </div>
        ))}
      </div>
      
      {/* Footer Hint */}
      <div className="bg-gray-900/50 p-2 text-[10px] text-gray-500 text-center border-t border-gray-700">
        Drag to workstation
      </div>
    </div>
  );
};

export default EquipmentPalette;
