import React from 'react';
import { useStore } from '../store';
import { useBioStore } from '../biology-lab/store';
import { useChemistryStore } from '../chemistry-lab/store';
import { useInventory } from '../store/inventory';

const NAV_ITEMS = [
  { 
    id: 'universe', 
    label: 'Universe', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    color: 'purple' 
  },
  { 
    id: 'particle', 
    label: 'Physics', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
      </svg>
    ),
    color: 'cyan' 
  },
  { 
    id: 'chemistry', 
    label: 'Chemistry', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.244c0 .414.336.75.75.75h3c.414 0 .75-.336.75-.75V3.104m-5.25 0a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v1.244a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25V3.104zM4.5 18h15m-15 0a2.25 2.25 0 01-2.25-2.25V13.5m17.25 4.5a2.25 2.25 0 002.25-2.25V13.5m-17.25 0h17.25m-17.25 0L7.03 4.812A2.25 2.25 0 019.19 3h5.62a2.25 2.25 0 012.16 1.812L19.5 13.5" />
      </svg>
    ),
    color: 'green' 
  },
  { 
    id: 'biology', 
    label: 'Biology', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.996 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
      </svg>
    ),
    color: 'teal' 
  },
  { 
    id: 'planetary', 
    label: 'Earth', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'blue' 
  },
  { 
    id: 'goals', 
    label: 'Goals', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-6.75c-.622 0-1.125.504-1.125 1.125v3.375m9 0h-9M12 12V3.75m0 0l-3 3m3-3l3 3" />
      </svg>
    ),
    color: 'indigo' 
  },
  { 
    id: 'progress', 
    label: 'Progress', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: 'yellow' 
  },
  { 
    id: 'tutorials', 
    label: 'Academy', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147L12 15l7.74-4.853a4.5 4.5 0 00-4.89-7.493L12 4.5l-2.85-1.847a4.5 4.5 0 00-4.89 7.493z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6M9 18l3 3 3-3" />
      </svg>
    ),
    color: 'amber' 
  },
];

const Navigation = () => {
  const { currentView, setCurrentView, introComplete, executeReset, setIntroComplete, isSandboxMode, setIsSandboxMode } = useStore();
  const { resetSimulation } = useBioStore();
  const { setGameMode } = useChemistryStore();
  const { resetUniverse } = useInventory();

  if (!introComplete) return null;

  const handleReset = () => {
    if (window.confirm("WARNING: This will collapse the universe back into a singularity. All progress will be lost. Are you sure?")) {
      resetUniverse(); // Inventory -> 0
      executeReset(); // Physics
      resetSimulation(); // Biology
      setGameMode('career'); // Chemistry
      setIntroComplete(false); // Reset Intro
      setCurrentView('universe'); // Return to Universe View
    }
  };

  return (
    <nav className="h-full flex flex-col items-center py-6 bg-slate-900 border-r border-slate-800 shadow-2xl z-50 shrink-0">
      <div className="flex flex-col items-center gap-2 px-3 flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-slate-700">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          
          const colorMap = {
            blue: '#60a5fa', // blue-400
            purple: '#c084fc', // purple-400
            cyan: '#22d3ee', // cyan-400
            green: '#4ade80', // green-400
            teal: '#2dd4bf', // teal-400
            indigo: '#818cf8', // indigo-400
            yellow: '#fbbf24', // amber-400
            amber: '#f59e0b', // amber-500
          };
          
          const activeColor = colorMap[item.color];

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={isActive ? { color: activeColor } : {}}
              className={`
                relative w-16 h-16 md:w-20 md:h-20 rounded-2xl
                flex flex-col items-center justify-center gap-1 transition-all duration-300
                group shrink-0
                ${isActive 
                  ? 'bg-slate-800 shadow-inner' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                }
              `}
              title={item.label}
            >
              {/* Active Glow Background */}
              {isActive && (
                <div 
                    className="absolute inset-0 rounded-2xl opacity-10 blur-sm" 
                    style={{ backgroundColor: activeColor }}
                />
              )}
              
              {/* Icon */}
              <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              
              {/* Label */}
              <span className={`
                text-[9px] font-bold uppercase tracking-widest relative z-10 whitespace-nowrap mt-1
                ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}
              `}>
                {item.label}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                 <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 bg-current rounded-r-full shadow-[0_0_15px_currentColor] opacity-100`} />
              )}
            </button>
          );
        })}
      </div>

      {/* System Controls */}
      <div className="flex flex-col items-center gap-4 mt-4 px-3 pt-4 border-t border-slate-800 w-full">
        {/* Sandbox Mode Toggle */}
        <button
            onClick={() => setIsSandboxMode(!isSandboxMode)}
            className={`
                relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                ${isSandboxMode ? 'text-amber-400 bg-amber-900/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-slate-600 hover:text-amber-400 hover:bg-white/5'}
            `}
            title={isSandboxMode ? "Sandbox Mode: ON (Unlocks all items)" : "Sandbox Mode: OFF"}
        >
            <span className="text-xl">
                {isSandboxMode ? '🔓' : '🔒'}
            </span>
            {isSandboxMode && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
            )}
        </button>

        {/* Universe Collapse (Reset) */}
        <button
            onClick={handleReset}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-900/20 transition-all duration-300"
            title="Collapse Universe (RESET ALL)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;