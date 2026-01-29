import React, { useMemo, useState } from 'react';
import { useChemistryStore } from '../store';
import { CHEMICALS } from '../data/chemicals';
import { VESSEL_STATS } from '../data/constants';
import { calculatePH, calculateMixtureColor, calculatePrecipitates } from '../logic/chemistry';
import QuantityModal from './QuantityModal';
import Condenser from './Condenser';
import VesselVisuals from './VesselVisuals';
import VesselControls from './VesselControls';
import VesselMonitor from './VesselMonitor';

const Vessel = ({ id, hasTempControl, hasPressureControl, hasCondenser }) => {
  const vessel = useChemistryStore(state => state.vessels[id]);
  const addToVessel = useChemistryStore(state => state.addToVessel);
  const bottleVessel = useChemistryStore(state => state.bottleVessel);
  const repairVessel = useChemistryStore(state => state.repairVessel);
  const upgradeVessel = useChemistryStore(state => state.upgradeVessel);

  const [modalState, setModalState] = useState({ isOpen: false, chemicalId: null });
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  
  const currentStats = VESSEL_STATS[vessel.type || (id === 'chamber' ? 'reinforced' : 'glass')] || VESSEL_STATS.glass;

  const handleDrop = (e) => {
    e.preventDefault();
    if (vessel.status === 'broken') return;
    if (!vessel.isOpen) return; 
    const chemicalId = e.dataTransfer.getData('chemicalId');
    if (chemicalId) {
      setModalState({ isOpen: true, chemicalId });
    }
  };

  const handleConfirmPour = (amount) => {
    if (modalState.chemicalId) {
      addToVessel(id, modalState.chemicalId, amount);
    }
    setModalState({ isOpen: false, chemicalId: null });
  };

  const handleDragOver = (e) => e.preventDefault();

  const totalVolume = Object.values(vessel.contents).reduce((a, b) => a + b, 0);
  const fillPercentage = Math.min((totalVolume / vessel.maxVol) * 100, 100);

  const phValue = useMemo(() => calculatePH(vessel.contents), [vessel.contents]);
  
  const { dissolved, precipitates } = useMemo(() => calculatePrecipitates(vessel.contents, vessel.temp), [vessel.contents, vessel.temp]);
  const hasPrecipitate = Object.keys(precipitates).length > 0;

  const fluidColor = useMemo(() => {
    return calculateMixtureColor(dissolved, phValue); 
  }, [dissolved, phValue]);

  // Naming Logic
  const mixtureName = useMemo(() => {
     if (hasPrecipitate) return 'Saturated / Precipitate';
     
     const entries = Object.entries(vessel.contents);
     if (entries.length === 0) return 'Empty';
     
     const sorted = entries.sort((a, b) => b[1] - a[1]);
     const dominantId = sorted[0][0];
     const dominant = CHEMICALS[dominantId];
     if (!dominant) return 'Unknown';

     // Determine effective state
     let effectiveState = dominant.state;
     if (dominant.meltingPoint !== undefined) {
         effectiveState = vessel.temp < dominant.meltingPoint ? 'solid' : 'liquid';
     }
     if (dominant.boilingPoint !== undefined && vessel.temp >= dominant.boilingPoint) {
         effectiveState = 'gas';
     }

     if (dominantId === 'H2O' && entries.length > 1 && effectiveState === 'liquid') {
        const soluteId = sorted[1][0];
        const solute = CHEMICALS[soluteId];
        return `Aq. ${solute?.name || 'Solution'}`;
     }
     
     if (effectiveState === 'solid') return `${dominant.name} (Solid)`;
     if (effectiveState === 'gas') return `${dominant.name} (Gas)`;
     return `${dominant.name} Mix`;
  }, [vessel.contents, vessel.temp, hasPrecipitate]);

  const handleBottle = () => {
    bottleVessel(id);
  };

  if (vessel.status === 'broken') {
      return (
          <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-xl border border-red-900/50 shadow-lg min-w-[200px] h-[400px] justify-center opacity-75 relative">
             <div className="text-red-500 font-bold animate-pulse text-sm tracking-widest">CRITICAL FAILURE</div>
             <div className="text-6xl filter grayscale brightness-50">⚗️</div>
             <p className="text-xs text-gray-500 text-center px-2">
                Vessel destroyed by {vessel.pressure > currentStats.maxPress ? 'overpressure' : 'thermal shock'}.
             </p>
             <button 
                onClick={() => repairVessel(id)}
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors border border-gray-600"
             >
                Replace Glassware
             </button>
             
             <button 
                onClick={() => setShowUpgradeMenu(true)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-white"
             >
                 ⚙️
             </button>
             
             {showUpgradeMenu && (
                <div className="absolute top-10 right-0 z-50 bg-gray-800 p-4 rounded-xl border border-gray-600 w-64 shadow-2xl text-left">
                    <h3 className="text-sm font-bold text-white mb-2">Replace With...</h3>
                    <div className="space-y-2">
                        {Object.entries(VESSEL_STATS).map(([typeKey, stat]) => (
                            <button
                                key={typeKey}
                                onClick={() => { upgradeVessel(id, typeKey); setShowUpgradeMenu(false); }}
                                className="w-full text-left p-2 rounded border border-gray-700 hover:bg-gray-700 text-xs text-gray-300"
                            >
                                <div className="font-bold">{stat.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
             )}
          </div>
      )
   }

  return (
    <>
      <QuantityModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, chemicalId: null })}
        onConfirm={handleConfirmPour}
        chemicalName={CHEMICALS[modalState.chemicalId]?.name || 'Unknown'}
      />
      
      {showUpgradeMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeMenu(false)}>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Upgrade Vessel</h3>
                    <button onClick={() => setShowUpgradeMenu(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <div className="space-y-3">
                    {Object.entries(VESSEL_STATS).map(([typeKey, stat]) => (
                        <button
                            key={typeKey}
                            onClick={() => { upgradeVessel(id, typeKey); setShowUpgradeMenu(false); }}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all relative overflow-hidden ${vessel.type === typeKey ? 'bg-amber-500/10 border-amber-500' : 'bg-gray-750 border-gray-700 hover:border-gray-500 hover:bg-gray-700'}`}
                        >
                            <div className="flex justify-between items-center relative z-10">
                                <span className={`font-bold ${vessel.type === typeKey ? 'text-amber-400' : 'text-gray-200'}`}>{stat.name}</span>
                                {vessel.type === typeKey && <span className="text-amber-500">✓</span>}
                            </div>
                            <div className="text-xs text-gray-400 mt-2 grid grid-cols-2 gap-2 relative z-10">
                                <span className="flex items-center gap-1">🌡️ Max {stat.maxTemp}°C</span>
                                <span className="flex items-center gap-1">⏲️ Max {stat.maxPress} atm</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
      
      <div className="flex flex-col items-center gap-2 relative">
        <VesselMonitor 
            id={id}
            vessel={vessel}
            totalVolume={totalVolume}
            phValue={phValue}
            mixtureName={mixtureName}
            onConfigure={() => setShowUpgradeMenu(true)}
        />

        {/* Cable */}
        <div className="w-1 h-4 bg-gray-700 absolute top-[76px] z-0"></div>

        <div className={`flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-xl border-2 shadow-lg min-w-[220px] z-10 transition-colors duration-500 ${currentStats.style}`}>
          {/* Lid Status Indicator */}
          <div className="absolute top-2 right-2 z-20">
             <span className={`text-[10px] px-1 rounded ${vessel.isOpen ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400 border border-red-800'}`}>
                {vessel.isOpen ? 'OPEN' : 'SEALED'}
             </span>
          </div>

          {/* The Vessel Container */}
          <div className={`flex items-end ${hasCondenser ? 'min-w-[200px] pr-12' : ''}`}>
              <div 
                className="relative w-32 h-40 z-10"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <VesselVisuals 
                    variant={vessel.variant || 'flask'} 
                    fillPercentage={fillPercentage} 
                    fluidColor={fluidColor}
                    hasPrecipitate={hasPrecipitate}
                >
                    {/* Visual Effects Layer - passed as children */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* 1. Standard Boiling Bubbles */}
                        {vessel.temp > 95 && totalVolume > 0 && (
                            <div className="absolute bottom-0 w-full h-full flex items-end justify-around pb-2 opacity-40">
                                <div className="animate-bounce delay-75 w-2 h-2 bg-white rounded-full" />
                                <div className="animate-bounce delay-200 w-1 h-1 bg-white rounded-full" />
                                <div className="animate-bounce delay-500 w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                        )}

                        {/* 2. Reaction Specific Visuals */}
                        {vessel.activeVisual === 'bubble' && (
                            <div className="absolute bottom-0 w-full h-full flex items-end justify-around pb-4">
                                {[...Array(6)].map((_, i) => (
                                    <div 
                                        key={i}
                                        className="w-1.5 h-1.5 bg-white/60 rounded-full animate-[ping_1.5s_infinite]"
                                        style={{ animationDelay: `${i * 0.2}s`, left: `${i * 15}%` }}
                                    />
                                ))}
                            </div>
                        )}

                        {vessel.activeVisual === 'fume' && (
                            <div className="absolute top-0 w-full h-1/2 flex justify-center opacity-60">
                                <div className="w-12 h-20 bg-gradient-to-t from-white/20 to-transparent blur-xl animate-pulse" />
                            </div>
                        )}

                        {vessel.activeVisual === 'steam' && (
                            <div className="absolute top-0 w-full h-full flex flex-col items-center pt-2 opacity-80">
                                <div className="w-16 h-10 bg-white/20 blur-lg rounded-full animate-bounce" />
                                <div className="w-10 h-8 bg-white/10 blur-md rounded-full animate-pulse delay-75" />
                            </div>
                        )}

                        {vessel.activeVisual === 'solidify' && (
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] animate-pulse" />
                        )}

                        {vessel.activeVisual === 'distill' && (
                            <div className="absolute top-0 w-full h-full">
                                <div className="absolute right-2 top-4 w-1 h-2 bg-white/40 rounded-full animate-bounce" />
                                <div className="absolute right-4 top-8 w-1 h-2 bg-white/40 rounded-full animate-bounce delay-100" />
                            </div>
                        )}
                    </div>

                    {/* Label Overlay */}
                    <div className="absolute top-2 w-full flex justify-center opacity-50">
                        <span className="text-[10px] font-mono text-white/50 bg-black/20 px-1 rounded">{currentStats.name.split(' ')[0]}</span>
                    </div>
                    
                    {/* Bottle Button */}
                    {totalVolume > 0 && vessel.isOpen && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-auto">
                        <button 
                          onClick={handleBottle}
                          className="bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg transform hover:scale-105 transition-all"
                        >
                          Bottle
                        </button>
                      </div>
                    )}
                </VesselVisuals>
              </div>
              
              {/* Attached Condenser */}
              {hasCondenser && <Condenser connectedVesselId={id} />}
          </div>

          <VesselControls 
            id={id}
            hasTempControl={hasTempControl}
            vessel={vessel}
            currentStats={currentStats}
          />
        </div>
      </div>
    </>
  );
};

export default Vessel;