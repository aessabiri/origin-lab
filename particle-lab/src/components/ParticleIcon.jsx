import React from 'react';
import { PARTICLE_TYPES, PARTICLE_COLOR_MAP, PARTICLE_COLORS } from '../constants/particles.js';

// --- Helper Components & Functions ---

const radialGradient = (id, c, opacity = 0.8) => (
    <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity={opacity} />
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
    if (electronCount > 18) shells.push({ radius: 70, count: Math.min(electronCount - 18, 18) });

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

// --- Individual Particle Icon Components ---

const UpQuarkIcon = ({ hexColor }) => (
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

const DownQuarkIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad2', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad2)" />
          <polygon points="25,35 75,35 50,80" fill="white" />
        </svg>
      );

const CharmQuarkIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad3', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad3)" />
          <path d="M50,25 C70,25 70,45 50,45 C30,45 30,25 50,25 M50,55 C70,55 70,75 50,75 C30,75 30,55 50,55" fill="white" />
        </svg>
      );

const StrangeQuarkIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad4', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad4)" />
          <path d="M35,30 C65,30 35,70 65,70" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
      );

const TopQuarkIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad5', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad5)" />
          <path d="M25,35 H75 M50,35 V75" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
      );

const BottomQuarkIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad6', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad6)" />
          <path d="M25,35 C25,65 75,65 75,35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>
      );

const AntiUpQuarkIcon = ({ hexColor }) => (
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

const AntiDownQuarkIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad-anti-down', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad-anti-down)" />
          <polygon points="25,65 75,65 50,20" fill="white" />
        </svg>
      );

const ElectronIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad7', hexColor)}</defs>
          <g style={{ animation: 'spin 4s linear infinite' }}>
            <ellipse cx="50" cy="50" rx="40" ry="20" stroke={hexColor} strokeWidth="4" fill="none" opacity="0.7" />
            <circle cx="90" cy="50" r="8" fill={PARTICLE_COLOR_MAP['blue-600']} />
          </g>
          <circle cx="50" cy="50" r="10" fill="url(#grad7)" />
        </svg>
      );

const AntiCharmQuarkIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('grad-anti-charm', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#grad-anti-charm)" />
          <path d="M50,25 C30,25 30,45 50,45 C70,45 70,25 50,25 M50,55 C30,55 30,75 50,75 C70,75 70,55 50,55" fill="white" transform="rotate(180 50 50)" />
        </svg>
      );

const ElectronNeutrinoIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" strokeWidth="4">
          <path d="M 10 50 C 30 20, 70 20, 90 50 S 70 80, 10 50" stroke={hexColor} />
        </svg>
      );

const ElectronAntineutrinoIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" strokeWidth="4">
          <path d="M 10 50 C 30 80, 70 80, 90 50 S 70 20, 10 50" stroke={hexColor} />
        </svg>
      );

const PhotonIcon = ({ hexColor }) => (
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

const GluonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <path d="M 20 50 C 20 30, 30 30, 30 50 S 40 70, 40 50 S 50 30, 50 50 S 60 70, 60 50 S 70 30, 70 50 S 80 70, 80 50"
            stroke={hexColor} strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

const WBosonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,10 L90,50 L50,90 L10,50 Z" fill={hexColor} />
        </svg>
      );

const ZBosonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,10 L90,50 L50,90 L10,50 Z" fill={hexColor} />
        </svg>
      );

const ProtonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('proton-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#proton-grad)" />
          <QuarkComposition up={2} down={1} />
        </svg>
      );

const NeutronIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>{radialGradient('neutron-grad', hexColor)}</defs>
          <circle cx="50" cy="50" r="45" fill="url(#neutron-grad)" />
          <QuarkComposition up={1} down={2} />
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
          <defs>{radialGradient('water-grad', hexColor, 0.5)}</defs>
          <path d="M50 10 C 20 40, 20 70, 50 90 C 80 70, 80 40, 50 10 Z" fill="url(#water-grad)" />
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

const HydrogenIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={1} hexColor={hexColor} />
          <Nucleus protonCount={1} neutronCount={0} />
        </svg>
      );

const DeuteriumIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={1} hexColor={hexColor} />
          <Nucleus protonCount={1} neutronCount={1} />
        </svg>
      );

const TritiumIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={1} hexColor={hexColor} />
          <Nucleus protonCount={1} neutronCount={2} />
        </svg>
      );

const HeliumIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={2} hexColor={hexColor} />
          <Nucleus protonCount={2} neutronCount={2} />
        </svg>
      );

const LithiumIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={3} hexColor={hexColor} />
          <Nucleus protonCount={3} neutronCount={4} />
        </svg>
      );
const BerylliumIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={4} hexColor={hexColor} />
          <Nucleus protonCount={4} neutronCount={5} />
        </svg>
      );
const BoronIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={5} hexColor={hexColor} />
          <Nucleus protonCount={5} neutronCount={6} />
        </svg>
      );
const CarbonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={6} hexColor={hexColor} />
          <Nucleus protonCount={6} neutronCount={6} />
        </svg>
      );
const NitrogenIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={7} hexColor={hexColor} />
          <Nucleus protonCount={7} neutronCount={7} />
        </svg>
      );
const OxygenIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={8} hexColor={hexColor} />
          <Nucleus protonCount={8} neutronCount={8} />
        </svg>
      );
const FluorineIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={9} hexColor={hexColor} />
          <Nucleus protonCount={9} neutronCount={10} />
        </svg>
      );
const NeonIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={10} hexColor={hexColor} />
          <Nucleus protonCount={10} neutronCount={10} />
        </svg>
      );
const SodiumIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={11} hexColor={hexColor} />
          <Nucleus protonCount={11} neutronCount={12} />
        </svg>
      );
const MagnesiumIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={12} hexColor={hexColor} />
          <Nucleus protonCount={12} neutronCount={12} />
        </svg>
      );
const AluminiumIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={13} hexColor={hexColor} />
          <Nucleus protonCount={13} neutronCount={14} />
        </svg>
      );
const SiliconIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={14} hexColor={hexColor} />
          <Nucleus protonCount={14} neutronCount={14} />
        </svg>
      );
const PhosphorusIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={15} hexColor={hexColor} />
    <Nucleus protonCount={15} neutronCount={16} />
  </svg>
);
const SulfurIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={16} hexColor={hexColor} />
    <Nucleus protonCount={16} neutronCount={16} />
  </svg>
);
const ChlorineIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={17} hexColor={hexColor} />
    <Nucleus protonCount={17} neutronCount={18} />
  </svg>
);
const ArgonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={18} hexColor={hexColor} />
    <Nucleus protonCount={18} neutronCount={22} />
  </svg>
);
const PotassiumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={19} hexColor={hexColor} />
    <Nucleus protonCount={19} neutronCount={20} />
  </svg>
);
const CalciumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={20} hexColor={hexColor} />
    <Nucleus protonCount={20} neutronCount={20} />
  </svg>
);
const ScandiumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={21} hexColor={hexColor} />
    <Nucleus protonCount={21} neutronCount={24} />
  </svg>
);
const TitaniumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={22} hexColor={hexColor} />
    <Nucleus protonCount={22} neutronCount={26} />
  </svg>
);
const VanadiumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={23} hexColor={hexColor} />
    <Nucleus protonCount={23} neutronCount={28} />
  </svg>
);
const ChromiumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={24} hexColor={hexColor} />
    <Nucleus protonCount={24} neutronCount={28} />
  </svg>
);
const ManganeseIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={25} hexColor={hexColor} />
    <Nucleus protonCount={25} neutronCount={30} />
  </svg>
);
const IronIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={26} hexColor={hexColor} />
    <Nucleus protonCount={26} neutronCount={30} />
  </svg>
);
const CobaltIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={27} hexColor={hexColor} />
    <Nucleus protonCount={27} neutronCount={32} />
  </svg>
);
const NickelIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={28} hexColor={hexColor} />
    <Nucleus protonCount={28} neutronCount={31} />
  </svg>
);
const CopperIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={29} hexColor={hexColor} />
    <Nucleus protonCount={29} neutronCount={34} />
  </svg>
);
const ZincIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={30} hexColor={hexColor} />
    <Nucleus protonCount={30} neutronCount={35} />
  </svg>
);
const GalliumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={31} hexColor={hexColor} />
    <Nucleus protonCount={31} neutronCount={39} />
  </svg>
);
const GermaniumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={32} hexColor={hexColor} />
    <Nucleus protonCount={32} neutronCount={41} />
  </svg>
);
const ArsenicIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={33} hexColor={hexColor} />
    <Nucleus protonCount={33} neutronCount={42} />
  </svg>
);
const SeleniumIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={34} hexColor={hexColor} />
    <Nucleus protonCount={34} neutronCount={45} />
  </svg>
);
const BromineIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={35} hexColor={hexColor} />
    <Nucleus protonCount={35} neutronCount={45} />
  </svg>
);
const KryptonIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <ElectronShells electronCount={36} hexColor={hexColor} />
    <Nucleus protonCount={36} neutronCount={48} />
  </svg>
);

const AminoAcidIcon = ({ hexColor, rGroup, name }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>{radialGradient('amino-acid-grad', hexColor, 0.4)}</defs>
    <circle cx="50" cy="50" r="48" fill="url(#amino-acid-grad)" stroke={hexColor} strokeWidth="2" />

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

const GlycineIcon = ({ hexColor }) => <AminoAcidIcon hexColor={hexColor} rGroup="H" name="Glycine" />;
const AlanineIcon = ({ hexColor }) => <AminoAcidIcon hexColor={hexColor} rGroup="CH₃" name="Alanine" />;
const ValineIcon = ({ hexColor }) => <AminoAcidIcon hexColor={hexColor} rGroup="Val" name="Valine" />;
const LeucineIcon = ({ hexColor }) => <AminoAcidIcon hexColor={hexColor} rGroup="Leu" name="Leucine" />;
const SerineIcon = ({ hexColor }) => <AminoAcidIcon hexColor={hexColor} rGroup="Ser" name="Serine" />;

const DipeptideIcon = ({ hexColor, name1, name2 }) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="35" width="50" height="30" rx="8" fill={PARTICLE_COLORS[PARTICLE_TYPES.GLYCINE]} stroke={PARTICLE_COLOR_MAP[PARTICLE_COLORS[PARTICLE_TYPES.GLYCINE].replace('bg-','')] || '#fff'} strokeWidth="2" />
    <text x="30" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{name1}</text>

    <rect x="65" y="35" width="50" height="30" rx="8" fill={PARTICLE_COLORS[PARTICLE_TYPES.ALANINE]} stroke={PARTICLE_COLOR_MAP[PARTICLE_COLORS[PARTICLE_TYPES.ALANINE].replace('bg-','')] || '#fff'} strokeWidth="2" />
    <text x="90" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{name2}</text>

    {/* Peptide bond */}
    <line x1="55" y1="50" x2="65" y2="50" stroke="#ec4899" strokeWidth="4" />
    <line x1="55" y1="50" x2="65" y2="50" stroke="white" strokeWidth="2" strokeDasharray="2 2" />
  </svg>
);

const GlycylglycineIcon = ({ hexColor }) => <DipeptideIcon hexColor={hexColor} name1="Gly" name2="Gly" />;
const GlycylAlanineIcon = ({ hexColor }) => <DipeptideIcon hexColor={hexColor} name1="Gly" name2="Ala" />;

const AyoubIcon = ({ hexColor }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>{radialGradient('ayoub-grad', hexColor)}</defs>
    <circle cx="50" cy="50" r="45" fill="url(#ayoub-grad)" />
    <path d="M30 70 L50 30 L70 70 M38 55 H62" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GenericAtomIcon = ({ hexColor }) => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ElectronShells electronCount={18} hexColor={hexColor} />
          <Nucleus protonCount={18} neutronCount={22} />
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
