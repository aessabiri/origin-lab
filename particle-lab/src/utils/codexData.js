import { PARTICLE_TYPES, PARTICLE_INFO, CODEX_PARTICLES_BY_CATEGORY, PARTICLE_COLORS } from '../constants/particles';
import { CHEMICALS } from '../chemistry-lab/data/chemicals';

// Helper to check if an ID is a Particle/Atom defined in the Particle Lab
const isParticleLabId = (id) => Object.values(PARTICLE_TYPES).includes(id);

export const getUniversalCodexData = () => {
  // 1. Start with the existing Particle Lab categories (Physics)
  // We clone it to avoid mutating the original constant and add Domain tags
  const rawCategories = JSON.parse(JSON.stringify(CODEX_PARTICLES_BY_CATEGORY));
  
  const bioCategories = ['Organelles', 'Lipids', 'Nucleotides', 'Amino Acids & Polypeptides', 'Nucleic Acids'];

  const categories = rawCategories.map(cat => ({
    ...cat,
    domain: bioCategories.includes(cat.name) ? 'biology' : 'physics'
  }));

  // 2. Merge Chemistry Lab Chemicals into "Molecules"
  const moleculesCategory = rawCategories.find(c => c.name === 'Molecules');
  
  // Build a set of existing names to prevent duplicates (e.g., 'Water' in both Physics and Chemistry)
  const existingNames = new Set();
  rawCategories.forEach(cat => {
      cat.particles.forEach(pType => {
          const info = PARTICLE_INFO[pType];
          if (info) existingNames.add(info.name.toLowerCase());
      });
  });
  
    if (moleculesCategory) {
      Object.values(CHEMICALS).forEach(chem => {
        // Skip if this chemical name already exists in the Physics/Standard list
        if (existingNames.has(chem.name.toLowerCase())) return;
        
        // Explicitly skip iron and steel as requested by user (should be in Atoms or elsewhere)
        if (chem.id === 'iron' || chem.id === 'steel') return;
  
        moleculesCategory.particles.push(chem.id);
      });
    }
  return categories;
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
