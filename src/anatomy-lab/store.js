import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ALL_206_BONES, TOTAL_BONE_COUNT } from './data/humanSkeletalDatabase.js';
import { POSTURE_CONDITIONS } from './data/postureConditions.js';
import { KineticChainSolver } from './utils/KineticChainSolver.js';
import { useProgressionStore } from '../store/progressionStore.js';
import { useStore } from '../store.js';

const DEFAULT_POSTURE_PARAMS = {
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
  leftShoulderProtraction: 0,
  rightShoulderProtraction: 0,
};

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
      activePresetId: 'neutral',
      showVectors: true,
      activeGizmoJoint: null, // 'pelvis' | 'lumbar' | 'thoracic' | 'cervical' | 'right_femur' | 'right_tibia' | 'right_foot' | null
      gravityMultiplier: 1.0, // 0.16 (Moon) | 0.38 (Mars) | 1.0 (Earth) | 1.6 (Super-Earth) | 2.53 (Jupiter)
      postureParams: { ...DEFAULT_POSTURE_PARAMS },

      // Dynamic Muscle Strain Heatmap Lists (Array of { id, name, role, severity, strainPercent })
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
          consciousnessScore: integrityPercent,
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

        // Check Axial (80) or Appendicular (126) regional completion
        const axialIds = ALL_206_BONES.filter(b => b.region === 'axial').map(b => b.id);
        const appendicularIds = ALL_206_BONES.filter(b => b.region === 'appendicular').map(b => b.id);
        const justFinishedAxial =
          axialIds.includes(boneId) && axialIds.every(id => nextAssembled.includes(id));
        const justFinishedAppendicular =
          appendicularIds.includes(boneId) && appendicularIds.every(id => nextAssembled.includes(id));

        if (justFinishedAxial && nextAssembled.length < TOTAL_BONE_COUNT) {
          useStore.getState().showMessage('🦴 Axial Skeleton Complete (80/80 Bones): Cranium, Spine & Thoracic Cage Locked!');
        } else if (justFinishedAppendicular && nextAssembled.length < TOTAL_BONE_COUNT) {
          useStore.getState().showMessage('🦴 Appendicular Skeleton Complete (126/126 Bones): All Limbs & Girdles Articulated!');
        }

        // Check Milestone Progress (All 206 Bones)
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
          activePresetId: 'neutral',
          postureParams: { ...DEFAULT_POSTURE_PARAMS },
          overactiveMuscles: [],
          underactiveMuscles: [],
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
      setShowVectors: (showVectors) => set({ showVectors }),
      toggleVectors: () => set(state => ({ showVectors: !state.showVectors })),
      setActiveGizmoJoint: (activeGizmoJoint) => set({ activeGizmoJoint }),

      toggleLayer: (layerKey) => set(state => ({
        layerVisibility: {
          ...state.layerVisibility,
          [layerKey]: !state.layerVisibility[layerKey],
        }
      })),

      // Posture & Kinetic Chain Update
      setGravityMultiplier: (gravityMultiplier) => {
        const state = get();
        const g = Math.max(0.05, Number(gravityMultiplier) || 1.0);
        const strains = KineticChainSolver.calculateMuscleStrains(state.postureParams, g);
        set({
          gravityMultiplier: g,
          overactiveMuscles: strains.overactive,
          underactiveMuscles: strains.underactive,
        });
      },

      setPostureParam: (param, value) => {
        const state = get();
        const nextParams = { ...state.postureParams, [param]: value };
        const solved = KineticChainSolver.solveKineticChain(nextParams, state.kineticMode);
        const strains = KineticChainSolver.calculateMuscleStrains(solved, state.gravityMultiplier);

        set({
          activePresetId: 'custom',
          postureParams: solved,
          overactiveMuscles: strains.overactive,
          underactiveMuscles: strains.underactive,
        });
      },

      setKineticMode: (kineticMode) => {
        const state = get();
        const solved = KineticChainSolver.solveKineticChain(state.postureParams, kineticMode);
        const strains = KineticChainSolver.calculateMuscleStrains(solved, state.gravityMultiplier);

        set({
          kineticMode,
          postureParams: solved,
          overactiveMuscles: strains.overactive,
          underactiveMuscles: strains.underactive,
        });
      },

      applyPosturePreset: (presetId) => {
        const state = get();
        const cond = POSTURE_CONDITIONS[presetId] || POSTURE_CONDITIONS.neutral;
        const params = { ...DEFAULT_POSTURE_PARAMS, ...(cond.parameters || {}) };
        const strains = KineticChainSolver.calculateMuscleStrains(params, state.gravityMultiplier);

        set((state) => ({
          activePresetId: cond.id,
          postureParams: params,
          overactiveMuscles: cond.overactiveMuscles?.length ? cond.overactiveMuscles : strains.overactive,
          underactiveMuscles: cond.underactiveMuscles?.length ? cond.underactiveMuscles : strains.underactive,
          // Auto-enable muscle layer when inspecting a non-neutral biomechanical syndrome
          layerVisibility:
            cond.id !== 'neutral'
              ? { ...state.layerVisibility, skeleton: true, muscles: true }
              : state.layerVisibility,
        }));
      },

      resetPosture: () => {
        set({
          activePresetId: 'neutral',
          activeGizmoJoint: null,
          postureParams: { ...DEFAULT_POSTURE_PARAMS },
          overactiveMuscles: [],
          underactiveMuscles: [],
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
