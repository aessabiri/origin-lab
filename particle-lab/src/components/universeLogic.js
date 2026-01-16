import { PARTICLE_TYPES } from '../constants/particles';

export const createNebulaParticle = (width, height, offsetX = 0, offsetY = 0) => {
  // Gaussian-like distribution for Nebula clumps
  // Summing randoms approximates a normal distribution (Central Limit Theorem)
  const r = (Math.random() + Math.random() + Math.random()) / 3; 
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * 200; // Cloud radius

  let x, y;
  
  if (offsetX === 0 && offsetY === 0) {
      // Random scatter if no center provided
      x = Math.random() * width;
      y = Math.random() * height;
  } else {
      // Clumped generation around a center
      x = offsetX + Math.cos(angle) * dist * r;
      y = offsetY + Math.sin(angle) * dist * r;
  }

  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 10, // Slower initial drift for nebulae
    vy: (Math.random() - 0.5) * 10,
    mass: 1,
    type: PARTICLE_TYPES.HYDROGEN,
    color: '#3b82f6', // blue-500
    life: 100,
  };
};

export const updateSimulation = (dt, particles, stars, gravityWells, planets, width, height, onDiscover, onFusion, onStarFormation, milestones = {}) => {
  const cx = width / 2;
  const cy = height / 2;

  // 1. Update Gravity Wells (Player Interaction)
  for (let i = gravityWells.length - 1; i >= 0; i--) {
    gravityWells[i].life -= dt;
    if (gravityWells[i].life <= 0) gravityWells.splice(i, 1);
  }

  // 2. Galaxy Physics (Spiral Force)
  const isGalaxy = milestones?.galaxyFormed;
  const isSolar = milestones?.solarSystemFormed;

  // 3. Update Stars
  for (let s of stars) {
    if (isGalaxy) {
        // Pull stars into the spiral
        const dx = cx - s.x;
        const dy = cy - s.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 50) {
            const force = 2000 / (dist + 100);
            s.vx = (s.vx || 0) + (dx / dist) * force * dt;
            s.vy = (s.vy || 0) + (dy / dist) * force * dt;
            
            // Tangential velocity (Orbit)
            const tx = -dy / dist;
            const ty = dx / dist;
            s.vx += tx * 50 * dt;
            s.vy += ty * 50 * dt;
        }
        s.x += (s.vx || 0) * dt;
        s.y += (s.vy || 0) * dt;
    }

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
  
  // 3.5 Update Planets (if passed in array)
  if (planets) {
      for (let p of planets) {
          if (p.hostStar) {
             const s = p.hostStar;
             // Check if host star still exists (it might have gone supernova)
             if (!stars.includes(s)) {
                 p.hostStar = null; // Planet goes rogue
                 continue;
             }
             
             p.angle += p.speed * dt;
             p.x = s.x + Math.cos(p.angle) * p.dist;
             p.y = s.y + Math.sin(p.angle) * p.dist;
          } else {
             // Rogue planet drift
             p.x += (Math.random()-0.5);
             p.y += (Math.random()-0.5);
          }
      }
  }

  // 4. Update Particles (Gas)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Apply Galaxy Spiral Force
    if (isGalaxy) {
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 10) {
            // Stronger pull towards center
            const pull = 5000 / (dist + 50);
            p.vx += (dx / dist) * pull * dt;
            p.vy += (dy / dist) * pull * dt;

            // Spiral Tangent (The "Swirl")
            // Velocity perpendicular to the radius
            const speed = 40; 
            p.vx += (-dy / dist) * speed * dt;
            p.vy += (dx / dist) * speed * dt;
        }
    }

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

      // Planet Formation (Accretion Disk)
      // If Solar System is unlocked, particles near stars might form planets instead of being eaten
      if (isSolar && dist < s.radius * 4 && dist > s.radius * 1.5) {
          // Rare chance to form a planet
          if (Math.random() > 0.99) {
              if (planets) {
                  planets.push({
                      hostStar: s,
                      dist: dist,
                      angle: Math.atan2(dy, dx),
                      speed: (1 + Math.random()) * 0.5, // rad/s
                      size: 2 + Math.random() * 3,
                      color: ['#a3e635', '#60a5fa', '#f472b6', '#eab308'][Math.floor(Math.random()*4)], // Earth, Water, Gas, Desert
                      type: 'planet'
                  });
                  particles.splice(i, 1);
                  if (onFusion) onFusion(p.x, p.y, '#ffffff'); // Re-use fusion flash as "Ignition" visual
                  return;
              }
          }
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
    const maxV = isGalaxy ? 100 : 50;
    if (Math.abs(p.vx) > maxV) p.vx = Math.sign(p.vx) * maxV;
    if (Math.abs(p.vy) > maxV) p.vy = Math.sign(p.vy) * maxV;

    p.x += p.vx * dt * 10;
    p.y += p.vy * dt * 10;
    
    // Friction (More in a galaxy to keep it tight)
    const friction = isGalaxy ? 0.98 : 0.96;
    p.vx *= friction;
    p.vy *= friction;

    // Bounds (Wrap around)
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Star Formation Check (High Density Collision)
    // If galaxy is formed, star formation chance increases significantly in the core
    const formationChance = isGalaxy ? 0.95 : 0.99;
    
    let nearbyMass = 0;
    let nearbyIndices = [];
    
    for (let j = i - 1; j >= 0; j--) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      if (dx*dx + dy*dy < 400) {
         nearbyMass += p2.mass;
         nearbyIndices.push(j);
      }
    }

    if (nearbyMass > 5 && Math.random() > formationChance) { 
       // Form Protostar
       const newStar = {
         x: p.x,
         y: p.y,
         vx: p.vx, vy: p.vy, // Inherit momentum
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
       nearbyIndices.forEach(idx => particles.splice(idx, 1)); 
       
       if (onStarFormation) onStarFormation(newStar);
       break; 
    }
  }
};
