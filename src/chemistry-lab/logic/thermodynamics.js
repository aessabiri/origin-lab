import { useChemistryStore } from '../store';
import { PHYSICS_CONSTANTS } from '../data/constants';

export const useThermodynamics = (vessel) => {
  const updateVesselTemperature = useChemistryStore(state => state.updateVesselTemperature);
  const timeSpeed = useChemistryStore(state => state.timeSpeed);

  const processThermodynamics = () => {
    // Note: We need to pass the latest vessel state or read it from store inside the loop if using intervals there.
    // However, since we are moving to a composed loop, we will assume this function is called inside the loop with the current vessel state.
    // But `vessel` here is from the outer scope if we use it like a hook that returns a function.
    
    // Better pattern: The hook sets up the logic, but the actual processing might need the fresh store state.
    // Let's stick to the pattern where the main loop gets the state and calls these helpers, 
    // OR these hooks manage their own slices. 
    // Given the single interval requirement for performance, one main loop is better.
    // So these "hooks" might just be helper functions or hooks that return a processing function.
    
    // Let's make them hooks that return a function to be called in the loop.
    // Actually, to avoid stale closures, accessing `useChemistryStore.getState()` inside the loop is best.
    
    // So, I'll export simple functions for the logic, and maybe a hook if it needs to subscribe to something specific (which it doesn't really).
    // But the request was "Hooks Pattern". 
    // Let's make `useThermodynamics` a hook that returns a function `calculateTemperature`.
    
    return; 
  };
};

// Re-thinking: The "God Hook" problem was that `useReaction` did everything.
// If I make `useSimulation` the master hook, it can import logic functions.
// But if I want to use standard React hooks, they should probably just be separated hooks that all run on the same interval?
// No, multiple intervals is bad for synchronization.

// Decision: `useSimulation` will set up ONE interval.
// It will call helper functions imported from `../logic/thermodynamics.js` etc.
// Wait, the prompt asked for "sub-hooks". 
// A hook `useThermodynamics` could run its own effect? 
// "Multiple intervals is bad" -> technically yes, but for this scale (3 vessels), 3-4 intervals is fine and cleaner for separation.
// However, the "Game Loop" usually implies one loop.

// Let's try a hybrid: `useSimulation` is the master loop. It calls logic extracted into pure functions/helpers.
// But to keep it "hook-like" and allow access to store actions easily, I can make custom hooks that *return* the processor function.

export const calculateTemperature = (vessel, timeSpeed) => {
    const target = vessel.targetTemp ?? 20; 
    const current = vessel.temp;
    
    if (Math.abs(target - current) > PHYSICS_CONSTANTS.TEMP_SNAP_THRESHOLD) {
         const speedFactor = Math.min(timeSpeed, PHYSICS_CONSTANTS.MAX_SPEED_FACTOR); 
         const change = (target - current) * PHYSICS_CONSTANTS.CONDUCTIVITY_FACTOR * speedFactor;
         
         let newTemp = current + change;
         if (Math.abs(target - newTemp) < PHYSICS_CONSTANTS.TEMP_SNAP_THRESHOLD) newTemp = target;
         
         return Math.round(newTemp * 10) / 10;
    }
    return current;
};
