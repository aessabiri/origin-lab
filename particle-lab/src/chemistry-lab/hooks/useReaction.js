import { useEffect } from 'react';
import { useChemistryStore } from '../store';
import { REACTIONS } from '../data/reactions';

export const useReaction = () => {
  const transmuteContents = useChemistryStore(state => state.transmuteContents);
  const updateVesselTemperature = useChemistryStore(state => state.updateVesselTemperature);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useChemistryStore.getState();
      const { vessels, timeSpeed } = state;
      
      if (timeSpeed === 0) return;

      Object.values(vessels).forEach(vessel => {
        // --- 1. Thermodynamics ---
        // Use heater setting if available, otherwise ambient (20C)
        // Note: In store we added 'targetTemp', but UI controls 'targetTemp'.
        // Wait, did I update the UI to control 'targetTemp'? I need to check Vessel.jsx next.
        // Assuming 'targetTemp' is the heater dial.
        const target = vessel.targetTemp ?? 20; 
        const current = vessel.temp;
        
        // Heat transfer logic
        if (Math.abs(target - current) > 0.5) {
             // 0.01 = Conductivity Factor. 
             // At 1x speed (100ms), moves 1% of the difference per tick.
             // Cap multiplier to avoid instant jumps at extreme speeds unless desired.
             const speedFactor = Math.min(timeSpeed, 50); 
             const change = (target - current) * 0.01 * speedFactor;
             
             let newTemp = current + change;
             // Snap to target if close
             if (Math.abs(target - newTemp) < 0.5) newTemp = target;
             
             updateVesselTemperature(vessel.id, Math.round(newTemp * 10) / 10);
        }

        // --- 2. Reactions ---
        for (const reaction of REACTIONS) {
          // Conditions (Check against CURRENT temp)
          const tempOk = vessel.temp >= (reaction.conditions.tempMin || -Infinity) && 
                         vessel.temp <= (reaction.conditions.tempMax || Infinity);
          const pressureOk = vessel.pressure >= (reaction.conditions.pressureMin || -Infinity) &&
                             vessel.pressure <= (reaction.conditions.pressureMax || Infinity);

          if (!tempOk || !pressureOk) continue;

          // Consumption Rate
          // 0.5 units per tick at 1x speed.
          // At 100x speed, 50 units per tick.
          const RATE_MULTIPLIER = 0.5 * timeSpeed;

          const ingredientsPresent = Object.entries(reaction.inputs).every(([chemId, amount]) => {
            return (vessel.contents[chemId] || 0) >= (amount * RATE_MULTIPLIER);
          });

          if (ingredientsPresent) {
            const inputsToRemove = {};
            Object.entries(reaction.inputs).forEach(([k, v]) => inputsToRemove[k] = v * RATE_MULTIPLIER);
            
            const outputsToAdd = {};
            Object.entries(reaction.outputs).forEach(([k, v]) => outputsToAdd[k] = v * RATE_MULTIPLIER);

            transmuteContents(vessel.id, inputsToRemove, outputsToAdd);
            return; 
          }
        }
      });
    }, 100); 

    return () => clearInterval(interval);
  }, [transmuteContents, updateVesselTemperature]);
};