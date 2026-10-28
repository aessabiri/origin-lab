import React, { useState } from 'react';
import { useBioStore } from '../store';
import PetriDish from './PetriDish';
import { Oscilloscope } from '../../components/VisualPrimitives';

const IncubationChamber = ({ onInject, hasDesign, isRunning, agents = [] }) => {
  const [activeTab, setActiveTab] = useState('environment'); // 'environment' | 'telemetry' | 'trial'
  const { 
    environment = { temperature: 37, nutrients: 80, radiation: 0 }, 
    setEnvironment,
    stressTrial = {},
    startStressTrial,
    cancelStressTrial,
    seedCertifiedOrganismToEarth
  } = useBioStore();
  
  const temp = environment.temperature ?? 37.0;
  const radiation = environment.radiation ?? 0;
  const nutrients = environment.nutrients ?? 80;

  const setTemp = (val) => setEnvironment({ temperature: val });
  const setRadiation = (val) => setEnvironment({ radiation: val });
  const setNutrients = (val) => setEnvironment({ nutrients: val });

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center p-6 relative overflow-hidden bg-[#070a13] select-none">
       
       {/* High-Craft Bioreactor Chassis */}
       <div className="relative w-full max-w-4xl h-[86vh] bg-[#0c1220]/95 backdrop-blur-2xl rounded-3xl border border-teal-500/25 shadow-[0_24px_64px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
          
          {/* Top Control Bar & Telemetry HUD */}
          <div className="h-20 bg-[#090f1d] border-b border-teal-500/20 flex justify-between items-center px-8 shrink-0">
             <div className="flex items-center gap-4">
                <div className={`w-3.5 h-3.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]' : 'bg-slate-700'}`}></div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-mono font-black text-teal-400 uppercase tracking-widest">Bioreactor Status</span>
                   <span className={`text-base font-mono font-black ${isRunning ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {isRunning ? 'BIOSPHERE ACTIVE' : 'SYSTEM STANDBY'}
                   </span>
                </div>
             </div>
             
             {/* Live Population Screen */}
             <div className="flex items-center gap-4 px-5 py-2 bg-[#060a14] border border-teal-500/30 rounded-2xl shadow-inner">
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">Population Count</span>
                   <span className="text-2xl font-mono font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                      {agents.length.toString().padStart(3, '0')}
                   </span>
                </div>
                <div className="h-6 w-px bg-teal-500/20" />
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">Thermal Core</span>
                   <span className="text-sm font-mono font-bold text-amber-300">
                      {temp.toFixed(1)}°C
                   </span>
                </div>
             </div>
          </div>

          {/* Main Tank Viewport (Petri Dish Canvas) */}
          <div className="flex-1 relative bg-[#040811] shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
             {/* Fluid Ambient Wash */}
             <div className="absolute inset-0 bg-gradient-to-b from-teal-950/20 via-transparent to-cyan-950/30 pointer-events-none z-10" />
             
             {/* The Simulation Canvas */}
             <div className="absolute inset-0 z-0">
                <PetriDish />
             </div>

             {/* HUD Environmental Corner Overlay */}
             <div className="absolute top-4 left-4 z-20 flex gap-2 pointer-events-none">
                <div className="bg-[#090f1d]/90 backdrop-blur-md border border-teal-500/30 px-3 py-1.5 rounded-xl text-[10px] text-teal-300 font-mono shadow-md">
                   TEMP: <strong className="text-white">{temp.toFixed(1)}°C</strong>
                </div>
                <div className="bg-[#090f1d]/90 backdrop-blur-md border border-teal-500/30 px-3 py-1.5 rounded-xl text-[10px] text-teal-300 font-mono shadow-md">
                   NUTRIENTS: <strong className="text-white">{nutrients}%</strong>
                </div>
                <div className="bg-[#090f1d]/90 backdrop-blur-md border border-teal-500/30 px-3 py-1.5 rounded-xl text-[10px] text-teal-300 font-mono shadow-md">
                   MUTATION (RAD): <strong className="text-amber-400">{radiation}%</strong>
                </div>
             </div>

             {/* Sleek Lens Reflection */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/3 via-transparent to-transparent pointer-events-none z-20" />
          </div>

          {/* Bottom Telemetry & Control Deck */}
          <div className="h-40 bg-[#090f1d] border-t border-teal-500/20 flex relative z-30 shrink-0">
             {/* Left Tab Switcher */}
             <div className="w-20 border-r border-teal-500/15 flex flex-col items-center py-4 gap-3">
                <button 
                  onClick={() => setActiveTab('environment')}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer border ${
                    activeTab === 'environment' 
                      ? 'bg-teal-500/20 border-teal-400/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
                      : 'bg-slate-900/60 border-transparent text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Environmental Dials"
                >
                  <span className="text-lg">🌡️</span>
                </button>
                <button 
                  onClick={() => setActiveTab('telemetry')}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer border ${
                    activeTab === 'telemetry' 
                      ? 'bg-teal-500/20 border-teal-400/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
                      : 'bg-slate-900/60 border-transparent text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Waveform Telemetry"
                >
                  <span className="text-lg">📊</span>
                </button>
                <button 
                  onClick={() => setActiveTab('trial')}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer border relative ${
                    activeTab === 'trial' 
                      ? 'bg-teal-500/20 border-teal-400/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
                      : 'bg-slate-900/60 border-transparent text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Stress Certification Trial"
                >
                  <span className="text-lg">🛡️</span>
                  {stressTrial?.active && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                  )}
                  {stressTrial?.certified && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
                  )}
                </button>
             </div>

             {/* Middle Parameter Sliders / Oscilloscope / Stress Trial */}
             <div className="flex-1 p-5 flex gap-8 items-center justify-center">
                {activeTab === 'environment' && (
                   <div className="grid grid-cols-3 gap-6 w-full max-w-xl">
                      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#060a14] border border-teal-500/15">
                         <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400 uppercase font-bold">Temperature</span>
                            <span className="text-teal-300 font-black">{temp.toFixed(1)}°C</span>
                         </div>
                         <input 
                           type="range" min="0" max="100" step="0.5" value={temp} 
                           onChange={(e) => setTemp(parseFloat(e.target.value))}
                           className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400" 
                         />
                      </div>

                      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#060a14] border border-teal-500/15">
                         <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400 uppercase font-bold">Nutrient Broth</span>
                            <span className="text-emerald-300 font-black">{nutrients}%</span>
                         </div>
                         <input 
                           type="range" min="0" max="100" value={nutrients} 
                           onChange={(e) => setNutrients(parseFloat(e.target.value))}
                           className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400" 
                         />
                      </div>

                      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#060a14] border border-teal-500/15">
                         <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400 uppercase font-bold">UV Radiation</span>
                            <span className="text-amber-400 font-black">{radiation}%</span>
                         </div>
                         <input 
                           type="range" min="0" max="100" value={radiation} 
                           onChange={(e) => setRadiation(parseFloat(e.target.value))}
                           className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400" 
                         />
                      </div>
                   </div>
                )}

                {activeTab === 'telemetry' && (
                   <div className="flex gap-4 w-full h-full max-w-xl">
                      <div className="flex-1 bg-[#060a14] border border-teal-500/20 rounded-2xl p-2 relative overflow-hidden">
                         <span className="absolute top-1.5 left-2 text-[8px] text-amber-400 font-mono font-bold uppercase">Biomass Variance</span>
                         <Oscilloscope active={isRunning} color="amber" />
                      </div>
                      <div className="flex-1 bg-[#060a14] border border-teal-500/20 rounded-2xl p-2 relative overflow-hidden">
                         <span className="absolute top-1.5 left-2 text-[8px] text-cyan-400 font-mono font-bold uppercase">Metabolic ATP Drift</span>
                         <Oscilloscope active={isRunning} color="teal" />
                      </div>
                   </div>
                )}

                {activeTab === 'trial' && (
                   <div className="w-full max-w-xl flex flex-col justify-center gap-3">
                      {stressTrial?.active ? (
                        <div className="flex flex-col gap-2.5 p-3.5 bg-[#060a14] rounded-2xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                           <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-amber-300 font-black flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                {stressTrial.message}
                              </span>
                              <span className="text-slate-400 text-[10px]">
                                {stressTrial.elapsed.toFixed(0)}s / {stressTrial.totalDuration}s
                              </span>
                           </div>

                           {/* Progress Bar */}
                           <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-teal-400 transition-all duration-300"
                                style={{ width: `${Math.min(100, (stressTrial.elapsed / stressTrial.totalDuration) * 100)}%` }}
                              />
                           </div>

                           {/* 3-Stage Badges */}
                           <div className="grid grid-cols-3 gap-2 text-[9px] font-mono text-center mt-1">
                              <div className={`p-1 rounded-lg border ${stressTrial.stage === 'thermal_shock' ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                 1. Thermal Shock (88°C)
                              </div>
                              <div className={`p-1 rounded-lg border ${stressTrial.stage === 'uv_flux' ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                 2. UV Flux (85%)
                              </div>
                              <div className={`p-1 rounded-lg border ${stressTrial.stage === 'starvation' ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                 3. Starvation (5%)
                              </div>
                           </div>

                           <button 
                             onClick={cancelStressTrial}
                             className="mt-1 py-1 px-3 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 rounded-xl text-[10px] font-mono font-bold transition-all active:scale-95"
                           >
                             Abort Trial
                           </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 p-3.5 bg-[#060a14] rounded-2xl border border-teal-500/20">
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                 <span className="text-lg">🛡️</span>
                                 <div>
                                    <h4 className="text-xs font-mono font-black text-slate-200 uppercase">Viability Stress Protocol</h4>
                                    <p className="text-[10px] text-slate-400 font-sans">Archean heat, UV radiation, and starvation challenge</p>
                                 </div>
                              </div>
                              {stressTrial?.fitnessScore !== null && (
                                 <div className="text-right">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Fitness Score</span>
                                    <span className={`text-base font-mono font-black ${stressTrial?.certified ? 'text-emerald-400' : 'text-amber-400'}`}>
                                       {stressTrial.fitnessScore}/100
                                    </span>
                                 </div>
                              )}
                           </div>

                           <div className="text-[10px] font-mono text-slate-300 bg-[#090f1d] p-2 rounded-xl border border-teal-500/15">
                              {stressTrial?.message || 'Ready to evaluate organism fitness and membrane stability.'}
                           </div>

                           <div className="flex gap-2 mt-1">
                              <button 
                                onClick={startStressTrial}
                                disabled={agents.length === 0}
                                className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                                   agents.length > 0 
                                     ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-md active:scale-95' 
                                     : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                }`}
                              >
                                 <span>⚡</span>
                                 <span>{agents.length > 0 ? 'START 30s STRESS TRIAL' : 'INJECT ORGANISM FIRST'}</span>
                              </button>

                              {stressTrial?.certified && (
                                 <button 
                                   onClick={seedCertifiedOrganismToEarth}
                                   className="py-2 px-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white rounded-xl text-xs font-mono font-black transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)] active:scale-95 flex items-center gap-1.5"
                                 >
                                    <span>🌍</span>
                                    <span>SEED EARTH</span>
                                 </button>
                              )}
                           </div>
                        </div>
                      )}
                   </div>
                )}
             </div>

             {/* Right Panel: Inject LUCA / Seed Ocean Button */}
             <div className="w-56 border-l border-teal-500/15 flex flex-col items-center justify-center p-4 gap-2">
                <button 
                  onClick={onInject}
                  disabled={!hasDesign}
                  className={`
                    w-full flex-1 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-lg
                    ${hasDesign 
                      ? 'bg-gradient-to-br from-teal-500 via-emerald-600 to-sky-600 border-teal-300/40 text-white hover:shadow-[0_0_24px_rgba(20,184,166,0.5)] active:scale-95' 
                      : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'}
                  `}
                >
                   <span className="text-xl">{hasDesign ? '⚡' : '🔒'}</span>
                   <span className="text-[9px] font-mono font-black uppercase tracking-widest">
                      {hasDesign ? 'INJECT LUCA' : 'DESIGN EMPTY'}
                   </span>
                </button>

                {stressTrial?.certified && (
                  <button 
                    onClick={seedCertifiedOrganismToEarth}
                    className="w-full py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 border border-sky-400/50 text-white text-[9px] font-mono font-black uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] active:scale-95 transition-all"
                  >
                    🌍 SEED PLANETARY OCEAN
                  </button>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default IncubationChamber;
