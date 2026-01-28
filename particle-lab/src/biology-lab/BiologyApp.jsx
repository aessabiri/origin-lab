import React, { useRef, useEffect, useState } from 'react';
import { useBioStore } from './store';
import { useBioSimulation } from './hooks/useBioSimulation';
import CellCreator from './components/CellCreator';
import PetriDish from './components/PetriDish';
import BioSidebar from './components/BioSidebar';
import ProteinFolder from './components/ProteinFolder';
import CellBuilder from './components/CellBuilder';
import BioModeSelector from './components/BioModeSelector';
import BioLabInventory from './components/BioLabInventory';
import { useStore } from '../store';

const MODE_THEMES = {
  simulation: {
    bg: 'bg-teal-950',
    textPrimary: 'text-teal-100',
    sidebarBg: 'bg-teal-950/80',
    borderColor: 'border-teal-800',
    headerText: 'text-teal-500',
    itemHover: 'hover:bg-teal-900/30 hover:text-teal-200',
    itemActive: 'bg-teal-900/60 text-white',
    itemInactive: 'text-teal-400',
    highlight: 'bg-teal-400',
    shadow: 'shadow-[0_0_10px_rgba(45,212,191,0.5)]',
    labelActive: 'text-teal-100',
    labelInactive: 'text-teal-300',
    descText: 'text-teal-500/80',
    statLabel: 'text-teal-500/70',
    statValueActive: 'text-teal-200',
    statValueInactive: 'text-teal-400',
    controlsBorder: 'border-teal-600',
    controlsBg: 'bg-teal-800 hover:bg-teal-700',
  },
  folding: {
    bg: 'bg-indigo-950',
    textPrimary: 'text-indigo-100',
    sidebarBg: 'bg-indigo-950/80',
    borderColor: 'border-indigo-800',
    headerText: 'text-indigo-500',
    itemHover: 'hover:bg-indigo-900/30 hover:text-indigo-200',
    itemActive: 'bg-indigo-900/60 text-white',
    itemInactive: 'text-indigo-400',
    highlight: 'bg-indigo-400',
    shadow: 'shadow-[0_0_10px_rgba(129,140,248,0.5)]',
    labelActive: 'text-indigo-100',
    labelInactive: 'text-indigo-300',
    descText: 'text-indigo-500/80',
    statLabel: 'text-indigo-500/70',
    statValueActive: 'text-indigo-200',
    statValueInactive: 'text-indigo-400',
    controlsBorder: 'border-indigo-600',
    controlsBg: 'bg-indigo-800 hover:bg-indigo-700',
  },
  assembly: {
    bg: 'bg-amber-950',
    textPrimary: 'text-amber-100',
    sidebarBg: 'bg-amber-950/80',
    borderColor: 'border-amber-800',
    headerText: 'text-amber-500',
    itemHover: 'hover:bg-amber-900/30 hover:text-amber-200',
    itemActive: 'bg-amber-900/60 text-white',
    itemInactive: 'text-amber-400',
    highlight: 'bg-amber-400',
    shadow: 'shadow-[0_0_10px_rgba(251,191,36,0.5)]',
    labelActive: 'text-amber-100',
    labelInactive: 'text-amber-300',
    descText: 'text-amber-500/80',
    statLabel: 'text-amber-500/70',
    statValueActive: 'text-amber-200',
    statValueInactive: 'text-amber-400',
    controlsBorder: 'border-amber-600',
    controlsBg: 'bg-amber-800 hover:bg-amber-700',
  },
  inventory: {
    bg: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    sidebarBg: 'bg-slate-950/80',
    borderColor: 'border-slate-800',
    headerText: 'text-slate-500',
    itemHover: 'hover:bg-slate-900/30 hover:text-slate-200',
    itemActive: 'bg-slate-900/60 text-white',
    itemInactive: 'text-slate-400',
    highlight: 'bg-slate-400',
    shadow: 'shadow-[0_0_10px_rgba(148,163,184,0.5)]',
    labelActive: 'text-slate-100',
    labelInactive: 'text-slate-300',
    descText: 'text-slate-500/80',
    statLabel: 'text-slate-500/70',
    statValueActive: 'text-slate-200',
    statValueInactive: 'text-slate-400',
    controlsBorder: 'border-slate-600',
    controlsBg: 'bg-slate-800 hover:bg-slate-700',
  }
};

const BiologyApp = () => {
  const { isCellCreatorOpen, setIsCellCreatorOpen } = useBioStore();
  const setIsCodexVisible = useStore(state => state.setIsCodexVisible);
  const [viewMode, setViewMode] = useState('simulation'); // 'simulation', 'folding', 'assembly'
  
  useBioSimulation();

  const activeTheme = MODE_THEMES[viewMode];

  return (
    <div className={`flex flex-col md:flex-row h-full w-full ${activeTheme.bg} ${activeTheme.textPrimary} overflow-hidden relative transition-colors duration-700`}>
      
      {/* GLOBAL VINTAGE OVERLAY (Scanlines / Texture) */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] [background-size:100%_2px,3px_100%]"></div>

      {/* Left Navigation & Widgets */}
      <BioModeSelector currentMode={viewMode} setMode={setViewMode} />

      {/* Main Content Area - Full Screen Canvas */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col">
        
        {/* Simulation Mode: The Petri Dish */}
        {viewMode === 'simulation' && (
          <div className="flex-1 w-full h-full flex items-center justify-center p-8 relative overflow-hidden">
             {/* PARALLAX BACKGROUND (Dust/Motes) */}
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute rounded-full bg-teal-500/20 blur-xl animate-pulse"
                    style={{
                      width: Math.random() * 100 + 50,
                      height: Math.random() * 100 + 50,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      transform: `translateZ(${Math.random() * 100}px)`
                    }}
                  ></div>
                ))}
             </div>

             {/* Petri Dish Container */}
             <div className="relative w-full h-full max-w-[85vh] aspect-square rounded-full border-[12px] border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-sm ring-[16px] ring-black/20 flex items-center justify-center">
                {/* Brass Inner Ring */}
                <div className="absolute inset-0 border-4 border-amber-900/20 rounded-full z-10 pointer-events-none"></div>
                <PetriDish />
                
                {/* Spawn Control Overlay */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
                  <button 
                    onClick={() => setIsCellCreatorOpen(true)}
                    className="px-8 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-amber-500 border-2 border-amber-900/50 font-black uppercase tracking-[0.2em] text-xs rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                  >
                    <span className="text-xl">🧬</span> Instantiate Bio-Agent
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* Protein Folding Mode: Full Screen Interface */}
        {viewMode === 'folding' && (
          <div className="w-full h-full flex flex-col p-6 animate-fadeIn">
            <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-6">
               <div>
                 <h2 className="text-4xl font-black tracking-[0.2em] text-indigo-500 italic">SEQUENCER</h2>
                 <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase mt-1">Direct Molecular Manipulation Protocol</p>
               </div>
               <div className="px-4 py-1 bg-zinc-900 border border-indigo-900/50 rounded flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
                  <span className="text-[10px] font-mono text-zinc-400">ENCRYPTION_ACTIVE</span>
               </div>
            </div>
            <div className="flex-1 relative bg-[#0a0a0a] rounded-xl border-4 border-[#1a1a1a] shadow-[inset_0_0_40px_rgba(0,0,0,1)] overflow-hidden">
               <ProteinFolder />
            </div>
          </div>
        )}
        
        {/* Cell Assembly Mode: Full Screen Blueprint */}
        {viewMode === 'assembly' && (
          <div className="w-full h-full flex flex-col p-6 animate-fadeIn">
             <div className="flex justify-between items-center bg-[#1a1a1a] p-6 border-b-4 border-black rounded-t-xl shadow-lg">
               <h2 className="text-3xl font-black text-amber-600 uppercase tracking-[0.1em] flex items-center gap-4 italic">
                 <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">🦠</span> LUCA_ENGINEERING_BAY
               </h2>
               <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] text-zinc-500 font-mono">STATUS: CONSTRUCTION_PHASE</span>
                    <span className="text-xs text-amber-500/80 font-bold">ALPHA_BUILD_v0.9</span>
                  </div>
                  <div className="w-10 h-10 rounded bg-black border border-amber-900/30 flex items-center justify-center text-amber-500 font-black">A</div>
               </div>
            </div>
            <div className="flex-1 relative bg-[#0d0d0d] border-x-4 border-b-4 border-[#1a1a1a] rounded-b-xl shadow-inner overflow-hidden">
               <CellBuilder />
            </div>
          </div>
        )}

        {/* Bio Inventory Mode: Full Screen Storage */}
        {viewMode === 'inventory' && (
          <div className="w-full h-full flex flex-col p-6 animate-fadeIn">
             <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-6">
               <div>
                 <h2 className="text-4xl font-black tracking-[0.2em] text-zinc-400 italic">LOGISTICS</h2>
                 <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase mt-1">Resource Catalog & Distribution</p>
               </div>
            </div>
            <div className="flex-1 relative bg-[#0a0a0a] rounded-xl border-4 border-[#1a1a1a] shadow-2xl overflow-hidden">
               <BioLabInventory />
            </div>
          </div>
        )}

        {/* Global UI Scanline Effect overlay for main area */}
        <div className="absolute inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]"></div>
      </div>

      {/* Sidebar / Stats - Context Aware */}
      {viewMode === 'simulation' && <BioSidebar />}

      {/* Top Left Tooltip (Nostalgic) */}
      <div className="absolute top-2 left-[300px] z-50 pointer-events-none opacity-40">
         <span className="text-[10px] font-mono text-zinc-500 tracking-tighter">OS_BIO_KERNEL // INIT_OK</span>
      </div>

      {/* Top Right Controls (Global) */}
      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => setIsCodexVisible(true)}
          className="w-14 h-14 bg-[#1a1a1a] border-4 border-black rounded-xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
          title="Open Universal Codex"
        >
          <div className="absolute inset-0 rounded-lg bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>
      </div>

      {/* Modals */}
      {isCellCreatorOpen && viewMode === 'simulation' && <CellCreator onClose={() => setIsCellCreatorOpen(false)} />}
    </div>
  );
};

export default BiologyApp;
