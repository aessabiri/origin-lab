import { PARTICLE_TYPES } from '../../constants/particles.js';

// Standard 64-Codon Genetic Code Dictionary
export const GENETIC_CODE = {
  // Phenylalanine & Leucine
  'UUU': { type: PARTICLE_TYPES.PHENYLALANINE, name: 'Phenylalanine', abbr: 'Phe', symbol: 'F', class: 'Hydrophobic' },
  'UUC': { type: PARTICLE_TYPES.PHENYLALANINE, name: 'Phenylalanine', abbr: 'Phe', symbol: 'F', class: 'Hydrophobic' },
  'UUA': { type: PARTICLE_TYPES.LEUCINE, name: 'Leucine', abbr: 'Leu', symbol: 'L', class: 'Hydrophobic' },
  'UUG': { type: PARTICLE_TYPES.LEUCINE, name: 'Leucine', abbr: 'Leu', symbol: 'L', class: 'Hydrophobic' },

  // Serine
  'UCU': { type: PARTICLE_TYPES.SERINE, name: 'Serine', abbr: 'Ser', symbol: 'S', class: 'Polar' },
  'UCC': { type: PARTICLE_TYPES.SERINE, name: 'Serine', abbr: 'Ser', symbol: 'S', class: 'Polar' },
  'UCA': { type: PARTICLE_TYPES.SERINE, name: 'Serine', abbr: 'Ser', symbol: 'S', class: 'Polar' },
  'UCG': { type: PARTICLE_TYPES.SERINE, name: 'Serine', abbr: 'Ser', symbol: 'S', class: 'Polar' },

  // Tyrosine & Stop
  'UAU': { type: PARTICLE_TYPES.TYROSINE, name: 'Tyrosine', abbr: 'Tyr', symbol: 'Y', class: 'Aromatic' },
  'UAC': { type: PARTICLE_TYPES.TYROSINE, name: 'Tyrosine', abbr: 'Tyr', symbol: 'Y', class: 'Aromatic' },
  'UAA': { type: 'STOP', name: 'Ochre (Stop)', abbr: 'STOP', symbol: '🛑', class: 'Termination' },
  'UAG': { type: 'STOP', name: 'Amber (Stop)', abbr: 'STOP', symbol: '🛑', class: 'Termination' },

  // Cysteine, Tryptophan & Stop
  'UGU': { type: PARTICLE_TYPES.CYSTEINE, name: 'Cysteine', abbr: 'Cys', symbol: 'C', class: 'Special' },
  'UGC': { type: PARTICLE_TYPES.CYSTEINE, name: 'Cysteine', abbr: 'Cys', symbol: 'C', class: 'Special' },
  'UGA': { type: 'STOP', name: 'Opal (Stop)', abbr: 'STOP', symbol: '🛑', class: 'Termination' },
  'UGG': { type: PARTICLE_TYPES.TRYPTOPHAN, name: 'Tryptophan', abbr: 'Trp', symbol: 'W', class: 'Aromatic' },

  // Leucine
  'CUU': { type: PARTICLE_TYPES.LEUCINE, name: 'Leucine', abbr: 'Leu', symbol: 'L', class: 'Hydrophobic' },
  'CUC': { type: PARTICLE_TYPES.LEUCINE, name: 'Leucine', abbr: 'Leu', symbol: 'L', class: 'Hydrophobic' },
  'CUA': { type: PARTICLE_TYPES.LEUCINE, name: 'Leucine', abbr: 'Leu', symbol: 'L', class: 'Hydrophobic' },
  'CUG': { type: PARTICLE_TYPES.LEUCINE, name: 'Leucine', abbr: 'Leu', symbol: 'L', class: 'Hydrophobic' },

  // Proline
  'CCU': { type: PARTICLE_TYPES.PROLINE, name: 'Proline', abbr: 'Pro', symbol: 'P', class: 'Special' },
  'CCC': { type: PARTICLE_TYPES.PROLINE, name: 'Proline', abbr: 'Pro', symbol: 'P', class: 'Special' },
  'CCA': { type: PARTICLE_TYPES.PROLINE, name: 'Proline', abbr: 'Pro', symbol: 'P', class: 'Special' },
  'CCG': { type: PARTICLE_TYPES.PROLINE, name: 'Proline', abbr: 'Pro', symbol: 'P', class: 'Special' },

  // Histidine & Glutamine
  'CAU': { type: PARTICLE_TYPES.HISTIDINE, name: 'Histidine', abbr: 'His', symbol: 'H', class: 'Basic' },
  'CAC': { type: PARTICLE_TYPES.HISTIDINE, name: 'Histidine', abbr: 'His', symbol: 'H', class: 'Basic' },
  'CAA': { type: PARTICLE_TYPES.GLUTAMINE, name: 'Glutamine', abbr: 'Gln', symbol: 'Q', class: 'Polar' },
  'CAG': { type: PARTICLE_TYPES.GLUTAMINE, name: 'Glutamine', abbr: 'Gln', symbol: 'Q', class: 'Polar' },

  // Arginine
  'CGU': { type: PARTICLE_TYPES.ARGININE, name: 'Arginine', abbr: 'Arg', symbol: 'R', class: 'Basic' },
  'CGC': { type: PARTICLE_TYPES.ARGININE, name: 'Arginine', abbr: 'Arg', symbol: 'R', class: 'Basic' },
  'CGA': { type: PARTICLE_TYPES.ARGININE, name: 'Arginine', abbr: 'Arg', symbol: 'R', class: 'Basic' },
  'CGG': { type: PARTICLE_TYPES.ARGININE, name: 'Arginine', abbr: 'Arg', symbol: 'R', class: 'Basic' },

  // Isoleucine & Methionine (Start)
  'AUU': { type: PARTICLE_TYPES.ISOLEUCINE, name: 'Isoleucine', abbr: 'Ile', symbol: 'I', class: 'Hydrophobic' },
  'AUC': { type: PARTICLE_TYPES.ISOLEUCINE, name: 'Isoleucine', abbr: 'Ile', symbol: 'I', class: 'Hydrophobic' },
  'AUA': { type: PARTICLE_TYPES.ISOLEUCINE, name: 'Isoleucine', abbr: 'Ile', symbol: 'I', class: 'Hydrophobic' },
  'AUG': { type: PARTICLE_TYPES.METHIONINE, name: 'Methionine (Start)', abbr: 'Met', symbol: 'M', class: 'Hydrophobic', isStart: true },

  // Threonine
  'ACU': { type: PARTICLE_TYPES.THREONINE, name: 'Threonine', abbr: 'Thr', symbol: 'T', class: 'Polar' },
  'ACC': { type: PARTICLE_TYPES.THREONINE, name: 'Threonine', abbr: 'Thr', symbol: 'T', class: 'Polar' },
  'ACA': { type: PARTICLE_TYPES.THREONINE, name: 'Threonine', abbr: 'Thr', symbol: 'T', class: 'Polar' },
  'ACG': { type: PARTICLE_TYPES.THREONINE, name: 'Threonine', abbr: 'Thr', symbol: 'T', class: 'Polar' },

  // Asparagine & Lysine
  'AAU': { type: PARTICLE_TYPES.ASPARAGINE, name: 'Asparagine', abbr: 'Asn', symbol: 'N', class: 'Polar' },
  'AAC': { type: PARTICLE_TYPES.ASPARAGINE, name: 'Asparagine', abbr: 'Asn', symbol: 'N', class: 'Polar' },
  'AAA': { type: PARTICLE_TYPES.LYSINE, name: 'Lysine', abbr: 'Lys', symbol: 'K', class: 'Basic' },
  'AAG': { type: PARTICLE_TYPES.LYSINE, name: 'Lysine', abbr: 'Lys', symbol: 'K', class: 'Basic' },

  // Serine & Arginine
  'AGU': { type: PARTICLE_TYPES.SERINE, name: 'Serine', abbr: 'Ser', symbol: 'S', class: 'Polar' },
  'AGC': { type: PARTICLE_TYPES.SERINE, name: 'Serine', abbr: 'Ser', symbol: 'S', class: 'Polar' },
  'AGA': { type: PARTICLE_TYPES.ARGININE, name: 'Arginine', abbr: 'Arg', symbol: 'R', class: 'Basic' },
  'AGG': { type: PARTICLE_TYPES.ARGININE, name: 'Arginine', abbr: 'Arg', symbol: 'R', class: 'Basic' },

  // Valine
  'GUU': { type: PARTICLE_TYPES.VALINE, name: 'Valine', abbr: 'Val', symbol: 'V', class: 'Hydrophobic' },
  'GUC': { type: PARTICLE_TYPES.VALINE, name: 'Valine', abbr: 'Val', symbol: 'V', class: 'Hydrophobic' },
  'GUA': { type: PARTICLE_TYPES.VALINE, name: 'Valine', abbr: 'Val', symbol: 'V', class: 'Hydrophobic' },
  'GUG': { type: PARTICLE_TYPES.VALINE, name: 'Valine', abbr: 'Val', symbol: 'V', class: 'Hydrophobic' },

  // Alanine
  'GCU': { type: PARTICLE_TYPES.ALANINE, name: 'Alanine', abbr: 'Ala', symbol: 'A', class: 'Hydrophobic' },
  'GCC': { type: PARTICLE_TYPES.ALANINE, name: 'Alanine', abbr: 'Ala', symbol: 'A', class: 'Hydrophobic' },
  'GCA': { type: PARTICLE_TYPES.ALANINE, name: 'Alanine', abbr: 'Ala', symbol: 'A', class: 'Hydrophobic' },
  'GCG': { type: PARTICLE_TYPES.ALANINE, name: 'Alanine', abbr: 'Ala', symbol: 'A', class: 'Hydrophobic' },

  // Aspartate & Glutamate
  'GAU': { type: PARTICLE_TYPES.ASPARTIC_ACID, name: 'Aspartate', abbr: 'Asp', symbol: 'D', class: 'Acidic' },
  'GAC': { type: PARTICLE_TYPES.ASPARTIC_ACID, name: 'Aspartate', abbr: 'Asp', symbol: 'D', class: 'Acidic' },
  'GAA': { type: PARTICLE_TYPES.GLUTAMIC_ACID, name: 'Glutamate', abbr: 'Glu', symbol: 'E', class: 'Acidic' },
  'GAG': { type: PARTICLE_TYPES.GLUTAMIC_ACID, name: 'Glutamate', abbr: 'Glu', symbol: 'E', class: 'Acidic' },

  // Glycine
  'GGU': { type: PARTICLE_TYPES.GLYCINE, name: 'Glycine', abbr: 'Gly', symbol: 'G', class: 'Hydrophobic' },
  'GGC': { type: PARTICLE_TYPES.GLYCINE, name: 'Glycine', abbr: 'Gly', symbol: 'G', class: 'Hydrophobic' },
  'GGA': { type: PARTICLE_TYPES.GLYCINE, name: 'Glycine', abbr: 'Gly', symbol: 'G', class: 'Hydrophobic' },
  'GGG': { type: PARTICLE_TYPES.GLYCINE, name: 'Glycine', abbr: 'Gly', symbol: 'G', class: 'Hydrophobic' },
};

// Transcribe 5'->3' DNA coding strand to mRNA (T -> U)
export const transcribeDNA = (dnaString) => {
  return dnaString
    .toUpperCase()
    .replace(/[^ATCGU]/g, '')
    .replace(/T/g, 'U');
};

// Translate mRNA string (e.g. 'AUGGCCUGU') to array of Amino Acid residues
export const translateMRNA = (mrnaString) => {
  const cleanRNA = mrnaString.toUpperCase().replace(/[^AUCG]/g, '');
  const codons = [];
  const residues = [];
  let stopEncountered = false;

  for (let i = 0; i < cleanRNA.length; i += 3) {
    if (i + 3 <= cleanRNA.length) {
      const triplet = cleanRNA.slice(i, i + 3);
      const aaEntry = GENETIC_CODE[triplet];
      codons.push({
        triplet,
        index: Math.floor(i / 3),
        entry: aaEntry,
      });

      if (aaEntry) {
        if (aaEntry.type === 'STOP') {
          stopEncountered = true;
        } else if (!stopEncountered) {
          residues.push({
            type: aaEntry.type,
            name: aaEntry.name,
            abbr: aaEntry.abbr,
            symbol: aaEntry.symbol,
            class: aaEntry.class,
            codon: triplet,
            id: `res-${i}-${Date.now()}`
          });
        }
      }
    }
  }

  const remainder = cleanRNA.slice(Math.floor(cleanRNA.length / 3) * 3);

  return {
    codons,
    residues,
    remainder,
    hasStop: stopEncountered,
    rawLength: cleanRNA.length,
  };
};

// Famous Preset Genetic Sequences (5' -> 3' coding DNA)
export const PRESET_GENOMES = [
  {
    id: 'insulin-chain-a',
    name: 'Insulin A-Chain Precursor',
    category: 'Hormone',
    description: 'Vital blood-glucose regulatory hormone maintaining cellular metabolic equilibrium.',
    dna: 'ATGGGCATCGTGGAGCAGTGCTGCACCAGCATCTGCAGCCTGTACCAGCTGGAGAACTACTGCAACTAG',
    expectedType: PARTICLE_TYPES.INSULIN_FRAGMENT,
  },
  {
    id: 'heme-pocket',
    name: 'Hemoglobin Oxygen-Pocket',
    category: 'Transport',
    description: 'High-affinity oxygen transport pocket containing coordinating histidines.',
    dna: 'ATGGTGCTGTCCCTGTTCGACAAGGTGAAGCACCTGAAGACCTAG',
    expectedType: PARTICLE_TYPES.HEMOGLOBIN_POCKET,
  },
  {
    id: 'collagen-triad',
    name: 'Collagen Triple Helix',
    category: 'Structural',
    description: 'Extracellular tensile matrix protein conferring structural rigidity to tissues.',
    dna: 'ATGGGTCCACCAGGTCCACCAGGTCCACCAGGTTAG',
  },
  {
    id: 'ubiquitin-core',
    name: 'Ubiquitin Tag',
    category: 'Regulatory',
    description: 'Cellular degradation signaling peptide targeting aberrant proteins for recycling.',
    dna: 'ATGATCCAGATCTTCGTGAAGACCCTGACCGGCAAGTAG',
  }
];
