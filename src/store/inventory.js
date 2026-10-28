import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProgressionStore } from './progressionStore.js';

// The Universal Ledger
// Tracks the total mass/count of every substance in the simulation.

export const useInventory = create(
  persist(
    (set, get) => ({
      // --- Primordial Matter ---
      energy: 0, // Raw energy from Big Bang
      quarks: { 
        up: 0, down: 0, charm: 0, strange: 0, top: 0, bottom: 0,
        muon: 0, 'higgs-boson': 0, positron: 0, tau: 0,
        'anti-proton': 0, 'anti-neutron': 0
      },
      
      // --- Elemental Stock (The Periodic Table) ---
      // Keys match PARTICLE_TYPES values (e.g., 'hydrogen', 'carbon')
      elements: {
        hydrogen: 0,
        helium: 0,
        lithium: 0,
        beryllium: 0,
        boron: 0,
        carbon: 0,
        nitrogen: 0,
        oxygen: 0,
        fluorine: 0,
        neon: 0,
        sodium: 0,
        magnesium: 0,
        aluminium: 0,
        silicon: 0,
        phosphorus: 0,
        sulfur: 0,
        chlorine: 0,
        argon: 0,
        potassium: 0,
        calcium: 0,
        scandium: 0,
        titanium: 0,
        vanadium: 0,
        chromium: 0,
        manganese: 0,
        iron: 0,
        cobalt: 0,
        nickel: 0,
        copper: 0,
        zinc: 0,
        gallium: 0,
        germanium: 0,
        arsenic: 0,
        selenium: 0,
        bromine: 0,
        krypton: 0,
        rubidium: 0,
        strontium: 0,
        yttrium: 0,
        zirconium: 0,
        niobium: 0,
        molybdenum: 0,
        technetium: 0,
        ruthenium: 0,
        rhodium: 0,
        palladium: 0,
        silver: 0,
        cadmium: 0,
        indium: 0,
        tin: 0,
        antimony: 0,
        tellurium: 0,
        iodine: 0,
        xenon: 0,
        caesium: 0,
        barium: 0,
        lanthanum: 0,
        neodymium: 0,
        tungsten: 0,
        osmium: 0,
        platinum: 0,
        gold: 0,
        mercury: 0,
        lead: 0,
        bismuth: 0,
        polonium: 0,
        radon: 0,
        francium: 0,
        radium: 0,
        actinium: 0,
        thorium: 0,
        protactinium: 0,
        uranium: 0,
        'uranium-235': 0,
        'uranium-238': 0,
        plutonium: 0,
        americium: 0,
        oganesson: 0,
        'helium-3': 0,
        'carbon-14': 0,
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

      // Execute an Atomic Transaction (All-or-nothing consumption and production)
      executeTransaction: (inputs, outputs) => {
        const state = get();
        const nextState = { ...state };
        
        // 1. Verify all inputs are available
        for (const input of inputs) {
          const { category, type, amount = 1 } = input;
          const current = state[category]?.[type] || 0;
          if (current < amount) return false; // Insufficient resources
        }

        // 2. Consume inputs
        for (const input of inputs) {
          const { category, type, amount = 1 } = input;
          nextState[category] = {
            ...nextState[category],
            [type]: nextState[category][type] - amount
          };
        }

        // 3. Produce outputs
        let newDiscovered = [...state.discoveredItems];
        for (const output of outputs) {
          const { category, type, amount = 1 } = output;
          
          if (!newDiscovered.includes(type)) {
            newDiscovered.push(type);
          }

          const targetCategory = nextState[category] || {};
          nextState[category] = {
            ...targetCategory,
            [type]: (targetCategory[type] || 0) + amount
          };
        }

        set({ ...nextState, discoveredItems: newDiscovered });
        
        // Notify Progression if new things discovered
        if (newDiscovered.length > state.discoveredItems.length) {
            useProgressionStore.getState().checkProgress(newDiscovered);
        }

        return true;
      },

      // Mark an item as discovered (Universal Codex)
      markDiscovered: (type) => set((state) => {
        if (state.discoveredItems.includes(type)) return state;
        const newDiscovered = [...state.discoveredItems, type];
        
        // Notify Progression
        useProgressionStore.getState().checkProgress(newDiscovered);
        
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
            useProgressionStore.getState().checkProgress(newDiscovered);
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
        discoveredItems: [], // CRITICAL: Clear discovery history
        quarks: { 
          up: 0, down: 0, charm: 0, strange: 0, top: 0, bottom: 0,
          muon: 0, 'higgs-boson': 0, positron: 0, tau: 0,
          'anti-proton': 0, 'anti-neutron': 0
        },
        elements: {
          hydrogen: 0, helium: 0, carbon: 0, nitrogen: 0, oxygen: 0,
          phosphorus: 0, sulfur: 0, iron: 0,
          'helium-3': 0, 'carbon-14': 0, 'uranium-235': 0, 'uranium-238': 0,
          silver: 0, gold: 0, lead: 0,
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
        energy: 1e12, 
        discoveredItems: [],
        quarks: { up: 0, down: 0, charm: 0, strange: 0, top: 0, bottom: 0 },
        elements: { hydrogen: 0, helium: 0, carbon: 0, nitrogen: 0, oxygen: 0, phosphorus: 0, sulfur: 0, iron: 0 },
        compounds: { water: 0, glucose: 0 },
      }),
    }),
    {
      name: 'origin-lab-inventory',
    }
  )
);
