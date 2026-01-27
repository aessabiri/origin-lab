import { PARTICLE_TYPES } from '../constants/particles';

export const BigBangPhase = {
  PRE_BANG: 0,
  INFLATION: 1,    // 0s-2s: Explosion
  PLASMA: 2,       // 2s-8s: High Energy Chaos
  DARK_AGES: 3,    // 8s-12s: Cooling
  STELLAR: 4       // 12s+: Stars form
};

export const createNebulaParticle = (width, height, offsetX = 0, offsetY = 0) => {
  const r = (Math.random() + Math.random() + Math.random()) / 3; 
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * 200; 

  let x, y;
  
  if (offsetX === 0 && offsetY === 0) {
      x = Math.random() * width;
      y = Math.random() * height;
  } else {
      x = offsetX + Math.cos(angle) * dist * r;
      y = offsetY + Math.sin(angle) * dist * r;
  }

  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10,
    mass: 1,
    type: PARTICLE_TYPES.HYDROGEN,
    color: '#3b82f6', 
    life: 100,
  };
};

export const triggerInflation = (width, height) => {
    const particles = [];
    const cx = width / 2;
    const cy = height / 2;
    
    // Create 2000 high-energy particles
    for (let i = 0; i < 2000; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 800; // FAST
        
        particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            mass: 1,
            type: 'QUARK', // Abstract type for now
            color: '#ffffff',
            life: 100
        });
    }
    return particles;
};

export const updateSimulation = (dt, particles, stars, gravityWells, planets, width, height, onDiscover, onFusion, onStarFormation, milestones = {}, bigBangPhase = BigBangPhase.STELLAR, simTime = 0) => {
  const cx = width / 2;
  const cy = height / 2;
  
  // Cinematic State (Default)
  const cinematics = {
      shake: 0,
      exposure: 0,
      colorShift: 0,
      shockwave: 0,
      zoom: 1
  };

  // --- BIG BANG PHYSICS OVERRIDES ---
  if (bigBangPhase < BigBangPhase.STELLAR) {
      
      // Calculate Cinematics based on Phase & Time
      if (bigBangPhase === BigBangPhase.INFLATION) {
          // 0s - 2s: THE EXPLOSION
          const progress = Math.min(1, simTime / 2); // 0 to 1
          
          cinematics.exposure = Math.max(0, 1 - progress); // Flash fade
          cinematics.shake = (1 - progress) * 50; // Violent shake fading out
          cinematics.zoom = 1 + (1-progress) * 2; // Rapid zoom out
          cinematics.colorShift = (1-progress) * 20;
          cinematics.shockwave = progress * 2000; // Expanding ring radius
      } 
      else if (bigBangPhase === BigBangPhase.PLASMA) {
          // 2s - 8s: THE SOUP
          // Constant low-level vibration
          cinematics.shake = 2;
          cinematics.exposure = 0.2 + Math.sin(simTime * 10) * 0.1; // Pulsing light
          cinematics.colorShift = 5;
      }
      else if (bigBangPhase === BigBangPhase.DARK_AGES) {
          // 8s - 12s: COOLING
          // Everything fades
          cinematics.exposure = 0;
          cinematics.shake = 0;
      }

      for (let p of particles) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (bigBangPhase === BigBangPhase.INFLATION) {
             // Pure radial expansion
             // Add "Light Speed" stretching visual in renderer, but physics is simple
          } 
          else if (bigBangPhase === BigBangPhase.PLASMA) {
             // Chaos: Random Jitter
             p.vx += (Math.random() - 0.5) * 5000 * dt;
             p.vy += (Math.random() - 0.5) * 5000 * dt;
             
             // High Friction to stop the initial explosion eventually
             p.vx *= 0.95;
             p.vy *= 0.95;

             // Color flicker (High Energy)
             const colors = ['#00ffff', '#ff00ff', '#ffffff', '#ffff00'];
             p.color = colors[Math.floor(Math.random() * colors.length)];
          } 
          else if (bigBangPhase === BigBangPhase.DARK_AGES) {
             // Cooling: High Friction
             p.vx *= 0.90;
             p.vy *= 0.90;
             
             // Fade to black/blue
             // Particles turn into "Protostellar Dust" (Dark Blue/Purple)
             const brightness = Math.max(0.1, 1 - ((simTime - 8) / 4));
             p.color = `rgba(30, 58, 138, ${brightness})`; 
          }

          // Bounce off walls during Big Bang to keep matter in view
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      return cinematics; // RETURN CONFIG FOR RENDERER
  }

  // --- NORMAL PHYSICS (STELLAR ERA) ---

  // 1. Update Gravity Wells
  for (let i = gravityWells.length - 1; i >= 0; i--) {
    gravityWells[i].life -= dt;
    if (gravityWells[i].life <= 0) gravityWells.splice(i, 1);
  }

  // 2. Galaxy Physics
  const isGalaxy = milestones?.galaxyFormed;
  const isSolar = milestones?.solarSystemFormed;

  // 3. Update Stars
  for (let s of stars) {
    if (isGalaxy) {
        const dx = cx - s.x;
        const dy = cy - s.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 50) {
            const force = 2000 / (dist + 100);
            s.vx = (s.vx || 0) + (dx / dist) * force * dt;
            s.vy = (s.vy || 0) + (dy / dist) * force * dt;
            
            const tx = -dy / dist;
            const ty = dx / dist;
            s.vx += tx * 50 * dt;
            s.vy += ty * 50 * dt;
        }
        s.x += (s.vx || 0) * dt;
        s.y += (s.vy || 0) * dt;
    }

    const burnRate = s.mass * 0.01 * dt;
    if (s.composition.hydrogen > 0) {
       const burn = Math.min(s.composition.hydrogen, burnRate);
       s.composition.hydrogen -= burn;
       s.composition.helium += burn;
       s.temperature += burn * 10;
    } else if (s.mass > 50 && s.composition.helium > 0) {
       const burn = Math.min(s.composition.helium, burnRate * 2);
       s.composition.helium -= burn;
       s.composition.carbon += burn;
       s.color = '#ef4444'; 
       s.radius += dt * 5; 
    }
    
    if (s.mass > 200 && s.composition.iron > 10) {
       s.unstable = true;
    }
  }
  
  // 3.5 Update Planets
  if (planets) {
      for (let p of planets) {
          if (p.hostStar) {
             const s = p.hostStar;
             if (!stars.includes(s)) {
                 p.hostStar = null; 
                 continue;
             }
             p.angle += p.speed * dt;
             p.x = s.x + Math.cos(p.angle) * p.dist;
             p.y = s.y + Math.sin(p.angle) * p.dist;
          } else {
             p.x += (Math.random()-0.5);
             p.y += (Math.random()-0.5);
          }
      }
  }

  // 4. Update Particles (Gas)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    
    // Ensure particle color is reset if coming from Dark Ages
    if (p.color.startsWith('rgba')) p.color = '#3b82f6';

    if (isGalaxy) {
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 10) {
            const pull = 5000 / (dist + 50);
            p.vx += (dx / dist) * pull * dt;
            p.vy += (dy / dist) * pull * dt;

            const speed = 40; 
            p.vx += (-dy / dist) * speed * dt;
            p.vy += (dx / dist) * speed * dt;
        }
    }

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

    stars.forEach(s => {
      const dx = s.x - p.x;
      const dy = s.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < s.radius) {
         s.mass += p.mass;
         if (p.type === PARTICLE_TYPES.HYDROGEN) s.composition.hydrogen++;
         else if (p.type === PARTICLE_TYPES.HELIUM) s.composition.helium++;
         else if (p.type === PARTICLE_TYPES.CARBON) s.composition.carbon++;
         
         s.radius = Math.min(100, 10 + Math.sqrt(s.mass));
         
         particles.splice(i, 1);
         if (onFusion) onFusion(s.x, s.y, s.color);
         return; 
      }

      if (isSolar && dist < s.radius * 4 && dist > s.radius * 1.5) {
          if (Math.random() > 0.99) {
              if (planets) {
                  planets.push({
                      hostStar: s,
                      dist: dist,
                      angle: Math.atan2(dy, dx),
                      speed: (1 + Math.random()) * 0.5,
                      size: 2 + Math.random() * 3,
                      color: ['#a3e635', '#60a5fa', '#f472b6', '#eab308'][Math.floor(Math.random()*4)],
                      type: 'planet'
                  });
                  particles.splice(i, 1);
                  if (onFusion) onFusion(p.x, p.y, '#ffffff');
                  return;
              }
          }
      }

      if (dist > 10) {
        const force = (s.mass * 500) / (dist * dist);
        p.vx += (dx / dist) * force * dt;
        p.vy += (dy / dist) * force * dt;
      }
    });

    if (particles[i] === undefined) continue; 

    const maxV = isGalaxy ? 100 : 50;
    if (Math.abs(p.vx) > maxV) p.vx = Math.sign(p.vx) * maxV;
    if (Math.abs(p.vy) > maxV) p.vy = Math.sign(p.vy) * maxV;

    p.x += p.vx * dt * 10;
    p.y += p.vy * dt * 10;
    
    const friction = isGalaxy ? 0.98 : 0.96;
    p.vx *= friction;
    p.vy *= friction;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    const formationChance = isGalaxy ? 0.95 : 0.99;
    
    let nearbyMass = 0;
    let nearbyIndices = [];
    
    for (let j = i - 1; j >= 0; j--) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const distSq = dx*dx + dy*dy;

      // Fusion Logic
      if (distSq < 100) {
          if (p.type === PARTICLE_TYPES.HYDROGEN && p2.type === PARTICLE_TYPES.HYDROGEN) {
              p.type = PARTICLE_TYPES.HELIUM;
              p.mass = 4;
              p.color = '#fbbf24';
              particles.splice(j, 1);
              if (onDiscover) onDiscover(PARTICLE_TYPES.HELIUM);
              // Adjust indices for outer loop since we modified array? 
              // No, 'j' is < 'i', so removing 'j' shifts indices < 'j', but 'i' is > 'j'. 
              // Wait, removing 'j' shifts everything > 'j' down by 1. 'i' IS > 'j'.
              // So 'i' needs to be decremented. But we are iterating 'i' downwards?
              // The outer loop is `for (let i = particles.length - 1; i >= 0; i--)`.
              // If we remove 'j' (where j < i), the element at 'i' moves to 'i-1'.
              // So next iteration of outer loop (i--) will skip the element that moved to 'i-1'.
              // So we must decrement 'i'.
              i--; 
              continue;
          }
          if (p.type === PARTICLE_TYPES.HELIUM && p2.type === PARTICLE_TYPES.HELIUM) {
              p.type = PARTICLE_TYPES.CARBON;
              p.mass = 12;
              p.color = '#1f2937';
              particles.splice(j, 1);
              if (onDiscover) onDiscover(PARTICLE_TYPES.CARBON);
              i--;
              continue;
          }
      }

      if (distSq < 400) {
         nearbyMass += p2.mass;
         nearbyIndices.push(j);
      }
    }

    if (nearbyMass > 5 && Math.random() > formationChance) { 
       const newStar = {
         x: p.x,
         y: p.y,
         vx: p.vx, vy: p.vy, 
         mass: nearbyMass + p.mass,
         radius: 10 + Math.sqrt(nearbyMass),
         temperature: 3000,
         color: '#fef08a', 
         composition: { hydrogen: nearbyMass * 0.8, helium: nearbyMass * 0.2, carbon: 0, iron: 0 },
         unstable: false
       };
       stars.push(newStar);
       
       particles.splice(i, 1);
       nearbyIndices.forEach(idx => particles.splice(idx, 1)); 
       
              if (onStarFormation) onStarFormation(newStar);
       
              break; 
       
           }
       
         }
       
         return cinematics;
       
       };
       
       