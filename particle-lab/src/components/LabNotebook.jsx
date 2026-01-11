import React, { useState, useEffect } from 'react';
import Codex from './Codex';
import { useStore } from '../store';
import { PARTICLE_NAMES } from '../constants/particles';

const TABS = {
  CODEX: 'Codex',
  SETTINGS: 'Settings',
  SYSTEM: 'System',
  GOALS: 'Goals',
};

const LabNotebook = ({ isOpen, onClose, initialTab = TABS.CODEX, onDragStart, onParticleClick, particleCategories, discoveredParticles }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { 
    uiScale, setUiScale, 
    executeReset, 
    isSandboxMode,
    goalPath,
    currentGoalIndex,
    discoveredAtoms,
    discoveredMolecules
  } = useStore();

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case TABS.CODEX:
        return (
          <Codex 
            isVisible={true} 
            isEmbedded={true}
            particleCategories={particleCategories} 
            discoveredParticles={discoveredParticles} 
            onParticleClick={onParticleClick} 
            onDragStart={onDragStart} 
          />
        );
      case TABS.SETTINGS:
        return (
          <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-teal-400 mb-8">Lab Settings</h2>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-200">UI Scale</span>
                <span className="font-mono text-teal-400">{(uiScale * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="1.5" 
                step="0.1" 
                value={uiScale} 
                onChange={e => setUiScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
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

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 w-full">
               <h3 className="text-xl font-bold text-gray-200 mb-2">Version Info</h3>
               <p className="text-gray-400 font-mono">Particle Lab v0.1.0-alpha</p>
               <p className="text-gray-500 text-sm mt-2">Running in {isSandboxMode ? 'Sandbox' : 'Adventure'} Mode</p>
            </div>
          </div>
        );
      case TABS.GOALS:
        // Mockup of Goals since we don't have direct access to the full Goal Objects in simple props usually
        // But we can infer from progress
        return (
          <div className="p-8">
             <h2 className="text-3xl font-bold text-amber-400 mb-8">Research Goals</h2>
             <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
               <p className="text-gray-300">Current Path: <span className="font-bold text-teal-400 capitalize">{goalPath}</span></p>
               <div className="mt-4 space-y-2">
                 <div className="flex justify-between text-sm text-gray-400">
                   <span>Progress</span>
                   <span>{currentGoalIndex} / ??</span>
                 </div>
                 <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (currentGoalIndex / 10) * 100)}%` }} // Approximate progress
                    ></div>
                 </div>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <StatCard label="Atoms Discovered" value={discoveredAtoms.length} color="text-blue-400" />
                <StatCard label="Molecules Discovered" value={discoveredMolecules.length} color="text-green-400" />
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Sidebar */}
        <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
              <span className="text-2xl">📓</span> LAB NOTES
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <TabButton active={activeTab === TABS.CODEX} onClick={() => setActiveTab(TABS.CODEX)} icon="🧬">Codex</TabButton>
            <TabButton active={activeTab === TABS.GOALS} onClick={() => setActiveTab(TABS.GOALS)} icon="🎯">Goals</TabButton>
            <TabButton active={activeTab === TABS.SETTINGS} onClick={() => setActiveTab(TABS.SETTINGS)} icon="⚙️">Settings</TabButton>
            <TabButton active={activeTab === TABS.SYSTEM} onClick={() => setActiveTab(TABS.SYSTEM)} icon="⚠️">System</TabButton>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button 
              onClick={onClose}
              className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-semibold"
            >
              Close Notebook
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-900 overflow-y-auto relative">
           {renderContent()}
        </div>

      </div>
    </div>
  );
};

const TabButton = ({ children, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-teal-900/30 text-teal-400 border border-teal-800/50 shadow-sm' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-semibold">{children}</span>
  </button>
);

const StatCard = ({ label, value, color }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-center justify-between">
    <span className="text-gray-400 font-bold uppercase text-sm">{label}</span>
    <span className={`text-3xl font-mono font-bold ${color}`}>{value}</span>
  </div>
);

export default LabNotebook;
