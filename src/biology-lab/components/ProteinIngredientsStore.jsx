import React from 'react';

export const BIO_SUB_INGREDIENTS = [
  { id: 'glycerol', name: 'Glycerol', formula: 'C₃H₈O₃', category: 'Lipid', color: '#38bdf8' },
  { id: 'fatty-acid', name: 'Fatty Acid', formula: 'C₁₆H₃₂O₂', category: 'Lipid', color: '#0ea5e9' },
  { id: 'phosphoric-acid', name: 'Phosphate', formula: 'PO₄³⁻', category: 'Inorganic', color: '#f97316' },
  { id: 'adenine', name: 'Bases (A/T/G/C)', formula: 'C₅H₅N₅', category: 'Nucleotide', color: '#a855f7' },
  { id: 'ribose', name: 'Deoxyribose', formula: 'C₅H₁₀O₄', category: 'Sugar', color: '#22d3ee' },
  { id: 'glycine', name: 'Glycine & Proline', formula: 'C₂H₅NO₂', category: 'Amino Acid', color: '#2dd4bf' },
  { id: 'glutamic-acid', name: 'Glutamic Acid', formula: 'C₅H₉NO₄', category: 'Amino Acid', color: '#f43f5e' },
  { id: 'arginine', name: 'Arginine', formula: 'C₆H₁₄N₄O₂', category: 'Amino Acid', color: '#eab308' },
  { id: 'iron', name: 'Iron Core', formula: 'Fe²⁺', category: 'Metal Ion', color: '#ef4444' },
  { id: 'nucleotide-a', name: 'ADP / ATP Core', formula: 'C₁₀H₁₅N₅', category: 'Coenzyme', color: '#f59e0b' },
];

// Maps each Stop 1 finished macromolecule to its required sub-ingredients
export const PROTEIN_RECIPES = {
  phospholipid_bilayer: ['glycerol', 'fatty-acid', 'phosphoric-acid'],
  bdna_chromatin: ['adenine', 'ribose', 'phosphoric-acid'],
  atp_synthase: ['nucleotide-a', 'phosphoric-acid', 'glycine'],
  collagen_i: ['glycine'],
  actin_myosin: ['glutamic-acid', 'nucleotide-a'],
  hemoglobin: ['glycine', 'iron'],
  ion_channel: ['arginine', 'glutamic-acid'],
};

const IngredientsLeftPanel = ({
  canvasSubIngredients = [],
  onAddSubIngredient,
}) => {
  return (
    <div className="col-span-3 flex flex-col bg-[#0b1220] rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-3.5 py-2.5 bg-[#080d18] border-b border-white/10 shrink-0">
        <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
          Drag to Canvas
        </span>
        <h3 className="text-xs font-black text-white">🧪 Ingredients</h3>
      </div>

      <div className="flex-1 p-2.5 overflow-y-auto custom-scrollbar space-y-1.5">
        {BIO_SUB_INGREDIENTS.map((item) => {
          const isLoaded = canvasSubIngredients.includes(item.id);
          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/json',
                  JSON.stringify({ kind: 'sub_ingredient', id: item.id })
                );
              }}
              onClick={() => onAddSubIngredient && onAddSubIngredient(item.id)}
              title="Drag onto the 3D Canvas (or click to add)"
              className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-grab active:cursor-grabbing ${
                isLoaded
                  ? 'bg-cyan-950/35 border-cyan-400/70'
                  : 'bg-[#080d18] border-white/10 hover:border-emerald-400/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-mono font-black border border-white/15 shrink-0"
                  style={{ backgroundColor: `${item.color}22`, color: item.color }}
                >
                  {item.formula.slice(0, 3)}
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">{item.name}</div>
                  <div className="text-[8.5px] font-mono text-slate-400 truncate">
                    {item.category} • {item.formula}
                  </div>
                </div>
              </div>

              <span
                className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  isLoaded
                    ? 'bg-cyan-500/20 text-cyan-200'
                    : 'bg-emerald-500/15 text-emerald-300'
                }`}
              >
                {isLoaded ? '✓' : '⋮⋮'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IngredientsLeftPanel;
