import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInventory } from '../store/inventory.js';

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
          x: 400, // Center of world
          y: 400,
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

      resetSimulation: () => set({
        agents: [],
        soup: { ...INITIAL_SOUP },
        foodItems: [],
        toxins: [],
        isRunning: false,
      }),
    }),
    {
      name: 'biology-lab-store',
    }
  )
);
