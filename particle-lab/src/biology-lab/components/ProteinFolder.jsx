import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshTransmissionMaterial, PresentationControls, ContactShadows, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useBioStore } from '../store';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';
import { getUniversalCodexData, getUniversalItemInfo } from '../../utils/codexData';
import { PARTICLE_TYPES } from '../../constants/particles';
import { POLYPEPTIDE_RECIPES } from '../../constants/polypeptideRecipes';
import { BakelitePanel, NixieTube, Oscilloscope, AnalogGauge } from '../../components/VisualPrimitives';
import ParticleIcon from '../../particle-lab/components/ParticleIcon';

const ProteinFolder = () => {
  const { synthesizedProteins, addSynthesizedProtein } = useBioStore();
  const { discoveredItems, compounds, consumeResource, addResource } = useInventory();
  const { isSandboxMode } = useStore();
  
  const [sequence, setSequence] = useState([]);
  const [isFolding, setIsFolding] = useState(false);
  const [foldedStructure, setFoldedStructure] = useState(null);
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'history'
  const [statusMessage, setStatusMessage] = useState('');
  
  // 1. Get and Categorize Available Amino Acids
  const categorizedAA = useMemo(() => {
    const codex = getUniversalCodexData();
    const bioGroup = codex.find(g => g.name === 'Biochemistry');
    const aaSub = bioGroup?.subcategories.find(s => s.name === 'Amino Acids');
    
    if (!aaSub) return {};
    
    const available = aaSub.particles.filter(type => isSandboxMode || discoveredItems.includes(type));
    
    const groups = {
      'Hydrophobic': ['glycine', 'alanine', 'valine', 'leucine', 'isoleucine', 'proline', 'methionine', 'phenylalanine', 'tyrosine', 'tryptophan'],
      'Polar': ['serine', 'threonine', 'cysteine', 'asparagine', 'glutamine'],
      'Basic (+)': ['lysine', 'arginine', 'histidine'],
      'Acidic (-)': ['aspartic-acid', 'glutamic-acid']
    };

    const result = {};
    Object.entries(groups).forEach(([name, members]) => {
      const found = available.filter(type => members.includes(type));
      if (found.length > 0) result[name] = found;
    });
    
    return result;
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
    if (sequence.length < 2) {
        setStatusMessage('Error: Sequence too short.');
        return;
    }

    // 1. Calculate Required Resources
    const required = {};
    sequence.forEach(node => {
        required[node.type] = (required[node.type] || 0) + 1;
    });

    // 2. Check Inventory (skip in sandbox)
    if (!isSandboxMode) {
        for (const [type, count] of Object.entries(required)) {
            if ((compounds[type] || 0) < count) {
                setStatusMessage(`Error: Insufficient ${PARTICLE_TYPES[type] || type}`);
                return;
            }
        }
    }

    // 3. Consume Resources
    if (!isSandboxMode) {
        for (const [type, count] of Object.entries(required)) {
            consumeResource('compounds', type, count);
        }
    }

    setIsFolding(true);
    setStatusMessage('Folding sequence...');
    
    setTimeout(() => {
      const structure = generateFoldedStructure(sequence);
      setFoldedStructure(structure);
      setIsFolding(false);
      
      // 4. Validate against Recipes
      const seqTypes = sequence.map(s => s.type);
      const match = POLYPEPTIDE_RECIPES.find(recipe => {
          // Check if recipes have a defined sequence order
          if (recipe.sequence) {
              if (recipe.sequence.length !== seqTypes.length) return false;
              return recipe.sequence.every((t, i) => t === seqTypes[i]);
          }
          // Fallback to composition check (unordered) if sequence not defined
          const recipeCounts = recipe.molecules;
          const seqCounts = {};
          seqTypes.forEach(t => seqCounts[t] = (seqCounts[t] || 0) + 1);
          
          if (Object.keys(recipeCounts).length !== Object.keys(seqCounts).length) return false;
          return Object.entries(recipeCounts).every(([t, c]) => seqCounts[t] === c);
      });

      const proteinName = match ? match.name : `Custom Peptide (${sequence.length}aa)`;
      
      // 5. Reward
      if (match) {
          addResource('compounds', match.type, 1);
          setStatusMessage(`Success: Synthesized ${match.name}`);
      } else {
          setStatusMessage('Folded custom structure. (No recipe match)');
      }

      addSynthesizedProtein({
          id: `PROT-${Date.now()}`,
          name: proteinName,
          sequence: seqTypes,
          structure
      });

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
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">Amino Acid Library</h4>
                      <div className="space-y-6">
                        {Object.entries(categorizedAA).map(([groupName, types]) => (
                          <div key={groupName} className="space-y-2">
                             <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{groupName}</span>
                                <div className="flex-1 h-px bg-zinc-900"></div>
                             </div>
                             <div className="space-y-1">
                                {types.map(type => (
                                  <AAButton key={type} type={type} onAdd={() => handleAddAA(type)} />
                                ))}
                             </div>
                          </div>
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
                <div className="w-full h-full">
                   <ProteinVisualizer3D structure={foldedStructure} />
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
    'isoleucine': { property: 'Hydrophobic', effect: '+Rigidity' },
    'threonine': { property: 'Polar', effect: '+Bonding' },
    'methionine': { property: 'Start Code', effect: '+Synthesis' },
    'arginine': { property: 'Basic', effect: '+Charge' },
    'asparagine': { property: 'Polar', effect: '+Complexity' },
    'aspartic-acid': { property: 'Acidic', effect: '-pH Stability' },
    'glutamic-acid': { property: 'Acidic', effect: '+Excitation' },
    'glutamine': { property: 'Polar', effect: '+Metabolism' },
    'proline': { property: 'Helix Breaker', effect: '+Unique Fold' },
    'tyrosine': { property: 'Aromatic', effect: '+Signaling' },
    'lysine': { property: 'Basic', effect: '+Folding' },
    'histidine': { property: 'pH Buffer', effect: '+Catalysis' },
    'tryptophan': { property: 'Bulky', effect: '+Size' },
    'cysteine': { property: 'Disulfide', effect: '++Stability' },
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

// --- 3D Components for Protein Visualizer ---

const atomGeometry = new THREE.SphereGeometry(1, 32, 32);
const bondGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1, 16);

const Residue = ({ position, color, label, size = 1.2 }) => {
  return (
    <group position={position}>
      <mesh geometry={atomGeometry} scale={[size, size, size]} castShadow>
        <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={0.05}
            transmission={0.9}
            roughness={0.2}
            color={color}
            ior={1.1}
            metalness={0.1}
        />
      </mesh>
      {/* Glow Core */}
      <mesh geometry={atomGeometry} scale={[size * 0.4, size * 0.4, size * 0.4]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} />
      </mesh>
    </group>
  );
};

const PeptideBond = ({ start, end, color = "#4f46e5" }) => {
  const midPoint = useMemo(() => new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5), [start, end]);
  const distance = useMemo(() => start.distanceTo(end), [start, end]);
  const direction = useMemo(() => new THREE.Vector3().subVectors(end, start).normalize(), [start, end]);
  
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    q.setFromUnitVectors(up, direction);
    return q;
  }, [direction]);

  return (
    <mesh position={midPoint} quaternion={quaternion} geometry={bondGeometry} scale={[1, distance, 1]}>
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={2} 
        toneMapped={false} 
        transparent 
        opacity={0.4} 
      />
    </mesh>
  );
};

const ProteinModel = ({ structure }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const points = useMemo(() => structure.points.map(p => new THREE.Vector3(p.x, p.y, p.z)), [structure]);

  return (
    <group ref={groupRef} scale={0.4}>
      {points.map((pos, i) => (
        <Residue 
          key={i} 
          position={pos} 
          color={structure.points[i].color} 
          label={structure.points[i].label} 
        />
      ))}
      {structure.bonds.map((bond, i) => (
        <PeptideBond 
          key={i} 
          start={points[bond.from]} 
          end={points[bond.to]} 
          color={structure.points[bond.from].color}
        />
      ))}
    </group>
  );
};

const ProteinVisualizer3D = ({ structure }) => {
  if (!structure) return null;

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: false }}>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
      
      <Suspense fallback={null}>
        <PresentationControls
          global
          config={{ mass: 1, tension: 200 }}
          snap={{ mass: 2, tension: 400 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <ProteinModel structure={structure} />
          </Float>
        </PresentationControls>

        <ContactShadows position={[0, -6, 0]} opacity={0.4} scale={20} blur={2} far={10} color="#000000" />
        <Environment preset="night" />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.3} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Suspense>

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" castShadow />
      <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  );
};

// --- Logic Helpers ---

export const generateFoldedStructure = (sequence) => {
  const isH = (type) => ['leucine', 'isoleucine', 'valine', 'phenylalanine', 'methionine'].includes(type);
  const isP = (type) => ['serine', 'threonine', 'cysteine', 'asparagine', 'glutamine', 'lysine', 'arginine', 'histidine', 'aspartic-acid', 'glutamic-acid'].includes(type);

  // Beam Search for 3D Lattice HP Model
  const beamWidth = 200;
  
  // Directions: x, -x, y, -y, z, -z
  const dirs = [
    [1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]
  ];

  let beam = [ { path: [[0,0,0]], energy: 0 } ]; 
  
  for (let i = 1; i < sequence.length; i++) {
    const nextBeam = [];
    const currentAA = sequence[i].type;
    const currentIsH = isH(currentAA);
    const currentIsP = isP(currentAA);
    
    for (const state of beam) {
      const lastPos = state.path[state.path.length - 1];
      
      for (const d of dirs) {
        const nx = lastPos[0] + d[0];
        const ny = lastPos[1] + d[1];
        const nz = lastPos[2] + d[2];
        
        // Check self-avoiding
        let collision = false;
        for (const p of state.path) {
          if (p[0] === nx && p[1] === ny && p[2] === nz) {
            collision = true;
            break;
          }
        }
        if (collision) continue;
        
        // Calculate energy for new position
        let dE = 0;
        
        let hNeighbors = 0;
        let pNeighbors = 0;
        let emptyNeighbors = 5; // one neighbor is the previous residue
        
        // Count neighbors among already placed residues
        for (let j = 0; j < state.path.length - 1; j++) { 
          const p = state.path[j];
          const dist = Math.abs(p[0]-nx) + Math.abs(p[1]-ny) + Math.abs(p[2]-nz);
          if (dist === 1) {
             emptyNeighbors--;
             const otherAA = sequence[j].type;
             if (isH(otherAA)) hNeighbors++;
             if (isP(otherAA)) pNeighbors++;
          }
        }
        
        if (currentIsH) {
           dE -= hNeighbors * 2.0; // H-H contacts minimize energy
           dE += emptyNeighbors * 0.5; // H hates solvent
        } else if (currentIsP) {
           dE -= pNeighbors * 0.5; // P-P H-bonds
           dE -= emptyNeighbors * 0.5; // P likes solvent
        }
        
        nextBeam.push({
          path: [...state.path, [nx, ny, nz]],
          energy: state.energy + dE
        });
      }
    }
    
    nextBeam.sort((a, b) => a.energy - b.energy);
    beam = nextBeam.slice(0, beamWidth);
    
    if (beam.length === 0) {
      break; 
    }
  }

  const bestPath = beam[0] ? beam[0].path : [[0,0,0]];

  const points = [];
  const bonds = [];
  
  bestPath.forEach((pos, i) => {
    const aa = sequence[i];
    const info = getUniversalItemInfo(aa.type) || { color: '#ffffff', name: aa.type };
    // scale lattice
    const scale = 5;
    points.push({
      x: pos[0] * scale,
      y: pos[1] * scale,
      z: pos[2] * scale,
      color: info.color,
      label: info.name.slice(0,1).toUpperCase()
    });
    if (i > 0) {
      bonds.push({ from: i-1, to: i, isPeptide: true });
    }
  });

  if (points.length > 0) {
    const avgX = points.reduce((acc, p) => acc + p.x, 0) / points.length;
    const avgY = points.reduce((acc, p) => acc + p.y, 0) / points.length;
    const avgZ = points.reduce((acc, p) => acc + p.z, 0) / points.length;
    
    points.forEach(p => {
      p.x -= avgX;
      p.y -= avgY;
      p.z -= avgZ;
    });
  }

  return { points, bonds };
};

export default ProteinFolder;