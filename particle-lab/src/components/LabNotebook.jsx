import React, { useState, useEffect } from 'react';
import Codex from './Codex';
import Spectroscope3D from './Spectroscope3D';
import { useStore } from '../store';
import { PARTICLE_NAMES } from '../constants/particles';
import { useDiscoveredMatter } from '../hooks/useDiscoveredMatter';
import { MATTER_DEFINITIONS, getMatterInfo } from '../constants/matterRegistry';

import { buildLineageTree, aggregateFundamentalConstituents } from '../utils/lineageTree.js';
import ParticleIcon from '../particle-lab/components/ParticleIcon.jsx';

const TABS = {
  CODEX: 'Codex',
  LINEAGE: 'Lineage',
  SPECTROSCOPE: 'Spectroscope',
  SETTINGS: 'Settings',
  SYSTEM: 'System',
  GOALS: 'Goals',
};

const THEME_MAP = {
  particle: {
    bg: 'bg-gray-900',
    sidebar: 'bg-gray-950',
    border: 'border-gray-700',
    accent: 'text-amber-300',
    accentBg: 'bg-amber-500/20',
    tabActive: 'bg-amber-900/30 text-amber-400 border-amber-800/50',
    icon: '⚛️'
  },
  chemistry: {
    bg: 'bg-slate-900',
    sidebar: 'bg-slate-950',
    border: 'border-slate-700',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/20',
    tabActive: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
    icon: '⚗️'
  },
  biology: {
    bg: 'bg-teal-950',
    sidebar: 'bg-teal-900',
    border: 'border-teal-800',
    accent: 'text-teal-300',
    accentBg: 'bg-teal-500/20',
    tabActive: 'bg-teal-800/50 text-teal-200 border-teal-700/50',
    icon: '🧫'
  },
  biotech: { 
    bg: 'bg-indigo-950',
    sidebar: 'bg-indigo-900',
    border: 'border-indigo-800',
    accent: 'text-indigo-300',
    accentBg: 'bg-indigo-500/20',
    tabActive: 'bg-indigo-800/50 text-indigo-200 border-indigo-700/50',
    icon: '🧬'
  }
};

const LabNotebook = ({ isOpen, onClose, initialTab = TABS.CODEX, onDragStart, onParticleClick, particleCategories, discoveredParticles }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [inspectedItem, setInspectedItem] = useState(null);
  const [isHiddenForDrag, setIsHiddenForDrag] = useState(false);

  const {
    uiScale, setUiScale,
    executeReset,
    isSandboxMode,
    goalPath,
    currentGoalIndex,
    currentView
  } = useStore();

  const { discoveredAtoms, discoveredMolecules } = useDiscoveredMatter();
  const theme = THEME_MAP[currentView] || THEME_MAP.particle;

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, initialTab, onClose]);

  if (!isOpen) return null;

  const handleParticleSelection = (particleId) => {
    setInspectedItem(particleId);
    setActiveTab(TABS.LINEAGE);
    if (onParticleClick) onParticleClick(particleId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.CODEX:
        return (
          <Codex
            isVisible={true}
            isEmbedded={true}
            particleCategories={particleCategories}
            discoveredParticles={discoveredParticles}
            onParticleClick={handleParticleSelection}
            onDragStart={onDragStart}
            onDragStateChange={setIsHiddenForDrag}
          />
        );
      case TABS.LINEAGE:
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto">
                <LineageView itemId={inspectedItem} theme={theme} onSelect={setInspectedItem} />
            </div>
            {inspectedItem && (
                <div className="p-4 flex justify-center border-t border-white/5">
                    <button 
                        onClick={() => setActiveTab(TABS.SPECTROSCOPE)}
                        className={`px-6 py-2 rounded-full ${theme.accentBg} ${theme.accent} border border-white/10 font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-xl`}
                    >
                        <span>🔬</span> Visual Spectrum Analysis
                    </button>
                </div>
            )}
          </div>
        );
      case TABS.SPECTROSCOPE:
        return (
            <div className="p-8 h-full flex flex-col">
                <div className="flex-1 min-h-0">
                    <Spectroscope3D itemId={inspectedItem} />
                </div>
                <div className="mt-6 flex justify-center gap-8">
                    <button 
                        onClick={() => setActiveTab(TABS.LINEAGE)}
                        className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-black tracking-[0.2em] flex items-center gap-2"
                    >
                        <span>🌳</span> View Lineage
                    </button>
                    <button 
                        onClick={() => setActiveTab(TABS.CODEX)}
                        className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-black tracking-[0.2em] flex items-center gap-2"
                    >
                        <span>🧬</span> Return to Codex
                    </button>
                </div>
            </div>
        );
      case TABS.SETTINGS:
        return (
          <div className="p-8 max-w-2xl mx-auto">
            <h2 className={`text-3xl font-bold ${theme.accent} mb-8`}>Lab Settings</h2>
            
            <div className={`bg-gray-800/50 p-6 rounded-xl border ${theme.border}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-200">UI Scale</span>
                <span className={`font-mono ${theme.accent}`}>{(uiScale * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="1.5" 
                step="0.1" 
                value={uiScale} 
                onChange={e => setUiScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <p className="text-gray-400 text-sm mt-2">Adjust the size of particles and interface elements.</p>
            </div>
          </div>
        );
      case TABS.SYSTEM:
        return (
          <div className="p-8 max-w-2xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-red-400 mb-8">System Controls</h2>
            
            <div className="bg-red-900/20 p-8 rounded-xl border border-red-800 mb-8 w-full">
              <h3 className="text-xl font-bold text-red-200 mb-2">Factory Reset</h3>
              <p className="text-red-300/70 mb-6">Irreversible. Wipes all progress, discovered particles, and resets the simulation to the beginning.</p>
              <button 
                onClick={() => {
                  if (confirm('Are you absolutely sure? This cannot be undone.')) {
                    executeReset();
                    onClose();
                  }
                }}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg transition-colors"
              >
                Reset Everything
              </button>
            </div>

            <div className={`bg-gray-800/50 p-6 rounded-xl border ${theme.border} w-full`}>
              <h3 className="text-xl font-bold text-gray-200 mb-2">Version Info</h3>
              <p className="text-gray-400 font-mono">Origin Lab v0.2.0-beta</p>
              <p className="text-gray-500 text-sm mt-2">Running in {isSandboxMode ? 'Sandbox' : 'Adventure'} Mode</p>
            </div>
          </div>
        );
      case TABS.GOALS:
        return (
          <div className="p-8">
            <h2 className={`text-3xl font-bold ${theme.accent} mb-8`}>Research Goals</h2>
            <div className={`bg-gray-800/50 p-6 rounded-xl border ${theme.border}`}>
              <p className="text-gray-300">Current Path: <span className={`font-bold ${theme.accent} capitalize`}>{goalPath}</span></p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Progress</span>
                  <span>{currentGoalIndex} / ??</span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`bg-white h-full transition-all duration-500`} 
                    style={{ width: `${Math.min(100, (currentGoalIndex / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <StatCard label="Atoms Discovered" value={discoveredAtoms.length} color="text-blue-400" border={theme.border} />
              <StatCard label="Molecules Discovered" value={discoveredMolecules.length} color="text-green-400" border={theme.border} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-150 ${isHiddenForDrag ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={onClose}>
      <div className={`${theme.bg} border ${theme.border} rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden`} onClick={e => e.stopPropagation()}>
        
        {/* Sidebar */}
        <div className={`w-64 ${theme.sidebar} border-r ${theme.border} flex flex-col transition-colors duration-500`}>
          <div className={`p-6 border-b ${theme.border}`}>
            <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
              <span className="text-2xl">{theme.icon}</span> LAB NOTES
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <TabButton active={activeTab === TABS.CODEX} onClick={() => setActiveTab(TABS.CODEX)} icon="🧬" theme={theme}>Codex</TabButton>
            <TabButton active={activeTab === TABS.LINEAGE} onClick={() => setActiveTab(TABS.LINEAGE)} icon="🌳" theme={theme}>Lineage</TabButton>
            <TabButton active={activeTab === TABS.SPECTROSCOPE} onClick={() => setActiveTab(TABS.SPECTROSCOPE)} icon="🔬" theme={theme}>Spectroscope</TabButton>
            <TabButton active={activeTab === TABS.GOALS} onClick={() => setActiveTab(TABS.GOALS)} icon="🎯" theme={theme}>Goals</TabButton>
            <TabButton active={activeTab === TABS.SETTINGS} onClick={() => setActiveTab(TABS.SETTINGS)} icon="⚙️" theme={theme}>Settings</TabButton>
            <TabButton active={activeTab === TABS.SYSTEM} onClick={() => setActiveTab(TABS.SYSTEM)} icon="⚠️" theme={theme}>System</TabButton>
          </nav>

          <div className={`p-4 border-t ${theme.border}`}>
            <button 
              onClick={onClose}
              className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-semibold"
            >
              Close Notebook
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const TreeNode = ({ node, onSelect, isRoot = false, level = 0 }) => {
  if (!node) return null;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Node Card */}
      <button
        onClick={() => onSelect(node.type)}
        className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl ${
          isRoot 
            ? 'bg-gradient-to-r from-[#172338] to-[#101929] border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.3)] z-20' 
            : 'bg-[#0f1728]/90 hover:bg-[#152038] border-cyan-500/30 hover:border-amber-400/60'
        }`}
      >
        {/* Quantity Badge */}
        {node.count > 1 && (
          <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-black">
            {node.count}×
          </span>
        )}

        {/* Mini Icon */}
        <div className="w-8 h-8 relative flex items-center justify-center">
          <ParticleIcon type={node.type} color={node.color} />
        </div>

        {/* Text Details */}
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
            {node.name}
          </span>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
            {node.category}
          </span>
        </div>

        {/* Hover inspect tooltip */}
        {!isRoot && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0a0f18] border border-cyan-500/40 text-[9px] font-mono text-cyan-300 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-30">
            Focus Lineage
          </div>
        )}
      </button>

      {/* Children Branches */}
      {hasChildren && (
        <div className="flex flex-col items-center w-full mt-3">
          {/* Vertical stem down from parent */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400/80 to-cyan-500/30"></div>

          {/* Children container with horizontal connector */}
          <div className="relative flex justify-center gap-6 pt-3">
            {node.children.length > 1 && (
              <div 
                className="absolute top-0 h-0.5 bg-cyan-500/40 rounded-full" 
                style={{ 
                  left: '20px', 
                  right: '20px' 
                }} 
              />
            )}

            {node.children.map((child, idx) => (
              <div key={`${child.type}-${idx}-${level}`} className="relative flex flex-col items-center">
                {/* Vertical connector line from crossbar */}
                {node.children.length > 1 && (
                  <div className="w-0.5 h-3 bg-cyan-500/40 -mt-3 mb-0"></div>
                )}
                <TreeNode 
                  node={child} 
                  onSelect={onSelect} 
                  level={level + 1} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LineageView = ({ itemId, theme, onSelect }) => {
  if (!itemId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
        <span className="text-6xl mb-4">🌳</span>
        <h3 className="text-2xl font-black font-sans uppercase tracking-wider text-slate-300">
          The Tree of Matter
        </h3>
        <p className="mt-2 text-sm text-slate-500 font-mono">
          Select any element, molecule, or hadron in the Codex to trace its subatomic ancestry.
        </p>
      </div>
    );
  }

  const info = getMatterInfo(itemId);
  const treeData = buildLineageTree(itemId);
  const fundamentalStats = aggregateFundamentalConstituents(itemId);

  return (
    <div className="p-6 min-h-full flex flex-col items-center max-w-6xl mx-auto custom-scrollbar">
      
      {/* Header & Subtitle */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-cyan-500/20 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧬</span>
            <h2 className="text-2xl font-black font-sans uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
              Lineage: {info.name}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Recursive breakdown from macroscopic compound down to fundamental quarks & leptons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
            {info.category || 'Compound'}
          </span>
        </div>
      </div>

      {/* Main Interactive Tree Container */}
      <div className="w-full flex-1 flex justify-center items-start py-6 px-4 overflow-x-auto custom-scrollbar">
        {treeData ? (
          <TreeNode node={treeData} onSelect={onSelect} isRoot={true} />
        ) : (
          <p className="text-slate-500 font-mono text-sm">No constituent sub-particles available.</p>
        )}
      </div>

      {/* Fundamental Ledger Summary Cards */}
      <div className="w-full mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0f1726]/90 border border-amber-500/30 flex flex-col gap-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-black">Up Quarks (u)</span>
            <span className="text-xs">⚡</span>
          </div>
          <span className="text-2xl font-mono font-black text-amber-300">
            {fundamentalStats.upQuarks}
          </span>
          <span className="text-[9px] font-mono text-slate-500">+2/3 e charge each</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1726]/90 border border-indigo-500/30 flex flex-col gap-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-indigo-400 uppercase font-black">Down Quarks (d)</span>
            <span className="text-xs">⚡</span>
          </div>
          <span className="text-2xl font-mono font-black text-indigo-300">
            {fundamentalStats.downQuarks}
          </span>
          <span className="text-[9px] font-mono text-slate-500">-1/3 e charge each</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1726]/90 border border-cyan-500/30 flex flex-col gap-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-black">Electrons (e⁻)</span>
            <span className="text-xs">✨</span>
          </div>
          <span className="text-2xl font-mono font-black text-cyan-300">
            {fundamentalStats.electrons}
          </span>
          <span className="text-[9px] font-mono text-slate-500">-1 e charge each</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1726]/90 border border-emerald-500/30 flex flex-col gap-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-black">Net Charge (Q)</span>
            <span className="text-xs">⚖️</span>
          </div>
          <span className="text-2xl font-mono font-black text-emerald-300">
            {fundamentalStats.netCharge >= 0 ? `+${fundamentalStats.netCharge}` : fundamentalStats.netCharge} e
          </span>
          <span className="text-[9px] font-mono text-slate-500">Total electrostatic balance</span>
        </div>
      </div>

      {/* Description card */}
      <div className="w-full mt-4 p-4 rounded-2xl bg-[#0a0e17]/80 border border-cyan-500/15 text-center text-xs text-slate-400 font-sans">
        "{info.description || 'Elementary constituent of universal matter.'}"
      </div>

    </div>
  );
};

const TabButton = ({ children, active, onClick, icon, theme }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? `${theme.tabActive} border shadow-inner` 
        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-semibold text-sm uppercase tracking-wider">{children}</span>
  </button>
);

const StatCard = ({ label, value, color, border }) => (
  <div className={`bg-gray-800/50 p-6 rounded-xl border ${border} flex items-center justify-between`}>
    <span className="text-gray-400 font-bold uppercase text-xs tracking-tighter">{label}</span>
    <span className={`text-3xl font-mono font-bold ${color}`}>{value}</span>
  </div>
);

export default LabNotebook;
