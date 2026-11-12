import React, { useCallback, useState } from 'react';
import { Orbit, ChevronDown, ChevronUp } from 'lucide-react';
import ParticleCanvas from './components/ParticleCanvas.jsx';
import LabSidebar from './components/LabSidebar.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import ExchangeHub from './components/ExchangeHub.jsx';
import QuantumAtom3D, { ATOMIC_ORBITAL_DATA } from './components/QuantumAtom3D.jsx';
import { PARTICLE_NAMES } from '../constants/particles.js';
import { useParticleStore } from './store.js';

const ParticleLab = () => {
  const { showMessage, infoPanelType, setInfoPanelType } = useParticleStore();
  const [showQuantum3D, setShowQuantum3D] = useState(true);

  const handleDragStart = useCallback(
    (e, particle) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ type: particle.type }));
      showMessage(`Dragging ${PARTICLE_NAMES[particle.type]}`);
    },
    [showMessage]
  );

  const handleCloseInfo = useCallback(() => setInfoPanelType(null), [setInfoPanelType]);

  const activeAtomKey =
    infoPanelType && ATOMIC_ORBITAL_DATA[infoPanelType] ? infoPanelType : 'carbon';

  return (
    <div className="flex flex-row h-full w-full p-4 pb-20 gap-4 overflow-hidden relative bg-[#030508]">
      <ParticleCanvas onDragStart={handleDragStart} />

      {/* 3D Quantum Orbital Inspector Floating Instrument */}
      <div className="absolute top-6 left-6 z-40 flex flex-col items-start gap-2 pointer-events-none">
        <button
          onClick={() => setShowQuantum3D((v) => !v)}
          className="pointer-events-auto px-3 py-1.5 rounded-xl bg-[#070b14]/90 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:bg-[#0c1424] transition-all cursor-pointer"
        >
          <Orbit className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D Quantum Orbitals</span>
          {showQuantum3D ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showQuantum3D && <QuantumAtom3D selectedAtomKey={activeAtomKey} />}
      </div>

      <LabSidebar onDragStart={handleDragStart} />
      <div className="relative z-60">
        <InfoPanel particleType={infoPanelType} onClose={handleCloseInfo} />
      </div>
      <ExchangeHub />
    </div>
  );
};

export default ParticleLab;
