import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelection } from '../hooks/useSelection';
import { useStore } from '../store';
import { PARTICLE_TYPES } from '../constants/particles';

// Mock canvas ref
const mockCanvasRef = { current: { getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }) } };

describe('useSelection Hook', () => {
  beforeEach(() => {
    useStore.setState({ particles: [], bonds: [] });
  });

  it('should detect simple assembly (Proton)', () => {
    const particles = [
      { id: 'u1', type: PARTICLE_TYPES.UP_QUARK, x: 0, y: 0 },
      { id: 'u2', type: PARTICLE_TYPES.UP_QUARK, x: 10, y: 0 },
      { id: 'd1', type: PARTICLE_TYPES.DOWN_QUARK, x: 20, y: 0 },
    ];
    useStore.setState({ particles });

    const { result } = renderHook(() => useSelection({ canvasRef: mockCanvasRef }));

    act(() => {
      // Manually simulate selection
      result.current.setSelectedParticleIds(new Set(['u1', 'u2', 'd1']));
    });

    const { canAssemble, assemblyRecipe } = result.current.selectionInfo;
    
    expect(canAssemble).toBe(true);
    expect(assemblyRecipe.type).toBe(PARTICLE_TYPES.PROTON);
  });

  it('should detect molecule assembly with bonds (Acetic Acid)', () => {
    // Acetic Acid: 2 C, 4 H, 2 O. Bonds: 6 single, 1 double
    const particles = [
      { id: 'c1', type: PARTICLE_TYPES.CARBON, x: 0, y: 0 },
      { id: 'c2', type: PARTICLE_TYPES.CARBON, x: 10, y: 0 },
      { id: 'h1', type: PARTICLE_TYPES.HYDROGEN, x: 20, y: 0 },
      { id: 'h2', type: PARTICLE_TYPES.HYDROGEN, x: 30, y: 0 },
      { id: 'h3', type: PARTICLE_TYPES.HYDROGEN, x: 40, y: 0 },
      { id: 'h4', type: PARTICLE_TYPES.HYDROGEN, x: 50, y: 0 },
      { id: 'o1', type: PARTICLE_TYPES.OXYGEN, x: 60, y: 0 },
      { id: 'o2', type: PARTICLE_TYPES.OXYGEN, x: 70, y: 0 },
    ];
    
    // We need 6 single bonds and 1 double bond. 
    // Connectivity doesn't strictly matter for the count check, but ids must match.
    const bonds = [
      { id: 'b1', particleA_id: 'c1', particleB_id: 'h1', type: 'single' },
      { id: 'b2', particleA_id: 'c1', particleB_id: 'h2', type: 'single' },
      { id: 'b3', particleA_id: 'c1', particleB_id: 'h3', type: 'single' },
      { id: 'b4', particleA_id: 'c2', particleB_id: 'o1', type: 'single' }, // OH group
      { id: 'b5', particleA_id: 'o1', particleB_id: 'h4', type: 'single' },
      { id: 'b6', particleA_id: 'c1', particleB_id: 'c2', type: 'single' },
      { id: 'b7', particleA_id: 'c2', particleB_id: 'o2', type: 'double' }, // C=O
    ];

    useStore.setState({ particles, bonds });

    const { result } = renderHook(() => useSelection({ canvasRef: mockCanvasRef }));

    act(() => {
      const allIds = new Set(particles.map(p => p.id));
      result.current.setSelectedParticleIds(allIds);
    });

    const { canAssemble, assemblyRecipe, isMoleculeAssembly } = result.current.selectionInfo;
    
    expect(canAssemble).toBe(true);
    expect(isMoleculeAssembly).toBe(true);
    expect(assemblyRecipe.type).toBe(PARTICLE_TYPES.ACETIC_ACID);
  });

  it('should NOT assemble incomplete recipes', () => {
    const particles = [
      { id: 'u1', type: PARTICLE_TYPES.UP_QUARK, x: 0, y: 0 },
      { id: 'd1', type: PARTICLE_TYPES.DOWN_QUARK, x: 20, y: 0 },
    ];
    useStore.setState({ particles });

    const { result } = renderHook(() => useSelection({ canvasRef: mockCanvasRef }));

    act(() => {
      result.current.setSelectedParticleIds(new Set(['u1', 'd1']));
    });

    expect(result.current.selectionInfo.canAssemble).toBe(false);
  });

  it('should allow disassembly of compound particles', () => {
     const particles = [
      { id: 'p1', type: PARTICLE_TYPES.PROTON, x: 0, y: 0 },
    ];
    useStore.setState({ particles });

    const { result } = renderHook(() => useSelection({ canvasRef: mockCanvasRef }));

    act(() => {
      result.current.setSelectedParticleIds(new Set(['p1']));
    });

    expect(result.current.selectionInfo.canDisassemble).toBe(true);
  });
});
