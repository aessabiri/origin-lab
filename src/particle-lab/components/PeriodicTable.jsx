import React, { useState, useMemo } from 'react';
import {
  PERIODIC_TABLE_LAYOUT,
  ATOMIC_NUMBER_TO_TYPE,
  CATEGORIZED_SPECIAL_LIST,
  LANTHANIDE_SERIES,
  ACTINIDE_SERIES
} from '../../constants/periodicTableLayout.js';
import { PARTICLE_NAMES, PARTICLE_COLORS, PARTICLE_INFO } from '../../constants/particles.js';
import ParticleIcon from './ParticleIcon.jsx';

const ELEMENT_CATEGORIES = {
  nonmetal: { name: 'Reactive Nonmetals', color: 'bg-sky-500/20 border-sky-400/40 text-sky-300', hex: '#0ea5e9' },
  noble: { name: 'Noble Gases', color: 'bg-purple-500/20 border-purple-400/40 text-purple-300', hex: '#a855f7' },
  alkali: { name: 'Alkali Metals', color: 'bg-rose-500/20 border-rose-400/40 text-rose-300', hex: '#f43f5e' },
  alkaline: { name: 'Alkaline Earth', color: 'bg-amber-500/20 border-amber-400/40 text-amber-300', hex: '#f59e0b' },
  transition: { name: 'Transition Metals', color: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300', hex: '#6366f1' },
  post_transition: { name: 'Post-Transition', color: 'bg-teal-500/20 border-teal-400/40 text-teal-300', hex: '#14b8a6' },
  metalloid: { name: 'Metalloids', color: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300', hex: '#10b981' },
  halogen: { name: 'Halogens', color: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300', hex: '#eab308' },
  actinide: { name: 'Actinides / Heavy', color: 'bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-300', hex: '#d946ef' },
};

const getElementCategory = (atomicNumber) => {
  if ([1, 6, 7, 8, 15, 16, 34].includes(atomicNumber)) return 'nonmetal';
  if ([2, 10, 18, 36, 86].includes(atomicNumber)) return 'noble';
  if ([3, 11, 19].includes(atomicNumber)) return 'alkali';
  if ([4, 12, 20, 88].includes(atomicNumber)) return 'alkaline';
  if ([9, 17, 35].includes(atomicNumber)) return 'halogen';
  if ([5, 14, 32, 33].includes(atomicNumber)) return 'metalloid';
  if ([13, 31, 50, 82, 84].includes(atomicNumber)) return 'post_transition';
  if (atomicNumber >= 89 && atomicNumber <= 103) return 'actinide';
  if (atomicNumber >= 21 && atomicNumber <= 30) return 'transition';
  if (atomicNumber === 47 || atomicNumber === 79) return 'transition';
  return 'transition';
};

const PeriodicTable = ({ 
  discoveredParticles = [], 
  isSandboxMode, 
  onDragStart, 
  onClose, 
  onParticleClick, 
  isPinned, 
  onPinToggle, 
  ...props 
}) => {
  const [hoveredParticle, setHoveredParticle] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const discoveredSet = useMemo(() => {
    return new Set(discoveredParticles.map(p => p.type));
  }, [discoveredParticles]);

  const totalDiscoveredCount = useMemo(() => {
    return Object.values(ATOMIC_NUMBER_TO_TYPE).filter(type => isSandboxMode || discoveredSet.has(type)).length;
  }, [isSandboxMode, discoveredSet]);

  const renderCell = (atomicNumber, isPlaceholder = false, placeholderText = '') => {
    const type = ATOMIC_NUMBER_TO_TYPE[atomicNumber];
    const isDiscovered = isSandboxMode || (type ? discoveredSet.has(type) : false);
    const particle = type ? { id: type, type } : null;
    const catKey = getElementCategory(atomicNumber);
    const catStyle = ELEMENT_CATEGORIES[catKey];

    const matchesFilter = selectedFilter === 'All' || selectedFilter === catKey;

    if (isPlaceholder) {
      return (
        <div key={`placeholder-${placeholderText}-${atomicNumber}`} className="w-14 h-15 rounded-xl bg-slate-900/40 text-slate-500 text-[10px] font-mono font-bold text-center flex items-center justify-center border border-slate-800">
          {placeholderText}
        </div>
      );
    }

    if (!type) {
      return (
        <div key={`phantom-${atomicNumber}`} className="w-14 h-15 rounded-xl border border-slate-800/40 bg-slate-950/20 flex flex-col items-center justify-center opacity-40">
           <span className="font-mono text-[9px] text-slate-600 font-bold">{atomicNumber}</span>
        </div>
      );
    }

    const info = PARTICLE_INFO[type] || {};

    return (
      <div
        key={type}
        draggable={isDiscovered}
        onDragStart={(e) => isDiscovered && onDragStart(e, particle)}
        onClick={() => isDiscovered && onParticleClick(type)}
        onMouseEnter={() => setHoveredParticle(type)}
        onMouseLeave={() => setHoveredParticle(null)}
        className={`relative w-14 h-15 rounded-xl flex flex-col items-center justify-between p-1.5 transition-all duration-200 select-none ${
          !matchesFilter ? 'opacity-20 scale-95' : ''
        } ${
          isDiscovered 
            ? `${catStyle.color} cursor-grab active:cursor-grabbing hover:scale-110 hover:z-30 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-cyan-500/40 border` 
            : 'bg-slate-950/60 cursor-default opacity-30 border border-slate-800 text-slate-600'
        }`}
      >
        {/* Top: Atomic Number & Mass */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono leading-none">
          <span className="font-bold opacity-80">{atomicNumber}</span>
          <span className="text-[7px] opacity-60 truncate">{info.mass?.split(' ')[0] || ''}</span>
        </div>

        {/* Center: Chemical Symbol */}
        <div className="font-mono text-base font-black tracking-tight leading-none text-white drop-shadow-md">
          {isDiscovered ? PARTICLE_NAMES[type]?.substring(0, 2) : '?'}
        </div>

        {/* Bottom: Name */}
        <div className="w-full overflow-hidden text-center">
          <span className="text-[7px] font-bold uppercase tracking-tighter truncate block opacity-90">
            {isDiscovered ? PARTICLE_NAMES[type] : 'Unidentified'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="bg-[#0b0f17]/95 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-cyan-500/30 max-h-[92vh] overflow-y-auto custom-scrollbar max-w-[1240px] text-white flex flex-col gap-5 animate-fade-in select-none"
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚛️</span>
            <h2 className="text-xl font-black font-sans uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
              Universal Periodic Matrix
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              {totalDiscoveredCount} / {Object.keys(ATOMIC_NUMBER_TO_TYPE).length} Discovered
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Drag any synthesized element directly into the reaction chamber
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPinToggle}
            title={isPinned ? 'Unpin Panel' : 'Pin Panel to Canvas'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 border ${
              isPinned 
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>📌</span>
            <span>{isPinned ? 'PINNED' : 'PIN'}</span>
          </button>
          
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl border border-rose-500/30 transition-all font-bold text-sm shadow-md"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 items-center pb-2 border-b border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-1">Filter:</span>
        <button
          onClick={() => setSelectedFilter('All')}
          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
            selectedFilter === 'All'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Series
        </button>
        {Object.entries(ELEMENT_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setSelectedFilter(selectedFilter === key ? 'All' : key)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
              selectedFilter === key
                ? `${cat.color} ring-1 ring-white shadow-md`
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Periodic Table Grid */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid gap-1.5 w-fit mx-auto" style={{ gridTemplateColumns: 'repeat(18, minmax(56px, 1fr))' }}>
          {PERIODIC_TABLE_LAYOUT.flat().map((atomicNumber, i) => {
            if (atomicNumber > 0) return renderCell(atomicNumber);
            if (atomicNumber === -1) return renderCell(0, true, '57-71');
            if (atomicNumber === -2) return renderCell(0, true, '89-103');
            return <div key={`spacer-${i}`} className="w-14 h-15" />;
          })}
        </div>

        {/* Lanthanide & Actinide Sub-Series */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col gap-2 w-fit mx-auto">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(18, minmax(56px, 1fr))' }}>
            <div className="col-span-2 flex items-center justify-end pr-2 font-mono text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
              Lanthanides:
            </div>
            {LANTHANIDE_SERIES.map((atomicNumber) => renderCell(atomicNumber))}
          </div>

          <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(18, minmax(56px, 1fr))' }}>
            <div className="col-span-2 flex items-center justify-end pr-2 font-mono text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
              Actinides:
            </div>
            {ACTINIDE_SERIES.map((atomicNumber) => renderCell(atomicNumber))}
          </div>
        </div>
      </div>

      {/* Special Hadrons & Radiation Isotopes */}
      <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIZED_SPECIAL_LIST.map((category) => (
          <div key={category.name} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>{category.name}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.particles.map(type => {
                const isDiscovered = isSandboxMode || discoveredSet.has(type);
                const particle = { id: type, type };

                return (
                  <div
                    key={type}
                    draggable={isDiscovered}
                    onDragStart={(e) => isDiscovered && onDragStart(e, particle)}
                    onClick={() => isDiscovered && onParticleClick(type)}
                    className={`relative w-13 h-13 p-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                      isDiscovered
                        ? 'bg-slate-800/80 hover:bg-slate-700 border border-cyan-500/30 hover:border-cyan-400 cursor-grab active:cursor-grabbing hover:scale-110 shadow-md'
                        : 'bg-slate-950/40 border border-slate-900 opacity-30 cursor-default'
                    }`}
                    title={PARTICLE_NAMES[type]}
                  >
                    <div className="w-8 h-8">
                      <ParticleIcon type={type} color={PARTICLE_COLORS[type]} isCompound />
                    </div>
                    <span className="text-[7px] font-mono font-bold text-slate-300 truncate w-full text-center mt-0.5">
                      {isDiscovered ? PARTICLE_NAMES[type] : '?'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default React.memo(PeriodicTable);