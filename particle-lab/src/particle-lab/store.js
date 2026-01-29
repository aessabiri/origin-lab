import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useParticleStore = create(
  persist(
    (set, get) => ({
      // --- Simulation State ---
      particles: [],
      bonds: [],
      secondaryParticles: [],
      
      // --- Discovery/Progression (Local Scope) ---
      // Discovery is now tracked via useInventory (Universal Ledger).
      
      // --- Goals/Tutorials ---
      currentGoalIndex: 0,
      goalPath: 'medium',
      
      // --- UI State ---
      uiScale: 1,
      isPeriodicTablePinned: false,
      isPeriodicTableVisible: false,
      isPaletteVisible: true,
      isHintVisible: false,
      isActionMenuVisible: false,
      isSettingsVisible: false,
      isResetConfirmVisible: false,
      isExchangeHubVisible: false, // New: For the Export/Import Hub
      infoPanelType: null,
      message: '',
      isSandboxMode: false,
      
      // --- Actions ---
      setParticles: (particles) => set({ particles }),
      setBonds: (bonds) => set({ bonds }),
      setSecondaryParticles: (secondaryParticles) => set({ secondaryParticles }),
      
      setCurrentGoalIndex: (index) => set({ currentGoalIndex: index }),
      setGoalPath: (path) => set({ goalPath: path }),
      
      setUiScale: (scale) => set({ uiScale: scale }),
      setIsPeriodicTablePinned: (pinned) => set({ isPeriodicTablePinned: pinned }),
      setIsPeriodicTableVisible: (visible) => set({ isPeriodicTableVisible: visible }),
      setIsPaletteVisible: (visible) => set({ isPaletteVisible: visible }),
      setIsHintVisible: (visible) => set({ isHintVisible: visible }),
      setIsActionMenuVisible: (visible) => set({ isActionMenuVisible: visible }),
      setIsSettingsVisible: (visible) => set({ isSettingsVisible: visible }),
      setIsResetConfirmVisible: (visible) => set({ isResetConfirmVisible: visible }),
      setIsExchangeHubVisible: (visible) => set({ isExchangeHubVisible: visible }),
      setInfoPanelType: (type) => set({ infoPanelType: type }),
      setIsSandboxMode: (mode) => set({ isSandboxMode: mode }),

      showMessage: (message) => {
        set({ message });
        setTimeout(() => set({ message: '' }), 3000);
      },

      // exclusive UI opener (closes others)
      openExclusive: (setterKey, stateKey) => {
        const isOpen = get()[stateKey];
        set({
          isHintVisible: false,
          isActionMenuVisible: false,
          isSettingsVisible: false,
          isExchangeHubVisible: false,
          // If periodic table is pinned, leave it. Otherwise close it.
          isPeriodicTableVisible: get().isPeriodicTablePinned ? get().isPeriodicTableVisible : false,
        });
        set({ [setterKey]: !isOpen });
      },

      // --- Complex Actions ---
      handleReset: () => set({ isResetConfirmVisible: true }),
      
      executeReset: () => {
        set({
          particles: [],
          bonds: [],
          secondaryParticles: [],
          currentGoalIndex: 0,
          isResetConfirmVisible: false,
        });
        get().showMessage('Lab has been reset!');
      },
      
      handleSetGoalPath: (path) => {
        set({
          goalPath: path,
          currentGoalIndex: 0,
          isSandboxMode: false,
        });
        get().showMessage(`Goal path set to ${path}. Progress reset.`);
      },

      handleToggleSandbox: () => {
        const newMode = !get().isSandboxMode;
        set({ isSandboxMode: newMode });
        get().showMessage(`Sandbox mode ${newMode ? 'activated' : 'deactivated'}.`);
      },

      handleEmptyCanvas: () => {
        if (get().particles.length === 0) return;
        set({ particles: [], bonds: [] });
        get().showMessage('Canvas cleared.');
      },
    }),
    {
      name: 'particle-lab-storage',
      partialize: (state) => ({
        particles: state.particles,
        bonds: state.bonds,
        secondaryParticles: state.secondaryParticles,
        currentGoalIndex: state.currentGoalIndex,
        goalPath: state.goalPath,
        uiScale: state.uiScale,
        isPeriodicTablePinned: state.isPeriodicTablePinned,
        isSandboxMode: state.isSandboxMode,
      }),
    }
  )
);
