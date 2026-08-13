import { PARTICLE_INFO, PARTICLE_COLORS, ELEMENTARY_IDS } from '../particles';
import { PRIMORDIAL_MATTER } from './primordial';
import { ATOMIC_MATTER } from './atomic';
import { MOLECULAR_MATTER } from './molecular';
import { BIOLOGICAL_MATTER } from './biological';

const MERGED_HIERARCHY = {
  ...PRIMORDIAL_MATTER,
  ...ATOMIC_MATTER,
  ...MOLECULAR_MATTER,
  ...BIOLOGICAL_MATTER,
};

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
  const hierarchyInfo = MERGED_HIERARCHY[id] || { parents: [] };

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
    isChemical: info.isChemical || ['Molecule', 'Ionic Compound', 'Acid', 'Base', 'Polymer', 'Solution'].some(c => info.category?.includes(c)),
    parents: hierarchyInfo.parents
  };
});

// Helper Functions
export const getMatterInfo = (id) => MATTER_DEFINITIONS[id] || {
  id, name: 'Unknown Substance', description: 'No data', color: '#9ca3af', source: 'Unknown', parents: []
};

export const getAllMatter = () => Object.values(MATTER_DEFINITIONS);
