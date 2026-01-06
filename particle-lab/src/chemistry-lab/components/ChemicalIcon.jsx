import React from 'react';

const ChemicalIcon = ({ color, state, formula, className = '' }) => {
  const wrapperStyle = `relative flex items-center justify-center w-16 h-16 transition-transform hover:scale-105 ${className}`;
  
  // Use a sanitized ID for gradients to avoid special character issues
  const gradId = `grad-${state}-${formula.replace(/[^a-zA-Z0-9]/g, '')}`;

  const renderIcon = () => {
    switch (state) {
      case 'liquid':
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
            {/* Highlight */}
            <ellipse cx="9" cy="11" rx="1.5" ry="3" transform="rotate(-30 9 11)" fill="white" fillOpacity="0.4" />
          </svg>
        );
      case 'solid':
        return (
          <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="1"/>
                    <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            {/* Hexagonal Crystal Shape */}
            <path 
                d="M12 3L4 8V18L12 23L20 18V8L12 3Z" 
                fill={`url(#${gradId})`}
                stroke={color}
                strokeWidth="1"
            />
            {/* Inner Facets */}
            <path d="M12 3V13M12 13L20 8M12 13L4 8" stroke="white" strokeOpacity="0.3" strokeWidth="1"/>
          </svg>
        );
      case 'gas':
        return (
           <svg viewBox="0 0 24 24" className="w-12 h-12 drop-shadow-lg">
             <defs>
                 <radialGradient id={gradId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0"/>
                 </radialGradient>
             </defs>
             {/* Cloud-like blobs */}
             <circle cx="12" cy="12" r="8" fill={`url(#${gradId})`} />
             <circle cx="8" cy="14" r="5" fill={`url(#${gradId})`} opacity="0.7"/>
             <circle cx="16" cy="10" r="4" fill={`url(#${gradId})`} opacity="0.7"/>
             
             {/* Swirl lines */}
             <path d="M7 12a3 3 0 0 1 3-3" stroke="white" strokeOpacity="0.2" fill="none"/>
           </svg>
        );
      default:
        return null;
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
