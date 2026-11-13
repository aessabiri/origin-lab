import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ALL_206_BONES, TOTAL_BONE_COUNT } from './data/humanSkeletalDatabase.js';
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

      // 6 High-Definition Anatomical System Layers
      activeLayer: 'skeleton', // 'skeleton' | 'ligaments' | 'muscles' | 'organs' | 'circulation' | 'nerves'
      layerVisibility: {
        skeleton: true,
        ligaments: true,
        muscles: false,
        organs: false,
        circulation: false,
        nerves: false,
      },

      // Hardware GPU Optimization LOD Ratio (1.0 = Ultra HD, 0.65 = Balanced, 0.35 = Low-Spec)
      meshLodRatio: 1.0,

      // Bio Lab -> 3D Anatomy Lab Tissue Bioprinting Bridge
      bioprintedTissues: {
        osteoid: false,
        myofibril: false,
        visceral: false,
        endothelial: false,
        neural: false,
      },

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
          useProgressionStore.getState().completeMilestone('cosmic_ouroboros');
          useStore.getState().showMessage('🏆 All 206 Human Bones Assembled! Full HD Anatomical Systems Awakened (100%).');
          set({
            layerVisibility: {
              skeleton: true,
              ligaments: true,
              muscles: true,
              organs: true,
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

      // Batch assemble all 206 bones
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
            organs: true,
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
        useProgressionStore.getState().completeMilestone('cosmic_ouroboros');
        useStore.getState().showMessage('🏆 All 206 Bones & 6 HD Anatomical Systems Assembled!');
      },

      // Reset Skeleton
      resetSkeleton: () => {
        set({
          assembledBones: [],
          consciousnessScore: 0,
          isAwakened: false,
          bioprintedTissues: {
            osteoid: false,
            myofibril: false,
            visceral: false,
            endothelial: false,
            neural: false,
          },
          layerVisibility: {
            skeleton: true,
            ligaments: false,
            muscles: false,
            organs: false,
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

      setMeshLodRatio: (ratio) => {
        const clamped = Math.max(0.25, Math.min(1.0, Number(ratio) || 1.0));
        set({ meshLodRatio: clamped });
      },

      // Bio Lab -> 3D Anatomy Lab Tissue Bioprinting Bridge
      synthesizeBioTissue: (tissueType) => {
        const state = get();
        const nextTissues = {
          ...state.bioprintedTissues,
          [tissueType]: true,
        };
        const nextVis = { ...state.layerVisibility };
        let nextBones = state.assembledBones;
        let nextVitals = { ...state.vitalSigns };
        let msg = '';

        if (tissueType === 'osteoid') {
          nextVis.skeleton = true;
          nextVis.ligaments = true;
          nextBones = ALL_206_BONES.map(b => b.id);
          msg = '🦴 Bio-Printed Calcified Osteoid & Hyaline Matrix: All 206 Bones Materialized!';
        } else if (tissueType === 'myofibril') {
          nextVis.muscles = true;
          nextVis.ligaments = true;
          msg = '💪 Bio-Printed Striated Myofibril Slings & 349 Full-Body Joint Capsules/Ligaments Materialized!';
        } else if (tissueType === 'visceral') {
          nextVis.organs = true;
          msg = '🫁 Bio-Printed 276 HD Visceral & Lymphoid Organs (Lungs, Liver, Stomach, Pancreas, Spleen, Thymus, Colon)!';
        } else if (tissueType === 'endothelial') {
          nextVis.circulation = true;
          nextVitals = {
            ...nextVitals,
            heartRate: 72,
            bloodPressureSys: 120,
            bloodPressureDia: 80,
            oxygenSaturation: 99,
          };
          msg = '🫀 Bio-Printed 676 HD 4-Chamber Heart, Valves, Coronary Vessels & Systemic Vascular Tree!';
        } else if (tissueType === 'neural') {
          nextVis.nerves = true;
          nextVitals = {
            ...nextVitals,
            eegBand: 'Gamma (Self-Awareness)',
            eegFrequency: 42.5,
          };
          msg = '🧠 Bio-Printed 580 HD Brain Lobes, Cerebellum, Ventricles, Spinal Cord & Peripheral Nerves!';
        }

        const countActive = Object.values(nextTissues).filter(Boolean).length;
        const nextConsciousness = Math.max(state.consciousnessScore, Math.min(100, countActive * 25));

        set({
          bioprintedTissues: nextTissues,
          layerVisibility: nextVis,
          assembledBones: nextBones,
          vitalSigns: nextVitals,
          consciousnessScore: nextConsciousness,
          isAwakened: nextConsciousness >= 100 || state.isAwakened,
        });

        if (msg) {
          useStore.getState().showMessage(msg);
        }
        return nextTissues;
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
