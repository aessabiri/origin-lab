import React, { useMemo } from 'react';

const ANIMATIONS = (
  <style>{`
    @keyframes chem-rise {
      0% { transform: translateY(0) scale(0.6); opacity: 0; }
      20% { opacity: 0.9; }
      80% { opacity: 0.9; }
      100% { transform: translateY(-70px) scale(1.3); opacity: 0; }
    }
    @keyframes chem-steam {
      0% { transform: translateY(0) scale(0.8); opacity: 0.1; }
      50% { opacity: 0.6; }
      100% { transform: translateY(-40px) scale(1.6); opacity: 0; }
    }
    @keyframes chem-fume {
      0% { transform: translateY(0) scale(0.9); opacity: 0.2; }
      50% { transform: translateY(-25px) scale(1.2); opacity: 0.7; }
      100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
    }
    @keyframes chem-shimmer {
      0% { opacity: 0.3; }
      50% { opacity: 0.8; }
      100% { opacity: 0.3; }
    }
    @keyframes chem-spark-flicker {
      0%, 100% { opacity: 0.95; stroke-dashoffset: 0; filter: drop-shadow(0 0 8px #38bdf8); }
      20% { opacity: 0.3; stroke-dashoffset: 4; filter: drop-shadow(0 0 2px #06b6d4); }
      40% { opacity: 1; stroke-dashoffset: 8; filter: drop-shadow(0 0 12px #67e8f9); }
      70% { opacity: 0.5; stroke-dashoffset: 2; filter: drop-shadow(0 0 4px #38bdf8); }
      85% { opacity: 1; stroke-dashoffset: 6; filter: drop-shadow(0 0 14px #ffffff); }
    }
    .chem-bubble {
      animation: chem-rise 1.6s infinite ease-in;
      transform-origin: center;
    }
    .chem-steam-cloud {
      animation: chem-steam 2.2s infinite ease-out;
    }
    .chem-fume-cloud {
      animation: chem-fume 1.8s infinite ease-in-out;
    }
    .chem-precipitate-shimmer {
      animation: chem-shimmer 2.5s infinite ease-in-out;
    }
    .chem-spark-arc {
      animation: chem-spark-flicker 0.12s infinite linear;
    }
  `}</style>
);

const GlassGradients = ({ id = 'chem' }) => (
  <defs>
    {/* Glass Wall Reflection */}
    <linearGradient id={`glass-wall-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
      <stop offset="15%" stopColor="rgba(255,255,255,0.4)" />
      <stop offset="35%" stopColor="rgba(255,255,255,0.06)" />
      <stop offset="70%" stopColor="rgba(255,255,255,0.03)" />
      <stop offset="85%" stopColor="rgba(255,255,255,0.35)" />
      <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
    </linearGradient>

    {/* Fluid Liquid Depth Gradient */}
    <linearGradient id={`fluid-glow-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
      <stop offset="25%" stopColor="#ffffff" stopOpacity="0.05" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
    </linearGradient>

    {/* Reactor Metal Framing */}
    <linearGradient id={`reactor-metal-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#475569" />
      <stop offset="30%" stopColor="#94a3b8" />
      <stop offset="50%" stopColor="#334155" />
      <stop offset="80%" stopColor="#64748b" />
      <stop offset="100%" stopColor="#1e293b" />
    </linearGradient>

    {/* Ceramic Texture */}
    <linearGradient id={`ceramic-body-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#e2e8f0" />
      <stop offset="40%" stopColor="#f8fafc" />
      <stop offset="80%" stopColor="#cbd5e1" />
      <stop offset="100%" stopColor="#94a3b8" />
    </linearGradient>
  </defs>
);

const BubbleParticles = React.memo(({ active, count = 8, width = 80, height = 100 }) => {
  if (!active) return null;
  const bubbles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      cx: 15 + Math.random() * (width - 30),
      cy: height - 8 - Math.random() * 12,
      r: 1.5 + Math.random() * 2.5,
      delay: (i * 0.22).toFixed(2),
      duration: (1.2 + Math.random() * 0.8).toFixed(2)
    }));
  }, [count, width, height]);

  return (
    <g className="bubbles-group pointer-events-none">
      {bubbles.map((b, i) => (
        <circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill="rgba(255,255,255,0.75)"
          className="chem-bubble"
          style={{
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`
          }}
        />
      ))}
    </g>
  );
});

// Multi-Phase Fluid Physics Layering Helpers
const HeadspaceGasLayer = ({ multiPhase, liquidY, width = 110, topY = 4 }) => {
  if (!multiPhase || !multiPhase.hasHeadspaceGas || liquidY <= topY) return null;
  return (
    <rect 
      x="0" 
      y={topY} 
      width={width} 
      height={Math.max(0, liquidY - topY)} 
      fill={multiPhase.headspaceColor} 
      className="transition-all duration-500" 
      pointerEvents="none" 
    />
  );
};

const MultiPhaseFluidLayers = ({ 
  fillPercentage, 
  fluidColor, 
  multiPhase, 
  liquidY, 
  bottomY, 
  width = 110,
  glowId = 'beaker',
  rx = 40,
  cx = 55
}) => {
  if (fillPercentage <= 0) return null;

  const hasTwoPhases = multiPhase && multiPhase.hasOrganicPhase && multiPhase.hasAqueousPhase;
  const totalLiq = (multiPhase?.organicVolume || 0) + (multiPhase?.aqueousVolume || 0);
  const aqRatio = totalLiq > 0 ? (multiPhase.aqueousVolume / totalLiq) : 1;

  if (hasTwoPhases) {
    const liquidTotalHeight = bottomY - liquidY;
    const aqHeight = liquidTotalHeight * aqRatio;
    const interfaceY = bottomY - aqHeight;

    return (
      <>
        {/* Lower Aqueous Layer */}
        <rect x="0" y={interfaceY} width={width} height={bottomY - interfaceY} fill={multiPhase.aqueousColor || fluidColor} className="transition-all duration-300" />
        
        {/* Upper Floating Organic Layer */}
        <rect x="0" y={liquidY} width={width} height={interfaceY - liquidY} fill={multiPhase.organicColor || '#f59e0b'} className="transition-all duration-300" />
        <rect x="0" y={liquidY} width={width} height={liquidTotalHeight} fill={`url(#fluid-glow-${glowId})`} />

        {/* Phase Interface Meniscus */}
        <ellipse cx={cx} cy={interfaceY} rx={rx * 0.95} ry="2.5" fill="rgba(255,255,255,0.4)" stroke="rgba(245,158,11,0.6)" strokeWidth="0.8" />
        
        {/* Top Surface Meniscus */}
        <ellipse cx={cx} cy={liquidY} rx={rx} ry="3.5" fill="rgba(255,255,255,0.3)" />
      </>
    );
  }

  // Single phase
  const displayColor = (multiPhase && multiPhase.hasOrganicPhase) ? multiPhase.organicColor : fluidColor;
  return (
    <>
      <rect x="0" y={liquidY} width={width} height={bottomY - liquidY} fill={displayColor} className="transition-all duration-300" />
      <rect x="0" y={liquidY} width={width} height={bottomY - liquidY} fill={`url(#fluid-glow-${glowId})`} />
      <ellipse cx={cx} cy={liquidY} rx={rx} ry="3.5" fill="rgba(255,255,255,0.3)" />
    </>
  );
};

// 1. BEAKER SHAPE
const BeakerShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles, temp, multiPhase }) => {
  const liquidY = 114 - (fillPercentage * 0.95);
  return (
    <svg viewBox="0 0 110 130" className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] overflow-visible">
      <GlassGradients id="beaker" />
      <clipPath id="beaker-inner-clip">
        <path d="M 12 12 L 18 114 Q 55 118 92 114 L 98 12 Z" />
      </clipPath>

      {/* Multi-Phase Fluid Layers */}
      <g clipPath="url(#beaker-inner-clip)">
        <HeadspaceGasLayer multiPhase={multiPhase} liquidY={liquidY} width={110} topY={12} />
        <MultiPhaseFluidLayers 
          fillPercentage={fillPercentage} 
          fluidColor={fluidColor} 
          multiPhase={multiPhase} 
          liquidY={liquidY} 
          bottomY={114} 
          width={110} 
          glowId="beaker" 
          rx={40} 
          cx={55} 
        />

        {/* Precipitate Bed */}
        {hasPrecipitate && (
          <g className="chem-precipitate-shimmer">
            <path d="M 18 106 Q 55 116 92 106 L 92 116 Q 55 120 18 116 Z" fill="#e2e8f0" opacity="0.85" />
            <circle cx="35" cy="112" r="1.5" fill="#ffffff" opacity="0.9" />
            <circle cx="55" cy="114" r="2" fill="#cbd5e1" opacity="0.9" />
            <circle cx="75" cy="111" r="1.2" fill="#ffffff" opacity="0.9" />
          </g>
        )}

        <BubbleParticles active={showBubbles} count={showBubbles ? 7 : 0} width={90} height={115} />
      </g>

      {/* Glass Body & Specular Highlights */}
      <path d="M 12 12 L 18 114 Q 55 118 92 114 L 98 12" fill="url(#glass-wall-beaker)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" />
      {/* Lip Spout */}
      <path d="M 3 6 L 12 12" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Top Rim */}
      <ellipse cx="55" cy="12" rx="43" ry="3.5" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

      {/* Measurement Graduation Lines */}
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="1" fontFamily="monospace" fontSize="5" fill="rgba(255,255,255,0.5)">
        <line x1="24" y1="95" x2="38" y2="95" /><text x="42" y="96.5">100</text>
        <line x1="24" y1="75" x2="38" y2="75" /><text x="42" y="76.5">200</text>
        <line x1="24" y1="55" x2="38" y2="55" /><text x="42" y="56.5">300</text>
        <line x1="24" y1="35" x2="38" y2="35" /><text x="42" y="36.5">400</text>
        <line x1="24" y1="20" x2="42" y2="20" /><text x="46" y="21.5">500ml</text>
      </g>
    </svg>
  );
};

// 2. ERLENMEYER / REACTION FLASK SHAPE
const FlaskShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles, temp, multiPhase }) => {
  const liquidY = 135 - (fillPercentage * 1.05);
  return (
    <svg viewBox="0 0 110 145" className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] overflow-visible">
      <GlassGradients id="flask" />
      <clipPath id="flask-inner-clip">
        <path d="M 38 4 V 38 L 8 128 Q 55 138 102 128 L 72 38 V 4 Z" />
      </clipPath>

      {/* Multi-Phase Fluid Layers */}
      <g clipPath="url(#flask-inner-clip)">
        <HeadspaceGasLayer multiPhase={multiPhase} liquidY={liquidY} width={110} topY={4} />
        <MultiPhaseFluidLayers 
          fillPercentage={fillPercentage} 
          fluidColor={fluidColor} 
          multiPhase={multiPhase} 
          liquidY={liquidY} 
          bottomY={135} 
          width={110} 
          glowId="flask" 
          rx={25 + (fillPercentage * 0.2)} 
          cx={55} 
        />

        {/* Precipitate Bed */}
        {hasPrecipitate && (
          <g className="chem-precipitate-shimmer">
            <path d="M 12 124 Q 55 136 98 124 L 98 132 Q 55 140 12 132 Z" fill="#e2e8f0" opacity="0.85" />
            <circle cx="40" cy="129" r="1.5" fill="#ffffff" />
            <circle cx="55" cy="132" r="2" fill="#cbd5e1" />
            <circle cx="70" cy="128" r="1.5" fill="#ffffff" />
          </g>
        )}

        <BubbleParticles active={showBubbles} count={showBubbles ? 8 : 0} width={90} height={130} />
      </g>

      {/* Glass Body */}
      <path d="M 38 4 V 38 L 8 128 Q 55 138 102 128 L 72 38 V 4" fill="url(#glass-wall-flask)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" />
      {/* Neck Rim */}
      <ellipse cx="55" cy="4" rx="17" ry="3.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

      {/* Graduation Markings */}
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="1" fontFamily="monospace" fontSize="5" fill="rgba(255,255,255,0.5)">
        <line x1="28" y1="108" x2="40" y2="108" /><text x="44" y="109.5">100</text>
        <line x1="33" y1="88" x2="45" y2="88" /><text x="49" y="89.5">250</text>
        <line x1="38" y1="68" x2="50" y2="68" /><text x="54" y="69.5">500ml</text>
      </g>
    </svg>
  );
};

// 3. HIGH-PRESSURE REACTOR SHAPE
const ReactorShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles, temp, multiPhase }) => {
  const liquidY = 125 - (fillPercentage * 1.05);
  return (
    <svg viewBox="0 0 110 145" className="w-full h-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)] overflow-visible">
      <GlassGradients id="reactor" />
      
      {/* Heavy Outer Chassis */}
      <rect x="6" y="6" width="98" height="132" rx="12" fill="url(#reactor-metal-reactor)" stroke="#0f172a" strokeWidth="2.5" />
      
      {/* Reinforced Bolt Rivets */}
      <circle cx="14" cy="14" r="2.5" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
      <circle cx="96" cy="14" r="2.5" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
      <circle cx="14" cy="130" r="2.5" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
      <circle cx="96" cy="130" r="2.5" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />

      {/* Top & Bottom Clamping Bars */}
      <rect x="4" y="2" width="102" height="8" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
      <rect x="4" y="134" width="102" height="8" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />

      {/* Central Quartz Inspection Window */}
      <clipPath id="reactor-window-clip">
        <rect x="18" y="18" width="74" height="108" rx="8" />
      </clipPath>

      <rect x="18" y="18" width="74" height="108" rx="8" fill="#050a14" stroke="#06b6d4" strokeWidth="1.5" />

      <g clipPath="url(#reactor-window-clip)">
        <HeadspaceGasLayer multiPhase={multiPhase} liquidY={liquidY} width={110} topY={18} />
        <MultiPhaseFluidLayers 
          fillPercentage={fillPercentage} 
          fluidColor={fluidColor} 
          multiPhase={multiPhase} 
          liquidY={liquidY} 
          bottomY={125} 
          width={110} 
          glowId="reactor" 
          rx={32} 
          cx={55} 
        />

        {hasPrecipitate && (
          <rect x="18" y="118" width="74" height="8" fill="#e2e8f0" opacity="0.85" className="chem-precipitate-shimmer" />
        )}

        <BubbleParticles active={showBubbles} count={showBubbles ? 10 : 0} width={74} height={120} />

        {/* High-Pressure Grid Overlay on Window */}
        <path d="M 18 45 H 92 M 18 72 H 92 M 18 99 H 92" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="3 3" />
      </g>

      {/* Quartz Glass Glare */}
      <rect x="18" y="18" width="74" height="108" rx="8" fill="url(#glass-wall-reactor)" opacity="0.4" pointerEvents="none" />
    </svg>
  );
};

// 4. CERAMIC CRUCIBLE SHAPE
const CrucibleShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles, temp, multiPhase }) => {
  const liquidY = 82 - (fillPercentage * 0.7);
  return (
    <svg viewBox="0 0 110 95" className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] overflow-visible">
      <GlassGradients id="crucible" />
      <clipPath id="crucible-inner-clip">
        <path d="M 14 14 Q 55 86 96 14 Z" />
      </clipPath>

      {/* Outer Ceramic Shell */}
      <path d="M 8 10 Q 55 92 102 10 L 106 14 Q 55 96 4 14 Z" fill="url(#ceramic-body-crucible)" stroke="#64748b" strokeWidth="1.5" />
      <ellipse cx="55" cy="12" rx="48" ry="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Inside Basin */}
      <g clipPath="url(#crucible-inner-clip)">
        <path d="M 14 14 Q 55 86 96 14 Z" fill="#0f172a" />
        <HeadspaceGasLayer multiPhase={multiPhase} liquidY={liquidY} width={110} topY={14} />
        <MultiPhaseFluidLayers 
          fillPercentage={fillPercentage} 
          fluidColor={fluidColor} 
          multiPhase={multiPhase} 
          liquidY={liquidY} 
          bottomY={82} 
          width={110} 
          glowId="crucible" 
          rx={30} 
          cx={55} 
        />

        {hasPrecipitate && (
          <path d="M 35 60 Q 55 78 75 60 L 75 75 Q 55 86 35 75 Z" fill="#334155" opacity="0.8" className="chem-precipitate-shimmer" />
        )}

        <BubbleParticles active={showBubbles} count={showBubbles ? 6 : 0} width={80} height={75} />
      </g>
    </svg>
  );
};

// 5. CRYO-VIAL SHAPE
const VialShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles, temp, multiPhase }) => {
  const liquidY = 120 - (fillPercentage * 1.15);
  return (
    <svg viewBox="0 0 55 135" className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] overflow-visible">
      <GlassGradients id="vial" />
      <clipPath id="vial-inner-clip">
        <path d="M 8 6 V 118 Q 27.5 128 47 118 V 6 Z" />
      </clipPath>

      {/* Liquid Contents */}
      <g clipPath="url(#vial-inner-clip)">
        <HeadspaceGasLayer multiPhase={multiPhase} liquidY={liquidY} width={55} topY={6} />
        <MultiPhaseFluidLayers 
          fillPercentage={fillPercentage} 
          fluidColor={fluidColor} 
          multiPhase={multiPhase} 
          liquidY={liquidY} 
          bottomY={120} 
          width={55} 
          glowId="vial" 
          rx={18} 
          cx={27.5} 
        />

        {hasPrecipitate && (
          <path d="M 8 114 Q 27.5 124 47 114 L 47 122 Q 27.5 130 8 122 Z" fill="#e2e8f0" opacity="0.9" className="chem-precipitate-shimmer" />
        )}

        <BubbleParticles active={showBubbles} count={showBubbles ? 5 : 0} width={45} height={120} />
      </g>

      {/* Vial Glass Tube */}
      <path d="M 8 6 V 118 Q 27.5 128 47 118 V 6" fill="url(#glass-wall-vial)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* Top Cap */}
      <rect x="5" y="2" width="45" height="6" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1" />
      <ellipse cx="27.5" cy="6" rx="20" ry="2.5" fill="rgba(255,255,255,0.2)" />

      {/* Graduations */}
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
        <line x1="12" y1="90" x2="22" y2="90" />
        <line x1="12" y1="65" x2="22" y2="65" />
        <line x1="12" y1="40" x2="22" y2="40" />
      </g>
    </svg>
  );
};

// 6. MILLER-UREY SPARK CHAMBER SHAPE
const SparkChamberShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles, temp, multiPhase }) => {
  const liquidY = 135 - (fillPercentage * 0.7);
  const isSparking = showBubbles || temp >= 60;
  return (
    <svg viewBox="0 0 110 145" className="w-full h-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)] overflow-visible">
      <GlassGradients id="spark" />
      <clipPath id="spark-inner-clip">
        <path d="M 45 4 V 30 C 20 38 12 60 12 85 C 12 115 30 138 55 138 C 80 138 98 115 98 85 C 98 60 90 38 65 30 V 4 Z" />
      </clipPath>

      {/* Headspace & Multi-Phase Fluid Layers */}
      <g clipPath="url(#spark-inner-clip)">
        <HeadspaceGasLayer multiPhase={multiPhase} liquidY={liquidY} width={110} topY={4} />
        <MultiPhaseFluidLayers 
          fillPercentage={fillPercentage} 
          fluidColor={fluidColor} 
          multiPhase={multiPhase} 
          liquidY={liquidY} 
          bottomY={138} 
          width={110} 
          glowId="spark" 
          rx={38} 
          cx={55} 
        />

        {hasPrecipitate && (
          <g className="chem-precipitate-shimmer">
            <ellipse cx="55" cy="134" rx="28" ry="4" fill="#e2e8f0" opacity="0.85" />
            <circle cx="45" cy="134" r="1.5" fill="#ffffff" />
            <circle cx="65" cy="134" r="1.5" fill="#ffffff" />
          </g>
        )}

        <BubbleParticles active={showBubbles} count={showBubbles ? 8 : 0} width={90} height={135} />
      </g>

      {/* Glass Body */}
      <path 
        d="M 45 4 V 30 C 20 38 12 60 12 85 C 12 115 30 138 55 138 C 80 138 98 115 98 85 C 98 60 90 38 65 30 V 4" 
        fill="url(#glass-wall-spark)" 
        stroke="rgba(255,255,255,0.45)" 
        strokeWidth="1.8" 
      />
      {/* Top Rim */}
      <ellipse cx="55" cy="4" rx="10" ry="2.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />

      {/* Tungsten Spark Electrodes Entering Chamber */}
      <g stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
        <line x1="2" y1="62" x2="46" y2="72" stroke="#64748b" strokeWidth="3" />
        <line x1="46" y1="72" x2="49" y2="73" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="108" y1="62" x2="64" y2="72" stroke="#64748b" strokeWidth="3" />
        <line x1="64" y1="72" x2="61" y2="73" stroke="#e2e8f0" strokeWidth="1.5" />
        <circle cx="12" cy="65" r="3.5" fill="#334155" stroke="#06b6d4" strokeWidth="1" />
        <circle cx="98" cy="65" r="3.5" fill="#334155" stroke="#06b6d4" strokeWidth="1" />
      </g>

      {/* Dynamic Lightning Electric Arc */}
      {isSparking && (
        <g className="chem-spark-arc pointer-events-none">
          <path 
            d="M 49 73 Q 53 69 55 74 Q 57 78 61 73" 
            fill="none" 
            stroke="#67e8f9" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 49 73 L 52 71 L 55 75 L 58 71 L 61 73" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="1.2" 
          />
          <circle cx="55" cy="73" r="4" fill="rgba(56,189,248,0.4)" className="animate-ping" />
        </g>
      )}
    </svg>
  );
};

// 7. ELECTROCHEMICAL CELL SHAPE
const ElectrochemicalShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles, temp, multiPhase }) => {
  const liquidY = 125 - (fillPercentage * 0.95);
  return (
    <svg viewBox="0 0 110 145" className="w-full h-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)] overflow-visible">
      <GlassGradients id="electro" />
      <clipPath id="electro-inner-clip">
        <rect x="14" y="24" width="82" height="110" rx="8" />
      </clipPath>

      {/* Headspace & Multi-Phase Fluid Layers */}
      <g clipPath="url(#electro-inner-clip)">
        <HeadspaceGasLayer multiPhase={multiPhase} liquidY={liquidY} width={110} topY={24} />
        <MultiPhaseFluidLayers 
          fillPercentage={fillPercentage} 
          fluidColor={fluidColor} 
          multiPhase={multiPhase} 
          liquidY={liquidY} 
          bottomY={134} 
          width={110} 
          glowId="electro" 
          rx={38} 
          cx={55} 
        />

        {hasPrecipitate && (
          <rect x="14" y="126" width="82" height="8" fill="#e2e8f0" opacity="0.85" className="chem-precipitate-shimmer" />
        )}

        {/* Electrode Plates Immersed into Liquid */}
        <g opacity="0.9">
          <rect x="32" y="18" width="6" height="90" rx="1.5" fill="#475569" stroke="#94a3b8" strokeWidth="0.8" />
          <text x="35" y="15" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="bold" fontFamily="monospace">+</text>
          
          <rect x="72" y="18" width="6" height="90" rx="1.5" fill="#334155" stroke="#64748b" strokeWidth="0.8" />
          <text x="75" y="15" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold" fontFamily="monospace">-</text>
        </g>

        <BubbleParticles active={showBubbles || fillPercentage > 10} count={8} width={82} height={125} />
      </g>

      {/* Reinforced Outer Jar */}
      <rect x="14" y="24" width="82" height="110" rx="8" fill="url(#glass-wall-electro)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" />
      
      {/* Top Terminal Cap & Electrical Terminals */}
      <rect x="10" y="20" width="90" height="7" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
      <circle cx="35" cy="18" r="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
      <circle cx="75" cy="18" r="3" fill="#38bdf8" stroke="#075985" strokeWidth="1" />
    </svg>
  );
};

// 8. FRACTIONAL DISTILLATION COLUMN SHAPE
const FractionalColumnShape = ({ fillPercentage, fluidColor, hasPrecipitate, showBubbles, temp, multiPhase }) => {
  const liquidY = 145 - (fillPercentage * 0.6);
  return (
    <svg viewBox="0 0 110 160" className="w-full h-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)] overflow-visible">
      <GlassGradients id="column" />
      <clipPath id="column-inner-clip">
        <path d="M 48 4 V 78 C 28 82 18 98 18 118 C 18 140 34 154 55 154 C 76 154 92 140 92 118 C 92 98 82 82 62 78 V 4 Z" />
      </clipPath>

      <g clipPath="url(#column-inner-clip)">
        <HeadspaceGasLayer multiPhase={multiPhase} liquidY={liquidY} width={110} topY={4} />
        <MultiPhaseFluidLayers 
          fillPercentage={fillPercentage} 
          fluidColor={fluidColor} 
          multiPhase={multiPhase} 
          liquidY={liquidY} 
          bottomY={154} 
          width={110} 
          glowId="column" 
          rx={34} 
          cx={55} 
        />

        {hasPrecipitate && (
          <ellipse cx="55" cy="150" rx="24" ry="3.5" fill="#e2e8f0" opacity="0.85" className="chem-precipitate-shimmer" />
        )}

        <BubbleParticles active={showBubbles} count={showBubbles ? 7 : 0} width={80} height={150} />
      </g>

      {/* Glass Body */}
      <path 
        d="M 48 4 V 78 C 28 82 18 98 18 118 C 18 140 34 154 55 154 C 76 154 92 140 92 118 C 92 98 82 82 62 78 V 4" 
        fill="url(#glass-wall-column)" 
        stroke="rgba(255,255,255,0.45)" 
        strokeWidth="1.8" 
      />

      {/* Vigreux Fractionating Column Internal Indentations */}
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round">
        <line x1="48" y1="20" x2="53" y2="23" />
        <line x1="62" y1="28" x2="57" y2="31" />
        <line x1="48" y1="36" x2="53" y2="39" />
        <line x1="62" y1="44" x2="57" y2="47" />
        <line x1="48" y1="52" x2="53" y2="55" />
        <line x1="62" y1="60" x2="57" y2="63" />
      </g>

      {/* Condenser Arm Takeoff */}
      <path d="M 62 16 L 82 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};

// VAPOR / FUME / STEAM EFFECT OVERLAYS
const AtmosphericEffects = ({ temp, activeVisual }) => {
  const isHighHeat = temp >= 90;
  const isFuming = activeVisual === 'fume';
  const isSteaming = activeVisual === 'steam' || isHighHeat;

  if (!isFuming && !isSteaming) return null;

  return (
    <div className="absolute -top-12 left-0 right-0 h-24 flex items-center justify-center pointer-events-none overflow-visible z-30">
      {isSteaming && (
        <div className="flex gap-2 opacity-60">
          <div className="w-10 h-16 bg-gradient-to-t from-cyan-400/20 via-white/30 to-transparent blur-md rounded-full chem-steam-cloud" />
          <div className="w-8 h-12 bg-gradient-to-t from-teal-300/25 via-white/20 to-transparent blur-lg rounded-full chem-steam-cloud" style={{ animationDelay: '0.6s' }} />
        </div>
      )}

      {isFuming && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-20 bg-gradient-to-t from-amber-400/25 via-rose-500/20 to-transparent blur-xl rounded-full chem-fume-cloud" />
        </div>
      )}
    </div>
  );
};

const VesselVisuals = ({ 
  variant = 'flask', 
  fillPercentage = 0, 
  fluidColor = '#38bdf8', 
  hasPrecipitate = false, 
  temp = 20, 
  isReacting = false, 
  activeVisual = null,
  multiPhase = null,
  children 
}) => {
  const showBubbles = isReacting || temp >= 95 || activeVisual === 'bubble';

  let ShapeComponent;
  switch (variant) {
    case 'beaker': ShapeComponent = BeakerShape; break;
    case 'reactor': ShapeComponent = ReactorShape; break;
    case 'crucible': ShapeComponent = CrucibleShape; break;
    case 'vial': ShapeComponent = VialShape; break;
    case 'spark': ShapeComponent = SparkChamberShape; break;
    case 'electrochemical': ShapeComponent = ElectrochemicalShape; break;
    case 'column': ShapeComponent = FractionalColumnShape; break;
    case 'condenser': 
    case 'flask': 
    default: ShapeComponent = FlaskShape; break;
  }

  return (
    <div className="relative w-full h-full flex items-end justify-center select-none">
      {ANIMATIONS}
      <AtmosphericEffects temp={temp} activeVisual={activeVisual} />
      
      <ShapeComponent 
        fillPercentage={fillPercentage} 
        fluidColor={fluidColor} 
        hasPrecipitate={hasPrecipitate} 
        showBubbles={showBubbles}
        temp={temp}
        multiPhase={multiPhase}
      />

      {children}
    </div>
  );
};

export default React.memo(VesselVisuals);

