import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../store';
import { useAnatomyStore } from '../../anatomy-lab/store';
import { useStore } from '../../store';
import { cosmicAudio } from '../../utils/cosmicAudioBus';
import {
  TIER_1_ORGAN_SYSTEMS,
  TIER_2_TISSUE_SCAFFOLDS,
  TIER_3_CELL_LINEAGES,
  TIER_4_FOLDED_PROTEINS,
  evaluateOrganSystemChain
} from '../data/topDownBioHierarchy';

const TopDownOrganogenesisLab = ({ onNavigateMode, onOpenAnatomy }) => {
  const mountRef = useRef(null);

  const selectedOrganSystemId =
    useBioStore((s) => s.selectedOrganSystemId) || 'skeletal_system';
  const setSelectedOrganSystemId = useBioStore((s) => s.setSelectedOrganSystemId);
  const transcribedGenes = useBioStore((s) => s.transcribedGenes) || [];
  const foldedProteins = useBioStore((s) => s.foldedProteins) || [];
  const differentiatedCells = useBioStore((s) => s.differentiatedCells) || [];
  const engineeredTissues = useBioStore((s) => s.engineeredTissues) || [];
  const currentCellDesign = useBioStore((s) => s.currentCellDesign);

  const transcribeAndTranslateGene = useBioStore((s) => s.transcribeAndTranslateGene);
  const foldTopDownProtein = useBioStore((s) => s.foldTopDownProtein);
  const differentiateCellLineage = useBioStore((s) => s.differentiateCellLineage);
  const bioprintTissueScaffold = useBioStore((s) => s.bioprintTissueScaffold);
  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);
  const autoAssembleOptimalLuca = useBioStore((s) => s.autoAssembleOptimalLuca);

  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};
  const synthesizeBioTissue = useAnatomyStore((s) => s.synthesizeBioTissue);

  const chainEval = useMemo(
    () =>
      evaluateOrganSystemChain(
        selectedOrganSystemId,
        {
          transcribedGenes,
          foldedProteins,
          differentiatedCells,
          engineeredTissues,
          currentCellDesign
        },
        { bioprintedTissues }
      ),
    [
      selectedOrganSystemId,
      transcribedGenes,
      foldedProteins,
      differentiatedCells,
      engineeredTissues,
      currentCellDesign,
      bioprintedTissues
    ]
  );

  const activeSystem = chainEval.system;
  const activeScaffold = TIER_2_TISSUE_SCAFFOLDS[activeSystem.requiredTissue];

  // 3D Multi-Scale Histogenesis & ECM Bioreactor Hologram
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 7.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x99f6e4, 0.8));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Tier 2: Extracellular Matrix (ECM) Fiber Lattice
    const ecmColor = chainEval.tissueReady ? 0x10b981 : 0x0284c7;
    const ecmMat = new THREE.MeshStandardMaterial({
      color: ecmColor,
      emissive: ecmColor,
      emissiveIntensity: chainEval.tissueReady ? 0.55 : 0.15,
      wireframe: !chainEval.tissueReady,
      transparent: true,
      opacity: chainEval.tissueReady ? 0.75 : 0.3
    });

    for (let i = -2; i <= 2; i++) {
      const rodH = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8, 12), ecmMat);
      rodH.position.set(i * 0.65, 0, 0);
      rodH.rotation.z = Math.PI / 4;
      rootGroup.add(rodH);

      const rodV = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8, 12), ecmMat);
      rodV.position.set(0, i * 0.65, 0);
      rodV.rotation.z = -Math.PI / 4;
      rootGroup.add(rodV);
    }

    // 2. Tier 3: Differentiated Specialized Cells seeded on the ECM
    const cellNodes = [];
    activeSystem.requiredCells.forEach((cid, idx) => {
      const cellMeta = TIER_3_CELL_LINEAGES[cid];
      const isReady = differentiatedCells.includes(cid);
      const count = 6;
      for (let k = 0; k < count; k++) {
        const angle = (k / count) * Math.PI * 2 + idx * 0.6;
        const radius = 1.05 + idx * 0.55;
        const cellMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.26, 20, 20),
          new THREE.MeshPhysicalMaterial({
            color: isReady ? cellMeta.color : 0x334155,
            emissive: isReady ? cellMeta.color : 0x0f172a,
            emissiveIntensity: isReady ? 0.45 : 0.1,
            transmission: 0.55,
            transparent: true,
            opacity: isReady ? 0.9 : 0.35
          })
        );
        cellMesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle * 2) * 0.45,
          Math.sin(angle) * radius
        );
        rootGroup.add(cellMesh);
        cellNodes.push({ mesh: cellMesh, phase: k + idx });
      }
    });

    // 3. Tier 4 & 5: Folded Protein Helices & Central DNA Core
    const dnaCore = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.52, 0.11, 64, 12, 2, 3),
      new THREE.MeshStandardMaterial({
        color: chainEval.missingProteins.length === 0 ? 0xf59e0b : 0x38bdf8,
        emissive: chainEval.missingProteins.length === 0 ? 0xd97706 : 0x0369a1,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.6
      })
    );
    rootGroup.add(dnaCore);

    let animId;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.02;
      rootGroup.rotation.y = t * 0.35;
      dnaCore.rotation.x = t * 0.8;
      cellNodes.forEach(({ mesh, phase }) => {
        const s = 1 + Math.sin(t * 2.5 + phase) * 0.08;
        mesh.scale.setScalar(s);
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [activeSystem, differentiatedCells, chainEval.tissueReady, chainEval.missingProteins.length]);

  const handleDeployTo3DAnatomy = () => {
    const anatomyTissueId = synthesizeFullOrganChain(activeSystem.id);
    if (synthesizeBioTissue) {
      synthesizeBioTissue(anatomyTissueId);
    }
    cosmicAudio.playSynthesisChord();
    useStore
      .getState()
      .showMessage(
        `🦴 Deployed ${activeSystem.name} (${activeSystem.meshCount} 3D Meshes) into 3D Anatomy Lab!`
      );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#040812] p-5 pb-20 gap-4 overflow-y-auto custom-scrollbar select-none">
      {/* TIER 1 (TOP): TARGET MACRO-ORGAN & SKELETAL SYSTEM SELECTOR */}
      <div className="argon-panel rounded-3xl p-4 border border-teal-500/25 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-[9px] font-mono font-black text-teal-400 uppercase tracking-widest">
              TIER 1 (TOP OF HIERARCHY) // TARGET 3D MACRO-ANATOMICAL SYSTEM
            </span>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Reverse-Engineer Organ Systems from Macro-Structure Down to DNA Codons
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeployTo3DAnatomy}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
              title="Complete all prerequisite sub-tiers and deploy directly into the 3D Human Anatomy Rig"
            >
              ⚡ Synthesize Full Chain & Deploy to 3D ({chainEval.readinessPercent}%)
            </button>
            {onOpenAnatomy && (
              <button
                onClick={onOpenAnatomy}
                className="px-3 py-2 rounded-xl bg-[#091224] hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-mono font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                🦴 View in 3D Anatomy →
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {TIER_1_ORGAN_SYSTEMS.map((sys) => {
            const isSelected = sys.id === activeSystem.id;
            const isDeployed = Boolean(bioprintedTissues[sys.anatomyTissueId]);
            return (
              <button
                key={sys.id}
                onClick={() => setSelectedOrganSystemId(sys.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-teal-500/20 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.25)]'
                    : 'bg-[#070d19] border-slate-800 hover:border-teal-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{sys.icon}</span>
                  <span
                    className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isDeployed
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {isDeployed ? '✓ IN 3D RIG' : `${sys.meshCount} MESHES`}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-black text-white uppercase leading-tight">
                    {sys.name}
                  </div>
                  <div className="text-[8.5px] italic text-teal-300/80 font-serif truncate">
                    {sys.latinName}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN BODY: LEFT 4-TIER CASCADE (TIER 2 -> TIER 5) + RIGHT 3D BIOREACTOR HOLOGRAM */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* LEFT 8 COLUMNS: TOP-DOWN DEPENDENCY CASCADE */}
        <div className="col-span-8 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
          {/* TIER 2: HISTOGENESIS TISSUE SCAFFOLD & ECM BIOREACTOR */}
          <div className="argon-panel rounded-2xl p-4 border border-cyan-500/25">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[8.5px] font-mono font-black text-cyan-400 uppercase tracking-widest">
                  ↓ TIER 2 // HISTOGENESIS & EXTRACELLULAR MATRIX (ECM) SCAFFOLD
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  {activeScaffold.icon} {activeScaffold.name} ({activeScaffold.formula})
                </h3>
              </div>
              <button
                onClick={() => {
                  bioprintTissueScaffold(activeScaffold.id);
                  if (synthesizeBioTissue) synthesizeBioTissue(activeSystem.anatomyTissueId);
                  cosmicAudio.playSynthesisChord();
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-[9px] font-bold uppercase border transition-all cursor-pointer ${
                  chainEval.tissueReady
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/35 border-cyan-400 text-cyan-200'
                }`}
              >
                {chainEval.tissueReady
                  ? '✓ ECM Scaffold Bio-Printed'
                  : '🧬 Bio-Print Tissue Scaffold'}
              </button>
            </div>
            <p className="text-[10px] text-slate-300 font-mono">
              <strong className="text-slate-400">Micro-Architecture:</strong>{' '}
              {activeScaffold.ecmArchitecture}
            </p>
          </div>

          {/* TIER 3: STEM-CELL MORPHOGEN DIFFERENTIATION */}
          <div className="argon-panel rounded-2xl p-4 border border-emerald-500/25">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[8.5px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                  ↓ TIER 3 // SPECIALIZED CELL LINEAGE DIFFERENTIATION (MORPHOGEN GRADIENTS)
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  Required Specialized Cells for {activeScaffold.name}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-emerald-300">
                {activeSystem.requiredCells.length - chainEval.missingCells.length} /{' '}
                {activeSystem.requiredCells.length} Differentiated
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {activeSystem.requiredCells.map((cid) => {
                const cell = TIER_3_CELL_LINEAGES[cid];
                const isReady = differentiatedCells.includes(cid);
                return (
                  <div
                    key={cid}
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-2 ${
                      isReady
                        ? 'bg-emerald-950/30 border-emerald-400/50'
                        : 'bg-[#070d19] border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">
                          {cell.icon} {cell.name}
                        </span>
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-teal-300">
                          {cell.germLayer}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-amber-300 mt-1">
                        Morphogen: {cell.morphogenSignal}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1">{cell.role}</p>
                    </div>

                    <button
                      onClick={() => differentiateCellLineage(cid)}
                      className={`w-full py-1.5 rounded-lg font-mono text-[9px] font-bold uppercase border transition-all cursor-pointer ${
                        isReady
                          ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-200'
                          : 'bg-teal-500/20 hover:bg-teal-500/35 border-teal-400/50 text-teal-200'
                      }`}
                    >
                      {isReady ? '✓ Lineage Differentiated' : '🧫 Apply Morphogen & Differentiate'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIER 4: 3D PROTEIN FOLDING & CHAPERONIN WORKBENCH */}
          <div className="argon-panel rounded-2xl p-4 border border-amber-500/25">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[8.5px] font-mono font-black text-amber-400 uppercase tracking-widest">
                  ↓ TIER 4 // 3D PROTEIN FOLDING & MACROMOLECULAR COMPLEXES
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  Structural & Enzymatic Proteins Required by Cells & ECM
                </h3>
              </div>
              {onNavigateMode && (
                <button
                  onClick={() => onNavigateMode('folding')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 font-mono text-[8.5px] font-bold uppercase cursor-pointer"
                >
                  Open 3D Protein Folder →
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {activeSystem.requiredProteins.map((pid) => {
                const prot = TIER_4_FOLDED_PROTEINS[pid];
                const isFolded = foldedProteins.includes(pid);
                return (
                  <div
                    key={pid}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between gap-2 ${
                      isFolded
                        ? 'bg-amber-950/25 border-amber-400/50'
                        : 'bg-[#070d19] border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-black text-white">
                        {prot.icon} {prot.name}
                      </div>
                      <div className="text-[8.5px] font-mono text-cyan-300 mt-0.5">
                        {prot.secondaryStructure} • ΔG = {prot.freeEnergyKcal} kcal/mol
                      </div>
                      <div className="text-[8px] font-mono text-slate-400 mt-0.5">
                        Chaperonin: {prot.chaperonin}
                      </div>
                    </div>

                    <button
                      onClick={() => foldTopDownProtein(pid)}
                      className={`w-full py-1 rounded-lg font-mono text-[8.5px] font-bold uppercase border transition-all cursor-pointer ${
                        isFolded
                          ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-200'
                          : 'bg-amber-500/20 hover:bg-amber-500/35 border-amber-400/50 text-amber-200'
                      }`}
                    >
                      {isFolded ? '✓ 3D Folded (Native State)' : '🌀 Fold Polypeptide'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIER 5 (BOTTOM FOUNDATION): DNA CODING GENES, mRNA CODONS & ORGANELLE RIBOSOMES */}
          <div className="argon-panel rounded-2xl p-4 border border-purple-500/25">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[8.5px] font-mono font-black text-purple-400 uppercase tracking-widest">
                  ↓ TIER 5 (BOTTOM FOUNDATION) // DNA CODING GENES → mRNA CODONS → 80S RIBOSOME & ORGANELLES
                </span>
                <h3 className="text-xs font-black text-white uppercase">
                  Intracellular Organelle Machinery & Ribosomal Translation
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={autoAssembleOptimalLuca}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[8.5px] font-bold uppercase border cursor-pointer ${
                    chainEval.coreOrganellesReady
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                      : 'bg-purple-500/20 hover:bg-purple-500/35 border-purple-400/50 text-purple-200'
                  }`}
                >
                  {chainEval.coreOrganellesReady
                    ? '✓ Organelles Active (Nucleus/Mito/Ribosome)'
                    : '⚡ Equip Core Organelles'}
                </button>
                {onNavigateMode && (
                  <button
                    onClick={() => onNavigateMode('assembly')}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[8.5px] font-bold uppercase cursor-pointer"
                  >
                    Cell Builder →
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              {activeSystem.requiredProteins.map((pid) => {
                const prot = TIER_4_FOLDED_PROTEINS[pid];
                const isTranscribed = transcribedGenes.includes(prot.geneId);
                const mrnaPreview = prot.dna
                  .replace(/T/g, 'U')
                  .match(/.{1,3}/g)
                  .slice(0, 8)
                  .join('-');
                return (
                  <div
                    key={prot.geneId}
                    className="p-2 rounded-xl bg-[#070d19] border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[9.5px] font-mono font-bold text-purple-200">
                        Gene {prot.geneId.toUpperCase()} → mRNA:{' '}
                        <span className="text-cyan-300">{mrnaPreview}-...</span>
                      </div>
                      <div className="text-[8px] font-mono text-slate-400 truncate">
                        5&apos; Coding DNA: {prot.dna} (Translated by 80S Ribosome + Mitochondrial ATP)
                      </div>
                    </div>
                    <button
                      onClick={() => transcribeAndTranslateGene(prot.geneId)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[8.5px] font-bold uppercase border shrink-0 cursor-pointer ${
                        isTranscribed
                          ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                          : 'bg-purple-500/20 hover:bg-purple-500/35 border-purple-400/40 text-purple-200'
                      }`}
                    >
                      {isTranscribed ? '✓ mRNA Translated' : '🧬 Transcribe & Translate'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLUMNS: 3D HISTOGENESIS BIOREACTOR VIEWPORT & CHAIN SUMMARY */}
        <div className="col-span-4 flex flex-col gap-3">
          <div className="flex-1 relative rounded-3xl border border-teal-500/25 bg-[#050914] overflow-hidden flex items-center justify-center min-h-[280px]">
            <div ref={mountRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 right-4 pointer-events-none">
              <span className="text-[8.5px] font-mono font-bold text-teal-400 uppercase tracking-widest block">
                3D Multi-Scale Bioreactor Lattice
              </span>
              <h4 className="text-sm font-black text-white uppercase">
                {activeSystem.icon} {activeSystem.name}
              </h4>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                {activeSystem.description}
              </p>
            </div>
          </div>

          <div className="argon-panel rounded-2xl p-4 border border-teal-500/25 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400 uppercase">Top-Down Chain Readiness:</span>
              <span className="font-black text-teal-300">{chainEval.readinessPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${chainEval.readinessPercent}%` }}
              />
            </div>
            <p className="text-[9px] font-mono text-cyan-200/90">{activeSystem.clinicalNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDownOrganogenesisLab;
