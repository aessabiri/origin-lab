import { describe, it, expect, beforeEach } from 'vitest';
import { ALL_206_BONES, TOTAL_BONE_COUNT, BONE_SUBGROUPS } from '../data/humanSkeletalDatabase.js';
import { useAnatomyStore } from '../store.js';
import { KineticChainSolver } from '../utils/KineticChainSolver.js';

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

  it('should verify every bone possesses authentic Latin nomenclature and valid ossification data', () => {
    ALL_206_BONES.forEach(bone => {
      expect(bone.id).toBeTruthy();
      expect(bone.name).toBeTruthy();
      expect(bone.latinName).toBeTruthy();
      expect(['endochondral', 'intramembranous', 'endochondral/intramembranous']).toContain(bone.ossification);
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
});
