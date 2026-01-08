import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MISSIONS, STARTING_CHEMICALS, STARTING_EQUIPMENT } from './data/missions';
import { CHEMICALS } from './data/chemicals';
import { EQUIPMENT } from './data/equipment';
import { audioSystem, SFX } from './logic/audio';

export const useChemistryStore = create(
  persist(
    (set, get) => ({
      // --- Game State ---
      gameMode: 'career', // 'sandbox' or 'career'
      missionIndex: 0,
      unlockedEquipment: [...STARTING_EQUIPMENT],
      
      // --- Physical State ---
      inventory: [...STARTING_CHEMICALS], // Chemicals available in Pantry
      vessels: {
        beaker: { id: 'beaker', name: 'Open Beaker', contents: {}, temp: 20, targetTemp: 20, pressure: 1, maxVol: 500, status: 'ok', type: 'glass', variant: 'beaker', activeVisual: null, isOpen: true },
      },
      condenser: {
        id: 'condenser',
        name: 'Distillation Column',
        connectedTo: null,
        contents: {},
        maxVol: 300,
        status: 'ok',
        isActive: true
      },
      message: 'Welcome to the Lab! Check your current objective.',
      timeSpeed: 1,
      isFumeHoodOn: false,
      inspectedChemical: null,
      isHintVisible: false,

      // --- Actions ---
      setTimeSpeed: (speed) => set({ timeSpeed: speed }),
      setMessage: (msg) => set({ message: msg }),
      setInspectedChemical: (chemicalId) => set({ inspectedChemical: chemicalId }),
      toggleFumeHood: () => set((state) => ({ isFumeHoodOn: !state.isFumeHoodOn })),
      toggleHint: () => set((state) => ({ isHintVisible: !state.isHintVisible })),
      
      setGameMode: (mode) => {
          if (mode === 'sandbox') {
              set({ 
                  gameMode: 'sandbox',
                  inventory: Object.keys(CHEMICALS),
                  unlockedEquipment: EQUIPMENT.map(e => e.id),
                  message: 'SANDBOX MODE: Everything unlocked. Have fun!'
              });
          } else {
              // Reset to career state (or load if we tracked progress properly, but for now reset)
              set({ 
                  gameMode: 'career',
                  inventory: [...STARTING_CHEMICALS],
                  unlockedEquipment: [...STARTING_EQUIPMENT],
                  missionIndex: 0,
                  message: 'CAREER MODE: Progress reset. Good luck!'
              });
          }
      },

      checkMissionCompletion: (newChemicals) => {
          const state = get();
          if (state.gameMode !== 'career') return;

          const currentMission = MISSIONS[state.missionIndex];
          if (!currentMission) return;

          // Check if any of the newly acquired chemicals match the requirement
          const reqs = currentMission.requirements;
          const met = Object.keys(reqs).some(reqChem => newChemicals.includes(reqChem));

          if (met) {
              const nextIndex = state.missionIndex + 1;
              const rewards = currentMission.rewards;
              
              // Apply Rewards
              const newInventory = [...state.inventory];
              if (rewards.unlockChemicals) {
                  rewards.unlockChemicals.forEach(c => {
                      if (!newInventory.includes(c)) newInventory.push(c);
                  });
              }
              
              const newEquipment = [...state.unlockedEquipment];
              if (rewards.unlockEquipment) {
                  rewards.unlockEquipment.forEach(e => {
                      if (!newEquipment.includes(e)) newEquipment.push(e);
                  });
              }

              set({
                  missionIndex: nextIndex,
                  inventory: newInventory,
                  unlockedEquipment: newEquipment,
                  message: `🎉 MISSION COMPLETE! ${rewards.message}`
              });
          }
      },

      addVessel: (typeId) => {}, // Legacy placeholder, remove if safe
      
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
                          variant: vesselConfig.icon, // Store the shape/icon type
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
         set((state) => {
             const contents = state.condenser.contents;
             const newInventory = [...state.inventory];
             const discovered = [];

             Object.keys(contents).forEach(chemId => {
                 if (!newInventory.includes(chemId)) {
                     newInventory.push(chemId);
                     discovered.push(chemId);
                 }
             });

             if (discovered.length > 0) {
                 audioSystem.playOneShot(SFX.SUCCESS);
                 get().setMessage(`Distillate Captured: ${discovered.join(', ')}`);
                 setTimeout(() => get().checkMissionCompletion(discovered), 0);
             } else {
                 get().setMessage('Distillate collected.');
             }

             return {
                 inventory: newInventory,
                 condenser: { ...state.condenser, contents: {} }
             };
         });
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
        audioSystem.playOneShot(SFX.POUR);
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
            audioSystem.playOneShot(SFX.SUCCESS);
            msg = `Discovered: ${discovered.join(', ')}! Added to pantry.`;
            // Trigger Mission Check
            setTimeout(() => get().checkMissionCompletion(discovered), 0);
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