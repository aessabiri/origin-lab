import { useEffect, useRef } from 'react';
import { PARTICLE_TYPES } from '../constants/particles.js';
import { useStore } from '../store.js';

export const useDecay = (triggerRadiationBurst) => {
  const particles = useStore(state => state.particles);
  const setParticles = useStore(state => state.setParticles);
  const showMessage = useStore(state => state.showMessage);
  const decayTimeouts = useRef([]);

  useEffect(() => {
    decayTimeouts.current.forEach(clearTimeout);
    decayTimeouts.current = [];

    particles.forEach(p => {
      if (p.type === PARTICLE_TYPES.EXCITED_ELECTRON) {
        const timeoutId = setTimeout(() => {
          const currentParticles = useStore.getState().particles;
          const particleToDecay = currentParticles.find(part => part.id === p.id);
          if (!particleToDecay) return;

          const otherParticles = currentParticles.filter(part => part.id !== p.id);
          const newElectron = { ...particleToDecay, type: PARTICLE_TYPES.ELECTRON, id: `electron-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
          const newPhoton = {
            id: `photon-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            type: PARTICLE_TYPES.PHOTON,
            x: particleToDecay.x + 50,
            y: particleToDecay.y - 50,
            scale: 1,
          };
          setParticles([...otherParticles, newElectron, newPhoton]);
          triggerRadiationBurst(p.x, p.y);
          showMessage('Excited Electron decayed!');
        }, 3000); // 3-second lifetime
        decayTimeouts.current.push(timeoutId);
      } else if (p.type === PARTICLE_TYPES.DECAYING_NEUTRON) {
        const timeoutId = setTimeout(() => {
          const currentParticles = useStore.getState().particles;
          const particleToDecay = currentParticles.find(part => part.id === p.id);
          if (!particleToDecay) return;

          const otherParticles = currentParticles.filter(part => part.id !== p.id);
          const newProton = { ...particleToDecay, type: PARTICLE_TYPES.PROTON, id: `proton-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
          const newElectron = { id: `electron-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type: PARTICLE_TYPES.ELECTRON, x: particleToDecay.x + 50, y: particleToDecay.y + 50, scale: 1 };
          const newAntiNeutrino = { id: `e-antineutrino-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, x: particleToDecay.x - 50, y: particleToDecay.y - 50, scale: 1 };

          setParticles([...otherParticles, newProton, newElectron, newAntiNeutrino]);
          triggerRadiationBurst(p.x, p.y);
          showMessage('Beta Decay! Neutron became a Proton.');
        }, 4000); // 4-second lifetime
        decayTimeouts.current.push(timeoutId);
      }
    });

    return () => decayTimeouts.current.forEach(clearTimeout);
  }, [particles, setParticles, showMessage, triggerRadiationBurst]);
};