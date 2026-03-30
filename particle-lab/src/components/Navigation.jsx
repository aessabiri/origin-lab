import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useBioStore } from '../biology-lab/store';
import { useChemistryStore } from '../chemistry-lab/store';
import { useParticleStore } from '../particle-lab/store';
import { useInventory } from '../store/inventory';

const NAV_ITEMS = [
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
    id: 'universe', 
    label: 'Cosmos', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    color: 'purple' 
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
  const { currentView, setCurrentView, introComplete, executeReset: executeGlobalReset, setIntroComplete, isSandboxMode, setIsSandboxMode } = useStore();
  const { executeReset: executeParticleReset } = useParticleStore();
  const { resetSimulation } = useBioStore();
  const { resetLab } = useChemistryStore();
  const { resetUniverse, compounds } = useInventory();

  const [alerts, setAlerts] = useState([]);

  // --- Monitoring Feedback Loop ---
  useEffect(() => {
    const newAlerts = [];
    
    if (compounds.glucose < 10) {
      newAlerts.push({ id: 'glucose', text: 'Biology: Glucose Low', type: 'danger' });
    }
    
    if (compounds.atp < 5) {
      newAlerts.push({ id: 'atp', text: 'ATP Depletion WARNING', type: 'warning' });
    }
    
    if (compounds.polymerase > 0) {
      newAlerts.push({ id: 'polymerase', text: 'Biocatalyst Available', type: 'success' });
    }

    if (JSON.stringify(newAlerts) !== JSON.stringify(alerts)) {
        setAlerts(newAlerts);
    }
  }, [compounds.glucose, compounds.atp, compounds.polymerase, alerts]);

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

  return (
    <nav className="h-full w-20 md:w-24 flex flex-col items-center py-4 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-50 shrink-0 relative overflow-hidden">
      {/* Alerts Overlay */}
      {alerts.length > 0 && (
          <div className="absolute left-24 top-4 z-[100] flex flex-col gap-2 pointer-events-none w-48 transition-all duration-500">
              {alerts.map(alert => (
                  <div key={alert.id} className={`p-2 rounded-xl border shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in slide-in-from-left-4 ${
                      alert.type === 'danger' ? 'bg-red-500/20 border-red-500/50 text-red-200' : 
                      alert.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' :
                      'bg-amber-500/20 border-amber-500/50 text-amber-200'
                  }`}>
                      <span className="text-base">{alert.type === 'danger' ? '🚨' : alert.type === 'success' ? '🧬' : '⚠️'}</span>
                      <span className="text-[9px] font-black leading-tight uppercase tracking-widest">{alert.text}</span>
                  </div>
              ))}
          </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-blue-500/20 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-purple-500/20 to-transparent" />
      </div>

      {/* Origin Logo */}
      <div className="mb-8 relative group cursor-pointer" onClick={() => setCurrentView('particle')}>
        <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors duration-500">
           <div className="w-8 h-8 rounded-full border-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" />
           <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 px-2 flex-1 overflow-y-auto w-full scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          
          const colorMap = {
            blue: '#60a5fa', 
            purple: '#c084fc', 
            cyan: '#22d3ee', 
            green: '#4ade80', 
            teal: '#2dd4bf', 
            indigo: '#818cf8', 
            yellow: '#fbbf24', 
            amber: '#f59e0b', 
          };
          
          const activeColor = colorMap[item.color];

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                relative w-16 h-16 rounded-2xl
                flex flex-col items-center justify-center transition-all duration-500
                group shrink-0
                ${isActive 
                  ? 'bg-white/5 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
              title={item.label}
            >
              {isActive && (
                <div 
                    className="absolute inset-2 rounded-xl opacity-20 blur-md transition-all duration-500" 
                    style={{ backgroundColor: activeColor }}
                />
              )}
              
              <span 
                className={`relative z-10 transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_currentColor]' : 'group-hover:scale-110 group-hover:drop-shadow-[0_0_5px_currentColor]'}`}
                style={isActive ? { color: activeColor } : {}}
              >
                {item.icon}
              </span>
              
              <span className={`
                text-[8px] font-black uppercase tracking-[0.2em] relative z-10 whitespace-nowrap mt-1.5 transition-colors duration-500
                ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}
              `}>
                {item.label}
              </span>

              {isActive && (
                 <div 
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full shadow-[0_0_15px_currentColor] opacity-100" 
                    style={{ backgroundColor: activeColor, boxShadow: `0 0 10px ${activeColor}` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* System Controls */}
      <div className="flex flex-col items-center gap-3 mt-4 mb-2 w-full px-2 pt-4 border-t border-white/5">
        <button
            onClick={() => setIsSandboxMode(!isSandboxMode)}
            className={`
                relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border
                ${isSandboxMode 
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                    : 'text-slate-600 bg-white/5 border-transparent hover:text-amber-400 hover:border-amber-500/20'
                }
            `}
            title={isSandboxMode ? "Sandbox Mode: ON" : "Sandbox Mode: OFF"}
        >
            <span className="text-xl relative z-10">
                {isSandboxMode ? '🔓' : '🔒'}
            </span>
            {isSandboxMode && (
                <div className="absolute inset-0 rounded-2xl bg-amber-500/5 animate-pulse blur-sm" />
            )}
        </button>

        <button
            onClick={handleReset}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-red-500/40 hover:text-red-500 bg-white/5 border border-transparent hover:border-red-500/20 hover:bg-red-500/10 transition-all duration-500 group"
            title="Collapse Universe (RESET)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform duration-500 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
