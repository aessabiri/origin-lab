import React, { useRef, useEffect, useState } from 'react';
import { useBioStore } from '../store';
import { useBioSimulation } from '../hooks/useBioSimulation';
import PetriDish from './PetriDish'; // Renamed logically in UI but kept file for now
import { BakelitePanel, NixieTube, AnalogGauge, Oscilloscope } from '../../components/VisualPrimitives';

const IncubationChamber = ({ onInject, hasDesign, isRunning, agents }) => {
  const [activeTab, setActiveTab] = useState('environment'); // 'environment' | 'telemetry'
  
  // Environment Controls State (Mocked functionality for UI, hook up later)
  const [temp, setTemp] = useState(37.0);
  const [radiation, setRadiation] = useState(0);
  const [nutrients, setNutrients] = useState(80);

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center p-8 relative overflow-hidden bg-[#050505]">
       
       {/* Machine Chassis */}
       <div className="relative w-[90vh] aspect-square bg-[#1a1a1a] rounded-[3rem] border-8 border-[#2a2a2a] shadow-2xl flex flex-col overflow-hidden group">
          
          {/* Top Control Panel */}
          <div className="h-24 bg-[#111] border-b-4 border-[#333] flex justify-between items-center px-8 shadow-md z-20">
             <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${isRunning ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-red-900'}`}></div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Chamber_Status</span>
                   <span className={`text-lg font-mono font-bold ${isRunning ? 'text-green-500' : 'text-zinc-600'}`}>
                      {isRunning ? 'LIFE_DETECTED' : 'STANDBY'}
                   </span>
                </div>
             </div>
             
             {/* Data Screen */}
             <div className="w-72 h-16 bg-black border-2 border-zinc-800 rounded flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 scanline pointer-events-none"></div>
                <div className="text-center font-mono">
                   <span className="text-[8px] text-green-700 block">POPULATION_DENSITY</span>
                   <span className="text-2xl text-green-500 font-bold">{agents.length.toString().padStart(3, '0')}</span>
                   <span className="text-[8px] text-green-700 block">ENTITIES</span>
                </div>
             </div>
          </div>

          {/* Main Tank Viewport */}
          <div className="flex-1 relative bg-[#081a1a] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] overflow-hidden">
             {/* Fluid Effect */}
             <div className="absolute inset-0 bg-gradient-to-b from-teal-900/10 to-teal-900/30 pointer-events-none z-10"></div>
             
             {/* The Simulation Canvas */}
             <div className="absolute inset-0 z-0">
                <PetriDish />
             </div>

             {/* HUD Overlays */}
             <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="bg-black/40 backdrop-blur-sm border border-teal-500/30 p-2 rounded text-[10px] text-teal-400 font-mono">
                   TEMP: {temp.toFixed(1)}°C
                </div>
                <div className="bg-black/40 backdrop-blur-sm border border-teal-500/30 p-2 rounded text-[10px] text-teal-400 font-mono">
                   RAD: {radiation}%
                </div>
             </div>

             {/* Glass Reflection */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-20 rounded-b-[2.5rem]"></div>
          </div>

          {/* Bottom Control Deck */}
          <div className="h-48 bg-[#111] border-t-4 border-[#333] flex relative z-30">
             {/* Left Panel: Tabs */}
             <div className="w-16 border-r border-[#333] flex flex-col items-center py-4 gap-4">
                <button 
                  onClick={() => setActiveTab('environment')}
                  className={`w-10 h-10 rounded flex items-center justify-center transition-all ${activeTab === 'environment' ? 'bg-teal-900 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'bg-[#222] text-zinc-600 hover:text-zinc-400'}`}
                  title="Environment"
                >
                  🌡️
                </button>
                <button 
                  onClick={() => setActiveTab('telemetry')}
                  className={`w-10 h-10 rounded flex items-center justify-center transition-all ${activeTab === 'telemetry' ? 'bg-amber-900 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-[#222] text-zinc-600 hover:text-zinc-400'}`}
                  title="Telemetry"
                >
                  📊
                </button>
             </div>

             {/* Middle Panel: Controls */}
             <div className="flex-1 p-6 flex gap-8 items-center justify-center">
                {activeTab === 'environment' && (
                   <>
                      <div className="flex flex-col items-center gap-2">
                         <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Temperature</span>
                         <input 
                           type="range" min="0" max="100" value={temp} 
                           onChange={(e) => setTemp(parseFloat(e.target.value))}
                           className="w-32 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-500" 
                         />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                         <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Nutrients</span>
                         <input 
                           type="range" min="0" max="100" value={nutrients} 
                           onChange={(e) => setNutrients(parseFloat(e.target.value))}
                           className="w-32 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500" 
                         />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                         <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Radiation</span>
                         <input 
                           type="range" min="0" max="100" value={radiation} 
                           onChange={(e) => setRadiation(parseFloat(e.target.value))}
                           className="w-32 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                         />
                      </div>
                   </>
                )}

                {activeTab === 'telemetry' && (
                   <div className="flex gap-4 w-full h-full">
                      <div className="flex-1 bg-black border border-zinc-800 rounded p-2 relative overflow-hidden">
                         <span className="absolute top-1 left-1 text-[8px] text-amber-600 font-mono">POPULATION_HISTORY</span>
                         <Oscilloscope active={isRunning} color="amber" />
                      </div>
                      <div className="flex-1 bg-black border border-zinc-800 rounded p-2 relative overflow-hidden">
                         <span className="absolute top-1 left-1 text-[8px] text-teal-600 font-mono">ENERGY_AVG</span>
                         <Oscilloscope active={isRunning} color="teal" speed={0.5} />
                      </div>
                   </div>
                )}
             </div>

             {/* Right Panel: Inject */}
             <div className="w-48 border-l border-[#333] flex items-center justify-center p-4">
                <button 
                  onClick={onInject}
                  disabled={!hasDesign}
                  className={`
                    relative w-full h-full rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2
                    ${hasDesign 
                      ? 'bg-gradient-to-b from-[#222] to-black border-amber-500/50 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95' 
                      : 'bg-[#111] border-zinc-800 text-zinc-700 cursor-not-allowed'}
                  `}
                >
                   <span className={`text-3xl ${hasDesign ? 'animate-pulse' : ''}`}>{hasDesign ? '⚡' : '🚫'}</span>
                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${hasDesign ? 'text-amber-500' : 'text-zinc-700'}`}>
                      {hasDesign ? 'INJECT' : 'NO_DNA'}
                   </span>
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default IncubationChamber;
