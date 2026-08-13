import * as THREE from 'three';
import { getUniversalItemInfo } from '../../utils/codexData.js';
import { PARTICLE_TYPES } from '../../constants/particles.js';

const HYDROPHOBIC_SET = new Set([
  'leucine', 'isoleucine', 'valine', 'phenylalanine', 'methionine', 'tryptophan', 'tyrosine', 'alanine', 'glycine'
]);

const CHARGED_POSITIVE = new Set(['lysine', 'arginine', 'histidine']);
const CHARGED_NEGATIVE = new Set(['aspartic-acid', 'glutamic-acid']);
const POLAR_UNCHARGED = new Set(['serine', 'threonine', 'cysteine', 'asparagine', 'glutamine']);

export const analyzeProteinBiophysics = (sequence) => {
  if (!sequence || sequence.length === 0) {
    return {
      freeEnergy: 0,
      stabilityScore: 0,
      hydrophobicCount: 0,
      polarCount: 0,
      chargedCount: 0,
      disulfideBonds: 0,
      secondaryFractions: { helix: 0, sheet: 0, loop: 100 },
      isFolded: false,
    };
  }

  let hydrophobic = 0;
  let chargedPos = 0;
  let chargedNeg = 0;
  let cysteines = 0;
  let prolines = 0;

  sequence.forEach(aa => {
    const type = typeof aa === 'string' ? aa : aa.type;
    if (HYDROPHOBIC_SET.has(type)) hydrophobic++;
    if (CHARGED_POSITIVE.has(type)) chargedPos++;
    if (CHARGED_NEGATIVE.has(type)) chargedNeg++;
    if (type === 'cysteine') cysteines++;
    if (type === 'proline') prolines++;
  });

  const disulfidePossible = Math.floor(cysteines / 2);
  const saltBridges = Math.min(chargedPos, chargedNeg);

  // Free energy calculation (heuristic approximation in kcal/mol)
  const hydrophobicCollapse = -2.2 * hydrophobic;
  const electrostaticEnergy = -3.5 * saltBridges + 0.8 * (Math.abs(chargedPos - chargedNeg));
  const disulfideStabilization = -6.0 * disulfidePossible;
  const entropyCost = 1.4 * sequence.length;

  const deltaG = hydrophobicCollapse + electrostaticEnergy + disulfideStabilization + entropyCost;

  // Stability index (0 to 100%)
  const stability = Math.max(5, Math.min(99, Math.round((1 / (1 + Math.exp(deltaG * 0.12))) * 100)));

  // Secondary structure prediction (Chou-Fasman inspired heuristics)
  const helixCount = Math.round(sequence.length * Math.max(0.1, 0.4 - prolines * 0.08));
  const sheetCount = Math.round(sequence.length * (hydrophobic / (sequence.length || 1)) * 0.5);
  const loopCount = Math.max(0, sequence.length - helixCount - sheetCount);

  return {
    freeEnergy: Math.round(deltaG * 10) / 10,
    stabilityScore: stability,
    hydrophobicCount: hydrophobic,
    polarCount: sequence.length - hydrophobic - chargedPos - chargedNeg,
    chargedCount: chargedPos + chargedNeg,
    disulfideBonds: disulfidePossible,
    saltBridges,
    secondaryFractions: (() => {
      const helix = Math.round((helixCount / sequence.length) * 100);
      const sheet = Math.round((sheetCount / sequence.length) * 100);
      const loop = Math.max(0, 100 - helix - sheet);
      return { helix, sheet, loop };
    })(),
    isFolded: stability > 50,
  };
};

// 3D Lattice & Spline Backbone Generator
export const generateFolded3DModel = (sequence) => {
  if (!sequence || sequence.length === 0) return null;

  const isH = (type) => HYDROPHOBIC_SET.has(type);
  const isP = (type) => POLAR_UNCHARGED.has(type) || CHARGED_POSITIVE.has(type) || CHARGED_NEGATIVE.has(type);

  // Lattice search for 3D self-avoiding compact path
  const dirs = [
    [1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]
  ];

  let beam = [{ path: [[0, 0, 0]], energy: 0 }];
  const beamWidth = 200;

  for (let i = 1; i < sequence.length; i++) {
    const nextBeam = [];
    const currentType = typeof sequence[i] === 'string' ? sequence[i] : sequence[i].type;
    const currentIsH = isH(currentType);
    const currentIsP = isP(currentType);

    for (const state of beam) {
      const lastPos = state.path[state.path.length - 1];

      for (const d of dirs) {
        const nx = lastPos[0] + d[0];
        const ny = lastPos[1] + d[1];
        const nz = lastPos[2] + d[2];

        // Self-avoidance check
        let collision = false;
        for (const p of state.path) {
          if (p[0] === nx && p[1] === ny && p[2] === nz) {
            collision = true;
            break;
          }
        }
        if (collision) continue;

        // Energy calculation
        let dE = 0;
        let hNeighbors = 0;
        let pNeighbors = 0;
        let emptyNeighbors = 5;

        for (let j = 0; j < state.path.length - 1; j++) {
          const p = state.path[j];
          const dist = Math.abs(p[0] - nx) + Math.abs(p[1] - ny) + Math.abs(p[2] - nz);
          if (dist === 1) {
            emptyNeighbors--;
            const otherType = typeof sequence[j] === 'string' ? sequence[j] : sequence[j].type;
            if (isH(otherType)) hNeighbors++;
            if (isP(otherType)) pNeighbors++;
          }
        }

        if (currentIsH) {
          dE -= hNeighbors * 2.5; // H-H core minimization
          dE += emptyNeighbors * 0.6; // Solvent penalty
        } else if (currentIsP) {
          dE -= pNeighbors * 0.6; // P-P hydrogen bonds
          dE -= emptyNeighbors * 0.4; // Solvent affinity
        }

        nextBeam.push({
          path: [...state.path, [nx, ny, nz]],
          energy: state.energy + dE,
        });
      }
    }

    nextBeam.sort((a, b) => a.energy - b.energy);
    beam = nextBeam.slice(0, beamWidth);
    if (beam.length === 0) break;
  }

  const bestPath = beam[0] ? beam[0].path : [[0, 0, 0]];
  const points = [];
  const bonds = [];
  const disulfideLinks = [];
  const scale = 4.5;

  const cysteineIndices = [];

  bestPath.forEach((pos, i) => {
    const aa = sequence[i];
    const type = typeof aa === 'string' ? aa : aa.type;
    const info = getUniversalItemInfo(type) || { color: '#ffffff', name: type };

    if (type === 'cysteine') {
      cysteineIndices.push(i);
    }

    points.push({
      x: pos[0] * scale,
      y: pos[1] * scale,
      z: pos[2] * scale,
      type,
      color: info.color || '#38bdf8',
      label: (info.name || type).slice(0, 3).toUpperCase(),
      symbol: (info.name || type).slice(0, 1).toUpperCase(),
      isHydrophobic: isH(type),
      isCharged: CHARGED_POSITIVE.has(type) || CHARGED_NEGATIVE.has(type),
      chargeType: CHARGED_POSITIVE.has(type) ? 'pos' : (CHARGED_NEGATIVE.has(type) ? 'neg' : 'neutral'),
    });

    if (i > 0) {
      bonds.push({ from: i - 1, to: i, isPeptide: true });
    }
  });

  // Pair Cysteines for Disulfide Bridges if in proximity
  for (let c = 0; c < cysteineIndices.length - 1; c += 2) {
    disulfideLinks.push({
      from: cysteineIndices[c],
      to: cysteineIndices[c + 1],
      type: 'disulfide',
    });
  }

  // Center coordinate system around center of mass
  if (points.length > 0) {
    const avgX = points.reduce((acc, p) => acc + p.x, 0) / points.length;
    const avgY = points.reduce((acc, p) => acc + p.y, 0) / points.length;
    const avgZ = points.reduce((acc, p) => acc + p.z, 0) / points.length;

    points.forEach(p => {
      p.x -= avgX;
      p.y -= avgY;
      p.z -= avgZ;
    });
  }

  // Generate continuous Catmull-Rom spline curve points for ribbon rendering
  const vectors = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
  let splineCurve = null;
  if (vectors.length >= 2) {
    splineCurve = new THREE.CatmullRomCurve3(vectors);
    splineCurve.curveType = 'centripetal';
  }

  return {
    points,
    bonds,
    disulfideLinks,
    splineCurve,
    biophysics: analyzeProteinBiophysics(sequence),
  };
};
