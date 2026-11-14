import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../../store';
import { useAnatomyStore } from '../../../anatomy-lab/store';
import { useStore } from '../../../store';
import { cosmicAudio } from '../../../utils/cosmicAudioBus';
import {
  loadZAnatomyOrganModel,
  loadFocusedSingleOrgan,
} from '../../utils/zAnatomyOrganLoader';
import {
  createChamberComposer,
  setupChamberStudioLighting,
  buildSophisticatedChamberChassis,
  buildRealisticElementCluster,
  buildVascularSproutTree,
  applyMorphogeneticStageToOrgan,
} from '../../utils/chamberVisualEffects';
import ChamberTelemetryScreen from './ChamberTelemetryScreen';
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
    singleOrganKey: 'skin',
    anatomyTissueId: 'visceral',
    chamberName: 'INTEGUMENTARY SKIN & DERMAL BIOREACTOR',
    liquidColor: '#10b981',
    cellColor: '#34d399',
    components: [
      { id: 'cell_hepatocyte', symbol: 'KER', name: 'Keratinocytes & Epithelial', color: '#f59e0b' },
      { id: 'comp_egf_hgf', symbol: 'EGF', name: 'EGF + Melanin', color: '#22d3ee' },
      { id: 'comp_surfactant', symbol: 'COL4', name: 'Collagen I/IV + Adipose', color: '#a855f7' },
    ],
    outcomeLabel: 'Stratified Skin & Dermal Tissue',
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
    singleOrganKey: 'brain',
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
    if (obj.geometry && !obj.userData?.isCachedGeometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
  });
};

const OrganIncubatorChamber = ({ systemId = 'cardiovascular_system', onOpenAnatomy }) => {
  const mountRef = useRef(null);
  const tissueGroupRef = useRef(null);
  const effectsUpdaterRef = useRef(null);
  const loadedOrganRef = useRef({ key: null, glb: null });
  const telemetryRef = useRef({ isActive: false, o2Level: 21, morphogenLevel: 70, liquidColor: '#ef4444', isGrown: false, organKey: 'heart' });

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
        singleOrganKey: activeMajorChamber.id,
        zAnatomyId: activeMajorChamber.zAnatomySystemId,
      }
    : { ...baseRecipe, singleOrganKey: baseRecipe.singleOrganKey || null, zAnatomyId: baseRecipe.id };

  const [loadedBySystem, setLoadedBySystem] = useState({});
  const [growthProgressBySystem, setGrowthProgressBySystem] = useState(() => {
    try {
      const saved = localStorage.getItem('originlab_organ_progress_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [runningBySystem, setRunningBySystem] = useState({});
  const [elapsedBySystem, setElapsedBySystem] = useState({});
  const [o2Dial, setO2Dial] = useState(21);
  const [morphogenDial, setMorphogenDial] = useState(70);
  const [tempC, setTempC] = useState(37.0);
  const [phLevel, setPhLevel] = useState(7.4);

  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);
  const fabricateOrganForAnatomy = useAnatomyStore((s) => s.fabricateOrganForAnatomy);

  const loadedIds = loadedBySystem[recipe.id] || [];
  const allComponentsLoaded = recipe.components.every((c) => loadedIds.includes(c.id));
  const growth = growthProgressBySystem[recipe.id] || 0;
  const isRunning = Boolean(runningBySystem[recipe.id]);
  const isGrown = growth >= 100;
  const elapsedSec = elapsedBySystem[recipe.id] || 0;

  const isTempOptimal = tempC >= 35.5 && tempC <= 38.5;
  const isPhOptimal = phLevel >= 7.2 && phLevel <= 7.6;
  const isO2Optimal = o2Dial >= 16 && o2Dial <= 26;
  const isMorphOptimal = morphogenDial >= 45 && morphogenDial <= 90;
  const optimalCount = [isTempOptimal, isPhOptimal, isO2Optimal, isMorphOptimal].filter(Boolean).length;
  const purityGrade = optimalCount === 4 ? 'S' : optimalCount >= 2 ? 'A' : 'B';

  useEffect(() => {
    try {
      localStorage.setItem('originlab_organ_progress_v1', JSON.stringify(growthProgressBySystem));
    } catch {
      // ignore storage quota
    }
  }, [growthProgressBySystem]);

  useEffect(() => {
    const handleGlobalReset = () => {
      setGrowthProgressBySystem({});
      setLoadedBySystem({});
      setRunningBySystem({});
      setElapsedBySystem({});
    };
    window.addEventListener('originlab-reset', handleGlobalReset);
    return () => window.removeEventListener('originlab-reset', handleGlobalReset);
  }, []);

  useEffect(() => {
    telemetryRef.current = {
      isActive: isRunning,
      o2Level: o2Dial,
      morphogenLevel: morphogenDial,
      liquidColor: recipe.liquidColor,
      isGrown,
      organKey: recipe.singleOrganKey || recipe.id,
    };
  }, [isRunning, o2Dial, morphogenDial, recipe.liquidColor, isGrown, recipe.singleOrganKey, recipe.id]);

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
      setElapsedBySystem((prev) => ({ ...prev, [recipe.id]: (prev[recipe.id] || 0) + 0.25 }));

      setGrowthProgressBySystem((prev) => {
        const cur = prev[recipe.id] || 0;
        const thermalPenalty = tempC > 40.5 || tempC < 32 ? 0.15 : isTempOptimal ? 1 : 0.65;
        const phPenalty = phLevel < 6.9 || phLevel > 7.8 ? 0.2 : isPhOptimal ? 1 : 0.7;
        const baseStep = o2Dial >= 14 ? 0.32 + (morphogenDial / 100) * 0.62 : 0;
        const step = baseStep * thermalPenalty * phPenalty;
        const next = Math.min(100, Number((cur + step).toFixed(2)));

        if (next >= 100) {
          setRunningBySystem((r) => ({ ...r, [recipe.id]: false }));
          cosmicAudio.playSynthesisChord();
        }
        return { ...prev, [recipe.id]: next };
      });
    }, 250);
    return () => clearInterval(timer);
  }, [isRunning, allComponentsLoaded, isGrown, recipe.id, o2Dial, morphogenDial, tempC, phLevel, isTempOptimal, isPhOptimal]);

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

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 390;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 4.75);
    camera.lookAt(0, -0.05, 0);

    const disposeEnv = setupChamberStudioLighting(renderer, scene);

    const { chamberGroup, tissueRoot, updateEffects } = buildSophisticatedChamberChassis(
      scene,
      recipe.liquidColor
    );
    tissueGroupRef.current = tissueRoot;
    effectsUpdaterRef.current = updateEffects;

    const composer = createChamberComposer(renderer, scene, camera, width, height);

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
      const t = performance.now() * 0.001;
      const tel = telemetryRef.current;

      if (!isDragging) chamberGroup.rotation.y += 0.0032;
      updateEffects(t, tel);

      // Subtle physiological animation on matured organs
      if (tel.isGrown) {
        if (tel.organKey === 'heart') {
          const beat = 1 + Math.pow(Math.max(0, Math.sin(t * 4.2)), 6) * 0.045;
          tissueRoot.scale.setScalar(beat);
        } else if (tel.organKey === 'lungs') {
          const breath = 1 + Math.sin(t * 1.6) * 0.035;
          tissueRoot.scale.set(breath, 1 + (breath - 1) * 0.6, breath);
        } else {
          tissueRoot.scale.setScalar(1);
        }
      } else {
        tissueRoot.scale.setScalar(1);
      }

      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      tissueGroupRef.current = null;
      effectsUpdaterRef.current = null;
      loadedOrganRef.current = { key: null, glb: null };
      composer.dispose();
      disposeEnv();
      disposeHierarchy(scene);
      renderer.dispose();
    };
  }, []);

  // 2. MULTI-STAGE MORPHOGENETIC TISSUE -> Z-ANATOMY ORGAN UPDATER (quantized 5% steps)
  const qGrowth = Math.floor(growth / 5);
  useEffect(() => {
    const tissueRoot = tissueGroupRef.current;
    if (!tissueRoot) return;

    let isCancelled = false;
    const zId = recipe.zAnatomyId || recipe.id;
    const organCacheKey = `${recipe.id}::${recipe.singleOrganKey || zId}`;
    const prog = isGrown ? 1 : Math.max(0, Math.min(1, growth / 100));

    // Remove only non-GLB transient cluster/vascular children (or previous organ if switching)
    const shouldShowGlb = isGrown || prog >= 0.45;
    const existingGlb = loadedOrganRef.current.key === organCacheKey ? loadedOrganRef.current.glb : null;

    Array.from(tissueRoot.children).forEach((child) => {
      if (shouldShowGlb && child === existingGlb) return;
      tissueRoot.remove(child);
      disposeHierarchy(child);
    });
    if (loadedOrganRef.current.key !== organCacheKey) {
      loadedOrganRef.current = { key: null, glb: null };
    }

    // Stage 1 & 2: Realistic 3D biological elements + sprouting capillary network
    if (!isGrown && loadedIds.length > 0 && prog < 0.85) {
      const cluster = buildRealisticElementCluster(loadedIds, {
        progress: prog,
        cellColor: recipe.cellColor,
        condenseRatio: Math.min(1, prog * 1.4),
      });
      tissueRoot.add(cluster);

      if (prog >= 0.2) {
        const vasc = buildVascularSproutTree(Math.min(1, (prog - 0.15) / 0.65));
        tissueRoot.add(vasc);
      }
    }

    // Stage 3 & 4: Emerging Z-Anatomy bio-scaffold -> Solidified Physiological Organ
    if (shouldShowGlb) {
      if (existingGlb) {
        applyMorphogeneticStageToOrgan(existingGlb, {
          progress: prog,
          isMatured: isGrown,
          zAnatomyId: zId,
          scaffoldColor: recipe.cellColor,
        });
      } else {
        const loadTarget = recipe.singleOrganKey
          ? loadFocusedSingleOrgan(recipe.singleOrganKey)
          : loadZAnatomyOrganModel(zId);

        loadTarget.then((glb) => {
          if (isCancelled || !glb || !tissueGroupRef.current) return;
          loadedOrganRef.current = { key: organCacheKey, glb };
          applyMorphogeneticStageToOrgan(glb, {
            progress: prog,
            isMatured: isGrown,
            zAnatomyId: zId,
            scaffoldColor: recipe.cellColor,
          });
          tissueRoot.add(glb);
        });
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [recipe.id, recipe.liquidColor, recipe.cellColor, recipe.singleOrganKey, recipe.zAnatomyId, loadedIds.length, qGrowth, isGrown]);

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
    { label: 'THERMAL', state: tempC > 40.5 || tempC < 32 ? 'alarm' : isTempOptimal ? 'ok' : 'warn' },
    { label: 'pH BUFFER', state: phLevel < 6.9 || phLevel > 7.8 ? 'alarm' : isPhOptimal ? 'ok' : 'warn' },
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
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <div ref={mountRef} className="lg:col-span-8 h-full min-h-[260px] cursor-grab active:cursor-grabbing relative" />
        <div className="lg:col-span-4 h-full min-h-0 overflow-hidden">
          <ChamberTelemetryScreen
            title={`${recipe.outcomeLabel}`}
            organType={recipe.singleOrganKey || recipe.id}
            accentColor={recipe.cellColor}
            isRunning={isRunning}
            isComplete={isGrown}
            progress={isGrown ? 100 : growth}
            elapsedSec={elapsedSec}
            o2Level={o2Dial}
            morphogenLevel={morphogenDial}
            tempC={tempC}
            phLevel={phLevel}
            purityGrade={purityGrade}
            activeTags={recipe.components.map((c) => c.symbol)}
            steps={[
              {
                id: 'substrates',
                label: '01 Substrates',
                progress: (loadedIds.length / recipe.components.length) * 100,
                active: !allComponentsLoaded,
                done: allComponentsLoaded,
                color: '#38bdf8',
              },
              {
                id: 'condense',
                label: '02 Angiogenesis',
                progress: isGrown ? 100 : Math.min(100, (growth / 45) * 100),
                active: isRunning && growth < 45,
                done: isGrown || growth >= 45,
                color: '#f43f5e',
              },
              {
                id: 'scaffold',
                label: '03 Bio-Scaffold',
                progress: isGrown ? 100 : Math.max(0, Math.min(100, ((growth - 45) / 35) * 100)),
                active: isRunning && growth >= 45 && growth < 80,
                done: isGrown || growth >= 80,
                color: '#22d3ee',
              },
              {
                id: 'mature',
                label: '04 Maturation',
                progress: isGrown ? 100 : Math.max(0, Math.min(100, ((growth - 80) / 20) * 100)),
                active: isRunning && growth >= 80 && growth < 100,
                done: isGrown,
                color: '#10b981',
              },
            ]}
          />
        </div>
      </div>

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
              <>
                <button
                  type="button"
                  onClick={() => {
                    setGrowthProgressBySystem((prev) => ({ ...prev, [recipe.id]: 0 }));
                    setLoadedBySystem((prev) => ({ ...prev, [recipe.id]: [] }));
                    setRunningBySystem((prev) => ({ ...prev, [recipe.id]: false }));
                    setElapsedBySystem((prev) => ({ ...prev, [recipe.id]: 0 }));
                  }}
                  className="px-2.5 py-1 rounded bg-[#0f172a] hover:bg-slate-800 border border-slate-600 text-slate-300 font-mono font-bold text-[9px] uppercase cursor-pointer"
                >
                  ↻ Regrow
                </button>
                <button
                  type="button"
                  onClick={handleDeployToAnatomy}
                  className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-[9px] uppercase cursor-pointer"
                >
                  ✓ Deploy to Anatomy
                </button>
              </>
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
            <RotaryDial
              label="Temp"
              value={tempC}
              min={30}
              max={43}
              step={0.5}
              optimalMin={35.5}
              optimalMax={38.5}
              unit="°C"
              accent="#f59e0b"
              onChange={setTempC}
            />
            <RotaryDial
              label="pH Buffer"
              value={phLevel}
              min={6.5}
              max={8.0}
              step={0.1}
              optimalMin={7.2}
              optimalMax={7.6}
              unit=""
              accent="#10b981"
              onChange={setPhLevel}
            />
          </div>

          <BreakerButton
            label={isGrown ? 'Matured 100%' : isRunning ? `Growing ${Math.round(growth)}%` : '▶ Start Reactor'}
            sublabel={allComponentsLoaded ? 'Substrates Ready' : 'Click Elements'}
            active={isRunning || isGrown}
            disabled={!allComponentsLoaded || isGrown}
            ledColor="#10b981"
            onClick={() => {
              setRunningBySystem((p) => ({ ...p, [recipe.id]: true }));
              cosmicAudio.playPulse(660);
            }}
          />

          <div className="hidden xl:flex items-center gap-1.5">
            <AnalogMeter label="Growth" value={isGrown ? 100 : growth} accent="#10b981" />
          </div>
        </div>
      </ReactorControlPanel>
    </div>
  );
};

export default OrganIncubatorChamber;
