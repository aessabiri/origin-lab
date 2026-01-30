import React, { useMemo } from 'react';
import { useStore } from '../store';
import { useParticleStore } from '../particle-lab/store';
import { useBioStore } from '../biology-lab/store';
import { useChemistryStore } from '../chemistry-lab/store';
import { useInventory } from '../store/inventory';
import { useProgressionStore } from '../store/progressionStore';
import { useDiscoveredMatter } from '../hooks/useDiscoveredMatter';

const Hub = ({ onNavigate }) => {
  const { 
    executeReset, setCurrentView, setIntroComplete,
    isSandboxMode, setIsSandboxMode
  } = useStore();
  
  const { discoveredAtoms, discoveredMolecules } = useDiscoveredMatter();
  
  const { xp, level, completedMilestones } = useProgressionStore();
  const particles = useParticleStore(state => state.particles);
  
  const { agents, isRunning, resetSimulation } = useBioStore();
  const { setGameMode } = useChemistryStore();
  const { resetUniverse, elements, compounds } = useInventory();

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

  const universeStats = useMemo(() => {
      const totalElements = Object.values(elements).reduce((a, b) => a + b, 0);
      const totalCompounds = Object.values(compounds).reduce((a, b) => a + b, 0);
      return { totalElements, totalCompounds };
  }, [elements, compounds]);

  const handleReset = () => {
    if (window.confirm("WARNING: This will collapse the universe back into a singularity. All progress will be lost. Are you sure?")) {
      resetUniverse(); // Inventory -> 0
      executeReset(); // Physics
      resetSimulation(); // Biology
      setGameMode('career'); // Chemistry
      setIntroComplete(false); // Reset Intro
      setCurrentView('universe'); // Return to Universe View
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white p-6 overflow-y-auto animate-[fadeIn_0.5s_ease-out]">
      
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white">
              COMMAND HUB
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Universal Control & Monitoring Station
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             <div className="text-right">
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Universal Mass</div>
                 <div className="text-xl font-mono text-blue-300">{(universeStats.totalElements + universeStats.totalCompounds).toExponential(2)} u</div>
             </div>
             <div className="w-px bg-slate-800 h-10"></div>
             <div className="text-right">
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Entropia</div>
                 <div className="text-xl font-mono text-purple-300">Stable</div>
             </div>
          </div>
        </header>

        {/* Main Grid: Labs (Left) & Controls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Labs Section (Takes 2 columns) */}
            <section className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Active Laboratories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LabCard 
                        title="Physics Lab" 
                        icon="⚛️" 
                        color="blue"
                        desc="Subatomic manipulation & assembly."
                        stats={[
                            { label: 'Particles', value: physicsStats.particles },
                            { label: 'Discoveries', value: physicsStats.discovered },
                        ]}
                        onClick={() => onNavigate('particle')}
                    />

                    <LabCard 
                        title="Chemistry Lab" 
                        icon="⚗️" 
                        color="green"
                        desc="Molecular synthesis & testing."
                        stats={[
                            { label: 'Elements', value: universeStats.totalElements },
                            { label: 'Compounds', value: universeStats.totalCompounds },
                        ]}
                        onClick={() => onNavigate('chemistry')}
                    />

                    <LabCard 
                        title="Biology Lab" 
                        icon="🧫" 
                        color="teal"
                        desc="Cellular engineering & evolution."
                        stats={[
                            { label: 'Population', value: bioStats.population },
                            { label: 'Status', value: bioStats.status },
                        ]}
                        onClick={() => onNavigate('biology')}
                    />

                    <LabCard 
                        title="Academy" 
                        icon="🎓" 
                        color="yellow"
                        desc="Universal fabrication manuals."
                        stats={[
                            { label: 'Level', value: level },
                            { label: 'Specialization', value: 'Polymath' },
                        ]}
                        onClick={() => onNavigate('tutorials')}
                    />

                    <LabCard 
                        title="Goals & Missions" 
                        icon="🏆" 
                        color="indigo"
                        desc="Active research objectives & rewards."
                        stats={[
                            { label: 'Active', value: 'Physics, Chem, Bio' },
                            { label: 'Completed', value: useProgressionStore.getState().completedQuests.length },
                        ]}
                        onClick={() => onNavigate('goals')}
                    />

                    <LabCard 
                        title="Cosmic Timeline" 
                        icon="⏳" 
                        color="purple"
                        desc="Universe evolution milestones."
                        stats={[
                            { label: 'Era', value: completedMilestones.length },
                            { label: 'Total XP', value: xp },
                        ]}
                        onClick={() => onNavigate('progress')}
                    />
                </div>
            </section>

            {/* Controls Section (Takes 1 column) */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                    <span className="text-xl">🛠️</span> System Controls
                </h3>
                
                {/* Sandbox Mode */}
                <div className={`rounded-2xl border p-6 transition-all duration-300 ${isSandboxMode ? 'bg-amber-900/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-slate-900/50 border-slate-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className={`text-lg font-bold flex items-center gap-2 ${isSandboxMode ? 'text-amber-400' : 'text-slate-300'}`}>
                                <span className="text-2xl">🔓</span> Sandbox Mode
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {isSandboxMode ? 'Unlocks all items. Pauses progression.' : 'Standard progression enabled.'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsSandboxMode(!isSandboxMode)}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isSandboxMode ? 'bg-amber-500' : 'bg-slate-700'}`}
                            title="Toggle Sandbox Mode"
                        >
                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isSandboxMode ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-900/10 rounded-2xl border border-red-900/30 p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
                    <button 
                        onClick={handleReset}
                        className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <span>⚠️</span> Collapse Universe
                    </button>
                </div>

            </section>
        </div>

      </div>
    </div>
  );
};

// --- Sub-components ---

const LabCard = ({ title, icon, color, desc, stats, onClick }) => {
    const colorClasses = {
        blue: 'hover:border-blue-500/50 hover:shadow-blue-500/10 text-blue-400',
        green: 'hover:border-green-500/50 hover:shadow-green-500/10 text-green-400',
        teal: 'hover:border-teal-500/50 hover:shadow-teal-500/10 text-teal-400',
        yellow: 'hover:border-yellow-500/50 hover:shadow-yellow-500/10 text-yellow-400',
        purple: 'hover:border-purple-500/50 hover:shadow-purple-500/10 text-purple-400',
        indigo: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10 text-indigo-400',
    };

    const bgColorClasses = {
        blue: 'bg-blue-500/20',
        green: 'bg-green-500/20',
        teal: 'bg-teal-500/20',
        yellow: 'bg-yellow-500/20',
        purple: 'bg-purple-500/20',
        indigo: 'bg-indigo-500/20',
    };

    return (
        <div 
            onClick={onClick}
            className={`group relative bg-slate-900/50 rounded-2xl p-6 border border-slate-800 cursor-pointer overflow-hidden transition-all ${colorClasses[color]} h-full`}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl grayscale group-hover:grayscale-0`}>
                {icon}
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 ${bgColorClasses[color]} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-inherit transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-1">{desc}</p>
                
                <div className="space-y-2 border-t border-slate-800 pt-4 mt-auto">
                    {stats.map((s, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <span className="text-slate-500">{s.label}</span>
                            <span className={`font-mono font-bold`}>{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hub;
