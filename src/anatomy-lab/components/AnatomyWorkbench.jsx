import React, { useMemo, useState } from 'react';
import {
  useAnatomyStore,
  BIO_TISSUE_RECIPES,
  CLINICAL_PATHOLOGIES,
  computeSystemicHomeostasis
} from '../store.js';
import { ALL_206_BONES, BONE_SUBGROUPS, TOTAL_BONE_COUNT } from '../data/humanSkeletalDatabase.js';

const LAYERS = [
  { id: 'skeleton', label: 'Skeleton', icon: '🦴', count: '206 Bones' },
  { id: 'ligaments', label: 'Ligaments', icon: '🧬', count: '349 Joints & Discs' },
  { id: 'muscles', label: 'Muscles', icon: '💪', count: 'Myofascial Slings' },
  { id: 'organs', label: 'Organs', icon: '🫁', count: '276 Visceral & Lymph' },
  { id: 'circulation', label: 'Vascular', icon: '🫀', count: '676 Heart & Vessels' },
  { id: 'nerves', label: 'Neural', icon: '🧠', count: '580 Brain & Nerves' },
];

const AnatomyWorkbench = () => {
  const assembledBones = useAnatomyStore(state => state.assembledBones);
  const assembleBone = useAnatomyStore(state => state.assembleBone);
  const assembleAllBones = useAnatomyStore(state => state.assembleAllBones);
  const resetSkeleton = useAnatomyStore(state => state.resetSkeleton);
  const selectedBoneId = useAnatomyStore(state => state.selectedBoneId);
  const setSelectedBoneId = useAnatomyStore(state => state.setSelectedBoneId);
  const activeLayer = useAnatomyStore(state => state.activeLayer);
  const setActiveLayer = useAnatomyStore(state => state.setActiveLayer);
  const layerVisibility = useAnatomyStore(state => state.layerVisibility);
  const toggleLayer = useAnatomyStore(state => state.toggleLayer);
  const vitalSigns = useAnatomyStore(state => state.vitalSigns);
  const consciousnessScore = useAnatomyStore(state => state.consciousnessScore);
  const bioprintedTissues = useAnatomyStore(state => state.bioprintedTissues) || {};
  const fabricatedOrgans = useAnatomyStore(state => state.fabricatedOrgans) || {};
  const synthesizeBioTissue = useAnatomyStore(state => state.synthesizeBioTissue);
  const selectedStructure = useAnatomyStore(state => state.selectedStructure);
  const xrayMeshKeys = useAnatomyStore(state => state.xrayMeshKeys) || [];
  const peeledMeshKeys = useAnatomyStore(state => state.peeledMeshKeys) || [];
  const toggleXRayStructure = useAnatomyStore(state => state.toggleXRayStructure);
  const peelStructure = useAnatomyStore(state => state.peelStructure);
  const restoreAllPeeled = useAnatomyStore(state => state.restoreAllPeeled);
  const activePathology = useAnatomyStore(state => state.activePathology);
  const triggerPathology = useAnatomyStore(state => state.triggerPathology);
  const applyRegenerativeRepair = useAnatomyStore(state => state.applyRegenerativeRepair);

  const systemicHomeostasis = useMemo(
    () =>
      computeSystemicHomeostasis({
        bioprintedTissues,
        assembledBones,
        activePathology
      }),
    [bioprintedTissues, assembledBones, activePathology]
  );

  const [activeSubgroup, setActiveSubgroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected bone details
  const selectedBone = useMemo(() => {
    return ALL_206_BONES.find(b => b.id === selectedBoneId) || ALL_206_BONES[0];
  }, [selectedBoneId]);

  // Filtered bones list
  const filteredBones = useMemo(() => {
    return ALL_206_BONES.filter((bone) => {
      const matchesSearch =
        bone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bone.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bone.landmarks && bone.landmarks.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (activeSubgroup === 'all') return true;
      return bone.subgroup === activeSubgroup;
    });
  }, [searchQuery, activeSubgroup]);

  const completionPercent = Math.round((assembledBones.length / TOTAL_BONE_COUNT) * 100);

  return (
    <aside aria-label="Anatomical Workbench" className="w-96 h-full bg-[#070c18]/95 backdrop-blur-2xl border-l border-cyan-500/20 flex flex-col shadow-2xl z-20 select-none">
      
      {/* 1. TOP DOCK HEADER & METRICS */}
      <div className="p-4 border-b border-cyan-500/20 bg-[#050914]/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🦴</span>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-cyan-200">Osteogenesis Matrix</h2>
              <span className="text-[9px] font-mono text-slate-400">Homo Sapiens Skeletal Rig</span>
            </div>
          </div>
          <span className="text-xs font-mono font-black text-cyan-400">{completionPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mb-3">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300 shadow-[0_0_10px_#22d3ee]"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono mb-2">
          <span className="text-slate-400">Assembled Bones:</span>
          <span className="font-bold text-cyan-300">{assembledBones.length} / {TOTAL_BONE_COUNT}</span>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={assembleAllBones}
            className="flex-1 py-1.5 px-2.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>⚡</span>
            <span>Assemble All</span>
          </button>
          <button
            onClick={resetSkeleton}
            className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95"
            title="Reset Assembly"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* 2. LAYER SELECTOR TABS */}
      <div className="p-2 border-b border-slate-800 bg-[#060a14] grid grid-cols-6 gap-1">
        {LAYERS.map((layer) => {
          const isVisible = layerVisibility[layer.id];
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`py-1.5 px-1 rounded-xl text-center transition-all flex flex-col items-center gap-0.5 border ${
                isVisible
                  ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                  : 'border-slate-800/80 bg-slate-900/40 text-slate-500 hover:text-slate-300'
              }`}
              title={`Toggle ${layer.label} Layer (${layer.count})`}
            >
              <span className="text-xs">{layer.icon}</span>
              <span className="text-[8px] font-bold uppercase tracking-tighter truncate w-full">{layer.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2b. BIO-LAB TO 3D ANATOMY TISSUE BIOPRINTING BRIDGE */}
      <div className="px-3 py-2 border-b border-slate-800 bg-[#040812] space-y-1.5">
        <div className="flex items-center justify-between text-[8.5px] font-mono uppercase tracking-wider text-teal-400 font-bold">
          <span>🧬 Bio-Organ Drag & Snap Tray</span>
          <span className="text-slate-400">Drag onto 3D Body</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {[
            { id: 'osteoid', label: 'Skeleton', icon: '🦴', hint: 'Drag to Body Frame' },
            { id: 'myofibril', label: 'Muscles', icon: '💪', hint: 'Drag to Body Frame' },
            { id: 'visceral', label: 'Organs', icon: '🫁', hint: 'Drag to Thorax/Abdomen' },
            { id: 'endothelial', label: 'Heart', icon: '🫀', hint: 'Drag to Thorax' },
            { id: 'neural', label: 'Brain', icon: '🧠', hint: 'Drag to Cranium' },
          ].map((t) => {
            const snapped = !!bioprintedTissues[t.id];
            const readyToDrag = !!fabricatedOrgans[t.id] && !snapped;
            const recipe = BIO_TISSUE_RECIPES[t.id];
            return (
              <div
                key={t.id}
                draggable={!snapped}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({ kind: 'organ', id: t.id })
                  );
                }}
                onClick={() => !snapped && !readyToDrag && synthesizeBioTissue && synthesizeBioTissue(t.id)}
                title={
                  snapped
                    ? `${t.label}: Snapped into Anatomy`
                    : readyToDrag
                    ? `${t.label} ready! ${t.hint}`
                    : `${recipe?.name || t.label} — Drag onto 3D body or click to synthesize`
                }
                className={`py-1.5 px-1 rounded-lg text-[8px] font-mono font-bold border transition-all flex flex-col items-center justify-center gap-0.5 select-none ${
                  snapped
                    ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-200 cursor-default'
                    : readyToDrag
                    ? 'border-cyan-400 bg-cyan-500/25 text-cyan-100 cursor-grab active:cursor-grabbing animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.25)]'
                    : 'border-teal-500/25 bg-teal-500/10 text-teal-300 hover:bg-teal-500/25 cursor-grab'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                <span className="text-[6.5px] opacity-75">
                  {snapped ? '✓' : readyToDrag ? '⋮⋮ DRAG' : 'READY'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. UNIVERSAL 2,200-STRUCTURE & BONE SCIENTIFIC INSPECTOR + X-RAY / PEEL */}
      {(selectedStructure || selectedBone) && (
        <div className="p-3.5 border-b border-cyan-500/20 bg-[#080e1e]/90">
          <div className="flex items-start justify-between mb-1.5 gap-2">
            <div className="min-w-0">
              <span className="text-[8px] font-bold uppercase tracking-widest text-cyan-400 block truncate">
                {selectedStructure && !selectedStructure.boneId
                  ? `${selectedStructure.system} • ${selectedStructure.layer}`
                  : `${selectedBone.region} • ${selectedBone.subgroup}`}
              </span>
              <h3 className="text-xs font-black text-white truncate">
                {selectedStructure && !selectedStructure.boneId ? selectedStructure.name : selectedBone.name}
              </h3>
              <span className="text-[10px] italic text-cyan-200/80 font-serif block truncate">
                {selectedStructure && !selectedStructure.boneId ? selectedStructure.latinName : selectedBone.latinName}
              </span>
            </div>

            {(!selectedStructure || selectedStructure.boneId) && (
              <button
                draggable={!assembledBones.includes(selectedBone.id)}
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({
                      kind: 'bone',
                      id: selectedBone.id,
                      region: selectedBone.region,
                    })
                  );
                }}
                onClick={() => assembleBone(selectedBone.id)}
                title={`Drag onto ${selectedBone.region} on the 3D body (or click to snap)`}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border shrink-0 transition-all ${
                  assembledBones.includes(selectedBone.id)
                    ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                    : 'border-cyan-400 bg-cyan-500/30 text-white hover:bg-cyan-400 hover:text-black shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-grab active:cursor-grabbing'
                }`}
              >
                {assembledBones.includes(selectedBone.id) ? '✓ Assembled' : '⋮⋮ Drag / Snap'}
              </button>
            )}
          </div>

          {(!selectedStructure || selectedStructure.boneId) ? (
            <div className="text-[9px] space-y-1 text-slate-300 font-mono mt-1.5">
              <div><strong className="text-slate-400">Landmarks:</strong> {selectedBone.landmarks}</div>
              <div><strong className="text-slate-400">Ossification:</strong> <span className="capitalize text-amber-300">{selectedBone.ossification}</span></div>
              <div className="text-[8.5px] text-slate-400 italic pt-1 border-t border-slate-800/80">{selectedBone.clinicalSignificance}</div>
            </div>
          ) : (
            <div className="text-[9px] text-slate-300 font-mono mt-1 pt-1 border-t border-slate-800/80">
              High-definition Z-Anatomy 3D structure. Use X-Ray or Peel below to inspect deeper structures underneath.
            </div>
          )}

          {/* X-RAY 20% & PEEL DISSECTION CONTROLS */}
          <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
            {(() => {
              const activeKey = selectedStructure?.meshKey || selectedBone?.id;
              const isXRay = xrayMeshKeys.includes(activeKey);
              const totalModified = xrayMeshKeys.length + peeledMeshKeys.length;
              return (
                <>
                  <button
                    onClick={() => activeKey && toggleXRayStructure(activeKey)}
                    className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                      isXRay
                        ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200'
                        : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200'
                    }`}
                    title="Make structure 20% translucent X-Ray glass to see inside/behind it"
                  >
                    🔍 {isXRay ? 'X-Ray Active' : 'X-Ray (20%)'}
                  </button>
                  <button
                    onClick={() => activeKey && peelStructure(activeKey)}
                    className="flex-1 py-1 px-2 rounded-lg text-[9px] font-mono font-bold border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                    title="Peel / hide this structure to expose deeper anatomy"
                  >
                    🔪 Peel / Hide
                  </button>
                  {totalModified > 0 && (
                    <button
                      onClick={restoreAllPeeled}
                      className="py-1 px-2 rounded-lg text-[9px] font-mono font-bold border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer"
                      title="Restore all peeled and X-rayed structures"
                    >
                      ↺ Restore ({totalModified})
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 4. SEARCH & SUBGROUP FILTER CHIPS */}
      <div className="p-2.5 border-b border-slate-800 bg-[#050914] space-y-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 206 bones (e.g. Femur, Atlas, Rib)..."
          className="w-full bg-[#0a1020] border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
        />

        <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar text-[9px]">
          <button
            onClick={() => setActiveSubgroup('all')}
            className={`px-2 py-0.5 rounded-lg font-bold shrink-0 border transition-all ${
              activeSubgroup === 'all'
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All (206)
          </button>
          {Object.values(BONE_SUBGROUPS).map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveSubgroup(group.id)}
              className={`px-2 py-0.5 rounded-lg font-bold shrink-0 border transition-all ${
                activeSubgroup === group.id
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                  : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {group.name.split(' ')[0]} ({group.count})
            </button>
          ))}
        </div>
      </div>

      {/* 5. SCROLLABLE BONE PALETTE */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
        {filteredBones.map((bone) => {
          const isPlaced = assembledBones.includes(bone.id);
          const isSelected = selectedBoneId === bone.id;

          return (
            <div
              key={bone.id}
              onClick={() => setSelectedBoneId(bone.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : isPlaced
                  ? 'border-slate-800 bg-[#090f1e]/60 hover:border-slate-700'
                  : 'border-cyan-500/20 bg-[#060c18] hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isPlaced ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-cyan-400/50'}`} />
                <div className="truncate">
                  <div className="font-bold text-slate-200 truncate">{bone.name}</div>
                  <div className="text-[9px] text-slate-500 italic truncate font-serif">{bone.latinName}</div>
                </div>
              </div>

              {!isPlaced && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    assembleBone(bone.id);
                  }}
                  className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-200 rounded-lg text-[9px] font-bold shrink-0 transition-all active:scale-95"
                >
                  Snap
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 6. VITAL SIGNS, MULTI-ORGAN HOMEOSTASIS & CLINICAL REGENERATIVE REPAIR (UPGRADES #4 & #5) */}
      <div className="p-3 border-t border-cyan-500/20 bg-[#050914] text-[10px] font-mono space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span>Systemic Homeostasis:</span>
          <span
            className={`font-bold ${
              activePathology
                ? 'text-rose-400'
                : systemicHomeostasis.homeostasisScore >= 80
                ? 'text-emerald-400'
                : 'text-cyan-300'
            }`}
          >
            {systemicHomeostasis.homeostasisScore}% • {systemicHomeostasis.statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[8.5px]">
          <div className="bg-[#090f1e] p-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">Heart Rate</span>
            <span className="font-bold text-rose-300">{vitalSigns.heartRate} BPM</span>
          </div>
          <div className="bg-[#090f1e] p-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">Systemic DO₂</span>
            <span className="font-bold text-cyan-300">
              {systemicHomeostasis.systemicO2DeliveryMlMin} mL/m
            </span>
          </div>
          <div className="bg-[#090f1e] p-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">EEG / ATP</span>
            <span className="font-bold text-amber-300">
              {vitalSigns.eegFrequency}Hz • {systemicHomeostasis.systemicAtpFluxMmolMin}
            </span>
          </div>
        </div>

        {/* Upgrade #5: Clinical Pathophysiology & Stem-Cell Regenerative Repair Deck */}
        <div className="pt-1 border-t border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[8.5px] text-slate-400">
            <span>🏥 Clinical Pathophysiology Sim:</span>
            {activePathology && (
              <button
                onClick={applyRegenerativeRepair}
                className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black uppercase cursor-pointer"
              >
                🧬 Stem-Cell Repair →
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {Object.values(CLINICAL_PATHOLOGIES).map((p) => {
              const isSelected = activePathology === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => triggerPathology(p.id)}
                  title={`${p.label}: ${p.description}`}
                  className={`py-1 px-1 rounded text-[8px] font-bold truncate border cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                      : 'bg-[#090f1e] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.icon} {p.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default React.memo(AnatomyWorkbench);
