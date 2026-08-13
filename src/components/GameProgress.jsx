import React, { useMemo } from 'react';
import { useProgressionStore } from '../store/progressionStore';

const ERA_COLORS = {
  'Cosmic': { bg: 'bg-purple-950/80 border-purple-500/40 text-purple-300', dot: 'bg-purple-500 border-purple-300' },
  'Particle': { bg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300', dot: 'bg-cyan-400 border-cyan-200' },
  'Chemistry': { bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300', dot: 'bg-emerald-400 border-emerald-200' },
  'Biology': { bg: 'bg-teal-950/80 border-teal-500/40 text-teal-300', dot: 'bg-teal-400 border-teal-200' },
};

const GameProgress = () => {
  const { xp, level, completedMilestones, getMilestones } = useProgressionStore();
  const milestones = getMilestones();

  const nextLevelXp = level * 1000;
  const progressPercent = Math.min(100, Math.round(((xp % 1000) / 1000) * 100));

  return (
    <div className="w-full h-full bg-[#070a13] text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* 1. HEADER & EVOLUTION STATS */}
      <header className="px-8 py-6 bg-[#0c1220]/90 backdrop-blur-2xl border-b border-cyan-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌌</span>
            <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">
              Cosmic Timeline & Evolution
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Universal epoch milestones from primordial Planck density to conscious planetary life
          </p>
        </div>

        {/* Level Progression HUD */}
        <div className="flex items-center gap-6 bg-[#080d1a] border border-cyan-500/25 p-3 rounded-2xl shadow-inner">
          <div className="flex flex-col items-center px-2">
            <span className="text-[9px] font-mono text-amber-400 uppercase font-black tracking-widest">Epoch Level</span>
            <span className="text-2xl font-black font-mono text-white">Tier {level}</span>
          </div>

          <div className="h-8 w-px bg-cyan-500/20" />

          <div className="flex flex-col gap-1 w-44">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-400">Total XP</span>
              <span className="text-amber-300 font-bold">{xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. TIMELINE TREE */}
      <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto pb-20 relative">
          
          {/* Vertical Circuit Trunk */}
          <div className="absolute top-6 bottom-6 left-6 w-1 bg-gradient-to-b from-cyan-400 via-amber-400 to-teal-400/40 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]" />

          <div className="space-y-8 relative">
            {milestones.map((milestone, index) => {
              const isCompleted = completedMilestones.includes(milestone.id);
              const isLocked = !isCompleted && (index > 0 && !completedMilestones.includes(milestones[index - 1].id));
              const isNext = !isCompleted && !isLocked;
              const eraTheme = ERA_COLORS[milestone.category] || ERA_COLORS['Cosmic'];

              return (
                <div 
                  key={milestone.id} 
                  className={`relative pl-14 transition-all duration-300 ${
                    isLocked ? 'opacity-35 grayscale-[50%]' : 'opacity-100'
                  }`}
                >
                  {/* Timeline Beacon Node */}
                  <div 
                    className={`absolute left-[18px] top-5 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${
                      isCompleted 
                        ? 'bg-emerald-400 border-white shadow-[0_0_12px_rgba(52,211,153,1)] scale-110' 
                        : isNext 
                          ? 'bg-amber-400 border-white shadow-[0_0_15px_rgba(251,191,36,1)] animate-ping' 
                          : 'bg-slate-800 border-slate-600'
                    }`}
                  />
                  {isNext && (
                    <div className="absolute left-[18px] top-5 w-4 h-4 rounded-full bg-amber-400 border-2 border-white z-20 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                  )}

                  {/* Milestone Card */}
                  <div 
                    className={`p-6 rounded-3xl border transition-all duration-300 shadow-xl ${
                      isCompleted 
                        ? 'bg-[#0c1624]/80 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                        : isNext 
                          ? 'bg-[#121a2c] border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]' 
                          : 'bg-[#0a0f1d]/80 border-cyan-500/15'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider ${eraTheme.bg}`}>
                            {milestone.category}
                          </span>
                          <h3 className="text-lg font-black text-white">
                            {milestone.title}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-400 font-sans leading-relaxed">
                          {milestone.description}
                        </p>

                        {/* Requirements Tag */}
                        {!isCompleted && !isLocked && milestone.requirements && (
                          <div className="pt-2 flex flex-wrap items-center gap-2">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">Requirements:</span>
                            {Object.values(milestone.requirements).flat().map((req, rIdx) => (
                              <span 
                                key={rIdx} 
                                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Badge */}
                      <div className="shrink-0">
                        {isCompleted ? (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black shadow-md">
                            <span>✓</span> UNLOCKED
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs font-black shadow-md">
                            +{milestone.xpReward || 250} XP
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </main>

    </div>
  );
};

export default React.memo(GameProgress);
