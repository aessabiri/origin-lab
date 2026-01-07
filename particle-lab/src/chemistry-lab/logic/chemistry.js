import { REACTIONS } from '../data/reactions';
import { PHYSICS_CONSTANTS } from '../data/constants';

export const processReactions = (vessel, timeSpeed) => {
    let result = { 
        inputsToRemove: null, 
        outputsToAdd: null, 
        visual: null 
    };

    for (const reaction of REACTIONS) {
        const tempOk = vessel.temp >= (reaction.conditions.tempMin || -Infinity) && 
                       vessel.temp <= (reaction.conditions.tempMax || Infinity);
        const pressureOk = vessel.pressure >= (reaction.conditions.pressureMin || -Infinity) &&
                           vessel.pressure <= (reaction.conditions.pressureMax || Infinity);

        if (!tempOk || !pressureOk) continue;

        const RATE_MULTIPLIER = PHYSICS_CONSTANTS.BASE_REACTION_RATE * timeSpeed;

        const ingredientsPresent = Object.entries(reaction.inputs).every(([chemId, amount]) => {
            return (vessel.contents[chemId] || 0) >= (amount * RATE_MULTIPLIER);
        });

        if (ingredientsPresent) {
            const inputsToRemove = {};
            Object.entries(reaction.inputs).forEach(([k, v]) => inputsToRemove[k] = v * RATE_MULTIPLIER);
            
            const outputsToAdd = {};
            Object.entries(reaction.outputs).forEach(([k, v]) => outputsToAdd[k] = v * RATE_MULTIPLIER);

            result.inputsToRemove = inputsToRemove;
            result.outputsToAdd = outputsToAdd;
            result.visual = reaction.visual;
            return result; // Return first match
        }
    }
    
    return result;
};
