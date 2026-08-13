import React, { useState } from 'react';
import { useBioStore } from './store';
import { useBioSimulation } from './hooks/useBioSimulation';
import IncubationChamber from './components/IncubationChamber';
import ProteinFolder from './components/ProteinFolder';
import CellBuilder from './components/CellBuilder';
import BioModeSelector from './components/BioModeSelector';
import BioLabInventory from './components/BioLabInventory';
import { useStore } from '../store';

const MODE_THEMES = {
  simulation: {
    bg: 'bg-[#060e14]',
    accent: 'text-teal-400',
    border: 'border-teal-500/20',
  },
  folding: {
    bg: 'bg-[#080c18]',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  assembly: {
    bg: 'bg-[#0f0c18]',
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  inventory: {
    bg: 'bg-[#080d18]',
    accent: 'text-sky-400',
    border: 'border-sky-500/20',
  }
};

const BiologyApp = () => {
  const { injectLuca, currentCellDesign, isRunning, agents } = useBioStore();
  const setIsCodexVisible = useStore(state => state.setIsCodexVisible);
  const [viewMode, setViewMode] = useState('assembly');
  
  useBioSimulation();

  const activeTheme = MODE_THEMES[viewMode] || MODE_THEMES.assembly;
  const hasDesign = currentCellDesign && currentCellDesign.organelles.length > 0;

  return (
    <div className={`flex flex-col md:flex-row h-full w-full ${activeTheme.bg} text-white overflow-hidden relative select-none font-sans`}>
      
      {/* Ambient Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(45,212,191,0.02)_1px,transparent_1px),linear-gradient(rgba(45,212,191,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Left Navigation & Widgets */}
      <BioModeSelector currentMode={viewMode} setMode={setViewMode} />

      {/* Main Content Area */}
      <main className="flex-1 relative w-full h-full overflow-hidden flex flex-col min-w-0 min-h-0">
        
        {/* Simulation Mode: The Incubation Chamber */}
        {viewMode === 'simulation' && (
          <IncubationChamber 
            onInject={injectLuca}
            hasDesign={hasDesign}
            isRunning={isRunning}
            agents={agents}
          />
        )}

        {/* Protein Folding & Genetic Studio */}
        {viewMode === 'folding' && (
          <div className="w-full h-full relative overflow-hidden">
            <ProteinFolder />
          </div>
        )}
        
        {/* Cell Assembly Mode: Blueprint & LUCA Builder */}
        {viewMode === 'assembly' && (
          <div className="w-full h-full flex flex-col overflow-hidden">
            <CellBuilder onFinalize={injectLuca} />
          </div>
        )}

        {/* Inventory Deck */}
        {viewMode === 'inventory' && (
          <div className="w-full h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            <BioLabInventory />
          </div>
        )}

      </main>

    </div>
  );
};

export default React.memo(BiologyApp);
