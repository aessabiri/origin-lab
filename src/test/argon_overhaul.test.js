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
});
