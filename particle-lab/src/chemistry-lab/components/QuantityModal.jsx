import React, { useState, useEffect } from 'react';

const QuantityModal = ({ isOpen, onClose, onConfirm, chemicalName }) => {
  const [amount, setAmount] = useState(50);

  // Reset amount when modal opens
  useEffect(() => {
    if (isOpen) setAmount(50);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-800 border-2 border-amber-500/50 rounded-xl p-6 w-80 shadow-2xl transform transition-all scale-100"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-4">Add {chemicalName}</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-gray-900 p-2 rounded">
            <span className="text-gray-400 text-sm">Amount</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-bold text-amber-400">{amount}</span>
              <span className="text-xs text-gray-500">mL</span>
            </div>
          </div>

          <input
            type="range"
            min="1"
            max="500"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setAmount(Math.max(1, amount - 10))}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white font-bold"
            >
              -10
            </button>
            <button
              onClick={() => setAmount(Math.min(500, amount + 10))}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-white font-bold"
            >
              +10
            </button>
             <button
              onClick={() => setAmount(100)}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 text-xs ml-auto"
            >
              100ml
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(amount)}
            className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold shadow-lg shadow-amber-900/20 transition-colors"
          >
            Pour
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;
