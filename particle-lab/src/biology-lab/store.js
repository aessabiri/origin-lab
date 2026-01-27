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
