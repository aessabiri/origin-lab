import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useParticleActions } from '../hooks/useParticleActions';
import { useParticleStore as useStore } from '../store';
import { PARTICLE_TYPES } from '../../constants/particles';
import { PARTICLE_CATEGORIES } from '../../recipes';

describe('Organelle Assembly Tests', () => {
  beforeEach(() => {
    useStore.setState({ 
      particles: [], 
      bonds: [], 
      discoveredMolecules: [],
      secondaryParticles: [], // For tracking discovery if logic uses it
      message: ''
    });
  });

  it('should assemble a Cell Membrane from Lipids and Proteins', () => {
    const p1 = { id: 'l1', type: PARTICLE_TYPES.LIPID, x: 0, y: 0 };
    const p2 = { id: 'l2', type: PARTICLE_TYPES.LIPID, x: 10, y: 0 };
    const p3 = { id: 'prot1', type: PARTICLE_TYPES.GLYCYL_ALANINE, x: 20, y: 0 }; // Protein proxy
    useStore.setState({ particles: [p1, p2, p3] });

    const setSelectedParticleIds = vi.fn();
    
    // Mock selection info for Membrane assembly
    // Recipe: 2 Lipids + 1 Glycyl-Alanine
    const selectionInfo = {
      canAssemble: true,
      selectedParticles: [p1, p2, p3],
      assemblyRecipe: { type: PARTICLE_TYPES.MEMBRANE, category: PARTICLE_CATEGORIES.ORGANELLE },
      isMoleculeAssembly: false, // Organelles might be handled by generic recipe logic unless specified
      isPolypeptideAssembly: false
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
    expect(particles[0].type).toBe(PARTICLE_TYPES.MEMBRANE);
    expect(setSelectedParticleIds).toHaveBeenCalledWith(new Set());
  });

  it('should assemble a Nucleus from Membranes and DNA', () => {
    // Recipe: 2 Membranes + 4 DNA
    const ingredients = [
        { id: 'm1', type: PARTICLE_TYPES.MEMBRANE },
        { id: 'm2', type: PARTICLE_TYPES.MEMBRANE },
        { id: 'd1', type: PARTICLE_TYPES.DNA },
        { id: 'd2', type: PARTICLE_TYPES.DNA },
        { id: 'd3', type: PARTICLE_TYPES.DNA },
        { id: 'd4', type: PARTICLE_TYPES.DNA },
    ].map((p, i) => ({ ...p, x: i*10, y: 0 }));

    useStore.setState({ particles: ingredients });

    const setSelectedParticleIds = vi.fn();
    
    const selectionInfo = {
      canAssemble: true,
      selectedParticles: ingredients,
      assemblyRecipe: { type: PARTICLE_TYPES.NUCLEUS, category: PARTICLE_CATEGORIES.ORGANELLE },
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
    expect(particles[0].type).toBe(PARTICLE_TYPES.NUCLEUS);
  });
});
