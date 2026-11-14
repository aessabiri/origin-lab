import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../../store';
import { useAnatomyStore } from '../../../anatomy-lab/store';
import { useStore } from '../../../store';
import { cosmicAudio } from '../../../utils/cosmicAudioBus';

export const INCUBATOR_RECIPES = {
  skeletal_system: {
    id: 'skeletal_system',
    anatomyTissueId: 'osteoid',
    chamberName: 'Osteogenic Perfused Bioreactor',
    liquidColor: '#0ea5e9',
    cellColor: '#38bdf8',
    components: [
      { id: 'cell_osteoblast', label: 'Osteoblast Progenitors', sourceStop: 'Stop 3/4', refId: 'osteoblast', refType: 'cell' },
      { id: 'comp_hydroxyapatite', label: 'Ca₁₀(PO₄)₆(OH)₂ Mineral', sourceStop: 'Stop 4', refId: 'osteoid', refType: 'tissue' },
      { id: 'comp_collagen_i', label: 'Type-I Collagen + BMP-2', sourceStop: 'Stop 1', refId: 'collagen_i', refType: 'protein' },
    ],
    outcomeLabel: '206-Bone Mineralized Osteoid',
  },
  cardiovascular_system: {
    id: 'cardiovascular_system',
    anatomyTissueId: 'endothelial',
    chamberName: 'Pulsatile Cardiogenic Bioreactor',
    liquidColor: '#ef4444',
    cellColor: '#fb7185',
    components: [
      { id: 'cell_cardiomyocyte', label: 'Cardiomyocytes + Endothelium', sourceStop: 'Stop 3', refId: 'cardiomyocyte', refType: 'cell' },
      { id: 'comp_vegf_o2', label: 'VEGF-A + Hemoglobin O₂', sourceStop: 'Stop 1', refId: 'hemoglobin', refType: 'protein' },
      { id: 'comp_atp_actin', label: 'Actin-Myosin + Endothelial Tissue', sourceStop: 'Stop 4', refId: 'endothelial', refType: 'tissue' },
    ],
    outcomeLabel: '4-Chamber Heart & Vascular Tree',
  },
  visceral_system: {
    id: 'visceral_system',
    anatomyTissueId: 'visceral',
    chamberName: 'Parenchymal & Dermal Bioreactor',
    liquidColor: '#10b981',
    cellColor: '#34d399',
    components: [
      { id: 'cell_hepatocyte', label: 'Hepatocytes & Epithelial Cells', sourceStop: 'Stop 3', refId: 'hepatocyte', refType: 'cell' },
      { id: 'comp_egf_hgf', label: 'EGF + Visceral Parenchyma', sourceStop: 'Stop 4', refId: 'visceral', refType: 'tissue' },
      { id: 'comp_surfactant', label: 'Phospholipid + Collagen IV', sourceStop: 'Stop 1', refId: 'collagen_i', refType: 'protein' },
    ],
    outcomeLabel: 'Visceral Organs & Dermal Tissue',
  },
  muscular_system: {
    id: 'muscular_system',
    anatomyTissueId: 'myofibril',
    chamberName: 'Myogenic Tension Bioreactor',
    liquidColor: '#f43f5e',
    cellColor: '#fda4af',
    components: [
      { id: 'cell_myocyte', label: 'Striated Myocytes', sourceStop: 'Stop 3', refId: 'cardiomyocyte', refType: 'cell' },
      { id: 'comp_igf1_glucose', label: 'Myofibril Tissue Scaffold', sourceStop: 'Stop 4', refId: 'myofibril', refType: 'tissue' },
      { id: 'comp_tendon_ecm', label: 'Actin-Myosin + Tendon ECM', sourceStop: 'Stop 1', refId: 'actin_myosin', refType: 'protein' },
    ],
    outcomeLabel: 'Skeletal Muscle & Ligaments',
  },
  nervous_system: {
    id: 'nervous_system',
    anatomyTissueId: 'neural',
    chamberName: 'Neurotrophic Perfused Bioreactor',
    liquidColor: '#f59e0b',
    cellColor: '#fbbf24',
    components: [
      { id: 'cell_neuron', label: 'Motor & Cortical Neurons', sourceStop: 'Stop 3', refId: 'motor_neuron', refType: 'cell' },
      { id: 'comp_ngf_bdnf', label: 'Neural Tissue Matrix', sourceStop: 'Stop 4', refId: 'neural', refType: 'tissue' },
      { id: 'comp_myelin_ions', label: 'Na⁺/K⁺ Channels + Myelin', sourceStop: 'Stop 1', refId: 'ion_channel', refType: 'protein' },
    ],
    outcomeLabel: 'Brain, Spinal Cord & Nerves',
  },
};

const getGrowthPhaseLabel = (progress, isRunning) => {
  if (progress >= 100) return 'Organoid Matured • Ready for Anatomy';
  if (!isRunning && progress === 0) return 'Standby — Insert components & press Start';
  if (progress < 30) return 'Phase 1: Cell Seeding & ECM Adhesion';
  if (progress < 65) return 'Phase 2: Morphogen Gradient & Mitosis';
  return 'Phase 3: Tissue Folding & Vascularization';
};

const disposeHierarchy = (root) => {
  if (!root) return;
  root.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
  });
};

const OrganIncubatorChamber = ({ systemId = 'skeletal_system', onOpenAnatomy }) => {
  const mountRef = useRef(null);
  const recipe = INCUBATOR_RECIPES[systemId] || INCUBATOR_RECIPES.skeletal_system;

  const [loadedBySystem, setLoadedBySystem] = useState({});
  const [growthProgressBySystem, setGrowthProgressBySystem] = useState({});
  const [runningBySystem, setRunningBySystem] = useState({});

  const foldedProteins = useBioStore((s) => s.foldedProteins) || [];
  const differentiatedCells = useBioStore((s) => s.differentiatedCells) || [];
  const engineeredTissues = useBioStore((s) => s.engineeredTissues) || [];
  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);
  const fabricateOrganForAnatomy = useAnatomyStore((s) => s.fabricateOrganForAnatomy);
  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};

  const loadedIds = loadedBySystem[recipe.id] || [];
  const allComponentsLoaded = recipe.components.every((c) => loadedIds.includes(c.id));
  const growth = growthProgressBySystem[recipe.id] || 0;
  const isRunning = Boolean(runningBySystem[recipe.id]);
  const isGrown = growth >= 100 || Boolean(bioprintedTissues[recipe.anatomyTissueId]);

  const isSourceReady = (comp) => {
    if (comp.refType === 'cell') return differentiatedCells.includes(comp.refId);
    if (comp.refType === 'tissue') return engineeredTissues.includes(comp.refId);
    return foldedProteins.includes(comp.refId);
  };

  const handleInsertComponent = (compId) => {
    setLoadedBySystem((prev) => {
      const current = prev[recipe.id] || [];
      if (current.includes(compId)) return prev;
      return { ...prev, [recipe.id]: [...current, compId] };
    });
    cosmicAudio.playPulse(580);
  };

  const handleStartIncubation = () => {
    if (!allComponentsLoaded || isGrown) return;
    setRunningBySystem((prev) => ({ ...prev, [recipe.id]: true }));
    cosmicAudio.playPulse(660);
  };

  // Run growth progress only after user clicks Start
  useEffect(() => {
    if (!isRunning || !allComponentsLoaded || isGrown) return;
    const timer = setInterval(() => {
      setGrowthProgressBySystem((prev) => {
        const cur = prev[recipe.id] || 0;
        const next = Math.min(100, cur + 8);
        if (next === 100) {
          setRunningBySystem((r) => ({ ...r, [recipe.id]: false }));
          cosmicAudio.playSynthesisChord();
        }
        return { ...prev, [recipe.id]: next };
      });
    }, 220);
    return () => clearInterval(timer);
  }, [isRunning, allComponentsLoaded, isGrown, recipe.id]);

  // Compact, Sophisticated 3D Bioreactor Vessel
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 460;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.65, 5.2);
    camera.lookAt(0, -0.05, 0);

    scene.add(new THREE.AmbientLight(0xf1f5f9, 1.0));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.1);
    rimLight.position.set(-4, 2, -4);
    scene.add(rimLight);
    const liquidGlow = new THREE.PointLight(recipe.liquidColor, 2.0, 10);
    liquidGlow.position.set(0, 0.1, 1.4);
    scene.add(liquidGlow);

    const chamberGroup = new THREE.Group();
    chamberGroup.scale.setScalar(0.76); // Compact, refined laboratory footprint
    scene.add(chamberGroup);

    const titaniumMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      metalness: 0.88,
      roughness: 0.22,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      metalness: 0.92,
      roughness: 0.16,
    });

    // 1. Precision Base Pedestal & Top Manifold Cap
    const basePedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.46, 0.22, 48), titaniumMat);
    basePedestal.position.y = -1.42;
    chamberGroup.add(basePedestal);

    const topManifold = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.32, 0.2, 48), titaniumMat);
    topManifold.position.y = 1.42;
    chamberGroup.add(topManifold);

    // Top O2 & Nutrient Perfusion Ports
    [-0.45, 0, 0.45].forEach((xOffset, idx) => {
      const port = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.28, 16), chromeMat);
      port.position.set(xOffset, 1.62, 0);
      chamberGroup.add(port);

      if (idx !== 1) {
        const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.25, 12), chromeMat);
        probe.position.set(xOffset, 0.22, 0);
        chamberGroup.add(probe);
      }
    });

    // 4 Vertical Structural Tie-Rods around the Glass Chamber
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 2.72, 12), chromeMat);
      rod.position.set(Math.cos(a) * 1.24, 0, Math.sin(a) * 1.24);
      chamberGroup.add(rod);
    }

    // Glowing Bioreactor Collar Rings + Volumetric Etchings
    const accentColor = isRunning ? '#22d3ee' : recipe.liquidColor;
    const ringMat = new THREE.MeshBasicMaterial({ color: accentColor });
    [-1.28, 1.28].forEach((yPos) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.022, 16, 64), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yPos;
      chamberGroup.add(ring);
    });

    const etchMat = new THREE.MeshBasicMaterial({
      color: '#cbd5e1',
      transparent: true,
      opacity: 0.28,
    });
    [-0.6, 0, 0.6].forEach((yPos) => {
      const etch = new THREE.Mesh(new THREE.TorusGeometry(1.13, 0.008, 8, 48), etchMat);
      etch.rotation.x = Math.PI / 2;
      etch.position.y = yPos;
      chamberGroup.add(etch);
    });

    // 2. Borosilicate Glass Vessel
    const glassCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.12, 1.12, 2.54, 48, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: '#e2e8f0',
        transparent: true,
        opacity: 0.16,
        roughness: 0.06,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    chamberGroup.add(glassCylinder);

    // 3. Nutrient Liquid Medium
    const liquidMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.06, 1.06, 2.15, 48),
      new THREE.MeshPhysicalMaterial({
        color: recipe.liquidColor,
        emissive: recipe.liquidColor,
        emissiveIntensity: isRunning ? 0.24 : 0.14,
        transparent: true,
        opacity: 0.28,
        roughness: 0.1,
        depthWrite: false,
      })
    );
    liquidMesh.position.y = -0.14;
    chamberGroup.add(liquidMesh);

    // 4. Magnetic Impeller / Stirrer Bar at Bottom
    const impeller = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.06, 0.12), chromeMat);
    impeller.position.y = -1.18;
    chamberGroup.add(impeller);

    // 5. Rising O2 Micro-Bubbles
    const bubbles = [];
    const bubbleGeo = new THREE.SphereGeometry(0.026, 10, 10);
    const bubbleMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.45,
    });
    for (let i = 0; i < 20; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      const angle = Math.random() * Math.PI * 2;
      const rad = Math.random() * 0.85;
      b.position.set(Math.cos(angle) * rad, -1.05 + Math.random() * 1.9, Math.sin(angle) * rad);
      b.userData = { speed: (isRunning ? 0.008 : 0.0035) + Math.random() * 0.005 };
      chamberGroup.add(b);
      bubbles.push(b);
    }

    // 6. Placed Cells & Multiplying Organoid Cluster
    const hasCell = loadedIds.some((id) => id.startsWith('cell_'));
    const hasComponent = loadedIds.some((id) => id.startsWith('comp_'));
    const cellMeshes = [];

    if (hasCell || isGrown) {
      const cellCount = isGrown
        ? 28
        : Math.max(4, 4 + Math.floor((growth / 100) * 22) + (hasComponent ? 3 : 0));
      const cellGeo = new THREE.SphereGeometry(isGrown ? 0.13 : 0.1, 20, 20);
      const cellMat = new THREE.MeshPhysicalMaterial({
        color: recipe.cellColor,
        emissive: recipe.cellColor,
        emissiveIntensity: isGrown ? 0.48 : 0.25,
        roughness: 0.22,
        clearcoat: 0.65,
      });

      for (let i = 0; i < cellCount; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / cellCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const clusterRadius = isGrown ? 0.38 : 0.5 - (growth / 100) * 0.14;
        const c = new THREE.Mesh(cellGeo, cellMat);
        c.position.set(
          Math.sin(phi) * Math.cos(theta) * clusterRadius * (0.65 + (i % 3) * 0.16),
          Math.cos(phi) * clusterRadius * 0.85 - 0.12,
          Math.sin(phi) * Math.sin(theta) * clusterRadius * (0.65 + (i % 2) * 0.16)
        );
        c.userData = { baseY: c.position.y, phase: i * 0.5 };
        chamberGroup.add(c);
        cellMeshes.push(c);
      }
    }

    if (hasComponent) {
      const partGeo = new THREE.OctahedronGeometry(0.04, 0);
      const partMat = new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        emissive: recipe.liquidColor,
        emissiveIntensity: 0.5,
      });
      for (let i = 0; i < 14; i++) {
        const p = new THREE.Mesh(partGeo, partMat);
        const a = (i / 14) * Math.PI * 2;
        p.position.set(Math.cos(a) * 0.72, -0.55 + (i % 5) * 0.26, Math.sin(a) * 0.72);
        p.userData = { baseY: p.position.y, phase: i * 0.7 };
        chamberGroup.add(p);
        cellMeshes.push(p);
      }
    }

    let isDragging = false;
    let prevX = 0;
    const onDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      chamberGroup.rotation.y += (e.clientX - prevX) * 0.01;
      prevX = e.clientX;
    };
    const onUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (!isDragging) chamberGroup.rotation.y += isRunning ? 0.005 : 0.0025;
      impeller.rotation.y += isRunning ? 0.14 : 0.03;

      bubbles.forEach((b) => {
        b.position.y += b.userData.speed;
        if (b.position.y > 0.88) b.position.y = -1.05;
      });
      cellMeshes.forEach((c) => {
        c.position.y = c.userData.baseY + Math.sin(t * 2.1 + c.userData.phase) * 0.03;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      disposeHierarchy(scene);
      renderer.dispose();
    };
  }, [recipe.id, recipe.liquidColor, recipe.cellColor, loadedIds, growth, isGrown, isRunning]);

  const handleDeployToAnatomy = () => {
    const anatomyId = synthesizeFullOrganChain(recipe.id);
    if (fabricateOrganForAnatomy) fabricateOrganForAnatomy(anatomyId);
    cosmicAudio.playSynthesisChord();
    useStore
      .getState()
      .showMessage(`🧬 Cultured ${recipe.outcomeLabel}! Available in Anatomy Lab.`);
  };

  const displayPercent = isGrown ? 100 : growth;

  return (
    <div className="col-span-12 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
      {/* 3D Liquid Incubator Canvas */}
      <div ref={mountRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Bottom Action Bar: + Insert Components, Start Button, and Growth Progress Bar */}
      <div className="px-4 py-3 bg-[#090d16]/95 border-t border-white/10 flex flex-col gap-2">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[9.5px] font-mono font-bold text-cyan-300 uppercase shrink-0">
            {recipe.chamberName}
          </span>
          <div className="flex-1 h-2 rounded-full bg-[#060a12] border border-white/10 overflow-hidden">
            <div
              className="h-full transition-all duration-200 rounded-full"
              style={{
                width: `${displayPercent}%`,
                backgroundColor: isGrown ? '#10b981' : '#22d3ee',
              }}
            />
          </div>
          <span className="text-[10px] font-mono font-black text-white shrink-0 w-10 text-right">
            {displayPercent}%
          </span>
          <span className="text-[9.5px] font-mono text-slate-400 hidden md:inline shrink-0">
            {getGrowthPhaseLabel(displayPercent, isRunning)}
          </span>
        </div>

        {/* + Insert Components & Start / Deploy Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {recipe.components.map((comp) => {
              const isAdded = loadedIds.includes(comp.id);
              const builtPrior = isSourceReady(comp);
              return (
                <button
                  key={comp.id}
                  onClick={() => handleInsertComponent(comp.id)}
                  title={`Insert ${comp.label} (from ${comp.sourceStop})`}
                  className={`px-2.5 py-1 rounded-xl border font-mono text-[9.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isAdded
                      ? 'bg-emerald-500/20 border-emerald-400/70 text-emerald-200'
                      : 'bg-[#080d18] border-white/15 hover:border-cyan-400/60 text-slate-200'
                  }`}
                >
                  <span className="px-1 rounded bg-white/10 text-[9px]">
                    {isAdded ? '✓' : '+'}
                  </span>
                  <span>{comp.label}</span>
                  <span className="text-[8px] text-slate-400">
                    ({builtPrior ? `${comp.sourceStop} ✓` : comp.sourceStop})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {!isGrown && (
              <button
                onClick={handleStartIncubation}
                disabled={!allComponentsLoaded || isRunning}
                className={`px-4 py-1.5 rounded-xl font-mono font-black text-[10px] uppercase tracking-wider transition-all ${
                  isRunning
                    ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 cursor-wait'
                    : allComponentsLoaded
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer'
                    : 'bg-[#0f172a] border border-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isRunning ? '⏳ Growing...' : '▶ Start Incubation'}
              </button>
            )}

            {isGrown && (
              <>
                <button
                  onClick={handleDeployToAnatomy}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-[10px] uppercase cursor-pointer"
                >
                  ✓ Send {recipe.outcomeLabel.split(' ')[0]} to Anatomy
                </button>
                {onOpenAnatomy && (
                  <button
                    onClick={onOpenAnatomy}
                    className="px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-cyan-400/50 text-cyan-200 font-mono font-bold text-[10px] uppercase cursor-pointer"
                  >
                    🦴 Anatomy →
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganIncubatorChamber;
