import { REACTIONS } from '../data/reactions';
import { PHYSICS_CONSTANTS } from '../data/constants';
import { CHEMICALS } from '../data/chemicals';
import { getCandidateReactions } from './reactionRegistry';

// Helper to calculate dissolved vs precipitate
export const calculatePrecipitates = (contents, temp) => {
    // 1. Identify Solvent (Simplified: Max Liquid Volume, usually H2O)
    // We assume Water is the main solvent for now.
    const waterVol = contents['water'] || 0;
    const ethanolVol = contents['ethanol'] || 0;
    const totalSolvent = waterVol + ethanolVol;

    const dissolved = {};
    const precipitates = {};

    Object.entries(contents).forEach(([id, amount]) => {
        if (id === 'water' || id === 'ethanol') {
            dissolved[id] = amount;
            return;
        }

        const chem = CHEMICALS[id];
        if (!chem) return;

        // If it's a gas, we assume it's dissolved (up to Henry's law limit, but ignored for now)
        // If it's a liquid, we assume miscibility (unless oil, but we don't have oil yet)
        // If it's a solid ABOVE its melting point, it is a liquid (miscible with itself).
        const isMelted = chem.meltingPoint !== undefined && temp >= chem.meltingPoint;
        
        if (chem.state !== 'solid' || isMelted) {
            dissolved[id] = amount;
            return;
        }

        // Solids: Check Solubility
        // Solubility is usually g/100ml. 
        // We simulate temp effect: Solubility rises with temp.
        // Base S at 20C. Increase by 2% per degree above 20? Rough approx.
        // S_t = S_20 * (1 + 0.03 * (T - 20))
        let limit = Infinity;
        
        if (chem.solubility !== undefined) {
            const tempFactor = Math.max(0.1, 1 + 0.03 * (temp - 20)); 
            const baseLimit = (totalSolvent / 100) * chem.solubility;
            limit = baseLimit * tempFactor;
        }

        if (amount > limit) {
            dissolved[id] = limit;
            precipitates[id] = amount - limit;
        } else {
            dissolved[id] = amount;
        }
    });

    return { dissolved, precipitates };
};

export const processReactions = (vessel, timeSpeed) => {
    let result = { 
        inputsToRemove: null, 
        outputsToAdd: null, 
        visual: null,
        heatGenerated: 0 
    };

    // Calculate effective available reactants (Dissolved only)
    // Reacting solids (like Iron + Oxygen) is a surface area reaction, 
    // but for "Solution Chemistry" we usually need dissolved ions.
    // For now, we will enforce solubility limits for solution reactions.
    // However, some reactions (Combustion) happen with raw materials.
    // We need a flag in reactions? Or just assume if solvent is present, limit applies.
    
    const { dissolved } = calculatePrecipitates(vessel.contents, vessel.temp);
    
    // Fallback: If no solvent, reaction happens with raw materials (e.g. Iron + Sulfur powder)
    const hasSolvent = (vessel.contents['water'] || 0) > 0 || (vessel.contents['ethanol'] || 0) > 0;
    const availableIngredients = hasSolvent ? dissolved : vessel.contents;

    // Optimization: Only check relevant reactions
    const candidates = getCandidateReactions(availableIngredients);

    for (const reaction of candidates) {
        const tempOk = vessel.temp >= (reaction.conditions.tempMin || -Infinity) && 
                       vessel.temp <= (reaction.conditions.tempMax || Infinity);
        const pressureOk = vessel.pressure >= (reaction.conditions.pressureMin || -Infinity) &&
                           vessel.pressure <= (reaction.conditions.pressureMax || Infinity);

        if (!tempOk || !pressureOk) continue;

        const RATE_MULTIPLIER = PHYSICS_CONSTANTS.BASE_REACTION_RATE * timeSpeed;

        const ingredientsPresent = Object.entries(reaction.inputs).every(([chemId, amount]) => {
            // Check against AVAILABLE ingredients (dissolved)
            return (availableIngredients[chemId] || 0) >= (amount * RATE_MULTIPLIER);
        });

        if (ingredientsPresent) {
            const inputsToRemove = {};
            let totalReactedMass = 0;
            
            Object.entries(reaction.inputs).forEach(([k, v]) => {
                const amount = v * RATE_MULTIPLIER;
                inputsToRemove[k] = amount;
                totalReactedMass += amount; // Simplified mass calculation
            });
            
            const outputsToAdd = {};
            Object.entries(reaction.outputs).forEach(([k, v]) => outputsToAdd[k] = v * RATE_MULTIPLIER);

            result.inputsToRemove = inputsToRemove;
            result.outputsToAdd = outputsToAdd;
            result.visual = reaction.visual;
            
            // Calculate Heat: (Reaction Heat * Amount Reacted)
            // Divide by total vessel mass (approx volume) to get Temp Delta
            const totalVolume = Object.values(vessel.contents).reduce((a, b) => a + b, 0) || 1;
            const heatVal = reaction.heat || 0;
            
            // Heat is usually per mole/unit. We scale it by how much reaction happened vs total thermal mass.
            // Simplified: Delta T = (Heat * ReactedAmount) / TotalMass
            // Increased thermal mass factor to 2.0 to simulate water's high heat capacity and prevent instant boiling
            result.heatGenerated = (heatVal * totalReactedMass) / (totalVolume * 2.0); 

            return result; // Return first match
        }
    }
    
    return result;
};

export const calculatePH = (contents) => {
    let totalVol = 0;
    let molesH = 0;
    let molesOH = 0;

    Object.entries(contents).forEach(([id, amount]) => {
        const chem = CHEMICALS[id];
        if (!chem) return;
        totalVol += amount;

        const ph = chem.ph !== undefined ? chem.ph : 7.0;
        
        // Moles = Vol * Concentration (M). 
        // [H+] = 10^-pH
        // [OH-] = 10^-(14-pH)
        
        if (ph < 7) {
            molesH += amount * Math.pow(10, -ph);
        } else if (ph > 7) {
            molesOH += amount * Math.pow(10, -(14 - ph));
        } else {
            // Neutral water contributes 10^-7 of both, negligible for strong acid/base mixing usually,
            // but important for dilution.
            molesH += amount * 1e-7;
            molesOH += amount * 1e-7;
        }
    });

    if (totalVol === 0) return 7.0;

    // Neutralization
    const netH = molesH - molesOH;

    if (netH > 0) {
        // Acidic: [H+] = netH / totalVol
        return -Math.log10(netH / totalVol);
    } else if (netH < 0) {
        // Basic: [OH-] = netOH / totalVol
        const pOH = -Math.log10(Math.abs(netH) / totalVol);
        return 14 - pOH;
    } else {
        return 7.0;
    }
};

// Color Blending Utility
export const calculateMixtureColor = (contents, currentPH) => {
    let r = 0, g = 0, b = 0, totalWeight = 0;
    const entries = Object.entries(contents);
    if (entries.length === 0) return 'transparent';

    entries.forEach(([id, amount]) => {
        const chem = CHEMICALS[id];
        if (!chem) return;

        let color = chem.color;
        let weight = amount;
        
        // Handle Universal Indicator
        if (id === 'universal-indicator') {
             weight = amount * 50; // Boost visibility (simulate high extinction coefficient)
             if (currentPH < 4) color = '#ef4444'; // Red
             else if (currentPH < 6) color = '#f97316'; // Orange
             else if (currentPH < 8) color = '#22c55e'; // Green
             else if (currentPH < 10) color = '#3b82f6'; // Blue
             else color = '#a855f7'; // Purple
        }

        // Parse Hex
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        if (result) {
            r += parseInt(result[1], 16) * weight;
            g += parseInt(result[2], 16) * weight;
            b += parseInt(result[3], 16) * weight;
            totalWeight += weight;
        }
    });

    if (totalWeight === 0) return '#3b82f6';

    r = Math.round(r / totalWeight);
    g = Math.round(g / totalWeight);
    b = Math.round(b / totalWeight);

    return `rgb(${r}, ${g}, ${b})`;
};