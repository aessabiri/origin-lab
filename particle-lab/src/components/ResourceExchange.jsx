import React, { useState, useMemo } from 'react';
import { useInventory } from '../store/inventory';
import { useStore } from '../store';
import { getUniversalCodexData, getUniversalItemInfo } from '../utils/codexData';
import ParticleIcon from '../particle-lab/components/ParticleIcon.jsx';

/**
 * Universal Resource Exchange Component
 * Allows importing items from the Global Inventory into a specific Lab.
 * 
 * @param {string} labName - Name of the lab (displayed in UI)
 * @param {function} onImport - Callback(itemId, amount) when user imports
 * @param {Array<string>} allowedCategories - List of categories allowed (e.g. ['Atomic', 'Molecular'])
 * @param {Array<string>} excludedCategories - List of categories banned (e.g. ['Fundamental'])
 * @param {Array<string>} excludedTypes - Specific particle types to ban (e.g. ['oxygen-gas'])
 */
const ResourceExchange = ({ 
  labName, 
  onImport, 
  allowedCategories = [], 
  excludedCategories = [],
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
         sub.particles.forEach(type => {
            // Check: (Discovered OR Sandbox) AND Not Excluded
            if ((isSandboxMode || discoveredSet.has(type)) && !excludedSet.has(type)) {
               validItems.push({ type, group: group.name, sub: sub.name });
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
       getUniversalItemInfo(item.type).name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableItems, searchTerm]);

  const handleImport = () => {
    if (selectedId && amount > 0) {
      onImport(selectedId, amount);
      // Optional: Visual feedback or toast
    }
  };

  const selectedInfo = selectedId ? getUniversalItemInfo(selectedId) : null;

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            {labName} Import
          </h3>
          <p className="text-xs text-gray-400">Global Inventory Access</p>
        </div>
        <div className="relative">
           <input 
             type="text" 
             placeholder="Search items..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="bg-gray-900 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 w-40"
           />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 sm:grid-cols-4 gap-3 content-start">
           {filteredItems.length === 0 ? (
             <div className="col-span-full text-center text-gray-500 mt-10 italic">
               No compatible items discovered yet.
             </div>
           ) : (
             filteredItems.map(({ type }) => {
               const info = getUniversalItemInfo(type);
               const isSelected = selectedId === type;
               return (
                 <button
                   key={type}
                   onClick={() => setSelectedId(type)}
                   className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                     isSelected 
                       ? 'bg-blue-900/40 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                       : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-500'
                   }`}
                 >
                   <div className="w-10 h-10 mb-2">
                     <ParticleIcon type={type} color={info.color} />
                   </div>
                   <span className="text-xs font-medium text-center truncate w-full">{info.name}</span>
                 </button>
               );
             })
           )}
        </div>

        {/* Sidebar / Actions */}
        <div className="w-64 bg-gray-800/50 border-l border-gray-700 p-4 flex flex-col gap-4">
           {selectedId ? (
             <>
               <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg border border-gray-600">
                  <div className="w-20 h-20 mb-3">
                    <ParticleIcon type={selectedId} color={selectedInfo.color} />
                  </div>
                  <h4 className="font-bold text-center text-blue-300">{selectedInfo.name}</h4>
                  <p className="text-xs text-gray-400 text-center mt-1">{selectedInfo.description}</p>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase">Amount to Import</label>
                 <div className="flex items-center gap-2">
                   <input 
                     type="range" 
                     min="1" max="100" 
                     value={amount} 
                     onChange={e => setAmount(parseInt(e.target.value))}
                     className="flex-1 accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                   />
                   <input 
                     type="number" 
                     min="1" 
                     value={amount} 
                     onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                     className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-right text-sm font-mono"
                   />
                 </div>
               </div>

               <button 
                 onClick={handleImport}
                 className="mt-auto w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold rounded-lg shadow-lg transform transition-transform active:scale-95 flex items-center justify-center gap-2"
               >
                 <span>📥</span> Import
               </button>
             </>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
               <span className="text-4xl mb-2">👈</span>
               <p className="text-sm">Select an item to import</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ResourceExchange;
