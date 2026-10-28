import { useStore } from '../store.js';
import { useParticleStore } from '../particle-lab/store.js';
import { useBioStore } from '../biology-lab/store.js';
import { useChemistryStore } from '../chemistry-lab/store.js';
import { useInventory } from '../store/inventory.js';
import { useProgressionStore } from '../store/progressionStore.js';
import { usePlanetaryStore } from '../store/planetaryStore.js';
import { useAnatomyStore } from '../anatomy-lab/store.js';

export const resetAllOriginStores = () => {
  try { useInventory.getState().resetUniverse?.(); } catch (e) {}
  try { useStore.getState().executeReset?.(); } catch (e) {}
  try { useParticleStore.getState().executeReset?.(); } catch (e) {}
  try { useBioStore.getState().resetSimulation?.(); } catch (e) {}
  try { useChemistryStore.getState().resetLab?.(); } catch (e) {}
  try { useProgressionStore.getState().resetProgression?.(); } catch (e) {}
  try { usePlanetaryStore.getState().resetPlanet?.(); } catch (e) {}
  try { useAnatomyStore.getState().resetSkeleton?.(); } catch (e) {}
};
