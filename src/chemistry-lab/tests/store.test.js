import { describe, it, expect, beforeEach } from 'vitest';
import { useChemistryStore } from '../store';
import { useInventory } from '../../store/inventory';

const initialVessels = {
  beaker: { id: 'beaker', name: 'Open Beaker', contents: {}, temp: 20, targetTemp: 20, pressure: 1, maxVol: 500, status: 'ok', type: 'glass', activeVisual: null },
  flask: { id: 'flask', name: 'Reaction Flask', contents: {}, temp: 20, targetTemp: 20, pressure: 1, maxVol: 500, status: 'ok', type: 'glass', activeVisual: null },
  chamber: { id: 'chamber', name: 'Pressure Chamber', contents: {}, temp: 20, targetTemp: 20, pressure: 1, maxVol: 1000, status: 'ok', type: 'reinforced', activeVisual: null },
};

describe('Chemistry Lab Store', () => {
  beforeEach(() => {
    useInventory.setState({
      compounds: { water: 1000, glucose: 0, ammonia: 0, methane: 0, glycine: 0, lipid: 0, rna: 0, dna: 0 }
    });
    useChemistryStore.setState({
      inventory: ['water', 'sodium-chloride'],
      localInventory: { 'water': 100, 'sodium-chloride': 100, 'vinegar': 100, 'baking-soda': 100 },
      vessels: JSON.parse(JSON.stringify(initialVessels)),
      message: '',
      timeSpeed: 1,
      isFumeHoodOn: false,
      gameMode: 'sandbox' // Bypass local inventory checks for store-specific tests
    });
  });

  it('should initialize with default state', () => {
    const state = useChemistryStore.getState();
    expect(state.inventory).toContain('water');
    expect(state.vessels.beaker.status).toBe('ok');
    expect(state.isFumeHoodOn).toBe(false);
  });

  it('should add chemicals to vessel', () => {
    const { addToVessel } = useChemistryStore.getState();
    addToVessel('beaker', 'water', 100);
    
    const vessel = useChemistryStore.getState().vessels.beaker;
    expect(vessel.contents['water']).toBe(100);
  });

  it('should accumulate chemicals', () => {
    const { addToVessel } = useChemistryStore.getState();
    addToVessel('beaker', 'water', 50);
    addToVessel('beaker', 'water', 50);
    
    const vessel = useChemistryStore.getState().vessels.beaker;
    expect(vessel.contents['water']).toBe(100);
  });

  it('should clear vessel', () => {
    const { addToVessel, clearVessel } = useChemistryStore.getState();
    addToVessel('beaker', 'sodium-chloride', 50);
    clearVessel('beaker');
    
    const vessel = useChemistryStore.getState().vessels.beaker;
    expect(Object.keys(vessel.contents)).toHaveLength(0);
  });

  it('should update vessel controls', () => {
    const { setVesselControl } = useChemistryStore.getState();
    setVesselControl('flask', 'targetTemp', 150);
    
    const vessel = useChemistryStore.getState().vessels.flask;
    expect(vessel.targetTemp).toBe(150);
  });

  it('should break vessel', () => {
    const { breakVessel } = useChemistryStore.getState();
    breakVessel('beaker');
    
    const vessel = useChemistryStore.getState().vessels.beaker;
    expect(vessel.status).toBe('broken');
    expect(useChemistryStore.getState().message).toContain('DANGER');
  });

  it('should repair vessel', () => {
    const { breakVessel, repairVessel } = useChemistryStore.getState();
    breakVessel('beaker');
    repairVessel('beaker');
    
    const vessel = useChemistryStore.getState().vessels.beaker;
    expect(vessel.status).toBe('ok');
    expect(vessel.temp).toBe(20);
  });

  it('should toggle fume hood', () => {
    const { toggleFumeHood } = useChemistryStore.getState();
    toggleFumeHood();
    expect(useChemistryStore.getState().isFumeHoodOn).toBe(true);
    toggleFumeHood();
    expect(useChemistryStore.getState().isFumeHoodOn).toBe(false);
  });

  it('should upgrade vessel', () => {
    const { upgradeVessel } = useChemistryStore.getState();
    upgradeVessel('beaker', 'ceramic');
    
    const vessel = useChemistryStore.getState().vessels.beaker;
    expect(vessel.type).toBe('ceramic');
  });

  it('should handle transmutation (reaction step)', () => {
    const { addToVessel, transmuteContents } = useChemistryStore.getState();
    // Simulate: A + B -> C
    // Add A and B
    addToVessel('beaker', 'vinegar', 10);
    addToVessel('beaker', 'baking-soda', 10);
    
    // Transmute 5 of each to 5 of carbon-dioxide
    transmuteContents('beaker', { 'vinegar': 5, 'baking-soda': 5 }, { 'carbon-dioxide': 5 });
    
    const contents = useChemistryStore.getState().vessels.beaker.contents;
    expect(contents['vinegar']).toBe(5);
    expect(contents['baking-soda']).toBe(5);
    expect(contents['carbon-dioxide']).toBe(5);
  });
});
