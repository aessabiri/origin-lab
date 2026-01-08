import React from 'react';
import { PARTICLE_TYPES, PARTICLE_COLOR_MAP, PARTICLE_COLORS } from '../constants/particles.js';

// --- Helper Components & Functions ---

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

const ElectronIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <filter id="cloud-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
      </filter>
      <radialGradient id="electron-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={hexColor} stopOpacity="0.8" />
        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Quantum Foam */}
    <circle cx="50" cy="50" r="40" fill="url(#electron-glow)" filter="url(#cloud-blur)" style={{ animation: 'turbulence 4s infinite ease-in-out' }} />
    {/* Subtler Flickering dots */}
    <circle cx="45" cy="48" r="1.5" fill="white" style={{ animation: 'electron-particle 1.2s infinite ease-in-out' }} />
    <circle cx="58" cy="58" r="1" fill="white" style={{ animation: 'electron-particle 0.8s infinite ease-in-out 0.3s' }} />
    <circle cx="52" cy="40" r="1.5" fill="white" style={{ animation: 'electron-particle 1.5s infinite ease-in-out 0.6s' }} />
  </svg>
);

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

const CarbonDioxideIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('co2-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#co2-grad)" opacity="0.4" />
          <circle cx="50" cy="50" r="15" fill={PARTICLE_COLOR_MAP['gray-800']} />
          <circle cx="20" cy="50" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
          <circle cx="80" cy="50" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
        </svg>
      );

const SodiumChlorideIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('nacl-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#nacl-grad)" opacity="0.4" />
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="white" strokeWidth="3" />
          <circle cx="35" cy="35" r="8" fill={PARTICLE_COLOR_MAP['violet-500']} />
          <circle cx="65" cy="35" r="8" fill={PARTICLE_COLOR_MAP['green-400']} />
          <circle cx="35" cy="65" r="8" fill={PARTICLE_COLOR_MAP['green-400']} />
          <circle cx="65" cy="65" r="8" fill={PARTICLE_COLOR_MAP['violet-500']} />
        </svg>
      );

const HydrochloricAcidIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('hcl-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#hcl-grad)" opacity="0.4" />
          <circle cx="35" cy="50" r="10" fill={PARTICLE_COLOR_MAP['teal-500']} />
          <circle cx="65" cy="50" r="20" fill={PARTICLE_COLOR_MAP['green-400']} />
        </svg>
      );

const CarbonMonoxideIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('co-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#co-grad)" opacity="0.4" />
          <circle cx="38" cy="50" r="18" fill={PARTICLE_COLOR_MAP['gray-800']} />
          <circle cx="68" cy="50" r="15" fill={PARTICLE_COLOR_MAP['red-600']} />
        </svg>
      );

const HydrogenSulfideIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('h2s-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#h2s-grad)" opacity="0.4" />
          <circle cx="50" cy="40" r="22" fill={PARTICLE_COLOR_MAP['yellow-500']} />
          <circle cx="30" cy="70" r="12" fill={PARTICLE_COLOR_MAP['teal-500']} />
          <circle cx="70" cy="70" r="12" fill={PARTICLE_COLOR_MAP['teal-500']} />
        </svg>
      );

const HydrogenPeroxideIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('h2o2-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#h2o2-grad)" opacity="0.4" />
          <circle cx="40" cy="45" r="15" fill={PARTICLE_COLOR_MAP['red-600']} />
          <circle cx="60" cy="55" r="15" fill={PARTICLE_COLOR_MAP['red-600']} />
          <circle cx="25" cy="60" r="10" fill={PARTICLE_COLOR_MAP['teal-500']} />
          <circle cx="75" cy="40" r="10" fill={PARTICLE_COLOR_MAP['teal-500']} />
        </svg>
      );

const PionMinusIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('pion-minus-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#pion-minus-grad)" />
          <MesonComposition quarkColor={PARTICLE_COLOR_MAP['indigo-400']} antiquarkColor={PARTICLE_COLOR_MAP['yellow-600']} />
        </svg>
      );

const WaterIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="water-grad-linear" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor={hexColor} />
            </linearGradient>
          </defs>
          <path d="M50 10 C 20 40, 20 70, 50 90 C 80 70, 80 40, 50 10 Z" fill="url(#water-grad-linear)" />
          <path d="M40 30 C 45 20, 55 20, 60 30" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
        </svg>
      );

const MethaneIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('methane-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#methane-grad)" opacity="0.4" />
          <circle cx="50" cy="50" r="18" fill={PARTICLE_COLOR_MAP['gray-800']} />
          <circle cx="50" cy="20" r="10" fill={PARTICLE_COLOR_MAP['teal-500']} />
          <circle cx="25" cy="65" r="10" fill={PARTICLE_COLOR_MAP['teal-500']} />
          <circle cx="75" cy="65" r="10" fill={PARTICLE_COLOR_MAP['teal-500']} />
        </svg>
      );

const AmmoniaIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('ammonia-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#ammonia-grad)" opacity="0.4" />
          <circle cx="50" cy="40" r="20" fill={PARTICLE_COLOR_MAP['sky-500']} />
          <circle cx="30" cy="70" r="12" fill={PARTICLE_COLOR_MAP['teal-500']} />
          <circle cx="70" cy="70" r="12" fill={PARTICLE_COLOR_MAP['teal-500']} />
          <circle cx="50" cy="75" r="12" fill={PARTICLE_COLOR_MAP['teal-500']} />
        </svg>
      );

const OzoneIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('ozone-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#ozone-grad)" opacity="0.4" />
          <circle cx="50" cy="35" r="15" fill={PARTICLE_COLOR_MAP['red-600']} />
          <circle cx="30" cy="65" r="15" fill={PARTICLE_COLOR_MAP['red-600']} />
          <circle cx="70" cy="65" r="15" fill={PARTICLE_COLOR_MAP['red-600']} />
        </svg>
      );

const NitrousOxideIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('n2o-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#n2o-grad)" opacity="0.4" />
          <circle cx="30" cy="50" r="15" fill={PARTICLE_COLOR_MAP['sky-500']} />
          <circle cx="55" cy="50" r="15" fill={PARTICLE_COLOR_MAP['sky-500']} />
          <circle cx="80" cy="50" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
        </svg>
      );

const SiliconDioxideIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('sio2-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#sio2-grad)" opacity="0.4" />
          <circle cx="50" cy="50" r="18" fill={PARTICLE_COLOR_MAP['stone-500']} />
          <circle cx="20" cy="50" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
          <circle cx="80" cy="50" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
        </svg>
      );

const HydrogenFluorideIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('hf-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#hf-grad)" opacity="0.4" />
          <circle cx="35" cy="50" r="10" fill={PARTICLE_COLOR_MAP['teal-500']} />
          <circle cx="65" cy="50" r="20" fill={PARTICLE_COLOR_MAP['emerald-500']} />
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

const AminoAcidIcon = ({ hexColor, rGroup, name }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Backbone */}
    <circle cx="25" cy="50" r="10" fill={PARTICLE_COLOR_MAP['sky-500']} />
    <text x="25" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">N</text>

    <circle cx="50" cy="50" r="10" fill={PARTICLE_COLOR_MAP['gray-800']} />
    <text x="50" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Cα</text>

    <circle cx="75" cy="50" r="10" fill={PARTICLE_COLOR_MAP['gray-800']} />
    <text x="75" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>

    <line x1="35" y1="50" x2="40" y2="50" stroke="white" strokeWidth="2" />
    <line x1="60" y1="50" x2="65" y2="50" stroke="white" strokeWidth="2" />

    {/* R-Group */}
    <line x1="50" y1="40" x2="50" y2="30" stroke="white" strokeWidth="2" />
    <circle cx="50" cy="20" r="10" fill="#a8a29e" />
    <text x="50" y="24" textAnchor="middle" fill="black" fontSize="12" fontWeight="bold">{rGroup}</text>

    <text x="50" y="85" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{name}</text>
  </svg>
);

const GlycineIcon = ({ hexColor }) => (
  // C2 H5 N1 O2 - Simplest amino acid
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50 50)">
      {/* Central Carbon */}
      <circle cx="0" cy="0" r="12" fill="#4A5568" />
      <text x="0" y="5" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">C</text>
      {/* Amino Group (N) */}
      <circle cx="-25" cy="-15" r="10" fill="#3B82F6" />
      <text x="-25" y="-10" fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">N</text>
      {/* Carboxyl Group (C, O, O) */}
      <circle cx="25" cy="0" r="10" fill="#4A5568" />
      <circle cx="40" cy="-15" r="8" fill="#EF4444" />
      <circle cx="40" cy="15" r="8" fill="#EF4444" />
      {/* Hydrogen side chain */}
      <circle cx="0" cy="25" r="6" fill="#E5E7EB" />
    </g>
  </svg>
);

const AlanineIcon = ({ hexColor }) => (
  // C3 H7 N1 O2 - Side chain: CH3
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50 50)">
      {/* Central Carbon */}
      <circle cx="0" cy="0" r="12" fill="#4A5568" />
      <text x="0" y="5" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">C</text>
      {/* Amino Group (N) */}
      <circle cx="-25" cy="-15" r="10" fill="#3B82F6" />
      <text x="-25" y="-10" fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">N</text>
      {/* Carboxyl Group (C, O, O) */}
      <circle cx="25" cy="0" r="10" fill="#4A5568" />
      <circle cx="40" cy="-15" r="8" fill="#EF4444" />
      <circle cx="40" cy="15" r="8" fill="#EF4444" />
      {/* CH3 side chain */}
      <circle cx="0" cy="28" r="10" fill="#4A5568" />
      <text x="0" y="33" fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">C</text>
    </g>
  </svg>
);

const SerineIcon = ({ hexColor }) => (
  // C3 H7 N1 O3 - Side chain: CH2OH
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50 50)">
      <circle cx="0" cy="0" r="12" fill="#4A5568" /><text x="0" y="5" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">C</text>
      <circle cx="-25" cy="-15" r="10" fill="#3B82F6" /><text x="-25" y="-10" fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">N</text>
      <circle cx="25" cy="0" r="10" fill="#4A5568" />
      <circle cx="40" cy="-15" r="8" fill="#EF4444" />
      <circle cx="40" cy="15" r="8" fill="#EF4444" />
      {/* CH2OH side chain */}
      <circle cx="0" cy="28" r="10" fill="#4A5568" />
      <circle cx="0" cy="45" r="8" fill="#EF4444" /><text x="0" y="50" fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">O</text>
    </g>
  </svg>
);

const ValineIcon = ({ hexColor }) => (
  // C5 H11 N1 O2 - Branched side chain
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50 50)">
      <circle cx="0" cy="0" r="12" fill="#4A5568" /><text x="0" y="5" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">C</text>
      <circle cx="-25" cy="-15" r="10" fill="#3B82F6" /><text x="-25" y="-10" fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">N</text>
      <circle cx="25" cy="0" r="10" fill="#4A5568" />
      <circle cx="40" cy="-15" r="8" fill="#EF4444" />
      <circle cx="40" cy="15" r="8" fill="#EF4444" />
      {/* Branched side chain */}
      <circle cx="0" cy="25" r="9" fill="#4A5568" />
      <circle cx="-15" cy="40" r="9" fill="#4A5568" />
      <circle cx="15" cy="40" r="9" fill="#4A5568" />
    </g>
  </svg>
);

const LeucineIcon = ({ hexColor }) => (
  // C6 H13 N1 O2 - Larger branched side chain
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50 50)">
      <circle cx="0" cy="0" r="12" fill="#4A5568" /><text x="0" y="5" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">C</text>
      <circle cx="-25" cy="-15" r="10" fill="#3B82F6" /><text x="-25" y="-10" fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">N</text>
      <circle cx="25" cy="0" r="10" fill="#4A5568" />
      <circle cx="40" cy="-15" r="8" fill="#EF4444" />
      <circle cx="40" cy="15" r="8" fill="#EF4444" />
      {/* Larger branched side chain */}
      <circle cx="0" cy="25" r="9" fill="#4A5568" />
      <circle cx="0" cy="42" r="9" fill="#4A5568" />
      <circle cx="-15" cy="57" r="9" fill="#4A5568" />
      <circle cx="15" cy="57" r="9" fill="#4A5568" />
    </g>
  </svg>
);

const DipeptideIcon = ({ Icon1, Icon2 }) => (
  <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    {/* Peptide bond line */}
    {/* Peptide bond */}
    <line x1="50" y1="50" x2="70" y2="50" stroke="#ec4899" strokeWidth="4" />
    <line x1="50" y1="50" x2="70" y2="50" stroke="white" strokeWidth="2" strokeDasharray="2 2" />
    
    {/* First Amino Acid Icon */}
    <g transform="scale(0.6) translate(-15, 25)">
      <Icon1 />
    </g>
    {/* Second Amino Acid Icon */}
    <g transform="scale(0.6) translate(85, 25)">
      <Icon2 />
    </g>
  </svg>
);

const GlycylglycineIcon = () => <DipeptideIcon Icon1={GlycineIcon} Icon2={GlycineIcon} />;
const GlycylAlanineIcon = () => <DipeptideIcon Icon1={GlycineIcon} Icon2={AlanineIcon} />;

const AyoubIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>{radialGradient('ayoub-grad', hexColor)}</defs>
    <circle cx="50" cy="50" r="45" fill="url(#ayoub-grad)" />
    <path d="M30 70 L50 30 L70 70 M38 55 H62" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AdenineIcon = ({ hexColor }) => ( // Purine (double ring)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <polygon points="30,30 70,30 85,50 70,70 30,70 15,50" fill={hexColor} stroke="white" strokeWidth="3" />
    <polygon points="30,30 30,70 50,85 50,15" fill={hexColor} stroke="white" strokeWidth="3" />
  </svg>
);

const GuanineIcon = ({ hexColor }) => ( // Purine (double ring)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <polygon points="30,30 70,30 85,50 70,70 30,70 15,50" fill={hexColor} stroke="white" strokeWidth="3" />
    <polygon points="30,30 30,70 50,85 50,15" fill={hexColor} stroke="white" strokeWidth="3" opacity="0.7" />
  </svg>
);

const CytosineIcon = ({ hexColor }) => ( // Pyrimidine (single ring)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <polygon points="30,20 70,20 85,50 70,80 30,80 15,50" fill={hexColor} stroke="white" strokeWidth="3" />
  </svg>
);

const ThymineIcon = ({ hexColor }) => ( // Pyrimidine (single ring)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <polygon points="30,20 70,20 85,50 70,80 30,80 15,50" fill={hexColor} stroke="white" strokeWidth="3" opacity="0.7" />
  </svg>
);

const NitrogenGasIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>{radialGradient('n2-grad', hexColor, 0.4)}</defs>
    <circle cx="50" cy="50" r="45" fill="url(#n2-grad)" opacity="0.4" />
    <circle cx="35" cy="50" r="15" fill={PARTICLE_COLOR_MAP['sky-500']} />
    <circle cx="65" cy="50" r="15" fill={PARTICLE_COLOR_MAP['sky-500']} />
  </svg>
);

const OxygenGasIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>{radialGradient('o2-grad', hexColor, 0.4)}</defs>
    <circle cx="50" cy="50" r="45" fill="url(#o2-grad)" opacity="0.4" />
    <circle cx="35" cy="50" r="15" fill={PARTICLE_COLOR_MAP['red-600']} />
    <circle cx="65" cy="50" r="15" fill={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const AceticAcidIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <polygon points="20,40 40,20 80,60 60,80" fill={hexColor} stroke="white" strokeWidth="3" />
  </svg>
);

const EthanolIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>{radialGradient('ethanol-grad', hexColor, 0.4)}</defs>
    <circle cx="50" cy="50" r="45" fill="url(#ethanol-grad)" opacity="0.4" />
    {/* C-C-O backbone */}
    <circle cx="30" cy="50" r="12" fill={PARTICLE_COLOR_MAP['gray-800']} />
    <circle cx="55" cy="50" r="12" fill={PARTICLE_COLOR_MAP['gray-800']} />
    <circle cx="80" cy="50" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
    <line x1="42" y1="50" x2="43" y2="50" stroke="white" strokeWidth="2" />
    <line x1="67" y1="50" x2="68" y2="50" stroke="white" strokeWidth="2" />
  </svg>
);

const SulfuricAcidIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>{radialGradient('h2so4-grad', hexColor, 0.4)}</defs>
    <circle cx="50" cy="50" r="45" fill="url(#h2so4-grad)" opacity="0.4" />
    <circle cx="50" cy="50" r="20" fill={PARTICLE_COLOR_MAP['yellow-500']} />
    <circle cx="50" cy="20" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
    <circle cx="50" cy="80" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
    <circle cx="20" cy="50" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
    <circle cx="80" cy="50" r="12" fill={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

const GlucoseIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <g transform="rotate(-30 50 50) scale(0.9)">
      <polygon points="50,15 85,37.5 85,82.5 50,105 15,82.5 15,37.5" fill={hexColor} stroke="white" strokeWidth="3" />
      <circle cx="50" cy="22" r="6" fill={PARTICLE_COLOR_MAP['red-600']} stroke="white" strokeWidth="1.5" />
    </g>
  </svg>
);

const DNAIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M30 10 C 70 30, 30 70, 70 90" stroke={PARTICLE_COLOR_MAP['blue-400']} strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M70 10 C 30 30, 70 70, 30 90" stroke={PARTICLE_COLOR_MAP['purple-600']} strokeWidth="8" fill="none" strokeLinecap="round" />
  </svg>
);

const RNAIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M30 10 C 70 30, 30 70, 70 90" stroke={PARTICLE_COLOR_MAP['orange-500']} strokeWidth="8" fill="none" strokeLinecap="round" />
  </svg>
);

const UracilIcon = ({ hexColor }) => ( // Pyrimidine (single ring)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <polygon points="30,20 70,20 85,50 70,80 30,80 15,50" fill={hexColor} stroke="white" strokeWidth="3" />
    <circle cx="70" cy="20" r="8" fill={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);



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
  [PARTICLE_TYPES.DNA]: DNAIcon,
  [PARTICLE_TYPES.RNA]: RNAIcon,
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
  const token = color.replace('bg-', '');
  const hexColor = PARTICLE_COLOR_MAP[token] || '#9ca3af';

  const IconComponent = PARTICLE_ICON_MAP[type] || DefaultIcon;

  return <IconComponent hexColor={hexColor} isCompound={isCompound} />;
};

export default ParticleIcon;
