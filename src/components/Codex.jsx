import React, { useState, useMemo, useCallback } from 'react';
import ParticleIcon from '../particle-lab/components/ParticleIcon.jsx';
import InfoPanel from '../particle-lab/components/InfoPanel.jsx';
import { useInventory } from '../store/inventory';
import { useStore } from '../store';
import { getUniversalCodexData, getUniversalItemInfo } from '../utils/codexData';

// --- Memoized Child Component for Codex Item ---
const CodexItem = React.memo(({ 
  particleType, 
  isDiscovered, 
  onDragStart, 
  onDragEnd, 
  onClick, 
  onDoubleClick 
}) => {
  const info = useMemo(() => getUniversalItemInfo(particleType), [particleType]);

  const handleDragStart = useCallback((e) => {
    if (isDiscovered) {
      onDragStart(e, particleType);
    }
  }, [isDiscovered, onDragStart, particleType]);

  return (
    <div
      draggable={isDiscovered}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`
        relative group flex flex-col items-center p-3 rounded-2xl transition-all duration-200 select-none
        ${isDiscovered 
          ? 'bg-gradient-to-b from-[#131b2b] to-[#0e1522] hover:from-[#1b263b] hover:to-[#141f30] cursor-grab active:cursor-grabbing border border-cyan-500/20 hover:border-amber-400/60 shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95' 
          : 'bg-slate-950/30 opacity-35 grayscale cursor-not-allowed border border-dashed border-slate-800'}
      `}
      onClick={() => isDiscovered && onClick && onClick(particleType)}
      onDoubleClick={() => isDiscovered && onDoubleClick(particleType)}
    >
      {/* Background ambient glow */}
      {isDiscovered && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-lg pointer-events-none"
          style={{ backgroundColor: info.color || '#38bdf8' }}
        />
      )}

      {/* Particle Icon */}
      <div className="w-14 h-14 mb-2 relative transform group-hover:scale-110 transition-transform duration-200 drop-shadow-md">
        <ParticleIcon type={particleType} color={info.color} isCompound={info.isChemical} />
      </div>

      {/* Name Label */}
      <span className={`text-[11px] font-bold text-center leading-tight truncate w-full px-1 ${isDiscovered ? 'text-slate-200 group-hover:text-amber-200' : 'text-slate-600'}`}>
        {isDiscovered ? info.name : '???'}
      </span>

      {/* Category Pill */}
      {isDiscovered && info.category && (
        <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mt-1 opacity-70 group-hover:opacity-100">
          {info.category}
        </span>
      )}

      {/* Floating Info Tooltip */}
      {isDiscovered && (
        <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-[#090d14] border border-cyan-500/40 text-cyan-200 text-[10px] font-mono px-2.5 py-1 rounded-lg pointer-events-none whitespace-nowrap z-50 transition-all shadow-xl">
          Double-click for details
        </div>
      )}
    </div>
  );
});

const CodexCategory = React.memo(({ 
  sub, 
  particles, 
  discoveredSet, 
  isSandboxMode, 
  showAll, 
  onDragStart, 
  onDragEnd, 
  onParticleClick, 
  onParticleDoubleClick 
}) => {
  if (particles.length === 0) return null;

  const discoveredCount = particles.filter(p => isSandboxMode || showAll || discoveredSet.has(p)).length;

  return (
    <div className="bg-[#0f1726]/80 rounded-2xl p-5 border border-cyan-500/15 shadow-md">
      <div className="flex items-center justify-between mb-4 border-b border-cyan-500/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <h4 className="font-sans font-bold text-amber-300 uppercase tracking-widest text-xs">
            {sub.name}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {discoveredCount} / {particles.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {particles.map(particleType => {
          const isDiscovered = isSandboxMode || showAll || discoveredSet.has(particleType);
          
          return (
            <CodexItem
              key={particleType}
              particleType={particleType}
              isDiscovered={isDiscovered}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={onParticleClick}
              onDoubleClick={onParticleDoubleClick}
            />
          );
        })}
      </div>
    </div>
  );
});

// --- Main Codex Component ---
const Codex = ({ isVisible, onClose, onParticleClick, onDragStart, isEmbedded = false, onDragStateChange }) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedInfoParticle, setSelectedInfoParticle] = useState(null);
  
  // Universal Inventory
  const discoveredItems = useInventory(state => state.discoveredItems);
  const isSandboxMode = useStore(state => state.isSandboxMode);
  
  const discoveredSet = useMemo(() => new Set(discoveredItems), [discoveredItems]);

  // Unified Data Source
  const particleGroups = useMemo(() => getUniversalCodexData(), []);

  // Main Group Tabs
  const groupNames = useMemo(() => {
    return ['All', ...particleGroups.map(g => g.name)];
  }, [particleGroups]);

  // Total discovery stats
  const { totalItems, totalDiscovered } = useMemo(() => {
    let count = 0;
    let unlocked = 0;
    particleGroups.forEach(g => {
      g.subcategories.forEach(s => {
        s.particles.forEach(p => {
          count++;
          if (isSandboxMode || discoveredSet.has(p)) {
            unlocked++;
          }
        });
      });
    });
    return { totalItems: count, totalDiscovered: unlocked };
  }, [particleGroups, discoveredSet, isSandboxMode]);

  const discoveryPercentage = Math.round((totalDiscovered / (totalItems || 1)) * 100);

  // Optimized Filtering Logic
  const visibleGroups = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    return particleGroups.map(group => {
      if (selectedGroup !== 'All' && group.name !== selectedGroup) return null;

      const filteredSubcategories = group.subcategories.map(sub => {
        const filteredParticles = sub.particles.filter(p => {
          if (!term) return true;
          const info = getUniversalItemInfo(p);
          return info.name.toLowerCase().includes(term) || p.toLowerCase().includes(term);
        });

        return { ...sub, particles: filteredParticles };
      }).filter(sub => sub.particles.length > 0);

      if (filteredSubcategories.length === 0) return null;

      return { ...group, subcategories: filteredSubcategories };
    }).filter(Boolean);
  }, [particleGroups, selectedGroup, searchTerm]);

  // Handlers
  const handleDragStartWrapper = useCallback((e, particleType) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: particleType }));
    e.dataTransfer.effectAllowed = 'copy';
    if (onDragStart) onDragStart(e, { type: particleType });
    if (onDragStateChange) setTimeout(() => onDragStateChange(true), 0);
  }, [onDragStart, onDragStateChange]);

  const handleDragEndWrapper = useCallback(() => {
    if (onDragStateChange) onDragStateChange(false);
  }, [onDragStateChange]);

  const content = (
    <div className={`bg-[#0a0e17]/95 border border-cyan-500/25 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full flex flex-col relative overflow-hidden backdrop-blur-2xl ${!isEmbedded ? 'max-w-6xl h-full max-h-[90vh]' : 'h-full border-0 shadow-none rounded-none'}`}>
      
      {/* Header */}
      <div className="flex flex-col p-6 border-b border-cyan-500/20 bg-gradient-to-b from-[#101726] to-[#0a0e17]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <h2 className="text-2xl font-black font-sans uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
                Universal Codex
              </h2>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-48 h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${discoveryPercentage}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                {discoveryPercentage}% Synthesized ({totalDiscovered}/{totalItems})
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#131b2a] border border-cyan-500/25 focus:border-cyan-400 rounded-xl pl-10 pr-8 py-2 text-xs text-cyan-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            {/* Close Button */}
            {!isEmbedded && (
              <button 
                onClick={onClose} 
                className="w-9 h-9 flex items-center justify-center bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl border border-rose-500/30 transition-all font-bold text-sm shadow-md"
                title="Close Codex"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Main Group Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {groupNames.map(name => (
            <button
              key={name}
              onClick={() => setSelectedGroup(name)}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border whitespace-nowrap ${
                selectedGroup === name 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[#080c14]/60">
        {visibleGroups.map(group => (
          <div key={group.name} className="animate-fade-in space-y-4">
            {selectedGroup === 'All' && (
              <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-2">
                <span className="text-lg">💠</span>
                <h3 className="text-lg font-black text-cyan-200 uppercase tracking-widest font-sans">
                  {group.name}
                </h3>
              </div>
            )}
            
            {/* Subcategories */}
            <div className="space-y-6">
              {group.subcategories.map(sub => (
                <CodexCategory
                  key={sub.name}
                  sub={sub}
                  particles={sub.particles}
                  discoveredSet={discoveredSet}
                  isSandboxMode={isSandboxMode}
                  showAll={showAll}
                  onDragStart={handleDragStartWrapper}
                  onDragEnd={handleDragEndWrapper}
                  onParticleClick={onParticleClick}
                  onParticleDoubleClick={setSelectedInfoParticle}
                />
              ))}
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {visibleGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-2">
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-mono">No elements found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Detail Info Modal */}
      {selectedInfoParticle && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
           <InfoPanel particleType={selectedInfoParticle} onClose={() => setSelectedInfoParticle(null)} />
        </div>
      )}
    </div>
  );

  if (isEmbedded) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {!isVisible ? null : content}
    </div>
  );
};

export default React.memo(Codex);
