import React, { useState, useMemo } from 'react';
import { useInventory } from '../store/inventory';
import { useStore } from '../store';
import { getUniversalCodexData, getUniversalItemInfo } from '../utils/codexData';
import ParticleIcon from '../particle-lab/components/ParticleIcon.jsx';

/**
 * Universal Resource Exchange Component
 * Allows importing items from the Global Inventory into a specific Lab.
 */
const ResourceExchange = ({ 
  labName, 
  onImport, 
  allowedCategories = [], 
  excludedCategories = [],
  excludedSubcategories = [],
  excludedTypes = []
}) => {
  const discoveredItems = useInventory(state => state.discoveredItems);
  const isSandboxMode = useStore(state => state.isSandboxMode);
  const particleGroups = useMemo(() => getUniversalCodexData(), []);
  const [selectedId, setSelectedId] = useState(null);
  const [amount, setAmount] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Flatten and Filter Items
  const availableItems = useMemo(() => {
    const validItems = [];
    const discoveredSet = new Set(discoveredItems);
    const excludedSet = new Set(excludedTypes);

    particleGroups.forEach(group => {
      // Category Check
      if (allowedCategories.length > 0 && !allowedCategories.includes(group.name)) return;
      if (excludedCategories.includes(group.name)) return;

      group.subcategories.forEach(sub => {
         if (excludedSubcategories.includes(sub.name)) return;

         sub.particles.forEach(type => {
            // Check: (Discovered OR Sandbox) AND Not Excluded
            if ((isSandboxMode || discoveredSet.has(type)) && !excludedSet.has(type)) {
               validItems.push({ type, group: group.name, sub: sub.name, info: getUniversalItemInfo(type) });
            }
         });
      });
    });
    
    return validItems;
  }, [particleGroups, discoveredItems, allowedCategories, excludedCategories, excludedTypes, isSandboxMode]);

  // 2. Search Filter
  const filteredItems = useMemo(() => {
    if (!searchTerm) return availableItems;
    return availableItems.filter(item => 
       item.info.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableItems, searchTerm]);

  const handleImport = (e, type, amt) => {
    e.stopPropagation();
    onImport(type, amt || amount);
  };

  const selectedInfo = selectedId ? getUniversalItemInfo(selectedId) : null;

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-10">
        <h3 className="text-lg font-bold text-slate-200 mb-1">{labName}</h3>
        <p className="text-xs text-slate-500 mb-4">Select items to instantiate</p>
        
        <div className="relative group">
           <input 
             type="text" 
             placeholder="Filter storage..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors pl-9"
           />
           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">🔍</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
         {filteredItems.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
             <div className="text-4xl opacity-50">📦</div>
             <p className="text-sm">Storage Empty</p>
             <p className="text-xs opacity-50">Discover items to fill</p>
           </div>
         ) : (
           <div className="grid grid-cols-2 gap-3">
             {filteredItems.map(({ type, info }) => {
               return (
                 <div
                   key={type}
                   draggable
                   onDragStart={(e) => {
                      e.dataTransfer.setData('chemicalId', type); // Standard for Chem Lab
                      e.dataTransfer.setData('text/plain', type); // Standard for Particle Lab fallback
                      e.dataTransfer.effectAllowed = 'copy';
                   }}
                   onClick={() => onImport(type, 1)}
                   className="relative flex flex-col items-center p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing hover:scale-105 bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600 hover:shadow-lg group"
                 >
                   {/* Icon */}
                   <div className="w-12 h-12 mb-2 transition-transform group-hover:scale-105">
                     <ParticleIcon type={type} color={info.color} />
                   </div>
                   
                   {/* Name */}
                   <span className="text-xs font-semibold text-center text-slate-300 leading-tight line-clamp-2 min-h-[2.5em] w-full">
                     {info.name}
                   </span>
                 </div>
               );
             })}
           </div>
         )}
      </div>

      {/* Footer Info */}
      <div className="shrink-0 p-3 border-t border-slate-800 bg-slate-900 text-center">
         <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            {isSandboxMode ? 'SANDBOX MODE ACTIVE' : 'STANDARD MODE'}
         </p>
      </div>
    </div>
  );
};

export default ResourceExchange;