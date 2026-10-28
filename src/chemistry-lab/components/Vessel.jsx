import React, { useMemo, useState } from 'react';
import { useChemistryStore } from '../store';
import { MATTER_DEFINITIONS } from '../../constants/matterRegistry';
import { VESSEL_STATS } from '../data/constants';
import { calculatePH, calculateMixtureColor, calculatePrecipitates, calculateMultiPhase } from '../logic/chemistry';
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
  const [isDragOver, setIsDragOver] = useState(false);
  
  const currentStats = VESSEL_STATS[vessel?.type || (id === 'chamber' ? 'reinforced' : 'glass')] || VESSEL_STATS.glass;

  if (!vessel) return null;

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const multiPhase = useMemo(() => {
    return calculateMultiPhase(vessel.contents || {}, vessel.temp, vessel.pressure);
  }, [vessel.contents, vessel.temp, vessel.pressure]);

  const totalVolume = Object.values(vessel.contents || {}).reduce((a, b) => a + b, 0);
  const fillPercentage = Math.min((totalVolume / (vessel.maxVol || 500)) * 100, 100);

  const phValue = multiPhase.phValue;
  const hasPrecipitate = multiPhase.hasPrecipitate;
  const fluidColor = multiPhase.aqueousColor;

  // Dynamic naming logic
  const mixtureName = useMemo(() => {
    if (hasPrecipitate) return 'Saturated / Precipitate';
    
    const entries = Object.entries(vessel.contents || {});
    if (entries.length === 0) return 'Empty Vessel';
    
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const dominantId = sorted[0][0];
    const dominant = MATTER_DEFINITIONS[dominantId];
    if (!dominant) return 'Unknown Substance';

    let effectiveState = dominant.state;
    if (dominant.meltingPoint !== undefined) {
      effectiveState = vessel.temp < dominant.meltingPoint ? 'solid' : 'liquid';
    }
    if (dominant.boilingPoint !== undefined && vessel.temp >= dominant.boilingPoint) {
      effectiveState = 'gas';
    }

    if (dominantId === 'water' && entries.length > 1 && effectiveState === 'liquid') {
      const soluteId = sorted[1][0];
      const solute = MATTER_DEFINITIONS[soluteId];
      return `Aq. ${solute?.name || 'Solution'}`;
    }
    
    if (effectiveState === 'solid') return `${dominant.name} (Solid)`;
    if (effectiveState === 'gas') return `${dominant.name} (Vapor)`;
    return `${dominant.name} Mix`;
  }, [vessel.contents, vessel.temp, hasPrecipitate]);

  const handleBottle = () => {
    bottleVessel(id);
  };

  // --- CRITICAL FAILURE DISPLAY ---
  if (vessel.status === 'broken') {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-[#1a080c]/90 backdrop-blur-xl rounded-3xl border-2 border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.3)] min-w-[240px] h-[480px] justify-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15)_0,transparent_70%)] pointer-events-none" />
        
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-bounce">
          💥
        </div>

        <div className="text-center space-y-1 relative z-10">
          <div className="text-rose-400 font-mono font-black text-xs tracking-widest uppercase">
            STRUCTURAL BREACH
          </div>
          <p className="text-[11px] text-slate-400 font-sans max-w-[200px] leading-snug">
            Vessel ruptured due to {vessel.pressure > currentStats.maxPress ? 'overpressure' : 'thermal shock'}.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[180px] relative z-10 mt-2">
          <button 
            onClick={() => repairVessel(id)}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold transition-all border border-slate-600 hover:border-slate-400 active:scale-95 shadow-lg"
          >
            Reconstruct Glassware
          </button>
          
          <button 
            onClick={() => setShowUpgradeMenu(true)}
            className="w-full py-2 px-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-mono font-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95"
          >
            Upgrade Alloy ⚙️
          </button>
        </div>

        {/* Upgrade Selection Modal */}
        {showUpgradeMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={() => setShowUpgradeMenu(false)}>
            <div className="bg-[#0b101f] p-6 rounded-3xl border border-slate-700 w-80 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-sm font-mono font-black uppercase text-slate-200">Select Apparatus Material</h3>
                <button onClick={() => setShowUpgradeMenu(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="space-y-2">
                {Object.entries(VESSEL_STATS).map(([typeKey, stat]) => (
                  <button
                    key={typeKey}
                    onClick={() => { upgradeVessel(id, typeKey); setShowUpgradeMenu(false); }}
                    className="w-full text-left p-3 rounded-xl border border-slate-800 hover:border-emerald-500/50 bg-[#070d18] hover:bg-[#0c1628] transition-all flex flex-col gap-1"
                  >
                    <div className="font-bold text-xs text-slate-200">{stat.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                      <span>Max {stat.maxTemp}°C</span>
                      <span>Max {stat.maxPress} atm</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <QuantityModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, chemicalId: null })}
        onConfirm={handleConfirmPour}
        chemicalName={MATTER_DEFINITIONS[modalState.chemicalId]?.name || 'Chemical'}
      />
      
      {/* Vessel Configuration / Upgrade Modal */}
      {showUpgradeMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={() => setShowUpgradeMenu(false)}>
          <div className="bg-[#0c1222] p-6 rounded-3xl border border-emerald-500/30 w-88 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-4 animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-mono font-black uppercase tracking-wider text-slate-100">Vessel Configuration</h3>
                <span className="text-[10px] text-slate-400">Upgrade material tolerances</span>
              </div>
              <button onClick={() => setShowUpgradeMenu(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <div className="space-y-2.5">
              {Object.entries(VESSEL_STATS).map(([typeKey, stat]) => {
                const isSelected = (vessel.type || 'glass') === typeKey;
                return (
                  <button
                    key={typeKey}
                    onClick={() => { upgradeVessel(id, typeKey); setShowUpgradeMenu(false); }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-[#070c18] border-slate-800 hover:border-slate-600 hover:bg-[#0c1527]'
                    }`}
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <span className={`font-mono font-bold text-xs ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {stat.name}
                      </span>
                      {isSelected && <span className="text-emerald-400 text-xs font-black">ACTIVE</span>}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-2 grid grid-cols-2 gap-2 relative z-10">
                      <span className="flex items-center gap-1">🌡️ Max: {stat.maxTemp}°C</span>
                      <span className="flex items-center gap-1">⏲️ Max: {stat.maxPress} atm</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center gap-1.5 relative select-none">
        
        {/* Top Digital Telemetry Monitor */}
        <VesselMonitor 
          id={id}
          vessel={vessel}
          totalVolume={totalVolume}
          phValue={phValue}
          mixtureName={mixtureName}
          onConfigure={() => setShowUpgradeMenu(true)}
        />

        {/* Cable Connector Line */}
        <div className="w-1 h-3 bg-gradient-to-b from-slate-700 to-slate-800 z-0" />

        {/* Main Station Pedestal & Vessel Shell */}
        <div 
          className={`flex flex-col items-center gap-3 p-4 bg-[#0a1020]/90 backdrop-blur-2xl rounded-3xl border-2 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.7)] min-w-[240px] z-10 relative group ${
            isDragOver 
              ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-[#0d1830]' 
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          
          {/* Reaction Glassware Area */}
          <div className={`flex items-end ${hasCondenser ? 'min-w-[210px] pr-10' : ''}`}>
            
            <div 
              className="relative w-36 h-44 z-10 flex items-center justify-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              
              {/* Glassware Procedural Visuals */}
              <VesselVisuals 
                variant={vessel.variant || 'flask'} 
                fillPercentage={fillPercentage} 
                fluidColor={fluidColor}
                hasPrecipitate={hasPrecipitate}
                temp={vessel.temp}
                activeVisual={vessel.activeVisual}
                multiPhase={multiPhase}
              >
                {/* Floating Harvest / Bottle Action Overlay */}
                {totalVolume > 0 && vessel.isOpen && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center gap-2 pointer-events-auto backdrop-blur-[1px]">
                    <button 
                      onClick={handleBottle}
                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-[11px] font-mono font-black rounded-xl shadow-xl transform hover:scale-105 active:scale-95 transition-all border border-emerald-300/40"
                    >
                      BOTTLE SAMPLE ⚗️
                    </button>
                    <span className="text-[9px] font-mono text-emerald-200">
                      Yield: {Math.round(totalVolume)} mL
                    </span>
                  </div>
                )}
              </VesselVisuals>

              {/* Drag-over Reagent Guide */}
              {isDragOver && (
                <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-500/10 flex items-center justify-center pointer-events-none animate-pulse">
                  <span className="text-[11px] font-mono font-black text-emerald-300 bg-[#060b17]/90 px-3 py-1 rounded-full border border-emerald-400/50">
                    DROP TO POUR
                  </span>
                </div>
              )}

            </div>
            
            {/* Attached Distillation Condenser */}
            {hasCondenser && <Condenser />}
          </div>

          {/* Bottom Hardware Controls Console */}
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

export default React.memo(Vessel);