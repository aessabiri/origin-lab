import { ALL_206_BONES } from '../data/humanSkeletalDatabase';

const BONE_MAP = new Map(ALL_206_BONES.map((b) => [b.id, b]));

const CODON_TABLE = [
  'GCA', 'GCC', 'GCG', 'GCT',
  'TTC', 'TTT', 'TTA', 'TTG',
  'CGA', 'CGC', 'CGG', 'CGT',
  'AAC', 'AAT', 'AAG', 'AAA'
];

/**
 * Compiles the 3D Anatomy Lab state (206 bones + postural biomechanics)
 * into a deterministic Genomic Blueprint for the Biology & Planetary Labs.
 */
export function compileAnatomyToGenome(
  assembledBones = [],
  postureParams = {},
  muscleStrainMap = {}
) {
  const uniqueIds = Array.from(new Set(assembledBones));
  const boneCount = Math.min(206, uniqueIds.length);

  let axialCount = 0;
  let appendicularCount = 0;
  uniqueIds.forEach((item) => {
    const id = typeof item === 'string' ? item : item?.id;
    const bone = BONE_MAP.get(id);
    if (bone && bone.region === 'axial') {
      axialCount++;
    } else if (bone) {
      appendicularCount++;
    }
  });

  const skeletalCompletionPct = Math.round((boneCount / 206) * 100);

  // Evaluate postural biomechanical deviation from neutral equilibrium
  const arch = Math.abs(postureParams.archCollapse || 0);
  const pelvic = Math.abs(postureParams.pelvicTilt || 0) / 25;
  const kyphosis = Math.abs(postureParams.thoracicKyphosis || 0) / 40;
  const fhp = Math.abs(postureParams.forwardHead || 0) / 5;
  const valgus = Math.abs(postureParams.kneeValgus || 0) / 20;

  const avgStrain =
    Object.values(muscleStrainMap || {}).reduce((acc, v) => acc + (Number(v) || 0), 0) /
    Math.max(1, Object.keys(muscleStrainMap || {}).length);

  const rawDeviation = (arch + pelvic + kyphosis + fhp + valgus) / 5 + avgStrain * 0.35;
  const posturalHarmonyScore = Math.max(20, Math.min(100, Math.round((1 - rawDeviation * 0.5) * 100)));

  // Overall genomic integrity combines skeletal assembly & biomechanical alignment
  const integrityScore = Math.max(
    15,
    Math.min(100, Math.round(skeletalCompletionPct * 0.65 + posturalHarmonyScore * 0.35))
  );

  // Biological trait bonuses unlocked for CellBuilder & IncubationChamber
  const metabolismBonus = Math.round(15 + (appendicularCount / 126) * 55 + (posturalHarmonyScore / 100) * 20);
  const stabilityBonus = Math.round(20 + (axialCount / 80) * 65 + (posturalHarmonyScore / 100) * 25);
  const speedMultiplier = Number((1.05 + (appendicularCount / 126) * 0.55 + (posturalHarmonyScore / 100) * 0.25).toFixed(2));

  // Classify morphotype tier
  let morphotypeClass = 'Proto-Chemotrophic Vesicle';
  if (boneCount >= 206 && posturalHarmonyScore >= 85) {
    morphotypeClass = 'Apex Bilateral Sapiens (206/206 Aligned)';
  } else if (boneCount >= 140) {
    morphotypeClass = 'Endoskeletal Tetrapod Lineage';
  } else if (axialCount >= 40 || boneCount >= 60) {
    morphotypeClass = 'Vertebrate Chordate Notochord';
  } else if (boneCount >= 10) {
    morphotypeClass = 'Calcified Bilateral Metazoan';
  }

  // Deterministic DNA codon signature
  const c1 = CODON_TABLE[axialCount % 16];
  const c2 = CODON_TABLE[appendicularCount % 16];
  const c3 = CODON_TABLE[posturalHarmonyScore % 16];
  const c4 = CODON_TABLE[integrityScore % 16];
  const codonSignature = `ATG-${c1}-${c2}-${c3}-${c4}-TAA`;

  return {
    boneCount,
    axialCount,
    appendicularCount,
    skeletalCompletionPct,
    posturalHarmonyScore,
    integrityScore,
    metabolismBonus,
    stabilityBonus,
    speedMultiplier,
    morphotypeClass,
    codonSignature,
    compiledAt: Date.now()
  };
}
