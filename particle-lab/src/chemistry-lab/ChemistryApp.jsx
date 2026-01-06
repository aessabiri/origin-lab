import React, { useEffect } from 'react';
import Pantry from './components/Pantry';
import Workstation from './components/Workstation';
import { useReaction } from './hooks/useReaction';
import { useChemistryStore } from './store';

const ChemistryApp = () => {
  useReaction();
  const message = useChemistryStore(state => state.message);
  const setMessage = useChemistryStore(state => state.setMessage);

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
