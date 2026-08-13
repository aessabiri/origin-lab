import React from 'react';
import { getUniversalItemInfo } from '../../utils/codexData.js';
import ParticleIcon from './ParticleIcon.jsx';

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="py-2 border-b border-gray-700 flex justify-between">
      <span className="font-semibold text-gray-400 capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}: </span>
      <span className="font-mono text-gray-200">{value}</span>
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-md" onClick={onClose}>
      <div className="bg-gray-900 text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-4xl w-full border border-gray-700/50 flex flex-col md:flex-row overflow-hidden relative" onClick={e => e.stopPropagation()}>
        
        {/* Close Button (Icon) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-red-600/80 transition-all border border-gray-700"
        >
          ✖
        </button>

        {/* LEFT: Hero Visual */}
        <div className="w-full md:w-1/2 bg-black/40 flex flex-col items-center justify-center p-12 relative overflow-hidden group">
           {/* Dynamic Background Glow */}
           <div className={`absolute inset-0 opacity-20 blur-[100px] transition-all duration-1000 ${info.source === 'Chemistry' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
           
           <div className="w-64 h-64 relative z-10 animate-float-slow hover:scale-110 transition-transform duration-500">
              <ParticleIcon type={particleType} color={info.color} />
           </div>

           <div className="mt-12 text-center relative z-10">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 inline-block">Molecular_Structure</span>
              <h2 className="text-4xl font-black tracking-tighter text-white drop-shadow-2xl">{info.name}</h2>
           </div>
        </div>

        {/* RIGHT: Technical Data */}
        <div className="w-full md:w-1/2 p-10 flex flex-col bg-gray-900 border-l border-gray-800">
           {/* Source Badge */}
           <div className="flex items-center gap-3 mb-6">
              <div className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-[9px] font-black text-blue-400 uppercase tracking-widest">
                {info.source || 'Database'}
              </div>
              <div className="px-2 py-1 bg-amber-600/20 border border-amber-500/30 rounded text-[9px] font-black text-amber-400 uppercase tracking-widest">
                {info.category}
              </div>
           </div>

           <div className="flex-1 space-y-8">
              <section>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Functional Description</h3>
                <p className="text-lg leading-relaxed text-gray-300 font-medium">
                  {info.description}
                </p>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Technical Registry</h3>
                <div className="grid grid-cols-1 gap-1 bg-black/20 p-4 rounded-xl border border-gray-800">
                  {detailKeys.map(key => (
                    <InfoRow key={key} label={key} value={info[key]} />
                  ))}
                </div>
              </section>
           </div>

           <button 
             onClick={onClose} 
             className="mt-10 w-full px-4 py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-600 hover:to-blue-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]"
           >
             Acknowledge Data
           </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;