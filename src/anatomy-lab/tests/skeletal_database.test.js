import { describe, it, expect, beforeEach } from 'vitest';
import { ALL_206_BONES, TOTAL_BONE_COUNT, BONE_SUBGROUPS } from '../data/humanSkeletalDatabase.js';
import { useAnatomyStore } from '../store.js';
import { KineticChainSolver } from '../utils/KineticChainSolver.js';
import { matchMeshToBone, normalizeGLTFNodeName, isRightSideAnatomyNode } from '../utils/boneMatcher.js';
import { doesMeshMatchMuscleList } from '../components/AnatomyCanvas.jsx';
import { GeometryOptimizer } from '../utils/GeometryOptimizer.js';
import { createMedicalMaterials } from '../utils/MedicalMaterials.js';
import * as THREE from 'three';
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

  it('should recover and match sanitized GLTFLoader node names (Femurr -> Femur.r, Medial_cuneiform_boner -> cuneiform_medial_r)', () => {
    expect(normalizeGLTFNodeName('Femurr', 'Bones_right')).toBe('Femur.r');
    expect(normalizeGLTFNodeName('Medial_cuneiform_boner', 'Bones_right')).toBe('Medial cuneiform bone.r');
    expect(normalizeGLTFNodeName('Scapular', 'Bones_right')).toBe('Scapula.r');

    expect(matchMeshToBone('Femurr', 'Bones_right')?.id).toBe('femur_r');
    expect(matchMeshToBone('Tibiar', 'Bones_right')?.id).toBe('tibia_r');
    expect(matchMeshToBone('Fibular', 'Bones_right')?.id).toBe('fibula_r');
    expect(matchMeshToBone('Humerusr', 'Bones_right')?.id).toBe('humerus_r');
    expect(matchMeshToBone('Medial_cuneiform_boner', 'Bones_right')?.id).toBe('medial_cuneiform_r');
    expect(matchMeshToBone('First_distal_phalanx_of_footr', 'Bones_right')?.id).toBe('phalanx_foot_distal_1_r');

    // Mirrored left counterparts
    expect(matchMeshToBone('Femur.l', 'Bones_left')?.id).toBe('femur_l');
    expect(matchMeshToBone('Tibia.l', 'Bones_left')?.id).toBe('tibia_l');
    expect(matchMeshToBone('Humerus.l', 'Bones_left')?.id).toBe('humerus_l');
    expect(matchMeshToBone('Medial cuneiform bone.l', 'Bones_left')?.id).toBe('medial_cuneiform_l');

    expect(isRightSideAnatomyNode({ name: 'Femurr', parent: { name: 'Bones_right', parent: null } })).toBe(true);
  });

  it('should match sanitized GLTFLoader multi-word muscle names in doesMeshMatchMuscleList', () => {
    const tightList = [{ id: 'gluteus_maximus', name: 'Right Gluteus Maximus' }];
    expect(doesMeshMatchMuscleList('Gluteus_maximus_muscler', tightList)).toBe(true);
    expect(doesMeshMatchMuscleList('Gluteus_maximus_musclel', tightList)).toBe(false);
  });

  it('should decimate high-poly meshes via GeometryOptimizer and share buffers across mirrored limbs', () => {
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const rightMesh = new THREE.Mesh(sphereGeo);
    const leftMirroredMesh = new THREE.Mesh(sphereGeo);

    GeometryOptimizer.registerMesh(rightMesh);
    GeometryOptimizer.registerMesh(leftMirroredMesh);

    const origCount = sphereGeo.index.count;
    GeometryOptimizer.applySceneLOD([rightMesh, leftMirroredMesh], 0.35);

    expect(rightMesh.geometry.index.count).toBeLessThan(origCount);
    // Both right and mirrored left mesh share the exact same decimated BufferGeometry instance
    expect(rightMesh.geometry).toBe(leftMirroredMesh.geometry);
  });

  it('should bio-print tissues from the Biology Lab bridge into the 3D Anatomy store', () => {
    const store = useAnatomyStore.getState();
    store.synthesizeBioTissue('osteoid');
    store.synthesizeBioTissue('visceral');
    store.synthesizeBioTissue('endothelial');
    store.synthesizeBioTissue('neural');

    const next = useAnatomyStore.getState();
    expect(next.bioprintedTissues.osteoid).toBe(true);
    expect(next.bioprintedTissues.visceral).toBe(true);
    expect(next.bioprintedTissues.endothelial).toBe(true);
    expect(next.bioprintedTissues.neural).toBe(true);
    expect(next.assembledBones).toHaveLength(206);
    expect(next.layerVisibility.organs).toBe(true);
    expect(next.layerVisibility.circulation).toBe(true);
    expect(next.layerVisibility.nerves).toBe(true);
    expect(next.vitalSigns.heartRate).toBe(72);
  });
});
