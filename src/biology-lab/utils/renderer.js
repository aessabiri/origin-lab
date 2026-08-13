// Efficient Canvas rendering for biological agents

const TWO_PI = Math.PI * 2;

/**
 * Renders a single cell to the canvas context.
 * Implements Level of Detail (LOD) based on the total number of agents.
 */
export const drawAgent = (ctx, agent, t, isHighPerformanceMode) => {
  const { x, y, radius = 10, color = '#4ade80', vx = 0, vy = 0, genome = {} } = agent;
  
  if (isHighPerformanceMode) {
    // --- Fast Render (Simple Circle) ---
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TWO_PI);
    ctx.fillStyle = color;
    ctx.fill();
    return;
  }

  // --- High Quality Render ---
  const speed = Math.sqrt(vx * vx + vy * vy);
  const angle = Math.atan2(vy, vx);
  const diet = genome.diet || 0;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Membrane with Wobble
  ctx.beginPath();
  const points = 12; // Reduced from 60 for performance
  const angleStep = TWO_PI / points;

  // Pre-calc common diet modifiers
  const isCarnivore = diet === 1;
  const isHerbivore = diet === 0;

  for (let i = 0; i <= points; i++) {
    const theta = i * angleStep;
    let wobble = Math.sin(theta * 3 + t * 0.05) * (radius * 0.1);
    
    if (isCarnivore) {
       const spike = Math.sin(theta * 6); // Fewer spikes
       wobble += (spike > 0 ? spike * spike : 0) * (radius * 0.3);
    } else if (isHerbivore) {
       wobble += Math.sin(theta * 10 + t * 0.2) * (radius * 0.1);
    }

    const rBase = radius + wobble;
    // Stretch based on speed (Squash & Stretch)
    const rx = rBase * (1 + speed * 0.05);
    const ry = rBase * (1 - speed * 0.05);
    
    const px = rx * Math.cos(theta);
    const py = ry * Math.sin(theta);
    
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  // 2. Simple Fill (Avoid Gradient for medium performance gain)
  ctx.fillStyle = color;
  ctx.fill();
  
  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 3. Nucleus (Simplified)
  ctx.beginPath();
  ctx.arc(radius * 0.2, 0, radius * 0.3, 0, TWO_PI);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  ctx.restore();
};

export const drawFood = (ctx, food, t) => {
  ctx.beginPath();
  const pulse = Math.sin(t * 0.1 + food.x) * 1 + 2; // Pre-calc radius modification
  ctx.arc(food.x, food.y, pulse + 2, 0, TWO_PI);
  ctx.fillStyle = '#fde047';
  ctx.fill();
};
