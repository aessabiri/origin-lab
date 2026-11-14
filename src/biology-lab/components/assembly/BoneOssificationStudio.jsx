import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  OSSIFICATION_ELEMENTS,
  createInitialOssificationState,
  stepOssification,
  getOssificationPhase,
  evaluateMechanicalStressTest,
} from '../../utils/ossificationEngine';
import {
  loadZAnatomyOrganModel,
  loadFocusedSingleOrgan,
} from '../../utils/zAnatomyOrganLoader';
import {
  createChamberComposer,
  buildSophisticatedChamberChassis,
  buildRealisticElementCluster,
  buildVascularSproutTree,
  applyMorphogeneticStageToOrgan,
} from '../../utils/chamberVisualEffects';
import ChamberTelemetryScreen from './ChamberTelemetryScreen';
import { useBioStore } from '../../store';
import { useAnatomyStore } from '../../../anatomy-lab/store';
import { useStore } from '../../../store';
import { cosmicAudio } from '../../../utils/cosmicAudioBus';
import ReactorControlPanel, {
  RotaryDial,
  BreakerButton,
  AnalogMeter,
} from './ReactorControlPanel';

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

const BoneOssificationStudio = ({ onOpenAnatomy }) => {
  const mountRef = useRef(null);
  const tissueGroupRef = useRef(null);
  const stressAnimRef = useRef({ activeUntil: 0, status: null });
  const telemetryRef = useRef({ isActive: true, o2Level: 21, morphogenLevel: 65, liquidColor: '#0ea5e9' });

  const [sim, setSim] = useState(() =>
    createInitialOssificationState('endochondral', { prefilled: true })
  );
  const [stressFeedback, setStressFeedback] = useState(null);
  const [showHyperRealAnatomy, setShowHyperRealAnatomy] = useState(false);
  const [massBoneCount, setMassBoneCount] = useState(0);
  const [massIncubating, setMassIncubating] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [tempC, setTempC] = useState(37.0);
  const [phLevel, setPhLevel] = useState(7.4);

  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);
  const fabricateOrganForAnatomy = useAnatomyStore((s) => s.fabricateOrganForAnatomy);

  const phase = useMemo(() => getOssificationPhase(sim), [sim]);
  const stressEval = useMemo(() => evaluateMechanicalStressTest(sim), [sim]);
  const isCertified = stressEval.status === 'CERTIFIED' && sim.marrowCavity >= 60;

  const isTempOptimal = tempC >= 35.5 && tempC <= 38.5;
  const isPhOptimal = phLevel >= 7.2 && phLevel <= 7.6;
  const isO2Optimal = sim.o2Perfusion >= 16 && sim.o2Perfusion <= 26;
  const isMorphOptimal = sim.morphogenBmpWnt >= 45 && sim.morphogenBmpWnt <= 90;
  const optimalCount = [isTempOptimal, isPhOptimal, isO2Optimal, isMorphOptimal].filter(Boolean).length;
  const purityGrade = optimalCount === 4 ? 'S' : optimalCount >= 2 ? 'A' : 'B';

  useEffect(() => {
    telemetryRef.current = {
      isActive: !isCertified,
      o2Level: sim.o2Perfusion,
      morphogenLevel: sim.morphogenBmpWnt,
      liquidColor: sim.mineralization > 50 ? '#38bdf8' : sim.vascularization > 20 ? '#f43f5e' : '#0ea5e9',
    };
  }, [isCertified, sim.o2Perfusion, sim.morphogenBmpWnt, sim.mineralization, sim.vascularization]);

  // Biological simulation tick (250ms, dt=0.07 for ~30-40s full observable ossification)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSec((e) => e + 0.25);
      const thermalPenalty = tempC > 40.5 || tempC < 32 ? 0.15 : isTempOptimal ? 1 : 0.65;
      const phPenalty = phLevel < 6.9 || phLevel > 7.8 ? 0.2 : isPhOptimal ? 1 : 0.7;
      setSim((prev) => stepOssification(prev, 0.07 * thermalPenalty * phPenalty));
    }, 250);
    return () => clearInterval(timer);
  }, [tempC, phLevel, isTempOptimal, isPhOptimal]);

  // Auto-reveal Hyper-Realistic Z-Anatomy model when certified
  useEffect(() => {
    if (isCertified && !showHyperRealAnatomy) {
      setShowHyperRealAnatomy(true);
      cosmicAudio.playSynthesisChord();
    }
  }, [isCertified, showHyperRealAnatomy]);

  // 1. PERSISTENT 60 FPS WebGL Bioreactor Chassis (created ONCE on mount)
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

    scene.add(new THREE.AmbientLight(0xf1f5f9, 1.15));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.3);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const liquidGlow = new THREE.PointLight('#0ea5e9', 1.8, 10);
    liquidGlow.position.set(0, 0.1, 1.5);
    scene.add(liquidGlow);

    const { chamberGroup, tissueRoot, updateEffects } = buildSophisticatedChamberChassis(
      scene,
      '#0ea5e9'
    );
    tissueGroupRef.current = tissueRoot;

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
      if (!isDragging) chamberGroup.rotation.y += 0.0035;
      updateEffects(t, telemetryRef.current);

      // Live Mechanical Stress Test Animation on the Bone
      const now = performance.now();
      if (stressAnimRef.current.activeUntil > now) {
        const s = stressAnimRef.current.status;
        if (s === 'BENDS_RUBBER') {
          tissueRoot.rotation.z = Math.sin(now * 0.025) * 0.22;
        } else if (s === 'BRITTLE_SHATTER' || s === 'COLLAPSE') {
          tissueRoot.position.x = Math.sin(now * 0.06) * 0.06;
        } else {
          tissueRoot.rotation.z = 0;
          tissueRoot.position.x = 0;
        }
      } else {
        tissueRoot.rotation.z = 0;
        tissueRoot.position.x = 0;
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
      composer.dispose();
      disposeHierarchy(scene);
      renderer.dispose();
    };
  }, []);

  // 2. MULTI-STAGE OSTEOGENESIS -> FEMUR / SKELETAL Z-ANATOMY UPDATER (quantized 10% steps)
  const qCond = Math.floor(sim.condensation / 10);
  const qCart = Math.floor(sim.cartilageTemplate / 10);
  const qVasc = Math.floor(sim.vascularization / 10);
  const qOst = Math.floor(sim.osteoidCollagen / 10);
  const qMin = Math.floor(sim.mineralization / 10);
  const qMar = Math.floor(sim.marrowCavity / 10);

  useEffect(() => {
    const tissueRoot = tissueGroupRef.current;
    if (!tissueRoot) return;

    let isCancelled = false;
    while (tissueRoot.children.length > 0) {
      const child = tissueRoot.children[0];
      tissueRoot.remove(child);
      disposeHierarchy(child);
    }

    const clipPlane = sim.crossSectionCut
      ? new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.02)
      : null;

    const overallProgress = Math.min(
      1,
      (sim.condensation * 0.15 +
        sim.cartilageTemplate * 0.18 +
        sim.vascularization * 0.17 +
        sim.osteoidCollagen * 0.2 +
        sim.mineralization * 0.2 +
        sim.marrowCavity * 0.1) /
        100
    );

    const activeElements = Object.entries(sim.elements)
      .filter(([, val]) => val > 5)
      .map(([k]) => k);

    if (!showHyperRealAnatomy && !isCertified) {
      const cluster = buildRealisticElementCluster(activeElements, {
        progress: overallProgress,
        cellColor: sim.runx2Active ? '#f59e0b' : '#38bdf8',
        condenseRatio: sim.condensation / 100,
      });
      tissueRoot.add(cluster);

      if (sim.vascularization > 10) {
        tissueRoot.add(buildVascularSproutTree(sim.vascularization / 100));
      }
    }

    const scaffoldReady =
      showHyperRealAnatomy ||
      isCertified ||
      (sim.pathway === 'endochondral' ? sim.cartilageTemplate >= 45 : sim.condensation >= 50);

    if (scaffoldReady) {
      const loadTarget =
        massBoneCount >= 206
          ? loadZAnatomyOrganModel('skeletal_system')
          : loadFocusedSingleOrgan('femur');

      loadTarget.then((glb) => {
        if (isCancelled || !glb || !tissueGroupRef.current) return;
        applyMorphogeneticStageToOrgan(glb, {
          progress: showHyperRealAnatomy || isCertified ? 1 : Math.max(0.45, overallProgress),
          isMatured: showHyperRealAnatomy || isCertified,
          zAnatomyId: 'skeletal_system',
          clipPlane,
          scaffoldColor: sim.mineralization > 35 ? '#f59e0b' : '#38bdf8',
        });
        tissueRoot.add(glb);
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [
    sim.pathway,
    sim.runx2Active,
    sim.vegfTriggered,
    sim.growthPlateFused,
    sim.crossSectionCut,
    showHyperRealAnatomy,
    massBoneCount,
    qCond,
    qCart,
    qVasc,
    qOst,
    qMin,
    qMar,
  ]);

  const handleDeployToAnatomy = () => {
    const anatomyId = synthesizeFullOrganChain('skeletal_system');
    if (fabricateOrganForAnatomy) fabricateOrganForAnatomy(anatomyId);
    cosmicAudio.playSynthesisChord();
    useStore
      .getState()
      .showMessage('🦴 Certified Living Bone deployed to 3D Anatomy Lab!');
  };

  const handleMassIncubate206 = () => {
    if (massIncubating || massBoneCount >= 206) return;
    setMassIncubating(true);
    let count = 1;
    const timer = setInterval(() => {
      count = Math.min(206, count + 17);
      setMassBoneCount(count);
      cosmicAudio.playPulse(440 + count * 1.5);
      if (count >= 206) {
        clearInterval(timer);
        setMassIncubating(false);
        handleDeployToAnatomy();
      }
    }, 90);
  };

  // Classic Nuclear Control-Room Annunciator Alarm Tiles
  const annunciators = [
    { label: 'HYPOXIA', state: sim.o2Perfusion < 12 ? 'alarm' : 'off' },
    { label: 'SOX9 CART', state: sim.sox9Active ? 'ok' : 'off' },
    { label: 'VEGF VASC', state: sim.vascularization >= 35 ? 'ok' : sim.vegfTriggered ? 'warn' : 'off' },
    { label: 'RUNX2 OST', state: sim.osteoidCollagen >= 35 ? 'ok' : sim.runx2Active ? 'warn' : 'off' },
    { label: 'Ca/PO4 MIN', state: sim.mineralization >= 75 ? 'ok' : sim.mineralization > 10 ? 'warn' : 'off' },
    { label: 'OCL MARROW', state: sim.marrowCavity >= 60 ? 'ok' : sim.osteoclastsActive ? 'warn' : 'off' },
    { label: 'STRESS PASS', state: isCertified ? 'ok' : 'off' },
  ];

  return (
    <div className="col-span-12 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
      {/* Compact Phase Banner */}
      <div className="px-4 py-1.5 bg-[#090e18]/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[8.5px] font-mono font-bold text-cyan-400 uppercase block">
            {phase.code}
          </span>
          <span className="text-xs font-black text-white">{phase.title}</span>
          <span className="text-[10px] text-slate-400 ml-2 hidden md:inline">{phase.detail}</span>
        </div>
        <span
          className="px-2 py-0.5 rounded bg-black/50 border font-mono text-[9px] font-bold"
          style={{ borderColor: stressEval.color, color: stressEval.color }}
        >
          {stressEval.label}
        </span>
      </div>

      {/* 3D Bioreactor Viewport + Live Telemetry Monitor */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        <div ref={mountRef} className="lg:col-span-8 h-full min-h-[260px] cursor-grab active:cursor-grabbing relative" />
        <div className="lg:col-span-4 h-full min-h-0 overflow-hidden">
          <ChamberTelemetryScreen
            title={massBoneCount >= 206 ? '206-BONE SKELETON' : 'FEMUR OSSIFICATION'}
            accentColor="#38bdf8"
            isRunning={!isCertified}
            isComplete={isCertified}
            progress={
              isCertified
                ? 100
                : Math.round(
                    sim.condensation * 0.15 +
                      sim.cartilageTemplate * 0.18 +
                      sim.vascularization * 0.17 +
                      sim.osteoidCollagen * 0.2 +
                      sim.mineralization * 0.2 +
                      sim.marrowCavity * 0.1
                  )
            }
            elapsedSec={elapsedSec}
            o2Level={sim.o2Perfusion}
            morphogenLevel={sim.morphogenBmpWnt}
            tempC={tempC}
            phLevel={phLevel}
            purityGrade={purityGrade}
            activeTags={['SOX9', 'VEGF', 'RUNX2', 'Ca·P', 'Col-I']}
            steps={[
              {
                id: 'condense',
                label: '01 Condensation',
                progress: sim.condensation,
                active: sim.condensation < 100,
                done: sim.condensation >= 95,
                color: '#38bdf8',
              },
              {
                id: 'cartilage',
                label: '02 SOX9 Cartilage',
                progress: sim.cartilageTemplate,
                active: sim.sox9Active && sim.cartilageTemplate < 95,
                done: sim.cartilageTemplate >= 95,
                color: '#60a5fa',
              },
              {
                id: 'vascular',
                label: '03 VEGF Vessels',
                progress: sim.vascularization,
                active: sim.vegfTriggered && sim.vascularization < 95,
                done: sim.vascularization >= 95,
                color: '#f43f5e',
              },
              {
                id: 'osteoid',
                label: '04 RUNX2 Osteoid',
                progress: sim.osteoidCollagen,
                active: sim.runx2Active && sim.osteoidCollagen < 95,
                done: sim.osteoidCollagen >= 95,
                color: '#f59e0b',
              },
              {
                id: 'mineral',
                label: '05 Ca₁₀(PO₄)₆',
                progress: sim.mineralization,
                active: sim.osteoidCollagen >= 35 && sim.mineralization < 95,
                done: sim.mineralization >= 95,
                color: '#e2e8f0',
              },
              {
                id: 'marrow',
                label: '06 Marrow Cavity',
                progress: sim.marrowCavity,
                active: sim.osteoclastsActive && sim.marrowCavity < 95,
                done: sim.marrowCavity >= 60,
                color: '#c084fc',
              },
            ]}
          />
        </div>
      </div>

      {/* Mechanical Stress Test Result Toast */}
      {stressFeedback && (
        <div
          className="mx-4 mb-2 px-3 py-1.5 rounded-xl bg-[#070b14] border font-mono text-[10px] flex items-center justify-between"
          style={{ borderColor: stressFeedback.color, color: stressFeedback.color }}
        >
          <span>
            <strong>STRESS TEST ({stressFeedback.label}):</strong> {stressFeedback.detail}
          </span>
          <button
            type="button"
            onClick={() => setStressFeedback(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Nuclear-Facility 2-Tab Control Console */}
      <ReactorControlPanel
        deckTitle="OSTEOGENESIS CONSOLE"
        annunciators={annunciators}
        elements={OSSIFICATION_ELEMENTS}
        elementLevels={sim.elements}
        onInfuseElement={(elId) => {
          setSim((p) => ({ ...p, elements: { ...p.elements, [elId]: 100 } }));
          cosmicAudio.playPulse(640);
        }}
        onPrimeAll={() => {
          setSim((p) => ({
            ...p,
            elements: Object.fromEntries(OSSIFICATION_ELEMENTS.map((e) => [e.id, 100])),
          }));
          cosmicAudio.playSynthesisChord();
        }}
        rightAction={
          <>
            {isCertified && massBoneCount < 206 && (
              <button
                type="button"
                disabled={massIncubating}
                onClick={handleMassIncubate206}
                className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-[9px] uppercase cursor-pointer"
              >
                {massIncubating
                  ? `🧬 Hox Array: ${massBoneCount}/206`
                  : '🧬 Mass-Incubate 206 Bones'}
              </button>
            )}
            {(isCertified || massBoneCount >= 206) && (
              <button
                type="button"
                onClick={handleDeployToAnatomy}
                className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-[9px] uppercase cursor-pointer"
              >
                {massBoneCount >= 206 ? '✓ 206 Bones in Anatomy' : '✓ Deploy Femur'}
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
          {/* Draggable Rotary Potentiometers with Green Optimal Zones */}
          <div className="flex items-center gap-1.5">
            <RotaryDial
              label="BMP-2 / Wnt"
              value={sim.morphogenBmpWnt}
              min={0}
              max={100}
              optimalMin={45}
              optimalMax={90}
              unit="%"
              accent="#38bdf8"
              onChange={(v) => setSim((p) => ({ ...p, morphogenBmpWnt: v }))}
            />
            <RotaryDial
              label="O₂ Perfusion"
              value={sim.o2Perfusion}
              min={0}
              max={40}
              optimalMin={16}
              optimalMax={26}
              unit="%"
              accent="#22d3ee"
              onChange={(v) => setSim((p) => ({ ...p, o2Perfusion: v }))}
            />
            <RotaryDial
              label="Wolff Load"
              value={sim.mechanicalLoadN}
              min={0}
              max={1200}
              step={50}
              optimalMin={300}
              optimalMax={850}
              unit="N"
              accent="#f59e0b"
              onChange={(v) => setSim((p) => ({ ...p, mechanicalLoadN: v }))}
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
              accent="#fb923c"
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

          {/* Illuminated Reactor Breaker Switches */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-1.5 min-w-[280px]">
            <BreakerButton
              label={sim.pathway === 'endochondral' ? 'Endochondral' : 'Intramembranous'}
              sublabel={sim.pathway === 'endochondral' ? 'Femur Pathway' : 'Skull Pathway'}
              active={true}
              ledColor="#38bdf8"
              onClick={() =>
                setSim((p) =>
                  createInitialOssificationState(
                    p.pathway === 'endochondral' ? 'intramembranous' : 'endochondral'
                  )
                )
              }
            />
            <BreakerButton
              label="1. SOX9 Switch"
              sublabel="Cartilage Model"
              active={sim.sox9Active}
              disabled={sim.pathway === 'intramembranous'}
              ledColor="#60a5fa"
              onClick={() => {
                setSim((p) => ({ ...p, sox9Active: !p.sox9Active }));
                cosmicAudio.playPulse(520);
              }}
            />
            <BreakerButton
              label="2. VEGF-A"
              sublabel="Blood Vessels"
              active={sim.vegfTriggered}
              ledColor="#f43f5e"
              onClick={() => {
                setSim((p) => ({ ...p, vegfTriggered: !p.vegfTriggered }));
                cosmicAudio.playPulse(560);
              }}
            />
            <BreakerButton
              label="3. RUNX2"
              sublabel="Osteoid + Ca/P"
              active={sim.runx2Active}
              ledColor="#f59e0b"
              onClick={() => {
                setSim((p) => ({ ...p, runx2Active: !p.runx2Active }));
                cosmicAudio.playPulse(600);
              }}
            />
            <BreakerButton
              label="4. Osteoclasts"
              sublabel="Marrow Cavity"
              active={sim.osteoclastsActive}
              ledColor="#c084fc"
              onClick={() => {
                setSim((p) => ({ ...p, osteoclastsActive: !p.osteoclastsActive }));
                cosmicAudio.playPulse(640);
              }}
            />
            <BreakerButton
              label="Growth Plate"
              sublabel={sim.growthPlateFused ? 'Fused (Adult)' : 'Open (Growing)'}
              active={sim.growthPlateFused}
              disabled={sim.pathway === 'intramembranous'}
              ledColor="#38bdf8"
              onClick={() => setSim((p) => ({ ...p, growthPlateFused: !p.growthPlateFused }))}
            />
            <BreakerButton
              label="Cross-Section"
              sublabel="Haversian Cut"
              active={sim.crossSectionCut}
              ledColor="#22d3ee"
              onClick={() => setSim((p) => ({ ...p, crossSectionCut: !p.crossSectionCut }))}
            />
            <BreakerButton
              label="Stress Test"
              sublabel="Load Fracture"
              active={Boolean(stressFeedback)}
              ledColor={stressEval.color}
              onClick={() => {
                const res = evaluateMechanicalStressTest(sim);
                setStressFeedback(res);
                stressAnimRef.current = { activeUntil: performance.now() + 1800, status: res.status };
                cosmicAudio.playPulse(480);
              }}
            />
          </div>

          {/* Analog Moving-Needle Telemetry Meters */}
          <div className="hidden 2xl:flex items-center gap-1.5">
            <AnalogMeter label="Cartilage" value={sim.cartilageTemplate} accent="#60a5fa" />
            <AnalogMeter label="Osteoid" value={sim.osteoidCollagen} accent="#f59e0b" />
            <AnalogMeter label="Mineral" value={sim.mineralization} accent="#10b981" />
            <AnalogMeter label="Marrow" value={sim.marrowCavity} accent="#c084fc" />
          </div>
        </div>
      </ReactorControlPanel>
    </div>
  );
};

export default BoneOssificationStudio;
