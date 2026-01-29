import { useInventory } from '../store/inventory';
import { MATTER_DEFINITIONS } from '../constants/matterRegistry';

export const useDiscoveredMatter = () => {
  const discoveredIds = useInventory(state => state.discoveredItems);

  // Memoize this if performance becomes an issue, but for < 100 items it's fine.
  const allDiscovered = discoveredIds
    .map(id => MATTER_DEFINITIONS[id])
    .filter(Boolean);

  const discoveredAtoms = allDiscovered
    .filter(def => def.category === 'Atom' || def.inventoryCategory === 'elements')
    .map(def => ({ ...def, type: def.id }));

  const discoveredMolecules = allDiscovered
    .filter(def => def.category !== 'Atom' && def.inventoryCategory !== 'elements' && def.inventoryCategory !== 'quarks')
    .map(def => ({ ...def, type: def.id }));

  return { discoveredAtoms, discoveredMolecules };
};
