import React from 'react';
import { PARTICLE_COLOR_MAP, PARTICLE_TYPES } from '../../constants/particles.js';
import MoleculeStructure from '../../chemistry-lab/components/MoleculeStructure.jsx';
import { MOLECULAR_STRUCTURES } from '../../chemistry-lab/data/structures.js';
import { PARTICLE_ICON_MAP } from './icons/index.js';
import { GenericMoleculeIcon } from './icons/Base.jsx';

const RADIOACTIVE_PARTICLES = new Set([
  PARTICLE_TYPES.URANIUM_235, PARTICLE_TYPES.URANIUM_238, PARTICLE_TYPES.URANIUM_234,
  PARTICLE_TYPES.THORIUM, PARTICLE_TYPES.THORIUM_231, PARTICLE_TYPES.THORIUM_234, PARTICLE_TYPES.THORIUM_230,
  PARTICLE_TYPES.PROTACTINIUM, PARTICLE_TYPES.PROTACTINIUM_231, PARTICLE_TYPES.PROTACTINIUM_234,
  PARTICLE_TYPES.ACTINIUM_227,
  PARTICLE_TYPES.RADIUM, PARTICLE_TYPES.RADIUM_226,
  PARTICLE_TYPES.RADON, PARTICLE_TYPES.RADON_222,
  PARTICLE_TYPES.POLONIUM, PARTICLE_TYPES.POLONIUM_210,
  PARTICLE_TYPES.TRITIUM,
  PARTICLE_TYPES.CARBON_14,
  PARTICLE_TYPES.DECAYING_NEUTRON
]);

const ParticleIcon = ({ type, color = 'bg-gray-400', isCompound = false }) => {
  const safeColor = typeof color === 'string' ? color : 'bg-gray-400';
  let hexColor = '#9ca3af';

  if (safeColor.startsWith('#')) {
    hexColor = safeColor;
  } else {
    const token = safeColor.replace('bg-', '');
    hexColor = PARTICLE_COLOR_MAP[token] || '#9ca3af';
  }

  const isRadioactive = RADIOACTIVE_PARTICLES.has(type);
  const wrapperClass = isRadioactive ? "w-full h-full animate-pulse-slow" : "w-full h-full";
  const wrapperStyle = isRadioactive ? { filter: 'drop-shadow(0 0 10px #a855f7)' } : {};

  // 1. Check for specific Physics/Particle Lab Icon (Handcrafted SVG/PNG)
  const IconComponent = PARTICLE_ICON_MAP[type];
  if (IconComponent) {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <IconComponent hexColor={hexColor} isCompound={isCompound} />
      </div>
    );
  }

  // 2. Check for Molecular Structure (Data-driven Ball & Stick)
  if (MOLECULAR_STRUCTURES[type]) {
    return (
      <MoleculeStructure 
        chemicalId={type} 
        className="w-full h-full" 
      />
    );
  }

  // 3. Fallback
  return <GenericMoleculeIcon hexColor={hexColor} />;
};

export default ParticleIcon;