import React from 'react';
import { CHEMICAL_INFO, elementaryChemicals, CHEMICAL_TYPES } from '../constants/chemicalInfo';

const ChemistryPalette = () => {
  const handleDragStart = (e, chemical) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: chemical.type }));
  };

  const getEmoji = (type) => {
    switch (type) {
      case CHEMICAL_TYPES.FLASK:
        return '🧪';
      case CHEMICAL_TYPES.WATER:
        return '💧';
      case CHEMICAL_TYPES.SALT:
        return '🧂';
      case CHEMICAL_TYPES.SALT_WATER:
        return '🌊';
      default:
        return '🧪';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-amber-300 mb-4 text-center">Chemicals</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {elementaryChemicals.map((chemical) => (
          <div
            key={chemical.id}
            draggable
            onDragStart={(e) => handleDragStart(e, chemical)}
            className="w-24 h-24 bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-grab p-2"
          >
            <div className="text-4xl">
              {getEmoji(chemical.type)}
            </div>
            <p className="text-center text-sm font-semibold mt-1 text-gray-300">
              {CHEMICAL_INFO[chemical.type].name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChemistryPalette;
