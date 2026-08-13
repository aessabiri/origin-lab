import React, { useState } from 'react';
import { PARTICLE_TYPES, PARTICLE_INFO, PARTICLE_COLORS } from '../constants/particles';
import { REACTIONS } from '../chemistry-lab/data/reactions';
import { MATTER_DEFINITIONS } from '../constants/matterRegistry';
import ParticleIcon from '../particle-lab/components/ParticleIcon.jsx';
import ChemicalIcon from '../chemistry-lab/components/ChemicalIcon';
import InfoPanel from '../particle-lab/components/InfoPanel.jsx';

const Tutorials = () => {
  const [activeTab, setActiveTab] = useState('physics');
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);

  return (
    <div className="w-full h-full bg-slate-900 text-white overflow-y-auto animate-fadeIn relative">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-8 py-6 flex justify-between items-center">
        <div>
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500">
             ACADEMY
           </h1>
           <p className="text-slate-400 text-sm font-mono tracking-wider mt-1">UNIVERSAL FABRICATION MANUAL</p>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800 rounded-lg">
           {['physics', 'chemistry', 'biology'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-md font-bold uppercase text-sm tracking-wider transition-all ${
                 activeTab === tab 
                   ? 'bg-blue-600 text-white shadow-lg' 
                   : 'text-slate-400 hover:text-white hover:bg-white/5'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 pb-32">
        {activeTab === 'physics' && <PhysicsTutorial onSelectInfo={setSelectedInfo} onSelectReaction={setSelectedReaction} />}
        {activeTab === 'chemistry' && <ChemistryTutorial onSelectInfo={setSelectedInfo} onSelectReaction={setSelectedReaction} />}
        {activeTab === 'biology' && <BiologyTutorial onSelectInfo={setSelectedInfo} onSelectReaction={setSelectedReaction} />}
      </div>

      {selectedInfo && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <InfoPanel particleType={selectedInfo} onClose={() => setSelectedInfo(null)} />
        </div>
      )}

      {selectedReaction && (
        <ReactionInfoModal reaction={selectedReaction} onClose={() => setSelectedReaction(null)} />
      )}
    </div>
  );
};

const ReactionInfoModal = ({ reaction, onClose }) => {
  if (!reaction) return null;

  // Determine Context (Physics vs Chemistry)
  const isChemistry = !!reaction.visual; // Chemistry reactions have a 'visual' prop like 'Reaction' or 'Combustion'

  // Normalize Inputs
  const inputs = reaction.inputs?.length 
      ? reaction.inputs.map(i => ({ name: i, count: 1 })) 
      : Object.entries(reaction.inputs || {}).map(([k, v]) => ({ name: k, count: v }));

  // Normalize Outputs
  const outputs = reaction.output 
      ? [{ name: reaction.output, count: 1 }] 
      : Object.entries(reaction.outputs || {}).map(([k, v]) => ({ name: k, count: v }));

  // Analyze Reaction for Lore (Force & Residuals)
  const getForce = () => {
      const txt = (reaction.desc || '').toLowerCase();
      if (isChemistry) return 'Electromagnetic';
      if (txt.includes('fusion') || txt.includes('nucleosynthesis')) return 'Strong Nuclear';
      if (txt.includes('decay') || txt.includes('beta')) return 'Weak Nuclear';
      if (txt.includes('quark') || txt.includes('baryon')) return 'Strong Nuclear';
      if (txt.includes('electron') || txt.includes('atom')) return 'Electromagnetic';
      return 'Unknown';
  };

  const getResiduals = () => {
      const residuals = [];
      const txt = (reaction.desc || '').toLowerCase();
      if (txt.includes('fusion')) residuals.push('Neutrinos', 'Gamma Rays', 'Positrons');
      if (txt.includes('recombination')) residuals.push('Photons (CMB)');
      if (txt.includes('baryogenesis')) residuals.push('Gluons (Binding Energy)');
      if (isChemistry && reaction.heat > 0) residuals.push('Thermal Energy');
      return residuals;
  };

  const force = getForce();
  const residuals = getResiduals();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-3xl w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Background Decoration */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isChemistry ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}></div>
        <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isChemistry ? 'bg-teal-500/10' : 'bg-purple-500/10'}`}></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
            {reaction.desc || reaction.visual || 'Reaction Analysis'}
        </h3>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 border border-slate-700 px-2 py-0.5 rounded">
                {force} Interaction
            </span>
        </div>
        
        {/* Visual Process Flow */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-slate-950/50 rounded-2xl p-6 border border-slate-800 mb-8 relative gap-6 md:gap-0">
            {/* Inputs Column */}
            <div className="flex flex-col gap-3 items-center flex-1 w-full">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reactants</span>
                <div className="flex flex-wrap justify-center gap-3">
                    {inputs.map((item, i) => (
                        <div key={i} className="flex flex-col items-center p-2 bg-slate-800 rounded-xl border border-slate-700 min-w-[80px]">
                            <div className="w-10 h-10 mb-1 relative">
                                <ParticleIcon type={item.name} color={PARTICLE_COLORS[item.name] || 'bg-gray-500'} />
                                {item.count > 1 && <span className="absolute -top-1 -right-1 bg-slate-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-slate-900">x{item.count}</span>}
                            </div>
                            <span className="text-[10px] font-bold text-slate-300 text-center leading-tight max-w-[80px] break-words">{MATTER_DEFINITIONS[item.name]?.name || item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Visual Arrow */}
            <div className="flex flex-col items-center justify-center px-4 text-slate-600 shrink-0">
                <div className="text-[10px] font-mono mb-1 opacity-50 uppercase tracking-widest">Process</div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-blue-500 animate-pulse transform rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            </div>

            {/* Outputs Column */}
            <div className="flex flex-col gap-3 items-center flex-1 w-full">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Products</span>
                <div className="flex flex-wrap justify-center gap-3">
                    {outputs.length > 0 ? outputs.map((item, i) => (
                        <div key={i} className="flex flex-col items-center p-2 bg-blue-900/10 rounded-xl border border-blue-500/30 min-w-[80px]">
                            <div className="w-10 h-10 mb-1 relative">
                                <ParticleIcon type={item.name} color={PARTICLE_COLORS[item.name] || 'bg-gray-500'} />
                                {item.count > 1 && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-slate-900">x{item.count}</span>}
                            </div>
                            <span className="text-[10px] font-bold text-blue-200 text-center leading-tight max-w-[80px] break-words">{MATTER_DEFINITIONS[item.name]?.name || item.name}</span>
                        </div>
                    )) : (
                        <span className="text-slate-600 italic text-sm">Energy / Radiation</span>
                    )}
                </div>
            </div>
        </div>

        {/* Residuals & Context */}
        {residuals.length > 0 && (
            <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span>✨</span> Residual Emissions
                </h4>
                <div className="flex flex-wrap gap-2">
                    {residuals.map((res, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-900/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/20">
                            {res}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-6">
           {reaction.conditions ? (
             <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <span>⚠️</span> Required Environment
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                   <li className="flex justify-between border-b border-slate-700/50 pb-1">
                       <span>Temperature</span>
                       <span className="font-mono text-blue-300">{reaction.conditions.tempMin ? `> ${reaction.conditions.tempMin}°C` : 'Standard'}</span>
                   </li>
                   <li className="flex justify-between border-b border-slate-700/50 pb-1">
                       <span>Pressure</span>
                       <span className="font-mono text-blue-300">{reaction.conditions.pressureMin ? `> ${reaction.conditions.pressureMin} atm` : 'Standard'}</span>
                   </li>
                </ul>
             </div>
           ) : (
             <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Mechanism</h4>
                <p className="text-sm text-slate-400 italic">
                    Standard quantum mechanical interaction governed by the {force} force.
                </p>
             </div>
           )}
           
           <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <span>ℹ️</span> Scientific Context
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                    {reaction.desc ? 
                        `The process of ${reaction.desc} is a key step in material evolution.` : 
                        "A fundamental transformation of matter involving the rearrangement of constituent particles."}
                </p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- PHYSICS SECTION ---
const PhysicsTutorial = ({ onSelectInfo, onSelectReaction }) => {
  // Hardcoded recipes based on game logic
  const fundamentalRecipes = [
    { inputs: ['up-quark', 'up-quark', 'down-quark'], output: 'proton', desc: 'Baryogenesis' },
    { inputs: ['up-quark', 'down-quark', 'down-quark'], output: 'neutron', desc: 'Baryogenesis' },
    { inputs: ['proton', 'electron'], output: 'hydrogen', desc: 'Recombination' },
    { inputs: ['proton', 'neutron'], output: 'deuterium', desc: 'Nucleosynthesis' },
  ];

  const fusionRecipes = [
     { inputs: ['hydrogen', 'hydrogen'], output: 'helium', desc: 'Stellar Fusion (Simplified)' },
     { inputs: ['helium', 'helium', 'helium'], output: 'carbon', desc: 'Triple-Alpha Process' },
     { inputs: ['carbon', 'helium'], output: 'oxygen', desc: 'Alpha Capture' },
  ];

  return (
    <div className="space-y-12">
      <SectionHeader title="Fundamental Assembly" subtitle="Subatomic Particle Construction" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {fundamentalRecipes.map((r, i) => <RecipeCard key={i} {...r} onSelectInfo={onSelectInfo} onInfoClick={() => onSelectReaction(r)} />)}
      </div>

      <SectionHeader title="Nuclear Fusion" subtitle="Stellar Nucleosynthesis" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {fusionRecipes.map((r, i) => <RecipeCard key={i} {...r} onSelectInfo={onSelectInfo} onInfoClick={() => onSelectReaction(r)} />)}
      </div>
    </div>
  );
};

// --- CHEMISTRY SECTION ---
const ChemistryTutorial = ({ onSelectInfo, onSelectReaction }) => {
  return (
    <div className="space-y-12">
      <SectionHeader title="Molecular Synthesis" subtitle="Chemical Reactions & Phase Changes" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {REACTIONS.map((reaction, i) => {
            const inputs = Object.entries(reaction.inputs).map(([key, count]) => ({ id: key, count }));
            const outputs = Object.entries(reaction.outputs).map(([key, count]) => ({ id: key, count }));
            
            return (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col gap-4 hover:border-blue-500/30 transition-colors relative group">
                 
                 {/* Question Mark Button */}
                 <button 
                    onClick={(e) => { e.stopPropagation(); onSelectReaction(reaction); }}
                    className="absolute top-2 right-2 w-6 h-6 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors opacity-0 group-hover:opacity-100"
                    title="View Reaction Details"
                 >
                    ?
                 </button>

                 <div className="flex justify-between items-start pr-6">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{reaction.visual || 'Reaction'}</div>
                    <HeatBadge heat={reaction.heat} />
                 </div>
                 
                 <div className="flex items-center justify-between gap-4">
                    {/* Inputs */}
                    <div className="flex flex-wrap gap-2 justify-center flex-1">
                       {inputs.map((item, idx) => (
                         <ChemItem key={idx} id={item.id} count={item.count} onClick={() => onSelectInfo(item.id)} />
                       ))}
                    </div>

                    {/* Arrow */}
                    <div className="text-slate-500 text-2xl">➔</div>

                    {/* Outputs */}
                    <div className="flex flex-wrap gap-2 justify-center flex-1">
                       {outputs.map((item, idx) => (
                         <ChemItem key={idx} id={item.id} count={item.count} onClick={() => onSelectInfo(item.id)} />
                       ))}
                    </div>
                 </div>

                 {/* Conditions */}
                 <div className="mt-2 pt-4 border-t border-slate-700/50 flex gap-4 text-xs font-mono text-slate-400">
                    {reaction.conditions.tempMin && <span>Temp &gt; {reaction.conditions.tempMin}°C</span>}
                    {reaction.conditions.pressureMin && <span>Press &gt; {reaction.conditions.pressureMin} atm</span>}
                 </div>
              </div>
            );
         })}
      </div>
    </div>
  );
};

// --- BIOLOGY SECTION ---
const BiologyTutorial = ({ onSelectInfo, onSelectReaction }) => {
  // Mock data for visual appeal
  const polypeptides = [
    { name: 'Glycylglycine', inputs: ['glycine', 'glycine'], output: 'glycylglycine' },
    { name: 'Glycyl-Alanine', inputs: ['glycine', 'alanine'], output: 'glycyl-alanine' },
  ];

  const organelles = [
     { name: 'Lipid Membrane', inputs: ['lipid', 'lipid', 'lipid'], output: 'membrane', desc: 'Protects the cell' },
     { name: 'Mitochondrion', inputs: ['membrane', 'glucose', 'oxygen'], output: 'mitochondrion', desc: 'Powerhouse' },
  ];

  return (
    <div className="space-y-12">
      <SectionHeader title="Biochemistry" subtitle="Polypeptide Synthesis" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {polypeptides.map((r, i) => <RecipeCard key={i} {...r} isBio={true} onSelectInfo={onSelectInfo} onInfoClick={() => onSelectReaction(r)} />)}
      </div>

      <SectionHeader title="Cellular Engineering" subtitle="Organelle Construction" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {organelles.map((r, i) => <RecipeCard key={i} {...r} isBio={true} onSelectInfo={onSelectInfo} onInfoClick={() => onSelectReaction(r)} />)}
      </div>
    </div>
  );
};

// --- HELPERS ---

const SectionHeader = ({ title, subtitle }) => (
  <div className="border-l-4 border-blue-500 pl-4 mb-8">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <p className="text-slate-400">{subtitle}</p>
  </div>
);

const RecipeCard = ({ inputs, output, desc, isBio, onSelectInfo, onInfoClick }) => {
  const getInfo = (id) => {
     // Check Constants first
     const type = Object.values(PARTICLE_TYPES).find(v => v === id) || id;
     return PARTICLE_INFO[type] || { name: id, color: 'bg-gray-500' };
  };

  const outInfo = getInfo(output);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
       <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl text-white select-none">
          {isBio ? 'BIO' : 'PHY'}
       </div>
       
       <button 
          onClick={(e) => { e.stopPropagation(); onInfoClick && onInfoClick(); }}
          className="absolute top-2 right-2 w-6 h-6 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors opacity-0 group-hover:opacity-100 z-20"
          title="View Reaction Details"
       >
          ?
       </button>
       
       <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
         {desc || 'Synthesis'}
       </h3>

       <div className="flex items-center justify-between">
          {/* Inputs */}
          <div className="flex -space-x-4">
             {inputs.map((inp, i) => {
               const info = getInfo(inp);
               return (
                 <div 
                   key={i} 
                   className="relative w-12 h-12 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10 overflow-hidden" 
                   title={info.name}
                   onClick={() => onSelectInfo(inp)}
                 >
                    <div className="w-full h-full p-1">
                      <ParticleIcon type={inp} color={PARTICLE_COLORS[inp] || 'bg-gray-500'} />
                    </div>
                 </div>
               );
             })}
          </div>

          <div className="text-slate-500">➔</div>

          {/* Output */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" onClick={() => onSelectInfo(output)}>
             <div className="w-16 h-16 relative">
                <ParticleIcon type={output} color={PARTICLE_COLORS[output] || 'bg-gray-500'} />
             </div>
             <span className="text-sm font-bold mt-2 text-blue-300">{outInfo.name}</span>
          </div>
       </div>
    </div>
  );
};

const ChemItem = ({ id, count, onClick }) => {
  const chem = MATTER_DEFINITIONS[id] || { name: id, color: '#999', state: 'powder', formula: '?' };
  const particleColor = PARTICLE_COLORS[id] || 'bg-gray-500';
  
  return (
    <div 
        className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform" 
        title={chem.name}
        onClick={onClick}
    >
      <div className="relative w-12 h-12">
         <ParticleIcon type={id} color={particleColor} />
         {count > 1 && (
           <div className="absolute -top-1 -right-1 bg-white text-slate-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-300">
             {count}
           </div>
         )}
      </div>
      <span className="text-[10px] uppercase font-bold text-slate-500 max-w-[60px] truncate text-center">{chem.name}</span>
    </div>
  );
};

const HeatBadge = ({ heat }) => {
  if (heat > 0) return <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-1 rounded">Exothermic (+{heat})</span>;
  if (heat < 0) return <span className="text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded">Endothermic ({heat})</span>;
  return <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">Neutral</span>;
};

export default Tutorials;
