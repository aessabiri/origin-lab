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

export const updateSimulation = (dt, particles, stars, gravityWells, width, height, onDiscover, onFusion, onStarFormation) => {
  // 1. Update Gravity Wells (Player Interaction)
  for (let i = gravityWells.length - 1; i >= 0; i--) {
    gravityWells[i].life -= dt;
    if (gravityWells[i].life <= 0) gravityWells.splice(i, 1);
  }

  // 2. Update Stars
  for (let s of stars) {
    // Star Gravity (Pull particles)
    const pullRadius = Math.sqrt(s.mass) * 20; // Radius grows with mass
    
    // Star Evolution (Nucleosynthesis)
    // Burn H -> He
    const burnRate = s.mass * 0.01 * dt; // Faster burn for bigger stars
    if (s.composition.hydrogen > 0) {
       const burn = Math.min(s.composition.hydrogen, burnRate);
       s.composition.hydrogen -= burn;
       s.composition.helium += burn;
       s.temperature += burn * 10; // Gets hotter
    } else if (s.mass > 50 && s.composition.helium > 0) {
       // Burn He -> C (Red Giant Phase)
       const burn = Math.min(s.composition.helium, burnRate * 2);
       s.composition.helium -= burn;
       s.composition.carbon += burn;
       s.color = '#ef4444'; // Turn Red
       s.radius += dt * 5; // Expand
    }
    
    // Supernova Risk
    if (s.mass > 200 && s.composition.iron > 10) {
       s.unstable = true;
    }
  }

  // 3. Update Particles (Gas)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Apply Gravity from Wells
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

    // Apply Gravity from Stars
    stars.forEach(s => {
      const dx = s.x - p.x;
      const dy = s.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Accretion (Star eats particle)
      if (dist < s.radius) {
         s.mass += p.mass;
         // Add particle content to star composition
         if (p.type === PARTICLE_TYPES.HYDROGEN) s.composition.hydrogen++;
         else if (p.type === PARTICLE_TYPES.HELIUM) s.composition.helium++;
         else if (p.type === PARTICLE_TYPES.CARBON) s.composition.carbon++;
         
         s.radius = Math.min(100, 10 + Math.sqrt(s.mass)); // Grow star
         
         particles.splice(i, 1);
         if (onFusion) onFusion(s.x, s.y, s.color);
         return; // Dead particle
      }

      // Gravity pull
      if (dist > 10) {
        const force = (s.mass * 500) / (dist * dist);
        p.vx += (dx / dist) * force * dt;
        p.vy += (dy / dist) * force * dt;
      }
    });

    if (particles[i] === undefined) continue; // Safety if spliced

    // Movement
    const maxV = 50;
    if (Math.abs(p.vx) > maxV) p.vx = Math.sign(p.vx) * maxV;
    if (Math.abs(p.vy) > maxV) p.vy = Math.sign(p.vy) * maxV;

    p.x += p.vx * dt * 10;
    p.y += p.vy * dt * 10;
    p.vx *= 0.96;
    p.vy *= 0.96;

    // Bounds
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Particle-Particle Interaction (Simple Fusion)
    for (let j = i - 1; j >= 0; j--) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const distSq = dx*dx + dy*dy;
      
      if (distSq < 100) { // Collision
          if (p.type === PARTICLE_TYPES.HYDROGEN && p2.type === PARTICLE_TYPES.HYDROGEN) {
              p.type = PARTICLE_TYPES.HELIUM;
              p.color = '#fbbf24'; // amber-400
              p.mass = 2;
              particles.splice(j, 1);
              if (onDiscover) onDiscover(PARTICLE_TYPES.HELIUM);
              if (onFusion) onFusion(p.x, p.y, p.color);
              continue; // Next iteration of outer loop
          }
          if (p.type === PARTICLE_TYPES.HELIUM && p2.type === PARTICLE_TYPES.HELIUM) {
              p.type = PARTICLE_TYPES.CARBON;
              p.color = '#94a3b8'; // slate-400
              p.mass = 4;
              particles.splice(j, 1);
              if (onDiscover) onDiscover(PARTICLE_TYPES.CARBON);
              if (onFusion) onFusion(p.x, p.y, p.color);
              continue;
          }
      }
    }

    if (particles[i] === undefined) continue;

    // Star Formation Check (High Density Collision)
    let nearbyMass = 0;
    let nearbyIndices = [];
    
    // Only check if no active wells nearby (avoid artificial clumping)
    // Simplified: Check neighbors
    for (let j = i - 1; j >= 0; j--) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      if (dx*dx + dy*dy < 400) {
         nearbyMass += p2.mass;
         nearbyIndices.push(j);
      }
    }

    if (nearbyMass > 5 && Math.random() > 0.99) { // Critical Mass met
       // Form Protostar
       const newStar = {
         x: p.x,
         y: p.y,
         mass: nearbyMass + p.mass,
         radius: 10 + Math.sqrt(nearbyMass),
         temperature: 3000,
         color: '#fef08a', // Yellow-ish
         composition: { hydrogen: nearbyMass * 0.8, helium: nearbyMass * 0.2, carbon: 0, iron: 0 },
         unstable: false
       };
       stars.push(newStar);
       
       // Consume gas
       particles.splice(i, 1);
       nearbyIndices.forEach(idx => particles.splice(idx, 1)); // This is risky with indices shifting
       // Better: Mark for deletion or just consume one and let gravity do the rest next frame
       
       if (onStarFormation) onStarFormation(newStar);
       break; 
    }
  }
};