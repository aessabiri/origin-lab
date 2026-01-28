import React from 'react';
import { useBioStore } from '../store';
import { PARTICLE_TYPES } from '../../constants/particles';
import ResourceExchange from '../../components/ResourceExchange.jsx';

const BioLabInventory = () => {
  const soup = useBioStore(state => state.soup);
  const updateSoup = useBioStore(state => state.updateSoup);
  
  // Mapping Global Items to Bio Resources
  const RESOURCE_MAP = {
    [PARTICLE_TYPES.GLUCOSE]: 'glucose',
    [PARTICLE_TYPES.FRUCTOSE]: 'glucose',
    [PARTICLE_TYPES.GLYCINE]: 'aminoAcids',
    [PARTICLE_TYPES.ALANINE]: 'aminoAcids',
    [PARTICLE_TYPES.SERINE]: 'aminoAcids',
    [PARTICLE_TYPES.CYSTEINE]: 'aminoAcids',
    [PARTICLE_TYPES.VALINE]: 'aminoAcids',
    [PARTICLE_TYPES.LEUCINE]: 'aminoAcids',
    [PARTICLE_TYPES.PHENYLALANINE]: 'aminoAcids',
    [PARTICLE_TYPES.FATTY_ACID]: 'lipids',
    [PARTICLE_TYPES.LIPID]: 'lipids',
    [PARTICLE_TYPES.GLYCEROL]: 'lipids',
  };

  const handleImport = (itemId, amount) => {
    const targetResource = RESOURCE_MAP[itemId];
    
    if (!targetResource) {
      alert("This item cannot be processed by the Biology Lab yet.");
      return;
    }

    updateSoup({
      [targetResource]: (soup[targetResource] || 0) + amount
    });
  };

  return (
    <div className="flex h-full gap-6">
      {/* LEFT: Unified Exchange */}
      <div className="flex-1">
         <ResourceExchange 
            labName="Biology Lab"
            onImport={handleImport}
            allowedCategories={['Biochemistry', 'Molecular']}
            // Restriction: No Oxygen atoms or simple atoms.
            excludedCategories={['Atomic']} 
            excludedTypes={[PARTICLE_TYPES.OXYGEN_GAS, PARTICLE_TYPES.NITROGEN_GAS]} 
         />
      </div>

      {/* RIGHT: Bio Lab Storage (Soup) */}
      <div className="w-1/3 bg-teal-900/20 rounded-xl border border-teal-600/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-teal-600/30 bg-teal-800/20">
          <h3 className="text-xl font-bold text-teal-200">Petri Dish Supply</h3>
          <p className="text-xs text-teal-400">Nutrient Broth Composition</p>
        </div>
        <div className="p-6 grid gap-4">
           <ResourceStat name="Glucose (Energy)" value={soup.glucose} unit="mol" color="text-yellow-400" />
           <ResourceStat name="Amino Acids (Building)" value={soup.aminoAcids} unit="mol" color="text-purple-400" />
           <ResourceStat name="Lipids (Membrane)" value={soup.lipids} unit="mol" color="text-orange-400" />
        </div>
      </div>
    </div>
  );
};

const ResourceStat = ({ name, value, unit, color }) => (
  <div className="bg-black/30 p-4 rounded-lg flex justify-between items-center border border-white/5">
    <span className="text-gray-400 font-medium">{name}</span>
    <span className={`text-2xl font-mono font-bold ${color}`}>
      {Math.floor(value)} <span className="text-sm text-gray-600 ml-1">{unit}</span>
    </span>
  </div>
);

export default BioLabInventory;
