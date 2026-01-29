import { describe, it, expect, vi } from 'vitest';
import { updateSimulation, createNebulaParticle, BigBangPhase } from '../components/universeLogic';
import { PARTICLE_TYPES } from '../constants/particles';

describe('Universe Logic', () => {
  it('should create gas particles correctly', () => {
    const p = createNebulaParticle(100, 100);
    expect(p.type).toBe(PARTICLE_TYPES.HYDROGEN);
    expect(p.mass).toBe(1);
    expect(p.vx).toBeDefined();
  });

  it('should trigger star formation when density is high', () => {
    const particles = [];
    // Create a dense cluster
    for (let i = 0; i < 10; i++) {
      particles.push({ 
        x: 50, y: 50, mass: 1, vx: 0, vy: 0, type: PARTICLE_TYPES.HYDROGEN, color: '#3b82f6'
      });
    }
    
    const stars = [];
    const gravityWells = [];
    const planets = [];
    const onStarFormation = vi.fn();

    // Mock Math.random to ensure formation triggers (threshold > 0.99)
    const originalRandom = Math.random;
    Math.random = () => 0.999;

    updateSimulation(0.1, particles, stars, gravityWells, planets, 100, 100, null, null, onStarFormation);

    Math.random = originalRandom;

    // Should have formed a star and consumed particles
    expect(stars.length).toBe(1);
    expect(onStarFormation).toHaveBeenCalled();
    expect(particles.length).toBeLessThan(10); 
    
    const star = stars[0];
    expect(star.mass).toBeGreaterThan(5); // Critical mass
    expect(star.composition.hydrogen).toBeGreaterThan(0);
  });

  it('should accrete particles into stars', () => {
    const star = { 
      x: 50, y: 50, radius: 20, mass: 10, 
      composition: { hydrogen: 10, helium: 0, carbon: 0, iron: 0 } 
    };
    const stars = [star];
    
    // Particle inside star radius
    const p = { x: 50, y: 50, mass: 1, type: PARTICLE_TYPES.HYDROGEN, color: '#3b82f6' };
    const particles = [p];

    updateSimulation(0.1, particles, stars, [], [], 100, 100, null, null, null);

    expect(particles.length).toBe(0); // Consumed
    expect(star.mass).toBe(11); // Grew
    expect(star.composition.hydrogen).toBeGreaterThan(10);
    expect(star.composition.helium).toBeGreaterThan(0); // Burned immediately
  });

  it('should perform nucleosynthesis (burn H -> He)', () => {
    const star = { 
      x: 50, y: 50, radius: 20, mass: 100, // Massive star burns fast
      composition: { hydrogen: 100, helium: 0, carbon: 0, iron: 0 },
      temperature: 3000
    };
    const stars = [star];

    updateSimulation(1.0, [], stars, [], [], 100, 100);

    expect(star.composition.hydrogen).toBeLessThan(100);
    expect(star.composition.helium).toBeGreaterThan(0);
    expect(star.temperature).toBeGreaterThan(3000);
  });

  it('should return cinematic overrides during Big Bang phases', () => {
    const particles = [{ x: 50, y: 50, vx: 0, vy: 0 }];
    
    // INFLATION Phase
    const cin1 = updateSimulation(0.1, particles, [], [], [], 100, 100, null, null, null, {}, BigBangPhase.INFLATION, 0.5);
    expect(cin1.shake).toBeGreaterThan(0);
    expect(cin1.zoom).toBeGreaterThan(1);

    // PLASMA Phase
    const cin2 = updateSimulation(0.1, particles, [], [], [], 100, 100, null, null, null, {}, BigBangPhase.PLASMA, 5);
    expect(cin2.colorShift).toBeGreaterThan(0);
    
    // STELLAR Phase (Normal Physics)
    const cin3 = updateSimulation(0.1, particles, [], [], [], 100, 100, null, null, null, {}, BigBangPhase.STELLAR, 20);
    expect(cin3.shake).toBe(0);
    expect(cin3.zoom).toBe(1);
  });
});
