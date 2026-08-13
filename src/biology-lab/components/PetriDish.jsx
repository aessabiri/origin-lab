import React, { useRef, useEffect } from 'react';
import { useBioStore } from '../store';
import { drawAgent, drawFood } from '../utils/renderer';

const PetriDish = () => {
  const canvasRef = useRef(null);
  const setWorldSize = useBioStore(state => state.setWorldSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const render = () => {
      time++;
      const { agents, foodItems, toxins } = useBioStore.getState();
      const isHighPerformanceMode = agents.length > 200;

      // Clear with Fluid Background
      ctx.fillStyle = 'rgba(19, 78, 74, 0.25)'; // teal-900 with fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Draw Food ---
      foodItems.forEach(food => drawFood(ctx, food, time));

      // --- Draw Toxins (Gas Cloud) ---
      toxins.forEach(t => {
        if (isHighPerformanceMode) {
           ctx.beginPath();
           ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
           ctx.fillStyle = 'rgba(162, 28, 175, 0.5)';
           ctx.fill();
        } else {
           const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.radius);
           grad.addColorStop(0, 'rgba(162, 28, 175, 0.8)');
           grad.addColorStop(0.5, 'rgba(162, 28, 175, 0.2)');
           grad.addColorStop(1, 'rgba(162, 28, 175, 0)');
           ctx.fillStyle = grad;
           ctx.beginPath();
           const breath = Math.sin(time * 0.05) * 5;
           ctx.arc(t.x, t.y, t.radius + breath, 0, Math.PI * 2);
           ctx.fill();
        }
      });

      // --- Draw Agents ---
      agents.forEach(agent => drawAgent(ctx, agent, time, isHighPerformanceMode));

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handle resizing...
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        setWorldSize(width, height);
      }
    });
    resizeObserver.observe(canvas.parentNode);
    return () => resizeObserver.disconnect();
  }, [setWorldSize]);

  return (
    <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
  );
};

export default PetriDish;
