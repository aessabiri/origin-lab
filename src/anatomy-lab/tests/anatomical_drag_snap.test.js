import { describe, it, expect, beforeEach } from 'vitest';
import { useAnatomyStore } from '../store';

describe('Anatomy Lab Positional Drag-and-Snap Validation', () => {
  beforeEach(() => {
    useAnatomyStore.getState().resetSkeleton();
  });

  it('fabricates organs in Bio Lab without auto-snapping them onto the body', () => {
    const store = useAnatomyStore.getState();
    store.fabricateOrganForAnatomy('endothelial');

    const next = useAnatomyStore.getState();
    expect(next.fabricatedOrgans.endothelial).toBe(true);
    expect(next.bioprintedTissues.endothelial).toBe(false);
  });

  it('rejects an organ dropped in the wrong anatomical zone and snaps when dropped in the correct zone', () => {
    const store = useAnatomyStore.getState();
    store.fabricateOrganForAnatomy('endothelial');

    // Drop Heart in the Lower Limb (wrong)
    const badDrop = store.attemptAnatomicalSnap('organ', 'endothelial', { x: 0, y: -0.7, z: 0 });
    expect(badDrop.snapped).toBe(false);
    expect(useAnatomyStore.getState().bioprintedTissues.endothelial).toBe(false);

    // Drop Heart in the Thorax (correct)
    const goodDrop = store.attemptAnatomicalSnap('organ', 'endothelial', { x: 0, y: 0.34, z: 0 });
    expect(goodDrop.snapped).toBe(true);
    expect(useAnatomyStore.getState().bioprintedTissues.endothelial).toBe(true);
  });

  it('only snaps individual bones when dropped in their matching anatomical region', () => {
    const store = useAnatomyStore.getState();

    // Drop Femur on the Cranium (wrong)
    const badBone = store.attemptAnatomicalSnap('bone', 'femur_r', { x: 0, y: 0.8, z: 0 }, 'Lower Limb');
    expect(badBone.snapped).toBe(false);
    expect(useAnatomyStore.getState().assembledBones).not.toContain('femur_r');

    // Drop Femur in the Lower Limb (correct)
    const goodBone = store.attemptAnatomicalSnap('bone', 'femur_r', { x: 0, y: -0.5, z: 0 }, 'Lower Limb');
    expect(goodBone.snapped).toBe(true);
    expect(useAnatomyStore.getState().assembledBones).toContain('femur_r');
  });
});
