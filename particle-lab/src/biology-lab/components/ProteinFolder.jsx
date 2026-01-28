import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useBioStore } from '../store';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';
import { getUniversalCodexData, getUniversalItemInfo } from '../../utils/codexData';
import { PARTICLE_TYPES } from '../../constants/particles';
import { POLYPEPTIDE_RECIPES } from '../../constants/polypeptideRecipes';
import { BakelitePanel, NixieTube, Oscilloscope, NeoSphere, NeoBond, AnalogGauge } from '../../components/VisualPrimitives';
import ParticleIcon from '../../particle-lab/components/ParticleIcon';

const ProteinFolder = () => {
  const { synthesizedProteins, addSynthesizedProtein } = useBioStore();
  const { discoveredItems } = useInventory();
  const { isSandboxMode } = useStore();
  
  const [sequence, setSequence] = useState([]);
  const [isFolding, setIsFolding] = useState(false);
  const [foldedStructure, setFoldedStructure] = useState(null);
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'history'
  
  // 1. Get Available Amino Acids
  const aminoAcids = useMemo(() => {
    const codex = getUniversalCodexData();
    const bioGroup = codex.find(g => g.name === 'Biochemistry');
    const aaSub = bioGroup?.subcategories.find(s => s.name === 'Amino Acids');
    
    if (!aaSub) return [];
    
    return aaSub.particles.filter(type => isSandboxMode || discoveredItems.includes(type));
  }, [discoveredItems, isSandboxMode]);

  const handleAddAA = (type) => {
    if (sequence.length >= 16) return;
    setSequence([...sequence, { type, id: Date.now() + Math.random() }]);
    setFoldedStructure(null);
  };

  const handleLoadRecipe = (recipe) => {
    const newSeq = [];
    Object.entries(recipe.molecules).forEach(([type, count]) => {
      for(let i=0; i<count; i++) {
        newSeq.push({ type, id: Date.now() + Math.random() + i });
      }
    });
    setSequence(newSeq);
    setFoldedStructure(null);
  };

  const handleRemoveAA = (index) => {
    const newSeq = [...sequence];
    newSeq.splice(index, 1);
    setSequence(newSeq);
    setFoldedStructure(null);
  };

  const handleInjectRecipe = (recipe) => {
    if (sequence.length + Object.values(recipe.molecules).reduce((a,b) => a+b, 0) > 16) return;
    const newItems = [];
    Object.entries(recipe.molecules).forEach(([type, count]) => {
      for(let i=0; i<count; i++) {
        newItems.push({ type, id: Date.now() + Math.random() + i });
      }
    });
    setSequence([...sequence, ...newItems]);
    setFoldedStructure(null);
  };

  const handleStartFolding = () => {
    if (sequence.length < 2) return;
    setIsFolding(true);
    
    setTimeout(() => {
      const structure = generateFoldedStructure(sequence);
      setFoldedStructure(structure);
      setIsFolding(false);
      
      if (sequence.length >= 2) {
          const info = getUniversalItemInfo(sequence[0].type);
          addSynthesizedProtein({
              id: `PROT-${Date.now()}`,
              name: sequence.length <= 2 ? `Peptide_${sequence.length}` : `Protein_${sequence.length}`,
              sequence: sequence.map(s => s.type),
              structure
          });
      }
    }, 2000);
  };

  return (
    <div className="flex h-full w-full bg-[#050505] p-6 gap-6 overflow-hidden">
      
      {/* LEFT: Engineering Tools */}
      <div className="w-80 flex flex-col gap-4 shrink-0">
        <BakelitePanel className="flex-1 flex flex-col p-4 border-4 border-black">
           {/* Sub-tabs */}
           <div className="flex bg-black/40 rounded-lg p-1 mb-4 border border-zinc-800">
              {['library', 'history'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-1 text-[10px] font-black uppercase tracking-widest transition-all rounded ${activeTab === t ? 'bg-zinc-800 text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  {t}
                </button>
              ))}
           </div>

           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'library' ? (
                <div className="space-y-6">
                   <section>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Monomers</h4>
                      <div className="space-y-2">
                        {aminoAcids.map(type => (
                          <AAButton key={type} type={type} onAdd={() => handleAddAA(type)} />
                        ))}
                      </div>
                   </section>
                   
                   <section>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Known Peptides</h4>
                      <div className="space-y-2">
                        {POLYPEPTIDE_RECIPES.map(recipe => (
                          <div key={recipe.type} className="group flex gap-1">
                             <button 
                               onClick={() => handleLoadRecipe(recipe)}
                               className="flex-1 text-left p-2 bg-zinc-900 border border-zinc-800 rounded-l hover:border-indigo-500 transition-colors"
                             >
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{recipe.name}</span>
                             </button>
                             <button 
                               onClick={() => handleInjectRecipe(recipe)}
                               className="px-3 bg-indigo-900/30 border-y border-r border-zinc-800 rounded-r text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all text-xs font-bold"
                               title="Append to Sequence"
                             >
                               +
                             </button>
                          </div>
                        ))}
                      </div>
                   </section>
                </div>
              ) : (
                <div className="space-y-2">
                   <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Synthesis History</h4>
                   {synthesizedProteins.length === 0 ? (
                     <p className="text-[10px] text-zinc-700 italic text-center py-10">No records found</p>
                   ) : (
                     synthesizedProteins.slice().reverse().map(p => (
                       <div key={p.id} className="p-2 bg-zinc-900/50 border border-zinc-800 rounded text-[10px] font-mono text-zinc-400 flex justify-between items-center">
                          <span>{p.name}</span>
                          <span className="text-zinc-600">{p.sequence.length}aa</span>
                       </div>
                     ))
                   )}
                </div>
              )}
           </div>
        </BakelitePanel>
      </div>

      {/* CENTER: Sequence Bay & Fold Chamber */}
      <div className="flex-1 flex flex-col gap-6">
        {/* The Tape (Sequence) */}
        <BakelitePanel className="h-28 p-2 border-4 border-black relative flex items-center overflow-x-auto overflow-y-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] bg-zinc-950">
           <div className="absolute top-1 left-4 text-[8px] font-black text-zinc-700 tracking-[0.2em] pointer-events-none">PRIMARY_PEPTIDE_CHAIN</div>
           
           <div className="flex gap-2 px-4 items-center min-w-full">
              {sequence.length === 0 && (
                <p className="w-full text-center text-zinc-800 text-xs font-mono uppercase tracking-widest">Awaiting Sequence Injection...</p>
              )}
              {sequence.map((aa, idx) => (
                <SequenceItem key={aa.id} type={aa.type} onRemove={() => handleRemoveAA(idx)} />
              ))}
           </div>
           
           {/* Ribbon Effect */}
           <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        </BakelitePanel>

        {/* Chamber */}
        <BakelitePanel className="flex-1 relative border-4 border-black bg-[#0a0a0a] shadow-[inset_0_0_100px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
           <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]"></div>
           
           <div className="absolute top-6 left-6 z-10">
              <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${isFolding ? 'bg-orange-500 animate-pulse' : 'bg-zinc-800'}`}></div>
                 <span className="text-xs font-black text-zinc-500 tracking-widest uppercase">Folding_Engine_Status: {isFolding ? 'COMPUTING' : 'READY'}</span>
              </div>
           </div>

           <div className="relative w-full h-full flex items-center justify-center">
              {isFolding ? (
                <div className="flex flex-col items-center gap-6 scale-150">
                   <div className="w-24 h-24 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-xs font-black text-amber-500 animate-pulse tracking-widest uppercase">Analyzing Tertiary Structure</span>
                </div>
              ) : foldedStructure ? (
                <div className="scale-[2.5]">
                   <ProteinVisualizer structure={foldedStructure} />
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-10 space-y-4">
                   <div className="text-[120px] filter blur-sm">🧬</div>
                   <span className="text-sm font-black tracking-[1em] uppercase">No Structure Mapped</span>
                </div>
              )}
           </div>

           {/* CRT Overlays */}
           <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]"></div>
              <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] [background-size:100%_2px,3px_100%]"></div>
           </div>
        </BakelitePanel>

        {/* Dashboard */}
        <div className="h-28 flex gap-6 shrink-0">
           <BakelitePanel className="flex-1 border-4 border-black p-4 flex items-center justify-around bg-zinc-950/50 shadow-inner">
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">ENERGY_STABILITY</span>
                 <Oscilloscope active={!!foldedStructure} color={foldedStructure ? 'emerald' : 'amber'} />
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">AA_INDEX</span>
                 <NixieTube value={sequence.length} digits={2} size="sm" />
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">BOND_ENTROPY</span>
                 <AnalogGauge label="Entropy" value={sequence.length * 5} max={100} color="blue" />
              </div>
           </BakelitePanel>

           <button 
             onClick={handleStartFolding}
             disabled={sequence.length < 2 || isFolding}
             className={`w-56 rounded-xl border-4 border-black shadow-xl flex flex-col items-center justify-center gap-1 uppercase font-black tracking-widest transition-all
               ${sequence.length < 2 || isFolding 
                 ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' 
                 : 'bg-gradient-to-b from-indigo-600 to-indigo-900 text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)]'
               }`}
           >
              <span className="text-2xl">⚙️</span>
              <span className="text-xs">Fold Matrix</span>
           </button>
        </div>
      </div>
    </div>
  );
};

const RecipeButton = ({ recipe, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded hover:border-indigo-500 transition-colors group"
  >
    <div className="flex flex-col items-start">
       <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{recipe.name}</span>
       <span className="text-[7px] text-zinc-600 font-mono">REC_#{recipe.type.toUpperCase().slice(0,4)}</span>
    </div>
    <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
  </button>
);

// --- Rest of previous subcomponents (AAButton, SequenceItem, ProteinVisualizer, generateFoldedStructure) unchanged ---


// --- Subcomponents ---

const AAButton = ({ type, onAdd }) => {
  const info = getUniversalItemInfo(type);
  
  // Property mapping for lore/gameplay
  const props = {
    'glycine': { property: 'Flexible', effect: '+Stability' },
    'alanine': { property: 'Small', effect: '+Metabolism' },
    'serine': { property: 'Polar', effect: '+Solubility' },
    'valine': { property: 'Hydrophobic', effect: '+Folding' },
    'leucine': { property: 'Hydrophobic', effect: '+Size' },
    'cysteine': { property: 'Reactive', effect: '+Bonds' },
    'phenylalanine': { property: 'Aromatic', effect: '+Stability' },
  }[type] || { property: 'Neutral', effect: '+Complexity' };

  return (
    <button 
      onClick={onAdd}
      className="w-full flex items-center gap-3 p-2 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 group transition-all"
    >
      <div className="w-10 h-10 shrink-0">
        <ParticleIcon type={type} color={info.color} />
      </div>
      <div className="flex flex-col items-start overflow-hidden">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-zinc-300 uppercase truncate">{info.name}</span>
           <span className="text-[7px] text-amber-600 font-bold border border-amber-900/30 px-1 rounded">{props.property}</span>
        </div>
        <span className="text-[8px] text-zinc-600 font-mono italic">{props.effect}</span>
      </div>
      <span className="ml-auto text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
    </button>
  );
};

const SequenceItem = ({ type, onRemove }) => {
  const info = getUniversalItemInfo(type);
  return (
    <div className="relative group shrink-0 w-12 h-12 bg-zinc-900 rounded border border-zinc-700 flex items-center justify-center shadow-lg hover:ring-2 ring-amber-500/50 transition-all">
       <div className="w-8 h-8">
          <ParticleIcon type={type} color={info.color} />
       </div>
       <button 
         onClick={onRemove}
         className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[8px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-black shadow-md"
       >
         ✖
       </button>
    </div>
  );
};

const ProteinVisualizer = ({ structure }) => {
  const { points, bonds } = structure;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-20">
       <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
          {/* Bonds */}
          {bonds.map((bond, i) => (
            <NeoBond 
              key={i} 
              x1={50 + points[bond.from].x} 
              y1={50 + points[bond.from].y} 
              x2={50 + points[bond.to].x} 
              y2={50 + points[bond.to].y} 
              type="single"
              color={bond.isPeptide ? "stroke-indigo-500" : "stroke-white/20"}
            />
          ))}
       </svg>
       
       {/* Points (AA residiues) */}
       {points.map((p, i) => (
         <div 
           key={i} 
           className="absolute transition-all duration-1000 ease-out transform"
           style={{ 
             left: `calc(50% + ${p.x}%)`, 
             top: `calc(50% + ${p.y}%)`,
             transform: 'translate(-50%, -50%)'
           }}
         >
            <NeoSphere color={p.color} size={24} label={p.label} />
         </div>
       ))}
    </div>
  );
};

// --- Logic Helpers ---

const generateFoldedStructure = (sequence) => {
  const points = [];
  const bonds = [];
  
  // Start in center
  let curX = 0;
  let curY = 0;
  
  // Angle for random folding walk
  let curAngle = Math.random() * Math.PI * 2;

  sequence.forEach((aa, i) => {
    const info = getUniversalItemInfo(aa.type);
    
    // Hydrophobicity simulation (simplified)
    // Some AA pull towards center, some push away
    const isHydrophobic = ['leucine', 'valine', 'phenylalanine'].includes(aa.type);
    const radius = isHydrophobic ? 10 + Math.random() * 10 : 20 + Math.random() * 15;
    
    // Randomish walk with bias
    curAngle += (Math.random() - 0.5) * 2;
    
    const x = Math.cos(curAngle) * radius + (i > 0 ? points[i-1].x : 0);
    const y = Math.sin(curAngle) * radius + (i > 0 ? points[i-1].y : 0);

    points.push({
      x, y,
      color: info.color,
      label: info.name.slice(0,1).toUpperCase()
    });

    if (i > 0) {
      bonds.push({ from: i-1, to: i, isPeptide: true });
    }
  });

  // Center the structure
  const avgX = points.reduce((acc, p) => acc + p.x, 0) / points.length;
  const avgY = points.reduce((acc, p) => acc + p.y, 0) / points.length;
  
  points.forEach(p => {
    p.x -= avgX;
    p.y -= avgY;
    // Scale down to % range
    p.x *= 2; 
    p.y *= 2;
  });

  return { points, bonds };
};

export default ProteinFolder;