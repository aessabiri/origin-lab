import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  evaluateOrganSystemChain,
  evaluateMorphogenGradientMatch,
  computeRibosomeStep,
  evaluateChaperoninFolding,
  evaluateECMScaffoldBiophysics
} from '../data/topDownBioHierarchy';
import {
  createBDNADoubleHelix,
  createHDNucleus,
  createHDMitochondrion,
  createHD80SRibosome
} from '../utils/organelle3DFactory';

const SUB_TIERS = [
  { id: 'tier2', step: 'TIER 2', label: 'ECM & Tissue', sub: 'Histogenesis Bioreactor' },
  { id: 'tier3', step: 'TIER 3', label: 'Stem Cells', sub: 'Morphogen Gradients' },
  { id: 'tier4', step: 'TIER 4', label: '3D Proteins', sub: 'Anfinsen ΔG Funnel' },
  { id: 'tier5', step: 'TIER 5', label: 'DNA & 80S', sub: 'Codon Translation' }
];

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

  // Active focused sub-tier tab (Progressive disclosure: 1 tier shown at a time)
  const [activeTierTab, setActiveTierTab] = useState('tier2');

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

  // --- Tier 2 Interactive ECM Cross-Linking & Vascular Perfusion State ---
  const [crossLinkDensity, setCrossLinkDensity] = useState(85);
  const [perfusionMmHg, setPerfusionMmHg] = useState(95);

  // --- Tier 3 Interactive Morphogen Gradient Tuner State ---
  const [selectedCellId, setSelectedCellId] = useState(activeSystem.requiredCells[0]);
  const [bmpShhAxis, setBmpShhAxis] = useState(82);
  const [wntFgfAxis, setWntFgfAxis] = useState(60);

  // --- Tier 4 Interactive Chaperonin Folding Funnel State ---
  const [selectedProteinId, setSelectedProteinId] = useState(activeSystem.requiredProteins[0]);
  const [chaperoneTempC, setChaperoneTempC] = useState(37.0);
  const [chaperonePH, setChaperonePH] = useState(7.4);

  // --- Tier 5 Interactive 80S Ribosome Codon Stepper State ---
  const [activeRibosomeProteinId, setActiveRibosomeProteinId] = useState(
    activeSystem.requiredProteins[0]
  );
  const [ribosomeStepIdx, setRibosomeStepIdx] = useState(0);

  // Sync sub-tier targets when switching Tier-1 Organ System
  useEffect(() => {
    const firstCell = activeSystem.requiredCells[0];
    setSelectedCellId(firstCell);
    const opt = TIER_3_CELL_LINEAGES[firstCell]?.optimalMorphogens;
    if (opt) {
      setBmpShhAxis(opt.bmpShh);
      setWntFgfAxis(opt.wntFgf);
    }
    const firstProt = activeSystem.requiredProteins[0];
    setSelectedProteinId(firstProt);
    setActiveRibosomeProteinId(firstProt);
    setRibosomeStepIdx(0);
    setCrossLinkDensity(activeScaffold.id === 'osteoid' ? 92 : activeScaffold.id === 'neural' ? 55 : 78);
    setPerfusionMmHg(95);
  }, [activeSystem.id]);

  const ecmEval = useMemo(
    () =>
      evaluateECMScaffoldBiophysics(
        activeScaffold.id,
        crossLinkDensity,
        perfusionMmHg
      ),
    [activeScaffold.id, crossLinkDensity, perfusionMmHg]
  );

  const morphogenEval = useMemo(
    () => evaluateMorphogenGradientMatch(selectedCellId, bmpShhAxis, wntFgfAxis),
    [selectedCellId, bmpShhAxis, wntFgfAxis]
  );

  const foldingEval = useMemo(
    () => evaluateChaperoninFolding(selectedProteinId, chaperoneTempC, chaperonePH),
    [selectedProteinId, chaperoneTempC, chaperonePH]
  );

  const activeRibosomeProtein =
    TIER_4_FOLDED_PROTEINS[activeRibosomeProteinId] ||
    TIER_4_FOLDED_PROTEINS[activeSystem.requiredProteins[0]];

  const ribosomeState = useMemo(
    () => computeRibosomeStep(activeRibosomeProtein.dna, ribosomeStepIdx),
    [activeRibosomeProtein.dna, ribosomeStepIdx]
  );

  // High-Definition Multi-Scale 3D Ultrastructure Viewport (responds to activeTierTab)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 460;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 5.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xe2e8f0, 0.85));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);
    const backLight = new THREE.PointLight(0x10b981, 2.0, 20);
    backLight.position.set(-4, -3, -4);
    scene.add(backLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const animatedSubGroups = [];

    if (activeTierTab === 'tier2') {
      // TIER 2 LENS: 3D Extracellular Matrix Collagen/Elastin Lattice + Perfused Cells
      const ecmColor = chainEval.tissueReady ? 0x10b981 : 0x0284c7;
      const fiberMat = new THREE.MeshPhysicalMaterial({
        color: ecmColor,
        emissive: ecmColor,
        emissiveIntensity: chainEval.tissueReady ? 0.45 : 0.18,
        roughness: 0.2,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.82
      });

      for (let i = -2; i <= 2; i++) {
        const rodH = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.2, 12), fiberMat);
        rodH.position.set(i * 0.55, 0, 0);
        rodH.rotation.z = Math.PI / 4;
        rootGroup.add(rodH);

        const rodV = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.2, 12), fiberMat);
        rodV.position.set(0, i * 0.55, 0);
        rodV.rotation.z = -Math.PI / 4;
        rootGroup.add(rodV);
      }

      activeSystem.requiredCells.forEach((cid, idx) => {
        const cellMeta = TIER_3_CELL_LINEAGES[cid];
        const isReady = differentiatedCells.includes(cid);
        for (let k = 0; k < 6; k++) {
          const angle = (k / 6) * Math.PI * 2 + idx * 0.7;
          const r = 0.95 + idx * 0.45;
          const cellGroup = new THREE.Group();
          cellGroup.position.set(Math.cos(angle) * r, Math.sin(angle * 2) * 0.35, Math.sin(angle) * r);

          const membrane = new THREE.Mesh(
            new THREE.SphereGeometry(0.24, 24, 24),
            new THREE.MeshPhysicalMaterial({
              color: isReady ? cellMeta.color : 0x475569,
              emissive: isReady ? cellMeta.color : 0x0f172a,
              emissiveIntensity: isReady ? 0.35 : 0.1,
              transmission: 0.68,
              transparent: true,
              opacity: 0.75,
              clearcoat: 1.0
            })
          );
          const core = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 16, 16),
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: isReady ? cellMeta.color : 0x64748b,
              emissiveIntensity: 0.8
            })
          );
          cellGroup.add(membrane, core);
          rootGroup.add(cellGroup);
          animatedSubGroups.push({ group: cellGroup, phase: k + idx });
        }
      });
    } else if (activeTierTab === 'tier3') {
      // TIER 3 LENS: High-Definition Eukaryotic Stem Cell with Subsurface-Scattered Organelles
      const activeCell = TIER_3_CELL_LINEAGES[selectedCellId] || TIER_3_CELL_LINEAGES.osteoblast;

      // Outer Phospholipid Bilayer with Subsurface Scattering
      const plasmaMembrane = new THREE.Mesh(
        new THREE.SphereGeometry(1.75, 48, 48),
        new THREE.MeshPhysicalMaterial({
          color: activeCell.color,
          emissive: activeCell.color,
          emissiveIntensity: 0.12,
          transmission: 0.78,
          transparent: true,
          opacity: 0.38,
          roughness: 0.12,
          ior: 1.38,
          clearcoat: 1.0,
          side: THREE.DoubleSide
        })
      );
      rootGroup.add(plasmaMembrane);

      // Central HD Nucleus with 14 Nuclear Pore Complexes + Nucleolus + B-DNA
      const hdNucleus = createHDNucleus();
      rootGroup.add(hdNucleus);
      animatedSubGroups.push({ group: hdNucleus, phase: 0 });

      // 3 HD Mitochondria with Inner Cristae Lamellae & ATP Synthase Studs
      for (let m = 0; m < 3; m++) {
        const mito = createHDMitochondrion();
        const a = (m / 3) * Math.PI * 2;
        mito.position.set(Math.cos(a) * 1.12, (m - 1) * 0.35, Math.sin(a) * 1.12);
        mito.rotation.set(m * 0.5, a, Math.PI / 4);
        rootGroup.add(mito);
        animatedSubGroups.push({ group: mito, phase: m + 1 });
      }

      // 2 HD 80S Ribosome Complexes
      for (let r = 0; r < 2; r++) {
        const ribo = createHD80SRibosome(5);
        ribo.scale.setScalar(0.8);
        const a = r * Math.PI + 0.8;
        ribo.position.set(Math.cos(a) * 1.05, r === 0 ? 0.55 : -0.55, Math.sin(a) * 1.05);
        rootGroup.add(ribo);
        animatedSubGroups.push({ group: ribo, phase: r + 4 });
      }
    } else if (activeTierTab === 'tier4') {
      // TIER 4 LENS: 3D Chaperonin GroEL/HSP47 Barrel + Folding Polypeptide Tertiary Structure
      const prot =
        TIER_4_FOLDED_PROTEINS[selectedProteinId] || TIER_4_FOLDED_PROTEINS.collagen_i;

      const helixGroup = new THREE.Group();
      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(
          0.75,
          foldingEval.isNativeFold ? 0.16 : 0.06,
          96,
          20,
          2,
          3
        ),
        new THREE.MeshPhysicalMaterial({
          color: prot.color,
          emissive: prot.color,
          emissiveIntensity: foldingEval.isNativeFold ? 0.55 : 0.15,
          roughness: 0.18,
          metalness: 0.25,
          clearcoat: 1.0
        })
      );
      helixGroup.add(knot);

      // Chaperonin GroEL Cage Rings around the folding protein
      [-0.65, 0.65].forEach((yPos) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.25, 0.05, 12, 36),
          new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.55
          })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = yPos;
        helixGroup.add(ring);
      });

      rootGroup.add(helixGroup);
      animatedSubGroups.push({ group: helixGroup, phase: 0 });
    } else {
      // TIER 5 LENS: High-Definition B-DNA Double Helix + 80S Ribosome Threading mRNA
      const dnaHelix = createBDNADoubleHelix({
        basePairs: 24,
        radius: 0.34,
        height: 2.5,
        turns: 2.4
      });
      dnaHelix.position.set(-0.85, 0, 0);
      rootGroup.add(dnaHelix);
      animatedSubGroups.push({ group: dnaHelix, phase: 0 });

      const ribosome = createHD80SRibosome(Math.max(2, ribosomeState.nascentChain.length));
      ribosome.scale.setScalar(1.9);
      ribosome.position.set(0.75, -0.1, 0);
      rootGroup.add(ribosome);
      animatedSubGroups.push({ group: ribosome, phase: 1.5 });
    }

    // Interactive Pointer Drag Rotation + Wheel Zoom
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
      camera.position.z = Math.max(2.6, Math.min(8.5, camera.position.z + e.deltaY * 0.003));
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
      animatedSubGroups.forEach(({ group, phase }) => {
        group.rotation.y += 0.008;
        group.position.y += Math.sin(t * 2.2 + phase) * 0.0015;
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
    activeTierTab,
    activeSystem,
    selectedCellId,
    selectedProteinId,
    differentiatedCells,
    chainEval.tissueReady,
    foldingEval.isNativeFold,
    ribosomeState.nascentChain.length
  ]);

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
    <div className="flex flex-col h-full w-full bg-[#060a12] p-4 pb-16 gap-3 overflow-hidden select-none">
      {/* 1. COMPACT TIER-1 (TOP) MACRO-ORGAN TARGET BAR */}
      <header className="bg-[#0b1220] rounded-2xl p-3 border border-white/10 shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-teal-500/15 border border-teal-400/40 text-[9px] font-mono font-bold text-teal-300 uppercase">
              TIER 1 (TOP)
            </span>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-100">
              Target 3D Organ System — Top-Down Reverse Engineering
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeployTo3DAnatomy}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
            >
              ⚡ Synthesize Chain & Deploy ({chainEval.readinessPercent}%)
            </button>
            {onOpenAnatomy && (
              <button
                onClick={onOpenAnatomy}
                className="px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                🦴 3D Anatomy →
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
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#112233] border-cyan-400'
                    : 'bg-[#080d18] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{sys.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-100 truncate">
                      {sys.name.split(' ')[0]} {sys.name.split(' ')[1]}
                    </div>
                    <div className="text-[8.5px] font-mono text-slate-400 truncate">
                      {sys.meshCount} 3D Meshes
                    </div>
                  </div>
                </div>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isDeployed ? 'bg-emerald-400' : 'bg-slate-600'
                  }`}
                  title={isDeployed ? 'Deployed in 3D Anatomy' : 'Pending Synthesis'}
                />
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. MAIN WORKSPACE: LEFT 7-COL 3D ULTRASTRUCTURE VIEWPORT + RIGHT 5-COL PROGRESSIVE STEPPER */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* LEFT 7 COLUMNS: INTERACTIVE 3D ULTRASTRUCTURE & ORGANELLE HOLOGRAM */}
        <div className="col-span-7 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
          {/* Top-Left Telemetry Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between pointer-events-none">
            <div className="bg-[#090d16]/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
              <span className="text-[8.5px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                {activeTierTab === 'tier2' && '3D LENS // TIER 2 EXTRACELLULAR MATRIX & TISSUE'}
                {activeTierTab === 'tier3' &&
                  '3D LENS // TIER 3 EUKARYOTIC CELL & HD ORGANELLES (SSS)'}
                {activeTierTab === 'tier4' &&
                  '3D LENS // TIER 4 GROEL CHAPERONIN & TERTIARY FOLD'}
                {activeTierTab === 'tier5' &&
                  '3D LENS // TIER 5 B-DNA DOUBLE HELIX & 80S RIBOSOME'}
              </span>
              <h3 className="text-xs font-black text-white uppercase mt-0.5">
                {activeSystem.icon} {activeSystem.name}
              </h3>
            </div>

            <div className="bg-[#090d16]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-right">
              <span className="text-[8px] font-mono text-slate-400 uppercase block">
                Chain Readiness
              </span>
              <span className="text-xs font-mono font-black text-emerald-400">
                {chainEval.readinessPercent}%
              </span>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div
            ref={mountRef}
            className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* Bottom 3D Lens Switcher Bar */}
          <div className="p-2.5 bg-[#090d16] border-t border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {SUB_TIERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTierTab(t.id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold uppercase border transition-all cursor-pointer ${
                    activeTierTab === t.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-[#0f172a] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  🔍 {t.step}: {t.label}
                </button>
              ))}
            </div>
            <span className="text-[9px] font-mono text-slate-500 pr-1">
              Drag to Rotate • Scroll to Zoom
            </span>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: FOCUSED SINGLE-TIER INSPECTOR (ZERO CLUTTER) */}
        <div className="col-span-5 flex flex-col bg-[#0b1220] rounded-2xl border border-white/10 overflow-hidden">
          {/* 4-Step Top-Down Tab Selector */}
          <div className="grid grid-cols-4 border-b border-white/10 bg-[#080d18]">
            {SUB_TIERS.map((tab) => {
              const isActive = activeTierTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTierTab(tab.id)}
                  className={`py-2.5 px-2 text-left border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-cyan-400 bg-[#111c30] text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[8px] font-mono font-bold text-cyan-400 uppercase">
                    {tab.step}
                  </div>
                  <div className="text-[10px] font-black truncate">{tab.label}</div>
                </button>
              );
            })}
          </div>

          {/* Focused Active Tier Content Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {/* TAB 1: TIER 2 — HISTOGENESIS & ECM BIOREACTOR */}
            {activeTierTab === 'tier2' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                    TIER 2 // EXTRACELLULAR MATRIX & VASCULAR PERFUSION
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    {activeScaffold.icon} {activeScaffold.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {activeScaffold.ecmArchitecture}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 space-y-3">
                  <div className="text-[10px] font-mono text-teal-300">
                    Chemical Formula: <strong>{activeScaffold.formula}</strong>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-300">
                      <span>ECM Collagen Cross-Linking Density</span>
                      <span className="text-cyan-300 font-bold">
                        {crossLinkDensity}% (Opt: {ecmEval.optimalCrossLink}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={crossLinkDensity}
                      onChange={(e) => setCrossLinkDensity(Number(e.target.value))}
                      className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-300">
                      <span>Arterial O₂ Perfusion Pressure</span>
                      <span className="text-emerald-300 font-bold">
                        {perfusionMmHg} mmHg (Opt: 95 mmHg)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="140"
                      value={perfusionMmHg}
                      onChange={(e) => setPerfusionMmHg(Number(e.target.value))}
                      className="w-full h-1.5 accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">
                      Biomechanical Viability:{' '}
                      <strong className="text-emerald-400">{ecmEval.viabilityScore}%</strong>
                    </span>
                    <button
                      onClick={() => {
                        setCrossLinkDensity(ecmEval.optimalCrossLink);
                        setPerfusionMmHg(95);
                        bioprintTissueScaffold(activeScaffold.id);
                        if (synthesizeBioTissue)
                          synthesizeBioTissue(activeSystem.anatomyTissueId);
                        cosmicAudio.playSynthesisChord();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400 text-cyan-200 font-mono text-[10px] font-bold uppercase cursor-pointer"
                    >
                      {chainEval.tissueReady
                        ? '✓ Scaffold Printed in 3D'
                        : '🧬 Bio-Print ECM Scaffold'}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 space-y-1.5">
                  <div className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                    Sub-Element Dependencies (From Tiers 3 & 4)
                  </div>
                  <div className="text-[10px] font-mono text-slate-300">
                    • Cells: {activeSystem.requiredCells.join(', ')} (
                    {chainEval.missingCells.length === 0 ? '✓ Ready' : 'Pending Tier 3'})
                  </div>
                  <div className="text-[10px] font-mono text-slate-300">
                    • Proteins: {activeSystem.requiredProteins.join(', ')} (
                    {chainEval.missingProteins.length === 0 ? '✓ Ready' : 'Pending Tier 4'})
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TIER 3 — STEM-CELL MORPHOGEN DIFFERENTIATION */}
            {activeTierTab === 'tier3' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">
                    TIER 3 // WOLPERT FRENCH-FLAG MORPHOGEN GRADIENT
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    Differentiate Specialized Cell Lineages
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {activeSystem.requiredCells.map((cid) => {
                    const cell = TIER_3_CELL_LINEAGES[cid];
                    const isReady = differentiatedCells.includes(cid);
                    const isFocused = selectedCellId === cid;
                    return (
                      <button
                        key={cid}
                        onClick={() => setSelectedCellId(cid)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isFocused
                            ? 'bg-[#112233] border-emerald-400'
                            : 'bg-[#080d18] border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {cell.icon} {cell.name.split(' ')[0]}
                          </span>
                          <span className="text-[8px] font-mono text-emerald-300">
                            {isReady ? '✓ READY' : 'SELECT'}
                          </span>
                        </div>
                        <div className="text-[8.5px] font-mono text-slate-400 mt-1 truncate">
                          {cell.morphogenSignal}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const cell =
                    TIER_3_CELL_LINEAGES[selectedCellId] || TIER_3_CELL_LINEAGES.osteoblast;
                  const isReady = differentiatedCells.includes(cell.id);
                  return (
                    <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 space-y-3">
                      <div>
                        <div className="text-xs font-bold text-white">
                          {cell.icon} {cell.name} ({cell.germLayer})
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{cell.role}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-300">
                          <span>Dorsal BMP4 ⟷ Ventral Shh</span>
                          <span className="text-cyan-300 font-bold">
                            {bmpShhAxis} nM (Opt: {cell.optimalMorphogens.bmpShh} nM)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={bmpShhAxis}
                          onChange={(e) => setBmpShhAxis(Number(e.target.value))}
                          className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-300">
                          <span>Wnt3a / FGF2 / VEGF-A</span>
                          <span className="text-emerald-300 font-bold">
                            {wntFgfAxis} nM (Opt: {cell.optimalMorphogens.wntFgf} nM)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={wntFgfAxis}
                          onChange={(e) => setWntFgfAxis(Number(e.target.value))}
                          className="w-full h-1.5 accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[10px] font-mono text-slate-300">
                          Gradient Match:{' '}
                          <strong className="text-emerald-400">
                            {morphogenEval.matchPercent}%
                          </strong>
                        </span>
                        <button
                          onClick={() => {
                            setBmpShhAxis(cell.optimalMorphogens.bmpShh);
                            setWntFgfAxis(cell.optimalMorphogens.wntFgf);
                            differentiateCellLineage(cell.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400 text-emerald-200 font-mono text-[10px] font-bold uppercase cursor-pointer"
                        >
                          {isReady ? '✓ Differentiated' : '🎯 Lock Gradient & Differentiate'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 3: TIER 4 — 3D PROTEIN FOLDING & ANFINSEN ΔG FUNNEL */}
            {activeTierTab === 'tier4' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">
                      TIER 4 // ANFINSEN THERMODYNAMIC FOLDING FUNNEL
                    </span>
                    <h3 className="text-sm font-black text-white mt-0.5">
                      Chaperonin-Assisted 3D Protein Folding
                    </h3>
                  </div>
                  {onNavigateMode && (
                    <button
                      onClick={() => onNavigateMode('folding')}
                      className="px-2.5 py-1 rounded-lg bg-[#080d18] hover:bg-slate-800 border border-amber-400/40 text-amber-300 font-mono text-[9px] font-bold uppercase cursor-pointer"
                    >
                      Full 3D Studio →
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {activeSystem.requiredProteins.map((pid) => {
                    const p = TIER_4_FOLDED_PROTEINS[pid];
                    const isFolded = foldedProteins.includes(pid);
                    return (
                      <button
                        key={pid}
                        onClick={() => setSelectedProteinId(pid)}
                        className={`px-2.5 py-1.5 rounded-xl font-mono text-[9px] font-bold uppercase border shrink-0 cursor-pointer ${
                          selectedProteinId === pid
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-[#080d18] border-white/10 text-slate-400'
                        }`}
                      >
                        {p.icon} {p.id} {isFolded ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const prot =
                    TIER_4_FOLDED_PROTEINS[selectedProteinId] ||
                    TIER_4_FOLDED_PROTEINS.collagen_i;
                  const isFolded = foldedProteins.includes(prot.id);
                  return (
                    <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 space-y-3">
                      <div>
                        <div className="text-xs font-bold text-white">
                          {prot.icon} {prot.name}
                        </div>
                        <div className="text-[9.5px] font-mono text-cyan-300 mt-0.5">
                          Motif: {prot.motif}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">
                          Chaperonin Complex: {prot.chaperonin}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-300">
                          <span>Bioreactor Temperature</span>
                          <span className="text-amber-300 font-bold">
                            {chaperoneTempC.toFixed(1)} °C (Opt: 37.0 °C)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="60"
                          step="0.5"
                          value={chaperoneTempC}
                          onChange={(e) => setChaperoneTempC(Number(e.target.value))}
                          className="w-full h-1.5 accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-300">
                          <span>Cytosolic pH</span>
                          <span className="text-cyan-300 font-bold">
                            pH {chaperonePH.toFixed(1)} (Opt: 7.4)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5.5"
                          max="9.0"
                          step="0.1"
                          value={chaperonePH}
                          onChange={(e) => setChaperonePH(Number(e.target.value))}
                          className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="text-[9.5px] font-mono">
                          <span className="text-slate-400">Gibbs Free Energy: </span>
                          <strong className="text-emerald-400">
                            ΔG = {foldingEval.effectiveDeltaG} kcal/mol
                          </strong>
                        </div>
                        <button
                          onClick={() => {
                            setChaperoneTempC(37.0);
                            setChaperonePH(7.4);
                            foldTopDownProtein(prot.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400 text-amber-200 font-mono text-[10px] font-bold uppercase cursor-pointer"
                        >
                          {isFolded ? '✓ Native Fold Locked' : '🌀 Fold into Native Minimum'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 4: TIER 5 (BOTTOM) — DNA CODING GENES & 80S RIBOSOME STEPPER */}
            {activeTierTab === 'tier5' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                      TIER 5 (BOTTOM) // B-DNA → mRNA → 80S RIBOSOME
                    </span>
                    <h3 className="text-sm font-black text-white mt-0.5">
                      Codon-by-Codon Ribosomal Translation
                    </h3>
                  </div>
                  <button
                    onClick={autoAssembleOptimalLuca}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 font-mono text-[9px] font-bold uppercase cursor-pointer"
                  >
                    {chainEval.coreOrganellesReady ? '✓ Organelles Ready' : '⚡ Equip Organelles'}
                  </button>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {activeSystem.requiredProteins.map((pid) => {
                    const prot = TIER_4_FOLDED_PROTEINS[pid];
                    const isTranscribed = transcribedGenes.includes(prot.geneId);
                    return (
                      <button
                        key={pid}
                        onClick={() => {
                          setActiveRibosomeProteinId(pid);
                          setRibosomeStepIdx(0);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl font-mono text-[9px] font-bold uppercase border shrink-0 cursor-pointer ${
                          activeRibosomeProtein.id === pid
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-[#080d18] border-white/10 text-slate-400'
                        }`}
                      >
                        Gene {prot.geneId.toUpperCase()} {isTranscribed ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-[#080d18] border border-white/10 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 rounded-lg bg-[#0b1220] border border-white/5">
                      <span className="text-[8px] text-slate-500 uppercase block">
                        E-Site (Exit)
                      </span>
                      <span className="text-xs font-black text-slate-400">
                        {ribosomeState.eSiteCodon || '—'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#112233] border border-cyan-400/50">
                      <span className="text-[8px] text-cyan-300 uppercase block">
                        P-Site ({ribosomeState.stepIndex + 1}/{ribosomeState.totalCodons})
                      </span>
                      <span className="text-xs font-black text-white">
                        {ribosomeState.pSiteCodon} ({ribosomeState.currentAminoAcid})
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0b1220] border border-white/5">
                      <span className="text-[8px] text-emerald-400 uppercase block">
                        A-Site (Next)
                      </span>
                      <span className="text-xs font-black text-emerald-300">
                        {ribosomeState.aSiteCodon || 'STOP'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-300 space-y-1">
                    <div>
                      <span className="text-slate-400">tRNA Anticodon Pairing: </span>
                      <strong className="text-cyan-300">{ribosomeState.tRnaAnticodon}</strong>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-400">Nascent Chain: </span>
                      <strong className="text-amber-300">
                        {ribosomeState.nascentChain.join(' – ') || 'Met'}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const nextIdx = Math.min(
                          ribosomeState.totalCodons - 1,
                          ribosomeStepIdx + 1
                        );
                        setRibosomeStepIdx(nextIdx);
                        if (nextIdx >= ribosomeState.totalCodons - 1) {
                          transcribeAndTranslateGene(activeRibosomeProtein.geneId);
                        }
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/50 text-cyan-200 font-mono text-[9.5px] font-bold uppercase cursor-pointer"
                    >
                      ▶ Step +1 Codon
                    </button>
                    <button
                      onClick={() => {
                        setRibosomeStepIdx(ribosomeState.totalCodons - 1);
                        transcribeAndTranslateGene(activeRibosomeProtein.geneId);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/50 text-emerald-200 font-mono text-[9.5px] font-bold uppercase cursor-pointer"
                    >
                      ⏩ Translate All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Stepper Navigation Footer */}
          <div className="p-3 bg-[#080d18] border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                const idx = SUB_TIERS.findIndex((t) => t.id === activeTierTab);
                if (idx > 0) setActiveTierTab(SUB_TIERS[idx - 1].id);
              }}
              disabled={activeTierTab === 'tier2'}
              className="px-3 py-1.5 rounded-lg bg-[#0f172a] disabled:opacity-35 border border-white/10 text-slate-200 font-mono text-[9.5px] font-bold uppercase cursor-pointer"
            >
              ↑ Higher Tier (Macro)
            </button>
            <button
              onClick={() => {
                const idx = SUB_TIERS.findIndex((t) => t.id === activeTierTab);
                if (idx < SUB_TIERS.length - 1) setActiveTierTab(SUB_TIERS[idx + 1].id);
              }}
              disabled={activeTierTab === 'tier5'}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 disabled:opacity-35 border border-cyan-400/40 text-cyan-200 font-mono text-[9.5px] font-bold uppercase cursor-pointer"
            >
              ↓ Deeper Sub-Tier (Molecular)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDownOrganogenesisLab;
