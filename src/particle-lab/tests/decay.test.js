import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDecay } from '../hooks/useDecay';
import { useParticleStore as useStore } from '../store';
import { PARTICLE_TYPES } from '../../constants/particles';

describe('useDecay Hook', () => {
  beforeEach(() => {
    useStore.setState({ particles: [], message: '' });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should decay EXCITED_ELECTRON after 3 seconds', () => {
    const triggerRadiationBurst = vi.fn();
    const particle = { id: 'p1', type: PARTICLE_TYPES.EXCITED_ELECTRON, x: 0, y: 0 };
    useStore.setState({ particles: [particle] });

    renderHook(() => useDecay(triggerRadiationBurst));

    expect(useStore.getState().particles[0].type).toBe(PARTICLE_TYPES.EXCITED_ELECTRON);

    // Fast-forward
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const particles = useStore.getState().particles;
    const hasElectron = particles.some(p => p.type === PARTICLE_TYPES.ELECTRON);
    const hasPhoton = particles.some(p => p.type === PARTICLE_TYPES.PHOTON);

    expect(hasElectron).toBe(true);
    expect(hasPhoton).toBe(true);
    expect(triggerRadiationBurst).toHaveBeenCalled();
  });

  it('should decay DECAYING_NEUTRON after 4 seconds', () => {
    const triggerRadiationBurst = vi.fn();
    const particle = { id: 'n1', type: PARTICLE_TYPES.DECAYING_NEUTRON, x: 0, y: 0 };
    useStore.setState({ particles: [particle] });

    renderHook(() => useDecay(triggerRadiationBurst));

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    const particles = useStore.getState().particles;
    const hasProton = particles.some(p => p.type === PARTICLE_TYPES.PROTON);
    const hasElectron = particles.some(p => p.type === PARTICLE_TYPES.ELECTRON);
    const hasAntiNeutrino = particles.some(p => p.type === PARTICLE_TYPES.ELECTRON_ANTINEUTRINO);

    expect(hasProton).toBe(true);
    expect(hasElectron).toBe(true);
    expect(hasAntiNeutrino).toBe(true);
  });
});
