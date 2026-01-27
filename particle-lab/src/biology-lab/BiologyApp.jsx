import React, { useRef, useEffect, useState } from 'react';
import { useBioStore } from './store';
import { useBioSimulation } from './hooks/useBioSimulation';
import CellCreator from './components/CellCreator';
import PetriDish from './components/PetriDish';
import BioSidebar from './components/BioSidebar';
import ProteinFolder from './components/ProteinFolder';
import CellBuilder from './components/CellBuilder';
import BioModeSelector from './components/BioModeSelector';
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
      
      {/* Left Navigation & Widgets */}
      <BioModeSelector currentMode={viewMode} setMode={setViewMode} theme={activeTheme} />

      {/* Main Content Area - Full Screen Canvas */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        
        {/* Simulation Mode: The Petri Dish */}
        {viewMode === 'simulation' && (
          <div className="w-full h-full flex items-center justify-center p-4">
             {/* Keep Petri Dish circular but allow it to scale nicely within the full area */}
             <div className="relative w-full h-full max-w-[90vh] aspect-square bg-teal-900/50 rounded-full border-8 border-teal-800 shadow-2xl overflow-hidden backdrop-blur-sm ring-4 ring-teal-900/50">
                <PetriDish />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
                  <button 
                    onClick={() => setIsCellCreatorOpen(true)}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                  >
                    + Spawn Agent
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* Protein Folding Mode: Full Screen Interface */}
        {viewMode === 'folding' && (
          <div className="w-full h-full flex flex-col p-6 animate-fadeIn">
            <div className="flex justify-between items-end border-b border-indigo-500/30 pb-4 mb-4">
               <div>
                 <h2 className="text-3xl font-black tracking-widest text-indigo-400">MOLECULAR SEQUENCER</h2>
                 <p className="text-indigo-500/60 font-mono text-sm">PROTEIN FOLDING SIMULATION // v1.0.4</p>
               </div>
            </div>
            <div className="flex-1 relative bg-indigo-900/20 rounded-2xl border border-indigo-500/30 backdrop-blur-sm overflow-hidden">
               <ProteinFolder />
            </div>
          </div>
        )}
        
        {/* Cell Assembly Mode: Full Screen Blueprint */}
        {viewMode === 'assembly' && (
          <div className="w-full h-full flex flex-col p-6 animate-fadeIn">
             <div className="flex justify-between items-center bg-amber-900/20 p-4 border-b border-amber-500/30 rounded-t-xl">
               <h2 className="text-2xl font-bold text-amber-500 uppercase tracking-widest flex items-center gap-3">
                 <span className="text-3xl">🦠</span> LUCA Assembly Bay
               </h2>
               <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/50 rounded text-amber-400 text-xs font-mono tracking-wider">
                 CONSTRUCTION MODE
               </div>
            </div>
            <div className="flex-1 relative bg-amber-950/40 border-x border-b border-amber-500/30 rounded-b-xl backdrop-blur-sm overflow-hidden">
               <CellBuilder />
            </div>
          </div>
        )}

        {/* Top Right Controls (Global) */}
        <div className="absolute top-4 right-4 z-50 pointer-events-auto">
          <button
            onClick={() => setIsCodexVisible(true)}
            className={`p-3 text-white rounded-full shadow-lg border transition-transform hover:scale-105 backdrop-blur-md ${activeTheme.controlsBg} ${activeTheme.controlsBorder}`}
            title="Open Universal Codex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar / Stats - Context Aware */}
      {viewMode === 'simulation' && <BioSidebar />}

      {/* Modals */}
      {isCellCreatorOpen && viewMode === 'simulation' && <CellCreator onClose={() => setIsCellCreatorOpen(false)} />}
    </div>
  );
};

export default BiologyApp;
