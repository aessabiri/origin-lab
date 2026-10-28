import React from 'react';
import { useBioStore } from '../store';
import { PARTICLE_TYPES } from '../../constants/particles';
import ResourceExchange from '../../components/ResourceExchange.jsx';

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
    <div className="flex h-full gap-6 p-6 bg-[#070a13] relative overflow-hidden select-none">
      
      {/* LEFT: Unified Exchange (The Cabinet) */}
      <div className="flex-1 relative z-10">
         <div className="h-full bg-[#0c1220]/90 backdrop-blur-2xl border border-teal-500/25 rounded-3xl p-4 shadow-2xl overflow-hidden flex flex-col">
            <ResourceExchange 
                labName="Biological Resource Cabinet"
                onImport={handleImport}
                allowedCategories={['Biochemistry', 'Molecular']}
                excludedCategories={['Atomic']} 
                excludedTypes={[PARTICLE_TYPES.OXYGEN_GAS, PARTICLE_TYPES.NITROGEN_GAS]} 
            />
         </div>
      </div>

      {/* RIGHT: Status Monitor (The Console) */}
      <div className="w-96 flex flex-col gap-5 relative z-10">
        <div className="flex-1 p-6 bg-[#0c1220]/90 backdrop-blur-2xl border border-teal-500/25 rounded-3xl shadow-2xl flex flex-col justify-between">
           <div className="pb-4 border-b border-teal-500/20 flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-teal-300 tracking-wider uppercase font-mono">
                  Broth Concentration
                </h3>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">Primary Nutrition Telemetry</p>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"></div>
           </div>

           <div className="space-y-6 flex-1 flex flex-col justify-center py-4">
              <ResourceMonitor name="GLUCOSE" value={soup.glucose} max={500} color="text-amber-400" barColor="bg-amber-400" />
              <ResourceMonitor name="AMINO ACIDS" value={soup.aminoAcids} max={500} color="text-cyan-400" barColor="bg-cyan-400" />
              <ResourceMonitor name="LIPIDS" value={soup.lipids} max={500} color="text-emerald-400" barColor="bg-emerald-400" />
           </div>

           {/* Console Actions */}
           <div className="pt-4 border-t border-teal-500/20 flex gap-3">
              <button 
                onClick={() => updateSoup({ glucose: 100, aminoAcids: 50, lipids: 20 })}
                className="flex-1 py-2.5 px-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono text-[10px] font-bold uppercase hover:bg-teal-500/25 active:scale-95 transition-all cursor-pointer"
              >
                 Replenish Broth
              </button>
           </div>
        </div>

        {/* Small Bottom Panel */}
        <div className="h-20 p-4 bg-[#0c1220]/90 border border-teal-500/25 rounded-2xl flex items-center justify-between shadow-xl">
           <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-mono">STATION ID</span>
              <span className="text-xs font-mono font-bold text-teal-300 tracking-widest">BIO_STORAGE_01</span>
           </div>
           <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-950/80 border border-teal-500/30 text-[10px] font-mono text-teal-300 font-bold">
              <span>●</span> TELEMETRY OK
           </div>
        </div>
      </div>
    </div>
  );
};

const ResourceMonitor = ({ name, value, max, color, barColor }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">{name}</span>
      <span className={`text-xl font-mono font-black ${color}`}>
        {Math.floor(value)}<span className="text-[10px] text-slate-500 ml-1 font-normal">μmol</span>
      </span>
    </div>
    <div className="w-full h-2.5 bg-[#070b14] border border-teal-500/20 rounded-full p-0.5 overflow-hidden">
       <div 
         className={`h-full transition-all duration-700 ease-out rounded-full ${barColor} shadow-[0_0_8px_currentColor]`} 
         style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
       />
    </div>
  </div>
);

export default BioLabInventory;
