import { VESSEL_STATS } from '../data/constants';

export const checkVesselIntegrity = (vessel) => {
    if (vessel.status === 'broken') return null;

    const stats = VESSEL_STATS[vessel.type || (vessel.id === 'chamber' ? 'reinforced' : 'glass')] || VESSEL_STATS.glass;
    
    if (vessel.pressure > stats.maxPress) {
        return 'overpressure';
    }
    
    if (vessel.temp > stats.maxTemp) {
        return 'thermal';
    }
    
    return null; // Integrity OK
};
