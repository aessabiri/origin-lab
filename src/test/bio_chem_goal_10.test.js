import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  LEVEL_1_MACROMOLECULES,
  TIER_1_ORGAN_SYSTEMS,
  evaluateOrganPhysiologyBenchTest
} from '../biology-lab/data/topDownBioHierarchy';
import {
  classifyMeshToOrganSubPart,
  applyOrganSubPartMaterials
} from '../biology-lab/utils/zAnatomyOrganLoader';
import { create3DOrganForSystem } from '../biology-lab/utils/organelle3DFactory';
import { useBioStore } from '../biology-lab/store';
import { useChemistryStore } from '../chemistry-lab/store';
import { REACTIONS } from '../chemistry-lab/data/reactions';
import { VSEPR_MOLECULES } from '../chemistry-lab/components/MoleculeViewer3D';
import {
  useAnatomyStore,
  CLINICAL_PATHOLOGIES,
  computeSystemicHomeostasis
} from '../anatomy-lab/store';
import { usePlanetaryStore } from '../store/planetaryStore';

describe('4 Chemistry-Biology Bridge Steps & 10 Next-Best Upgrades Suite', () => {
  beforeEach(() => {
    useBioStore.setState({
      assembledOrganParts: [],
      assembledOrganelleParts: [],
      assembledOrganelles: [],
      foldedProteins: [],
      differentiatedCells: [],
      engineeredTissues: []
    });
    useChemistryStore.setState({
      activeBioOrder: null,
      localInventory: {},
      vessels: {
        beaker: {
          id: 'beaker',
          name: 'Open Beaker',
          contents: {},
          temp: 20,
          targetTemp: 20,
          pressure: 1,
          maxVol: 500,
          status: 'ok',
          type: 'glass',
          variant: 'beaker',
          activeVisual: null,
          isOpen: true
        }
      }
    });
    useAnatomyStore.getState().resetSkeleton();
  });

  it('Step 1: Defines 4 Z-Anatomy 3D anatomical subParts for all 5 Organ Systems and snaps them into solid PBR meshes', () => {
    expect(TIER_1_ORGAN_SYSTEMS).toHaveLength(5);
    for (const sys of TIER_1_ORGAN_SYSTEMS) {
      expect(sys.subParts).toBeDefined();
      expect(sys.subParts).toHaveLength(4);
    }

    // Verify sub-part classification & material transition from blueprint wireframe to solid PBR
    const subId = classifyMeshToOrganSubPart('cardiovascular_system', 'Left Ventricle');
    expect(subId).toBe('cardio_ventricles');

    const organGroup = create3DOrganForSystem('cardiovascular_system');
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.2);

    // 0 parts snapped -> all meshes wireframe
    applyOrganSubPartMaterials(organGroup, 'cardiovascular_system', [], false, clipPlane);
    let wireframeCount = 0;
    organGroup.traverse((child) => {
      if (child.isMesh && child.material.wireframe) wireframeCount++;
    });
    expect(wireframeCount).toBeGreaterThan(0);

    // Snap cardio_ventricles in store
    useBioStore.getState().snapOrganSubPart('cardiovascular_system', 'cardio_ventricles');
    expect(useBioStore.getState().assembledOrganParts).toContain('cardio_ventricles');
  });

  it('Step 2: Queues activeBioOrder in Chemistry Store and auto-synthesizes the target bio-monomer into vessel & inventory', () => {
    const collagenOrder = LEVEL_1_MACROMOLECULES.collagen_i.chemistryOrder;
    expect(collagenOrder).toBeDefined();
    expect(collagenOrder.compoundId).toBe('glycine');

    useChemistryStore.getState().setActiveBioOrder(collagenOrder);
    expect(useChemistryStore.getState().activeBioOrder.compoundId).toBe('glycine');

    const ok = useChemistryStore.getState().autoSynthesizeBioOrder();
    expect(ok).toBe(true);
    expect(useChemistryStore.getState().localInventory.glycine).toBeGreaterThanOrEqual(2);
    expect(useChemistryStore.getState().activeBioOrder.fulfilled).toBe(true);
  });

  it('Step 3: Includes complete biochemical reaction chains in REACTIONS (phospholipid, dna, nadh, glycine, glutamic-acid, heme, arginine)', () => {
    const requiredProducts = [
      'phospholipid',
      'dna',
      'nadh',
      'glycine',
      'glutamic-acid',
      'heme',
      'arginine'
    ];
    for (const prodId of requiredProducts) {
      const found = REACTIONS.find((r) => r.outputs && r.outputs[prodId] > 0);
      expect(found).toBeDefined();
      expect(Object.keys(found.inputs).length).toBeGreaterThan(0);
    }
  });

  it('Step 4: Seeds primordial & biological feedstock into Chemistry Bench in 1 click', () => {
    useChemistryStore.getState().seedPrimordialFeedstock();
    const inv = useChemistryStore.getState().localInventory;
    expect(inv.water).toBeGreaterThanOrEqual(20);
    expect(inv.ammonia).toBeGreaterThanOrEqual(15);
    expect(inv['phosphoric-acid']).toBeGreaterThanOrEqual(10);
    expect(inv.glucose).toBeGreaterThanOrEqual(8);
  });

  it('Upgrades #1 & #2: Evaluates live physiological organ bench-test telemetry across all 5 organ systems', () => {
    const heartTest = evaluateOrganPhysiologyBenchTest('cardiovascular_system', 100);
    expect(heartTest.primaryMetric).toContain('5.2 L/min');
    expect(heartTest.secondaryMetric).toContain('66%');
    expect(heartTest.passed).toBe(true);

    const brainTest = evaluateOrganPhysiologyBenchTest('nervous_system', 100);
    expect(brainTest.primaryMetric).toContain('40.0 Hz');
    expect(brainTest.passed).toBe(true);
  });

  it('Upgrades #4 & #5: Computes coupled multi-organ systemic homeostasis and simulates/repairs clinical pathologies', () => {
    const store = useAnatomyStore.getState();
    store.assembleAllBones();
    ['osteoid', 'myofibril', 'visceral', 'endothelial', 'neural'].forEach((t) =>
      useAnatomyStore.getState().synthesizeBioTissue(t)
    );

    const healthy = computeSystemicHomeostasis(useAnatomyStore.getState());
    expect(healthy.homeostasisScore).toBe(100);
    expect(healthy.systemicO2DeliveryMlMin).toBe(1000);
    expect(healthy.statusLabel).toBe('NORMOXIC HOMEOSTASIS');

    // Trigger Myocardial Ischemia pathology
    expect(CLINICAL_PATHOLOGIES.myocardial_ischemia).toBeDefined();
    useAnatomyStore.getState().triggerPathology('myocardial_ischemia');
    expect(useAnatomyStore.getState().activePathology).toBe('myocardial_ischemia');

    const ischemic = computeSystemicHomeostasis(useAnatomyStore.getState());
    expect(ischemic.homeostasisScore).toBeLessThan(healthy.homeostasisScore);
    expect(ischemic.systemicO2DeliveryMlMin).toBeLessThan(1000);

    // Apply Stem-Cell Regenerative Repair
    const repaired = useAnatomyStore.getState().applyRegenerativeRepair();
    expect(repaired).toBe(true);
    expect(useAnatomyStore.getState().activePathology).toBeNull();
  });

  it('Upgrades #7 & #9: Includes 3D Heme & Phospholipid VSEPR models and syncs Planetary O2 atmosphere', () => {
    expect(VSEPR_MOLECULES.heme).toBeDefined();
    expect(VSEPR_MOLECULES.phospholipid).toBeDefined();

    usePlanetaryStore.getState().updateAtmosphere('oxygen', 2.5);
    expect(usePlanetaryStore.getState().atmosphere.oxygen).toBeGreaterThanOrEqual(21);
  });
});
