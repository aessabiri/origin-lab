import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  FastForward,
  Sparkles,
  BookOpen,
  Compass,
  Dna,
  Activity,
  Clock
} from 'lucide-react';
import {
  useCosmicClockStore,
  resolveCosmicEpoch,
  formatCosmicAge
} from '../store/cosmicClockStore';
import { useInventory } from '../store/inventory';
import { useProgressionStore } from '../store/progressionStore';
import { useStore } from '../store';

const CosmicCommandBar = ({
  isGuideOpen,
  onToggleGuide,
  onOpenNotebook,
  currentView,
  onViewChange
}) => {
  const {
    cosmicAgeYears,
    timeScale,
    setTimeScale,
    togglePause,
    setCosmicAgeYears,
    tickCosmicClock,
    quickSeedAllLabs,
    compiledGenome
  } = useCosmicClockStore();

  const elements = useInventory((state) => state.elements);
  const compounds = useInventory((state) => state.compounds);
  const discoveredCount = useInventory((state) => state.discoveredItems?.length || 0);
  const completedStages = useProgressionStore((state) => state.completedStages?.length || 0);

  // Persistent background universe heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      tickCosmicClock(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tickCosmicClock]);

  const epoch = resolveCosmicEpoch(cosmicAgeYears);

  const ledgerPills = [
    { key: 'H', count: elements?.hydrogen || 0, color: 'text-sky-400 border-sky-500/30' },
    { key: 'He', count: elements?.helium || 0, color: 'text-amber-300 border-amber-500/30' },
    { key: 'C', count: elements?.carbon || 0, color: 'text-emerald-400 border-emerald-500/30' },
    { key: 'N', count: elements?.nitrogen || 0, color: 'text-indigo-400 border-indigo-500/30' },
    { key: 'O', count: elements?.oxygen || 0, color: 'text-rose-400 border-rose-500/30' },
    { key: 'H₂O', count: compounds?.water || 0, color: 'text-cyan-300 border-cyan-500/30' }
  ];

  const handleQuickSeed = () => {
    quickSeedAllLabs();
    useStore.getState().showMessage('⚡ Universal Ledger Seeded — All Atomic & Prebiotic Stocks Charged!');
  };

  return (
    <header className="h-11 w-full bg-[#04070e]/95 border-b border-white/[0.08] px-3 flex items-center justify-between gap-3 z-50 backdrop-blur-xl select-none shrink-0">
      {/* Left: Brand Identity & Living Cosmic Clock */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          onClick={() => onViewChange && onViewChange('universe')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          title="Return to Cosmic Evolution Engine"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] group-hover:scale-125 transition-transform" />
          <span className="font-display text-[11px] font-bold tracking-[0.2em] text-white uppercase">
            ORIGIN<span className="text-cyan-400">//ARGON</span>
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 shrink-0" />

        {/* Epoch & Cosmic Age Readout */}
        <div className="flex items-center gap-2 bg-[#090f1d] border border-white/[0.07] rounded-lg px-2.5 py-1">
          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-mono text-[11px] font-bold text-cyan-300 tabular-telemetry tracking-tight">
            {formatCosmicAge(cosmicAgeYears)}
          </span>
          <span
            className="hidden sm:inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border"
            style={{
              color: epoch.color,
              borderColor: `${epoch.color}44`,
              backgroundColor: `${epoch.color}15`
            }}
          >
            {epoch.name}
          </span>

          {/* Scrubber Slider */}
          <input
            type="range"
            min="0"
            max="13800000000"
            step="10000000"
            value={cosmicAgeYears}
            onChange={(e) => setCosmicAgeYears(Number(e.target.value))}
            title="Scrub Cosmic Timeline (0 s → 13.8 Ga)"
            className="hidden xl:block w-24 h-1 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Time Scale Controls */}
        <div className="flex items-center gap-0.5 bg-[#090f1d] border border-white/[0.07] rounded-lg p-0.5">
          <button
            onClick={togglePause}
            title={timeScale === 0 ? 'Resume Cosmic Clock' : 'Pause Cosmic Clock'}
            className={`p-1 rounded transition-colors cursor-pointer ${
              timeScale === 0
                ? 'bg-amber-500/20 text-amber-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {timeScale === 0 ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
          {[1, 10, 100].map((spd) => (
            <button
              key={spd}
              onClick={() => setTimeScale(spd)}
              className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold transition-all cursor-pointer ${
                timeScale === spd
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Center: Universal Ledger Telemetry Ticker */}
      <div className="hidden lg:flex items-center gap-1.5">
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mr-1 flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-400" /> Ledger
        </span>
        {ledgerPills.map((pill) => (
          <div
            key={pill.key}
            className={`px-2 py-0.5 rounded-md bg-[#090e1a] border text-[10px] font-mono font-bold tabular-telemetry flex items-center gap-1.5 ${pill.color}`}
          >
            <span className="opacity-75">{pill.key}</span>
            <span className="text-white">{pill.count}</span>
          </div>
        ))}

        {compiledGenome && (
          <button
            onClick={() => onViewChange && onViewChange('biology')}
            title={`Demiurge Blueprint Active: ${compiledGenome.boneCount}/206 Bones (${compiledGenome.integrityScore}% Integrity)`}
            className="ml-1 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-400/40 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-1 hover:bg-emerald-900/70 transition-all cursor-pointer"
          >
            <Dna className="w-3 h-3 text-emerald-400" />
            <span>DNA {compiledGenome.integrityScore}%</span>
          </button>
        )}
      </div>

      {/* Right: Sandbox Booster, Mission Guide & Universal Codex */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleQuickSeed}
          title="Charge Universal Ledger with Elements & Prebiotic Molecules for Sandbox Testing"
          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 to-cyan-500/15 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="hidden sm:inline">Seed Ledger</span>
        </button>

        <button
          onClick={onToggleGuide}
          className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            isGuideOpen
              ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200'
              : 'bg-[#090f1d] border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-3 h-3 text-cyan-400" />
          <span className="hidden md:inline">Missions</span>
          <span className="text-[9px] text-cyan-400">({completedStages}/7)</span>
        </button>

        <button
          onClick={onOpenNotebook}
          className="px-2.5 py-1 rounded-lg bg-[#090f1d] hover:bg-slate-800/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-cyan-400" />
          <span className="hidden md:inline">Codex</span>
          <span className="text-[9px] text-slate-400">({discoveredCount})</span>
        </button>
      </div>
    </header>
  );
};

export default CosmicCommandBar;
