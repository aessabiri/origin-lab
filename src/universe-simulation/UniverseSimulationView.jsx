import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SimulationManager, Epoch } from './SimulationManager';
import { useStore } from '../store';
import { usePlanetaryStore } from '../store/planetaryStore';
import { useInventory } from '../store/inventory';

const EPOCHS = [
  { id: Epoch.BIG_BANG, key: 'BIG_BANG', label: 'Big Bang', timeLabel: '0s', tag: 'Singularity & Inflation' },
  { id: Epoch.PLASMA, key: 'PLASMA', label: 'Plasma', timeLabel: '1 µs', tag: 'Quark-Gluon Soup' },
  { id: Epoch.STELLAR_DAWN, key: 'STELLAR_DAWN', label: 'First Stars', timeLabel: '100 My', tag: 'Jeans Collapse' },
  { id: Epoch.GALAXY_FORMATION, key: 'GALAXY_FORMATION', label: 'Galaxy', timeLabel: '1 By', tag: 'Spiral Density Waves' },
  { id: Epoch.SOLAR_SYSTEM, key: 'SOLAR_SYSTEM', label: 'Solar System', timeLabel: '9 By', tag: 'Protoplanetary Disc' },
  { id: Epoch.EARTH, key: 'EARTH', label: 'Earth', timeLabel: '13.8 By', tag: 'Terrestrial Biosphere' },
];

const CELESTIAL_BODIES = [
  { label: 'Sun (Overview)', index: null },
  { label: 'Mercury', index: 0 },
  { label: 'Venus', index: 1 },
  { label: 'Earth', index: 2 },
  { label: 'Mars', index: 3 },
  { label: 'Jupiter', index: 4 },
  { label: 'Saturn', index: 5 },
  { label: 'Uranus', index: 6 },
  { label: 'Neptune', index: 7 }
];

const EARTH_ERAS = [
  { name: 'Hadean (Lava)', val: 0.0, storeEra: 'HADEAN' },
  { name: 'Archean (Water)', val: 0.4, storeEra: 'ARCHEAN' },
  { name: 'Proterozoic (Ice)', val: 0.7, storeEra: 'PROTEROZOIC' },
  { name: 'Modern (Life)', val: 1.0, storeEra: 'PHANEROZOIC' }
];

const UniverseSimulationView = () => {
  const containerRef = useRef(null);
  const managerRef = useRef(null);
  const popupRef = useRef(null);

  const setCurrentView = useStore((state) => state.setCurrentView);
  const showMessage = useStore((state) => state.showMessage);
  const setPlanetaryEra = usePlanetaryStore((state) => state.setEra);

  const [currentEpoch, setCurrentEpoch] = useState(Epoch.BIG_BANG);
  const [epochData, setEpochData] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [metrics, setMetrics] = useState(null);
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(null);
  const [selectedPlanetData, setSelectedPlanetData] = useState(null);
  const [earthEraVal, setEarthEraVal] = useState(1.0);
  const [seedDeployed, setSeedDeployed] = useState(false);

  // Initialize Desktop Universe Simulation Engine + Audio + 3D Screen Projection Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const manager = new SimulationManager(container);
    managerRef.current = manager;

    // Initialize audio on first user interaction (Desktop universe-simulation behavior)
    const handleFirstClick = () => {
      manager.initAudio();
      window.removeEventListener('mousedown', handleFirstClick);
    };
    window.addEventListener('mousedown', handleFirstClick);

    // Live frame callback for granular metrics & 3D-projected floating planet popup
    manager.onUpdate(() => {
      const m = manager.getGranularMetrics();
      if (m) setMetrics(m);

      if (popupRef.current) {
        const stage = manager.getCurrentStage();
        if (stage && typeof stage.getFocusTarget === 'function') {
          const target = stage.getFocusTarget();
          if (target) {
            const screenPos = manager.getProjectedPosition(target);
            if (screenPos && Number.isFinite(screenPos.x) && Number.isFinite(screenPos.y)) {
              const clampedX = Math.max(320, Math.min(window.innerWidth - 340, screenPos.x + 24));
              const clampedY = Math.max(90, Math.min(window.innerHeight - 280, screenPos.y - 60));
              popupRef.current.style.left = `${clampedX}px`;
              popupRef.current.style.top = `${clampedY}px`;
            }
          }
        }
      }
    });

    manager.start();
    setEpochData(manager.getEpochData());
    setMetrics(manager.getGranularMetrics());

    return () => {
      window.removeEventListener('mousedown', handleFirstClick);
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  const handleSelectEpoch = useCallback((epoch) => {
    if (!managerRef.current) return;
    setCurrentEpoch(epoch);
    managerRef.current.setEpoch(epoch);
    setSelectedPlanetIndex(null);
    setSelectedPlanetData(null);
    setEpochData(managerRef.current.getEpochData());
    setMetrics(managerRef.current.getGranularMetrics());
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

    if (index !== null) {
      const stage = managerRef.current.getCurrentStage();
      if (stage && stage.planets && stage.planets[index]) {
        setSelectedPlanetData(stage.planets[index]);
      }
    } else {
      setSelectedPlanetData(null);
    }
    setMetrics(managerRef.current.getGranularMetrics());
  }, []);

  const handleSelectEarthEra = useCallback(
    (eraObj) => {
      if (!managerRef.current) return;
      setEarthEraVal(eraObj.val);
      managerRef.current.setEarthStage(eraObj.val);
      if (setPlanetaryEra && eraObj.storeEra) {
        setPlanetaryEra(eraObj.storeEra);
      }
      setTimeout(() => {
        if (managerRef.current) {
          setMetrics(managerRef.current.getGranularMetrics());
        }
      }, 60);
    },
    [setPlanetaryEra]
  );

  const handleDeploySeed = useCallback(() => {
    if (!managerRef.current) return;
    // If deploying from Solar System popup, seamlessly transition to 3D Earth first!
    if (currentEpoch !== Epoch.EARTH) {
      setCurrentEpoch(Epoch.EARTH);
      setSelectedPlanetIndex(null);
      setSelectedPlanetData(null);
      managerRef.current.setEpoch(Epoch.EARTH);
      setTimeout(() => {
        if (managerRef.current) {
          managerRef.current.setEarthStage(1.0);
          managerRef.current.deploySeed();
          setEpochData(managerRef.current.getEpochData());
        }
      }, 2100);
    } else {
      managerRef.current.setEarthStage(1.0);
      setEarthEraVal(1.0);
      managerRef.current.deploySeed();
    }
    setSeedDeployed(true);
    useInventory.getState().markDiscovered('LUCA');
    showMessage('🌱 Biological Seed Deployed — Chlorophyll & Biosphere Spreading Across 3D Earth!');
  }, [currentEpoch, showMessage]);

  const habitabilityScore = selectedPlanetData?.scanData
    ? Math.round((selectedPlanetData.scanData.o2 * 2 + selectedPlanetData.scanData.h2o) / 2.5)
    : null;

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none font-mono text-white">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* SHIP COCKPIT CORNER OVERLAY & SCANNING RETICLE (From Desktop universe-simulation) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg" />

        {currentEpoch === Epoch.SOLAR_SYSTEM && selectedPlanetData && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cyan-400/30 flex items-center justify-center animate-pulse">
            <div className="w-36 h-36 rounded-full border border-dashed border-cyan-300/40 animate-[spin_20s_linear_infinite]" />
            <div className="absolute -top-5 text-[9px] font-mono text-cyan-300 tracking-widest uppercase">
              Target Locked // {selectedPlanetData.name}
            </div>
          </div>
        )}
      </div>

      {/* TOP TIMELINE HUD */}
      <header className="absolute top-4 left-6 right-6 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-full max-w-4xl argon-panel rounded-2xl p-3.5 shadow-[0_0_40px_rgba(6,182,212,0.15)] pointer-events-auto">
          <div className="flex items-center justify-between relative px-2 mb-1">
            <div className="absolute left-6 right-6 top-2 h-0.5 bg-slate-800 rounded-full z-0" />
            {EPOCHS.map((ep) => {
              const isActive = currentEpoch === ep.id;
              const isPast = currentEpoch > ep.id;
              return (
                <button
                  key={ep.key}
                  onClick={() => handleSelectEpoch(ep.id)}
                  className={`relative z-10 flex flex-col items-center group transition-all duration-300 cursor-pointer ${
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
                  <span
                    className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider ${
                      isActive
                        ? 'text-cyan-300 font-black'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {ep.label}
                  </span>
                  <span className="text-[8px] text-slate-500">{ep.timeLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* LEFT SCI-FI MISSION, DEEP VITAL SIGNS & SPECTROMETER PANEL */}
      <aside
        aria-label="Cosmic telemetry"
        className="absolute top-24 left-6 z-20 w-84 argon-panel rounded-2xl p-4 shadow-2xl pointer-events-auto max-h-[calc(100vh-170px)] overflow-y-auto custom-scrollbar space-y-3.5"
      >
        {epochData && (
          <>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div>
                <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest">
                  MISSION TELEMETRY
                </span>
                <h2 className="font-display text-base font-bold text-white tracking-wide">
                  {epochData.title}
                </h2>
              </div>
              <span className="text-xl">🌌</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{epochData.info}</p>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-[#090f1d] p-2.5 rounded-xl border border-white/[0.07]">
                <span className="text-slate-500 block uppercase text-[9px]">Cosmic Time</span>
                <span className="font-bold text-cyan-200 tabular-telemetry">{epochData.time}</span>
              </div>
              <div className="bg-[#090f1d] p-2.5 rounded-xl border border-white/[0.07]">
                <span className="text-slate-500 block uppercase text-[9px]">Core Temp</span>
                <span className="font-bold text-amber-300 tabular-telemetry">{epochData.temp}</span>
              </div>
              <div className="bg-[#090f1d] p-2.5 rounded-xl border border-white/[0.07] col-span-2">
                <span className="text-slate-500 block uppercase text-[9px]">Matter Density</span>
                <span className="font-bold text-emerald-300">{epochData.density}</span>
              </div>
            </div>

            {/* DEEP INFO PANEL: PLANETARY VITAL SIGNS (From Desktop universe-simulation) */}
            {metrics && (
              <div className="bg-[#060b16] border border-cyan-500/25 rounded-xl p-3 space-y-1.5 text-[10px]">
                <div className="text-[9px] font-black uppercase tracking-widest text-cyan-400 border-b border-white/10 pb-1 mb-1">
                  Planetary Vital Signs
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PHASE:</span>
                  <span className="font-bold text-white">{metrics.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SURFACE TEMP:</span>
                  <span className="font-bold text-amber-300">{metrics.temp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ATMOSPHERE:</span>
                  <span className="font-bold text-cyan-200">{metrics.atmo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OXYGEN:</span>
                  <span className="font-bold text-emerald-300">{metrics.o2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="font-bold text-teal-300">{metrics.status}</span>
                </div>
              </div>
            )}

            {/* SOLAR SYSTEM CELESTIAL BODIES & ATMOSPHERIC SPECTROMETER */}
            {currentEpoch === Epoch.SOLAR_SYSTEM && (
              <div className="border-t border-white/10 pt-3 space-y-3">
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 block mb-2">
                    Celestial Bodies (Click to Orbit & Scan):
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {CELESTIAL_BODIES.map((body) => (
                      <button
                        key={body.label}
                        onClick={() => handleSelectPlanet(body.index)}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center border transition-all cursor-pointer truncate ${
                          selectedPlanetIndex === body.index
                            ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                            : 'border-white/10 bg-[#090f1d] text-slate-400 hover:text-white hover:border-slate-600'
                        }`}
                      >
                        {body.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Atmospheric Spectrometer Bars */}
                {selectedPlanetData && (
                  <div className="bg-[#060b16] border border-cyan-500/30 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider">
                        Atmospheric Spectrometer
                      </span>
                      <span
                        className={`text-[10px] font-black ${
                          habitabilityScore > 50 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        HABITABILITY: {habitabilityScore}%
                      </span>
                    </div>

                    {[
                      { label: 'O₂', val: selectedPlanetData.scanData.o2, color: 'bg-emerald-400' },
                      { label: 'H₂O', val: selectedPlanetData.scanData.h2o, color: 'bg-sky-400' },
                      { label: 'CARBON', val: selectedPlanetData.scanData.carbon, color: 'bg-amber-400' }
                    ].map((bar) => (
                      <div key={bar.label} className="space-y-0.5">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-400">{bar.label}</span>
                          <span className="text-white font-bold">{bar.val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${bar.color} transition-all duration-500`}
                            style={{ width: `${Math.min(100, bar.val)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EARTH GEOLOGICAL ERAS & LUCA SEED DEPLOYMENT (From Desktop universe-simulation) */}
            {currentEpoch === Epoch.EARTH && (
              <div className="border-t border-white/10 pt-3 space-y-3">
                <div>
                  <span className="text-[9px] font-bold uppercase text-cyan-300 block mb-2">
                    3D Earth Geological Eras:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {EARTH_ERAS.map((eraItem) => (
                      <button
                        key={eraItem.name}
                        onClick={() => handleSelectEarthEra(eraItem)}
                        className={`px-2.5 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          Math.abs(earthEraVal - eraItem.val) < 0.05
                            ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                            : 'bg-[#090f1d] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {eraItem.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDeploySeed}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🌱</span>
                  <span>
                    {seedDeployed ? 'Re-Pulse LUCA Biosphere Wave' : 'Deploy Biological Seed (LUCA)'}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </aside>

      {/* 3D SCREEN-PROJECTED FLOATING PLANET POPUP (From Desktop universe-simulation) */}
      {currentEpoch === Epoch.SOLAR_SYSTEM && selectedPlanetData && (
        <div
          ref={popupRef}
          style={{ left: '52%', top: '34%' }}
          className="fixed z-30 w-72 argon-panel rounded-2xl p-4 border border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.3)] pointer-events-auto transition-all duration-75"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
            <h3 className="font-display text-sm font-bold text-cyan-300 uppercase tracking-wider">
              {selectedPlanetData.name}
            </h3>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200">
              {habitabilityScore}% Habitable
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans mb-2.5">{selectedPlanetData.info}</p>
          <div className="space-y-1 text-[10px] font-mono">
            <div>
              <span className="text-slate-400">Composition:</span>{' '}
              <span className="text-white font-bold">{selectedPlanetData.composition}</span>
            </div>
            <div>
              <span className="text-slate-400">Temperature:</span>{' '}
              <span className="text-amber-300 font-bold">{selectedPlanetData.temperature}</span>
            </div>
            <div>
              <span className="text-slate-400">Atmosphere:</span>{' '}
              <span className="text-cyan-200 font-bold">{selectedPlanetData.atmosphere}</span>
            </div>
          </div>

          {selectedPlanetData.name === 'Earth' && habitabilityScore > 50 && (
            <button
              onClick={handleDeploySeed}
              className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              🌱 Deploy Biological Seed (Zoom to Earth)
            </button>
          )}
        </div>
      )}

      {/* BOTTOM SCIENTIFIC NAVIGATION PORTALS & TIME CONTROLS */}
      <footer className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            onClick={() => setCurrentView('particle')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl argon-panel hover:border-cyan-400/50 text-cyan-300 text-xs font-bold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>⚛️</span>
            <span>Particle Lab (Quarks & 3D Orbitals)</span>
          </button>

          {(currentEpoch === Epoch.EARTH || currentEpoch === Epoch.SOLAR_SYSTEM) && (
            <button
              onClick={() => setCurrentView('planetary')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl argon-panel hover:border-emerald-400/50 text-emerald-300 text-xs font-bold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>🌍</span>
              <span>Planetary Biosphere Lab (Cladogram & Evolution)</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 argon-panel px-3.5 py-2 rounded-2xl shadow-xl pointer-events-auto">
          <button
            onClick={handleTogglePause}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[10px] font-black uppercase text-cyan-200 transition-all active:scale-95 cursor-pointer"
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          <div className="flex gap-1 border-l border-slate-800 pl-2">
            {[1, 5, 25].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                  speed === s
                    ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200'
                    : 'text-slate-400 hover:text-white'
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
