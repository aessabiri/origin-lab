import React from 'react';

const CellBuilder = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-center p-10 border-2 border-dashed border-indigo-800 rounded-3xl bg-indigo-900/10">
        <h2 className="text-4xl font-bold text-indigo-500 mb-4">LUCA Assembly Bay</h2>
        <p className="text-slate-400 mb-8">Design the Last Universal Common Ancestor component by component.</p>
        <div className="w-64 h-64 mx-auto bg-black rounded-full border border-indigo-500/30 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
             <div className="w-32 h-32 bg-indigo-600/20 rounded-full border border-indigo-400/50 flex items-center justify-center">
                <span className="text-4xl">🦠</span>
             </div>
        </div>
        <p className="mt-8 text-sm text-indigo-400/60 font-mono">Module Status: ONLINE</p>
      </div>
    </div>
  );
};

export default CellBuilder;
