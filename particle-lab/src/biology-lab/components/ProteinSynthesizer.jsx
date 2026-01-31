import React, { useState, useMemo } from 'react';
import { useInventory } from '../../store/inventory';
import { PARTICLE_TYPES, PARTICLE_COLORS, PARTICLE_NAMES } from '../../constants/particles';
import { POLYPEPTIDE_RECIPES } from '../../constants/polypeptideRecipes';

const ProteinSynthesizer = ({ onClose }) => {
  const [chain, setChain] = useState([]);
  const [message, setMessage] = useState('');
  
  const { compounds, addResource, consumeResource } = useInventory();

  // Filter inventory for Amino Acids
  const availableAminoAcids = useMemo(() => {
    return Object.keys(compounds).filter(key => {
      // Simple heuristic: if it's in the molecule list and not common solvents/sugars, 
      // or check against a known list of AAs. 
      // Better: Check against PARTICLE_TYPES values that are AAs.
      const AA_KEYS = [
        'glycine', 'alanine', 'serine', 'valine', 'leucine', 'isoleucine',
        'cysteine', 'methionine', 'phenylalanine', 'tyrosine', 'tryptophan',
        'histidine', 'lysine', 'arginine', 'aspartic-acid', 'glutamic-acid',
        'asparagine', 'glutamine', 'threonine', 'proline'
      ];
      return AA_KEYS.includes(key) && compounds[key] > 0;
    });
  }, [compounds]);

  const addToChain = (aaType) => {
    if (chain.length >= 10) {
      setMessage('Chain limit reached (Max 10)');
      return;
    }
    setChain([...chain, aaType]);
    setMessage('');
  };

  const removeFromChain = (index) => {
    const newChain = [...chain];
    newChain.splice(index, 1);
    setChain(newChain);
  };

  const handleFold = () => {
    if (chain.length < 2) {
      setMessage('Chain too short to fold.');
      return;
    }

    // Find match
    const match = POLYPEPTIDE_RECIPES.find(recipe => {
      if (!recipe.sequence) return false; // Only match sequenced recipes for now
      if (recipe.sequence.length !== chain.length) return false;
      return recipe.sequence.every((type, i) => type === chain[i]);
    });

    if (match) {
      // Consume Ingredients
      // Group by type to check counts
      const required = {};
      chain.forEach(t => required[t] = (required[t] || 0) + 1);
      
      let hasIngredients = true;
      for (const [type, count] of Object.entries(required)) {
        if ((compounds[type] || 0) < count) hasIngredients = false;
      }

      if (hasIngredients) {
        // Consume
        for (const [type, count] of Object.entries(required)) {
           consumeResource('compounds', type, count); // Note: consumeResource currently just checks, doesn't subtract in "Infinite" mode? 
           // Wait, inventory.js said "As of Jan 2026, Resources are Infinite once unlocked".
           // So we don't strictly need to subtract, but we should verify availability.
        }
        
        // Add Product
        // If type is a string literal, we add it to 'compounds' anyway? 
        // We need to ensure the key exists in compounds or use a generic 'proteins' category.
        // For now, we'll add to 'compounds' if it exists in PARTICLE_TYPES, or just log success.
        
        if (Object.values(PARTICLE_TYPES).includes(match.type)) {
            addResource('compounds', match.type, 1);
        } else {
            // It's a custom protein not in the standard enum map yet.
            // We can add it to inventory but it might not show up in Codex unless we add it there.
            // For this feature to feel real, we should stick to outputting something tangible.
            // Let's add 'insulin-fragment' to inventory?
            addResource('compounds', match.type, 1);
        }

        setMessage(`Success! Synthesized ${match.name}`);
        setChain([]);
      } else {
        setMessage('Insufficient Amino Acids in Inventory!');
      }
    } else {
      setMessage('Folding Failed: Unstable Configuration (Unknown Recipe)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-teal-400 flex items-center gap-2">
              <span>🧬</span> Protein Synthesizer
            </h2>
            <p className="text-slate-400 text-sm">Assemble polypeptides by chaining amino acids.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Inventory Sidebar */}
          <div className="w-64 bg-slate-950 border-r border-slate-800 overflow-y-auto p-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Available Amino Acids</h3>
            <div className="space-y-2">
              {availableAminoAcids.map(type => (
                <button
                  key={type}
                  onClick={() => addToChain(type)}
                  className="w-full text-left p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500 hover:bg-teal-900/20 transition-all group"
                >
                  <div className="font-mono text-xs text-teal-500/50 mb-1">{type}</div>
                  <div className="font-bold text-slate-200 group-hover:text-teal-300">
                    {PARTICLE_NAMES[type] || type}
                  </div>
                </button>
              ))}
              {availableAminoAcids.length === 0 && (
                <p className="text-slate-600 text-sm italic">No amino acids found. Synthesize them in the Chemistry Lab first.</p>
              )}
            </div>
          </div>

          {/* Main Assembly Area */}
          <div className="flex-1 bg-slate-900 p-8 flex flex-col items-center">
            
            {/* Chain Visualizer */}
            <div className="flex-1 w-full flex items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
                {chain.length === 0 && (
                  <div className="text-slate-600 border-2 border-dashed border-slate-700 rounded-xl p-8 text-center">
                    Select Amino Acids to begin chain assembly...
                  </div>
                )}
                
                {chain.map((aa, idx) => (
                  <div key={idx} className="flex items-center">
                    {/* Amino Acid Node */}
                    <div className="relative group">
                        <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-slate-600 shadow-lg relative z-10"
                            style={{ backgroundColor: PARTICLE_COLORS[aa] || '#475569' }}
                        >
                            <span className="text-xs font-bold text-white drop-shadow-md truncate max-w-[50px]">
                                {PARTICLE_NAMES[aa]?.substring(0, 3).toUpperCase() || 'UNK'}
                            </span>
                        </div>
                        <button 
                            onClick={() => removeFromChain(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Peptide Bond Line */}
                    {idx < chain.length - 1 && (
                        <div className="w-8 h-1 bg-slate-600 mx-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 w-full max-w-lg space-y-4">
                {message && (
                    <div className={`p-3 rounded text-center text-sm font-bold ${message.includes('Success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setChain([])}
                        disabled={chain.length === 0}
                        className="py-3 px-6 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Clear Chain
                    </button>
                    <button 
                        onClick={handleFold}
                        disabled={chain.length < 2}
                        className="py-3 px-6 rounded-xl bg-teal-600 text-white font-bold shadow-lg shadow-teal-900/20 hover:bg-teal-500 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        ⚡ Fold Protein
                    </button>
                </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProteinSynthesizer;
