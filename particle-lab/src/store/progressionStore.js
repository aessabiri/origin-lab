import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MILESTONES = [
  {
    id: 'big_bang',
    title: 'The Big Bang',
    description: 'The beginning of everything. Infinite density, infinite heat.',
    xpReward: 100,
    requiredLevel: 0,
    category: 'Cosmic',
    completed: true, // Auto-completed start
  },
  {
    id: 'hadron_epoch',
    title: 'Hadron Epoch',
    description: 'Quarks bind together to form Protons and Neutrons.',
    xpReward: 200,
    requiredLevel: 1,
    category: 'Particle',
    requirements: { particles: ['up-quark', 'down-quark'] }
  },
  {
    id: 'nucleosynthesis',
    title: 'Nucleosynthesis',
    description: 'The first atomic nuclei form. Hydrogen and Helium emerge.',
    xpReward: 500,
    requiredLevel: 2,
    category: 'Particle',
    requirements: { particles: ['proton', 'neutron', 'electron'] }
  },
  {
    id: 'first_light',
    title: 'Recombination',
    description: 'Atoms capture electrons. The universe becomes transparent. Light travels freely.',
    xpReward: 800,
    requiredLevel: 3,
    category: 'Cosmic',
    requirements: { particles: ['hydrogen', 'helium'] }
  },
  {
    id: 'stellar_formation',
    title: 'Stellar Nurseries',
    description: 'Gravity pulls gas together to ignite the first stars.',
    xpReward: 1000,
    requiredLevel: 4,
    category: 'Cosmic',
    requirements: { particles: ['hydrogen', 'helium'] } // Massive quantities needed conceptually
  },
  {
    id: 'supernova',
    title: 'Stellar Alchemy',
    description: 'Stars die and explode, forging heavy elements like Carbon, Oxygen, and Iron.',
    xpReward: 1500,
    requiredLevel: 5,
    category: 'Cosmic',
    requirements: { particles: ['carbon', 'oxygen', 'iron'] }
  },
  {
    id: 'molecular_chemistry',
    title: 'Chemistry Begins',
    description: 'Atoms bond to form stable molecules. Water, Ammonia, Methane.',
    xpReward: 2000,
    requiredLevel: 6,
    category: 'Chemistry',
    requirements: { particles: ['water', 'ammonia', 'methane'] }
  },
  {
    id: 'organic_soup',
    title: 'Primordial Soup',
    description: 'Complex organics accumulate in warm ponds. Amino Acids and Lipids.',
    xpReward: 3000,
    requiredLevel: 7,
    category: 'Chemistry',
    requirements: { particles: ['glycine', 'fatty-acid', 'lipid'] }
  },
  {
    id: 'protocells',
    title: 'The First Container',
    description: 'Lipids form membranes, trapping chemistry inside. The first Protocells.',
    xpReward: 5000,
    requiredLevel: 8,
    category: 'Biology',
    requirements: { particles: ['membrane'] }
  },
  {
    id: 'luca',
    title: 'LUCA',
    description: 'Last Universal Common Ancestor. A fully self-replicating cell.',
    xpReward: 10000,
    requiredLevel: 9,
    category: 'Biology',
    requirements: { particles: ['dna', 'ribosome', 'atp'] }
  },
];

export const useProgressionStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      completedMilestones: ['big_bang'],
      
      // Actions
      addXp: (amount) => set(state => {
        const newXp = state.xp + amount;
        // Simple leveling curve: Level * 1000
        const levelUp = newXp >= state.level * 1000;
        return { 
            xp: newXp, 
            level: levelUp ? state.level + 1 : state.level 
        };
      }),

      completeMilestone: (id) => {
        const { completedMilestones, addXp } = get();
        if (completedMilestones.includes(id)) return;
        
        const milestone = MILESTONES.find(m => m.id === id);
        if (milestone) {
            set({ completedMilestones: [...completedMilestones, id] });
            addXp(milestone.xpReward);
        }
      },

      checkMilestones: (inventory) => {
         // This can be called periodically to auto-complete based on inventory
         // For now, manual completion or event-triggered is safer
      },
      
      getMilestones: () => MILESTONES,
    }),
    {
      name: 'progression-storage',
    }
  )
);
