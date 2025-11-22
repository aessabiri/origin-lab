import React, { useState } from 'react';

const ActionMenu = ({
  isVisible,
  onClose,
  onSetGoalPath,
  onOpenCodex,
  onOpenPeriodicTable,
  onOpenSettings,
  onOpenTimeline,
  onOpenStellarNursery,
  onEmptyCanvas,
  onReset,
  onToggleSandbox,
  isSandbox,
  hasParticles,
}) => {
  const [isRoadToDnaVisible, setIsRoadToDnaVisible] = useState(false);

  if (!isVisible) return null;

  const handleSetGoalPath = (path) => {
    onSetGoalPath(path);
    onClose();
  };

  const handleSandboxClick = () => {
    onToggleSandbox();
    onClose();
  };

  return (
    <div className="absolute bottom-full mb-2 flex flex-col gap-2 w-48" onClick={e => e.stopPropagation()}>
      <button onClick={handleSandboxClick} className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-teal-600 hover:bg-teal-500 transition-colors">
        {isSandbox ? 'Exit Sandbox' : 'Enter Sandbox'}
      </button>
      <button onClick={() => setIsRoadToDnaVisible(prev => !prev)} className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 transition-colors">
        Road to DNA
      </button>
      {isRoadToDnaVisible && (
        <div className="pl-4 flex flex-col gap-1">
          <button onClick={() => handleSetGoalPath('fast')} className="w-full text-left px-3 py-2 text-sm text-white font-semibold rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">» Fast</button>
          <button onClick={() => handleSetGoalPath('medium')} className="w-full text-left px-3 py-2 text-sm text-white font-semibold rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">» Medium</button>
          <button onClick={() => handleSetGoalPath('slow')} className="w-full text-left px-3 py-2 text-sm text-white font-semibold rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">» Slow</button>
        </div>
      )}
      <button onClick={onOpenCodex} className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 transition-colors">Particle Codex</button>
      <button onClick={onOpenPeriodicTable} className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 transition-colors">Periodic Table</button>
      <button onClick={onOpenTimeline} className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 transition-colors">Big Bang Timeline</button>
      <button onClick={onOpenStellarNursery} className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 transition-colors">Stellar Nursery</button>
      <button onClick={onOpenSettings} className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 transition-colors">Settings</button>
      <button onClick={onEmptyCanvas} disabled={!hasParticles} className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-red-800 hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed">Empty Canvas</button>
      <button
        onClick={onReset}
        className="w-full text-left px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-indigo-800 hover:bg-indigo-700 transition-colors"
      >
        Reset Lab
      </button>
    </div>
  );
};

export default ActionMenu;