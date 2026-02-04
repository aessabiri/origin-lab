import React from 'react';
import { NeoBond, NeoSphere } from '../Base.jsx';

export const Nucleus = ({ protonCount = 0, neutronCount = 0 }) => {
    const total = protonCount + neutronCount;
    if (total === 0) return null;

    const particles = [];
    let p = protonCount, n = neutronCount;
    while(p > 0 || n > 0) {
        if(p > 0) { particles.push({ type: 'p' }); p--; }
        if(n > 0) { particles.push({ type: 'n' }); n--; }
    }

    const c = 6; 
    const maxRadius = c * Math.sqrt(total);
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
                const angle = i * 2.39996; 
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

export const ElectronShells = ({ electronCount = 0, hexColor }) => {
    if (electronCount === 0) return null;
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
            const safeR = Math.min(r, 48); 
            return (
                <g key={i} className="animate-spin-slow" style={{ animationDuration: `${6 + i * 3}s`, transformOrigin: '50px 50px' }}>
                    <circle cx="50" cy="50" r={safeR} fill="none" stroke={hexColor} strokeWidth="0.8" opacity="0.6" />
                    <circle cx="50" cy="50" r={safeR} fill="none" stroke="white" strokeWidth="0.2" opacity="0.3" />
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

export const NeoAtomIcon = ({ hexColor, symbol, p, n, e }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <ElectronShells electronCount={e} hexColor={hexColor} />
    <Nucleus protonCount={p} neutronCount={n} />
    <text x="88" y="92" textAnchor="end" fill="white" fontSize="14" fontWeight="bold" opacity="0.5" style={{ textShadow: '0 1px 2px black' }}>{symbol}</text>
  </svg>
);

export const HydrogenIcon = (p) => <NeoAtomIcon symbol="H" p={1} n={0} e={1} {...p} />;
export const DeuteriumIcon = (p) => <NeoAtomIcon symbol="D" p={1} n={1} e={1} {...p} />;
export const TritiumIcon = (p) => <NeoAtomIcon symbol="T" p={1} n={2} e={1} {...p} />;
export const HeliumIcon = (p) => <NeoAtomIcon symbol="He" p={2} n={2} e={2} {...p} />;
export const Helium3Icon = (p) => <NeoAtomIcon symbol="³He" p={2} n={1} e={2} {...p} />;
export const LithiumIcon = (p) => <NeoAtomIcon symbol="Li" p={3} n={4} e={3} {...p} />;
export const BerylliumIcon = (p) => <NeoAtomIcon symbol="Be" p={4} n={5} e={4} {...p} />;
export const BoronIcon = (p) => <NeoAtomIcon symbol="B" p={5} n={6} e={5} {...p} />;
export const CarbonIcon = (p) => <NeoAtomIcon symbol="C" p={6} n={6} e={6} {...p} />;
export const Carbon14Icon = (p) => <NeoAtomIcon symbol="¹⁴C" p={6} n={8} e={6} {...p} />;
export const NitrogenIcon = (p) => <NeoAtomIcon symbol="N" p={7} n={7} e={7} {...p} />;
export const OxygenIcon = (p) => <NeoAtomIcon symbol="O" p={8} n={8} e={8} {...p} />;
export const FluorineIcon = (p) => <NeoAtomIcon symbol="F" p={9} n={10} e={9} {...p} />;
export const NeonIcon = (p) => <NeoAtomIcon symbol="Ne" p={10} n={10} e={10} {...p} />;
export const SodiumIcon = (p) => <NeoAtomIcon symbol="Na" p={11} n={12} e={11} {...p} />;
export const MagnesiumIcon = (p) => <NeoAtomIcon symbol="Mg" p={12} n={12} e={12} {...p} />;
export const AluminiumIcon = (p) => <NeoAtomIcon symbol="Al" p={13} n={14} e={13} {...p} />;
export const SiliconIcon = (p) => <NeoAtomIcon symbol="Si" p={14} n={14} e={14} {...p} />;
export const PhosphorusIcon = (p) => <NeoAtomIcon symbol="P" p={15} n={16} e={15} {...p} />;
export const SulfurIcon = (p) => <NeoAtomIcon symbol="S" p={16} n={16} e={16} {...p} />;
export const ChlorineIcon = (p) => <NeoAtomIcon symbol="Cl" p={17} n={18} e={17} {...p} />;
export const ArgonIcon = (p) => <NeoAtomIcon symbol="Ar" p={18} n={22} e={18} {...p} />;
export const PotassiumIcon = (p) => <NeoAtomIcon symbol="K" p={19} n={20} e={19} {...p} />;
export const CalciumIcon = (p) => <NeoAtomIcon symbol="Ca" p={20} n={20} e={20} {...p} />;
export const ScandiumIcon = (p) => <NeoAtomIcon symbol="Sc" p={21} n={24} e={21} {...p} />;
export const TitaniumIcon = (p) => <NeoAtomIcon symbol="Ti" p={22} n={26} e={22} {...p} />;
export const VanadiumIcon = (p) => <NeoAtomIcon symbol="V" p={23} n={28} e={23} {...p} />;
export const ChromiumIcon = (p) => <NeoAtomIcon symbol="Cr" p={24} n={28} e={24} {...p} />;
export const ManganeseIcon = (p) => <NeoAtomIcon symbol="Mn" p={25} n={30} e={25} {...p} />;
export const IronIcon = (p) => <NeoAtomIcon symbol="Fe" p={26} n={30} e={26} {...p} />;
export const CobaltIcon = (p) => <NeoAtomIcon symbol="Co" p={27} n={32} e={27} {...p} />;
export const NickelIcon = (p) => <NeoAtomIcon symbol="Ni" p={28} n={31} e={28} {...p} />;
export const CopperIcon = (p) => <NeoAtomIcon symbol="Cu" p={29} n={34} e={29} {...p} />;
export const ZincIcon = (p) => <NeoAtomIcon symbol="Zn" p={30} n={35} e={30} {...p} />;
export const GalliumIcon = (p) => <NeoAtomIcon symbol="Ga" p={31} n={39} e={31} {...p} />;
export const GermaniumIcon = (p) => <NeoAtomIcon symbol="Ge" p={32} n={41} e={32} {...p} />;
export const ArsenicIcon = (p) => <NeoAtomIcon symbol="As" p={33} n={42} e={33} {...p} />;
export const SeleniumIcon = (p) => <NeoAtomIcon symbol="Se" p={34} n={45} e={34} {...p} />;
export const BromineIcon = (p) => <NeoAtomIcon symbol="Br" p={35} n={45} e={35} {...p} />;
export const KryptonIcon = (p) => <NeoAtomIcon symbol="Kr" p={36} n={48} e={36} {...p} />;
export const TinIcon = (p) => <NeoAtomIcon symbol="Sn" p={50} n={69} e={50} {...p} />;
export const SilverIcon = (p) => <NeoAtomIcon symbol="Ag" p={47} n={61} e={47} {...p} />;
export const GoldIcon = (p) => <NeoAtomIcon symbol="Au" p={79} n={118} e={79} {...p} />;
export const LeadIcon = (p) => <NeoAtomIcon symbol="Pb" p={82} n={125} e={82} {...p} />;
export const Uranium235Icon = (p) => <NeoAtomIcon symbol="²³⁵U" p={92} n={143} e={92} {...p} />;
export const Uranium238Icon = (p) => <NeoAtomIcon symbol="²³⁸U" p={92} n={146} e={92} {...p} />;
