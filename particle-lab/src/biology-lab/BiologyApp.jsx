import React, { useRef, useEffect } from 'react';
import { useBioStore } from './store';
import { useBioSimulation } from './hooks/useBioSimulation';
import CellCreator from './components/CellCreator';
import PetriDish from './components/PetriDish';
import BioSidebar from './components/BioSidebar';

const BiologyApp = () => {
  const { isCellCreatorOpen, setIsCellCreatorOpen } = useBioStore();
  
  useBioSimulation();

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-teal-950 text-teal-100 overflow-hidden relative">
      
      {/* Main Simulation Area */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-4xl max-h-[80vh] aspect-square bg-teal-900/50 rounded-full border-8 border-teal-800 shadow-2xl overflow-hidden backdrop-blur-sm">
          <PetriDish />
          
          {/* Overlay Controls */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4">
             <button 
               onClick={() => setIsCellCreatorOpen(true)}
               className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
             >
               + Create Cell
             </button>
          </div>
        </div>
      </div>

      {/* Sidebar / Stats */}
      <BioSidebar />

      {/* Modals */}
      {isCellCreatorOpen && <CellCreator onClose={() => setIsCellCreatorOpen(false)} />}
    </div>
  );
};

export default BiologyApp;
