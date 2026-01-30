import React from 'react';
import {
  PERIODIC_TABLE_LAYOUT,
  ATOMIC_NUMBER_TO_TYPE,
  ISOTOPE_AND_SPECIAL_LIST,
  LANTHANIDE_SERIES,
  ACTINIDE_SERIES
} from '../../constants/periodicTableLayout.js';
import { PARTICLE_NAMES, PARTICLE_COLORS } from '../../constants/particles.js';
import ParticleIcon from './ParticleIcon.jsx';

const PeriodicTable = ({ discoveredParticles, isSandboxMode, onDragStart, onClose, onParticleClick, isPinned, onPinToggle, ...props }) => {
  // We don't check for isVisible here, as it's handled by the parent with conditional rendering

  const discoveredSet = new Set(discoveredParticles.map(p => p.type));

  const renderCell = (atomicNumber, isPlaceholder = false, placeholderText = '') => {
    const type = ATOMIC_NUMBER_TO_TYPE[atomicNumber];
    const isDiscovered = isSandboxMode || (type ? discoveredSet.has(type) : false);
    const particle = type ? { id: type, type } : null;

    if (isPlaceholder) {
      return (
        <div className="w-14 h-14 rounded-md flex items-center justify-center bg-gray-600 text-gray-400 text-[10px] text-center px-1">
          {placeholderText}
        </div>
      );
    }

    if (!type) return <div key={`empty-${Math.random()}`} className="w-14 h-14" />;

    return (
      <div
        key={type}
        draggable={isDiscovered}
        onDragStart={(e) => isDiscovered && onDragStart(e, particle)}
        onClick={() => isDiscovered && onParticleClick(type)}
        className={`relative w-14 h-14 rounded-md flex flex-col items-center justify-center text-white transition-all duration-500 ${isDiscovered ? 'cursor-pointer hover:ring-2 ring-amber-300' : 'bg-gray-700 cursor-default'}`}
        style={isDiscovered ? { backgroundColor: PARTICLE_COLORS[type] } : {}}
      >
        <div className={`absolute inset-0 flex flex-col items-center justify-between py-1 transition-all duration-300 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'}`} style={{ fontSize: '0.65rem' }}>
          <span className="font-mono font-bold opacity-70 leading-none text-[8px]">{atomicNumber}</span>
          <span className="font-mono text-lg font-black leading-none tracking-tighter">{PARTICLE_NAMES[type].substring(0, 2)}</span>
          <div className="w-full px-0.5 overflow-hidden">
            <p className="font-sans text-[7px] font-bold leading-tight text-center break-words uppercase tracking-tighter">
              {PARTICLE_NAMES[type]}
            </p>
          </div>
        </div>
        {!isDiscovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-lg font-bold text-gray-500">?</span>
          </div>
        )}
      </div>
    );
  };

  const renderSpecialParticle = (type) => {
    const isDiscovered = isSandboxMode || discoveredSet.has(type);
    const particle = { id: type, type };

    return (
      <div
        key={type}
        draggable={isDiscovered}
        onDragStart={(e) => isDiscovered && onDragStart(e, particle)}
        onClick={() => isDiscovered && onParticleClick(type)}
        className={`relative w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white transition-all duration-500 ${isDiscovered ? 'cursor-pointer hover:ring-2 ring-amber-300' : 'bg-gray-700 cursor-default'}`}
        style={isDiscovered ? { backgroundColor: PARTICLE_COLORS[type] } : {}}
      >
        <div className={`w-full h-full p-2 transition-all duration-500 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'}`}>
          <ParticleIcon type={type} color={PARTICLE_COLORS[type]} isCompound />
        </div>
        <span className={`absolute bottom-0 text-[8px] font-mono font-bold text-white text-center p-0.5 transition-all duration-500 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'} bg-black/30 w-full rounded-b-lg`}>{PARTICLE_NAMES[type]}</span>
        {!isDiscovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-2xl font-bold text-gray-500">?</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-gray-700" {...props}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-mono font-bold text-indigo-300">Periodic Table</h3>
          <button
            onClick={onPinToggle}
            title={isPinned ? 'Unpin Table' : 'Pin Table'}
            className={`p-2 rounded-md transition-colors ${isPinned ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 9.586V4a1 1 0 011-1zM3 14a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <button onClick={onClose} className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-700 text-white font-bold transition-colors">&times;</button>
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

      <h3 className="text-xl font-mono font-bold mt-6 mb-2 text-indigo-300">Isotopes & More</h3>
      <div className="flex flex-wrap gap-2">
        {ISOTOPE_AND_SPECIAL_LIST.map(type => renderSpecialParticle(type))}
      </div>
    </div>
  );
};

export default PeriodicTable;