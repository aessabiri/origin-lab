import React from 'react';
import { PARTICLE_COLOR_MAP } from '../../../../constants/particles.js';
import { PngIcon } from '../Base.jsx';

import membraneImg from '../../../../icons/cell_membrane.png';
import nucleusImg from '../../../../icons/cell_nucleus.png';
import mitochondriaImg from '../../../../icons/mitochondria.png';
import ribosomeImg from '../../../../icons/ribosome.png';

export const MembranePngIcon = () => <PngIcon src={membraneImg} alt="Membrane" />;
export const NucleusPngIcon = () => <PngIcon src={nucleusImg} alt="Nucleus" />;
export const MitochondriaPngIcon = () => <PngIcon src={mitochondriaImg} alt="Mitochondria" />;
export const RibosomePngIcon = () => <PngIcon src={ribosomeImg} alt="Ribosome" />;

export const MembraneIcon = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs>
        <pattern id="membrane-heads" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
           <circle cx="5" cy="5" r="3.5" fill={PARTICLE_COLOR_MAP['orange-300']} />
        </pattern>
      </defs>
      <rect x="0" y="30" width="100" height="40" fill="#a8a29e" opacity="0.2" />
      <path d="M 0 35 L 100 35 M 0 45 L 100 45 M 0 55 L 100 55 M 0 65 L 100 65" stroke="#a8a29e" strokeWidth="1" opacity="0.4" strokeDasharray="4 2" />
      <rect x="0" y="26" width="100" height="8" fill="url(#membrane-heads)" />
      <rect x="0" y="66" width="100" height="8" fill="url(#membrane-heads)" />
      <g transform="translate(70, 50)">
         <ellipse cx="0" cy="0" rx="12" ry="22" fill={PARTICLE_COLOR_MAP['green-500']} />
         <ellipse cx="0" cy="0" rx="8" ry="15" fill={PARTICLE_COLOR_MAP['green-400']} />
      </g>
    </svg>
  );
};

export const RibosomeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <ellipse cx="50" cy="45" rx="35" ry="25" fill={PARTICLE_COLOR_MAP['red-600']} />
    <ellipse cx="50" cy="70" rx="25" ry="15" fill={PARTICLE_COLOR_MAP['red-400']} />
    <path d="M 20 62 Q 50 72 80 62" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none" />
  </svg>
);

export const MitochondrionIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <rect x="15" y="20" width="70" height="60" rx="30" fill={PARTICLE_COLOR_MAP['orange-200']} stroke={PARTICLE_COLOR_MAP['orange-600']} strokeWidth="3" />
    <path d="M 30 35 C 40 35, 40 65, 30 65 M 45 35 C 55 35, 55 65, 45 65 M 60 35 C 70 35, 70 65, 60 65" stroke={PARTICLE_COLOR_MAP['orange-500']} strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="38" cy="40" r="2.5" fill={PARTICLE_COLOR_MAP['orange-800']} opacity="0.6" />
    <circle cx="52" cy="60" r="2.5" fill={PARTICLE_COLOR_MAP['orange-800']} opacity="0.6" />
    <circle cx="65" cy="45" r="2.5" fill={PARTICLE_COLOR_MAP['orange-800']} opacity="0.6" />
  </svg>
);

export const NucleusIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <circle cx="50" cy="50" r="45" fill={PARTICLE_COLOR_MAP['indigo-100']} stroke={PARTICLE_COLOR_MAP['indigo-600']} strokeWidth="3" strokeDasharray="8 4" />
    <circle cx="50" cy="50" r="38" fill={PARTICLE_COLOR_MAP['indigo-200']} opacity="0.5" />
    <circle cx="60" cy="40" r="12" fill={PARTICLE_COLOR_MAP['indigo-800']} opacity="0.8" />
    <circle cx="95" cy="50" r="3" fill={PARTICLE_COLOR_MAP['indigo-700']} />
    <circle cx="5" cy="50" r="3" fill={PARTICLE_COLOR_MAP['indigo-700']} />
    <circle cx="50" cy="95" r="3" fill={PARTICLE_COLOR_MAP['indigo-700']} />
    <circle cx="50" cy="5" r="3" fill={PARTICLE_COLOR_MAP['indigo-700']} />
  </svg>
);
