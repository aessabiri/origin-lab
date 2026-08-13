import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useParticleActions } from '../hooks/useParticleActions';
import { useDecay } from '../hooks/useDecay';
import { useParticleStore as useStore } from '../store';
import { PARTICLE_TYPES } from '../../constants/particles';
import { MOLECULE_RECIPES } from '../../constants/moleculeRecipes';

describe('Particle Lab Bugfixes', () => {
  beforeEach(() => {
    useStore.setState({ 
      particles: [], 
      bonds: [], 
      message: '',
      secondaryParticles: []
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('disassembly should only remove bonds connected to the disassembled particle', () => {
    // Setup 4 particles, and 2 bonds
    const p1 = { id: 'p1', type: PARTICLE_TYPES.WATER, x: 0, y: 0 };
    const p2 = { id: 'p2', type: PARTICLE_TYPES.OXYGEN, x: 10, y: 0 };
    const p3 = { id: 'p3', type: PARTICLE_TYPES.HYDROGEN, x: 20, y: 0 };
    const p4 = { id: 'p4', type: PARTICLE_TYPES.HYDROGEN, x: 30, y: 0 };

    // Add a recipe for WATER just in case it's needed for molecule disassembly
    const bond1 = { id: 'b1', particleA_id: 'p1', particleB_id: 'p2', type: 'single' };
    const bond2 = { id: 'b2', particleA_id: 'p3', particleB_id: 'p4', type: 'single' };

    useStore.setState({ 
      particles: [p1, p2, p3, p4],
      bonds: [bond1, bond2]
    });

    const setSelectedParticleIds = vi.fn();
    const selectionInfo = {
      canDisassemble: true,
      selectedParticles: [p1]
    };

    const { result } = renderHook(() => useParticleActions({
      selectionInfo,
      setSelectedParticleIds
    }));

    act(() => {
      result.current.handleDisassemble();
    });

    const { bonds } = useStore.getState();
    // Only bond1 should be removed because it connects to p1. bond2 connects p3 and p4 and should remain.
    expect(bonds.length).toBe(1);
    expect(bonds[0].id).toBe('b2');
  });

  it('particle decay should clean up bonds connected to the decayed particle', () => {
    const p1 = { id: 'p1', type: PARTICLE_TYPES.EXCITED_ELECTRON, x: 0, y: 0 };
    const p2 = { id: 'p2', type: PARTICLE_TYPES.PROTON, x: 10, y: 0 };
    
    const bond = { id: 'b1', particleA_id: 'p1', particleB_id: 'p2', type: 'single' };
    
    useStore.setState({ 
      particles: [p1, p2],
      bonds: [bond]
    });

    const triggerRadiationBurst = vi.fn();
    renderHook(() => useDecay(triggerRadiationBurst));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const { particles, bonds } = useStore.getState();
    const hasExcitedElectron = particles.some(p => p.type === PARTICLE_TYPES.EXCITED_ELECTRON);
    
    expect(hasExcitedElectron).toBe(false);
    expect(bonds.length).toBe(0); // Bond should be cleaned up
  });

  it('antimatter annihilation should clean up particles and their bonds', () => {
    const electron = { id: 'e1', type: PARTICLE_TYPES.ELECTRON, x: 0, y: 0 };
    const positron = { id: 'p1', type: PARTICLE_TYPES.POSITRON, x: 5, y: 5 }; // close enough to annihilate (< 40px)
    const extraParticle = { id: 'ex1', type: PARTICLE_TYPES.PROTON, x: 100, y: 100 };

    const bond1 = { id: 'b1', particleA_id: 'e1', particleB_id: 'ex1', type: 'single' };
    
    useStore.setState({ 
      particles: [electron, positron, extraParticle],
      bonds: [bond1]
    });

    const triggerRadiationBurst = vi.fn();
    renderHook(() => useDecay(triggerRadiationBurst));

    // Annihilation happens synchronously in the effect
    const { particles, bonds } = useStore.getState();
    
    const hasElectron = particles.some(p => p.type === PARTICLE_TYPES.ELECTRON);
    const hasPositron = particles.some(p => p.type === PARTICLE_TYPES.POSITRON);
    const hasPhoton = particles.some(p => p.type === PARTICLE_TYPES.PHOTON);

    expect(hasElectron).toBe(false);
    expect(hasPositron).toBe(false);
    expect(hasPhoton).toBe(true);
    expect(bonds.length).toBe(0); // Bond to the electron should be removed
  });
});
