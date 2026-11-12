import { describe, it, expect, beforeEach } from 'vitest';
import {
  useCosmicClockStore,
  resolveCosmicEpoch,
  formatCosmicAge
} from '../store/cosmicClockStore';
import { useInventory } from '../store/inventory';
import { compileAnatomyToGenome } from '../anatomy-lab/utils/blueprintCompiler';
import { ALL_206_BONES } from '../anatomy-lab/data/humanSkeletalDatabase';
import { ATOMIC_ORBITAL_DATA } from '../particle-lab/components/QuantumAtom3D';
import { VSEPR_MOLECULES } from '../chemistry-lab/components/MoleculeViewer3D';
import { createTimeCapsuleSnapshot, restoreTimeCapsuleSnapshot } from '../utils/timeCapsule';
import { useBioStore } from '../biology-lab/store';
import { computeMorphogenesisMetrics } from '../biology-lab/components/CambrianMorphogenesisLab';
import { KineticChainSolver } from '../anatomy-lab/utils/KineticChainSolver';
import { PARTICLE_TYPES } from '../constants/particles';

describe('Argon Branch Overhaul — Cosmic Clock, 3D Quantum/VSEPR Data & Demiurge Compiler', () => {
  beforeEach(() => {
    useInventory.getState().resetUniverse();
    useCosmicClockStore.setState({
      cosmicAgeYears: 380000,
      timeScale: 1,
      autoHarvestEnabled: true,
      harvestAccumulator: 0,
      totalTicks: 0,
      compiledGenome: null
    });
  });

  it('resolves cosmic epochs accurately from 0 s to 13.8 Ga', () => {
    expect(resolveCosmicEpoch(0).id).toBe('PLANCK_INFLATION');
    expect(resolveCosmicEpoch(100).id).toBe('QUARK_GLUON');
    expect(resolveCosmicEpoch(380000).id).toBe('RECOMBINATION');
    expect(resolveCosmicEpoch(250e6).id).toBe('COSMIC_DAWN');
    expect(resolveCosmicEpoch(5e9).id).toBe('GALACTIC_NOON');
    expect(resolveCosmicEpoch(9.5e9).id).toBe('SOLAR_IGNITION');
    expect(resolveCosmicEpoch(13.8e9).id).toBe('BIOSPHERE_ANTHROPOCENE');
  });

  it('formats cosmic age with tabular precision across scales', () => {
    expect(formatCosmicAge(0)).toContain('s');
    expect(formatCosmicAge(380000)).toBe('T + 380.0 ka');
    expect(formatCosmicAge(250e6)).toBe('T + 250.0 Ma');
    expect(formatCosmicAge(13.8e9)).toBe('T + 13.800 Ga');
  });

  it('advances cosmic time and passively harvests H/He into Universal Ledger', () => {
    const store = useCosmicClockStore.getState();
    store.tickCosmicClock(3);
    const updated = useCosmicClockStore.getState();
    expect(updated.cosmicAgeYears).toBeGreaterThan(380000);
    expect(useInventory.getState().elements.hydrogen).toBeGreaterThanOrEqual(2);
    expect(useInventory.getState().elements.helium).toBeGreaterThanOrEqual(1);
  });

  it('seeds all atomic and molecular stocks via quickSeedAllLabs', () => {
    useCosmicClockStore.getState().quickSeedAllLabs();
    const inv = useInventory.getState();
    expect(inv.elements.hydrogen).toBeGreaterThanOrEqual(100);
    expect(inv.elements.carbon).toBeGreaterThanOrEqual(60);
    expect(inv.compounds.water).toBeGreaterThanOrEqual(50);
    expect(inv.compounds.dna).toBeGreaterThanOrEqual(10);
  });

  it('compiles 206-bone skeleton & posture into a deterministic Demiurge Genomic Blueprint', () => {
    const all206 = ALL_206_BONES.map((b) => b.id);
    expect(all206.length).toBe(206);

    const idealBlueprint = compileAnatomyToGenome(all206, {
      archCollapse: 0,
      pelvicTilt: 0,
      thoracicKyphosis: 0,
      forwardHead: 0,
      kneeValgus: 0
    });

    expect(idealBlueprint.boneCount).toBe(206);
    expect(idealBlueprint.axialCount).toBe(80);
    expect(idealBlueprint.appendicularCount).toBe(126);
    expect(idealBlueprint.skeletalCompletionPct).toBe(100);
    expect(idealBlueprint.posturalHarmonyScore).toBe(100);
    expect(idealBlueprint.integrityScore).toBe(100);
    expect(idealBlueprint.morphotypeClass).toContain('Apex Bilateral Sapiens');
    expect(idealBlueprint.codonSignature).toMatch(/^ATG-[A-Z]{3}-[A-Z]{3}-[A-Z]{3}-[A-Z]{3}-TAA$/);

    // Malaligned posture reduces posturalHarmonyScore
    const strainedBlueprint = compileAnatomyToGenome(
      all206.slice(0, 50),
      {
        archCollapse: 1.0,
        pelvicTilt: 22,
        thoracicKyphosis: 35,
        forwardHead: 4.5,
        kneeValgus: 18
      },
      { soleus: 0.9, psoas: 0.85 }
    );
    expect(strainedBlueprint.posturalHarmonyScore).toBeLessThan(idealBlueprint.posturalHarmonyScore);
    expect(strainedBlueprint.integrityScore).toBeLessThan(idealBlueprint.integrityScore);
  });

  it('validates 3D Quantum Orbital shell electron sums against atomic number Z', () => {
    Object.values(ATOMIC_ORBITAL_DATA).forEach((atom) => {
      const shellSum = atom.shells.reduce((a, b) => a + b, 0);
      expect(shellSum).toBe(atom.Z);
    });
  });

  it('validates 3D VSEPR Molecular Hologram atomic coordinates and bond indices', () => {
    Object.values(VSEPR_MOLECULES).forEach((mol) => {
      expect(mol.atoms.length).toBeGreaterThanOrEqual(3);
      expect(mol.bonds.length).toBeGreaterThanOrEqual(2);
      mol.bonds.forEach(([i, j, order]) => {
        expect(mol.atoms[i]).toBeDefined();
        expect(mol.atoms[j]).toBeDefined();
        expect(mol.atoms[i].pos.length).toBe(3);
        expect(mol.atoms[j].pos.length).toBe(3);
        expect(order).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it('serializes and restores the entire multi-lab state via Time Capsule (.origin.json)', () => {
    useCosmicClockStore.getState().setCosmicAgeYears(4500000000);
    useInventory.getState().addResource('elements', 'carbon', 42);
    useBioStore.getState().autoAssembleOptimalLuca();

    const snapshot = createTimeCapsuleSnapshot('Test Snapshot');
    expect(snapshot.version).toBe('2.0.0-argon');
    expect(snapshot.cosmic.cosmicAgeYears).toBe(4500000000);
    expect(snapshot.inventory.elements.carbon).toBe(42);
    expect(snapshot.biology.currentCellDesign.organelles.length).toBe(6);

    // Reset and restore from JSON string
    useInventory.getState().resetUniverse();
    useCosmicClockStore.getState().setCosmicAgeYears(100);
    restoreTimeCapsuleSnapshot(JSON.stringify(snapshot));

    expect(useCosmicClockStore.getState().cosmicAgeYears).toBe(4500000000);
    expect(useInventory.getState().elements.carbon).toBe(42);
    expect(useBioStore.getState().currentCellDesign.organelles.length).toBe(6);
  });

  it('supports all 8 Biology organelle classes, Auto-LUCA assembly, and multi-trophic guild spawning', () => {
    expect(PARTICLE_TYPES.CHLOROPLAST).toBe('chloroplast');
    expect(PARTICLE_TYPES.FLAGELLUM).toBe('flagellum');
    expect(PARTICLE_TYPES.VACUOLE).toBe('vacuole');
    expect(PARTICLE_TYPES.CRISPR_ARRAY).toBe('crispr-array');

    const bio = useBioStore.getState();
    bio.autoAssembleOptimalLuca();
    expect(useBioStore.getState().currentCellDesign.organelles.length).toBe(6);

    bio.spawnSpeciatedGuild();
    const agents = useBioStore.getState().agents;
    expect(agents.length).toBe(9);
    // Verify Phototrophs (2), Herbivores (0), and Apex Predators (1) all exist
    expect(agents.some((a) => a.genome.diet === 2)).toBe(true);
    expect(agents.some((a) => a.genome.diet === 0)).toBe(true);
    expect(agents.some((a) => a.genome.diet === 1)).toBe(true);
  });

  it('computes Stage 05 Cambrian Multicellular Morphogenesis metrics and vertebrate clade unlocks', () => {
    const ediacaran = computeMorphogenesisMetrics({
      symmetry: 'radial',
      germLayers: 'diploblast',
      skeleton: 'hydrostatic',
      sensory: 'eyespots',
      locomotion: 'cilia',
      segments: 4
    });
    expect(ediacaran.cladeId).toBe('ediacaran');

    const tetrapod = computeMorphogenesisMetrics({
      symmetry: 'bilateral',
      germLayers: 'triploblast',
      skeleton: 'endoskeleton',
      sensory: 'tripartite_brain',
      locomotion: 'pentadactyl_limbs',
      segments: 9
    });
    expect(tetrapod.cladeId).toBe('tetrapoda');
    expect(tetrapod.biomechanicalReadiness).toBeGreaterThan(ediacaran.biomechanicalReadiness);
    expect(tetrapod.encephalizationQuotient).toBeGreaterThan(ediacaran.encephalizationQuotient);
  });

  it('scales axial spinal load and myofascial strain across Planetary Gravity fields (0.38g Mars vs 2.53g Jupiter)', () => {
    const posture = { rightFootPronation: 0.35, pelvisTilt: -0.25, cervicalForwardHead: 0.03 };
    const marsStrain = KineticChainSolver.calculateMuscleStrains(posture, 0.38);
    const earthStrain = KineticChainSolver.calculateMuscleStrains(posture, 1.0);
    const jupiterStrain = KineticChainSolver.calculateMuscleStrains(posture, 2.53);

    expect(marsStrain.axialCompressionLoadN).toBeLessThan(earthStrain.axialCompressionLoadN);
    expect(jupiterStrain.axialCompressionLoadN).toBeGreaterThan(earthStrain.axialCompressionLoadN);
    expect(jupiterStrain.overactive.length).toBeGreaterThanOrEqual(marsStrain.overactive.length);
  });
});
