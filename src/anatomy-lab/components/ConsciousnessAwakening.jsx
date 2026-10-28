import React, { useEffect, useState } from 'react';
import { useStore } from '../../store.js';
import { useProgressionStore } from '../../store/progressionStore.js';

const ConsciousnessAwakening = () => {
  const setCurrentView = useStore(state => state.setCurrentView);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Generate Procedural Heartbeat Audio Pulse
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playLubDub = (t) => {
        // Lub
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.frequency.setValueAtTime(65, t);
        osc1.frequency.exponentialRampToValueAtTime(35, t + 0.1);
        gain1.gain.setValueAtTime(0.4, t);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(t);
        osc1.stop(t + 0.13);

        // Dub
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.setValueAtTime(80, t + 0.18);
        osc2.frequency.exponentialRampToValueAtTime(45, t + 0.28);
        gain2.gain.setValueAtTime(0.3, t + 0.18);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t + 0.18);
        osc2.stop(t + 0.31);
      };

      const now = ctx.currentTime;
      playLubDub(now + 0.2);
      playLubDub(now + 1.1);
      playLubDub(now + 2.0);
    } catch (_) {}

    useProgressionStore.getState().completeMilestone('cosmic_ouroboros');
  }, []);

  if (dismissed) return null;

  return (
    <div className="absolute inset-0 z-50 bg-[#02050f]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-white text-center font-mono select-none animate-fadeIn">
      <div className="max-w-xl flex flex-col items-center gap-6">
        
        {/* Pulsing Luminous Iris */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-sky-400/50 shadow-[0_0_30px_#38bdf8]" />
          <span className="text-5xl animate-pulse">👁️</span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400 font-bold block mb-2">
            The Cosmic Ouroboros • Stage Complete
          </span>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300">
            Consciousness Awakens
          </h1>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-lg">
          “From a quantum fluctuation in the primordial singularity, through stellar fusion cores, across hydrothermal vents and 3.8 billion years of Darwinian selection... the cosmos has constructed a thinking, feeling observer.”
        </p>

        <div className="bg-[#070e20]/90 border border-cyan-500/30 rounded-2xl p-4 w-full text-left text-xs font-mono space-y-1.5 shadow-xl">
          <div className="flex justify-between text-slate-400">
            <span>Skeletal Integrity:</span>
            <span className="font-bold text-cyan-300">206 / 206 Bones</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Neocortical Synapse Density:</span>
            <span className="font-bold text-emerald-300">86 Billion Neurons (100%)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Encephalization Quotient (EQ):</span>
            <span className="font-bold text-amber-300">7.6 (Homo sapiens sapiens)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Status:</span>
            <span className="font-bold text-cyan-400 animate-pulse">Self-Aware Observer</span>
          </div>
        </div>

        <div className="flex gap-3 w-full pt-2">
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 py-3 px-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
          >
            Inspect Musculoskeletal Body
          </button>
          <button
            onClick={() => setCurrentView('universe')}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all active:scale-95"
          >
            Cosmic Universe 🌌
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessAwakening;
