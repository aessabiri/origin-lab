import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChemistryStore = create(
  persist(
    (set, get) => ({
      inventory: [
        'H2O', 'NaCl', 'VINEGAR', 'BAKING_SODA', 
        'CARBON', 'SULFUR', 'IRON', 'ETHANOL', 
        'OXYGEN', 'HYDROGEN'
      ],
      vessels: {
        beaker: { id: 'beaker', name: 'Open Beaker', contents: {}, temp: 20, pressure: 1, maxVol: 500 },
        flask: { id: 'flask', name: 'Reaction Flask', contents: {}, temp: 20, pressure: 1, maxVol: 500 },
        chamber: { id: 'chamber', name: 'Pressure Chamber', contents: {}, temp: 20, pressure: 1, maxVol: 1000 },
      },
      message: '',

      setMessage: (msg) => set({ message: msg }),

      addToVessel: (vesselId, chemicalId, amount) => {
        set((state) => {
          const vessel = state.vessels[vesselId];
          const currentAmount = vessel.contents[chemicalId] || 0;
          return {
            vessels: {
              ...state.vessels,
              [vesselId]: {
                ...vessel,
                contents: { ...vessel.contents, [chemicalId]: currentAmount + amount },
              },
            },
          };
        });
      },

      setVesselControl: (vesselId, property, value) => {
        set((state) => ({
          vessels: {
            ...state.vessels,
            [vesselId]: { ...state.vessels[vesselId], [property]: value },
          },
        }));
      },
      
      clearVessel: (vesselId) => {
           set((state) => ({
          vessels: {
            ...state.vessels,
            [vesselId]: { ...state.vessels[vesselId], contents: {} },
          },
        }));
      },

      transmuteContents: (vesselId, inputCounts, outputCounts) => {
        set((state) => {
          const vessel = state.vessels[vesselId];
          const newContents = { ...vessel.contents };

          // Remove inputs
          for (const [chemId, amount] of Object.entries(inputCounts)) {
            if (newContents[chemId]) {
              newContents[chemId] = Math.max(0, newContents[chemId] - amount);
              if (newContents[chemId] <= 0.1) delete newContents[chemId]; // Float precision buffer
            }
          }

          // Add outputs
          for (const [chemId, amount] of Object.entries(outputCounts)) {
            newContents[chemId] = (newContents[chemId] || 0) + amount;
          }

          return {
             vessels: {
               ...state.vessels,
               [vesselId]: { ...vessel, contents: newContents }
             }
          };
        });
      },

      bottleVessel: (vesselId) => {
        set((state) => {
          const vessel = state.vessels[vesselId];
          const newInventory = [...state.inventory];
          const discovered = [];

          // Discover chemicals not yet in inventory
          Object.keys(vessel.contents).forEach(chemId => {
             if (!newInventory.includes(chemId)) {
               newInventory.push(chemId);
               discovered.push(chemId);
             }
          });
          
          let msg = '';
          if (discovered.length > 0) {
            msg = `Discovered: ${discovered.join(', ')}! Added to pantry.`;
          } else {
            msg = 'Sample collected (already known).';
          }

          return { inventory: newInventory, message: msg };
        });
      },
    }),
    {
      name: 'chemistry-lab-store',
    }
  )
);
