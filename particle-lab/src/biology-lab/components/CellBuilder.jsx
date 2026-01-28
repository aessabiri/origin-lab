import React, { useMemo } from 'react';
import { useBioStore } from '../store';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';
import { getUniversalItemInfo } from '../../utils/codexData';
import { PARTICLE_TYPES } from '../../constants/particles';
import { BakelitePanel, NixieTube, AnalogGauge, Oscilloscope } from '../../components/VisualPrimitives';
import ParticleIcon from '../../particle-lab/components/ParticleIcon';

const ORGANELLES = [
  { type: PARTICLE_TYPES.MEMBRANE, stats: { stability: 20, metabolism: 5 } },
  { type: PARTICLE_TYPES.RIBOSOME, stats: { stability: 5, metabolism: 15 } },
  { type: PARTICLE_TYPES.MITOCHONDRION, stats: { stability: 10, metabolism: 25 } },
  { type: PARTICLE_TYPES.NUCLEUS, stats: { stability: 30, metabolism: 10 } },
];

const CellBuilder = () => {
  const { 
    currentCellDesign, 
    synthesizedProteins, 
    addOrganelleToDesign, 
    removeOrganelleFromDesign,
    addProteinToDesign,
    updateCellDesign 
  } = useBioStore();
  const { discoveredItems } = useInventory();
  const { isSandboxMode } = useStore();

  // 1. Filter available organelles
  const availableOrganelles = useMemo(() => {
    return ORGANELLES.filter(o => isSandboxMode || discoveredItems.includes(o.type));
  }, [discoveredItems, isSandboxMode]);

  // 2. Calculate Stats
  const stats = useMemo(() => {
    let metabolism = 0;
    let stability = 0;
    let complexity = currentCellDesign.organelles.length;

    currentCellDesign.organelles.forEach(o => {
      if (o.isProtein) {
        metabolism += 10;
        stability += 5;
      } else {
        const base = ORGANELLES.find(orig => orig.type === o.type);
        if (base) {
          metabolism += base.stats.metabolism;
          stability += base.stats.stability;
        }
      }
    });

    return { metabolism, stability, complexity };
  }, [currentCellDesign.organelles]);

  const handleFinalize = () => {
    // In a real game, this might unlock spawning this specific cell type
    alert("LUCA PROTOTYPE FINALIZED // SAVED TO BIOS_KERNEL");
  };

  return (
    <div className="flex h-full w-full bg-[#050505] p-6 gap-6 overflow-hidden">
      
      {/* LEFT: Component Library */}
      <div className="w-80 flex flex-col gap-4 shrink-0">
        <BakelitePanel className="flex-1 flex flex-col p-4 border-4 border-black">
           <div className="mb-4 pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest italic">ASSEMBLY_PARTS</h3>
              <p className="text-[8px] text-zinc-600 font-mono uppercase tracking-tighter">Organelles & Functional Proteins</p>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {/* Organelles */}
              <section>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Structural Units</h4>
                <div className="space-y-2">
                  {availableOrganelles.map(o => (
                    <ComponentButton 
                      key={o.type} 
                      type={o.type} 
                      stats={o.stats} 
                      onClick={() => addOrganelleToDesign(o)} 
                    />
                  ))}
                </div>
              </section>

              {/* Peptides (Short Chains) */}
              <section>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Peptide Chains (&lt; 5 AA)</h4>
                <div className="space-y-2">
                  {synthesizedProteins.filter(p => p.sequence.length < 5).length === 0 ? (
                    <p className="text-[10px] text-zinc-700 italic border border-dashed border-zinc-800 p-2 text-center rounded">No Peptides</p>
                  ) : (
                    synthesizedProteins.filter(p => p.sequence.length < 5).map(p => (
                      <ProteinButton key={p.id} p={p} onClick={() => addProteinToDesign(p)} color="text-teal-400" />
                    ))
                  )}
                </div>
              </section>

              {/* Proteins (Longer Chains) */}
              <section>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Enzymatic Proteins (5+ AA)</h4>
                <div className="space-y-2">
                  {synthesizedProteins.filter(p => p.sequence.length >= 5).length === 0 ? (
                    <p className="text-[10px] text-zinc-700 italic border border-dashed border-zinc-800 p-2 text-center rounded">No Proteins</p>
                  ) : (
                    synthesizedProteins.filter(p => p.sequence.length >= 5).map(p => (
                      <ProteinButton key={p.id} p={p} onClick={() => addProteinToDesign(p)} color="text-indigo-400" />
                    ))
                  )}
                </div>
              </section>
           </div>
        </BakelitePanel>
      </div>

      {/* CENTER: Assembly Bay */}
      <div className="flex-1 flex flex-col gap-6">
        <BakelitePanel className="flex-1 relative border-4 border-black bg-[#0a0a0a] shadow-[inset_0_0_100px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
           {/* Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:60px_60px]"></div>
           
           {/* Circular Cell Body */}
           <div className="relative w-96 h-96 rounded-full border-4 border-dashed border-zinc-800 flex items-center justify-center group">
              <div className="absolute inset-0 rounded-full bg-teal-500/5 animate-pulse"></div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1 bg-zinc-900 border border-zinc-700 rounded text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Prototype_Shell</div>

              {/* Placed Components */}
              <div className="relative w-full h-full p-12 grid grid-cols-3 gap-4 items-center justify-items-center">
                 {currentCellDesign.organelles.map((o, idx) => (
                   <PlacedItem 
                     key={o.id} 
                     item={o} 
                     onClick={() => removeOrganelleFromDesign(o.id)} 
                   />
                 ))}
                 {/* Empty Slots */}
                 {[...Array(Math.max(0, 6 - currentCellDesign.organelles.length))].map((_, i) => (
                   <div key={i} className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-900 flex items-center justify-center text-zinc-900 font-black text-2xl">
                      +
                   </div>
                 ))}
              </div>
           </div>

           {/* Technical HUD Overlay */}
           <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-amber-600 block tracking-widest uppercase">Bio_Integrity</span>
                    <Oscilloscope active={currentCellDesign.organelles.length > 0} color="emerald" />
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] font-black text-zinc-600 block uppercase">System_Clock</span>
                    <span className="text-sm font-mono text-zinc-400">{new Date().toLocaleTimeString()}</span>
                 </div>
              </div>
              <div className="flex justify-center">
                 <div className="px-6 py-2 bg-black border-2 border-zinc-800 rounded-full text-[10px] font-black text-zinc-600 tracking-[0.5em] uppercase">
                    Origin_Lab_Assembly_Bay
                 </div>
              </div>
           </div>
        </BakelitePanel>

        {/* Lower Controls */}
        <div className="h-32 flex gap-6 shrink-0">
           <BakelitePanel className="flex-1 border-4 border-black p-4 grid grid-cols-3 items-center">
              <AnalogGauge label="Metabolism" value={stats.metabolism} max={200} color="amber" />
              <AnalogGauge label="Stability" value={stats.stability} max={200} color="emerald" />
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black text-zinc-600 uppercase mb-1">Complexity</span>
                 <NixieTube value={stats.complexity} digits={2} size="sm" />
              </div>
           </BakelitePanel>

           <button 
             onClick={handleFinalize}
             className="w-64 bg-gradient-to-b from-amber-500 to-amber-700 border-4 border-black rounded-xl text-white font-black uppercase tracking-widest hover:from-amber-400 hover:to-amber-600 shadow-2xl active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
           >
              <span className="text-2xl">⚡</span>
              <span>Finalize Prototype</span>
           </button>
        </div>
      </div>
    </div>
  );
};

const ProteinButton = ({ p, onClick, color }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 p-2 bg-zinc-900/30 rounded-lg border border-zinc-800 hover:border-indigo-500/50 transition-all text-left group"
  >
    <div className="text-lg group-hover:scale-110 transition-transform">🧬</div>
    <div className="flex-1 overflow-hidden">
       <div className={`text-[10px] font-black uppercase truncate ${color}`}>{p.name}</div>
       <div className="text-[7px] text-zinc-600 font-mono italic">{p.sequence.length} AA SEQUENCE</div>
    </div>
  </button>
);

const ComponentButton = ({ type, stats, onClick }) => {
  const info = getUniversalItemInfo(type);
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 group transition-all text-left"
    >
      <div className="w-12 h-12 shrink-0">
        <ParticleIcon type={type} color={info.color} />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-[10px] font-black text-zinc-200 uppercase truncate">{info.name}</div>
        <div className="flex gap-2 mt-1">
           <span className="text-[7px] text-amber-500 font-bold">MET +{stats.metabolism}</span>
           <span className="text-[7px] text-emerald-500 font-bold">STB +{stats.stability}</span>
        </div>
      </div>
    </button>
  );
};

const PlacedItem = ({ item, onClick }) => {
  const info = item.isProtein ? { name: item.name, color: 'bg-indigo-500' } : getUniversalItemInfo(item.type);
  
  return (
    <div 
      onClick={onClick}
      className="relative w-20 h-20 bg-zinc-900 rounded-full border-2 border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 group transition-all shadow-2xl"
    >
       <div className="w-10 h-10 mb-1">
          {item.isProtein ? (
            <div className="text-2xl">🧬</div>
          ) : (
            <ParticleIcon type={item.type} color={info.color} />
          )}
       </div>
       <span className="text-[7px] font-black text-zinc-500 uppercase text-center w-full truncate px-2">{info.name}</span>
       
       {/* Remove Indicator */}
       <div className="absolute inset-0 bg-red-950/80 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="text-white font-black text-xs">REMOVE</span>
       </div>
    </div>
  );
};

export default CellBuilder;