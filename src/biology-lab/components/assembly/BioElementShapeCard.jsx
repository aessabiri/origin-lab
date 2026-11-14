import React, { useMemo } from 'react';
import { renderElement3DIcon } from '../../utils/elementIconRenderer';

/**
 * Renders a shaded, scientifically realistic SVG specimen illustration for each
 * biological cell, protein, or chemical ion.
 */
const ElementShapeSVG = ({ id, color = '#38bdf8' }) => {
  switch (id) {
    case 'mesenchymal_cells':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <defs>
            <radialGradient id="mscGrad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="55%" stopColor={color} stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.85" />
            </radialGradient>
          </defs>
          <path
            d="M32 6 C35 18, 46 16, 56 20 C46 28, 46 39, 54 51 C42 44, 34 47, 27 58 C25 45, 16 44, 7 47 C16 37, 16 26, 9 16 C20 21, 28 17, 32 6 Z"
            fill="url(#mscGrad)"
            stroke={color}
            strokeWidth="1.6"
          />
          <ellipse cx="31" cy="32" rx="8" ry="6.5" fill="#1e3a8a" stroke="#7dd3fc" strokeWidth="1.2" />
          <circle cx="29" cy="30.5" r="2.3" fill="#e0f2fe" />
        </svg>
      );

    case 'collagen_ii':
    case 'collagen_i':
    case 'comp_collagen_i':
    case 'comp_surfactant':
    case 'comp_tendon_ecm':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <path d="M6 21 Q18 8, 32 21 T58 21" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M6 32 Q18 19, 32 32 T58 32" fill="none" stroke="#fef3c7" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M6 43 Q18 30, 32 43 T58 43" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
          {[16, 32, 48].map((x) => (
            <line key={x} x1={x} y1="16" x2={x} y2="48" stroke="#f8fafc" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
          ))}
        </svg>
      );

    case 'vegf_a':
    case 'comp_vegf_o2':
    case 'comp_egf_hgf':
    case 'comp_ngf_bdnf':
    case 'comp_fgf10':
    case 'comp_wnt_rspo':
    case 'comp_gdnf':
    case 'comp_igf1_glucose':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <path d="M14 44 C12 24, 24 22, 32 16 C40 22, 52 24, 50 44" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M18 36 C24 44, 40 44, 46 36" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <circle cx="15" cy="44" r="6" fill={color} stroke="#f8fafc" strokeWidth="1.2" />
          <circle cx="49" cy="44" r="6" fill={color} stroke="#f8fafc" strokeWidth="1.2" />
          <circle cx="32" cy="15" r="7" fill="#f8fafc" stroke={color} strokeWidth="2" />
        </svg>
      );

    case 'oxygen':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <defs>
            <radialGradient id="o2Grad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fecaca" />
              <stop offset="45%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>
          <line x1="21" y1="28" x2="43" y2="28" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="21" y1="36" x2="43" y2="36" stroke="#cbd5e1" strokeWidth="3" />
          <circle cx="20" cy="32" r="11" fill="url(#o2Grad)" />
          <circle cx="44" cy="32" r="11" fill="url(#o2Grad)" />
        </svg>
      );

    case 'calcium':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <defs>
            <radialGradient id="caGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="21" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="32" cy="32" r="13" fill="url(#caGrad)" />
          <text x="32" y="36" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">
            Ca²⁺
          </text>
        </svg>
      );

    case 'phosphate':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <defs>
            <radialGradient id="pGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="55%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#9a3412" />
            </radialGradient>
            <radialGradient id="oxGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fecaca" />
              <stop offset="55%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>
          <line x1="32" y1="33" x2="32" y2="12" stroke="#cbd5e1" strokeWidth="2.8" />
          <line x1="32" y1="33" x2="14" y2="46" stroke="#cbd5e1" strokeWidth="2.8" />
          <line x1="32" y1="33" x2="50" y2="46" stroke="#cbd5e1" strokeWidth="2.8" />
          <line x1="32" y1="33" x2="47" y2="20" stroke="#cbd5e1" strokeWidth="2.4" />
          <circle cx="32" cy="12" r="6.5" fill="url(#oxGrad)" />
          <circle cx="14" cy="46" r="6.5" fill="url(#oxGrad)" />
          <circle cx="50" cy="46" r="6.5" fill="url(#oxGrad)" />
          <circle cx="47" cy="20" r="5.5" fill="url(#oxGrad)" />
          <circle cx="32" cy="33" r="9" fill="url(#pGrad)" />
        </svg>
      );

    case 'osteoclasts':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <path
            d="M10 34 C10 13, 54 13, 54 34 L50 48 L44 41 L38 49 L32 41 L26 49 L20 41 L14 48 Z"
            fill={`${color}44`}
            stroke={color}
            strokeWidth="2"
          />
          <circle cx="22" cy="27" r="4" fill="#a855f7" stroke="#f3e8ff" strokeWidth="0.8" />
          <circle cx="32" cy="22" r="4" fill="#a855f7" stroke="#f3e8ff" strokeWidth="0.8" />
          <circle cx="42" cy="27" r="4" fill="#a855f7" stroke="#f3e8ff" strokeWidth="0.8" />
          <circle cx="27" cy="33" r="3.5" fill="#a855f7" stroke="#f3e8ff" strokeWidth="0.8" />
          <circle cx="37" cy="33" r="3.5" fill="#a855f7" stroke="#f3e8ff" strokeWidth="0.8" />
        </svg>
      );

    case 'cell_cardiomyocyte':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <path d="M8 24 L26 24 L36 16 L54 16 L54 28 L38 28 L38 36 L54 36 L54 48 L34 48 L26 40 L8 40 Z" fill={`${color}55`} stroke={color} strokeWidth="2" />
          {[16, 22, 42, 48].map((x) => (
            <line key={x} x1={x} y1="22" x2={x} y2="42" stroke="#ffe4e6" strokeWidth="1.2" opacity="0.7" />
          ))}
          <ellipse cx="25" cy="32" rx="5.5" ry="4" fill="#9f1239" stroke="#fecdd3" strokeWidth="1" />
        </svg>
      );

    case 'cell_hepatocyte':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <polygon points="32,8 52,20 52,44 32,56 12,44 12,20" fill={`${color}44`} stroke={color} strokeWidth="2" />
          <circle cx="26" cy="30" r="6" fill="#78350f" stroke="#fde68a" strokeWidth="1.2" />
          <circle cx="39" cy="35" r="5" fill="#78350f" stroke="#fde68a" strokeWidth="1.2" />
        </svg>
      );

    case 'cell_pneumocyte':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <ellipse cx="32" cy="34" rx="22" ry="15" fill={`${color}33`} stroke={color} strokeWidth="2" />
          <circle cx="24" cy="33" r="5.5" fill="#065f46" stroke="#a7f3d0" strokeWidth="1.2" />
          <circle cx="39" cy="29" r="3.5" fill="#a7f3d0" opacity="0.8" />
          <circle cx="43" cy="38" r="3" fill="#a7f3d0" opacity="0.8" />
        </svg>
      );

    case 'cell_enterocyte':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <path d="M18 18 L18 54 L46 54 L46 18" fill={`${color}44`} stroke={color} strokeWidth="2" />
          {[20, 25, 30, 35, 40, 44].map((x) => (
            <line key={x} x1={x} y1="18" x2={x} y2="10" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          ))}
          <ellipse cx="32" cy="40" rx="6" ry="8" fill="#831843" stroke="#fbcfe8" strokeWidth="1.2" />
        </svg>
      );

    case 'cell_podocyte':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <circle cx="32" cy="28" r="12" fill={`${color}55`} stroke={color} strokeWidth="2" />
          <circle cx="32" cy="28" r="5.5" fill="#4c1d95" stroke="#ddd6fe" strokeWidth="1.2" />
          {[16, 23, 30, 37, 44].map((x) => (
            <path key={x} d={`M${x} 38 L${x - 2} 54`} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </svg>
      );

    case 'cell_myocyte':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <rect x="6" y="20" width="52" height="24" rx="10" fill={`${color}44`} stroke={color} strokeWidth="2" />
          {[14, 22, 30, 38, 46, 50].map((x) => (
            <line key={x} x1={x} y1="21" x2={x} y2="43" stroke="#fff1f2" strokeWidth="1.4" opacity="0.65" />
          ))}
          <ellipse cx="18" cy="25" rx="4" ry="2.2" fill="#9f1239" />
          <ellipse cx="36" cy="39" rx="4" ry="2.2" fill="#9f1239" />
          <ellipse cx="48" cy="25" rx="4" ry="2.2" fill="#9f1239" />
        </svg>
      );

    case 'cell_neuron':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <path d="M22 24 L10 12 M20 30 L6 28 M22 36 L12 48 M28 20 L26 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="26" cy="30" r="9" fill={`${color}66`} stroke={color} strokeWidth="2" />
          <circle cx="26" cy="30" r="3.5" fill="#78350f" stroke="#fef3c7" strokeWidth="1" />
          <line x1="35" y1="30" x2="56" y2="30" stroke={color} strokeWidth="2.2" />
          <rect x="37" y="26" width="6" height="8" rx="3" fill="#fde68a" />
          <rect x="46" y="26" width="6" height="8" rx="3" fill="#fde68a" />
          <path d="M55 30 L60 24 M55 30 L60 36" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'comp_atp_actin':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <polygon points="10,28 18,22 26,28 23,38 13,38" fill={`${color}44`} stroke={color} strokeWidth="1.8" />
          <line x1="26" y1="32" x2="54" y2="32" stroke="#cbd5e1" strokeWidth="2" />
          {[34, 44, 54].map((x) => (
            <circle key={x} cx={x} cy="32" r="4.5" fill="#f97316" stroke="#fef3c7" strokeWidth="1.2" />
          ))}
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12">
          <circle cx="32" cy="32" r="14" fill={`${color}33`} stroke={color} strokeWidth="2.2" />
          <circle cx="32" cy="32" r="6" fill={color} />
        </svg>
      );
  }
};

/**
 * Compact visual-first Element Card showing real SVG shape + minimal label + level bar.
 */
const BioElementShapeCard = ({ element, level = 0, onInfuse }) => {
  const isLoaded = level > 10;
  const icon3DUrl = useMemo(
    () => renderElement3DIcon(element.id, element.color),
    [element.id, element.color]
  );

  return (
    <button
      type="button"
      onClick={() => onInfuse && onInfuse(element.id)}
      title={`${element.name} — Click to infuse into chamber`}
      className={`p-2 rounded-xl border transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 ${
        isLoaded
          ? 'bg-[#0b1628] border-cyan-400/70 shadow-[0_0_10px_rgba(34,211,238,0.18)]'
          : 'bg-[#070b14] border-slate-700/80 hover:border-slate-500'
      }`}
    >
      <div className="w-full flex items-center justify-between text-[8.5px] font-mono">
        <span className="font-black" style={{ color: element.color }}>
          {element.symbol}
        </span>
        <span className={isLoaded ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
          {Math.round(level)}%
        </span>
      </div>

      {icon3DUrl ? (
        <img
          src={icon3DUrl}
          alt={element.name}
          className="w-12 h-12 object-contain drop-shadow-[0_2px_8px_rgba(34,211,238,0.28)]"
        />
      ) : (
        <ElementShapeSVG id={element.id} color={element.color} />
      )}

      <div className="text-[9.5px] font-bold text-white truncate w-full text-center">
        {element.name.split('(')[0].split('+')[0].trim()}
      </div>

      <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full transition-all duration-200"
          style={{ width: `${Math.min(100, level)}%`, backgroundColor: element.color }}
        />
      </div>
    </button>
  );
};

export default BioElementShapeCard;
