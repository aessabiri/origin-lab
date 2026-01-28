import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../store';
import { useProgressionStore } from '../store/progressionStore';
import { useInventory } from '../store/inventory';
import { getUniversalCodexData } from '../utils/codexData';
import { CHEMICALS } from '../chemistry-lab/data/chemicals';
import { PARTICLE_INFO, PARTICLE_TYPES } from '../constants/particles';

// Mock dependencies if needed, but we're testing store integration so real stores are better.

describe('Global Sandbox Mode Integration', () => {
  beforeEach(() => {
    useStore.setState({ isSandboxMode: false });
    useProgressionStore.setState({ xp: 0, level: 1, completedMilestones: [] });
  });

  it('should allow XP gain when Sandbox Mode is OFF', () => {
    const { addXp } = useProgressionStore.getState();
    addXp(100);
    expect(useProgressionStore.getState().xp).toBe(100);
  });

  it('should PAUSE XP gain when Sandbox Mode is ON', () => {
    useStore.setState({ isSandboxMode: true });
    const { addXp } = useProgressionStore.getState();
    
    addXp(100);
    expect(useProgressionStore.getState().xp).toBe(0);
  });

  it('should PAUSE Milestone completion when Sandbox Mode is ON', () => {
    useStore.setState({ isSandboxMode: true });
    const { completeMilestone } = useProgressionStore.getState();
    
    completeMilestone('hadron_epoch');
    expect(useProgressionStore.getState().completedMilestones).not.toContain('hadron_epoch');
  });
});

describe('Codex Data Integrity (Deduplication)', () => {
  it('should not contain duplicate entries for items existing in both Particles and Chemicals', () => {
    const codexGroups = getUniversalCodexData();
    const allParticles = [];
    const idSet = new Set();
    const nameSet = new Set();
    const duplicates = [];

    // Traverse the generated structure
    codexGroups.forEach(group => {
      group.subcategories.forEach(sub => {
        sub.particles.forEach(id => {
          allParticles.push(id);
          
          // Check for duplicate IDs in the final list
          if (idSet.has(id)) {
             duplicates.push({ type: 'ID', value: id });
          }
          idSet.add(id);

          // Check for duplicate Names (approximate)
          // Note: PARTICLE_INFO names vs CHEMICALS names might differ slightly ("Sodium Chloride" vs "Salt")
          // But our dedupe logic specifically targets IDs or matching names.
          // Let's verify specifically for 'sodium-chloride' which caused issues.
        });
      });
    });

    // Expect no duplicate IDs in the flattened list
    if (duplicates.length > 0) {
        console.error("Duplicates found:", duplicates);
    }
    expect(duplicates).toHaveLength(0);
  });

  it('should correctly merge Chemical IDs into the list', () => {
    const codexGroups = getUniversalCodexData();
    const molecularGroup = codexGroups.find(g => g.name === 'Molecular');
    
    expect(molecularGroup).toBeDefined();
    
    // Check if 'vinegar' (Acetic Acid) is present (it's a chemical not in base particles usually, or merged)
    // Actually, 'acetic-acid' is in PARTICLE_TYPES. 'vinegar' is in CHEMICALS.
    // 'vinegar' has ID 'vinegar'. 'acetic-acid' has ID 'acetic-acid'.
    // They are different IDs, so both might exist unless filtered by name.
    
    const allMolecularIds = new Set();
    molecularGroup.subcategories.forEach(sub => sub.particles.forEach(p => allMolecularIds.add(p)));
    
    // Verify a chemical-only item exists
    expect(allMolecularIds.has('vinegar')).toBe(true);
    
    // Verify a particle-only item exists
    expect(allMolecularIds.has('water')).toBe(true);
  });
});

describe('Progression System', () => {
  beforeEach(() => {
    useProgressionStore.setState({ xp: 0, level: 1, completedMilestones: [] });
    useStore.setState({ isSandboxMode: false });
  });

  it('should level up when XP threshold is reached', () => {
    const { addXp } = useProgressionStore.getState();
    // Level 1 threshold is 1 * 1000 = 1000 XP
    
    addXp(500);
    expect(useProgressionStore.getState().level).toBe(1);
    
    addXp(600); // Total 1100
    expect(useProgressionStore.getState().level).toBe(2);
  });

  it('should award XP when completing a milestone', () => {
    const { completeMilestone } = useProgressionStore.getState();
    const initialXp = useProgressionStore.getState().xp;
    
    completeMilestone('hadron_epoch'); // Reward: 200 XP
    
    expect(useProgressionStore.getState().completedMilestones).toContain('hadron_epoch');
    expect(useProgressionStore.getState().xp).toBe(initialXp + 200);
  });
  
  it('should not award XP for already completed milestones', () => {
    const { completeMilestone } = useProgressionStore.getState();
    completeMilestone('hadron_epoch');
    const xpAfterFirst = useProgressionStore.getState().xp;
    
    completeMilestone('hadron_epoch'); // Try again
    
    expect(useProgressionStore.getState().xp).toBe(xpAfterFirst);
  });
});
