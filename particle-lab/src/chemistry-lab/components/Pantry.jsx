import React from 'react';
import { useChemistryStore } from '../store';
import { useInventory } from '../../store/inventory';
import ResourceExchange from '../../components/ResourceExchange.jsx';
import { INVENTORY_TO_CHEMICAL_MAP } from '../data/chemicals'; // We still need this map if the chemical data uses different IDs

const Pantry = () => {
  const addToVessel = useChemistryStore(state => state.addToVessel);
  const activeVesselId = 'v1'; // Assuming single vessel focus for drag/drop, or we handle import differently

  const handleImport = (itemId, amount) => {
    // Map Global Particle ID -> Chemistry Lab ID
    // Note: The new ResourceExchange uses Particle Types. We need to map them to Chem Lab IDs (e.g., 'water' -> 'water', but maybe 'HYDROGEN' -> 'hydrogen')
    // Actually, Chemistry Lab uses specific IDs in `chemicals.js`.
    // Let's assume standard IDs for now or use a mapper.
    // Ideally, we standardize IDs across the app, but for now we map.
    
    // Simple mapper for now, assuming IDs might match or we use the old map inverted?
    // The old map was inventoryKey -> chemKey.
    // e.g. 'water' -> 'H2O' (Wait, in particles.js it is 'water', in chemicals.js it is 'water' too? No, chemicals.js has 'water' as key, but formula H2O.
    // Let's check chemicals.js again.
    
    // Checking previous file read of chemicals.js:
    // 'water': { id: 'water', ... }
    // 'sodium-chloride': { id: 'sodium-chloride', ... }
    // So the IDs match Particle Types mostly!
    
    addToVessel(activeVesselId, itemId, amount);
  };

  return (
    <div className="w-full h-full bg-gray-900 border-t border-gray-800 z-20">
       <ResourceExchange 
         labName="Chemistry Lab"
         onImport={handleImport}
         allowedCategories={['Atomic', 'Molecular']}
         excludedCategories={['Fundamental']} // No Quarks
       />
    </div>
  );
};

export default Pantry;