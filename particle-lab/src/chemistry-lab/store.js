import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChemistryStore = create(
  persist(
    (set, get) => ({
      inventory: [
        'H2O', 'NaCl', 'VINEGAR', 'BAKING_SODA', 
        'CARBON', 'SULFUR', 'IRON', 'ETHANOL', 
        'OXYGEN', 'HYDROGEN', 'NITROGEN',
        'MAGNESIUM', 'POTASSIUM_PERMANGANATE'
      ],
      vessels: {
        beaker: { id: 'beaker', name: 'Open Beaker', contents: {}, temp: 20, targetTemp: 20, pressure: 1, maxVol: 500, status: 'ok', type: 'glass', activeVisual: null, isOpen: true },
        flask: { id: 'flask', name: 'Reaction Flask', contents: {}, temp: 20, targetTemp: 20, pressure: 1, maxVol: 500, status: 'ok', type: 'glass', activeVisual: null, isOpen: false },
        chamber: { id: 'chamber', name: 'Pressure Chamber', contents: {}, temp: 20, targetTemp: 20, pressure: 1, maxVol: 1000, status: 'ok', type: 'reinforced', activeVisual: null, isOpen: false },
      },
      condenser: {
        id: 'condenser',
        name: 'Distillation Column',
        connectedTo: 'flask', // Default connected to Flask
        contents: {},
        maxVol: 300,
        status: 'ok',
        isActive: true // New: User can toggle if it captures or not
      },
      message: '',
      timeSpeed: 1,
      isFumeHoodOn: false,
      inspectedChemical: null,

      setTimeSpeed: (speed) => set({ timeSpeed: speed }),
      setMessage: (msg) => set({ message: msg }),
      setInspectedChemical: (chemicalId) => set({ inspectedChemical: chemicalId }),
      toggleFumeHood: () => set((state) => ({ isFumeHoodOn: !state.isFumeHoodOn })),
      
      addVessel: (typeId) => {
          set((state) => {
              // Import EQUIPMENT lazily or assume it is passed, but for clean store we can just take the template.
              // To avoid circular deps, let's pass the full vessel config object from the UI.
              // NO, standard practice is to look it up. But the store doesn't import data usually.
              // Let's modify the action signature to accept the `vesselConfig`.
              return state;
          });
      },
      // Re-implementing with proper logic below
      createVessel: (vesselConfig) => {
          set((state) => {
              const newId = `vessel_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              
              // If this vessel has a condenser, auto-connect the lab's main condenser to it.
              // (Limitation: Only one active condenser setup at a time in this version)
              let condenserUpdate = {};
              if (vesselConfig.features?.hasCondenser) {
                  condenserUpdate = { 
                      condenser: { ...state.condenser, connectedTo: newId } 
                  };
              }

              return {
                  ...condenserUpdate,
                  vessels: {
                      ...state.vessels,
                      [newId]: {
                          id: newId,
                          name: vesselConfig.name,
                          contents: {},
                          temp: 20,
                          targetTemp: 20,
                          pressure: 1,
                          maxVol: vesselConfig.stats.maxVol,
                          status: 'ok',
                          type: vesselConfig.type,
                          isOpen: vesselConfig.stats.isOpen,
                          activeVisual: null,
                          // Persist feature flags
                          features: vesselConfig.features 
                      }
                  }
              };
          });
      },

      removeVessel: (vesselId) => {
          set((state) => {
              const newVessels = { ...state.vessels };
              delete newVessels[vesselId];
              return { vessels: newVessels };
          });
      },

      toggleVesselLid: (vesselId) => {
        set((state) => ({
          vessels: {
            ...state.vessels,
            [vesselId]: { ...state.vessels[vesselId], isOpen: !state.vessels[vesselId].isOpen }
          }
        }));
      },

      toggleCondenserValve: () => {
        set((state) => ({
            condenser: { ...state.condenser, isActive: !state.condenser.isActive }
        }));
      },

      collectInCondenser: (chemicalId, amount) => {
        set((state) => {
            const current = state.condenser.contents[chemicalId] || 0;
            return {
                condenser: {
                    ...state.condenser,
                    contents: { ...state.condenser.contents, [chemicalId]: current + amount }
                }
            };
        });
      },
      
      emptyCondenser: () => {
         set((state) => ({
             condenser: { ...state.condenser, contents: {} }
         }));
      },

      setVesselVisual: (vesselId, visual) => {
        set((state) => ({
          vessels: {
            ...state.vessels,
            [vesselId]: { ...state.vessels[vesselId], activeVisual: visual }
          }
        }));
      },

      breakVessel: (vesselId) => {
        set((state) => ({
          vessels: {
            ...state.vessels,
            [vesselId]: { ...state.vessels[vesselId], status: 'broken', contents: {}, pressure: 1 }
          },
          message: `DANGER: ${state.vessels[vesselId].name} failed!`
        }));
      },

      repairVessel: (vesselId) => {
        set((state) => ({
          vessels: {
            ...state.vessels,
            [vesselId]: { ...state.vessels[vesselId], status: 'ok', temp: 20, targetTemp: 20, pressure: 1 }
          }
        }));
      },
      
      upgradeVessel: (vesselId, newType) => {
        set((state) => ({
          vessels: {
            ...state.vessels,
            [vesselId]: { ...state.vessels[vesselId], type: newType, status: 'ok' }
          }
        }));
      },
      
      updateVesselTemperature: (vesselId, newTemp) => {
         set((state) => ({
          vessels: {
            ...state.vessels,
            [vesselId]: { ...state.vessels[vesselId], temp: newTemp }
          }
        }));
      },

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

          return { 
            inventory: newInventory, 
            message: msg,
            vessels: {
              ...state.vessels,
              [vesselId]: { ...vessel, contents: {} }
            }
          };
        });
      },
    }),
    {
      name: 'chemistry-lab-store',
    }
  )
);
