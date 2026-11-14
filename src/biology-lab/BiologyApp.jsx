import React, { useState } from 'react';
import { useBioStore } from './store';
import ProteinFolder from './components/ProteinFolder';
import BioModeSelector from './components/BioModeSelector';
import BioGoalsView from './components/BioGoalsView';
import TopDownOrganogenesisLab from './components/TopDownOrganogenesisLab';
import { useStore } from '../store';

const BiologyApp = () => {
  const [viewMode, setViewMode] = useState('organogenesis');
  const [activeStage, setActiveStage] = useState('molecule'); // Start bottom-up at Stop 1 or switch freely

  const handleSelectStop = (stageId) => {
    setActiveStage(stageId);
    setViewMode('organogenesis');
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#060a14] text-white overflow-hidden relative select-none font-sans">
      {/* Ambient Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(45,212,191,0.02)_1px,transparent_1px),linear-gradient(rgba(45,212,191,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* 5-Stop Assembly Sub-Tabs Rail */}
      <BioModeSelector
        currentMode={viewMode}
        setMode={setViewMode}
        activeStage={activeStage}
        onSelectStop={handleSelectStop}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative w-full h-full overflow-hidden flex flex-col min-w-0 min-h-0">
        {viewMode === 'folding' ? (
          <div className="w-full h-full relative overflow-hidden">
            <ProteinFolder />
          </div>
        ) : viewMode === 'goals' ? (
          <div className="w-full h-full flex flex-col overflow-hidden">
            <BioGoalsView onGoToStop={handleSelectStop} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col overflow-hidden">
            <TopDownOrganogenesisLab
              activeStage={activeStage}
              setActiveStage={setActiveStage}
              onNavigateMode={setViewMode}
              onOpenAnatomy={() => useStore.getState().setCurrentView('anatomy')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default React.memo(BiologyApp);
