import React from 'react';
import { MOLECULAR_STRUCTURES } from '../data/structures';

const ATOM_COLORS = {
  H: '#FFFFFF', // Hydrogen - White
  C: '#909090', // Carbon - Gray
  O: '#FF0D0D', // Oxygen - Red
  N: '#3050F8', // Nitrogen - Blue
  S: '#FFFF30', // Sulfur - Yellow
  Cl: '#1FF01F', // Chlorine - Green
  Na: '#AB5CF2', // Sodium - Purple
  Fe: '#E06633', // Iron - Orange/Rust
  Mg: '#8AFF00', // Magnesium - Lime
  K: '#8F40D4', // Potassium - Violet
  default: '#DA70D6' // Orchid
};

const Atom = ({ cx, cy, label, size = 12, color }) => (
  <g>
    <circle cx={cx} cy={cy} r={size} fill={color || ATOM_COLORS[label] || ATOM_COLORS.default} stroke="black" strokeWidth="1" />
    {label && (
        <text x={cx} y={cy} dy=".3em" textAnchor="middle" fontSize={size} fill="black" fontWeight="bold" fontFamily="Arial">
            {label}
        </text>
    )}
  </g>
);

const Bond = ({ x1, y1, x2, y2, type = 'single' }) => {
  if (type === 'double') {
    return (
      <g stroke="white" strokeWidth="3" strokeLinecap="round">
        <line x1={x1} y1={y1} x2={x2} y2={y2} transform={`translate(0, -2)`} />
        <line x1={x1} y1={y1} x2={x2} y2={y2} transform={`translate(0, 2)`} />
      </g>
    );
  }
  if (type === 'triple') {
    return (
      <g stroke="white" strokeWidth="3" strokeLinecap="round">
        <line x1={x1} y1={y1} x2={x2} y2={y2} transform={`translate(0, -3)`} />
        <line x1={x1} y1={y1} x2={x2} y2={y2} />
        <line x1={x1} y1={y1} x2={x2} y2={y2} transform={`translate(0, 3)`} />
      </g>
    );
  }
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="3" strokeLinecap="round" />;
};

const MoleculeStructure = ({ chemicalId, className = '' }) => {
  const structure = MOLECULAR_STRUCTURES[chemicalId];
  
  // Generic fallback if no structure defined
  if (!structure) {
     return (
        <div className={`bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden ${className}`}>
           <svg width="100%" height="100%" viewBox="0 0 200 150">
                <g opacity="0.5">
                    <circle cx="100" cy="75" r="30" fill="none" stroke="white" strokeDasharray="4 4" />
                    <text x="100" y="75" fill="white" fontSize="30" textAnchor="middle" alignmentBaseline="middle">?</text>
                </g>
           </svg>
        </div>
     );
  }

  return (
    <div className={`bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 200 150">
        
        {/* Render Bonds First (so they are behind atoms) */}
        {structure.bonds && structure.bonds.map((bond, idx) => {
            const fromAtom = structure.atoms[bond.from];
            const toAtom = structure.atoms[bond.to];
            if (!fromAtom || !toAtom) return null;
            return (
                <Bond 
                    key={`bond-${idx}`}
                    x1={fromAtom.x} y1={fromAtom.y}
                    x2={toAtom.x} y2={toAtom.y}
                    type={bond.type}
                />
            );
        })}

        {/* Render Atoms */}
        {structure.atoms && structure.atoms.map((atom, idx) => (
            <Atom 
                key={`atom-${idx}`}
                cx={atom.x} 
                cy={atom.y} 
                label={atom.label} 
                size={atom.size}
                color={atom.color}
            />
        ))}

        {/* Render Labels */}
        {structure.labels && structure.labels.map((lbl, idx) => (
            <text 
                key={`lbl-${idx}`}
                x={lbl.x} 
                y={lbl.y} 
                fill={lbl.color || 'white'} 
                fontSize={lbl.fontSize || 10} 
                fontWeight={lbl.fontWeight || 'normal'}
                textAnchor="middle"
                stroke={lbl.stroke || 'none'}
            >
                {lbl.text}
            </text>
        ))}

        {/* Render Custom SVG Elements */}
        {structure.custom && structure.custom.map((el, idx) => {
            if (el.type === 'line') {
                return <line key={`cust-${idx}`} {...el} />;
            }
            if (el.type === 'circle') {
                return <circle key={`cust-${idx}`} {...el} />;
            }
            if (el.type === 'text') {
                return <text key={`cust-${idx}`} {...el} textAnchor="middle">{el.text}</text>;
            }
            return null;
        })}
      </svg>
    </div>
  );
};

export default MoleculeStructure;