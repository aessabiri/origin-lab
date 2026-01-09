import React from 'react';
import { useBioStore } from '../store';

const BioSidebar = () => {
  const { soup, agents, isRunning, toggleRunning, resetSimulation, importResource } = useBioStore();

  const handleFeed = () => {
    importResource('glucose', 50);
  };

  const handlePoison = () => {
    importResource('arsenic', 1);
  };

  return (
    <div className="w-full md:w-80 bg-teal-900 border-l border-teal-800 flex flex-col shadow-xl z-10">
      <div className="p-6 border-b border-teal-800 bg-teal-950">
        <h2 className="text-2xl font-bold text-teal-100 mb-1">Biology Lab</h2>
        <p className="text-teal-400 text-sm">Primordial Soup Simulator</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Simulation Controls */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={toggleRunning}
            className={`flex-1 py-3 rounded-lg font-bold shadow-md transition-all ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {isRunning ? '⏸ Pause' : '▶ Run'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-3 bg-red-900/50 hover:bg-red-800/80 text-red-200 rounded-lg border border-red-800 transition-colors"
            title="Extinction Event (Reset)"
          >
            ↺
          </button>
        </div>

        {/* Resource Injection */}
        <div className="mb-8 p-4 bg-teal-800/40 rounded-xl border border-teal-700/50">
          <h3 className="text-teal-200 font-bold uppercase tracking-wider text-xs mb-3">Colony Nutrition</h3>
          <p className="text-xs text-teal-400 mb-3">Dispense nutrients into the petri dish.</p>
          <button
            onClick={handleFeed}
            className="w-full py-2 rounded-lg font-bold text-sm bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg transition-all"
          >
            🍬 Drop Glucose Pellet
          </button>
        </div>

        {/* Hazard Control */}
        <div className="mb-8 p-4 bg-red-900/20 rounded-xl border border-red-900/50">
          <h3 className="text-red-400 font-bold uppercase tracking-wider text-xs mb-3">Hazard Control</h3>
          <p className="text-xs text-red-400 mb-3">Introduce environmental stressors.</p>
          <button
            onClick={handlePoison}
            className="w-full py-2 rounded-lg font-bold text-sm bg-red-700 hover:bg-red-600 text-white shadow-lg transition-all"
          >
            ☠️ Drop Toxin
          </button>
        </div>

        {/* Vital Statistics */}
        <div className="mb-8">
          <h3 className="text-teal-200 font-bold uppercase tracking-wider text-xs mb-4">Environment Stats</h3>
          
          <div className="space-y-4">
            <div className="bg-teal-800/50 p-3 rounded-lg border border-teal-700">
              <div className="flex justify-between items-end mb-1">
                <span className="text-teal-300 text-sm">Population</span>
                <span className="text-2xl font-mono text-white">{agents.length}</span>
              </div>
              <div className="w-full bg-teal-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-400 h-full rounded-full" style={{ width: `${Math.min(100, agents.length * 2)}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Glucose" value={soup.glucose} color="text-yellow-300" />
              <StatCard label="Amino Acids" value={soup.aminoAcids} color="text-purple-300" />
              <StatCard label="Lipids" value={soup.lipids} color="text-orange-300" />
              <StatCard label="Toxins" value={useBioStore.getState().toxins.length} color="text-red-400" />
            </div>
          </div>
        </div>

        {/* Agent Inspector (Placeholder) */}
        {agents.length > 0 ? (
          <div>
            <h3 className="text-teal-200 font-bold uppercase tracking-wider text-xs mb-4">Dominant Species</h3>
            <div className="p-4 bg-teal-800/30 rounded-lg border border-teal-700/50 text-center text-teal-400 italic">
              Analyzing samples...
            </div>
          </div>
        ) : (
          <div className="p-4 border-2 border-dashed border-teal-800 rounded-lg text-center">
            <p className="text-teal-500 text-sm">No life detected.</p>
            <p className="text-teal-600 text-xs mt-1">Use "Create Cell" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-teal-800/30 p-2 rounded-lg border border-teal-700/50">
    <p className="text-xs text-teal-400 mb-1">{label}</p>
    <p className={`text-lg font-mono font-bold ${color}`}>{value}</p>
  </div>
);

export default BioSidebar;
