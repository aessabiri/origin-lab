import { describe, it, expect, beforeEach } from 'vitest';
import { useInventory } from '../store/inventory';

describe('Global Inventory Store', () => {
  beforeEach(() => {
    useInventory.setState({
      energy: 0,
      elements: {},
      compounds: {},
      discoveredItems: []
    });
  });

  it('should add a resource', () => {
    const { addResource } = useInventory.getState();
    
    addResource('elements', 'hydrogen', 10);
    
    expect(useInventory.getState().elements['hydrogen']).toBe(10);
    
    addResource('elements', 'hydrogen', 5);
    expect(useInventory.getState().elements['hydrogen']).toBe(15);
  });

  it('should mark discovered items', () => {
    const { markDiscovered } = useInventory.getState();
    
    markDiscovered('hydrogen');
    expect(useInventory.getState().discoveredItems).toContain('hydrogen');
    
    // Should not duplicate
    markDiscovered('hydrogen');
    expect(useInventory.getState().discoveredItems).toHaveLength(1);
  });

  it('should consume a resource if available', () => {
    const { addResource, consumeResource } = useInventory.getState();
    
    addResource('compounds', 'water', 10);
    
    const success = consumeResource('compounds', 'water', 4);
    
    expect(success).toBe(true);
    expect(useInventory.getState().compounds['water']).toBe(6);
  });

  it('should fail to consume if insufficient', () => {
    const { addResource, consumeResource } = useInventory.getState();
    
    addResource('compounds', 'water', 2);
    
    const success = consumeResource('compounds', 'water', 5);
    
    expect(success).toBe(false);
    expect(useInventory.getState().compounds['water']).toBe(2); // Unchanged
  });

  it('should transmute elements', () => {
    const { addResource, transmute } = useInventory.getState();
    
    addResource('elements', 'hydrogen', 10);
    
    // Transmute 4 Hydrogen -> 1 Helium (Simulated stoichiometry)
    const success = transmute('hydrogen', 'helium', 4);
    
    expect(success).toBe(true);
    expect(useInventory.getState().elements['hydrogen']).toBe(6);
    expect(useInventory.getState().elements['helium']).toBe(4); // transmute takes amount directly, doesn't do ratio logic itself
  });
});
