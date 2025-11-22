import React, { useState } from 'react';
import { useStore } from '../store';
import { useFusion } from '../hooks/useFusion';

const StellarNursery = () => {
  const { isStellarNurseryVisible, setIsStellarNurseryVisible } = useStore();
  const { handleFusion } = useFusion();
  const [temperature, setTemperature] = useState(0);
  const [pressure, setPressure] = useState(0);

  if (!isStellarNurseryVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setIsStellarNurseryVisible(false)}>
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-3/4 h-3/4 flex flex-col" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-center mb-4">Stellar Nursery</h3>
        
        <div className="flex-grow flex items-center justify-center">
          {/* Star display */}
          <div className="w-64 h-64 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-black font-bold text-2xl">Protostar</span>
          </div>
        </div>

        <div className="flex justify-around items-center p-4">
          <div>
            <label className="block text-center text-white font-bold">Temperature (K)</label>
            <input
              type="range"
              min="0"
              max="100000000"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-64"
            />
            <div className="text-center text-white">{temperature} K</div>
          </div>
          <div>
            <label className="block text-center text-white font-bold">Pressure (Pa)</label>
            <input
              type="range"
              min="0"
              max="100000000"
              value={pressure}
              onChange={(e) => setPressure(e.target.value)}
              className="w-64"
            />
            <div className="text-center text-white">{pressure} Pa</div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleFusion}
            className="px-6 py-2 text-white font-bold rounded-lg shadow-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Initiate Fusion
          </button>
        </div>

        <button
          onClick={() => setIsStellarNurseryVisible(false)}
          className="absolute top-4 right-4 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StellarNursery;