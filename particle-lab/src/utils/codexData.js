import { PARTICLE_TYPES, PARTICLE_INFO, CODEX_PARTICLES_BY_CATEGORY, PARTICLE_COLORS } from '../constants/particles';
import { CHEMICALS } from '../chemistry-lab/data/chemicals';

// Helper to check if an ID is a Particle/Atom defined in the Particle Lab
const isParticleLabId = (id) => Object.values(PARTICLE_TYPES).includes(id);

export const getUniversalCodexData = () => {
  // 1. Deep clone the constant to avoid mutation
  const groups = JSON.parse(JSON.stringify(CODEX_PARTICLES_BY_CATEGORY));
  
  // 2. Build a set of existing names and IDs to prevent duplicates
  // We need to traverse: Group -> Subcategory -> Particles
  const existingNames = new Set();
  const existingIds = new Set();
  
  groups.forEach(group => {
    group.subcategories.forEach(sub => {
      sub.particles.forEach(pType => {
        existingIds.add(pType);
        const info = PARTICLE_INFO[pType];
        if (info) existingNames.add(info.name.toLowerCase());
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

      Object.values(CHEMICALS).forEach(chem => {
          // Skip if this chemical ID or name already exists in the Physics/Standard list
          if (existingIds.has(chem.id) || existingNames.has(chem.name.toLowerCase())) return;
          
          // Explicitly skip iron/steel duplicates if they exist as atoms (Iron is in Atomic->Elements)
          if (chem.id === 'iron' || chem.id === 'steel') return;

          // Add to the list
          targetSub.particles.push(chem.id);
      });
  }

  return groups;
};

// Unified Info Getter
export const getUniversalItemInfo = (id) => {
  // 1. Try Particle Lab Info
  if (PARTICLE_INFO[id]) {
    return {
      ...PARTICLE_INFO[id],
      color: PARTICLE_COLORS[id] || 'bg-gray-500',
      source: 'Physics'
    };
  }

  // 2. Try Chemistry Lab Info
  if (CHEMICALS[id]) {
    const chem = CHEMICALS[id];
    return {
      name: chem.name,
      category: 'Chemical',
      description: chem.description,
      mass: chem.formula, // Using formula as mass/comp equivalent for display
      charge: `pH ${chem.ph}`,
      color: chem.color, // These are hex codes, might need handling
      source: 'Chemistry',
      isChemical: true // Flag for the renderer
    };
  }

  return {
    name: 'Unknown',
    description: 'No data available.',
    color: 'bg-gray-800'
  };
};
