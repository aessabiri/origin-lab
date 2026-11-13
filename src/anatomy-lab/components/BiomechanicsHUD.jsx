import React from 'react';
import { useAnatomyStore } from '../store.js';
import { compileAnatomyToGenome } from '../utils/blueprintCompiler.js';
import { useCosmicClockStore } from '../../store/cosmicClockStore.js';
import { useInventory } from '../../store/inventory.js';
import { useStore } from '../../store.js';

const CAMERA_VIEWS = [
  { id: 'full', label: '🧍 Full Body', boneId: 'sternum' },
  { id: 'head', label: '🧠 Head & Brain', boneId: 'frontal_bone' },
  { id: 'thorax', label: '🫀 Heart & Chest', boneId: 'sternum' },
  { id: 'pelvis', label: '🦴 Pelvis & Spine', boneId: 'sacrum' },
  { id: 'lower', label: '🦵 Legs & Feet', boneId: 'tibia_r' },
];

const BiomechanicsHUD = () => {
  const assembledBones = useAnatomyStore(state => state.assembledBones);
  const postureParams = useAnatomyStore(state => state.postureParams);
  const meshLodRatio = useAnatomyStore(state => state.meshLodRatio) || 1.0;
  const setMeshLodRatio = useAnatomyStore(state => state.setMeshLodRatio);
  const setSelectedBoneId = useAnatomyStore(state => state.setSelectedBoneId);

  const compiledGenome = useCosmicClockStore(state => state.compiledGenome);
  const setCompiledGenome = useCosmicClockStore(state => state.setCompiledGenome);

  const handleCompileGenome = () => {
    const blueprint = compileAnatomyToGenome(assembledBones, postureParams, {});
    setCompiledGenome(blueprint);
    const inv = useInventory.getState();
    inv.addResource('compounds', 'dna', 5);
    inv.addResource('compounds', 'rna', 5);
    useStore.getState().showMessage(
      `🧬 Demiurge Blueprint Compiled: ${blueprint.morphotypeClass} (${blueprint.integrityScore}% Integrity | ${blueprint.codonSignature})`
    );
  };

  return (
    <div className="absolute top-4 left-6 z-20 pointer-events-none select-none font-mono flex flex-col gap-2">
      {/* Top Bar: Camera Focus Presets + Hardware Resolution + DNA Seed */}
      <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
        {/* Camera Quick-Focus Bar */}
        <div className="flex items-center gap-1 bg-[#070c18]/90 backdrop-blur-xl border border-cyan-500/25 rounded-2xl p-1 shadow-xl">
          {CAMERA_VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedBoneId(v.boneId)}
              className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-slate-300 hover:text-cyan-200 hover:bg-cyan-500/15 transition-all active:scale-95 cursor-pointer"
              title={`Focus Camera on ${v.label}`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* GPU Mesh Resolution Switcher (Ultra 100% / Balanced 65% / Low-Spec 35%) */}
        <div className="flex items-center gap-1 bg-[#070c18]/90 backdrop-blur-xl border border-emerald-500/25 rounded-2xl p-1 shadow-xl">
          {[
            { label: 'HD 100%', val: 1.0, title: 'Full Clinical CT Resolution (100% Vertices)' },
            { label: 'Med 65%', val: 0.65, title: 'Balanced Mid-Range Hardware (65% Vertices)' },
            { label: 'Eco 35%', val: 0.35, title: 'Low-Spec High-FPS Mode (35% Vertices)' },
          ].map((lod) => (
            <button
              key={lod.val}
              onClick={() => setMeshLodRatio(lod.val)}
              title={lod.title}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 cursor-pointer ${
                Math.abs(meshLodRatio - lod.val) < 0.05
                  ? 'bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lod.label}
            </button>
          ))}
        </div>

        {/* Compile Genome Seed Button */}
        <button
          onClick={handleCompileGenome}
          className="px-3.5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider border bg-gradient-to-r from-emerald-500/25 to-teal-500/25 border-emerald-400/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:from-emerald-500/40 hover:to-teal-500/40 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          title="Compile Assembled Human into a Genomic Seed"
        >
          <span>🧬</span>
          <span>Compile DNA Seed</span>
        </button>
      </div>

      {compiledGenome && (
        <div className="pointer-events-auto w-fit bg-[#061216]/90 backdrop-blur-xl border border-emerald-500/35 rounded-xl px-3 py-1.5 flex items-center gap-3 text-[9px] shadow-lg">
          <span className="text-emerald-300 font-bold uppercase">{compiledGenome.morphotypeClass}</span>
          <span className="text-slate-400">
            Codon: <span className="text-cyan-300">{compiledGenome.codonSignature}</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold">
            {compiledGenome.integrityScore}%
          </span>
        </div>
      )}
    </div>
  );
};

export default React.memo(BiomechanicsHUD);
