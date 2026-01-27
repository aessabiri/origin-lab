import React from 'react';
import { getUniversalItemInfo } from '../utils/codexData';

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="py-2 border-b border-gray-700">
      <span className="font-semibold text-gray-400 capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}: </span>
      <span className="font-mono">{value}</span>
    </div>
  );
};

const InfoPanel = ({ particleType, onClose }) => {
  if (!particleType) return null;

  const info = getUniversalItemInfo(particleType);

  if (info.name === 'Unknown') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold text-amber-300 mb-4">Unknown Particle</h2>
          <p className="text-gray-400">No detailed information available for ID: {particleType}</p>
          <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 font-bold">
            Close
          </button>
        </div>
      </div>
    );
  }

  // Filter out keys we don't want to show in the generic list or that have special handling
  const ignoredKeys = ['name', 'description', 'color', 'category', 'source', 'isChemical', 'size', 'iconType', 'state'];
  const detailKeys = Object.keys(info).filter(key => !ignoredKeys.includes(key));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-2xl max-w-lg w-full border border-gray-700 relative" onClick={e => e.stopPropagation()}>
        
        {/* Source Badge */}
        <div className="absolute top-4 right-4 px-2 py-1 bg-gray-700 rounded text-xs font-bold text-gray-300 uppercase tracking-wider">
           {info.source || 'Database'}
        </div>

        <div className="flex justify-between items-start mb-2">
          <h2 className={`text-3xl font-bold ${info.source === 'Chemistry' ? 'text-emerald-400' : 'text-amber-300'}`}>
            {info.name}
          </h2>
        </div>
        
        <p className="italic text-gray-400 mb-6 text-sm flex items-center gap-2">
           <span className={`w-3 h-3 rounded-full inline-block ${typeof info.color === 'string' && info.color.startsWith('#') ? '' : info.color}`} style={typeof info.color === 'string' && info.color.startsWith('#') ? { backgroundColor: info.color } : {}}></span>
           {info.category}
        </p>

        <div className="space-y-1 mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          {detailKeys.map(key => (
            <InfoRow key={key} label={key} value={info[key]} />
          ))}
        </div>

        <p className="text-lg leading-relaxed text-gray-300 mb-8">{info.description}</p>
        
        <button onClick={onClose} className="w-full px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 font-bold transition-colors shadow-lg">
          Close Panel
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;