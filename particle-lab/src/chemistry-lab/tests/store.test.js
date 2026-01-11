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
      inventory: ['H2O', 'NaCl'],
      vessels: JSON.parse(JSON.stringify(initialVessels)),
      message: '',
      timeSpeed: 1,
      isFumeHoodOn: false
    });
  });

  it('should initialize with default state', () => {
    const state = useChemistryStore.getState();
    expect(state.inventory).toContain('H2O');
    expect(state.vessels.beaker.status).toBe('ok');
    expect(state.isFumeHoodOn).toBe(false);
  });

  it('should add chemicals to vessel', () => {
    const { addToVessel } = useChemistryStore.getState();
    addToVessel('beaker', 'H2O', 100);
    
    const vessel = useChemistryStore.getState().vessels.beaker;
    expect(vessel.contents['H2O']).toBe(100);
  });

  it('should accumulate chemicals', () => {
    const { addToVessel } = useChemistryStore.getState();
    addToVessel('beaker', 'H2O', 50);
    addToVessel('beaker', 'H2O', 50);
    
    const vessel = useChemistryStore.getState().vessels.beaker;
    expect(vessel.contents['H2O']).toBe(100);
  });

  it('should clear vessel', () => {
    const { addToVessel, clearVessel } = useChemistryStore.getState();
    addToVessel('beaker', 'NaCl', 50);
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
    addToVessel('beaker', 'VINEGAR', 10);
    addToVessel('beaker', 'BAKING_SODA', 10);
    
    // Transmute 5 of each to 5 of CO2
    transmuteContents('beaker', { VINEGAR: 5, BAKING_SODA: 5 }, { CO2: 5 });
    
    const contents = useChemistryStore.getState().vessels.beaker.contents;
    expect(contents['VINEGAR']).toBe(5);
    expect(contents['BAKING_SODA']).toBe(5);
    expect(contents['CO2']).toBe(5);
  });
});
