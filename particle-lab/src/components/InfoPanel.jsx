import React from 'react';
import { PARTICLE_INFO } from '../constants/particleInfo.js';
import { PARTICLE_NAMES } from '../constants/particles.js';

const InfoPanel = ({ particleType, onClose }) => {
  if (!particleType) return null;

  const info = PARTICLE_INFO[particleType];

  if (!info) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold text-amber-300 mb-4">{PARTICLE_NAMES[particleType]}</h2>
          <p className="text-gray-400">No detailed information available for this particle yet.</p>
          <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold">Close</button>
        </div>
      </div>
    );
  }

  const InfoRow = ({ label, value }) => value ? (
    <div className="py-2 border-b border-gray-700">
      <span className="font-semibold text-gray-400">{label}: </span>
      <span className="font-mono">{value}</span>
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-amber-300">{info.name}</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-white">&times;</button>
        </div>

        <p className="italic text-gray-400 mb-6">{info.category}</p>

        <div className="space-y-2 mb-6">
          <InfoRow label="Mass" value={info.mass} />
          <InfoRow label="Charge" value={info.charge} />
          <InfoRow label="Spin" value={info.spin} />
          <InfoRow label="Composition" value={info.composition} />
        </div>

        <p className="text-lg leading-relaxed">{info.description}</p>

        <button onClick={onClose} className="mt-8 w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;