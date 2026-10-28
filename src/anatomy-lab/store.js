import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ALL_206_BONES, TOTAL_BONE_COUNT } from './data/humanSkeletalDatabase.js';
import { KineticChainSolver } from './utils/KineticChainSolver.js';
import { useProgressionStore } from '../store/progressionStore.js';
import { useStore } from '../store.js';

export const useAnatomyStore = create(
  persist(
    (set, get) => ({
      // Assembled Bones (Array of Bone IDs)
      assembledBones: [],

      // Active Inspection & Selection
      selectedBoneId: 'femur_r',
      activeRegion: 'all',
      searchQuery: '',

      // 5 Anatomical Layers
      activeLayer: 'skeleton', // 'skeleton' | 'ligaments' | 'muscles' | 'circulation' | 'nerves'
      layerVisibility: {
        skeleton: true,
        ligaments: true,
        muscles: false,
        circulation: false,
        nerves: false,
      },

      // Biomechanical & Posture Telemetry
      kineticMode: 'foot_ascending',
      postureParams: {
        rightFootPronation: 0,
        leftFootPronation: 0,
        rightKneeValgus: 0,
        leftKneeValgus: 0,
        pelvisDrop: 0,
        pelvisTilt: 0,
        pelvisRotation: 0,
        lumbarLordosis: 0,
        spinalLateralBend: 0,
        thoracicKyphosis: 0,
        cervicalForwardHead: 0,
      },

      // Dynamic Muscle Strain Heatmap Lists
      overactiveMuscles: [],
      underactiveMuscles: [],

      // Vital Signs & Sentience Telemetry
      vitalSigns: {
        heartRate: 0,
        bloodPressureSys: 0,
        bloodPressureDia: 0,
        oxygenSaturation: 0,
        eegBand: 'Delta (Deep Stasis)',
        eegFrequency: 1.5,
      },
      consciousnessScore: 0,
      isAwakened: false,

      // --- Actions ---

      // Assemble an individual bone by ID
      assembleBone: (boneId) => {
        const { assembledBones } = get();
        if (assembledBones.includes(boneId)) return false;

        const nextAssembled = [...assembledBones, boneId];
        const integrityPercent = Math.round((nextAssembled.length / TOTAL_BONE_COUNT) * 100);

        set({
          assembledBones: nextAssembled,
          selectedBoneId: boneId,
        });

        // Acoustic Snap Resonance (Web Audio API procedural feedback)
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440 + nextAssembled.length * 3.5, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.16);
        } catch (_) {}

        // Check Milestone Progress
        if (nextAssembled.length === TOTAL_BONE_COUNT) {
          useProgressionStore.getState().completeMilestone('complete_human_osteogenesis');
          useStore.getState().showMessage('🏆 All 206 Human Skeletal Bones Assembled! Structural Integrity: 100%');
          set({
            layerVisibility: {
              skeleton: true,
              ligaments: true,
              muscles: true,
              circulation: true,
              nerves: true,
            },
            consciousnessScore: 100,
            isAwakened: true,
            vitalSigns: {
              heartRate: 72,
              bloodPressureSys: 120,
              bloodPressureDia: 80,
              oxygenSaturation: 99,
              eegBand: 'Gamma (Self-Awareness)',
              eegFrequency: 42.5,
            },
          });
        }

        return true;
      },

      // Batch assemble all 206 bones (sandbox or complete test)
      assembleAllBones: () => {
        const allIds = ALL_206_BONES.map(b => b.id);
        set({
          assembledBones: allIds,
          consciousnessScore: 100,
          isAwakened: true,
          layerVisibility: {
            skeleton: true,
            ligaments: true,
            muscles: true,
            circulation: true,
            nerves: true,
          },
          vitalSigns: {
            heartRate: 72,
            bloodPressureSys: 120,
            bloodPressureDia: 80,
            oxygenSaturation: 99,
            eegBand: 'Gamma (Self-Awareness)',
            eegFrequency: 42.5,
          },
        });
        useProgressionStore.getState().completeMilestone('complete_human_osteogenesis');
        useStore.getState().showMessage('All 206 Bones Assembled! Human Anatomical Matrix Complete.');
      },

      // Reset Skeleton
      resetSkeleton: () => {
        set({
          assembledBones: [],
          consciousnessScore: 0,
          isAwakened: false,
          layerVisibility: {
            skeleton: true,
            ligaments: false,
            muscles: false,
            circulation: false,
            nerves: false,
          },
          vitalSigns: {
            heartRate: 0,
            bloodPressureSys: 0,
            bloodPressureDia: 0,
            oxygenSaturation: 0,
            eegBand: 'Delta (Deep Stasis)',
            eegFrequency: 1.5,
          },
        });
        useStore.getState().showMessage('Skeletal Assembly Matrix Reset.');
      },

      // Select Bone for Inspection & Camera Focus
      setSelectedBoneId: (selectedBoneId) => set({ selectedBoneId }),
      setActiveRegion: (activeRegion) => set({ activeRegion }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveLayer: (activeLayer) => set({ activeLayer }),

      toggleLayer: (layerKey) => set(state => ({
        layerVisibility: {
          ...state.layerVisibility,
          [layerKey]: !state.layerVisibility[layerKey],
        }
      })),

      // Posture & Kinetic Chain Update
      setPostureParam: (param, value) => {
        const state = get();
        const nextParams = { ...state.postureParams, [param]: value };
        const solved = KineticChainSolver.solveKineticChain(nextParams, state.kineticMode);
        const strains = KineticChainSolver.calculateMuscleStrains(solved);

        set({
          postureParams: solved,
          overactiveMuscles: strains.overactive,
          underactiveMuscles: strains.underactive,
        });
      },

      setKineticMode: (kineticMode) => {
        const state = get();
        const solved = KineticChainSolver.solveKineticChain(state.postureParams, kineticMode);
        const strains = KineticChainSolver.calculateMuscleStrains(solved);

        set({
          kineticMode,
          postureParams: solved,
          overactiveMuscles: strains.overactive,
          underactiveMuscles: strains.underactive,
        });
      },
    }),
    {
      name: 'origin-lab-anatomy-store',
      partialize: (state) => ({
        assembledBones: state.assembledBones,
        layerVisibility: state.layerVisibility,
        isAwakened: state.isAwakened,
      }),
    }
  )
);
