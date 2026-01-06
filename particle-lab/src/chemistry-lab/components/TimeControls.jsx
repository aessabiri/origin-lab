import React from 'react';
import { useChemistryStore } from '../store';

const TimeControls = () => {
  const timeSpeed = useChemistryStore(state => state.timeSpeed);
  const setTimeSpeed = useChemistryStore(state => state.setTimeSpeed);

  const speeds = [
    { label: '⏸️', value: 0 },
    { label: '1x', value: 1 },
    { label: '10x', value: 10 },
    { label: '100x', value: 100 },
    { label: 'MAX', value: 86400 }, // Seconds in a day
  ];

  return (
    <div className="absolute top-4 left-4 z-20 flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
      {speeds.map((s) => (
        <button
          key={s.label}
          onClick={() => setTimeSpeed(s.value)}
          className={`px-3 py-2 text-xs font-bold transition-colors ${
            timeSpeed === s.value 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {s.label}
        </button>
      ))}
      <div className="bg-gray-950 px-3 py-2 text-xs font-mono text-amber-500 border-l border-gray-700 flex items-center">
         SPEED: {timeSpeed === 86400 ? '1 Day/s' : `${timeSpeed}x`}
      </div>
    </div>
  );
};

export default TimeControls;
