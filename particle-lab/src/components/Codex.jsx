import React, { useState } from 'react';
import ParticleIcon from './ParticleIcon';
import { PARTICLE_NAMES, PARTICLE_COLORS } from '../constants/particles';

const Codex = ({ isVisible, onClose, allParticles, discoveredParticles, onParticleClick }) => {
  const [showAll, setShowAll] = useState(false);

  if (!isVisible) return null;

  const discoveredSet = new Set(discoveredParticles.map(p => p.type));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800/90 border-2 border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        <div className="absolute top-6 right-20">
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label={showAll ? 'Hide undiscovered' : 'Show all'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors ${showAll ? 'text-amber-300' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-amber-300">Particle Codex</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close codex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
            {allParticles.map(particle => {
              const isDiscovered = showAll || discoveredSet.has(particle.type);
              return (
                <div
                  key={particle.type}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${isDiscovered ? 'cursor-pointer hover:bg-gray-700' : 'cursor-default'}`}
                  onClick={() => isDiscovered && onParticleClick(particle.type)}
                >
                  <div className={`relative w-20 h-20 ${isDiscovered ? '' : 'opacity-20'}`}>
                    <ParticleIcon type={particle.type} color={PARTICLE_COLORS[particle.type]} />
                  </div>
                  <p className={`mt-2 text-center text-sm font-semibold ${isDiscovered ? 'text-white' : 'text-gray-500'}`}>
                    {isDiscovered ? PARTICLE_NAMES[particle.type] : '???'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Codex;