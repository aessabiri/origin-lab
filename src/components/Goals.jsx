import React, { useState, useMemo } from 'react';
import { useProgressionStore } from '../store/progressionStore';
import { QUESTS, QUEST_CATEGORIES } from '../constants/quests';
import { getUniversalItemInfo } from '../utils/codexData';
import ParticleIcon from '../particle-lab/components/ParticleIcon';

const ERA_THEMES = {
  'All': { color: 'border-cyan-500/40 text-cyan-300', bg: 'bg-cyan-500/20' },
  'Physics': { color: 'border-sky-500/40 text-sky-300', bg: 'bg-sky-500/20', icon: '⚛️' },
  'Chemistry': { color: 'border-emerald-500/40 text-emerald-300', bg: 'bg-emerald-500/20', icon: '⚗️' },
  'Biology': { color: 'border-teal-500/40 text-teal-300', bg: 'bg-teal-500/20', icon: '🧫' },
  'Planetary': { color: 'border-indigo-500/40 text-indigo-300', bg: 'bg-indigo-500/20', icon: '🌍' },
};

const Goals = () => {
  const { completedQuests, level, xp } = useProgressionStore();
  const [selectedEra, setSelectedEra] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const nextLevelXp = level * 1000;
  const levelProgress = Math.min(100, Math.round((xp % 1000) / 10));

  const filteredQuests = useMemo(() => {
    return QUESTS.filter(q => {
      const matchesEra = selectedEra === 'All' || q.category === selectedEra;
      const matchesSearch = !searchQuery || 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEra && matchesSearch;
    });
  }, [selectedEra, searchQuery]);

  const stats = useMemo(() => {
    const total = QUESTS.length;
    const completed = completedQuests.length;
    const percent = Math.round((completed / (total || 1)) * 100);
    return { total, completed, percent };
  }, [completedQuests]);

  return (
    <div className="w-full h-full bg-[#070a13] text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* 1. TOP HEADER & TELEMETRY */}
      <header className="px-8 py-6 bg-[#0c1220]/90 backdrop-blur-2xl border-b border-cyan-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
              Missions & Goals
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Universal Milestone Progression & Evolutionary Technology Unlocks
          </p>
        </div>

        {/* Level & XP HUD */}
        <div className="flex items-center gap-6 bg-[#080d1a] border border-cyan-500/25 p-3 rounded-2xl shadow-inner">
          <div className="flex flex-col items-center px-2">
            <span className="text-[9px] font-mono text-cyan-400 uppercase font-black tracking-widest">Evolution Tier</span>
            <span className="text-2xl font-black font-mono text-white">Tier {level}</span>
          </div>

          <div className="h-8 w-px bg-cyan-500/20" />

          <div className="flex flex-col gap-1 w-44">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-400">XP Progress</span>
              <span className="text-cyan-300 font-bold">{xp} / {nextLevelXp}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div className="px-8 py-4 bg-[#090e1b]/80 border-b border-cyan-500/15 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        
        {/* Era Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {['All', ...Object.values(QUEST_CATEGORIES)].map(era => {
            const isSelected = selectedEra === era;
            const theme = ERA_THEMES[era] || ERA_THEMES['All'];

            return (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all border ${
                  isSelected 
                    ? `${theme.bg} ${theme.color} shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105` 
                    : 'bg-white/5 border-transparent text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {theme.icon ? `${theme.icon} ` : ''}{era}
              </button>
            );
          })}
        </div>

        {/* Search Input & Global Stats */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search objectives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-1.5 pl-8 pr-3 rounded-xl bg-[#060a14] border border-cyan-500/25 text-xs text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">🔍</span>
          </div>

          <span className="text-xs font-mono text-cyan-300 font-bold whitespace-nowrap">
            {stats.completed} / {stats.total} ({stats.percent}%)
          </span>
        </div>
      </div>

      {/* 3. QUEST CARDS GRID */}
      <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
          {filteredQuests.map(quest => {
            const isCompleted = completedQuests.includes(quest.id);
            const rewardInfo = quest.rewardItem ? getUniversalItemInfo(quest.rewardItem) : null;

            return (
              <div
                key={quest.id}
                className={`relative p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between gap-4 shadow-xl ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-emerald-950/40 via-[#0c1624]/60 to-[#080d18] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                    : 'bg-[#0c1220]/90 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-[#10192a]'
                }`}
              >
                {/* Top: Header, Title & Completion Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold uppercase">
                      {quest.category} Era
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-black">
                        <span>✓</span> COMPLETED
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono text-xs font-bold">
                        +{quest.xp || 100} XP
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-white leading-snug">
                    {quest.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
                    {quest.description}
                  </p>
                </div>

                {/* Bottom: Objectives & Rewards */}
                <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {quest.targetItem && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-300">
                        <span>Target:</span>
                        <strong className="text-cyan-300">{quest.targetItem}</strong>
                      </div>
                    )}
                  </div>

                  {rewardInfo && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Reward:</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                        <div className="w-4 h-4">
                          <ParticleIcon type={quest.rewardItem} color={rewardInfo.color} />
                        </div>
                        <span>{rewardInfo.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

    </div>
  );
};

export default React.memo(Goals);
