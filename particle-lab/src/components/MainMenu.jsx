import React from 'react';
import { useStore } from '../store';
import { useInventory } from '../store/inventory';

const MainMenu = () => {
  const setCurrentView = useStore(state => state.setCurrentView);
  const setIsSandboxMode = useStore(state => state.setIsSandboxMode);
  const resetUniverse = useInventory(state => state.resetUniverse);

  const handleStart = (mode) => {
    setIsSandboxMode(mode === 'creative');
    // Ensure clean slate if starting fresh? 
    // Usually a main menu implies a new session or continuing.
    // For now, let's assume it continues unless user resets inside, 
    // BUT user asked for "Start button starts...". 
    // Let's just navigate to Universe. The Big Bang logic will handle the "New Game" feel if energy is 0.
    setCurrentView('universe');
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-inter text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

      <div className="z-10 text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            ORIGIN LAB
          </h1>
          <p className="text-slate-400 text-lg tracking-widest uppercase">From Singularity to Sentience</p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
          <button 
            onClick={() => handleStart('survival')}
            className="group relative px-8 py-4 bg-slate-900/50 border border-slate-700 hover:border-blue-500 rounded-xl transition-all hover:scale-105 hover:bg-slate-800"
          >
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">SURVIVAL</span>
              <span className="text-xs text-slate-500">Manage resources. Evolve through the eras. The true experience.</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">➜</div>
          </button>

          <button 
            onClick={() => handleStart('creative')}
            className="group relative px-8 py-4 bg-slate-900/50 border border-slate-700 hover:border-purple-500 rounded-xl transition-all hover:scale-105 hover:bg-slate-800"
          >
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">CREATIVE</span>
              <span className="text-xs text-slate-500">Infinite resources. Instant access to all labs. Sandbox mode.</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500">➜</div>
          </button>
        </div>
      </div>

      <footer className="absolute bottom-8 text-slate-600 text-xs">
        v0.2.0 • Pre-Alpha
      </footer>
    </div>
  );
};

export default MainMenu;