import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useStore } from '../store';
import { useInventory } from '../store/inventory';
import { PARTICLE_TYPES } from '../constants/particles';
import { updateSimulation, createGasParticle } from './stellarLogic';

const ERAS = {
  SINGULARITY: { name: 'The Singularity', end: 0, color: 'text-white', desc: 'Infinite density. Zero volume.' },
  INFLATION: { name: 'Cosmic Inflation', end: 1e-32, color: 'text-fuchsia-400', desc: 'Space expands faster than light.' },
  QUARK_EPOCH: { name: 'Quark Epoch', end: 1e-6, color: 'text-rose-500', desc: 'Quark-Gluon Plasma. Too hot for protons.' },
  HADRON_EPOCH: { name: 'Hadron Epoch', end: 1, color: 'text-orange-400', desc: 'Quarks bind into Protons and Neutrons.' },
  PRIMORDIAL: { name: 'Photon Epoch', end: 380000, color: 'text-yellow-200', desc: 'Universe is an opaque plasma fog.' },
  DARK_AGES: { name: 'Cosmic Dark Ages', end: 100000000, color: 'text-slate-500', desc: 'Neutral atoms form. The universe becomes transparent.' },
  STELLAR: { name: 'Stellar Era', end: 13800000000, color: 'text-blue-300', desc: 'Gravity collapses gas clouds into stars.' },
};

const StellarNursery = () => {
  const canvasRef = useRef(null);
  const showMessage = useStore(state => state.showMessage);
  const setDiscoveredAtoms = useStore(state => state.setDiscoveredAtoms);
  const { energy, triggerBigBang } = useInventory();
  
  const [time, setTime] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [whiteoutOpacity, setWhiteoutOpacity] = useState(0);

  const currentEra = useMemo(() => {
    if (time < 0) return ERAS.SINGULARITY;
    if (time < 1e-40) return ERAS.INFLATION;
    if (time < 1e-12) return ERAS.QUARK_EPOCH;
    if (time < 1e-7) return ERAS.HADRON_EPOCH;
    if (time < 380000) return ERAS.PRIMORDIAL;
    if (time < 100000000) return ERAS.DARK_AGES;
    return ERAS.STELLAR;
  }, [time]);

  const simState = useRef({
    particles: [],
    stars: [],
    gravityWells: [],
    visualEffects: [],
    lastFrame: 0,
    plasmaParticles: [],
    inflationScale: 1,
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

  const handleBigBang = () => {
    setWhiteoutOpacity(1);
    setTimeout(() => {
      triggerBigBang();
      setTime(1e-60);
      setIsPlaying(true);
      setPlaybackSpeed(0.1);
      
      simState.current.plasmaParticles = [];
      for(let i=0; i<300; i++) {
        simState.current.plasmaParticles.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          vx: (Math.random() - 0.5) * 2000, 
          vy: (Math.random() - 0.5) * 2000,
          color: ['#ef4444', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 3)],
          type: 'quark'
        });
      }

      setTimeout(() => {
        setWhiteoutOpacity(0);
      }, 100);
    }, 2000); 
  };

  useEffect(() => {
    // Init Plasma Visuals for Pre-Bang (Singularity sparks)
    // Note: The loop handles the singularity rendering using Math.random in draw loop,
    // but we can prep some data here if needed.
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < 50; i++) {
      simState.current.particles.push(createGasParticle(width, height));
    }
  }, []);

  const timeRef = useRef(time);
  useEffect(() => { timeRef.current = time; }, [time]);

  const handleCanvasClick = (e) => {
    if (timeRef.current < ERAS.STELLAR.start) return; 
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

  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = (timestamp) => {
      const dt = 0.016; 
      let t = timeRef.current;
      
      let era = ERAS.STELLAR;
      if (t < 0) era = ERAS.SINGULARITY;
      else if (t < 1e-40) era = ERAS.INFLATION;
      else if (t < 1e-12) era = ERAS.QUARK_EPOCH;
      else if (t < 1e-7) era = ERAS.HADRON_EPOCH;
      else if (t < 380000) era = ERAS.PRIMORDIAL;
      else if (t < 100000000) era = ERAS.DARK_AGES;

      if (isPlaying && t >= 0) {
         let growth = t === 0 ? 1e-60 : t * 0.05 * playbackSpeed;
         if (era === ERAS.INFLATION) growth = 1e-50;
         if (era === ERAS.STELLAR) growth = 100000 * playbackSpeed;
         t += growth;
         setTime(t);
      }

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (era === ERAS.SINGULARITY) {
         const cx = canvas.width / 2;
         const cy = canvas.height / 2;
         const shakeX = (Math.random() - 0.5) * 10;
         const shakeY = (Math.random() - 0.5) * 10;
         
         ctx.beginPath();
         ctx.arc(cx + shakeX, cy + shakeY, 20, 0, Math.PI * 2);
         ctx.fillStyle = 'white';
         ctx.shadowColor = 'white';
         ctx.shadowBlur = 50 + Math.sin(timestamp * 0.01) * 20;
         ctx.fill();
         ctx.shadowBlur = 0;

         ctx.strokeStyle = `hsl(${timestamp * 0.5}, 100%, 50%)`;
         ctx.lineWidth = 2;
         for(let i=0; i<10; i++) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + (Math.random()-0.5)*200, cy + (Math.random()-0.5)*200);
            ctx.stroke();
         }
      } else if (era === ERAS.INFLATION) {
         const cx = canvas.width / 2;
         const cy = canvas.height / 2;
         simState.current.inflationScale *= 1.1;
         
         ctx.save();
         ctx.translate(cx, cy);
         ctx.scale(simState.current.inflationScale, simState.current.inflationScale);
         ctx.beginPath();
         ctx.arc(0, 0, 10, 0, Math.PI * 2);
         ctx.fillStyle = 'white';
         ctx.fill();
         ctx.restore();
         
         ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, simState.current.inflationScale * 0.01)})`;
         ctx.fillRect(0,0,canvas.width, canvas.height);
      } else if (era === ERAS.QUARK_EPOCH || era === ERAS.HADRON_EPOCH) {
         if (era === ERAS.QUARK_EPOCH) {
             ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
             ctx.fillRect(0,0,canvas.width, canvas.height);
         }

         simState.current.plasmaParticles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            simState.current.plasmaParticles.forEach(p2 => {
               const dx = p.x - p2.x;
               const dy = p.y - p2.y;
               if (dx*dx + dy*dy < 2000) {
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
                  ctx.stroke();
               }
            });
         });
      } else if (era === ERAS.STELLAR || era === ERAS.DARK_AGES) {
         if (era === ERAS.STELLAR) {
             updateSimulation(dt, simState.current.particles, simState.current.stars, simState.current.gravityWells, canvas.width, canvas.height, discover, onFusion, onStarFormation);
         }
         
         for (let i = simState.current.visualEffects.length - 1; i >= 0; i--) {
            simState.current.visualEffects[i].life -= dt * 2;
            if (simState.current.visualEffects[i].life <= 0) simState.current.visualEffects.splice(i, 1);
         }

         if (era === ERAS.DARK_AGES) {
             ctx.fillStyle = 'black';
             ctx.fillRect(0,0,canvas.width, canvas.height);
             ctx.fillStyle = 'rgba(255,255,255,0.5)';
             ctx.textAlign = 'center';
             ctx.font = '20px monospace';
             ctx.fillText('The Dark Ages... Hydrogen is condensing.', canvas.width/2, canvas.height/2);
         } else {
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
      }

      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []); 

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(t => {
           if (t >= ERAS.STELLAR.end) { setIsPlaying(false); return t; }
           let step = 10000; 
           if (t > ERAS.PRIMORDIAL.end) step = 500000;
           if (t > ERAS.DARK_AGES.end) step = 20000000;
           return t + step;
        });
      }, 50); 
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (t) => {
    if (t < 0) return "T - ???";
    if (t < 1e-9) return `${(t * 1e43).toExponential(2)} Planck Times`;
    if (t < 1) return `${t.toExponential(2)} Seconds`;
    if (t < 1000000) return `${t.toFixed(0)} Years`;
    return `${(t/1000000000).toFixed(2)} Billion Years`;
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden font-mono text-white select-none">
      <div className="absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-[3000ms] ease-out" style={{ opacity: whiteoutOpacity }} />
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} onClick={handleCanvasClick} className={time > ERAS.STELLAR.start ? "cursor-crosshair" : "cursor-default"} />
      
      {/* Big Bang Button Overlay */}
      {time < 0 && whiteoutOpacity === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40">
           <h1 className="text-6xl font-black mb-8 animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">SINGULARITY DETECTED</h1>
           <p className="text-gray-500 max-w-md mx-auto mb-8 bg-black/50 p-2 rounded backdrop-blur-sm">
             The universe is dense, hot, and infinitely small. Time has not yet begun.
           </p>
           <button onClick={handleBigBang} className="group relative px-12 py-6 bg-white text-black font-bold text-2xl tracking-[0.5em] hover:scale-110 transition-transform shadow-[0_0_100px_white] rounded-full overflow-hidden">
             <span className="relative z-10">INITIATE</span>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
           </button>
        </div>
      )}

      {time >= 0 && (
      <>
        <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 backdrop-blur-md">
             <h2 className={`text-2xl font-bold ${currentEra.color.replace('bg-', 'text-')}`}>{currentEra.name}</h2>
             <p className="text-slate-400 text-sm">{currentEra.desc}</p>
             <p className="text-xl mt-2 font-mono text-white">{formatTime(time)}</p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-2/3 max-w-3xl bg-slate-900/90 p-6 rounded-2xl border border-slate-700 backdrop-blur-md flex flex-col gap-4">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-2 rounded-full font-bold ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}>{isPlaying ? 'PAUSE' : 'PLAY'}</button>
              <input type="range" min="0.1" max="5" step="0.1" value={playbackSpeed} onChange={e => setPlaybackSpeed(parseFloat(e.target.value))} className="w-full accent-white" />
           </div>
           <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-widest"><span>Big Bang</span><span>First Light</span><span>Star Formation</span><span>Now</span></div>
        </div>
      </>
      )}
    </div>
  );
};

export default StellarNursery;