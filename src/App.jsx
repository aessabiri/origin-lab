import React, { Suspense, lazy, useEffect } from 'react';
import { useStore } from './store.js';
import { useInventory } from './store/inventory.js';
import { useProgressionStore } from './store/progressionStore.js';
import ParticleLab from './particle-lab/ParticleLab.jsx';
import Navigation from './components/Navigation.jsx';
import CosmicCommandBar from './components/CosmicCommandBar.jsx';
import LabNotebook from './components/LabNotebook.jsx';

// Route-level code-splitting: Heavy 3D and simulation views loaded on-demand
const ChemistryApp = lazy(() => import('./chemistry-lab/ChemistryApp.jsx'));
const BiologyApp = lazy(() => import('./biology-lab/BiologyApp.jsx'));
const PlanetaryView = lazy(() => import('./components/PlanetaryView.jsx'));
const Universe = lazy(() => import('./components/Universe.jsx'));
const AnatomyLab = lazy(() => import('./anatomy-lab/AnatomyLab.jsx'));
const Tutorials = lazy(() => import('./components/Tutorials.jsx'));
const GameProgress = lazy(() => import('./components/GameProgress.jsx'));
const Goals = lazy(() => import('./components/Goals.jsx'));

const LabLoadingFallback = () => (
  <div className="w-full h-full bg-[#030508] flex flex-col items-center justify-center font-mono gap-4 select-none">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
      <span className="text-xl">⚛️</span>
    </div>
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-xs uppercase tracking-[0.25em] text-cyan-300 font-bold">
        Initializing Argon Simulation Matrix
      </span>
      <span className="text-[10px] text-slate-500">Compiling 3D Quantum & Biomechanical Subsystems...</span>
    </div>
  </div>
);

const App = () => {
  const { currentView, setCurrentView, isCodexVisible, setIsCodexVisible } = useStore();
  const discoveredItems = useInventory((state) => state.discoveredItems);
  const checkProgress = useProgressionStore((state) => state.checkProgress);

  useEffect(() => {
    if (checkProgress) {
      checkProgress(discoveredItems);
    }
  }, [discoveredItems, checkProgress]);

  return (
    <div className="w-full h-screen flex flex-col bg-[#030508] text-white overflow-hidden select-none">
      {/* Persistent Top Cosmic Command Bar */}
      <CosmicCommandBar
        isGuideOpen={currentView === 'goals'}
        onToggleGuide={() => setCurrentView(currentView === 'goals' ? 'universe' : 'goals')}
        onOpenNotebook={() => setIsCodexVisible(!isCodexVisible)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-row overflow-hidden relative min-h-0">
        <Navigation />

        <div className="flex-1 overflow-hidden relative">
          <Suspense fallback={<LabLoadingFallback />}>
            {currentView === 'progress' && <GameProgress />}
            {currentView === 'goals' && <Goals />}
            {(currentView === 'particle' || currentView === 'physics') && <ParticleLab />}
            {currentView === 'chemistry' && <ChemistryApp />}
            {currentView === 'biology' && <BiologyApp />}
            {currentView === 'planetary' && <PlanetaryView />}
            {currentView === 'anatomy' && <AnatomyLab />}
            {(currentView === 'universe' || currentView === 'universe_v2') && <Universe />}
            {currentView === 'tutorials' && <Tutorials />}
          </Suspense>
        </div>
      </div>

      <LabNotebook isOpen={isCodexVisible} onClose={() => setIsCodexVisible(false)} />
    </div>
  );
};

export default App;
