import React from 'react';
import { useInventory } from '../../store/inventory.js';
import { useParticleStore } from '../store.js';
import { PARTICLE_NAMES, PARTICLE_COLORS } from '../../constants/particles.js';
import ParticleIcon from './ParticleIcon.jsx';

const ExchangeHub = () => {
  const { isExchangeHubVisible, setIsExchangeHubVisible, particles, setParticles, showMessage } = useParticleStore();
  
  // We can't easily iterate "all items" unless we have a list of all possible items.
  // For now, let's use the 'elements' and 'compounds' from inventory to see what we have *quantities* of,
  // OR rely on 'discoveredItems' if that tracks IDs.
  // The 'codexData' might be useful here to get a full list of valid types, then check inventory.
  
  const inventory = useInventory();
  
  // Helper to spawn
  const handleImport = (type) => {
    // Infinite supply logic: We just spawn it.
    // If we wanted to consume from inventory: inventory.consumeResource('elements', type, 1)
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const newParticle = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: type,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
      scale: 1,
    };
    
    setParticles([...particles, newParticle]);
    showMessage(`Imported ${PARTICLE_NAMES[type] || type}`);
  };

  if (!isExchangeHubVisible) return null;

  // Gather all available items from Inventory
  // We check 'elements' and 'compounds'
  const availableElements = Object.entries(inventory.elements).filter(([_, count]) => count > 0 || inventory.discoveredItems.includes(_)); 
  // Note: Inventory.js 'discoveredItems' check might be better if counts are 0 but we want "Infinite Source" status.
  // For now, let's show anything that has > 0 OR is in discoveredItems.
  
  const unlockedTypes = new Set(inventory.discoveredItems);
  
  // Also include anything with Count > 0 even if not in discoveredItems (legacy safety)
  Object.keys(inventory.elements).forEach(t => { if(inventory.elements[t] > 0) unlockedTypes.add(t); });
  Object.keys(inventory.compounds).forEach(t => { if(inventory.compounds[t] > 0) unlockedTypes.add(t); });

  const unlockedList = Array.from(unlockedTypes);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsExchangeHubVisible(false)}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800 rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-amber-400">Universal Exchange</h2>
            <p className="text-slate-400 text-sm">Import synthesized matter from the Universal Ledger</p>
          </div>
          <button onClick={() => setIsExchangeHubVisible(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white">Close</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {unlockedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <span className="text-4xl mb-4">📭</span>
              <p>No matter discovered yet.</p>
              <p className="text-sm">Synthesize new particles to access them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {unlockedList.map(type => (
                <button 
                  key={type}
                  onClick={() => handleImport(type)}
                  className="flex flex-col items-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 border border-transparent hover:border-amber-500/50 transition-all group"
                >
                  <div className="w-16 h-16 mb-2 relative">
                    <ParticleIcon type={type} color={PARTICLE_COLORS[type]} />
                  </div>
                  <span className="text-xs text-center font-bold text-slate-300 group-hover:text-white">
                    {PARTICLE_NAMES[type] || type}
                  </span>
                  <span className="text-[10px] text-amber-500/70 uppercase tracking-widest mt-1">
                    ∞ Source
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-800 border-t border-slate-700 rounded-b-xl text-center text-xs text-slate-500">
          Items synthesized in the lab are automatically added to the Universal Ledger.
        </div>

      </div>
    </div>
  );
};

export default ExchangeHub;
