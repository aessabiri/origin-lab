import { CODEX_PARTICLES_BY_CATEGORY } from '../constants/particles';
import { getMatterInfo } from '../constants/matterRegistry';

// Cache for the expensive codex structure generation (if needed, but now static)
let cachedCodexData = null;

export const getUniversalCodexData = () => {
  if (cachedCodexData) return cachedCodexData;

  // The Codex is now handcrafted and static in particles.js
  const groups = JSON.parse(JSON.stringify(CODEX_PARTICLES_BY_CATEGORY));
  
  cachedCodexData = groups;
  return groups;
};

export const getUniversalItemInfo = (id) => {
  return getMatterInfo(id);
};
