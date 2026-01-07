import React from 'react';
import { useChemistryStore } from '../store';
import { MISSIONS } from '../data/missions';

const MissionTracker = () => {
  const gameMode = useChemistryStore(state => state.gameMode);
  const missionIndex = useChemistryStore(state => state.missionIndex);
  
  if (gameMode !== 'career') return null;

  const mission = MISSIONS[missionIndex];

  if (!mission) {
      return (
        <div className="absolute top-4 left-4 z-30 bg-green-900/90 border border-green-500 p-4 rounded-xl shadow-2xl max-w-sm">
            <h3 className="text-green-400 font-bold text-lg mb-1">🎉 All Missions Complete!</h3>
            <p className="text-green-200 text-sm">You are a master chemist. Feel free to continue experimenting.</p>
        </div>
      );
  }

  return (
    <div className="absolute top-4 left-4 z-30 bg-slate-800/90 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-2xl max-w-sm backdrop-blur-md">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">Current Objective</span>
        <span className="text-[10px] font-mono text-slate-500">#{missionIndex + 1}</span>
      </div>
      <h3 className="text-white font-bold text-lg mb-1">{mission.title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed">{mission.description}</p>
      
      {/* Requirements List (Simplified view) */}
      <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="flex gap-2">
              {Object.keys(mission.requirements).map(req => (
                  <span key={req} className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-200 font-mono">
                      Target: {req}
                  </span>
              ))}
          </div>
      </div>
    </div>
  );
};

export default MissionTracker;
