import React from 'react';
import { PARTICLE_COLOR_MAP } from '../../../../constants/particles.js';
import { radialGradient, SprinkleDots } from '../Base.jsx';

// ---- REUSABLE COMPOSITIONS ---- //

export const QuarkComposition = ({ up = 0, down = 0, antiUp = 0, antiDown = 0, parentHexColor }) => {
    const gluonColor = PARTICLE_COLOR_MAP['black'];
    const total = up + down + antiUp + antiDown;
    if (total === 0) return null;

    const particles = [];
    if (total === 3 && (up + down === 3)) { // Baryons
        const qcdAnimations = [
            'animate-qcd-color-cycle-1',
            'animate-qcd-color-cycle-2',
            'animate-qcd-color-cycle-3',
        ];
        let upQuarks = up;
        for (let i = 0; i < 3; i++) {
            particles.push({ animation: qcdAnimations[i], type: upQuarks-- > 0 ? 'u' : 'd' });
        }
    } else if (total === 3 && (antiUp + antiDown === 3)) { // Anti-Baryons
        const qcdAnimations = [
            'animate-qcd-color-cycle-1',
            'animate-qcd-color-cycle-2',
            'animate-qcd-color-cycle-3',
        ];
        let auQuarks = antiUp;
        for (let i = 0; i < 3; i++) {
            particles.push({ animation: qcdAnimations[i], type: auQuarks-- > 0 ? 'ū' : 'd̅' });
        }
    } else { // Generic
        const upColor = PARTICLE_COLOR_MAP['yellow-400'] || '#facc15';
        const downColor = PARTICLE_COLOR_MAP['indigo-400'] || '#818cf8';
        for (let i = 0; i < up; i++) particles.push({ color: upColor, type: 'u' });
        for (let i = 0; i < down; i++) particles.push({ color: downColor, type: 'd' });
        for (let i = 0; i < antiUp; i++) particles.push({ color: upColor, type: 'ū' });
        for (let i = 0; i < antiDown; i++) particles.push({ color: downColor, type: 'd̅' });
    }

    const positions = [
      [], // 0
      [[50, 50]], // 1
      [[40, 50], [60, 50]], // 2
      [[50, 35], [37, 60], [63, 60]], // 3
    ];

    const particlePositions = positions[total] || [];

    return (
      <g>
        {total === 3 && (
            <path
            d={`M ${particlePositions[0][0]},${particlePositions[0][1]} Q 50,50 ${particlePositions[1][0]},${particlePositions[1][1]} T ${particlePositions[2][0]},${particlePositions[2][1]} T ${particlePositions[0][0]},${particlePositions[0][1]}`}
            stroke={gluonColor || '#000'}
            strokeWidth="3"
            fill="none"
            strokeDasharray="2 6"
            className="animate-jiggle animate-gluon-pulse"
            opacity="0.7"
            />
        )}
        {total === 2 && (
             <line x1={particlePositions[0][0]} y1={particlePositions[0][1]} x2={particlePositions[1][0]} y2={particlePositions[1][1]} stroke="white" strokeWidth="4" strokeDasharray="4 4" opacity="0.8" className="animate-pulse" />
        )}
        {particles.map((p, i) => (
          <g key={i} className="animate-jiggle" style={{ animationDelay: `${i * 0.15}s` }}>
            <circle
              cx={particlePositions[i][0]}
              cy={particlePositions[i][1]}
              r="12"
              className={p.animation || ''}
              fill={p.color || '#fff'}
              stroke="#fff" strokeOpacity="0.8" strokeWidth="2" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" />
            <text x={particlePositions[i][0]} y={particlePositions[i][1]} dy=".35em" textAnchor="middle" fill="#111" fontSize="12" fontWeight="900" fontFamily="sans-serif">
              {p.type}
            </text>
          </g>
        ))}
      </g>
    );
  };

export const MesonComposition = ({ quarkColor, antiquarkColor }) => {
    return (
      <g>
        <circle cx="35" cy="50" r="16" fill={quarkColor} stroke="#fff" strokeWidth="2" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.4))" />
        <circle cx="65" cy="50" r="16" fill={antiquarkColor} stroke="#fff" strokeWidth="2" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.4))" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="white" strokeWidth="4" strokeDasharray="6 4" className="animate-pulse" opacity="0.9" />
      </g>
    );
  };

// ---- QUARKS ---- //

export const QuarkIconBase = ({ hexColor, isAnti = false, label, charge, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`}>
    <defs>
      <radialGradient id={`grad-${hexColor.replace('#', '')}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0.95" />
        <stop offset="70%" stopColor={hexColor} stopOpacity="0.4" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
      <filter id="quantum-turbulence">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="turbulence" />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale={isAnti ? "-20" : "20"} xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
      <filter id="crisp-glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g className={isAnti ? "animate-pulse" : "animate-pulse-glow"} style={{ animationDuration: '3s', animationDirection: isAnti ? 'reverse' : 'normal' }}>
      <circle cx="50" cy="50" r="42" fill={`url(#grad-${hexColor.replace('#', '')})`} filter="url(#quantum-turbulence)" opacity={isAnti ? "0.6" : "0.85"} />
    </g>
    
    <circle cx="50" cy="50" r="18" fill={hexColor} stroke="#fff" strokeWidth="3" filter="url(#crisp-glow)" className="animate-jiggle" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="sans-serif" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.8))">{label}</text>
    
    <g transform="translate(70, 30)">
        <rect x="-12" y="-10" width="24" height="16" rx="4" fill="#000" opacity="0.6" />
        <text x="0" y="0" dy=".3em" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="monospace">{charge}</text>
    </g>

    {!isAnti ? (
       <g opacity="0.8">
         <circle cx="50" cy="50" r="32" fill="none" stroke={hexColor} strokeWidth="2" strokeDasharray="4 8" className="animate-spin-slow" />
         <circle cx="50" cy="50" r="38" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 12" className="animate-spin-slow-reverse" opacity="0.5" />
       </g>
    ) : (
       <g opacity="0.8">
         <circle cx="50" cy="50" r="32" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="8 4" className="animate-spin-slow-reverse" />
         <circle cx="50" cy="50" r="38" fill="none" stroke={hexColor} strokeWidth="1.5" strokeDasharray="4 6" className="animate-spin-slow" opacity="0.7" />
       </g>
    )}
  </svg>
);

export const UpQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} label="u" charge="+2/3" className={className} />;
export const DownQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} label="d" charge="-1/3" className={className} />;
export const CharmQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} label="c" charge="+2/3" className={className} />;
export const StrangeQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} label="s" charge="-1/3" className={className} />;
export const TopQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} label="t" charge="+2/3" className={className} />;
export const BottomQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} label="b" charge="-1/3" className={className} />;

export const AntiUpQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} isAnti label="ū" charge="-2/3" className={className} />;
export const AntiDownQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} isAnti label="d̅" charge="+1/3" className={className} />;
export const AntiCharmQuarkIcon = ({ hexColor, className }) => <QuarkIconBase hexColor={hexColor} isAnti label="c̅" charge="-2/3" className={className} />;

// ---- LEPTONS ---- //

export const ElectronIcon = ({ hexColor, className = '' }) => {
  const gradId = `electron-grad-${hexColor.replace('#', '')}`;
  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible drop-shadow-xl ${className}`}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="30%" stopColor={hexColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
        </radialGradient>
        <filter id="electron-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="35" fill={`url(#${gradId})`} className="animate-pulse-glow" />
      <circle cx="50" cy="50" r="18" fill={hexColor} filter="url(#electron-glow)" stroke="#fff" strokeWidth="2" className="animate-jiggle" />
      <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold" fontFamily="sans-serif">e⁻</text>
      
      <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px', animationDuration: '4s' }}>
        <ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" transform="rotate(30 50 50)" />
        <circle cx="86" cy="70" r="4" fill="#fff" filter="url(#electron-glow)" className="animate-pulse" />
      </g>
    </svg>
  );
};

export const PositronIcon = ({ hexColor, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible drop-shadow-xl ${className}`}>
    <defs>
      <radialGradient id={`positron-grad-${hexColor.replace('#','')}`} cx="50%" cy="50%" r="50%" fx="70%" fy="70%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="30%" stopColor={hexColor} stopOpacity="0.8" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="35" fill={`url(#positron-grad-${hexColor.replace('#','')})`} className="animate-pulse-glow" style={{ animationDirection: 'reverse' }} />
    <circle cx="50" cy="50" r="18" fill={hexColor} stroke="#fff" strokeWidth="2" strokeDasharray="4 2" className="animate-spin-slow" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold" fontFamily="sans-serif">e⁺</text>
    
    <g className="animate-spin-slow-reverse" style={{ transformOrigin: '50px 50px', animationDuration: '3s' }}>
      <ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke={hexColor} strokeWidth="2" opacity="0.8" transform="rotate(-30 50 50)" />
      <circle cx="14" cy="30" r="4" fill="#fff" className="animate-pulse" />
    </g>
  </svg>
);

export const MuonIcon = ({ hexColor, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`}>
    <defs>
      <filter id="muon-heavy-glow">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="38" fill={hexColor} opacity="0.4" filter="url(#muon-heavy-glow)" className="animate-pulse" />
    <circle cx="50" cy="50" r="22" fill={hexColor} stroke="#fff" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="bold" fontFamily="sans-serif">μ⁻</text>
    <path d="M 15 50 Q 50 15 85 50" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="6 6" opacity="0.7" className="animate-jiggle" />
  </svg>
);

export const TauIcon = ({ hexColor, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`}>
    <circle cx="50" cy="50" r="42" fill={hexColor} opacity="0.3" className="animate-pulse-slow" />
    <circle cx="50" cy="50" r="26" fill={hexColor} stroke="#fff" strokeWidth="4" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.6))" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="bold" fontFamily="sans-serif">τ⁻</text>
    <circle cx="50" cy="50" r="36" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="10 15" className="animate-spin-slow" opacity="0.5" />
  </svg>
);

export const ElectronNeutrinoIcon = ({ hexColor, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none">
    <defs>
      <filter id="neutrino-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
      </filter>
      <radialGradient id={`neutrino-glow-${hexColor.replace('#','')}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0.7" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="35" fill={`url(#neutrino-glow-${hexColor.replace('#','')})`} filter="url(#neutrino-blur)" className="animate-pulse-slow" />
    <text x="50" y="50" dy=".3em" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="sans-serif" opacity="0.9">ν<tspan dy="5" fontSize="12">e</tspan></text>
    <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 10" className="animate-spin-fast" opacity="0.4" />
  </svg>
);

export const ElectronAntineutrinoIcon = ({ hexColor, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none">
    <defs>
      <filter id="antineutrino-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="35" fill={hexColor} filter="url(#antineutrino-blur)" className="animate-pulse-slow" opacity="0.5" />
    <text x="50" y="50" dy=".3em" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="sans-serif" opacity="0.9">ν̅<tspan dy="5" fontSize="12">e</tspan></text>
    <circle cx="50" cy="50" r="30" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="4 8" className="animate-spin-slow-reverse" opacity="0.6" />
  </svg>
);

// ---- GAUGE BOSONS & SCALAR ---- //

export const PhotonIcon = ({ hexColor = '#fbbf24', className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`} fill="none">
    <defs>
      <linearGradient id="photon-beam" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0" />
        <stop offset="50%" stopColor="#fff" stopOpacity="1" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </linearGradient>
      <filter id="photon-glare">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g className="animate-pulse-glow" style={{ animationDuration: '1.5s' }}>
      <path d="M 5 50 Q 25 10, 50 50 T 95 50" stroke="url(#photon-beam)" strokeWidth="4" fill="none" className="animate-ocean-wave" style={{ animationDuration: '2s' }} filter="url(#photon-glare)" />
      <path d="M 5 50 Q 25 90, 50 50 T 95 50" stroke={hexColor} strokeWidth="2" fill="none" className="animate-ocean-wave" style={{ animationDuration: '2s', animationDirection: 'reverse' }} opacity="0.8" />
      <circle cx="50" cy="50" r="14" fill="#fff" filter="url(#photon-glare)" className="animate-jiggle" />
      <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold" fontFamily="sans-serif">γ</text>
    </g>
  </svg>
);

export const GluonIcon = ({ hexColor = '#10b981', className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`} fill="none">
    <defs>
      <filter id="gluon-strain">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
      </filter>
      <linearGradient id="qcd-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px' }}>
      <path d="M50 10 C 80 10, 90 40, 90 50 C 90 80, 60 90, 50 90 C 20 90, 10 60, 10 50 C 10 20, 40 10, 50 10 Z" stroke="url(#qcd-grad)" strokeWidth="6" strokeOpacity="0.9" fill="none" filter="url(#gluon-strain)" />
      <path d="M50 20 L 50 80 M 20 50 L 80 50 M 28 28 L 72 72 M 28 72 L 72 28" stroke="url(#qcd-grad)" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
    </g>
    <circle cx="50" cy="50" r="16" fill="#111" stroke="#fff" strokeWidth="2" className="animate-pulse" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="sans-serif">g</text>
  </svg>
);

export const WBosonIcon = ({ hexColor = '#3b82f6', className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`} fill="none">
    <defs>
      <filter id="w-halo">
         <feGaussianBlur stdDeviation="5" result="blur" />
         <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <radialGradient id="w-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="1" />
        <stop offset="40%" stopColor={hexColor} stopOpacity="0.8" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="none" stroke={hexColor} strokeWidth="3" filter="url(#w-halo)" className="animate-pulse" opacity="0.6" />
    <circle cx="50" cy="50" r="24" fill="url(#w-core)" filter="url(#w-halo)" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#1e3a8a" fontSize="24" fontWeight="bold" fontFamily="sans-serif">W<tspan dy="-10" fontSize="14">±</tspan></text>
    <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px', animationDuration: '6s' }}>
       <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
       <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    </g>
  </svg>
);

export const ZBosonIcon = ({ hexColor = '#8b5cf6', className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`} fill="none">
     <defs>
      <radialGradient id="z-void" cx="50%" cy="50%" r="50%">
        <stop offset="20%" stopColor="#000" stopOpacity="0.9" />
        <stop offset="70%" stopColor={hexColor} stopOpacity="0.6" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
      <filter id="z-glow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="42" fill="url(#z-void)" />
    <circle cx="50" cy="50" r="32" stroke={hexColor} strokeWidth="3" strokeDasharray="15 10" className="animate-spin-slow" filter="url(#z-glow)" opacity="0.9" />
    <circle cx="50" cy="50" r="22" stroke="#fff" strokeWidth="2" strokeDasharray="5 15" className="animate-spin-slow-reverse" opacity="0.8" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold" fontFamily="sans-serif">Z<tspan dy="-10" fontSize="14">0</tspan></text>
  </svg>
);

export const HiggsBosonIcon = ({ hexColor = '#eab308', className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`}>
    <defs>
      <radialGradient id="higgs-field" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="1" />
        <stop offset="30%" stopColor={hexColor} stopOpacity="0.8" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
      <filter id="scalar-resonance">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill={hexColor} filter="url(#scalar-resonance)" opacity="0.4" className="animate-pulse-glow" style={{ animationDuration: '2s' }} />
    <circle cx="50" cy="50" r="25" fill="url(#higgs-field)" className="animate-jiggle" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#713f12" fontSize="24" fontWeight="bold" fontFamily="sans-serif">H<tspan dy="-10" fontSize="14">0</tspan></text>
    
    <circle cx="50" cy="50" r="32" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 8" className="animate-spin-slow" />
    <circle cx="50" cy="50" r="40" fill="none" stroke={hexColor} strokeWidth="2" strokeDasharray="8 12" className="animate-spin-slow-reverse" />
  </svg>
);

// ---- BARYONS ---- //

export const ProtonIcon = ({ hexColor, className = '' }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-xl ${className}`}>
        <defs>
            <radialGradient id="proton-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
                <stop offset="70%" stopColor={hexColor} stopOpacity="0.85" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#proton-grad)" stroke="#fff" strokeWidth="2" opacity="0.9" />
        <QuarkComposition up={2} down={1} parentHexColor={hexColor} />
        <g transform="translate(80, 20)">
            <circle cx="0" cy="0" r="12" fill="#ef4444" stroke="#fff" strokeWidth="1" />
            <text x="0" y="0" dy=".35em" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">p⁺</text>
        </g>
    </svg>
);

export const NeutronIcon = ({ hexColor, className = '' }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-xl ${className}`}>
        <defs>
            <radialGradient id="neutron-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
                <stop offset="70%" stopColor={hexColor} stopOpacity="0.85" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#neutron-grad)" stroke="#fff" strokeWidth="2" opacity="0.9" />
        <QuarkComposition up={1} down={2} parentHexColor={hexColor} />
        <g transform="translate(80, 20)">
            <circle cx="0" cy="0" r="12" fill="#64748b" stroke="#fff" strokeWidth="1" />
            <text x="0" y="0" dy=".35em" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">n⁰</text>
        </g>
    </svg>
);

export const AntiProtonIcon = ({ hexColor, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-xl ${className}`}>
    <defs>
        <radialGradient id="antiproton-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
            <stop offset="70%" stopColor={hexColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
        </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#antiproton-grad)" stroke="#000" strokeWidth="2" strokeDasharray="4 4" opacity="0.9" />
    <QuarkComposition antiUp={2} antiDown={1} parentHexColor={hexColor} />
    <g transform="translate(80, 20)">
        <circle cx="0" cy="0" r="12" fill="#3b82f6" stroke="#fff" strokeWidth="1" />
        <text x="0" y="0" dy=".35em" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">p⁻</text>
    </g>
  </svg>
);

export const AntiNeutronIcon = ({ hexColor, className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-xl ${className}`}>
    <defs>
        <radialGradient id="antineutron-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
            <stop offset="70%" stopColor={hexColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
        </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#antineutron-grad)" stroke="#000" strokeWidth="2" strokeDasharray="4 4" opacity="0.9" />
    <QuarkComposition antiUp={1} antiDown={2} parentHexColor={hexColor} />
    <g transform="translate(80, 20)">
        <circle cx="0" cy="0" r="12" fill="#475569" stroke="#fff" strokeWidth="1" />
        <text x="0" y="0" dy=".35em" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">n̅</text>
    </g>
  </svg>
);

export const DecayingNeutronIcon = ({ hexColor, className = '' }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full animate-jiggle drop-shadow-xl ${className}`} style={{ animationDuration: '0.15s' }}>
        <defs>
            <radialGradient id="decay-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="70%" stopColor={hexColor} stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
            </radialGradient>
            <filter id="decay-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#decay-grad)" stroke="#fff" strokeWidth="2" strokeDasharray="10 5" filter="url(#decay-glow)" />
        <QuarkComposition up={1} down={2} />
        
        {/* Emitting W- boson & electron preview */}
        <path d="M 85 50 Q 95 30 95 10" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="4 4" className="animate-pulse" />
        <circle cx="95" cy="10" r="6" fill="#60a5fa" className="animate-ping" />
    </svg>
);

// ---- OTHER HADRONS ---- //

export const PionPlusIcon = ({ hexColor, className = '' }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-lg ${className}`}>
        <defs><radialGradient id="pion-plus-grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.4" /><stop offset="100%" stopColor={hexColor} stopOpacity="0.9" /></radialGradient></defs>
        <circle cx="50" cy="50" r="40" fill="url(#pion-plus-grad)" stroke="#fff" strokeWidth="2" />
        <MesonComposition quarkColor={PARTICLE_COLOR_MAP['yellow-400']} antiquarkColor={PARTICLE_COLOR_MAP['indigo-400']} />
        <text x="50" y="20" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">π⁺</text>
    </svg>
);

export const PionMinusIcon = ({ hexColor, className = '' }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-lg ${className}`}>
        <defs><radialGradient id="pion-minus-grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.4" /><stop offset="100%" stopColor={hexColor} stopOpacity="0.9" /></radialGradient></defs>
        <circle cx="50" cy="50" r="40" fill="url(#pion-minus-grad)" stroke="#fff" strokeWidth="2" />
        <MesonComposition quarkColor={PARTICLE_COLOR_MAP['indigo-400']} antiquarkColor={PARTICLE_COLOR_MAP['yellow-400']} />
        <text x="50" y="20" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">π⁻</text>
    </svg>
);

export const LambdaBaryonIcon = ({ hexColor, className = '' }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-xl ${className}`}>
        <defs><radialGradient id="lambda-grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.3" /><stop offset="100%" stopColor={hexColor} stopOpacity="0.9" /></radialGradient></defs>
        <circle cx="50" cy="50" r="48" fill="url(#lambda-grad)" stroke="#fff" strokeWidth="2" />
        <circle cx="50" cy="35" r="14" fill={PARTICLE_COLOR_MAP['yellow-400']} stroke="#fff" strokeWidth="1" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.5))" />
        <circle cx="37" cy="60" r="14" fill={PARTICLE_COLOR_MAP['indigo-400']} stroke="#fff" strokeWidth="1" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.5))" />
        <circle cx="63" cy="60" r="14" fill={PARTICLE_COLOR_MAP['green-500']} stroke="#fff" strokeWidth="1" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.5))" />
        <text x="50" y="50" dy=".3em" textAnchor="middle" fill="#000" fontSize="24" fontWeight="bold" opacity="0.2">Λ</text>
    </svg>
);

export const JPsiMesonIcon = ({ hexColor, className = '' }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-xl ${className}`}>
        <defs><radialGradient id="jpsi-grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.3" /><stop offset="100%" stopColor={hexColor} stopOpacity="0.9" /></radialGradient></defs>
        <circle cx="50" cy="50" r="45" fill="url(#jpsi-grad)" stroke="#fff" strokeWidth="2" />
        <MesonComposition quarkColor={PARTICLE_COLOR_MAP['purple-500']} antiquarkColor={PARTICLE_COLOR_MAP['purple-700']} />
        <text x="50" y="20" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">J/ψ</text>
    </svg>
);

// ---- RADIATION ---- //

export const AlphaParticleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`}>
    <defs>
        <filter id="alpha-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <g className="animate-pulse-glow" style={{ animationDuration: '0.8s' }}>
      <circle cx="40" cy="40" r="18" fill="#ef4444" stroke="#fff" strokeWidth="1" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))" />
      <circle cx="60" cy="60" r="18" fill="#ef4444" stroke="#fff" strokeWidth="1" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))" />
      <circle cx="60" cy="40" r="18" fill="#64748b" stroke="#fff" strokeWidth="1" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))" />
      <circle cx="40" cy="60" r="18" fill="#64748b" stroke="#fff" strokeWidth="1" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))" />
    </g>
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold" filter="url(#alpha-glow)">α</text>
    <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 8" className="animate-spin-fast" opacity="0.8" filter="url(#alpha-glow)" />
  </svg>
);

export const BetaParticleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`}>
    <defs>
        <filter id="beta-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <circle cx="50" cy="50" r="14" fill="#3b82f6" stroke="#fff" strokeWidth="2" filter="url(#beta-glow)" className="animate-vibrate" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">β⁻</text>
    <path d="M 0 50 Q 25 30 50 50 T 100 50" stroke="#60a5fa" strokeWidth="3" fill="none" strokeDasharray="6 4" className="animate-slide-right" opacity="0.8" />
    <circle cx="50" cy="50" r="35" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" className="animate-ping" style={{ animationDuration: '1s' }} />
  </svg>
);

export const GammaRayIcon = ({ className = '' }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full overflow-visible ${className}`}>
    <defs>
        <filter id="gamma-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="gamma-grad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
    </defs>
    <path d="M 0 50 Q 10 10 20 50 T 40 50 T 60 50 T 80 50 T 100 50" stroke="url(#gamma-grad)" strokeWidth="6" fill="none" className="animate-ocean-wave" style={{ animationDuration: '0.8s' }} filter="url(#gamma-glow)" />
    <circle cx="50" cy="50" r="20" fill="#fff" opacity="0.2" filter="url(#gamma-glow)" className="animate-pulse" />
    <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#000" fontSize="24" fontWeight="bold">γ</text>
  </svg>
);

export const ExcitedElectronIcon = ({ hexColor, className = '' }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`}>
        <defs>
            <radialGradient id="grad-excited-e" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                <stop offset="100%" stopColor={hexColor} stopOpacity="0.8" />
            </radialGradient>
            <filter id="glow-excited-e">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <g className="animate-jiggle" style={{ animationDuration: '0.1s' }}>
            <ellipse cx="50" cy="50" rx="45" ry="20" stroke={hexColor} strokeWidth="3" fill="none" opacity="0.9" filter="url(#glow-excited-e)" className="animate-spin-fast" style={{ transformOrigin: '50px 50px' }} />
            <circle cx="50" cy="50" r="16" fill="url(#grad-excited-e)" filter="url(#glow-excited-e)" stroke="#fff" strokeWidth="2" />
            <text x="50" y="50" dy=".35em" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">e*</text>
        </g>
    </svg>
);
