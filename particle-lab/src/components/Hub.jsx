import React, { useMemo } from 'react';
import { useStore } from '../store';
import { useBioStore } from '../biology-lab/store';
import { useChemistryStore } from '../chemistry-lab/store';
import { useInventory } from '../store/inventory';

const Hub = ({ onNavigate }) => {
  const { particles, discoveredAtoms, discoveredMolecules, executeReset, setCurrentView } = useStore();
  const { agents, isRunning, resetSimulation } = useBioStore();
  const { setGameMode } = useChemistryStore();
  const { resetUniverse } = useInventory();

  const physicsStats = useMemo(() => ({
    particles: particles.length,
    discovered: discoveredAtoms.length + discoveredMolecules.length,
    status: particles.length > 50 ? 'High Energy' : 'Stable'
  }), [particles, discoveredAtoms, discoveredMolecules]);

  const bioStats = useMemo(() => ({
    population: agents.length,
    status: isRunning ? 'Evolving' : 'Stasis',
    health: agents.reduce((acc, a) => acc + (a.energy || 0), 0) / (agents.length || 1)
  }), [agents, isRunning]);

  const handleReset = () => {
    if (window.confirm("WARNING: This will collapse the universe back into a singularity. All progress will be lost. Are you sure?")) {
      resetUniverse(); // Inventory -> 0
      executeReset(); // Physics
      resetSimulation(); // Biology
      setGameMode('career'); // Chemistry
      setCurrentView('menu'); // Return to Main Menu
    }
  };

  // --- MAIN DASHBOARD ---
  return (
    <div className="w-full h-full bg-slate-900 text-white p-8 overflow-y-auto animate-[fadeIn_1s_ease-out]">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-purple-500 mb-4">
          PARTICLE LAB
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Welcome, Architect. The universe is waiting.
          Select a laboratory to begin your research.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Physics Lab Card */}
        <div 
          onClick={() => onNavigate('particle')}
          className="group relative bg-slate-800 rounded-2xl p-1 overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative h-full bg-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700 group-hover:border-blue-500/50 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                ⚛️
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Physics Lab</h2>
              <p className="text-slate-400 text-sm mb-6">
                Construct the building blocks of the universe. Fuse quarks, build atoms, and discover elements.
              </p>
            </div>
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <StatRow label="Active Particles" value={physicsStats.particles} color="text-blue-400" />
              <StatRow label="Discoveries" value={physicsStats.discovered} color="text-indigo-400" />
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500">System Status</span>
                <span className="text-emerald-400">{physicsStats.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chemistry Lab Card */}
        <div 
          onClick={() => onNavigate('chemistry')}
          className="group relative bg-slate-800 rounded-2xl p-1 overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative h-full bg-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700 group-hover:border-green-500/50 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                ⚗️
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Chemistry Lab</h2>
              <p className="text-slate-400 text-sm mb-6">
                Experiment with molecular reactions, thermodynamics, and phase changes in a simulated environment.
              </p>
            </div>
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <StatRow label="Reactions Known" value="--" color="text-green-400" />
              <StatRow label="Equipment" value="Standard" color="text-emerald-400" />
               <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500">Lab Temp</span>
                <span className="text-amber-400">298 K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biology Lab Card */}
        <div 
          onClick={() => onNavigate('biology')}
          className="group relative bg-slate-800 rounded-2xl p-1 overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative h-full bg-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700 group-hover:border-teal-500/50 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                🧫
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Biology Lab</h2>
              <p className="text-slate-400 text-sm mb-6">
                Engineer cellular life. Design genomes, manage colonies, and observe emergent evolution.
              </p>
            </div>
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <StatRow label="Population" value={bioStats.population} color="text-teal-400" />
              <StatRow label="Avg Energy" value={bioStats.health.toFixed(0)} color="text-cyan-400" />
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500">Colony Status</span>
                <span className="text-slate-400">
                  {bioStats.status}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <footer className="mt-16 text-center text-slate-600 text-sm flex flex-col items-center gap-4">
        <p>Particle Lab v0.1.0 • Built with React & Zustand</p>
        <button 
          onClick={handleReset}
          className="text-red-500/50 hover:text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/20 hover:border-red-500/50 px-4 py-2 rounded-lg transition-all"
        >
          Reset Universe
        </button>
      </footer>
    </div>
  );
};

const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-500 font-semibold">{label}</span>
    <span className={`font-mono font-bold ${color}`}>{value}</span>
  </div>
);

export default Hub;
