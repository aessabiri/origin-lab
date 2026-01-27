import React from 'react';
import { useBioStore } from '../store';

const BioModeSelector = ({ currentMode, setMode, theme }) => {
  const { agents, isRunning, synthesizedProteins, unlockedAminoAcids, currentCellDesign } = useBioStore();

  // Default theme (Teal/Biology)
  const t = theme || {
    sidebarBg: 'bg-teal-950/80',
    borderColor: 'border-teal-800',
    headerText: 'text-teal-500',
    itemHover: 'hover:bg-teal-900/30 hover:text-teal-200',
    itemActive: 'bg-teal-900/60 text-white',
    itemInactive: 'text-teal-400',
    highlight: 'bg-teal-400',
    shadow: 'shadow-[0_0_10px_rgba(45,212,191,0.5)]',
    labelActive: 'text-teal-100',
    labelInactive: 'text-teal-300',
    descText: 'text-teal-500/80',
    statLabel: 'text-teal-500/70',
    statValueActive: 'text-teal-200',
    statValueInactive: 'text-teal-400'
  };

  const modes = [
    {
      id: 'simulation',
      label: 'Petri Dish',
      icon: '🧫',
      description: 'Observe & Evolve',
      stats: [
        { label: 'Population', value: agents.length },
        { label: 'Status', value: isRunning ? 'Active' : 'Paused' }
      ]
    },
    {
      id: 'folding',
      label: 'Protein Lab',
      icon: '🧬',
      description: 'Fold & Sequence',
      stats: [
        { label: 'Synthesized', value: synthesizedProteins.length },
        { label: 'Amino Acids', value: unlockedAminoAcids.length }
      ]
    },
    {
      id: 'assembly',
      label: 'Cell Assembly',
      icon: '🦠',
      description: 'Design LUCA',
      stats: [
        { label: 'Organelles', value: currentCellDesign.organelles.length },
        { label: 'Membrane', value: currentCellDesign.membrane ? 'Ready' : 'Pending' }
      ]
    },
    {
      id: 'inventory',
      label: 'Bio-Storage',
      icon: '📦',
      description: 'Manage Resources',
      stats: [
        { label: 'Soup Volume', value: 'Check' },
        { label: 'Global Items', value: 'Access' }
      ]
    }
  ];

  return (
    <div className={`flex flex-col w-64 h-full ${t.sidebarBg} border-r ${t.borderColor} shadow-xl z-20 backdrop-blur-md transition-colors duration-500`}>
      <div className={`p-4 border-b ${t.borderColor}/50`}>
        <h2 className={`text-xs font-bold ${t.headerText} uppercase tracking-widest`}>Lab Modules</h2>
      </div>
      
      <div className="flex-1 flex flex-col">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              className={`flex-1 flex flex-col p-6 text-left transition-all duration-300 border-b ${t.borderColor}/30 relative group
                ${isActive 
                  ? t.itemActive 
                  : t.itemHover
                }
                ${!isActive && t.itemInactive}
              `}
            >
              {isActive && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.highlight} ${t.shadow}`}></div>
              )}
              
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl filter drop-shadow-md">{mode.icon}</span>
                <span className={`font-bold text-lg ${isActive ? t.labelActive : t.labelInactive}`}>
                  {mode.label}
                </span>
              </div>
              
              <p className={`text-xs ${t.descText} mb-4 font-mono`}>{mode.description}</p>
              
              <div className="mt-auto space-y-2">
                {mode.stats.map((stat, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className={t.statLabel}>{stat.label}</span>
                    <span className={`font-mono font-bold ${isActive ? t.statValueActive : t.statValueInactive}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BioModeSelector;
