import React from 'react';
import { useChemistryStore } from '../store';
import { MISSIONS } from '../data/missions';

const MissionHint = () => {
  const gameMode = useChemistryStore(state => state.gameMode);
  const missionIndex = useChemistryStore(state => state.missionIndex);
  const isHintVisible = useChemistryStore(state => state.isHintVisible);
  const toggleHint = useChemistryStore(state => state.toggleHint);

  if (gameMode !== 'career') return null;

  const mission = MISSIONS[missionIndex];
  if (!mission || !mission.hint) return null;

  const { hint } = mission;

  return (
    <div className="absolute bottom-4 left-4 z-50">
        {/* Toggle Button */}
        <button 
            onClick={toggleHint}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${isHintVisible ? 'bg-amber-500 border-amber-300 text-white' : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-amber-400'}`}
            title="Show Hint"
        >
            <span className="text-2xl">💡</span>
        </button>

        {/* Hint Popup */}
        {isHintVisible && (
            <div className="absolute bottom-16 left-0 bg-gray-900 border border-amber-500 rounded-xl p-4 w-72 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-start mb-2 border-b border-gray-700 pb-2">
                    <h4 className="text-amber-400 font-bold uppercase text-xs tracking-widest">Lab Protocol</h4>
                    <button onClick={toggleHint} className="text-gray-500 hover:text-white text-xs">✕</button>
                </div>
                
                <div className="space-y-3 text-xs text-gray-300">
                    <div>
                        <strong className="text-gray-400 block mb-1">Equipment:</strong>
                        <span className="text-white">{hint.vessel}</span>
                    </div>
                    <div>
                        <strong className="text-gray-400 block mb-1">Ingredients:</strong>
                        <ul className="list-disc pl-4 space-y-1">
                            {hint.ingredients.map((ing, i) => (
                                <li key={i} className="text-white">{ing}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong className="text-gray-400 block mb-1">Procedure:</strong>
                        <p className="text-cyan-300 leading-relaxed">{hint.process}</p>
                    </div>
                    <div className="bg-amber-900/30 p-2 rounded border border-amber-900 text-amber-200 italic">
                        "Tip: {hint.tip}"
                    </div>
                </div>
                
                {/* Pointer Arrow */}
                <div className="absolute -bottom-2 left-4 w-4 h-4 bg-gray-900 border-b border-r border-amber-500 transform rotate-45"></div>
            </div>
        )}
    </div>
  );
};

export default MissionHint;
