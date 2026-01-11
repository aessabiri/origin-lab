import { describe, it, expect } from 'vitest';
import { generateGraphSignature } from '../utils/chemistryStructure';
import { PARTICLE_TYPES } from '../constants/particles';

describe('Molecular Structure Logic (Isomerism)', () => {
  
  // Helper to create simple linear chains or rings
  // Note: These are simplified graphs for testing the algorithm, not chemically perfect
  
  it('should generate identical signatures for isomorphic graphs (order independence)', () => {
    // Ethanol: C-C-O
    const nodes1 = [
        { id: '1', type: 'C' }, { id: '2', type: 'C' }, { id: '3', type: 'O' }
    ];
    const edges1 = [
        { source: '1', target: '2', type: 'single' },
        { source: '2', target: '3', type: 'single' }
    ];

    // Same Ethanol, different IDs/order: O-C-C
    const nodes2 = [
        { id: 'a', type: 'O' }, { id: 'b', type: 'C' }, { id: 'c', type: 'C' }
    ];
    const edges2 = [
        { source: 'a', target: 'b', type: 'single' },
        { source: 'b', target: 'c', type: 'single' }
    ];

    const sig1 = generateGraphSignature(nodes1, edges1);
    const sig2 = generateGraphSignature(nodes2, edges2);

    expect(sig1).toBe(sig2);
  });

  it('should distinguish between structural isomers (Glucose vs Fructose)', () => {
    // Simplified Isomer test: 
    // Isomer A: Linear C-C-C-O (Propanol-like)
    // Isomer B: Branched C-C(-O)-C (Isopropanol-like)
    // Both are C3 H8 O1 (ignoring H for graph simplicity here)

    const atoms = ['C', 'C', 'C', 'O'];
    
    // Linear: C1-C2-C3-O4
    const nodesA = atoms.map((type, i) => ({ id: `${i}`, type }));
    const edgesA = [
        { source: '0', target: '1', type: 'single' },
        { source: '1', target: '2', type: 'single' },
        { source: '2', target: '3', type: 'single' },
    ];

    // Branched: C1-C2(O4)-C3
    const nodesB = atoms.map((type, i) => ({ id: `${i}`, type }));
    const edgesB = [
        { source: '0', target: '1', type: 'single' }, // C-C
        { source: '1', target: '2', type: 'single' }, // C-C
        { source: '1', target: '3', type: 'single' }, // C-O (branch on middle C)
    ];

    const sigA = generateGraphSignature(nodesA, edgesA);
    const sigB = generateGraphSignature(nodesB, edgesB);

    expect(sigA).not.toBe(sigB);
  });

  it('should distinguish double bonds from single bonds', () => {
    // C-C
    const nodes = [{ id: '1', type: 'C' }, { id: '2', type: 'C' }];
    
    const edgesSingle = [{ source: '1', target: '2', type: 'single' }];
    const edgesDouble = [{ source: '1', target: '2', type: 'double' }];

    const sigSingle = generateGraphSignature(nodes, edgesSingle);
    const sigDouble = generateGraphSignature(nodes, edgesDouble);

    expect(sigSingle).not.toBe(sigDouble);
  });

  it('should distinguish triple bonds from double bonds', () => {
    // C-C
    const nodes = [{ id: '1', type: 'C' }, { id: '2', type: 'C' }];
    
    const edgesDouble = [{ source: '1', target: '2', type: 'double' }];
    const edgesTriple = [{ source: '1', target: '2', type: 'triple' }];

    const sigDouble = generateGraphSignature(nodes, edgesDouble);
    const sigTriple = generateGraphSignature(nodes, edgesTriple);

    expect(sigDouble).not.toBe(sigTriple);
  });
});
