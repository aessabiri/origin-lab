import { describe, it, expect, beforeEach } from 'vitest';
import { usePlanetaryStore } from '../store/planetaryStore';
import { useProgressionStore } from '../store/progressionStore';

describe('Phase 4 & Phase 5: Planetary Biosphere, Cladogram & Anthropocene Evolution', () => {
  beforeEach(() => {
    usePlanetaryStore.getState().resetPlanet();
    useProgressionStore.getState().resetProgression();
  });

  it('should initialize with an 11-stage phylogenetic cladogram upon seeding', () => {
    const store = usePlanetaryStore.getState();
    const luca = { 
      name: 'LUCA Primordialis', 
      traits: { phototroph: true, chemotroph: true, fitness: 92 } 
    };

    store.seedPlanet(luca);

    const state = usePlanetaryStore.getState();
    expect(state.seededOrganism).toEqual(luca);
    expect(state.cladogram.length).toBe(11);
    
    // First clade (LUCA) must be unlocked; later clades locked
    expect(state.cladogram[0].id).toBe('luca');
    expect(state.cladogram[0].unlocked).toBe(true);
    expect(state.cladogram[1].id).toBe('cyanobacteria');
    expect(state.cladogram[1].unlocked).toBe(false);
    expect(state.cladogram[10].id).toBe('hominini');
    expect(state.cladogram[10].unlocked).toBe(false);

    expect(state.ecoMetrics.biodiversityIndex).toBe(1);
    expect(state.ecoMetrics.cephalizationIndex).toBe(0.0);
    expect(state.ecoMetrics.cognitiveComplexity).toBe(0);
  });

  it('should advance cladogram radiations and era milestones under evolutionary pressure', () => {
    const store = usePlanetaryStore.getState();
    const luca = { 
      name: 'LUCA Primordialis', 
      traits: { phototroph: true, chemotroph: true, fitness: 95 } 
    };
    store.seedPlanet(luca);

    // Simulate multi-epoch evolution with high delta time
    for (let i = 0; i < 40; i++) {
      usePlanetaryStore.getState().evolveStep(20, {});
    }

    const state = usePlanetaryStore.getState();
    expect(state.ecoMetrics.globalBiomass).toBeGreaterThan(100);
    expect(state.atmosphere.oxygen).toBeGreaterThan(1.0);

    // Archean should have transitioned to at least Proterozoic or Phanerozoic
    expect(['PROTEROZOIC', 'PHANEROZOIC', 'ANTHROPOCENE']).toContain(state.era);

    // Cyanobacteria and Archaea should be unlocked
    const cyano = state.cladogram.find(c => c.id === 'cyanobacteria');
    const archaea = state.cladogram.find(c => c.id === 'archaea');
    expect(cyano?.unlocked).toBe(true);
    expect(archaea?.unlocked).toBe(true);

    // Progression store should have registered Great Oxidation
    const prog = useProgressionStore.getState();
    expect(prog.completedMilestones).toContain('great_oxidation');
  });

  it('should scale cephalization quotient (EQ) and cognitive metrics as advanced clades radiate', () => {
    const store = usePlanetaryStore.getState();
    const luca = { 
      name: 'LUCA Primordialis', 
      traits: { phototroph: true, chemotroph: true } 
    };
    store.seedPlanet(luca);

    // Evolve extensively to trigger metazoan radiation and cephalization
    for (let i = 0; i < 150; i++) {
      usePlanetaryStore.getState().evolveStep(30, {});
    }

    const state = usePlanetaryStore.getState();
    // EQ and cognitive complexity must have grown significantly beyond primordial zero
    expect(state.ecoMetrics.cephalizationIndex).toBeGreaterThan(0.2);
    expect(state.ecoMetrics.cognitiveComplexity).toBeGreaterThan(20);
    expect(state.ecoMetrics.surfaceUVFlux).toBeLessThan(80); // Ozone shielding
  });

  it('should execute Supervolcano Caldera Eruption with accurate volcanic winter & acidification', () => {
    const store = usePlanetaryStore.getState();
    const luca = { name: 'LUCA Primordialis', traits: { phototroph: true } };
    store.seedPlanet(luca);

    // Build some initial biomass
    store.evolveStep(50, {});
    const preBiomass = usePlanetaryStore.getState().ecoMetrics.globalBiomass;
    const preTemp = usePlanetaryStore.getState().temperature;
    const preCO2 = usePlanetaryStore.getState().atmosphere.co2;
    const prePH = usePlanetaryStore.getState().ph;

    store.triggerCatastrophicEvent('SUPERVOLCANO');

    const post = usePlanetaryStore.getState();
    expect(post.temperature).toBeLessThan(preTemp); // Volcanic cooling
    expect(post.atmosphere.co2).toBeGreaterThan(preCO2); // Outgassing
    expect(post.ph).toBeLessThan(prePH); // Ocean acidification
    expect(post.ecoMetrics.globalBiomass).toBeLessThan(preBiomass); // Decimation
    expect(post.activeCatastrophe?.type).toBe('SUPERVOLCANO');
    expect(post.catastropheCooldowns.SUPERVOLCANO).toBeGreaterThan(0);

    // Fossil record should log the cataclysm
    const lastFossil = post.ecoMetrics.fossilRecord[post.ecoMetrics.fossilRecord.length - 1];
    expect(lastFossil.name).toContain('Supervolcano');
  });

  it('should execute Asteroid Impact with Chicxulub-scale mass extinction', () => {
    const store = usePlanetaryStore.getState();
    const luca = { name: 'LUCA Primordialis', traits: { phototroph: true } };
    store.seedPlanet(luca);

    store.evolveStep(60, {});
    const preBiomass = usePlanetaryStore.getState().ecoMetrics.globalBiomass;

    store.triggerCatastrophicEvent('ASTEROID_IMPACT');

    const post = usePlanetaryStore.getState();
    // Decimates 75% of global biomass
    expect(post.ecoMetrics.globalBiomass).toBeCloseTo(preBiomass * 0.25, 1);
    expect(post.activeCatastrophe?.type).toBe('ASTEROID_IMPACT');

    const lastFossil = post.ecoMetrics.fossilRecord[post.ecoMetrics.fossilRecord.length - 1];
    expect(lastFossil.name).toContain('Asteroid');
  });

  it('should respect catastrophe cooldowns and prevent immediate re-triggering', () => {
    const store = usePlanetaryStore.getState();
    store.triggerCatastrophicEvent('ASTEROID_IMPACT');
    
    const initialCooldown = usePlanetaryStore.getState().catastropheCooldowns.ASTEROID_IMPACT;
    expect(initialCooldown).toBeGreaterThan(0);

    const eventCountBefore = usePlanetaryStore.getState().events.length;
    // Attempt second trigger during active cooldown
    store.triggerCatastrophicEvent('ASTEROID_IMPACT');
    const eventCountAfter = usePlanetaryStore.getState().events.length;

    expect(eventCountAfter).toBe(eventCountBefore); // Blocked
  });

  it('should reach the Anthropocene Epoch and complete the Cosmic Ouroboros milestone', () => {
    const store = usePlanetaryStore.getState();
    const luca = { name: 'LUCA Primordialis', traits: { phototroph: true } };
    store.seedPlanet(luca);

    // Manually push biomass & oxygen to trigger Anthropocene sapiens emergence
    for (let i = 0; i < 250; i++) {
      usePlanetaryStore.getState().evolveStep(50, {});
    }

    const state = usePlanetaryStore.getState();
    const hominini = state.cladogram.find(c => c.id === 'hominini');
    expect(hominini?.unlocked).toBe(true);
    expect(state.era).toBe('ANTHROPOCENE');
    expect(state.ecoMetrics.cephalizationIndex).toBe(7.5);
    expect(state.ecoMetrics.cognitiveComplexity).toBe(100);

    // Milestones check
    const prog = useProgressionStore.getState();
    expect(prog.completedMilestones).toContain('anthropocene');
  });
});
