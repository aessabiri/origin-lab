import React, { useMemo } from 'react';
import { useProgressionStore } from '../store/progressionStore';
import { QUESTS, QUEST_CATEGORIES } from '../constants/quests';
import { MATTER_DEFINITIONS } from '../constants/matterRegistry';
import ParticleIcon from '../particle-lab/components/ParticleIcon';
import { PARTICLE_COLORS } from '../constants/particles';

const Goals = () => {
  const { completedQuests, level, xp } = useProgressionStore();

  const groupedQuests = useMemo(() => {
    const groups = {};
    Object.values(QUEST_CATEGORIES).forEach(cat => {
      groups[cat] = QUESTS.filter(q => q.category === cat);
    });
    return groups;
  }, []);

  const calculateCategoryProgress = (category) => {
    const categoryQuests = groupedQuests[category];
    const completedCount = categoryQuests.filter(q => completedQuests.includes(q.id)).length;
    return {
      completed: completedCount,
      total: categoryQuests.length,
      percent: Math.round((completedCount / categoryQuests.length) * 100)
    };
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white overflow-y-auto animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-8 py-6 flex justify-between items-center">
        <div>
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
             GOALS & MISSIONS
           </h1>
           <p className="text-slate-400 text-sm font-mono tracking-wider mt-1">UNIVERSAL PROGRESSION TRACKER</p>
        </div>
        
        <div className="flex gap-6 items-center">
            <div className="text-right">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Level</div>
                <div className="text-2xl font-black text-blue-400">{level}</div>
            </div>
            <div className="h-10 w-px bg-slate-700"></div>
            <div className="text-right">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total XP</div>
                <div className="text-2xl font-black text-purple-400">{xp.toLocaleString()}</div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 pb-32 space-y-12">
        
        {Object.values(QUEST_CATEGORIES).map(category => {
            const progress = calculateCategoryProgress(category);
            return (
                <section key={category} className="space-y-6">
                    <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className={`w-3 h-3 rounded-full ${category === 'Physics' ? 'bg-blue-500' : category === 'Chemistry' ? 'bg-green-500' : 'bg-teal-500'}`}></span>
                                {category} Era
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{progress.completed} / {progress.total} Complete</span>
                            <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${category === 'Physics' ? 'bg-blue-500' : category === 'Chemistry' ? 'bg-green-500' : 'bg-teal-500'}`}
                                    style={{ width: `${progress.percent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedQuests[category].map(quest => (
                            <QuestCard 
                                key={quest.id} 
                                quest={quest} 
                                isCompleted={completedQuests.includes(quest.id)} 
                            />
                        ))}
                    </div>
                </section>
            );
        })}

      </div>
    </div>
  );
};

const QuestCard = ({ quest, isCompleted }) => {
    return (
        <div className={`relative p-5 rounded-2xl border transition-all duration-300 ${
            isCompleted 
            ? 'bg-slate-800/30 border-emerald-500/30 opacity-80' 
            : 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800'
        }`}>
            {isCompleted && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-1 shadow-lg shadow-emerald-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}

            <div className="flex gap-4">
                <div className="shrink-0 pt-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-900/50 text-slate-400'}`}>
                        {quest.category === 'Physics' ? '⚛️' : quest.category === 'Chemistry' ? '⚗️' : '🧬'}
                    </div>
                </div>
                
                <div className="flex-1 space-y-1">
                    <h3 className={`font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {quest.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {quest.description}
                    </p>
                    
                    <div className="pt-3 flex flex-wrap gap-2">
                        {Object.keys(quest.requirements).map(reqId => {
                            const info = MATTER_DEFINITIONS[reqId];
                            if (!info) return null;
                            return (
                                <div key={reqId} className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                    <div className="w-4 h-4">
                                        <ParticleIcon type={reqId} color={PARTICLE_COLORS[reqId]} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{info.name}</span>
                                </div>
                            );
                        })}
                        <div className="ml-auto px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                            +{quest.rewards.xp} XP
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Goals;
