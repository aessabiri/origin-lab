import { describe, it, expect, beforeEach } from 'vitest';
import { usePlanetaryStore } from '../store/planetaryStore';

describe('Planetary Store & Evolutionary Mechanics', () => {
  beforeEach(() => {
    // Reset store before each test
    usePlanetaryStore.getState().resetPlanet();
  });

  it('should seed the planet with an organism', () => {
    const store = usePlanetaryStore.getState();
    const luca = { name: 'LUCA Prototype', traits: { phototroph: true, chemotroph: false } };
    
    store.seedPlanet(luca);
    
    const updated = usePlanetaryStore.getState();
    expect(updated.seededOrganism).toEqual(luca);
    expect(updated.species).toContain(luca);
    expect(updated.ecoMetrics.biodiversityIndex).toBe(1);
    expect(updated.ecoMetrics.globalBiomass).toBe(1);
  });

  it('should evolve the planet over time', () => {
    const store = usePlanetaryStore.getState();
    const luca = { name: 'LUCA Prototype', traits: { phototroph: true } };
    
    store.seedPlanet(luca);
    store.evolveStep(10, {}); // Delta time of 10
    
    const updated = usePlanetaryStore.getState();
    expect(updated.ecoMetrics.globalBiomass).toBeGreaterThan(1);
  });

  it('should trigger planetary events', () => {
    const store = usePlanetaryStore.getState();
    store.triggerEvent('Great Oxidation Event');
    
    const updated = usePlanetaryStore.getState();
    expect(updated.events.length).toBe(1);
    expect(updated.events[0].type).toBe('Great Oxidation Event');
    expect(updated.events[0].timestamp).toBeDefined();
  });

  it('should update the atmosphere', () => {
    const store = usePlanetaryStore.getState();
    store.updateAtmosphere('oxygen', 5);
    
    const updated = usePlanetaryStore.getState();
    expect(updated.atmosphere.oxygen).toBe(26); // 21 + 5
  });
});
