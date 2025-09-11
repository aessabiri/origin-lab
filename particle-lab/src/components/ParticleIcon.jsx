import React from 'react';
import { PARTICLE_TYPES } from '../constants/particles';

/*
  ParticleIcon renders the various SVG icons for each particle type.
  This file is a direct extraction of the SVG-switch from your original file.
  It expects:
    - type: one of the PARTICLE_TYPES values
    - color: the Tailwind class string (e.g. 'bg-yellow-400') used to pick a hex color
    - isCompound: boolean (not required for rendering but accepted)
*/

const ParticleIcon = ({ type, color = 'bg-gray-400', isCompound = false }) => {
  // mapping tailwind-ish tokens to hex (keeps the original visuals)
  const colorMap = {
    'yellow-400': '#fbbf24',
    'indigo-400': '#818cf8',
    'purple-500': '#a855f7',
    'green-500': '#22c55e',
    'cyan-500': '#06b6d4',
    'gray-700': '#374151',
    'blue-600': '#2563eb',
    'gray-400': '#9ca3af',
    'yellow-300': '#fde047',
    'black': '#000000',
    'orange-500': '#f97316',
    'red-700': '#b91c1c',
    'red-500': '#ef4444',
    'pink-500': '#ec4899',
    'teal-500': '#14b8a6',
    'sky-600': '#0284c7',
    'violet-600': '#7c3aed',
    'orange-300': '#fdba74',
    'fuchsia-500': '#d946ef',
    'lime-500': '#84cc16',
    'rose-500': '#f43f5e',
    'gray-800': '#1f2937',
    'sky-500': '#0ea5e9',
    'red-600': '#dc2626',
  };

  const token = color.replace('bg-', '');
  const hexColor = colorMap[token] || '#9ca3af';

  // radial gradient helper
  const radialGradient = (id, c) => (
    <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
      <stop offset="100%" stopColor={c} />
    </radialGradient>
  );

  const Nucleus = ({ protonCount = 0, neutronCount = 0 }) => {
    const protonColor = colorMap['red-500'];
    const neutronColor = colorMap['pink-500'];
    const total = protonCount + neutronCount || 1;
    const radius = 25;
    const angleStep = 360 / total;
    return (
      <g>
        {Array.from({ length: total }).map((_, i) => {
          const angle = (i * angleStep) * (Math.PI / 180);
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const fill = i < protonCount ? protonColor : neutronColor;
          return <circle key={i} cx={x} cy={y} r="8" fill={fill} />;
        })}
      </g>
    );
  };

  switch (type) {
    // Quarks
    case PARTICLE_TYPES.UP_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('quark-up-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#quark-up-grad)" />
          <polygon points="50,10 70,50 30,50" fill="white" opacity="0.6" />
        </svg>
      );

    case PARTICLE_TYPES.DOWN_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('quark-down-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#quark-down-grad)" />
          <rect x="25" y="45" width="50" height="10" fill="white" opacity="0.6" />
        </svg>
      );

    case PARTICLE_TYPES.CHARM_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('quark-charm-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#quark-charm-grad)" />
          <path d="M30 50 A20 20 0 1 1 70 50" stroke="white" strokeWidth="6" fill="none" />
          <path d="M30 50 A20 20 0 1 0 70 50" stroke="white" strokeWidth="6" fill="none" />
        </svg>
      );

    case PARTICLE_TYPES.STRANGE_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('quark-strange-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#quark-strange-grad)" />
          <path d="M 30 30 L 70 70 M 70 30 L 30 70" stroke="white" strokeWidth="5" />
        </svg>
      );

    case PARTICLE_TYPES.TOP_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('quark-top-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#quark-top-grad)" />
          <polygon points="50,15 75,50 50,85 25,50" fill="white" transform="rotate(45, 50, 50)" />
        </svg>
      );

    case PARTICLE_TYPES.BOTTOM_QUARK:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('quark-bottom-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#quark-bottom-grad)" />
          <path d="M20,50 A30,30 0 1,1 80,50 A30,30 0 1,1 20,50" fill="white" />
        </svg>
      );

    // Leptons
    case PARTICLE_TYPES.ELECTRON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('electron-grad', hexColor)}</defs>
          <path d="M50 5 A 45 45 0 1 0 50 95 A 45 45 0 1 0 50 5 Z" fill={`url(#electron-grad)`} />
          <circle cx="50" cy="50" r="10" fill="white" />
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
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="40" stroke={hexColor} strokeWidth="5" />
        </svg>
      );

    case PARTICLE_TYPES.GLUON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <path d="M 10 50 Q 30 20 50 50 T 90 50" stroke={hexColor} strokeWidth="5" />
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
          <circle cx="50" cy="50" r="45" fill={hexColor} />
          <circle cx="40" cy="40" r="12" fill="#fff" opacity="0.9" />
          <circle cx="60" cy="40" r="12" fill="#fff" opacity="0.9" />
          <circle cx="50" cy="65" r="12" fill="#fff" opacity="0.9" />
        </svg>
      );

    case PARTICLE_TYPES.NEUTRON:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill={hexColor} />
          <rect x="35" y="35" width="30" height="30" fill="#fff" transform="rotate(45 50 50)" opacity="0.9" />
        </svg>
      );

    case PARTICLE_TYPES.HYDROGEN:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="20" fill={hexColor} />
          <circle cx="50" cy="10" r="5" fill="#fff" />
        </svg>
      );

    case PARTICLE_TYPES.DEUTERIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="25" fill={hexColor} />
          <Nucleus protonCount={1} neutronCount={1} />
        </svg>
      );

    case PARTICLE_TYPES.TRITIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill={hexColor} />
          <Nucleus protonCount={1} neutronCount={2} />
        </svg>
      );

    case PARTICLE_TYPES.HELIUM:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="25" fill={hexColor} />
          <circle cx="50" cy="10" r="5" fill="#fff" />
        </svg>
      );

    case PARTICLE_TYPES.LITHIUM:
    case PARTICLE_TYPES.BERYLLIUM:
    case PARTICLE_TYPES.BORON:
    case PARTICLE_TYPES.CARBON:
    case PARTICLE_TYPES.NITROGEN:
    case PARTICLE_TYPES.OXYGEN:
      // simplified multi-electron visuals for a few atoms
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="28" fill={hexColor} />
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

