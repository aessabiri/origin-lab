import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useStore } from '../store';
import { useInventory } from '../store/inventory';
import { useBioStore } from '../biology-lab/store'; // Import Bio Store
import { PARTICLE_TYPES } from '../constants/particles';
import { updateSimulation, createGasParticle } from './universeLogic';

const ERAS = {
  SINGULARITY: { name: 'The Singularity', end: 0, color: 'text-white', desc: 'Infinite density. Zero volume.' },
  STELLAR: { name: 'Stellar Era', end: 13800000000, color: 'text-blue-300', desc: 'Gravity collapses gas clouds into stars.' },
};

const Universe = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  
  const showMessage = useStore(state => state.showMessage);
  const setDiscoveredAtoms = useStore(state => state.setDiscoveredAtoms);
  const { introComplete, setIntroComplete, universeMilestones, setUniverseMilestone, particles, discoveredAtoms } = useStore();
  const { triggerBigBang } = useInventory();
  const { agents } = useBioStore(); // Access Bio Agents
  
  const [time, setTime] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const simState = useRef({
    particles: [],
    stars: [],
    gravityWells: [],
    visualEffects: [],
    lastFrame: 0,
    plasmaParticles: [],
  });

  const discover = (type) => {
    const currentList = useStore.getState().discoveredAtoms;
    if (!currentList.some(a => a.type === type)) {
        setDiscoveredAtoms([...currentList, { id: type, type, discoveredAt: Date.now() }]);
        showMessage(`Stellar Discovery: ${type}!`);
    }
  };

  const onFusion = (x, y, color) => {
      simState.current.visualEffects.push({ x, y, color, life: 1.0, maxLife: 1.0, radius: 20 });
  };
  
  const onStarFormation = (star) => {
      showMessage("A new star is born!");
      simState.current.visualEffects.push({ x: star.x, y: star.y, color: 'white', life: 2.0, maxLife: 2.0, radius: 100 });
  };

  const detonateStar = (index) => {
      const star = simState.current.stars[index];
      const inventory = useInventory.getState();
      
      if (star.composition.hydrogen > 1) inventory.addResource('elements', 'hydrogen', Math.floor(star.composition.hydrogen));
      if (star.composition.helium > 1) inventory.addResource('elements', 'helium', Math.floor(star.composition.helium));
      if (star.composition.carbon > 1) inventory.addResource('elements', 'carbon', Math.floor(star.composition.carbon));
      if (star.mass > 100) inventory.addResource('elements', 'iron', Math.floor(star.mass * 0.1));
      
      simState.current.visualEffects.push({ 
          x: star.x, y: star.y, color: '#ef4444', life: 3.0, maxLife: 3.0, radius: star.radius * 5 
      });
      simState.current.stars.splice(index, 1);
      showMessage("Supernova! Elements harvested.");
  };

  const handleInitiate = () => {
    setShowVideo(true);
    setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.error("Video play failed:", e));
        }
    }, 100);
  };

  const handleVideoEnd = () => {
      setShowVideo(false);
      setIntroComplete(true);
      setShowOnboarding(true);
      
      // Initialize Simulation State
      triggerBigBang();
      setTime(1e-60);
      setIsPlaying(true);
      setPlaybackSpeed(0.5);

      // Init Plasma/Quark Soup particles
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      simState.current.plasmaParticles = [];
      // Generate some stars immediately for the effect
      for(let i=0; i<300; i++) {
        simState.current.particles.push(createGasParticle(window.innerWidth, window.innerHeight));
      }
  };

  const handleCanvasClick = (e) => {
    if (!introComplete) return; 
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedStarIndex = simState.current.stars.findIndex(s => {
        const dx = s.x - x;
        const dy = s.y - y;
        return (dx*dx + dy*dy < s.radius*s.radius * 4); 
    });

    if (clickedStarIndex !== -1) {
        detonateStar(clickedStarIndex);
        return;
    }

    simState.current.gravityWells.push({ x, y, strength: 15000, life: 15.0, maxLife: 15.0 });
    for(let i=0; i<10; i++) simState.current.particles.push(createGasParticle(canvasRef.current.width, canvasRef.current.height));
  };

  // Simulation Loop
  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = (timestamp) => {
      const dt = 0.016; 
      
      if (isPlaying && introComplete) {
         setTime(t => t + 100000 * playbackSpeed);
      }

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!introComplete && !showVideo) {
         // Singularity Idle Animation
         const cx = canvas.width / 2;
         const cy = canvas.height / 2;
         ctx.beginPath();
         ctx.arc(cx, cy, 10 + Math.sin(timestamp * 0.005) * 2, 0, Math.PI * 2);
         ctx.fillStyle = 'white';
         ctx.shadowColor = 'cyan';
         ctx.shadowBlur = 20 + Math.sin(timestamp * 0.01) * 10;
         ctx.fill();
         ctx.shadowBlur = 0;
      } else if (introComplete) {
         // Run Main Simulation
         updateSimulation(dt, simState.current.particles, simState.current.stars, simState.current.gravityWells, canvas.width, canvas.height, discover, onFusion, onStarFormation);
         
         // Render Effects
         for (let i = simState.current.visualEffects.length - 1; i >= 0; i--) {
            simState.current.visualEffects[i].life -= dt * 2;
            if (simState.current.visualEffects[i].life <= 0) simState.current.visualEffects.splice(i, 1);
         }

         // Render Background Stars
         ctx.fillStyle = 'rgba(17, 24, 39, 0.3)';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         
         simState.current.stars.forEach(s => {
             const grad = ctx.createRadialGradient(s.x, s.y, s.radius*0.2, s.x, s.y, s.radius*2);
             grad.addColorStop(0, s.color);
             grad.addColorStop(1, 'rgba(0,0,0,0)');
             ctx.fillStyle = grad;
             ctx.beginPath(); ctx.arc(s.x, s.y, s.radius*2, 0, Math.PI*2); ctx.fill();
             ctx.fillStyle = 'white';
             ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2); ctx.fill();
         });
         
         simState.current.gravityWells.forEach(w => {
            const rt = Date.now()/1000;
            const pulse = Math.sin(rt * 5) * 5;
            const radius = Math.max(10, (w.life / w.maxLife) * 40 + pulse);
            const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, radius + 20);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath(); ctx.arc(w.x, w.y, radius+20, 0, Math.PI*2); ctx.fillStyle=grad; ctx.fill();
         });

         simState.current.particles.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.type === PARTICLE_TYPES.HYDROGEN ? 2 : 4, 0, Math.PI*2);
            ctx.fillStyle = p.color; ctx.fill();
         });
         
         simState.current.visualEffects.forEach(fx => {
             ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI*2);
             ctx.strokeStyle = fx.color; ctx.stroke();
         });
      }

      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [introComplete, isPlaying, playbackSpeed]); 

  const formatTime = (t) => {
    if (t < 0) return "T - ???";
    if (t < 1000000) return `${t.toFixed(0)} Years`;
    return `${(t/1000000000).toFixed(2)} Billion Years`;
  };

  // --- PROGRESSION LOGIC ---
  const unlockCriteria = {
      galaxy: particles.length + discoveredAtoms.length >= 10,
      star: universeMilestones.galaxyFormed,
      solar: universeMilestones.starsIgnited,
      earth: universeMilestones.solarSystemFormed,
      life: universeMilestones.earthEntered && agents.length > 0,
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden font-mono text-white select-none">
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} onClick={handleCanvasClick} className={introComplete ? "cursor-crosshair" : "cursor-default"} />
      
      {/* Big Bang Video Player */}
      {showVideo && (
        <div className="absolute inset-0 z-[100] bg-black">
            <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/big_bang.mp4" 
                onEnded={handleVideoEnd}
                controls={false}
                autoPlay
            />
            <button 
                onClick={handleVideoEnd}
                className="absolute bottom-10 right-10 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-bold tracking-widest uppercase transition-all hover:scale-105 z-[101]"
            >
                Skip Sequence ↠
            </button>
        </div>
      )}

      {/* Intro Overlay: Singularity */}
      {!introComplete && !showVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40 animate-[fadeIn_2s]">
           <h1 className="text-6xl font-black mb-8 animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">SINGULARITY DETECTED</h1>
           <p className="text-gray-500 max-w-md mx-auto mb-8 bg-black/50 p-2 rounded backdrop-blur-sm">
             The universe is dense, hot, and infinitely small. Time has not yet begun.
           </p>
           <button onClick={handleInitiate} className="group relative px-12 py-6 bg-white text-black font-bold text-2xl tracking-[0.5em] hover:scale-110 transition-transform shadow-[0_0_100px_white] rounded-full overflow-hidden">
             <span className="relative z-10">INITIATE</span>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
           </button>
        </div>
      )}

      {/* Main HUD & Progression Bar */}
      {introComplete && (
      <div className="animate-[fadeIn_2s_ease-out]">
        
        {/* Top Stats */}
        <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start mt-16">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <h2 className="text-2xl font-bold text-blue-300">Stellar Era</h2>
                <p className="text-slate-400 text-sm">Gravity collapses gas clouds into stars.</p>
                <p className="text-xl mt-2 font-mono text-white">{formatTime(time)}</p>
            </div>
        </div>

        {/* Playback Controls */}
        <div className="absolute bottom-8 left-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-700 backdrop-blur-md flex gap-4 shadow-2xl">
            <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-2 rounded-full font-bold ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}>{isPlaying ? 'PAUSE' : 'PLAY'}</button>
            <div className="flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Time Scale</span>
                <input type="range" min="0.1" max="5" step="0.1" value={playbackSpeed} onChange={e => setPlaybackSpeed(parseFloat(e.target.value))} className="w-32 accent-white h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
            </div>
        </div>

        {/* --- COSMIC MILESTONE BAR --- */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 p-2 rounded-full border border-white/10 backdrop-blur-xl flex gap-2 overflow-x-auto max-w-[90vw]">
            
            <MilestoneButton 
                label="Galaxy Formation"
                icon="🌌"
                active={universeMilestones.galaxyFormed}
                locked={!unlockCriteria.galaxy}
                onClick={() => { setUniverseMilestone('galaxyFormed'); showMessage('Galaxy formed! Dark Matter acquired.'); }}
                tip="Discover 10 Particles to Unlock"
            />
            
            <MilestoneButton 
                label="Star Formation"
                icon="✨"
                active={universeMilestones.starsIgnited}
                locked={!unlockCriteria.star}
                onClick={() => { setUniverseMilestone('starsIgnited'); showMessage('Stars are igniting across the cosmos!'); }}
                tip="Form a Galaxy first"
            />

            <MilestoneButton 
                label="Solar System"
                icon="☀️"
                active={universeMilestones.solarSystemFormed}
                locked={!unlockCriteria.solar}
                onClick={() => { setUniverseMilestone('solarSystemFormed'); showMessage('Solar System accreted.'); }}
                tip="Wait for Star Formation"
            />

            <MilestoneButton 
                label="Enter Earth"
                icon="🌍"
                active={universeMilestones.earthEntered}
                locked={!unlockCriteria.earth}
                onClick={() => { setUniverseMilestone('earthEntered'); showMessage('Welcome to Earth.'); }}
                tip="Form the Solar System first"
            />

            <MilestoneButton 
                label="Plant Seed"
                icon="🌱"
                active={universeMilestones.lifePlanted}
                locked={!unlockCriteria.life}
                onClick={() => { setUniverseMilestone('lifePlanted'); showMessage('Life planted! Evolution begins.'); }}
                tip="Create a Cell in Biology Lab"
                special
            />

        </div>

        {/* Onboarding Tooltip */}
        {showOnboarding && !Object.values(universeMilestones).some(v => v) && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-6 rounded-xl shadow-2xl max-w-md animate-[bounce_1s_infinite]">
                <h3 className="text-xl font-bold mb-2">The Cosmos Awaits</h3>
                <p>Use the <strong>Laboratories</strong> above to discover particles and build the building blocks of the universe. Return here to trigger cosmic milestones below.</p>
                <button 
                    onClick={() => setShowOnboarding(false)}
                    className="mt-4 bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-50"
                >
                    Understood
                </button>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rotate-45"></div>
            </div>
        )}
      </div>
      )}
    </div>
  );
};

const MilestoneButton = ({ label, icon, active, locked, onClick, tip, special }) => (
    <div className="group relative">
        <button
            onClick={onClick}
            disabled={locked || active}
            className={`
                relative px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300
                ${active 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : locked 
                        ? 'bg-gray-800/50 text-gray-600 border border-gray-700/50 cursor-not-allowed grayscale' 
                        : special
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105'
                            : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 hover:border-blue-400 shadow-lg'
                }
            `}
        >
            <span className="text-xl">{icon}</span>
            <span className="font-bold uppercase text-xs tracking-wider whitespace-nowrap">{label}</span>
            {active && <span className="ml-2 text-green-400">✓</span>}
        </button>
        
        {/* Tooltip on Hover */}
        {locked && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2 bg-black/90 text-white text-xs text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 backdrop-blur-md">
                <span className="text-red-400 font-bold">LOCKED:</span> {tip}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-r border-b border-white/10"></div>
            </div>
        )}
    </div>
);

export default Universe;