import React, { useEffect, useState } from 'react';
import Pantry from './components/Pantry';
import Workstation from './components/Workstation';
import { useReaction } from './hooks/useReaction';
import { useChemistryStore } from './store';
import ChemistryCodex from './components/ChemistryCodex';

const ChemistryApp = () => {
  useReaction();
  const message = useChemistryStore(state => state.message);
  const setMessage = useChemistryStore(state => state.setMessage);
  const [isCodexOpen, setIsCodexOpen] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);
  
  return (
    <div className="flex flex-col w-full h-full bg-slate-900 text-white font-inter overflow-hidden relative">
      <Workstation />
      <Pantry />
      
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsCodexOpen(true)}
          className="p-3 bg-gray-800 hover:bg-gray-700 text-amber-500 rounded-full shadow-lg border border-gray-700 transition-transform hover:scale-105"
          title="Open Chemical Codex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>
      </div>

      <ChemistryCodex isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />

      {/* Toast Notification */}
      <div 
        className={`absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 pointer-events-none ${message ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChemistryApp;
