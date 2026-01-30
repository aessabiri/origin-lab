import { MATTER_DEFINITIONS } from '../../constants/matterRegistry';
import { useChemistryStore } from '../store';

export const processPhaseChanges = (vessel, timeSpeed) => {
    // Return object with deltas to apply to contents
    const changes = {}; 
    const condensed = {}; // New: Liquid collected in condenser
    let visualEffect = null;

    // rate of evaporation/boiling per tick
    const BOIL_RATE = 0.5 * timeSpeed; 
    const GAS_ESCAPE_RATE = 1.0 * timeSpeed;

    const state = useChemistryStore.getState();
    const isConnectedToCondenser = state.condenser.connectedTo === vessel.id;
    const isCondenserActive = state.condenser.isActive;
    
    // Effective "Venting" happens if:
    // 1. Vessel Lid is Open
    // 2. OR Vessel is connected to ACTIVE condenser (gas leaves vessel to go to condenser)
    const canGasEscape = vessel.isOpen || (isConnectedToCondenser && isCondenserActive);

    let isAnySolidified = false;

      Object.entries(vessel.contents).forEach(([chemId, amount]) => {

        const chem = MATTER_DEFINITIONS[chemId];

        if (!chem) return;

    
        if (!chem) return;

        let amountToRemove = 0;

        // 0. Freezing/Melting Check (Visual Only for now)
        if (chem.meltingPoint !== undefined) {
            if (vessel.temp < chem.meltingPoint) {
                isAnySolidified = true;
            }
        } else if (chem.state === 'solid') {
             // If no melting point defined but state is solid, assume it's solid unless very hot
             if (vessel.temp < 1000) isAnySolidified = true;
        }

        // 1. Gas Escaping (Venting)
        if (chem.state === 'gas' && canGasEscape) {
            amountToRemove = Math.min(amount, GAS_ESCAPE_RATE);
            if (amountToRemove > 0) visualEffect = 'fume';
        }

        // 2. Boiling (Liquid -> Gas)
        if (chem.state === 'liquid' && chem.boilingPoint && vessel.temp >= chem.boilingPoint) {
            // Boiling happens if Open OR Connected (distillation)
            if (canGasEscape) {
                amountToRemove = Math.min(amount, BOIL_RATE);
                if (amountToRemove > 0) visualEffect = 'steam';
            } else {
                if (amount > 0) visualEffect = 'bubble';
            }
        }

        // Apply changes
        if (amountToRemove > 0) {
            changes[chemId] = (changes[chemId] || 0) - amountToRemove;
            
            // If escaping into condenser, collect it!
            if (isConnectedToCondenser && isCondenserActive) {
                condensed[chemId] = (condensed[chemId] || 0) + amountToRemove;
            }
        }
    });

    if (isAnySolidified && !visualEffect) {
        visualEffect = 'solidify';
    }

    return { changes, visualEffect, condensed };
};
