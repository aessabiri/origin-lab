import React from 'react';

const ANIMATIONS = (
  <style>{`
    @keyframes rise {
      0% { transform: translateY(0) scale(0.5); opacity: 0; }
      20% { opacity: 0.8; }
      100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
    }
    .bubble {
      animation: rise 2s infinite linear;
      transform-origin: center;
    }
    .bubble:nth-child(1) { animation-duration: 1.5s; animation-delay: 0s; left: 20%; }
    .bubble:nth-child(2) { animation-duration: 2.2s; animation-delay: 0.2s; left: 50%; }
    .bubble:nth-child(3) { animation-duration: 1.8s; animation-delay: 0.5s; left: 80%; }
    .bubble:nth-child(4) { animation-duration: 2.5s; animation-delay: 1s; left: 35%; }
    .bubble:nth-child(5) { animation-duration: 1.2s; animation-delay: 0.8s; left: 65%; }
  `}</style>
);

const DEFS = (
  <defs>
    <linearGradient id="glass-gloss" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
        <stop offset="20%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
        <stop offset="80%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
    </linearGradient>
    <linearGradient id="metal-gloss" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#888" />
        <stop offset="50%" stopColor="#fff" />
        <stop offset="100%" stopColor="#555" />
    </linearGradient>
  </defs>
);

const Bubbles = ({ active, width = 100, yStart = 100 }) => {
    if (!active) return null;
    return (
        <g className="bubbles">
            {[1,2,3,4,5].map(i => (
                <circle 
                    key={i} 
                    cx={Math.random() * width} 
                    cy={yStart + Math.random() * 10} 
                    r={2 + Math.random() * 2} 
                    fill="rgba(255,255,255,0.4)" 
                    className="bubble" 
                />
            ))}
        </g>
    );
};

const Fumes = ({ active }) => {
    if (!active) return null;
    return (
        <div className="absolute -top-10 left-0 right-0 h-20 flex justify-center opacity-50 pointer-events-none">
            <div className="w-20 h-20 bg-white blur-xl rounded-full animate-pulse transform -translate-y-4"></div>
        </div>
    );
};

const BeakerShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles }) => (
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-xl overflow-visible">
        {DEFS}
        <clipPath id="beaker-clip">
             <path d="M 10 10 L 15 110 Q 50 115 85 110 L 90 10" />
        </clipPath>
        
        {hasPrecipitate && (
            <path d="M 15 105 Q 50 115 85 105 L 85 110 Q 50 115 15 110 Z" fill="#e5e7eb" opacity="0.8" clipPath="url(#beaker-clip)" />
        )}

        <g clipPath="url(#beaker-clip)">
            <rect x="0" y={110 - (fillPercentage * 1.0)} width="100" height="120" fill={fluidColor} opacity="0.8" className="transition-all duration-500" />
            <Bubbles active={showBubbles} width={80} yStart={100} />
        </g>
        
        <path d="M 10 10 L 15 110 Q 50 115 85 110 L 90 10" fill="url(#glass-gloss)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <path d="M 10 10 Q 50 15 90 10" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />
        <path d="M 0 5 L 10 10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
            <line x1="20" y1="90" x2="40" y2="90" />
            <line x1="20" y1="70" x2="50" y2="70" />
            <line x1="20" y1="50" x2="40" y2="50" />
            <line x1="20" y1="30" x2="50" y2="30" />
        </g>
    </svg>
);

const FlaskShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles }) => (
    <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-xl overflow-visible">
        {DEFS}
        <clipPath id="flask-clip">
             <path d="M 35 0 V 40 L 5 130 Q 50 140 95 130 L 65 40 V 0" />
        </clipPath>
        
        {hasPrecipitate && (
            <path d="M 5 130 Q 50 145 95 130 L 95 125 Q 50 140 5 125 Z" fill="#e5e7eb" opacity="0.8" clipPath="url(#flask-clip)" />
        )}

        <g clipPath="url(#flask-clip)">
            <rect x="0" y={140 - (fillPercentage * 1.0)} width="100" height="140" fill={fluidColor} opacity="0.8" className="transition-all duration-500" />
            <Bubbles active={showBubbles} width={90} yStart={130} />
        </g>

        <path d="M 35 0 V 40 L 5 130 Q 50 140 95 130 L 65 40 V 0" fill="url(#glass-gloss)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <ellipse cx="50" cy="0" rx="15" ry="3" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    </svg>
);

const ReactorShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles }) => (
    <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-2xl overflow-visible">
        {DEFS}
        <rect x="5" y="5" width="90" height="130" rx="10" fill="none" stroke="#555" strokeWidth="4" />
        <rect x="0" y="0" width="100" height="10" fill="#333" />
        <rect x="0" y="130" width="100" height="10" fill="#333" />
        
        <clipPath id="reactor-clip">
             <rect x="15" y="15" width="70" height="110" rx="5" />
        </clipPath>
        
        <rect x="15" y="15" width="70" height="110" rx="5" fill="#111" opacity="0.5" />
        
        {hasPrecipitate && (
            <rect x="15" y="120" width="70" height="5" fill="#e5e7eb" opacity="0.8" clipPath="url(#reactor-clip)" />
        )}

        <g clipPath="url(#reactor-clip)">
            <rect x="0" y={125 - (fillPercentage * 1.1)} width="100" height="140" fill={fluidColor} opacity="0.9" className="transition-all duration-500" />
            <Bubbles active={showBubbles} width={70} yStart={120} />
        </g>
        
        <rect x="15" y="15" width="70" height="110" rx="5" fill="url(#glass-gloss)" opacity="0.3" pointerEvents="none" />
        
        <circle cx="5" cy="5" r="2" fill="#888" />
        <circle cx="95" cy="5" r="2" fill="#888" />
        <circle cx="5" cy="135" r="2" fill="#888" />
        <circle cx="95" cy="135" r="2" fill="#888" />
    </svg>
);

const CrucibleShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles }) => (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl overflow-visible">
        {DEFS}
        <clipPath id="crucible-clip">
             <path d="M 10 10 Q 50 80 90 10" />
        </clipPath>
        
        {hasPrecipitate && (
             <path d="M 20 50 Q 50 70 80 50 L 80 60 Q 50 80 20 60 Z" fill="#333" opacity="0.5" clipPath="url(#crucible-clip)" />
        )}

        <g clipPath="url(#crucible-clip)">
            <rect x="0" y={80 - (fillPercentage * 0.7)} width="100" height="80" fill={fluidColor} opacity="1" className="transition-all duration-500" />
            <Bubbles active={showBubbles} width={80} yStart={70} />
        </g>
        
        <path d="M 5 5 L 10 10 Q 50 80 90 10 L 95 5" fill="none" stroke="#ddd" strokeWidth="8" />
        <path d="M 5 5 L 10 10 Q 50 80 90 10 L 95 5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
    </svg>
);

const VialShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles }) => (
    <svg viewBox="0 0 40 120" className="w-full h-full drop-shadow-lg overflow-visible">
        {DEFS}
        <clipPath id="vial-clip">
             <path d="M 5 0 V 110 Q 20 120 35 110 V 0" />
        </clipPath>
        
        {hasPrecipitate && (
            <path d="M 5 108 Q 20 115 35 108 L 35 110 Q 20 120 5 110 Z" fill="#e5e7eb" opacity="0.8" clipPath="url(#vial-clip)" />
        )}

        <g clipPath="url(#vial-clip)">
            <rect x="0" y={120 - (fillPercentage * 1.2)} width="40" height="120" fill={fluidColor} opacity="0.8" className="transition-all duration-500" />
            <Bubbles active={showBubbles} width={30} yStart={110} />
        </g>
        
        <path d="M 5 0 V 110 Q 20 120 35 110 V 0" fill="url(#glass-gloss)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    </svg>
);

const VesselVisuals = ({ variant = 'flask', fillPercentage, fluidColor, hasPrecipitate, temp = 20, isReacting = false, children }) => {
    const showBubbles = isReacting || temp >= 90;
    const showFumes = temp >= 90;

    let Component;
    switch (variant) {
        case 'beaker': Component = BeakerShape; break;
        case 'reactor': Component = ReactorShape; break;
        case 'crucible': Component = CrucibleShape; break;
        case 'vial': Component = VialShape; break;
        case 'condenser': 
        case 'flask': 
        default: Component = FlaskShape; break;
    }

    return (
        <div className="relative w-full h-full flex items-end justify-center">
            {ANIMATIONS}
            {showFumes && <Fumes active={true} />}
            <Component 
                fillPercentage={fillPercentage} 
                fluidColor={fluidColor} 
                hasPrecipitate={hasPrecipitate} 
                showBubbles={showBubbles}
            />
            {children}
        </div>
    );
};

export default VesselVisuals;
