import { describe, it, expect } from 'vitest';
import { findAssemblableMolecules } from '../utils/moleculeDetection';
import { PARTICLE_TYPES } from '../../constants/particles';

describe('Molecule Detection Logic', () => {
  it('should detect a simple water molecule', () => {
    const particles = [
      { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
      { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
      { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
      { id: 'extra', type: PARTICLE_TYPES.CARBON }, // Noise
    ];
    
    const bonds = [
      { id: 'b1', particleA_id: 'o1', particleB_id: 'h1', type: 'single' },
      { id: 'b2', particleA_id: 'o1', particleB_id: 'h2', type: 'single' },
    ];

    const result = findAssemblableMolecules(particles, bonds);
    
    expect(result.size).toBe(3);
    expect(result.has('o1')).toBe(true);
    expect(result.has('h1')).toBe(true);
    expect(result.has('h2')).toBe(true);
    expect(result.has('extra')).toBe(false);
  });

  it('should ignore incomplete molecules', () => {
    // Water missing one hydrogen
    const particles = [
      { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
      { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
    ];
    
    const bonds = [
      { id: 'b1', particleA_id: 'o1', particleB_id: 'h1', type: 'single' },
    ];

    const result = findAssemblableMolecules(particles, bonds);
    expect(result.size).toBe(0);
  });

  it('should detect multiple independent molecules', () => {
    const particles = [
      // H2O #1
      { id: 'o1', type: PARTICLE_TYPES.OXYGEN }, { id: 'h1', type: PARTICLE_TYPES.HYDROGEN }, { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
      // H2O #2
      { id: 'o2', type: PARTICLE_TYPES.OXYGEN }, { id: 'h3', type: PARTICLE_TYPES.HYDROGEN }, { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
    ];
    
    const bonds = [
      { id: 'b1', particleA_id: 'o1', particleB_id: 'h1', type: 'single' },
      { id: 'b2', particleA_id: 'o1', particleB_id: 'h2', type: 'single' },
      { id: 'b3', particleA_id: 'o2', particleB_id: 'h3', type: 'single' },
      { id: 'b4', particleA_id: 'o2', particleB_id: 'h4', type: 'single' },
    ];

    const result = findAssemblableMolecules(particles, bonds);
    expect(result.size).toBe(6);
  });
});
