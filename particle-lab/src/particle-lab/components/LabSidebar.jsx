import React, { useState, useMemo } from 'react';
import { useParticleStore } from '../store.js';
import ParticleIcon from './ParticleIcon.jsx';
import { elementaryParticleGroups, PARTICLE_COLORS, PARTICLE_NAMES } from '../../constants/particles.js';
import { useDiscoveredMatter } from '../../hooks/useDiscoveredMatter.js';

const CATEGORY_ICONS = {
  'Quarks': '⚛️',
  'Leptons': '⚡',
  'Bosons': '✨',
  'Molecules': '🧬'
};

const LabSidebar = ({ onDragStart }) => {
  const { isPaletteVisible, uiScale } = useParticleStore();
  const { discoveredMolecules } = useDiscoveredMatter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    return ['All', ...Object.keys(elementaryParticleGroups), 'Molecules'];
  }, []);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const result = {};

    Object.entries(elementaryParticleGroups).forEach(([groupName, particles]) => {
      if (activeCategory !== 'All' && activeCategory !== groupName) return;
      const matched = particles.filter(p => 
        !term || PARTICLE_NAMES[p.type]?.toLowerCase().includes(term) || p.type.toLowerCase().includes(term)
      );
      if (matched.length > 0) {
        result[groupName] = matched;
      }
    });

    if (activeCategory === 'All' || activeCategory === 'Molecules') {
      const matchedMolecules = discoveredMolecules.filter(p =>
        !term || PARTICLE_NAMES[p.type]?.toLowerCase().includes(term) || p.type.toLowerCase().includes(term)
      );
      if (matchedMolecules.length > 0 || (!term && activeCategory === 'Molecules')) {
        result['Molecules'] = matchedMolecules;
      }
    }

    return result;
  }, [searchTerm, activeCategory, discoveredMolecules]);

  return (
    <aside 
      className={`flex flex-col bg-[#0b0f17]/95 backdrop-blur-2xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 ease-out border border-cyan-500/20 z-20 shrink-0 ${
        isPaletteVisible ? 'w-80 p-4 opacity-100' : 'w-0 p-0 opacity-0 pointer-events-none border-0'
      }`}
      aria-label="Particle Palette"
    >
      <div className={`w-72 flex flex-col h-full ${!isPaletteVisible ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h2 className="text-sm font-black tracking-widest text-cyan-300 uppercase">
              Matter Reservoir
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            v3.2
          </span>
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Filter particles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#131b29] border border-cyan-500/20 focus:border-cyan-400/60 rounded-xl px-8 py-2 text-xs text-cyan-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
          />
          <svg className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{CATEGORY_ICONS[cat] || '•'}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Particle Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
          {Object.keys(filteredGroups).length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs">
              <span>🔍 No particles match "{searchTerm}"</span>
            </div>
          ) : (
            Object.entries(filteredGroups).map(([groupName, particles]) => (
              <div key={groupName} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>{groupName}</span>
                  <span className="text-[9px] font-mono text-slate-500">{particles.length} units</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {particles.map((p) => (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, p)}
                      className="group relative flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#141d2e] to-[#0e1624] border border-slate-800/80 hover:border-cyan-400/50 hover:shadow-[0_0_16px_rgba(6,182,212,0.25)] hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing transition-all duration-200"
                    >
                      <div
                        className="relative flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ width: `${52 * uiScale}px`, height: `${52 * uiScale}px` }}
                      >
                        <ParticleIcon 
                          type={p.type} 
                          color={PARTICLE_COLORS[p.type]} 
                          isCompound={groupName === 'Molecules'} 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-cyan-200 truncate w-full text-center mt-1.5 transition-colors">
                        {PARTICLE_NAMES[p.type]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 mt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>DRAG TO SPAWN</span>
          <span>⚡ QUANTUM MATRIX</span>
        </div>

      </div>
    </aside>
  );
};

export default React.memo(LabSidebar);
