import { useEffect, useRef } from 'react';
import { useBioStore } from '../store';
import { SpatialHash } from '../utils/spatialHash';

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
  const foodSpawnTimer = useRef(0);
  
  // Spatial Hashes for O(N) collision detection
  const agentHash = useRef(new SpatialHash(40)); // Cell size 40
  const foodHash = useRef(new SpatialHash(40));

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
        let nextAgents = [];
        let soupConsumed = 0;
        const deadAgentIds = new Set();
        const eatenFoodIds = new Set(); // Track eaten food by ID to avoid O(N) splicing
        const newBorns = [];
        const newFoodStack = []; // Food spawned this tick
        
        const cx = worldSize.width / 2;
        const cy = worldSize.height / 2;
        const radius = Math.min(worldSize.width, worldSize.height) / 2 - 20;

        // --- 0. Rebuild Spatial Hashes ---
        agentHash.current.clear();
        foodHash.current.clear();
        
        // We only insert *alive* agents from the previous frame state to start
        agents.forEach(a => agentHash.current.insert(a));
        foodItems.forEach(f => foodHash.current.insert(f));

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
               energy: FOOD_VALUE
             };
             newFoodStack.push(newFood);
             
             soupConsumed += 1;
             foodSpawnTimer.current = 0;
           }
        }

        // --- 2. Simulation Step ---
        for (const agent of agents) {
          if (deadAgentIds.has(agent.id)) continue;

          // Mutable copy
          let a = { ...agent };
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
             // Query Agents in range
             const potentialPrey = agentHash.current.query(a.x, a.y, sense);
             
             for (const other of potentialPrey) {
               if (other.id === a.id || deadAgentIds.has(other.id)) continue;
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
             // Query Food in range
             const potentialFood = foodHash.current.query(a.x, a.y, sense);
             
             for (const f of potentialFood) {
               if (eatenFoodIds.has(f.id)) continue; // Already eaten this tick?
               
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
             // Herbivore: Check collision with food
             // Optimization: Reuse potentialFood from above if possible, but position changed slightly.
             // Just query strict contact range (size + 5)
             const contactFood = foodHash.current.query(a.x, a.y, size + 5);
             
             for (const f of contactFood) {
               if (eatenFoodIds.has(f.id)) continue;
               
               const fx = f.x - a.x;
               const fy = f.y - a.y;
               if (fx*fx + fy*fy < (size + 5)*(size + 5)) {
                 a.energy += f.energy;
                 eatenFoodIds.add(f.id); // Mark as eaten
                 if (a.energy > 500) break; 
               }
             }
          } else if (diet === 1) { 
             // Carnivore: Check collision with prey
             const contactPrey = agentHash.current.query(a.x, a.y, size + 20); // Broad check
             
             for (const other of contactPrey) {
               if (other.id === a.id || deadAgentIds.has(other.id)) continue;
               if (size > (other.radius || 10) * 1.2) {
                 const ox = other.x - a.x;
                 const oy = other.y - a.y;
                 if (ox*ox + oy*oy < (size + other.radius) * (size + other.radius) * 0.6) {
                    a.energy += (other.energy * 0.5) + (other.radius * 2);
                    deadAgentIds.add(other.id);
                 }
               }
             }
          }

          // --- D. Toxicity ---
          for (const t of toxins) {
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

          // --- F. Death Check ---
          if (a.energy > 0) {
            nextAgents.push(a);
          } else {
            const corpse = {
               id: `corpse-${a.id}`,
               x: a.x,
               y: a.y,
               energy: size * 2
            };
            newFoodStack.push(corpse);
          }
        }

        // Finalize Food List: (Existing - Eaten) + NewSpawns + Corpses
        const survivingFood = foodItems.filter(f => !eatenFoodIds.has(f.id));
        const finalFood = [...survivingFood, ...newFoodStack];

        nextAgents = nextAgents.filter(a => !deadAgentIds.has(a.id));
        setAgents([...nextAgents, ...newBorns]);
        setFoodItems(finalFood);
        
        if (soupConsumed > 0) {
          updateSoup({ glucose: Math.max(0, soup.glucose - soupConsumed) });
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, agents, foodItems, toxins, soup, worldSize, setAgents, setFoodItems, updateSoup]);
};