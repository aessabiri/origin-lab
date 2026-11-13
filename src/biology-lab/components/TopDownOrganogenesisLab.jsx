import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../store';
import { useAnatomyStore } from '../../anatomy-lab/store';
import { useStore } from '../../store';
import { cosmicAudio } from '../../utils/cosmicAudioBus';
import {
  LEVEL_1_MACROMOLECULES,
  LEVEL_2_ORGANELLES,
  LEVEL_3_CELLS,
  LEVEL_4_TISSUES,
  TIER_1_ORGAN_SYSTEMS,
  TIER_4_FOLDED_PROTEINS,
  evaluateOrganSystemChain
} from '../data/topDownBioHierarchy';
import {
  createBDNADoubleHelix,
  createHDNucleus,
  createHDMitochondrion,
  createHD80SRibosome,
  createHDPlasmaMembrane,
  create3DOrganForSystem
} from '../utils/organelle3DFactory';

const PIPELINE_STAGES = [
  { id: 'organ', level: 5, title: '5. Human Organ', sub: '3D Macro Structure' },
  { id: 'tissue', level: 4, title: '4. Tissue & ECM', sub: 'Cells + Matrix' },
  { id: 'cell', level: 3, title: '3. Specialized Cell', sub: 'Organelles + Proteins' },
  { id: 'organelle', level: 2, title: '2. 3D Organelle', sub: 'Sub-Cellular Parts' },
  { id: 'molecule', level: 1, title: '1. Macromolecules', sub: 'From Chemistry & Atoms' }
];

const TopDownOrganogenesisLab = ({ onNavigateMode, onOpenAnatomy }) => {
  const mountRef = useRef(null);

  const selectedOrganSystemId =
    useBioStore((s) => s.selectedOrganSystemId) || 'cardiovascular_system';
  const setSelectedOrganSystemId = useBioStore((s) => s.setSelectedOrganSystemId);
  const transcribedGenes = useBioStore((s) => s.transcribedGenes) || [];
  const foldedProteins = useBioStore((s) => s.foldedProteins) || [];
  const assembledOrganelleParts = useBioStore((s) => s.assembledOrganelleParts) || [];
  const assembledOrganelles = useBioStore((s) => s.assembledOrganelles) || [];
  const differentiatedCells = useBioStore((s) => s.differentiatedCells) || [];
  const engineeredTissues = useBioStore((s) => s.engineeredTissues) || [];
  const currentCellDesign = useBioStore((s) => s.currentCellDesign);

  const snapOrganellePart = useBioStore((s) => s.snapOrganellePart);
  const assembleCompleteOrganelle = useBioStore((s) => s.assembleCompleteOrganelle);
  const transcribeAndTranslateGene = useBioStore((s) => s.transcribeAndTranslateGene);
  const foldTopDownProtein = useBioStore((s) => s.foldTopDownProtein);
  const differentiateCellLineage = useBioStore((s) => s.differentiateCellLineage);
  const bioprintTissueScaffold = useBioStore((s) => s.bioprintTissueScaffold);
  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);

  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};
  const synthesizeBioTissue = useAnatomyStore((s) => s.synthesizeBioTissue);

  // Active stage in the 5-stage assembly line ('organ' | 'tissue' | 'cell' | 'organelle' | 'molecule')
  const [activeStage, setActiveStage] = useState('organ');
  const [selectedOrganelleId, setSelectedOrganelleId] = useState('mitochondrion');
  const [selectedCellId, setSelectedCellId] = useState('cardiomyocyte');
  const [selectedMoleculeId, setSelectedMoleculeId] = useState('actin_myosin');

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
  const activeTissue = LEVEL_4_TISSUES[activeSystem.requiredTissue];

  // Keep selected cell & molecule aligned when switching target Organ System
  useEffect(() => {
    setSelectedCellId(activeSystem.requiredCells[0]);
    setSelectedMoleculeId(activeSystem.requiredProteins[0]);
  }, [activeSystem.id]);

  const activeCell = LEVEL_3_CELLS[selectedCellId] || LEVEL_3_CELLS[activeSystem.requiredCells[0]];
  const activeOrganelle = LEVEL_2_ORGANELLES[selectedOrganelleId] || LEVEL_2_ORGANELLES.mitochondrion;
  const activeMolecule =
    LEVEL_1_MACROMOLECULES[selectedMoleculeId] || LEVEL_1_MACROMOLECULES.collagen_i;

  // Dedicated 3D Assembly Viewport for all 5 levels
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 460;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xf1f5f9, 0.95));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x10b981, 1.8, 20);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const animatedItems = [];

    if (activeStage === 'organ' || activeStage === 'tissue') {
      // LEVEL 5 & 4: Render Sculpted High-Definition 3D Organ Model (Heart, Lungs/Liver, Brain, Muscle, Bone)
      const organModel = create3DOrganForSystem(activeSystem.id);
      const isComplete =
        activeStage === 'organ' ? chainEval.deployedIn3D || chainEval.tissueReady : chainEval.tissueReady;

      // If prerequisite sub-elements aren't assembled yet, show non-assembled parts as blueprint wireframe
      if (!isComplete) {
        organModel.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material = child.material.clone();
            child.material.transparent = true;
            child.material.opacity = Math.max(0.32, chainEval.readinessPercent / 100);
            if (chainEval.readinessPercent < 40) {
              child.material.wireframe = true;
            }
          }
        });
      }

      rootGroup.add(organModel);
      animatedItems.push({ group: organModel, mode: 'organ', systemId: activeSystem.id });
    } else if (activeStage === 'cell') {
      // LEVEL 3: Render Specialized Cell with its Assembled 3D Organelles inside
      const isCellReady = differentiatedCells.includes(activeCell.id);
      const outerMembrane = new THREE.Mesh(
        new THREE.SphereGeometry(1.45, 48, 48),
        new THREE.MeshPhysicalMaterial({
          color: activeCell.color,
          emissive: activeCell.color,
          emissiveIntensity: isCellReady ? 0.18 : 0.05,
          transmission: 0.78,
          transparent: true,
          opacity: isCellReady ? 0.42 : 0.2,
          wireframe: !isCellReady && assembledOrganelles.length === 0,
          roughness: 0.12,
          ior: 1.38,
          clearcoat: 1.0,
          side: THREE.DoubleSide
        })
      );
      rootGroup.add(outerMembrane);

      // Central Nucleus inside cell
      const nuc = createHDNucleus(
        assembledOrganelles.includes('nucleus') || isCellReady ? null : assembledOrganelleParts
      );
      nuc.scale.setScalar(0.75);
      rootGroup.add(nuc);
      animatedItems.push({ group: nuc, mode: 'float', phase: 0 });

      // 2 Mitochondria inside cell
      [-0.78, 0.78].forEach((xPos, i) => {
        const mito = createHDMitochondrion(
          assembledOrganelles.includes('mitochondrion') || isCellReady
            ? null
            : assembledOrganelleParts
        );
        mito.scale.setScalar(0.8);
        mito.position.set(xPos, i === 0 ? 0.42 : -0.42, 0.25);
        rootGroup.add(mito);
        animatedItems.push({ group: mito, mode: 'float', phase: i + 1 });
      });

      // 80S Ribosome inside cell
      const ribo = createHD80SRibosome(
        5,
        assembledOrganelles.includes('ribosome') || isCellReady ? null : assembledOrganelleParts
      );
      ribo.scale.setScalar(0.75);
      ribo.position.set(0, -0.72, 0.35);
      rootGroup.add(ribo);
      animatedItems.push({ group: ribo, mode: 'float', phase: 3 });
    } else if (activeStage === 'organelle') {
      // LEVEL 2: Render Selected 3D Organelle with Part-by-Part Blueprint -> Solid Assembly!
      const partsList = assembledOrganelleParts;
      let orgMeshGroup;
      if (activeOrganelle.id === 'nucleus') {
        orgMeshGroup = createHDNucleus(partsList);
        orgMeshGroup.scale.setScalar(1.65);
      } else if (activeOrganelle.id === 'mitochondrion') {
        orgMeshGroup = createHDMitochondrion(partsList);
        orgMeshGroup.scale.setScalar(2.4);
      } else if (activeOrganelle.id === 'ribosome') {
        orgMeshGroup = createHD80SRibosome(7, partsList);
        orgMeshGroup.scale.setScalar(2.3);
      } else {
        orgMeshGroup = createHDPlasmaMembrane(partsList);
        orgMeshGroup.scale.setScalar(1.9);
      }
      rootGroup.add(orgMeshGroup);
      animatedItems.push({ group: orgMeshGroup, mode: 'float', phase: 0 });
    } else {
      // LEVEL 1: Render Macromolecule (B-DNA Double Helix or Folded Protein Complex)
      if (selectedMoleculeId === 'bdna_chromatin') {
        const dna = createBDNADoubleHelix({
          basePairs: 22,
          radius: 0.42,
          height: 2.4,
          turns: 2.2
        });
        rootGroup.add(dna);
        animatedItems.push({ group: dna, mode: 'float', phase: 0 });
      } else if (selectedMoleculeId === 'phospholipid_bilayer') {
        const bilayer = createHDPlasmaMembrane(['mem_bilayer']);
        bilayer.scale.setScalar(1.8);
        rootGroup.add(bilayer);
        animatedItems.push({ group: bilayer, mode: 'float', phase: 0 });
      } else {
        const isFolded = foldedProteins.includes(selectedMoleculeId);
        const knot = new THREE.Mesh(
          new THREE.TorusKnotGeometry(0.72, isFolded ? 0.16 : 0.06, 96, 20, 2, 3),
          new THREE.MeshPhysicalMaterial({
            color: activeMolecule.color,
            emissive: activeMolecule.color,
            emissiveIntensity: isFolded ? 0.5 : 0.2,
            wireframe: !isFolded,
            roughness: 0.2,
            clearcoat: 1.0
          })
        );
        rootGroup.add(knot);
        animatedItems.push({ group: knot, mode: 'float', phase: 0 });
      }
    }

    // Pointer Drag to Rotate + Scroll to Zoom
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const onDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      rootGroup.rotation.y += (e.clientX - prevX) * 0.01;
      rootGroup.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = () => {
      isDragging = false;
    };
    const onWheel = (e) => {
      camera.position.z = Math.max(2.2, Math.min(7.5, camera.position.z + e.deltaY * 0.003));
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    dom.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let animId;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;
      if (!isDragging) {
        rootGroup.rotation.y += 0.0045;
      }

      animatedItems.forEach((item) => {
        if (item.mode === 'organ') {
          // Physiological motion: Heartbeat (72 BPM) or Lung Respiration
          const pulse =
            item.systemId === 'cardiovascular_system'
              ? 1 + Math.pow(Math.max(0, Math.sin(t * 4.5)), 4) * 0.06
              : item.systemId === 'visceral_system'
              ? 1 + Math.sin(t * 1.8) * 0.045
              : 1 + Math.sin(t * 2.2) * 0.015;
          item.group.scale.setScalar(pulse);
        } else {
          item.group.position.y = Math.sin(t * 2 + (item.phase || 0)) * 0.05;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onDown);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      renderer.dispose();
    };
  }, [
    activeStage,
    activeSystem.id,
    activeCell.id,
    activeOrganelle.id,
    selectedMoleculeId,
    assembledOrganelleParts,
    assembledOrganelles,
    foldedProteins,
    differentiatedCells,
    chainEval.tissueReady,
    chainEval.deployedIn3D,
    chainEval.readinessPercent
  ]);

  const handleDeployOrganTo3D = () => {
    const anatomyTissueId = synthesizeFullOrganChain(activeSystem.id);
    // Also mark all organelle parts as assembled
    Object.keys(LEVEL_2_ORGANELLES).forEach((oid) => assembleCompleteOrganelle(oid));
    if (synthesizeBioTissue) {
      synthesizeBioTissue(anatomyTissueId);
    }
    cosmicAudio.playSynthesisChord();
    useStore
      .getState()
      .showMessage(
        `🦴 Assembled & Deployed ${activeSystem.name} into the 3D Human Anatomy Atlas!`
      );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#060a12] p-4 pb-16 gap-3 overflow-hidden select-none">
      {/* 1. TOP BAR: SELECT TARGET HUMAN ORGAN + 5-STAGE ASSEMBLY CONVEYOR */}
      <header className="bg-[#0b1220] rounded-2xl p-3 border border-white/10 shrink-0 space-y-2.5">
        {/* Row A: Target Macro Human Organ Selector */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase pr-1 shrink-0">
              Target Organ:
            </span>
            {TIER_1_ORGAN_SYSTEMS.map((sys) => {
              const isSelected = sys.id === activeSystem.id;
              const isDeployed = Boolean(bioprintedTissues[sys.anatomyTissueId]);
              return (
                <button
                  key={sys.id}
                  onClick={() => setSelectedOrganSystemId(sys.id)}
                  className={`px-3 py-1.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-[#112233] border-cyan-400 text-white'
                      : 'bg-[#080d18] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{sys.icon}</span>
                  <span className="text-[10px] font-bold">{sys.name}</span>
                  {isDeployed && (
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenAnatomy && (
              <button
                onClick={onOpenAnatomy}
                className="px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-[10px] uppercase cursor-pointer"
              >
                🦴 View Human Body →
              </button>
            )}
          </div>
        </div>

        {/* Row B: 5-Stage Assembly Line Conveyor (Top-Down Inspection <-> Bottom-Up Assembly) */}
        <div className="grid grid-cols-5 gap-2 pt-1 border-t border-white/5">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : 'bg-[#080d18] border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-black truncate">{stage.title}</div>
                  <div className="text-[8.5px] font-mono text-slate-400 truncate">
                    {stage.sub}
                  </div>
                </div>
                {idx < PIPELINE_STAGES.length - 1 && (
                  <span className="text-xs font-mono text-cyan-400/70 pl-1">←</span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. MAIN WORKSPACE: LEFT 7-COL 3D ASSEMBLY VIEWPORT + RIGHT 5-COL PART-BY-PART BUILDER */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* LEFT 7 COLUMNS: 3D HOLOGRAPHIC ASSEMBLY STAGE */}
        <div className="col-span-7 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
          <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between pointer-events-none">
            <div className="bg-[#090d16]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase block">
                {activeStage === 'organ' && `STAGE 5 // 3D MACRO ORGAN (${activeSystem.latinName})`}
                {activeStage === 'tissue' && `STAGE 4 // 3D TISSUE SCAFFOLD (${activeTissue.name})`}
                {activeStage === 'cell' && `STAGE 3 // 3D SPECIALIZED CELL (${activeCell.name})`}
                {activeStage === 'organelle' &&
                  `STAGE 2 // 3D ORGANELLE ASSEMBLY (${activeOrganelle.name})`}
                {activeStage === 'molecule' &&
                  `STAGE 1 // 3D MACROMOLECULE (${activeMolecule.name})`}
              </span>
              <h3 className="text-sm font-black text-white mt-0.5">
                {activeStage === 'organ' && `${activeSystem.icon} ${activeSystem.name}`}
                {activeStage === 'tissue' && `${activeTissue.icon} ${activeTissue.name}`}
                {activeStage === 'cell' && `${activeCell.icon} ${activeCell.name}`}
                {activeStage === 'organelle' && `${activeOrganelle.icon} ${activeOrganelle.name}`}
                {activeStage === 'molecule' && `${activeMolecule.icon} ${activeMolecule.name}`}
              </h3>
            </div>

            <div className="bg-[#090d16]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-right">
              <span className="text-[8px] font-mono text-slate-400 uppercase block">
                Organ Readiness
              </span>
              <span className="text-sm font-mono font-black text-emerald-400">
                {chainEval.readinessPercent}%
              </span>
            </div>
          </div>

          <div
            ref={mountRef}
            className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
          />

          <div className="px-4 py-2 bg-[#090d16] border-t border-white/10 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
            <span>
              💡 Wireframe parts = Missing building blocks • Solid glowing parts = Assembled
            </span>
            <span>Drag to Rotate • Scroll to Zoom</span>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: PART-BY-PART ASSEMBLY BENCH */}
        <div className="col-span-5 flex flex-col bg-[#0b1220] rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {/* ==================== STAGE 5: MACRO HUMAN ORGAN ==================== */}
            {activeStage === 'organ' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                    STAGE 5 (TOP) // HUMAN ORGAN ASSEMBLY
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {activeSystem.icon} {activeSystem.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {activeSystem.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Required Building Blocks (Click any missing part to build it):
                  </div>

                  {/* Requirement 1: Stage 4 Tissue */}
                  <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white">
                        {activeTissue.icon} {activeTissue.name}
                      </div>
                      <div className="text-[9.5px] font-mono text-slate-400">
                        Stage 4 Tissue • Formula: {activeTissue.formula}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStage('tissue')}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[9.5px] font-bold uppercase border cursor-pointer ${
                        chainEval.tissueReady
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 hover:bg-cyan-500/35'
                      }`}
                    >
                      {chainEval.tissueReady ? '✓ Tissue Ready' : 'Go Build Tissue →'}
                    </button>
                  </div>

                  {/* Requirement 2: Stage 3 Specialized Cells */}
                  <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white">
                        Specialized Cells ({activeSystem.requiredCells.length})
                      </div>
                      <div className="text-[9.5px] font-mono text-slate-400">
                        {activeSystem.requiredCells
                          .map((cid) => LEVEL_3_CELLS[cid]?.name.split(' ')[0])
                          .join(' + ')}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStage('cell')}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[9.5px] font-bold uppercase border cursor-pointer ${
                        chainEval.missingCells.length === 0
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 hover:bg-cyan-500/35'
                      }`}
                    >
                      {chainEval.missingCells.length === 0
                        ? '✓ Cells Ready'
                        : 'Go Build Cells →'}
                    </button>
                  </div>

                  {/* Requirement 3: Stage 2 Organelles */}
                  <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white">
                        Intracellular Organelles (4 Core Classes)
                      </div>
                      <div className="text-[9.5px] font-mono text-slate-400">
                        Nucleus + Mitochondrion + 80S Ribosome + Membrane
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStage('organelle')}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[9.5px] font-bold uppercase border cursor-pointer ${
                        chainEval.coreOrganellesReady
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 hover:bg-cyan-500/35'
                      }`}
                    >
                      {chainEval.coreOrganellesReady
                        ? '✓ Organelles Ready'
                        : 'Go Build Organelles →'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDeployOrganTo3D}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-98 cursor-pointer"
                >
                  {chainEval.deployedIn3D
                    ? `✓ ${activeSystem.name} Installed in 3D Human Body`
                    : `🚀 Assemble & Install ${activeSystem.name} (${activeSystem.meshCount} Meshes)`}
                </button>
              </div>
            )}

            {/* ==================== STAGE 4: TISSUE & ECM ==================== */}
            {activeStage === 'tissue' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                    STAGE 4 // TISSUE & EXTRACELLULAR MATRIX ASSEMBLY
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {activeTissue.icon} {activeTissue.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{activeTissue.ecmArchitecture}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Building Blocks to Form {activeTissue.name}:
                  </div>
                  {activeTissue.parts.map((part) => {
                    const isPartReady =
                      part.refLevel === 3
                        ? differentiatedCells.includes(part.refId)
                        : foldedProteins.includes(part.refId);
                    return (
                      <div
                        key={part.id}
                        className="p-3 rounded-xl bg-[#080d18] border border-white/10 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{part.label}</div>
                          <div className="text-[9px] font-mono text-slate-400">
                            From Stage {part.refLevel} ({part.refId})
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (part.refLevel === 3) {
                              setSelectedCellId(part.refId);
                              setActiveStage('cell');
                            } else {
                              setSelectedMoleculeId(part.refId);
                              setActiveStage('molecule');
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold uppercase border cursor-pointer ${
                            isPartReady
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          }`}
                        >
                          {isPartReady ? '✓ Ready' : `Build Stage ${part.refLevel} →`}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    bioprintTissueScaffold(activeTissue.id);
                    if (synthesizeBioTissue)
                      synthesizeBioTissue(activeSystem.anatomyTissueId);
                    cosmicAudio.playSynthesisChord();
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  {chainEval.tissueReady
                    ? '✓ Tissue Assembled — Advance to Stage 5 Organ ↑'
                    : `🧬 Assemble ${activeTissue.name}`}
                </button>
              </div>
            )}

            {/* ==================== STAGE 3: SPECIALIZED HUMAN CELL ==================== */}
            {activeStage === 'cell' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">
                    STAGE 3 // SPECIALIZED CELL ASSEMBLY (FROM ORGANELLES + PROTEINS)
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {activeCell.icon} {activeCell.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{activeCell.role}</p>
                </div>

                {/* Cell Switcher for the current Organ */}
                <div className="flex gap-1.5">
                  {activeSystem.requiredCells.map((cid) => {
                    const c = LEVEL_3_CELLS[cid];
                    return (
                      <button
                        key={cid}
                        onClick={() => setSelectedCellId(cid)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-[9.5px] font-bold uppercase border cursor-pointer ${
                          activeCell.id === cid
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                            : 'bg-[#080d18] border-white/10 text-slate-400'
                        }`}
                      >
                        {c.icon} {c.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Organelle & Protein Sub-Blocks Inside {activeCell.name.split(' ')[0]}:
                  </div>
                  {activeCell.parts.map((part) => {
                    const isPartReady =
                      part.refLevel === 2
                        ? assembledOrganelles.includes(part.refId)
                        : foldedProteins.includes(part.refId);
                    return (
                      <div
                        key={part.id}
                        className="p-2.5 rounded-xl bg-[#080d18] border border-white/10 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{part.label}</div>
                          <div className="text-[9px] font-mono text-slate-400">
                            Requires Stage {part.refLevel}: {part.refId}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (part.refLevel === 2) {
                              setSelectedOrganelleId(part.refId);
                              setActiveStage('organelle');
                            } else {
                              setSelectedMoleculeId(part.refId);
                              setActiveStage('molecule');
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold uppercase border cursor-pointer ${
                            isPartReady
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          }`}
                        >
                          {isPartReady ? '✓ Installed' : `Build Stage ${part.refLevel} →`}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    activeCell.requiredOrganelles.forEach((oid) =>
                      assembleCompleteOrganelle(oid)
                    );
                    differentiateCellLineage(activeCell.id);
                    cosmicAudio.playSynthesisChord();
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  {differentiatedCells.includes(activeCell.id)
                    ? `✓ ${activeCell.name.split(' ')[0]} Assembled`
                    : `🧫 Assemble ${activeCell.name.split(' ')[0]} Cell`}
                </button>
              </div>
            )}

            {/* ==================== STAGE 2: 3D ORGANELLE ASSEMBLY ==================== */}
            {activeStage === 'organelle' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">
                    STAGE 2 // 3D ORGANELLE PART-BY-PART ASSEMBLY
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {activeOrganelle.icon} {activeOrganelle.name} — {activeOrganelle.subtitle}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{activeOrganelle.description}</p>
                </div>

                {/* Organelle Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.values(LEVEL_2_ORGANELLES).map((org) => {
                    const isDone = assembledOrganelles.includes(org.id);
                    return (
                      <button
                        key={org.id}
                        onClick={() => setSelectedOrganelleId(org.id)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          activeOrganelle.id === org.id
                            ? 'bg-[#112233] border-cyan-400 text-white'
                            : 'bg-[#080d18] border-white/10 text-slate-400'
                        }`}
                      >
                        <div className="text-sm">{org.icon}</div>
                        <div className="text-[9px] font-bold truncate mt-0.5">
                          {org.name.split(' ')[0]} {isDone ? '✓' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Snap-In Sub-Parts List */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Snap Sub-Components Together (Watch the 3D Organelle Solidify!):
                  </div>
                  {activeOrganelle.parts.map((part) => {
                    const isSnapped = assembledOrganelleParts.includes(part.id);
                    const blockMeta = LEVEL_1_MACROMOLECULES[part.blockId];
                    return (
                      <div
                        key={part.id}
                        className="p-2.5 rounded-xl bg-[#080d18] border border-white/10 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{part.label}</div>
                          <div
                            onClick={() => {
                              setSelectedMoleculeId(part.blockId);
                              setActiveStage('molecule');
                            }}
                            className="text-[9px] font-mono text-cyan-400 hover:underline cursor-pointer"
                          >
                            Built from Stage 1: {blockMeta?.name} →
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            snapOrganellePart(activeOrganelle.id, part.id);
                            cosmicAudio.playPulse(520);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-mono text-[9.5px] font-bold uppercase border cursor-pointer ${
                            isSnapped
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-amber-500/20 hover:bg-amber-500/35 border-amber-400 text-amber-200'
                          }`}
                        >
                          {isSnapped ? '✓ Snapped In' : '+ Snap Part'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    assembleCompleteOrganelle(activeOrganelle.id);
                    cosmicAudio.playSynthesisChord();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  {assembledOrganelles.includes(activeOrganelle.id)
                    ? `✓ ${activeOrganelle.name} Complete`
                    : `⚡ Snap All Parts of ${activeOrganelle.name}`}
                </button>
              </div>
            )}

            {/* ==================== STAGE 1: MACROMOLECULES (FROM CHEMISTRY) ==================== */}
            {activeStage === 'molecule' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                    STAGE 1 (FOUNDATION) // MACROMOLECULES FROM CHEMISTRY & PHYSICS ATOMS
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {activeMolecule.icon} {activeMolecule.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{activeMolecule.role}</p>
                </div>

                {/* Molecule Selector Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.values(LEVEL_1_MACROMOLECULES).map((mol) => (
                    <button
                      key={mol.id}
                      onClick={() => setSelectedMoleculeId(mol.id)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold uppercase border cursor-pointer ${
                        activeMolecule.id === mol.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-[#080d18] border-white/10 text-slate-400'
                      }`}
                    >
                      {mol.icon} {mol.name.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Chemical Precursors from Chemistry & Physics Lab */}
                <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 space-y-2">
                  <div className="text-[9.5px] font-mono font-bold text-slate-400 uppercase">
                    Atomic & Molecular Precursors (Physics → Chemistry → Bio):
                  </div>
                  {activeMolecule.fromChemistry.map((chem, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-[#0b1220] border border-white/5 flex items-center justify-between text-xs font-mono text-slate-200"
                    >
                      <span>• {chem}</span>
                      <span className="text-[9px] text-emerald-400 font-bold">✓ Synthesized</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (TIER_4_FOLDED_PROTEINS[activeMolecule.id]) {
                        const gid = TIER_4_FOLDED_PROTEINS[activeMolecule.id].geneId;
                        transcribeAndTranslateGene(gid);
                        foldTopDownProtein(activeMolecule.id);
                      }
                      cosmicAudio.playSynthesisChord();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    🧬 Synthesize & Fold {activeMolecule.name.split(' ')[0]}
                  </button>
                  {onNavigateMode && (
                    <button
                      onClick={() => onNavigateMode('folding')}
                      className="px-3 py-2.5 rounded-xl bg-[#080d18] hover:bg-slate-800 border border-white/15 text-slate-200 font-mono text-[10px] font-bold uppercase cursor-pointer"
                    >
                      3D Codon Studio →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Assembly Line Stepper Footer */}
          <div className="p-3 bg-[#080d18] border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                const idx = PIPELINE_STAGES.findIndex((s) => s.id === activeStage);
                if (idx < PIPELINE_STAGES.length - 1) {
                  setActiveStage(PIPELINE_STAGES[idx + 1].id);
                }
              }}
              disabled={activeStage === 'molecule'}
              className="px-3 py-1.5 rounded-lg bg-[#0f172a] disabled:opacity-35 border border-white/10 text-slate-200 font-mono text-[9.5px] font-bold uppercase cursor-pointer"
            >
              ↓ Go Deeper (Smaller Building Blocks)
            </button>
            <button
              onClick={() => {
                const idx = PIPELINE_STAGES.findIndex((s) => s.id === activeStage);
                if (idx > 0) {
                  setActiveStage(PIPELINE_STAGES[idx - 1].id);
                }
              }}
              disabled={activeStage === 'organ'}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 disabled:opacity-35 border border-emerald-400/50 text-emerald-200 font-mono text-[9.5px] font-bold uppercase cursor-pointer"
            >
              ↑ Advance Up Assembly Line (Larger Structure)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDownOrganogenesisLab;
