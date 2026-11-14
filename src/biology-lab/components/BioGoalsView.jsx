import React from 'react';
import { useBioStore } from '../store';
import { useAnatomyStore } from '../../anatomy-lab/store';
import { useChemistryStore } from '../../chemistry-lab/store';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';
import { LEVEL_1_MACROMOLECULES, TIER_1_ORGAN_SYSTEMS } from '../data/topDownBioHierarchy';

const PHYSICS_ATOM_RECIPES = {
  phospholipid_bilayer: ['carbon', 'hydrogen', 'oxygen', 'phosphorus'],
  bdna_chromatin: ['carbon', 'hydrogen', 'nitrogen', 'oxygen', 'phosphorus'],
  atp_synthase: ['carbon', 'hydrogen', 'nitrogen', 'oxygen', 'phosphorus'],
  collagen_i: ['carbon', 'hydrogen', 'nitrogen', 'oxygen'],
  actin_myosin: ['carbon', 'hydrogen', 'nitrogen', 'oxygen', 'calcium'],
  hemoglobin: ['carbon', 'hydrogen', 'nitrogen', 'oxygen', 'iron'],
  ion_channel: ['carbon', 'hydrogen', 'nitrogen', 'oxygen', 'sodium', 'potassium'],
};

const BioGoalsView = ({ onGoToStop }) => {
  const foldedProteins = useBioStore((s) => s.foldedProteins) || [];
  const fabricatedOrgans = useAnatomyStore((s) => s.fabricatedOrgans) || {};
  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};
  const elements = useInventory((s) => s.elements) || {};
  const molecules = useInventory((s) => s.molecules) || {};

  const handleSendToChemLab = (mol) => {
    if (!mol.chemistryOrder) return;
    useChemistryStore.getState().setActiveBioOrder(mol.chemistryOrder);
    useStore.getState().setCurrentView('chemistry');
    useStore.getState().showMessage(`⚗️ Queued in Chemistry Lab: ${mol.chemistryOrder.title}`);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto custom-scrollbar bg-[#060a14] text-slate-100">
      {/* 1. What is Bio Lab & Desired Outcome */}
      <div className="rounded-2xl bg-[#0b1220] border border-cyan-500/30 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400">
              Biology Lab // Mission & Guide
            </span>
            <h2 className="text-base font-black text-white">
              🎯 From Quarks to a Complete Human Being
            </h2>
          </div>
          <button
            onClick={() => onGoToStop && onGoToStop('molecule')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-[10px] uppercase cursor-pointer"
          >
            Start at Stop 1: Protein Forge →
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>What is Bio Lab?</strong> Bio Lab is the biological assembly line that turns raw
          atoms and prebiotic chemicals into living human organs. Work through the{' '}
          <strong>5 Assembly Stops</strong> (Proteins → Organelles → Living Cell → Tissues →
          Organs), then open <strong>Anatomy Lab</strong> to drag and snap each fabricated organ and
          bone into its exact anatomical position.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[10px] font-mono">
          <div className="p-2.5 rounded-xl bg-[#080d18] border border-white/10">
            <div className="text-sky-400 font-bold">1. Physics Lab</div>
            <div className="text-slate-300 mt-0.5">Quarks → C, H, N, O, P, Fe, Ca</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#080d18] border border-white/10">
            <div className="text-emerald-400 font-bold">2. Chemistry Lab</div>
            <div className="text-slate-300 mt-0.5">Atoms → Amino Acids, Heme, Lipids, DNA</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#080d18] border border-white/10">
            <div className="text-cyan-400 font-bold">3. Bio Lab (5 Stops)</div>
            <div className="text-slate-300 mt-0.5">Proteins → Organelles → Cell → Tissue → Organ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#080d18] border border-amber-500/30">
            <div className="text-amber-300 font-bold">4. Desired Outcome</div>
            <div className="text-slate-200 mt-0.5">
              Full Organs & 206 Bones snapped in Anatomy Lab
            </div>
          </div>
        </div>
      </div>

      {/* 2. Desired Organ Outcomes */}
      <div className="rounded-2xl bg-[#0b1220] border border-white/10 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-emerald-400">
            🫀 Desired Outcomes (Final Organs & Systems for Anatomy Lab)
          </h3>
          <button
            onClick={() => useStore.getState().setCurrentView('anatomy')}
            className="px-2.5 py-1 rounded-lg bg-[#080d18] border border-cyan-400/40 text-cyan-300 font-mono text-[9px] font-bold uppercase cursor-pointer hover:bg-slate-800"
          >
            🦴 Open Anatomy Lab →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {TIER_1_ORGAN_SYSTEMS.map((sys) => {
            const snapped = !!bioprintedTissues[sys.anatomyTissueId];
            const fabricated = !!fabricatedOrgans[sys.anatomyTissueId];
            return (
              <div
                key={sys.id}
                className={`p-2.5 rounded-xl border ${
                  snapped
                    ? 'bg-emerald-950/30 border-emerald-400/50'
                    : fabricated
                    ? 'bg-cyan-950/30 border-cyan-400/50'
                    : 'bg-[#080d18] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{sys.icon}</span>
                  <span
                    className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      snapped
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : fabricated
                        ? 'bg-cyan-500/20 text-cyan-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {snapped ? '✓ Snapped' : fabricated ? 'Ready in Tray' : 'Pending'}
                  </span>
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate">{sys.name}</div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">
                  Needs: {sys.requiredProteins.join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Protein & Macromolecule Goals + Physics & Chemistry Sub-Recipes */}
      <div className="rounded-2xl bg-[#0b1220] border border-white/10 p-4 space-y-3">
        <h3 className="text-xs font-mono font-black uppercase tracking-wider text-cyan-300">
          🧬 Required Proteins & Macromolecules (With Physics & Chemistry Sub-Recipes)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Object.values(LEVEL_1_MACROMOLECULES).map((mol) => {
            const isFolded = foldedProteins.includes(mol.id);
            const atomList = PHYSICS_ATOM_RECIPES[mol.id] || ['carbon', 'hydrogen', 'oxygen'];
            const chemInputs = mol.chemistryOrder?.inputs || {};
            const neededBy = TIER_1_ORGAN_SYSTEMS.filter((s) =>
              s.requiredProteins.includes(mol.id)
            )
              .map((s) => `${s.icon} ${s.name.split(' ')[0]}`)
              .join(' • ');

            return (
              <div
                key={mol.id}
                className={`p-3 rounded-xl border space-y-2 ${
                  isFolded
                    ? 'bg-emerald-950/15 border-emerald-500/35'
                    : 'bg-[#080d18] border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{mol.icon}</span>
                      <span className="text-xs font-black text-white truncate">{mol.name}</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                      Unlocks: {neededBy || 'Core Cellular Machinery'}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase shrink-0 ${
                      isFolded
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {isFolded ? '✓ Folded' : 'Goal Open'}
                  </span>
                </div>

                {/* Physics Lab Sub-Elements */}
                <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono">
                  <span className="text-sky-400 font-bold mr-1">⚛️ Physics:</span>
                  {atomList.map((el) => (
                    <span
                      key={el}
                      className="px-1.5 py-0.5 rounded bg-[#0f172a] border border-white/10 text-slate-200 capitalize"
                    >
                      {el} ({elements[el] || 0})
                    </span>
                  ))}
                </div>

                {/* Chemistry Lab Sub-Molecules */}
                <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono">
                  <span className="text-emerald-400 font-bold mr-1">⚗️ Chem:</span>
                  {Object.entries(chemInputs).map(([chemId, qty]) => (
                    <span
                      key={chemId}
                      className="px-1.5 py-0.5 rounded bg-[#0f172a] border border-emerald-500/25 text-emerald-200"
                    >
                      {qty}× {chemId} ({molecules[chemId] || 0})
                    </span>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleSendToChemLab(mol)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-mono text-[9px] font-bold uppercase cursor-pointer"
                  >
                    ⚗️ Craft in Chem Lab →
                  </button>
                  <button
                    onClick={() => onGoToStop && onGoToStop('molecule')}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono text-[9px] font-bold uppercase cursor-pointer"
                  >
                    🧬 Fold in Stop 1 →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BioGoalsView;
