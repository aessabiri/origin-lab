import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store';
import { PARTICLE_TYPES } from '../constants/particles';
import { updateSimulation, createGasParticle } from './stellarLogic';

const StellarNursery = () => {
  const canvasRef = useRef(null);
  const showMessage = useStore(state => state.showMessage);
  const setDiscoveredAtoms = useStore(state => state.setDiscoveredAtoms);

  // Simulation State
  const simState = useRef({
    particles: [],
    gravityWells: [],
    visualEffects: [], // { x, y, color, life, maxLife }
    lastFrame: 0,
  });

  const discover = (type) => {
    const currentList = useStore.getState().discoveredAtoms;
    if (!currentList.some(a => a.type === type)) {
        setDiscoveredAtoms([...currentList, { id: type, type, discoveredAt: Date.now() }]);
        showMessage(`Stellar Discovery: ${type}!`);
    }
  };

  const onFusion = (x, y, color) => {
      simState.current.visualEffects.push({
          x, y, color, life: 1.0, maxLife: 1.0, radius: 20
      });
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < 50; i++) {
      simState.current.particles.push(createGasParticle(width, height));
    }

    let animationFrameId;

    const loop = (timestamp) => {
      const dt = (timestamp - simState.current.lastFrame) / 1000 || 0.016;
      simState.current.lastFrame = timestamp;
      
      if (canvasRef.current) {
          updateSimulation(
              dt, 
              simState.current.particles, 
              simState.current.gravityWells, 
              canvasRef.current.width, 
              canvasRef.current.height, 
              discover,
              onFusion
          );
          
          // Update Effects
          for (let i = simState.current.visualEffects.length - 1; i >= 0; i--) {
              simState.current.visualEffects[i].life -= dt * 2; // Fade speed
              if (simState.current.visualEffects[i].life <= 0) simState.current.visualEffects.splice(i, 1);
          }

          draw();
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a temporary gravity well
    simState.current.gravityWells.push({ x, y, strength: 15000, life: 15.0, maxLife: 15.0 });
    
    // Add some fresh gas
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    for(let i=0; i<10; i++) {
        simState.current.particles.push(createGasParticle(width, height));
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Trail effect
    ctx.fillStyle = 'rgba(17, 24, 39, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Gravity Wells (Pulsing)
    const time = Date.now() / 1000;
    simState.current.gravityWells.forEach(w => {
        const pulse = Math.sin(time * 5) * 5;
        const radius = Math.max(10, (w.life / w.maxLife) * 40 + pulse);
        
        const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, radius + 20);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.5, 'rgba(100, 100, 255, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(w.x, w.y, radius + 20, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(w.x, w.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });

    // Draw Particles
    simState.current.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.type === PARTICLE_TYPES.HYDROGEN ? 2 : 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      if (p.type !== PARTICLE_TYPES.HYDROGEN) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
      }
    });

    // Draw Visual Effects (Explosions)
    simState.current.visualEffects.forEach(fx => {
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, fx.radius * (2 - fx.life), 0, Math.PI * 2);
        ctx.fillStyle = fx.color;
        ctx.globalAlpha = fx.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, fx.radius * (2 - fx.life) * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = fx.color;
        ctx.globalAlpha = fx.life * 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    });
  };

  return (
    <div className="w-full h-full relative bg-gray-900 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={window.innerWidth} 
        height={window.innerHeight} 
        onClick={handleCanvasClick}
        className="cursor-crosshair"
      />
      
      {/* HUD */}
      <div className="absolute top-4 left-4 p-4 bg-gray-800/80 rounded-lg backdrop-blur-md border border-gray-700 text-white max-w-sm pointer-events-none select-none">
        <h2 className="text-xl font-bold mb-2 text-yellow-400">Stellar Nursery</h2>
        <p className="text-sm text-gray-300">
          Click to create <span className="text-blue-300 font-bold">Gravity Wells</span>. 
          Compress <span className="text-blue-500 font-bold">Hydrogen</span> clouds to trigger <span className="text-orange-400 font-bold">Fusion</span>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
            <div className="px-2 py-1 bg-blue-900/50 border border-blue-500/50 rounded flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> H
            </div>
            <div className="px-2 py-1 bg-orange-900/50 border border-orange-500/50 rounded flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_10px_orange]"></div> He
            </div>
            <div className="px-2 py-1 bg-gray-700/50 border border-gray-500/50 rounded flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300 shadow-[0_0_10px_white]"></div> C
            </div>
        </div>
      </div>
    </div>
  );
};

export default StellarNursery;