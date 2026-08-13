import { describe, it, expect } from 'vitest';
import { transcribeDNA, translateMRNA, GENETIC_CODE, PRESET_GENOMES } from '../utils/geneticCode.js';
import { analyzeProteinBiophysics, generateFolded3DModel } from '../utils/biophysicsFolding.js';

describe('Genetic Code & DNA-to-Protein Translation', () => {
  it('should accurately transcribe 5\'->3\' coding DNA to mRNA (T -> U substitution)', () => {
    const dna = 'ATGGCCUAG';
    const mrna = transcribeDNA(dna);
    expect(mrna).toBe('AUGGCCUAG');
  });

  it('should translate mRNA codons to standard amino acid residues', () => {
    const mrna = 'AUGGCUUGUUAA';
    const result = translateMRNA(mrna);
    
    expect(result.codons).toHaveLength(4);
    expect(result.codons[0].triplet).toBe('AUG');
    expect(result.codons[0].entry.name).toContain('Methionine');
    expect(result.codons[1].triplet).toBe('GCU');
    expect(result.codons[1].entry.name).toBe('Alanine');
    expect(result.codons[2].triplet).toBe('UGU');
    expect(result.codons[2].entry.name).toBe('Cysteine');
    expect(result.codons[3].triplet).toBe('UAA');
    expect(result.codons[3].entry.type).toBe('STOP');

    // Residues list terminates before stop codon
    expect(result.residues).toHaveLength(3);
    expect(result.hasStop).toBe(true);
  });

  it('should detect frameshifts and remaining trailing bases', () => {
    const mrna = 'AUGG'; // 4 bases
    const result = translateMRNA(mrna);
    expect(result.codons).toHaveLength(1);
    expect(result.remainder).toBe('G');
  });

  it('should load preset genomes successfully', () => {
    expect(PRESET_GENOMES.length).toBeGreaterThan(2);
    const insulin = PRESET_GENOMES.find(p => p.id === 'insulin-chain-a');
    expect(insulin).toBeDefined();
    const mrna = transcribeDNA(insulin.dna);
    const translation = translateMRNA(mrna);
    expect(translation.residues.length).toBeGreaterThan(5);
  });
});

describe('Protein Biophysics & 3D Folding Simulation', () => {
  it('should compute thermodynamic stability, free energy, and secondary structure fractions', () => {
    const sequence = [
      { type: 'methionine' },
      { type: 'leucine' },
      { type: 'valine' },
      { type: 'cysteine' },
      { type: 'cysteine' },
      { type: 'lysine' },
      { type: 'glutamic-acid' }
    ];

    const stats = analyzeProteinBiophysics(sequence);
    expect(stats.hydrophobicCount).toBe(3); // met, leu, val
    expect(stats.disulfideBonds).toBe(1); // 2 cysteines = 1 pair
    expect(stats.stabilityScore).toBeGreaterThan(0);
    expect(stats.stabilityScore).toBeLessThanOrEqual(100);
    expect(stats.secondaryFractions.helix + stats.secondaryFractions.sheet + stats.secondaryFractions.loop).toBe(100);
  });

  it('should generate valid 3D lattice points, bonds, and disulfide links', () => {
    const sequence = [
      { type: 'valine' },
      { type: 'cysteine' },
      { type: 'leucine' },
      { type: 'cysteine' }
    ];

    const model = generateFolded3DModel(sequence);
    expect(model).toBeDefined();
    expect(model.points).toHaveLength(4);
    expect(model.bonds).toHaveLength(3);
    expect(model.disulfideLinks).toHaveLength(1);
    expect(model.splineCurve).toBeDefined();
  });
});
