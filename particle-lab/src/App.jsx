import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import ParticleIcon from './components/ParticleIcon';
import { PARTICLE_TYPES, PARTICLE_COLORS, PARTICLE_NAMES } from './constants/particles';

/*
  Main App — logic is essentially the original one but kept modular by importing
  constants and the ParticleIcon component. Some small safety guards were added
  (e.g., safe defaults for springs).
*/

const App = () => {
  const [particles, setParticles] = useState([]);

  const [elementaryPalette, setElementaryPalette] = useState([
    { id: 'up-1', type: PARTICLE_TYPES.UP_QUARK },
    { id: 'down-1', type: PARTICLE_TYPES.DOWN_QUARK },
    { id: 'charm-1', type: PARTICLE_TYPES.CHARM_QUARK },
    { id: 'strange-1', type: PARTICLE_TYPES.STRANGE_QUARK },
    { id: 'top-1', type: PARTICLE_TYPES.TOP_QUARK },
    { id: 'bottom-1', type: PARTICLE_TYPES.BOTTOM_QUARK },
    { id: 'electron-1', type: PARTICLE_TYPES.ELECTRON },
    { id: 'electron-neutrino-1', type: PARTICLE_TYPES.ELECTRON_NEUTRINO },
    { id: 'photon-1', type: PARTICLE_TYPES.PHOTON },
    { id: 'gluon-1', type: PARTICLE_TYPES.GLUON },
    { id: 'w-boson-1', type: PARTICLE_TYPES.W_BOSON },
    { id: 'z-boson-1', type: PARTICLE_TYPES.Z_BOSON },
  ]);

  const [secondaryParticles, setSecondaryParticles] = useState([]);
  const [discoveredAtoms, setDiscoveredAtoms] = useState([]);

  const canvasRef = useRef(null);
  const [message, setMessage] = useState('');

  const showMessage = useCallback((text) => {
    setMessage(text);
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, []);

  const updateParticleScale = useCallback((id, newScale) => {
    setParticles(prev => prev.map(p => p.id === id ? { ...p, scale: newScale } : p));
  }, []);

  // safe initialization: if particles is empty, use safe defaults
  const [springs, api] = useSprings(particles.length, i => ({
    x: particles[i]?.x ?? 0,
    y: particles[i]?.y ?? 0,
    scale: particles[i]?.scale ?? 1,
  }), [particles.length]);

  // Drag binding (use-gesture)
  const bind = useDrag(({ args: [index], down, movement: [mx, my], event }) => {
    if (!particles[index]) return;
    event.stopPropagation();
    const particle = particles[index];

    api.start(i => {
      if (i === index) {
        const newX = down ? mx + particle.x : particle.x;
        const newY = down ? my + particle.y : particle.y;
        return {
          x: newX,
          y: newY,
          scale: down ? 1.1 : 1,
          immediate: down,
        };
      }
      return {};
    });

    if (!down) {
      const newX = mx + particle.x;
      const newY = my + particle.y;
      const newScale = 1;

      setParticles(prev => prev.map((p, i) => i === index ? { ...p, x: newX, y: newY, scale: newScale } : p));

      // check for combinations
      checkCombination(index);
    }
  });

  const getNearbyComposition = useCallback((draggedIndex) => {
    const draggedParticle = particles[draggedIndex];
    if (!draggedParticle) return { particles: [], protons: 0, neutrons: 0, electrons: 0 };

    const nearbyParticles = particles.filter((p, i) => {
      if (i === draggedIndex) return true;
      const dx = draggedParticle.x - p.x;
      const dy = draggedParticle.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 100;
    });

    let protons = 0, neutrons = 0, electrons = 0;

    nearbyParticles.forEach(p => {
      if (p.type === PARTICLE_TYPES.PROTON) protons++;
      if (p.type === PARTICLE_TYPES.NEUTRON) neutrons++;
      if (p.type === PARTICLE_TYPES.ELECTRON) electrons++;
      if (p.type === PARTICLE_TYPES.HYDROGEN) { protons++; electrons++; }
      if (p.type === PARTICLE_TYPES.DEUTERIUM) { protons++; neutrons++; electrons++; }
      if (p.type === PARTICLE_TYPES.TRITIUM) { protons++; neutrons += 2; electrons++; }
      if (p.type === PARTICLE_TYPES.HELIUM) { protons += 2; neutrons += 2; electrons += 2; }
      if (p.type === PARTICLE_TYPES.LITHIUM) { protons += 3; neutrons += 4; electrons += 3; }
      if (p.type === PARTICLE_TYPES.BERYLLIUM) { protons += 4; neutrons += 5; electrons += 4; }
      if (p.type === PARTICLE_TYPES.BORON) { protons += 5; neutrons += 6; electrons += 5; }
      if (p.type === PARTICLE_TYPES.CARBON) { protons += 6; neutrons += 6; electrons += 6; }
      if (p.type === PARTICLE_TYPES.NITROGEN) { protons += 7; neutrons += 7; electrons += 7; }
      if (p.type === PARTICLE_TYPES.OXYGEN) { protons += 8; neutrons += 8; electrons += 8; }
    });

    return { particles: nearbyParticles, protons, neutrons, electrons };
  }, [particles]);

  const checkAtomCombination = useCallback((draggedIndex) => {
    const { particles: nearby, protons, neutrons, electrons } = getNearbyComposition(draggedIndex);

    if (protons === 1 && neutrons === 0 && electrons === 1 && nearby.length === 2) {
      return { type: PARTICLE_TYPES.HYDROGEN, message: 'Hydrogen atom formed!', combined: nearby };
    }
    if (protons === 1 && neutrons === 1 && electrons === 1) {
      return { type: PARTICLE_TYPES.DEUTERIUM, message: 'Deuterium atom formed!', combined: nearby };
    }
    if (protons === 1 && neutrons === 2 && electrons === 1) {
      return { type: PARTICLE_TYPES.TRITIUM, message: 'Tritium atom formed!', combined: nearby };
    }
    if (protons === 2 && neutrons === 2 && electrons === 2 && nearby.length === 6) {
      return { type: PARTICLE_TYPES.HELIUM, message: 'Helium atom formed!', combined: nearby };
    }
    if (protons === 3 && neutrons === 4 && electrons === 3) {
      return { type: PARTICLE_TYPES.LITHIUM, message: 'Lithium atom formed!', combined: nearby };
    }
    if (protons === 4 && neutrons === 5 && electrons === 4) {
      return { type: PARTICLE_TYPES.BERYLLIUM, message: 'Beryllium atom formed!', combined: nearby };
    }
    if (protons === 5 && neutrons === 6 && electrons === 5) {
      return { type: PARTICLE_TYPES.BORON, message: 'Boron atom formed!', combined: nearby };
    }
    if (protons === 6 && neutrons === 6 && electrons === 6) {
      return { type: PARTICLE_TYPES.CARBON, message: 'Carbon atom formed!', combined: nearby };
    }
    if (protons === 7 && neutrons === 7 && electrons === 7) {
      return { type: PARTICLE_TYPES.NITROGEN, message: 'Nitrogen atom formed!', combined: nearby };
    }
    if (protons === 8 && neutrons === 8 && electrons === 8) {
      return { type: PARTICLE_TYPES.OXYGEN, message: 'Oxygen atom formed!', combined: nearby };
    }

    return null;
  }, [getNearbyComposition]);

  const checkQuarkCombination = useCallback((draggedIndex) => {
    const dragged = particles[draggedIndex];
    if (!dragged) return null;
    if (dragged.type !== PARTICLE_TYPES.UP_QUARK && dragged.type !== PARTICLE_TYPES.DOWN_QUARK) {
      return null;
    }

    const nearbyQuarks = particles.filter((p, i) => {
      if (i === draggedIndex || p.type === PARTICLE_TYPES.PROTON || p.type === PARTICLE_TYPES.NEUTRON) {
        return false;
      }
      const dx = dragged.x - p.x;
      const dy = dragged.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < 100;
    });

    if (nearbyQuarks.length >= 2) {
      const all = [dragged, ...nearbyQuarks];
      const up = all.filter(p => p.type === PARTICLE_TYPES.UP_QUARK).length;
      const down = all.filter(p => p.type === PARTICLE_TYPES.DOWN_QUARK).length;
      if (up === 2 && down === 1) {
        return { type: PARTICLE_TYPES.PROTON, message: 'Proton formed!', combined: all };
      }
      if (up === 1 && down === 2) {
        return { type: PARTICLE_TYPES.NEUTRON, message: 'Neutron formed!', combined: all };
      }
    }
    return null;
  }, [particles]);

  const checkCombination = useCallback((draggedIndex) => {
    let result = checkQuarkCombination(draggedIndex);
    if (!result) result = checkAtomCombination(draggedIndex);

    if (result) {
      const { type, message, combined } = result;

      if (type === PARTICLE_TYPES.PROTON || type === PARTICLE_TYPES.NEUTRON) {
        setSecondaryParticles(prev => {
          if (!prev.some(p => p.type === type)) return [...prev, { id: type, type }];
          return prev;
        });
      } else {
        setDiscoveredAtoms(prev => {
          if (!prev.some(p => p.type === type)) return [...prev, { id: type, type }];
          return prev;
        });
      }

      const combinedIds = combined.map(p => p.id);
      setParticles(prev => {
        const next = prev.filter(p => !combinedIds.includes(p.id));
        const centerX = combined.reduce((s, p) => s + p.x, 0) / combined.length;
        const centerY = combined.reduce((s, p) => s + p.y, 0) / combined.length;
        next.push({
          id: `compound-${Date.now()}`,
          type,
          x: centerX,
          y: centerY,
          scale: 1,
          composition: combined.map(p => ({ id: p.id, type: p.type })),
        });
        return next;
      });

      showMessage(message);
    }
  }, [checkQuarkCombination, checkAtomCombination, showMessage]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (!data.type) return;
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasBounds.left - 25;
      const newY = e.clientY - canvasBounds.top - 25;
      const newParticle = {
        id: `${data.type}-${Date.now()}`,
        type: data.type,
        x: newX,
        y: newY,
        scale: 1,
      };
      setParticles(prev => [...prev, newParticle]);
      showMessage(`Added ${PARTICLE_NAMES[data.type]} to the lab!`);
    } catch (err) {
      // ignore invalid drops
      console.error('drop parse failed', err);
    }
  }, [showMessage]);

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDragStart = useCallback((e, particle) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: particle.type }));
    showMessage(`Dragging ${PARTICLE_NAMES[particle.type]}`);
  }, [showMessage]);

  const disassembleParticle = useCallback((particleId, particleIndex) => {
    const p = particles[particleIndex];
    if (!p || !p.composition) return;

    const composition = p.composition;
    setParticles(prev => {
      const next = prev.filter(x => x.id !== particleId);
      const comps = composition.map((c, i) => ({
        id: `${c.type}-${Date.now()}-${i}`,
        type: c.type,
        x: p.x + Math.cos(i * (2 * Math.PI / composition.length)) * 40,
        y: p.y + Math.sin(i * (2 * Math.PI / composition.length)) * 40,
        scale: 1,
      }));
      return [...next, ...comps];
    });
    showMessage(`Disassembled ${PARTICLE_NAMES[p.type]}!`);
  }, [particles, showMessage]);

  useEffect(() => {
    api.start(i => ({
      x: particles[i]?.x ?? 0,
      y: particles[i]?.y ?? 0,
      scale: particles[i]?.scale ?? 1,
      immediate: false
    }));
  }, [particles, api]);

  return (
    <div className="flex flex-col md:flex-row h-screen font-inter bg-gray-900 text-white p-4 gap-4">
      <div
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative flex-1 bg-gray-800 border-4 border-gray-700 rounded-2xl shadow-xl overflow-hidden"
      >
        <h1 className="absolute top-4 left-4 text-3xl font-bold text-white">Particle Lab</h1>
        <div
          className="absolute top-4 right-4 z-10 p-2 bg-gray-700 rounded-lg shadow-md transition-opacity duration-300"
          style={{ opacity: message ? 1 : 0 }}
        >
          <p className="text-sm font-semibold text-white">{message}</p>
        </div>

        {springs.map((props, i) => {
          const particle = particles[i];
          if (!particle) return null;

          const isCompound = [
            PARTICLE_TYPES.PROTON, PARTICLE_TYPES.NEUTRON, PARTICLE_TYPES.HYDROGEN, PARTICLE_TYPES.HELIUM,
            PARTICLE_TYPES.LITHIUM, PARTICLE_TYPES.BERYLLIUM, PARTICLE_TYPES.BORON,
            PARTICLE_TYPES.CARBON, PARTICLE_TYPES.NITROGEN, PARTICLE_TYPES.OXYGEN,
            PARTICLE_TYPES.DEUTERIUM, PARTICLE_TYPES.TRITIUM
          ].includes(particle.type);

          const isQuark = particle.type?.endsWith?.('quark');
          const particleSizeClass = isCompound ? 'w-24 h-24 text-xl' : 'w-16 h-16 text-sm';
          const particleColorClass = PARTICLE_COLORS[particle.type] || 'bg-gray-400';

          return (
            <animated.div
              {...bind(i)}
              key={particle.id}
              style={{
                x: props.x,
                y: props.y,
                scale: props.scale,
                touchAction: 'none'
              }}
              className={`absolute cursor-grab rounded-full shadow-lg transition-colors duration-300 flex items-center justify-center font-bold text-white ${particleSizeClass} ${particleColorClass}`}
              onDoubleClick={() => isCompound && disassembleParticle(particle.id, i)}
              onMouseEnter={() => updateParticleScale(particle.id, 1.2)}
              onMouseLeave={() => updateParticleScale(particle.id, 1)}
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="w-full h-full">
                  <ParticleIcon type={particle.type} color={particleColorClass} isCompound={isCompound} />
                </div>
                <span className="text-white text-center p-1 absolute bottom-2">
                  {PARTICLE_NAMES[particle.type]}
                </span>
              </div>
            </animated.div>
          );
        })}
      </div>

      <div className="flex flex-col w-full md:w-80 bg-gray-800 rounded-2xl p-6 shadow-xl overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Elementary Particles</h2>
        <div className="flex flex-wrap gap-4">
          {elementaryPalette.map((p) => (
            <div
              key={p.id}
              draggable
              onDragStart={(e) => handleDragStart(e, p)}
              className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl shadow-md cursor-grab transition-transform duration-200 hover:scale-105"
            >
              <div className={`w-full h-full ${PARTICLE_COLORS[p.type]} rounded-2xl`}>
                <ParticleIcon type={p.type} color={PARTICLE_COLORS[p.type]} />
              </div>
              <span className="text-sm font-bold text-white text-center p-1 absolute">{PARTICLE_NAMES[p.type]}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Secondary Particles</h2>
        <div className="flex flex-wrap gap-4 min-h-[100px] border-2 border-dashed border-gray-600 rounded-lg p-2">
          {secondaryParticles.length > 0 ? (
            secondaryParticles.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p)}
                className={`flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl shadow-md cursor-grab transition-transform duration-200 hover:scale-105 ${PARTICLE_COLORS[p.type]}`}
              >
                <ParticleIcon type={p.type} color={PARTICLE_COLORS[p.type]} isCompound />
                <span className="text-sm font-bold text-white text-center p-1 absolute">{PARTICLE_NAMES[p.type]}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center w-full my-auto">
              Combine particles to discover new atoms!
            </p>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Discovered Atoms</h2>
        <div className="flex flex-wrap gap-4 min-h-[100px] border-2 border-dashed border-gray-600 rounded-lg p-2">
          {discoveredAtoms.length > 0 ? (
            discoveredAtoms.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p)}
                className={`flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl shadow-md cursor-grab transition-transform duration-200 hover:scale-105 ${PARTICLE_COLORS[p.type]}`}
              >
                <ParticleIcon type={p.type} color={PARTICLE_COLORS[p.type]} isCompound />
                <span className="text-sm font-bold text-white text-center p-1 absolute">{PARTICLE_NAMES[p.type]}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center w-full my-auto">
              Combine protons and electrons to form new atoms!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

