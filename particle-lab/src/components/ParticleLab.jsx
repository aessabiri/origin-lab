import React, { useCallback } from 'react';
import ParticleCanvas from './ParticleCanvas';
import LabSidebar from './LabSidebar';
import InfoPanel from './InfoPanel';
import { PARTICLE_NAMES } from '../constants/particles';
import { useStore } from '../store';

const ParticleLab = () => {
  const { showMessage, infoPanelType, setInfoPanelType } = useStore();

  const handleDragStart = useCallback((e, particle) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: particle.type }));
    showMessage(`Dragging ${PARTICLE_NAMES[particle.type]}`);
  }, [showMessage]);

  const handleCloseInfo = useCallback(() => setInfoPanelType(null), [setInfoPanelType]);

  return (
    <div className="flex flex-col md:flex-row h-full p-4 gap-4">
      <ParticleCanvas onDragStart={handleDragStart} />
      <LabSidebar onDragStart={handleDragStart} />
      <div className="relative z-60">
        <InfoPanel particleType={infoPanelType} onClose={handleCloseInfo} />
      </div>
    </div>
  );
};

export default ParticleLab;
