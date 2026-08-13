import React, { useState, useMemo, useRef, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshTransmissionMaterial, PresentationControls, ContactShadows, Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useBioStore } from '../store';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';
import { getUniversalCodexData, getUniversalItemInfo } from '../../utils/codexData';
import { PARTICLE_TYPES } from '../../constants/particles';
import { POLYPEPTIDE_RECIPES } from '../../constants/polypeptideRecipes';
import ParticleIcon from '../../particle-lab/components/ParticleIcon';
import { 
  GENETIC_CODE, 
  transcribeDNA, 
  translateMRNA, 
  PRESET_GENOMES 
} from '../utils/geneticCode.js';
import { 
  analyzeProteinBiophysics, 
  generateFolded3DModel 
} from '../utils/biophysicsFolding.js';

// --- 3D Protein Model Geometry Components ---

const atomGeometry = new THREE.SphereGeometry(1, 32, 32);
const bondGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1, 16);
const disulfideGeometry = new THREE.CylinderGeometry(0.18, 0.18, 1, 16);

const ResidueMesh = React.memo(({ position, color, label, symbol, chargeType, renderMode, size = 1.25 }) => {
  const displayColor = useMemo(() => {
    if (renderMode === 'charge') {
      if (chargeType === 'pos') return '#3b82f6';
      if (chargeType === 'neg') return '#ef4444';
      return '#64748b';
    }
    return color || '#38bdf8';
  }, [renderMode, chargeType, color]);

  return (
    <group position={position}>
      <mesh geometry={atomGeometry} scale={[size, size, size]}>
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={0.6}
          chromaticAberration={0.06}
          transmission={0.85}
          roughness={0.15}
          color={displayColor}
          ior={1.15}
          metalness={0.1}
        />
      </mesh>
      
      {/* Internal Luminous Quantum Core */}
      <mesh geometry={atomGeometry} scale={[size * 0.42, size * 0.42, size * 0.42]}>
        <meshStandardMaterial 
          color={displayColor} 
          emissive={displayColor} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
    </group>
  );
});

const PeptideCovalentBond = React.memo(({ start, end, color = "#6366f1" }) => {
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
        emissiveIntensity={2.5} 
        toneMapped={false} 
        transparent 
        opacity={0.6} 
      />
    </mesh>
  );
});

const DisulfideBridge3D = React.memo(({ start, end }) => {
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
    <mesh position={midPoint} quaternion={quaternion} geometry={disulfideGeometry} scale={[1, distance, 1]}>
      <meshStandardMaterial 
        color="#fbbf24" 
        emissive="#f59e0b" 
        emissiveIntensity={5} 
        toneMapped={false} 
      />
    </mesh>
  );
});

const ContinuousRibbonTube = ({ curve }) => {
  const tubeGeometry = useMemo(() => {
    if (!curve) return null;
    return new THREE.TubeGeometry(curve, 64, 0.45, 12, false);
  }, [curve]);

  if (!tubeGeometry) return null;

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial 
        color="#38bdf8" 
        emissive="#0284c7" 
        emissiveIntensity={1.2} 
        roughness={0.2} 
        metalness={0.8} 
        transparent 
        opacity={0.7} 
      />
    </mesh>
  );
};

const Protein3DScene = ({ structure, renderMode }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.08;
    }
  });

  const points = useMemo(() => structure.points.map(p => new THREE.Vector3(p.x, p.y, p.z)), [structure]);

  return (
    <group ref={groupRef} scale={0.42}>
      {/* Continuous Backbone Ribbon */}
      {renderMode !== 'spheres_only' && structure.splineCurve && (
        <ContinuousRibbonTube curve={structure.splineCurve} />
      )}

      {/* Residue Spheres */}
      {points.map((pos, i) => (
        <ResidueMesh 
          key={i} 
          position={pos} 
          color={structure.points[i].color} 
          label={structure.points[i].label}
          symbol={structure.points[i].symbol}
          chargeType={structure.points[i].chargeType}
          renderMode={renderMode}
        />
      ))}

      {/* Peptide Bonds */}
      {structure.bonds.map((bond, i) => (
        <PeptideCovalentBond 
          key={`bond-${i}`} 
          start={points[bond.from]} 
          end={points[bond.to]} 
          color={structure.points[bond.from].color}
        />
      ))}

      {/* Disulfide Bridges */}
      {structure.disulfideLinks?.map((bridge, i) => (
        <DisulfideBridge3D
          key={`ss-${i}`}
          start={points[bridge.from]}
          end={points[bridge.to]}
        />
      ))}
    </group>
  );
};

// --- Main Studio Component ---

const ProteinFolder = () => {
  const { synthesizedProteins, addSynthesizedProtein } = useBioStore();
  const { discoveredItems, compounds, consumeResource, addResource } = useInventory();
  const { isSandboxMode } = useStore();
  
  // Sequencing Studio State
  const [studioMode, setStudioMode] = useState('dna'); // 'dna' (Genetic Codon) or 'residues' (Direct AA)
  const [dnaInput, setDnaInput] = useState('TACGGCTGCACCAGCATCTGCAGCCTGTACCAGCTGGAGAACTACTGCAACTAG');
  const [directSequence, setDirectSequence] = useState([]);
  
  // Visual & Folding State
  const [renderMode, setRenderMode] = useState('ribbon'); // 'ribbon', 'charge', 'spheres_only'
  const [isFolding, setIsFolding] = useState(false);
  const [foldedStructure, setFoldedStructure] = useState(null);
  const [activeTab, setActiveTab] = useState('library'); // 'library', 'history', 'presets'
  const [statusMessage, setStatusMessage] = useState('');

  // 1. Transcribe and Translate DNA
  const translationResult = useMemo(() => {
    const mrna = transcribeDNA(dnaInput);
    const translation = translateMRNA(mrna);
    return {
      mrna,
      ...translation
    };
  }, [dnaInput]);

  // Current active amino acid sequence based on mode
  const activeSequence = useMemo(() => {
    if (studioMode === 'dna') {
      return translationResult.residues;
    }
    return directSequence;
  }, [studioMode, translationResult.residues, directSequence]);

  // Real-time biophysical telemetry computation
  const liveBiophysics = useMemo(() => {
    return analyzeProteinBiophysics(activeSequence);
  }, [activeSequence]);

  // Auto-generate fold on sequence changes if active
  useEffect(() => {
    if (activeSequence.length >= 2) {
      const model = generateFolded3DModel(activeSequence);
      setFoldedStructure(model);
    } else {
      setFoldedStructure(null);
    }
  }, [activeSequence]);

  // Categorized Amino Acids for Manual Palettes
  const categorizedAA = useMemo(() => {
    const codex = getUniversalCodexData();
    const bioGroup = codex.find(g => g.name === 'Biochemistry');
    const aaSub = bioGroup?.subcategories.find(s => s.name === 'Amino Acids');
    
    if (!aaSub) return {};
    const available = aaSub.particles.filter(type => isSandboxMode || discoveredItems.includes(type));
    
    const groups = {
      'Hydrophobic (Nonpolar)': ['glycine', 'alanine', 'valine', 'leucine', 'isoleucine', 'proline', 'methionine', 'phenylalanine', 'tryptophan'],
      'Polar (Uncharged)': ['serine', 'threonine', 'cysteine', 'asparagine', 'glutamine', 'tyrosine'],
      'Basic (+ Charged)': ['lysine', 'arginine', 'histidine'],
      'Acidic (- Charged)': ['aspartic-acid', 'glutamic-acid']
    };

    const result = {};
    Object.entries(groups).forEach(([name, members]) => {
      const found = available.filter(type => members.includes(type));
      if (found.length > 0) result[name] = found;
    });
    
    return result;
  }, [discoveredItems, isSandboxMode]);

  // Nucleotide insertion helpers for DNA mode
  const handleAddNucleotide = useCallback((base) => {
    if (dnaInput.length >= 72) return;
    setDnaInput(prev => prev + base);
  }, [dnaInput]);

  const handleBackspaceDNA = useCallback(() => {
    setDnaInput(prev => prev.slice(0, -1));
  }, []);

  const handleMutateRandomBase = useCallback(() => {
    if (dnaInput.length === 0) return;
    const bases = ['A', 'T', 'C', 'G'];
    const idx = Math.floor(Math.random() * dnaInput.length);
    const newBase = bases[Math.floor(Math.random() * bases.length)];
    const arr = dnaInput.split('');
    arr[idx] = newBase;
    setDnaInput(arr.join(''));
    setStatusMessage(`⚡ Cosmic radiation mutated base at locus #${idx + 1} to ${newBase}!`);
  }, [dnaInput]);

  // Manual Amino Acid Palette handlers
  const handleAddDirectAA = (type) => {
    if (directSequence.length >= 20) return;
    setDirectSequence([...directSequence, { type, id: Date.now() + Math.random() }]);
  };

  const handleRemoveDirectAA = (index) => {
    const newSeq = [...directSequence];
    newSeq.splice(index, 1);
    setDirectSequence(newSeq);
  };

  const handleLoadPreset = (preset) => {
    setStudioMode('dna');
    setDnaInput(preset.dna);
    setStatusMessage(`Loaded genetic template: ${preset.name}`);
  };

  // Finalize & Synthesize to Inventory
  const handleSynthesize = () => {
    if (activeSequence.length < 2) {
      setStatusMessage('Error: Sequence requires at least 2 amino acids.');
      return;
    }

    const seqTypes = activeSequence.map(s => s.type);
    
    // Resource check
    const required = {};
    seqTypes.forEach(t => {
      required[t] = (required[t] || 0) + 1;
    });

    if (!isSandboxMode) {
      for (const [type, count] of Object.entries(required)) {
        if ((compounds[type] || 0) < count) {
          setStatusMessage(`Error: Insufficient ${type} in inventory.`);
          return;
        }
      }
      for (const [type, count] of Object.entries(required)) {
        consumeResource('compounds', type, count);
      }
    }

    setIsFolding(true);
    setStatusMessage('Initiating ribosome synthesis and chaperonin folding...');

    setTimeout(() => {
      setIsFolding(false);
      
      const match = POLYPEPTIDE_RECIPES.find(recipe => {
        if (recipe.sequence) {
          if (recipe.sequence.length !== seqTypes.length) return false;
          return recipe.sequence.every((t, i) => t === seqTypes[i]);
        }
        const recipeCounts = recipe.molecules || {};
        const seqCounts = {};
        seqTypes.forEach(t => seqCounts[t] = (seqCounts[t] || 0) + 1);
        if (Object.keys(recipeCounts).length !== Object.keys(seqCounts).length) return false;
        return Object.entries(recipeCounts).every(([t, c]) => seqCounts[t] === c);
      });

      const proteinName = match ? match.name : `Biopolymer-${Date.now().toString().slice(-4)} (${seqTypes.length}aa)`;
      
      if (match) {
        addResource('compounds', match.type, 1);
        setStatusMessage(`Synthesized ${match.name}! Registered to Biological Inventory.`);
      } else {
        setStatusMessage(`Folded custom ${proteinName}. Stability: ${liveBiophysics.stabilityScore}%`);
      }

      addSynthesizedProtein({
        id: `PROT-${Date.now()}`,
        name: proteinName,
        sequence: seqTypes,
        biophysics: liveBiophysics,
        structure: foldedStructure,
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-[#080c14] p-4 gap-4 text-white overflow-hidden select-none font-sans">
      
      {/* 1. LEFT SIDEBAR: Genetic Palette & Library */}
      <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0 bg-[#0c1220]/95 backdrop-blur-2xl rounded-3xl border border-cyan-500/20 shadow-2xl p-4 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#070a12] rounded-xl p-1 border border-cyan-500/20">
          {['library', 'presets', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Studio Input Mode Selector */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Input Source:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setStudioMode('dna')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      studioMode === 'dna' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    DNA / mRNA
                  </button>
                  <button
                    onClick={() => setStudioMode('residues')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      studioMode === 'residues' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Residues
                  </button>
                </div>
              </div>

              {/* DNA Nucleotide Clicker Palette */}
              {studioMode === 'dna' ? (
                <div className="space-y-3 p-3 rounded-2xl bg-gradient-to-b from-[#101726] to-[#0a0f1a] border border-cyan-500/20">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 font-bold uppercase">
                    <span>Nucleotide Base Palette</span>
                    <span>5' ➔ 3'</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { base: 'A', name: 'Adenine', color: 'bg-emerald-600/80 hover:bg-emerald-500 border-emerald-400/50' },
                      { base: 'T', name: 'Thymine', color: 'bg-rose-600/80 hover:bg-rose-500 border-rose-400/50' },
                      { base: 'C', name: 'Cytosine', color: 'bg-amber-600/80 hover:bg-amber-500 border-amber-400/50' },
                      { base: 'G', name: 'Guanine', color: 'bg-indigo-600/80 hover:bg-indigo-500 border-indigo-400/50' },
                    ].map(n => (
                      <button
                        key={n.base}
                        onClick={() => handleAddNucleotide(n.base)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-white font-mono font-black shadow-lg transition-all active:scale-95 ${n.color}`}
                      >
                        <span className="text-xl leading-none">{n.base}</span>
                        <span className="text-[7px] uppercase tracking-tighter opacity-80 mt-1">{n.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Edit Controls */}
                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={handleBackspaceDNA}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold font-mono transition-all"
                    >
                      ⌫ Delete Base
                    </button>
                    <button
                      onClick={handleMutateRandomBase}
                      className="flex-1 py-1.5 bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center justify-center gap-1"
                    >
                      <span>⚡</span>
                      <span>Mutate</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Amino Acid Palette */
                <div className="space-y-4">
                  {Object.entries(categorizedAA).map(([groupName, types]) => (
                    <div key={groupName} className="space-y-2">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        {groupName}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {types.map(type => {
                          const info = getUniversalItemInfo(type);
                          return (
                            <button
                              key={type}
                              onClick={() => handleAddDirectAA(type)}
                              className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all text-left group"
                            >
                              <div className="w-7 h-7 shrink-0">
                                <ParticleIcon type={type} color={info.color} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-300 group-hover:text-white truncate">
                                {info.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Canonical Genetic Templates
              </span>
              {PRESET_GENOMES.map(preset => (
                <div 
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="p-3 rounded-2xl bg-gradient-to-b from-[#121a2c] to-[#0a0f1c] border border-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold">
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    {preset.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Synthesized Proteins Registry
              </span>
              {synthesizedProteins.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono text-center py-8">No custom polymers synthesized yet.</p>
              ) : (
                synthesizedProteins.slice().reverse().map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{p.name}</span>
                      <span className="text-[9px] font-mono text-slate-500">{p.sequence.length} Amino Acids</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      {p.biophysics?.stabilityScore || 85}% Fold
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER & RIGHT: Studio Sequence Ribbon & 3D Biophysics Viewport */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        
        {/* Top: Interactive Genetic Code Ribbon (DNA ➔ mRNA ➔ Residues) */}
        <div className="p-4 rounded-3xl bg-[#0c1220]/95 backdrop-blur-2xl border border-cyan-500/20 shadow-xl flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="text-xs font-black uppercase tracking-widest text-cyan-300">
                Ribosomal Translation Bay (Open Reading Frame)
              </h3>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              Length: <strong className="text-cyan-300">{activeSequence.length}</strong> Residues
            </span>
          </div>

          {/* DNA / mRNA / Codon Visual Track */}
          {studioMode === 'dna' ? (
            <div className="space-y-2">
              {/* mRNA Codon Track */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {translationResult.codons.map((codon, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col items-center p-2 rounded-xl border min-w-[64px] transition-all ${
                      codon.entry?.type === 'STOP' 
                        ? 'bg-rose-950/70 border-rose-500/50 text-rose-300' 
                        : 'bg-[#10192a] border-cyan-500/30 text-cyan-200 shadow-md'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-black tracking-widest text-white">
                      {codon.triplet}
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase truncate mt-0.5">
                      {codon.entry?.symbol || '?'} ({codon.entry?.abbr || '???'})
                    </span>
                  </div>
                ))}

                {translationResult.remainder && (
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/40 border border-dashed border-slate-700 min-w-[50px] opacity-60">
                    <span className="text-[10px] font-mono text-slate-500">{translationResult.remainder}</span>
                    <span className="text-[7px] text-slate-600 uppercase">Frameshift</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Direct Residue Sequence Ribbon */
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {directSequence.map((aa, idx) => {
                const info = getUniversalItemInfo(aa.type);
                return (
                  <div 
                    key={aa.id} 
                    className="group relative flex flex-col items-center p-2 rounded-xl bg-[#10192a] border border-cyan-500/30 min-w-[56px] shadow-md"
                  >
                    <div className="w-7 h-7">
                      <ParticleIcon type={aa.type} color={info.color} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 mt-1 truncate max-w-[50px]">
                      {info.name}
                    </span>
                    <button
                      onClick={() => handleRemoveDirectAA(idx)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Center: 3D Protein Folding Viewport */}
        <div className="flex-1 relative rounded-3xl bg-[#060911] border border-cyan-500/25 shadow-[0_15px_60px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center">
          
          {/* Top Overlays */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c1220]/80 backdrop-blur-xl border border-cyan-500/30 text-xs font-mono text-cyan-200 shadow-lg">
              <span className={`w-2 h-2 rounded-full ${foldedStructure ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              <span>Conformation: <strong>{foldedStructure ? 'Tertiary Fold' : 'Linear Primary'}</strong></span>
            </div>

            {/* Render Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0c1220]/80 backdrop-blur-xl border border-cyan-500/30">
              <button
                onClick={() => setRenderMode('ribbon')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                  renderMode === 'ribbon' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ribbon
              </button>
              <button
                onClick={() => setRenderMode('charge')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                  renderMode === 'charge' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Electrostatics
              </button>
              <button
                onClick={() => setRenderMode('spheres_only')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                  renderMode === 'spheres_only' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Residues
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-full">
            {foldedStructure ? (
              <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={38} />
                
                <Suspense fallback={null}>
                  <PresentationControls
                    global
                    config={{ mass: 1.2, tension: 220 }}
                    snap={{ mass: 2, tension: 400 }}
                    rotation={[0, 0, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI / 2, Math.PI / 2]}
                  >
                    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.6}>
                      <Protein3DScene structure={foldedStructure} renderMode={renderMode} />
                    </Float>
                  </PresentationControls>

                  <ContactShadows position={[0, -6, 0]} opacity={0.5} scale={18} blur={2.5} far={12} color="#000000" />
                  <Environment preset="night" />
                  
                  <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.8} radius={0.35} />
                    <Noise opacity={0.03} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                  </EffectComposer>
                </Suspense>

                <ambientLight intensity={0.5} />
                <pointLight position={[12, 12, 12]} intensity={2.5} color="#ffffff" castShadow />
                <pointLight position={[-12, -12, -12]} intensity={1.5} color="#38bdf8" />
                <Stars radius={120} depth={60} count={600} factor={4} saturation={0} fade speed={1.2} />
              </Canvas>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3">
                <span className="text-5xl opacity-40">🧬</span>
                <span className="text-xs font-mono uppercase tracking-widest">Input at least 2 amino acids to fold</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Live Biophysical Telemetry Dashboard & Synthesis Action */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
          
          <div className="p-3.5 rounded-2xl bg-[#0c1220]/90 border border-cyan-500/20 shadow-lg flex flex-col justify-between">
            <span className="text-[9px] font-mono text-cyan-400 uppercase font-black">Free Energy (ΔG)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-black text-white">{liveBiophysics.freeEnergy}</span>
              <span className="text-[9px] text-slate-500">kcal/mol</span>
            </div>
            <span className="text-[8px] font-mono text-slate-500">Hydrophobic Collapse</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c1220]/90 border border-emerald-500/20 shadow-lg flex flex-col justify-between">
            <span className="text-[9px] font-mono text-emerald-400 uppercase font-black">Folding Stability</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-black text-emerald-300">{liveBiophysics.stabilityScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${liveBiophysics.stabilityScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c1220]/90 border border-amber-500/20 shadow-lg flex flex-col justify-between">
            <span className="text-[9px] font-mono text-amber-400 uppercase font-black">Disulfide Bridges</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-black text-amber-300">{liveBiophysics.disulfideBonds}</span>
              <span className="text-[9px] text-slate-500">S-S links</span>
            </div>
            <span className="text-[8px] font-mono text-slate-500">Covalent Stabilization</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0c1220]/90 border border-indigo-500/20 shadow-lg flex flex-col justify-between">
            <span className="text-[9px] font-mono text-indigo-400 uppercase font-black">Secondary Structure</span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
              <span className="text-cyan-300">{liveBiophysics.secondaryFractions.helix}% α</span>
              <span className="text-indigo-300">{liveBiophysics.secondaryFractions.sheet}% β</span>
              <span className="text-slate-400">{liveBiophysics.secondaryFractions.loop}% loop</span>
            </div>
            <span className="text-[8px] font-mono text-slate-500">Chou-Fasman Estimate</span>
          </div>

          {/* Synthesize Action Button */}
          <button
            onClick={handleSynthesize}
            disabled={activeSequence.length < 2 || isFolding}
            className={`col-span-2 lg:col-span-1 p-3.5 rounded-2xl border shadow-xl flex flex-col items-center justify-center gap-1 uppercase font-black tracking-widest transition-all ${
              activeSequence.length < 2 || isFolding
                ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95'
            }`}
          >
            <span className="text-lg leading-none">🧬</span>
            <span className="text-[11px]">Synthesize</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="px-4 py-2 rounded-xl bg-[#0c1424] border border-cyan-500/30 text-xs font-mono text-cyan-200 flex items-center gap-2 animate-fade-in shadow-lg">
            <span>💡</span>
            <span>{statusMessage}</span>
          </div>
        )}

      </div>

    </div>
  );
};

export { generateFolded3DModel as generateFoldedStructure };
export default React.memo(ProteinFolder);