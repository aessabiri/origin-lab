import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useBioStore } from '../store';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';
import { getUniversalCodexData, getUniversalItemInfo } from '../../utils/codexData';
import { PARTICLE_TYPES } from '../../constants/particles';
import { BakelitePanel, NixieTube, Oscilloscope, NeoSphere, NeoBond } from '../../components/VisualPrimitives';
import ParticleIcon from '../../particle-lab/components/ParticleIcon';

const ProteinFolder = () => {
  const { synthesizedProteins, addSynthesizedProtein } = useBioStore();
  const { discoveredItems } = useInventory();
  const { isSandboxMode } = useStore();
  
  const [sequence, setSequence] = useState([]);
  const [isFolding, setIsFolding] = useState(false);
  const [foldedStructure, setFoldedStructure] = useState(null);
  
  // 1. Get Available Amino Acids
  const aminoAcids = useMemo(() => {
    const codex = getUniversalCodexData();
    const bioGroup = codex.find(g => g.name === 'Biochemistry');
    const aaSub = bioGroup?.subcategories.find(s => s.name === 'Amino Acids');
    
    if (!aaSub) return [];
    
    return aaSub.particles.filter(type => isSandboxMode || discoveredItems.includes(type));
  }, [discoveredItems, isSandboxMode]);

  const handleAddAA = (type) => {
    if (sequence.length >= 12) return; // Limit for UI/perf
    setSequence([...sequence, { type, id: Date.now() + Math.random() }]);
    setFoldedStructure(null);
  };

  const handleRemoveAA = (index) => {
    const newSeq = [...sequence];
    newSeq.splice(index, 1);
    setSequence(newSeq);
    setFoldedStructure(null);
  };

  const handleStartFolding = () => {
    if (sequence.length < 3) return;
    setIsFolding(true);
    
    // Simple Folding Simulation: Generate a 2D path
    setTimeout(() => {
      const structure = generateFoldedStructure(sequence);
      setFoldedStructure(structure);
      setIsFolding(false);
      
      // Save to synthesized if it's long enough
      if (sequence.length >= 5) {
          addSynthesizedProtein({
              id: `PROT-${Date.now()}`,
              name: `Protein_${sequence.length}aa`,
              sequence: sequence.map(s => s.type),
              structure
          });
      }
    }, 2000);
  };

  return (
    <div className="flex h-full w-full bg-[#050505] p-6 gap-6 overflow-hidden">
      
      {/* LEFT: Amino Acid Dispenser */}
      <div className="w-72 flex flex-col gap-4 shrink-0">
        <BakelitePanel className="flex-1 flex flex-col p-4 border-4 border-black">
           <div className="mb-4 pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest italic">AA_DISPENSER</h3>
              <p className="text-[8px] text-zinc-600 font-mono uppercase tracking-tighter">Select primary building blocks</p>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {aminoAcids.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale">
                   <div className="text-4xl mb-2">🔭</div>
                   <p className="text-[10px] uppercase font-bold text-zinc-500">No Amino Acids Discovered</p>
                </div>
              ) : (
                aminoAcids.map(type => (
                  <AAButton key={type} type={type} onAdd={() => handleAddAA(type)} />
                ))
              )}
           </div>

           <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[8px] font-black text-zinc-600">CAPACITY</span>
              <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-green-900 shadow-[0_0_5px_#166534]' : 'bg-black'}`}></div>
                 ))}
              </div>
           </div>
        </BakelitePanel>
      </div>

      {/* CENTER: Work Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Sequence Bay (The Belt) */}
        <BakelitePanel className="h-24 p-2 border-4 border-black relative flex items-center overflow-x-auto overflow-y-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
           <div className="absolute top-1 left-4 text-[8px] font-black text-zinc-700 tracking-[0.2em] pointer-events-none">PRIMARY_SEQUENCE_BAY</div>
           
           <div className="flex gap-2 px-4 items-center min-w-full">
              {sequence.length === 0 && (
                <p className="w-full text-center text-zinc-700 text-xs font-mono uppercase tracking-widest animate-pulse">Load Sequence to Begin</p>
              )}
              {sequence.map((aa, idx) => (
                <SequenceItem key={aa.id} type={aa.type} onRemove={() => handleRemoveAA(idx)} />
              ))}
           </div>
        </BakelitePanel>

        {/* Main Display (The Folding Chamber) */}
        <BakelitePanel className="flex-1 relative border-4 border-black bg-[#0a0a0a] shadow-[inset_0_0_100px_rgba(0,0,0,1)] overflow-hidden">
           {/* Grid Overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]"></div>
           
           {/* Status Readouts */}
           <div className="absolute top-6 left-6 z-10 space-y-1">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isFolding ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
                 <span className="text-[10px] font-mono text-zinc-500">{isFolding ? 'COMPUTING_FOLD_VECTORS' : 'CHAMBER_IDLE'}</span>
              </div>
              <p className="text-[8px] text-zinc-700 font-mono tracking-tighter">XY_COORDINATES: {foldedStructure ? 'VERIFIED' : 'PENDING'}</p>
           </div>

           {/* The Fold Visualizer */}
           <div className="absolute inset-0 flex items-center justify-center">
              {isFolding ? (
                <div className="flex flex-col items-center gap-4">
                   <div className="w-32 h-32 relative">
                      <div className="absolute inset-0 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-4 border-t-transparent border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-xs font-black text-amber-500 animate-pulse">FOLDING</span>
                      </div>
                   </div>
                   <div className="w-64 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div className="h-full bg-amber-500 animate-[progress_2s_ease-in-out_infinite]"></div>
                   </div>
                </div>
              ) : foldedStructure ? (
                <ProteinVisualizer structure={foldedStructure} />
              ) : (
                <div className="opacity-10 scale-150 rotate-12">
                   <span className="text-[120px]">🧬</span>
                </div>
              )}
           </div>

           {/* Scanlines / CRT Effect */}
           <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] [background-size:100%_2px,3px_100%]"></div>
        </BakelitePanel>

        {/* Lower Controls */}
        <div className="h-24 flex gap-6 shrink-0">
           <BakelitePanel className="flex-1 border-4 border-black p-4 flex items-center justify-around">
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">STABILITY</span>
                 <Oscilloscope active={!!foldedStructure} color={foldedStructure ? 'emerald' : 'red'} />
              </div>
              <div className="w-px h-full bg-zinc-800"></div>
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">CHAIN_LEN</span>
                 <NixieTube value={sequence.length} digits={2} size="sm" />
              </div>
           </BakelitePanel>

           <button 
             onClick={handleStartFolding}
             disabled={sequence.length < 3 || isFolding}
             className={`w-48 rounded-xl border-4 border-black shadow-lg transition-all flex flex-col items-center justify-center gap-1 uppercase font-black tracking-widest group
               ${sequence.length < 3 || isFolding 
                 ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' 
                 : 'bg-gradient-to-b from-indigo-600 to-indigo-800 text-white hover:from-indigo-500 hover:to-indigo-700 active:scale-95'
               }`}
           >
              <span className="text-xl group-hover:scale-110 transition-transform">⚙️</span>
              <span className="text-sm">Initiate Fold</span>
           </button>

           <button 
             onClick={() => { setSequence([]); setFoldedStructure(null); }}
             className="w-20 bg-red-950/20 border-4 border-black rounded-xl text-red-900 hover:text-red-500 hover:bg-red-950/40 transition-colors flex items-center justify-center text-xl font-bold"
             title="Clear Sequence"
           >
             ✖
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const AAButton = ({ type, onAdd }) => {
  const info = getUniversalItemInfo(type);
  return (
    <button 
      onClick={onAdd}
      className="w-full flex items-center gap-3 p-2 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 group transition-all"
    >
      <div className="w-10 h-10 shrink-0">
        <ParticleIcon type={type} color={info.color} />
      </div>
      <div className="flex flex-col items-start overflow-hidden">
        <span className="text-[10px] font-black text-zinc-300 uppercase truncate w-full">{info.name}</span>
        <span className="text-[8px] text-zinc-600 font-mono">CODE: {type.toUpperCase().slice(0,3)}</span>
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