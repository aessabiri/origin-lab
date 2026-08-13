import { describe, it, expect, beforeEach } from 'vitest';
import { useInventory } from './src/store/inventory';
import { useDiscoveredMatter } from './src/hooks/useDiscoveredMatter';
import { useParticleStore } from './src/particle-lab/store';
import React from 'react';

// Mock hook
const useDiscoveredMatterHook = () => {
    const discoveredIds = useInventory.getState().discoveredItems;
    // Minimal replication of hook logic
    return { discoveredAtoms: discoveredIds.map(id => ({ type: id })) };
};

describe('Visibility Reproduction', () => {
  beforeEach(() => {
    localStorage.clear();
    useInventory.setState({ discoveredItems: [] });
    useParticleStore.setState({ secondaryParticles: [], isSandboxMode: false });
  });

  it('starts with empty discovered atoms', () => {
    const { discoveredAtoms } = useDiscoveredMatterHook();
    expect(discoveredAtoms).toEqual([]);
  });

  it('starts with empty secondary particles', () => {
    const secondaryParticles = useParticleStore.getState().secondaryParticles;
    expect(secondaryParticles).toEqual([]);
  });

  it('does not have iron, carbon, helium discovered by default', () => {
    const { discoveredAtoms } = useDiscoveredMatterHook();
    const types = discoveredAtoms.map(a => a.type);
    expect(types).not.toContain('iron');
    expect(types).not.toContain('carbon');
    expect(types).not.toContain('helium');
  });
});
