import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../../store';
import { useAnatomyStore } from '../../../anatomy-lab/store';
import { useStore } from '../../../store';
import { cosmicAudio } from '../../../utils/cosmicAudioBus';

export const INCUBATOR_RECIPES = {
  skeletal_system: {
    id: 'skeletal_system',
    anatomyTissueId: 'osteoid',
    chamberName: 'Osteogenic Bioreactor Vessel',
    liquidColor: '#0ea5e9',
    cellColor: '#38bdf8',
    components: [
      { id: 'cell_osteoblast', label: '🦴 Osteoblast Cells', kind: 'cell' },
      { id: 'comp_hydroxyapatite', label: '💎 Ca₁₀(PO₄)₆(OH)₂ Mineral', kind: 'nutrient' },
      { id: 'comp_collagen_i', label: '🧬 Type-I Collagen + BMP-2', kind: 'ecm' },
    ],
    outcomeLabel: '206-Bone Mineralized Osteoid',
  },
  cardiovascular_system: {
    id: 'cardiovascular_system',
    anatomyTissueId: 'endothelial',
    chamberName: 'Perfusion Cardiogenic Vessel',
    liquidColor: '#ef4444',
    cellColor: '#fb7185',
    components: [
      { id: 'cell_cardiomyocyte', label: '🫀 Cardiomyocytes + Endothelium', kind: 'cell' },
      { id: 'comp_vegf_o2', label: '🩸 VEGF-A + Hemoglobin O₂', kind: 'nutrient' },
      { id: 'comp_atp_actin', label: '⚡ ATP + Actin-Myosin Matrix', kind: 'ecm' },
    ],
    outcomeLabel: '4-Chamber Heart & Vascular Tree',
  },
  visceral_system: {
    id: 'visceral_system',
    anatomyTissueId: 'visceral',
    chamberName: 'Parenchymal & Dermal Vessel',
    liquidColor: '#10b981',
    cellColor: '#34d399',
    components: [
      { id: 'cell_hepatocyte', label: '🫁 Hepatocytes & Epithelial Cells', kind: 'cell' },
      { id: 'comp_egf_hgf', label: '🧪 EGF + HGF Growth Factors', kind: 'nutrient' },
      { id: 'comp_surfactant', label: '🫧 Phospholipid Surfactant + Collagen IV', kind: 'ecm' },
    ],
    outcomeLabel: 'Visceral Organs & Dermal Tissue',
  },
  muscular_system: {
    id: 'muscular_system',
    anatomyTissueId: 'myofibril',
    chamberName: 'Myogenic Tension Vessel',
    liquidColor: '#f43f5e',
    cellColor: '#fda4af',
    components: [
      { id: 'cell_myocyte', label: '💪 Striated Myocytes & Satellite Cells', kind: 'cell' },
      { id: 'comp_igf1_glucose', label: '⚡ IGF-1 + Glucose Energy', kind: 'nutrient' },
      { id: 'comp_tendon_ecm', label: '🧶 Actin-Myosin + Tendon Collagen', kind: 'ecm' },
    ],
    outcomeLabel: 'Skeletal Muscle & Ligaments',
  },
  nervous_system: {
    id: 'nervous_system',
    anatomyTissueId: 'neural',
    chamberName: 'Neurotrophic Bioreactor Vessel',
    liquidColor: '#f59e0b',
    cellColor: '#fbbf24',
    components: [
      { id: 'cell_neuron', label: '🧠 Motor & Cortical Neurons', kind: 'cell' },
      { id: 'comp_ngf_bdnf', label: '⚡ NGF + BDNF Neurotrophins', kind: 'nutrient' },
      { id: 'comp_myelin_ions', label: '🧬 Myelin Lipids + Na⁺/K⁺ Channels', kind: 'ecm' },
    ],
    outcomeLabel: 'Brain, Spinal Cord & Nerves',
  },
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

  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);
  const fabricateOrganForAnatomy = useAnatomyStore((s) => s.fabricateOrganForAnatomy);
  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};

  const loadedIds = loadedBySystem[recipe.id] || [];
  const allComponentsLoaded = recipe.components.every((c) => loadedIds.includes(c.id));
  const growth = growthProgressBySystem[recipe.id] || 0;
  const isGrown = growth >= 100 || Boolean(bioprintedTissues[recipe.anatomyTissueId]);

  const toggleComponent = (compId) => {
    setLoadedBySystem((prev) => {
      const current = prev[recipe.id] || [];
      const next = current.includes(compId) ? current : [...current, compId];
      return { ...prev, [recipe.id]: next };
    });
    cosmicAudio.playPulse(560);
  };

  // Auto-multiply cells in the liquid vessel once all required components are placed
  useEffect(() => {
    if (!allComponentsLoaded || isGrown) return;
    const timer = setInterval(() => {
      setGrowthProgressBySystem((prev) => {
        const cur = prev[recipe.id] || 0;
        const next = Math.min(100, cur + 10);
        if (next === 100) {
          cosmicAudio.playSynthesisChord();
        }
        return { ...prev, [recipe.id]: next };
      });
    }, 220);
    return () => clearInterval(timer);
  }, [allComponentsLoaded, isGrown, recipe.id]);

  // 3D Liquid Incubator Chamber Scene
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
    const height = container.clientHeight || 480;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 4.8);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xf1f5f9, 1.0));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const liquidGlow = new THREE.PointLight(recipe.liquidColor, 2.2, 12);
    liquidGlow.position.set(0, 0.2, 1.5);
    scene.add(liquidGlow);

    const chamberGroup = new THREE.Group();
    scene.add(chamberGroup);

    // 1. Titanium Base & Top Cap of the Incubator Vessel
    const capMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      metalness: 0.85,
      roughness: 0.25,
    });
    const bottomCap = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.35, 0.22, 48), capMat);
    bottomCap.position.y = -1.42;
    chamberGroup.add(bottomCap);

    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.28, 0.18, 48), capMat);
    topCap.position.y = 1.42;
    chamberGroup.add(topCap);

    // Glowing seal rings
    const ringMat = new THREE.MeshBasicMaterial({ color: recipe.liquidColor });
    const bottomRing = new THREE.Mesh(new THREE.TorusGeometry(1.26, 0.025, 16, 64), ringMat);
    bottomRing.rotation.x = Math.PI / 2;
    bottomRing.position.y = -1.3;
    chamberGroup.add(bottomRing);

    const topRing = bottomRing.clone();
    topRing.position.y = 1.3;
    chamberGroup.add(topRing);

    // 2. Outer Borosilicate Glass Cylinder
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#e2e8f0',
      transparent: true,
      opacity: 0.18,
      roughness: 0.08,
      metalness: 0.05,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glassCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.22, 1.22, 2.6, 48, 1, true),
      glassMat
    );
    chamberGroup.add(glassCylinder);

    // 3. Nutrient Liquid Medium inside Vessel
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: recipe.liquidColor,
      emissive: recipe.liquidColor,
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: 0.32,
      roughness: 0.12,
      depthWrite: false,
    });
    const liquidMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.16, 1.16, 2.25, 48),
      liquidMat
    );
    liquidMesh.position.y = -0.12;
    chamberGroup.add(liquidMesh);

    // 4. Rising Micro-Bubbles inside the Liquid
    const bubbles = [];
    const bubbleGeo = new THREE.SphereGeometry(0.032, 10, 10);
    const bubbleMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.45,
    });
    for (let i = 0; i < 24; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      const angle = Math.random() * Math.PI * 2;
      const rad = Math.random() * 0.95;
      b.position.set(Math.cos(angle) * rad, -1.1 + Math.random() * 2.0, Math.sin(angle) * rad);
      b.userData = { speed: 0.004 + Math.random() * 0.007 };
      chamberGroup.add(b);
      bubbles.push(b);
    }

    // 5. Placed Cells & Multiplying Organoid Cluster inside the Liquid
    const hasCell = loadedIds.some((id) => id.startsWith('cell_'));
    const hasNutrient = loadedIds.some((id) => id.startsWith('comp_'));
    const cellMeshes = [];

    if (hasCell || isGrown) {
      const cellCount = isGrown
        ? 26
        : Math.max(4, 4 + Math.floor((growth / 100) * 20) + (hasNutrient ? 4 : 0));
      const cellGeo = new THREE.SphereGeometry(isGrown ? 0.14 : 0.11, 20, 20);
      const cellMat = new THREE.MeshPhysicalMaterial({
        color: recipe.cellColor,
        emissive: recipe.cellColor,
        emissiveIntensity: isGrown ? 0.45 : 0.25,
        roughness: 0.25,
        clearcoat: 0.6,
      });

      for (let i = 0; i < cellCount; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / cellCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const clusterRadius = isGrown ? 0.42 : 0.55 - (growth / 100) * 0.15;
        const c = new THREE.Mesh(cellGeo, cellMat);
        c.position.set(
          Math.sin(phi) * Math.cos(theta) * clusterRadius * (0.6 + (i % 3) * 0.2),
          Math.cos(phi) * clusterRadius * 0.85 - 0.1,
          Math.sin(phi) * Math.sin(theta) * clusterRadius * (0.6 + (i % 2) * 0.2)
        );
        c.userData = { baseY: c.position.y, phase: i * 0.5 };
        chamberGroup.add(c);
        cellMeshes.push(c);
      }
    }

    // 6. Floating Nutrient/ECM Particles when added
    if (hasNutrient) {
      const partGeo = new THREE.OctahedronGeometry(0.045, 0);
      const partMat = new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        emissive: recipe.liquidColor,
        emissiveIntensity: 0.5,
      });
      for (let i = 0; i < 16; i++) {
        const p = new THREE.Mesh(partGeo, partMat);
        const a = (i / 16) * Math.PI * 2;
        p.position.set(Math.cos(a) * 0.78, -0.6 + (i % 5) * 0.3, Math.sin(a) * 0.78);
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
      if (!isDragging) chamberGroup.rotation.y += 0.003;

      bubbles.forEach((b) => {
        b.position.y += b.userData.speed;
        if (b.position.y > 0.95) b.position.y = -1.1;
      });
      cellMeshes.forEach((c) => {
        c.position.y = c.userData.baseY + Math.sin(t * 2.0 + c.userData.phase) * 0.035;
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
  }, [recipe.id, recipe.liquidColor, recipe.cellColor, loadedIds, growth, isGrown]);

  const handleDeployToAnatomy = () => {
    const anatomyId = synthesizeFullOrganChain(recipe.id);
    if (fabricateOrganForAnatomy) fabricateOrganForAnatomy(anatomyId);
    cosmicAudio.playSynthesisChord();
    useStore
      .getState()
      .showMessage(`🧬 Cultured ${recipe.outcomeLabel}! Available in Anatomy Lab.`);
  };

  return (
    <div className="col-span-12 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
      {/* 3D Liquid Incubator Canvas */}
      <div ref={mountRef} className="flex-1 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal Bottom Controls tailored to active Organ/Tissue tab */}
      <div className="px-4 py-2.5 bg-[#090d16]/95 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-mono text-slate-400 uppercase pr-1">
            {recipe.chamberName}:
          </span>
          {recipe.components.map((comp) => {
            const isAdded = loadedIds.includes(comp.id);
            return (
              <button
                key={comp.id}
                onClick={() => toggleComponent(comp.id)}
                className={`px-2.5 py-1 rounded-xl border font-mono text-[9.5px] font-bold cursor-pointer transition-all ${
                  isAdded
                    ? 'bg-emerald-500/20 border-emerald-400/70 text-emerald-200'
                    : 'bg-[#080d18] border-white/15 hover:border-cyan-400/60 text-slate-200'
                }`}
              >
                {isAdded ? '✓ ' : '+ '}
                {comp.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {allComponentsLoaded && !isGrown && (
            <span className="text-[10px] font-mono font-bold text-cyan-300 animate-pulse">
              🧫 Multiplying Cells... {growth}%
            </span>
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
  );
};

export default OrganIncubatorChamber;
