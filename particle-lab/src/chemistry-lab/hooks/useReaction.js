import { useEffect } from 'react';
import { useChemistryStore } from '../store';
import { REACTIONS } from '../data/reactions';

export const useReaction = () => {
  // We only need the action, not the state, to start the hook
  const transmuteContents = useChemistryStore(state => state.transmuteContents);

  useEffect(() => {
    const interval = setInterval(() => {
      // Access fresh state directly without triggering re-renders of the hook
      const currentVessels = useChemistryStore.getState().vessels;

      Object.values(currentVessels).forEach(vessel => {
        for (const reaction of REACTIONS) {
          // 1. Check conditions
          const tempOk = vessel.temp >= (reaction.conditions.tempMin || -Infinity) && 
                         vessel.temp <= (reaction.conditions.tempMax || Infinity);
          const pressureOk = vessel.pressure >= (reaction.conditions.pressureMin || -Infinity) &&
                             vessel.pressure <= (reaction.conditions.pressureMax || Infinity);

          if (!tempOk || !pressureOk) continue;

          // 2. Check ingredients presence
          const RATE_MULTIPLIER = 0.5;

          const ingredientsPresent = Object.entries(reaction.inputs).every(([chemId, amount]) => {
            return (vessel.contents[chemId] || 0) >= (amount * RATE_MULTIPLIER);
          });

          if (ingredientsPresent) {
            // 3. React!
            const inputsToRemove = {};
            Object.entries(reaction.inputs).forEach(([k, v]) => inputsToRemove[k] = v * RATE_MULTIPLIER);
            
            const outputsToAdd = {};
            Object.entries(reaction.outputs).forEach(([k, v]) => outputsToAdd[k] = v * RATE_MULTIPLIER);

            transmuteContents(vessel.id, inputsToRemove, outputsToAdd);
            
            // Break loop to process only one reaction priority per vessel
            return; 
          }
        }
      });
    }, 100); 

    return () => clearInterval(interval);
  }, [transmuteContents]);
};
