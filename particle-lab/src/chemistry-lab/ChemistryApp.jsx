import React, { useState } from 'react';
import Pantry from './components/Pantry';
import Workstation from './components/Workstation';
import { useSimulation } from './hooks/useSimulation';
import { useChemistryStore } from './store';
import TimeControls from './components/TimeControls';
import ChemicalInfoModal from './components/ChemicalInfoModal';
import { audioSystem } from './logic/audio';
import { useStore } from '../store';

const ChemistryApp = () => {
  useSimulation();
  const message = useChemistryStore(state => state.message);
  const setMessage = useChemistryStore(state => state.setMessage);
  const setIsCodexVisible = useStore(state => state.setIsCodexVisible);

  // Layout State
  const [isPantryOpen, setIsPantryOpen] = useState(false);

  React.useEffect(() => {
    const handleInteraction = () => {
      audioSystem.init();
      audioSystem.resume();
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);
  
  return (
    <div className="flex w-full h-full bg-slate-900 text-white font-inter overflow-hidden relative">
      
      {/* Left Sidebar: Pantry (Collapsible) */}
      <div 
        className={`relative z-20 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out flex flex-col ${
          isPantryOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
        }`}
      >
        <div className="flex-1 overflow-hidden relative">
           {/* We need to ensure Pantry fits here. Pantry uses ResourceExchange which is flex-col h-full. */}
           <div className="absolute inset-0">
             <Pantry />
           </div>
        </div>
      </div>

      {/* Toggle Button for Pantry (Fixed to left edge when closed, or top of sidebar when open) */}
      <button
        onClick={() => setIsPantryOpen(!isPantryOpen)}
        className={`absolute z-30 top-1/2 -translate-y-1/2 bg-gray-800 border border-gray-600 text-amber-500 p-2 rounded-r-lg shadow-lg transition-all duration-300 ${
          isPantryOpen ? 'left-80' : 'left-0'
        }`}
        aria-label={isPantryOpen ? "Close Pantry" : "Open Pantry"}
      >
        {isPantryOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>


      {/* Main Workstation Area */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
        <Workstation />
        
        {/* Overlays that were previously absolute */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl pointer-events-none">
           <div className="pointer-events-auto">
             <TimeControls />
           </div>
        </div>

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
           <button
             onClick={() => setIsCodexVisible(true)}
             className="p-3 bg-gray-800 hover:bg-gray-700 text-amber-500 rounded-full shadow-lg border border-gray-700 transition-transform hover:scale-105"
             title="Open Universal Codex"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
           </button>
        </div>

        {/* Toast Notification */}
        <div 
          className={`absolute bottom-20 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 pointer-events-none ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {message}
        </div>
      </div>
      
      <ChemicalInfoModal />
    </div>
  );
};

export default ChemistryApp;