import { useEffect } from 'react';
import { useChemistryStore } from '../store';
import { PHYSICS_CONSTANTS } from '../data/constants';
import { calculateTemperature } from '../logic/thermodynamics';
import { processReactions } from '../logic/chemistry';
import { checkSafety } from '../logic/safety';
import { checkVesselIntegrity } from '../logic/vesselState';
import { calculatePressure } from '../logic/physics';
import { processPhaseChanges } from '../logic/phaseChanges';
import { audioSystem, SFX } from '../logic/audio';

export const useSimulation = () => {
  const transmuteContents = useChemistryStore(state => state.transmuteContents);
  const updateVesselTemperature = useChemistryStore(state => state.updateVesselTemperature);
  const setVesselVisual = useChemistryStore(state => state.setVesselVisual);
  const setMessage = useChemistryStore(state => state.setMessage);
  const breakVessel = useChemistryStore(state => state.breakVessel);
  const setVesselControl = useChemistryStore(state => state.setVesselControl); 
  const addToVessel = useChemistryStore(state => state.addToVessel); 
  const collectInCondenser = useChemistryStore(state => state.collectInCondenser);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useChemistryStore.getState();
      const { vessels, timeSpeed, isFumeHoodOn } = state;
      
      if (timeSpeed === 0) return;

      Object.values(vessels).forEach(vessel => {
        if (vessel.status === 'broken') return;

        // 1. Vessel Integrity
        const failureType = checkVesselIntegrity(vessel);
        if (failureType) {
            breakVessel(vessel.id);
            audioSystem.playOneShot(SFX.BREAK);
            return;
        }

        // 2. Safety Checks
        const safetyWarning = checkSafety(vessel, isFumeHoodOn);
        if (safetyWarning) {
             setMessage(safetyWarning);
        }

        // 3. Thermodynamics
        const newTemp = calculateTemperature(vessel, timeSpeed);
        if (newTemp !== vessel.temp) {
            updateVesselTemperature(vessel.id, newTemp);
            vessel.temp = newTemp; 
        }

        // 4. Phase Changes (Boiling/Venting)
        const phaseResult = processPhaseChanges(vessel, timeSpeed);
        if (phaseResult.changes && Object.keys(phaseResult.changes).length > 0) {
             const inputsToRemove = {};
             Object.entries(phaseResult.changes).forEach(([id, delta]) => {
                 if (delta < 0) inputsToRemove[id] = Math.abs(delta);
             });
             
             transmuteContents(vessel.id, inputsToRemove, {});

             // Handle Condensation
             if (phaseResult.condensed) {
                 Object.entries(phaseResult.condensed).forEach(([id, amt]) => {
                     collectInCondenser(id, amt);
                 });
             }

             // Sound Triggers
             if (phaseResult.visualEffect === 'steam') audioSystem.startLoop(SFX.BOIL, vessel.id);
             else if (phaseResult.visualEffect === 'fume') audioSystem.startLoop(SFX.HISS, vessel.id);
        } else {
             // Stop phase loops if no changes
             audioSystem.stopLoop(SFX.BOIL, vessel.id);
             audioSystem.stopLoop(SFX.HISS, vessel.id);
        }
        
        if (phaseResult.visualEffect && !vessel.activeVisual) {
            setVesselVisual(vessel.id, phaseResult.visualEffect);
        }

        // 5. Physics (Pressure)
        const newPressure = calculatePressure(vessel);
        if (newPressure !== vessel.pressure) {
            setVesselControl(vessel.id, 'pressure', newPressure);
            vessel.pressure = newPressure;
        }

        // 6. Reactions
        const reactionResult = processReactions(vessel, timeSpeed);
        
        if (reactionResult.inputsToRemove) {
            transmuteContents(vessel.id, reactionResult.inputsToRemove, reactionResult.outputsToAdd);
            if (vessel.activeVisual !== reactionResult.visual) {
                setVesselVisual(vessel.id, reactionResult.visual);
            }
            // Reaction Sound
            audioSystem.playOneShot(SFX.BUBBLE);
        } else if (vessel.activeVisual && !phaseResult.visualEffect) {
            setVesselVisual(vessel.id, null);
        }

      });
    }, PHYSICS_CONSTANTS.TICK_RATE_MS); 

    return () => clearInterval(interval);
  }, [transmuteContents, updateVesselTemperature, setVesselVisual, setMessage, breakVessel, setVesselControl]);
};
