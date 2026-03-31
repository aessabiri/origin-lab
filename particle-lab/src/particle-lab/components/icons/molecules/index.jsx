import React from 'react';
import { PARTICLE_COLOR_MAP } from '../../../../constants/particles.js';
import { NeoBond, NeoSphere } from '../Base.jsx';

export const WaterIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={55} x2={30} y2={75} />
    <NeoBond x1={50} y1={55} x2={70} y2={75} />
    <NeoSphere x={50} y={55} r={20} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={30} y={75} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={70} y={75} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

export const MethaneIcon = () => (
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

export const AmmoniaIcon = () => (
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

export const CarbonDioxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={20} y2={50} type="double" />
    <NeoBond x1={50} y1={50} x2={80} y2={50} type="double" />
    <NeoSphere x={50} y={50} r={15} color={PARTICLE_COLOR_MAP['gray-800']} label="C" />
    <NeoSphere x={20} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={80} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

export const SodiumChlorideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <rect x="35" y="35" width="30" height="30" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
    <NeoSphere x={35} y={35} r={14} color={PARTICLE_COLOR_MAP['violet-500']} label="Na" />
    <NeoSphere x={65} y={65} r={16} color={PARTICLE_COLOR_MAP['green-400']} label="Cl" />
    <NeoSphere x={65} y={35} r={16} color={PARTICLE_COLOR_MAP['green-400']} opacity="0.5" />
    <NeoSphere x={35} y={65} r={14} color={PARTICLE_COLOR_MAP['violet-500']} opacity="0.5" />
  </svg>
);

export const HydrochloricAcidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} />
    <NeoSphere x={35} y={50} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={65} y={50} r={18} color={PARTICLE_COLOR_MAP['green-400']} label="Cl" />
  </svg>
);

export const CarbonMonoxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={40} y1={50} x2={60} y2={50} type="triple" />
    <NeoSphere x={40} y={50} r={16} color={PARTICLE_COLOR_MAP['gray-800']} label="C" />
    <NeoSphere x={60} y={50} r={16} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

export const HydrogenSulfideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={45} x2={30} y2={70} />
    <NeoBond x1={50} y1={45} x2={70} y2={70} />
    <NeoSphere x={50} y={45} r={20} color={PARTICLE_COLOR_MAP['yellow-500']} label="S" />
    <NeoSphere x={30} y={70} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={70} y={70} r={12} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

export const HydrogenPeroxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={40} y1={45} x2={60} y2={55} />
    <NeoBond x1={40} y1={45} x2={25} y2={60} />
    <NeoBond x1={60} y1={55} x2={75} y2={40} />
    <NeoSphere x={40} y={45} r={14} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={60} y={55} r={14} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={25} y={60} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={75} y={40} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

export const OzoneIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={35} x2={30} y2={65} type="double" />
    <NeoBond x1={50} y1={35} x2={70} y2={65} />
    <NeoSphere x={50} y={35} r={15} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={30} y={65} r={15} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={70} y={65} r={15} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

export const NitrousOxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={50} x2={55} y2={50} type="triple" />
    <NeoBond x1={55} y1={50} x2={80} y2={50} type="single" />
    <NeoSphere x={30} y={50} r={15} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
    <NeoSphere x={55} y={50} r={15} color={PARTICLE_COLOR_MAP['sky-500']} />
    <NeoSphere x={80} y={50} r={15} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

export const SiliconDioxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={20} y2={50} type="double" />
    <NeoBond x1={50} y1={50} x2={80} y2={50} type="double" />
    <NeoSphere x={50} y={50} r={18} color={PARTICLE_COLOR_MAP['stone-500']} label="Si" />
    <NeoSphere x={20} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={80} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

export const HydrogenFluorideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} />
    <NeoSphere x={35} y={50} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={65} y={50} r={20} color={PARTICLE_COLOR_MAP['emerald-500']} label="F" />
  </svg>
);

export const NeoAminoAcid = ({ rGroupNode, name }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={20} y1={60} x2={50} y2={50} />
    <NeoBond x1={50} y1={50} x2={80} y2={60} />
    <NeoBond x1={80} y1={60} x2={80} y2={30} type="double" />
    <NeoSphere x={20} y={60} r={12} color={PARTICLE_COLOR_MAP['blue-600']} label="N" />
    <NeoSphere x={50} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={80} y={60} r={12} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={80} y={30} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoBond x1={50} y1={50} x2={50} y2={20} />
    <g transform="translate(50, 20)">{rGroupNode}</g>
    <text x="50" y="90" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" opacity="0.7" style={{ textShadow: '0 1px 2px black' }}>{name}</text>
  </svg>
);

export const GlycineIcon = () => <NeoAminoAcid name="Gly" rGroupNode={<NeoSphere x={0} y={0} r={10} color="white" label="H" />} />;
export const AlanineIcon = () => <NeoAminoAcid name="Ala" rGroupNode={<NeoSphere x={0} y={0} r={12} color={PARTICLE_COLOR_MAP['gray-800']} label="C" />} />;
export const SerineIcon = () => <NeoAminoAcid name="Ser" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-15} /><NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-15} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" /></g>} />;
export const ValineIcon = () => <NeoAminoAcid name="Val" rGroupNode={<g><NeoBond x1={0} y1={0} x2={-10} y2={-15} /><NeoBond x1={0} y1={0} x2={10} y2={-15} /><NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-10} y={-15} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-15} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /></g>} />;
export const LeucineIcon = () => <NeoAminoAcid name="Leu" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-10} /><NeoBond x1={0} y1={-10} x2={-10} y2={-20} /><NeoBond x1={0} y1={-10} x2={10} y2={-20} /><NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-10} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-10} y={-20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /></g>} />;

export const DipeptideIcon = ({ Residue1, Residue2 }) => (
  <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible">
    <g transform="scale(0.6) translate(0, 30)"><Residue1 /></g>
    <g transform="scale(0.6) translate(100, 30)"><Residue2 /></g>
    <path d="M 50 60 Q 60 50, 70 60" stroke="#ec4899" strokeWidth="4" fill="none" className="animate-pulse" />
  </svg>
);

export const GlycylglycineIcon = () => <DipeptideIcon Residue1={GlycineIcon} Residue2={GlycineIcon} />;
export const GlycylAlanineIcon = () => <DipeptideIcon Residue1={GlycineIcon} Residue2={AlanineIcon} />;

export const AdenineIcon = () => (
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

export const GuanineIcon = () => (
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

export const CytosineIcon = () => (
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

export const ThymineIcon = () => (
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

export const NitrogenGasIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} type="triple" />
    <NeoSphere x={35} y={50} r={16} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
    <NeoSphere x={65} y={50} r={16} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
  </svg>
);

export const OxygenGasIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} type="double" />
    <NeoSphere x={35} y={50} r={16} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={65} y={50} r={16} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

export const AceticAcidIcon = () => (
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

export const EthanolIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={50} x2={55} y2={50} />
    <NeoBond x1={55} y1={50} x2={75} y2={50} />
    <NeoSphere x={30} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={55} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={75} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

export const SulfuricAcidIcon = () => (
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

export const GlucoseIcon = () => (
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

export const UracilIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={20} x2={80} y2={35} />
    <NeoBond x1={80} y1={35} x2={80} y2={65} type="double" />
    <NeoBond x1={80} y1={65} x2={50} y2={80} />
    <NeoBond x1={50} y1={80} x2={20} y2={65} type="double" />
    <NeoBond x1={20} y1={65} x2={20} y2={35} />
    <NeoBond x1={20} y1={35} x2={50} y2={20} type="double" />
    <NeoBond x1={50} y1={20} x2={50} y2={5} type="double" />
    <NeoBond x1={20} y1={65} x2={5} y2={75} type="double" />
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

export const PhosphateIcon = () => (
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

export const RiboseIcon = ({ isDeoxy = false }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <path d="M 50 20 L 80 40 L 65 80 L 35 80 L 20 40 Z" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.6" strokeLinejoin="round" />
    <NeoSphere x={50} y={20} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={80} y={40} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={65} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={35} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={20} y={40} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoBond x1={20} y1={40} x2={5} y2={20} />
    <NeoSphere x={5} y={20} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={95} y={40} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /> 
    {!isDeoxy && <NeoSphere x={75} y={95} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" />} 
    <NeoSphere x={25} y={95} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

export const DeoxyriboseIcon = () => <RiboseIcon isDeoxy={true} />;

export const GenericNucleotideIcon = ({ BaseIcon, isDeoxy = true }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <g transform="translate(15, 25) scale(0.35)"><PhosphateIcon /></g>
    <line x1={25} y1={35} x2={40} y2={50} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    <g transform="translate(35, 45) scale(0.4)"><RiboseIcon isDeoxy={isDeoxy} /></g>
    <line x1={65} y1={55} x2={75} y2={45} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    <g transform="translate(60, 15) scale(0.45)"><BaseIcon /></g>
  </svg>
);

export const NucleotideAIcon = () => <GenericNucleotideIcon BaseIcon={AdenineIcon} isDeoxy={true} />;
export const NucleotideTIcon = () => <GenericNucleotideIcon BaseIcon={ThymineIcon} isDeoxy={true} />;
export const NucleotideGIcon = () => <GenericNucleotideIcon BaseIcon={GuanineIcon} isDeoxy={true} />;
export const NucleotideCIcon = () => <GenericNucleotideIcon BaseIcon={CytosineIcon} isDeoxy={true} />;
export const NucleotideUIcon = () => <GenericNucleotideIcon BaseIcon={UracilIcon} isDeoxy={false} />;

export const ATPIcon = () => (
  <svg viewBox="0 0 140 100" className="w-full h-full overflow-visible">
    <g transform="translate(10, 50) scale(0.3)"><PhosphateIcon /></g>
    <line x1={20} y1={50} x2={30} y2={50} stroke="white" strokeWidth="2" />
    <g transform="translate(30, 50) scale(0.3)"><PhosphateIcon /></g>
    <line x1={40} y1={50} x2={50} y2={50} stroke="white" strokeWidth="2" />
    <g transform="translate(50, 50) scale(0.3)"><PhosphateIcon /></g>
    <line x1={60} y1={50} x2={70} y2={50} stroke="white" strokeWidth="2" />
    <g transform="translate(70, 45) scale(0.35)"><RiboseIcon /></g>
    <line x1={90} y1={55} x2={100} y2={45} stroke="white" strokeWidth="2" />
    <g transform="translate(90, 15) scale(0.4)"><AdenineIcon /></g>
  </svg>
);

export const GlycerolIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={20} x2={50} y2={50} />
    <NeoBond x1={50} y1={50} x2={50} y2={80} />
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

export const FattyAcidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={80} y1={50} x2={65} y2={50} />
    <NeoBond x1={65} y1={50} x2={55} y2={30} />
    <NeoBond x1={55} y1={30} x2={45} y2={60} />
    <NeoBond x1={45} y1={60} x2={35} y2={30} />
    <NeoBond x1={35} y1={30} x2={25} y2={60} />
    <NeoBond x1={25} y1={60} x2={15} y2={30} />
    <NeoBond x1={15} y1={30} x2={5} y2={50} />
    <NeoBond x1={80} y1={50} x2={90} y2={35} type="double" />
    <NeoBond x1={80} y1={50} x2={90} y2={65} />
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

export const LipidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={15} y1={25} x2={15} y2={50} />
    <NeoBond x1={15} y1={50} x2={15} y2={75} />
    <NeoBond x1={15} y1={25} x2={25} y2={25} />
    <NeoBond x1={15} y1={50} x2={25} y2={50} />
    <NeoBond x1={15} y1={75} x2={25} y2={75} />
    <NeoBond x1={25} y1={25} x2={35} y2={25} /><NeoBond x1={35} y1={25} x2={45} y2={15} /><NeoBond x1={45} y1={15} x2={55} y2={30} /><NeoBond x1={55} y1={30} x2={65} y2={15} /><NeoBond x1={65} y1={15} x2={75} y2={30} /><NeoBond x1={75} y1={30} x2={85} y2={15} />
    <NeoBond x1={25} y1={50} x2={35} y2={50} /><NeoBond x1={35} y1={50} x2={45} y2={40} /><NeoBond x1={45} y1={40} x2={55} y2={60} /><NeoBond x1={55} y1={60} x2={65} y2={40} /><NeoBond x1={65} y1={40} x2={75} y2={60} /><NeoBond x1={75} y1={60} x2={85} y2={40} />
    <NeoBond x1={25} y1={75} x2={35} y2={75} /><NeoBond x1={35} y1={75} x2={45} y2={65} /><NeoBond x1={45} y1={65} x2={55} y2={80} /><NeoBond x1={55} y1={80} x2={65} y2={65} /><NeoBond x1={65} y1={65} x2={75} y2={80} /><NeoBond x1={75} y1={80} x2={85} y2={65} />
    <NeoSphere x={15} y={25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={15} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={15} y={75} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={25} y={25} r={6} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={25} y={50} r={6} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={25} y={75} r={6} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoSphere x={35} y={25} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={35} y={50} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={35} y={75} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={55} y={30} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={75} y={30} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={55} y={60} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={75} y={60} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={55} y={80} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={75} y={80} r={6} color={PARTICLE_COLOR_MAP['gray-800']} />
  </svg>
);

export const DNAIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <line x1={12} y1={12} x2={22} y2={32} stroke="#94a3b8" strokeWidth="2" />
    <line x1={22} y1={32} x2={45} y2={25} stroke="#94a3b8" strokeWidth="2" />
    <svg x="0" y="0" width="25" height="25" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="10" y="20" width="25" height="25" viewBox="0 0 100 100"><DeoxyriboseIcon /></svg>
    <svg x="30" y="10" width="30" height="30" viewBox="0 0 100 100"><AdenineIcon /></svg>
    <line x1={88} y1={12} x2={78} y2={32} stroke="#94a3b8" strokeWidth="2" />
    <line x1={78} y1={32} x2={55} y2={25} stroke="#94a3b8" strokeWidth="2" />
    <svg x="75" y="0" width="25" height="25" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="65" y="20" width="25" height="25" viewBox="0 0 100 100"><DeoxyriboseIcon /></svg>
    <svg x="40" y="10" width="30" height="30" viewBox="0 0 100 100"><ThymineIcon /></svg>
    <line x1={45} y1={25} x2={55} y2={25} stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    <line x1={22} y1={32} x2={12} y2={62} stroke="#94a3b8" strokeWidth="2" />
    <line x1={12} y1={62} x2={22} y2={82} stroke="#94a3b8" strokeWidth="2" />
    <line x1={22} y1={82} x2={45} y2={75} stroke="#94a3b8" strokeWidth="2" />
    <svg x="0" y="50" width="25" height="25" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="10" y="70" width="25" height="25" viewBox="0 0 100 100"><DeoxyriboseIcon /></svg>
    <svg x="30" y="60" width="30" height="30" viewBox="0 0 100 100"><CytosineIcon /></svg>
    <line x1={78} y1={32} x2={88} y2={62} stroke="#94a3b8" strokeWidth="2" />
    <line x1={88} y1={62} x2={78} y2={82} stroke="#94a3b8" strokeWidth="2" />
    <line x1={78} y1={82} x2={55} y2={75} stroke="#94a3b8" strokeWidth="2" />
    <svg x="75" y="50" width="25" height="25" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="65" y="70" width="25" height="25" viewBox="0 0 100 100"><DeoxyriboseIcon /></svg>
    <svg x="40" y="60" width="30" height="30" viewBox="0 0 100 100"><GuanineIcon /></svg>
    <line x1={45} y1={75} x2={55} y2={75} stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    <path d="M 5 25 Q -5 50 5 75" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0.1" />
    <path d="M 95 25 Q 105 50 95 75" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0.1" />
  </svg>
);

export const RNAIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <path d="M 25 15 Q 15 50 35 85" stroke="#f97316" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" />
    <line x1={20} y1={15} x2={30} y2={25} stroke="#94a3b8" strokeWidth="2" />
    <line x1={30} y1={25} x2={50} y2={20} stroke="#94a3b8" strokeWidth="2" />
    <svg x="10" y="5" width="20" height="20" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="20" y="15" width="20" height="20" viewBox="0 0 100 100"><RiboseIcon /></svg>
    <svg x="40" y="10" width="25" height="25" viewBox="0 0 100 100"><AdenineIcon /></svg>
    <line x1={30} y1={25} x2={25} y2={45} stroke="#94a3b8" strokeWidth="2" />
    <line x1={15} y1={45} x2={25} y2={55} stroke="#94a3b8" strokeWidth="2" />
    <line x1={25} y1={55} x2={45} y2={50} stroke="#94a3b8" strokeWidth="2" />
    <svg x="5" y="35" width="20" height="20" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="15" y="45" width="20" height="20" viewBox="0 0 100 100"><RiboseIcon /></svg>
    <svg x="35" y="40" width="25" height="25" viewBox="0 0 100 100"><UracilIcon /></svg>
    <line x1={25} y1={55} x2={30} y2={75} stroke="#94a3b8" strokeWidth="2" />
    <line x1={20} y1={75} x2={30} y2={85} stroke="#94a3b8" strokeWidth="2" />
    <line x1={30} y1={85} x2={50} y2={80} stroke="#94a3b8" strokeWidth="2" />
    <svg x="10" y="65" width="20" height="20" viewBox="0 0 100 100"><PhosphateIcon /></svg>
    <svg x="20" y="75" width="20" height="20" viewBox="0 0 100 100"><RiboseIcon /></svg>
    <svg x="40" y="70" width="25" height="25" viewBox="0 0 100 100"><GuanineIcon /></svg>
  </svg>
);

export const InsulinFragmentIcon = () => (
  <svg viewBox="0 0 140 100" className="w-full h-full overflow-visible">
    <g transform="translate(20, 50) scale(0.4)"><GlycineIcon /></g>
    <g transform="translate(45, 35) scale(0.4)"><IsoleucineIcon /></g>
    <g transform="translate(70, 50) scale(0.4)"><ValineIcon /></g>
    <g transform="translate(95, 35) scale(0.4)"><GlutamicAcidIcon /></g>
    <g transform="translate(120, 50) scale(0.4)"><GlutamineIcon /></g>
  </svg>
);

export const HemePocketIcon = () => (
  <svg viewBox="0 0 140 100" className="w-full h-full overflow-visible">
    <g transform="translate(30, 50) scale(0.4)"><HistidineIcon /></g>
    <g transform="translate(55, 35) scale(0.4)"><ValineIcon /></g>
    <g transform="translate(80, 50) scale(0.4)"><LeucineIcon /></g>
    <g transform="translate(105, 35) scale(0.4)"><HistidineIcon /></g>
  </svg>
);

export const BenzeneIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="#52525b" strokeWidth="2" />
    <NeoBond x1={50} y1={20} x2={80} y2={35} type="double" />
    <NeoBond x1={80} y1={35} x2={80} y2={65} />
    <NeoBond x1={80} y1={65} x2={50} y2={80} type="double" />
    <NeoBond x1={50} y1={80} x2={20} y2={65} />
    <NeoBond x1={20} y1={65} x2={20} y2={35} type="double" />
    <NeoBond x1={20} y1={35} x2={50} y2={20} />
    <NeoSphere x={50} y={20} r={10} color={PARTICLE_COLOR_MAP['gray-500']} />
    <NeoSphere x={80} y={35} r={10} color={PARTICLE_COLOR_MAP['gray-500']} />
    <NeoSphere x={80} y={65} r={10} color={PARTICLE_COLOR_MAP['gray-500']} />
    <NeoSphere x={50} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-500']} />
    <NeoSphere x={20} y={65} r={10} color={PARTICLE_COLOR_MAP['gray-500']} />
    <NeoSphere x={20} y={35} r={10} color={PARTICLE_COLOR_MAP['gray-500']} />
  </svg>
);

export const CysteineIcon = () => (
  <NeoAminoAcid name="Cys" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-15} /><NeoBond x1={0} y1={-15} x2={10} y2={-25} /><NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-15} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-25} r={12} color={PARTICLE_COLOR_MAP['yellow-500']} label="S" /></g>} />
);

export const PhenylalanineIcon = () => (
  <NeoAminoAcid name="Phe" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-15} /><NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><g transform="translate(0, -35) scale(0.4)"><BenzeneIcon /></g></g>} />
);

export const FructoseIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <path d="M 50 20 L 80 45 L 70 80 L 30 80 L 20 45 Z" stroke="#9ca3af" strokeWidth="6" fill="none" opacity="0.6" strokeLinejoin="round" />
    <NeoSphere x={50} y={20} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={80} y={45} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={70} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={30} y={80} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={20} y={45} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoBond x1={20} y1={45} x2={5} y2={30} />
    <NeoSphere x={5} y={30} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={-5} y={20} r={8} color={PARTICLE_COLOR_MAP['red-600']} />
    <NeoBond x1={80} y1={45} x2={95} y2={30} />
    <NeoSphere x={95} y={30} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
    <NeoSphere x={105} y={20} r={8} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

export const FormaldehydeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={50} y2={20} type="double" />
    <NeoBond x1={50} y1={50} x2={25} y2={75} />
    <NeoBond x1={50} y1={50} x2={75} y2={75} />
    <NeoSphere x={50} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={50} y={20} r={14} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={25} y={75} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={75} y={75} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

export const AcetyleneIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={35} y1={50} x2={65} y2={50} type="triple" />
    <NeoBond x1={35} y1={50} x2={15} y2={50} />
    <NeoBond x1={65} y1={50} x2={85} y2={50} />
    <NeoSphere x={35} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={65} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={15} y={50} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={85} y={50} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

export const HydrogenCyanideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={40} y1={50} x2={70} y2={50} type="triple" />
    <NeoBond x1={40} y1={50} x2={20} y2={50} />
    <NeoSphere x={40} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={70} y={50} r={14} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
    <NeoSphere x={20} y={50} r={10} color={PARTICLE_COLOR_MAP['teal-500']} />
  </svg>
);

export const MethanolIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={40} y1={50} x2={70} y2={50} />
    <NeoBond x1={40} y1={50} x2={25} y2={25} />
    <NeoBond x1={40} y1={50} x2={25} y2={75} />
    <NeoBond x1={40} y1={50} x2={10} y2={50} />
    <NeoBond x1={70} y1={50} x2={85} y2={65} />
    <NeoSphere x={40} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={70} y={50} r={14} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={25} y={25} r={8} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={25} y={75} r={8} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={10} y={50} r={8} color={PARTICLE_COLOR_MAP['teal-500']} />
    <NeoSphere x={85} y={65} r={8} color={PARTICLE_COLOR_MAP['teal-500']} label="H" />
  </svg>
);

export const PropaneIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={20} y1={60} x2={50} y2={40} />
    <NeoBond x1={50} y1={40} x2={80} y2={60} />
    <NeoSphere x={20} y={60} r={12} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={50} y={40} r={12} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={80} y={60} r={12} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
  </svg>
);

export const ButaneIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={15} y1={60} x2={38} y2={40} />
    <NeoBond x1={38} y1={40} x2={62} y2={60} />
    <NeoBond x1={62} y1={60} x2={85} y2={40} />
    <NeoSphere x={15} y={60} r={12} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={38} y={40} r={12} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={62} y={60} r={12} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
    <NeoSphere x={85} y={40} r={12} color={PARTICLE_COLOR_MAP['gray-500']} label="C" />
  </svg>
);

export const SulfurDioxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={40} x2={25} y2={70} type="double" />
    <NeoBond x1={50} y1={40} x2={75} y2={70} type="double" />
    <NeoSphere x={50} y={40} r={16} color={PARTICLE_COLOR_MAP['yellow-500']} label="S" />
    <NeoSphere x={25} y={70} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={75} y={70} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

export const NitrogenDioxideIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={40} x2={25} y2={70} type="double" />
    <NeoBond x1={50} y1={40} x2={75} y2={70} />
    <NeoSphere x={50} y={40} r={16} color={PARTICLE_COLOR_MAP['sky-500']} label="N" />
    <NeoSphere x={25} y={70} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
    <NeoSphere x={75} y={70} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" />
  </svg>
);

export const HistidineIcon = () => (
  <NeoAminoAcid name="His" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-10} /><NeoBond x1={0} y1={-10} x2={-10} y2={-18} /><NeoBond x1={-10} y1={-18} x2={0} y2={-28} type="double" /><NeoBond x1={0} y1={-28} x2={10} y2={-18} /><NeoBond x1={10} y1={-18} x2={0} y2={-10} type="double" /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-10} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-10} y={-18} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /><NeoSphere x={0} y={-28} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-18} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /></g>} />
);

export const IsoleucineIcon = () => (
  <NeoAminoAcid name="Ile" rGroupNode={<g><NeoBond x1={0} y1={0} x2={-10} y2={-10} /><NeoBond x1={-10} y1={-10} x2={-10} y2={-22} /><NeoBond x1={-10} y1={-10} x2={5} y2={-15} /><NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-10} y={-10} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-10} y={-22} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={5} y={-15} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /></g>} />
);

export const LysineIcon = () => (
  <NeoAminoAcid name="Lys" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-10} /><NeoBond x1={0} y1={-10} x2={10} y2={-15} /><NeoBond x1={10} y1={-15} x2={10} y2={-25} /><NeoBond x1={10} y1={-25} x2={0} y2={-30} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-10} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-15} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-30} r={9} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /></g>} />
);

export const MethionineIcon = () => (
  <NeoAminoAcid name="Met" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-12} /><NeoBond x1={0} y1={-12} x2={10} y2={-18} /><NeoBond x1={10} y1={-18} x2={10} y2={-30} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-12} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-18} r={9} color={PARTICLE_COLOR_MAP['yellow-500']} label="S" /><NeoSphere x={10} y={-30} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /></g>} />
);

export const ThreonineIcon = () => (
  <NeoAminoAcid name="Thr" rGroupNode={<g><NeoBond x1={0} y1={0} x2={-12} y2={-8} /><NeoBond x1={0} y1={0} x2={12} y2={-8} /><NeoSphere x={0} y={0} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-12} y={-8} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={12} y={-8} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" /></g>} />
);

export const TryptophanIcon = () => (
  <NeoAminoAcid name="Trp" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-10} /><NeoBond x1={0} y1={-10} x2={-12} y2={-15} /><NeoBond x1={-12} y1={-15} x2={-8} y2={-28} /><NeoBond x1={-8} y1={-28} x2={5} y2={-25} type="double" /><NeoBond x1={5} y1={-25} x2={0} y2={-10} /><NeoBond x1={5} y1={-25} x2={18} y2={-25} /><NeoBond x1={18} y1={-25} x2={22} y2={-12} type="double" /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-10} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-12} y={-15} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /><NeoSphere x={-8} y={-28} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={5} y={-25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={18} y={-25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /></g>} />
);

export const ArginineIcon = () => (
  <NeoAminoAcid name="Arg" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-10} /><NeoBond x1={0} y1={-10} x2={10} y2={-15} /><NeoBond x1={10} y1={-15} x2={10} y2={-25} /><NeoBond x1={10} y1={-25} x2={0} y2={-30} /><NeoBond x1={0} y1={-30} x2={-10} y2={-35} /><NeoBond x1={-10} y1={-35} x2={-20} y2={-30} type="double" /><NeoBond x1={-10} y1={-35} x2={-10} y2={-45} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-10} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-15} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-30} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /><NeoSphere x={-10} y={-35} r={9} color={PARTICLE_COLOR_MAP['gray-800']} label="C" /><NeoSphere x={-20} y={-30} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /><NeoSphere x={-10} y={-45} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /></g>} />
);

export const AsparagineIcon = () => (
  <NeoAminoAcid name="Asn" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-12} /><NeoBond x1={0} y1={-12} x2={10} y2={-18} /><NeoBond x1={10} y1={-18} x2={20} y2={-12} type="double" /><NeoBond x1={10} y1={-18} x2={10} y2={-30} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-12} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-18} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={20} y={-12} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /><NeoSphere x={10} y={-30} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /></g>} />
);

export const AsparticAcidIcon = () => (
  <NeoAminoAcid name="Asp" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-12} /><NeoBond x1={0} y1={-12} x2={10} y2={-18} /><NeoBond x1={10} y1={-18} x2={20} y2={-12} type="double" /><NeoBond x1={10} y1={-18} x2={10} y2={-30} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-12} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-18} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={20} y={-12} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /><NeoSphere x={10} y={-30} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /></g>} />
);

export const GlutamicAcidIcon = () => (
  <NeoAminoAcid name="Glu" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-10} /><NeoBond x1={0} y1={-10} x2={10} y2={-15} /><NeoBond x1={10} y1={-15} x2={10} y2={-25} /><NeoBond x1={10} y1={-25} x2={20} y2={-30} type="double" /><NeoBond x1={10} y1={-25} x2={0} y2={-30} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-10} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-15} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={20} y={-30} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /><NeoSphere x={0} y={-30} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /></g>} />
);

export const GlutamineIcon = () => (
  <NeoAminoAcid name="Gln" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-10} /><NeoBond x1={0} y1={-10} x2={10} y2={-15} /><NeoBond x1={10} y1={-15} x2={10} y2={-25} /><NeoBond x1={10} y1={-25} x2={20} y2={-30} type="double" /><NeoBond x1={10} y1={-25} x2={0} y2={-30} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-10} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-15} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-25} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={20} y={-30} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="O" /><NeoSphere x={0} y={-30} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /></g>} />
);

export const ProlineIcon = () => (
  <NeoAminoAcid name="Pro" rGroupNode={<g><NeoBond x1={0} y1={0} x2={-15} y2={-10} /><NeoBond x1={-15} y1={-10} x2={-25} y2={15} /><NeoBond x1={-25} y1={15} x2={-30} y2={40} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-15} y={-10} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-25} y={15} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /></g>} />
);

export const TyrosineIcon = () => (
  <NeoAminoAcid name="Tyr" rGroupNode={<g><NeoBond x1={0} y1={0} x2={0} y2={-10} /><NeoBond x1={0} y1={-10} x2={-10} y2={-18} /><NeoBond x1={-10} y1={-18} x2={-10} y2={-30} type="double" /><NeoBond x1={-10} y1={-30} x2={0} y2={-38} /><NeoBond x1={0} y1={-38} x2={10} y2={-30} type="double" /><NeoBond x1={10} y1={-30} x2={10} y2={-18} /><NeoBond x1={10} y1={-18} x2={0} y2={-10} type="double" /><NeoBond x1={0} y1={-38} x2={0} y2={-50} /><NeoSphere x={0} y={0} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-10} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-10} y={-18} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={-10} y={-30} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-38} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-30} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={10} y={-18} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={0} y={-50} r={9} color={PARTICLE_COLOR_MAP['red-600']} label="O" /></g>} />
);

export const PhosphoricAcidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={50} y2={25} type="double" /><NeoBond x1={50} y1={50} x2={25} y2={50} /><NeoBond x1={50} y1={50} x2={75} y2={50} /><NeoBond x1={50} y1={50} x2={50} y2={75} />
    <NeoSphere x={50} y={50} r={16} color={PARTICLE_COLOR_MAP['yellow-500']} label="P" /><NeoSphere x={50} y={25} r={12} color={PARTICLE_COLOR_MAP['red-600']} label="O" /><NeoSphere x={25} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} /><NeoSphere x={75} y={50} r={12} color={PARTICLE_COLOR_MAP['red-600']} /><NeoSphere x={50} y={75} r={12} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

export const UreaIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={50} y2={25} type="double" /><NeoBond x1={50} y1={50} x2={25} y2={65} /><NeoBond x1={50} y1={50} x2={75} y2={65} />
    <NeoSphere x={50} y={50} r={14} color={PARTICLE_COLOR_MAP['gray-800']} label="C" /><NeoSphere x={50} y={25} r={14} color={PARTICLE_COLOR_MAP['red-600']} label="O" /><NeoSphere x={25} y={65} r={12} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /><NeoSphere x={75} y={65} r={12} color={PARTICLE_COLOR_MAP['blue-600']} label="N" />
  </svg>
);

export const PyruvateIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={50} x2={50} y2={50} /><NeoBond x1={50} y1={50} x2={70} y2={50} /><NeoBond x1={50} y1={50} x2={50} y2={25} type="double" /><NeoBond x1={70} y1={50} x2={85} y2={35} type="double" /><NeoBond x1={70} y1={50} x2={85} y2={65} />
    <NeoSphere x={30} y={50} r={12} color={PARTICLE_COLOR_MAP['gray-800']} label="C" /><NeoSphere x={50} y={50} r={12} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={70} y={50} r={12} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={50} y={25} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" /><NeoSphere x={85} y={35} r={10} color={PARTICLE_COLOR_MAP['red-600']} /><NeoSphere x={85} y={65} r={10} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

export const CitricAcidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={50} x2={50} y2={30} /><NeoBond x1={50} y1={50} x2={30} y2={60} /><NeoBond x1={50} y1={50} x2={70} y2={60} />
    <NeoSphere x={50} y={50} r={12} color={PARTICLE_COLOR_MAP['gray-800']} label="C" /><NeoSphere x={50} y={30} r={10} color={PARTICLE_COLOR_MAP['red-600']} label="O" /><NeoSphere x={30} y={60} r={10} color={PARTICLE_COLOR_MAP['red-600']} /><NeoSphere x={70} y={60} r={10} color={PARTICLE_COLOR_MAP['red-600']} />
  </svg>
);

export const PhospholipidIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={50} y1={30} x2={50} y2={50} /><NeoSphere x={50} y={30} r={18} color={PARTICLE_COLOR_MAP['yellow-500']} label="P" />
    <path d="M 40 50 L 35 70 L 40 90" stroke="#94a3b8" strokeWidth="4" fill="none" /><path d="M 60 50 L 65 70 L 60 90" stroke="#94a3b8" strokeWidth="4" fill="none" />
    <NeoSphere x={40} y={50} r={10} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={60} y={50} r={10} color={PARTICLE_COLOR_MAP['gray-800']} />
  </svg>
);

export const CelluloseIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <g transform="scale(0.8) translate(10, 10)"><NeoBond x1={20} y1={50} x2={50} y2={50} /><NeoBond x1={50} y1={50} x2={80} y2={50} /><NeoSphere x={20} y={50} r={12} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={50} y={50} r={12} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={80} y={50} r={12} color={PARTICLE_COLOR_MAP['gray-800']} /><path d="M 10 50 L 90 50" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" opacity="0.5" /></g>
  </svg>
);

export const NADHIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoBond x1={30} y1={40} x2={50} y2={25} /><NeoBond x1={50} y1={25} x2={70} y2={40} /><NeoBond x1={50} y1={25} x2={50} y2={10} />
    <NeoSphere x={30} y={40} r={12} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /><NeoSphere x={50} y={25} r={14} color={PARTICLE_COLOR_MAP['gray-800']} label="C" /><NeoSphere x={70} y={40} r={12} color={PARTICLE_COLOR_MAP['blue-600']} /><NeoSphere x={50} y={10} r={8} color={PARTICLE_COLOR_MAP['yellow-300']} label="e-" />
  </svg>
);

export const CholesterolIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <g transform="scale(0.8) translate(10, 10)">
        <NeoBond x1={20} y1={50} x2={35} y2={40} /><NeoBond x1={35} y1={40} x2={50} y2={50} /><NeoBond x1={50} y1={50} x2={50} y2={65} /><NeoBond x1={50} y1={65} x2={35} y2={75} /><NeoBond x1={35} y1={75} x2={20} y2={65} /><NeoBond x1={20} y1={65} x2={20} y2={50} />
        <NeoBond x1={50} y1={50} x2={65} y2={40} /><NeoBond x1={65} y1={40} x2={80} y2={50} /><NeoBond x1={80} y1={50} x2={80} y2={65} /><NeoBond x1={80} y1={65} x2={65} y2={75} /><NeoBond x1={65} y1={75} x2={50} y2={65} />
        <NeoBond x1={65} y1={40} x2={65} y2={25} /><NeoBond x1={65} y1={25} x2={80} y2={15} /><NeoBond x1={80} y1={15} x2={95} y2={25} /><NeoBond x1={95} y1={25} x2={80} y2={50} />
        <NeoBond x1={80} y1={15} x2={95} y2={5} /><NeoBond x1={95} y1={5} x2={105} y2={15} /><NeoBond x1={105} y1={15} x2={95} y2={25} />
        <NeoBond x1={105} y1={15} x2={120} y2={5} />
        <NeoSphere x={20} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={35} y={40} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={50} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={65} y={40} r={8} color={PARTICLE_COLOR_MAP['gray-800']} /><NeoSphere x={80} y={50} r={8} color={PARTICLE_COLOR_MAP['gray-800']} />
        <NeoSphere x={15} y={45} r={8} color={PARTICLE_COLOR_MAP['red-600']} label="OH" />
    </g>
  </svg>
);

export const HemeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <circle cx="50" cy="50" r="35" stroke="#be123c" strokeWidth="4" fill="none" strokeDasharray="10 5" />
    <NeoBond x1={50} y1={50} x2={50} y2={25} /><NeoBond x1={50} y1={50} x2={25} y2={50} /><NeoBond x1={50} y1={50} x2={75} y2={50} /><NeoBond x1={50} y1={50} x2={50} y2={75} />
    <NeoSphere x={50} y={50} r={16} color={PARTICLE_COLOR_MAP['orange-900']} label="Fe" /><NeoSphere x={50} y={25} r={8} color={PARTICLE_COLOR_MAP['blue-600']} label="N" /><NeoSphere x={25} y={50} r={8} color={PARTICLE_COLOR_MAP['blue-600']} /><NeoSphere x={75} y={50} r={8} color={PARTICLE_COLOR_MAP['blue-600']} /><NeoSphere x={50} y={75} r={8} color={PARTICLE_COLOR_MAP['blue-600']} />
  </svg>
);

export const BronzeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <NeoSphere x={35} y={35} r={14} color={PARTICLE_COLOR_MAP['orange-700']} label="Cu" />
    <NeoSphere x={65} y={65} r={14} color={PARTICLE_COLOR_MAP['orange-700']} />
    <NeoSphere x={65} y={35} r={14} color={PARTICLE_COLOR_MAP['orange-700']} />
    <NeoSphere x={35} y={65} r={16} color={PARTICLE_COLOR_MAP['slate-400']} label="Sn" />
    <rect x="25" y="25" width="50" height="50" fill="none" stroke="#cd7f32" strokeWidth="2" strokeDasharray="4 2" opacity="0.4" />
  </svg>
);

