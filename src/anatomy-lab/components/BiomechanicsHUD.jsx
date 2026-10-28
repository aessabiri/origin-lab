import React, { useState } from 'react';
import { useAnatomyStore } from '../store.js';

const BiomechanicsHUD = () => {
  const [isOpen, setIsOpen] = useState(false);
  const postureParams = useAnatomyStore(state => state.postureParams);
  const setPostureParam = useAnatomyStore(state => state.setPostureParam);
  const kineticMode = useAnatomyStore(state => state.kineticMode);
  const setKineticMode = useAnatomyStore(state => state.setKineticMode);
  const overactiveMuscles = useAnatomyStore(state => state.overactiveMuscles);
  const underactiveMuscles = useAnatomyStore(state => state.underactiveMuscles);

  const radToDeg = (r) => Math.round((r || 0) * (180 / Math.PI));

  return (
    <div className="absolute top-4 left-6 z-20 pointer-events-none select-none font-mono">
      {/* HUD Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 bg-[#070c18]/90 hover:bg-[#0e172e] backdrop-blur-xl border border-cyan-500/30 rounded-2xl text-xs font-bold text-cyan-200 shadow-xl transition-all active:scale-95"
      >
        <span>🏃</span>
        <span>Kinetic Chain & Biomechanics</span>
        <span className="text-[10px] text-cyan-400 font-mono">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Expanded Biomechanical Console */}
      {isOpen && (
        <div className="pointer-events-auto mt-2 w-80 bg-[#070c18]/95 backdrop-blur-2xl border border-cyan-500/25 rounded-2xl p-4 shadow-2xl space-y-3.5 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
          <div className="border-b border-cyan-500/20 pb-2">
            <h3 className="text-xs font-black uppercase text-white tracking-wider">Kinetic Chain Controls</h3>
            <span className="text-[9px] text-slate-400">Closed-Chain Joint Coupling</span>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-1.5 p-1 bg-[#050914] rounded-xl border border-slate-800 text-[10px]">
            <button
              onClick={() => setKineticMode('foot_ascending')}
              className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                kineticMode === 'foot_ascending'
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Foot Ascending
            </button>
            <button
              onClick={() => setKineticMode('pelvis_rooted')}
              className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                kineticMode === 'pelvis_rooted'
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pelvis Rooted
            </button>
          </div>

          {/* Posture Sliders */}
          <div className="space-y-2.5 text-[10px]">
            {/* Right Foot Arch Pronation */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>R. Foot Arch Drop</span>
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
              <div className="flex justify-between text-slate-400 mb-1">
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
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Anterior Pelvic Tilt</span>
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

            {/* Thoracic Kyphosis */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
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
          </div>

          {/* Dynamic Muscle Strain Heatmap Tags */}
          <div className="border-t border-slate-800 pt-3">
            <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1.5">Myofascial Heatmap Readout:</span>
            {overactiveMuscles.length > 0 ? (
              <div className="space-y-1">
                <div className="text-[9px] text-rose-400 font-bold">Overactive / Hypertonic:</div>
                <div className="flex flex-wrap gap-1">
                  {overactiveMuscles.slice(0, 4).map((m) => (
                    <span key={m} className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[8px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-[9px] text-emerald-400">Biomechanically Neutral / Ideal Alignment</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(BiomechanicsHUD);
