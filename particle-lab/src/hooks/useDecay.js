import { useEffect, useRef } from 'react';
import { PARTICLE_TYPES } from '../constants/particles.js';

export const useDecay = (
  particles,
  setParticles,
  showMessage,
  triggerRadiationBurst
) => {
  const decayTimeouts = useRef([]);

  useEffect(() => {
    decayTimeouts.current.forEach(clearTimeout);
    decayTimeouts.current = [];

    particles.forEach(p => {
      if (p.type === PARTICLE_TYPES.EXCITED_ELECTRON) {
        const timeoutId = setTimeout(() => {
          setParticles(prev => {
            const particleToDecay = prev.find(part => part.id === p.id);
            if (!particleToDecay) return prev;

            const otherParticles = prev.filter(part => part.id !== p.id);
            const newElectron = { ...particleToDecay, type: PARTICLE_TYPES.ELECTRON, id: `electron-${Date.now()}` };
            const newPhoton = {
              id: `photon-${Date.now()}`,
              type: PARTICLE_TYPES.PHOTON,
              x: particleToDecay.x + 50,
              y: particleToDecay.y - 50,
              scale: 1,
            };
            return [...otherParticles, newElectron, newPhoton];
          });
          triggerRadiationBurst(p.x, p.y);
          showMessage('Excited Electron decayed!');
        }, 3000); // 3-second lifetime
        decayTimeouts.current.push(timeoutId);
      } else if (p.type === PARTICLE_TYPES.DECAYING_NEUTRON) {
        const timeoutId = setTimeout(() => {
          setParticles(prev => {
            const particleToDecay = prev.find(part => part.id === p.id);
            if (!particleToDecay) return prev;

            const otherParticles = prev.filter(part => part.id !== p.id);
            const newProton = { ...particleToDecay, type: PARTICLE_TYPES.PROTON, id: `proton-${Date.now()}` };
            const newElectron = { id: `electron-${Date.now()}`, type: PARTICLE_TYPES.ELECTRON, x: particleToDecay.x + 50, y: particleToDecay.y + 50, scale: 1 };
            const newAntiNeutrino = { id: `e-antineutrino-${Date.now()}`, type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, x: particleToDecay.x - 50, y: particleToDecay.y - 50, scale: 1 };

            return [...otherParticles, newProton, newElectron, newAntiNeutrino];
          });
          triggerRadiationBurst(p.x, p.y);
          showMessage('Beta Decay! Neutron became a Proton.');
        }, 4000); // 4-second lifetime
        decayTimeouts.current.push(timeoutId);
      }
    });

    return () => decayTimeouts.current.forEach(clearTimeout);
  }, [particles, setParticles, showMessage, triggerRadiationBurst]);
};