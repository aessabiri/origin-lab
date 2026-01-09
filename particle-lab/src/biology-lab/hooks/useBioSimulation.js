import { useEffect, useRef } from 'react';
import { useBioStore } from '../store';

const WORLD_RADIUS = 380;
const FOOD_VALUE = 50;
const MITOSIS_THRESHOLD = 200;
const STARTING_ENERGY = 100;
const SENSOR_RADIUS = 150;

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
      const deltaTime = timestamp - lastFrameTime.current;

      if (isRunning && deltaTime > 16) {
        let nextAgents = [...agents];
        let nextFood = [...foodItems];
        let soupConsumed = 0;
        const deadAgentIds = new Set(); // Track eaten agents

        // --- 1. Food Spawning ---
        foodSpawnTimer.current += deltaTime;
        if (foodSpawnTimer.current > 100) { 
           if (soup.glucose > 0) {
             const angle = Math.random() * Math.PI * 2;
             const r = Math.sqrt(Math.random()) * WORLD_RADIUS;
             const newFood = {
               id: `food-${Date.now()}`,
               x: 400 + r * Math.cos(angle),
               y: 400 + r * Math.sin(angle),
               energy: FOOD_VALUE
             };
             nextFood.push(newFood);
             soupConsumed += 1;
             foodSpawnTimer.current = 0;
           }
        }

        // --- 2. Agent Logic ---
        const newBorns = [];
        const survivingAgents = [];

        nextAgents.forEach(agent => {
          if (deadAgentIds.has(agent.id)) return;

          let { x, y, vx = 0, vy = 0, energy, genome, radius = 15, id } = agent;
          const diet = genome.diet; // 0: Herb, 1: Carn, 2: Photo
          const sensorRadius = genome.sense || 150;
          const resistance = genome.resistance || 0;

          // --- A. Sensing & Targeting ---
          let target = null;
          let targetDist = Infinity;

          if (diet === 1) { // Carnivore
            nextAgents.forEach(other => {
              if (other.id === id || deadAgentIds.has(other.id)) return;
              if (radius > (other.radius || 15) * 1.1) {
                const dx = other.x - x;
                const dy = other.y - y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < sensorRadius && d < targetDist) {
                  targetDist = d;
                  target = other;
                }
              }
            });
          } else if (diet === 0) { // Herbivore
            nextFood.forEach(f => {
              const dx = f.x - x;
              const dy = f.y - y;
              const d = Math.sqrt(dx*dx + dy*dy);
              if (d < sensorRadius && d < targetDist) {
                targetDist = d;
                target = f;
              }
            });
          }
          // Phototrophs (Diet 2) don't target anything.

          // --- B. Physics ---
          if (target) {
            const dx = target.x - x;
            const dy = target.y - y;
            const len = Math.sqrt(dx*dx + dy*dy);
            if (len > 0) {
               vx += (dx / len) * 0.5 * genome.speed;
               vy += (dy / len) * 0.5 * genome.speed;
            }
          } else {
            // Wander
            vx += (Math.random() - 0.5) * 0.2 * genome.speed;
            vy += (Math.random() - 0.5) * 0.2 * genome.speed;
          }
          
          vx *= 0.95;
          vy *= 0.95;
          x += vx;
          y += vy;

          const dx = x - 400;
          const dy = y - 400;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist + radius > WORLD_RADIUS) {
             const angle = Math.atan2(dy, dx);
             x = 400 + Math.cos(angle) * (WORLD_RADIUS - radius);
             y = 400 + Math.sin(angle) * (WORLD_RADIUS - radius);
             vx *= -0.5;
             vy *= -0.5;
          }

          // --- C. Toxicity ---
          toxins.forEach(t => {
            const tx = t.x - x;
            const ty = t.y - y;
            const tDist = Math.sqrt(tx*tx + ty*ty);
            if (tDist < t.radius + radius) {
               const damage = 5 * (1 - resistance);
               energy -= Math.max(0, damage);
            }
          });

          // --- D. Feeding ---
          if (diet === 1) { // Carnivore
            nextAgents.forEach(other => {
              if (other.id === id || deadAgentIds.has(other.id)) return;
              const dx = other.x - x;
              const dy = other.y - y;
              const d = Math.sqrt(dx*dx + dy*dy);
              if (d < radius + (other.radius || 15) * 0.5 && radius > (other.radius || 15) * 1.1) {
                 energy += other.energy * 0.8; 
                 deadAgentIds.add(other.id);
              }
            });
          } else if (diet === 0) { // Herbivore
            const remainingFood = [];
            nextFood.forEach(f => {
              const fx = f.x - x;
              const fy = f.y - y;
              const fDist = Math.sqrt(fx*fx + fy*fy);
              if (fDist < radius + 5) { 
                energy += f.energy;
              } else {
                remainingFood.push(f);
              }
            });
            nextFood = remainingFood;
          } else if (diet === 2) { // Phototroph
             // Photosynthesis: Gain energy passively
             // Rate depends on size (surface area)? Or just fixed constant.
             // Let's say 0.5 per tick. Less than food (20), but constant.
             energy += 0.5;
          }

          // --- E. Metabolism ---
          // Use the BMR calculated in CellCreator (genome.metabolism)
          // Add cost for movement (kinetic energy) and resistance maintenance
          const movementCost = (Math.abs(vx) + Math.abs(vy)) * (radius * 0.0005); // Bigger cells harder to move
          const resistanceCost = resistance * 0.005;
          const burn = genome.metabolism + movementCost + resistanceCost;
          energy -= burn;

          // --- F. Mitosis ---
          // Threshold scales with size. Big cells need more energy to split.
          const mitosisCost = 100 + radius * 10;
          const splitThreshold = mitosisCost * 2; 

          if (energy >= splitThreshold) {
            energy -= mitosisCost;
            
            const mutationRate = 0.1;
            // Evolve traits
            const childGenome = {
              ...genome,
              speed: Math.max(0.5, genome.speed + (Math.random() - 0.5) * mutationRate),
              // We don't mutate BMR directly, BMR is a result of traits. 
              // But for simplicity, we let BMR drift too, representing efficiency mutations.
              metabolism: Math.max(0.1, genome.metabolism + (Math.random() - 0.5) * mutationRate * 0.1),
              resistance: Math.min(1, Math.max(0, resistance + (Math.random() - 0.5) * mutationRate)),
            };

            // Mutate Size
            const childRadius = Math.max(5, radius + (Math.random() - 0.5) * 2);

            const child = {
              ...agent,
              id: `agent-${Date.now()}-${Math.random()}`,
              x: x + (Math.random() - 0.5) * 20,
              y: y + (Math.random() - 0.5) * 20,
              energy: mitosisCost, // Give child the cost
              radius: childRadius,
              genome: childGenome,
              color: agent.color, // Inherit color
            };
            newBorns.push(child);
          }

          // --- Survival ---
          if (energy > 0) {
            // Update state object
            agent.x = x;
            agent.y = y;
            agent.vx = vx;
            agent.vy = vy;
            agent.energy = energy;
            survivingAgents.push(agent);
          }
        });

        // --- 3. Update Store ---
        const survivors = survivingAgents.filter(a => !deadAgentIds.has(a.id));
        setAgents([...survivors, ...newBorns]);
        setFoodItems(nextFood);
        if (soupConsumed > 0) {
          updateSoup({ glucose: Math.max(0, soup.glucose - soupConsumed) });
        }

        lastFrameTime.current = timestamp;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, agents, foodItems, toxins, soup, setAgents, setFoodItems, updateSoup]);
};