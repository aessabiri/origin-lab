import React from 'react';
import { useProgressionStore } from '../store/progressionStore';

const GameProgress = () => {
  const { xp, level, completedMilestones, getMilestones } = useProgressionStore();
  const milestones = getMilestones();

  const nextLevelXp = level * 1000;
  const progressPercent = Math.min(100, (xp / nextLevelXp) * 100);

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        
        {/* Header / Stats */}
        <div className="flex items-center justify-between mb-12 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
              Cosmic Progress
            </h1>
            <p className="text-gray-400 mt-2">Evolution Level {level}</p>
          </div>
          <div className="w-1/3">
             <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span>XP</span>
                <span>{xp} / {nextLevelXp}</span>
             </div>
             <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
             </div>
          </div>
        </div>

        {/* Timeline Tree */}
        <div className="relative border-l-4 border-gray-700 ml-6 space-y-12">
          {milestones.map((milestone, index) => {
            const isCompleted = completedMilestones.includes(milestone.id);
            const isLocked = !isCompleted && (index > 0 && !completedMilestones.includes(milestones[index-1].id));
            const isNext = !isCompleted && !isLocked;

            return (
              <div key={milestone.id} className={`relative pl-8 transition-all duration-500 ${isLocked ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}>
                {/* Dot Indicator */}
                <div 
                    className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 transition-colors duration-300 
                    ${isCompleted ? 'bg-green-500 border-green-900' : isNext ? 'bg-amber-400 border-amber-900 animate-pulse' : 'bg-gray-600 border-gray-900'}`}
                />
                
                <div className={`p-6 rounded-xl border transition-all duration-300 ${isNext ? 'bg-gray-800 border-amber-500/50 shadow-lg shadow-amber-900/20 scale-105' : 'bg-gray-800/50 border-gray-700'}`}>
                   <div className="flex justify-between items-start">
                      <div>
                          <div className="flex items-center gap-3 mb-1">
                             <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                 milestone.category === 'Cosmic' ? 'bg-purple-900 text-purple-300' :
                                 milestone.category === 'Particle' ? 'bg-cyan-900 text-cyan-300' :
                                 milestone.category === 'Chemistry' ? 'bg-green-900 text-green-300' :
                                 'bg-teal-900 text-teal-300'
                             }`}>
                                {milestone.category}
                             </span>
                             <h3 className={`text-xl font-bold ${isCompleted ? 'text-white' : 'text-gray-300'}`}>{milestone.title}</h3>
                          </div>
                          <p className="text-gray-400 mb-4">{milestone.description}</p>
                          
                          {!isCompleted && !isLocked && (
                             <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Requirements:</p>
                                <div className="flex flex-wrap gap-2">
                                   {milestone.requirements && Object.values(milestone.requirements).flat().map(req => (
                                       <span key={req} className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 font-mono">
                                          {req}
                                       </span>
                                   ))}
                                </div>
                             </div>
                          )}
                      </div>
                      
                      <div className="text-right">
                         {isCompleted ? (
                             <span className="text-2xl">✅</span>
                         ) : (
                             <span className="text-sm font-bold text-amber-500">+{milestone.xpReward} XP</span>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default GameProgress;
