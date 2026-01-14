import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const LOCAL_STORAGE_KEYS = {
  PARTICLES: 'particle-lab-particles',
  SECONDARY: 'particle-lab-secondary',
  ATOMS: 'particle-lab-atoms',
  MOLECULES: 'particle-lab-molecules',
  BONDS: 'particle-lab-bonds',
  GOAL_INDEX: 'particle-lab-goal-index',
  UI_SCALE: 'particle-lab-ui-scale',
  TABLE_PINNED: 'particle-lab-table-pinned',
  GOAL_PATH: 'particle-lab-goal-path',
  SANDBOX_MODE: 'particle-lab-sandbox-mode',
};

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      particles: [],
      bonds: [],
      secondaryParticles: [],
      discoveredAtoms: [],
      discoveredMolecules: [],
      discoveredOrganelles: [],
      currentGoalIndex: 0,
      uiScale: 1,
      isPeriodicTablePinned: false,
      goalPath: 'medium',
      isSandboxMode: false,
      introComplete: false,
      
      // Global Project Settings
      globalSettings: {
        masterVolume: 0.5,
        musicVolume: 0.3,
        sfxVolume: 0.8,
        graphicsQuality: 'high', // 'low', 'medium', 'high'
        showTooltips: true,
        reducedMotion: false,
      },
      
      // Universe Progression
      universeMilestones: {
        galaxyFormed: false,
        starsIgnited: false,
        solarSystemFormed: false,
        earthEntered: false,
        lifePlanted: false,
      },

      // UI State
      isPaletteVisible: true,
      isCodexVisible: false,
      isHintVisible: false,
      infoPanelType: null,
      isActionMenuVisible: false,
      isSettingsVisible: false,
      isResetConfirmVisible: false,
      isPeriodicTableVisible: false,
      message: '',
      currentView: 'menu', // 'menu', 'hub', 'particle', 'chemistry', 'biology', 'universe'

      // Actions
      setParticles: (particles) => set({ particles }),
      setBonds: (bonds) => set({ bonds }),
      setSecondaryParticles: (secondaryParticles) => set({ secondaryParticles }),
      setDiscoveredAtoms: (discoveredAtoms) => set({ discoveredAtoms }),
      setDiscoveredMolecules: (discoveredMolecules) => set({ discoveredMolecules }),
      setDiscoveredOrganelles: (discoveredOrganelles) => set({ discoveredOrganelles }),
      setCurrentGoalIndex: (currentGoalIndex) => set({ currentGoalIndex }),
      setUiScale: (uiScale) => set({ uiScale }),
      setIsPeriodicTablePinned: (isPeriodicTablePinned) => set({ isPeriodicTablePinned }),
      setGoalPath: (goalPath) => set({ goalPath }),
      setIsSandboxMode: (isSandboxMode) => set({ isSandboxMode }),
      setIntroComplete: (introComplete) => set({ introComplete }),
      setGlobalSettings: (settings) => set((state) => ({ 
        globalSettings: { ...state.globalSettings, ...settings } 
      })),
      setUniverseMilestone: (milestone, value = true) => set((state) => ({
        universeMilestones: { ...state.universeMilestones, [milestone]: value }
      })),

      // UI Actions
      setIsPaletteVisible: (isPaletteVisible) => set({ isPaletteVisible }),
      setIsCodexVisible: (isCodexVisible) => set({ isCodexVisible }),
      setIsHintVisible: (isHintVisible) => set({ isHintVisible }),
      setInfoPanelType: (infoPanelType) => set({ infoPanelType }),
      setIsActionMenuVisible: (isActionMenuVisible) => set({ isActionMenuVisible }),
      setIsSettingsVisible: (isSettingsVisible) => set({ isSettingsVisible }),
      setIsResetConfirmVisible: (isResetConfirmVisible) => set({ isResetConfirmVisible }),
      setIsPeriodicTableVisible: (isPeriodicTableVisible) => set({ isPeriodicTableVisible }),
      setCurrentView: (currentView) => set({ currentView }),
      
      showMessage: (message) => {
        set({ message });
        setTimeout(() => set({ message: '' }), 3000);
      },

      openExclusive: (setter, state) => {
        const isOpen = get()[state];
        set({
          isHintVisible: false,
          isActionMenuVisible: false,
          isSettingsVisible: false,
          isCodexVisible: false,
          isPeriodicTableVisible: get().isPeriodicTablePinned ? get().isPeriodicTableVisible : false,
        });
        set({ [setter]: !isOpen });
      },

      // More complex actions that were in App.jsx
      handleReset: () => {
        set({ isResetConfirmVisible: true });
      },

      executeReset: () => {
        set({
          particles: [],
          bonds: [],
          secondaryParticles: [],
          discoveredAtoms: [],
          discoveredMolecules: [],
          discoveredOrganelles: [],
          currentGoalIndex: 0,
          isResetConfirmVisible: false,
          introComplete: false,
          universeMilestones: {
            galaxyFormed: false,
            starsIgnited: false,
            solarSystemFormed: false,
            earthEntered: false,
            lifePlanted: false,
          },
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
        const newSandboxState = !get().isSandboxMode;
        set({ isSandboxMode: newSandboxState });
        get().showMessage(`Sandbox mode ${newSandboxState ? 'activated' : 'deactivated'}.`);
      },

      handleEmptyCanvas: () => {
        if (get().particles.length === 0) return;
        set({ particles: [] });
        //setSelectedParticleIds(new Set()); // This needs to be handled in the selection slice
        get().showMessage('Canvas cleared.');
      },
    }),
    {
      name: 'particle-lab-store', // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
      // A little trick to only persist the data we want
      partialize: (state) => ({
        particles: state.particles,
        bonds: state.bonds,
        secondaryParticles: state.secondaryParticles,
        discoveredAtoms: state.discoveredAtoms,
        discoveredMolecules: state.discoveredMolecules,
        discoveredOrganelles: state.discoveredOrganelles,
        currentGoalIndex: state.currentGoalIndex,
        uiScale: state.uiScale,
        isPeriodicTablePinned: state.isPeriodicTablePinned,
        goalPath: state.goalPath,
        isSandboxMode: state.isSandboxMode,
        introComplete: state.introComplete,
        globalSettings: state.globalSettings,
        universeMilestones: state.universeMilestones,
      }),
    }
  )
);