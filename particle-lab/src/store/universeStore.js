import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The phases of existence
export const ERAS = {
  VOID: 'VOID',                   // 1. Pre-Big Bang (Quantum Fluctuations)
  BIG_BANG: 'BIG_BANG',           // 2. Cinematic Transition
  PARTICLE_ERA: 'PARTICLE_ERA',   // 3. Quark-Gluon Plasma -> Protons/Neutrons
  NUCLEOSYNTHESIS: 'NUCLEOSYNTHESIS', // 4. First Atoms (H, He)
  GALACTIC_ERA: 'GALACTIC_ERA',   // 5. Galaxy Formation
  STELLAR_ERA: 'STELLAR_ERA',     // 6. Star Formation (Fusion -> C, O, Fe)
  PLANETARY_ERA: 'PLANETARY_ERA', // 7. Solar System & Earth
  CHEMICAL_ERA: 'CHEMICAL_ERA',   // 8. Chemistry Lab Unlocked
  BIOLOGICAL_ERA: 'BIOLOGICAL_ERA', // 9. Biology Lab Unlocked
  ANTHROPOCENE: 'ANTHROPOCENE'    // 10. Endgame
};

export const useUniverseStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      currentEra: ERAS.VOID,
      universeAge: 0, // Time in "Cosmic Years"
      entropy: 0,     // A mechanic for later?

      // Unlocks (Cosmic Gates)
      unlockedLabs: {
        particle: false,
        chemistry: false,
        biology: false
      },

      // Global "Bank" of Mass (Exported from Labs to Universe)
      // This is distinct from the Lab Inventory (which is for crafting).
      // This represents "Total Mass in the Universe" available for building Stars/Planets.
      cosmicInventory: {
        hydrogenMass: 0,
        heliumMass: 0,
        carbonMass: 0,
        oxygenMass: 0,
        heavyMetalMass: 0, // Iron, Gold, etc.
        organicMatter: 0   // Amino acids, etc.
      },

      // --- Actions ---

      // Advance the Era (The "Level Up" function)
      advanceEra: (nextEra) => {
        set({ currentEra: nextEra });
        
        // Auto-unlock labs based on Era
        if (nextEra === ERAS.PARTICLE_ERA) {
          set(state => ({ unlockedLabs: { ...state.unlockedLabs, particle: true } }));
        }
        if (nextEra === ERAS.CHEMICAL_ERA) {
          set(state => ({ unlockedLabs: { ...state.unlockedLabs, chemistry: true } }));
        }
        if (nextEra === ERAS.BIOLOGICAL_ERA) {
          set(state => ({ unlockedLabs: { ...state.unlockedLabs, biology: true } }));
        }
      },

      // Add mass to the Cosmic Inventory (called when player "Exports" from Lab)
      addToCosmicInventory: (resource, amount) => set((state) => ({
        cosmicInventory: {
          ...state.cosmicInventory,
          [resource]: (state.cosmicInventory[resource] || 0) + amount
        }
      })),

      // Spend mass (called when forming Stars/Planets)
      consumeCosmicResource: (resource, amount) => {
        const current = get().cosmicInventory[resource] || 0;
        if (current >= amount) {
          set((state) => ({
            cosmicInventory: {
              ...state.cosmicInventory,
              [resource]: current - amount
            }
          }));
          return true; // Success
        }
        return false; // Not enough minerals
      },

      // Reset Universe
      resetUniverse: () => set({
        currentEra: ERAS.VOID,
        universeAge: 0,
        unlockedLabs: { particle: false, chemistry: false, biology: false },
        cosmicInventory: { hydrogenMass: 0, heliumMass: 0, carbonMass: 0, oxygenMass: 0, heavyMetalMass: 0, organicMatter: 0 }
      })
    }),
    {
      name: 'universe-store', // LocalStorage key
      getStorage: () => localStorage,
    }
  )
);
