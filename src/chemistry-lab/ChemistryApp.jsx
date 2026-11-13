import React, { useState, useEffect } from 'react';
import { Atom, ChevronDown, ChevronUp } from 'lucide-react';
import ChemistrySidebar from './components/ChemistrySidebar';
import Workstation from './components/Workstation';
import MoleculeViewer3D from './components/MoleculeViewer3D';
import { useSimulation } from './hooks/useSimulation';
import { useChemistryStore } from './store';
import { useStore } from '../store';
import TimeControls from './components/TimeControls';
import ChemicalInfoModal from './components/ChemicalInfoModal';
import { audioSystem } from './logic/audio';

const ChemistryApp = () => {
  useSimulation();
  const message = useChemistryStore((state) => state.message);
  const setMessage = useChemistryStore((state) => state.setMessage);
  const vessels = useChemistryStore((state) => state.vessels);
  const temperature = useChemistryStore((state) => state.temperature || 20);
  const radiation = useChemistryStore((state) => state.radiation || 0);
  const activeBioOrder = useChemistryStore((state) => state.activeBioOrder);
  const setActiveBioOrder = useChemistryStore((state) => state.setActiveBioOrder);
  const autoSynthesizeBioOrder = useChemistryStore((state) => state.autoSynthesizeBioOrder);

  // Layout State (Step 4: Keep 3D VSEPR collapsed by default so the reaction bench is clean)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showVsepr3D, setShowVsepr3D] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      audioSystem.init();
      audioSystem.resume();
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3500);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  const activeVesselsCount = Object.keys(vessels || {}).length;

  return (
    <div className="flex w-full h-full bg-[#030508] text-white font-sans overflow-hidden relative select-none">
      {/* 1. LEFT SIDEBAR: Pantry, Apparatus & Biochemical Recipes */}
      <aside
        aria-label="Chemistry equipment and storage"
        className={`relative z-20 h-full bg-[#060a14]/95 backdrop-blur-2xl border-r border-white/[0.08] shadow-2xl transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
          isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
        }`}
      >
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <ChemistrySidebar />
          </div>
        </div>
      </aside>

      {/* Toggle Button for Sidebar */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-expanded={isSidebarOpen}
        aria-label={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        className={`absolute z-30 top-1/2 -translate-y-1/2 bg-[#0c1424]/90 hover:bg-[#131f38] border border-emerald-500/40 text-emerald-400 p-2 rounded-r-xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isSidebarOpen ? 'left-80' : 'left-0'
        }`}
      >
        <span className="text-xs font-mono font-black">{isSidebarOpen ? '◀' : '▶'}</span>
      </button>

      {/* 2. MAIN WORKSTATION LAB BENCH */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden min-w-0 min-h-0">
        {/* Top Floating Laboratory HUD + Active Bio-Synthesis Contract Banner (Step 2) */}
        <div className="absolute top-4 left-6 right-6 z-20 flex items-start justify-between gap-4 pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto max-w-2xl">
            <div className="flex items-center gap-3 argon-panel px-4 py-2 rounded-2xl w-fit">
              <span className="text-xl">⚗️</span>
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                  Molecular Synthesis Deck
                </h2>
                <span className="text-[9px] font-mono text-slate-400">
                  Active Reaction Vessels:{' '}
                  <strong className="text-emerald-300">{activeVesselsCount}</strong>
                </span>
              </div>
            </div>

            {/* Step 2: Interactive Bio-Synthesis Order Queue Banner from Biology Lab */}
            {activeBioOrder && (
              <div className="bg-[#081220]/95 backdrop-blur-xl border border-emerald-400/50 rounded-2xl p-3 shadow-2xl space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block">
                      🧬 Active Bio-Assembly Line Order (Stage 1 Macromolecule)
                    </span>
                    <div className="text-xs font-black text-white">{activeBioOrder.title}</div>
                  </div>
                  <button
                    onClick={() => setActiveBioOrder(null)}
                    className="text-xs text-slate-400 hover:text-white px-1.5 cursor-pointer"
                    title="Dismiss Order"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-2 rounded-xl bg-[#050a14] border border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-300 font-bold">{activeBioOrder.equation}</span>
                  <span className="text-slate-400">
                    {activeBioOrder.vesselType || 'Vessel'} • {activeBioOrder.tempC}°C
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => autoSynthesizeBioOrder(activeBioOrder)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-[10px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    ⚡ Auto-Synthesize Bio-Order
                  </button>
                  <button
                    onClick={() => useStore.getState().setCurrentView('biology')}
                    className="py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400 text-cyan-200 font-mono text-[10px] font-bold uppercase cursor-pointer"
                  >
                    ✓ Return to Bio-Assembly Line →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: 3D VSEPR Molecular Hologram Drawer */}
          <div className="flex flex-col items-end gap-2 pointer-events-auto w-80 shrink-0">
            <button
              onClick={() => setShowVsepr3D((v) => !v)}
              className="px-3.5 py-1.5 rounded-xl bg-[#070b14]/90 hover:bg-[#0c1424] border border-teal-500/40 text-teal-300 shadow-xl transition-all text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Atom className="w-3.5 h-3.5 text-teal-400" />
              <span>3D VSEPR Hologram</span>
              {showVsepr3D ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {showVsepr3D && (
              <MoleculeViewer3D temperature={temperature} radiation={radiation} />
            )}
          </div>
        </div>

        {/* Reaction Workbench Surface */}
        <Workstation />

        {/* Bottom Time Controls */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl pointer-events-none z-10">
          <div className="pointer-events-auto">
            <TimeControls />
          </div>
        </div>
      </main>

      {/* Floating Status Toast */}
      {message && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-50 bg-[#0c1424]/95 border border-emerald-500/50 text-emerald-200 px-6 py-2.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] text-xs font-mono font-bold animate-fade-in flex items-center gap-2">
          <span>💡</span>
          <span>{message}</span>
        </div>
      )}

      {/* Chemical Info Modal */}
      <ChemicalInfoModal />
    </div>
  );
};

export default React.memo(ChemistryApp);
