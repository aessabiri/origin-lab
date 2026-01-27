import React from 'react';
import { MOLECULAR_STRUCTURES } from '../data/structures';
import { NeoSphere, NeoBond } from '../../components/VisualPrimitives';

const ATOM_COLORS = {
  H: '#FFFFFF', // Hydrogen - White
  C: '#374151', // Carbon - Gray-700 (Darker for Neo look)
  O: '#ef4444', // Oxygen - Red-500
  N: '#3b82f6', // Nitrogen - Blue-500
  S: '#eab308', // Sulfur - Yellow-500
  Cl: '#22c55e', // Chlorine - Green-500
  Na: '#a855f7', // Sodium - Purple-500
  Fe: '#ea580c', // Iron - Orange-600
  Mg: '#84cc16', // Magnesium - Lime-500
  K: '#7c3aed', // Potassium - Violet-600
  default: '#d946ef' // Fuchsia-500
};

const MoleculeStructure = ({ chemicalId, className = '' }) => {
  const structure = MOLECULAR_STRUCTURES[chemicalId];
  
  // Generic fallback if no structure defined
  if (!structure) {
     return (
        <div className={`flex items-center justify-center overflow-hidden ${className}`}>
           <svg width="100%" height="100%" viewBox="0 0 200 150" className="overflow-visible">
                <g opacity="0.5">
                    <circle cx="100" cy="75" r="30" fill="none" stroke="currentColor" strokeDasharray="4 4" className="text-gray-500" />
                    <text x="100" y="75" fill="currentColor" fontSize="30" textAnchor="middle" alignmentBaseline="middle" className="text-gray-500">?</text>
                </g>
           </svg>
        </div>
     );
  }

  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 200 150" className="overflow-visible">
        
        {/* Render Bonds First (so they are behind atoms) */}
        {structure.bonds && structure.bonds.map((bond, idx) => {
            const fromAtom = structure.atoms[bond.from];
            const toAtom = structure.atoms[bond.to];
            if (!fromAtom || !toAtom) return null;
            return (
                <NeoBond 
                    key={`bond-${idx}`}
                    x1={fromAtom.x} y1={fromAtom.y}
                    x2={toAtom.x} y2={toAtom.y}
                    type={bond.type}
                    scale={1.5}
                />
            );
        })}

        {/* Render Atoms */}
        {structure.atoms && structure.atoms.map((atom, idx) => (
            <NeoSphere 
                key={`atom-${idx}`}
                x={atom.x} 
                y={atom.y} 
                label={atom.label} 
                r={(atom.size || 12) * 1.5}
                color={atom.color || ATOM_COLORS[atom.label] || ATOM_COLORS.default}
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
                style={{ textShadow: '0 1px 2px black' }}
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