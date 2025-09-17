import React from 'react';
import {
  PERIODIC_TABLE_LAYOUT,
  ATOMIC_NUMBER_TO_TYPE,
  ISOTOPE_AND_SPECIAL_LIST,
  LANTHANIDE_SERIES,
  ACTINIDE_SERIES
} from '../constants/periodicTableLayout.js';
import { PARTICLE_NAMES, PARTICLE_COLORS } from '../constants/particles.js';
import ParticleIcon from './ParticleIcon.jsx';

const PeriodicTable = ({ discoveredParticles, onDragStart, isVisible, onClose, onParticleClick }) => {
  if (!isVisible) return null;

  const discoveredSet = new Set(discoveredParticles.map(p => p.type));

  const renderCell = (atomicNumber, isPlaceholder = false, placeholderText = '') => {
    const type = ATOMIC_NUMBER_TO_TYPE[atomicNumber];
    const isDiscovered = type ? discoveredSet.has(type) : false;
    const particle = type ? { id: type, type } : null;

    if (isPlaceholder) {
      return (
        <div className="w-16 h-16 rounded-md flex items-center justify-center bg-gray-600 text-gray-400 text-xs">
          {placeholderText}
        </div>
      );
    }

    if (!type) return <div key={`empty-${Math.random()}`} className="w-16 h-16" />;

    return (
      <div
        key={type}
        draggable={isDiscovered}
        onDragStart={(e) => isDiscovered && onDragStart(e, particle)}
        onClick={() => isDiscovered && onParticleClick(type)}
        className={`relative w-16 h-16 rounded-md flex flex-col items-center justify-center text-white transition-all duration-500 ${isDiscovered ? PARTICLE_COLORS[type] : 'bg-gray-700'} ${isDiscovered ? 'cursor-pointer hover:ring-2 ring-amber-300' : 'cursor-default'}`}
      >
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-1 transition-all duration-300 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'}`} style={{ fontSize: '0.75rem' }}>
          <span className="font-bold">{atomicNumber}</span>
          <span className="text-xl font-black">{PARTICLE_NAMES[type].substring(0, 2)}</span>
          <span className="truncate w-full text-center">{PARTICLE_NAMES[type]}</span>
        </div>
        {!isDiscovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-500">?</span>
          </div>
        )}
      </div>
    );
  };

  const renderSpecialParticle = (type) => {
    const isDiscovered = discoveredSet.has(type);
    const particle = { id: type, type };

    return (
      <div
        key={type}
        draggable={isDiscovered}
        onDragStart={(e) => isDiscovered && onDragStart(e, particle)}
        onClick={() => isDiscovered && onParticleClick(type)}
        className={`relative w-20 h-20 rounded-lg flex flex-col items-center justify-center text-white transition-all duration-500 ${isDiscovered ? PARTICLE_COLORS[type] : 'bg-gray-700'} ${isDiscovered ? 'cursor-pointer hover:ring-2 ring-amber-300' : 'cursor-default'}`}
      >
        <div className={`w-full h-full transition-all duration-500 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'}`}>
          <ParticleIcon type={type} color={PARTICLE_COLORS[type]} isCompound />
        </div>
        <span className={`absolute text-sm font-bold text-white text-center p-1 transition-all duration-500 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'}`}>{PARTICLE_NAMES[type]}</span>
        {!isDiscovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-500">?</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-700 z-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Periodic Table</h3>
        <button onClick={onClose} className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-700 text-white font-bold">&times;</button>
      </div>

      {/* Main Table */}
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
        {PERIODIC_TABLE_LAYOUT.flat().map((atomicNumber, i) => {
          if (atomicNumber > 0) return renderCell(atomicNumber);
          if (atomicNumber === -1) return renderCell(0, true, '57-71');
          if (atomicNumber === -2) return renderCell(0, true, '89-103');
          return <div key={`spacer-${i}`} />;
        })}
      </div>

      {/* Spacer */}
      <div className="h-4" />

      {/* Lanthanide and Actinide Series */}
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
        <div className="col-span-2" /> {/* Indentation */}
        {LANTHANIDE_SERIES.map((atomicNumber) => renderCell(atomicNumber))}
        <div className="col-span-1" />
        {ACTINIDE_SERIES.map((atomicNumber) => renderCell(atomicNumber))}
      </div>

      <h3 className="text-xl font-bold mt-6 mb-2">Isotopes & More</h3>
      <div className="flex flex-wrap gap-2">
        {ISOTOPE_AND_SPECIAL_LIST.map(type => renderSpecialParticle(type))}
      </div>
    </div>
  );
};

export default PeriodicTable;