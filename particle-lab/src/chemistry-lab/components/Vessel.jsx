import React, { useMemo, useState } from 'react';
import { useChemistryStore } from '../store';
import { CHEMICALS } from '../data/chemicals';
import QuantityModal from './QuantityModal';

const Vessel = ({ id, hasTempControl, hasPressureControl }) => {
  const vessel = useChemistryStore(state => state.vessels[id]);
  const addToVessel = useChemistryStore(state => state.addToVessel);
  const setVesselControl = useChemistryStore(state => state.setVesselControl);
  const clearVessel = useChemistryStore(state => state.clearVessel);
  const bottleVessel = useChemistryStore(state => state.bottleVessel);

  const [modalState, setModalState] = useState({ isOpen: false, chemicalId: null });

  const handleDrop = (e) => {
    e.preventDefault();
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

  const fluidColor = useMemo(() => {
    if (totalVolume === 0) return 'transparent';
    const entries = Object.entries(vessel.contents);
    if (entries.length === 0) return 'transparent';
    
    // Find the chemical with the most volume to determine dominant color
    const dominant = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return CHEMICALS[dominant[0]]?.color || '#3b82f6';
  }, [vessel.contents, totalVolume]);

  const handleBottle = () => {
    bottleVessel(id);
  };

  return (
    <>
      <QuantityModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, chemicalId: null })}
        onConfirm={handleConfirmPour}
        chemicalName={CHEMICALS[modalState.chemicalId]?.name || 'Unknown'}
      />
      
      <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-lg min-w-[200px]">
        <h3 className="text-gray-200 font-bold tracking-wide">{vessel.name}</h3>
        
        <div 
          className="relative w-32 h-40 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-b-2xl rounded-t-md overflow-hidden backdrop-blur-md shadow-inner group"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div 
            className="absolute bottom-0 w-full transition-all duration-500 ease-out"
            style={{ 
              height: `${fillPercentage}%`, 
              backgroundColor: fluidColor, 
              opacity: 0.8,
              boxShadow: `0 0 20px ${fluidColor}`
            }} 
          />
          
          {vessel.temp > 80 && totalVolume > 0 && (
              <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-50 animate-pulse">
                  <span className="text-white">°ºo O</span>
              </div>
          )}

          <div className="absolute top-2 w-full text-center text-xs text-white/70 font-mono pointer-events-none drop-shadow-md">
            {totalVolume > 0 ? `${totalVolume}ml` : 'Empty'}
          </div>
          
          {totalVolume > 0 && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={handleBottle}
                className="bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg transform hover:scale-105 transition-all"
                title="Collect Sample"
              >
                Bottle This
              </button>
            </div>
          )}
        </div>

        <div className="w-full space-y-3 mt-2 bg-gray-900/50 p-2 rounded-lg">
          {hasTempControl && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>TEMP</span>
                  <span className={vessel.temp > 100 ? 'text-red-400' : 'text-blue-400'}>{vessel.temp}°C</span>
              </div>
              <input 
                type="range" min="0" max="500" value={vessel.temp} 
                onChange={(e) => setVesselControl(id, 'temp', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          )}
          {hasPressureControl && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>PRESSURE</span>
                  <span className="text-purple-400">{vessel.pressure} atm</span>
              </div>
              <input 
                type="range" min="1" max="100" value={vessel.pressure} 
                onChange={(e) => setVesselControl(id, 'pressure', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          )}
          <button 
              onClick={() => clearVessel(id)} 
              className="text-xs text-red-400 hover:text-red-300 w-full text-center hover:bg-red-900/20 py-1 rounded transition-colors"
          >
              Dump Contents
          </button>
        </div>
      </div>
    </>
  );
};

export default Vessel;