import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useParticleActions } from '../hooks/useParticleActions';
import { useParticleStore as useStore } from '../store';
import { PARTICLE_TYPES } from '../../constants/particles';
import { PARTICLE_CATEGORIES } from '../../recipes';

describe('New Molecule Assembly Tests', () => {
  beforeEach(() => {
    useStore.setState({ 
      particles: [], 
      bonds: [], 
      discoveredMolecules: [],
      secondaryParticles: [],
      message: ''
    });
  });

  it('should assemble Nitrogen Gas (N2) with Triple Bond', () => {
    const p1 = { id: 'n1', type: PARTICLE_TYPES.NITROGEN, x: 0, y: 0 };
    const p2 = { id: 'n2', type: PARTICLE_TYPES.NITROGEN, x: 10, y: 0 };
    useStore.setState({ particles: [p1, p2] });

    const setSelectedParticleIds = vi.fn();
    
    // Mock selection info for N2
    // Recipe: 2 N, 1 Triple Bond
    const selectionInfo = {
      canAssemble: true,
      selectedParticles: [p1, p2],
      assemblyRecipe: { type: PARTICLE_TYPES.NITROGEN_GAS, category: PARTICLE_CATEGORIES.MOLECULE },
      isMoleculeAssembly: true,
    };

    const { result } = renderHook(() => useParticleActions({
      selectionInfo,
      goals: [],
      setSelectedParticleIds
    }));

    act(() => {
      result.current.handleAssemble();
    });

    const particles = useStore.getState().particles;
    expect(particles).toHaveLength(1);
    expect(particles[0].type).toBe(PARTICLE_TYPES.NITROGEN_GAS);
  });

  it('should assemble Methanol (CH3OH)', () => {
    const ingredients = [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
    ].map((p, i) => ({ ...p, x: i*10, y: 0 }));

    useStore.setState({ particles: ingredients });

    const setSelectedParticleIds = vi.fn();
    
    const selectionInfo = {
      canAssemble: true,
      selectedParticles: ingredients,
      assemblyRecipe: { type: PARTICLE_TYPES.METHANOL, category: PARTICLE_CATEGORIES.MOLECULE },
      isMoleculeAssembly: true,
    };

    const { result } = renderHook(() => useParticleActions({
      selectionInfo,
      goals: [],
      setSelectedParticleIds
    }));

    act(() => {
      result.current.handleAssemble();
    });

    const particles = useStore.getState().particles;
    expect(particles).toHaveLength(1);
    expect(particles[0].type).toBe(PARTICLE_TYPES.METHANOL);
  });
});
