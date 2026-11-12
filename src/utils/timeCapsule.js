import { useInventory } from '../store/inventory';
import { useCosmicClockStore } from '../store/cosmicClockStore';
import { usePlanetaryStore } from '../store/planetaryStore';
import { useAnatomyStore } from '../anatomy-lab/store';
import { useBioStore } from '../biology-lab/store';
import { useProgressionStore } from '../store/progressionStore';

export const TIME_CAPSULE_VERSION = '2.0.0-argon';

/**
 * Serializes the entire Origin Lab // Argon simulation state across all 6 stores
 * into a portable JSON snapshot string.
 */
export function createTimeCapsuleSnapshot(label = 'Origin Lab Argon Snapshot') {
  const inventoryState = useInventory.getState();
  const cosmicState = useCosmicClockStore.getState();
  const planetaryState = usePlanetaryStore.getState();
  const anatomyState = useAnatomyStore.getState();
  const bioState = useBioStore.getState();
  const progressionState = useProgressionStore.getState();

  return {
    version: TIME_CAPSULE_VERSION,
    label,
    exportedAt: new Date().toISOString(),
    cosmic: {
      cosmicAgeYears: cosmicState.cosmicAgeYears,
      timeScale: cosmicState.timeScale,
      compiledGenome: cosmicState.compiledGenome
    },
    inventory: {
      elements: inventoryState.elements,
      compounds: inventoryState.compounds,
      discoveredItems: inventoryState.discoveredItems,
      transactionHistory: (inventoryState.transactionHistory || []).slice(-100)
    },
    biology: {
      currentCellDesign: bioState.currentCellDesign,
      synthesizedProteins: bioState.synthesizedProteins,
      unlockedAminoAcids: bioState.unlockedAminoAcids,
      environment: bioState.environment,
      morphogenesisConfig: bioState.morphogenesisConfig || null
    },
    anatomy: {
      unlockedBones: anatomyState.unlockedBones,
      unlockedMuscles: anatomyState.unlockedMuscles,
      unlockedOrganSystems: anatomyState.unlockedOrganSystems,
      posturePreset: anatomyState.posturePreset,
      gravityMultiplier: anatomyState.gravityMultiplier || 1.0
    },
    planetary: {
      oxygen: planetaryState.oxygen,
      carbonDioxide: planetaryState.carbonDioxide,
      methane: planetaryState.methane,
      nitrogen: planetaryState.nitrogen,
      surfaceTemp: planetaryState.surfaceTemp,
      oceanCoverage: planetaryState.oceanCoverage,
      oceanPh: planetaryState.oceanPh,
      biomass: planetaryState.biomass,
      biodiversity: planetaryState.biodiversity,
      seededOrganisms: planetaryState.seededOrganisms,
      cladogram: planetaryState.cladogram
    },
    progression: {
      completedStages: progressionState.completedStages,
      unlockedStages: progressionState.unlockedStages
    }
  };
}

/**
 * Restores a serialized Time Capsule snapshot object or JSON string into all active stores.
 */
export function restoreTimeCapsuleSnapshot(payload) {
  const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
  if (!data || typeof data !== 'object' || !data.version) {
    throw new Error('Invalid Origin Lab Time Capsule format.');
  }

  if (data.cosmic) {
    useCosmicClockStore.setState({
      cosmicAgeYears: Number(data.cosmic.cosmicAgeYears ?? 13800000000),
      timeScale: Number(data.cosmic.timeScale ?? 1),
      compiledGenome: data.cosmic.compiledGenome ?? null
    });
  }

  if (data.inventory) {
    useInventory.setState((state) => ({
      elements: { ...state.elements, ...(data.inventory.elements || {}) },
      compounds: { ...state.compounds, ...(data.inventory.compounds || {}) },
      discoveredItems: Array.isArray(data.inventory.discoveredItems)
        ? data.inventory.discoveredItems
        : state.discoveredItems
    }));
  }

  if (data.biology) {
    useBioStore.setState((state) => ({
      currentCellDesign: data.biology.currentCellDesign || state.currentCellDesign,
      synthesizedProteins: data.biology.synthesizedProteins || state.synthesizedProteins,
      unlockedAminoAcids: data.biology.unlockedAminoAcids || state.unlockedAminoAcids,
      environment: { ...state.environment, ...(data.biology.environment || {}) },
      morphogenesisConfig: data.biology.morphogenesisConfig || state.morphogenesisConfig
    }));
  }

  if (data.anatomy) {
    useAnatomyStore.setState((state) => ({
      unlockedBones: Array.isArray(data.anatomy.unlockedBones)
        ? data.anatomy.unlockedBones
        : state.unlockedBones,
      unlockedMuscles: Array.isArray(data.anatomy.unlockedMuscles)
        ? data.anatomy.unlockedMuscles
        : state.unlockedMuscles,
      unlockedOrganSystems: Array.isArray(data.anatomy.unlockedOrganSystems)
        ? data.anatomy.unlockedOrganSystems
        : state.unlockedOrganSystems,
      posturePreset: data.anatomy.posturePreset || state.posturePreset,
      gravityMultiplier: Number(data.anatomy.gravityMultiplier ?? 1.0)
    }));
  }

  if (data.planetary) {
    usePlanetaryStore.setState((state) => ({
      oxygen: data.planetary.oxygen ?? state.oxygen,
      carbonDioxide: data.planetary.carbonDioxide ?? state.carbonDioxide,
      methane: data.planetary.methane ?? state.methane,
      nitrogen: data.planetary.nitrogen ?? state.nitrogen,
      surfaceTemp: data.planetary.surfaceTemp ?? state.surfaceTemp,
      oceanCoverage: data.planetary.oceanCoverage ?? state.oceanCoverage,
      oceanPh: data.planetary.oceanPh ?? state.oceanPh,
      biomass: data.planetary.biomass ?? state.biomass,
      biodiversity: data.planetary.biodiversity ?? state.biodiversity,
      seededOrganisms: data.planetary.seededOrganisms || state.seededOrganisms,
      cladogram: data.planetary.cladogram || state.cladogram
    }));
  }

  if (data.progression) {
    useProgressionStore.setState((state) => ({
      completedStages: data.progression.completedStages || state.completedStages,
      unlockedStages: data.progression.unlockedStages || state.unlockedStages
    }));
  }

  return data;
}

/**
 * Triggers a browser file download of the `.origin.json` Time Capsule.
 */
export function downloadTimeCapsuleFile() {
  const snapshot = createTimeCapsuleSnapshot();
  const json = JSON.stringify(snapshot, null, 2);
  if (typeof window !== 'undefined' && typeof Blob !== 'undefined') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `origin-lab-argon-${Date.now()}.origin.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return snapshot;
}
