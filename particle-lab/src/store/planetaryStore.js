import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlanetaryStore = create(
  persist(
    (set, get) => ({
      // --- Planetary Stats ---
      temperature: 288, // Kelvin (15°C) - Standard Earth
      atmosphere: {
        nitrogen: 78,
        oxygen: 21,
        co2: 0.04,
        methane: 0.0001,
      },
      seaLevel: 0, // Meters relative to baseline
      ph: 8.1, // Ocean pH

      // --- Planetary Ecology ---
      seededOrganism: null, // LUCA prototype details
      species: [], // Array of evolved species
      ecoMetrics: {
        biodiversityIndex: 0,
        oxygenationLevel: 0,
        globalBiomass: 0,
        fossilRecord: [],
      },
      events: [], // Historical timeline of planetary milestones

      // --- Simulation State ---
      era: 'HADEAN', // HADEAN -> ARCHEAN -> PROTEROZOIC -> PHANEROZOIC
      population: 0, // Global biomass (legacy, keeping for compat if needed, or use ecoMetrics.globalBiomass)
      
      // --- Actions ---
      seedPlanet: (organism) => set({
        seededOrganism: organism,
        species: [organism],
        ecoMetrics: {
          biodiversityIndex: 1,
          oxygenationLevel: 0,
          globalBiomass: 1,
          fossilRecord: [],
        }
      }),

      evolveStep: (deltaTime, playerInterventions) => set(state => {
        // Mock evolution step
        // Depending on environment & interventions, increase biomass, branch species, trigger mutations
        const newBiomass = state.ecoMetrics.globalBiomass + (deltaTime * 0.1);
        const newBiodiversity = state.species.length; 
        return {
          ecoMetrics: {
            ...state.ecoMetrics,
            globalBiomass: newBiomass,
            biodiversityIndex: newBiodiversity
          }
        };
      }),

      triggerEvent: (type) => set(state => ({
        events: [...state.events, { type, timestamp: Date.now() }]
      })),

      updateAtmosphere: (gas, delta) => set(state => ({
        atmosphere: {
          ...state.atmosphere,
          [gas]: Math.max(0, (state.atmosphere[gas] || 0) + delta)
        }
      })),

      changeTemperature: (delta) => set(state => ({
        temperature: state.temperature + delta
      })),

      setEra: (newEra) => set({ era: newEra }),
      
      resetPlanet: () => set({
        temperature: 288,
        atmosphere: { nitrogen: 78, oxygen: 21, co2: 0.04, methane: 0.0001 },
        seaLevel: 0,
        ph: 8.1,
        seededOrganism: null,
        species: [],
        ecoMetrics: {
          biodiversityIndex: 0,
          oxygenationLevel: 0,
          globalBiomass: 0,
          fossilRecord: [],
        },
        events: [],
        era: 'HADEAN',
        population: 0
      })
    }),
    {
      name: 'origin-lab-planetary',
    }
  )
);
