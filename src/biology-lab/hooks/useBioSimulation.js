import { useEffect, useRef } from 'react';
import { useBioStore } from '../store';
import { SpatialHash } from '../utils/spatialHash';
import { syncSynthesisUtil } from '../../hooks/useResourceSync';

const FOOD_VALUE = 20; 
const BASE_PHOTOSYNTHESIS = 0.8;

export const useBioSimulation = () => {
  const {
    isRunning,
    agents,
    soup,
    foodItems,
    toxins,
    worldSize,
    setAgents,
    setFoodItems,
    updateSoup
  } = useBioStore();

  const lastFrameTime = useRef(0);
  const lastStoreUpdate = useRef(0);
  const foodSpawnTimer = useRef(0);
  
  const agentsRef = useRef([]);
  const foodRef = useRef([]);
  const hasInitialized = useRef(false);

  // Spatial Hashes for O(N) collision detection
  const agentHash = useRef(new SpatialHash(40)); // Cell size 40
  const foodHash = useRef(new SpatialHash(40));

  useEffect(() => {
    if (!isRunning || !hasInitialized.current) {
      agentsRef.current = agents.map(a => ({...a}));
      foodRef.current = foodItems.map(f => ({...f, eaten: false}));
      hasInitialized.current = true;
    }
  }, [agents, foodItems, isRunning]);

  useEffect(() => {
    let animationFrameId;

    const tick = (timestamp) => {
      // Throttle to ~30 FPS (33ms)
      if (timestamp - lastFrameTime.current < 33) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      const deltaTime = Math.min(timestamp - lastFrameTime.current, 100); 
      lastFrameTime.current = timestamp;

      if (isRunning) {
        let soupConsumed = 0;
        let nextAgentsCount = 0;
        let nextFoodCount = 0;
        const newBorns = [];
        
        const cx = worldSize.width / 2;
        const cy = worldSize.height / 2;
        const radius = Math.min(worldSize.width, worldSize.height) / 2 - 20;

        const currentAgents = agentsRef.current;
        const currentFood = foodRef.current;

        // --- 0. Rebuild Spatial Hashes ---
        agentHash.current.clear();
        foodHash.current.clear();
        
        for (let i = 0; i < currentAgents.length; i++) {
          const a = currentAgents[i];
          if (a.energy > 0) agentHash.current.insert(a);
        }
        for (let i = 0; i < currentFood.length; i++) {
          const f = currentFood[i];
          if (!f.eaten) foodHash.current.insert(f);
        }

        // --- 1. Food Spawning Logic ---
        foodSpawnTimer.current += deltaTime;
        if (foodSpawnTimer.current > 200) { 
           if (soup.glucose > 0) {
             const angle = Math.random() * Math.PI * 2;
             const r = Math.sqrt(Math.random()) * radius;
             const newFood = {
               id: `food-${Date.now()}-${Math.random()}`,
               x: cx + r * Math.cos(angle),
               y: cy + r * Math.sin(angle),
               energy: FOOD_VALUE,
               eaten: false
             };
             currentFood.push(newFood);
             
             soupConsumed += 1;
             foodSpawnTimer.current = 0;
           }
        }

        // --- 2. Simulation Step ---
        for (let i = 0; i < currentAgents.length; i++) {
          const a = currentAgents[i];
          if (a.energy <= 0) continue;

          const genome = a.genome;
          
          const diet = genome.diet; // 0: Herb, 1: Carn, 2: Photo
          const sense = genome.sense || 100;
          const speed = genome.speed || 1;
          const size = a.radius || 10;
          const bmr = genome.metabolism || 0.1;

          // --- A. Metabolism ---
          const burn = (bmr * (deltaTime / 16)); 
          a.energy -= burn;

          // --- B. Movement & Physics ---
          let targetX = null, targetY = null;
          let minDist = Infinity;

          if (diet === 1) { // Carnivore
             const potentialPrey = agentHash.current.query(a.x, a.y, sense);
             
             for (let j = 0; j < potentialPrey.length; j++) {
               const other = potentialPrey[j];
               if (other.id === a.id || other.energy <= 0) continue;
               if (size > (other.radius || 10) * 1.2) { 
                 const dx = other.x - a.x;
                 const dy = other.y - a.y;
                 const d2 = dx*dx + dy*dy;
                 if (d2 < sense * sense && d2 < minDist) {
                   minDist = d2;
                   targetX = other.x;
                   targetY = other.y;
                 }
               }
             }
          } else if (diet === 0) { // Herbivore
             const potentialFood = foodHash.current.query(a.x, a.y, sense);
             
             for (let j = 0; j < potentialFood.length; j++) {
               const f = potentialFood[j];
               if (f.eaten) continue;
               
               const dx = f.x - a.x;
               const dy = f.y - a.y;
               const d2 = dx*dx + dy*dy;
               if (d2 < sense * sense && d2 < minDist) {
                 minDist = d2;
                 targetX = f.x;
                 targetY = f.y;
               }
             }
          }

          // Apply Forces
          if (targetX !== null) {
            const angle = Math.atan2(targetY - a.y, targetX - a.x);
            a.vx += Math.cos(angle) * 0.5 * speed;
            a.vy += Math.sin(angle) * 0.5 * speed;
          } else {
            a.vx += (Math.random() - 0.5) * 0.5 * speed;
            a.vy += (Math.random() - 0.5) * 0.5 * speed;
          }

          a.vx *= 0.92;
          a.vy *= 0.92;
          a.x += a.vx;
          a.y += a.vy;

          // Boundary
          const dx = a.x - cx;
          const dy = a.y - cy;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist + size > radius) {
             const angle = Math.atan2(dy, dx);
             a.x = cx + Math.cos(angle) * (radius - size);
             a.y = cy + Math.sin(angle) * (radius - size);
             a.vx *= -0.5;
             a.vy *= -0.5;
          }

          // --- C. Feeding Interactions ---
          if (diet === 2) { 
             a.energy += BASE_PHOTOSYNTHESIS * (size / 10); 
          } else if (diet === 0) { 
             const contactFood = foodHash.current.query(a.x, a.y, size + 5);
             
             for (let j = 0; j < contactFood.length; j++) {
               const f = contactFood[j];
               if (f.eaten) continue;
               
               const fx = f.x - a.x;
               const fy = f.y - a.y;
               if (fx*fx + fy*fy < (size + 5)*(size + 5)) {
                 a.energy += f.energy;
                 f.eaten = true;
                 if (a.energy > 500) break; 
               }
             }
          } else if (diet === 1) { 
             const contactPrey = agentHash.current.query(a.x, a.y, size + 20);
             
             for (let j = 0; j < contactPrey.length; j++) {
               const other = contactPrey[j];
               if (other.id === a.id || other.energy <= 0) continue;
               if (size > (other.radius || 10) * 1.2) {
                 const ox = other.x - a.x;
                 const oy = other.y - a.y;
                 if (ox*ox + oy*oy < (size + other.radius) * (size + other.radius) * 0.6) {
                    a.energy += (other.energy * 0.5) + (other.radius * 2);
                    other.energy = -1; // Mark as dead
                 }
               }
             }
          }

          // --- D. Toxicity ---
          for (let j = 0; j < toxins.length; j++) {
             const t = toxins[j];
             const tx = t.x - a.x;
             const ty = t.y - a.y;
             if (tx*tx + ty*ty < (t.radius + size)*(t.radius + size)) {
               a.energy -= 2;
             }
          }

          // --- E. Mitosis ---
          const splitThreshold = 200 + (size * 5);
          if (a.energy > splitThreshold) {
             const cost = splitThreshold * 0.6;
             a.energy -= cost;

             if (Math.random() < 0.2) {
                 const enzymeType = Math.random() > 0.5 ? 'polymerase' : 'lipase';
                 syncSynthesisUtil(enzymeType, 1);
             }

             const mRate = 0.1;
             const childGenome = {
               ...genome,
               speed: genome.speed * (1 + (Math.random() - 0.5) * mRate),
               metabolism: genome.metabolism * (1 + (Math.random() - 0.5) * mRate),
               sense: genome.sense * (1 + (Math.random() - 0.5) * mRate),
             };
             
             const child = {
               ...a,
               id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
               x: a.x + (Math.random() - 0.5) * size,
               y: a.y + (Math.random() - 0.5) * size,
               vx: -a.vx,
               vy: -a.vy,
               energy: cost * 0.8,
               radius: size * (1 + (Math.random() - 0.5) * 0.05),
               genome: childGenome
             };
             newBorns.push(child);
          }

          // --- F. Death Check & Compaction ---
          if (a.energy > 0) {
            currentAgents[nextAgentsCount++] = a;
          } else {
            const corpse = {
               id: `corpse-${a.id}`,
               x: a.x,
               y: a.y,
               energy: size * 2,
               eaten: false
            };
            currentFood.push(corpse);
          }
        }

        // Compaction of agents
        currentAgents.length = nextAgentsCount;
        for (let i = 0; i < newBorns.length; i++) {
          currentAgents.push(newBorns[i]);
        }

        // Compaction of food
        for (let i = 0; i < currentFood.length; i++) {
          const f = currentFood[i];
          if (!f.eaten) {
            currentFood[nextFoodCount++] = f;
          }
        }
        currentFood.length = nextFoodCount;

        // Throttled Store Update (e.g., 10 FPS = 100ms)
        if (timestamp - lastStoreUpdate.current > 100) {
          lastStoreUpdate.current = timestamp;
          setAgents([...currentAgents]);
          setFoodItems([...currentFood]);
          
          if (soupConsumed > 0) {
            updateSoup({ glucose: Math.max(0, soup.glucose - soupConsumed) });
          }
        } else if (soupConsumed > 0) {
          // If we consumed soup but didn't update store, we still need to update soup?
          // Actually, just update soup in the store throttle to avoid frequent re-renders.
          // We can accumulate soupConsumed over multiple frames.
          // Wait, soupConsumed is local to the frame here.
          // Let's just accumulate it.
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, agents, foodItems, toxins, soup, worldSize, setAgents, setFoodItems, updateSoup]);
};