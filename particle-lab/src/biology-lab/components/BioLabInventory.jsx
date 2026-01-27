import React, { useState } from 'react';
import { useInventory } from '../../store/inventory';
import { useBioStore } from '../store';
import { getUniversalItemInfo } from '../../utils/codexData';
import { PARTICLE_TYPES } from '../../constants/particles';
import ParticleIcon from '../../components/ParticleIcon';

const BioLabInventory = () => {
  const discoveredItems = useInventory(state => state.discoveredItems);
  const consumeResource = useInventory(state => state.consumeResource);
  const soup = useBioStore(state => state.soup);
  const updateSoup = useBioStore(state => state.updateSoup);
  
  // Mapping Global Items to Bio Resources
  // Key: Global Particle ID -> Value: Bio Soup Key
  const RESOURCE_MAP = {
    [PARTICLE_TYPES.GLUCOSE]: 'glucose',
    [PARTICLE_TYPES.FRUCTOSE]: 'glucose', // Sugars
    
    // Amino Acids -> generic 'aminoAcids' pool
    [PARTICLE_TYPES.GLYCINE]: 'aminoAcids',
    [PARTICLE_TYPES.ALANINE]: 'aminoAcids',
    [PARTICLE_TYPES.SERINE]: 'aminoAcids',
    [PARTICLE_TYPES.CYSTEINE]: 'aminoAcids',
    [PARTICLE_TYPES.VALINE]: 'aminoAcids',
    [PARTICLE_TYPES.LEUCINE]: 'aminoAcids',
    [PARTICLE_TYPES.PHENYLALANINE]: 'aminoAcids',
    // ... add more as needed

    // Lipids
    [PARTICLE_TYPES.FATTY_ACID]: 'lipids',
    [PARTICLE_TYPES.LIPID]: 'lipids',
    [PARTICLE_TYPES.GLYCEROL]: 'lipids',
  };

  const handleTransfer = (itemId, amount) => {
    const targetResource = RESOURCE_MAP[itemId];
    
    if (!targetResource) {
      alert("This item cannot be processed by the Biology Lab yet.");
      return;
    }

    // 1. Consume from Global
    // We assume 'compounds' category for now, or we check mapping.
    // simpler: try consumeResource with dynamic category lookup if needed, 
    // but inventory.js usually requires category. 
    // For now, let's assume we know the category or the inventory allows sloppy calls (it doesn't usually).
    // We'll try 'compounds' first, then 'elements'.
    
    let success = consumeResource('compounds', itemId, amount);
    if (!success) success = consumeResource('elements', itemId, amount);
    
    if (success) {
      // 2. Add to Local
      updateSoup({
        [targetResource]: (soup[targetResource] || 0) + amount
      });
    } else {
      alert("Not enough resources in Global Inventory.");
    }
  };

  // Filter items that are relevant to Bio Lab
  const relevantItems = discoveredItems.filter(id => RESOURCE_MAP[id] !== undefined);

  return (
    <div className="flex h-full p-6 gap-6">
      {/* LEFT: Global Inventory */}
      <div className="flex-1 bg-gray-800/50 rounded-xl border border-teal-800/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-teal-800/30 bg-teal-900/20">
          <h3 className="text-xl font-bold text-teal-300">Global Inventory</h3>
          <p className="text-xs text-teal-500">Available resources from Physics & Chemistry</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {relevantItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No biological compounds discovered yet.</p>
          ) : (
             relevantItems.map(id => (
               <InventoryCard key={id} id={id} onTransfer={handleTransfer} />
             ))
          )}
        </div>
      </div>

      {/* CENTER: Action / Visualization */}
      <div className="w-16 flex flex-col items-center justify-center">
        <div className="w-1 bg-teal-800/30 h-full rounded-full"></div>
        <div className="my-4 text-2xl text-teal-500">➔</div>
        <div className="w-1 bg-teal-800/30 h-full rounded-full"></div>
      </div>

      {/* RIGHT: Bio Lab Storage (Soup) */}
      <div className="flex-1 bg-teal-900/20 rounded-xl border border-teal-600/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-teal-600/30 bg-teal-800/20">
          <h3 className="text-xl font-bold text-teal-200">Petri Dish Supply</h3>
          <p className="text-xs text-teal-400">Nutrient Broth Composition</p>
        </div>
        <div className="p-6 grid gap-4">
           <ResourceStat name="Glucose (Energy)" value={soup.glucose} unit="mol" color="text-yellow-400" />
           <ResourceStat name="Amino Acids (Building)" value={soup.aminoAcids} unit="mol" color="text-purple-400" />
           <ResourceStat name="Lipids (Membrane)" value={soup.lipids} unit="mol" color="text-orange-400" />
           {/* Add more as soup expands */}
        </div>
      </div>
    </div>
  );
};

const InventoryCard = ({ id, onTransfer }) => {
  const info = getUniversalItemInfo(id);
  const [amount, setAmount] = useState(1);
  const inventoryCount = useInventory(state => state.inventory['compounds']?.[id] || state.inventory['elements']?.[id] || 0);

  return (
    <div className="bg-gray-900/80 p-3 rounded-lg flex items-center gap-4 border border-gray-700 hover:border-teal-500/50 transition-colors">
      <div className="w-12 h-12 relative shrink-0">
        <ParticleIcon type={id} color={info.color} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-200 truncate">{info.name}</h4>
        <p className="text-xs text-gray-500">Available: <span className="text-white font-mono">{inventoryCount}</span></p>
      </div>
      <div className="flex items-center gap-2">
         <input 
           type="number" 
           min="1" 
           max={inventoryCount} 
           value={amount} 
           onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
           className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-right"
         />
         <button 
           onClick={() => onTransfer(id, amount)}
           disabled={inventoryCount < 1}
           className="bg-teal-700 hover:bg-teal-600 disabled:bg-gray-700 text-white px-3 py-1 rounded text-sm font-bold transition-colors"
         >
           Import
         </button>
      </div>
    </div>
  );
};

const ResourceStat = ({ name, value, unit, color }) => (
  <div className="bg-black/30 p-4 rounded-lg flex justify-between items-center border border-white/5">
    <span className="text-gray-400 font-medium">{name}</span>
    <span className={`text-2xl font-mono font-bold ${color}`}>
      {Math.floor(value)} <span className="text-sm text-gray-600 ml-1">{unit}</span>
    </span>
  </div>
);

export default BioLabInventory;
