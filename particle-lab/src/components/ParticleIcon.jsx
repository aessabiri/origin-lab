import React from 'react';
import { PARTICLE_TYPES, PARTICLE_COLOR_MAP } from '../constants/particles.js';

/*
  ParticleIcon renders the various SVG icons for each particle type.
  This file is a direct extraction of the SVG-switch from your original file.
  It expects:
    - type: one of the PARTICLE_TYPES values
    - color: the Tailwind class string (e.g. 'bg-yellow-400') used to pick a hex color
    - isCompound: boolean (not required for rendering but accepted)
*/

const ParticleIcon = ({ type, color = 'bg-gray-400', isCompound = false }) => {
  const token = color.replace('bg-', '');
  const hexColor = PARTICLE_COLOR_MAP[token] || '#9ca3af';

  // radial gradient helper
  const radialGradient = (id, c) => (
    <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
      <stop offset="100%" stopColor={c} />
    </radialGradient>
  );

  const QuarkComposition = ({ up = 0, down = 0 }) => {
    const upColor = PARTICLE_COLOR_MAP['yellow-400'];
    const downColor = PARTICLE_COLOR_MAP['indigo-400'];
    const total = up + down;
    if (total === 0) return null;

    const particles = [];
    for (let i = 0; i < up; i++) particles.push(upColor);
    for (let i = 0; i < down; i++) particles.push(downColor);

    const positions = [
      [], // 0
      [[50, 50]], // 1
      [[45, 50], [55, 50]], // 2
      [[50, 42], [43, 55], [57, 55]], // 3
    ];

    const particlePositions = positions[total] || [];

    return (
      <g>
        {particles.map((fill, i) => (
          <circle key={i} cx={particlePositions[i][0]} cy={particlePositions[i][1]} r="10" fill={fill} stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
        ))}
      </g>
    );
  };

  const Nucleus = ({ protonCount = 0, neutronCount = 0 }) => {
    const protonColor = PARTICLE_COLOR_MAP['red-500'];
    const neutronColor = PARTICLE_COLOR_MAP['pink-500'];
    const total = protonCount + neutronCount;
    if (total === 0) return null;

    const particles = [];
    for (let i = 0; i < protonCount; i++) particles.push(protonColor);
    for (let i = 0; i < neutronCount; i++) particles.push(neutronColor);

    const positions = [
      [],
      [[50, 50]],
      [[45, 50], [55, 50]],
      [[50, 44], [43, 56], [57, 56]],
      [[45, 45], [55, 45], [45, 55], [55, 55]],
    ];

    const particlePositions = positions[total] || [];
    if (particlePositions.length === 0 && total > 0) {
      const R = total > 9 ? 15 : 12;
      for (let i = 0; i < total; i++) {
        const angle = (i / total) * 2 * Math.PI;
        particlePositions.push([50 + R * Math.cos(angle), 50 + R * Math.sin(angle)]);
      }
    }

    return (
      <g>
        {particles.map((fill, i) => (
          <circle key={i} cx={particlePositions[i][0]} cy={particlePositions[i][1]} r={total > 4 ? 6 : 7} fill={fill} />
        ))}
      </g>
    );
  };

  const ElectronShells = ({ electronCount = 0, hexColor }) => {
    if (electronCount === 0) return null;
    const electronColor = PARTICLE_COLOR_MAP['blue-600'];
    const shells = [];
    if (electronCount > 0) shells.push({ radius: 25, count: Math.min(electronCount, 2) });
    if (electronCount > 2) shells.push({ radius: 40, count: Math.min(electronCount - 2, 8) });
    if (electronCount > 10) shells.push({ radius: 55, count: Math.min(electronCount - 10, 8) });

    return shells.map((shell, shellIndex) => (
      <g key={shellIndex}>
        <circle cx="50" cy="50" r={shell.radius} stroke={hexColor} strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
        {Array.from({ length: shell.count }).map((_, i) => {
          const angle = (i / shell.count) * 360 + shellIndex * 20;
          const x = 50 + shell.radius * Math.cos(angle * (Math.PI / 180));
          const y = 50 + shell.radius * Math.sin(angle * (Math.PI / 180));
          return <circle key={i} cx={x} cy={y} r="4" fill={electronColor} />;
        })}
      </g>
    ));
  };

  const MesonComposition = ({ quarkColor, antiquarkColor }) => {
    return (
      <g>
        <circle cx="35" cy="50" r="15" fill={quarkColor} stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="65" cy="50" r="15" fill={antiquarkColor} stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
      </g>
    );
  };

  switch (type) {
    // Quarks
    case PARTICLE_TYPES.UP_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            {radialGradient('grad1', hexColor)}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad1)" />
          <polygon points="50,20 75,65 25,65" fill="white" filter="url(#glow)" />
        </svg>
      );

    case PARTICLE_TYPES.DOWN_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad2', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad2)" />
          <polygon points="25,35 75,35 50,80" fill="white" />
        </svg>
      );

    case PARTICLE_TYPES.CHARM_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad3', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad3)" />
          <path d="M50,25 C70,25 70,45 50,45 C30,45 30,25 50,25 M50,55 C70,55 70,75 50,75 C30,75 30,55 50,55" fill="white" />
        </svg>
      );

    case PARTICLE_TYPES.STRANGE_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad4', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad4)" />
          <path d="M35,30 C65,30 35,70 65,70" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
      );

    case PARTICLE_TYPES.TOP_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad5', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad5)" />
          <path d="M25,35 H75 M50,35 V75" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
      );

    case PARTICLE_TYPES.BOTTOM_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad6', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad6)" />
          <path d="M25,35 C25,65 75,65 75,35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
      );

    case PARTICLE_TYPES.ANTI_UP_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            {radialGradient('grad-anti-up', hexColor)}
            <filter id="glow-anti-up">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad-anti-up)" />
          <polygon points="50,80 75,35 25,35" fill="white" filter="url(#glow-anti-up)" />
        </svg>
      );

    case PARTICLE_TYPES.ANTI_DOWN_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad-anti-down', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad-anti-down)" />
          <polygon points="25,65 75,65 50,20" fill="white" />
        </svg>
      );

    // Leptons
    case PARTICLE_TYPES.ELECTRON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad7', hexColor)}</defs>
          <g style={{ animation: 'spin 4s linear infinite' }}>
            <ellipse cx="50" cy="50" rx="40" ry="20" stroke={hexColor} strokeWidth="4" fill="none" opacity="0.7" />
            <circle cx="90" cy="50" r="8" fill={PARTICLE_COLOR_MAP['blue-600']} />
          </g>
          <circle cx="50" cy="50" r="10" fill="url(#grad7)" />
        </svg>
      );

    case PARTICLE_TYPES.ELECTRON_NEUTRINO:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" strokeWidth="4">
          <path d="M 10 50 C 30 20, 70 20, 90 50 S 70 80, 10 50" stroke={hexColor} />
        </svg>
      );

    // Bosons
    case PARTICLE_TYPES.PHOTON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('photon-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="25" fill="url(#photon-grad)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 45 * Math.cos(i * Math.PI / 4)}
              y2={50 + 45 * Math.sin(i * Math.PI / 4)}
              stroke={hexColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </svg>
      );

    case PARTICLE_TYPES.GLUON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <path d="M 20 50 C 20 30, 30 30, 30 50 S 40 70, 40 50 S 50 30, 50 50 S 60 70, 60 50 S 70 30, 70 50 S 80 70, 80 50"
            stroke={hexColor} strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case PARTICLE_TYPES.W_BOSON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,10 L90,50 L50,90 L10,50 Z" fill={hexColor} />
        </svg>
      );

    case PARTICLE_TYPES.Z_BOSON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,10 L90,50 L50,90 L10,50 Z" fill={hexColor} />
        </svg>
      );

    // Compounds & atoms simplified visuals
    case PARTICLE_TYPES.PROTON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('proton-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#proton-grad)" />
          <QuarkComposition up={2} down={1} />
        </svg>
      );

    case PARTICLE_TYPES.NEUTRON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('neutron-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#neutron-grad)" />
          <QuarkComposition up={1} down={2} />
        </svg>
      );

    case PARTICLE_TYPES.PION_PLUS:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('pion-plus-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#pion-plus-grad)" />
          <MesonComposition quarkColor={PARTICLE_COLOR_MAP['yellow-400']} antiquarkColor={PARTICLE_COLOR_MAP['indigo-600']} />
        </svg>
      );

    case PARTICLE_TYPES.PION_MINUS:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('pion-minus-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#pion-minus-grad)" />
          <MesonComposition quarkColor={PARTICLE_COLOR_MAP['indigo-400']} antiquarkColor={PARTICLE_COLOR_MAP['yellow-600']} />
        </svg>
      );

    case PARTICLE_TYPES.HYDROGEN:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={1} hexColor={hexColor} />
          <Nucleus protonCount={1} neutronCount={0} />
        </svg>
      );

    case PARTICLE_TYPES.DEUTERIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={1} hexColor={hexColor} />
          <Nucleus protonCount={1} neutronCount={1} />
        </svg>
      );

    case PARTICLE_TYPES.TRITIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={1} hexColor={hexColor} />
          <Nucleus protonCount={1} neutronCount={2} />
        </svg>
      );

    case PARTICLE_TYPES.HELIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={2} hexColor={hexColor} />
          <Nucleus protonCount={2} neutronCount={2} />
        </svg>
      );

    case PARTICLE_TYPES.LITHIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={3} hexColor={hexColor} />
          <Nucleus protonCount={3} neutronCount={4} />
        </svg>
      );
    case PARTICLE_TYPES.BERYLLIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={4} hexColor={hexColor} />
          <Nucleus protonCount={4} neutronCount={5} />
        </svg>
      );
    case PARTICLE_TYPES.BORON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={5} hexColor={hexColor} />
          <Nucleus protonCount={5} neutronCount={6} />
        </svg>
      );
    case PARTICLE_TYPES.CARBON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={6} hexColor={hexColor} />
          <Nucleus protonCount={6} neutronCount={6} />
        </svg>
      );
    case PARTICLE_TYPES.NITROGEN:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={7} hexColor={hexColor} />
          <Nucleus protonCount={7} neutronCount={7} />
        </svg>
      );
    case PARTICLE_TYPES.OXYGEN:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={8} hexColor={hexColor} />
          <Nucleus protonCount={8} neutronCount={8} />
        </svg>
      );
    case PARTICLE_TYPES.FLUORINE:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={9} hexColor={hexColor} />
          <Nucleus protonCount={9} neutronCount={10} />
        </svg>
      );
    case PARTICLE_TYPES.NEON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={10} hexColor={hexColor} />
          <Nucleus protonCount={10} neutronCount={10} />
        </svg>
      );
    case PARTICLE_TYPES.SODIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={11} hexColor={hexColor} />
          <Nucleus protonCount={11} neutronCount={12} />
        </svg>
      );
    case PARTICLE_TYPES.MAGNESIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={12} hexColor={hexColor} />
          <Nucleus protonCount={12} neutronCount={12} />
        </svg>
      );
    case PARTICLE_TYPES.ALUMINIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={13} hexColor={hexColor} />
          <Nucleus protonCount={13} neutronCount={14} />
        </svg>
      );
    case PARTICLE_TYPES.SILICON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={14} hexColor={hexColor} />
          <Nucleus protonCount={14} neutronCount={14} />
        </svg>
      );
    case PARTICLE_TYPES.PHOSPHORUS:
    case PARTICLE_TYPES.SULFUR:
    case PARTICLE_TYPES.CHLORINE:
    case PARTICLE_TYPES.ARGON:
      // A generic fallback for the rest of the new atoms
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={18} hexColor={hexColor} />
          <Nucleus protonCount={18} neutronCount={22} />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill={hexColor} />
        </svg>
      );
  }
};

export default ParticleIcon;
