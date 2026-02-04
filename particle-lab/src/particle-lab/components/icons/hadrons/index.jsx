import React from 'react';
import { PARTICLE_COLOR_MAP } from '../../../../constants/particles.js';
import { radialGradient, SprinkleDots } from '../Base.jsx';

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
        const upColor = PARTICLE_COLOR_MAP['yellow-400'];
        const downColor = PARTICLE_COLOR_MAP['indigo-400'];
        for (let i = 0; i < up; i++) particles.push({ color: upColor, type: 'u' });
        for (let i = 0; i < down; i++) particles.push({ color: downColor, type: 'd' });
        for (let i = 0; i < antiUp; i++) particles.push({ color: upColor, type: 'ū' });
        for (let i = 0; i < antiDown; i++) particles.push({ color: downColor, type: 'd̅' });
    }

    const positions = [
      [], // 0
      [[50, 50]], // 1
      [[45, 50], [55, 50]], // 2
      [[50, 38], [35, 62], [65, 62]], // 3
    ];

    const particlePositions = positions[total] || [];

    return (
      <g>
        <path
          d={`M ${particlePositions[0][0]},${particlePositions[0][1]} Q 50,50 ${particlePositions[1][0]},${particlePositions[1][1]} T ${particlePositions[2][0]},${particlePositions[2][1]} T ${particlePositions[0][0]},${particlePositions[0][1]}`}
          stroke={gluonColor}
          strokeWidth="2"
          fill="none"
          strokeDasharray="2 4"
          className="animate-jiggle animate-gluon-pulse"
        />
        {particles.map((p, i) => (
          <g key={i} className="animate-jiggle" style={{ animationDelay: `${i * 0.1}s` }}>
            <circle
              cx={particlePositions[i][0]}
              cy={particlePositions[i][1]}
              r="10"
              className={p.animation || ''}
              fill={p.color || ''}
              stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
            <text x={particlePositions[i][0]} y={particlePositions[i][1]} dy=".35em" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
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
        <circle cx="35" cy="50" r="15" fill={quarkColor} stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="65" cy="50" r="15" fill={antiquarkColor} stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="white" strokeWidth="3" strokeDasharray="5 5" />
      </g>
    );
  };

export const QuarkIconBase = ({ hexColor, isAnti = false, children }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <defs>
      <radialGradient id={`grad-${hexColor.replace('#', '')}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0.8" />
        <stop offset="60%" stopColor={hexColor} stopOpacity="0.2" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
      <filter id="quantum-turbulence">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="turbulence" />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="15" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
    <g className="animate-pulse-glow" style={{ animationDuration: '4s' }}>
      <circle cx="50" cy="50" r="40" fill={`url(#grad-${hexColor.replace('#', '')})`} filter="url(#quantum-turbulence)" opacity="0.8" />
    </g>
    <circle cx="50" cy="50" r="5" fill="white" className="animate-vibrate" opacity="0.95" />
    <circle cx="50" cy="50" r="2.5" fill={hexColor} className="animate-vibrate" />
    {children}
    {!isAnti && (
       <g opacity="0.7">
         <circle cx="50" cy="50" r="30" fill="none" stroke={hexColor} strokeWidth="1" strokeDasharray="2 4" className="animate-spin-slow" opacity="0.3" />
         <SprinkleDots />
       </g>
    )}
  </svg>
);

export const UpQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} />;
export const DownQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} />;
export const CharmQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} />;
export const StrangeQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} />;
export const TopQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} />;
export const BottomQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} />;
export const AntiUpQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} isAnti />;
export const AntiDownQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} isAnti />;
export const AntiCharmQuarkIcon = ({ hexColor }) => <QuarkIconBase hexColor={hexColor} isAnti />;

export const ProtonIcon = ({ hexColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>{radialGradient('proton-grad', hexColor)}</defs>
        <circle cx="50" cy="50" r="45" fill="url(#proton-grad)" opacity="0.8" />
        <QuarkComposition up={2} down={1} parentHexColor={hexColor} />
    </svg>
);

export const NeutronIcon = ({ hexColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>{radialGradient('neutron-grad', hexColor)}</defs>
        <circle cx="50" cy="50" r="45" fill="url(#neutron-grad)" opacity="0.8" />
        <QuarkComposition up={1} down={2} parentHexColor={hexColor} />
    </svg>
);

export const AntiProtonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>{radialGradient('antiproton-grad', hexColor)}</defs>
    <circle cx="50" cy="50" r="45" fill="url(#antiproton-grad)" opacity="0.8" />
    <QuarkComposition antiUp={2} antiDown={1} parentHexColor={hexColor} />
    <text x="85" y="85" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" opacity="0.6">-</text>
  </svg>
);

export const AntiNeutronIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>{radialGradient('antineutron-grad', hexColor)}</defs>
    <circle cx="50" cy="50" r="45" fill="url(#antineutron-grad)" opacity="0.8" />
    <QuarkComposition antiUp={1} antiDown={2} parentHexColor={hexColor} />
    <text x="85" y="85" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" opacity="0.4">n̅</text>
  </svg>
);

export const DecayingNeutronIcon = ({ hexColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ animation: 'jiggle 0.2s linear infinite' }}>
        <defs>{radialGradient('neutron-grad', hexColor)}</defs>
        <circle cx="50" cy="50" r="45" fill="url(#neutron-grad)" />
        <QuarkComposition up={1} down={2} />
    </svg>
);

export const PionPlusIcon = ({ hexColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>{radialGradient('pion-plus-grad', hexColor)}</defs>
        <circle cx="50" cy="50" r="45" fill="url(#pion-plus-grad)" />
        <MesonComposition quarkColor={PARTICLE_COLOR_MAP['yellow-400']} antiquarkColor={PARTICLE_COLOR_MAP['indigo-600']} />
    </svg>
);

export const PionMinusIcon = ({ hexColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>{radialGradient('pion-minus-grad', hexColor)}</defs>
        <circle cx="50" cy="50" r="45" fill="url(#pion-minus-grad)" />
        <MesonComposition quarkColor={PARTICLE_COLOR_MAP['indigo-400']} antiquarkColor={PARTICLE_COLOR_MAP['yellow-600']} />
    </svg>
);

export const LambdaBaryonIcon = ({ hexColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>{radialGradient('lambda-grad', hexColor)}</defs>
        <circle cx="50" cy="50" r="45" fill="url(#lambda-grad)" />
        <circle cx="50" cy="38" r="10" fill={PARTICLE_COLOR_MAP['yellow-400']} />
        <circle cx="35" cy="62" r="10" fill={PARTICLE_COLOR_MAP['indigo-400']} />
        <circle cx="65" cy="62" r="10" fill={PARTICLE_COLOR_MAP['green-500']} />
    </svg>
);

export const JPsiMesonIcon = ({ hexColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>{radialGradient('jpsi-grad', hexColor)}</defs>
        <circle cx="50" cy="50" r="45" fill="url(#jpsi-grad)" />
        <MesonComposition quarkColor={PARTICLE_COLOR_MAP['purple-500']} antiquarkColor={PARTICLE_COLOR_MAP['purple-700']} />
    </svg>
);

export const HiggsBosonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <defs>
      <radialGradient id="higgs-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="white" stopOpacity="0.9" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="40" fill="url(#higgs-grad)" className="animate-pulse-glow" />
    <circle cx="50" cy="50" r="10" fill="white" className="animate-vibrate" opacity="0.8" />
    <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" className="animate-spin-slow" />
    <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 8" className="animate-spin-slow-reverse" />
  </svg>
);

export const ElectronIcon = ({ hexColor }) => {
  const gradId = `electron-grad-${hexColor.replace('#', '')}`;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-lg">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={hexColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="33.3" fill={`url(#${gradId})`} />
      <circle cx="33.3" cy="58.3" r="20.8" fill={`url(#${gradId})`} opacity="0.7" />
      <circle cx="66.6" cy="41.6" r="16.6" fill={`url(#${gradId})`} opacity="0.7" />
      <path d="M29.1 50 a 12.5 12.5 0 0 1 12.5 -12.5" stroke="white" strokeOpacity="0.2" fill="none" strokeWidth="2" />
      <g className="animate-vibrate">
        <circle cx="50" cy="50" r="3" fill="#ef4444" className="animate-pulse" style={{ animationDuration: '0.2s' }} />
      </g>
    </svg>
  );
};

export const PositronIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-lg">
    <defs>
      <radialGradient id="positron-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0.9" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="33.3" fill="url(#positron-grad)" />
    <circle cx="33.3" cy="58.3" r="20.8" fill="url(#positron-grad)" opacity="0.7" />
    <circle cx="66.6" cy="41.6" r="16.6" fill="url(#positron-grad)" opacity="0.7" />
    <path d="M29.1 50 a 12.5 12.5 0 0 1 12.5 -12.5" stroke="white" strokeOpacity="0.4" fill="none" strokeWidth="2" />
    <g className="animate-vibrate">
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">+</text>
    </g>
  </svg>
);

export const MuonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <circle cx="50" cy="50" r="30" fill={hexColor} opacity="0.6" />
    <circle cx="50" cy="50" r="15" fill={hexColor} className="animate-vibrate" />
    <path d="M 20 50 Q 50 20 80 50" stroke="white" strokeWidth="2" fill="none" strokeDasharray="5 5" opacity="0.5" />
    <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" opacity="0.8">μ</text>
  </svg>
);

export const TauIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <circle cx="50" cy="50" r="35" fill={hexColor} opacity="0.5" />
    <circle cx="50" cy="50" r="20" fill={hexColor} className="animate-vibrate" />
    <text x="50" y="58" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" opacity="0.9">τ</text>
  </svg>
);

export const ElectronNeutrinoIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
    <defs>
      <filter id="neutrino-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
      </filter>
      <radialGradient id="neutrino-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0.5" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="35" fill="url(#neutrino-glow)" filter="url(#neutrino-blur)" className="animate-pulse-slow" />
    <circle cx="50" cy="50" r="3" fill="white" className="animate-vibrate-glow" />
  </svg>
);

export const ElectronAntineutrinoIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
    <defs>
      <filter id="antineutrino-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="35" fill={hexColor} filter="url(#antineutrino-blur)" className="animate-pulse-slow" opacity="0.4" />
    <circle cx="50" cy="50" r="3" fill="black" className="animate-vibrate-glow-reverse" />
  </svg>
);

export const PhotonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none">
    <defs>
      <linearGradient id={`photon-beam-${hexColor.replace('#','')}`} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0" />
        <stop offset="50%" stopColor={hexColor} stopOpacity="1" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </linearGradient>
      <filter id="photon-glare">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g className="animate-pulse-glow" style={{ animationDuration: '2s' }}>
      <path d="M 10 50 C 30 20, 70 80, 90 50" stroke={`url(#photon-beam-${hexColor.replace('#','')})`} strokeWidth="2" fill="none" className="animate-ocean-wave" style={{ animationDuration: '3s' }} />
      <path d="M 10 50 C 30 80, 70 20, 90 50" stroke={`url(#photon-beam-${hexColor.replace('#','')})`} strokeWidth="2" fill="none" className="animate-ocean-wave" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
      <circle cx="50" cy="50" r="4" fill="white" filter="url(#photon-glare)" className="animate-vibrate" />
    </g>
  </svg>
);

export const GluonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none">
    <defs>
      <filter id="gluon-strain">
        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="1" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
      </filter>
    </defs>
    <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px' }}>
      <path d="M50 20 Q 80 20, 80 50 Q 80 80, 50 80 Q 20 80, 20 50 Q 20 20, 50 20 Z" stroke={hexColor} strokeWidth="3" strokeOpacity="0.6" fill="none" filter="url(#gluon-strain)" />
      <path d="M50 20 L 50 80 M 20 50 L 80 50" stroke={hexColor} strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <circle cx="50" cy="50" r="8" fill={hexColor} opacity="0.3" className="animate-pulse" />
    </g>
  </svg>
);

export const WBosonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none">
    <defs>
      <filter id={`w-distortion-${hexColor.replace('#','')}`}>
         <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="noise" />
         <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
      </filter>
      <linearGradient id={`w-grad-${hexColor.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0" />
        <stop offset="50%" stopColor={hexColor} stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="1" />
      </linearGradient>
    </defs>
    <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px', animationDuration: '10s' }}>
       <circle cx="50" cy="50" r="30" stroke={hexColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 4" />
       <path d="M 50 80 Q 20 50, 50 20 Q 80 50, 50 80" stroke={`url(#w-grad-${hexColor.replace('#','')})`} strokeWidth="4" fill="none" filter={`url(#w-distortion-${hexColor.replace('#','')})`} className="animate-pulse" />
       <path d="M 30 70 L 70 30" stroke="white" strokeWidth="2" strokeDasharray="5 5" className="animate-draw-wave" />
    </g>
    <circle cx="20" cy="80" r="3" fill={hexColor} className="animate-fade-out-and-disperse" style={{ '--i': 0, '--j': 1 }} />
    <circle cx="80" cy="20" r="3" fill="white" className="animate-fade-out-and-disperse" style={{ '--i': 1, '--j': 0 }} />
  </svg>
);

export const ZBosonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none">
     <defs>
      <radialGradient id={`z-void-${hexColor.replace('#','')}`} cx="50%" cy="50%" r="50%">
        <stop offset="40%" stopColor="black" stopOpacity="0" />
        <stop offset="90%" stopColor={hexColor} stopOpacity="0.5" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="35" fill={`url(#z-void-${hexColor.replace('#','')})`} />
    <circle cx="50" cy="50" r="28" stroke={hexColor} strokeWidth="1.5" strokeDasharray="10 30" className="animate-spin-slow" opacity="0.8" />
    <circle cx="50" cy="50" r="22" stroke={hexColor} strokeWidth="1.5" strokeDasharray="5 15" className="animate-spin-slow-reverse" opacity="0.6" />
    <circle cx="50" cy="50" r="4" fill="none" stroke={hexColor} strokeWidth="2" className="animate-pulse" />
  </svg>
);

export const ExcitedElectronIcon = ({ hexColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
        {radialGradient('grad-excited-e', hexColor)}
        <filter id="glow-excited-e">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        </defs>
        <g style={{ animation: 'jiggle 0.3s linear infinite' }}>
        <ellipse cx="50" cy="50" rx="45" ry="25" stroke={hexColor} strokeWidth="4" fill="none" opacity="0.9" filter="url(#glow-excited-e)" />
        <circle cx="50" cy="50" r="12" fill="url(#grad-excited-e)" filter="url(#glow-excited-e)" />
        </g>
    </svg>
);
