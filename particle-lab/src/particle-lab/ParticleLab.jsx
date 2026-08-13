import React, { useCallback } from 'react';
import ParticleCanvas from './components/ParticleCanvas.jsx';
import LabSidebar from './components/LabSidebar.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import ExchangeHub from './components/ExchangeHub.jsx';
import { PARTICLE_NAMES } from '../constants/particles.js';
import { useParticleStore } from './store.js';

const ParticleLab = () => {
  const { showMessage, infoPanelType, setInfoPanelType } = useParticleStore();

  const handleDragStart = useCallback((e, particle) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: particle.type }));
    showMessage(`Dragging ${PARTICLE_NAMES[particle.type]}`);
  }, [showMessage]);

  const handleCloseInfo = useCallback(() => setInfoPanelType(null), [setInfoPanelType]);

  return (
    <div className="flex flex-row h-full w-full p-4 gap-4 overflow-hidden relative">
      <ParticleCanvas onDragStart={handleDragStart} />
      <LabSidebar onDragStart={handleDragStart} />
      <div className="relative z-60">
        <InfoPanel particleType={infoPanelType} onClose={handleCloseInfo} />
      </div>
      <ExchangeHub />
    </div>
  );
};

export default ParticleLab;
