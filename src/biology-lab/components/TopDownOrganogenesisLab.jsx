import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../store';
import { useAnatomyStore } from '../../anatomy-lab/store';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';
import { cosmicAudio } from '../../utils/cosmicAudioBus';
import {
  LEVEL_1_MACROMOLECULES,
  LEVEL_2_ORGANELLES,
  LEVEL_3_CELLS,
  LEVEL_4_TISSUES,
  TIER_1_ORGAN_SYSTEMS,
  TIER_4_FOLDED_PROTEINS,
  computeRibosomeStep,
  evaluateOrganSystemChain,
  evaluateOrganPhysiologyBenchTest
} from '../data/topDownBioHierarchy';
import {
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
import {
  buildRealisticMacromolecule,
  buildSubIngredientsPreviewGroup,
  updateImpostorUniforms
} from '../utils/molecularImpostorEngine';
import {
  BIO_SUB_INGREDIENTS,
  PROTEIN_RECIPES
} from './ProteinIngredientsStore';
import TopTargetsBar from './assembly/TopTargetsBar';
import LeftIngredientsDrawer from './assembly/LeftIngredientsDrawer';
import OrganIncubatorChamber from './assembly/OrganIncubatorChamber';

const getInventoryStockForSub = (subId, inventoryState) => {
  if (subId === 'iron') return inventoryState.elements?.Fe ?? 0;
  return inventoryState.molecules?.[subId] ?? 0;
};

const disposeThreeHierarchy = (obj) => {
  if (!obj) return;
  obj.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
};

const TopDownOrganogenesisLab = ({
  activeStage: propActiveStage,
  setActiveStage: propSetActiveStage,
  onNavigateMode,
  onOpenAnatomy
}) => {
  const mountRef = useRef(null);

  // Bio Store
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
  const demiurgeSurvivalMode = useBioStore((s) => s.demiurgeSurvivalMode) || false;
  const setDemiurgeSurvivalMode = useBioStore((s) => s.setDemiurgeSurvivalMode);

  const snapOrganellePart = useBioStore((s) => s.snapOrganellePart);
  const assembleCompleteOrganelle = useBioStore((s) => s.assembleCompleteOrganelle);
  const snapOrganSubPart = useBioStore((s) => s.snapOrganSubPart);
  const transcribeAndTranslateGene = useBioStore((s) => s.transcribeAndTranslateGene);
  const foldTopDownProtein = useBioStore((s) => s.foldTopDownProtein);
  const differentiateCellLineage = useBioStore((s) => s.differentiateCellLineage);
  const bioprintTissueScaffold = useBioStore((s) => s.bioprintTissueScaffold);
  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);

  // Anatomy & Inventory Stores
  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};
  const fabricateOrganForAnatomy = useAnatomyStore((s) => s.fabricateOrganForAnatomy);
  const invElements = useInventory((s) => s.elements);
  const invMolecules = useInventory((s) => s.molecules);
  const executeTransaction = useInventory((s) => s.executeTransaction);

  // Active stage ('molecule' | 'organelle' | 'cell' | 'tissue' | 'organ')
  const [localStage, setLocalStage] = useState('molecule');
  const activeStage = propActiveStage ?? localStage;
  const setActiveStage = propSetActiveStage ?? setLocalStage;

  // Active Target IDs per Stop
  const [selectedMoleculeId, setSelectedMoleculeId] = useState('actin_myosin');
  const [selectedOrganelleId, setSelectedOrganelleId] = useState('mitochondrion');
  const [selectedCellId, setSelectedCellId] = useState('cardiomyocyte');
  const [selectedTissueId, setSelectedTissueId] = useState('endothelial');

  // Empty-until-dragged Canvas Staging per Stop
  const [canvasSubIngredients, setCanvasSubIngredients] = useState([]);
  const [builtOnCanvasMoleculeId, setBuiltOnCanvasMoleculeId] = useState(null);
  const [canvasCellParts, setCanvasCellParts] = useState([]);
  const [canvasTissueParts, setCanvasTissueParts] = useState([]);

  // 3D Viewport Controls
  const [slicerEnabled, setSlicerEnabled] = useState(false);
  const [slicerOffset, setSlicerOffset] = useState(0.25);
  const [membranePotentialMv, setMembranePotentialMv] = useState(-70);
  const [molecularStyleMode, setMolecularStyleMode] = useState(0);

  // Live Central Dogma Codon Stepper State (Stop 1)
  const [synthesisState, setSynthesisState] = useState(null);
  const synthesisTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (synthesisTimerRef.current) clearInterval(synthesisTimerRef.current);
    };
  }, []);

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
  const activeOrganelle =
    LEVEL_2_ORGANELLES[selectedOrganelleId] || LEVEL_2_ORGANELLES.mitochondrion;
  const activeCell =
    LEVEL_3_CELLS[selectedCellId] || LEVEL_3_CELLS[activeSystem.requiredCells[0]];
  const activeTissue =
    LEVEL_4_TISSUES[selectedTissueId] || LEVEL_4_TISSUES[activeSystem.requiredTissue];

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

  // Keep selected tissue & cell aligned when user switches Organ System
  useEffect(() => {
    setSelectedCellId(activeSystem.requiredCells[0]);
    setSelectedTissueId(activeSystem.requiredTissue);
  }, [activeSystem.id]);

  // ============================================================================
  // STOP 1 HANDLERS (Sub-Ingredients -> Codon Translation -> Stop 2)
  // ============================================================================
  const handleAddSubIngredient = (subId) => {
    if (demiurgeSurvivalMode) {
      const stock = getInventoryStockForSub(subId, { elements: invElements, molecules: invMolecules });
      if (stock < 1) {
        useStore
          .getState()
          .showMessage(`⚛️ Out of ${subId} in Physics/Chemistry Ledger! Craft it first or switch to Sandbox.`);
        return;
      }
    }
    setBuiltOnCanvasMoleculeId(null);
    setCanvasSubIngredients((prev) => (prev.includes(subId) ? prev : [...prev, subId]));
    cosmicAudio.playPulse(620);
  };

  const craftableFromCanvas = useMemo(() => {
    return Object.entries(PROTEIN_RECIPES)
      .filter(([, reqs]) => reqs.every((r) => canvasSubIngredients.includes(r)))
      .map(([molId]) => molId);
  }, [canvasSubIngredients]);

  const handleSynthesizeMolecule = (molId) => {
    if (synthesisTimerRef.current) clearInterval(synthesisTimerRef.current);
    const mol = LEVEL_1_MACROMOLECULES[molId];
    const reqs = PROTEIN_RECIPES[molId] || [];

    if (demiurgeSurvivalMode) {
      const costs = { elements: {}, molecules: {} };
      reqs.forEach((subId) => {
        if (subId === 'iron') costs.elements.Fe = (costs.elements.Fe || 0) + 1;
        else costs.molecules[subId] = (costs.molecules[subId] || 0) + 1;
      });
      const ok = executeTransaction(costs, {});
      if (!ok) {
        useStore
          .getState()
          .showMessage(`⚛️ Insufficient Physics/Chemistry stock to synthesize ${mol.name}.`);
        return;
      }
    }

    const proteinSpec = TIER_4_FOLDED_PROTEINS[molId];
    if (!proteinSpec) {
      setSynthesisState({
        molId,
        isProtein: false,
        phase:
          molId === 'bdna_chromatin'
            ? 'DNA Polymerization (No Codons)'
            : 'Lipid Self-Assembly (No Codons)'
      });
      synthesisTimerRef.current = setTimeout(() => {
        setSelectedMoleculeId(molId);
        setBuiltOnCanvasMoleculeId(molId);
        foldTopDownProtein(molId);
        setSynthesisState(null);
        cosmicAudio.playSynthesisChord();
        useStore.getState().showMessage(`🧬 Assembled ${mol.name}! Available in Stop 2 (Organelles).`);
      }, 450);
      return;
    }

    const totalSteps = Math.min(6, Math.max(3, Math.floor(proteinSpec.dna.length / 3)));
    let step = 0;
    const advance = () => {
      const ribo = computeRibosomeStep(proteinSpec.dna, step);
      setSynthesisState({
        molId,
        isProtein: true,
        phase: step === 0 ? 'Transcription (DNA → mRNA)' : '80S Ribosome Translation',
        codonIndex: step + 1,
        totalSteps,
        pSiteCodon: ribo.pSiteCodon,
        tRnaAnticodon: ribo.tRnaAnticodon,
        currentAminoAcid: ribo.currentAminoAcid
      });
      cosmicAudio.playPulse(440 + step * 55);
      step += 1;
      if (step >= totalSteps) {
        clearInterval(synthesisTimerRef.current);
        synthesisTimerRef.current = null;
        setSelectedMoleculeId(molId);
        setBuiltOnCanvasMoleculeId(molId);
        transcribeAndTranslateGene(proteinSpec.geneId);
        foldTopDownProtein(molId);
        setSynthesisState(null);
        cosmicAudio.playSynthesisChord();
        useStore
          .getState()
          .showMessage(`🧬 Translated & Folded ${mol.name}! Available in Stop 2 (Organelles).`);
      }
    };
    advance();
    synthesisTimerRef.current = setInterval(advance, 260);
  };

  // ============================================================================
  // STOP 2–5 HANDLERS (Empty-Canvas + Left-Drag + Assemble)
  // ============================================================================
  const handleAddStagePart = (partId) => {
    if (activeStage === 'organelle') {
      const part = activeOrganelle.parts.find((p) => p.id === partId);
      if (demiurgeSurvivalMode && part && !foldedProteins.includes(part.molId)) {
        useStore
          .getState()
          .showMessage(`🔒 Craft ${part.molId} in Stop 1 (Proteins) first!`);
        return;
      }
      snapOrganellePart(partId);
      cosmicAudio.playPulse(540);
    } else if (activeStage === 'cell') {
      const part = activeCell.parts.find((p) => p.id === partId);
      if (demiurgeSurvivalMode && part) {
        const ready =
          part.refLevel === 2
            ? assembledOrganelles.includes(part.refId)
            : foldedProteins.includes(part.refId);
        if (!ready) {
          useStore
            .getState()
            .showMessage(`🔒 Build ${part.refId} in Stop ${part.refLevel} first!`);
          return;
        }
      }
      setCanvasCellParts((prev) => (prev.includes(partId) ? prev : [...prev, partId]));
      cosmicAudio.playPulse(560);
    } else if (activeStage === 'tissue') {
      const part = activeTissue.parts.find((p) => p.id === partId);
      if (demiurgeSurvivalMode && part) {
        const ready =
          part.refLevel === 3
            ? differentiatedCells.includes(part.refId)
            : foldedProteins.includes(part.refId);
        if (!ready) {
          useStore
            .getState()
            .showMessage(`🔒 Build ${part.refId} in Stop ${part.refLevel} first!`);
          return;
        }
      }
      setCanvasTissueParts((prev) => (prev.includes(partId) ? prev : [...prev, partId]));
      cosmicAudio.playPulse(580);
    } else if (activeStage === 'organ') {
      if (
        demiurgeSurvivalMode &&
        partId === `tissue_${activeSystem.requiredTissue}` &&
        !engineeredTissues.includes(activeSystem.requiredTissue)
      ) {
        useStore
          .getState()
          .showMessage(`🔒 Bioprint ${activeSystem.requiredTissue} in Stop 4 (Tissues) first!`);
        return;
      }
      snapOrganSubPart(activeSystem.id, partId);
      cosmicAudio.playPulse(600);
    }
  };

  const handleAssembleCurrentStop = () => {
    if (activeStage === 'organelle') {
      assembleCompleteOrganelle(activeOrganelle.id);
      cosmicAudio.playSynthesisChord();
      useStore
        .getState()
        .showMessage(`⚡ Assembled ${activeOrganelle.name}! Now available in Stop 3 (Living Cell).`);
    } else if (activeStage === 'cell') {
      differentiateCellLineage(activeCell.id);
      cosmicAudio.playSynthesisChord();
      useStore
        .getState()
        .showMessage(`🧫 Differentiated ${activeCell.name}! Now available in Stop 4 (Tissue & ECM).`);
    } else if (activeStage === 'tissue') {
      bioprintTissueScaffold(activeTissue.id);
      cosmicAudio.playSynthesisChord();
      useStore
        .getState()
        .showMessage(`🧶 Bioprinted ${activeTissue.name}! Now available in Stop 5 (Human Organs).`);
    } else if (activeStage === 'organ') {
      const anatomyTissueId = synthesizeFullOrganChain(activeSystem.id);
      Object.keys(LEVEL_2_ORGANELLES).forEach((oid) => assembleCompleteOrganelle(oid));
      (activeSystem.subParts || []).forEach((sp) => {
        if (!assembledOrganParts.includes(sp.id)) snapOrganSubPart(activeSystem.id, sp.id);
      });
      if (fabricateOrganForAnatomy) fabricateOrganForAnatomy(anatomyTissueId);
      cosmicAudio.playSynthesisChord();
      useStore
        .getState()
        .showMessage(`🫀 Fabricated ${activeSystem.name}! Open Anatomy Lab to drag & snap it.`);
    }
  };

  // ============================================================================
  // THREE.JS 3D VIEWPORT (Empty-Until-Dragged Across All 5 Stops)
  // ============================================================================
  useEffect(() => {
    if (activeStage === 'organ') return;
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

    if (activeStage === 'molecule') {
      if (builtOnCanvasMoleculeId) {
        const macromolecule = buildRealisticMacromolecule(builtOnCanvasMoleculeId, {
          styleMode: molecularStyleMode
        });
        rootGroup.add(macromolecule);
        animatedItems.push({ group: macromolecule, mode: 'float', phase: 0 });
      } else if (canvasSubIngredients.length > 0) {
        const precursorGroup = buildSubIngredientsPreviewGroup(canvasSubIngredients, {
          styleMode: molecularStyleMode
        });
        rootGroup.add(precursorGroup);
        animatedItems.push({ group: precursorGroup, mode: 'float', phase: 0 });
      }
    } else if (activeStage === 'organelle') {
      const isBuilt = assembledOrganelles.includes(activeOrganelle.id);
      const hasAnyPart = activeOrganelle.parts.some((p) => assembledOrganelleParts.includes(p.id));
      if (isBuilt || hasAnyPart) {
        const partsList = isBuilt ? null : assembledOrganelleParts;
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
      }
    } else if (activeStage === 'cell') {
      const isCellReady = differentiatedCells.includes(activeCell.id);
      if (isCellReady || canvasCellParts.length > 0) {
        const isDepolarized = membranePotentialMv > 0;
        const outerMembrane = new THREE.Mesh(
          new THREE.SphereGeometry(1.45, 48, 48),
          new THREE.MeshPhysicalMaterial({
            color: isDepolarized ? '#38bdf8' : activeCell.color,
            emissive: isDepolarized ? '#38bdf8' : activeCell.color,
            emissiveIntensity: isDepolarized ? 0.65 : isCellReady ? 0.18 : 0.06,
            transmission: 0.78,
            transparent: true,
            opacity: isCellReady ? 0.42 : 0.22,
            wireframe: !isCellReady,
            roughness: 0.12,
            ior: 1.38,
            clearcoat: 1.0,
            side: THREE.DoubleSide
          })
        );
        rootGroup.add(outerMembrane);

        if (isCellReady || canvasCellParts.some((id) => id.includes('nuc') || id.includes('soma'))) {
          const nuc = createHDNucleus(null);
          nuc.scale.setScalar(0.75);
          rootGroup.add(nuc);
          animatedItems.push({ group: nuc, mode: 'float', phase: 0 });
        }
        if (isCellReady || canvasCellParts.some((id) => id.includes('mito'))) {
          [-0.78, 0.78].forEach((xPos, i) => {
            const mito = createHDMitochondrion(null);
            mito.scale.setScalar(0.8);
            mito.position.set(xPos, i === 0 ? 0.42 : -0.42, 0.25);
            rootGroup.add(mito);
            animatedItems.push({ group: mito, mode: 'float', phase: i + 1 });
          });
        }
        if (isCellReady || canvasCellParts.some((id) => id.includes('ribo') || id.includes('atp'))) {
          const ribo = createHD80SRibosome(5, null);
          ribo.scale.setScalar(0.75);
          ribo.position.set(0, -0.72, 0.35);
          rootGroup.add(ribo);
          animatedItems.push({ group: ribo, mode: 'float', phase: 3 });
        }
      }
    } else {
      // Stage 4 (Tissue) — Empty until dragged or built; Stage 5 (Organ) — Always renders selected Organ/Tissue tab
      const isTissueBuilt = engineeredTissues.includes(activeTissue.id);
      const isOrganBuilt = Boolean(bioprintedTissues[activeSystem.anatomyTissueId]);
      const hasAnyTissuePart = canvasTissueParts.length > 0 || isTissueBuilt;

      if (
        (activeStage === 'tissue' && hasAnyTissuePart) ||
        activeStage === 'organ'
      ) {
        const isComplete = activeStage === 'organ' ? true : isTissueBuilt;
        const effectiveSnappedParts = isComplete
          ? (activeSystem.subParts || []).map((sp) => sp.id)
          : assembledOrganParts;

        const fallbackOrgan = create3DOrganForSystem(activeSystem.id);
        applyOrganSubPartMaterials(
          fallbackOrgan,
          activeSystem.id,
          effectiveSnappedParts,
          isComplete,
          clipPlane
        );
        rootGroup.add(fallbackOrgan);
        animatedItems.push({ group: fallbackOrgan, mode: 'organ', systemId: activeSystem.id });

        loadZAnatomyOrganModel(activeSystem.id).then((glbOrgan) => {
          if (isDisposed || !glbOrgan) return;
          applyOrganSubPartMaterials(
            glbOrgan,
            activeSystem.id,
            effectiveSnappedParts,
            isComplete,
            clipPlane
          );
          rootGroup.remove(fallbackOrgan);
          disposeThreeHierarchy(fallbackOrgan);
          animatedItems.length = 0;
          rootGroup.add(glbOrgan);
          animatedItems.push({ group: glbOrgan, mode: 'organ', systemId: activeSystem.id });
        });
      }
    }

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
      e.preventDefault();
      camera.position.z = Math.max(2.4, Math.min(7.5, camera.position.z + e.deltaY * 0.002));
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (!isDragging) rootGroup.rotation.y += 0.0032;

      animatedItems.forEach((item) => {
        if (item.mode === 'organ') {
          if (item.systemId === 'cardiovascular_system') {
            const lubDub = 1 + Math.pow(Math.max(0, Math.sin(t * 3.8)), 6) * 0.055;
            item.group.scale.setScalar(lubDub);
          } else if (item.systemId === 'respiratory_system') {
            item.group.scale.setScalar(1 + Math.sin(t * 1.4) * 0.045);
          }
        } else {
          item.group.position.y += Math.sin(t * 1.8 + (item.phase || 0)) * 0.0007;
        }
      });

      if (activeStage === 'molecule') {
        updateImpostorUniforms(rootGroup, { time: t, styleMode: molecularStyleMode });
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      dom.removeEventListener('wheel', onWheel);
      disposeThreeHierarchy(scene);
      renderer.dispose();
    };
  }, [
    activeStage,
    activeSystem.id,
    activeOrganelle.id,
    activeCell.id,
    activeTissue.id,
    assembledOrganelles,
    assembledOrganelleParts,
    assembledOrganParts,
    differentiatedCells,
    engineeredTissues,
    bioprintedTissues,
    slicerEnabled,
    slicerOffset,
    membranePotentialMv,
    molecularStyleMode,
    canvasSubIngredients,
    builtOnCanvasMoleculeId,
    canvasCellParts,
    canvasTissueParts,
    snappedSubPartsCount
  ]);

  // ============================================================================
  // DYNAMIC STAGE CONFIGURATION FOR TOP BAR + LEFT DRAWER + BOTTOM DOCK
  // ============================================================================
  const stageTopConfig = useMemo(() => {
    if (activeStage === 'molecule') {
      return {
        label: 'Needed (Stop 1):',
        items: Object.values(LEVEL_1_MACROMOLECULES),
        builtIds: foldedProteins,
        activeId: builtOnCanvasMoleculeId || selectedMoleculeId,
        onSelectBuilt: (id, isBuilt) => {
          setSelectedMoleculeId(id);
          if (isBuilt) setBuiltOnCanvasMoleculeId(id);
        }
      };
    }
    if (activeStage === 'organelle') {
      return {
        label: 'Needed (Stop 2):',
        items: Object.values(LEVEL_2_ORGANELLES),
        builtIds: assembledOrganelles,
        activeId: selectedOrganelleId,
        onSelectBuilt: (id) => setSelectedOrganelleId(id)
      };
    }
    if (activeStage === 'cell') {
      return {
        label: 'Needed (Stop 3):',
        items: Object.values(LEVEL_3_CELLS),
        builtIds: differentiatedCells,
        activeId: activeCell.id,
        onSelectBuilt: (id) => setSelectedCellId(id)
      };
    }
    if (activeStage === 'tissue') {
      return {
        label: 'Needed (Stop 4):',
        items: Object.values(LEVEL_4_TISSUES),
        builtIds: engineeredTissues,
        activeId: activeTissue.id,
        onSelectBuilt: (id) => setSelectedTissueId(id)
      };
    }
    const deployedOrgans = Object.values(TIER_1_ORGAN_SYSTEMS)
      .filter((sys) => Boolean(bioprintedTissues[sys.anatomyTissueId]))
      .map((sys) => sys.id);
    return {
      label: 'Needed (Stop 5):',
      items: Object.values(TIER_1_ORGAN_SYSTEMS),
      builtIds: deployedOrgans,
      activeId: activeSystem.id,
      onSelectBuilt: (id) => setSelectedOrganSystemId(id)
    };
  }, [
    activeStage,
    foldedProteins,
    builtOnCanvasMoleculeId,
    selectedMoleculeId,
    assembledOrganelles,
    selectedOrganelleId,
    differentiatedCells,
    activeCell.id,
    engineeredTissues,
    activeTissue.id,
    bioprintedTissues,
    activeSystem.id
  ]);

  const drawerConfig = useMemo(() => {
    if (activeStage === 'molecule') {
      return {
        title: '🧪 Sub-Ingredients',
        subtitle: 'Drag onto canvas to synthesize',
        dragKind: 'sub_ingredient',
        loadedIds: canvasSubIngredients,
        items: BIO_SUB_INGREDIENTS.map((sub) => {
          const stock = getInventoryStockForSub(sub.id, {
            elements: invElements,
            molecules: invMolecules
          });
          return {
            id: sub.id,
            name: sub.name,
            icon: '⚛️',
            formula: `${sub.category} • ${sub.formula}`,
            color: sub.color,
            stockCount: stock,
            available: !demiurgeSurvivalMode || stock >= 1
          };
        }),
        recipeSectionTitle: 'Quick-Load Protein Recipes',
        recipes: Object.entries(PROTEIN_RECIPES).map(([molId, reqs]) => {
          const mol = LEVEL_1_MACROMOLECULES[molId];
          return {
            id: molId,
            name: mol?.name.split(' ')[0] || molId,
            icon: mol?.icon || '🧬',
            isBuilt: foldedProteins.includes(molId),
            isActive: selectedMoleculeId === molId,
            badge: foldedProteins.includes(molId) ? '✓' : 'Load',
            onSelect: () => {
              setSelectedMoleculeId(molId);
              setBuiltOnCanvasMoleculeId(null);
              setCanvasSubIngredients(reqs);
              cosmicAudio.playPulse(660);
            }
          };
        })
      };
    }

    if (activeStage === 'organelle') {
      return {
        title: '🧬 Stop 1 Macromolecules',
        subtitle: `For ${activeOrganelle.name}`,
        dragKind: 'organelle_part',
        loadedIds: assembledOrganelleParts,
        items: activeOrganelle.parts.map((p) => {
          const hasMol = foldedProteins.includes(p.molId);
          return {
            id: p.id,
            name: p.label,
            icon: LEVEL_1_MACROMOLECULES[p.molId]?.icon || '🧬',
            formula: `From Stop 1 (${p.molId})`,
            color: activeOrganelle.color,
            stockCount: hasMol ? 'Ready' : '0',
            available: !demiurgeSurvivalMode || hasMol
          };
        }),
        recipeSectionTitle: 'Target Organelles',
        recipes: Object.values(LEVEL_2_ORGANELLES).map((org) => ({
          id: org.id,
          name: org.name,
          icon: org.icon,
          isBuilt: assembledOrganelles.includes(org.id),
          isActive: activeOrganelle.id === org.id,
          onSelect: () => setSelectedOrganelleId(org.id)
        }))
      };
    }

    if (activeStage === 'cell') {
      return {
        title: '⚡ Stop 2 Organelles & Proteins',
        subtitle: `For ${activeCell.name}`,
        dragKind: 'cell_part',
        loadedIds: canvasCellParts,
        items: activeCell.parts.map((p) => {
          const ready =
            p.refLevel === 2
              ? assembledOrganelles.includes(p.refId)
              : foldedProteins.includes(p.refId);
          return {
            id: p.id,
            name: p.label,
            icon: p.refLevel === 2 ? '⚡' : '🧬',
            formula: `From Stop ${p.refLevel} (${p.refId})`,
            color: activeCell.color,
            stockCount: ready ? 'Ready' : '0',
            available: !demiurgeSurvivalMode || ready
          };
        }),
        recipeSectionTitle: 'Target Cell Lineages',
        recipes: Object.values(LEVEL_3_CELLS).map((cell) => ({
          id: cell.id,
          name: cell.name.split(' ')[0],
          icon: cell.icon,
          isBuilt: differentiatedCells.includes(cell.id),
          isActive: activeCell.id === cell.id,
          onSelect: () => setSelectedCellId(cell.id)
        }))
      };
    }

    if (activeStage === 'tissue') {
      return {
        title: '🧫 Stop 3 Cells & ECM',
        subtitle: `For ${activeTissue.name}`,
        dragKind: 'tissue_part',
        loadedIds: canvasTissueParts,
        items: activeTissue.parts.map((p) => {
          const ready =
            p.refLevel === 3
              ? differentiatedCells.includes(p.refId)
              : foldedProteins.includes(p.refId);
          return {
            id: p.id,
            name: p.label,
            icon: p.refLevel === 3 ? '🧫' : '🧬',
            formula: `From Stop ${p.refLevel} (${p.refId})`,
            color: activeTissue.color,
            stockCount: ready ? 'Ready' : '0',
            available: !demiurgeSurvivalMode || ready
          };
        }),
        recipeSectionTitle: 'Target Tissues',
        recipes: Object.values(LEVEL_4_TISSUES).map((tis) => ({
          id: tis.id,
          name: tis.name.split(' ')[0],
          icon: tis.icon,
          isBuilt: engineeredTissues.includes(tis.id),
          isActive: activeTissue.id === tis.id,
          onSelect: () => setSelectedTissueId(tis.id)
        }))
      };
    }

    return {
      title: '🫀 Anatomical Sub-Parts',
      subtitle: `For ${activeSystem.name}`,
      dragKind: 'organ_part',
      loadedIds: assembledOrganParts,
      items: (activeSystem.subParts || []).map((sp) => ({
        id: sp.id,
        name: sp.label,
        icon: activeSystem.icon,
        formula: sp.role,
        color: activeSystem.color,
        stockCount: engineeredTissues.includes(activeSystem.requiredTissue) ? 'Tissue ✓' : '0',
        available:
          !demiurgeSurvivalMode || engineeredTissues.includes(activeSystem.requiredTissue)
      })),
      recipeSectionTitle: 'Target Human Organs',
      recipes: Object.values(TIER_1_ORGAN_SYSTEMS).map((sys) => ({
        id: sys.id,
        name: sys.name,
        icon: sys.icon,
        isBuilt: Boolean(bioprintedTissues[sys.anatomyTissueId]),
        isActive: activeSystem.id === sys.id,
        onSelect: () => setSelectedOrganSystemId(sys.id)
      }))
    };
  }, [
    activeStage,
    canvasSubIngredients,
    invElements,
    invMolecules,
    demiurgeSurvivalMode,
    foldedProteins,
    selectedMoleculeId,
    activeOrganelle,
    assembledOrganelleParts,
    assembledOrganelles,
    activeCell,
    canvasCellParts,
    differentiatedCells,
    activeTissue,
    canvasTissueParts,
    engineeredTissues,
    activeSystem,
    assembledOrganParts,
    bioprintedTissues
  ]);

  const isCurrentTargetBuilt =
    (activeStage === 'organelle' && assembledOrganelles.includes(activeOrganelle.id)) ||
    (activeStage === 'cell' && differentiatedCells.includes(activeCell.id)) ||
    (activeStage === 'tissue' && engineeredTissues.includes(activeTissue.id)) ||
    (activeStage === 'organ' && Boolean(bioprintedTissues[activeSystem.anatomyTissueId]));

  const ORGAN_CATEGORY_TABS = [
    { id: 'skeletal_system', icon: '🦴', label: 'Bones' },
    { id: 'cardiovascular_system', icon: '🫀', label: 'Major Organs' },
    { id: 'visceral_system', icon: '🫁', label: 'Visceral & Skin' },
    { id: 'muscular_system', icon: '💪', label: 'Muscle Tissue' },
    { id: 'nervous_system', icon: '🧠', label: 'Neural System' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#060a12] p-3 pb-16 gap-2.5 overflow-hidden select-none">
      {/* ORGAN TAB: Minimal Top Organ/Tissue Category Switch */}
      {activeStage === 'organ' ? (
        <div className="bg-[#0b1220] rounded-2xl px-3 py-2 border border-white/10 shrink-0 flex items-center gap-1.5 overflow-x-auto">
          {ORGAN_CATEGORY_TABS.map((tab) => {
            const isSelected = activeSystem.id === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedOrganSystemId(tab.id)}
                className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white hover:border-white/25'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <TopTargetsBar
          label={stageTopConfig.label}
          items={stageTopConfig.items}
          builtIds={stageTopConfig.builtIds}
          activeId={stageTopConfig.activeId}
          onSelectBuilt={stageTopConfig.onSelectBuilt}
          demiurgeSurvivalMode={demiurgeSurvivalMode}
          onToggleSurvivalMode={() => setDemiurgeSurvivalMode(!demiurgeSurvivalMode)}
          onOpenAnatomy={onOpenAnatomy}
        />
      )}

      {/* UNIFIED 12-COL WORKSPACE: Liquid Incubator in Organ tab, or 3-Col Drawer + 9-Col Canvas */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {activeStage === 'organ' ? (
          <OrganIncubatorChamber
            systemId={activeSystem.id}
            onOpenAnatomy={onOpenAnatomy}
          />
        ) : (
        <>
          <LeftIngredientsDrawer
            title={drawerConfig.title}
            subtitle={drawerConfig.subtitle}
            items={drawerConfig.items}
            loadedIds={drawerConfig.loadedIds}
            dragKind={drawerConfig.dragKind}
            demiurgeSurvivalMode={demiurgeSurvivalMode}
            onAddItem={(id) =>
              activeStage === 'molecule' ? handleAddSubIngredient(id) : handleAddStagePart(id)
            }
            recipes={drawerConfig.recipes}
            recipeSectionTitle={drawerConfig.recipeSectionTitle}
          />

        {/* 3D HOLOGRAPHIC ASSEMBLY CANVAS */}
        <div className="col-span-9 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
          {/* Top Canvas HUD (Hidden in Organ tab) */}
          {activeStage !== 'organ' && (
          <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between pointer-events-none">
            <div className="bg-[#090d16]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase block">
                {activeStage === 'molecule' &&
                  (builtOnCanvasMoleculeId
                    ? `STOP 1 // BUILT: ${LEVEL_1_MACROMOLECULES[builtOnCanvasMoleculeId]?.name}`
                    : canvasSubIngredients.length > 0
                    ? `STOP 1 // PRECURSORS LOADED (${canvasSubIngredients.length})`
                    : 'STOP 1 // EMPTY PROTEIN CANVAS')}
                {activeStage === 'organelle' && `STOP 2 // ORGANELLE: ${activeOrganelle.name}`}
                {activeStage === 'cell' && `STOP 3 // LIVING CELL: ${activeCell.name}`}
                {activeStage === 'tissue' && `STOP 4 // TISSUE SCAFFOLD: ${activeTissue.name}`}
                {activeStage === 'organ' && `STOP 5 // Z-ANATOMY ORGAN: ${activeSystem.latinName}`}
              </span>
              <h3 className="text-sm font-black text-white mt-0.5">
                {activeStage === 'molecule' &&
                  (builtOnCanvasMoleculeId
                    ? `${LEVEL_1_MACROMOLECULES[builtOnCanvasMoleculeId]?.icon} ${LEVEL_1_MACROMOLECULES[builtOnCanvasMoleculeId]?.name}`
                    : canvasSubIngredients.length > 0
                    ? '🧪 Ready to Synthesize'
                    : '🧬 Drag Ingredients Here')}
                {activeStage === 'organelle' && `${activeOrganelle.icon} ${activeOrganelle.name}`}
                {activeStage === 'cell' && `${activeCell.icon} ${activeCell.name}`}
                {activeStage === 'tissue' && `${activeTissue.icon} ${activeTissue.name}`}
                {activeStage === 'organ' && `${activeSystem.icon} ${activeSystem.name}`}
              </h3>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {activeStage === 'molecule' && (
                <>
                  {(canvasSubIngredients.length > 0 || builtOnCanvasMoleculeId) && (
                    <button
                      onClick={() => {
                        setCanvasSubIngredients([]);
                        setBuiltOnCanvasMoleculeId(null);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#090d16]/90 hover:bg-rose-950/50 border border-white/15 text-slate-300 hover:text-rose-200 font-mono font-bold text-[9px] uppercase cursor-pointer"
                    >
                      🗑 Clear
                    </button>
                  )}
                  <div className="bg-[#090d16]/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                    <button
                      onClick={() => setMolecularStyleMode(0)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase border cursor-pointer ${
                        molecularStyleMode === 0
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      🔬 Cryo-EM SSS
                    </button>
                    <button
                      onClick={() => setMolecularStyleMode(1)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase border cursor-pointer ${
                        molecularStyleMode === 1
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      🎨 Goodsell Ink
                    </button>
                  </div>
                </>
              )}

              {activeStage === 'cell' && (
                <div className="bg-[#090d16]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                  <span className="text-[9px] font-mono text-cyan-300 font-bold">
                    ⚡ {membranePotentialMv} mV
                  </span>
                  <input
                    type="range"
                    min="-70"
                    max="30"
                    step="5"
                    value={membranePotentialMv}
                    onChange={(e) => setMembranePotentialMv(parseInt(e.target.value, 10))}
                    className="w-20 accent-cyan-400 cursor-pointer"
                  />
                </div>
              )}

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
          )}

          {/* 3D Drop-Target Mount */}
          <div
            ref={mountRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              try {
                const payload = JSON.parse(e.dataTransfer.getData('application/json') || '{}');
                if (!payload.id) return;
                if (payload.kind === 'sub_ingredient') handleAddSubIngredient(payload.id);
                else handleAddStagePart(payload.id);
              } catch {
                // ignore malformed drag payload
              }
            }}
            className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* Live Central Dogma Codon Tape Overlay (Stop 1) */}
          {activeStage === 'molecule' && synthesisState && (
            <div className="mx-4 mb-2 px-3.5 py-2 rounded-xl bg-[#0b1426]/95 border border-cyan-400/60 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-300 font-bold uppercase">{synthesisState.phase}</span>
              </div>
              {synthesisState.isProtein ? (
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-purple-200">
                    mRNA: <strong>{synthesisState.pSiteCodon}</strong>
                  </span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-200">
                    tRNA: {synthesisState.tRnaAnticodon}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold">
                    +{synthesisState.currentAminoAcid}
                  </span>
                </div>
              ) : (
                <span className="font-mono text-[10px] text-emerald-300">
                  Direct Enzymatic Assembly (No Ribosome Required)
                </span>
              )}
            </div>
          )}

          {/* Unified Floating Bottom Dock (Hidden in Organ tab) */}
          {activeStage !== 'organ' && (
          <div className="px-4 py-2.5 bg-[#090d16]/95 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            {activeStage === 'molecule' ? (
              <>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[9px] font-mono text-slate-400 uppercase pr-1 shrink-0">
                    On Canvas:
                  </span>
                  {canvasSubIngredients.map((sid) => {
                    const item = BIO_SUB_INGREDIENTS.find((x) => x.id === sid);
                    if (!item) return null;
                    return (
                      <span
                        key={sid}
                        className="px-2 py-0.5 rounded-lg bg-[#080d18] border border-cyan-500/30 font-mono text-[9px] text-cyan-200 flex items-center gap-1 shrink-0"
                      >
                        <span>{item.name.split(' ')[0]}</span>
                        <button
                          onClick={() => {
                            setBuiltOnCanvasMoleculeId(null);
                            setCanvasSubIngredients((prev) => prev.filter((x) => x !== sid));
                          }}
                          className="text-slate-400 hover:text-rose-400 cursor-pointer ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  {canvasSubIngredients.length === 0 && (
                    <span className="text-[9.5px] font-mono text-slate-500">
                      Empty — drag ingredients from left drawer
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {craftableFromCanvas.length > 0 ? (
                    craftableFromCanvas.map((molId) => {
                      const mol = LEVEL_1_MACROMOLECULES[molId];
                      const isFolded = foldedProteins.includes(molId);
                      return (
                        <button
                          key={molId}
                          disabled={Boolean(synthesisState)}
                          onClick={() => handleSynthesizeMolecule(molId)}
                          className={`px-3.5 py-1.5 rounded-xl font-mono font-black text-[10px] uppercase tracking-wider cursor-pointer ${
                            isFolded
                              ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-200'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                          }`}
                        >
                          {isFolded
                            ? `✓ ${mol.icon} ${mol.name.split(' ')[0]} Ready`
                            : `🧬 Synthesize ${mol.icon} ${mol.name.split(' ')[0]} →`}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-[9.5px] font-mono text-amber-300">
                      Load matching sub-ingredients to craft a macromolecule
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="text-[9.5px] font-mono text-slate-400">
                  Drag parts from left drawer onto 3D canvas • Drag to Rotate • Scroll to Zoom
                </span>
                <div className="flex items-center gap-2">
                  {activeStage === 'organ' && isCurrentTargetBuilt && onOpenAnatomy && (
                    <button
                      onClick={onOpenAnatomy}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-mono font-bold text-[10px] uppercase cursor-pointer"
                    >
                      🦴 Place in Anatomy Lab →
                    </button>
                  )}
                  <button
                    onClick={handleAssembleCurrentStop}
                    className={`px-4 py-1.5 rounded-xl font-mono font-black text-[10px] uppercase tracking-wider cursor-pointer ${
                      isCurrentTargetBuilt
                        ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-200'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {activeStage === 'organelle' &&
                      (isCurrentTargetBuilt
                        ? `✓ ${activeOrganelle.name} Ready`
                        : `⚡ Assemble ${activeOrganelle.name} →`)}
                    {activeStage === 'cell' &&
                      (isCurrentTargetBuilt
                        ? `✓ ${activeCell.name} Ready`
                        : `🧫 Differentiate ${activeCell.name.split(' ')[0]} →`)}
                    {activeStage === 'tissue' &&
                      (isCurrentTargetBuilt
                        ? `✓ ${activeTissue.name} Ready`
                        : `🧶 Bioprint ${activeTissue.name.split(' ')[0]} →`)}
                    {activeStage === 'organ' &&
                      (isCurrentTargetBuilt
                        ? `✓ ${activeSystem.name} Fabricated`
                        : `🫀 Fabricate ${activeSystem.name} for Anatomy →`)}
                  </button>
                </div>
              </>
            )}
          </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default TopDownOrganogenesisLab;
