import { PARTICLE_TYPES } from '../particles';

const {
  DNA, RNA, ATP, GLUCOSE, AMINO_ACID, PROTEIN, LIPID, PHOSPHOLIPID,
  MEMBRANE, RIBOSOME, MITOCHONDRION, NUCLEUS,
  POLYMERASE, LIPASE
} = PARTICLE_TYPES;

export const BIOLOGICAL_MATTER = {
  [MEMBRANE]: { parents: [PHOSPHOLIPID, PROTEIN] },
  [RIBOSOME]: { parents: [RNA, PROTEIN] },
  [MITOCHONDRION]: { parents: [MEMBRANE, ATP, DNA] },
  [NUCLEUS]: { parents: [MEMBRANE, DNA, PROTEIN] },
  [POLYMERASE]: { parents: [PROTEIN, ATP] }, // Biological Catalyst
  [LIPASE]: { parents: [PROTEIN, WATER] }, // Biological Catalyst
};
