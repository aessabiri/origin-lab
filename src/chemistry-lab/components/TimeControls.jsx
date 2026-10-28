import React from 'react';
import { useChemistryStore } from '../store';

const TimeControls = () => {
  const timeSpeed = useChemistryStore(state => state.timeSpeed);
  const setTimeSpeed = useChemistryStore(state => state.setTimeSpeed);

  const speeds = [
    { label: '⏸', value: 0, title: 'Pause Simulation' },
    { label: '1x', value: 1, title: 'Realtime (1x)' },
    { label: '10x', value: 10, title: 'Fast (10x)' },
    { label: '100x', value: 100, title: 'Super Fast (100x)' },
    { label: 'MAX ⚡', value: 86400, title: 'Accelerated (1 Day/s)' },
  ];

  return (
    <div className="flex items-center bg-[#080d1a]/90 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] gap-1 select-none">
      
      {/* Speed Buttons */}
      <div className="flex items-center gap-1">
        {speeds.map((s) => {
          const isActive = timeSpeed === s.value;
          return (
            <button
              key={s.label}
              onClick={() => setTimeSpeed(s.value)}
              title={s.title}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black transition-all active:scale-95 ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-300/50' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Speed Telemetry Badge */}
      <div className="bg-[#050914] px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 ml-1">
        <span className={`w-2 h-2 rounded-full ${timeSpeed > 0 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
        <span className="text-[10px] font-mono font-black text-emerald-400 tracking-wider">
          RATE: {timeSpeed === 0 ? 'PAUSED' : timeSpeed === 86400 ? '1 DAY/S' : `${timeSpeed}X`}
        </span>
      </div>

    </div>
  );
};

export default React.memo(TimeControls);

