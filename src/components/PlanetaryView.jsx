import React, { useEffect, useState, useMemo } from 'react';
import { usePlanetaryStore } from '../store/planetaryStore';
import { useStore } from '../store';

const TABS = {
  CLADOGRAM: 'CLADOGRAM',
  SPECIES: 'SPECIES',
  NEURAL: 'NEURAL',
  FOSSIL: 'FOSSIL'
};

const PlanetaryView = () => {
  const { 
    temperature, atmosphere, ph, era, 
    seededOrganism, species, cladogram, ecoMetrics, events,
    activeCatastrophe, catastropheCooldowns,
    updateAtmosphere, changeTemperature, setEra, evolveStep, 
    triggerCatastrophicEvent
  } = usePlanetaryStore();
  const { isSandboxMode } = useStore();

  const [activeTab, setActiveTab] = useState(TABS.CLADOGRAM);
  const [selectedClade, setSelectedClade] = useState(null);

  const tempC = (temperature - 273.15).toFixed(1);

  // Dynamic Earth Globe Aesthetics
  let earthStyle = 'bg-red-950 border-red-500/30';
  let earthInner = 'from-red-900 via-amber-950 to-stone-950';
  let cloudOpacity = 'opacity-20';
  let atmosphereGlow = 'shadow-[0_0_90px_rgba(239,68,68,0.35)]';

  if (era === 'ARCHEAN') {
    earthStyle = 'bg-teal-950 border-teal-500/30';
    earthInner = 'from-teal-800 via-emerald-950 to-slate-950';
    cloudOpacity = 'opacity-35';
    atmosphereGlow = 'shadow-[0_0_90px_rgba(20,184,166,0.4)]';
  } else if (era === 'PROTEROZOIC') {
    if (temperature < 250) {
      earthStyle = 'bg-slate-200 border-cyan-300/50';
      earthInner = 'from-slate-100 via-sky-200 to-slate-300 text-slate-900';
      cloudOpacity = 'opacity-70';
      atmosphereGlow = 'shadow-[0_0_90px_rgba(226,232,240,0.6)]';
    } else {
      earthStyle = 'bg-sky-900 border-sky-500/40';
      earthInner = 'from-sky-700 via-cyan-900 to-slate-950';
      cloudOpacity = 'opacity-45';
      atmosphereGlow = 'shadow-[0_0_90px_rgba(56,189,248,0.45)]';
    }
  } else if (era === 'PHANEROZOIC') {
    earthStyle = 'bg-emerald-950 border-emerald-500/40';
    earthInner = 'from-emerald-700 via-sky-800 to-blue-950';
    cloudOpacity = 'opacity-60';
    atmosphereGlow = 'shadow-[0_0_100px_rgba(52,211,153,0.5)]';
  } else if (era === 'ANTHROPOCENE') {
    earthStyle = 'bg-slate-950 border-cyan-400/50';
    earthInner = 'from-emerald-600 via-blue-800 to-slate-950';
    cloudOpacity = 'opacity-55';
    atmosphereGlow = 'shadow-[0_0_110px_rgba(6,182,212,0.6)]';
  }

  // Simulation tick loop
  useEffect(() => {
    if (!seededOrganism) return;
    const interval = setInterval(() => {
      evolveStep(1, {});
    }, 1000);
    return () => clearInterval(interval);
  }, [seededOrganism, evolveStep]);

  // Synchronize era milestones
  useEffect(() => {
    if (temperature < 350 && era === 'HADEAN' && seededOrganism) {
      setEra('ARCHEAN');
    }
  }, [temperature, era, seededOrganism, setEra]);

  // Default selected clade to latest unlocked
  useEffect(() => {
    if (!selectedClade && cladogram) {
      const unlocked = cladogram.filter(c => c.unlocked);
      if (unlocked.length > 0) {
        setSelectedClade(unlocked[unlocked.length - 1]);
      }
    }
  }, [cladogram, selectedClade]);

  return (
    <div className="w-full h-full bg-[#070a13] text-white p-5 lg:p-6 overflow-y-auto relative flex flex-col gap-5 font-sans select-none custom-scrollbar">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(56,189,248,0.07),transparent_50%),radial-gradient(circle_at_80%_75%,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />

      {/* Top Telemetry Header */}
      <header className="z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-[#0c1220]/90 backdrop-blur-2xl border border-cyan-500/20 p-4 lg:p-5 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-inner">
            🌍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-emerald-300 uppercase tracking-widest">
                Planetary Biosphere HUD
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                era === 'ANTHROPOCENE' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 animate-pulse' :
                era === 'PHANEROZOIC' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                era === 'PROTEROZOIC' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                era === 'ARCHEAN' ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' :
                'bg-red-500/20 text-red-300 border-red-500/40'
              }`}>
                {era}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Geological Epoch & Anthropocene Lineage Matrix</p>
          </div>
        </div>

        {/* Global Telemetry Metrics */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <StatBox label="Biomass" value={`${ecoMetrics.globalBiomass.toFixed(1)} Mt`} sub="Organic Carbon" />
          <StatBox label="Biodiversity" value={`${ecoMetrics.biodiversityIndex} Clades`} sub="Active Taxa" />
          <StatBox label="O2 Saturation" value={`${ecoMetrics.oxygenationLevel}%`} sub={`${atmosphere.oxygen.toFixed(1)}% atm`} />
          <StatBox label="Encephalization" value={`EQ ${ecoMetrics.cephalizationIndex.toFixed(2)}`} sub="Brain / Body Ratio" />
          <StatBox label="Cognitive Score" value={`${ecoMetrics.cognitiveComplexity}%`} sub={era === 'ANTHROPOCENE' ? 'Sapience Active' : 'Pre-Sapient'} />
        </div>
      </header>

      {/* Main 3-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 z-10 flex-1 min-h-[640px]">
        
        {/* LEFT COLUMN: Terraforming & Catastrophic Interventions (3 Cols) */}
        <div className="lg:col-span-3 bg-[#0c1220]/90 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-5 flex flex-col gap-5 shadow-2xl overflow-y-auto custom-scrollbar">
          
          {/* Terraforming Knobs */}
          <div>
            <h2 className="text-xs font-black text-cyan-300 border-b border-cyan-500/20 pb-2.5 uppercase tracking-wider flex items-center gap-2 mb-3">
              <span>⚙️</span> Terraforming Controls
            </h2>
            <div className="space-y-2.5">
              <TerraformControl 
                title="Volcano Outgassing" 
                desc="Inject +0.5% CO2 into atmosphere" 
                action={() => updateAtmosphere('co2', 0.5)}
                actionLabel="+ Degas CO2"
                icon="🌋"
              />
              <TerraformDualControl 
                title="Ocean Thermal Regulator" 
                desc={`Surface Temp: ${tempC}°C (${temperature.toFixed(0)} K)`} 
                actionPlus={() => changeTemperature(5)}
                actionMinus={() => changeTemperature(-5)}
                icon="🌊"
              />
              <TerraformControl 
                title="Albedo Solar Filter" 
                desc="Regulate solar irradiance (-5K)" 
                action={() => changeTemperature(-5)}
                actionLabel="- Cool Albedo"
                icon="☀️"
              />
            </div>
          </div>

          {/* Catastrophic Geological Events */}
          <div>
            <h2 className="text-xs font-black text-amber-300 border-b border-amber-500/20 pb-2.5 uppercase tracking-wider flex items-center gap-2 mb-3">
              <span>☄️</span> Catastrophic Events
            </h2>
            <div className="space-y-2.5">
              <CatastropheButton
                title="Supervolcano Eruption"
                desc="Volcanic winter, acidifies ocean, -40% biomass"
                icon="🌋"
                cooldown={catastropheCooldowns?.SUPERVOLCANO || 0}
                onClick={() => triggerCatastrophicEvent('SUPERVOLCANO')}
                variant="red"
              />
              <CatastropheButton
                title="Chicxulub Asteroid Strike"
                desc="Mass extinction, firestorms, -75% biomass"
                icon="☄️"
                cooldown={catastropheCooldowns?.ASTEROID_IMPACT || 0}
                onClick={() => triggerCatastrophicEvent('ASTEROID_IMPACT')}
                variant="amber"
              />
              <CatastropheButton
                title="Carrington Solar Flare"
                desc="Strips ozone, radiation mutagenic surge"
                icon="☀️"
                cooldown={catastropheCooldowns?.SOLAR_SUPERFLARE || 0}
                onClick={() => triggerCatastrophicEvent('SOLAR_SUPERFLARE')}
                variant="yellow"
              />
              <CatastropheButton
                title="Cryogenian Snowball Freeze"
                desc="Global glaciation plunge, runaway albedo"
                icon="❄️"
                cooldown={catastropheCooldowns?.GLACIATION || 0}
                onClick={() => triggerCatastrophicEvent('GLACIATION')}
                variant="blue"
              />
              {era === 'ANTHROPOCENE' && (
                <CatastropheButton
                  title="Biosphere Geo-Engineering"
                  desc="Capture carbon & balance biosphere equilibrium"
                  icon="🌐"
                  cooldown={catastropheCooldowns?.GEOENGINEERING || 0}
                  onClick={() => triggerCatastrophicEvent('GEOENGINEERING')}
                  variant="cyan"
                />
              )}
            </div>
          </div>

          {/* Atmospheric Telemetry */}
          <div className="mt-auto pt-4 border-t border-cyan-500/20">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Atmospheric Column</h3>
              <span className="text-[10px] text-cyan-400 font-mono">UV: {ecoMetrics.surfaceUVFlux}%</span>
            </div>
            <GasBar label="N₂ (Nitrogen)" percent={atmosphere.nitrogen} color="bg-slate-400" />
            <GasBar label="O₂ (Oxygen)" percent={atmosphere.oxygen} color="bg-sky-400" />
            <GasBar label="CO₂ (Carbon Dioxide)" percent={atmosphere.co2} color="bg-rose-500" />
            <GasBar label="CH₄ (Methane)" percent={atmosphere.methane * 100} color="bg-amber-400" />
          </div>
        </div>

        {/* CENTER COLUMN: Interactive Planetary Globe & Environmental FX (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#090e1a]/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl relative overflow-hidden p-6 shadow-2xl">
          
          {/* Active Catastrophe Banner */}
          {activeCatastrophe && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl bg-red-950/90 border border-red-500/50 backdrop-blur-xl flex items-center gap-3 shadow-2xl animate-pulse">
              <span className="text-xl">{activeCatastrophe.icon}</span>
              <div>
                <div className="text-xs font-black text-red-200 uppercase tracking-widest">{activeCatastrophe.label}</div>
                <div className="text-[10px] font-mono text-red-400">Duration remaining: {activeCatastrophe.duration.toFixed(0)}s</div>
              </div>
            </div>
          )}

          {/* 3D-Look Planetary Globe */}
          <div className="relative flex items-center justify-center my-auto">
            {/* Outer Atmospheric Aura */}
            <div className={`w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-full transition-all duration-1000 ${atmosphereGlow}`} />

            {/* Globe Sphere */}
            <div className={`absolute w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-full border shadow-[inset_-35px_-35px_120px_rgba(0,0,0,0.95)] transition-all duration-1000 overflow-hidden ${earthStyle}`}>
              
              {/* Planetary Gradient & Surface Texture */}
              <div className={`absolute inset-0 bg-gradient-to-br ${earthInner} animate-[spin_160s_linear_infinite]`}>
                {/* Surface continent patches */}
                {era !== 'HADEAN' && (
                  <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_30%_40%,rgba(34,197,94,0.7)_15%,transparent_50%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.6)_20%,transparent_60%)]" />
                )}
              </div>

              {/* Dynamic Atmospheric Clouds Layer */}
              <div className={`absolute inset-0 ${cloudOpacity} bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.45)_12%,transparent_65%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.3)_10%,transparent_50%)] animate-[spin_90s_linear_infinite_reverse] mix-blend-screen pointer-events-none`} />

              {/* Active Catastrophe FX Overlays */}
              {activeCatastrophe?.type === 'ASTEROID_IMPACT' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400 bg-red-600/40 animate-ping" />
                  <div className="absolute inset-0 bg-red-500/25 mix-blend-color-dodge animate-pulse" />
                </div>
              )}

              {activeCatastrophe?.type === 'SUPERVOLCANO' && (
                <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply backdrop-grayscale animate-pulse pointer-events-none" />
              )}

              {activeCatastrophe?.type === 'SOLAR_SUPERFLARE' && (
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 via-transparent to-purple-500/30 mix-blend-screen animate-pulse pointer-events-none" />
              )}

              {/* Anthropocene Technosphere: Twinkling Night City Lights */}
              {era === 'ANTHROPOCENE' && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(251,191,36,0.85)_2px,transparent_4px),radial-gradient(circle_at_35%_65%,rgba(56,189,248,0.7)_2px,transparent_4px)] [background-size:20px_20px] opacity-75 mix-blend-screen animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Orbiting Anthropocene Satellites Ring */}
            {era === 'ANTHROPOCENE' && (
              <div className="absolute w-[115%] h-[115%] rounded-full border border-dashed border-cyan-400/40 animate-[spin_40s_linear_infinite] pointer-events-none">
                <div className="w-2.5 h-2.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#38bdf8] absolute -top-1 left-1/2 -translate-x-1/2" />
                <div className="w-2 h-2 bg-amber-300 rounded-full shadow-[0_0_6px_#f59e0b] absolute -bottom-1 left-1/2 -translate-x-1/2" />
              </div>
            )}
          </div>

          {/* Bottom Telemetry HUD Capsule */}
          <div className="mt-auto px-5 py-2.5 bg-[#060a14]/90 border border-cyan-500/30 rounded-2xl flex flex-wrap items-center justify-center gap-5 backdrop-blur-xl shadow-xl font-mono text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="text-cyan-400">🌡️</span> Temp: <strong className="text-white">{tempC}°C</strong>
            </span>
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="text-teal-400">🌊</span> Ocean pH: <strong className="text-white">{ph.toFixed(2)}</strong>
            </span>
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="text-amber-400">☀️</span> Surface UV: <strong className="text-white">{ecoMetrics.surfaceUVFlux}%</strong>
            </span>
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="text-indigo-400">🧠</span> EQ: <strong className="text-white">{ecoMetrics.cephalizationIndex.toFixed(2)}</strong>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Cladogram, Neural Metrics, & Fossil Record (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0c1220]/90 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl overflow-hidden">
          
          {/* Navigation Tab Bar */}
          <div className="flex bg-[#070b14] p-1 rounded-2xl border border-cyan-500/20 gap-1">
            <TabButton 
              active={activeTab === TABS.CLADOGRAM} 
              onClick={() => setActiveTab(TABS.CLADOGRAM)} 
              label="Cladogram" 
              icon="🌿" 
            />
            <TabButton 
              active={activeTab === TABS.NEURAL} 
              onClick={() => setActiveTab(TABS.NEURAL)} 
              label="Cephalization" 
              icon="🧠" 
            />
            <TabButton 
              active={activeTab === TABS.SPECIES} 
              onClick={() => setActiveTab(TABS.SPECIES)} 
              label="Species" 
              icon="🧬" 
            />
            <TabButton 
              active={activeTab === TABS.FOSSIL} 
              onClick={() => setActiveTab(TABS.FOSSIL)} 
              label="Fossils" 
              icon="📜" 
            />
          </div>

          {/* TAB CONTENT 1: Phylogenetic Cladogram Tree */}
          {activeTab === TABS.CLADOGRAM && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex justify-between items-center pb-2 border-b border-cyan-500/20 mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Taxonomic Tree of Life</span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {cladogram.filter(c => c.unlocked).length} / {cladogram.length} Radiated
                </span>
              </div>

              {/* Interactive Cladogram Node Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                {cladogram.map((clade, idx) => {
                  const isSelected = selectedClade?.id === clade.id;
                  return (
                    <div 
                      key={clade.id}
                      onClick={() => clade.unlocked && setSelectedClade(clade)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected 
                          ? 'bg-cyan-950/80 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]' 
                          : clade.unlocked 
                          ? 'bg-[#090f1d]/80 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#0c162a]' 
                          : 'bg-[#060a14]/50 border-slate-800/60 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                            <span className="font-black text-xs text-slate-200 tracking-wide">{clade.commonName}</span>
                            {clade.unlocked && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                {clade.era}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400/80 italic mt-0.5">{clade.name}</div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            EQ {clade.eq.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {clade.unlocked ? (
                        <div className="mt-2 text-[10px] text-slate-300 font-mono bg-[#060a14]/60 p-2 rounded-xl border border-cyan-500/10">
                          <div className="text-emerald-300 font-bold mb-0.5">Leap: {clade.innovation}</div>
                          <div className="text-slate-400 text-[9px] line-clamp-2">{clade.description}</div>
                        </div>
                      ) : (
                        <div className="mt-1.5 text-[9px] font-mono text-slate-500 italic">
                          Locked: Awaiting ecological radiation criteria...
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detailed Selected Node Card */}
              {selectedClade && (
                <div className="mt-3 p-3.5 bg-gradient-to-br from-cyan-950/40 to-[#07131a] border border-cyan-400/30 rounded-2xl shadow-xl text-xs font-mono">
                  <div className="flex justify-between items-center text-cyan-300 font-black border-b border-cyan-500/20 pb-1.5 mb-2">
                    <span>{selectedClade.commonName} Dossier</span>
                    <span className="text-[10px] text-slate-400">Cognitive: {selectedClade.cognitiveScore}%</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div><span className="text-slate-500">Niche:</span> {selectedClade.trophicRole}</div>
                    <div><span className="text-slate-500">Innovation:</span> <strong className="text-emerald-300">{selectedClade.innovation}</strong></div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{selectedClade.description}</div>
                    {selectedClade.id === 'hominini' && (
                      <button
                        onClick={() => useStore.getState().setCurrentView('anatomy')}
                        className="mt-3 w-full py-2.5 px-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span>🦴</span>
                        <span>Assemble Homo Sapiens Body (Anatomy Lab)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT 2: Cephalization & Cognitive Metrics */}
          {activeTab === TABS.NEURAL && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
              <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-[#090f1d] border border-indigo-500/30 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">Encephalization Quotient (EQ)</span>
                  <span className="text-base font-black font-mono text-indigo-300">{ecoMetrics.cephalizationIndex.toFixed(2)}</span>
                </div>
                {/* EQ Bar Progress */}
                <div className="w-full h-3 bg-[#070b14] rounded-full border border-indigo-500/30 overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-300 rounded-full transition-all duration-700" 
                    style={{ width: `${Math.min(100, (ecoMetrics.cephalizationIndex / 7.5) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
                  <span>Aneural (0.0)</span>
                  <span>Chordate (0.5)</span>
                  <span>Mammalian (2.0)</span>
                  <span>Sapience (7.5)</span>
                </div>
              </div>

              {/* Neurological Evolution Milestones */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Cognitive Milestones</h3>
                <NeuralStageCard 
                  stage="Diffuse Nerve Net" 
                  desc="Radial nerve network for tactile sensing and contraction" 
                  achieved={ecoMetrics.cognitiveComplexity >= 10} 
                  icon="🕸️" 
                />
                <NeuralStageCard 
                  stage="Cephalic Ganglia & Sensory Eyes" 
                  desc="Bilateral cluster of neural ganglia driven by compound optics" 
                  achieved={ecoMetrics.cognitiveComplexity >= 25} 
                  icon="👀" 
                />
                <NeuralStageCard 
                  stage="Tripartite Vertebrate Brain" 
                  desc="Forebrain, midbrain, and hindbrain controlling coordination" 
                  achieved={ecoMetrics.cognitiveComplexity >= 40} 
                  icon="🐟" 
                />
                <NeuralStageCard 
                  stage="Limbic Architecture & Endothermy" 
                  desc="Emotional memory, acoustic analysis, and parent-offspring bond" 
                  achieved={ecoMetrics.cognitiveComplexity >= 65} 
                  icon="🐭" 
                />
                <NeuralStageCard 
                  stage="Neocortex & Spatial Mapping" 
                  desc="Folded cerebral cortex with prefrontal executive control" 
                  achieved={ecoMetrics.cognitiveComplexity >= 80} 
                  icon="🐒" 
                />
                <NeuralStageCard 
                  stage="Planetary Sapience (Anthropocene)" 
                  desc="Symbolic language, abstract tool synthesis, cosmic inquiry" 
                  achieved={ecoMetrics.cognitiveComplexity >= 100} 
                  icon="✨" 
                />
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: Living Radiated Species */}
          {activeTab === TABS.SPECIES && (
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {species.length > 0 ? (
                species.map((sp, i) => (
                  <div key={i} className="p-3 bg-gradient-to-br from-emerald-950/40 to-[#0c1a1f] border border-emerald-500/30 rounded-2xl flex flex-col gap-1.5 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xs text-emerald-300 uppercase tracking-wider">{sp.name || 'Species'}</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        Pop: {(ecoMetrics.globalBiomass / species.length).toFixed(1)} Mt
                      </span>
                    </div>
                    {sp.traits && (
                      <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-emerald-400/80 uppercase">
                        {sp.traits.fitness && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold">
                            Fit: {sp.traits.fitness}%
                          </span>
                        )}
                        {sp.traits.phototroph && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">Phototroph</span>}
                        {sp.traits.chemotroph && <span className="px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/30">Chemotroph</span>}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic text-center p-4">
                  No life detected. Seed LUCA from Biology Lab.
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT 4: Stratigraphic Fossil Record */}
          {activeTab === TABS.FOSSIL && (
            <div className="flex-1 overflow-y-auto space-y-2 text-xs font-mono pr-1 custom-scrollbar">
              {ecoMetrics.fossilRecord && ecoMetrics.fossilRecord.length > 0 ? (
                ecoMetrics.fossilRecord.slice().reverse().map((record, i) => (
                  <div key={i} className="p-2.5 bg-[#090f1d] border border-cyan-500/20 rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span className="text-cyan-400 font-bold">{record.name}</span>
                      <span>{new Date(record.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[10px] text-slate-300 italic">{record.impact}</div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic text-center p-4">
                  Fossil record is empty. Awaiting geological stratigraphy...
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// Subcomponents
const StatBox = ({ label, value, sub }) => (
  <div className="bg-[#090f1d] border border-cyan-500/25 px-3.5 py-2 rounded-2xl text-center min-w-[110px] shadow-inner">
    <div className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    <div className="font-mono font-black text-sm lg:text-base text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">{value}</div>
    {sub && <div className="text-[8px] font-mono text-slate-500 truncate max-w-[100px]">{sub}</div>}
  </div>
);

const TerraformControl = ({ title, desc, action, actionLabel, icon }) => (
  <div className="p-3 rounded-2xl border border-cyan-500/20 bg-[#090f1d]/80 flex items-center justify-between gap-3 shadow-md">
    <div className="flex items-center gap-2.5">
      <span className="text-xl p-1.5 rounded-xl bg-[#060a14] border border-cyan-500/20">{icon}</span>
      <div>
        <div className="font-black text-xs text-slate-200 tracking-wide">{title}</div>
        <div className="text-[9px] text-slate-400 font-mono mt-0.5">{desc}</div>
      </div>
    </div>
    <button 
      onClick={action}
      className="py-1.5 px-3 bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/30 rounded-xl text-[10px] font-mono font-bold text-cyan-300 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
    >
      {actionLabel}
    </button>
  </div>
);

const TerraformDualControl = ({ title, desc, actionPlus, actionMinus, icon }) => (
  <div className="p-3 rounded-2xl border border-cyan-500/20 bg-[#090f1d]/80 flex flex-col gap-2 shadow-md">
    <div className="flex items-center gap-2.5">
      <span className="text-xl p-1.5 rounded-xl bg-[#060a14] border border-cyan-500/20">{icon}</span>
      <div>
        <div className="font-black text-xs text-slate-200 tracking-wide">{title}</div>
        <div className="text-[9px] text-slate-400 font-mono mt-0.5">{desc}</div>
      </div>
    </div>
    <div className="flex gap-2">
      <button 
        onClick={actionPlus}
        className="flex-1 py-1 px-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/30 rounded-xl text-[10px] font-mono font-bold text-rose-300 transition-all active:scale-95 cursor-pointer"
      >
        +5K Heat
      </button>
      <button 
        onClick={actionMinus}
        className="flex-1 py-1 px-2 bg-sky-950/80 hover:bg-sky-900 border border-sky-500/30 rounded-xl text-[10px] font-mono font-bold text-sky-300 transition-all active:scale-95 cursor-pointer"
      >
        -5K Cool
      </button>
    </div>
  </div>
);

const CatastropheButton = ({ title, desc, icon, cooldown, onClick, variant = 'amber' }) => {
  const isCooldown = cooldown > 0;
  
  let colorClasses = 'border-amber-500/30 bg-amber-950/20 hover:border-amber-500/60 text-amber-300';
  if (variant === 'red') colorClasses = 'border-rose-500/30 bg-rose-950/20 hover:border-rose-500/60 text-rose-300';
  if (variant === 'yellow') colorClasses = 'border-yellow-500/30 bg-yellow-950/20 hover:border-yellow-500/60 text-yellow-300';
  if (variant === 'blue') colorClasses = 'border-sky-500/30 bg-sky-950/20 hover:border-sky-500/60 text-sky-300';
  if (variant === 'cyan') colorClasses = 'border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-500/60 text-cyan-300';

  return (
    <button
      disabled={isCooldown}
      onClick={onClick}
      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${colorClasses}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{icon}</span>
        <div>
          <div className="font-bold text-xs">{title}</div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">{desc}</div>
        </div>
      </div>
      {isCooldown && (
        <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-1 rounded bg-[#060a14] border border-slate-700 whitespace-nowrap">
          {cooldown.toFixed(0)}s
        </span>
      )}
    </button>
  );
};

const GasBar = ({ label, percent, color }) => (
  <div className="mb-2">
    <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
      <span>{label}</span>
      <span className="text-cyan-300 font-bold">{percent.toFixed(2)}%</span>
    </div>
    <div className="w-full h-1.5 bg-[#070b14] border border-cyan-500/20 rounded-full overflow-hidden p-0.5">
      <div className={`h-full transition-all duration-500 rounded-full ${color}`} style={{ width: `${Math.min(100, percent)}%` }} />
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
      active 
        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm' 
        : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const NeuralStageCard = ({ stage, desc, achieved, icon }) => (
  <div className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
    achieved 
      ? 'bg-indigo-950/40 border-indigo-500/40 shadow-sm' 
      : 'bg-[#060a14]/40 border-slate-800/60 opacity-40'
  }`}>
    <span className="text-lg p-1.5 rounded-lg bg-[#060a14] border border-indigo-500/20">{icon}</span>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-200">{stage}</span>
        {achieved && <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">Online</span>}
      </div>
      <div className="text-[9px] font-mono text-slate-400 mt-0.5">{desc}</div>
    </div>
  </div>
);

export default PlanetaryView;
