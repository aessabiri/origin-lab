import { describe, it, expect, vi } from 'vitest';
import { updateSimulation } from '../components/universeLogic';
import { PARTICLE_TYPES } from '../constants/particles';

describe('Universe Simulation', () => {
  it('should accelerate particles towards gravity wells', () => {
    const particle = { x: 100, y: 100, vx: 0, vy: 0, mass: 1, type: PARTICLE_TYPES.HYDROGEN, color: '#ffffff' };
    const well = { x: 200, y: 100, strength: 5000, life: 1.0 };
    const particles = [particle];
    const wells = [well];
    const dt = 0.1;

    updateSimulation(dt, particles, [], wells, [], 1000, 1000, vi.fn());

    // Should accelerate in +x direction
    expect(particle.vx).toBeGreaterThan(0);
    expect(particle.vy).toBe(0); // Well is at same Y
  });

  it('should fuse two Hydrogens into Helium on collision', () => {
    const p1 = { x: 100, y: 100, vx: 10, vy: 0, type: PARTICLE_TYPES.HYDROGEN, color: '#ffffff' };
    const p2 = { x: 102, y: 100, vx: -10, vy: 0, type: PARTICLE_TYPES.HYDROGEN, color: '#ffffff' }; // Close enough (< 100 distSq)
    const particles = [p1, p2];
    const wells = [];
    const onDiscover = vi.fn();
    const dt = 0.016;

    updateSimulation(dt, particles, [], wells, [], 1000, 1000, onDiscover);

    // One particle should remain (p1 transformed)
    expect(particles).toHaveLength(1);
    expect(particles[0].type).toBe(PARTICLE_TYPES.HELIUM);
    
    // Callback fired
    expect(onDiscover).toHaveBeenCalledWith(PARTICLE_TYPES.HELIUM);
  });

  it('should fuse two Heliums into Carbon on collision', () => {
    const p1 = { x: 100, y: 100, vx: 0, vy: 0, type: PARTICLE_TYPES.HELIUM, color: '#ffffff' };
    const p2 = { x: 100, y: 105, vx: 0, vy: 0, type: PARTICLE_TYPES.HELIUM, color: '#ffffff' };
    const particles = [p1, p2];
    const onDiscover = vi.fn();

    updateSimulation(0.016, particles, [], [], [], 1000, 1000, onDiscover);

    expect(particles).toHaveLength(1);
    expect(particles[0].type).toBe(PARTICLE_TYPES.CARBON);
    expect(onDiscover).toHaveBeenCalledWith(PARTICLE_TYPES.CARBON);
  });
});
