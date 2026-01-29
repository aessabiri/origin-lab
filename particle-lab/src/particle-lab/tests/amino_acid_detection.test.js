import { describe, it, expect } from 'vitest';
import { findAssemblableMolecules } from '../utils/moleculeDetection';
import { PARTICLE_TYPES } from '../../constants/particles';

describe('Amino Acid Detection (Graph Matching)', () => {
  it('should detect Glycine (simplest case with graph)', () => {
    // Structure: N - Ca - C(=O) - O-H
    const particles = [
      { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
      { id: 'ca', type: PARTICLE_TYPES.CARBON },
      { id: 'c1', type: PARTICLE_TYPES.CARBON },
      { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
      { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
      { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
      { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
      { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
      { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
      { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
    ];
    
    const bonds = [
      { id: 'b1', particleA_id: 'n1', particleB_id: 'h1', type: 'single' },
      { id: 'b2', particleA_id: 'n1', particleB_id: 'h2', type: 'single' },
      { id: 'b3', particleA_id: 'n1', particleB_id: 'ca', type: 'single' },
      { id: 'b4', particleA_id: 'ca', particleB_id: 'h3', type: 'single' },
      { id: 'b5', particleA_id: 'ca', particleB_id: 'h4', type: 'single' },
      { id: 'b6', particleA_id: 'ca', particleB_id: 'c1', type: 'single' },
      { id: 'b7', particleA_id: 'c1', particleB_id: 'o1', type: 'double' },
      { id: 'b8', particleA_id: 'c1', particleB_id: 'o2', type: 'single' },
      { id: 'b9', particleA_id: 'o2', particleB_id: 'h5', type: 'single' },
    ];

    const result = findAssemblableMolecules(particles, bonds);
    expect(result.size).toBe(10);
  });

  it('should detect Tryptophan (complex aromatic structure)', () => {
    const particles = [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'ca', type: PARTICLE_TYPES.CARBON },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'cb', type: PARTICLE_TYPES.CARBON },
        { id: 'cg', type: PARTICLE_TYPES.CARBON },
        { id: 'cd1', type: PARTICLE_TYPES.CARBON },
        { id: 'cd2', type: PARTICLE_TYPES.CARBON },
        { id: 'ne1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'ce2', type: PARTICLE_TYPES.CARBON },
        { id: 'ce3', type: PARTICLE_TYPES.CARBON },
        { id: 'cz2', type: PARTICLE_TYPES.CARBON },
        { id: 'cz3', type: PARTICLE_TYPES.CARBON },
        { id: 'ch2', type: PARTICLE_TYPES.CARBON },
        ...Array.from({length: 12}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN }))
    ];

    const bonds = [
        { particleA_id: 'n1', particleB_id: 'ca', type: 'single' },
        { particleA_id: 'ca', particleB_id: 'c1', type: 'single' },
        { particleA_id: 'c1', particleB_id: 'o1', type: 'double' },
        { particleA_id: 'c1', particleB_id: 'o2', type: 'single' },
        { particleA_id: 'ca', particleB_id: 'cb', type: 'single' },
        { particleA_id: 'cb', particleB_id: 'cg', type: 'single' },
        { particleA_id: 'cg', particleB_id: 'cd1', type: 'double' },
        { particleA_id: 'cd1', particleB_id: 'ne1', type: 'single' },
        { particleA_id: 'ne1', particleB_id: 'ce2', type: 'single' },
        { particleA_id: 'ce2', particleB_id: 'cd2', type: 'double' },
        { particleA_id: 'cd2', particleB_id: 'cg', type: 'single' },
        { particleA_id: 'ce2', particleB_id: 'cz2', type: 'single' },
        { particleA_id: 'cz2', particleB_id: 'ch2', type: 'double' },
        { particleA_id: 'ch2', particleB_id: 'cz3', type: 'single' },
        { particleA_id: 'cz3', particleB_id: 'ce3', type: 'double' },
        { particleA_id: 'ce3', particleB_id: 'cd2', type: 'single' },
        { particleA_id: 'n1', particleB_id: 'h1', type: 'single' }, { particleA_id: 'n1', particleB_id: 'h2', type: 'single' },
        { particleA_id: 'ca', particleB_id: 'h3', type: 'single' },
        { particleA_id: 'o2', particleB_id: 'h4', type: 'single' },
        { particleA_id: 'cb', particleB_id: 'h5', type: 'single' }, { particleA_id: 'cb', particleB_id: 'h6', type: 'single' },
        { particleA_id: 'cd1', particleB_id: 'h7', type: 'single' },
        { particleA_id: 'ne1', particleB_id: 'h8', type: 'single' },
        { particleA_id: 'cz2', particleB_id: 'h9', type: 'single' },
        { particleA_id: 'ch2', particleB_id: 'h10', type: 'single' },
        { particleA_id: 'cz3', particleB_id: 'h11', type: 'single' },
        { particleA_id: 'ce3', particleB_id: 'h12', type: 'single' }
    ].map((b, i) => ({ ...b, id: `b${i}` }));

    const result = findAssemblableMolecules(particles, bonds);
    expect(result.size).toBe(27);
  });

  it('should detect Histidine (imidazole ring)', () => {
    const particles = [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'ca', type: PARTICLE_TYPES.CARBON },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'cb', type: PARTICLE_TYPES.CARBON },
        { id: 'cg', type: PARTICLE_TYPES.CARBON },
        { id: 'nd1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'cd2', type: PARTICLE_TYPES.CARBON },
        { id: 'ce1', type: PARTICLE_TYPES.CARBON },
        { id: 'ne2', type: PARTICLE_TYPES.NITROGEN },
        ...Array.from({length: 9}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN }))
    ];

    const bonds = [
        { particleA_id: 'n1', particleB_id: 'ca', type: 'single' },
        { particleA_id: 'ca', particleB_id: 'c1', type: 'single' },
        { particleA_id: 'c1', particleB_id: 'o1', type: 'double' },
        { particleA_id: 'c1', particleB_id: 'o2', type: 'single' },
        { particleA_id: 'ca', particleB_id: 'cb', type: 'single' },
        { particleA_id: 'cb', particleB_id: 'cg', type: 'single' },
        { particleA_id: 'cg', particleB_id: 'nd1', type: 'single' },
        { particleA_id: 'cg', particleB_id: 'cd2', type: 'double' },
        { particleA_id: 'nd1', particleB_id: 'ce1', type: 'double' },
        { particleA_id: 'cd2', particleB_id: 'ne2', type: 'single' },
        { particleA_id: 'ce1', particleB_id: 'ne2', type: 'single' },
        { particleA_id: 'n1', particleB_id: 'h1', type: 'single' }, { particleA_id: 'n1', particleB_id: 'h2', type: 'single' },
        { particleA_id: 'ca', particleB_id: 'h3', type: 'single' },
        { particleA_id: 'o2', particleB_id: 'h4', type: 'single' },
        { particleA_id: 'cb', particleB_id: 'h5', type: 'single' }, { particleA_id: 'cb', particleB_id: 'h6', type: 'single' },
        { particleA_id: 'nd1', particleB_id: 'h7', type: 'single' },
        { particleA_id: 'cd2', particleB_id: 'h8', type: 'single' },
        { particleA_id: 'ce1', particleB_id: 'h9', type: 'single' }
    ].map((b, i) => ({ ...b, id: `b${i}` }));

    const result = findAssemblableMolecules(particles, bonds);
    expect(result.size).toBe(20);
  });
});
