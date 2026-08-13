import { MATTER_DEFINITIONS } from '../../constants/matterRegistry';

const GAS_CONSTANT = 0.0821; // L atm / (K mol) - Simplified for game scale

export const calculatePressure = (vessel) => {
    // 1. Calculate Total Moles of Gas
    let gasMoles = 0;
    
      Object.entries(vessel.contents).forEach(([chemId, amount]) => {
    
        const chem = MATTER_DEFINITIONS[chemId];
    
    
        if (!chem) return;

        // Check if it's naturally a gas OR if it's boiling
        const isGas = chem.state === 'gas';
        const isBoiling = chem.boilingPoint && vessel.temp >= chem.boilingPoint;

        if (isGas || isBoiling) {
            // Simplified: 1 unit = 1 mol for gameplay balance
            gasMoles += amount;
        }
    });

    // 2. Ideal Gas Law: P = (nRT) / V
    // P = Pressure (atm)
    // n = Moles (gasMoles)
    // R = Constant
    // T = Temp (Kelvin) -> vessel.temp + 273
    // V = Volume (vessel.maxVol) -> simplified 
    
    // Game Balance: 
    // If open container, pressure is 1 atm (vented).
    
    if (vessel.isOpen) {
        return 1; // Open air
    }

    const T = vessel.temp + 273;
    const V = vessel.maxVol / 100; // Arbitrary scale factor to make pressure numbers readable (e.g. 500ml -> 5)
    
    if (gasMoles <= 0) return 1; // Vacuum/Air
    
    // P = nRT / V
    const pressure = (gasMoles * GAS_CONSTANT * T) / V;
    
    // Clamp min pressure to 1 (Earth atmosphere)
    return Math.max(1, parseFloat(pressure.toFixed(2)));
};
