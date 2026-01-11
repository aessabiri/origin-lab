import { PARTICLE_TYPES } from '../constants/particles';

export const createGasParticle = (width, height) => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - 0.5) * 20,
  vy: (Math.random() - 0.5) * 20,
  mass: 1,
  type: PARTICLE_TYPES.HYDROGEN,
  color: '#3b82f6', // blue-500
  life: 100,
});

export const updateSimulation = (dt, particles, gravityWells, width, height, onDiscover, onFusion) => {
  // Update Gravity Wells
  for (let i = gravityWells.length - 1; i >= 0; i--) {
    gravityWells[i].life -= dt;
    if (gravityWells[i].life <= 0) gravityWells.splice(i, 1);
  }

  // Update Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Gravity
    gravityWells.forEach(w => {
      const dx = w.x - p.x;
      const dy = w.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 1) {
        const force = w.strength / (dist * dist);
        p.vx += (dx / dist) * force * dt;
        p.vy += (dy / dist) * force * dt;
      }
    });

    // Movement
    // Cap Velocity
    const maxV = 50;
    if (Math.abs(p.vx) > maxV) p.vx = Math.sign(p.vx) * maxV;
    if (Math.abs(p.vy) > maxV) p.vy = Math.sign(p.vy) * maxV;

    p.x += p.vx * dt * 10; // Speed scale
    p.y += p.vy * dt * 10;

    // Friction
    p.vx *= 0.96;
    p.vy *= 0.96;

    // Bounds (Wrap)
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Fusion Check (Simplified N^2)
    for (let j = i - 1; j >= 0; j--) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const distSq = dx*dx + dy*dy;

      if (distSq < 400) { // Collision radius (increased)
         // Fusion Logic
         if (p.type === PARTICLE_TYPES.HYDROGEN && p2.type === PARTICLE_TYPES.HYDROGEN) {
           // Fuse to Helium
           p.type = PARTICLE_TYPES.HELIUM;
           p.color = '#fdba74'; // orange-300
           p.vx *= 0.5; p.vy *= 0.5; // Energy loss/change
           particles.splice(j, 1); // Remove p2
           if (onDiscover) onDiscover(PARTICLE_TYPES.HELIUM);
           if (onFusion) onFusion(p.x, p.y, '#fdba74');
           i--; // Adjust index
           break; 
         } else if (p.type === PARTICLE_TYPES.HELIUM && p2.type === PARTICLE_TYPES.HELIUM) {
           // Triple-alpha (simplified) -> Carbon
           p.type = PARTICLE_TYPES.CARBON;
           p.color = '#1f2937'; // gray-800
           particles.splice(j, 1);
           if (onDiscover) onDiscover(PARTICLE_TYPES.CARBON);
           if (onFusion) onFusion(p.x, p.y, '#ffffff');
           i--;
           break;
         }
         // More chains...
      }
    }
  }
};
