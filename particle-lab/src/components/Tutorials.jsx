import React, { useState } from 'react';
import { PARTICLE_TYPES, PARTICLE_INFO, PARTICLE_COLORS } from '../constants/particles';
import { REACTIONS } from '../chemistry-lab/data/reactions';
import { CHEMICALS } from '../chemistry-lab/data/chemicals';
import ParticleIcon from '../particle-lab/components/ParticleIcon.jsx';
import ChemicalIcon from '../chemistry-lab/components/ChemicalIcon';
import InfoPanel from '../particle-lab/components/InfoPanel.jsx';

const Tutorials = () => {
  const [activeTab, setActiveTab] = useState('physics');
  const [selectedInfo, setSelectedInfo] = useState(null);

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
        {activeTab === 'physics' && <PhysicsTutorial onSelectInfo={setSelectedInfo} />}
        {activeTab === 'chemistry' && <ChemistryTutorial onSelectInfo={setSelectedInfo} />}
        {activeTab === 'biology' && <BiologyTutorial onSelectInfo={setSelectedInfo} />}
      </div>

      {selectedInfo && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <InfoPanel particleType={selectedInfo} onClose={() => setSelectedInfo(null)} />
        </div>
      )}
    </div>
  );
};

// --- PHYSICS SECTION ---
const PhysicsTutorial = ({ onSelectInfo }) => {
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
         {fundamentalRecipes.map((r, i) => <RecipeCard key={i} {...r} onSelectInfo={onSelectInfo} />)}
      </div>

      <SectionHeader title="Nuclear Fusion" subtitle="Stellar Nucleosynthesis" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {fusionRecipes.map((r, i) => <RecipeCard key={i} {...r} onSelectInfo={onSelectInfo} />)}
      </div>
    </div>
  );
};

// --- CHEMISTRY SECTION ---
const ChemistryTutorial = ({ onSelectInfo }) => {
  return (
    <div className="space-y-12">
      <SectionHeader title="Molecular Synthesis" subtitle="Chemical Reactions & Phase Changes" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {REACTIONS.map((reaction, i) => {
            const inputs = Object.entries(reaction.inputs).map(([key, count]) => ({ id: key, count }));
            const outputs = Object.entries(reaction.outputs).map(([key, count]) => ({ id: key, count }));
            
            return (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col gap-4 hover:border-blue-500/30 transition-colors">
                 <div className="flex justify-between items-start">
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
const BiologyTutorial = ({ onSelectInfo }) => {
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
         {polypeptides.map((r, i) => <RecipeCard key={i} {...r} isBio={true} onSelectInfo={onSelectInfo} />)}
      </div>

      <SectionHeader title="Cellular Engineering" subtitle="Organelle Construction" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {organelles.map((r, i) => <RecipeCard key={i} {...r} isBio={true} onSelectInfo={onSelectInfo} />)}
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

const RecipeCard = ({ inputs, output, desc, isBio, onSelectInfo }) => {
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
                   className="relative w-12 h-12 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10" 
                   title={info.name}
                   onClick={() => onSelectInfo(inp)}
                 >
                    <div className={`w-8 h-8 rounded-full ${PARTICLE_COLORS[inp] || 'bg-gray-500'}`}></div>
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
  const chem = CHEMICALS[id] || { name: id, color: '#999', state: 'powder', formula: '?' };
  return (
    <div 
        className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform" 
        title={chem.name}
        onClick={onClick}
    >
      <div className="relative">
         <ChemicalIcon 
            color={chem.color} 
            state={chem.state} 
            formula={chem.formula} 
            className="w-12 h-12"
         />
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
