import React, { useState, useEffect } from 'react';

const QuantityModal = ({ isOpen, onClose, onConfirm, chemicalName }) => {
  const [amount, setAmount] = useState(50);

  useEffect(() => {
    if (isOpen) setAmount(50);
  }, [isOpen]);

  if (!isOpen) return null;

  const presets = [10, 25, 50, 100, 250, 500];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[#0b1224] border border-emerald-500/40 rounded-3xl p-6 w-96 shadow-[0_20px_70px_rgba(0,0,0,0.9)] transform transition-all scale-100 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Hologram Scanline & Background Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] [background-size:100%_4px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧪</span>
            <div>
              <h3 className="text-sm font-mono font-black uppercase text-slate-100">Dispense Reagent</h3>
              <span className="text-xs font-bold text-emerald-400 truncate max-w-[200px] block">{chemicalName}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Main Dispensing Controls */}
        <div className="flex flex-col gap-5 my-5 relative z-10">
          
          {/* Digital Quantity Display */}
          <div className="flex justify-between items-center bg-[#060b17] border border-slate-800 p-3.5 rounded-2xl shadow-inner">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">Volume to Pour</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                {amount}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">mL</span>
            </div>
          </div>

          {/* Graduated Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="500"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
              <span>1 ml</span>
              <span>250 ml</span>
              <span>500 ml</span>
            </div>
          </div>
          
          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-6 gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  amount === preset 
                    ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Incremental Adjusters */}
          <div className="flex gap-2">
            <button
              onClick={() => setAmount(Math.max(1, amount - 10))}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold border border-slate-700 transition-colors"
            >
              -10 ml
            </button>
            <button
              onClick={() => setAmount(Math.max(1, amount - 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold border border-slate-700 transition-colors"
            >
              -1
            </button>
            <button
              onClick={() => setAmount(Math.min(500, amount + 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold border border-slate-700 transition-colors"
            >
              +1
            </button>
            <button
              onClick={() => setAmount(Math.min(500, amount + 10))}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold border border-slate-700 transition-colors"
            >
              +10 ml
            </button>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-slate-800 relative z-10">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-2xl font-mono text-xs font-bold transition-colors border border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(amount)}
            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-2xl font-mono text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 border border-emerald-300/40"
          >
            Pour Into Vessel
          </button>
        </div>

      </div>
    </div>
  );
};

export default React.memo(QuantityModal);

