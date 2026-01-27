import React, { useState, useMemo } from 'react';
import ParticleIcon from './ParticleIcon';
import InfoPanel from './InfoPanel';
import { useInventory } from '../store/inventory';
import { getUniversalCodexData, getUniversalItemInfo } from '../utils/codexData';

const Codex = ({ isVisible, onClose, onParticleClick, onDragStart, isEmbedded = false }) => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedInfoParticle, setSelectedInfoParticle] = useState(null);
  
  // Universal Inventory - The single source of truth
  const discoveredItems = useInventory(state => state.discoveredItems);
  const discoveredSet = useMemo(() => new Set(discoveredItems), [discoveredItems]);

  // Unified Data Source
  const particleCategories = useMemo(() => getUniversalCodexData(), []);

  // Extract unique category names for tabs
  const categoryNames = useMemo(() => {
    return ['All', ...particleCategories.map(cat => cat.name)];
  }, [particleCategories]);

  const filteredCategories = useMemo(() => {
    let categories = particleCategories;

    // 1. Filter by Category Tab
    if (selectedCategory !== 'All') {
      categories = categories.filter(cat => cat.name === selectedCategory);
    }

    // 2. Filter by Search Term
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      categories = categories.map(category => ({
        ...category,
        particles: category.particles.filter(particleType => {
           const info = getUniversalItemInfo(particleType);
           return info.name.toLowerCase().includes(lowercasedFilter);
        }),
      })).filter(category => category.particles.length > 0);
    }

    return categories;
  }, [searchTerm, particleCategories, selectedCategory]);

  if (!isVisible && !isEmbedded) return null;

  const content = (
    <div className={`bg-gray-800/90 ${!isEmbedded ? 'border-2 border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh]' : 'h-full'} flex flex-col relative`}>
      <div className="flex flex-col gap-4 p-6 border-b border-gray-700 shrink-0">
        
        {/* Header & Search */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-amber-300">Universal Codex</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search universe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900/50 border-2 border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label={showAll ? 'Hide undiscovered' : 'Show all'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors ${showAll ? 'text-amber-300' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {!isEmbedded && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Close codex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
           {categoryNames.map(cat => (
             <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${
                 selectedCategory === cat 
                   ? 'bg-amber-500 border-amber-500 text-gray-900 shadow-md' 
                   : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

      </div>
      <div className="flex-1 overflow-y-auto p-6 pr-4">
        {filteredCategories.map(category => (
          <div key={category.name} className="mb-8">
            <h3 className="text-2xl font-bold text-amber-300 mb-4 border-b-2 border-gray-700 pb-2">{category.name}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
              {category.particles.map(particleType => {
                const isDiscovered = showAll || discoveredSet.has(particleType);
                const info = getUniversalItemInfo(particleType);
                
                return (
                  <div
                    key={particleType}
                    draggable={isDiscovered}
                    onDragStart={(e) => isDiscovered && onDragStart && onDragStart(e, { type: particleType })}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${isDiscovered ? 'cursor-grab hover:bg-gray-700' : 'cursor-default'}`}
                    onClick={() => isDiscovered && onParticleClick && onParticleClick(particleType)}
                    onDoubleClick={() => isDiscovered && setSelectedInfoParticle(particleType)}
                    title={isDiscovered ? "Double-click for info" : ""}
                  >
                    <div className={`relative w-20 h-20 ${isDiscovered ? '' : 'opacity-20'}`}>
                      <ParticleIcon type={particleType} color={info.color} />
                    </div>
                    <p className={`mt-2 text-center text-sm font-semibold ${isDiscovered ? 'text-white' : 'text-gray-500'}`}>
                      {isDiscovered ? info.name : '???'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Info Panel Overlay */}
      {selectedInfoParticle && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
             {/* We wrap InfoPanel in a div to ensure it fits within the Codex if embedded, 
                 though InfoPanel is typically fixed. For this specific request "in the codex",
                 we might want to force it to render *over* the Codex content but perhaps 
                 constrained if needed. However, InfoPanel component usually uses fixed positioning. 
                 Let's check InfoPanel implementation again. It uses fixed inset-0.
                 If we want it 'in' the codex, we might need to modify InfoPanel or just let it overlay everything.
                 Given the user asked "in the codex I want an info card to appear", a modal overlay (InfoPanel) is standard behavior.
             */}
             <InfoPanel particleType={selectedInfoParticle} onClose={() => setSelectedInfoParticle(null)} />
          </div>
      )}
    </div>
  );

  if (isEmbedded) return content;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {content}
    </div>
  );
};

export default Codex;