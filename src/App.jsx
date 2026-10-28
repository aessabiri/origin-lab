import React, { Suspense, lazy } from 'react';
import { useStore } from './store.js';
import ParticleLab from './particle-lab/ParticleLab.jsx';
import Navigation from './components/Navigation.jsx';
import LabNotebook from './components/LabNotebook.jsx';

// Route-level code-splitting: Heavy 3D and simulation views loaded on-demand
const ChemistryApp = lazy(() => import('./chemistry-lab/ChemistryApp.jsx'));
const BiologyApp = lazy(() => import('./biology-lab/BiologyApp.jsx'));
const PlanetaryView = lazy(() => import('./components/PlanetaryView.jsx'));
const Universe = lazy(() => import('./components/Universe.jsx'));
const Tutorials = lazy(() => import('./components/Tutorials.jsx'));
const GameProgress = lazy(() => import('./components/GameProgress.jsx'));
const Goals = lazy(() => import('./components/Goals.jsx'));

const LabLoadingFallback = () => (
  <div className="w-full h-full bg-[#070a13] flex flex-col items-center justify-center font-mono gap-4 select-none">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
      <span className="text-xl">⚛️</span>
    </div>
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-xs uppercase tracking-[0.25em] text-cyan-300 font-bold">Initializing Laboratory Module</span>
      <span className="text-[10px] text-slate-500">Compiling Quantum Subsystems...</span>
    </div>
  </div>
);

const App = () => {
  const { currentView, isCodexVisible, setIsCodexVisible } = useStore();

  return (
    <div className="w-full h-screen flex flex-row font-inter bg-[#070a13] text-white overflow-hidden">
      <Navigation />

      <div className="flex-1 overflow-hidden relative">
        <Suspense fallback={<LabLoadingFallback />}>
          {currentView === 'progress' && <GameProgress />}
          {currentView === 'goals' && <Goals />}
          {currentView === 'particle' && <ParticleLab />}
          {currentView === 'chemistry' && <ChemistryApp />}
          {currentView === 'biology' && <BiologyApp />}
          {currentView === 'planetary' && <PlanetaryView />}
          {currentView === 'universe' && <Universe />}
          {currentView === 'tutorials' && <Tutorials />}
        </Suspense>
      </div>

      <LabNotebook isOpen={isCodexVisible} onClose={() => setIsCodexVisible(false)} />
    </div>
  );
};

export default App;
