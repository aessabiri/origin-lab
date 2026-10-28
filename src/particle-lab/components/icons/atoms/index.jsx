import React from 'react';
import { NeoBond, NeoSphere } from '../Base.jsx';

export const Nucleus = ({ protonCount = 0, neutronCount = 0 }) => {
  const total = protonCount + neutronCount;
  if (total === 0) return null;

  // Performance Optimization: Cap rendered visual nucleons to max 24 representative spheres
  const MAX_NUCLEONS = 24;
  let visualP = protonCount;
  let visualN = neutronCount;

  if (total > MAX_NUCLEONS) {
    const pRatio = protonCount / total;
    visualP = Math.round(MAX_NUCLEONS * pRatio);
    visualN = MAX_NUCLEONS - visualP;
  }

  const particles = [];
  let p = visualP, n = visualN;
  while (p > 0 || n > 0) {
    if (p > 0) { particles.push('p'); p--; }
    if (n > 0) { particles.push('n'); n--; }
  }

  const c = 5.5;
  const count = particles.length;
  const maxRadius = c * Math.sqrt(count);
  const scale = maxRadius > 32 ? 32 / maxRadius : 1;
  const coreRadius = Math.max(10, maxRadius * scale);

  return (
    <g transform="translate(50,50)">
      {/* Ambient core glow without expensive multi-pass SVG blur filters */}
      <circle cx="0" cy="0" r={coreRadius + 4} fill="#ef4444" opacity="0.15" />
      <circle cx="0" cy="0" r={coreRadius + 1} fill="#f97316" opacity="0.1" />

      {particles.map((type, i) => {
        const angle = i * 2.39996; // Golden angle phyllotaxis distribution
        const r = c * Math.sqrt(i) * scale;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        const radius = Math.max(1.8, 3.8 * scale);

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={radius}
            fill={type === 'p' ? '#ef4444' : '#94a3b8'}
            stroke={type === 'p' ? '#991b1b' : '#334155'}
            strokeWidth="0.5"
            opacity="0.95"
          />
        );
      })}
    </g>
  );
};

export const ElectronShells = ({ electronCount = 0, hexColor = '#38bdf8' }) => {
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

  const baseRadius = 20;
  const radiusStep = 7;

  return (
    <g>
      {activeShells.map((count, i) => {
        const r = Math.min(baseRadius + i * radiusStep, 46);
        // Cap visual dots to max 8 per shell ring for ultra-smooth 60fps rendering
        const visualDots = Math.min(count, 8);

        return (
          <g
            key={i}
            className="animate-spin-slow"
            style={{ animationDuration: `${10 + i * 4}s`, transformOrigin: '50px 50px' }}
          >
            {/* Primary Orbit Ring */}
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={hexColor}
              strokeWidth="0.75"
              opacity="0.45"
            />
            {/* Inner Ring Accent */}
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.25"
              opacity="0.2"
            />

            {/* Electron Marker Dots */}
            {Array.from({ length: visualDots }).map((_, j) => {
              const angle = (j / visualDots) * 2 * Math.PI;
              return (
                <circle
                  key={j}
                  cx={50 + r * Math.cos(angle)}
                  cy={50 + r * Math.sin(angle)}
                  r="1.75"
                  fill="#ffffff"
                  stroke={hexColor}
                  strokeWidth="0.5"
                  opacity="0.9"
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

export const NeoAtomIcon = ({ hexColor = '#38bdf8', symbol, p, n, e }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none">
    <ElectronShells electronCount={e} hexColor={hexColor} />
    <Nucleus protonCount={p} neutronCount={n} />
    <text
      x="88"
      y="92"
      textAnchor="end"
      fill="#f8fafc"
      fontSize="13"
      fontFamily="monospace"
      fontWeight="900"
      opacity="0.75"
      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
    >
      {symbol}
    </text>
  </svg>
);

// --- PERIOD 1 ---
export const HydrogenIcon = (p) => <NeoAtomIcon symbol="H" p={1} n={0} e={1} {...p} />;
export const DeuteriumIcon = (p) => <NeoAtomIcon symbol="D" p={1} n={1} e={1} {...p} />;
export const TritiumIcon = (p) => <NeoAtomIcon symbol="T" p={1} n={2} e={1} {...p} />;
export const HeliumIcon = (p) => <NeoAtomIcon symbol="He" p={2} n={2} e={2} {...p} />;
export const Helium3Icon = (p) => <NeoAtomIcon symbol="³He" p={2} n={1} e={2} {...p} />;

// --- PERIOD 2 ---
export const LithiumIcon = (p) => <NeoAtomIcon symbol="Li" p={3} n={4} e={3} {...p} />;
export const BerylliumIcon = (p) => <NeoAtomIcon symbol="Be" p={4} n={5} e={4} {...p} />;
export const BoronIcon = (p) => <NeoAtomIcon symbol="B" p={5} n={6} e={5} {...p} />;
export const CarbonIcon = (p) => <NeoAtomIcon symbol="C" p={6} n={6} e={6} {...p} />;
export const Carbon14Icon = (p) => <NeoAtomIcon symbol="¹⁴C" p={6} n={8} e={6} {...p} />;
export const NitrogenIcon = (p) => <NeoAtomIcon symbol="N" p={7} n={7} e={7} {...p} />;
export const OxygenIcon = (p) => <NeoAtomIcon symbol="O" p={8} n={8} e={8} {...p} />;
export const FluorineIcon = (p) => <NeoAtomIcon symbol="F" p={9} n={10} e={9} {...p} />;
export const NeonIcon = (p) => <NeoAtomIcon symbol="Ne" p={10} n={10} e={10} {...p} />;

// --- PERIOD 3 ---
export const SodiumIcon = (p) => <NeoAtomIcon symbol="Na" p={11} n={12} e={11} {...p} />;
export const MagnesiumIcon = (p) => <NeoAtomIcon symbol="Mg" p={12} n={12} e={12} {...p} />;
export const AluminiumIcon = (p) => <NeoAtomIcon symbol="Al" p={13} n={14} e={13} {...p} />;
export const SiliconIcon = (p) => <NeoAtomIcon symbol="Si" p={14} n={14} e={14} {...p} />;
export const PhosphorusIcon = (p) => <NeoAtomIcon symbol="P" p={15} n={16} e={15} {...p} />;
export const SulfurIcon = (p) => <NeoAtomIcon symbol="S" p={16} n={16} e={16} {...p} />;
export const ChlorineIcon = (p) => <NeoAtomIcon symbol="Cl" p={17} n={18} e={17} {...p} />;
export const ArgonIcon = (p) => <NeoAtomIcon symbol="Ar" p={18} n={22} e={18} {...p} />;

// --- PERIOD 4 ---
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

// --- PERIOD 5 (Expanded) ---
export const RubidiumIcon = (p) => <NeoAtomIcon symbol="Rb" p={37} n={48} e={37} {...p} />;
export const StrontiumIcon = (p) => <NeoAtomIcon symbol="Sr" p={38} n={50} e={38} {...p} />;
export const YttriumIcon = (p) => <NeoAtomIcon symbol="Y" p={39} n={50} e={39} {...p} />;
export const ZirconiumIcon = (p) => <NeoAtomIcon symbol="Zr" p={40} n={51} e={40} {...p} />;
export const NiobiumIcon = (p) => <NeoAtomIcon symbol="Nb" p={41} n={52} e={41} {...p} />;
export const MolybdenumIcon = (p) => <NeoAtomIcon symbol="Mo" p={42} n={54} e={42} {...p} />;
export const TechnetiumIcon = (p) => <NeoAtomIcon symbol="Tc" p={43} n={55} e={43} {...p} />;
export const RutheniumIcon = (p) => <NeoAtomIcon symbol="Ru" p={44} n={57} e={44} {...p} />;
export const RhodiumIcon = (p) => <NeoAtomIcon symbol="Rh" p={45} n={58} e={45} {...p} />;
export const PalladiumIcon = (p) => <NeoAtomIcon symbol="Pd" p={46} n={60} e={46} {...p} />;
export const SilverIcon = (p) => <NeoAtomIcon symbol="Ag" p={47} n={61} e={47} {...p} />;
export const CadmiumIcon = (p) => <NeoAtomIcon symbol="Cd" p={48} n={64} e={48} {...p} />;
export const IndiumIcon = (p) => <NeoAtomIcon symbol="In" p={49} n={66} e={49} {...p} />;
export const TinIcon = (p) => <NeoAtomIcon symbol="Sn" p={50} n={69} e={50} {...p} />;
export const AntimonyIcon = (p) => <NeoAtomIcon symbol="Sb" p={51} n={71} e={51} {...p} />;
export const TelluriumIcon = (p) => <NeoAtomIcon symbol="Te" p={52} n={76} e={52} {...p} />;
export const IodineIcon = (p) => <NeoAtomIcon symbol="I" p={53} n={74} e={53} {...p} />;
export const XenonIcon = (p) => <NeoAtomIcon symbol="Xe" p={54} n={77} e={54} {...p} />;

// --- PERIOD 6 & LANTHANIDES ---
export const CaesiumIcon = (p) => <NeoAtomIcon symbol="Cs" p={55} n={78} e={55} {...p} />;
export const BariumIcon = (p) => <NeoAtomIcon symbol="Ba" p={56} n={81} e={56} {...p} />;
export const LanthanumIcon = (p) => <NeoAtomIcon symbol="La" p={57} n={82} e={57} {...p} />;
export const NeodymiumIcon = (p) => <NeoAtomIcon symbol="Nd" p={60} n={84} e={60} {...p} />;
export const TungstenIcon = (p) => <NeoAtomIcon symbol="W" p={74} n={110} e={74} {...p} />;
export const OsmiumIcon = (p) => <NeoAtomIcon symbol="Os" p={76} n={114} e={76} {...p} />;
export const PlatinumIcon = (p) => <NeoAtomIcon symbol="Pt" p={78} n={117} e={78} {...p} />;
export const GoldIcon = (p) => <NeoAtomIcon symbol="Au" p={79} n={118} e={79} {...p} />;
export const MercuryIcon = (p) => <NeoAtomIcon symbol="Hg" p={80} n={121} e={80} {...p} />;
export const LeadIcon = (p) => <NeoAtomIcon symbol="Pb" p={82} n={125} e={82} {...p} />;
export const BismuthIcon = (p) => <NeoAtomIcon symbol="Bi" p={83} n={126} e={83} {...p} />;
export const PoloniumIcon = (p) => <NeoAtomIcon symbol="Po" p={84} n={126} e={84} {...p} />;
export const RadonIcon = (p) => <NeoAtomIcon symbol="Rn" p={86} n={136} e={86} {...p} />;

// --- PERIOD 7 & ACTINIDES ---
export const FranciumIcon = (p) => <NeoAtomIcon symbol="Fr" p={87} n={136} e={87} {...p} />;
export const RadiumIcon = (p) => <NeoAtomIcon symbol="Ra" p={88} n={138} e={88} {...p} />;
export const ActiniumIcon = (p) => <NeoAtomIcon symbol="Ac" p={89} n={138} e={89} {...p} />;
export const ThoriumIcon = (p) => <NeoAtomIcon symbol="Th" p={90} n={142} e={90} {...p} />;
export const ProtactiniumIcon = (p) => <NeoAtomIcon symbol="Pa" p={91} n={140} e={91} {...p} />;
export const UraniumIcon = (p) => <NeoAtomIcon symbol="U" p={92} n={146} e={92} {...p} />;
export const Uranium234Icon = (p) => <NeoAtomIcon symbol="²³⁴U" p={92} n={142} e={92} {...p} />;
export const Uranium235Icon = (p) => <NeoAtomIcon symbol="²³⁵U" p={92} n={143} e={92} {...p} />;
export const Uranium238Icon = (p) => <NeoAtomIcon symbol="²³⁸U" p={92} n={146} e={92} {...p} />;
export const PlutoniumIcon = (p) => <NeoAtomIcon symbol="Pu" p={94} n={150} e={94} {...p} />;
export const AmericiumIcon = (p) => <NeoAtomIcon symbol="Am" p={95} n={148} e={95} {...p} />;
export const OganessonIcon = (p) => <NeoAtomIcon symbol="Og" p={118} n={176} e={118} {...p} />;
