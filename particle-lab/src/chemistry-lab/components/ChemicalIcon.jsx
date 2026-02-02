import React from 'react';
import MoleculeStructure from './MoleculeStructure';
import { MOLECULAR_STRUCTURES } from '../data/structures';

const ChemicalIcon = ({ id, color, state, formula, iconType, className = '' }) => {
  const wrapperStyle = `relative flex items-center justify-center w-16 h-16 transition-transform hover:scale-105 ${className}`;
  
  // Use a sanitized ID for gradients to avoid special character issues
  const gradId = `grad-${(formula || 'chem').replace(/[^a-zA-Z0-9]/g, '')}`;

  const renderIcon = () => {
    // If no iconType is provided, fallback to state
    const type = iconType || state;

    switch (type) {
      // --- LIQUIDS ---
      case 'liquid':
      case 'droplet':
        return (
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
             <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                </linearGradient>
            </defs>
            <path 
                d="M12 2C12 2 5 9 5 14.5C5 18.6421 8.35786 22 12.5 22C16.6421 22 20 18.6421 20 14.5C20 9 12 2 12 2Z" 
                fill={`url(#${gradId})`}
                stroke={color} 
                strokeWidth="0.5"
            />
            <ellipse cx="9" cy="11" rx="1.5" ry="3" transform="rotate(-30 9 11)" fill="white" fillOpacity="0.4" />
          </svg>
        );

      case 'bottle':
        return (
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
             <defs>
                <linearGradient id={`${gradId}-bottle`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.4" />
                </linearGradient>
            </defs>
            <path d="M9 2H15V6L19 10V21C19 21.55 18.55 22 18 22H6C5.45 22 5 21.55 5 21V10L9 6V2Z" 
                fill={`url(#${gradId}-bottle)`} stroke={color} strokeWidth="1" />
            <path d="M5 14H19" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
            <path d="M14 4V6M10 4V6" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
          </svg>
        );

      case 'vial':
        return (
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
            <defs>
                <linearGradient id={`${gradId}-vial`} x1="0%" y1="100%" x2="0%" y2="0%">
                     <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
                     <stop offset="50%" stopColor={color} stopOpacity="0.6"/>
                     <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
                </linearGradient>
            </defs>
            <path d="M16 4H8V6L9 7V21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V7L16 6V4Z" 
                  fill={`url(#${gradId}-vial)`} stroke={color} strokeWidth="1"/>
            <rect x="7" y="2" width="10" height="2" rx="1" fill="#555" />
            {/* Caution Symbol */}
            <path d="M12 11L11 15H13L12 11Z" fill="#333" />
            <circle cx="12" cy="17" r="1" fill="#333" />
          </svg>
        );

      // --- SOLIDS ---
      case 'solid':
      case 'crystal':
        return (
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="1"/>
                    <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            <path d="M12 3L4 8V18L12 23L20 18V8L12 3Z" fill={`url(#${gradId})`} stroke={color} strokeWidth="1"/>
            <path d="M12 3V13M12 13L20 8M12 13L4 8" stroke="white" strokeOpacity="0.3" strokeWidth="1"/>
          </svg>
        );

      case 'amino': // Amino Acids - Hexagonal Crystal
        return (
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
             <defs>
                <linearGradient id={`${gradId}-amino`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0.3"/>
                </linearGradient>
             </defs>
             <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" fill={`url(#${gradId}-amino)`} stroke={color} strokeWidth="1" />
             {/* Facet lines */}
             <path d="M12 2L12 12L3 17M12 12L21 7" stroke="white" strokeOpacity="0.4" fill="none" />
             <circle cx="12" cy="12" r="2" fill="white" opacity="0.3" />
          </svg>
        );

      case 'strand': // DNA/RNA - Helix
         return (
            <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
               <path d="M7 4C7 4 12 8 17 4" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
               <path d="M7 12C7 12 12 16 17 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
               <path d="M7 20C7 20 12 24 17 20" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
               <line x1="12" y1="4" x2="12" y2="20" stroke="white" strokeWidth="1" strokeDasharray="2 1" opacity="0.5" />
            </svg>
         );

      case 'protein': // Polypeptides - Folded Blob
         return (
            <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
               <defs>
                  <filter id={`${gradId}-blob`}>
                     <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                  </filter>
               </defs>
               <path d="M6 12C6 8 8 6 12 6C16 6 18 8 18 12C18 16 16 18 12 18C8 18 6 16 6 12Z" fill={color} opacity="0.8" />
               <path d="M8 10C8 8 10 8 12 10C14 12 16 10 16 12C16 14 14 16 12 14C10 12 8 14 8 12Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
               <circle cx="15" cy="9" r="2" fill="white" opacity="0.4" />
            </svg>
         );
      
      case 'powder':
        return (
           <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
              <defs>
                 <radialGradient id={`${gradId}-dust`}>
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                 </radialGradient>
              </defs>
              <path d="M4 20C4 20 6 14 12 14C18 14 20 20 20 20H4Z" fill={color} fillOpacity="0.8" />
              <circle cx="8" cy="18" r="1" fill="white" opacity="0.5" />
              <circle cx="10" cy="16" r="1" fill="white" opacity="0.5" />
              <circle cx="15" cy="19" r="1" fill="white" opacity="0.5" />
              <circle cx="13" cy="15" r="1" fill="white" opacity="0.5" />
           </svg>
        );

      case 'bar': // Ingot
      case 'metal':
        return (
           <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
              <defs>
                 <linearGradient id={`${gradId}-metal`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                    <stop offset="20%" stopColor={color} />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
                 </linearGradient>
              </defs>
              <path d="M4 12L8 8H20L16 12H4Z" fill={`url(#${gradId}-metal)`} stroke={color} strokeWidth="0.5"/>
              <path d="M4 12L6 18H18L16 12" fill={color} fillOpacity="0.8" />
              <path d="M18 18L22 14V10L20 8" fill={color} fillOpacity="0.6" />
           </svg>
        );

      case 'rock':
        return (
            <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
               <path d="M4 14L7 6L14 4L20 9L18 18L10 21L4 14Z" fill={color} stroke="black" strokeWidth="0.5" strokeOpacity="0.3" />
               <path d="M7 6L12 10L18 9" stroke="white" strokeOpacity="0.2" fill="none" />
               <path d="M4 14L10 15L10 21" stroke="black" strokeOpacity="0.2" fill="none" />
            </svg>
        );

      // --- GASES ---
      case 'gas':
      case 'cloud':
        return (
           <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
             <defs>
                 <radialGradient id={gradId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0"/>
                 </radialGradient>
             </defs>
             <circle cx="12" cy="12" r="8" fill={`url(#${gradId})`} />
             <circle cx="8" cy="14" r="5" fill={`url(#${gradId})`} opacity="0.7"/>
             <circle cx="16" cy="10" r="4" fill={`url(#${gradId})`} opacity="0.7"/>
             <path d="M7 12a3 3 0 0 1 3-3" stroke="white" strokeOpacity="0.2" fill="none"/>
           </svg>
        );

      case 'cylinder':
        return (
           <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
              <defs>
                  <linearGradient id={`${gradId}-tank`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={color} />
                      <stop offset="50%" stopColor="white" stopOpacity="0.5" />
                      <stop offset="100%" stopColor={color} />
                  </linearGradient>
              </defs>
              <rect x="7" y="6" width="10" height="16" rx="2" fill={`url(#${gradId}-tank)`} stroke={color} strokeWidth="1" />
              <path d="M7 6C7 3 17 3 17 6" fill={color} stroke={color} strokeWidth="1" />
              <rect x="10" y="2" width="4" height="2" fill="#555" />
              <rect x="11" y="1" width="2" height="1" fill="#333" />
           </svg>
        );

      default:
        // FALLBACK: Only check structure if no iconType match
        if (id && MOLECULAR_STRUCTURES[id]) {
            return <MoleculeStructure chemicalId={id} className={`bg-transparent border-none ${className}`} />;
        }
        return (
             <div className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center opacity-50" style={{ borderColor: color }}>
                ?
             </div>
        );
    }
  };

  return (
    <div className={wrapperStyle}>
      {renderIcon()}
      <span 
        className="absolute -bottom-2 text-[10px] font-bold font-mono text-white px-1.5 py-0.5 rounded shadow-sm border border-white/10"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      >
        {formula}
      </span>
    </div>
  );
};

export default ChemicalIcon;
