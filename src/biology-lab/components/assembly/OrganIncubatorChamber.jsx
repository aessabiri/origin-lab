import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../../store';
import { useAnatomyStore } from '../../../anatomy-lab/store';
import { useStore } from '../../../store';
import { cosmicAudio } from '../../../utils/cosmicAudioBus';
import { loadZAnatomyOrganModel, applyOrganSubPartMaterials } from '../../utils/zAnatomyOrganLoader';
import { create3DOrganForSystem } from '../../utils/organelle3DFactory';
import ReactorControlPanel, {
  RotaryDial,
  BreakerButton,
  AnalogMeter,
} from './ReactorControlPanel';

export const MAJOR_ORGAN_CHAMBERS = [
  {
    id: 'heart',
    icon: '🫀',
    label: 'Heart Chamber',
    zAnatomySystemId: 'cardiovascular_system',
    anatomyTissueId: 'endothelial',
    chamberName: 'CARDIAC 4-CHAMBER BIOREACTOR',
    liquidColor: '#ef4444',
    cellColor: '#fb7185',
    components: [
      { id: 'cell_cardiomyocyte', symbol: 'CM', name: 'Cardiomyocytes', color: '#fb7185' },
      { id: 'comp_vegf_o2', symbol: 'VEGF', name: 'VEGF-A + O₂', color: '#ef4444' },
      { id: 'comp_atp_actin', symbol: 'ATP', name: 'Actin-Myosin', color: '#f59e0b' },
    ],
    outcomeLabel: '4-Chamber Heart',
  },
  {
    id: 'liver',
    icon: '🟤',
    label: 'Liver Chamber',
    zAnatomySystemId: 'visceral_system',
    anatomyTissueId: 'visceral',
    chamberName: 'HEPATIC LOBULE BIOREACTOR',
    liquidColor: '#d97706',
    cellColor: '#f59e0b',
    components: [
      { id: 'cell_hepatocyte', symbol: 'HEP', name: 'Hepatocytes', color: '#f59e0b' },
      { id: 'comp_egf_hgf', symbol: 'HGF', name: 'HGF + Bile Salts', color: '#10b981' },
      { id: 'comp_surfactant', symbol: 'Col4', name: 'Sinusoid ECM', color: '#a855f7' },
    ],
    outcomeLabel: 'Hepatic Liver Lobes',
  },
  {
    id: 'lungs',
    icon: '🫁',
    label: 'Lungs Chamber',
    zAnatomySystemId: 'visceral_system',
    anatomyTissueId: 'visceral',
    chamberName: 'ALVEOLAR PULMONARY BIOREACTOR',
    liquidColor: '#10b981',
    cellColor: '#34d399',
    components: [
      { id: 'cell_pneumocyte', symbol: 'PNM', name: 'Pneumocytes I/II', color: '#34d399' },
      { id: 'comp_fgf10', symbol: 'FGF10', name: 'FGF-10 Branching', color: '#22d3ee' },
      { id: 'comp_surfactant', symbol: 'DPPC', name: 'Surfactant Lipid', color: '#a855f7' },
    ],
    outcomeLabel: 'Lungs & Bronchial Tree',
  },
  {
    id: 'intestines',
    icon: '🧬',
    label: 'Intestines Chamber',
    zAnatomySystemId: 'visceral_system',
    anatomyTissueId: 'visceral',
    chamberName: 'ENTERIC VILLI BIOREACTOR',
    liquidColor: '#ec4899',
    cellColor: '#f472b6',
    components: [
      { id: 'cell_enterocyte', symbol: 'ENT', name: 'Enterocytes + Lgr5', color: '#f472b6' },
      { id: 'comp_wnt_rspo', symbol: 'Wnt', name: 'Wnt + R-Spondin', color: '#38bdf8' },
      { id: 'comp_mucin', symbol: 'MUC2', name: 'Mucin + Smooth ECM', color: '#f59e0b' },
    ],
    outcomeLabel: 'GI Tract & Intestines',
  },
  {
    id: 'kidneys',
    icon: '🫘',
    label: 'Kidneys Chamber',
    zAnatomySystemId: 'visceral_system',
    anatomyTissueId: 'visceral',
    chamberName: 'NEPHRON RENAL BIOREACTOR',
    liquidColor: '#8b5cf6',
    cellColor: '#a78bfa',
    components: [
      { id: 'cell_podocyte', symbol: 'POD', name: 'Podocytes + Tubules', color: '#a78bfa' },
      { id: 'comp_gdnf', symbol: 'GDNF', name: 'GDNF + Ret Signal', color: '#22d3ee' },
      { id: 'comp_gbm', symbol: 'Col4', name: 'Glomerular ECM', color: '#10b981' },
    ],
    outcomeLabel: 'Renal Kidneys',
  },
];

export const INCUBATOR_RECIPES = {
  cardiovascular_system: {
    id: 'cardiovascular_system',
    anatomyTissueId: 'endothelial',
    chamberName: 'CARDIOGENIC BIOREACTOR',
    liquidColor: '#ef4444',
    cellColor: '#fb7185',
    components: [
      { id: 'cell_cardiomyocyte', symbol: 'CM', name: 'Cardiomyocytes', color: '#fb7185' },
      { id: 'comp_vegf_o2', symbol: 'VEGF', name: 'VEGF-A + O₂', color: '#ef4444' },
      { id: 'comp_atp_actin', symbol: 'ATP', name: 'Actin-Myosin', color: '#f59e0b' },
    ],
    outcomeLabel: '4-Chamber Heart & Vascular Tree',
  },
  visceral_system: {
    id: 'visceral_system',
    anatomyTissueId: 'visceral',
    chamberName: 'VISCERAL & DERMAL BIOREACTOR',
    liquidColor: '#10b981',
    cellColor: '#34d399',
    components: [
      { id: 'cell_hepatocyte', symbol: 'HEP', name: 'Epithelial & Hepatic', color: '#34d399' },
      { id: 'comp_egf_hgf', symbol: 'EGF', name: 'EGF + HGF', color: '#22d3ee' },
      { id: 'comp_surfactant', symbol: 'Col4', name: 'Collagen IV + Lipid', color: '#a855f7' },
    ],
    outcomeLabel: 'Visceral Organs & Dermal Tissue',
  },
  muscular_system: {
    id: 'muscular_system',
    anatomyTissueId: 'myofibril',
    chamberName: 'MYOGENIC TENSION BIOREACTOR',
    liquidColor: '#f43f5e',
    cellColor: '#fda4af',
    components: [
      { id: 'cell_myocyte', symbol: 'MYO', name: 'Striated Myocytes', color: '#fda4af' },
      { id: 'comp_igf1_glucose', symbol: 'IGF1', name: 'IGF-1 + Glucose', color: '#f59e0b' },
      { id: 'comp_tendon_ecm', symbol: 'ACT', name: 'Tendon Collagen', color: '#38bdf8' },
    ],
    outcomeLabel: 'Skeletal Muscle & Ligaments',
  },
  nervous_system: {
    id: 'nervous_system',
    anatomyTissueId: 'neural',
    chamberName: 'NEUROTROPHIC BIOREACTOR',
    liquidColor: '#f59e0b',
    cellColor: '#fbbf24',
    components: [
      { id: 'cell_neuron', symbol: 'NEU', name: 'Cortical Neurons', color: '#fbbf24' },
      { id: 'comp_ngf_bdnf', symbol: 'BDNF', name: 'NGF + BDNF', color: '#a855f7' },
      { id: 'comp_myelin_ions', symbol: 'Na/K', name: 'Myelin + Channels', color: '#22d3ee' },
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
  const tissueGroupRef = useRef(null);
  const liquidMatRef = useRef(null);

  const baseRecipe = INCUBATOR_RECIPES[systemId] || INCUBATOR_RECIPES.cardiovascular_system;
  const [selectedMajorOrganId, setSelectedMajorOrganId] = useState('heart');
  const activeMajorChamber =
    systemId === 'cardiovascular_system'
      ? MAJOR_ORGAN_CHAMBERS.find((c) => c.id === selectedMajorOrganId) || MAJOR_ORGAN_CHAMBERS[0]
      : null;

  const recipe = activeMajorChamber
    ? {
        ...activeMajorChamber,
        id: `major_${activeMajorChamber.id}`,
        zAnatomyId: activeMajorChamber.zAnatomySystemId,
      }
    : { ...baseRecipe, zAnatomyId: baseRecipe.id };

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
        const speed = o2Dial >= 14 ? Math.max(4, Math.round((morphogenDial / 100) * 10)) : 0;
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

  // 1. PERSISTENT 60 FPS WebGL Bioreactor Chassis (created ONCE on mount)
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
    const height = container.clientHeight || 400;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 5.1);
    camera.lookAt(0, -0.05, 0);

    scene.add(new THREE.AmbientLight(0xf1f5f9, 1.05));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const chamberGroup = new THREE.Group();
    chamberGroup.scale.setScalar(0.75);
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
          opacity: 0.14,
          roughness: 0.06,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      )
    );

    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: '#ef4444',
      emissive: '#ef4444',
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    liquidMatRef.current = liquidMat;
    const liquidCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.06, 2.15, 48), liquidMat);
    liquidCyl.position.y = -0.14;
    chamberGroup.add(liquidCyl);

    const tissueRoot = new THREE.Group();
    chamberGroup.add(tissueRoot);
    tissueGroupRef.current = tissueRoot;

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
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) chamberGroup.rotation.y += 0.0032;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      tissueGroupRef.current = null;
      liquidMatRef.current = null;
      disposeHierarchy(scene);
      renderer.dispose();
    };
  }, []);

  // 2. LIGHTWEIGHT TISSUE / Z-ANATOMY ORGAN UPDATER (quantized — zero flicker!)
  const qGrowth = Math.floor(growth / 15);
  useEffect(() => {
    const tissueRoot = tissueGroupRef.current;
    if (!tissueRoot) return;

    if (liquidMatRef.current) {
      liquidMatRef.current.color.set(recipe.liquidColor);
      liquidMatRef.current.emissive.set(recipe.liquidColor);
    }

    let isCancelled = false;
    while (tissueRoot.children.length > 0) {
      const child = tissueRoot.children[0];
      tissueRoot.remove(child);
      disposeHierarchy(child);
    }

    if (isGrown) {
      const zId = recipe.zAnatomyId || recipe.id;
      const fallback = create3DOrganForSystem(zId);
      fallback.scale.setScalar(0.88);
      applyOrganSubPartMaterials(fallback, zId, [], true, null);
      tissueRoot.add(fallback);

      loadZAnatomyOrganModel(zId).then((glb) => {
        if (isCancelled || !glb || !tissueGroupRef.current) return;
        glb.scale.setScalar(0.88);
        applyOrganSubPartMaterials(glb, zId, [], true, null);
        tissueRoot.remove(fallback);
        disposeHierarchy(fallback);
        tissueRoot.add(glb);
      });
    } else if (loadedIds.length > 0) {
      const cellCount = Math.max(4, 4 + Math.floor((growth / 100) * 22));
      const cellGeo = new THREE.SphereGeometry(0.1, 16, 16);
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
        tissueRoot.add(c);
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [recipe.id, recipe.liquidColor, recipe.cellColor, loadedIds.length, qGrowth, isGrown]);

  const handleDeployToAnatomy = () => {
    const zId = recipe.zAnatomyId || recipe.id;
    const anatomyId = synthesizeFullOrganChain(zId);
    if (fabricateOrganForAnatomy) fabricateOrganForAnatomy(anatomyId);
    cosmicAudio.playSynthesisChord();
    useStore.getState().showMessage(`🧬 ${recipe.outcomeLabel} deployed to Anatomy Lab!`);
  };

  const elementLevels = Object.fromEntries(
    recipe.components.map((c) => [c.id, loadedIds.includes(c.id) ? 100 : 0])
  );

  const annunciators = [
    { label: 'HYPOXIA', state: o2Dial < 14 ? 'alarm' : 'off' },
    { label: 'SUBSTRATES', state: allComponentsLoaded ? 'ok' : 'warn' },
    { label: 'REACTOR ON', state: isRunning ? 'ok' : 'off' },
    { label: 'Z-ANATOMY', state: isGrown ? 'ok' : 'off' },
  ];

  return (
    <div className="col-span-12 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
      {activeMajorChamber && (
        <div className="px-3 py-1.5 bg-[#090e18] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[8.5px] font-mono font-bold text-slate-400 uppercase pr-1 shrink-0">
            Organ Chambers:
          </span>
          {MAJOR_ORGAN_CHAMBERS.map((ch) => {
            const isActive = ch.id === selectedMajorOrganId;
            const chDone = (growthProgressBySystem[`major_${ch.id}`] || 0) >= 100;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setSelectedMajorOrganId(ch.id)}
                className={`px-2.5 py-1 rounded-lg border font-mono text-[9.5px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : chDone
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                    : 'bg-[#070b14] border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span>{ch.icon}</span>
                <span>{ch.label}</span>
                {chDone && <span className="text-emerald-400">✓</span>}
              </button>
            );
          })}
        </div>
      )}
      <div ref={mountRef} className="flex-1 w-full min-h-0 cursor-grab active:cursor-grabbing" />

      <ReactorControlPanel
        deckTitle={recipe.chamberName}
        annunciators={annunciators}
        elements={recipe.components}
        elementLevels={elementLevels}
        onInfuseElement={handleInsertComponent}
        onPrimeAll={() => {
          setLoadedBySystem((prev) => ({
            ...prev,
            [recipe.id]: recipe.components.map((c) => c.id),
          }));
          cosmicAudio.playSynthesisChord();
        }}
        rightAction={
          <>
            {isGrown && (
              <button
                type="button"
                onClick={handleDeployToAnatomy}
                className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-[9px] uppercase cursor-pointer"
              >
                ✓ Deploy to Anatomy
              </button>
            )}
            {onOpenAnatomy && (
              <button
                type="button"
                onClick={onOpenAnatomy}
                className="px-2.5 py-1 rounded bg-[#0f172a] border border-cyan-400/50 text-cyan-200 font-mono font-bold text-[9px] uppercase cursor-pointer"
              >
                🦴 Anatomy →
              </button>
            )}
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <RotaryDial
              label="Morphogens"
              value={morphogenDial}
              min={0}
              max={100}
              optimalMin={45}
              optimalMax={90}
              unit="%"
              accent="#38bdf8"
              onChange={setMorphogenDial}
            />
            <RotaryDial
              label="O₂ Perfusion"
              value={o2Dial}
              min={0}
              max={40}
              optimalMin={16}
              optimalMax={26}
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
              sublabel={allComponentsLoaded ? 'Substrates Ready' : 'Insert Substrates'}
              active={isRunning || isGrown}
              disabled={!allComponentsLoaded || isGrown}
              ledColor="#10b981"
              onClick={() => {
                setRunningBySystem((p) => ({ ...p, [recipe.id]: true }));
                cosmicAudio.playPulse(660);
              }}
            />
          </div>

          <div className="hidden xl:flex items-center gap-1.5">
            <AnalogMeter label="Growth" value={isGrown ? 100 : growth} accent="#10b981" />
          </div>
        </div>
      </ReactorControlPanel>
    </div>
  );
};

export default OrganIncubatorChamber;
