import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../store';
import { useAnatomyStore } from '../../anatomy-lab/store';
import { useChemistryStore } from '../../chemistry-lab/store';
import { usePlanetaryStore } from '../../store/planetaryStore';
import { useStore } from '../../store';
import { cosmicAudio } from '../../utils/cosmicAudioBus';
import {
  LEVEL_1_MACROMOLECULES,
  LEVEL_2_ORGANELLES,
  LEVEL_3_CELLS,
  LEVEL_4_TISSUES,
  TIER_1_ORGAN_SYSTEMS,
  TIER_4_FOLDED_PROTEINS,
  evaluateOrganSystemChain,
  evaluateOrganPhysiologyBenchTest
} from '../data/topDownBioHierarchy';
import {
  createBDNADoubleHelix,
  createHDNucleus,
  createHDMitochondrion,
  createHD80SRibosome,
  createHDPlasmaMembrane,
  create3DOrganForSystem
} from '../utils/organelle3DFactory';
import {
  loadZAnatomyOrganModel,
  applyOrganSubPartMaterials
} from '../utils/zAnatomyOrganLoader';

const PIPELINE_STAGES = [
  { id: 'organ', level: 5, title: '5. Human Organ', sub: '3D Z-Anatomy GLB' },
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
  const assembledOrganParts = useBioStore((s) => s.assembledOrganParts) || [];
  const differentiatedCells = useBioStore((s) => s.differentiatedCells) || [];
  const engineeredTissues = useBioStore((s) => s.engineeredTissues) || [];
  const currentCellDesign = useBioStore((s) => s.currentCellDesign);

  const snapOrganellePart = useBioStore((s) => s.snapOrganellePart);
  const assembleCompleteOrganelle = useBioStore((s) => s.assembleCompleteOrganelle);
  const snapOrganSubPart = useBioStore((s) => s.snapOrganSubPart);
  const transcribeAndTranslateGene = useBioStore((s) => s.transcribeAndTranslateGene);
  const foldTopDownProtein = useBioStore((s) => s.foldTopDownProtein);
  const differentiateCellLineage = useBioStore((s) => s.differentiateCellLineage);
  const bioprintTissueScaffold = useBioStore((s) => s.bioprintTissueScaffold);
  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);

  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};
  const synthesizeBioTissue = useAnatomyStore((s) => s.synthesizeBioTissue);

  const planetaryO2 = usePlanetaryStore((s) => s.atmosphere?.oxygen ?? 21);
  const updateAtmosphere = usePlanetaryStore((s) => s.updateAtmosphere);

  // Active stage in the 5-stage assembly line ('organ' | 'tissue' | 'cell' | 'organelle' | 'molecule')
  const [activeStage, setActiveStage] = useState('organ');
  const [selectedOrganelleId, setSelectedOrganelleId] = useState('mitochondrion');
  const [selectedCellId, setSelectedCellId] = useState('cardiomyocyte');
  const [selectedMoleculeId, setSelectedMoleculeId] = useState('actin_myosin');

  // Upgrade #1: 3D Surgical Cross-Section Slicer (Clipping Plane)
  const [slicerEnabled, setSlicerEnabled] = useState(false);
  const [slicerOffset, setSlicerOffset] = useState(0.25);

  // Upgrade #3: Interactive Cell Membrane Action-Potential Depolarization (-70 mV -> +30 mV)
  const [membranePotentialMv, setMembranePotentialMv] = useState(-70);

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

  // Upgrade #2: Live Physiological Organ Bench-Test Telemetry
  const snappedSubPartsCount = useMemo(
    () =>
      (activeSystem.subParts || []).filter((sp) => assembledOrganParts.includes(sp.id)).length,
    [activeSystem.subParts, assembledOrganParts]
  );
  const effectiveOrganReadiness = Math.min(
    100,
    Math.round(chainEval.readinessPercent * 0.6 + (snappedSubPartsCount / 4) * 40)
  );
  const benchTest = useMemo(
    () => evaluateOrganPhysiologyBenchTest(activeSystem.id, effectiveOrganReadiness),
    [activeSystem.id, effectiveOrganReadiness]
  );

  // Upgrade #8: End-to-End Master Human Genesis Progress (Chemistry -> Bio -> 3D Anatomy)
  const masterGenesisPercent = useMemo(() => {
    const deployedOrgans = Object.values(bioprintedTissues).filter(Boolean).length;
    const score =
      (foldedProteins.length / 8) * 20 +
      (assembledOrganelles.length / 4) * 20 +
      (differentiatedCells.length / 9) * 20 +
      (engineeredTissues.length / 5) * 20 +
      (deployedOrgans / 5) * 20;
    return Math.min(100, Math.round(score));
  }, [
    foldedProteins.length,
    assembledOrganelles.length,
    differentiatedCells.length,
    engineeredTissues.length,
    bioprintedTissues
  ]);

  // Keep selected cell & molecule aligned when switching target Organ System
  useEffect(() => {
    setSelectedCellId(activeSystem.requiredCells[0]);
    setSelectedMoleculeId(activeSystem.requiredProteins[0]);
  }, [activeSystem.id]);

  const activeCell = LEVEL_3_CELLS[selectedCellId] || LEVEL_3_CELLS[activeSystem.requiredCells[0]];
  const activeOrganelle = LEVEL_2_ORGANELLES[selectedOrganelleId] || LEVEL_2_ORGANELLES.mitochondrion;
  const activeMolecule =
    LEVEL_1_MACROMOLECULES[selectedMoleculeId] || LEVEL_1_MACROMOLECULES.collagen_i;

  // Trigger Action Potential Depolarization Wave (-70 mV -> +30 mV -> -70 mV)
  const triggerActionPotentialPulse = () => {
    setMembranePotentialMv(30);
    cosmicAudio.playPulse(680);
    setTimeout(() => {
      setMembranePotentialMv(-80); // Hyperpolarization refractory dip
      setTimeout(() => setMembranePotentialMv(-70), 350);
    }, 450);
  };

  // Dedicated 3D Assembly Viewport for all 5 levels
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.localClippingEnabled = true;
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
    let isDisposed = false;

    const clipPlane = slicerEnabled
      ? new THREE.Plane(new THREE.Vector3(0, -1, 0), slicerOffset)
      : null;

    const isOrganComplete =
      activeStage === 'organ' ? chainEval.deployedIn3D : chainEval.tissueReady;

    const effectiveSnappedParts = isOrganComplete
      ? (activeSystem.subParts || []).map((sp) => sp.id)
      : assembledOrganParts;

    if (activeStage === 'organ' || activeStage === 'tissue') {
      // LEVEL 5 & 4: Start with Sculpted High-Definition 3D Organ Fallback, then swap in Real Z-Anatomy .GLB!
      const fallbackOrgan = create3DOrganForSystem(activeSystem.id);
      applyOrganSubPartMaterials(
        fallbackOrgan,
        activeSystem.id,
        effectiveSnappedParts,
        isOrganComplete,
        clipPlane
      );
      rootGroup.add(fallbackOrgan);
      animatedItems.push({ group: fallbackOrgan, mode: 'organ', systemId: activeSystem.id });

      // Step 1: Load Real Draco-Compressed Z-Anatomy .GLB Model for this Organ System
      loadZAnatomyOrganModel(activeSystem.id).then((glbOrgan) => {
        if (isDisposed || !glbOrgan) return;
        applyOrganSubPartMaterials(
          glbOrgan,
          activeSystem.id,
          effectiveSnappedParts,
          isOrganComplete,
          clipPlane
        );
        rootGroup.remove(fallbackOrgan);
        animatedItems.length = 0;
        rootGroup.add(glbOrgan);
        animatedItems.push({ group: glbOrgan, mode: 'organ', systemId: activeSystem.id });
      });
    } else if (activeStage === 'cell') {
      // LEVEL 3: Render Specialized Cell with its Assembled 3D Organelles inside
      const isCellReady = differentiatedCells.includes(activeCell.id);
      const isDepolarized = membranePotentialMv > 0;
      const outerMembrane = new THREE.Mesh(
        new THREE.SphereGeometry(1.45, 48, 48),
        new THREE.MeshPhysicalMaterial({
          color: isDepolarized ? '#38bdf8' : activeCell.color,
          emissive: isDepolarized ? '#38bdf8' : activeCell.color,
          emissiveIntensity: isDepolarized ? 0.65 : isCellReady ? 0.18 : 0.05,
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
          const pulse =
            item.systemId === 'cardiovascular_system'
              ? 1 + Math.pow(Math.max(0, Math.sin(t * 4.5)), 4) * 0.05
              : item.systemId === 'visceral_system'
              ? 1 + Math.sin(t * 1.8) * 0.035
              : 1 + Math.sin(t * 2.2) * 0.012;
          item.group.scale.setScalar(pulse);
        } else {
          item.group.position.y = Math.sin(t * 2 + (item.phase || 0)) * 0.05;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isDisposed = true;
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
    assembledOrganParts,
    foldedProteins,
    differentiatedCells,
    chainEval.tissueReady,
    chainEval.deployedIn3D,
    slicerEnabled,
    slicerOffset,
    membranePotentialMv
  ]);

  const handleDeployOrganTo3D = () => {
    const anatomyTissueId = synthesizeFullOrganChain(activeSystem.id);
    Object.keys(LEVEL_2_ORGANELLES).forEach((oid) => assembleCompleteOrganelle(oid));
    (activeSystem.subParts || []).forEach((sp) => {
      if (!assembledOrganParts.includes(sp.id)) {
        snapOrganSubPart(activeSystem.id, sp.id);
      }
    });
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

  // Step 2: Send Macromolecule Synthesis Contract to Chemistry Lab
  const handleOrderFromChemistryLab = (mol) => {
    const order = mol.chemistryOrder || {
      compoundId: 'glycine',
      title: `Synthesize ${mol.name}`,
      equation: 'CO₂ + NH₃ + H₂O → Bio-Monomer',
      vesselType: 'beaker_std',
      tempC: 85,
      pressureAtm: 1.0
    };
    useChemistryStore.getState().setActiveBioOrder(order);
    useStore.getState().setCurrentView('chemistry');
    useStore
      .getState()
      .showMessage(`⚗️ Bio-Synthesis Order queued in Chemistry Lab: ${order.title}`);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#060a12] p-4 pb-16 gap-3 overflow-hidden select-none">
      {/* 1. TOP BAR: SELECT TARGET HUMAN ORGAN + 5-STAGE ASSEMBLY CONVEYOR */}
      <header className="bg-[#0b1220] rounded-2xl p-3 border border-white/10 shrink-0 space-y-2.5">
        {/* Row A: Target Macro Human Organ Selector + Master Human Genesis Progress (Upgrade #8) */}
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
            {/* Upgrade #8: Master Human Genesis Progress Pill */}
            <div className="px-2.5 py-1 rounded-xl bg-[#080d18] border border-emerald-500/30 flex items-center gap-2">
              <span className="text-[8.5px] font-mono text-slate-400 uppercase">
                Human Genesis:
              </span>
              <span className="text-[10px] font-mono font-black text-emerald-400">
                {masterGenesisPercent}%
              </span>
            </div>

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
                {activeStage === 'organ' && `STAGE 5 // Z-ANATOMY 3D ORGAN (${activeSystem.latinName})`}
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

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Upgrade #1: 3D Surgical Cross-Section Slicer Toggle */}
              {(activeStage === 'organ' || activeStage === 'tissue') && (
                <div className="bg-[#090d16]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => setSlicerEnabled((v) => !v)}
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase border cursor-pointer ${
                      slicerEnabled
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    🔪 Cross-Section
                  </button>
                  {slicerEnabled && (
                    <input
                      type="range"
                      min="-1.1"
                      max="1.1"
                      step="0.05"
                      value={slicerOffset}
                      onChange={(e) => setSlicerOffset(parseFloat(e.target.value))}
                      aria-label="Surgical Cross-Section Slicer"
                      className="w-20 accent-amber-400 cursor-pointer"
                    />
                  )}
                </div>
              )}

              <div className="bg-[#090d16]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-right">
                <span className="text-[8px] font-mono text-slate-400 uppercase block">
                  Organ Readiness
                </span>
                <span className="text-sm font-mono font-black text-emerald-400">
                  {effectiveOrganReadiness}%
                </span>
              </div>
            </div>
          </div>

          <div
            ref={mountRef}
            className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
          />

          <div className="px-4 py-2 bg-[#090d16] border-t border-white/10 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
            <span>
              💡 Wireframe parts = Un-snapped blueprint • Solid PBR parts = Snapped in 3D
            </span>
            <span>Drag to Rotate • Scroll to Zoom</span>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: PART-BY-PART ASSEMBLY BENCH */}
        <div className="col-span-5 flex flex-col bg-[#0b1220] rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar">
            {/* ==================== STAGE 5: MACRO HUMAN ORGAN ==================== */}
            {activeStage === 'organ' && (
              <div className="space-y-3.5">
                <div>
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                    STAGE 5 (TOP) // Z-ANATOMY 3D ORGAN SUB-PART ASSEMBLY
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {activeSystem.icon} {activeSystem.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {activeSystem.description}
                  </p>
                </div>

                {/* Step 1: 4 Real Z-Anatomy Anatomical Sub-Parts to Snap Together */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase">
                    1. Snap 3D Anatomical Sub-Structures ({snappedSubPartsCount}/4 Snapped):
                  </div>
                  {(activeSystem.subParts || []).map((sp) => {
                    const isSnapped =
                      assembledOrganParts.includes(sp.id) || chainEval.deployedIn3D;
                    return (
                      <div
                        key={sp.id}
                        className="p-2.5 rounded-xl bg-[#080d18] border border-white/10 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{sp.label}</div>
                          <div className="text-[9px] font-mono text-slate-400">{sp.role}</div>
                        </div>
                        <button
                          onClick={() => {
                            snapOrganSubPart(activeSystem.id, sp.id);
                            cosmicAudio.playPulse(540);
                          }}
                          className={`px-3 py-1 rounded-lg font-mono text-[9px] font-bold uppercase border cursor-pointer shrink-0 ${
                            isSnapped
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-cyan-500/20 hover:bg-cyan-500/35 border-cyan-400 text-cyan-200'
                          }`}
                        >
                          {isSnapped ? '✓ Snapped' : '+ Snap 3D Part'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Lower-Tier Biological Prerequisites */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    2. Lower-Level Cellular & Tissue Building Blocks:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setActiveStage('tissue')}
                      className={`p-2 rounded-xl border text-left cursor-pointer ${
                        chainEval.tissueReady
                          ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                          : 'bg-[#080d18] border-white/10 text-cyan-200 hover:border-cyan-400'
                      }`}
                    >
                      <div className="text-[8.5px] font-mono uppercase opacity-75">Stage 4</div>
                      <div className="text-[10px] font-bold truncate">
                        {chainEval.tissueReady ? '✓ Tissue' : 'Build Tissue →'}
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveStage('cell')}
                      className={`p-2 rounded-xl border text-left cursor-pointer ${
                        chainEval.missingCells.length === 0
                          ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                          : 'bg-[#080d18] border-white/10 text-cyan-200 hover:border-cyan-400'
                      }`}
                    >
                      <div className="text-[8.5px] font-mono uppercase opacity-75">Stage 3</div>
                      <div className="text-[10px] font-bold truncate">
                        {chainEval.missingCells.length === 0 ? '✓ Cells' : 'Build Cells →'}
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveStage('organelle')}
                      className={`p-2 rounded-xl border text-left cursor-pointer ${
                        chainEval.coreOrganellesReady
                          ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                          : 'bg-[#080d18] border-white/10 text-cyan-200 hover:border-cyan-400'
                      }`}
                    >
                      <div className="text-[8.5px] font-mono uppercase opacity-75">Stage 2</div>
                      <div className="text-[10px] font-bold truncate">
                        {chainEval.coreOrganellesReady ? '✓ Organelles' : 'Organelles →'}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Upgrade #2: Live Physiological Organ Bench-Test Telemetry Card */}
                <div className="p-3 rounded-xl bg-[#080d18] border border-cyan-500/25 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                      ⚡ Physiological Bench-Test Telemetry
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-400">
                      {benchTest.passed ? 'PHYSIOLOGICAL OPTIMUM' : 'SUB-THRESHOLD'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-[#0b1220] border border-white/5">
                      <span className="text-[8.5px] font-mono text-slate-400 block">
                        {benchTest.primaryLabel}
                      </span>
                      <span className="text-xs font-mono font-black text-white">
                        {benchTest.primaryMetric}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0b1220] border border-white/5">
                      <span className="text-[8.5px] font-mono text-slate-400 block">
                        {benchTest.secondaryLabel}
                      </span>
                      <span className="text-xs font-mono font-black text-cyan-300">
                        {benchTest.secondaryMetric}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upgrade #9: Planetary Biosphere O2 Sync for Mammalian Respiration */}
                <div className="p-2.5 rounded-xl bg-[#080d18] border border-white/10 flex items-center justify-between text-[9.5px] font-mono">
                  <span className="text-slate-300">
                    🌍 Planetary O₂:{' '}
                    <strong className="text-emerald-400">{planetaryO2.toFixed(1)}%</strong> (21%
                    normoxic)
                  </span>
                  {planetaryO2 < 19.5 && (
                    <button
                      onClick={() => updateAtmosphere('oxygen', 21 - planetaryO2)}
                      className="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold cursor-pointer"
                    >
                      Oxygenate → 21%
                    </button>
                  )}
                </div>

                <button
                  onClick={handleDeployOrganTo3D}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-98 cursor-pointer"
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
              <div className="space-y-3.5">
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

                {/* Upgrade #3: Membrane Action-Potential Depolarization Simulator */}
                <div className="p-2.5 rounded-xl bg-[#080d18] border border-cyan-500/25 flex items-center justify-between">
                  <div>
                    <span className="text-[8.5px] font-mono text-cyan-400 uppercase block">
                      Membrane Voltage (Na⁺/K⁺ Pump)
                    </span>
                    <span className="text-xs font-mono font-black text-white">
                      {membranePotentialMv > 0 ? `+${membranePotentialMv}` : membranePotentialMv} mV{' '}
                      {membranePotentialMv > 0 ? '(Depolarized Spike!)' : '(Resting Potential)'}
                    </span>
                  </div>
                  <button
                    onClick={triggerActionPotentialPulse}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400 text-cyan-200 font-mono text-[9px] font-bold uppercase cursor-pointer"
                  >
                    ⚡ Fire Action Potential
                  </button>
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

                {/* Chemical Precursors from Chemistry & Physics Lab + Direct Chemistry Contract Button (Step 2) */}
                <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase">
                      Atomic & Molecular Precursors (Chemistry Lab):
                    </span>
                    <button
                      onClick={() => handleOrderFromChemistryLab(activeMolecule)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400 text-emerald-300 font-mono text-[9px] font-bold uppercase cursor-pointer"
                    >
                      ⚗️ Synthesize in Chemistry Lab →
                    </button>
                  </div>
                  {activeMolecule.fromChemistry.map((chem, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-[#0b1220] border border-white/5 flex items-center justify-between text-xs font-mono text-slate-200"
                    >
                      <span>• {chem}</span>
                      <span className="text-[9px] text-emerald-400 font-bold">✓ Formula Ready</span>
                    </div>
                  ))}
                  {activeMolecule.chemistryOrder && (
                    <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[10px] font-mono text-emerald-200">
                      Reaction: <strong>{activeMolecule.chemistryOrder.equation}</strong> (
                      {activeMolecule.chemistryOrder.vesselType}, {activeMolecule.chemistryOrder.tempC}
                      °C)
                    </div>
                  )}
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
