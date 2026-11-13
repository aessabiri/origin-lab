import { describe, it, expect, beforeEach } from 'vitest';
import { useBioStore } from '../store.js';
import { useAnatomyStore } from '../../anatomy-lab/store.js';
import {
  TIER_1_ORGAN_SYSTEMS,
  TIER_2_TISSUE_SCAFFOLDS,
  TIER_3_CELL_LINEAGES,
  TIER_4_FOLDED_PROTEINS,
  TIER_5_DNA_GENES,
  evaluateOrganSystemChain
} from '../data/topDownBioHierarchy.js';

describe('Top-Down Biological Precision Hierarchy (Tier 1 Macro-Organs -> Tier 5 DNA Codons)', () => {
  beforeEach(() => {
    useBioStore.getState().resetSimulation();
    useAnatomyStore.getState().resetSkeleton();
  });

  it('defines all 5 tiers from Macro-Organs down to DNA coding sequences', () => {
    expect(TIER_1_ORGAN_SYSTEMS).toHaveLength(5);
    expect(Object.keys(TIER_2_TISSUE_SCAFFOLDS)).toHaveLength(5);
    expect(Object.keys(TIER_3_CELL_LINEAGES)).toHaveLength(5);
    expect(Object.keys(TIER_4_FOLDED_PROTEINS)).toHaveLength(5);
    expect(TIER_5_DNA_GENES).toHaveLength(5);
  });

  it('progressively resolves dependencies from Tier 5 DNA up to Tier 1 Macro-Organs', () => {
    const store = useBioStore.getState();

    // Initially 0% readiness for skeletal_system
    let evalResult = evaluateOrganSystemChain(
      'skeletal_system',
      useBioStore.getState(),
      useAnatomyStore.getState()
    );
    expect(evalResult.readinessPercent).toBe(0);
    expect(evalResult.missingProteins).toContain('collagen_i');
    expect(evalResult.missingCells).toContain('osteoblast');

    // Step 5 (Bottom): Equip organelles & transcribe COL1A1 + ATP5F1A genes
    store.autoAssembleOptimalLuca();
    store.transcribeAndTranslateGene('col1a1');
    store.transcribeAndTranslateGene('atp5f1a');
    expect(useBioStore.getState().transcribedGenes).toEqual(
      expect.arrayContaining(['col1a1', 'atp5f1a'])
    );

    // Step 4: Fold Type-I Collagen & ATP Synthase in 3D
    store.foldTopDownProtein('collagen_i');
    store.foldTopDownProtein('atp_synthase');
    expect(useBioStore.getState().foldedProteins).toEqual(
      expect.arrayContaining(['collagen_i', 'atp_synthase'])
    );

    // Step 3: Differentiate Osteoblast via BMP4/Runx2 morphogen gradient
    store.differentiateCellLineage('osteoblast');
    expect(useBioStore.getState().differentiatedCells).toContain('osteoblast');

    // Step 2: Bio-print Mineralized Osteoid ECM Scaffold
    store.bioprintTissueScaffold('osteoid');
    expect(useBioStore.getState().engineeredTissues).toContain('osteoid');

    // Step 1 (Top): Deploy to 3D Anatomy Rig
    useAnatomyStore.getState().synthesizeBioTissue('osteoid');
    evalResult = evaluateOrganSystemChain(
      'skeletal_system',
      useBioStore.getState(),
      useAnatomyStore.getState()
    );
    expect(evalResult.readinessPercent).toBe(100);
    expect(evalResult.deployedIn3D).toBe(true);
  });

  it('supports full-chain synthesis for any of the 5 macro-organ systems (e.g. cardiovascular_system)', () => {
    const anatomyTissueId = useBioStore
      .getState()
      .synthesizeFullOrganChain('cardiovascular_system');
    expect(anatomyTissueId).toBe('endothelial');

    useAnatomyStore.getState().synthesizeBioTissue(anatomyTissueId);
    const evalResult = evaluateOrganSystemChain(
      'cardiovascular_system',
      useBioStore.getState(),
      useAnatomyStore.getState()
    );
    expect(evalResult.readinessPercent).toBe(100);
    expect(evalResult.tissueReady).toBe(true);
    expect(evalResult.deployedIn3D).toBe(true);
  });
});
