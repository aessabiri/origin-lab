import React from 'react';
import { useBioStore } from '../store';
import { PARTICLE_TYPES } from '../../constants/particles';
import ResourceExchange from '../../components/ResourceExchange.jsx';
import { BakelitePanel } from '../../components/VisualPrimitives';

const BioLabInventory = () => {
  const soup = useBioStore(state => state.soup);
  const updateSoup = useBioStore(state => state.updateSoup);
  
  // Mapping Global Items to Bio Resources
  const RESOURCE_MAP = {
    [PARTICLE_TYPES.GLUCOSE]: 'glucose',
    [PARTICLE_TYPES.FRUCTOSE]: 'glucose',
    [PARTICLE_TYPES.GLYCINE]: 'aminoAcids',
    [PARTICLE_TYPES.ALANINE]: 'aminoAcids',
    [PARTICLE_TYPES.SERINE]: 'aminoAcids',
    [PARTICLE_TYPES.CYSTEINE]: 'aminoAcids',
    [PARTICLE_TYPES.VALINE]: 'aminoAcids',
    [PARTICLE_TYPES.LEUCINE]: 'aminoAcids',
    [PARTICLE_TYPES.ISOLEUCINE]: 'aminoAcids',
    [PARTICLE_TYPES.THREONINE]: 'aminoAcids',
    [PARTICLE_TYPES.METHIONINE]: 'aminoAcids',
    [PARTICLE_TYPES.LYSINE]: 'aminoAcids',
    [PARTICLE_TYPES.HISTIDINE]: 'aminoAcids',
    [PARTICLE_TYPES.TRYPTOPHAN]: 'aminoAcids',
    [PARTICLE_TYPES.ARGININE]: 'aminoAcids',
    [PARTICLE_TYPES.ASPARAGINE]: 'aminoAcids',
    [PARTICLE_TYPES.ASPARTIC_ACID]: 'aminoAcids',
    [PARTICLE_TYPES.GLUTAMIC_ACID]: 'aminoAcids',
    [PARTICLE_TYPES.GLUTAMINE]: 'aminoAcids',
    [PARTICLE_TYPES.PROLINE]: 'aminoAcids',
    [PARTICLE_TYPES.TYROSINE]: 'aminoAcids',
    [PARTICLE_TYPES.PHENYLALANINE]: 'aminoAcids',
    [PARTICLE_TYPES.FATTY_ACID]: 'lipids',
    [PARTICLE_TYPES.LIPID]: 'lipids',
    [PARTICLE_TYPES.GLYCEROL]: 'lipids',
  };

  const handleImport = (itemId, amount) => {
    const targetResource = RESOURCE_MAP[itemId];
    if (!targetResource) return;

    updateSoup({
      [targetResource]: (soup[targetResource] || 0) + amount
    });
  };

  return (
    <div className="flex h-full gap-6 p-6 bg-[#050505] relative overflow-hidden">
      
      {/* Decorative Wires / Tubes Background */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-zinc-800 opacity-20"></div>
      
      {/* LEFT: Unified Exchange (The Cabinet) */}
      <div className="flex-1 relative z-10">
         <BakelitePanel className="h-full rounded-none border-4 border-black shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <ResourceExchange 
                labName="Bio-Resource Cabinet"
                onImport={handleImport}
                allowedCategories={['Biochemistry', 'Molecular']}
                excludedCategories={['Atomic']} 
                excludedTypes={[PARTICLE_TYPES.OXYGEN_GAS, PARTICLE_TYPES.NITROGEN_GAS]} 
            />
         </BakelitePanel>
      </div>

      {/* RIGHT: Status Monitor (The Console) */}
      <div className="w-96 flex flex-col gap-6 relative z-10">
        <BakelitePanel className="flex-1 p-6 border-4 border-black flex flex-col">
           <div className="mb-6 pb-4 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-amber-500 tracking-tighter italic">SOUP_CONC</h3>
                <p className="text-[8px] text-zinc-600 font-mono">PRIMARY_NUTRITION_LEVELS</p>
              </div>
              <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
           </div>

           <div className="space-y-8 flex-1 flex flex-col justify-around">
              <ResourceMonitor name="GLUCOSE" value={soup.glucose} max={500} color="text-yellow-500" glow="shadow-yellow-500/20" />
              <ResourceMonitor name="AMINO_ACIDS" value={soup.aminoAcids} max={500} color="text-indigo-400" glow="shadow-indigo-500/20" />
              <ResourceMonitor name="LIPIDS" value={soup.lipids} max={500} color="text-emerald-400" glow="shadow-emerald-500/20" />
           </div>

           {/* Console Buttons */}
           <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="h-12 bg-zinc-900 border-2 border-zinc-800 rounded flex items-center justify-center shadow-inner">
                 <span className="text-[10px] font-black text-zinc-600">AUTO_MODE</span>
              </div>
              <div className="h-12 bg-red-950/20 border-2 border-red-900/30 rounded flex items-center justify-center">
                 <span className="text-[10px] font-black text-red-900">EMRG_FLUSH</span>
              </div>
           </div>
        </BakelitePanel>

        {/* Small Bottom Panel (The ID plate) */}
        <BakelitePanel className="h-20 p-4 border-4 border-black flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[8px] text-zinc-500 font-mono">STATION_ID</span>
              <span className="text-xs font-black text-zinc-300 tracking-widest">BIO_LOG_092</span>
           </div>
           <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-2 h-4 border border-zinc-800 ${i === 1 ? 'bg-amber-500 shadow-[0_0_5px_#fbbf24]' : 'bg-black'}`}></div>
              ))}
           </div>
        </BakelitePanel>
      </div>
    </div>
  );
};

const ResourceMonitor = ({ name, value, max, color, glow }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] font-black text-zinc-500 tracking-widest">{name}</span>
      <span className={`text-2xl font-mono ${color} drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]`}>
        {Math.floor(value)}<span className="text-xs text-zinc-700 ml-1">μmol</span>
      </span>
    </div>
    <div className={`w-full h-4 bg-black border-2 border-zinc-800 rounded p-0.5 shadow-inner`}>
       <div 
         className={`h-full bg-current transition-all duration-1000 ease-out rounded-sm ${color} ${glow} shadow-lg`} 
         style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
       ></div>
    </div>
  </div>
);

export default BioLabInventory;