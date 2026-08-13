import { useEffect, useRef } from 'react';
import { PARTICLE_TYPES } from '../../constants/particles.js';
import { useParticleStore } from '../store.js';

const DECAY_CONFIG = {
  [PARTICLE_TYPES.EXCITED_ELECTRON]: { lifetime: 3000, products: [{ type: PARTICLE_TYPES.ELECTRON, count: 1 }, { type: PARTICLE_TYPES.PHOTON, count: 1 }], msg: 'Excited Electron decayed!' },
  [PARTICLE_TYPES.DECAYING_NEUTRON]: { lifetime: 4000, products: [{ type: PARTICLE_TYPES.PROTON, count: 1 }, { type: PARTICLE_TYPES.ELECTRON, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Beta Decay! Neutron became a Proton.' },
  [PARTICLE_TYPES.MUON]: { lifetime: 10000, products: [{ type: PARTICLE_TYPES.ELECTRON, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_NEUTRINO, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Muon decayed into an Electron and Neutrinos.' },
  [PARTICLE_TYPES.TAU]: { lifetime: 8000, products: [{ type: PARTICLE_TYPES.MUON, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_NEUTRINO, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Tau Lepton decayed!' },
  [PARTICLE_TYPES.TRITIUM]: { lifetime: 20000, products: [{ type: PARTICLE_TYPES.HELIUM_3, count: 1 }, { type: PARTICLE_TYPES.BETA_PARTICLE, count: 1 }], msg: 'Tritium Beta-Decay -> Helium-3' },
  [PARTICLE_TYPES.CARBON_14]: { lifetime: 35000, products: [{ type: PARTICLE_TYPES.NITROGEN, count: 1 }, { type: PARTICLE_TYPES.BETA_PARTICLE, count: 1 }], msg: 'Carbon-14 decayed into Nitrogen!' },
  
  // Uranium-235 Chain
  [PARTICLE_TYPES.URANIUM_235]: { lifetime: 50000, products: [{ type: PARTICLE_TYPES.THORIUM_231, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 1 }, { type: PARTICLE_TYPES.GAMMA_RAY, count: 1 }], msg: 'U-235 Alpha-Decay -> Thorium-231' },
  [PARTICLE_TYPES.THORIUM_231]: { lifetime: 15000, products: [{ type: PARTICLE_TYPES.PROTACTINIUM_231, count: 1 }, { type: PARTICLE_TYPES.BETA_PARTICLE, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Th-231 Beta-Decay -> Protactinium-231' },
  [PARTICLE_TYPES.PROTACTINIUM_231]: { lifetime: 40000, products: [{ type: PARTICLE_TYPES.ACTINIUM_227, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 1 }], msg: 'Pa-231 Alpha-Decay -> Actinium-227' },
  [PARTICLE_TYPES.ACTINIUM_227]: { lifetime: 25000, products: [{ type: PARTICLE_TYPES.LEAD_207, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 5 }, { type: PARTICLE_TYPES.BETA_PARTICLE, count: 2 }], msg: 'Ac-227 Chain Decay -> Lead-207 (Stable)' },

  // Uranium-238 Chain
  [PARTICLE_TYPES.URANIUM_238]: { lifetime: 60000, products: [{ type: PARTICLE_TYPES.THORIUM_234, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 1 }], msg: 'U-238 Alpha-Decay -> Thorium-234' },
  [PARTICLE_TYPES.THORIUM_234]: { lifetime: 12000, products: [{ type: PARTICLE_TYPES.PROTACTINIUM_234, count: 1 }, { type: PARTICLE_TYPES.BETA_PARTICLE, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Th-234 Beta-Decay -> Protactinium-234' },
  [PARTICLE_TYPES.PROTACTINIUM_234]: { lifetime: 10000, products: [{ type: PARTICLE_TYPES.URANIUM_234, count: 1 }, { type: PARTICLE_TYPES.BETA_PARTICLE, count: 1 }, { type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO, count: 1 }], msg: 'Pa-234 Beta-Decay -> Uranium-234' },
  [PARTICLE_TYPES.URANIUM_234]: { lifetime: 45000, products: [{ type: PARTICLE_TYPES.THORIUM_230, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 1 }], msg: 'U-234 Alpha-Decay -> Thorium-230' },
  [PARTICLE_TYPES.THORIUM_230]: { lifetime: 30000, products: [{ type: PARTICLE_TYPES.RADIUM_226, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 1 }], msg: 'Th-230 Alpha-Decay -> Radium-226' },
  [PARTICLE_TYPES.RADIUM_226]: { lifetime: 20000, products: [{ type: PARTICLE_TYPES.RADON_222, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 1 }, { type: PARTICLE_TYPES.GAMMA_RAY, count: 1 }], msg: 'Ra-226 Alpha-Decay -> Radon-222 (Gas)' },
  [PARTICLE_TYPES.RADON_222]: { lifetime: 15000, products: [{ type: PARTICLE_TYPES.POLONIUM_210, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 3 }, { type: PARTICLE_TYPES.BETA_PARTICLE, count: 2 }], msg: 'Rn-222 Rapid Decay -> Polonium-210' },
  [PARTICLE_TYPES.POLONIUM_210]: { lifetime: 10000, products: [{ type: PARTICLE_TYPES.LEAD_206, count: 1 }, { type: PARTICLE_TYPES.ALPHA_PARTICLE, count: 1 }], msg: 'Po-210 Alpha-Decay -> Lead-206 (Stable)' },

  [PARTICLE_TYPES.HIGGS_BOSON]: { 
    lifetime: 2000, 
    channels: [
        { weight: 0.6, products: [{ type: PARTICLE_TYPES.PHOTON, count: 2 }], msg: 'Higgs Boson decayed into 2 Photons!' },
        { weight: 0.3, products: [{ type: PARTICLE_TYPES.Z_BOSON, count: 2 }], msg: 'Higgs Boson decayed into 2 Z Bosons!' },
        { weight: 0.1, products: [{ type: PARTICLE_TYPES.GAMMA_RAY, count: 1 }, { type: PARTICLE_TYPES.PHOTON, count: 1 }], msg: 'Higgs Boson decayed into Gamma Ray + Photon!' }
    ]
  },
};

export const useDecay = (triggerRadiationBurst) => {
  const particles = useParticleStore(state => state.particles);
  const setParticles = useParticleStore(state => state.setParticles);
  const setBonds = useParticleStore(state => state.setBonds);
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

          let productsToUse = config.products;
          let messageToUse = config.msg;

          // Handle Probabilistic Decay Channels
          if (config.channels) {
              const r = Math.random();
              let accumulatedWeight = 0;
              for (const channel of config.channels) {
                  accumulatedWeight += channel.weight;
                  if (r <= accumulatedWeight) {
                      productsToUse = channel.products;
                      messageToUse = channel.msg;
                      break;
                  }
              }
              // Fallback for floating point edge cases
              if (!productsToUse) {
                   productsToUse = config.channels[0].products;
                   messageToUse = config.channels[0].msg;
              }
          }

          const others = latestParticles.filter(part => part.id !== p.id);
          const newParticles = productsToUse.flatMap((prod, idx) => {
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
          const currentBonds = useParticleStore.getState().bonds;
          setBonds(currentBonds.filter(b => b.particleA_id !== p.id && b.particleB_id !== p.id));
          triggerRadiationBurst(target.x, target.y);
          showMessage(messageToUse);
          decayTimeouts.current.delete(p.id);
        }, config.lifetime);
        
        decayTimeouts.current.set(p.id, timeoutId);
      }
    });

    // 3. Antimatter Annihilation Check (Electron + Positron)
    const toRemove = new Set();
    const newPhotons = [];
    const bursts = [];
    let hasAnnihilation = false;

    for (let i = 0; i < particles.length; i++) {
      if (toRemove.has(particles[i].id)) continue;
      for (let j = i + 1; j < particles.length; j++) {
        if (toRemove.has(particles[j].id)) continue;
        
        const p1 = particles[i];
        const p2 = particles[j];
        
        if ((p1.type === PARTICLE_TYPES.ELECTRON && p2.type === PARTICLE_TYPES.POSITRON) ||
            (p1.type === PARTICLE_TYPES.POSITRON && p2.type === PARTICLE_TYPES.ELECTRON)) {
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx*dx + dy*dy;
          
          if (distSq < 1600) { // Within 40px
            toRemove.add(p1.id);
            toRemove.add(p2.id);
            hasAnnihilation = true;
            
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            
            newPhotons.push(
              { id: `annihil-1-${Date.now()}-${i}-${j}`, type: PARTICLE_TYPES.PHOTON, x: midX, y: midY, scale: 1 },
              { id: `annihil-2-${Date.now()}-${i}-${j}`, type: PARTICLE_TYPES.PHOTON, x: midX, y: midY, scale: 1 }
            );
            bursts.push({ x: midX, y: midY });
            break;
          }
        }
      }
    }

    if (hasAnnihilation) {
      const currentParticles = useParticleStore.getState().particles;
      const currentBonds = useParticleStore.getState().bonds;
      
      const others = currentParticles.filter(p => !toRemove.has(p.id));
      setParticles([...others, ...newPhotons]);
      setBonds(currentBonds.filter(b => !toRemove.has(b.particleA_id) && !toRemove.has(b.particleB_id)));
      
      bursts.forEach(b => triggerRadiationBurst(b.x, b.y));
      showMessage('Annihilation! Matter and Antimatter destroyed each other.');
    }

    return () => {}; // Cleanup handled by checking currentParticleIds on next run
  }, [particles, setParticles, setBonds, showMessage, triggerRadiationBurst]);
};