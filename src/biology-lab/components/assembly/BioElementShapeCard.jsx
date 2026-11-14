import React from 'react';

/**
 * Renders the real microscopic/molecular SVG shape for each biological or chemical substrate.
 */
const ElementShapeSVG = ({ id, color = '#38bdf8' }) => {
  switch (id) {
    case 'mesenchymal_cells':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <path
            d="M32 8 C37 18, 48 16, 54 24 C45 30, 48 42, 52 50 C41 44, 34 48, 28 56 C26 45, 16 44, 10 46 C17 37, 16 27, 10 18 C20 22, 27 18, 32 8 Z"
            fill={`${color}33`}
            stroke={color}
            strokeWidth="2"
          />
          <circle cx="32" cy="32" r="7" fill={color} opacity="0.85" />
          <circle cx="30" cy="30" r="2.2" fill="#0f172a" />
        </svg>
      );
    case 'collagen_ii':
    case 'collagen_i':
    case 'comp_collagen_i':
    case 'comp_surfactant':
    case 'comp_tendon_ecm':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <path d="M8 22 Q20 10, 32 22 T56 22" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <path d="M8 32 Q20 20, 32 32 T56 32" fill="none" stroke="#f8fafc" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
          <path d="M8 42 Q20 30, 32 42 T56 42" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'vegf_a':
    case 'comp_vegf_o2':
    case 'comp_egf_hgf':
    case 'comp_ngf_bdnf':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <path d="M16 46 C16 26, 28 28, 32 14 C36 28, 48 26, 48 46" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="46" r="5" fill={color} />
          <circle cx="48" cy="46" r="5" fill={color} />
          <circle cx="32" cy="14" r="6" fill="#f8fafc" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'oxygen':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <line x1="22" y1="29" x2="42" y2="29" stroke="#94a3b8" strokeWidth="3" />
          <line x1="22" y1="35" x2="42" y2="35" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="20" cy="32" r="10" fill={color} stroke="#f8fafc" strokeWidth="1.5" />
          <circle cx="44" cy="32" r="10" fill={color} stroke="#f8fafc" strokeWidth="1.5" />
        </svg>
      );
    case 'calcium':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <circle cx="32" cy="32" r="18" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="32" cy="32" r="11" fill={color} />
          <text x="32" y="36" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">
            2+
          </text>
        </svg>
      );
    case 'phosphate':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <line x1="32" y1="32" x2="32" y2="12" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="32" y1="32" x2="14" y2="44" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="32" y1="32" x2="50" y2="44" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="32" y1="32" x2="46" y2="20" stroke="#94a3b8" strokeWidth="2.5" />
          <circle cx="32" cy="12" r="6" fill="#ef4444" />
          <circle cx="14" cy="44" r="6" fill="#ef4444" />
          <circle cx="50" cy="44" r="6" fill="#ef4444" />
          <circle cx="46" cy="20" r="5" fill="#ef4444" />
          <circle cx="32" cy="32" r="8" fill={color} />
        </svg>
      );
    case 'osteoclasts':
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <path
            d="M12 34 C12 16, 52 16, 52 34 L48 48 L42 42 L36 49 L30 42 L24 49 L18 42 Z"
            fill={`${color}44`}
            stroke={color}
            strokeWidth="2.2"
          />
          <circle cx="24" cy="28" r="4" fill={color} />
          <circle cx="34" cy="24" r="4" fill={color} />
          <circle cx="42" cy="30" r="4" fill={color} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <circle cx="32" cy="32" r="14" fill={`${color}33`} stroke={color} strokeWidth="2.5" />
          <circle cx="32" cy="32" r="6" fill={color} />
          <circle cx="48" cy="20" r="4" fill="#f8fafc" />
        </svg>
      );
  }
};

/**
 * Compact visual-first Element Card showing real SVG shape + minimal label + level bar.
 */
const BioElementShapeCard = ({ element, level = 0, onInfuse }) => {
  const isLoaded = level > 10;
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

      <ElementShapeSVG id={element.id} color={element.color} />

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
