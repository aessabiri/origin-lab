import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../../store';
import { useAnatomyStore } from '../../../anatomy-lab/store';
import { useStore } from '../../../store';
import { cosmicAudio } from '../../../utils/cosmicAudioBus';
import { loadZAnatomyOrganModel, applyOrganSubPartMaterials } from '../../utils/zAnatomyOrganLoader';
import { create3DOrganForSystem } from '../../utils/organelle3DFactory';
import ReactorControlPanel, { RotaryDial, BreakerButton } from './ReactorControlPanel';

export const INCUBATOR_RECIPES = {
  cardiovascular_system: {
    id: 'cardiovascular_system',
    anatomyTissueId: 'endothelial',
    chamberName: 'Pulsatile Cardiogenic Bioreactor',
    liquidColor: '#ef4444',
    cellColor: '#fb7185',
    components: [
      { id: 'cell_cardiomyocyte', symbol: 'CM', name: 'Cardiomyocytes + Endothelium', category: 'Cell', color: '#fb7185', role: 'Autorhythmic contractile heart muscle & vessel lining' },
      { id: 'comp_vegf_o2', symbol: 'VEGF', name: 'VEGF-A + Hemoglobin O₂', category: 'Morphogen', color: '#ef4444', role: 'Triggers coronary angiogenesis & oxygenates myocardium' },
      { id: 'comp_atp_actin', symbol: 'ATP', name: 'Actin-Myosin + Endothelial ECM', category: 'ECM', color: '#f59e0b', role: 'Powers 72 BPM sarcomere contraction' },
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
      { id: 'cell_hepatocyte', symbol: 'HEP', name: 'Hepatocytes & Epithelial Cells', category: 'Cell', color: '#34d399', role: 'Builds alveolar sacs, hepatic lobules & skin layers' },
      { id: 'comp_egf_hgf', symbol: 'EGF', name: 'EGF + HGF Growth Factors', category: 'Morphogen', color: '#22d3ee', role: 'Drives branching morphogenesis & epithelial repair' },
      { id: 'comp_surfactant', symbol: 'Col4', name: 'Phospholipid + Collagen IV', category: 'ECM', color: '#a855f7', role: 'Forms basement membrane & alveolar surfactant' },
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
      { id: 'cell_myocyte', symbol: 'MYO', name: 'Striated Myocytes & Satellite Cells', category: 'Cell', color: '#fda4af', role: 'Fuses into multinucleated contractile muscle fibers' },
      { id: 'comp_igf1_glucose', symbol: 'IGF1', name: 'IGF-1 + Glucose Energy', category: 'Morphogen', color: '#f59e0b', role: 'Stimulates sarcomere hypertrophy & ATP supply' },
      { id: 'comp_tendon_ecm', symbol: 'ACT', name: 'Actin-Myosin + Tendon Collagen', category: 'ECM', color: '#38bdf8', role: 'Anchors muscle bellies to bone via ligaments' },
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
      { id: 'cell_neuron', symbol: 'NEU', name: 'Motor & Cortical Neurons', category: 'Cell', color: '#fbbf24', role: 'Extends axons & forms synaptic connectomes' },
      { id: 'comp_ngf_bdnf', symbol: 'BDNF', name: 'NGF + BDNF Neurotrophins', category: 'Morphogen', color: '#a855f7', role: 'Guides axonal growth cones to target tissues' },
      { id: 'comp_myelin_ions', symbol: 'Na/K', name: 'Na⁺/K⁺ Channels + Myelin', category: 'ECM', color: '#22d3ee', role: 'Enables 120 m/s saltatory action potentials' },
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

const OrganIncubatorChamber = ({ systemId = 'cardiovascular_system', onOpenAnatomy }) => {
  const mountRef = useRef(null);
  const recipe = INCUBATOR_RECIPES[systemId] || INCUBATOR_RECIPES.cardiovascular_system;

  const [loadedBySystem, setLoadedBySystem] = useState({});
  const [growthProgressBySystem, setGrowthProgressBySystem] = useState({});
  const [runningBySystem, setRunningBySystem] = useState({});
  const [o2Dial, setO2Dial] = useState(21);
  const [morphogenDial, setMorphogenDial] = useState(70);

  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);
  const fabricateOrganForAnatomy = useAnatomyStore((s) => s.fabricateOrganForAnatomy);
  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};

  const loadedIds = loadedBySystem[recipe.id] || [];
  const allComponentsLoaded = recipe.components.every((c) => loadedIds.includes(c.id));
  const growth = growthProgressBySystem[recipe.id] || 0;
  const isRunning = Boolean(runningBySystem[recipe.id]);
  const isGrown = growth >= 100 || Boolean(bioprintedTissues[recipe.anatomyTissueId]);

  const handleInsertComponent = (compId) => {
    setLoadedBySystem((prev) => {
      const current = prev[recipe.id] || [];
      if (current.includes(compId)) return prev;
      return { ...prev, [recipe.id]: [...current, compId] };
    });
    cosmicAudio.playPulse(580);
  };

  useEffect(() => {
    if (!isRunning || !allComponentsLoaded || isGrown) return;
    const timer = setInterval(() => {
      setGrowthProgressBySystem((prev) => {
        const cur = prev[recipe.id] || 0;
        const speed = o2Dial >= 15 ? Math.max(4, Math.round((morphogenDial / 100) * 10)) : 0;
        const next = Math.min(100, cur + speed);
        if (next === 100) {
          setRunningBySystem((r) => ({ ...r, [recipe.id]: false }));
          cosmicAudio.playSynthesisChord();
        }
        return { ...prev, [recipe.id]: next };
      });
    }, 220);
    return () => clearInterval(timer);
  }, [isRunning, allComponentsLoaded, isGrown, recipe.id, o2Dial, morphogenDial]);

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
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 5.2);
    camera.lookAt(0, -0.05, 0);

    scene.add(new THREE.AmbientLight(0xf1f5f9, 1.05));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const liquidGlow = new THREE.PointLight(recipe.liquidColor, 1.8, 10);
    liquidGlow.position.set(0, 0.1, 1.5);
    scene.add(liquidGlow);

    const chamberGroup = new THREE.Group();
    chamberGroup.scale.setScalar(0.76);
    scene.add(chamberGroup);

    const titaniumMat = new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.88, roughness: 0.22 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.92, roughness: 0.16 });
    const baseCap = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.46, 0.2, 48), titaniumMat);
    baseCap.position.y = -1.42;
    chamberGroup.add(baseCap);
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.32, 0.18, 48), titaniumMat);
    topCap.position.y = 1.42;
    chamberGroup.add(topCap);

    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.7, 12), chromeMat);
      rod.position.set(Math.cos(a) * 1.24, 0, Math.sin(a) * 1.24);
      chamberGroup.add(rod);
    }

    chamberGroup.add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(1.12, 1.12, 2.54, 48, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: '#e2e8f0',
          transparent: true,
          opacity: 0.15,
          roughness: 0.06,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      )
    );

    const liquidCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(1.06, 1.06, 2.15, 48),
      new THREE.MeshPhysicalMaterial({
        color: recipe.liquidColor,
        emissive: recipe.liquidColor,
        emissiveIntensity: isRunning ? 0.24 : 0.12,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      })
    );
    liquidCyl.position.y = -0.14;
    chamberGroup.add(liquidCyl);

    let isDisposed = false;
    const cellMeshes = [];

    if (isGrown) {
      // Materialize the Hyper-Realistic Z-Anatomy 3D Organ inside the Chamber
      const fallback = create3DOrganForSystem(recipe.id);
      fallback.scale.setScalar(0.88);
      applyOrganSubPartMaterials(fallback, recipe.id, [], true, null);
      chamberGroup.add(fallback);

      loadZAnatomyOrganModel(recipe.id).then((glb) => {
        if (isDisposed || !glb) return;
        glb.scale.setScalar(0.88);
        applyOrganSubPartMaterials(glb, recipe.id, [], true, null);
        chamberGroup.remove(fallback);
        disposeHierarchy(fallback);
        chamberGroup.add(glb);
      });
    } else if (loadedIds.length > 0) {
      const cellCount = Math.max(4, 4 + Math.floor((growth / 100) * 22));
      const cellGeo = new THREE.SphereGeometry(0.1, 18, 18);
      const cellMat = new THREE.MeshPhysicalMaterial({
        color: recipe.cellColor,
        emissive: recipe.cellColor,
        emissiveIntensity: 0.3,
        roughness: 0.22,
      });
      for (let i = 0; i < cellCount; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / cellCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = 0.45;
        const c = new THREE.Mesh(cellGeo, cellMat);
        c.position.set(
          Math.sin(phi) * Math.cos(theta) * r * 0.75,
          Math.cos(phi) * r * 0.85 - 0.1,
          Math.sin(phi) * Math.sin(theta) * r * 0.75
        );
        c.userData = { baseY: c.position.y, phase: i * 0.5 };
        chamberGroup.add(c);
        cellMeshes.push(c);
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
      cellMeshes.forEach((c) => {
        c.position.y = c.userData.baseY + Math.sin(t * 2 + c.userData.phase) * 0.03;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isDisposed = true;
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
    useStore.getState().showMessage(`🧬 ${recipe.outcomeLabel} deployed to Anatomy Lab!`);
  };

  const elementLevels = Object.fromEntries(
    recipe.components.map((c) => [c.id, loadedIds.includes(c.id) ? 100 : 0])
  );

  return (
    <div className="col-span-12 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
      <div ref={mountRef} className="flex-1 w-full min-h-0 cursor-grab active:cursor-grabbing" />

      <ReactorControlPanel
        deckTitle={recipe.chamberName.toUpperCase()}
        statusText={
          isGrown
            ? `MATURED (${recipe.outcomeLabel})`
            : isRunning
            ? `GROWING ${growth}%`
            : 'STANDBY'
        }
        statusColor={isGrown ? '#10b981' : isRunning ? '#22d3ee' : '#f59e0b'}
        elements={recipe.components}
        elementLevels={elementLevels}
        onInfuseElement={handleInsertComponent}
        rightAction={
          <>
            {isGrown && (
              <button
                type="button"
                onClick={handleDeployToAnatomy}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-[9.5px] uppercase cursor-pointer"
              >
                ✓ Deploy to Anatomy
              </button>
            )}
            {onOpenAnatomy && (
              <button
                type="button"
                onClick={onOpenAnatomy}
                className="px-2.5 py-1 rounded-lg bg-[#0f172a] border border-cyan-400/50 text-cyan-200 font-mono font-bold text-[9.5px] uppercase cursor-pointer"
              >
                🦴 Anatomy →
              </button>
            )}
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <RotaryDial
              label="Morphogens"
              value={morphogenDial}
              min={0}
              max={100}
              unit="%"
              accent="#38bdf8"
              onChange={setMorphogenDial}
            />
            <RotaryDial
              label="O₂ Perfusion"
              value={o2Dial}
              min={0}
              max={40}
              unit="%"
              accent="#22d3ee"
              onChange={setO2Dial}
            />
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-1.5 min-w-[260px]">
            {recipe.components.map((comp) => (
              <BreakerButton
                key={comp.id}
                label={comp.symbol}
                sublabel={comp.name.split(' ')[0]}
                active={loadedIds.includes(comp.id)}
                ledColor={comp.color}
                onClick={() => handleInsertComponent(comp.id)}
              />
            ))}
            <BreakerButton
              label={isGrown ? 'Matured 100%' : isRunning ? `Growing ${growth}%` : '▶ Start Reactor'}
              sublabel={allComponentsLoaded ? 'All substrates loaded' : 'Load substrates first'}
              active={isRunning || isGrown}
              disabled={!allComponentsLoaded || isGrown}
              ledColor="#10b981"
              onClick={() => {
                setRunningBySystem((p) => ({ ...p, [recipe.id]: true }));
                cosmicAudio.playPulse(660);
              }}
            />
          </div>
        </div>
      </ReactorControlPanel>
    </div>
  );
};

export default OrganIncubatorChamber;
