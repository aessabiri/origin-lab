import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { cosmicAudio } from '../../../utils/cosmicAudioBus';
import { useStore } from '../../../store';
import {
  createChamberComposer,
  setupChamberStudioLighting,
  buildSophisticatedChamberChassis,
  buildRealisticElementCluster,
  buildVascularSproutTree,
  createSingleElement3DModel,
  disposeHierarchy,
} from '../../utils/chamberVisualEffects';
import ChamberTelemetryScreen from './ChamberTelemetryScreen';
import ReactorControlPanel, {
  RotaryDial,
  BreakerButton,
  AnalogMeter,
} from './ReactorControlPanel';

const ORGAN_TYPE_MAP = {
  osteoblast: 'bone',
  osteoid: 'bone',
  cardiomyocyte: 'heart',
  endothelial: 'heart',
  myofibril: 'muscular_system',
  hepatocyte: 'lungs',
  visceral: 'lungs',
  endothelial_cell: 'heart',
  motor_neuron: 'brain',
  neural: 'brain',
};

const PART_SYMBOL_MAP = {
  nucleus: 'NUC',
  ribosome: '80S',
  mitochondrion: 'MITO',
  plasma_membrane: 'MEM',
  collagen_i: 'Col-I',
  actin_myosin: 'ACT',
  hemoglobin: 'Hb',
  ion_channel: 'NaV',
  atp_synthase: 'ATP',
  phospholipid_bilayer: 'MYL',
  osteoblast: 'OST',
  cardiomyocyte: 'CM',
  hepatocyte: 'HEP',
  endothelial_cell: 'END',
  motor_neuron: 'NEU',
};

/**
 * Builds a realistic 3D tissue scaffold construct for Stop 4 (Tissues).
 */
function buildTissueConstruct(tissue, progressRatio) {
  const group = new THREE.Group();
  const color = tissue.color || '#38bdf8';
  const cellMat = new THREE.MeshPhysicalMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.22 + progressRatio * 0.28,
    roughness: 0.3,
    clearcoat: 0.5,
    transparent: progressRatio < 0.85,
    opacity: 0.45 + progressRatio * 0.55,
  });

  if (tissue.id === 'osteoid') {
    // Concentric Haversian Osteons + Hydroxyapatite mineral nodes
    for (let ring = 1; ring <= 4; ring++) {
      const r = ring * 0.14;
      const torus = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 10, 32), cellMat);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = (ring - 2.5) * 0.04;
      group.add(torus);
    }
    const canal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.65, 12),
      new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 0.6 })
    );
    group.add(canal);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const ost = createSingleElement3DModel('osteoblast', color, { scale: 0.72 });
      ost.position.set(Math.cos(a) * 0.36, ((i % 3) - 1) * 0.14, Math.sin(a) * 0.36);
      group.add(ost);
    }
  } else if (tissue.id === 'myofibril') {
    // Aligned striated muscle fascicle bundles + Z-discs
    for (let i = -2; i <= 2; i++) {
      const fiber = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.62, 8, 16), cellMat);
      fiber.rotation.z = Math.PI / 2;
      fiber.position.set(0, i * 0.11, (i % 2) * 0.08);
      group.add(fiber);
    }
    const zMat = new THREE.MeshStandardMaterial({ color: '#fda4af', emissive: '#f43f5e', emissiveIntensity: 0.55 });
    for (let z = -2; z <= 2; z++) {
      const disc = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.01, 6, 24), zMat);
      disc.rotation.y = Math.PI / 2;
      disc.position.x = z * 0.14;
      group.add(disc);
    }
  } else if (tissue.id === 'neural') {
    // Cortical neuron network + myelinated axon tracts
    const positions = [
      [0, 0.15, 0],
      [-0.28, -0.06, 0.18],
      [0.28, -0.04, -0.18],
      [-0.18, 0.28, -0.2],
      [0.22, -0.24, 0.2],
    ];
    positions.forEach(([x, y, z]) => {
      const n = createSingleElement3DModel('motor_neuron', color, { scale: 0.85 });
      n.position.set(x, y, z);
      group.add(n);
    });
  } else {
    // Visceral alveolar sacs / Endothelial myocardial cluster
    const count = tissue.id === 'visceral' ? 8 : 6;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const node = createSingleElement3DModel(
        tissue.id === 'visceral' ? 'hepatocyte' : 'cardiomyocyte',
        color,
        { scale: 0.88 }
      );
      node.position.set(Math.cos(a) * 0.28, Math.sin(a * 2) * 0.16, Math.sin(a) * 0.28);
      group.add(node);
    }
  }

  return group;
}

const StageBioreactorStudio = ({
  mode = 'cell', // 'cell' | 'tissue'
  item,
  isBuilt = false,
  demiurgeSurvivalMode = false,
  foldedProteins = [],
  assembledOrganelles = [],
  differentiatedCells = [],
  onComplete,
  onNextStage,
  nextStageLabel,
}) => {
  const mountRef = useRef(null);
  const tissueGroupRef = useRef(null);
  const telemetryRef = useRef({
    isActive: false,
    o2Level: 21,
    morphogenLevel: 65,
    liquidColor: item?.color || '#38bdf8',
  });

  const [loadedByItem, setLoadedByItem] = useState({});
  const [growthByItem, setGrowthByItem] = useState({});
  const [runningByItem, setRunningByItem] = useState({});
  const [elapsedByItem, setElapsedByItem] = useState({});
  const [regrowingByItem, setRegrowingByItem] = useState({});

  const [morphogenDial, setMorphogenDial] = useState(68);
  const [o2Dial, setO2Dial] = useState(21);
  const [tempC, setTempC] = useState(37.0);
  const [phLevel, setPhLevel] = useState(7.4);

  const loadedIds = loadedByItem[item.id] || [];
  const effectivelyBuilt = isBuilt && !regrowingByItem[item.id];
  const growth = effectivelyBuilt ? 100 : growthByItem[item.id] || 0;
  const isRunning = Boolean(runningByItem[item.id]) && !effectivelyBuilt;
  const elapsedSec = elapsedByItem[item.id] || 0;

  const components = useMemo(
    () =>
      (item.parts || []).map((p) => ({
        id: p.id,
        refId: p.refId,
        refLevel: p.refLevel,
        symbol: PART_SYMBOL_MAP[p.refId] || p.refId.slice(0, 4).toUpperCase(),
        name: p.label,
        color: item.color || '#38bdf8',
      })),
    [item]
  );

  const allComponentsLoaded = components.every((c) => loadedIds.includes(c.id));

  const isTempOptimal = tempC >= 35.5 && tempC <= 38.5;
  const isPhOptimal = phLevel >= 7.2 && phLevel <= 7.6;
  const isO2Optimal = o2Dial >= 16 && o2Dial <= 26;
  const isMorphOptimal = morphogenDial >= 45 && morphogenDial <= 90;
  const optimalCount = [isTempOptimal, isPhOptimal, isO2Optimal, isMorphOptimal].filter(Boolean).length;
  const purityGrade = optimalCount === 4 ? 'S' : optimalCount >= 2 ? 'A' : 'B';

  const checkPrereq = (comp) => {
    if (!demiurgeSurvivalMode) return true;
    if (comp.refLevel === 1) return foldedProteins.includes(comp.refId);
    if (comp.refLevel === 2) return assembledOrganelles.includes(comp.refId);
    if (comp.refLevel === 3) return differentiatedCells.includes(comp.refId);
    return true;
  };

  useEffect(() => {
    telemetryRef.current = {
      isActive: isRunning || !isBuilt,
      o2Level: o2Dial,
      morphogenLevel: morphogenDial,
      liquidColor: item.color || '#38bdf8',
    };
  }, [isRunning, isBuilt, o2Dial, morphogenDial, item.color]);

  // Bioreactor synthesis tick
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setElapsedByItem((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 0.25 }));
      const thermalRate = tempC > 40.5 || tempC < 32 ? 0.2 : isTempOptimal ? 1.0 : 0.65;
      const phRate = phLevel < 6.9 || phLevel > 7.8 ? 0.25 : isPhOptimal ? 1.0 : 0.7;
      const o2Rate = o2Dial < 10 ? 0.3 : isO2Optimal ? 1.0 : 0.75;
      const morphRate = 0.45 + (morphogenDial / 100) * 0.85;
      const delta = 3.2 * thermalRate * phRate * o2Rate * morphRate;

      setGrowthByItem((prev) => {
        const next = Math.min(100, (prev[item.id] || 0) + delta);
        if (next >= 100) {
          setRunningByItem((r) => ({ ...r, [item.id]: false }));
          setRegrowingByItem((g) => ({ ...g, [item.id]: false }));
          onComplete?.(item.id);
        }
        return { ...prev, [item.id]: next };
      });
    }, 250);
    return () => clearInterval(timer);
  }, [isRunning, item.id, tempC, phLevel, o2Dial, morphogenDial, isTempOptimal, isPhOptimal, isO2Optimal, onComplete]);

  // 1. Persistent 60 FPS WebGL Bioreactor Chassis
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.localClippingEnabled = false;
    } catch {
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 390;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envCleanup = setupChamberStudioLighting(renderer, scene);
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.15);

    const composer = createChamberComposer(renderer, scene, camera, width, height);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.2;
    controls.maxDistance = 6.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;

    const { tissueRoot, updateEffects } = buildSophisticatedChamberChassis(
      scene,
      item.color || '#38bdf8'
    );
    tissueGroupRef.current = tissueRoot;

    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r || r.width < 10 || r.height < 10) return;
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
      composer.setSize(r.width, r.height);
    });
    ro.observe(container);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      const tel = telemetryRef.current;

      updateEffects(t, tel);
      tissueRoot.position.y = Math.sin(t * 1.4) * 0.035;
      tissueRoot.rotation.y = t * 0.16;

      controls.update();
      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      composer.dispose();
      envCleanup();
      disposeHierarchy(scene);
      renderer.dispose();
    };
  }, [item.id, item.color]);

  // 2. Dynamic 3D Cell / Tissue Construct inside the Bioreactor
  useEffect(() => {
    const group = tissueGroupRef.current;
    if (!group) return;
    while (group.children.length > 0) {
      const child = group.children.pop();
      disposeHierarchy(child);
    }

    const prog = Math.max(0, Math.min(1, growth / 100));
    const loadedRefs = components
      .filter((c) => loadedIds.includes(c.id))
      .map((c) => c.refId);

    if (prog < 1 && loadedRefs.length > 0) {
      const cluster = buildRealisticElementCluster(loadedRefs, item.color || '#38bdf8', prog);
      cluster.scale.setScalar(0.85 * (1 - prog * 0.45));
      group.add(cluster);
    }

    if (prog > 0.05 || isBuilt) {
      if (mode === 'cell') {
        const cellMesh = createSingleElement3DModel(item.id, item.color || '#38bdf8', {
          scale: 2.6,
          isDividing: isRunning && prog > 0.65 && prog < 0.98,
        });
        cellMesh.scale.setScalar(0.4 + prog * 0.65);
        group.add(cellMesh);
      } else {
        const tissueMesh = buildTissueConstruct(item, prog);
        tissueMesh.scale.setScalar(0.55 + prog * 0.55);
        group.add(tissueMesh);

        if (prog > 0.35) {
          const vessels = buildVascularSproutTree(Math.min(1, (prog - 0.35) / 0.65), '#f43f5e');
          group.add(vessels);
        }
      }
    }
  }, [mode, item, loadedIds, growth, isBuilt, isRunning, components]);

  const handleInfuseComponent = (compId) => {
    const comp = components.find((c) => c.id === compId);
    if (comp && !checkPrereq(comp)) {
      useStore.getState().showMessage(`🔒 Craft ${comp.refId} in an earlier Stop first (Survival Mode)!`);
      return;
    }
    setLoadedByItem((prev) => {
      const cur = prev[item.id] || [];
      if (cur.includes(compId)) return prev;
      return { ...prev, [item.id]: [...cur, compId] };
    });
    cosmicAudio.playPulse(540);
  };

  const handlePrimeAll = () => {
    const blocked = components.find((c) => !checkPrereq(c));
    if (blocked) {
      useStore.getState().showMessage(`🔒 Craft ${blocked.refId} in an earlier Stop first (Survival Mode)!`);
      return;
    }
    setLoadedByItem((prev) => ({
      ...prev,
      [item.id]: components.map((c) => c.id),
    }));
    cosmicAudio.playSynthesisChord();
  };

  const elementLevels = useMemo(() => {
    const map = {};
    components.forEach((c) => {
      map[c.id] = effectivelyBuilt || loadedIds.includes(c.id) ? 100 : 0;
    });
    return map;
  }, [components, loadedIds, effectivelyBuilt]);

  const cardElements = useMemo(
    () =>
      components.map((c) => ({
        id: c.id,
        iconId: c.refId,
        symbol: c.symbol,
        name: c.name,
        color: c.color,
      })),
    [components]
  );

  const annunciators = [
    { label: 'THERMAL', state: isTempOptimal ? 'ok' : 'warn' },
    { label: 'pH BUFFER', state: isPhOptimal ? 'ok' : 'warn' },
    { label: 'SUBSTRATES', state: effectivelyBuilt || allComponentsLoaded ? 'ok' : 'warn' },
    { label: 'REACTOR', state: isRunning ? 'ok' : effectivelyBuilt ? 'ok' : 'idle' },
  ];

  const organType = ORGAN_TYPE_MAP[item.id] || 'heart';

  return (
    <div className="col-span-12 flex-1 flex flex-col gap-2.5 min-h-0">
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-[340px]">
        {/* 3D Bioreactor Viewport */}
        <div className="col-span-12 lg:col-span-8 bg-[#050912] rounded-2xl border border-white/10 relative overflow-hidden min-h-[340px]">
          <div ref={mountRef} className="w-full h-full min-h-[340px]" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/65 border border-white/10 pointer-events-none">
            <div className="text-[8.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              {mode === 'cell'
                ? `STOP 3 // ${item.germLayer || 'LINEAGE'} • ${item.morphogenSignal || ''}`
                : `STOP 4 // ${item.formula || 'BIOPRINTED SCAFFOLD'}`}
            </div>
            <div className="text-xs font-black text-white">{item.icon} {item.name}</div>
          </div>
          <div className="absolute bottom-3 left-3 max-w-md px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[9.5px] text-slate-300 pointer-events-none">
            {mode === 'cell' ? item.role : item.ecmArchitecture}
          </div>
        </div>

        {/* Right Telemetry & Confocal Panel */}
        <div className="col-span-12 lg:col-span-4 min-h-[340px]">
          <ChamberTelemetryScreen
            title={item.name}
            organType={organType}
            accentColor={item.color}
            isRunning={isRunning}
            isComplete={effectivelyBuilt}
            progress={growth}
            elapsedSec={elapsedSec}
            o2Level={o2Dial}
            morphogenLevel={morphogenDial}
            tempC={tempC}
            phLevel={phLevel}
            purityGrade={purityGrade}
            activeTags={components.map((c) => c.symbol)}
            steps={[
              {
                id: 'substrates',
                label: '01 Substrates',
                progress: effectivelyBuilt ? 100 : (loadedIds.length / Math.max(1, components.length)) * 100,
                active: !effectivelyBuilt && !allComponentsLoaded,
                done: effectivelyBuilt || allComponentsLoaded,
                color: '#38bdf8',
              },
              {
                id: 'induce',
                label: mode === 'cell' ? '02 Morphogen' : '02 Crosslink',
                progress: effectivelyBuilt ? 100 : Math.min(100, (growth / 45) * 100),
                active: isRunning && growth < 45,
                done: effectivelyBuilt || growth >= 45,
                color: '#f43f5e',
              },
              {
                id: 'commit',
                label: mode === 'cell' ? '03 Lineage' : '03 Perfusion',
                progress: effectivelyBuilt ? 100 : Math.max(0, Math.min(100, ((growth - 45) / 35) * 100)),
                active: isRunning && growth >= 45 && growth < 80,
                done: effectivelyBuilt || growth >= 80,
                color: '#22d3ee',
              },
              {
                id: 'mature',
                label: mode === 'cell' ? '04 Mature Cell' : '04 Bioprinted',
                progress: effectivelyBuilt ? 100 : Math.max(0, Math.min(100, ((growth - 80) / 20) * 100)),
                active: isRunning && growth >= 80 && growth < 100,
                done: effectivelyBuilt,
                color: '#10b981',
              },
            ]}
          />
        </div>
      </div>

      {/* Bottom 3-Bay Reactor Control Console */}
      <ReactorControlPanel
        deckTitle={
          mode === 'cell'
            ? `CELL DIFFERENTIATION BIOREACTOR // ${item.name.toUpperCase()}`
            : `TISSUE BIOPRINTING BIOREACTOR // ${item.name.toUpperCase()}`
        }
        annunciators={annunciators}
        elements={cardElements}
        elementLevels={elementLevels}
        onInfuseElement={handleInfuseComponent}
        onPrimeAll={handlePrimeAll}
        dials={
          <>
            <RotaryDial
              label={mode === 'cell' ? 'Morphogens' : 'Crosslink'}
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
          </>
        }
        rightAction={
          <>
            {effectivelyBuilt && (
              <button
                type="button"
                onClick={() => {
                  setRegrowingByItem((p) => ({ ...p, [item.id]: true }));
                  setGrowthByItem((p) => ({ ...p, [item.id]: 0 }));
                  setLoadedByItem((p) => ({ ...p, [item.id]: [] }));
                  setRunningByItem((p) => ({ ...p, [item.id]: false }));
                  setElapsedByItem((p) => ({ ...p, [item.id]: 0 }));
                }}
                className="px-2.5 py-1 rounded bg-[#0f172a] hover:bg-slate-800 border border-slate-600 text-slate-300 font-mono font-bold text-[9px] uppercase cursor-pointer"
              >
                ↻ Regrow
              </button>
            )}
            {onNextStage && (
              <button
                type="button"
                onClick={onNextStage}
                className="px-2.5 py-1 rounded bg-[#0f172a] border border-cyan-400/50 text-cyan-200 font-mono font-bold text-[9px] uppercase cursor-pointer"
              >
                {nextStageLabel || 'Next Stop →'}
              </button>
            )}
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <BreakerButton
            label={
              effectivelyBuilt
                ? 'Matured 100%'
                : isRunning
                ? `Growing ${Math.round(growth)}%`
                : mode === 'cell'
                ? '▶ Differentiate'
                : '▶ Bioprint Tissue'
            }
            sublabel={allComponentsLoaded ? 'Substrates Ready' : 'Click Elements'}
            active={isRunning || effectivelyBuilt}
            disabled={!allComponentsLoaded || effectivelyBuilt}
            ledColor="#10b981"
            onClick={() => {
              setRunningByItem((p) => ({ ...p, [item.id]: true }));
              cosmicAudio.playPulse(660);
            }}
          />
          <div className="hidden xl:flex items-center gap-1.5">
            <AnalogMeter label="Growth" value={growth} accent="#10b981" />
          </div>
        </div>
      </ReactorControlPanel>
    </div>
  );
};

export default StageBioreactorStudio;
