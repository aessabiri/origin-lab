import { PARTICLE_TYPES, PARTICLE_INFO, PARTICLE_COLORS, ELEMENTARY_IDS } from './particles';

// --- The Unified Matter Registry ---
// Single Source of Truth for all matter in the universe.
// Now entirely self-contained in the Particle Lab constants.

export const MATTER_DEFINITIONS = {};

// Helper to determine Inventory Category (Standardized)
const determineCategory = (id, info) => {
  if (info.category?.includes('Quark')) return 'quarks';
  if (info.category === 'Atom' || info.category === 'Isotope' || ELEMENTARY_IDS.includes(id)) return 'elements';
  return 'compounds'; // Default to compound/molecule
};

// Ingest Unified Definitions
Object.entries(PARTICLE_INFO).forEach(([id, info]) => {
  const invCategory = determineCategory(id, info);
  
  MATTER_DEFINITIONS[id] = {
    ...info,
    id: id,
    name: info.name,
    description: info.description,
    category: info.category,
    color: PARTICLE_COLORS[id] || '#9ca3af',
    source: info.source || (info.isChemical ? 'Chemistry' : 'Physics'),
    type: info.isChemical ? 'chemical' : 'particle',
    inventoryId: id,
    inventoryCategory: invCategory,
    isChemical: info.isChemical || ['Molecule', 'Ionic Compound', 'Acid', 'Base', 'Polymer', 'Solution'].some(c => info.category?.includes(c))
  };
});

// --- Helper Functions ---

export const getMatterInfo = (id) => {
  return MATTER_DEFINITIONS[id] || {
    id: id,
    name: 'Unknown Substance',
    description: 'No data available in the Universal Registry.',
    color: '#9ca3af',
    source: 'Unknown'
  };
};

export const getMatterColor = (id) => {
  const info = MATTER_DEFINITIONS[id];
  if (!info) return '#9ca3af';
  
  // Handle Tailwind classes if they exist (though we standardized them to hex mostly now)
  if (info.color && typeof info.color === 'string' && info.color.startsWith('bg-')) {
     return info.color; 
  }
  return info.color;
};

export const getAllMatter = () => Object.values(MATTER_DEFINITIONS);

export const getMatterByCategory = (category) => {
  return Object.values(MATTER_DEFINITIONS).filter(m => m.category === category);
};