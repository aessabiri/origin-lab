import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import { useBioStore } from '../biology-lab/store';
import { useChemistryStore } from '../chemistry-lab/store';
import { useParticleStore } from '../particle-lab/store';
import { useInventory } from '../store/inventory';

const LAB_ITEMS = [
  { 
    id: 'particle', 
    label: 'Physics', 
    badge: '⚛️',
    desc: 'Quarks & Atoms',
    color: '#38bdf8', // Cyan
    gradient: 'from-cyan-500/20 to-sky-600/10',
    borderActive: 'border-cyan-400',
    shadowGlow: 'shadow-[0_0_15px_rgba(56,189,248,0.4)]',
  },
  { 
    id: 'chemistry', 
    label: 'Chemistry', 
    badge: '⚗️',
    desc: 'Reactions & Bonds',
    color: '#34d399', // Emerald
    gradient: 'from-emerald-500/20 to-teal-600/10',
    borderActive: 'border-emerald-400',
    shadowGlow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
  },
  { 
    id: 'biology', 
    label: 'Biology', 
    badge: '🧫',
    desc: 'Cells & Folding',
    color: '#2dd4bf', // Teal
    gradient: 'from-teal-500/20 to-emerald-600/10',
    borderActive: 'border-teal-400',
    shadowGlow: 'shadow-[0_0_15px_rgba(45,212,191,0.4)]',
  },
  { 
    id: 'planetary', 
    label: 'Earth', 
    badge: '🌍',
    desc: 'Planetary Biosphere',
    color: '#60a5fa', // Blue
    gradient: 'from-blue-500/20 to-indigo-600/10',
    borderActive: 'border-blue-400',
    shadowGlow: 'shadow-[0_0_15px_rgba(96,165,250,0.4)]',
  },
  { 
    id: 'universe', 
    label: 'Cosmos', 
    badge: '✨',
    desc: 'Timeline & Nursery',
    color: '#c084fc', // Purple
    gradient: 'from-purple-500/20 to-fuchsia-600/10',
    borderActive: 'border-purple-400',
    shadowGlow: 'shadow-[0_0_15px_rgba(192,132,252,0.4)]',
  },
];

const UTILITY_ITEMS = [
  { 
    id: 'goals', 
    label: 'Goals', 
    badge: '🎯',
    color: '#818cf8',
  },
  { 
    id: 'progress', 
    label: 'Progress', 
    badge: '📊',
    color: '#fbbf24',
  },
  { 
    id: 'tutorials', 
    label: 'Academy', 
    badge: '🎓',
    color: '#f59e0b',
  },
];

const Navigation = () => {
  const { 
    currentView, 
    setCurrentView, 
    introComplete, 
    executeReset: executeGlobalReset, 
    setIntroComplete, 
    isSandboxMode, 
    setIsSandboxMode,
    isCodexVisible,
    setIsCodexVisible,
    isNavCollapsed,
    setIsNavCollapsed,
    toggleNav
  } = useStore();

  const { executeReset: executeParticleReset } = useParticleStore();
  const { resetSimulation } = useBioStore();
  const { resetLab } = useChemistryStore();
  const { resetUniverse, compounds, discoveredItems } = useInventory();

  const [alerts, setAlerts] = useState([]);
  const [isHoverPeek, setIsHoverPeek] = useState(false);

  // Keyboard shortcut: '[' or 'Ctrl+B' to toggle navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleNav();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleNav]);

  // Telemetry alerts
  useEffect(() => {
    const newAlerts = [];
    if (compounds.glucose < 10 && compounds.glucose !== undefined) {
      newAlerts.push({ id: 'glucose', text: 'Biology: Glucose Low', type: 'danger' });
    }
    if (compounds.atp < 5 && compounds.atp !== undefined) {
      newAlerts.push({ id: 'atp', text: 'ATP Depletion WARNING', type: 'warning' });
    }
    if (compounds.polymerase > 0) {
      newAlerts.push({ id: 'polymerase', text: 'Biocatalyst Available', type: 'success' });
    }
    setAlerts(newAlerts);
  }, [compounds.glucose, compounds.atp, compounds.polymerase]);

  if (!introComplete) return null;

  const handleReset = () => {
    if (window.confirm("WARNING: This will collapse the universe back into a singularity. All progress will be lost. Are you sure?")) {
      resetUniverse(); 
      executeGlobalReset(); 
      executeParticleReset(); 
      resetSimulation(); 
      resetLab(); 
      setIntroComplete(true); 
      setCurrentView('particle'); 
    }
  };

  const isNavOpen = !isNavCollapsed || isHoverPeek;

  return (
    <>
      {/* 1. FLOATING EXPAND TRIGGER (Shown when collapsed) */}
      {isNavCollapsed && (
        <aside 
          aria-label="Navigation drawer"
          className="fixed left-3 top-3 z-50 flex items-center gap-2"
          onMouseEnter={() => setIsHoverPeek(true)}
          onMouseLeave={() => setIsHoverPeek(false)}
        >
          <button
            onClick={() => setIsNavCollapsed(false)}
            aria-expanded="false"
            aria-label="Expand laboratory navigation"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#080d18]/90 backdrop-blur-2xl border border-cyan-500/40 text-white shadow-[0_4px_25px_rgba(0,0,0,0.8)] hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all group"
            title="Expand Navigation (Ctrl+B)"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-xs font-black font-sans uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
              ORIGIN LABS
            </span>
            <span className="text-xs text-cyan-400 group-hover:translate-x-0.5 transition-transform">
              ▶
            </span>
          </button>
        </aside>
      )}

      {/* 2. MAIN MODERN NAVIGATION SIDEBAR */}
      <aside 
        aria-label="Laboratory navigation"
        className={`h-full flex flex-col items-center py-3 bg-[#060a12]/95 backdrop-blur-2xl border-r border-cyan-500/20 shadow-[15px_0_40px_rgba(0,0,0,0.8)] z-40 shrink-0 relative overflow-hidden transition-all duration-300 ease-in-out ${
          isNavOpen 
            ? 'w-20 md:w-24 translate-x-0 opacity-100' 
            : 'w-0 -translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Alerts Overlay */}
        {alerts.length > 0 && (
          <div className="absolute left-24 top-4 z-[100] flex flex-col gap-2 pointer-events-none w-52 transition-all duration-500">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-2.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fade-in ${
                  alert.type === 'danger' ? 'bg-rose-950/80 border-rose-500/50 text-rose-200' : 
                  alert.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' :
                  'bg-amber-950/80 border-amber-500/50 text-amber-200'
                }`}
              >
                <span className="text-base">{alert.type === 'danger' ? '🚨' : alert.type === 'success' ? '🧬' : '⚠️'}</span>
                <span className="text-[9px] font-black font-mono leading-tight uppercase tracking-widest">{alert.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />

        {/* Header: Origin Pulsing Logo & Collapse Toggle */}
        <div className="flex flex-col items-center gap-2 mb-4 w-full px-2">
          
          {/* Collapse Icon Button */}
          <button
            onClick={() => setIsNavCollapsed(true)}
            aria-expanded="true"
            aria-label="Collapse navigation bar"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 flex items-center justify-center text-xs transition-all"
            title="Collapse Navigation (Ctrl+B)"
          >
            ◀
          </button>

          {/* Holographic Nucleus Logo */}
          <div 
            onClick={() => setCurrentView('particle')}
            className="relative cursor-pointer group"
            title="Origin Hub"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0e172a] to-[#0a0f1d] border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 shadow-lg transition-all group-hover:scale-105">
              <div className="w-6 h-6 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.8)]">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping" />
              </div>
            </div>
          </div>
        </div>

        {/* LAB SWITCHER LIST */}
        <div className="flex flex-col items-center gap-2.5 px-2 flex-1 overflow-y-auto w-full custom-scrollbar">
          
          {/* Main Labs Section */}
          {LAB_ITEMS.map((item) => {
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`
                  relative w-16 h-15 rounded-2xl
                  flex flex-col items-center justify-center transition-all duration-200
                  group shrink-0 border
                  ${isActive 
                    ? `bg-gradient-to-b ${item.gradient} ${item.borderActive} ${item.shadowGlow} scale-105 z-10` 
                    : 'bg-[#0a0f1d]/60 hover:bg-[#121a2f] border-cyan-500/15 hover:border-cyan-500/40 text-slate-400 hover:text-white'
                  }
                `}
                title={`${item.label} (${item.desc})`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div 
                    className="absolute -left-2 top-2.5 bottom-2.5 w-1 rounded-r-full shadow-[0_0_10px_currentColor]" 
                    style={{ backgroundColor: item.color, color: item.color }}
                  />
                )}

                {/* Badge / Emoji Icon */}
                <span className="text-xl leading-none transition-transform group-hover:scale-110">
                  {item.badge}
                </span>

                {/* Label */}
                <span className={`
                  text-[9px] font-black font-sans uppercase tracking-wider mt-1 transition-colors
                  ${isActive ? 'text-white font-bold' : 'text-slate-500 group-hover:text-slate-200'}
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="w-8 h-px bg-cyan-500/20 my-1" />

          {/* Codex Quick Launcher */}
          <button
            onClick={() => setIsCodexVisible(!isCodexVisible)}
            className={`
              relative w-16 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 group shrink-0 border
              ${isCodexVisible 
                ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] text-amber-300' 
                : 'bg-[#0a0f1d]/60 hover:bg-[#121a2f] border-cyan-500/15 hover:border-amber-500/40 text-slate-400 hover:text-amber-300'
              }
            `}
            title="Universal Codex & Lineage Tree"
          >
            <span className="text-lg leading-none">📖</span>
            <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">Codex</span>
            
            {discoveredItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[8px] font-black shadow-md">
                {discoveredItems.length}
              </span>
            )}
          </button>

          {/* Secondary Utilities (Goals, Progress, Academy) */}
          {UTILITY_ITEMS.map(item => {
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`
                  relative w-16 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200 group shrink-0 border
                  ${isActive 
                    ? 'bg-white/10 border-white/30 text-white shadow-lg' 
                    : 'bg-transparent hover:bg-white/5 border-transparent text-slate-500 hover:text-slate-300'
                  }
                `}
                title={item.label}
              >
                <span className="text-base leading-none">{item.badge}</span>
                <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* BOTTOM SYSTEM CONTROLS */}
        <div className="flex flex-col items-center gap-2 mt-2 w-full px-2 pt-3 border-t border-cyan-500/20">
          
          {/* Sandbox Mode Toggle */}
          <button
            onClick={() => setIsSandboxMode(!isSandboxMode)}
            className={`
              relative w-12 h-10 rounded-xl flex items-center justify-center transition-all border
              ${isSandboxMode 
                ? 'text-amber-400 bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'text-slate-500 bg-white/5 border-transparent hover:text-amber-300 hover:border-amber-500/30'
              }
            `}
            title={isSandboxMode ? "Sandbox Mode: UNLOCKED" : "Survival / Progressive Mode"}
          >
            <span className="text-sm">{isSandboxMode ? '🔓' : '🔒'}</span>
          </button>

          {/* Singularity Reset Button */}
          <button
            onClick={handleReset}
            className="w-12 h-10 rounded-xl flex items-center justify-center text-rose-500/50 hover:text-rose-400 bg-white/5 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all group"
            title="Collapse Singularity (Reset Everything)"
          >
            <span className="text-sm group-hover:rotate-45 transition-transform duration-300">💥</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default React.memo(Navigation);
