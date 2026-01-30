import { useEffect, useRef } from 'react';
import { PARTICLE_TYPES } from '../../constants/particles.js';
import { useParticleStore } from '../store.js';

const DECAY_CONFIG = {
  [PARTICLE_TYPES.EXCITED_ELECTRON]: { lifetime: 3000, products: [{ type: PARTICLE_TYPES.ELECTRON, count: 1 }, { type: PARTICLE_TYPES.PHOTON, count: 1 }], msg: 'Excited Electron decayed!' },
  [PARTICLE_TYPES.DECAYING_NEUTRON]: { lifetime: 4000, products: [{ type: PARTICLE_TYPES.PROTON, count: 1 }, { type: PARTICLE_TYPES.ELECTRON, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Beta Decay! Neutron became a Proton.' },
  [PARTICLE_TYPES.MUON]: { lifetime: 10000, products: [{ type: PARTICLE_TYPES.ELECTRON, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_NEUTRINO, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Muon decayed into an Electron and Neutrinos.' },
  [PARTICLE_TYPES.TAU]: { lifetime: 8000, products: [{ type: PARTICLE_TYPES.MUON, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_NEUTRINO, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Tau Lepton decayed!' },
  [PARTICLE_TYPES.TRITIUM]: { lifetime: 20000, products: [{ type: PARTICLE_TYPES.HELIUM_3, count: 1 }, { type: PARTICLE_TYPES.ELECTRON, count: 1 }], msg: 'Tritium Beta-Decay -> Helium-3' },
  [PARTICLE_TYPES.CARBON_14]: { lifetime: 35000, products: [{ type: PARTICLE_TYPES.NITROGEN, count: 1 }, { type: PARTICLE_TYPES.ELECTRON, count: 1 }], msg: 'Carbon-14 decayed into Nitrogen!' },
  [PARTICLE_TYPES.URANIUM_235]: { lifetime: 50000, products: [{ type: PARTICLE_TYPES.LEAD, count: 1 }, { type: PARTICLE_TYPES.HELIUM, count: 1 }], msg: 'Uranium-235 Alpha-Decay into Lead!' },
};

export const useDecay = (triggerRadiationBurst) => {
  const particles = useParticleStore(state => state.particles);
  const setParticles = useParticleStore(state => state.setParticles);
  const showMessage = useParticleStore(state => state.showMessage);
  const decayTimeouts = useRef(new Map());

  useEffect(() => {
    // Defensive check for HMR transitions from Array to Map
    if (!(decayTimeouts.current instanceof Map)) {
      decayTimeouts.current = new Map();
    }

    const currentParticleIds = new Set(particles.map(p => p.id));
    
    // 1. Cleanup timeouts for particles that no longer exist
    for (const [id, timeoutId] of decayTimeouts.current.entries()) {
      if (!currentParticleIds.has(id)) {
        clearTimeout(timeoutId);
        decayTimeouts.current.delete(id);
      }
    }

    // 2. Setup new decay timeouts
    particles.forEach(p => {
      const config = DECAY_CONFIG[p.type];
      if (config && !decayTimeouts.current.has(p.id)) {
        const timeoutId = setTimeout(() => {
          const latestParticles = useParticleStore.getState().particles;
          const target = latestParticles.find(part => part.id === p.id);
          if (!target) return;

          const others = latestParticles.filter(part => part.id !== p.id);
          const newParticles = config.products.flatMap((prod, idx) => {
             const results = [];
             for(let i=0; i<prod.count; i++) {
                results.push({
                  id: `${prod.type}-${Date.now()}-${idx}-${i}`,
                  type: prod.type,
                  x: target.x + (Math.random() - 0.5) * 40,
                  y: target.y + (Math.random() - 0.5) * 40,
                  scale: 1
                });
             }
             return results;
          });

          setParticles([...others, ...newParticles]);
          triggerRadiationBurst(target.x, target.y);
          showMessage(config.msg);
          decayTimeouts.current.delete(p.id);
        }, config.lifetime);
        
        decayTimeouts.current.set(p.id, timeoutId);
      }
    });

    // 3. Antimatter Annihilation Check (Electron + Positron)
    // Basic O(N^2) check but usually small number of particles on canvas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        if ((p1.type === PARTICLE_TYPES.ELECTRON && p2.type === PARTICLE_TYPES.POSITRON) ||
            (p1.type === PARTICLE_TYPES.POSITRON && p2.type === PARTICLE_TYPES.ELECTRON)) {
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx*dx + dy*dy;
          
          if (distSq < 1600) { // Within 40px
            const others = particles.filter(p => p.id !== p1.id && p.id !== p2.id);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            
            const photons = [
              { id: `annihil-1-${Date.now()}`, type: PARTICLE_TYPES.PHOTON, x: midX, y: midY, scale: 1 },
              { id: `annihil-2-${Date.now()}`, type: PARTICLE_TYPES.PHOTON, x: midX, y: midY, scale: 1 }
            ];
            
            setParticles([...others, ...photons]);
            triggerRadiationBurst(midX, midY);
            showMessage('Annihilation! Matter and Antimatter destroyed each other.');
            return; // Exit effect to prevent multiple simultaneous updates
          }
        }
      }
    }

    return () => {}; // Cleanup handled by checking currentParticleIds on next run
  }, [particles, setParticles, showMessage, triggerRadiationBurst]);
};