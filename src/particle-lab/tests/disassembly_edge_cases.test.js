import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelection } from '../hooks/useSelection';
import { useParticleStore } from '../store';
import { PARTICLE_TYPES } from '../../constants/particles';

// Mock canvasRef
const mockCanvasRef = {
  current: {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  },
};

describe('Selection Disassembly Logic (Polypeptides)', () => {
  beforeEach(() => {
    useParticleStore.getState().setParticles([]);
    useParticleStore.getState().setBonds([]);
  });

  it('should allow disassembly for Glycylglycine', () => {
    const { getState } = useParticleStore;
    
    // Add Glycylglycine to store
    act(() => {
      getState().setParticles([
        { id: 'gg-1', type: PARTICLE_TYPES.GLYCYLGLYCINE, x: 100, y: 100 }
      ]);
    });

    const { result } = renderHook(() => useSelection({ canvasRef: mockCanvasRef }));

    // Select it
    act(() => {
      result.current.setSelectedParticleIds(new Set(['gg-1']));
    });

    expect(result.current.selectionInfo.canDisassemble).toBe(true);
  });

  it('should allow disassembly for Glycyl-Alanine', () => {
    const { getState } = useParticleStore;
    
    act(() => {
      getState().setParticles([
        { id: 'ga-1', type: PARTICLE_TYPES.GLYCYL_ALANINE, x: 100, y: 100 }
      ]);
    });

    const { result } = renderHook(() => useSelection({ canvasRef: mockCanvasRef }));

    act(() => {
      result.current.setSelectedParticleIds(new Set(['ga-1']));
    });

    expect(result.current.selectionInfo.canDisassemble).toBe(true);
  });

  it('should NOT allow disassembly if multiple particles are selected', () => {
    const { getState } = useParticleStore;
    
    act(() => {
      getState().setParticles([
        { id: 'gg-1', type: PARTICLE_TYPES.GLYCYLGLYCINE, x: 100, y: 100 },
        { id: 'h-1', type: PARTICLE_TYPES.HYDROGEN, x: 200, y: 200 }
      ]);
    });

    const { result } = renderHook(() => useSelection({ canvasRef: mockCanvasRef }));

    act(() => {
      result.current.setSelectedParticleIds(new Set(['gg-1', 'h-1']));
    });

    expect(result.current.selectionInfo.canDisassemble).toBe(false);
  });
});
