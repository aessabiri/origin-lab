import { describe, it, expect } from 'vitest';
import { MATTER_DEFINITIONS, getMatterInfo, getAllMatter } from '../constants/matterRegistry';
import { PARTICLE_TYPES } from '../constants/particles';

describe('Unified Matter Registry', () => {
  it('should contain definitions from Physics (PARTICLE_INFO)', () => {
    const proton = getMatterInfo(PARTICLE_TYPES.PROTON);
    expect(proton).toBeDefined();
    expect(proton.mass).toBeDefined();
    expect(proton.source).toBe('Physics');
  });

  it('should contain definitions from Chemistry', () => {
    // Pick a chemical likely to exist, e.g., WATER
    const waterId = PARTICLE_TYPES.WATER; 
    const water = getMatterInfo(waterId);
    
    expect(water).toBeDefined();
    expect(water.formula).toBe('H₂O');
    expect(water.source).toBe('Chemistry');
    expect(water.isChemical).toBe(true);
  });

  it('should contain baking-soda with correct metadata', () => {
    const bakingSoda = MATTER_DEFINITIONS['baking-soda'];
    expect(bakingSoda).toBeDefined();
    expect(bakingSoda.name).toBe('Baking Soda');
  });

  it('should have a color for every entry', () => {
    const all = getAllMatter();
    all.forEach(matter => {
      expect(matter.color).toBeDefined();
    });
  });

  it('should handle unknown IDs gracefully', () => {
    const unknown = getMatterInfo('UNOBTAINIUM_999');
    expect(unknown.name).toBe('Unknown Substance');
    expect(unknown.color).toBe('#9ca3af');
  });
});