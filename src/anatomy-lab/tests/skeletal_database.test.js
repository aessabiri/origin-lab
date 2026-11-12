import { describe, it, expect, beforeEach } from 'vitest';
import { ALL_206_BONES, TOTAL_BONE_COUNT, BONE_SUBGROUPS } from '../data/humanSkeletalDatabase.js';
import { useAnatomyStore } from '../store.js';
import { KineticChainSolver } from '../utils/KineticChainSolver.js';
import { matchMeshToBone } from '../utils/boneMatcher.js';
import { createMedicalMaterials } from '../utils/MedicalMaterials.js';
import {
  createProceduralMicroBones,
  createCartilageAndLigamentsLayer,
  createVascularLoopLayer,
  createNeuralConnectomeLayer
} from '../utils/anatomicalLayers.js';

describe('206-Bone Human Skeletal Matrix Tests', () => {
  beforeEach(() => {
    useAnatomyStore.getState().resetSkeleton();
  });

  it('should verify the anatomical database contains exactly 206 individual bones', () => {
    expect(TOTAL_BONE_COUNT).toBe(206);
    expect(ALL_206_BONES).toHaveLength(206);

    const uniqueIds = new Set(ALL_206_BONES.map(b => b.id));
    expect(uniqueIds.size).toBe(206);
  });

  it('should verify correct distribution of 80 Axial and 126 Appendicular bones', () => {
    const axialBones = ALL_206_BONES.filter(b => b.region === 'axial');
    const appendicularBones = ALL_206_BONES.filter(b => b.region === 'appendicular');

    expect(axialBones).toHaveLength(80);
    expect(appendicularBones).toHaveLength(126);
  });

  it('should verify every bone possesses authentic Latin nomenclature, valid ossification data, and valid articulation IDs', () => {
    const validIds = new Set(ALL_206_BONES.map(b => b.id));
    ALL_206_BONES.forEach(bone => {
      expect(bone.id).toBeTruthy();
      expect(bone.name).toBeTruthy();
      expect(bone.latinName).toBeTruthy();
      expect(['endochondral', 'intramembranous', 'endochondral/intramembranous']).toContain(bone.ossification);
      (bone.articulations || []).forEach(targetId => {
        expect(validIds.has(targetId)).toBe(true);
      });
    });
  });

  it('should assemble bones individually and update structural integrity accurately', () => {
    const store = useAnatomyStore.getState();
    expect(store.assembledBones).toHaveLength(0);

    // Assemble Femur
    const success = store.assembleBone('femur_r');
    expect(success).toBe(true);
    expect(useAnatomyStore.getState().assembledBones).toContain('femur_r');

    // Duplicate check
    const duplicate = store.assembleBone('femur_r');
    expect(duplicate).toBe(false);
  });

  it('should assemble all 206 bones, achieve 100% integrity, and ignite sentience vitals', () => {
    useAnatomyStore.getState().assembleAllBones();
    const state = useAnatomyStore.getState();

    expect(state.assembledBones).toHaveLength(206);
    expect(state.consciousnessScore).toBe(100);
    expect(state.isAwakened).toBe(true);
    expect(state.vitalSigns.heartRate).toBe(72);
    expect(state.vitalSigns.eegBand).toContain('Gamma');
  });

  it('should solve closed-chain kinematics and compute postural compensations', () => {
    // Simulate excessive right foot pronation (flat foot)
    const solved = KineticChainSolver.solveKineticChain({ rightFootPronation: 0.35 }, 'foot_ascending');

    expect(solved.rightKneeValgus).toBeGreaterThan(0.2);
    expect(solved.pelvisDrop).toBeGreaterThan(0);
    expect(solved.thoracicKyphosis).toBeGreaterThan(0);

    const strains = KineticChainSolver.calculateMuscleStrains(solved);
    expect(strains.overactive).toBeInstanceOf(Array);
    expect(strains.underactive).toBeInstanceOf(Array);
  });

  it('should accurately match clinical CT scan mesh nodes to individual bones including trailing dot Scapula.r.', () => {
    expect(matchMeshToBone('Femur.r')?.id).toBe('femur_r');
    expect(matchMeshToBone('Scapula.r.')?.id).toBe('scapula_r');
    expect(matchMeshToBone('Scapula.l.')?.id).toBe('scapula_l');
    expect(matchMeshToBone('Atlas (C1)')?.id).toBe('vertebra_c1');
    expect(matchMeshToBone('Axis (C2)')?.id).toBe('vertebra_c2');
    expect(matchMeshToBone('Lumbar vertebrae (L5)')?.id).toBe('vertebra_l5');
    expect(matchMeshToBone('Thoracic vertebrae (T12)')?.id).toBe('vertebra_t12');
    expect(matchMeshToBone('Rib (1st).r')?.id).toBe('rib_1_r');
    expect(matchMeshToBone('Body of sternum')?.id).toBe('sternum');
    expect(matchMeshToBone('1st metacarpal bone.r')?.id).toBe('metacarpal_1_r');
    expect(matchMeshToBone('Calcaneus.r')?.id).toBe('calcaneus_r');
  });

  it('should apply posture presets and compute neutral vs cascading myofascial strains cleanly', () => {
    const neutralStrains = KineticChainSolver.calculateMuscleStrains({});
    expect(neutralStrains.overactive).toHaveLength(0);
    expect(neutralStrains.underactive).toHaveLength(0);

    useAnatomyStore.getState().applyPosturePreset('compound_cascade');
    const state = useAnatomyStore.getState();
    expect(state.activePresetId).toBe('compound_cascade');
    expect(state.overactiveMuscles.length).toBeGreaterThan(0);
    expect(state.underactiveMuscles.length).toBeGreaterThan(0);
    expect(state.layerVisibility.muscles).toBe(true);
  });

  it('should generate all 4 anatomical layers and procedural micro-bones', () => {
    const materials = createMedicalMaterials();

    const micro = createProceduralMicroBones(materials);
    expect(micro.meshes).toHaveLength(7); // hyoid + 6 ear ossicles

    const cartilage = createCartilageAndLigamentsLayer(materials);
    expect(cartilage.children.length).toBeGreaterThan(5);

    const vascular = createVascularLoopLayer(materials);
    expect(vascular.heartMesh).toBeDefined();

    const neural = createNeuralConnectomeLayer(materials);
    expect(neural.synPoints).toBeDefined();
  });
});
