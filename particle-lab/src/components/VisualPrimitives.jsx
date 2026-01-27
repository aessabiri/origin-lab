import React from 'react';
import { PARTICLE_COLOR_MAP } from '../constants/particles.js';

export const radialGradient = (id, c, opacity = 0.8) => (
  <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
    <stop offset="0%" stopColor="#ffffff" stopOpacity={opacity} />
    <stop offset="100%" stopColor={c} />
  </radialGradient>
);

export const NeoBond = ({ x1, y1, x2, y2, type = 'single', scale = 1 }) => {
  const widthMap = { single: 6 * scale, double: 10 * scale, triple: 14 * scale };
  const innerWidthMap = { single: 2 * scale, double: 4 * scale, triple: 6 * scale };

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={widthMap[type] || 6 * scale} strokeLinecap="round" opacity="0.6" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={innerWidthMap[type] || 2 * scale} strokeLinecap="round" opacity="0.8" />
    </g>
  );
};
export const NeoSphere = ({ x, y, r, color, label }) => {
  const safeColor = color || '#9ca3af';
  const gradId = `sphere-grad-${safeColor.replace('#','')}-${Math.floor(Math.random() * 1000)}`;
  
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
      <circle r={r} fill={`url(#${gradId})`} opacity="0.9" />
      {label && <text y="4" textAnchor="middle" fill="white" fontSize={Math.max(10, r*0.8)} fontWeight="bold" style={{ textShadow: '0 1px 2px black' }} pointerEvents="none">{label}</text>}
    </g>
  );
};
