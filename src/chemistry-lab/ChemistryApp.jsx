import React, { useState, useEffect } from 'react';
import ChemistrySidebar from './components/ChemistrySidebar';
import Workstation from './components/Workstation';
import { useSimulation } from './hooks/useSimulation';
import { useChemistryStore } from './store';
import TimeControls from './components/TimeControls';
import ChemicalInfoModal from './components/ChemicalInfoModal';
import { audioSystem } from './logic/audio';
import { useStore } from '../store';

const ChemistryApp = () => {
  useSimulation();
  const message = useChemistryStore(state => state.message);
  const setMessage = useChemistryStore(state => state.setMessage);
  const vessels = useChemistryStore(state => state.vessels);
  const setIsCodexVisible = useStore(state => state.setIsCodexVisible);

  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  const activeVesselsCount = Object.keys(vessels || {}).length;
  
  return (
    <div className="flex w-full h-full bg-[#060912] text-white font-sans overflow-hidden relative select-none">
      
      {/* 1. LEFT SIDEBAR: Pantry & Apparatus Deck */}
      <aside 
        aria-label="Chemistry equipment and storage"
        className={`relative z-20 h-full bg-[#080d1a]/95 backdrop-blur-2xl border-r border-emerald-500/20 shadow-2xl transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
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
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        className={`absolute z-30 top-1/2 -translate-y-1/2 bg-[#0c1424]/90 hover:bg-[#131f38] border border-emerald-500/40 text-emerald-400 p-2 rounded-r-xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isSidebarOpen ? 'left-80' : 'left-0'
        }`}
      >
        <span className="text-xs font-mono font-black">{isSidebarOpen ? '◀' : '▶'}</span>
      </button>

      {/* 2. MAIN WORKSTATION LAB BENCH */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden min-w-0 min-h-0">
        
        {/* Top Floating Laboratory HUD */}
        <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
          
          <div className="flex items-center gap-3 pointer-events-auto bg-[#0a0f1d]/80 backdrop-blur-xl border border-emerald-500/30 px-4 py-2 rounded-2xl shadow-xl">
            <span className="text-xl">⚗️</span>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                Molecular Synthesis Deck
              </h2>
              <span className="text-[9px] font-mono text-slate-400">
                Active Reaction Vessels: <strong className="text-emerald-300">{activeVesselsCount}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsCodexVisible(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c1424]/90 hover:bg-[#131f38] border border-amber-500/40 text-amber-300 shadow-xl transition-all hover:scale-105 active:scale-95 text-xs font-mono font-bold"
              title="Open Universal Codex"
            >
              <span>📖</span>
              <span>Codex</span>
            </button>
          </div>
        </div>

        {/* Reaction Workbench Surface */}
        <Workstation />
        
        {/* Bottom Time Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl pointer-events-none z-10">
          <div className="pointer-events-auto">
            <TimeControls />
          </div>
        </div>

      </main>

      {/* Floating Status Toast */}
      {message && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0c1424]/95 border border-emerald-500/50 text-emerald-200 px-6 py-2.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] text-xs font-mono font-bold animate-fade-in flex items-center gap-2">
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