import { PARTICLE_TYPES } from '../constants/particles';

// --- Spatial Hash for O(1) Collision Detection ---
class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  _getKey(x, y) {
    // Bitwise floor is slightly faster for positive numbers, Math.floor safe for all
    return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
  }

  insert(entity) {
    const key = this._getKey(entity.x, entity.y);
    let cell = this.grid.get(key);
    if (!cell) {
      cell = [];
      this.grid.set(key, cell);
    }
    cell.push(entity);
  }

  // Returns array of potential neighbors
  query(x, y) {
    const key = this._getKey(x, y);
    // Return neighbors from this cell and the 8 surrounding cells for full coverage
    // Optimization: Just checking current cell is often enough if cell size > interaction radius * 2
    // But for accuracy, we check 3x3 grid around the point.
    
    // Simplified 3x3 query:
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const found = [];

    for (let i = cx - 1; i <= cx + 1; i++) {
      for (let j = cy - 1; j <= cy + 1; j++) {
        const k = `${i},${j}`;
        const cell = this.grid.get(k);
        if (cell) {
           for (let m = 0; m < cell.length; m++) found.push(cell[m]);
        }
      }
    }
    return found;
  }
}

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
    dead: false // New flag for optimization
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
            life: 100,
            dead: false
        });
    }
    return particles;
};

export const updateSimulation = (dt, particles, stars, gravityWells, planets, width, height, onDiscover, onFusion, onStarFormation, onSupernova, milestones = {}, bigBangPhase = BigBangPhase.STELLAR, simTime = 0) => {
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
          const progress = Math.min(1, simTime / 2); // 0 to 1
          cinematics.exposure = Math.max(0, 1 - progress); 
          cinematics.shake = (1 - progress) * 50; 
          cinematics.zoom = 1 + (1-progress) * 2; 
          cinematics.colorShift = (1-progress) * 20;
          cinematics.shockwave = progress * 2000; 
      } 
      else if (bigBangPhase === BigBangPhase.PLASMA) {
          cinematics.shake = 2;
          cinematics.exposure = 0.2 + Math.sin(simTime * 10) * 0.1;
          cinematics.colorShift = 5;
      }
      else if (bigBangPhase === BigBangPhase.DARK_AGES) {
          cinematics.exposure = 0;
          cinematics.shake = 0;
      }

      for (let p of particles) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          if (bigBangPhase === BigBangPhase.PLASMA) {
             p.vx += (Math.random() - 0.5) * 5000 * dt;
             p.vy += (Math.random() - 0.5) * 5000 * dt;
             p.vx *= 0.95;
             p.vy *= 0.95;
             const colors = ['#00ffff', '#ff00ff', '#ffffff', '#ffff00'];
             p.color = colors[Math.floor(Math.random() * colors.length)];
          } 
          else if (bigBangPhase === BigBangPhase.DARK_AGES) {
             p.vx *= 0.90;
             p.vy *= 0.90;
             const brightness = Math.max(0.1, 1 - ((simTime - 8) / 4));
             p.color = `rgba(30, 58, 138, ${brightness})`; 
          }

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      return cinematics;
  }

  // --- NORMAL PHYSICS (STELLAR ERA) ---

  // 1. Update Gravity Wells
  for (let i = gravityWells.length - 1; i >= 0; i--) {
    gravityWells[i].life -= dt;
    if (gravityWells[i].life <= 0) gravityWells.splice(i, 1);
  }

  const isGalaxy = milestones?.galaxyFormed;
  const isSolar = milestones?.solarSystemFormed;

  // 2. Update Stars
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

    // --- SUPERNOVA DETECTION ---
    const totalFuel = s.composition.hydrogen + s.composition.helium;
    if (s.mass > 150 && totalFuel < 5 && !s.exploding) {
        s.exploding = true;
        s.explosionTimer = 2.0; // 2 seconds of buildup
    }

    if (s.exploding) {
        s.explosionTimer -= dt;
        s.radius += dt * 50; 
        s.color = '#ffffff'; 
        cinematics.exposure = Math.max(cinematics.exposure, (2 - s.explosionTimer) * 0.5);
        cinematics.shake = Math.max(cinematics.shake, (2 - s.explosionTimer) * 10);

        if (s.explosionTimer <= 0) {
            // BOOM!
            const yieldMass = s.mass;
            const cx = s.x;
            const cy = s.y;

            // 1. Notify listeners (adds elements to inventory via callback)
            if (onSupernova) onSupernova(yieldMass, cx, cy);

            // 2. Create blast particles
            for(let k=0; k<50; k++) {
                const angle = Math.random() * Math.PI * 2;
                const v = 200 + Math.random() * 500;
                particles.push({
                    x: cx, y: cy,
                    vx: Math.cos(angle) * v,
                    vy: Math.sin(angle) * v,
                    mass: 1,
                    type: PARTICLE_TYPES.IRON,
                    color: '#ef4444',
                    life: 100,
                    dead: false
                });
            }

            s.dead = true; 
            if (onFusion) onFusion(cx, cy, '#ffffff'); // Use fusion callback for flash
        }
    }
  }

  // Remove dead stars
  let starAliveIndex = 0;
  for (let i = 0; i < stars.length; i++) {
      if (!stars[i].dead) {
          stars[starAliveIndex++] = stars[i];
      }
  }
  stars.length = starAliveIndex;
  
  // 3. Update Planets
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

  // 4. Update Particles (Gas) with Spatial Hash
  const hash = new SpatialHash(20); // Cell size 20 (interaction range ~10-20)
  
  // First pass: Move & Hash
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (p.dead) continue;

    // A. Physics Movement
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
      
      // Star Accretion
      if (dist < s.radius) {
         s.mass += p.mass;
         if (p.type === PARTICLE_TYPES.HYDROGEN) s.composition.hydrogen++;
         else if (p.type === PARTICLE_TYPES.HELIUM) s.composition.helium++;
         else if (p.type === PARTICLE_TYPES.CARBON) s.composition.carbon++;
         
         s.radius = Math.min(100, 10 + Math.sqrt(s.mass));
         
         p.dead = true; // Mark for removal
         if (onFusion) onFusion(s.x, s.y, s.color);
         return; 
      }

      // Planet Formation
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
                  p.dead = true;
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

    if (p.dead) continue;

    const maxV = isGalaxy ? 100 : 50;
    if (Math.abs(p.vx) > maxV) p.vx = Math.sign(p.vx) * maxV;
    if (Math.abs(p.vy) > maxV) p.vy = Math.sign(p.vy) * maxV;

    p.x += p.vx * dt * 10;
    p.y += p.vy * dt * 10;
    
    const friction = isGalaxy ? 0.98 : 0.96;
    p.vx *= friction;
    p.vy *= friction;

    // Wrap
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Insert into Hash
    hash.insert(p);
  }

  // Second pass: Collision & Fusion via Hash
  const formationChance = isGalaxy ? 0.95 : 0.99;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (p.dead) continue;

    const neighbors = hash.query(p.x, p.y);
    let nearbyMass = 0;
    let fuseList = [];

    for (let j = 0; j < neighbors.length; j++) {
        const p2 = neighbors[j];
        if (p2 === p || p2.dead) continue;

        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distSq = dx*dx + dy*dy;

        // Fusion Range
        if (distSq < 100) {
            // H + H -> He
            if (p.type === PARTICLE_TYPES.HYDROGEN && p2.type === PARTICLE_TYPES.HYDROGEN) {
                p.type = PARTICLE_TYPES.HELIUM;
                p.mass = 4;
                p.color = '#fbbf24';
                p2.dead = true; // Consumed
                if (onDiscover) onDiscover(PARTICLE_TYPES.HELIUM);
                break; // State changed, move to next particle
            }
            // He + He -> C
            if (p.type === PARTICLE_TYPES.HELIUM && p2.type === PARTICLE_TYPES.HELIUM) {
                p.type = PARTICLE_TYPES.CARBON;
                p.mass = 12;
                p.color = '#1f2937';
                p2.dead = true; // Consumed
                if (onDiscover) onDiscover(PARTICLE_TYPES.CARBON);
                break;
            }
            // C + C -> Fe (Simplified jump)
            if (p.type === PARTICLE_TYPES.CARBON && p2.type === PARTICLE_TYPES.CARBON) {
                p.type = PARTICLE_TYPES.IRON;
                p.mass = 56;
                p.color = '#374151';
                p2.dead = true;
                if (onDiscover) onDiscover(PARTICLE_TYPES.IRON);
                break;
            }
        }

        // Star Formation Range (Gravity accumulation)
        if (distSq < 400) {
            nearbyMass += p2.mass;
            fuseList.push(p2);
        }
    }

    // Check Star Formation
    if (!p.dead && nearbyMass > 5 && Math.random() > formationChance) { 
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
        
        p.dead = true; // Main particle consumed
        fuseList.forEach(fp => fp.dead = true); // Neighbors consumed
        
        if (onStarFormation) onStarFormation(newStar);
    }
  }

  // Cleanup Dead Particles (Efficient Swap-Removal or Filtering)
  // Filtering is O(N) which is fine.
  let aliveIndex = 0;
  for (let i = 0; i < particles.length; i++) {
      if (!particles[i].dead) {
          particles[aliveIndex++] = particles[i];
      }
  }
  particles.length = aliveIndex;

  return cinematics;
};
       
       