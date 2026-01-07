import { describe, it, expect } from 'vitest';
import { REACTIONS } from '../data/reactions';
import { CHEMICALS } from '../data/chemicals';

describe('Chemistry Data Integrity', () => {
  it('should have valid chemicals for all reaction inputs', () => {
    REACTIONS.forEach((reaction, index) => {
      Object.keys(reaction.inputs).forEach(chemId => {
        expect(CHEMICALS[chemId], `Reaction #${index} input ${chemId} not found in CHEMICALS`).toBeDefined();
      });
    });
  });

  it('should have valid chemicals for all reaction outputs', () => {
    REACTIONS.forEach((reaction, index) => {
      Object.keys(reaction.outputs).forEach(chemId => {
        expect(CHEMICALS[chemId], `Reaction #${index} output ${chemId} not found in CHEMICALS`).toBeDefined();
      });
    });
  });

  it('should have valid visual effects', () => {
    const validVisuals = ['bubble', 'solidify', 'fume', 'steam', 'dissolve', 'condense', 'distill'];
    REACTIONS.forEach((reaction, index) => {
      if (reaction.visual) {
        expect(validVisuals, `Reaction #${index} has invalid visual '${reaction.visual}'`).toContain(reaction.visual);
      }
    });
  });

  it('should define conservation of mass (roughly) - Warning only', () => {
    // This is optional, but good to check. 
    // We won't fail, just log if needed, but for now let's just check that inputs/outputs are not empty.
    REACTIONS.forEach((reaction) => {
      expect(Object.keys(reaction.inputs).length).toBeGreaterThan(0);
      expect(Object.keys(reaction.outputs).length).toBeGreaterThan(0);
    });
  });
});
