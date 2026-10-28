import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInventory } from '../store/inventory.js';
import { useProgressionStore } from '../store/progressionStore.js';
import { usePlanetaryStore } from '../store/planetaryStore.js';

// Initial Resources available in the "Soup"
const INITIAL_SOUP = {
  glucose: 100,
  aminoAcids: 50,
  lipids: 20,
};

export const useBioStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      
      // The Agents (Cells)
      agents: [],
      
      // The Environment
      soup: { ...INITIAL_SOUP },
      foodItems: [],
      toxins: [],
      worldSize: { width: 800, height: 800 },
      environment: {
        temperature: 37.0, // °C
        nutrients: 80,     // %
        radiation: 0,      // %
      },

      // Bioreactor Stress Testing & Environmental Viability Certification
      stressTrial: {
        active: false,
        stage: 'idle', // 'idle' | 'thermal_shock' | 'uv_flux' | 'starvation' | 'complete'
        elapsed: 0,
        totalDuration: 30,
        initialAgents: 0,
        fitnessScore: null,
        certified: false,
        message: 'Awaiting Stress Trial initiation.',
      },
      
      // Simulation Status
      isRunning: false,
      tickRate: 100, // ms per tick
      
      // UI State
      selectedAgentId: null,
      isCellCreatorOpen: false,

      // --- Biotech / Engineering State ---
      unlockedAminoAcids: [],
      synthesizedProteins: [],
      currentCellDesign: {
        membrane: null,
        organelles: [],
        cytoplasm: 'water',
      },

      // --- Actions ---

      setAgents: (agents) => set({ agents }),
      setFoodItems: (foodItems) => set({ foodItems }),
      setToxins: (toxins) => set({ toxins }),
      setWorldSize: (width, height) => set({ worldSize: { width, height } }),
      setEnvironment: (environment) => set((state) => ({
        environment: { ...state.environment, ...environment }
      })),
      
      updateAgent: (id, updates) => set((state) => ({
        agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
      })),

      addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
      
      // Inject the User's Design into the Simulation
      injectLuca: () => set((state) => {
        const design = state.currentCellDesign;
        if (design.organelles.length === 0) return state; // Can't inject empty cell

        // Calculate stats based on organelles
        let speed = 1;
        let metabolism = 0.5;
        let sense = 100;
        
        // Simple stat derivation
        design.organelles.forEach(o => {
           if (o.type === 'mitochondrion') { metabolism += 0.5; speed += 0.5; }
           if (o.type === 'ribosome') { metabolism += 0.2; }
           if (o.type === 'membrane') { sense += 50; }
        });

        const luca = {
          id: 'LUCA',
          x: state.worldSize.width / 2, // Center of world
          y: state.worldSize.height / 2,
          vx: 0, 
          vy: 0,
          radius: 15 + (design.organelles.length * 2),
          energy: 200, // Starting energy
          color: '#ffffff', // White for the protagonist
          genome: {
            speed,
            metabolism,
            sense,
            diet: 0, // Default Herbivore for now
          },
          design: design // Store the blueprint
        };

        return {
          agents: [luca], // Clear previous and add LUCA
          isRunning: true, // Auto-start
          soup: { ...INITIAL_SOUP } // Reset soup for fair test
        };
      }),

      removeAgent: (id) => set((state) => ({ agents: state.agents.filter(a => a.id !== id) })),

      updateSoup: (updates) => set((state) => ({ soup: { ...state.soup, ...updates } })),

      setIsRunning: (isRunning) => set({ isRunning }),
      
      toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),

      setSelectedAgentId: (id) => set({ selectedAgentId: id }),
      
      setIsCellCreatorOpen: (isOpen) => set({ isCellCreatorOpen: isOpen }),

      // Biotech Actions
      unlockAminoAcid: (id) => set(state => {
         if (state.unlockedAminoAcids.includes(id)) return state;
         return { unlockedAminoAcids: [...state.unlockedAminoAcids, id] };
      }),

      addSynthesizedProtein: (protein) => set(state => ({
        synthesizedProteins: [...state.synthesizedProteins, protein]
      })),

      addOrganelleToDesign: (organelle) => set(state => {
        if (state.currentCellDesign.organelles.length >= 6) return state;
        return {
          currentCellDesign: {
            ...state.currentCellDesign,
            organelles: [...state.currentCellDesign.organelles, { ...organelle, id: Date.now() + Math.random() }]
          }
        };
      }),

      removeOrganelleFromDesign: (id) => set(state => ({
        currentCellDesign: {
          ...state.currentCellDesign,
          organelles: state.currentCellDesign.organelles.filter(o => o.id !== id)
        }
      })),

      addProteinToDesign: (protein) => set(state => {
        if (state.currentCellDesign.organelles.length >= 6) return state;
        return {
          currentCellDesign: {
            ...state.currentCellDesign,
            organelles: [...state.currentCellDesign.organelles, { ...protein, isProtein: true, id: Date.now() + Math.random() }]
          }
        };
      }),

      updateCellDesign: (update) => set(state => ({
        currentCellDesign: { ...state.currentCellDesign, ...update }
      })),

      // Import from Particle Lab Inventory (Bridge)
      // This will be called when the user "drops" items from the sidebar into the dish
      importResource: (type, amount) => {
        // 1. Determine Category
        let category = 'compounds';
        if (type === 'arsenic' || type === 'hydrogen' || type === 'carbon') { // Basic check
           category = 'elements';
        }

        // 2. Consume from Global Inventory
        const success = useInventory.getState().consumeResource(category, type, amount);
        if (!success) {
           console.warn(`Transfer failed: Insufficient ${type} in Global Inventory.`);
           return;
        }

        set((state) => {
          if (type === 'arsenic') {
             const newToxins = Array.from({ length: amount }).map((_, i) => ({
               id: `toxin-${Date.now()}-${i}`,
               x: 400 + (Math.random() - 0.5) * 400, // Random within dish
               y: 400 + (Math.random() - 0.5) * 400,
               radius: 40, // Toxic Zone
             }));
             return { toxins: [...state.toxins, ...newToxins] };
          }

          // Mapping Particle Types to Bio Resources
          const resourceMap = {
            'glucose': 'glucose',
            'amino_acid': 'aminoAcids', // Generic for now
            'lipid': 'lipids',
          };
          
          const resourceKey = resourceMap[type];
          if (resourceKey) {
            return {
              soup: {
                ...state.soup,
                [resourceKey]: state.soup[resourceKey] + amount
              }
            };
          }
          return state;
        });
      },

      // Stress Trial & Bioreactor Certification Actions
      startStressTrial: () => set(state => {
        const agentCount = state.agents.length;
        if (agentCount === 0) {
          return {
            stressTrial: {
              ...state.stressTrial,
              message: 'No protocells detected. Inject LUCA or build a cell design first!'
            }
          };
        }

        return {
          isRunning: true,
          stressTrial: {
            active: true,
            stage: 'thermal_shock',
            elapsed: 0,
            totalDuration: 30,
            initialAgents: agentCount,
            fitnessScore: null,
            certified: false,
            message: 'STAGE 1/3: THERMAL SHOCK APPLIED (88.0°C)'
          },
          environment: {
            temperature: 88.0,
            nutrients: 60,
            radiation: 15
          }
        };
      }),

      updateStressTrial: (deltaSec) => set(state => {
        if (!state.stressTrial.active) return state;

        const newElapsed = state.stressTrial.elapsed + deltaSec;
        const total = state.stressTrial.totalDuration;
        const livingAgents = state.agents.filter(a => a.energy > 0).length;

        // Stage 1 (0s - 10s): Thermal Shock (88°C)
        // Stage 2 (10s - 20s): UV Radiation Flux (85% Radiation)
        // Stage 3 (20s - 30s): Nutrient Starvation (5% Nutrients)
        if (newElapsed < 10) {
          return {
            stressTrial: {
              ...state.stressTrial,
              elapsed: newElapsed,
              stage: 'thermal_shock',
              message: `STAGE 1/3: THERMAL SHOCK (88°C) • ${(10 - newElapsed).toFixed(0)}s remaining`
            }
          };
        } else if (newElapsed < 20) {
          return {
            stressTrial: {
              ...state.stressTrial,
              elapsed: newElapsed,
              stage: 'uv_flux',
              message: `STAGE 2/3: UV RADIATION FLUX (85%) • ${(20 - newElapsed).toFixed(0)}s remaining`
            },
            environment: {
              temperature: 45.0,
              nutrients: 40,
              radiation: 85
            }
          };
        } else if (newElapsed < total) {
          return {
            stressTrial: {
              ...state.stressTrial,
              elapsed: newElapsed,
              stage: 'starvation',
              message: `STAGE 3/3: NUTRIENT STARVATION (5%) • ${(total - newElapsed).toFixed(0)}s remaining`
            },
            environment: {
              temperature: 37.0,
              nutrients: 5,
              radiation: 10
            }
          };
        }

        // Trial Finished! Calculate Fitness Score
        const initial = Math.max(1, state.stressTrial.initialAgents);
        const survivalRatio = Math.min(1, livingAgents / initial);
        const baseScore = Math.round(survivalRatio * 60);
        const longevityBonus = livingAgents > 0 ? 30 : 5;
        const finalScore = Math.min(100, baseScore + longevityBonus);
        const isCertified = finalScore >= 60 && livingAgents > 0;

        if (isCertified) {
          try {
            useProgressionStore.getState().completeQuest('bio_luca');
            useInventory.getState().markDiscovered('CERTIFIED_LUCA');
          } catch (e) {}
        }

        return {
          environment: {
            temperature: 37.0,
            nutrients: 80,
            radiation: 0
          },
          stressTrial: {
            active: false,
            stage: 'complete',
            elapsed: total,
            totalDuration: total,
            initialAgents: initial,
            fitnessScore: finalScore,
            certified: isCertified,
            message: isCertified
              ? `🏆 TRIAL PASSED! Fitness Score: ${finalScore}/100. Strain certified for Earth seeding!`
              : `❌ TRIAL FAILED. Fitness Score: ${finalScore}/100. Cells failed environmental tolerance.`
          }
        };
      }),

      cancelStressTrial: () => set(state => ({
        stressTrial: {
          active: false,
          stage: 'idle',
          elapsed: 0,
          totalDuration: 30,
          initialAgents: 0,
          fitnessScore: null,
          certified: false,
          message: 'Stress trial aborted.'
        },
        environment: {
          temperature: 37.0,
          nutrients: 80,
          radiation: 0
        }
      })),

      seedCertifiedOrganismToEarth: () => {
        const state = get();
        const livingAgent = state.agents.find(a => a.energy > 0) || state.agents[0];
        const design = state.currentCellDesign;
        const fitness = state.stressTrial.fitnessScore || 85;

        // Determine traits
        const hasPhototroph = Boolean(livingAgent?.genome?.diet === 2 || design?.organelles?.some(o => o.type === 'chloroplast' || o.type === 'phototroph'));
        const hasChemotroph = !hasPhototroph;

        const organismToSeed = {
          name: livingAgent?.id === 'LUCA' ? 'LUCA Primordialis' : `Protocell Strain ${fitness}`,
          traits: {
            phototroph: hasPhototroph,
            chemotroph: hasChemotroph,
            fitness: fitness,
            membrane: design?.membrane || 'Phospholipid Bilayer'
          },
          genome: livingAgent?.genome || { speed: 1, metabolism: 0.5, sense: 100, diet: hasPhototroph ? 2 : 0 }
        };

        // Seed planetary ocean
        usePlanetaryStore.getState().seedPlanet(organismToSeed);
        try {
          useProgressionStore.getState().completeQuest('bio_luca');
          useProgressionStore.getState().checkProgress(['CERTIFIED_LUCA', 'LUCA_SURVIVAL', 'EARTH_SEEDED']);
        } catch (e) {}

        set(s => ({
          stressTrial: {
            ...s.stressTrial,
            message: '🌍 Protocell successfully deposited into Earth Archean Ocean!'
          }
        }));
      },

      resetSimulation: () => set({
        agents: [],
        soup: { ...INITIAL_SOUP },
        foodItems: [],
        toxins: [],
        isRunning: false,
        stressTrial: {
          active: false,
          stage: 'idle',
          elapsed: 0,
          totalDuration: 30,
          initialAgents: 0,
          fitnessScore: null,
          certified: false,
          message: 'Awaiting Stress Trial initiation.',
        }
      }),
    }),
    {
      name: 'biology-lab-store',
    }
  )
);
