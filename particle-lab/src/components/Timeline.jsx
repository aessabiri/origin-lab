import React from 'react';
import { useStore } from '../store';
import { PARTICLE_NAMES } from '../constants/particles';

const Timeline = () => {
  const { discoveredAtoms, discoveredMolecules, isTimelineVisible, setIsTimelineVisible } = useStore();

  if (!isTimelineVisible) return null;

  const discoveredItems = [...discoveredAtoms, ...discoveredMolecules]
    .sort((a, b) => (a.discoveredAt || 0) - (b.discoveredAt || 0));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setIsTimelineVisible(false)}>
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-3/4 h-3/4 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-center mb-4">Big Bang Timeline</h3>
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-600"></div>

          {discoveredItems.map((item, index) => (
            <div key={index} className="mb-8 relative">
              <div className="absolute left-[-2rem] top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full border-2 border-gray-800"></div>
              <p className="font-bold text-lg text-amber-300">{PARTICLE_NAMES[item.type]}</p>
              <p className="text-sm text-gray-400">Discovered at: {new Date(item.discoveredAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsTimelineVisible(false)}
          className="absolute top-4 right-4 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Timeline;