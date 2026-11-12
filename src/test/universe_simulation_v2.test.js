import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { Epoch, SimulationManager } from '../universe-simulation/SimulationManager';
import { SolarSystemStage } from '../universe-simulation/stages/SolarSystemStage';
import { EarthStage } from '../universe-simulation/stages/EarthStage';
import { ERA_TO_EVOLUTION_VAL } from '../components/PlanetGlobe3D';

describe('Universe Simulation V2 & Desktop 3D Solar System / Earth Integration Tests', () => {
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

  it('should transition between cosmic epochs cleanly and synchronously update telemetry', () => {
    const manager = new SimulationManager(mockContainer);

    manager.setEpoch(Epoch.STELLAR_DAWN);
    const starData = manager.getEpochData();
    expect(starData.title).toBe('Stellar Dawn');

    manager.setEpoch(Epoch.SOLAR_SYSTEM);
    const solarData = manager.getEpochData();
    expect(solarData.title).toBe('Solar System');

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

  it('should provide all 8 Solar System planets with spectrometer scanData and habitability metrics', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1.33, 0.1, 5000);
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    const stage = new SolarSystemStage(scene, camera, mockContainer, sunLight);

    expect(stage.planets.length).toBe(8);
    const earth = stage.planets[2];
    expect(earth.name).toBe('Earth');
    expect(earth.scanData.o2).toBe(21);
    expect(earth.scanData.h2o).toBe(85);
    const earthHabitability = Math.round((earth.scanData.o2 * 2 + earth.scanData.h2o) / 2.5);
    expect(earthHabitability).toBeGreaterThan(50);

    stage.setFocusIndex(2);
    const focusedMetrics = stage.getMetrics();
    expect(focusedMetrics.phase).toBe('Earth');
    expect(focusedMetrics.o2).toBe('21%');

    stage.setFocusIndex(null);
    expect(stage.getMetrics().phase).toBe('Solar System');
    stage.destroy();
  });

  it('should morph 3D EarthStage across Hadean, Archean, Proterozoic, and Phanerozoic eras', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1.33, 0.1, 5000);
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    const earthStage = new EarthStage(scene, camera, mockContainer, sunLight);
    earthStage.init();

    // Default Modern / Phanerozoic (1.0)
    expect(earthStage.getMetrics().phase).toBe('Phanerozoic Eon');
    expect(earthStage.getMetrics().o2).toBe('21%');

    // Deploy LUCA Seed
    earthStage.deploySeed();

    // Verify ERA_TO_EVOLUTION_VAL mapping for PlanetGlobe3D
    expect(ERA_TO_EVOLUTION_VAL.HADEAN).toBeLessThan(0.4);
    expect(ERA_TO_EVOLUTION_VAL.ARCHEAN).toBeGreaterThanOrEqual(0.4);
    expect(ERA_TO_EVOLUTION_VAL.PROTEROZOIC).toBeCloseTo(0.7);
    expect(ERA_TO_EVOLUTION_VAL.PHANEROZOIC).toBe(1.0);
    expect(ERA_TO_EVOLUTION_VAL.ANTHROPOCENE).toBe(1.0);

    earthStage.destroy();
  });
});
