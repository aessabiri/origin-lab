import React from 'react';
import { useStore } from './store.js';
import ParticleLab from './components/ParticleLab.jsx';
import ChemistryApp from './chemistry-lab/ChemistryApp.jsx';
import BiologyApp from './biology-lab/BiologyApp.jsx';
import StellarNursery from './components/StellarNursery.jsx';

const App = () => {
  const { currentView, setCurrentView } = useStore();

  return (
    <div className="w-full h-screen flex flex-col font-inter bg-gray-900 text-white">
      <div className="flex justify-center p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex gap-2 p-1 bg-gray-900 rounded-lg">
          <button
            onClick={() => setCurrentView('particle')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${currentView === 'particle' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
          >
            Particle Lab
          </button>
          <button
            onClick={() => setCurrentView('chemistry')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${currentView === 'chemistry' ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
          >
            Chemistry Lab
          </button>
          <button
            onClick={() => setCurrentView('biology')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${currentView === 'biology' ? 'bg-teal-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
          >
            Biology Lab
          </button>
          <button
            onClick={() => setCurrentView('space')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${currentView === 'space' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
          >
            Stellar Nursery
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {currentView === 'particle' && <ParticleLab />}
        {currentView === 'chemistry' && <ChemistryApp />}
        {currentView === 'biology' && <BiologyApp />}
        {currentView === 'space' && <StellarNursery />}
      </div>
    </div>
  );
};

export default App;