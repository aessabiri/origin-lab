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

      // --- Simulation State ---
      era: 'HADEAN', // HADEAN -> ARCHEAN -> PROTEROZOIC -> PHANEROZOIC
      population: 0, // Global biomass
      
      // --- Actions ---
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
        atmosphere: { nitrogen: 78, oxygen: 21, co2: 0.04 },
        seaLevel: 0,
        ph: 8.1,
        era: 'HADEAN',
        population: 0
      })
    }),
    {
      name: 'origin-lab-planetary',
    }
  )
);
