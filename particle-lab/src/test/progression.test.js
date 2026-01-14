import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';

describe('Game Progression & Settings', () => {
  beforeEach(() => {
    useStore.setState({
      universeMilestones: {
        galaxyFormed: false,
        starsIgnited: false,
        solarSystemFormed: false,
        earthEntered: false,
        lifePlanted: false,
      },
      globalSettings: {
        masterVolume: 0.5,
        musicVolume: 0.3,
        sfxVolume: 0.8,
        graphicsQuality: 'high',
        showTooltips: true,
        reducedMotion: false,
      },
      introComplete: true,
      particles: [],
      discoveredAtoms: [],
    });
  });

  describe('Universe Milestones', () => {
    it('should update milestone status', () => {
      const { setUniverseMilestone } = useStore.getState();
      
      setUniverseMilestone('galaxyFormed', true);
      expect(useStore.getState().universeMilestones.galaxyFormed).toBe(true);
      
      setUniverseMilestone('starsIgnited', true);
      expect(useStore.getState().universeMilestones.starsIgnited).toBe(true);
    });

    it('should reset milestones on executeReset', () => {
        const { setUniverseMilestone, executeReset } = useStore.getState();
        
        // Advance progress
        setUniverseMilestone('galaxyFormed', true);
        setUniverseMilestone('starsIgnited', true);
        
        // Reset
        executeReset();
        
        const milestones = useStore.getState().universeMilestones;
        expect(milestones.galaxyFormed).toBe(false);
        expect(milestones.starsIgnited).toBe(false);
        expect(milestones.solarSystemFormed).toBe(false);
    });

    it('should reset introComplete on executeReset', () => {
        const { executeReset } = useStore.getState();
        
        // Verify initial state (set in beforeEach)
        expect(useStore.getState().introComplete).toBe(true);
        
        executeReset();
        
        expect(useStore.getState().introComplete).toBe(false);
    });
  });

  describe('Global Settings', () => {
      it('should update specific settings without affecting others', () => {
          const { setGlobalSettings } = useStore.getState();
          
          setGlobalSettings({ masterVolume: 0.8 });
          
          const settings = useStore.getState().globalSettings;
          expect(settings.masterVolume).toBe(0.8);
          expect(settings.musicVolume).toBe(0.3); // Unchanged
          expect(settings.graphicsQuality).toBe('high'); // Unchanged
      });

      it('should persist settings after reset (assuming reset logic preserves them)', () => {
          // Typically settings shouldn't be wiped by a game reset, let's verify if executeReset touches them.
          // Looking at store.js, executeReset resets game state but NOT globalSettings.
          const { setGlobalSettings, executeReset } = useStore.getState();
          
          setGlobalSettings({ showTooltips: false });
          executeReset();
          
          expect(useStore.getState().globalSettings.showTooltips).toBe(false);
      });
  });
});
