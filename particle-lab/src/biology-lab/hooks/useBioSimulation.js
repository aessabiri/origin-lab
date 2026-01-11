import { useEffect, useRef } from 'react';
import { useBioStore } from '../store';

const WORLD_RADIUS = 380;
const FOOD_VALUE = 20; // Reduced from 50 to balance high spawn rate
const BASE_PHOTOSYNTHESIS = 0.8;

export const useBioSimulation = () => {
  const {
    isRunning,
    agents,
    soup,
    foodItems,
    toxins,
    setAgents,
    setFoodItems,
    updateSoup
  } = useBioStore();

  const lastFrameTime = useRef(0);
  const foodSpawnTimer = useRef(0);

  useEffect(() => {
    let animationFrameId;

    const tick = (timestamp) => {
      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      // Cap deltaTime to prevent explosion after tab switch
      const deltaTime = Math.min(timestamp - lastFrameTime.current, 100); 
      lastFrameTime.current = timestamp;

      // Run simulation logic if running
      if (isRunning) {
        let nextAgents = [];
        let nextFood = [...foodItems];
        let soupConsumed = 0;
        const deadAgentIds = new Set();
        const newBorns = [];

        // --- 1. Food Spawning Logic ---
        foodSpawnTimer.current += deltaTime;
        if (foodSpawnTimer.current > 200) { // Spawn every 200ms
           if (soup.glucose > 0) {
             const angle = Math.random() * Math.PI * 2;
             const r = Math.sqrt(Math.random()) * WORLD_RADIUS;
             const newFood = {
               id: `food-${Date.now()}-${Math.random()}`,
               x: 400 + r * Math.cos(angle),
               y: 400 + r * Math.sin(angle),
               energy: FOOD_VALUE
             };
             nextFood.push(newFood);
             soupConsumed += 1;
             foodSpawnTimer.current = 0;
           }
        }

        // --- 2. Simulation Step ---
        // Optimization: Create a simple spatial hash or just simple iteration for < 500 agents
        
        for (const agent of agents) {
          if (deadAgentIds.has(agent.id)) continue;

          // Create a mutable copy for this tick
          let a = { ...agent };
          const genome = a.genome;
          
          // Stats
          const diet = genome.diet; // 0: Herb, 1: Carn, 2: Photo
          const sense = genome.sense || 100;
          const speed = genome.speed || 1;
          const size = a.radius || 10;
          const bmr = genome.metabolism || 0.1;

          // --- A. Metabolism ---
          // Energy loss per tick (approx 60 ticks/sec)
          // BMR is calculated "per tick" in CellCreator, usually 0.1 - 5.0
          // We scale it by time to be frame-rate independent
          const burn = (bmr * (deltaTime / 16)); 
          a.energy -= burn;

          // --- B. Movement & Physics ---
          // Targeting
          let targetX = null, targetY = null;
          let minDist = Infinity;

          if (diet === 1) { // Carnivore
             // Find prey (smaller agents)
             for (const other of agents) {
               if (other.id === a.id || deadAgentIds.has(other.id)) continue;
               if (size > (other.radius || 10) * 1.2) { // Must be 20% larger
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
             // Find food
             for (const f of nextFood) {
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
            // Browninan Wander
            a.vx += (Math.random() - 0.5) * 0.5 * speed;
            a.vy += (Math.random() - 0.5) * 0.5 * speed;
          }

          // Drag / Friction
          a.vx *= 0.92;
          a.vy *= 0.92;

          // Update Position
          a.x += a.vx;
          a.y += a.vy;

          // Boundary Constraint (Circular Petri Dish)
          const dx = a.x - 400;
          const dy = a.y - 400;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist + size > WORLD_RADIUS) {
             const angle = Math.atan2(dy, dx);
             a.x = 400 + Math.cos(angle) * (WORLD_RADIUS - size);
             a.y = 400 + Math.sin(angle) * (WORLD_RADIUS - size);
             a.vx *= -0.5;
             a.vy *= -0.5;
          }

          // --- C. Feeding Interactions ---
          if (diet === 2) { // Phototroph
             // Photosynthesis
             a.energy += BASE_PHOTOSYNTHESIS * (size / 10); // Bigger leaves = more energy
          } else if (diet === 0) { // Herbivore
             // Eat Food
             const eatenIndices = [];
             for (let i = 0; i < nextFood.length; i++) {
               const f = nextFood[i];
               const fx = f.x - a.x;
               const fy = f.y - a.y;
               if (fx*fx + fy*fy < (size + 5)*(size + 5)) {
                 a.energy += f.energy;
                 eatenIndices.push(i);
                 if (a.energy > 500) break; // Cap eating per tick
               }
             }
             // Remove eaten food (filter out descending to avoid index shift issues, or just rebuild)
             if (eatenIndices.length > 0) {
               nextFood = nextFood.filter((_, i) => !eatenIndices.includes(i));
             }
          } else if (diet === 1) { // Carnivore
             // Eat Prey
             for (const other of agents) {
               if (other.id === a.id || deadAgentIds.has(other.id)) continue;
               if (size > (other.radius || 10) * 1.2) {
                 const ox = other.x - a.x;
                 const oy = other.y - a.y;
                 if (ox*ox + oy*oy < (size + other.radius) * (size + other.radius) * 0.6) { // Overlap significantly
                    // Eat it
                    a.energy += (other.energy * 0.5) + (other.radius * 2); // Gain energy from biomass
                    deadAgentIds.add(other.id);
                 }
               }
             }
          }

          // --- D. Toxicity ---
          // Simple check
          for (const t of toxins) {
             const tx = t.x - a.x;
             const ty = t.y - a.y;
             if (tx*tx + ty*ty < (t.radius + size)*(t.radius + size)) {
               a.energy -= 2;
             }
          }

          // --- E. Mitosis (Reproduction) ---
          const splitThreshold = 200 + (size * 5); // Bigger cells need more energy
          if (a.energy > splitThreshold) {
             const cost = splitThreshold * 0.6;
             a.energy -= cost;

             // Mutation
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
               vx: -a.vx, // Eject
               vy: -a.vy,
               energy: cost * 0.8,
               radius: size * (1 + (Math.random() - 0.5) * 0.05), // Size drift
               genome: childGenome
             };
             newBorns.push(child);
          }

          // --- F. Death Check ---
          if (a.energy > 0) {
            nextAgents.push(a);
          } else {
            // Corpse becomes food?
            const corpse = {
               id: `corpse-${a.id}`,
               x: a.x,
               y: a.y,
               energy: size * 2 // Biomass energy
            };
            nextFood.push(corpse);
          }
        }

        // Filter out eaten agents from nextAgents
        nextAgents = nextAgents.filter(a => !deadAgentIds.has(a.id));
        setAgents([...nextAgents, ...newBorns]);
        setFoodItems(nextFood);
        
        if (soupConsumed > 0) {
          updateSoup({ glucose: Math.max(0, soup.glucose - soupConsumed) });
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, agents, foodItems, toxins, soup, setAgents, setFoodItems, updateSoup]);
};
