import React from 'react';
import { useParticleStore } from '../store.js';
import ParticleIcon from './ParticleIcon.jsx';
import { elementaryParticleGroups, PARTICLE_COLORS, PARTICLE_NAMES } from '../../constants/particles.js';

const LabSidebar = ({ onDragStart }) => {
  const { isPaletteVisible, uiScale, discoveredMolecules } = useParticleStore();

  return (
    <div className={`flex flex-col bg-gradient-to-b from-gray-800 to-slate-900 rounded-2xl shadow-xl overflow-y-auto transition-all duration-300 ease-in-out
      ${isPaletteVisible ? 'w-full md:w-80 p-4 border border-slate-700' : 'w-0 p-0 border-none'}
    `}>
      <div className={`min-w-[18rem] md:min-w-0 ${!isPaletteVisible ? 'hidden' : ''}`}>

      {Object.entries(elementaryParticleGroups).map(([groupName, particles]) => (
        <div key={groupName} className="mb-6">
          <h3 className="text-lg font-bold text-amber-300 mb-3 text-center border-b-2 border-gray-700 pb-2">{groupName}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {particles.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => onDragStart(e, p)}
                className="particle-palette-item cursor-grab group flex flex-col items-center"
              >
                <div
                  className="icon-container relative flex items-center justify-center"
                  style={{ width: `${80 * uiScale}px`, height: `${80 * uiScale}px` }}
                >
                  <div className="w-full h-full">
                    <ParticleIcon type={p.type} color={PARTICLE_COLORS[p.type]} />
                  </div>
                </div>
                <p className="text-center text-sm font-semibold mt-1 text-gray-300 group-hover:text-white transition-colors">{PARTICLE_NAMES[p.type]}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-amber-300 mb-3 text-center border-b-2 border-gray-700 pb-2">Discovered Molecules</h3>
        <div className="flex flex-wrap justify-center gap-4 min-h-[96px]">
          {discoveredMolecules.length > 0 ? (
            discoveredMolecules.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => onDragStart(e, p)}
                className="particle-palette-item cursor-grab group flex flex-col items-center"
              >
                <div
                  className="icon-container relative flex items-center justify-center"
                  style={{ width: `${80 * uiScale}px`, height: `${80 * uiScale}px` }}
                >
                  <div className="w-full h-full">
                    <ParticleIcon type={p.type} color={PARTICLE_COLORS[p.type]} isCompound />
                  </div>
                </div>
                <p className="text-center text-sm font-semibold mt-1 text-gray-300 group-hover:text-white transition-colors">{PARTICLE_NAMES[p.type]}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center w-full my-auto text-sm">Combine atoms to form molecules.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default LabSidebar;
