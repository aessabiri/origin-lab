import { useInventory } from '../store/inventory';
import { MATTER_DEFINITIONS } from '../constants/matterRegistry';

/**
 * Utility version of syncSynthesis for use outside of React components/hooks (e.g., in stores)
 */
export const syncSynthesisUtil = (itemId, quantity = 1, ingredients = []) => {
  const info = MATTER_DEFINITIONS[itemId];
  if (!info) {
    console.warn(`Sync failed: Item '${itemId}' not found in Universal Registry.`);
    return false;
  }

  const inventory = useInventory.getState();
  const category = info.inventoryCategory || 'compounds';

  if (ingredients.length > 0) {
    // Execute as atomic transaction
    return inventory.executeTransaction(ingredients, [{ category, type: itemId, amount: quantity }]);
  } else {
    // Just add resource (primordial or no-cost discovery)
    inventory.addResource(category, itemId, quantity);
    return true;
  }
};

/**
 * Universal Resource Bridge Hook
 * Standardizes the synchronization between labs and the Global Inventory.
 */
export const useResourceSync = () => {
  const syncSynthesis = (itemId, quantity = 1, ingredients = []) => {
    return syncSynthesisUtil(itemId, quantity, ingredients);
  };

  return { syncSynthesis };
};
