import React from 'react';
import { usePlanetaryStore } from '../store/planetaryStore';
import { useStore } from '../store';

const PlanetaryView = () => {
  const { temperature, atmosphere, ph, era, population } = usePlanetaryStore();
  const { isSandboxMode } = useStore();

  const tempC = (temperature - 273.15).toFixed(1);
  
  // Calculate Earth Color based on Era/Stats
  let earthColor = 'bg-red-800'; // Hadean (Molten)
  if (era === 'ARCHEAN') earthColor = 'bg-orange-700'; // Cooling
  if (temperature < 250) earthColor = 'bg-white'; // Snowball Earth
  if (atmosphere.oxygen > 10) earthColor = 'bg-blue-600'; // Oceans & Life
  if (population > 1000) earthColor = 'bg-green-600'; // Vegetation

  return (
    <div className="w-full h-full bg-black text-white p-8 overflow-hidden relative">
      {/* Background Stars */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        
        {/* Left Panel: Planet Stats */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-6 h-fit">
          <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2">
            <span className="text-3xl">🌍</span> Planetary Status
          </h2>
          
          <div className="space-y-6">
            <StatRow label="Geological Era" value={era} color="text-amber-400" />
            <StatRow label="Surface Temp" value={`${tempC}°C`} color={temperature > 300 ? 'text-red-400' : 'text-blue-300'} />
            <StatRow label="Ocean pH" value={ph.toFixed(1)} color="text-teal-400" />
            <StatRow label="Global Biomass" value={population.toLocaleString()} color="text-green-400" />
          </div>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <h3 className="text-lg font-bold text-slate-300 mb-4">Atmosphere Composition</h3>
            <div className="space-y-3">
              <GasBar label="Nitrogen (N2)" percent={atmosphere.nitrogen} color="bg-gray-500" />
              <GasBar label="Oxygen (O2)" percent={atmosphere.oxygen} color="bg-blue-500" />
              <GasBar label="Carbon Dioxide (CO2)" percent={atmosphere.co2} color="bg-red-500" />
            </div>
          </div>
        </div>

        {/* Center: The Planet Visualization */}
        <div className="flex flex-col items-center justify-center relative">
           <div className={`w-96 h-96 rounded-full shadow-[inset_-20px_-20px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(100,200,255,0.1)] transition-colors duration-1000 relative overflow-hidden ${earthColor} animate-[spin_60s_linear_infinite]`}>
               {/* Cloud Layer (Simple CSS) */}
               <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] animate-[spin_40s_linear_infinite_reverse]"></div>
               
               {/* Atmosphere Glow */}
               <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(59,130,246,0.4)] pointer-events-none"></div>
           </div>
           
           {/* Controls (Sandbox) */}
           {isSandboxMode && (
             <div className="mt-12 bg-slate-900/80 p-4 rounded-xl border border-slate-700 flex gap-4">
                <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/40" onClick={() => usePlanetaryStore.getState().changeTemperature(10)}>+ Heat</button>
                <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/40" onClick={() => usePlanetaryStore.getState().changeTemperature(-10)}>- Cool</button>
             </div>
           )}
        </div>

        {/* Right Panel: Events & Evolution */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-6 h-fit">
           <h2 className="text-2xl font-bold text-purple-300 mb-4">Evolutionary Path</h2>
           <div className="space-y-4">
              <EventCard title="Primordial Soup" active={era === 'HADEAN'} />
              <EventCard title="First Cells (Prokaryotes)" active={era === 'ARCHEAN'} />
              <EventCard title="Photosynthesis" active={atmosphere.oxygen > 1} />
              <EventCard title="Multicellular Life" active={false} locked />
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Subcomponents ---
const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
    <span className="text-slate-400">{label}</span>
    <span className={`font-mono text-xl font-bold ${color}`}>{value}</span>
  </div>
);

const GasBar = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-xs text-slate-400 mb-1">
      <span>{label}</span>
      <span>{percent.toFixed(2)}%</span>
    </div>
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, percent)}%` }}></div>
    </div>
  </div>
);

const EventCard = ({ title, active, locked }) => (
  <div className={`p-4 rounded-lg border flex items-center gap-3 ${active ? 'bg-green-900/20 border-green-700 text-green-300' : locked ? 'bg-slate-800/50 border-slate-800 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
     <span className="text-xl">{active ? '✅' : locked ? '🔒' : '⏳'}</span>
     <span className="font-bold">{title}</span>
  </div>
);

export default PlanetaryView;
