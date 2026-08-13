import React from 'react';
import { PARTICLE_COLOR_MAP } from '../../../constants/particles.js';

export const NeoBond = ({ x1, y1, x2, y2, type = 'single' }) => {
  const widthMap = { single: 6, double: 10, triple: 14 };
  const innerWidthMap = { single: 2, double: 4, triple: 6 };
  
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={widthMap[type] || 6} strokeLinecap="round" opacity="0.6" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={innerWidthMap[type] || 2} strokeLinecap="round" opacity="0.8" />
    </g>
  );
};

export const NeoSphere = ({ x, y, r, color, label, opacity = 0.9 }) => {
  const safeColor = color || '#9ca3af';
  const gradId = `sphere-grad-${safeColor.replace('#','')}`;
  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
          <radialGradient id={gradId} cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="20%" stopColor={safeColor} />
              <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
          </radialGradient>
          <filter id="sphere-shadow">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
      </defs>
      <circle r={r} fill={safeColor} filter="url(#sphere-shadow)" />
      <circle r={r} fill={`url(#${gradId})`} opacity={opacity} />
      {label && <text y="4" textAnchor="middle" fill="white" fontSize={Math.max(10, r*0.8)} fontWeight="bold" style={{ textShadow: '0 1px 2px black' }} pointerEvents="none">{label}</text>}
    </g>
  );
};

export const radialGradient = (id, c, opacity = 0.8) => (
    <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity={opacity} />
      <stop offset="100%" stopColor={c} />
    </radialGradient>
  );

export const PngIcon = ({ src, alt, className = '' }) => (
  <img src={src} alt={alt} className={`w-full h-full object-contain pointer-events-none ${className}`} />
);

export const GenericMoleculeIcon = ({ hexColor, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`}>
    <NeoBond x1={50} y1={50} x2={25} y2={70} />
    <NeoBond x1={50} y1={50} x2={75} y2={70} />
    <NeoSphere x={50} y={50} r={18} color={hexColor} />
    <NeoSphere x={25} y={70} r={12} color="#e2e8f0" />
    <NeoSphere x={75} y={70} r={12} color="#e2e8f0" />
  </svg>
);

export const SprinkleDots = () => (
  <>
    <circle cx="20" cy="30" r="1.5" fill="#fde047" className="animate-electron-particle" />
    <circle cx="80" cy="70" r="1.5" fill="#818cf8" className="animate-electron-particle" style={{ animationDelay: '0.3s' }} />
    <circle cx="30" cy="80" r="1" fill="#ef4444" className="animate-electron-particle" style={{ animationDelay: '0.6s' }} />
    <circle cx="75" cy="25" r="1" fill="#22c55e" className="animate-electron-particle" style={{ animationDelay: '0.9s' }} />
  </>
);
