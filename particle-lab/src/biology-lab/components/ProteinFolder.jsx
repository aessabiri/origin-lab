import React from 'react';

const ProteinFolder = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-center p-10 border-2 border-dashed border-teal-800 rounded-3xl bg-teal-900/10">
        <h2 className="text-4xl font-bold text-teal-500 mb-4">Protein Folding Engine</h2>
        <p className="text-slate-400 mb-8">Sequence amino acids and watch them fold into functional nanomachines.</p>
        <div className="w-64 h-64 mx-auto bg-black rounded-full border border-teal-500/30 flex items-center justify-center">
            <span className="animate-pulse text-6xl">🧬</span>
        </div>
        <p className="mt-8 text-sm text-teal-400/60 font-mono">Module Status: ONLINE</p>
      </div>
    </div>
  );
};

export default ProteinFolder;
