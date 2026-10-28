import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Epoch, SimulationManager } from '../universe-simulation/SimulationManager';

describe('Universe Simulation V2 Integration Tests', () => {
  let mockContainer;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    Object.defineProperty(mockContainer, 'clientWidth', { value: 1024, configurable: true });
    Object.defineProperty(mockContainer, 'clientHeight', { value: 768, configurable: true });
  });

  it('should define all 6 cosmic epochs in chronological order', () => {
    expect(Epoch.BIG_BANG).toBe(0);
    expect(Epoch.PLASMA).toBe(1);
    expect(Epoch.STELLAR_DAWN).toBe(2);
    expect(Epoch.GALAXY_FORMATION).toBe(3);
    expect(Epoch.SOLAR_SYSTEM).toBe(4);
    expect(Epoch.EARTH).toBe(5);
  });

  it('should instantiate SimulationManager and retrieve cosmic epoch telemetry data', () => {
    const manager = new SimulationManager(mockContainer);
    expect(manager).toBeDefined();

    const bbData = manager.getEpochData();
    expect(bbData).toBeDefined();
    expect(bbData.title).toBe('The Big Bang');
    expect(bbData.temp).toBe('10^27 K');

    manager.dispose();
  });

  it('should transition between cosmic epochs cleanly', () => {
    const manager = new SimulationManager(mockContainer);

    manager.setEpoch(Epoch.STELLAR_DAWN);
    const starData = manager.getEpochData();
    expect(starData.title).toBe('Stellar Dawn');

    manager.setEpoch(Epoch.EARTH);
    const earthData = manager.getEpochData();
    expect(earthData.title).toBe('Evolution of Earth');

    manager.dispose();
  });

  it('should toggle simulation pause and speed time scaling correctly', () => {
    const manager = new SimulationManager(mockContainer);

    expect(manager.getSimulationState().paused).toBe(false);
    const paused = manager.togglePause();
    expect(paused).toBe(true);
    expect(manager.getSimulationState().paused).toBe(true);

    manager.setTimeScale(5.0);
    expect(manager.getSimulationState().speed).toBe(5.0);

    manager.dispose();
  });
});
