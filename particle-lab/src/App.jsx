import React from 'react';
import { useStore } from './store.js';
import ParticleLab from './components/ParticleLab.jsx';
import ChemistryApp from './chemistry-lab/ChemistryApp.jsx';

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
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {currentView === 'particle' && <ParticleLab />}
        {currentView === 'chemistry' && <ChemistryApp />}
        {currentView === 'biology' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-teal-950 text-teal-100">
            <h1 className="text-4xl font-bold mb-4">🧫 Biology Lab</h1>
            <p className="text-xl mb-8">The Petri Dish is under construction.</p>
            <div className="p-6 bg-teal-900 rounded-xl border border-teal-700 max-w-md">
              <h2 className="text-lg font-bold mb-2">Planned Features:</h2>
              <ul className="list-disc list-inside space-y-2 text-teal-200">
                <li>Cellular Automata (Conway's Game of Life style)</li>
                <li>DNA/RNA Editing</li>
                <li>Evolutionary Simulation</li>
                <li>Microscopy View</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;