import { PARTICLE_TYPES, PARTICLE_INFO, PARTICLE_COLORS } from './particles';
import { CHEMICALS, ELEMENTARY_IDS } from '../chemistry-lab/data/chemicals';

// --- The Unified Matter Registry ---
// Single Source of Truth for all matter in the universe.
// Merges Physics (Particles/Atoms) and Chemistry (Molecules/Compounds).

export const MATTER_DEFINITIONS = {};

// Helper to determine Inventory Category
const determineCategory = (id, info, source) => {
  if (info.category?.includes('Quark')) return 'quarks';
  if (source === 'Physics' && info.category === 'Atom') return 'elements';
  if (ELEMENTARY_IDS.includes(id)) return 'elements';
  return 'compounds'; // Default to compound/molecule
};

// 1. Ingest Physics Definitions
Object.entries(PARTICLE_INFO).forEach(([id, info]) => {
  const category = determineCategory(id, info, 'Physics');
  MATTER_DEFINITIONS[id] = {
    id: id,
    name: info.name,
    description: info.description,
    category: info.category,
    mass: info.mass,
    charge: info.charge,
    composition: info.composition,
    color: PARTICLE_COLORS[id] || 'bg-gray-500',
    source: 'Physics',
    type: 'particle', // Differentiator
    inventoryId: id, // Default 1:1 mapping
    inventoryCategory: category
  };
});

// 2. Ingest Chemistry Definitions
Object.entries(CHEMICALS).forEach(([id, info]) => {
  // If it already exists (e.g. Water, Carbon), merge/overwrite with Chemistry detail
  // or keep Physics detail if it's more fundamental? 
  // Generally, Chemistry has more macroscopic info (Density, State), Physics has atomic info.
  // We'll merge them.
  
  const existing = MATTER_DEFINITIONS[id] || {};
  const category = determineCategory(id, info, 'Chemistry');
  
  MATTER_DEFINITIONS[id] = {
    ...existing,
    id: id, // Ensure ID matches
    name: info.name, // Chemistry names usually cleaner ("Water" vs "Water Molecule")
    description: info.description || existing.description,
    category: info.category || existing.category || 'Chemical',
    mass: info.formula || existing.mass, // Use formula as mass proxy if mass not precise
    color: info.color || existing.color,
    source: 'Chemistry',
    type: 'chemical',
    // Chemistry Specifics
    formula: info.formula,
    state: info.state,
    density: info.density,
    meltingPoint: info.meltingPoint,
    boilingPoint: info.boilingPoint,
    ph: info.ph,
    solubility: info.solubility,
    isChemical: true, // Flag for renderers
    inventoryId: id,
    inventoryCategory: category
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
  
  // Handle Tailwind classes from Physics
  if (info.color && info.color.startsWith('bg-')) {
     return info.color; // The renderer knows how to handle this, or we might need a map
  }
  return info.color;
};

export const getAllMatter = () => Object.values(MATTER_DEFINITIONS);

export const getMatterByCategory = (category) => {
  return Object.values(MATTER_DEFINITIONS).filter(m => m.category === category);
};
