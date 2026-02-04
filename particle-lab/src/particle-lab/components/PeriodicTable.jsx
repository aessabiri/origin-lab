import React from 'react';
import {
  PERIODIC_TABLE_LAYOUT,
  ATOMIC_NUMBER_TO_TYPE,
  CATEGORIZED_SPECIAL_LIST,
  LANTHANIDE_SERIES,
  ACTINIDE_SERIES
} from '../../constants/periodicTableLayout.js';
import { PARTICLE_NAMES, PARTICLE_COLORS } from '../../constants/particles.js';
import ParticleIcon from './ParticleIcon.jsx';

const PeriodicTable = ({ discoveredParticles, isSandboxMode, onDragStart, onClose, onParticleClick, isPinned, onPinToggle, ...props }) => {
  const discoveredSet = new Set(discoveredParticles.map(p => p.type));

  const renderCell = (atomicNumber, isPlaceholder = false, placeholderText = '') => {
    const type = ATOMIC_NUMBER_TO_TYPE[atomicNumber];
    const isDiscovered = isSandboxMode || (type ? discoveredSet.has(type) : false);
    const particle = type ? { id: type, type } : null;

    if (isPlaceholder) {
      return (
        <div key={`placeholder-${placeholderText}-${atomicNumber}`} className="w-14 h-14 rounded-md bg-gray-800/50 text-gray-500 text-[10px] text-center flex items-center justify-center border border-gray-700/30">
          {placeholderText}
        </div>
      );
    }

    if (!type) {
      return (
        <div key={`phantom-${atomicNumber}`} className="w-14 h-14 rounded-md border border-gray-800/20 bg-gray-900/10 flex items-center justify-center">
           <span className="font-mono text-[9px] text-gray-800 font-bold">{atomicNumber}</span>
        </div>
      );
    }

    return (
      <div
        key={type}
        draggable={isDiscovered}
        onDragStart={(e) => isDiscovered && onDragStart(e, particle)}
        onClick={() => isDiscovered && onParticleClick(type)}
        className={`relative w-14 h-14 rounded-md flex flex-col items-center justify-center text-white transition-all duration-500 ${isDiscovered ? 'cursor-pointer hover:ring-2 ring-amber-300 z-10 hover:scale-110 shadow-lg' : 'bg-gray-800/80 cursor-default opacity-30 border border-gray-700'}`}
        style={isDiscovered ? { backgroundColor: PARTICLE_COLORS[type] } : {}}
      >
        <div className={`absolute inset-0 flex flex-col items-center justify-between py-1 transition-all duration-300 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'}`} style={{ fontSize: '0.65rem' }}>
          <span className="font-mono font-bold opacity-70 leading-none text-[8px]">{atomicNumber}</span>
          <span className="font-mono text-lg font-black leading-none tracking-tighter">{PARTICLE_NAMES[type]?.substring(0, 2)}</span>
          <div className="w-full px-0.5 overflow-hidden">
            <p className="font-sans text-[7px] font-bold leading-tight text-center truncate uppercase tracking-tighter opacity-80">
              {PARTICLE_NAMES[type]}
            </p>
          </div>
        </div>
        {!isDiscovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] font-bold text-gray-600">{atomicNumber}</span>
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
        className={`relative w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white transition-all duration-500 ${isDiscovered ? 'cursor-pointer hover:ring-2 ring-amber-300 hover:scale-105 shadow-lg' : 'bg-gray-800/80 cursor-default opacity-40 border border-gray-700'}`}
        style={isDiscovered ? { backgroundColor: PARTICLE_COLORS[type] } : {}}
      >
        <div className={`w-full h-full p-2 transition-all duration-500 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'}`}>
          <ParticleIcon type={type} color={PARTICLE_COLORS[type]} isCompound />
        </div>
        <span className={`absolute bottom-0 text-[8px] font-mono font-bold text-white text-center p-0.5 transition-all duration-500 ${isDiscovered ? 'opacity-100' : 'opacity-0 blur-sm'} bg-black/40 w-full rounded-b-lg truncate px-1`}>{PARTICLE_NAMES[type]}</span>
        {!isDiscovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-2xl font-bold text-gray-600">?</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar max-w-[1200px]" {...props}>
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900/95 z-20 py-2 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-mono font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">Table of Elements</h3>
          <button
            onClick={onPinToggle}
            title={isPinned ? 'Unpin Table' : 'Pin Table'}
            className={`p-1.5 rounded-lg transition-all ${isPinned ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 9.586V4a1 1 0 011-1zM3 14a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all text-lg font-bold">&times;</button>
      </div>

      <div className="flex flex-col gap-6">
        {/* 1. Main Periodic Grid */}
        <section className="overflow-x-auto pb-2">
          <div className="grid gap-1 w-fit mx-auto" style={{ gridTemplateColumns: 'repeat(18, minmax(56px, 1fr))' }}>
            {PERIODIC_TABLE_LAYOUT.flat().map((atomicNumber, i) => {
              if (atomicNumber > 0) return renderCell(atomicNumber);
              if (atomicNumber === -1) return renderCell(0, true, '57-71');
              if (atomicNumber === -2) return renderCell(0, true, '89-103');
              return <div key={`spacer-${i}`} className="w-14 h-14" />;
            })}
          </div>

          <div className="mt-3 grid gap-1 w-fit mx-auto" style={{ gridTemplateColumns: 'repeat(18, minmax(56px, 1fr))' }}>
            <div className="col-span-2" /> 
            {LANTHANIDE_SERIES.map((atomicNumber) => renderCell(atomicNumber))}
            <div className="col-span-1" />
            <div className="col-span-2" />
            {ACTINIDE_SERIES.map((atomicNumber) => renderCell(atomicNumber))}
          </div>
        </section>

        {/* 2. Special Categories - Stacked Vertically */}
        <section className="border-t border-gray-800 pt-4">
          <div className="flex flex-col gap-6">
            {CATEGORIZED_SPECIAL_LIST.map((category) => (
              <div key={category.name} className="flex flex-col gap-3">
                <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-indigo-500">{category.name}</h4>
                <div className="flex flex-wrap gap-2 pl-2">
                  {category.particles.map(type => renderSpecialParticle(type))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PeriodicTable;