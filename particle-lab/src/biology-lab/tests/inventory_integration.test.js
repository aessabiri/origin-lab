import { describe, it, expect, beforeEach } from 'vitest';
import { useBioStore } from '../store';
import { useInventory } from '../../store/inventory';

describe('Bio Lab <-> Global Inventory Integration', () => {
  beforeEach(() => {
    // Reset Global Inventory
    useInventory.setState({
      elements: {},
      compounds: {},
      discoveredItems: []
    });

    // Reset Bio Lab Store
    useBioStore.setState({
      soup: { glucose: 0, aminoAcids: 0, lipids: 0 },
      toxins: []
    });
  });

  it('should import glucose from global inventory', () => {
    // 1. Setup Global Inventory
    useInventory.getState().addResource('compounds', 'glucose', 100);

    // 2. Perform Import in Bio Lab
    const amountToImport = 10;
    useBioStore.getState().importResource('glucose', amountToImport);

    // 3. Assertions
    // Global inventory should decrease
    expect(useInventory.getState().compounds['glucose']).toBe(90);
    
    // Bio Lab soup should increase
    expect(useBioStore.getState().soup.glucose).toBe(10);
  });

  it('should fail to import if global inventory is empty', () => {
    // 1. Setup Global Inventory (Empty)
    
    // 2. Perform Import
    useBioStore.getState().importResource('glucose', 10);

    // 3. Assertions
    // Bio Lab soup should NOT increase
    expect(useBioStore.getState().soup.glucose).toBe(0);
  });

  it('should import toxins (arsenic) as environmental hazards', () => {
    // 1. Setup Global Inventory (Arsenic is an element)
    useInventory.getState().addResource('elements', 'arsenic', 5);

    // 2. Perform Import
    useBioStore.getState().importResource('arsenic', 2);

    // 3. Assertions
    expect(useInventory.getState().elements['arsenic']).toBe(3);
    
    // Check Bio Lab Toxins array
    const toxins = useBioStore.getState().toxins;
    expect(toxins).toHaveLength(2);
    expect(toxins[0].radius).toBe(40); // Basic check for object creation
  });

  it('should map generic resources (amino_acid -> aminoAcids)', () => {
     // The store maps 'amino_acid' -> soup.aminoAcids
     // (Assuming 'amino_acid' is the particle ID for generic amino acids or Glycine if we map specific ones)
     
     // Let's assume the particle ID passed is 'glycine' which maps to 'aminoAcids' in the store logic
     // I need to check the store.js logic again to be sure of the mapping keys.
     // "const resourceKey = resourceMap[type];"
     // 'amino_acid' -> 'aminoAcids'
     // 'glucose' -> 'glucose'
     
     useInventory.getState().addResource('compounds', 'amino_acid', 20);
     useBioStore.getState().importResource('amino_acid', 5);

     expect(useInventory.getState().compounds['amino_acid']).toBe(15);
     expect(useBioStore.getState().soup.aminoAcids).toBe(5);
  });
});
