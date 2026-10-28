import React, { useMemo } from 'react';
import { useBioStore } from '../store';
import { usePlanetaryStore } from '../../store/planetaryStore';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';
import { PARTICLE_TYPES } from '../../constants/particles';
import { getUniversalItemInfo } from '../../utils/codexData';
import ParticleIcon from '../../particle-lab/components/ParticleIcon';
import { BakelitePanel, NixieTube, AnalogGauge, Oscilloscope } from '../../components/VisualPrimitives';

const CellBuilder = ({ onFinalize }) => {
  const { 
    currentCellDesign, 
    addOrganelleToDesign, 
    removeOrganelleFromDesign,
    synthesizedProteins,
    addProteinToDesign 
  } = useBioStore();

  const availableOrganelles = [
    { type: PARTICLE_TYPES.MEMBRANE, stats: { metabolism: 5, stability: 30 } },
    { type: PARTICLE_TYPES.RIBOSOME, stats: { metabolism: 15, stability: 10 } },
    { type: PARTICLE_TYPES.MITOCHONDRION, stats: { metabolism: 40, stability: 5 } },
    { type: PARTICLE_TYPES.NUCLEUS, stats: { metabolism: 10, stability: 50 } },
  ];

  // Derived stats from components
  const stats = useMemo(() => {
    let metabolism = 10;
    let stability = 10;
    let complexity = currentCellDesign.organelles.length;

    currentCellDesign.organelles.forEach(o => {
      if (o.stats) {
        metabolism += o.stats.metabolism;
        stability += o.stats.stability;
      } else if (o.isProtein) {
        // Dynamic stats for synthesized proteins based on sequence length
        metabolism += o.sequence.length * 5;
        stability += 5;
        if (o.sequence.length > 6) {
          metabolism += 20; // Bonus for complex enzyme
        }
      }
    });

    return { metabolism, stability, complexity };
  }, [currentCellDesign.organelles]);

  const handleFinalize = () => {
    // 1. Determine LUCA traits
    const isPhototroph = stats.metabolism > 30; 
    const isChemotroph = stats.stability > 20;

    const organism = {
      name: 'LUCA Prototype',
      stats,
      organelles: currentCellDesign.organelles,
      traits: {
        phototroph: isPhototroph,
        chemotroph: isChemotroph,
        heatTolerance: stats.stability * 2,
      },
      timestamp: Date.now()
    };

    // 2. Seed Planetary Store
    usePlanetaryStore.getState().seedPlanet(organism);

    // 3. Save to Inventory Codex (so it's recorded)
    useInventory.getState().markDiscovered('LUCA');
    useStore.getState().showMessage('LUCA Prototype Finalized — Seeding Planetary Biosphere!');

    if (onFinalize) onFinalize();
  };

  return (
    <div className="flex h-full w-full bg-[#070a13] p-6 gap-6 overflow-hidden select-none">
      
      {/* LEFT: Component Library */}
      <div className="w-80 flex flex-col gap-4 shrink-0">
        <div className="flex-1 flex flex-col p-5 bg-[#0c1220]/90 border border-teal-500/25 rounded-3xl shadow-2xl backdrop-blur-xl">
           <div className="mb-4 pb-3 border-b border-teal-500/20">
              <h3 className="text-xs font-black text-teal-300 uppercase tracking-widest flex items-center gap-2">
                <span>🧬</span> Assembly Matrix
              </h3>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">Organelles & Catalytic Peptides</p>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
              {/* Organelles */}
              <section>
                <h4 className="text-[9px] font-mono font-bold text-slate-400 uppercase mb-2.5 tracking-wider">Structural Organelles</h4>
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

              {/* Peptides */}
              <section>
                <h4 className="text-[9px] font-mono font-bold text-slate-400 uppercase mb-2.5 tracking-wider">Peptide Sequences (&lt; 5 AA)</h4>
                <div className="space-y-2">
                  {synthesizedProteins.filter(p => p.sequence.length < 5).length === 0 ? (
                    <p className="text-[10px] text-slate-600 font-mono italic border border-dashed border-slate-800 p-2.5 text-center rounded-xl">No Peptides Synthesized</p>
                  ) : (
                    synthesizedProteins.filter(p => p.sequence.length < 5).map(p => (
                      <ProteinButton key={p.id} p={p} onClick={() => addProteinToDesign(p)} color="text-teal-400" />
                    ))
                  )}
                </div>
              </section>

              {/* Proteins */}
              <section>
                <h4 className="text-[9px] font-mono font-bold text-slate-400 uppercase mb-2.5 tracking-wider">Catalytic Enzymes (5+ AA)</h4>
                <div className="space-y-2">
                  {synthesizedProteins.filter(p => p.sequence.length >= 5).length === 0 ? (
                    <p className="text-[10px] text-slate-600 font-mono italic border border-dashed border-slate-800 p-2.5 text-center rounded-xl">Fold Proteins in 3D Lab First</p>
                  ) : (
                    synthesizedProteins.filter(p => p.sequence.length >= 5).map(p => (
                      <ProteinButton key={p.id} p={p} onClick={() => addProteinToDesign(p)} color="text-indigo-400" />
                    ))
                  )}
                </div>
              </section>
           </div>
        </div>
      </div>

      {/* CENTER: Assembly Bay */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex-1 relative border border-teal-500/25 bg-[#090e1b] rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex items-center justify-center">
           {/* Telemetry Precision Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px)] [background-size:48px_48px]"></div>
           
           {/* Circular Cell Body Chassis */}
           <div className="relative w-96 h-96 rounded-full border-2 border-dashed border-teal-500/40 flex items-center justify-center group shadow-[0_0_50px_rgba(20,184,166,0.15)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/10 via-cyan-500/5 to-transparent animate-pulse pointer-events-none"></div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#080d18] border border-teal-500/40 rounded-full text-[9px] font-mono text-teal-300 font-bold uppercase tracking-widest shadow-md">
                LUCA Membrane Chassis ({currentCellDesign.organelles.length}/6)
              </div>

              {/* Placed Components in Hexagonal Radial Matrix */}
              <div className="relative w-full h-full p-10 grid grid-cols-3 gap-3 items-center justify-items-center">
                 {currentCellDesign.organelles.map((o) => (
                   <PlacedItem 
                     key={o.id} 
                     item={o} 
                     onClick={() => removeOrganelleFromDesign(o.id)} 
                   />
                 ))}
                 {/* Empty Slots */}
                 {[...Array(Math.max(0, 6 - currentCellDesign.organelles.length))].map((_, i) => (
                   <div key={i} className="w-16 h-16 rounded-full border border-dashed border-slate-700/60 flex items-center justify-center text-slate-600 font-mono text-lg transition-colors hover:border-teal-500/50">
                      +
                   </div>
                 ))}
              </div>
           </div>

           {/* Technical HUD Telemetry Overlay */}
           <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-teal-400 block tracking-widest uppercase">Bioplasmic Harmonic Resonance</span>
                    <Oscilloscope active={currentCellDesign.organelles.length > 0} color="teal" />
                 </div>
                 <div className="text-right">
                    <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">Telemetry Clock</span>
                    <span className="text-xs font-mono text-cyan-300">{new Date().toLocaleTimeString()}</span>
                 </div>
              </div>
              <div className="flex justify-center">
                 <div className="px-5 py-1.5 bg-[#080d18]/90 border border-teal-500/20 rounded-full text-[9px] font-mono text-teal-300/80 tracking-widest uppercase shadow-md">
                    Chamber Alpha // Biogenesis Bay
                 </div>
              </div>
           </div>
        </div>

        {/* Lower Controls & Telemetry Deck */}
        <div className="h-32 flex gap-5 shrink-0">
           <div className="flex-1 bg-[#0c1220]/90 border border-teal-500/25 rounded-2xl p-4 grid grid-cols-3 items-center shadow-xl backdrop-blur-xl">
              <AnalogGauge label="Metabolism" value={stats.metabolism} max={200} color="amber" />
              <AnalogGauge label="Stability" value={stats.stability} max={200} color="emerald" />
              <div className="flex flex-col items-center">
                 <span className="text-[9px] font-mono font-bold text-slate-400 uppercase mb-1.5">Complexity Tier</span>
                 <NixieTube value={stats.complexity} digits={2} size="sm" />
              </div>
           </div>

           <button 
             onClick={handleFinalize}
             className="w-72 bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-600 rounded-2xl text-white font-mono font-black text-xs uppercase tracking-widest shadow-[0_8px_24px_rgba(20,184,166,0.35)] hover:shadow-[0_12px_32px_rgba(20,184,166,0.5)] active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border border-teal-300/30"
           >
              <span className="text-2xl">🧬</span>
              <span>Finalize LUCA Prototype</span>
           </button>
        </div>
      </div>
    </div>
  );
};

const ProteinButton = ({ p, onClick, color }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-2.5 p-2 bg-[#090f1d] rounded-xl border border-slate-800 hover:border-teal-400/40 hover:bg-[#0f172a] transition-all text-left group cursor-pointer"
  >
    <div className="text-base group-hover:scale-110 transition-transform p-1.5 rounded-lg bg-teal-950/60 border border-teal-500/30">🧬</div>
    <div className="flex-1 overflow-hidden">
       <div className={`text-[10px] font-black uppercase truncate ${color}`}>{p.name}</div>
       <div className="text-[8px] text-slate-500 font-mono">{p.sequence.length} AA Residues</div>
    </div>
  </button>
);

const ComponentButton = ({ type, stats, onClick }) => {
  const info = getUniversalItemInfo(type);
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2.5 bg-[#090f1d] rounded-xl border border-slate-800 hover:border-teal-400/50 hover:bg-[#0f172a] group transition-all text-left cursor-pointer"
    >
      <div className="w-10 h-10 shrink-0">
        <ParticleIcon type={type} color={info.color} />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-[10px] font-black text-slate-200 uppercase truncate">{info.name}</div>
        <div className="flex gap-2 mt-0.5">
           <span className="text-[8px] font-mono text-amber-400 font-bold">MET +{stats.metabolism}</span>
           <span className="text-[8px] font-mono text-emerald-400 font-bold">STB +{stats.stability}</span>
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
      className="relative w-18 h-18 bg-[#0c1424] rounded-full border border-teal-500/40 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 group transition-all shadow-xl"
    >
       <div className="w-9 h-9 mb-0.5">
          {item.isProtein ? (
            <div className="text-xl">🧬</div>
          ) : (
            <ParticleIcon type={item.type} color={info.color} />
          )}
       </div>
       <span className="text-[7px] font-mono font-bold text-slate-400 uppercase text-center w-full truncate px-1">{info.name}</span>
       
       {/* Remove Indicator Overlay */}
       <div className="absolute inset-0 bg-rose-950/90 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border border-rose-500">
          <span className="text-white font-mono font-black text-[9px]">EJECT</span>
       </div>
    </div>
  );
};

export default CellBuilder;
