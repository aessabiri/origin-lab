import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SimulationManager, Epoch } from './SimulationManager';
import { useStore } from '../store';
import { usePlanetaryStore } from '../store/planetaryStore';
import { useInventory } from '../store/inventory';

const EPOCHS = [
  { id: Epoch.BIG_BANG, key: 'BIG_BANG', label: 'Big Bang', timeLabel: '0s', tag: 'Singularity & Inflation' },
  { id: Epoch.PLASMA, key: 'PLASMA', label: 'Plasma', timeLabel: '1 µs', tag: 'Quark-Gluon Soup' },
  { id: Epoch.STELLAR_DAWN, key: 'STELLAR_DAWN', label: 'First Stars', timeLabel: '100 My', tag: 'Jeans Collapse' },
  { id: Epoch.GALAXY_FORMATION, key: 'GALAXY_FORMATION', label: 'Galaxy', timeLabel: '500 My', tag: 'Spiral Density Waves' },
  { id: Epoch.SOLAR_SYSTEM, key: 'SOLAR_SYSTEM', label: 'Solar System', timeLabel: '9 By', tag: 'Protoplanetary Disc' },
  { id: Epoch.EARTH, key: 'EARTH', label: 'Earth', timeLabel: '13.8 By', tag: 'Terrestrial Biosphere' },
];

const PLANET_NAMES = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

const UniverseSimulationView = () => {
  const containerRef = useRef(null);
  const managerRef = useRef(null);

  const setCurrentView = useStore(state => state.setCurrentView);
  const showMessage = useStore(state => state.showMessage);

  const [currentEpoch, setCurrentEpoch] = useState(Epoch.BIG_BANG);
  const [epochData, setEpochData] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [metrics, setMetrics] = useState(null);
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(null);

  // Initialize Simulation Engine
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const manager = new SimulationManager(container);
    managerRef.current = manager;

    // Start animation loop
    manager.start();
    setEpochData(manager.getEpochData());

    const updateInterval = setInterval(() => {
      if (managerRef.current) {
        setMetrics(managerRef.current.getGranularMetrics());
      }
    }, 500);

    return () => {
      clearInterval(updateInterval);
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  const handleSelectEpoch = useCallback((epoch) => {
    if (!managerRef.current) return;
    setCurrentEpoch(epoch);
    managerRef.current.setEpoch(epoch);
    setSelectedPlanetIndex(null);
    setEpochData(managerRef.current.getEpochData());
  }, []);

  const handleTogglePause = useCallback(() => {
    if (!managerRef.current) return;
    const paused = managerRef.current.togglePause();
    setIsPaused(paused);
  }, []);

  const handleSpeedChange = useCallback((newSpeed) => {
    if (!managerRef.current) return;
    managerRef.current.setTimeScale(newSpeed);
    setSpeed(newSpeed);
  }, []);

  const handleSelectPlanet = useCallback((index) => {
    if (!managerRef.current) return;
    setSelectedPlanetIndex(index);
    managerRef.current.focusOnIndex(index);
  }, []);

  const handleDeploySeed = useCallback(() => {
    if (!managerRef.current) return;
    managerRef.current.deploySeed();
    useInventory.getState().markDiscovered('LUCA');
    showMessage('🌱 Primordial LUCA Seed deployed into Earth\'s ocean!');
  }, [showMessage]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none font-mono text-white">
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* TOP TIMELINE HUD */}
      <header className="absolute top-4 left-6 right-6 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-full max-w-4xl bg-[#070c18]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3.5 shadow-[0_0_40px_rgba(6,182,212,0.15)] pointer-events-auto">
          {/* Timeline Bar */}
          <div className="flex items-center justify-between relative px-2 mb-2">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />
            {EPOCHS.map((ep, idx) => {
              const isActive = currentEpoch === ep.id;
              const isPast = currentEpoch > ep.id;
              return (
                <button
                  key={ep.key}
                  onClick={() => handleSelectEpoch(ep.id)}
                  className={`relative z-10 flex flex-col items-center group transition-all duration-300 ${
                    isActive ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-300 shadow-[0_0_15px_#22d3ee]'
                        : isPast
                        ? 'border-cyan-600 bg-cyan-900'
                        : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'
                    }`}
                  />
                  <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider ${
                    isActive ? 'text-cyan-300 font-black' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {ep.label}
                  </span>
                  <span className="text-[8px] text-slate-500">{ep.timeLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* LEFT SCI-FI MISSION & EPOCH DATA PANEL */}
      <aside aria-label="Cosmic telemetry" className="absolute top-28 left-6 z-20 w-84 bg-[#070c18]/90 backdrop-blur-xl border border-cyan-500/25 rounded-2xl p-4 shadow-2xl pointer-events-auto max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
        {epochData && (
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 mb-3">
              <div>
                <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest">COSMIC TELEMETRY</span>
                <h2 className="text-base font-black text-white tracking-wide">{epochData.title}</h2>
              </div>
              <span className="text-xl">🌌</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {epochData.info}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px] mb-4">
              <div className="bg-[#0b1325]/80 p-2.5 rounded-xl border border-cyan-500/10">
                <span className="text-slate-500 block uppercase">Cosmic Epoch</span>
                <span className="font-bold text-cyan-200">{epochData.time}</span>
              </div>
              <div className="bg-[#0b1325]/80 p-2.5 rounded-xl border border-cyan-500/10">
                <span className="text-slate-500 block uppercase">Temperature</span>
                <span className="font-bold text-amber-300">{epochData.temp}</span>
              </div>
              <div className="bg-[#0b1325]/80 p-2.5 rounded-xl border border-cyan-500/10 col-span-2">
                <span className="text-slate-500 block uppercase">Density</span>
                <span className="font-bold text-emerald-300">{epochData.density}</span>
              </div>
            </div>

            {/* SOLAR SYSTEM PLANET SELECTION */}
            {currentEpoch === Epoch.SOLAR_SYSTEM && (
              <div className="border-t border-cyan-500/20 pt-3 mb-3">
                <span className="text-[9px] font-bold uppercase text-slate-400 block mb-2">Focus Planetary Body:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PLANET_NAMES.map((name, idx) => (
                    <button
                      key={name}
                      onClick={() => handleSelectPlanet(idx)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-left border transition-all ${
                        selectedPlanetIndex === idx
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* EARTH HABITABILITY & SPECTROSCOPY */}
            {currentEpoch === Epoch.EARTH && (
              <div className="border-t border-cyan-500/20 pt-3">
                <span className="text-[9px] font-bold uppercase text-emerald-400 block mb-2">Atmospheric Spectrometry:</span>
                <div className="space-y-1.5 text-[10px] mb-3">
                  <div className="flex justify-between text-slate-400">
                    <span>O2 (Oxygen)</span>
                    <span className="text-emerald-300 font-bold">{metrics?.oxygen ? `${Math.round(metrics.oxygen * 100)}%` : '21%'}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${(metrics?.oxygen || 0.21) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>H2O (Hydrosphere)</span>
                    <span className="text-sky-300 font-bold">71%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: '71%' }} />
                  </div>
                </div>

                <button
                  onClick={handleDeploySeed}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>🌱</span>
                  <span>Deploy Primordial Seed (LUCA)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* BOTTOM SCIENTIFIC NAVIGATION PORTALS & CONTROLS */}
      <footer className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        {/* Lab Fast-Travel Portals */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            onClick={() => setCurrentView('particle')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090f1e]/90 hover:bg-[#121c38] border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
            title="Explore Quantum Substrate in Particle Lab"
          >
            <span>⚛️</span>
            <span>Particle Lab (Quarks & Atoms)</span>
          </button>

          {currentEpoch === Epoch.EARTH && (
            <button
              onClick={() => setCurrentView('planetary')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090f1e]/90 hover:bg-[#121c38] border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
              title="Enter Terrestrial Planetary Biosphere"
            >
              <span>🌍</span>
              <span>Planetary View (Evolution)</span>
            </button>
          )}
        </div>

        {/* Playback & Time Scrubbing Controls */}
        <div className="flex items-center gap-2 bg-[#070c18]/90 backdrop-blur-xl border border-cyan-500/30 px-3.5 py-2 rounded-2xl shadow-xl pointer-events-auto">
          <button
            onClick={handleTogglePause}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[10px] font-black uppercase text-cyan-200 transition-all active:scale-95"
          >
            {isPaused ? '▶ Play' : '⏸ Pause'}
          </button>

          <div className="flex gap-1 border-l border-slate-800 pl-2">
            {[1, 5, 25].map(s => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  speed === s ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UniverseSimulationView;
