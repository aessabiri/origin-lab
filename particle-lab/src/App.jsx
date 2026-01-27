import React from 'react';
import { useStore } from './store.js';
import ParticleLab from './components/ParticleLab.jsx';
import ChemistryApp from './chemistry-lab/ChemistryApp.jsx';
import BiologyApp from './biology-lab/BiologyApp.jsx';
import Universe from './components/Universe.jsx';
import Hub from './components/Hub.jsx';
import MainMenu from './components/MainMenu.jsx';
import Navigation from './components/Navigation.jsx';
import LabNotebook from './components/LabNotebook.jsx';

const App = () => {
  const { currentView, setCurrentView, introComplete, isCodexVisible, setIsCodexVisible } = useStore();

  if (currentView === 'menu') {
    return <MainMenu />;
  }

  return (
    <div className="w-full h-screen flex flex-col font-inter bg-gray-900 text-white">
      <Navigation />

      <div className="flex-1 overflow-hidden relative">
        {currentView === 'hub' && <Hub onNavigate={setCurrentView} />}
        {currentView === 'particle' && <ParticleLab />}
        {currentView === 'chemistry' && <ChemistryApp />}
        {currentView === 'biology' && <BiologyApp />}
        {currentView === 'universe' && <Universe />}
      </div>

      <LabNotebook isOpen={isCodexVisible} onClose={() => setIsCodexVisible(false)} />
    </div>
  );
};

export default App;