import React, { useMemo } from 'react';
import { useStore } from '../store';
import { useParticleStore } from '../particle-lab/store';
import { useBioStore } from '../biology-lab/store';
import { useChemistryStore } from '../chemistry-lab/store';
import { useInventory } from '../store/inventory';

const Hub = ({ onNavigate }) => {
  const { 
    discoveredAtoms, discoveredMolecules, 
    executeReset, setCurrentView, setIntroComplete,
    globalSettings, setGlobalSettings,
    openExclusive
  } = useStore();
  
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

  const toggleSetting = (key) => {
      setGlobalSettings({ [key]: !globalSettings[key] });
  };

  const updateVolume = (key, val) => {
      setGlobalSettings({ [key]: parseFloat(val) });
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white p-6 overflow-y-auto animate-[fadeIn_0.5s_ease-out]">
      
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
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

        {/* Lab Access Grid */}
        <section>
            <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Active Laboratories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Physics */}
                <LabCard 
                    title="Physics Lab" 
                    icon="⚛️" 
                    color="blue"
                    desc="Subatomic manipulation and atomic assembly."
                    stats={[
                        { label: 'Particles', value: physicsStats.particles },
                        { label: 'Discoveries', value: physicsStats.discovered },
                    ]}
                    onClick={() => onNavigate('particle')}
                />

                {/* Chemistry */}
                <LabCard 
                    title="Chemistry Lab" 
                    icon="⚗️" 
                    color="green"
                    desc="Molecular synthesis and reaction testing."
                    stats={[
                        { label: 'Elements', value: universeStats.totalElements },
                        { label: 'Compounds', value: universeStats.totalCompounds },
                    ]}
                    onClick={() => onNavigate('chemistry')}
                />

                {/* Biology */}
                <LabCard 
                    title="Biology Lab" 
                    icon="🧫" 
                    color="teal"
                    desc="Cellular engineering and evolution simulation."
                    stats={[
                        { label: 'Population', value: bioStats.population },
                        { label: 'Status', value: bioStats.status },
                    ]}
                    onClick={() => onNavigate('biology')}
                />
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* System Configuration (Settings) */}
            <section className="lg:col-span-2 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
                    <span className="text-xl">⚙️</span> System Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Audio Settings */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Audio Channels</h4>
                        <div className="space-y-1">
                            <label className="flex justify-between text-xs text-slate-400"><span>Master</span> <span>{(globalSettings.masterVolume * 100).toFixed(0)}%</span></label>
                            <input 
                                type="range" min="0" max="1" step="0.05" 
                                value={globalSettings.masterVolume} 
                                onChange={(e) => updateVolume('masterVolume', e.target.value)}
                                className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-xs text-slate-400"><span>Music</span> <span>{(globalSettings.musicVolume * 100).toFixed(0)}%</span></label>
                            <input 
                                type="range" min="0" max="1" step="0.05" 
                                value={globalSettings.musicVolume} 
                                onChange={(e) => updateVolume('musicVolume', e.target.value)}
                                className="w-full accent-purple-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-xs text-slate-400"><span>SFX</span> <span>{(globalSettings.sfxVolume * 100).toFixed(0)}%</span></label>
                            <input 
                                type="range" min="0" max="1" step="0.05" 
                                value={globalSettings.sfxVolume} 
                                onChange={(e) => updateVolume('sfxVolume', e.target.value)}
                                className="w-full accent-green-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Graphics & UX */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Visual & Interface</h4>
                        
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="text-sm">
                                <div className="text-white font-semibold">Graphics Quality</div>
                                <div className="text-xs text-slate-500">Particle count & effects</div>
                            </div>
                            <select 
                                value={globalSettings.graphicsQuality}
                                onChange={(e) => setGlobalSettings({ graphicsQuality: e.target.value })}
                                className="bg-slate-900 border border-slate-600 text-xs rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="low">Low (Performance)</option>
                                <option value="medium">Medium</option>
                                <option value="high">High (Quality)</option>
                            </select>
                        </div>

                        <Toggle 
                            label="Show Tooltips" 
                            desc="Display helpers and hints"
                            checked={globalSettings.showTooltips} 
                            onChange={() => toggleSetting('showTooltips')} 
                        />
                        
                        <Toggle 
                            label="Reduced Motion" 
                            desc="Disable parallax and intense effects"
                            checked={globalSettings.reducedMotion} 
                            onChange={() => toggleSetting('reducedMotion')} 
                        />
                    </div>
                </div>
            </section>

            {/* Quick Actions & Danger Zone */}
            <section className="space-y-6">
                
                {/* Database Access */}
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                    <h3 className="text-lg font-bold text-slate-300 mb-4">Database Access</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => { onNavigate('particle'); openExclusive('isCodexVisible', 'isCodexVisible'); }}
                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition-colors group"
                        >
                            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📖</div>
                            <div className="text-sm font-bold text-slate-300">Codex</div>
                        </button>
                        <button 
                            onClick={() => { onNavigate('particle'); openExclusive('isPeriodicTableVisible', 'isPeriodicTableVisible'); }}
                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition-colors group"
                        >
                            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📊</div>
                            <div className="text-sm font-bold text-slate-300">Elements</div>
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-900/10 rounded-2xl border border-red-900/30 p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
                    <p className="text-xs text-red-300/60 mb-4">
                        Irreversible actions related to the simulation state.
                    </p>
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

const LabCard = ({ title, icon, color, desc, stats, onClick }) => (
    <div 
        onClick={onClick}
        className={`group relative bg-slate-900/50 rounded-2xl p-6 border border-slate-800 cursor-pointer overflow-hidden transition-all hover:border-${color}-500/50 hover:shadow-2xl hover:shadow-${color}-500/10`}
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl grayscale group-hover:grayscale-0`}>
            {icon}
        </div>
        
        <div className="relative z-10">
            <div className={`w-12 h-12 bg-${color}-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform text-${color}-400`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-${color}-300 transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">{desc}</p>
            
            <div className="space-y-2 border-t border-slate-800 pt-4">
                {stats.map((s, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-500">{s.label}</span>
                        <span className={`font-mono font-bold text-${color}-400`}>{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div>
            <div className="text-sm text-white font-semibold">{label}</div>
            {desc && <div className="text-xs text-slate-500">{desc}</div>}
        </div>
        <button 
            onClick={onChange}
            className={`w-10 h-5 rounded-full p-1 transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-600'}`}
        >
            <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

export default Hub;