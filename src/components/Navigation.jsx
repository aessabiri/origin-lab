import React, { useState, useEffect } from 'react';
import {
  Atom,
  FlaskConical,
  Dna,
  Globe2,
  Bone,
  Sparkles,
  Target,
  BarChart3,
  GraduationCap,
  BookOpen,
  Unlock,
  Lock,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../store';
import { useInventory } from '../store/inventory';
import { usePlanetaryStore } from '../store/planetaryStore';
import { useAnatomyStore } from '../anatomy-lab/store';
import { resetAllOriginStores } from '../utils/storeReset.js';

const LAB_ITEMS = [
  {
    id: 'universe',
    stage: '01',
    label: 'Cosmos',
    badge: '✨',
    Icon: Sparkles,
    desc: '3D Epochs & Stellar',
    color: '#c084fc',
    gradient: 'from-purple-500/25 to-fuchsia-600/10',
    borderActive: 'border-purple-400',
    shadowGlow: 'shadow-[0_0_18px_rgba(192,132,252,0.35)]'
  },
  {
    id: 'particle',
    stage: '02',
    label: 'Physics',
    badge: '⚛️',
    Icon: Atom,
    desc: 'Quarks & 3D Orbitals',
    color: '#38bdf8',
    gradient: 'from-cyan-500/25 to-sky-600/10',
    borderActive: 'border-cyan-400',
    shadowGlow: 'shadow-[0_0_18px_rgba(56,189,248,0.35)]'
  },
  {
    id: 'chemistry',
    stage: '03',
    label: 'Chemistry',
    badge: '⚗️',
    Icon: FlaskConical,
    desc: '3D VSEPR & Bonds',
    color: '#34d399',
    gradient: 'from-emerald-500/25 to-teal-600/10',
    borderActive: 'border-emerald-400',
    shadowGlow: 'shadow-[0_0_18px_rgba(52,211,153,0.35)]'
  },
  {
    id: 'biology',
    stage: '04',
    label: 'Biology',
    badge: '🧫',
    Icon: Dna,
    desc: '3D Cell & Folding',
    color: '#2dd4bf',
    gradient: 'from-teal-500/25 to-emerald-600/10',
    borderActive: 'border-teal-400',
    shadowGlow: 'shadow-[0_0_18px_rgba(45,212,191,0.35)]'
  },
  {
    id: 'anatomy',
    stage: '05',
    label: 'Anatomy',
    badge: '🦴',
    Icon: Bone,
    desc: '206-Bone Demiurge',
    color: '#f43f5e',
    gradient: 'from-rose-500/25 to-pink-600/10',
    borderActive: 'border-rose-400',
    shadowGlow: 'shadow-[0_0_18px_rgba(244,63,94,0.35)]'
  },
  {
    id: 'planetary',
    stage: '06',
    label: 'Earth 3D',
    badge: '🌍',
    Icon: Globe2,
    desc: 'GLSL Biosphere',
    color: '#60a5fa',
    gradient: 'from-blue-500/25 to-indigo-600/10',
    borderActive: 'border-blue-400',
    shadowGlow: 'shadow-[0_0_18px_rgba(96,165,250,0.35)]'
  }
];

const UTILITY_ITEMS = [
  { id: 'goals', label: 'Goals', Icon: Target, color: '#818cf8' },
  { id: 'progress', label: 'Progress', Icon: BarChart3, color: '#fbbf24' },
  { id: 'tutorials', label: 'Academy', Icon: GraduationCap, color: '#f59e0b' }
];

const Navigation = ({ currentView: propView, onViewChange }) => {
  const {
    currentView: storeView,
    setCurrentView: storeSetView,
    introComplete,
    setIntroComplete,
    isSandboxMode,
    setIsSandboxMode,
    isCodexVisible,
    setIsCodexVisible,
    isNavCollapsed,
    setIsNavCollapsed,
    toggleNav
  } = useStore();

  const activeView = propView || storeView;
  const handleSelectView = (id) => {
    if (onViewChange) onViewChange(id);
    if (storeSetView) storeSetView(id);
  };

  const { compounds, discoveredItems } = useInventory();
  const assembledBones = useAnatomyStore((s) => s.assembledBones?.length || 0);
  const era = usePlanetaryStore((s) => s.era);
  const [isHoverPeek, setIsHoverPeek] = useState(false);

  // Keyboard shortcuts: Ctrl+B to toggle nav, Alt+1..6 for labs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleNav();
      } else if (e.altKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const item = LAB_ITEMS[Number(e.key) - 1];
        if (item) handleSelectView(item.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleNav]);

  if (!introComplete) return null;

  const handleReset = () => {
    if (
      window.confirm(
        'WARNING: This will collapse the universe back into a singularity. All progress will be lost. Are you sure?'
      )
    ) {
      resetAllOriginStores();
      setIntroComplete(true);
      handleSelectView('particle');
    }
  };

  const isNavOpen = !isNavCollapsed || isHoverPeek;

  return (
    <>
      {isNavCollapsed && (
        <aside
          aria-label="Navigation drawer"
          className="fixed left-3 top-14 z-50 flex items-center gap-2"
          onMouseEnter={() => setIsHoverPeek(true)}
          onMouseLeave={() => setIsHoverPeek(false)}
        >
          <button
            onClick={() => setIsNavCollapsed(false)}
            className="w-10 h-10 rounded-xl bg-[#070b14]/90 hover:bg-[#111c33] border border-cyan-500/40 text-cyan-400 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Expand Navigation Rail (Ctrl+B)"
          >
            <span className="text-sm font-mono font-black">▶</span>
          </button>
        </aside>
      )}

      <aside
        aria-label="Primary Laboratory Navigation"
        onMouseEnter={() => isNavCollapsed && setIsHoverPeek(true)}
        onMouseLeave={() => setIsHoverPeek(false)}
        className={`relative z-40 h-full bg-[#04070e]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col items-center py-3 select-none transition-all duration-300 ease-in-out shrink-0 ${
          isNavOpen ? 'w-20 translate-x-0' : 'w-0 -translate-x-full overflow-hidden border-r-0'
        }`}
      >
        {/* Collapse Rail Trigger */}
        <button
          onClick={() => setIsNavCollapsed(true)}
          className="mb-2 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[9px] font-mono text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
          title="Collapse Dock (Ctrl+B)"
        >
          ◀ DOCK
        </button>

        {/* Primary 3D Simulation Modules */}
        <div className="flex-1 flex flex-col items-center gap-1.5 w-full px-2 overflow-y-auto custom-scrollbar">
          {LAB_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            const IconComp = item.Icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                title={`${item.label} — ${item.desc} (Alt+${Number(item.stage)})`}
                className={`relative w-16 py-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 group shrink-0 border cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-b ${item.gradient} ${item.borderActive} ${item.shadowGlow}`
                    : 'bg-[#090e1a]/70 hover:bg-[#111a2e] border-white/[0.06] hover:border-cyan-500/35 text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <div
                    className="absolute -left-2 top-2.5 bottom-2.5 w-1 rounded-r-full shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: item.color, color: item.color }}
                  />
                )}
                <span className="text-[7px] font-mono font-bold opacity-50 leading-none mb-0.5">
                  {item.stage}
                </span>
                <IconComp
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  style={{ color: isActive ? item.color : undefined }}
                />
                <span
                  className={`font-display text-[9px] font-bold uppercase tracking-wider mt-1 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
                {item.id === 'anatomy' && (
                  <span className="text-[7px] font-mono text-rose-300 tabular-telemetry">
                    {assembledBones}/206
                  </span>
                )}
                {item.id === 'planetary' && (
                  <span className="text-[7px] font-mono text-sky-300 truncate max-w-[54px]">
                    {era}
                  </span>
                )}
              </button>
            );
          })}

          <div className="w-10 h-[1px] bg-white/10 my-1" />

          {/* Codex Quick Launcher */}
          <button
            onClick={() => setIsCodexVisible(!isCodexVisible)}
            className={`relative w-16 py-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 group shrink-0 border cursor-pointer ${
              isCodexVisible
                ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] text-amber-300'
                : 'bg-[#090e1a]/70 hover:bg-[#111a2e] border-white/[0.06] hover:border-amber-500/40 text-slate-400 hover:text-amber-300'
            }`}
            title="Universal Codex & Lineage Tree"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Codex</span>
            {discoveredItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[8px] font-black shadow-md">
                {discoveredItems.length}
              </span>
            )}
          </button>

          {/* Secondary Utilities (Goals, Progress, Academy) */}
          {UTILITY_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            const UtilIcon = item.Icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                className={`relative w-16 py-1.5 rounded-xl flex flex-col items-center justify-center transition-all duration-200 group shrink-0 border cursor-pointer ${
                  isActive
                    ? 'bg-white/10 border-white/30 text-white shadow-lg'
                    : 'bg-transparent hover:bg-white/5 border-transparent text-slate-500 hover:text-slate-300'
                }`}
                title={item.label}
              >
                <UtilIcon className="w-3.5 h-3.5" style={{ color: item.color }} />
                <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* BOTTOM SYSTEM CONTROLS */}
        <div className="flex flex-col items-center gap-1.5 mt-2 w-full px-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setIsSandboxMode(!isSandboxMode)}
            className={`relative w-12 h-8 rounded-xl flex items-center justify-center transition-all border cursor-pointer ${
              isSandboxMode
                ? 'text-amber-400 bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-slate-500 bg-white/5 border-transparent hover:text-amber-300 hover:border-amber-500/30'
            }`}
            title={isSandboxMode ? 'Sandbox Mode: UNLOCKED' : 'Survival / Progressive Mode'}
          >
            {isSandboxMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReset}
            className="w-12 h-8 rounded-xl flex items-center justify-center text-rose-500/60 hover:text-rose-400 bg-white/5 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all group cursor-pointer"
            title="Collapse Singularity (Reset Everything)"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default React.memo(Navigation);
