import React, { useEffect, useState } from 'react';
import { usePlanetaryStore } from '../store/planetaryStore';
import { useStore } from '../store';

const PlanetaryView = () => {
  const { 
    temperature, atmosphere, ph, era, 
    seededOrganism, species, ecoMetrics, events,
    updateAtmosphere, changeTemperature, setEra, evolveStep, triggerEvent
  } = usePlanetaryStore();
  const { isSandboxMode } = useStore();

  const tempC = (temperature - 273.15).toFixed(1);

  // Dynamic Earth Styling
  let earthColor = 'bg-red-900'; // Hadean (Magma)
  let cloudColor = 'opacity-20';
  let atmosphereGlow = 'shadow-red-500/40';

  if (era === 'ARCHEAN') {
    earthColor = 'bg-teal-900'; // Greenish-iron oceans
    cloudColor = 'opacity-40';
    atmosphereGlow = 'shadow-orange-500/40';
  } else if (era === 'PROTEROZOIC') {
    if (temperature < 250) {
      earthColor = 'bg-slate-200'; // Snowball Earth
      cloudColor = 'opacity-80';
      atmosphereGlow = 'shadow-slate-300/60';
    } else {
      earthColor = 'bg-blue-600'; // Oxygenated blue
      cloudColor = 'opacity-50';
      atmosphereGlow = 'shadow-blue-400/50';
    }
  } else if (era === 'PHANEROZOIC') {
    earthColor = 'bg-[url("https://www.transparenttextures.com/patterns/noise-lines.png")] bg-green-700'; // Lush green continents
    cloudColor = 'opacity-60';
    atmosphereGlow = 'shadow-cyan-400/60';
  }

  // Effect to evolve automatically
  useEffect(() => {
    if (!seededOrganism) return;
    const interval = setInterval(() => {
      evolveStep(1, {}); // 1 time unit
    }, 1000);
    return () => clearInterval(interval);
  }, [seededOrganism, evolveStep]);

  // Effect to check era milestones
  useEffect(() => {
    if (temperature < 350 && era === 'HADEAN') setEra('ARCHEAN');
    if (atmosphere.oxygen > 1 && era === 'ARCHEAN') {
      setEra('PROTEROZOIC');
      triggerEvent('Great Oxidation Event');
    }
    if (ecoMetrics.biodiversityIndex > 5 && era === 'PROTEROZOIC') {
      setEra('PHANEROZOIC');
      triggerEvent('Cambrian Explosion');
    }
  }, [temperature, atmosphere, ecoMetrics, era, setEra, triggerEvent]);

  return (
    <div className="w-full h-full bg-black text-white p-6 overflow-y-auto relative flex flex-col gap-6 font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

      <header className="z-10 flex justify-between items-center bg-slate-900/60 backdrop-blur border border-slate-700 p-4 rounded-xl">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 uppercase tracking-wider">
          Planetary Simulation HUD
        </h1>
        <div className="flex gap-4">
          <StatBox label="Era" value={era} />
          <StatBox label="Biomass" value={ecoMetrics.globalBiomass.toFixed(1)} />
          <StatBox label="Biodiversity" value={ecoMetrics.biodiversityIndex} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 z-10 flex-1 min-h-[600px]">
        {/* Left: Environment Controllers */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-6 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-blue-300 border-b border-slate-700 pb-2">Environment Controls</h2>
          
          <div className="space-y-4">
             <ControlPanel 
               title="Volcano Venting" 
               desc="Inject CO2 into atmosphere" 
               action={() => updateAtmosphere('co2', 0.5)}
               icon="🌋"
             />
             <ControlPanel 
               title="Ocean Temp Regulator" 
               desc={`Current: ${tempC}°C`} 
               action={() => changeTemperature(5)}
               actionDesc="+ Heat"
               action2={() => changeTemperature(-5)}
               actionDesc2="- Cool"
               icon="🌊"
             />
             <ControlPanel 
               title="Asteroid Deflection" 
               desc="Trigger mass extinction" 
               action={() => triggerEvent('Asteroid Impact')}
               icon="☄️"
               color="hover:bg-red-900/50"
             />
             <ControlPanel 
               title="Solar Radiation Filter" 
               desc="Alter global albedo" 
               action={() => changeTemperature(-10)}
               icon="☀️"
             />
          </div>

          <div className="mt-auto pt-4 border-t border-slate-700">
            <h3 className="text-sm font-bold text-slate-400 mb-2">Atmosphere</h3>
            <GasBar label="N2" percent={atmosphere.nitrogen} color="bg-gray-500" />
            <GasBar label="O2" percent={atmosphere.oxygen} color="bg-blue-500" />
            <GasBar label="CO2" percent={atmosphere.co2} color="bg-red-500" />
          </div>
        </div>

        {/* Center: Interactive Visual Earth */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur border border-slate-700 rounded-2xl relative overflow-hidden p-6">
          <div className={`w-80 h-80 lg:w-[400px] lg:h-[400px] rounded-full shadow-[inset_-30px_-30px_100px_rgba(0,0,0,0.9),0_0_80px_rgba(255,255,255,0.1)] transition-colors duration-1000 relative overflow-hidden ${earthColor} animate-[spin_120s_linear_infinite]`}>
             {/* Clouds */}
             <div className={`absolute inset-0 ${cloudColor} bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] animate-[spin_80s_linear_infinite_reverse]`}></div>
             {/* Atmosphere Glow */}
             <div className={`absolute inset-0 rounded-full shadow-[0_0_80px_var(--tw-shadow-color)] pointer-events-none ${atmosphereGlow}`}></div>
             {/* Night Lights for Civilization */}
             {events.some(e => e.type === 'Civilization') && (
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 mix-blend-screen"></div>
             )}
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/80 border border-slate-600 rounded-full flex gap-4 backdrop-blur">
             <span className="text-sm font-mono text-slate-300">Temp: {tempC}°C</span>
             <span className="text-sm font-mono text-slate-300">pH: {ph.toFixed(1)}</span>
          </div>
        </div>

        {/* Right: Evolutionary Tree & Events */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-emerald-300 border-b border-slate-700 pb-2 mb-4">Evolutionary Tree</h2>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
               {seededOrganism ? (
                 species.map((sp, i) => (
                   <SpeciesCard key={i} species={sp} pop={(ecoMetrics.globalBiomass / species.length).toFixed(1)} />
                 ))
               ) : (
                 <div className="h-full flex items-center justify-center text-slate-500 italic text-center p-4">
                   No life detected. Use Biology Lab to seed LUCA.
                 </div>
               )}
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-6 h-64 flex flex-col">
            <h2 className="text-xl font-bold text-amber-300 border-b border-slate-700 pb-2 mb-4">Milestones</h2>
            <div className="flex-1 overflow-y-auto space-y-2 text-sm font-mono">
               {events.length === 0 && <div className="text-slate-600">Awaiting monumental shifts...</div>}
               {events.map((e, i) => (
                 <div key={i} className="flex gap-3 text-slate-300">
                    <span className="text-amber-500">[{new Date(e.timestamp).toLocaleTimeString()}]</span>
                    <span>{e.type}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Subcomponents
const StatBox = ({ label, value }) => (
  <div className="bg-slate-800/80 border border-slate-600 px-4 py-2 rounded-lg text-center min-w-[100px]">
    <div className="text-[10px] text-slate-400 uppercase tracking-widest">{label}</div>
    <div className="font-mono font-bold text-lg">{value}</div>
  </div>
);

const ControlPanel = ({ title, desc, action, actionDesc = "Execute", action2, actionDesc2, icon, color="hover:bg-slate-800/80" }) => (
  <div className={`p-3 rounded-lg border border-slate-700 bg-slate-800/40 transition-colors ${color} flex flex-col gap-2`}>
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="font-bold text-sm text-slate-200">{title}</div>
        <div className="text-xs text-slate-400">{desc}</div>
      </div>
    </div>
    <div className="flex gap-2">
       <button onClick={action} className="flex-1 py-1 px-2 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold transition">
         {actionDesc}
       </button>
       {action2 && (
         <button onClick={action2} className="flex-1 py-1 px-2 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold transition">
           {actionDesc2}
         </button>
       )}
    </div>
  </div>
);

const GasBar = ({ label, percent, color }) => (
  <div className="mb-2">
    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
      <span>{label}</span>
      <span>{percent.toFixed(2)}%</span>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, percent)}%` }}></div>
    </div>
  </div>
);

const SpeciesCard = ({ species, pop }) => (
  <div className="p-3 bg-emerald-900/20 border border-emerald-800/50 rounded-lg flex flex-col gap-1">
    <div className="flex justify-between items-center">
      <span className="font-bold text-emerald-300">{species.name || 'Species'}</span>
      <span className="text-xs text-emerald-500 font-mono">Pop: {pop}</span>
    </div>
    {species.traits && (
      <div className="flex gap-2 text-[10px] text-emerald-600/80 uppercase">
        {species.traits.phototroph && <span>Phototroph</span>}
        {species.traits.chemotroph && <span>Chemotroph</span>}
      </div>
    )}
  </div>
);

export default PlanetaryView;
