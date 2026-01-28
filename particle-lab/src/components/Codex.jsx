import React, { useState, useMemo } from 'react';
import ParticleIcon from '../particle-lab/components/ParticleIcon.jsx';
import InfoPanel from '../particle-lab/components/InfoPanel.jsx';
import { useInventory } from '../store/inventory';
import { useStore } from '../store';
import { getUniversalCodexData, getUniversalItemInfo } from '../utils/codexData';

const Codex = ({ isVisible, onClose, onParticleClick, onDragStart, isEmbedded = false, onDragStateChange }) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use "All" as default main tab, or the first real category
  const [selectedGroup, setSelectedGroup] = useState('All');
  
  // Universal Inventory
  const discoveredItems = useInventory(state => state.discoveredItems);
  const isSandboxMode = useStore(state => state.isSandboxMode);
  
  const discoveredSet = useMemo(() => new Set(discoveredItems), [discoveredItems]);

  // Unified Data Source - Now nested
  const particleGroups = useMemo(() => getUniversalCodexData(), []);

  // Main Group Tabs
  const groupNames = useMemo(() => {
    return ['All', ...particleGroups.map(g => g.name)];
  }, [particleGroups]);

  const handleDragStart = (e, particleType) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: particleType }));
    e.dataTransfer.effectAllowed = 'copy';
    if (onDragStart) onDragStart(e, { type: particleType });
    if (onDragStateChange) setTimeout(() => onDragStateChange(true), 0);
  };

  const handleDragEnd = () => {
    if (onDragStateChange) onDragStateChange(false);
  };

  const [selectedInfoParticle, setSelectedInfoParticle] = useState(null);

  const content = (
    <div className={`bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full flex flex-col relative overflow-hidden ${!isEmbedded ? 'max-w-6xl h-full max-h-[90vh]' : 'h-full border-0 shadow-none rounded-none'}`}>
          
          {/* Header */}
          <div className="flex flex-col p-6 border-b border-gray-700 bg-gray-800/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">Universal Codex</h2>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all w-64"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Toggle Show All */}
                <button
                  onClick={() => setShowAll(prev => !prev)}
                  className={`p-2 rounded-lg transition-colors border ${showAll ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white'}`}
                  title={showAll ? 'Hide Undiscovered' : 'Show All'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                {/* Close Button */}
                {!isEmbedded && (
                  <button 
                    onClick={onClose} 
                    className="p-2 ml-2 rounded-lg bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105 transition-all shadow-md"
                    title="Close Codex"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-600">
              {groupNames.map(name => (
                <button
                  key={name}
                  onClick={() => setSelectedGroup(name)}
                  className={`px-5 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-all border ${
                    selectedGroup === name 
                      ? 'bg-amber-500 text-gray-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
            {particleGroups
              .filter(group => selectedGroup === 'All' || group.name === selectedGroup)
              .map(group => (
                <div key={group.name} className="mb-10 animate-fadeIn">
                  {selectedGroup === 'All' && (
                    <h3 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">{group.name}</h3>
                  )}
                  
                  {/* Subcategories */}
                  <div className="space-y-8">
                    {group.subcategories.map(sub => {
                      // Search Filter
                      const filteredParticles = sub.particles.filter(p => {
                        if (!searchTerm) return true;
                        const info = getUniversalItemInfo(p);
                        return info.name.toLowerCase().includes(searchTerm.toLowerCase());
                      });

                      if (filteredParticles.length === 0) return null;

                      return (
                        <div key={sub.name} className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/50">
                          <h4 className="text-lg font-bold text-amber-400/80 mb-4 uppercase tracking-wider text-xs">{sub.name}</h4>
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                            {filteredParticles.map(particleType => {
                              const isDiscovered = isSandboxMode || showAll || discoveredSet.has(particleType);
                              const info = getUniversalItemInfo(particleType);
                              
                              return (
                                <div
                                  key={particleType}
                                  draggable={isDiscovered}
                                  onDragStart={(e) => isDiscovered && handleDragStart(e, particleType)}
                                  onDragEnd={handleDragEnd}
                                  className={`
                                    relative group flex flex-col items-center p-3 rounded-xl transition-all duration-200
                                    ${isDiscovered 
                                      ? 'bg-gray-700/50 hover:bg-gray-700 cursor-grab active:cursor-grabbing border border-transparent hover:border-gray-500' 
                                      : 'bg-gray-800/30 opacity-40 grayscale cursor-not-allowed border border-dashed border-gray-700'}
                                  `}
                                  onClick={() => isDiscovered && onParticleClick && onParticleClick(particleType)}
                                  onDoubleClick={() => isDiscovered && setSelectedInfoParticle(particleType)}
                                >
                                  <div className="w-16 h-16 mb-2 relative transform group-hover:scale-110 transition-transform duration-200">
                                    <ParticleIcon type={particleType} color={info.color} />
                                  </div>
                                  <span className={`text-[10px] font-bold text-center leading-tight ${isDiscovered ? 'text-gray-300 group-hover:text-white' : 'text-gray-600'}`}>
                                    {isDiscovered ? info.name : '???'}
                                  </span>
                                  
                                  {/* Tooltip */}
                                  {isDiscovered && (
                                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-black text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                      Double-click for Info
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            }
            
            {/* Empty State */}
            {particleGroups.every(g => 
               (selectedGroup === 'All' || g.name === selectedGroup) && 
               g.subcategories.every(sub => 
                 sub.particles.filter(p => !searchTerm || getUniversalItemInfo(p).name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0
               )
            ) && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <span className="text-4xl mb-2">🔍</span>
                <p>No particles found matching "{searchTerm}"</p>
              </div>
            )}
          </div>

          {/* Info Modal */}
          {selectedInfoParticle && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
               <InfoPanel particleType={selectedInfoParticle} onClose={() => setSelectedInfoParticle(null)} />
            </div>
          )}
    </div>
  );

  if (isEmbedded) return content;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm`}>
      {!isVisible ? null : content}
    </div>
  );
};

export default React.memo(Codex);
