
/**
 * Generates a unique canonical string signature for a molecule graph.
 * This allows us to check if two molecules have the same structure (topology),
 * even if they are drawn differently or have different IDs.
 * 
 * Implements a simplified "Canonical Labeling" algorithm (similar to Morgan's Algorithm).
 * 
 * @param {Array<{id: string, type: string}>} nodes - List of particles
 * @param {Array<{source: string, target: string, type: string}>} edges - List of bonds. Can use source/target or particleA_id/particleB_id
 * @returns {string} A unique hash string for this molecular structure.
 */
export const generateGraphSignature = (nodes, edges) => {
  const adj = new Map();
  nodes.forEach(n => adj.set(n.id, []));

  edges.forEach(edge => {
    // normalized logic to handle different object shapes (recipe definition vs actual game state)
    const u = edge.source || edge.particleA_id || edge.from;
    const v = edge.target || edge.particleB_id || edge.to;
    const type = edge.type || 'single';

    if (adj.has(u) && adj.has(v)) {
      adj.get(u).push({ neighborId: v, type });
      adj.get(v).push({ neighborId: u, type });
    }
  });

  // 1. Initialize labels with Atom Type
  let labels = new Map();
  nodes.forEach(n => labels.set(n.id, n.type));

  // 2. Iterative Refinement
  // Propagate information about neighbors to refine the labels.
  // 4 iterations is generally enough for small-to-medium organic molecules to distinct isomers.
  const ITERATIONS = 4;

  for (let k = 0; k < ITERATIONS; k++) {
    const nextLabels = new Map();
    nodes.forEach(n => {
      const neighbors = adj.get(n.id) || [];
      const currentLabel = labels.get(n.id);
      
      const neighborSignatures = neighbors.map(neighbor => {
        const bondWeight = neighbor.type === 'double' ? '=' : (neighbor.type === 'peptide' ? '~' : '-');
        return bondWeight + labels.get(neighbor.neighborId);
      });
      
      // Sort neighbor signatures to ensure order doesn't matter (canonicalization)
      neighborSignatures.sort();
      
      // Update label: e.g., "C" becomes "C(-H,-H,=O)"
      nextLabels.set(n.id, currentLabel + '(' + neighborSignatures.join(',') + ')');
    });
    labels = nextLabels;
  }

  // 3. Final Signature
  // Sort all node labels to ensure the overall graph signature is independent of input order.
  const finalSignature = Array.from(labels.values()).sort().join('|');
  return finalSignature;
};
