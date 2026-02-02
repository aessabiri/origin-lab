import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useStore } from '../store';
import { useInventory } from '../store/inventory';
import { useBioStore } from '../biology-lab/store'; 
import { PARTICLE_TYPES } from '../constants/particles';
import { updateSimulation, createNebulaParticle, triggerInflation, BigBangPhase } from './universeLogic';
import { useDiscoveredMatter } from '../hooks/useDiscoveredMatter';
import { MATTER_DEFINITIONS } from '../constants/matterRegistry';

const ZOOM_LEVELS = {
  GALAXY: 0,
  SOLAR: 1,
  EARTH: 2
};

const Universe = () => {
  const canvasRef = useRef(null);
  
  const showMessage = useStore(state => state.showMessage);
  const { introComplete, setIntroComplete, universeMilestones, setUniverseMilestone, particles } = useStore();
  const { discoveredAtoms } = useDiscoveredMatter();
  const { triggerBigBang } = useInventory();
  const { agents } = useBioStore(); 
  
  const [time, setTime] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [bigBangPhase, setBigBangPhase] = useState(BigBangPhase.PRE_BANG);
  const [zoomLevel, setZoomLevel] = useState(ZOOM_LEVELS.GALAXY);
  const [simTime, setSimTime] = useState(0);

  const simState = useRef({
    particles: [],
    stars: [],
    planets: [],
    gravityWells: [],
    visualEffects: [],
    lastFrame: 0,
    plasmaParticles: [],
  });

  const discover = (type) => {
    const inventory = useInventory.getState();
    if (!inventory.discoveredItems.includes(type)) {
        inventory.markDiscovered(type);
        const def = MATTER_DEFINITIONS[type];
        if (def) {
            inventory.addResource(def.inventoryCategory || 'elements', def.inventoryId || type, 1);
        }
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

  const onSupernova = (yieldMass, x, y) => {
      const inventory = useInventory.getState();
      inventory.addResource('elements', PARTICLE_TYPES.IRON, Math.floor(yieldMass * 0.2));
      inventory.addResource('elements', PARTICLE_TYPES.SILVER, Math.floor(yieldMass * 0.05));
      inventory.addResource('elements', PARTICLE_TYPES.GOLD, Math.floor(yieldMass * 0.02));
      inventory.addResource('elements', PARTICLE_TYPES.LEAD, Math.floor(yieldMass * 0.03));
      inventory.addResource('elements', PARTICLE_TYPES.URANIUM_238, Math.floor(yieldMass * 0.01));
      
      simState.current.visualEffects.push({ 
          x, y, color: '#ffffff', life: 3.0, maxLife: 3.0, radius: 200 
      });
      showMessage("Supernova! Heavy elements (Au, Ag, Pb, U) harvested.");
  };

  const detonateStar = (index) => {
      const star = simState.current.stars[index];
      const inventory = useInventory.getState();
      const yieldMass = star.mass;
      
      // Seed diverse elements into Global Inventory
      inventory.addResource('elements', PARTICLE_TYPES.IRON, Math.floor(yieldMass * 0.2));
      inventory.addResource('elements', PARTICLE_TYPES.SILVER, Math.floor(yieldMass * 0.05));
      inventory.addResource('elements', PARTICLE_TYPES.GOLD, Math.floor(yieldMass * 0.02));
      inventory.addResource('elements', PARTICLE_TYPES.LEAD, Math.floor(yieldMass * 0.03));
      inventory.addResource('elements', PARTICLE_TYPES.URANIUM_238, Math.floor(yieldMass * 0.01));
      
      // Recover basic elements too
      if (star.composition.hydrogen > 1) inventory.addResource('elements', 'hydrogen', Math.floor(star.composition.hydrogen * 0.5));
      if (star.composition.helium > 1) inventory.addResource('elements', 'helium', Math.floor(star.composition.helium * 0.5));
      
      simState.current.visualEffects.push({ 
          x: star.x, y: star.y, color: '#ffffff', life: 3.0, maxLife: 3.0, radius: star.radius * 10 
      });
      simState.current.stars.splice(index, 1);
      showMessage("Supernova! Heavy elements (Au, Ag, Pb, U) harvested.");
  };

  const populateUniverse = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      simState.current.particles = []; 
      for(let n=0; n<3; n++) {
          const cx = Math.random() * w;
          const cy = Math.random() * h;
          for(let i=0; i<150; i++) simState.current.particles.push(createNebulaParticle(w, h, cx, cy));
      }
      for(let i=0; i<100; i++) simState.current.particles.push(createNebulaParticle(w, h));
  };

  // --- MILESTONE HANDLERS ---
  const handleGalaxyFormation = () => {
      setUniverseMilestone('galaxyFormed');
      showMessage('Galaxy formed! Dark Matter acquired.');
      // Visual: Massive inward pull
      simState.current.gravityWells.push({ 
          x: window.innerWidth/2, y: window.innerHeight/2, strength: 50000, life: 5.0, maxLife: 5.0 
      });
  };

  const handleStarFormation = () => {
      setUniverseMilestone('starsIgnited');
      showMessage('Stars are igniting across the cosmos!');
      // Force trigger star formation in dense areas
      simState.current.particles.forEach(p => {
          if (Math.random() > 0.8) p.color = '#ffffff'; // Flash
      });
  };

  const handleSolarSystem = () => {
      setUniverseMilestone('solarSystemFormed');
      showMessage('Entering Solar System...');
      
      // Transition to Solar View
      setZoomLevel(ZOOM_LEVELS.SOLAR);
      
      // Clear Galaxy, Create Sol
      simState.current.particles = [];
      simState.current.stars = [{
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          mass: 1000,
          radius: 50,
          color: '#fbbf24', // Amber-400
          composition: { hydrogen: 1000, helium: 0, carbon: 0, iron: 0 },
          temperature: 5778
      }];
      simState.current.planets = [];
      
      // Create Protoplanetary Disk
      for(let i=0; i<200; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 100 + Math.random() * 300;
          simState.current.particles.push({
              x: window.innerWidth/2 + Math.cos(angle) * dist,
              y: window.innerHeight/2 + Math.sin(angle) * dist,
              vx: -Math.sin(angle) * 2, // Orbital velocity
              vy: Math.cos(angle) * 2,
              mass: 1,
              type: PARTICLE_TYPES.CARBON, // Dust
              color: '#a8a29e',
              life: 100
          });
      }
  };

  const handleEnterEarth = () => {
      setUniverseMilestone('earthEntered');
      showMessage('Welcome to Earth.');
      setZoomLevel(ZOOM_LEVELS.EARTH);
  };

  const handleInitiate = () => {
    setBigBangPhase(BigBangPhase.INFLATION);
    simState.current.particles = triggerInflation(window.innerWidth, window.innerHeight);
    setSimTime(0);
    
    setTimeout(() => setBigBangPhase(BigBangPhase.PLASMA), 2000);
    setTimeout(() => setBigBangPhase(BigBangPhase.DARK_AGES), 8000);
    setTimeout(() => {
        setBigBangPhase(BigBangPhase.STELLAR);
        setIntroComplete(true);
        setShowOnboarding(true);
        triggerBigBang();
        setTime(1e-60);
        setIsPlaying(true);
        setPlaybackSpeed(0.5);
        populateUniverse(); 
    }, 12000);
  };

  const spriteCache = useRef({});

  const getGlowSprite = (color) => {
    if (spriteCache.current[color]) return spriteCache.current[color];

    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext('2d');
    const cx = 16, cy = 16, r = 16;
    
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, color); // Center core
    
    // Hacky alpha for hex colors
    let alphaColor = color;
    if (color.startsWith('#')) {
        // Simple hex to rgba fallback
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        alphaColor = `rgba(${r},${g},${b}, 0.0)`;
        grad.addColorStop(0.2, `rgba(${r},${g},${b}, 0.5)`);
        grad.addColorStop(1, `rgba(${r},${g},${b}, 0.0)`);
    } else {
        grad.addColorStop(1, 'rgba(0,0,0,0)');
    }
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    
    spriteCache.current[color] = c;
    return c;
  };

  // --- RENDER LOOP ---
  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = (timestamp) => {
      const dt = 0.016; 
      if (isPlaying) {
         setTime(t => t + 100000 * playbackSpeed);
         setSimTime(t => t + dt);
      }

      // Clear Canvas
      ctx.fillStyle = zoomLevel === ZOOM_LEVELS.EARTH ? '#000000' : (bigBangPhase === BigBangPhase.PLASMA ? '#050505' : 'black');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!introComplete) {
         // PRE-BANG & BIG BANG CINEMATICS
         if (bigBangPhase === BigBangPhase.PRE_BANG) {
             const cx = canvas.width / 2;
             const cy = canvas.height / 2;
             ctx.beginPath();
             ctx.arc(cx, cy, 10 + Math.sin(timestamp * 0.005) * 2, 0, Math.PI * 2);
             ctx.fillStyle = 'white';
             ctx.shadowColor = 'cyan';
             ctx.shadowBlur = 20 + Math.sin(timestamp * 0.01) * 10;
             ctx.fill();
             ctx.shadowBlur = 0;
         } else {
             const cinematics = updateSimulation(dt, simState.current.particles, [], [], [], canvas.width, canvas.height, null, null, null, {}, bigBangPhase, simTime);
             
             // Apply Cinematic Shake
             ctx.save();
             const shakeX = (Math.random() - 0.5) * cinematics.shake;
             const shakeY = (Math.random() - 0.5) * cinematics.shake;
             ctx.translate(shakeX, shakeY);

             // Render Particles
             ctx.globalCompositeOperation = 'screen'; // Additive blending for nebula look
             simState.current.particles.forEach(p => {
                const r = bigBangPhase === BigBangPhase.INFLATION ? 4 : 2;
                if (bigBangPhase === BigBangPhase.INFLATION) {
                    // Solid dots for Big Bang
                    ctx.beginPath(); 
                    ctx.arc(p.x, p.y, r, 0, Math.PI*2);
                    ctx.fillStyle = p.color; 
                    ctx.fill();
                } else {
                    // Nebula Sprites for Plasma/Dark Ages
                    const sprite = getGlowSprite(p.color);
                    const size = r * 8; 
                    ctx.drawImage(sprite, p.x - size/2, p.y - size/2, size, size);
                }
             });
             ctx.globalCompositeOperation = 'source-over';
             
             ctx.restore();

             // Exposure Flash
             if (cinematics.exposure > 0.01) {
                 ctx.fillStyle = `rgba(255, 255, 255, ${cinematics.exposure})`;
                 ctx.fillRect(0, 0, canvas.width, canvas.height);
             }
         }
      } else {
         // --- STELLAR ERA ---
         if (zoomLevel === ZOOM_LEVELS.GALAXY || zoomLevel === ZOOM_LEVELS.SOLAR) {
             // Run Physics
             updateSimulation(
                 dt, 
                 simState.current.particles, 
                 simState.current.stars, 
                 simState.current.gravityWells,
                 simState.current.planets,
                 canvas.width, 
                 canvas.height, 
                 discover, 
                 onFusion, 
                 onStarFormation,
                 onSupernova,
                 universeMilestones,
                 BigBangPhase.STELLAR
             );

             // Render Stars
             simState.current.stars.forEach(s => {
                 const isExploding = s.exploding;
                 const baseColor = isExploding ? '#ffffff' : s.color;
                 const pulse = isExploding ? (Math.random() * 0.5 + 0.5) : 1.0;
                 
                 const grad = ctx.createRadialGradient(s.x, s.y, s.radius*0.1, s.x, s.y, s.radius*3);
                 grad.addColorStop(0, baseColor);
                 grad.addColorStop(0.2, baseColor.replace(')', ', 0.4)').replace('rgb', 'rgba'));
                 grad.addColorStop(1, 'rgba(0,0,0,0)');
                 
                 ctx.save();
                 if (isExploding) {
                     ctx.shadowBlur = 50 * pulse;
                     ctx.shadowColor = 'white';
                 }
                 ctx.fillStyle = grad;
                 ctx.beginPath(); ctx.arc(s.x, s.y, s.radius*3 * pulse, 0, Math.PI*2); ctx.fill();
                 ctx.fillStyle = 'white';
                 ctx.beginPath(); ctx.arc(s.x, s.y, s.radius * 0.8 * pulse, 0, Math.PI*2); ctx.fill();
                 ctx.restore();
             });

             // Render Particles (Nebula Mechanics)
             if (zoomLevel === ZOOM_LEVELS.GALAXY) {
                ctx.globalCompositeOperation = 'screen'; // Glow effect
                simState.current.particles.forEach(p => {
                    const sprite = getGlowSprite(p.color);
                    const size = 32; // Large puffs
                    ctx.drawImage(sprite, p.x - size/2, p.y - size/2, size, size);
                });
                ctx.globalCompositeOperation = 'source-over';
             } else {
                // Solar System (Dust)
                simState.current.particles.forEach(p => {
                    ctx.beginPath(); 
                    ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
                    ctx.fillStyle = p.color; 
                    ctx.fill();
                });
             }
             
             // Render Planets
             simState.current.planets.forEach(p => {
                 ctx.beginPath();
                 ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                 ctx.fillStyle = p.color;
                 ctx.fill();
             });

             // Render Gravity Wells
             simState.current.gravityWells.forEach(w => {
                const rt = Date.now()/1000;
                const radius = Math.max(10, (w.life / w.maxLife) * 40 + Math.sin(rt * 5) * 5);
                const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, radius + 30);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.beginPath(); ctx.arc(w.x, w.y, radius+30, 0, Math.PI*2); ctx.fillStyle=grad; ctx.fill();
             });

             // Render Visual Effects (Shockwaves/Flashes)
             simState.current.visualEffects.forEach((fx, i) => {
                 fx.life -= dt;
                 const alpha = fx.life / fx.maxLife;
                 const currentRadius = fx.radius * (1 + (1 - alpha) * 2);
                 
                 const grad = ctx.createRadialGradient(fx.x, fx.y, 0, fx.x, fx.y, currentRadius);
                 grad.addColorStop(0, fx.color === 'white' ? `rgba(255,255,255,${alpha})` : fx.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba'));
                 grad.addColorStop(1, 'rgba(0,0,0,0)');
                 
                 ctx.fillStyle = grad;
                 ctx.beginPath();
                 ctx.arc(fx.x, fx.y, currentRadius, 0, Math.PI*2);
                 ctx.fill();
             });
             simState.current.visualEffects = simState.current.visualEffects.filter(fx => fx.life > 0);
         }
         
         // --- EARTH VIEW ---
         if (zoomLevel === ZOOM_LEVELS.EARTH) {
             const cx = canvas.width / 2;
             const cy = canvas.height / 2;
             const time = Date.now() / 5000;
             
             // Atmosphere Glow
             const grad = ctx.createRadialGradient(cx, cy, 150, cx, cy, 220);
             grad.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
             grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
             ctx.fillStyle = grad;
             ctx.beginPath(); ctx.arc(cx, cy, 220, 0, Math.PI*2); ctx.fill();

             // Planet Body (Simple Rotation Effect)
             ctx.save();
             ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI*2); ctx.clip();
             
             // Ocean
             ctx.fillStyle = '#1e3a8a'; // Blue-900
             ctx.fillRect(cx - 150, cy - 150, 300, 300);
             
             // Continents (Procedural Noise-ish)
             ctx.fillStyle = '#15803d'; // Green-700
             for(let i=0; i<5; i++) {
                 const offset = (time * 100 + i * 100) % 500 - 100;
                 ctx.beginPath();
                 ctx.arc(cx - 150 + offset, cy - 50 + Math.sin(i)*50, 60, 0, Math.PI*2);
                 ctx.fill();
             }
             
             // Shadow (Day/Night Cycle)
             const shadowGrad = ctx.createLinearGradient(cx - 150, cy, cx + 150, cy);
             shadowGrad.addColorStop(0, 'rgba(0,0,0,0.8)');
             shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
             shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
             ctx.fillStyle = shadowGrad;
             ctx.fillRect(cx - 150, cy - 150, 300, 300);

             ctx.restore();
         }
      }

      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [introComplete, isPlaying, playbackSpeed, bigBangPhase, zoomLevel]); 

  const formatTime = (t) => {
    if (t < 0) return "T - ???";
    if (t < 1000000) return `${t.toFixed(0)} Years`;
    return `${(t/1000000000).toFixed(2)} Billion Years`;
  };

  const unlockCriteria = {
      galaxy: true, // Unlocked by default for simulation flow
      star: universeMilestones.galaxyFormed,
      solar: universeMilestones.starsIgnited,
      earth: universeMilestones.solarSystemFormed,
      life: universeMilestones.earthEntered,
  };

  return (
    <div className="w-full h-full relative bg-[#020617] overflow-hidden font-mono text-white select-none">
      <div className="film-grain" />
      <div className="absolute inset-0 vignette-overlay z-40" />
      
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className={introComplete ? "cursor-crosshair" : "cursor-default"} />
      
      {!introComplete && (
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

      {introComplete && (
      <div className="animate-[fadeIn_2s_ease-out]">
        <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start mt-16">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <h2 className="text-2xl font-bold text-blue-300">
                    {zoomLevel === ZOOM_LEVELS.GALAXY ? 'Stellar Era' : zoomLevel === ZOOM_LEVELS.SOLAR ? 'Solar System' : 'Planet Earth'}
                </h2>
                <p className="text-slate-400 text-sm">
                    {zoomLevel === ZOOM_LEVELS.GALAXY ? 'Gravity collapses gas clouds into stars.' : zoomLevel === ZOOM_LEVELS.SOLAR ? 'Accretion of planetary bodies.' : 'Awaiting the seed of life.'}
                </p>
                <p className="text-xl mt-2 font-mono text-white">{formatTime(time)}</p>
            </div>
        </div>

        <div className="absolute bottom-8 left-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-700 backdrop-blur-md flex gap-4 shadow-2xl">
            <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-2 rounded-full font-bold ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}>{isPlaying ? 'PAUSE' : 'PLAY'}</button>
            <div className="flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Time Scale</span>
                <input type="range" min="0.1" max="5" step="0.1" value={playbackSpeed} onChange={e => setPlaybackSpeed(parseFloat(e.target.value))} className="w-32 accent-white h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer" />
            </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 p-2 rounded-full border border-white/10 backdrop-blur-xl flex gap-2 overflow-x-auto max-w-[90vw]">
            <MilestoneButton 
                label="Galaxy Formation"
                icon="🌌"
                active={universeMilestones.galaxyFormed}
                locked={!unlockCriteria.galaxy}
                onClick={handleGalaxyFormation}
                tip="Discover 10 Particles to Unlock"
            />
            <MilestoneButton 
                label="Star Formation"
                icon="✨"
                active={universeMilestones.starsIgnited}
                locked={!unlockCriteria.star}
                onClick={handleStarFormation}
                tip="Form a Galaxy first"
            />
            <MilestoneButton 
                label="Solar System"
                icon="☀️"
                active={universeMilestones.solarSystemFormed}
                locked={!unlockCriteria.solar}
                onClick={handleSolarSystem}
                tip="Wait for Star Formation"
            />
            <MilestoneButton 
                label="Enter Earth"
                icon="🌍"
                active={universeMilestones.earthEntered}
                locked={!unlockCriteria.earth}
                onClick={handleEnterEarth}
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
        {locked && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2 bg-black/90 text-white text-xs text-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 backdrop-blur-md">
                <span className="text-red-400 font-bold">LOCKED:</span> {tip}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-r border-b border-white/10"></div>
            </div>
        )}
    </div>
);

export default Universe;