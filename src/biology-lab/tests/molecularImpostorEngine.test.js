import { describe, it, expect } from 'vitest';
import {
  computeAtomOcclusion,
  createAtomImpostorMesh,
  buildRealisticBDNA,
  buildRealisticMacromolecule,
  getSubIngredientSpec,
  buildSubIngredientsPreviewGroup,
  updateImpostorUniforms,
} from '../utils/molecularImpostorEngine';
import { LEVEL_1_MACROMOLECULES } from '../data/topDownBioHierarchy';

describe('molecularImpostorEngine', () => {
  it('computes lower ambient occlusion for buried atoms than exposed atoms', () => {
    const atoms = [
      { x: 0, y: 0, z: 0, r: 0.05 }, // buried center
      { x: 0.1, y: 0, z: 0, r: 0.05 },
      { x: -0.1, y: 0, z: 0, r: 0.05 },
      { x: 0, y: 0.1, z: 0, r: 0.05 },
      { x: 0, y: -0.1, z: 0, r: 0.05 },
      { x: 2.0, y: 0, z: 0, r: 0.05 }, // isolated exposed atom
    ];
    const occ = computeAtomOcclusion(atoms, 0.3);
    expect(occ[0]).toBeGreaterThanOrEqual(0.22);
    expect(occ[0]).toBeLessThan(occ[5]);
    expect(occ[5]).toBe(1.0);
  });

  it('creates a single-draw-call InstancedBufferGeometry atom impostor mesh', () => {
    const atoms = [
      { x: 0, y: 0, z: 0, r: 0.1, color: '#38bdf8', emissive: 0.2 },
      { x: 0.2, y: 0.1, z: 0, r: 0.08, color: '#ef4444' },
    ];
    const mesh = createAtomImpostorMesh(atoms, { styleMode: 0 });
    expect(mesh.geometry.instanceCount).toBe(2);
    expect(mesh.geometry.getAttribute('aOffset')).toBeDefined();
    expect(mesh.geometry.getAttribute('aRadius')).toBeDefined();
    expect(mesh.geometry.getAttribute('aColor')).toBeDefined();
    expect(mesh.geometry.getAttribute('aOcclusion')).toBeDefined();
    expect(mesh.geometry.getAttribute('aEmissive')).toBeDefined();
    expect(mesh.material.uniforms.uStyleMode.value).toBe(0);

    updateImpostorUniforms(mesh, { time: 1.5, styleMode: 1 });
    expect(mesh.material.uniforms.uTime.value).toBe(1.5);
    expect(mesh.material.uniforms.uStyleMode.value).toBe(1);
    mesh.geometry.dispose();
    mesh.material.dispose();
  });

  it('builds a dense realistic B-DNA double helix with hundreds of atoms', () => {
    const dna = buildRealisticBDNA({ basePairs: 24, styleMode: 0 });
    expect(dna.userData.atomCount).toBeGreaterThan(250);
    expect(dna.children.length).toBeGreaterThanOrEqual(1);
  });

  it('builds realistic 3D impostor models for all 7 LEVEL_1_MACROMOLECULES', () => {
    const ids = Object.keys(LEVEL_1_MACROMOLECULES);
    expect(ids.length).toBe(7);
    ids.forEach((id) => {
      const group = buildRealisticMacromolecule(id, { styleMode: 0 });
      expect(group.userData.atomCount).toBeGreaterThan(40);
      group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
    });
  });

  it('builds chemically distinct CPK 3D geometries for sub-ingredients', () => {
    const phos = getSubIngredientSpec('phosphoric-acid');
    const adenine = getSubIngredientSpec('adenine');
    const fatty = getSubIngredientSpec('fatty-acid');
    const iron = getSubIngredientSpec('iron');

    expect(phos.atoms.length).toBe(5); // Tetrahedral PO4
    expect(adenine.atoms.length).toBeGreaterThan(phos.atoms.length); // Bicyclic purine (9 heavy atoms)
    expect(fatty.atoms.length).toBeGreaterThan(phos.atoms.length); // 8-C chain + COOH (9 heavy atoms)
    expect(iron.atoms.length).toBe(1); // Single Fe2+ ion
    expect(adenine.bonds.length).toBeGreaterThan(fatty.bonds.length); // Bicyclic ring has more bonds than linear chain

    const group = buildSubIngredientsPreviewGroup(
      ['phosphoric-acid', 'adenine', 'fatty-acid', 'iron'],
      { styleMode: 0 }
    );
    expect(group.userData.atomCount).toBe(
      phos.atoms.length + adenine.atoms.length + fatty.atoms.length + iron.atoms.length
    );
    expect(group.children.length).toBeGreaterThanOrEqual(2); // Atom impostor + bond cylinder mesh
    group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  });
});
