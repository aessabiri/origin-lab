import React from 'react';
import { PARTICLE_TYPES, PARTICLE_COLOR_MAP, PARTICLE_COLORS } from '../constants/particles.js';

// --- Helper Components & Functions ---

const NeoBond = ({ x1, y1, x2, y2, type = 'single' }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={type === 'double' ? 10 : 6} strokeLinecap="round" opacity="0.6" />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={type === 'double' ? 4 : 2} strokeLinecap="round" opacity="0.8" />
  </g>
);

const NeoSphere = ({ x, y, r, color = '#9ca3af', label }) => (
  <g transform={`translate(${x},${y})`}>
    <defs>
        <radialGradient id={`sphere-grad-${color.replace('#','')}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="20%" stopColor={color} />
            <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>
        <filter id="sphere-shadow">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
    </defs>
    <circle r={r} fill={color} filter="url(#sphere-shadow)" />
    <circle r={r} fill={`url(#sphere-grad-${color.replace('#','')})`} opacity="0.9" />
    {label && <text y="4" textAnchor="middle" fill="white" fontSize={Math.max(10, r*0.8)} fontWeight="bold" style={{ textShadow: '0 1px 2px black' }} pointerEvents="none">{label}</text>}
  </g>
);

const radialGradient = (id, c, opacity = 0.8) => (
    <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity={opacity} />
      <stop offset="100%" stopColor={c} />
    </radialGradient>
  );

const QuarkComposition = ({ up = 0, down = 0, parentHexColor }) => {
    const gluonColor = PARTICLE_COLOR_MAP['black'];
    const total = up + down;
    if (total === 0) return null;

    const particles = [];
    if (total === 3) { // Baryons (like protons/neutrons) have one of each color.
        const qcdAnimations = [
            'animate-qcd-color-cycle-1',
            'animate-qcd-color-cycle-2',
            'animate-qcd-color-cycle-3',
        ];
        let upQuarks = up;
        for (let i = 0; i < 3; i++) {
            particles.push({ animation: qcdAnimations[i], type: upQuarks-- > 0 ? 'u' : 'd' });
        }
    } else { // For other particles, use default colors.
        const upColor = PARTICLE_COLOR_MAP['yellow-400'];
        const downColor = PARTICLE_COLOR_MAP['indigo-400'];
        for (let i = 0; i < up; i++) particles.push({ color: upColor, type: 'u' });
        for (let i = 0; i < down; i++) particles.push({ color: downColor, type: 'd' });
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
        {/* Gluon field lines */}
        <path
          d={`M ${particlePositions[0][0]},${particlePositions[0][1]} Q 50,50 ${particlePositions[1][0]},${particlePositions[1][1]} T ${particlePositions[2][0]},${particlePositions[2][1]} T ${particlePositions[0][0]},${particlePositions[0][1]}`}
          stroke={gluonColor}
          strokeWidth="2"
          fill="none"
          strokeDasharray="2 4"
          className="animate-jiggle animate-gluon-pulse"
        />
        {/* Quarks */}
        {particles.map((p, i) => (
          <g key={i} className="animate-jiggle" style={{ animationDelay: `${i * 0.1}s` }}>
            <circle
              cx={particlePositions[i][0]}
              cy={particlePositions[i][1]}
              r="10"
              className={p.animation}
              stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
            <text x={particlePositions[i][0]} y={particlePositions[i][1]} dy=".35em" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
              {p.type}
            </text>
          </g>
        ))}
      </g>
    );
  };

const Nucleus = ({ protonCount = 0, neutronCount = 0 }) => {
    const total = protonCount + neutronCount;
    if (total === 0) return null;

    // Spiral packing
    const particles = [];
    // Interleave protons and neutrons for better mixing visually
    let p = protonCount, n = neutronCount;
    while(p > 0 || n > 0) {
        if(p > 0) { particles.push({ type: 'p' }); p--; }
        if(n > 0) { particles.push({ type: 'n' }); n--; }
    }

    const c = 6; // Spacing factor
    const maxRadius = c * Math.sqrt(total);
    // Scale down if nucleus gets too large relative to icon size (100x100)
    const scale = maxRadius > 35 ? 35 / maxRadius : 1; 

    return (
      <g>
        <defs>
            <radialGradient id="proton-sphere" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>
            <radialGradient id="neutron-sphere" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#4b5563" />
            </radialGradient>
            <filter id="nucleus-glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g transform="translate(50,50)" filter="url(#nucleus-glow)">
            {particles.map((particle, i) => {
                // Fermat's spiral
                const angle = i * 2.39996; // Golden angle
                const r = c * Math.sqrt(i) * scale;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                const radius = 4 * scale; 
                return (
                    <circle 
                        key={i} 
                        cx={x} 
                        cy={y} 
                        r={radius < 1.5 ? 1.5 : radius}
                        fill={particle.type === 'p' ? "url(#proton-sphere)" : "url(#neutron-sphere)"} 
                        stroke="black" strokeWidth="0.2" strokeOpacity="0.5"
                    />
                );
            })}
        </g>
      </g>
    );
};

const ElectronShells = ({ electronCount = 0, hexColor }) => {
    if (electronCount === 0) return null;
    
    // Electron Configuration (approximate filling)
    const shells = [2, 8, 18, 32, 50]; 
    const activeShells = [];
    let remaining = electronCount;
    
    for (let capacity of shells) {
        if (remaining <= 0) break;
        const count = Math.min(remaining, capacity);
        activeShells.push(count);
        remaining -= count;
    }

    const baseRadius = 22;
    const radiusStep = 10;

    return (
      <g>
        <defs>
            <filter id="electron-glow">
                <feGaussianBlur stdDeviation="1" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>
        {activeShells.map((count, i) => {
            const r = baseRadius + i * radiusStep;
            // Limit radius to keep inside box
            const safeR = Math.min(r, 48); 
            return (
                <g key={i} className="animate-spin-slow" style={{ animationDuration: `${6 + i * 3}s`, transformOrigin: '50px 50px' }}>
                    {/* Orbit path - Glassy look */}
                    <circle cx="50" cy="50" r={safeR} fill="none" stroke={hexColor} strokeWidth="0.8" opacity="0.6" />
                    <circle cx="50" cy="50" r={safeR} fill="none" stroke="white" strokeWidth="0.2" opacity="0.3" />
                    
                    {/* Electrons */}
                    {Array.from({ length: count }).map((_, j) => {
                        const angle = (j / count) * 2 * Math.PI;
                        return (
                            <circle 
                                key={j}
                                cx={50 + safeR * Math.cos(angle)}
                                cy={50 + safeR * Math.sin(angle)}
                                r="2"
                                fill="white"
                                filter="url(#electron-glow)"
                                className="animate-pulse"
                            />
                        );
                    })}
                </g>
            );
        })}
      </g>
    );
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

// --- Individual Particle Icon Components ---

const SprinkleDots = () => (
  <>
    <circle cx="20" cy="30" r="1.5" fill="#fde047" className="animate-electron-particle" />
    <circle cx="80" cy="70" r="1.5" fill="#818cf8" className="animate-electron-particle" style={{ animationDelay: '0.3s' }} />
    <circle cx="30" cy="80" r="1" fill="#ef4444" className="animate-electron-particle" style={{ animationDelay: '0.6s' }} />
    <circle cx="75" cy="25" r="1" fill="#22c55e" className="animate-electron-particle" style={{ animationDelay: '0.9s' }} />
  </>
);

const VibratingDot = ({ hexColor }) => (
  <circle cx="50" cy="50" r="4" fill={hexColor} className="animate-vibrate" />
);

const QuarkIconBase = ({ hexColor, isAnti = false, children }) => (
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
    
    {/* Quantum Probability Cloud / Gluon Field */}
    <g className="animate-pulse-glow" style={{ animationDuration: '4s' }}>
      <circle 
        cx="50" cy="50" r="40" 
        fill={`url(#grad-${hexColor.replace('#', '')})`} 
        filter="url(#quantum-turbulence)" 
        opacity="0.8"
      />
    </g>

    {/* The Point Particle - Infinite Density */}
    <circle cx="50" cy="50" r="5" fill="white" className="animate-vibrate" opacity="0.95" />
    <circle cx="50" cy="50" r="2.5" fill={hexColor} className="animate-vibrate" />

    {children}
    
    {/* Virtual Particle Fluctuations */}
    {!isAnti && (
       <g opacity="0.7">
         <circle cx="50" cy="50" r="30" fill="none" stroke={hexColor} strokeWidth="1" strokeDasharray="2 4" className="animate-spin-slow" opacity="0.3" />
         <SprinkleDots />
       </g>
    )}
  </svg>
);

const UpQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} />
);

const DownQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} />
);

const CharmQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} />
);

const StrangeQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} />
);

const TopQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} />
);

const BottomQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} />
);

const AntiUpQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} isAnti />
);

const AntiDownQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} isAnti />
);

const ElectronIcon = ({ hexColor }) => {
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
      
      {/* The mystery core: a flickering, vibrating red dot */}
      <g className="animate-vibrate">
        <circle cx="50" cy="50" r="3" fill="#ef4444" className="animate-pulse" style={{ animationDuration: '0.2s' }} />
      </g>
    </svg>
  );
};

const AntiCharmQuarkIcon = ({ hexColor }) => (
  <QuarkIconBase hexColor={hexColor} isAnti />
);

const ElectronNeutrinoIcon = ({ hexColor }) => (
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
    {/* The energy cloud */}
    <circle cx="50" cy="50" r="35" fill="url(#neutrino-glow)" filter="url(#neutrino-blur)" className="animate-pulse-slow" />
    {/* The vibrating, glowing dot */}
    <circle cx="50" cy="50" r="3" fill="white" className="animate-vibrate-glow" />
  </svg>
);

const ElectronAntineutrinoIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
    <defs>
      <filter id="antineutrino-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
      </filter>
    </defs>
    {/* The energy cloud for antimatter */}
    <circle cx="50" cy="50" r="35" fill={hexColor} filter="url(#antineutrino-blur)" className="animate-pulse-slow" opacity="0.4" />
    {/* The vibrating, glowing dot with a reverse animation */}
    <circle cx="50" cy="50" r="3" fill="black" className="animate-vibrate-glow-reverse" />
  </svg>
);

const PhotonIcon = ({ hexColor }) => (
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
    {/* Sleek Interference Pattern */}
    <g className="animate-pulse-glow" style={{ animationDuration: '2s' }}>
      <path d="M 10 50 C 30 20, 70 80, 90 50" stroke={`url(#photon-beam-${hexColor.replace('#','')})`} strokeWidth="2" fill="none" className="animate-ocean-wave" style={{ animationDuration: '3s' }} />
      <path d="M 10 50 C 30 80, 70 20, 90 50" stroke={`url(#photon-beam-${hexColor.replace('#','')})`} strokeWidth="2" fill="none" className="animate-ocean-wave" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
      <circle cx="50" cy="50" r="4" fill="white" filter="url(#photon-glare)" className="animate-vibrate" />
    </g>
  </svg>
);

const GluonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none">
    <defs>
      <filter id="gluon-strain">
        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="1" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
      </filter>
    </defs>
    {/* Flux Knot - Rotating Tension */}
    <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px' }}>
      <path 
        d="M50 20 Q 80 20, 80 50 Q 80 80, 50 80 Q 20 80, 20 50 Q 20 20, 50 20 Z" 
        stroke={hexColor} 
        strokeWidth="3" 
        strokeOpacity="0.6"
        fill="none"
        filter="url(#gluon-strain)"
      />
      <path 
        d="M50 20 L 50 80 M 20 50 L 80 50" 
        stroke={hexColor} 
        strokeWidth="1" 
        strokeDasharray="2 2"
        opacity="0.5" 
      />
      <circle cx="50" cy="50" r="8" fill={hexColor} opacity="0.3" className="animate-pulse" />
    </g>
  </svg>
);

const WBosonIcon = ({ hexColor }) => (
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
    
    {/* The Chiral Helix - representing Parity Violation */}
    <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px', animationDuration: '10s' }}>
       {/* Background structural rings */}
       <circle cx="50" cy="50" r="30" stroke={hexColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 4" />
       
       {/* The Winding Path of Transformation */}
       <path 
         d="M 50 80 Q 20 50, 50 20 Q 80 50, 50 80" 
         stroke={`url(#w-grad-${hexColor.replace('#','')})`}
         strokeWidth="4" 
         fill="none"
         filter={`url(#w-distortion-${hexColor.replace('#','')})`}
         className="animate-pulse"
       />
       
       {/* The weak interaction vertex - a sharp break */}
       <path d="M 30 70 L 70 30" stroke="white" strokeWidth="2" strokeDasharray="5 5" className="animate-draw-wave" />
    </g>
    
    {/* Emitting Particles (Decay products) - Using style for custom props */}
    <circle cx="20" cy="80" r="3" fill={hexColor} className="animate-fade-out-and-disperse" style={{ '--i': 0, '--j': 1 }} />
    <circle cx="80" cy="20" r="3" fill="white" className="animate-fade-out-and-disperse" style={{ '--i': 1, '--j': 0 }} />
  </svg>
);

const ZBosonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none">
     <defs>
      <radialGradient id={`z-void-${hexColor.replace('#','')}`} cx="50%" cy="50%" r="50%">
        <stop offset="40%" stopColor="black" stopOpacity="0" />
        <stop offset="90%" stopColor={hexColor} stopOpacity="0.5" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Neutral Current - Rotating Rings */}
    <circle cx="50" cy="50" r="35" fill={`url(#z-void-${hexColor.replace('#','')})`} />
    
    <circle cx="50" cy="50" r="28" stroke={hexColor} strokeWidth="1.5" strokeDasharray="10 30" className="animate-spin-slow" opacity="0.8" />
    <circle cx="50" cy="50" r="22" stroke={hexColor} strokeWidth="1.5" strokeDasharray="5 15" className="animate-spin-slow-reverse" opacity="0.6" />
    
    <circle cx="50" cy="50" r="4" fill="none" stroke={hexColor} strokeWidth="2" className="animate-pulse" />
  </svg>
);

const ProtonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('proton-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#proton-grad)" opacity="0.8" />
          <QuarkComposition up={2} down={1} parentHexColor={hexColor} />
        </svg>
      );

const NeutronIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('neutron-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#neutron-grad)" opacity="0.8" />
          <QuarkComposition up={1} down={2} parentHexColor={hexColor} />
        </svg>
      );

const DecayingNeutronIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ animation: 'jiggle 0.2s linear infinite' }}>
          <defs>{radialGradient('neutron-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#neutron-grad)" />
          <QuarkComposition up={1} down={2} />
        </svg>
      );
const PionPlusIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('pion-plus-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#pion-plus-grad)" />
          <MesonComposition quarkColor={PARTICLE_COLOR_MAP['yellow-400']} antiquarkColor={PARTICLE_COLOR_MAP['indigo-600']} />
        </svg>
      );

const ExcitedElectronIcon = ({ hexColor }) => (
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

const LambdaBaryonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('lambda-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#lambda-grad)" />
          <circle cx="50" cy="38" r="10" fill={PARTICLE_COLOR_MAP['yellow-400']} />
          <circle cx="35" cy="62" r="10" fill={PARTICLE_COLOR_MAP['indigo-400']} />
          <circle cx="65" cy="62" r="10" fill={PARTICLE_COLOR_MAP['green-500']} />
        </svg>
      );

const JPsiMesonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('jpsi-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#jpsi-grad)" />
          <MesonComposition quarkColor={PARTICLE_COLOR_MAP['purple-500']} antiquarkColor={PARTICLE_COLOR_MAP['purple-700']} />
        </svg>
      );

const CarbonDioxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={20} y2={50} type="double" />
    <NeoBond x1={50} y1={50} x2={80} y2={50} type="double" />
    <NeoSphere x={50} y={50} r={15} color={PARTICLE_COLOR_MAP['gray-800']} label="C" />
    <NeoSphere x={20} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={80} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const SodiumChlorideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Ionic lattice hint */}
    <rect x="35" y="35" width="30" height="30" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
    <NeoSphere x={35} y={35} r={14} color={PARTICLE_COLOR_MAP['violet-500']} label="Na" />
    <NeoSphere x={65} y={65} r={16} color={PARTICLE_COLOR_MAP['green-400']} label="Cl" />
    <NeoSphere x={65} y={35} r={16} color={PARTICLE_COLOR_MAP['green-400']} opacity="0.5" />
    <NeoSphere x={35} y={65} r={14} color={PARTICLE_COLOR_MAP['violet-500']} opacity="0.5" />
  </svg>
);

const HydrochloricAcidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} />
    <NeoSphere x={35} y={50} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={65} y={50} r={18} color={PARTICLE_COLOR_MAP['green-400']} label="Cl" />
  </svg>
);

const CarbonMonoxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={40} y1={50} x2={60} y2={50} type="double" /> {/* Triple bond visual trick: thick double */}
    <NeoSphere x={40} y={50} r={16} color={PARTICLE_COLOR_MAP['gray-800']} label="C" />
    <NeoSphere x={60} y={50} r={16} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

const HydrogenSulfideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={45} x2={30} y2={70} />
    <NeoBond x1={50} y1={45} x2={70} y2={70} />
    <NeoSphere x={50} y={45} r={20} color={PARTICLE_COLOR_MAP['yellow-500']} label="S" />
    <NeoSphere x={30} y={70} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={70} y={70} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

const HydrogenPeroxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={40} y1={45} x2={60} y2={55} /> {/* O-O */}
    <NeoBond x1={40} y1={45} x2={25} y2={60} /> {/* H-O */}
    <NeoBond x1={60} y1={55} x2={75} y2={40} /> {/* O-H */}
    <NeoSphere x={40} y={45} r={14} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={60} y={55} r={14} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={25} y={60} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={75} y={40} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

const PionMinusIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('pion-minus-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#pion-minus-grad)" />
          <MesonComposition quarkColor={PARTICLE_COLOR_MAP['indigo-400']} antiquarkColor={PARTICLE_COLOR_MAP['yellow-600']} />
        </svg>
      );

const WaterIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={55} x2={30} y2={75} />
    <NeoBond x1={50} y1={55} x2={70} y2={75} />
    <NeoSphere x={50} y={55} r={20} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={30} y={75} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={70} y={75} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

const MethaneIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={50} y2={20} />
    <NeoBond x1={50} y1={50} x2={25} y2={65} />
    <NeoBond x1={50} y1={50} x2={75} y2={65} />
    <NeoBond x1={50} y1={50} x2={50} y2={65} />
    <NeoSphere x={50} y={50} r={18} color={PARTICLE_COLOR_MAP['gray-800']} label="C" />
    <NeoSphere x={50} y={20} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={25} y={65} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={75} y={65} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

const AmmoniaIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={45} x2={30} y2={70} />
    <NeoBond x1={50} y1={45} x2={70} y2={70} />
    <NeoBond x1={50} y1={45} x2={50} y2={75} />
    <NeoSphere x={50} y={45} r={20} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
    <NeoSphere x={30} y={70} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={70} y={70} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={50} y={75} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

const OzoneIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={35} x2={30} y2={65} type="double" />
    <NeoBond x1={50} y1={35} x2={70} y2={65} />
    <NeoSphere x={50} y={35} r={15} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={30} y={65} r={15} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={70} y={65} r={15} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const NitrousOxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={50} x2={55} y2={50} type="double" />
    <NeoBond x1={55} y1={50} x2={80} y2={50} type="double" />
    <NeoSphere x={30} y={50} r={15} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
    <NeoSphere x={55} y={50} r={15} color={PARTICLE_COLOR_MAP['sky-500']} />
    <NeoSphere x={80} y={50} r={15} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

const SiliconDioxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={20} y2={50} type="double" />
    <NeoBond x1={50} y1={50} x2={80} y2={50} type="double" />
    <NeoSphere x={50} y={50} r={18} color={PARTICLE_COLOR_MAP['stone-500']} label="Si" />
    <NeoSphere x={20} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={80} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const HydrogenFluorideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} />
    <NeoSphere x={35} y={50} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={65} y={50} r={20} color={PARTICLE_COLOR_MAP['emerald-500']} label="F" />
  </svg>
);

const NeoAtomIcon = ({ hexColor, symbol, p, n, e }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    
    <ElectronShells electronCount={e} hexColor={hexColor} />
    <Nucleus protonCount={p} neutronCount={n} />
    
    {/* Symbol Overlay - Small and in corner to identify, but let particles shine */}
    <text x="88" y="92" textAnchor="end" fill="white" fontSize="14" fontWeight="bold" opacity="0.5" style={{ textShadow: '0 1px 2px black' }}>{symbol}</text>
  </svg>
);

const HydrogenIcon = (p) => <NeoAtomIcon symbol="H" p={1} n={0} e={1} {...p} />;
const DeuteriumIcon = (p) => <NeoAtomIcon symbol="D" p={1} n={1} e={1} {...p} />;
const TritiumIcon = (p) => <NeoAtomIcon symbol="T" p={1} n={2} e={1} {...p} />;
const HeliumIcon = (p) => <NeoAtomIcon symbol="He" p={2} n={2} e={2} {...p} />;
const LithiumIcon = (p) => <NeoAtomIcon symbol="Li" p={3} n={4} e={3} {...p} />;
const BerylliumIcon = (p) => <NeoAtomIcon symbol="Be" p={4} n={5} e={4} {...p} />;
const BoronIcon = (p) => <NeoAtomIcon symbol="B" p={5} n={6} e={5} {...p} />;
const CarbonIcon = (p) => <NeoAtomIcon symbol="C" p={6} n={6} e={6} {...p} />;
const NitrogenIcon = (p) => <NeoAtomIcon symbol="N" p={7} n={7} e={7} {...p} />;
const OxygenIcon = (p) => <NeoAtomIcon symbol="O" p={8} n={8} e={8} {...p} />;
const FluorineIcon = (p) => <NeoAtomIcon symbol="F" p={9} n={10} e={9} {...p} />;
const NeonIcon = (p) => <NeoAtomIcon symbol="Ne" p={10} n={10} e={10} {...p} />;
const SodiumIcon = (p) => <NeoAtomIcon symbol="Na" p={11} n={12} e={11} {...p} />;
const MagnesiumIcon = (p) => <NeoAtomIcon symbol="Mg" p={12} n={12} e={12} {...p} />;
const AluminiumIcon = (p) => <NeoAtomIcon symbol="Al" p={13} n={14} e={13} {...p} />;
const SiliconIcon = (p) => <NeoAtomIcon symbol="Si" p={14} n={14} e={14} {...p} />;
const PhosphorusIcon = (p) => <NeoAtomIcon symbol="P" p={15} n={16} e={15} {...p} />;
const SulfurIcon = (p) => <NeoAtomIcon symbol="S" p={16} n={16} e={16} {...p} />;
const ChlorineIcon = (p) => <NeoAtomIcon symbol="Cl" p={17} n={18} e={17} {...p} />;
const ArgonIcon = (p) => <NeoAtomIcon symbol="Ar" p={18} n={22} e={18} {...p} />;
const PotassiumIcon = (p) => <NeoAtomIcon symbol="K" p={19} n={20} e={19} {...p} />;
const CalciumIcon = (p) => <NeoAtomIcon symbol="Ca" p={20} n={20} e={20} {...p} />;
const ScandiumIcon = (p) => <NeoAtomIcon symbol="Sc" p={21} n={24} e={21} {...p} />;
const TitaniumIcon = (p) => <NeoAtomIcon symbol="Ti" p={22} n={26} e={22} {...p} />;
const VanadiumIcon = (p) => <NeoAtomIcon symbol="V" p={23} n={28} e={23} {...p} />;
const ChromiumIcon = (p) => <NeoAtomIcon symbol="Cr" p={24} n={28} e={24} {...p} />;
const ManganeseIcon = (p) => <NeoAtomIcon symbol="Mn" p={25} n={30} e={25} {...p} />;
const IronIcon = (p) => <NeoAtomIcon symbol="Fe" p={26} n={30} e={26} {...p} />;
const CobaltIcon = (p) => <NeoAtomIcon symbol="Co" p={27} n={32} e={27} {...p} />;
const NickelIcon = (p) => <NeoAtomIcon symbol="Ni" p={28} n={31} e={28} {...p} />;
const CopperIcon = (p) => <NeoAtomIcon symbol="Cu" p={29} n={34} e={29} {...p} />;
const ZincIcon = (p) => <NeoAtomIcon symbol="Zn" p={30} n={35} e={30} {...p} />;
const GalliumIcon = (p) => <NeoAtomIcon symbol="Ga" p={31} n={39} e={31} {...p} />;
const GermaniumIcon = (p) => <NeoAtomIcon symbol="Ge" p={32} n={41} e={32} {...p} />;
const ArsenicIcon = (p) => <NeoAtomIcon symbol="As" p={33} n={42} e={33} {...p} />;
const SeleniumIcon = (p) => <NeoAtomIcon symbol="Se" p={34} n={45} e={34} {...p} />;
const BromineIcon = (p) => <NeoAtomIcon symbol="Br" p={35} n={45} e={35} {...p} />;
const KryptonIcon = (p) => <NeoAtomIcon symbol="Kr" p={36} n={48} e={36} {...p} />;

const GenericAtomIcon = (props) => <NeoAtomIcon symbol="?" p={10} n={10} e={10} {...props} />;

const NeoAminoAcid = ({ rGroupNode, name }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Backbone: N - Ca - C(=O) */}
    <NeoBond x1={20} y1={60} x2={50} y2={50} /> {/* N - Ca */}
    <NeoBond x1={50} y1={50} x2={80} y2={60} /> {/* Ca - C */}
    <NeoBond x1={80} y1={60} x2={80} y2={30} type="double" /> {/* C = O */}
    
    {/* Atoms */}
    <NeoSphere x={20} y={60} r={12} color={PARTICLE_COLOR_MAP['blue-600']} label="N" />
    <NeoSphere x={50} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-800']} /> {/* Alpha Carbon */}
    <NeoSphere x={80} y={60} r={12} color={PARTICLE_COLOR_MAP['gray-800']} /> {/* Carboxyl Carbon */}
    <NeoSphere x={80} y={30} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />

    {/* R-Group Connection */}
    <NeoBond x1={50} y1={50} x2={50} y2={20} />
    
    {/* R-Group Specifics */}
    <g transform="translate(50, 20)">
        {rGroupNode}
    </g>
    
    {/* Name Label */}
    <text x="50" y="90" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" opacity="0.7" style={{ textShadow: '0 1px 2px black' }}>{name}</text>
  </svg>
);

const GlycineIcon = () => (
  <NeoAminoAcid name="Gly" rGroupNode={
    <NeoSphere x={0} y={0} r={10} color="white" label="H" />
  } />
);

const AlanineIcon = () => (
  <NeoAminoAcid name="Ala" rGroupNode={
    <NeoSphere x={0} y={0} r={12} color={PARTICLE_COLOR_MAP['gray-800']} label="C" />
  } />
);

const SerineIcon = () => (
  <NeoAminoAcid name="Ser" rGroupNode={
    <g>
      <NeoBond x1={0} y1={0} x2={0} y2={-15} />
      <NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
      <NeoSphere x={0} y={-15} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    </g>
  } />
);

const ValineIcon = () => (
  <NeoAminoAcid name="Val" rGroupNode={
    <g>
      <NeoBond x1={0} y1={0} x2={-10} y2={-15} />
      <NeoBond x1={0} y1={0} x2={10} y2={-15} />
      <NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
      <NeoSphere x={-10} y={-15} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
      <NeoSphere x={10} y={-15} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    </g>
  } />
);

const LeucineIcon = () => (
  <NeoAminoAcid name="Leu" rGroupNode={
    <g>
        <NeoBond x1={0} y1={0} x2={0} y2={-10} />
        <NeoBond x1={0} y1={-10} x2={-10} y2={-20} />
        <NeoBond x1={0} y1={-10} x2={10} y2={-20} />
        <NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
        <NeoSphere x={0} y={-10} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
        <NeoSphere x={-10} y={-20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
        <NeoSphere x={10} y={-20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    </g>
  } />
);

// Dipeptides need a custom view showing two residues
const DipeptideIcon = ({ Residue1, Residue2 }) => (
  <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible">
    <g transform="scale(0.6) translate(0, 30)">
        <Residue1 />
    </g>
    <g transform="scale(0.6) translate(100, 30)">
        <Residue2 />
    </g>
    {/* Peptide Bond Highlight */}
    <path d="M 50 60 Q 60 50, 70 60" stroke="#ec4899" strokeWidth="4" fill="none" className="animate-pulse" />
  </svg>
);

const GlycylglycineIcon = () => <DipeptideIcon Residue1={GlycineIcon} Residue2={GlycineIcon} />;
const GlycylAlanineIcon = () => <DipeptideIcon Residue1={GlycineIcon} Residue2={AlanineIcon} />;

const AyoubIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={20} x2={20} y2={80} />
    <NeoBond x1={50} y1={20} x2={80} y2={80} />
    <NeoBond x1={35} y1={50} x2={65} y2={50} />
    <NeoSphere x={50} y={20} r={15} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={20} y={80} r={15} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={80} y={80} r={15} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

const AdenineIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={50} x2={40} y2={33} type="double" />
    <NeoBond x1={40} y1={33} x2={60} y2={33} />
    <NeoBond x1={60} y1={33} x2={70} y2={50} type="double" />
    <NeoBond x1={70} y1={50} x2={60} y2={67} />
    <NeoBond x1={60} y1={67} x2={40} y2={67} type="double" />
    <NeoBond x1={40} y1={67} x2={30} y2={50} />
    <NeoBond x1={70} y1={50} x2={80} y2={40} />
    <NeoBond x1={80} y1={40} x2={75} y2={25} type="double" />
    <NeoBond x1={75} y1={25} x2={60} y2={33} />
    <NeoBond x1={60} y1={33} x2={60} y2={15} /> 
    <NeoSphere x={30} y={50} r={8} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={40} y={33} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={60} y={33} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={70} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={60} y={67} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={40} y={67} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={80} y={40} r={8} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={75} y={25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={60} y={15} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" />
  </svg>
);

const GuanineIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={50} x2={40} y2={33} />
    <NeoBond x1={40} y1={33} x2={60} y2={33} type="double" />
    <NeoBond x1={60} y1={33} x2={70} y2={50} />
    <NeoBond x1={70} y1={50} x2={60} y2={67} type="double" />
    <NeoBond x1={60} y1={67} x2={40} y2={67} />
    <NeoBond x1={40} y1={67} x2={30} y2={50} type="double" />
    <NeoBond x1={40} y1={33} x2={40} y2={15} type="double" />
    <NeoBond x1={70} y1={50} x2={85} y2={40} />
    <NeoBond x1={85} y1={40} x2={75} y2={25} type="double" />
    <NeoBond x1={75} y1={25} x2={60} y2={33} />
    <NeoSphere x={30} y={50} r={8} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={40} y={33} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={60} y={33} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={70} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={60} y={67} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={40} y={67} r={8} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={40} y={15} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={85} y={40} r={8} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={75} y={25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
  </svg>
);

const CytosineIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={20} x2={80} y2={35} type="double" />
    <NeoBond x1={80} y1={35} x2={80} y2={65} />
    <NeoBond x1={80} y1={65} x2={50} y2={80} type="double" />
    <NeoBond x1={50} y1={80} x2={20} y2={65} />
    <NeoBond x1={20} y1={65} x2={20} y2={35} type="double" />
    <NeoBond x1={20} y1={35} x2={50} y2={20} />
    <NeoBond x1={50} y1={20} x2={50} y2={5} />
    <NeoBond x1={20} y1={65} x2={5} y2={75} type="double" />
    <NeoSphere x={50} y={20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={80} y={35} r={10} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={80} y={65} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={50} y={80} r={10} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={20} y={65} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={20} y={35} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={50} y={5} r={10} color={PARTICLE_COLOR_MAP['blue-600']} label="N" />
    <NeoSphere x={5} y={75} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

const ThymineIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={20} x2={80} y2={35} />
    <NeoBond x1={80} y1={35} x2={80} y2={65} type="double" />
    <NeoBond x1={80} y1={65} x2={50} y2={80} />
    <NeoBond x1={50} y1={80} x2={20} y2={65} type="double" />
    <NeoBond x1={20} y1={65} x2={20} y2={35} />
    <NeoBond x1={20} y1={35} x2={50} y2={20} type="double" />
    <NeoBond x1={80} y1={35} x2={95} y2={25} />
    <NeoBond x1={50} y1={20} x2={50} y2={5} type="double" />
    <NeoBond x1={20} y1={65} x2={5} y2={75} type="double" />
    <NeoSphere x={50} y={20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={80} y={35} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={80} y={65} r={10} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={50} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={20} y={65} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={20} y={35} r={10} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={95} y={25} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={50} y={5} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={5} y={75} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

const NitrogenGasIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} type="triple" />
    <NeoSphere x={35} y={50} r={16} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
    <NeoSphere x={65} y={50} r={16} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
  </svg>
);

const OxygenGasIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} type="double" />
    <NeoSphere x={35} y={50} r={16} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={65} y={50} r={16} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

const AceticAcidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={60} x2={50} y2={40} />
    <NeoBond x1={50} y1={40} x2={70} y2={30} type="double" />
    <NeoBond x1={50} y1={40} x2={65} y2={60} />
    <NeoSphere x={30} y={60} r={14} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={50} y={40} r={14} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={70} y={30} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={65} y={60} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const EthanolIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={50} x2={55} y2={50} />
    <NeoBond x1={55} y1={50} x2={75} y2={50} />
    <NeoSphere x={30} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={55} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={75} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const SulfuricAcidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={50} y2={25} type="double" />
    <NeoBond x1={50} y1={50} x2={50} y2={75} type="double" />
    <NeoBond x1={50} y1={50} x2={25} y2={50} />
    <NeoBond x1={50} y1={50} x2={75} y2={50} />
    <NeoSphere x={50} y={50} r={16} color={PARTICLE_COLOR_MAP['yellow-500']} label="S" />
    <NeoSphere x={50} y={25} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={50} y={75} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={25} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={75} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const GlucoseIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <g transform="rotate(30 50 50)">
        <NeoBond x1={35} y1={25} x2={65} y2={25} />
        <NeoBond x1={65} y1={25} x2={80} y2={50} />
        <NeoBond x1={80} y1={50} x2={65} y2={75} />
        <NeoBond x1={65} y1={75} x2={35} y2={75} />
        <NeoBond x1={35} y1={75} x2={20} y2={50} />
        <NeoBond x1={20} y1={50} x2={35} y2={25} />
        
        <NeoSphere x={35} y={25} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
        <NeoSphere x={65} y={25} r={10} color={PARTICLE_COLOR_MAP['red-600']} />
        <NeoSphere x={80} y={50} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
        <NeoSphere x={65} y={75} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
        <NeoSphere x={35} y={75} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
        <NeoSphere x={20} y={50} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    </g>
  </svg>
);

// --- Nucleic Acids ---

const MiniAtom = ({ cx, cy, r, color }) => (
  <circle cx={cx} cy={cy} r={r} fill={color} stroke="black" strokeWidth="0.5" strokeOpacity="0.3" />
);

const DNAIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* --- Top Pair (A-T) --- */}
    
    {/* Backbone Left (5') */}
    <line x1={12} y1={12} x2={22} y2={32} stroke="#94a3b8" strokeWidth="2" /> {/* P -> S */}
    <line x1={22} y1={32} x2={45} y2={25} stroke="#94a3b8" strokeWidth="2" /> {/* S -> Base */}
    
    <svg x="0" y="0" width="25" height="25" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="10" y="20" width="25" height="25" viewBox="0 0 100 100"><DeoxyriboseIcon /></svg>
    <svg x="30" y="10" width="30" height="30" viewBox="0 0 100 100"><AdenineIcon /></svg>

    {/* Backbone Right (3' - Antiparallel) */}
    {/* Mirroring logic: Phosphate at bottom relative to sugar visually, or just inverted stack? 
        Let's keep it symmetric for icon clarity, just reversed horizontally. */}
    <line x1={88} y1={12} x2={78} y2={32} stroke="#94a3b8" strokeWidth="2" />
    <line x1={78} y1={32} x2={55} y2={25} stroke="#94a3b8" strokeWidth="2" />

    <svg x="75" y="0" width="25" height="25" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="65" y="20" width="25" height="25" viewBox="0 0 100 100"><DeoxyriboseIcon /></svg>
    <svg x="40" y="10" width="30" height="30" viewBox="0 0 100 100"><ThymineIcon /></svg>

    {/* H-Bonds */}
    <line x1={45} y1={25} x2={55} y2={25} stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />


    {/* --- Bottom Pair (C-G) --- */}
    
    {/* Backbone Connection Left (Top S -> Bot P) */}
    <line x1={22} y1={32} x2={12} y2={62} stroke="#94a3b8" strokeWidth="2" />

    {/* Backbone Left */}
    <line x1={12} y1={62} x2={22} y2={82} stroke="#94a3b8" strokeWidth="2" />
    <line x1={22} y1={82} x2={45} y2={75} stroke="#94a3b8" strokeWidth="2" />
    
    <svg x="0" y="50" width="25" height="25" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="10" y="70" width="25" height="25" viewBox="0 0 100 100"><DeoxyriboseIcon /></svg>
    <svg x="30" y="60" width="30" height="30" viewBox="0 0 100 100"><CytosineIcon /></svg>

    {/* Backbone Connection Right (Top S -> Bot P) */}
    <line x1={78} y1={32} x2={88} y2={62} stroke="#94a3b8" strokeWidth="2" />

    {/* Backbone Right */}
    <line x1={88} y1={62} x2={78} y2={82} stroke="#94a3b8" strokeWidth="2" />
    <line x1={78} y1={82} x2={55} y2={75} stroke="#94a3b8" strokeWidth="2" />

    <svg x="75" y="50" width="25" height="25" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="65" y="70" width="25" height="25" viewBox="0 0 100 100"><DeoxyriboseIcon /></svg>
    <svg x="40" y="60" width="30" height="30" viewBox="0 0 100 100"><GuanineIcon /></svg>

    {/* H-Bonds */}
    <line x1={45} y1={75} x2={55} y2={75} stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

    {/* Twist/Helix Hints */}
    <path d="M 5 25 Q -5 50 5 75" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0.1" />
    <path d="M 95 25 Q 105 50 95 75" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0.1" />
  </svg>
);

const RNAIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Single Strand Backbone Curve */}
    <path d="M 25 15 Q 15 50 35 85" stroke="#f97316" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" />

    {/* --- Base 1 (Adenine) --- */}
    <line x1={20} y1={15} x2={30} y2={25} stroke="#94a3b8" strokeWidth="2" />
    <line x1={30} y1={25} x2={50} y2={20} stroke="#94a3b8" strokeWidth="2" />
    
    <svg x="10" y="5" width="20" height="20" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="20" y="15" width="20" height="20" viewBox="0 0 100 100"><RiboseIcon /></svg>
    <svg x="40" y="10" width="25" height="25" viewBox="0 0 100 100"><AdenineIcon /></svg>

    {/* Link 1-2 */}
    <line x1={30} y1={25} x2={25} y2={45} stroke="#94a3b8" strokeWidth="2" />

    {/* --- Base 2 (Uracil) --- */}
    <line x1={15} y1={45} x2={25} y2={55} stroke="#94a3b8" strokeWidth="2" />
    <line x1={25} y1={55} x2={45} y2={50} stroke="#94a3b8" strokeWidth="2" />

    <svg x="5" y="35" width="20" height="20" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="15" y="45" width="20" height="20" viewBox="0 0 100 100"><RiboseIcon /></svg>
    <svg x="35" y="40" width="25" height="25" viewBox="0 0 100 100"><UracilIcon /></svg>

    {/* Link 2-3 */}
    <line x1={25} y1={55} x2={30} y2={75} stroke="#94a3b8" strokeWidth="2" />

    {/* --- Base 3 (Guanine) --- */}
    <line x1={20} y1={75} x2={30} y2={85} stroke="#94a3b8" strokeWidth="2" />
    <line x1={30} y1={85} x2={50} y2={80} stroke="#94a3b8" strokeWidth="2" />

    <svg x="10" y="65" width="20" height="20" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="20" y="75" width="20" height="20" viewBox="0 0 100 100"><RiboseIcon /></svg>
    <svg x="40" y="70" width="25" height="25" viewBox="0 0 100 100"><GuanineIcon /></svg>
  </svg>
);

const UracilIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Same as Thymine but no Methyl */}
    <NeoBond x1={50} y1={20} x2={80} y2={35} />
    <NeoBond x1={80} y1={35} x2={80} y2={65} type="double" />
    <NeoBond x1={80} y1={65} x2={50} y2={80} />
    <NeoBond x1={50} y1={80} x2={20} y2={65} type="double" />
    <NeoBond x1={20} y1={65} x2={20} y2={35} />
    <NeoBond x1={20} y1={35} x2={50} y2={20} type="double" />
    {/* Substituents */}
    <NeoBond x1={50} y1={20} x2={50} y2={5} type="double" /> {/* O */}
    <NeoBond x1={20} y1={65} x2={5} y2={75} type="double" /> {/* O */}

    <NeoSphere x={50} y={20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={80} y={35} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={80} y={65} r={10} color={PARTICLE_COLOR_MAP['blue-600']} />
    <NeoSphere x={50} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={20} y={65} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={20} y={35} r={10} color={PARTICLE_COLOR_MAP['blue-600']} />
    
    <NeoSphere x={50} y={5} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={5} y={75} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

const PhosphateIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={50} y2={20} type="double" />
    <NeoBond x1={50} y1={50} x2={20} y2={65} />
    <NeoBond x1={50} y1={50} x2={80} y2={65} />
    <NeoBond x1={50} y1={50} x2={50} y2={80} />
    <NeoSphere x={50} y={50} r={16} color={PARTICLE_COLOR_MAP['orange-500']} label="P" />
    <NeoSphere x={50} y={20} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={20} y={65} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={80} y={65} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={50} y={80} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const RiboseIcon = ({ isDeoxy = false }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Pentagon Ring: O(top), C1(right), C2(bottom-right), C3(bottom-left), C4(left) */}
    <path d="M 50 20 L 80 40 L 65 80 L 35 80 L 20 40 Z" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.6" strokeLinejoin="round" />
    
    {/* Oxygen at top */}
    <NeoSphere x={50} y={20} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    {/* Carbons */}
    <NeoSphere x={80} y={40} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={65} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={35} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={20} y={40} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    
    {/* C5 Branch */}
    <NeoBond x1={20} y1={40} x2={5} y2={20} />
    <NeoSphere x={5} y={20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />

    {/* Hydroxyls */}
    <NeoSphere x={95} y={40} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /> {/* C1 OH */}
    {!isDeoxy && <NeoSphere x={75} y={95} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" />} {/* C2 OH */}
    <NeoSphere x={25} y={95} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /> {/* C3 OH */}
  </svg>
);

const DeoxyriboseIcon = () => <RiboseIcon isDeoxy={true} />;

const GenericNucleotideIcon = ({ BaseIcon, isDeoxy = true }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Phosphate Group (Top Left) */}
    <g transform="translate(15, 25) scale(0.35)">
        <PhosphateIcon />
    </g>
    
    {/* Bond: Phosphate -> Sugar */}
    <line x1={25} y1={35} x2={40} y2={50} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

    {/* Sugar Group (Center-Bottom) */}
    <g transform="translate(35, 45) scale(0.4)">
        <RiboseIcon isDeoxy={isDeoxy} />
    </g>

    {/* Bond: Sugar -> Base */}
    <line x1={65} y1={55} x2={75} y2={45} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

    {/* Nitrogenous Base (Right) */}
    <g transform="translate(60, 15) scale(0.45)">
        <BaseIcon />
    </g>
  </svg>
);

const NucleotideAIcon = () => <GenericNucleotideIcon BaseIcon={AdenineIcon} isDeoxy={true} />;
const NucleotideTIcon = () => <GenericNucleotideIcon BaseIcon={ThymineIcon} isDeoxy={true} />;
const NucleotideGIcon = () => <GenericNucleotideIcon BaseIcon={GuanineIcon} isDeoxy={true} />;
const NucleotideCIcon = () => <GenericNucleotideIcon BaseIcon={CytosineIcon} isDeoxy={true} />;
const NucleotideUIcon = () => <GenericNucleotideIcon BaseIcon={UracilIcon} isDeoxy={false} />;

const ATPIcon = () => (
  <svg viewBox="0 0 140 100" className="w-full h-full overflow-visible">
    {/* Phosphates (Left) */}
    <g transform="translate(10, 50) scale(0.3)">
       <PhosphateIcon />
    </g>
    <line x1={20} y1={50} x2={30} y2={50} stroke="white" strokeWidth="2" />
    <g transform="translate(30, 50) scale(0.3)">
       <PhosphateIcon />
    </g>
    <line x1={40} y1={50} x2={50} y2={50} stroke="white" strokeWidth="2" />
    <g transform="translate(50, 50) scale(0.3)">
       <PhosphateIcon />
    </g>
    <line x1={60} y1={50} x2={70} y2={50} stroke="white" strokeWidth="2" />

    {/* Ribose (Center) */}
    <g transform="translate(70, 45) scale(0.35)">
        <RiboseIcon />
    </g>
    <line x1={90} y1={55} x2={100} y2={45} stroke="white" strokeWidth="2" />

    {/* Adenine (Right) */}
    <g transform="translate(90, 15) scale(0.4)">
        <AdenineIcon />
    </g>
  </svg>
);

const GlycerolIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Vertical Carbon Backbone */}
    <NeoBond x1={50} y1={20} x2={50} y2={50} />
    <NeoBond x1={50} y1={50} x2={50} y2={80} />
    
    {/* Hydroxyls */}
    <NeoBond x1={50} y1={20} x2={70} y2={20} />
    <NeoBond x1={50} y1={50} x2={70} y2={50} />
    <NeoBond x1={50} y1={80} x2={70} y2={80} />

    <NeoSphere x={50} y={20} r={12} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={50} y={50} r={12} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={50} y={80} r={12} color={PARTICLE_COLOR_MAP['gray-800']} />
    
    <NeoSphere x={70} y={20} r={10} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={70} y={50} r={10} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={70} y={80} r={10} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const FattyAcidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Carbon Backbone (Zig-Zag) */}
    <NeoBond x1={80} y1={50} x2={65} y2={50} />
    <NeoBond x1={65} y1={50} x2={55} y2={30} />
    <NeoBond x1={55} y1={30} x2={45} y2={60} />
    <NeoBond x1={45} y1={60} x2={35} y2={30} />
    <NeoBond x1={35} y1={30} x2={25} y2={60} />
    <NeoBond x1={25} y1={60} x2={15} y2={30} />
    <NeoBond x1={15} y1={30} x2={5} y2={50} />

    {/* Carboxyl Head */}
    <NeoBond x1={80} y1={50} x2={90} y2={35} type="double" />
    <NeoBond x1={80} y1={50} x2={90} y2={65} />

    {/* Atoms */}
    <NeoSphere x={80} y={50} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={90} y={35} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={90} y={65} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="OH" />
    
    <NeoSphere x={65} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={55} y={30} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={45} y={60} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={35} y={30} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={25} y={60} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={15} y={30} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={5} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
  </svg>
);

const LipidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* Glycerol Backbone (Vertical) */}
    <NeoBond x1={15} y1={25} x2={15} y2={50} />
    <NeoBond x1={15} y1={50} x2={15} y2={75} />
    
    {/* Ester Linkages */}
    <NeoBond x1={15} y1={25} x2={25} y2={25} />
    <NeoBond x1={15} y1={50} x2={25} y2={50} />
    <NeoBond x1={15} y1={75} x2={25} y2={75} />
    
    {/* Fatty Acid Chains (Simplified) */}
    {/* Top Chain */}
    <NeoBond x1={25} y1={25} x2={35} y2={25} />
    <NeoBond x1={35} y1={25} x2={45} y2={15} />
    <NeoBond x1={45} y1={15} x2={55} y2={30} />
    <NeoBond x1={55} y1={30} x2={65} y2={15} />
    <NeoBond x1={65} y1={15} x2={75} y2={30} />
    <NeoBond x1={75} y1={30} x2={85} y2={15} />

    {/* Middle Chain */}
    <NeoBond x1={25} y1={50} x2={35} y2={50} />
    <NeoBond x1={35} y1={50} x2={45} y2={40} />
    <NeoBond x1={45} y1={40} x2={55} y2={60} />
    <NeoBond x1={55} y1={60} x2={65} y2={40} />
    <NeoBond x1={65} y1={40} x2={75} y2={60} />
    <NeoBond x1={75} y1={60} x2={85} y2={40} />

    {/* Bottom Chain */}
    <NeoBond x1={25} y1={75} x2={35} y2={75} />
    <NeoBond x1={35} y1={75} x2={45} y2={65} />
    <NeoBond x1={45} y1={65} x2={55} y2={80} />
    <NeoBond x1={55} y1={80} x2={65} y2={65} />
    <NeoBond x1={65} y1={65} x2={75} y2={80} />
    <NeoBond x1={75} y1={80} x2={85} y2={65} />

    {/* Atoms */}
    {/* Glycerol Carbons */}
    <NeoSphere x={15} y={25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={15} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={15} y={75} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />

    {/* Ester Oxygens */}
    <NeoSphere x={25} y={25} r={6} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={25} y={50} r={6} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={25} y={75} r={6} color={PARTICLE_COLOR_MAP['red-600']} />

    {/* Carbonyl Carbons */}
    <NeoSphere x={35} y={25} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={35} y={50} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={35} y={75} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />

    {/* Chain Carbons (Just a few representative ones to avoid clutter) */}
    <NeoSphere x={55} y={30} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={75} y={30} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    
    <NeoSphere x={55} y={60} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={75} y={60} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />

    <NeoSphere x={55} y={80} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={75} y={80} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
  </svg>
);

const MembraneIcon = () => {
  const heads = Array.from({ length: 13 }, (_, i) => i);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      {/* Dense Phospholipid Bilayer */}
      
      {/* Tails (Forest of Carbon Chains) */}
      <g>
        {heads.map(i => (
          <g key={`tail-${i}`}>
             <line x1={5 + i * 7.5} y1={30} x2={5 + i * 7.5} y2={48} stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" />
             <line x1={5 + i * 7.5} y1={70} x2={5 + i * 7.5} y2={52} stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </g>

      {/* Top Layer Heads (Hydrophilic) */}
      <g>
        {heads.map(i => (
          <NeoSphere key={`top-${i}`} x={5 + i * 7.5} y={30} r={4} color={PARTICLE_COLOR_MAP['orange-300']} />
        ))}
      </g>

      {/* Bottom Layer Heads */}
      <g>
        {heads.map(i => (
          <NeoSphere key={`bot-${i}`} x={5 + i * 7.5} y={70} r={4} color={PARTICLE_COLOR_MAP['orange-300']} />
        ))}
      </g>

      {/* Transmembrane Protein Cluster (Dense) */}
      <g transform="translate(65, 50)">
         <NeoSphere x={0} y={-20} r={5} color={PARTICLE_COLOR_MAP['blue-400']} />
         <NeoSphere x={-5} y={-10} r={5} color={PARTICLE_COLOR_MAP['blue-500']} />
         <NeoSphere x={5} y={-10} r={5} color={PARTICLE_COLOR_MAP['blue-300']} />
         <NeoSphere x={0} y={0} r={6} color={PARTICLE_COLOR_MAP['blue-600']} />
         <NeoSphere x={-6} y={10} r={5} color={PARTICLE_COLOR_MAP['blue-400']} />
         <NeoSphere x={6} y={10} r={5} color={PARTICLE_COLOR_MAP['blue-500']} />
         <NeoSphere x={0} y={20} r={5} color={PARTICLE_COLOR_MAP['blue-300']} />
      </g>
    </svg>
  );
};

const RibosomeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    {/* mRNA Strand (Chain of nucleotides) */}
    <path d="M 5 65 Q 50 80 95 65" stroke="#fb923c" strokeWidth="2" fill="none" opacity="0.5" />
    {Array.from({length: 12}).map((_, i) => (
       <NeoSphere key={i} x={10 + i*7} y={65 + Math.sin(i)*5} r={2.5} color={PARTICLE_COLOR_MAP['orange-500']} />
    ))}

    {/* Small Subunit (Dense Cluster - Bottom) */}
    <g transform="translate(50, 70)">
        <NeoSphere x={-15} y={0} r={5} color={PARTICLE_COLOR_MAP['red-400']} />
        <NeoSphere x={0} y={5} r={6} color={PARTICLE_COLOR_MAP['red-500']} />
        <NeoSphere x={15} y={0} r={5} color={PARTICLE_COLOR_MAP['red-400']} />
        <NeoSphere x={-8} y={-5} r={4} color={PARTICLE_COLOR_MAP['red-300']} />
        <NeoSphere x={8} y={-5} r={4} color={PARTICLE_COLOR_MAP['red-300']} />
    </g>

    {/* Large Subunit (Dense Cluster - Top) */}
    <g transform="translate(50, 45)">
        <NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['red-600']} />
        <NeoSphere x={-12} y={-5} r={7} color={PARTICLE_COLOR_MAP['red-500']} />
        <NeoSphere x={12} y={-5} r={7} color={PARTICLE_COLOR_MAP['red-500']} />
        <NeoSphere x={-20} y={-15} r={6} color={PARTICLE_COLOR_MAP['red-400']} />
        <NeoSphere x={20} y={-15} r={6} color={PARTICLE_COLOR_MAP['red-400']} />
        <NeoSphere x={0} y={-15} r={7} color={PARTICLE_COLOR_MAP['red-500']} />
        <NeoSphere x={-10} y={-25} r={6} color={PARTICLE_COLOR_MAP['red-400']} />
        <NeoSphere x={10} y={-25} r={6} color={PARTICLE_COLOR_MAP['red-400']} />
    </g>

    {/* Emerging Polypeptide (Chain of Amino Acids) */}
    <g transform="translate(50, 20)">
        <line x1={0} y1={0} x2={10} y2={-15} stroke="#9333ea" strokeWidth="2" />
        <NeoSphere x={0} y={0} r={3} color={PARTICLE_COLOR_MAP['purple-500']} />
        <NeoSphere x={5} y={-8} r={3} color={PARTICLE_COLOR_MAP['purple-500']} />
        <NeoSphere x={10} y={-15} r={3} color={PARTICLE_COLOR_MAP['purple-500']} />
        <NeoSphere x={8} y={-23} r={3} color={PARTICLE_COLOR_MAP['purple-500']} />
    </g>
  </svg>
);

const MitochondrionIcon = () => {
  // Generate points for outer membrane oval
  const outerMembrane = Array.from({length: 30}).map((_, i) => {
      const angle = (i / 30) * Math.PI * 2;
      return { x: 50 + 40 * Math.cos(angle), y: 50 + 30 * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Outer Membrane Chain */}
        {outerMembrane.map((pos, i) => (
            <NeoSphere key={i} x={pos.x} y={pos.y} r={3} color={PARTICLE_COLOR_MAP['orange-700']} />
        ))}

        {/* Inner Membrane (Invaginations) - Dense Chains */}
        <g>
            {/* Cristae 1 */}
            {Array.from({length: 8}).map((_, i) => (
                <NeoSphere key={`c1-${i}`} x={20 + i*3} y={30 + i*2} r={2.5} color={PARTICLE_COLOR_MAP['orange-400']} />
            ))}
            {/* Cristae 2 */}
            {Array.from({length: 8}).map((_, i) => (
                <NeoSphere key={`c2-${i}`} x={80 - i*3} y={70 - i*2} r={2.5} color={PARTICLE_COLOR_MAP['orange-400']} />
            ))}
             {/* Cristae 3 */}
             {Array.from({length: 8}).map((_, i) => (
                <NeoSphere key={`c3-${i}`} x={30 + i*4} y={70 - i*1} r={2.5} color={PARTICLE_COLOR_MAP['orange-400']} />
            ))}
        </g>

        {/* Matrix "Soup" - Scattered Atoms */}
        <g opacity="0.7">
            <NeoSphere x={40} y={45} r={2} color="#fef3c7" />
            <NeoSphere x={60} y={55} r={2} color="#fef3c7" />
            <NeoSphere x={50} y={50} r={2} color="#fef3c7" />
            <NeoSphere x={35} y={60} r={2} color="#fef3c7" />
            <NeoSphere x={65} y={40} r={2} color="#fef3c7" />
        </g>

        {/* ATP Synthase Heads (Tiny Dots on Cristae) */}
        <NeoSphere x={25} y={38} r={1.5} color="white" />
        <NeoSphere x={75} y={62} r={1.5} color="white" />
    </svg>
  );
};

const NucleusIcon = () => {
  // Nuclear Envelope Ring
  const envelope = Array.from({length: 36}).map((_, i) => {
      const angle = (i / 36) * Math.PI * 2;
      // Skip points for pores
      if (i % 9 === 0) return null; 
      return { x: 50 + 45 * Math.cos(angle), y: 50 + 45 * Math.sin(angle) };
  }).filter(Boolean);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Envelope */}
        {envelope.map((pos, i) => (
            <NeoSphere key={i} x={pos.x} y={pos.y} r={3.5} color={PARTICLE_COLOR_MAP['indigo-600']} />
        ))}

        {/* Inner Chromatin (Tangled DNA Chains) */}
        <g opacity="0.8">
            {/* Strand 1 */}
            {Array.from({length: 15}).map((_, i) => (
                <NeoSphere key={`d1-${i}`} x={30 + i*3} y={30 + Math.sin(i)*10} r={2} color={PARTICLE_COLOR_MAP['blue-500']} />
            ))}
            {/* Strand 2 */}
            {Array.from({length: 15}).map((_, i) => (
                <NeoSphere key={`d2-${i}`} x={30 + i*3} y={50 + Math.cos(i)*10} r={2} color={PARTICLE_COLOR_MAP['blue-500']} />
            ))}
             {/* Strand 3 */}
             {Array.from({length: 15}).map((_, i) => (
                <NeoSphere key={`d3-${i}`} x={30 + i*3} y={70 + Math.sin(i)*10} r={2} color={PARTICLE_COLOR_MAP['blue-500']} />
            ))}
        </g>

        {/* Nucleolus (Dense Core) */}
        <g transform="translate(50, 50)">
            <NeoSphere x={0} y={0} r={6} color={PARTICLE_COLOR_MAP['indigo-900']} />
            <NeoSphere x={-5} y={-4} r={5} color={PARTICLE_COLOR_MAP['indigo-800']} />
            <NeoSphere x={5} y={-4} r={5} color={PARTICLE_COLOR_MAP['indigo-800']} />
            <NeoSphere x={-5} y={4} r={5} color={PARTICLE_COLOR_MAP['indigo-800']} />
            <NeoSphere x={5} y={4} r={5} color={PARTICLE_COLOR_MAP['indigo-800']} />
        </g>
    </svg>
  );
};

const DefaultIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill={hexColor} />
        </svg>
      );

const PARTICLE_ICON_MAP = {
  [PARTICLE_TYPES.UP_QUARK]: UpQuarkIcon,
  [PARTICLE_TYPES.DOWN_QUARK]: DownQuarkIcon,
  [PARTICLE_TYPES.CHARM_QUARK]: CharmQuarkIcon,
  [PARTICLE_TYPES.STRANGE_QUARK]: StrangeQuarkIcon,
  [PARTICLE_TYPES.TOP_QUARK]: TopQuarkIcon,
  [PARTICLE_TYPES.BOTTOM_QUARK]: BottomQuarkIcon,
  [PARTICLE_TYPES.ANTI_UP_QUARK]: AntiUpQuarkIcon,
  [PARTICLE_TYPES.ANTI_DOWN_QUARK]: AntiDownQuarkIcon,
  [PARTICLE_TYPES.ELECTRON]: ElectronIcon,
  [PARTICLE_TYPES.ANTI_CHARM_QUARK]: AntiCharmQuarkIcon,
  [PARTICLE_TYPES.ELECTRON_NEUTRINO]: ElectronNeutrinoIcon,
  [PARTICLE_TYPES.ELECTRON_ANTINEUTRINO]: ElectronAntineutrinoIcon,
  [PARTICLE_TYPES.PHOTON]: PhotonIcon,
  [PARTICLE_TYPES.GLUON]: GluonIcon,
  [PARTICLE_TYPES.W_BOSON]: WBosonIcon,
  [PARTICLE_TYPES.Z_BOSON]: ZBosonIcon,
  [PARTICLE_TYPES.PROTON]: ProtonIcon,
  [PARTICLE_TYPES.NEUTRON]: NeutronIcon,
  [PARTICLE_TYPES.DECAYING_NEUTRON]: DecayingNeutronIcon,
  [PARTICLE_TYPES.PION_PLUS]: PionPlusIcon,
  [PARTICLE_TYPES.EXCITED_ELECTRON]: ExcitedElectronIcon,
  [PARTICLE_TYPES.LAMBDA_BARYON]: LambdaBaryonIcon,
  [PARTICLE_TYPES.J_PSI_MESON]: JPsiMesonIcon,
  [PARTICLE_TYPES.CARBON_DIOXIDE]: CarbonDioxideIcon,
  [PARTICLE_TYPES.SODIUM_CHLORIDE]: SodiumChlorideIcon,
  [PARTICLE_TYPES.HYDROCHLORIC_ACID]: HydrochloricAcidIcon,
  [PARTICLE_TYPES.CARBON_MONOXIDE]: CarbonMonoxideIcon,
  [PARTICLE_TYPES.HYDROGEN_SULFIDE]: HydrogenSulfideIcon,
  [PARTICLE_TYPES.HYDROGEN_PEROXIDE]: HydrogenPeroxideIcon,
  [PARTICLE_TYPES.WATER]: WaterIcon,
  [PARTICLE_TYPES.METHANE]: MethaneIcon,
  [PARTICLE_TYPES.AMMONIA]: AmmoniaIcon,
  [PARTICLE_TYPES.OZONE]: OzoneIcon,
  [PARTICLE_TYPES.NITROUS_OXIDE]: NitrousOxideIcon,
  [PARTICLE_TYPES.SILICON_DIOXIDE]: SiliconDioxideIcon,
  [PARTICLE_TYPES.GLYCINE]: GlycineIcon,
  [PARTICLE_TYPES.GLYCYLGLYCINE]: GlycylglycineIcon,
  [PARTICLE_TYPES.ALANINE]: AlanineIcon,
  [PARTICLE_TYPES.GLYCYL_ALANINE]: GlycylAlanineIcon,
  [PARTICLE_TYPES.VALINE]: ValineIcon,
  [PARTICLE_TYPES.LEUCINE]: LeucineIcon,
  [PARTICLE_TYPES.SERINE]: SerineIcon,
  [PARTICLE_TYPES.ETHANOL]: EthanolIcon,
  [PARTICLE_TYPES.SULFURIC_ACID]: SulfuricAcidIcon,
  [PARTICLE_TYPES.GLUCOSE]: GlucoseIcon,
  [PARTICLE_TYPES.ADENINE]: AdenineIcon,
  [PARTICLE_TYPES.GUANINE]: GuanineIcon,
  [PARTICLE_TYPES.CYTOSINE]: CytosineIcon,
  [PARTICLE_TYPES.THYMINE]: ThymineIcon,
  [PARTICLE_TYPES.NITROGEN_GAS]: NitrogenGasIcon,
  [PARTICLE_TYPES.OXYGEN_GAS]: OxygenGasIcon,
  [PARTICLE_TYPES.ACETIC_ACID]: AceticAcidIcon,
  [PARTICLE_TYPES.URACIL]: UracilIcon,
  [PARTICLE_TYPES.DEOXYRIBOSE]: DeoxyriboseIcon,
  [PARTICLE_TYPES.RIBOSE]: RiboseIcon,
  [PARTICLE_TYPES.PHOSPHATE]: PhosphateIcon,
  [PARTICLE_TYPES.NUCLEOTIDE_A]: NucleotideAIcon,
  [PARTICLE_TYPES.NUCLEOTIDE_T]: NucleotideTIcon,
  [PARTICLE_TYPES.NUCLEOTIDE_G]: NucleotideGIcon,
  [PARTICLE_TYPES.NUCLEOTIDE_C]: NucleotideCIcon,
  [PARTICLE_TYPES.NUCLEOTIDE_U]: NucleotideUIcon,
  [PARTICLE_TYPES.ATP]: ATPIcon,
  [PARTICLE_TYPES.GLYCEROL]: GlycerolIcon,
  [PARTICLE_TYPES.FATTY_ACID]: FattyAcidIcon,
  [PARTICLE_TYPES.LIPID]: LipidIcon,
  [PARTICLE_TYPES.DNA]: DNAIcon,
  [PARTICLE_TYPES.RNA]: RNAIcon,
  [PARTICLE_TYPES.MEMBRANE]: MembraneIcon,
  [PARTICLE_TYPES.RIBOSOME]: RibosomeIcon,
  [PARTICLE_TYPES.MITOCHONDRION]: MitochondrionIcon,
  [PARTICLE_TYPES.NUCLEUS]: NucleusIcon,
  'ayoub': AyoubIcon, // Directly using the string for the test molecule
  [PARTICLE_TYPES.HYDROGEN]: HydrogenIcon,
  [PARTICLE_TYPES.DEUTERIUM]: DeuteriumIcon,
  [PARTICLE_TYPES.TRITIUM]: TritiumIcon,
  [PARTICLE_TYPES.HELIUM]: HeliumIcon,
  [PARTICLE_TYPES.LITHIUM]: LithiumIcon,
  [PARTICLE_TYPES.BERYLLIUM]: BerylliumIcon,
  [PARTICLE_TYPES.BORON]: BoronIcon,
  [PARTICLE_TYPES.CARBON]: CarbonIcon,
  [PARTICLE_TYPES.NITROGEN]: NitrogenIcon,
  [PARTICLE_TYPES.OXYGEN]: OxygenIcon,
  [PARTICLE_TYPES.FLUORINE]: FluorineIcon,
  [PARTICLE_TYPES.NEON]: NeonIcon,
  [PARTICLE_TYPES.SODIUM]: SodiumIcon,
  [PARTICLE_TYPES.MAGNESIUM]: MagnesiumIcon,
  [PARTICLE_TYPES.ALUMINIUM]: AluminiumIcon,
  [PARTICLE_TYPES.SILICON]: SiliconIcon,
  [PARTICLE_TYPES.PHOSPHORUS]: PhosphorusIcon,
  [PARTICLE_TYPES.SULFUR]: SulfurIcon,
  [PARTICLE_TYPES.CHLORINE]: ChlorineIcon,
  [PARTICLE_TYPES.ARGON]: ArgonIcon,
  [PARTICLE_TYPES.POTASSIUM]: PotassiumIcon,
  [PARTICLE_TYPES.CALCIUM]: CalciumIcon,
  [PARTICLE_TYPES.SCANDIUM]: ScandiumIcon,
  [PARTICLE_TYPES.TITANIUM]: TitaniumIcon,
  [PARTICLE_TYPES.VANADIUM]: VanadiumIcon,
  [PARTICLE_TYPES.CHROMIUM]: ChromiumIcon,
  [PARTICLE_TYPES.MANGANESE]: ManganeseIcon,
  [PARTICLE_TYPES.IRON]: IronIcon,
  [PARTICLE_TYPES.COBALT]: CobaltIcon,
  [PARTICLE_TYPES.NICKEL]: NickelIcon,
  [PARTICLE_TYPES.COPPER]: CopperIcon,
  [PARTICLE_TYPES.ZINC]: ZincIcon,
  [PARTICLE_TYPES.GALLIUM]: GalliumIcon,
  [PARTICLE_TYPES.GERMANIUM]: GermaniumIcon,
  [PARTICLE_TYPES.ARSENIC]: ArsenicIcon,
  [PARTICLE_TYPES.SELENIUM]: SeleniumIcon,
  [PARTICLE_TYPES.BROMINE]: BromineIcon,
  [PARTICLE_TYPES.KRYPTON]: KryptonIcon,
};

const ParticleIcon = ({ type, color = 'bg-gray-400', isCompound = false }) => {
  const safeColor = typeof color === 'string' ? color : 'bg-gray-400';
  const token = safeColor.replace('bg-', '');
  const hexColor = PARTICLE_COLOR_MAP[token] || '#9ca3af';

  const IconComponent = PARTICLE_ICON_MAP[type] || DefaultIcon;

  return <IconComponent hexColor={hexColor} isCompound={isCompound} />;
};

export default ParticleIcon;
