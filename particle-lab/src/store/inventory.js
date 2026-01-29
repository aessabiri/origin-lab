import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProgressionStore } from './progressionStore';

// The Universal Ledger
// Tracks the total mass/count of every substance in the simulation.

export const useInventory = create(
  persist(
    (set, get) => ({
      // --- Primordial Matter ---
      energy: 0, // Raw energy from Big Bang
      quarks: { up: 0, down: 0, charm: 0, strange: 0, top: 0, bottom: 0 },
      
      // --- Elemental Stock (The Periodic Table) ---
      // Keys match PARTICLE_TYPES values (e.g., 'hydrogen', 'carbon')
      elements: {
        hydrogen: 0,
        helium: 0,
        carbon: 0,
        nitrogen: 0,
        oxygen: 0,
        phosphorus: 0,
        sulfur: 0,
        iron: 0,
      },

      // --- Molecular Stock (Chemistry Yields) ---
      compounds: {
        water: 0,
        ammonia: 0,
        methane: 0,
        glucose: 0,
        glycine: 0,
        alanine: 0,
        serine: 0,
        valine: 0,
        leucine: 0,
        isoleucine: 0,
        threonine: 0,
        methionine: 0,
        lysine: 0,
        histidine: 0,
        tryptophan: 0,
        arginine: 0,
        asparagine: 0,
        'aspartic-acid': 0,
        'glutamic-acid': 0,
        glutamine: 0,
        proline: 0,
        tyrosine: 0,
        'phosphoric-acid': 0,
        'citric-acid': 0,
        urea: 0,
        pyruvate: 0,
        phospholipid: 0,
        cellulose: 0,
        nadh: 0,
        cholesterol: 0,
        heme: 0,
        cysteine: 0,
        phenylalanine: 0,
        lipid: 0,
        rna: 0,
        dna: 0,
      },

      // --- Universal Codex (Discovery Tracking) ---
      // Set of IDs of all things the player has ever seen/created.
      discoveredItems: [], 

      // --- Actions ---

      // Mark an item as discovered (Universal Codex)
      markDiscovered: (type) => set((state) => {
        if (state.discoveredItems.includes(type)) return state;
        const newDiscovered = [...state.discoveredItems, type];
        
        // Notify Progression
        setTimeout(() => useProgressionStore.getState().checkProgress(newDiscovered), 0);
        
        return { discoveredItems: newDiscovered };
      }),

      // Add a newly discovered or synthesized item
      addResource: (category, type, amount = 1) => set((state) => {
        const target = state[category];
        
        // Also track in Codex
        let newDiscovered = state.discoveredItems;
        if (!newDiscovered.includes(type)) {
            newDiscovered = [...newDiscovered, type];
            // Notify Progression
            setTimeout(() => useProgressionStore.getState().checkProgress(newDiscovered), 0);
        }

        if (!target) {
            console.warn(`Inventory category '${category}' does not exist.`);
            return { discoveredItems: newDiscovered };
        }
        
        return {
          discoveredItems: newDiscovered,
          [category]: {
            ...target,
            [type]: (target[type] || 0) + amount
          }
        };
      }),

      // Consume a resource (returns true if successful, false if insufficient)
      // NOTE: As of Jan 2026, Resources are "Infinite" once unlocked.
      // This function now only checks availability, it does NOT deplete stock.
      consumeResource: (category, type, amount = 1) => {
        const state = get();
        const currentAmount = state[category]?.[type] || 0;
        
        // Check availability (either count > 0 OR it is in discoveredItems)
        // Using count > 0 is safer to ensure it was actually produced at least once
        if (currentAmount > 0) return true;
        
        return false;
      },

      // Nuclear Transmutation (Star Forging)
      // Converts one element to another (Mass conservation handled by caller logic)
      transmute: (fromType, toType, amount) => {
        const state = get();
        if (state.elements[fromType] >= amount) {
           set(s => ({
             elements: {
               ...s.elements,
               [fromType]: s.elements[fromType] - amount,
               [toType]: (s.elements[toType] || 0) + amount
             }
           }));
           return true;
        }
        return false;
      },

      // Hard Reset (Pre-Big Bang)
      resetUniverse: () => set({
        energy: 0,
        quarks: { up: 0, down: 0, charm: 0, strange: 0, top: 0, bottom: 0 },
        elements: {
          hydrogen: 0, helium: 0, carbon: 0, nitrogen: 0, oxygen: 0,
          phosphorus: 0, sulfur: 0, iron: 0,
        },
        compounds: {
          water: 0, ammonia: 0, methane: 0, glucose: 0,
          glycine: 0, alanine: 0, serine: 0, valine: 0,
          leucine: 0, isoleucine: 0, threonine: 0, methionine: 0,
          lysine: 0, histidine: 0, tryptophan: 0,
          arginine: 0, asparagine: 0, 'aspartic-acid': 0,
          'glutamic-acid': 0, glutamine: 0, proline: 0,
          tyrosine: 0, 
          'phosphoric-acid': 0, 'citric-acid': 0, urea: 0,
          pyruvate: 0, phospholipid: 0, 
          cellulose: 0, nadh: 0, cholesterol: 0, heme: 0,
          cysteine: 0,
          phenylalanine: 0, lipid: 0, rna: 0, dna: 0,
        },
      }),

      // Reset for a new Universe
      triggerBigBang: () => set({
        energy: 1e12, // Massive start energy
        quarks: { up: 0, down: 0, charm: 0, strange: 0, top: 0, bottom: 0 },
        elements: { H: 0, He: 0, C: 0, N: 0, O: 0, P: 0, S: 0, Fe: 0 },
        compounds: { water: 0, glucose: 0, aminoAcids: 0 },
      }),
    }),
    {
      name: 'origin-lab-inventory',
    }
  )
);
