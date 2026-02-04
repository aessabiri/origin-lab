import React from 'react';
import { PARTICLE_COLOR_MAP } from '../../constants/particles.js';
import MoleculeStructure from '../../chemistry-lab/components/MoleculeStructure.jsx';
import { MOLECULAR_STRUCTURES } from '../../chemistry-lab/data/structures.js';
import { PARTICLE_ICON_MAP } from './icons/index.js';
import { GenericMoleculeIcon } from './icons/Base.jsx';

const ParticleIcon = ({ type, color = 'bg-gray-400', isCompound = false }) => {
  const safeColor = typeof color === 'string' ? color : 'bg-gray-400';
  let hexColor = '#9ca3af';

  if (safeColor.startsWith('#')) {
    hexColor = safeColor;
  } else {
    const token = safeColor.replace('bg-', '');
    hexColor = PARTICLE_COLOR_MAP[token] || '#9ca3af';
  }

  // 1. Check for specific Physics/Particle Lab Icon (Handcrafted SVG/PNG)
  const IconComponent = PARTICLE_ICON_MAP[type];
  if (IconComponent) {
    return <IconComponent hexColor={hexColor} isCompound={isCompound} />;
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