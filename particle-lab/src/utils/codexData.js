import { CODEX_PARTICLES_BY_CATEGORY } from '../constants/particles';
import { CHEMICALS } from '../chemistry-lab/data/chemicals';
import { getMatterInfo } from '../constants/matterRegistry';

// Helper to check if an ID is a Particle/Atom defined in the Particle Lab
// const isParticleLabId = (id) => Object.values(PARTICLE_TYPES).includes(id);

// Cache for the expensive codex structure generation
let cachedCodexData = null;

export const getUniversalCodexData = () => {
  if (cachedCodexData) return cachedCodexData;

  // 1. Deep clone the constant to avoid mutation
  const groups = JSON.parse(JSON.stringify(CODEX_PARTICLES_BY_CATEGORY));
  
  // 2. We need to inject Chemistry items that might not be in the constant list
  // The MatterRegistry has everything, but CODEX_PARTICLES_BY_CATEGORY defines the *order* and *grouping*.
  // We'll stick to the existing strategy: Inject unknown chemicals into "Simple Molecules"
  // to preserve the handcrafted layout of the Codex.

  const existingIds = new Set();
  
  groups.forEach(group => {
    group.subcategories.forEach(sub => {
      sub.particles.forEach(pType => {
        existingIds.add(pType);
      });
    });
  });

  // 3. Inject Chemistry Lab Chemicals into "Molecular" -> "Simple Molecules"
  const molecularGroup = groups.find(g => g.name === 'Molecular');
  
  if (molecularGroup) {
      // Find or create 'Lab Chemicals' subcategory if we want separate, 
      // or just merge into 'Simple Molecules'
      let targetSub = molecularGroup.subcategories.find(s => s.name === 'Simple Molecules');
      
      // If for some reason it's missing (shouldn't be), fallback or create
      if (!targetSub) {
          targetSub = { name: 'Lab Chemicals', particles: [] };
          molecularGroup.subcategories.push(targetSub);
      }

      Object.keys(CHEMICALS).forEach(chemId => {
          // Skip if this chemical ID already exists in the Physics/Standard list
          if (existingIds.has(chemId)) return;
          
          // Explicitly skip iron/steel duplicates if they exist as atoms (Iron is in Atomic->Elements)
          if (chemId === 'iron' || chemId === 'steel') return;

          // Add to the list
          targetSub.particles.push(chemId);
      });
  }

  cachedCodexData = groups;
  return groups;
};

// Cache for item info to avoid re-spreading/creating objects constantly
// Note: MatterRegistry is already efficient, but caching at the component boundary (CodexItem) 
// is even better. We'll keep this simple alias for compatibility.
export const getUniversalItemInfo = (id) => {
  return getMatterInfo(id);
};
