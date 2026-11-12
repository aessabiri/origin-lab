import React, { useState } from 'react';
import { useAnatomyStore } from '../store.js';
import { POSTURE_CONDITIONS } from '../data/postureConditions.js';
import { compileAnatomyToGenome } from '../utils/blueprintCompiler.js';
import { useCosmicClockStore } from '../../store/cosmicClockStore.js';
import { useInventory } from '../../store/inventory.js';
import { useStore } from '../../store.js';

const GIZMO_JOINTS = [
  { id: null, label: 'Off' },
  { id: 'pelvis', label: 'Pelvis' },
  { id: 'right_foot', label: 'R. Foot' },
  { id: 'right_femur', label: 'R. Knee' },
  { id: 'lumbar', label: 'Lumbar' },
  { id: 'thoracic', label: 'Thoracic' },
  { id: 'cervical', label: 'Cervical' },
];

const BiomechanicsHUD = () => {
  const [isOpen, setIsOpen] = useState(false);
  const assembledBones = useAnatomyStore(state => state.assembledBones);
  const muscleStrainMap = useAnatomyStore(state => state.muscleStrainMap);
  const postureParams = useAnatomyStore(state => state.postureParams);
  const setPostureParam = useAnatomyStore(state => state.setPostureParam);
  const kineticMode = useAnatomyStore(state => state.kineticMode);
  const setKineticMode = useAnatomyStore(state => state.setKineticMode);
  const activePresetId = useAnatomyStore(state => state.activePresetId);
  const applyPosturePreset = useAnatomyStore(state => state.applyPosturePreset);
  const resetPosture = useAnatomyStore(state => state.resetPosture);
  const showVectors = useAnatomyStore(state => state.showVectors);
  const toggleVectors = useAnatomyStore(state => state.toggleVectors);
  const activeGizmoJoint = useAnatomyStore(state => state.activeGizmoJoint);
  const setActiveGizmoJoint = useAnatomyStore(state => state.setActiveGizmoJoint);
  const overactiveMuscles = useAnatomyStore(state => state.overactiveMuscles);
  const underactiveMuscles = useAnatomyStore(state => state.underactiveMuscles);
  const gravityMultiplier = useAnatomyStore(state => state.gravityMultiplier) || 1.0;
  const setGravityMultiplier = useAnatomyStore(state => state.setGravityMultiplier);

  const compiledGenome = useCosmicClockStore(state => state.compiledGenome);
  const setCompiledGenome = useCosmicClockStore(state => state.setCompiledGenome);

  const handleCompileGenome = () => {
    const blueprint = compileAnatomyToGenome(assembledBones, postureParams, muscleStrainMap);
    setCompiledGenome(blueprint);
    const inv = useInventory.getState();
    inv.addResource('compounds', 'dna', 5);
    inv.addResource('compounds', 'rna', 5);
    useStore.getState().showMessage(
      `🧬 Demiurge Blueprint Compiled: ${blueprint.morphotypeClass} (${blueprint.integrityScore}% Integrity | ${blueprint.codonSignature})`
    );
  };

  const radToDeg = (r) => Math.round((r || 0) * (180 / Math.PI));

  const formatMuscleItem = (m, idx) => {
    if (typeof m === 'string') {
      return { key: `${m}-${idx}`, name: m, strain: null };
    }
    return {
      key: m.id || m.name || idx,
      name: m.name || m.id || 'Muscle Group',
      strain: typeof m.strainPercent === 'number' ? `${m.strainPercent > 0 ? '+' : ''}${m.strainPercent}%` : null,
    };
  };

  return (
    <div className="absolute top-4 left-6 z-20 pointer-events-none select-none font-mono">
      {/* HUD Header Button */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-[#070c18]/90 hover:bg-[#0e172e] backdrop-blur-xl border border-cyan-500/30 rounded-2xl text-xs font-bold text-cyan-200 shadow-xl transition-all active:scale-95"
        >
          <span>🏃</span>
          <span>Kinetic Chain & Biomechanics</span>
          <span className="text-[10px] text-cyan-400 font-mono">{isOpen ? '▲' : '▼'}</span>
        </button>

        <button
          onClick={toggleVectors}
          className={`px-3 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider border backdrop-blur-xl transition-all active:scale-95 cursor-pointer ${
            showVectors
              ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              : 'bg-[#070c18]/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle 3D Force Vectors, Pelvic Laser & Kinetic Wavefront"
        >
          {showVectors ? '📐 Vectors: ON' : '📐 Vectors: OFF'}
        </button>

        <button
          onClick={handleCompileGenome}
          className="px-3.5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider border bg-gradient-to-r from-emerald-500/25 to-teal-500/25 border-emerald-400/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:from-emerald-500/40 hover:to-teal-500/40 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          title="Compile 206-Bone Skeleton & Biomechanics into a Genomic Seed for the Biology Lab"
        >
          <span>🧬</span>
          <span>Compile to DNA Seed</span>
        </button>
      </div>

      {compiledGenome && (
        <div className="pointer-events-auto mt-2 w-88 bg-[#061216]/90 backdrop-blur-xl border border-emerald-500/35 rounded-xl px-3 py-2 flex items-center justify-between text-[9px] shadow-lg">
          <div>
            <div className="text-emerald-300 font-bold uppercase">{compiledGenome.morphotypeClass}</div>
            <div className="text-slate-400">
              Codon: <span className="text-cyan-300">{compiledGenome.codonSignature}</span> · MET +{compiledGenome.metabolismBonus} · STB +{compiledGenome.stabilityBonus}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold">
            {compiledGenome.integrityScore}%
          </span>
        </div>
      )}

      {/* Expanded Biomechanical Console */}
      {isOpen && (
        <div className="pointer-events-auto mt-2 w-88 bg-[#070c18]/95 backdrop-blur-2xl border border-cyan-500/25 rounded-2xl p-4 shadow-2xl space-y-3.5 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <div>
              <h3 className="text-xs font-black uppercase text-white tracking-wider">Kinetic Chain Controls</h3>
              <span className="text-[9px] text-slate-400">Closed-Chain Joint Coupling & Myofascial Strain</span>
            </div>
            <button
              onClick={resetPosture}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[9px] font-bold text-slate-300 hover:text-white transition-all"
              title="Reset to Neutral Ideal Alignment"
            >
              ↺ Neutral
            </button>
          </div>

          {/* 0. Planetary Gravity Field Selector */}
          <div>
            <div className="flex items-center justify-between text-[9px] font-bold uppercase text-slate-400 mb-1.5">
              <span>Planetary Gravity Field:</span>
              <span className="text-cyan-300">{gravityMultiplier.toFixed(2)} g ({Math.round(70 * 9.81 * gravityMultiplier)} N Axial Load)</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[
                { label: '🌙 0.16g', val: 0.16, title: 'Luna (Moon)' },
                { label: '🔴 0.38g', val: 0.38, title: 'Mars' },
                { label: '🌍 1.00g', val: 1.0, title: 'Earth Standard' },
                { label: '🪐 1.60g', val: 1.6, title: 'Super-Earth Exoplanet' },
                { label: '⚡ 2.53g', val: 2.53, title: 'Jupiter Cloud Deck' }
              ].map((g) => (
                <button
                  key={g.val}
                  onClick={() => setGravityMultiplier && setGravityMultiplier(g.val)}
                  title={g.title}
                  className={`py-1 px-1 rounded-lg text-[8px] font-bold border transition-all cursor-pointer ${
                    Math.abs(gravityMultiplier - g.val) < 0.02
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                      : 'bg-[#050914] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1. Clinical Syndrome Presets */}
          <div>
            <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1.5">Postural Cascade Presets:</span>
            <select
              value={activePresetId || 'neutral'}
              onChange={(e) => applyPosturePreset(e.target.value)}
              className="w-full bg-[#050914] border border-cyan-500/30 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-cyan-200 focus:outline-none focus:border-cyan-400"
            >
              {Object.values(POSTURE_CONDITIONS).map((cond) => (
                <option key={cond.id} value={cond.id} className="bg-[#070c18] text-white">
                  {cond.name}
                </option>
              ))}
              {activePresetId === 'custom' && (
                <option value="custom" className="bg-[#070c18] text-amber-300">
                  ★ Custom Kinetic Articulation
                </option>
              )}
            </select>
          </div>

          {/* 2. On-Canvas 3D Rotation Gizmo Joint Selector */}
          <div>
            <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1.5">On-Canvas 3D Joint Gizmo:</span>
            <div className="flex flex-wrap gap-1">
              {GIZMO_JOINTS.map((j) => (
                <button
                  key={j.id || 'off'}
                  onClick={() => setActiveGizmoJoint(j.id)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${
                    activeGizmoJoint === j.id
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                      : 'bg-[#050914] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {j.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Mode Selector */}
          <div className="flex gap-1 p-1 bg-[#050914] rounded-xl border border-slate-800 text-[9px]">
            {[
              { id: 'foot_ascending', label: 'Foot Ascending' },
              { id: 'pelvis_rooted', label: 'Pelvis Rooted' },
              { id: 'manual', label: 'Manual' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setKineticMode(mode.id)}
                className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                  kineticMode === mode.id
                    ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* 4. Posture Sliders */}
          <div className="space-y-2 text-[10px]">
            {/* Right Foot Arch Pronation */}
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>R. Foot Arch Drop (Pronation)</span>
                <span className="font-bold text-cyan-300">{radToDeg(postureParams.rightFootPronation)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.52"
                step="0.01"
                value={postureParams.rightFootPronation || 0}
                onChange={(e) => setPostureParam('rightFootPronation', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Pelvic Obliquity / Dropped Hip */}
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Pelvic Drop (Obliquity)</span>
                <span className="font-bold text-cyan-300">{radToDeg(postureParams.pelvisDrop)}°</span>
              </div>
              <input
                type="range"
                min="-0.26"
                max="0.26"
                step="0.01"
                value={postureParams.pelvisDrop || 0}
                onChange={(e) => setPostureParam('pelvisDrop', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Anterior Pelvic Tilt */}
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Pelvic Tilt (Anterior / Posterior)</span>
                <span className="font-bold text-cyan-300">{radToDeg(postureParams.pelvisTilt)}°</span>
              </div>
              <input
                type="range"
                min="-0.44"
                max="0.35"
                step="0.01"
                value={postureParams.pelvisTilt || 0}
                onChange={(e) => setPostureParam('pelvisTilt', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Spinal Lateral Bend */}
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Spinal Lateral Curve (Scoliosis)</span>
                <span className="font-bold text-cyan-300">{radToDeg(postureParams.spinalLateralBend)}°</span>
              </div>
              <input
                type="range"
                min="-0.45"
                max="0.45"
                step="0.01"
                value={postureParams.spinalLateralBend || 0}
                onChange={(e) => setPostureParam('spinalLateralBend', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Thoracic Kyphosis */}
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Thoracic Kyphosis</span>
                <span className="font-bold text-cyan-300">{radToDeg(postureParams.thoracicKyphosis)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.78"
                step="0.01"
                value={postureParams.thoracicKyphosis || 0}
                onChange={(e) => setPostureParam('thoracicKyphosis', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Forward Head Posture */}
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Forward Head & Jaw Traction</span>
                <span className="font-bold text-cyan-300">{Math.round((postureParams.cervicalForwardHead || 0) * 100)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.45"
                step="0.01"
                value={postureParams.cervicalForwardHead || 0}
                onChange={(e) => setPostureParam('cervicalForwardHead', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* 5. Dynamic Muscle Strain Heatmap Tags */}
          <div className="border-t border-slate-800 pt-3 space-y-2">
            <span className="text-[9px] font-bold uppercase text-slate-400 block">Myofascial Heatmap Readout:</span>
            {overactiveMuscles.length === 0 && underactiveMuscles.length === 0 ? (
              <div className="text-[9px] text-emerald-400">Biomechanically Neutral / Ideal Alignment</div>
            ) : (
              <>
                {overactiveMuscles.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[9px] text-rose-400 font-bold">Overactive / Hypertonic (Shortened):</div>
                    <div className="flex flex-wrap gap-1">
                      {overactiveMuscles.slice(0, 5).map((raw, idx) => {
                        const item = formatMuscleItem(raw, idx);
                        return (
                          <span
                            key={item.key}
                            className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[8px]"
                          >
                            {item.name} {item.strain ? `(${item.strain})` : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {underactiveMuscles.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[9px] text-sky-400 font-bold">Underactive / Inhibited (Overstretched):</div>
                    <div className="flex flex-wrap gap-1">
                      {underactiveMuscles.slice(0, 5).map((raw, idx) => {
                        const item = formatMuscleItem(raw, idx);
                        return (
                          <span
                            key={item.key}
                            className="px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[8px]"
                          >
                            {item.name} {item.strain ? `(${item.strain})` : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(BiomechanicsHUD);
