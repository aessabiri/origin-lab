import React from 'react';
import { useStore } from '../store';

const NAV_ITEMS = [
  { 
    id: 'hub', 
    label: 'Home', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    color: 'blue' 
  },
  { 
    id: 'universe', 
    label: 'Universe', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'purple' 
  },
  { 
    id: 'particle', 
    label: 'Physics', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'cyan' 
  },
  { 
    id: 'chemistry', 
    label: 'Chemistry', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'green' 
  },
  { 
    id: 'biology', 
    label: 'Biology', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'teal' 
  },
];

const Navigation = () => {
  const { currentView, setCurrentView, introComplete } = useStore();

  if (!introComplete) return null;

  return (
    <nav className="fixed z-50 transition-all duration-1000 ease-out animate-[slideUp_1s_ease-out]
      bottom-4 left-4 right-4 md:bottom-auto md:top-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-auto"
    >
      <div className="flex items-center justify-between md:justify-center p-1.5 md:p-2 
        bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        rounded-2xl md:rounded-full"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          
          const colorMap = {
            blue: '#60a5fa', // blue-400
            purple: '#c084fc', // purple-400
            cyan: '#22d3ee', // cyan-400
            green: '#4ade80', // green-400
            teal: '#2dd4bf', // teal-400
          };
          
          const activeColor = colorMap[item.color];

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={isActive ? { color: activeColor } : {}}
              className={`
                relative px-3 py-2 md:px-6 md:py-2.5 rounded-xl md:rounded-full 
                flex items-center gap-2 transition-all duration-300
                group overflow-hidden
                ${isActive 
                  ? '' // Color handled by style
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {/* Active Background Indicator */}
              {isActive && (
                <div 
                    className="absolute inset-0 rounded-xl md:rounded-full opacity-20" 
                    style={{ backgroundColor: activeColor }}
                />
              )}
              
              {/* Icon */}
              <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              
              {/* Label */}
              <span className={`
                text-xs md:text-sm font-bold uppercase tracking-wider relative z-10 whitespace-nowrap
                ${isActive ? 'block' : 'hidden md:block'}
              `}>
                {item.label}
              </span>

              {/* Active Bottom Line (Glow) */}
              {isActive && (
                 <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-current rounded-full shadow-[0_0_10px_currentColor] opacity-80`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;