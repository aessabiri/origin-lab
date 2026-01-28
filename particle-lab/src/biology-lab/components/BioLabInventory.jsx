import React, { useState } from 'react';
import { useInventory } from '../../store/inventory';
import { useBioStore } from '../store';
import { getUniversalItemInfo } from '../../utils/codexData';
import { PARTICLE_TYPES } from '../../constants/particles';
import ParticleIcon from '../../particle-lab/components/ParticleIcon.jsx';

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

    // Infinite supply logic: We no longer consume from Global.
    // We just add to the local soup.
    updateSoup({
      [targetResource]: (soup[targetResource] || 0) + amount
    });
  };

  // Filter items that are relevant to Bio Lab
  const relevantItems = discoveredItems.filter(id => RESOURCE_MAP[id] !== undefined);

  return (
    <div className="flex h-full p-6 gap-6">
      {/* LEFT: Global Inventory */}
      <div className="flex-1 bg-gray-800/50 rounded-xl border border-teal-800/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-teal-800/30 bg-teal-900/20">
          <h3 className="text-xl font-bold text-teal-300">Universal Source</h3>
          <p className="text-xs text-teal-500">Infinite supply of discovered building blocks</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {relevantItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-4">
               <span className="text-3xl mb-2">🔭</span>
               <p className="text-sm italic">No biological compounds discovered yet. Synthesize them in Physics/Chemistry labs!</p>
            </div>
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
  const [amount, setAmount] = useState(10); // Default to larger chunks for soup

  return (
    <div className="bg-gray-900/80 p-3 rounded-lg flex items-center gap-4 border border-gray-700 hover:border-teal-500/50 transition-colors">
      <div className="w-12 h-12 relative shrink-0">
        <ParticleIcon type={id} color={info.color} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-200 truncate">{info.name}</h4>
        <p className="text-[10px] text-amber-500 font-black uppercase tracking-tighter">Infinite Source</p>
      </div>
      <div className="flex items-center gap-2">
         <input 
           type="number" 
           min="1" 
           value={amount} 
           onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
           className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-right font-mono"
         />
         <button 
           onClick={() => onTransfer(id, amount)}
           className="bg-teal-700 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm font-bold transition-colors"
         >
           Inject
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
