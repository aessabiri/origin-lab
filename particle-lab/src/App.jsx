import React from 'react';
import { useStore } from './store.js';
import ParticleLab from './particle-lab/ParticleLab.jsx';
import ChemistryApp from './chemistry-lab/ChemistryApp.jsx';
import BiologyApp from './biology-lab/BiologyApp.jsx';
import PlanetaryView from './components/PlanetaryView.jsx';
import Universe from './components/Universe.jsx';
import Tutorials from './components/Tutorials.jsx';
import Navigation from './components/Navigation.jsx';
import LabNotebook from './components/LabNotebook.jsx';
import GameProgress from './components/GameProgress.jsx';
import Goals from './components/Goals.jsx';

const App = () => {
  const { currentView, setCurrentView, introComplete, isCodexVisible, setIsCodexVisible } = useStore();

  return (
    <div className="w-full h-screen flex flex-row font-inter bg-gray-900 text-white overflow-hidden">
      <Navigation />

      <div className="flex-1 overflow-hidden relative">
        {currentView === 'progress' && <GameProgress />}
        {currentView === 'goals' && <Goals />}
        {currentView === 'particle' && <ParticleLab />}
        {currentView === 'chemistry' && <ChemistryApp />}
        {currentView === 'biology' && <BiologyApp />}
        {currentView === 'planetary' && <PlanetaryView />}
        {/* {currentView === 'universe' && <Universe />} */}
        {currentView === 'tutorials' && <Tutorials />}
      </div>

      <LabNotebook isOpen={isCodexVisible} onClose={() => setIsCodexVisible(false)} />
    </div>
  );
};

export default App;