import React, { useState, useMemo } from 'react';
import { useChemistryStore } from '../store';
import { EQUIPMENT } from '../data/equipment';
import { REACTIONS } from '../data/reactions';
import ResourceExchange from '../../components/ResourceExchange.jsx';
import ChemicalIcon from './ChemicalIcon.jsx';
import { MATTER_DEFINITIONS } from '../../constants/matterRegistry.js';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'atomic', label: 'Elements' },
  { id: 'molecular', label: 'Molecules' },
  { id: 'acid-base', label: 'Acids/Bases' },
  { id: 'bio', label: 'Biomolecules' },
];

const FEATURED_BIO_PRODUCTS = [
  'phospholipid',
  'dna',
  'nadh',
  'glycine',
  'glutamic-acid',
  'heme',
  'arginine',
  'ribose',
  'nucleotide-a',
  'lipid',
  'water',
  'ammonia'
];

const ChemistrySidebar = () => {
  const [activeTab, setActiveTab] = useState('storage'); // 'storage' | 'equipment' | 'recipes'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showGlobalImport, setShowGlobalImport] = useState(false);

  const localInventory = useChemistryStore(state => state.localInventory);
  const addToLocalInventory = useChemistryStore(state => state.addToLocalInventory);
  const setInspectedChemical = useChemistryStore(state => state.setInspectedChemical);
  const seedPrimordialFeedstock = useChemistryStore(state => state.seedPrimordialFeedstock);
  const setActiveBioOrder = useChemistryStore(state => state.setActiveBioOrder);
  const autoSynthesizeBioOrder = useChemistryStore(state => state.autoSynthesizeBioOrder);

  const handleImport = (itemId, amount) => {
    addToLocalInventory(itemId, amount);
  };

  const handleDragStart = (e, chemicalId) => {
    e.dataTransfer.setData('chemicalId', chemicalId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Filtered reagents in local pantry
  const filteredReagents = useMemo(() => {
    const entries = Object.entries(localInventory || {});
    return entries.filter(([id]) => {
      const chem = MATTER_DEFINITIONS[id] || { name: id, category: '' };
      const matchesSearch = chem.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (chem.formula && chem.formula.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            id.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'atomic') return chem.category === 'Atom' || chem.category === 'Isotope';
      if (selectedCategory === 'molecular') return ['Molecule', 'Compound', 'Gas', 'Solution'].includes(chem.category);
      if (selectedCategory === 'acid-base') return ['Acid', 'Base'].includes(chem.category) || id.includes('acid') || id.includes('hydroxide');
      if (selectedCategory === 'bio') return ['Biochemistry', 'Amino Acid', 'Protein', 'Sugar', 'Lipid'].some(c => (chem.category || '').includes(c));

      return true;
    });
  }, [localInventory, searchQuery, selectedCategory]);

  // Upgrade #6: Featured Biochemical & Prebiotic Recipe Codex
  const codexReactions = useMemo(() => {
    return FEATURED_BIO_PRODUCTS.map((prodId) =>
      REACTIONS.find((r) => r.outputs && r.outputs[prodId])
    ).filter(Boolean);
  }, []);

  return (
    <div className="w-full h-full bg-[#070c18] flex flex-col border-r border-slate-800/80 text-white select-none">
      
      {/* Top Sidebar Header + Primordial Feedstock Seeder (Step 4) */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-[#050914]/80 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">⚗️</span>
          <div className="min-w-0">
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-200 truncate">Lab Repository</h3>
            <span className="text-[9px] font-mono text-emerald-400 block truncate">Pantry, Vessels & Codex</span>
          </div>
        </div>
        <button
          onClick={seedPrimordialFeedstock}
          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/50 text-emerald-300 font-mono text-[9.5px] font-bold uppercase shrink-0 cursor-pointer"
          title="Load Primordial Bio-Feedstock (H₂O, NH₃, CH₄, CO₂, Glucose, H₃PO₄, Fe, etc.)"
        >
          ⚡ Load Bio-Feedstock
        </button>
      </div>

      {/* Main Tab Navigation (Reagents | Apparatus | Recipes) */}
      <div className="flex border-b border-slate-800 bg-[#050914] p-1.5 gap-1">
        <button 
          onClick={() => setActiveTab('storage')}
          className={`flex-1 py-2 px-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'storage' 
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>🧪</span>
          <span>Reagents</span>
        </button>

        <button 
          onClick={() => setActiveTab('equipment')}
          className={`flex-1 py-2 px-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'equipment' 
              ? 'bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>⚙️</span>
          <span>Vessels</span>
        </button>

        <button 
          onClick={() => setActiveTab('recipes')}
          className={`flex-1 py-2 px-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'recipes' 
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>📖</span>
          <span>Recipes</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        
        {/* TAB 1: REAGENTS & PANTRY */}
        {activeTab === 'storage' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Global Import Bridge Accordion */}
            <div className="border-b border-slate-800 bg-[#060b17]">
              <button
                onClick={() => setShowGlobalImport(!showGlobalImport)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <span>Global Import Ledger</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {showGlobalImport ? '▲ HIDE' : '▼ OPEN'}
                </span>
              </button>

              {showGlobalImport && (
                <div className="h-64 border-t border-slate-800 relative bg-[#040812]">
                  <ResourceExchange 
                    labName="Chemistry Lab"
                    onImport={handleImport}
                    allowedCategories={['Atomic', 'Molecular', 'Biochemistry']}
                    excludedCategories={['Fundamental']} 
                    excludedSubcategories={['Hadrons']}
                  />
                </div>
              )}
            </div>

            {/* Local Reagents Controls: Search & Categories */}
            <div className="p-3 border-b border-slate-800/80 bg-[#060a16] space-y-2">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search reagents or formulas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#091022] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono outline-none focus:border-emerald-400/80 transition-colors pl-8"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">🔍</span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                        : 'bg-slate-800/50 border border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Local Reagents Card Grid */}
            <div 
              className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-[#050914]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const chemicalId = e.dataTransfer.getData('chemicalId');
                if (chemicalId) {
                  handleImport(chemicalId, 1);
                }
              }}
            >
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                  BENCH REAGENTS ({filteredReagents.length})
                </span>
                <span className="text-[9px] font-mono text-slate-500">Drag to Vessel</span>
              </div>

              {filteredReagents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-slate-500 gap-2.5">
                  <span className="text-2xl opacity-40">🧪</span>
                  <span className="text-xs font-mono font-bold text-slate-400">No Reagents in Bench</span>
                  <p className="text-[11px] text-slate-500 max-w-[200px]">
                    Click below to load primordial chemical & biological feedstock into your bench:
                  </p>
                  <button
                    onClick={seedPrimordialFeedstock}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-[10px] font-black uppercase cursor-pointer"
                  >
                    ⚡ Load Bio-Feedstock Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {filteredReagents.map(([id]) => {
                    const chemical = MATTER_DEFINITIONS[id] || { name: id, color: '#10b981', formula: '?' };
                    return (
                      <div 
                        key={id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, id)}
                        className="p-2.5 bg-[#091022] border border-slate-800 hover:border-emerald-500/50 rounded-2xl cursor-grab active:cursor-grabbing group relative flex flex-col items-center gap-1.5 transition-all hover:bg-[#0c162f] shadow-md hover:shadow-emerald-950/30"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedChemical(id);
                          }}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
                          title="Inspect Molecular Properties"
                        >
                          ℹ️
                        </button>

                        <ChemicalIcon 
                          id={id} 
                          color={chemical.color} 
                          state={chemical.state} 
                          formula={chemical.formula} 
                          iconType={chemical.iconType} 
                          className="w-11 h-11"
                        />

                        <div className="w-full text-center">
                          <div className="text-[11px] font-bold text-slate-200 truncate w-full" title={chemical.name}>
                            {chemical.name}
                          </div>
                          <div className="text-[9px] text-emerald-400 font-mono mt-0.5">
                            {chemical.formula || 'Available'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APPARATUS & EQUIPMENT */}
        {activeTab === 'equipment' && (
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-[#050914]">
            <InventoryEquipmentList />
          </div>
        )}

        {/* TAB 3 (UPGRADE #6): BIOCHEMICAL REACTION RECIPE CODEX */}
        {activeTab === 'recipes' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-[#050914]">
            <div className="px-1">
              <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest block">
                BIOCHEMICAL & PREBIOTIC CODEX ({codexReactions.length})
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                1-Click Synthesize into Active Reaction Vessel
              </span>
            </div>

            {codexReactions.map((rxn, idx) => {
              const reactantStr = Object.entries(rxn.inputs || {})
                .map(([k, v]) => `${v > 1 ? v : ''} ${MATTER_DEFINITIONS[k]?.formula || k}`)
                .join(' + ');
              const productStr = Object.entries(rxn.outputs || {})
                .map(([k, v]) => `${v > 1 ? v : ''} ${MATTER_DEFINITIONS[k]?.formula || k}`)
                .join(' + ');
              const primaryProduct = Object.keys(rxn.outputs || {})[0];
              const productName = MATTER_DEFINITIONS[primaryProduct]?.name || primaryProduct;

              return (
                <div
                  key={`${primaryProduct}-${idx}`}
                  className="p-3 rounded-2xl bg-[#091022] border border-slate-800 hover:border-amber-500/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase truncate">
                      {productName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                      {rxn.conditions?.tempMin ? `${rxn.conditions.tempMin}°C` : '25°C'}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white">
                    {reactantStr} → <span className="text-emerald-300">{productStr}</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveBioOrder({
                        compoundId: primaryProduct,
                        title: `Synthesize ${productName}`,
                        equation: `${reactantStr} → ${productStr}`,
                        tempC: rxn.conditions?.tempMin || 65,
                        pressureAtm: rxn.conditions?.pressureMin || 2,
                        vesselType: 'beaker_std'
                      });
                      autoSynthesizeBioOrder();
                    }}
                    className="w-full py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 font-mono text-[9.5px] font-bold uppercase cursor-pointer"
                  >
                    ⚡ Synthesize in Vessel
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

const InventoryEquipmentList = () => {
  const createVessel = useChemistryStore(state => state.createVessel);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'equipment', data: item }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const getEquipmentEmoji = (icon) => {
    switch (icon) {
      case 'beaker': return '🥛';
      case 'flask': return '⚗️';
      case 'reactor': return '☢️';
      case 'crucible': return '🔥';
      case 'vial': return '🧪';
      case 'condenser': return '💧';
      case 'spark': return '⚡';
      case 'electrochemical': return '🔋';
      case 'column': return '🔬';
      default: return '⚗️';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="px-1 mb-1">
        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
          GLASSWARE & HARDWARE ({EQUIPMENT.length})
        </span>
      </div>

      {EQUIPMENT.map((item) => (
        <div 
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          className="flex items-center gap-3 p-3 bg-[#091022] rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c162f] cursor-grab active:cursor-grabbing transition-all group shadow-md"
        >
          <div className="w-10 h-10 bg-[#050914] rounded-xl flex items-center justify-center text-xl border border-slate-800 shadow-inner group-hover:border-cyan-500/30">
            {getEquipmentEmoji(item.icon)}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-slate-200 text-xs font-mono font-bold truncate">{item.name}</h4>
            <div className="text-[9px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="text-cyan-300">{item.stats.maxVol}ml</span>
              <span>•</span>
              <span>Max {item.stats.maxTemp}°C</span>
            </div>
          </div>

          <button 
            onClick={() => createVessel(item)}
            className="px-2.5 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 rounded-xl text-xs font-mono font-black transition-all border border-cyan-500/30 active:scale-95 shadow-sm cursor-pointer"
            title="Deploy apparatus to workbench"
          >
            + ADD
          </button>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ChemistrySidebar);
