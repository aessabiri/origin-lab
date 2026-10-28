import { describe, it, expect, beforeEach } from 'vitest';
import { useBioStore } from '../store';
import { usePlanetaryStore } from '../../store/planetaryStore';
import { useProgressionStore } from '../../store/progressionStore';

describe('Bioreactor Stress Testing & Planetary Handshake', () => {
  beforeEach(() => {
    useBioStore.setState({
      agents: [],
      environment: { temperature: 37, nutrients: 80, radiation: 0 },
      stressTrial: {
        active: false,
        stage: 'idle',
        elapsed: 0,
        totalDuration: 30,
        initialAgents: 0,
        fitnessScore: null,
        certified: false,
        message: 'Awaiting Stress Trial initiation.',
      }
    });

    usePlanetaryStore.setState({
      temperature: 288,
      atmosphere: { nitrogen: 78, oxygen: 21, co2: 0.04, methane: 0.0001 },
      seededOrganism: null,
      species: [],
      events: [],
      era: 'HADEAN',
      ecoMetrics: {
        biodiversityIndex: 0,
        oxygenationLevel: 0,
        globalBiomass: 0,
        fossilRecord: [],
      }
    });
  });

  it('should initialize stress trial and apply thermal shock', () => {
    const protocells = [
      { id: 'cell_1', x: 400, y: 400, energy: 200, genome: { speed: 1, metabolism: 0.5, diet: 0 } },
      { id: 'cell_2', x: 420, y: 400, energy: 200, genome: { speed: 1, metabolism: 0.5, diet: 0 } }
    ];
    useBioStore.setState({ agents: protocells });

    useBioStore.getState().startStressTrial();

    const state = useBioStore.getState();
    expect(state.stressTrial.active).toBe(true);
    expect(state.stressTrial.stage).toBe('thermal_shock');
    expect(state.stressTrial.initialAgents).toBe(2);
    expect(state.environment.temperature).toBe(88.0);
  });

  it('should progress through UV flux and starvation to certify surviving cells', () => {
    const protocells = [
      { id: 'cell_1', x: 400, y: 400, energy: 300, genome: { speed: 1, metabolism: 0.5, diet: 0 } }
    ];
    useBioStore.setState({ agents: protocells });
    useBioStore.getState().startStressTrial();

    // Advance 12 seconds into UV stage
    useBioStore.getState().updateStressTrial(12);
    let state = useBioStore.getState();
    expect(state.stressTrial.stage).toBe('uv_flux');
    expect(state.environment.radiation).toBe(85);

    // Advance another 10 seconds into Starvation stage
    useBioStore.getState().updateStressTrial(10);
    state = useBioStore.getState();
    expect(state.stressTrial.stage).toBe('starvation');
    expect(state.environment.nutrients).toBe(5);

    // Finish trial (reach 30 seconds)
    useBioStore.getState().updateStressTrial(10);
    state = useBioStore.getState();
    expect(state.stressTrial.active).toBe(false);
    expect(state.stressTrial.stage).toBe('complete');
    expect(state.stressTrial.certified).toBe(true);
    expect(state.stressTrial.fitnessScore).toBeGreaterThanOrEqual(60);
  });

  it('should seed certified protocell into Planetary Ocean and initiate Archean era', () => {
    const protocells = [
      { id: 'LUCA', x: 400, y: 400, energy: 200, genome: { speed: 1, metabolism: 0.5, diet: 2 } } // Phototroph
    ];
    useBioStore.setState({ 
      agents: protocells,
      stressTrial: {
        active: false,
        stage: 'complete',
        elapsed: 30,
        totalDuration: 30,
        initialAgents: 1,
        fitnessScore: 92,
        certified: true,
        message: 'Strain certified!'
      }
    });

    useBioStore.getState().seedCertifiedOrganismToEarth();

    const planetState = usePlanetaryStore.getState();
    expect(planetState.seededOrganism).not.toBeNull();
    expect(planetState.era).toBe('ARCHEAN');
    expect(planetState.species.length).toBe(1);
    expect(planetState.species[0].traits.phototroph).toBe(true);
  });

  it('should evolve biosphere, convert CO2 to O2, and trigger speciation', () => {
    const organism = {
      name: 'LUCA Primordialis',
      traits: { phototroph: true, chemotroph: false, fitness: 95 },
      genome: { speed: 1, metabolism: 0.5, diet: 2 }
    };
    usePlanetaryStore.getState().seedPlanet(organism);

    // Evolve 100 steps
    usePlanetaryStore.getState().evolveStep(100, {});

    const planetState = usePlanetaryStore.getState();
    expect(planetState.ecoMetrics.globalBiomass).toBeGreaterThan(5);
    expect(planetState.atmosphere.oxygen).toBeGreaterThan(0);
    expect(planetState.species.length).toBeGreaterThanOrEqual(1);
  });
});
