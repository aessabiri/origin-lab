import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // --- Global Progression (Achievements/Codex) ---
      // Discovery is now tracked via useInventory (Universal Ledger)
      discoveredOrganelles: [],
      universeMilestones: {
        galaxyFormed: false,
        starsIgnited: false,
        solarSystemFormed: false,
        earthEntered: false,
        lifePlanted: false,
      },
      introComplete: false,
      
      // --- Global Settings ---
      globalSettings: {
        masterVolume: 0.5,
        musicVolume: 0.3,
        sfxVolume: 0.8,
        graphicsQuality: 'high',
        showTooltips: true,
        reducedMotion: false,
      },
      
      // --- Global UI State ---
      currentView: 'universe', // 'menu', 'hub', 'particle', 'chemistry', 'biology', 'universe'
      isCodexVisible: false,
      isSandboxMode: false,
      message: '',

      // --- Actions ---
      setIsSandboxMode: (isSandboxMode) => set({ isSandboxMode }),
      setDiscoveredOrganelles: (discoveredOrganelles) => set({ discoveredOrganelles }),
      
      setIntroComplete: (introComplete) => set({ introComplete }),
      setGlobalSettings: (settings) => set((state) => ({ 
        globalSettings: { ...state.globalSettings, ...settings } 
      })),
      setUniverseMilestone: (milestone, value = true) => set((state) => ({
        universeMilestones: { ...state.universeMilestones, [milestone]: value }
      })),
      
      setIsCodexVisible: (isCodexVisible) => set({ isCodexVisible }),
      setCurrentView: (currentView) => set({ currentView }),

      openExclusive: (setter, state) => {
        const isOpen = get()[state];
        set({ isCodexVisible: false });
        set({ [setter]: !isOpen });
      },
      
      showMessage: (message) => {
        set({ message });
        setTimeout(() => set({ message: '' }), 3000);
      },
      
      // Legacy Reset (Global)
      executeReset: () => {
        set({
          discoveredOrganelles: [],
          introComplete: false,
          universeMilestones: {
            galaxyFormed: false,
            starsIgnited: false,
            solarSystemFormed: false,
            earthEntered: false,
            lifePlanted: false,
          },
        });
        get().showMessage('Universe reset!');
      },
    }),
    {
      name: 'particle-lab-global-store',
      partialize: (state) => ({
        discoveredOrganelles: state.discoveredOrganelles,
        introComplete: state.introComplete,
        globalSettings: state.globalSettings,
        universeMilestones: state.universeMilestones,
      }),
    }
  )
);
