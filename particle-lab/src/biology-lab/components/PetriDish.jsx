import React, { useRef, useEffect } from 'react';
import { useBioStore } from '../store';

const PetriDish = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const drawCell = (ctx, agent, t) => {
      const { x, y, radius = 10, color = '#4ade80', vx = 0, vy = 0, genome = {} } = agent;
      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx);
      const diet = genome.diet || 0; // 0: Herb, 1: Carn, 2: Photo

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // --- 1. Membrane & Surface Features ---
      ctx.beginPath();
      const points = 60;
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * 2 * Math.PI;
        
        // Base organic wobble (breathing)
        let wobble = Math.sin(theta * 3 + t * 0.05) * (radius * 0.05);
        
        // Diet-specific deformation
        if (diet === 1) { // Carnivore: Sharp Teeth
           // 12 spikes. Use power to sharpen the sine wave.
           const spike = Math.sin(theta * 12);
           wobble += (spike > 0 ? Math.pow(spike, 2) : 0) * (radius * 0.3);
        } else if (diet === 0) { // Herbivore: Cilia (Fuzzy)
           // High frequency small waves
           wobble += Math.sin(theta * 30 + t * 0.2) * (radius * 0.1);
        }

        const rBase = radius + wobble;
        const rx = rBase * (1 + speed * 0.05);
        const ry = rBase * (1 - speed * 0.05);
        
        const px = rx * Math.cos(theta);
        const py = ry * Math.sin(theta);
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // --- 2. Cytoplasm & Aura ---
      if (diet === 2) { // Phototroph Glow
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      }

      const gradient = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, radius * 0.2, 0, 0, radius * 1.5);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.8, adjustColor(color, -30));
      gradient.addColorStop(1, 'rgba(0,0,0,0.1)');

      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // --- 3. Internal Organelles ---
      
      // Nucleus
      ctx.beginPath();
      ctx.arc(-speed * 2, 0, radius * 0.3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();
      
      // Diet-specific internals
      if (diet === 2) { // Chloroplasts for Phototrophs
        ctx.fillStyle = '#22c55e'; // green-500
        for(let c=0; c<5; c++) {
          const cAngle = (c / 5) * Math.PI * 2 + t * 0.02;
          const cx = Math.cos(cAngle) * (radius * 0.5);
          const cy = Math.sin(cAngle) * (radius * 0.5);
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.15, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Mitochondria
      const mitoCount = Math.floor(genome.metabolism * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      for(let j=0; j<mitoCount; j++) {
          const mAngle = (j / mitoCount) * Math.PI * 2 + t * 0.05;
          const mR = radius * 0.6;
          const mx = Math.cos(mAngle) * mR;
          const my = Math.sin(mAngle) * mR;
          ctx.beginPath();
          ctx.ellipse(mx, my, radius*0.1, radius*0.05, mAngle, 0, 2*Math.PI);
          ctx.fill();
      }

      // --- 4. Flagella ---
      if (genome.speed > 1.2) {
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        for (let k = 0; k < 15; k++) {
            const tailX = -radius - k * (radius * 0.2);
            const tailY = Math.sin(k * 0.6 - t * 0.4) * (k * 0.4) * (speed * 0.6);
            ctx.lineTo(tailX, tailY);
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = diet === 1 ? 3 : 1.5; // Thicker tail for carnivores
        ctx.stroke();
      }

      ctx.restore();
    };

    const render = () => {
      time++;
      const { agents, foodItems, toxins } = useBioStore.getState();

      // Clear with Fluid Background
      // ctx.clearRect(0, 0, canvas.width, canvas.height); // Too clean
      // Trail effect:
      ctx.fillStyle = 'rgba(19, 78, 74, 0.25)'; // teal-900 with fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Draw Grid (Subtle) ---
      ctx.strokeStyle = 'rgba(17, 94, 89, 0.3)';
      ctx.lineWidth = 1;
      // ... existing grid code or simplified ...
      
      // --- Draw Food (Organic Particles) ---
      foodItems.forEach(food => {
        ctx.beginPath();
        // Pulsing glow
        const pulse = Math.sin(time * 0.1 + food.x) * 1 + 3;
        ctx.arc(food.x, food.y, pulse, 0, 2 * Math.PI);
        ctx.fillStyle = '#fde047'; // yellow
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // --- Draw Toxins (Gas Cloud) ---
      toxins.forEach(t => {
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.radius);
        grad.addColorStop(0, 'rgba(162, 28, 175, 0.8)'); // Core
        grad.addColorStop(0.5, 'rgba(162, 28, 175, 0.2)');
        grad.addColorStop(1, 'rgba(162, 28, 175, 0)'); // Edge
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        // Expand/Contract slightly
        const breath = Math.sin(time * 0.05) * 5;
        ctx.arc(t.x, t.y, t.radius + breath, 0, 2 * Math.PI);
        ctx.fill();
      });

      // --- Draw Agents ---
      agents.forEach(agent => drawCell(ctx, agent, time));

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Helper to darken colors for gradients
  const adjustColor = (hex, amount) => {
    try {
        let color = hex.replace('#', '');
        if (color.length === 3) color = color.split('').map(c => c + c).join('');
        const num = parseInt(color, 16);
        let r = (num >> 16) + amount;
        let g = ((num >> 8) & 0x00FF) + amount;
        let b = (num & 0x00FF) + amount;
        return '#' + (
          0x1000000 +
          (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x10000 +
          (g < 255 ? (g < 1 ? 0 : g) : 255) * 0x100 +
          (b < 255 ? (b < 1 ? 0 : b) : 255)
        ).toString(16).slice(1);
    } catch (e) {
        return hex;
    }
  };

  // Handle resizing...
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
      }
    });
    resizeObserver.observe(canvas.parentNode);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
  );
};

export default PetriDish;
