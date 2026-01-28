import { describe, it, expect, beforeEach } from 'vitest';
import { processPhaseChanges } from '../logic/phaseChanges';
import { useChemistryStore } from '../store';

describe('Phase Changes', () => {
    
    beforeEach(() => {
        useChemistryStore.setState({
            condenser: { connectedTo: null, isActive: false, contents: {} }
        });
    });

    it('should boil water at 100°C if open', () => {
        const vessel = {
            id: 'v1',
            contents: { water: 100 },
            temp: 100,
            isOpen: true
        };
        const result = processPhaseChanges(vessel, 1);
        
        expect(result.changes.water).toBeLessThan(0); // Should lose water
        expect(result.visualEffect).toBe('steam');
    });

    it('should NOT boil water at 90°C', () => {
        const vessel = {
            id: 'v1',
            contents: { water: 100 },
            temp: 90,
            isOpen: true
        };
        const result = processPhaseChanges(vessel, 1);
        
        expect(result.changes.water).toBeUndefined();
        expect(result.visualEffect).toBeNull();
    });

    it('should bubble (not steam) if boiling but closed', () => {
        const vessel = {
            id: 'v1',
            contents: { water: 100 },
            temp: 100,
            isOpen: false // Closed lid
        };
        const result = processPhaseChanges(vessel, 1);
        
        expect(result.changes.water).toBeUndefined(); // Mass conserved
        expect(result.visualEffect).toBe('bubble');
    });

    it('should solidify water at -10°C', () => {
        const vessel = {
            id: 'v1',
            contents: { water: 100 },
            temp: -10,
            isOpen: true
        };
        const result = processPhaseChanges(vessel, 1);
        
        expect(result.visualEffect).toBe('solidify');
    });

    it('should vent gas if open', () => {
        const vessel = {
            id: 'v1',
            contents: { oxygen: 10 },
            temp: 20,
            isOpen: true
        };
        const result = processPhaseChanges(vessel, 1);
        
        expect(result.changes.oxygen).toBeLessThan(0);
        expect(result.visualEffect).toBe('fume');
    });

    it('should collect in condenser if connected and active', () => {
        // Setup store
        useChemistryStore.setState({
            condenser: { connectedTo: 'v1', isActive: true, contents: {} }
        });

        const vessel = {
            id: 'v1',
            contents: { water: 100 },
            temp: 100,
            isOpen: false // Can be closed if connected to condenser
        };
        
        const result = processPhaseChanges(vessel, 1);
        
        expect(result.changes.water).toBeLessThan(0); // Leaving vessel
        expect(result.condensed.water).toBeGreaterThan(0); // Entering condenser
    });
});
