import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  OSSIFICATION_ELEMENTS,
  createInitialOssificationState,
  stepOssification,
  getOssificationPhase,
  evaluateMechanicalStressTest,
} from '../../utils/ossificationEngine';
import { loadZAnatomyOrganModel, applyOrganSubPartMaterials } from '../../utils/zAnatomyOrganLoader';
import { create3DOrganForSystem } from '../../utils/organelle3DFactory';
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

  const [sim, setSim] = useState(() =>
    createInitialOssificationState('endochondral', { prefilled: true })
  );
  const [stressFeedback, setStressFeedback] = useState(null);
  const [showHyperRealAnatomy, setShowHyperRealAnatomy] = useState(false);
  const [massBoneCount, setMassBoneCount] = useState(0);
  const [massIncubating, setMassIncubating] = useState(false);

  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);
  const fabricateOrganForAnatomy = useAnatomyStore((s) => s.fabricateOrganForAnatomy);

  const phase = useMemo(() => getOssificationPhase(sim), [sim]);
  const stressEval = useMemo(() => evaluateMechanicalStressTest(sim), [sim]);
  const isCertified = stressEval.status === 'CERTIFIED' && sim.marrowCavity >= 60;

  // Biological simulation tick (250ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setSim((prev) => stepOssification(prev, 0.25));
    }, 250);
    return () => clearInterval(timer);
  }, []);

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
    const liquidGlow = new THREE.PointLight('#0ea5e9', 1.8, 10);
    liquidGlow.position.set(0, 0.1, 1.5);
    scene.add(liquidGlow);

    const chamberGroup = new THREE.Group();
    chamberGroup.scale.setScalar(0.75);
    scene.add(chamberGroup);

    // Compact Reactor Vessel Hardware
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

    const liquidCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(1.06, 1.06, 2.15, 48),
      new THREE.MeshPhysicalMaterial({
        color: '#0ea5e9',
        emissive: '#0284c7',
        emissiveIntensity: 0.12,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      })
    );
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
      if (!isDragging) chamberGroup.rotation.y += 0.0035;

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

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      tissueGroupRef.current = null;
      disposeHierarchy(scene);
      renderer.dispose();
    };
  }, []);

  // 2. LIGHTWEIGHT TISSUE MESH UPDATER (quantized steps — zero WebGL context flicker!)
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

    if (showHyperRealAnatomy) {
      const fallback = create3DOrganForSystem('skeletal_system');
      fallback.scale.setScalar(0.85);
      applyOrganSubPartMaterials(
        fallback,
        'skeletal_system',
        ['skel_cranium', 'skel_spine_ribs', 'skel_upper_limbs', 'skel_lower_limbs'],
        true,
        clipPlane
      );
      tissueRoot.add(fallback);

      loadZAnatomyOrganModel('skeletal_system').then((glb) => {
        if (isCancelled || !glb || !tissueGroupRef.current) return;
        glb.scale.setScalar(0.85);
        applyOrganSubPartMaterials(
          glb,
          'skeletal_system',
          ['skel_cranium', 'skel_spine_ribs', 'skel_upper_limbs', 'skel_lower_limbs'],
          true,
          clipPlane
        );
        tissueRoot.remove(fallback);
        disposeHierarchy(fallback);
        tissueRoot.add(glb);
      });
    } else {
      const boneGroup = new THREE.Group();
      boneGroup.position.y = -0.1;
      tissueRoot.add(boneGroup);

      // Mesenchymal Stem Cell Cloud condensing toward bone axis
      const spread = 0.85 - (sim.condensation / 100) * 0.55;
      const cellGeo = new THREE.SphereGeometry(0.038, 10, 10);
      const cellMat = new THREE.MeshStandardMaterial({
        color: sim.runx2Active ? '#f59e0b' : '#38bdf8',
        emissive: sim.runx2Active ? '#d97706' : '#0284c7',
        emissiveIntensity: 0.4,
      });
      for (let i = 0; i < 20; i++) {
        const c = new THREE.Mesh(cellGeo, cellMat);
        const a = (i / 20) * Math.PI * 2;
        c.position.set(
          Math.cos(a) * spread * 0.65,
          ((i % 7) - 3) * 0.22 * (1 - sim.condensation / 200),
          Math.sin(a) * spread * 0.65
        );
        boneGroup.add(c);
      }

      const hasTemplate =
        sim.pathway === 'endochondral' ? sim.cartilageTemplate > 10 : sim.condensation > 35;

      if (hasTemplate) {
        const minRatio = sim.mineralization / 100;
        const osteoidRatio = sim.osteoidCollagen / 100;
        const boneColor = new THREE.Color('#7dd3fc')
          .lerp(new THREE.Color('#f59e0b'), osteoidRatio * 0.65)
          .lerp(new THREE.Color('#f8fafc'), minRatio);

        const boneMat = new THREE.MeshPhysicalMaterial({
          color: boneColor,
          emissive: sim.vegfTriggered && minRatio < 0.3 ? '#7c3aed' : '#000000',
          emissiveIntensity: sim.vegfTriggered && minRatio < 0.3 ? 0.25 : 0,
          transparent: minRatio < 0.75,
          opacity: 0.4 + minRatio * 0.6,
          roughness: 0.45 - minRatio * 0.2,
          clearcoat: 0.3 + minRatio * 0.5,
          clippingPlanes: clipPlane ? [clipPlane] : [],
          side: THREE.DoubleSide,
        });

        if (sim.pathway === 'endochondral') {
          const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 1.35, 28), boneMat);
          boneGroup.add(shaft);
          const topEpi = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), boneMat);
          topEpi.position.y = 0.72;
          boneGroup.add(topEpi);
          const botEpi = new THREE.Mesh(new THREE.SphereGeometry(0.27, 24, 24), boneMat);
          botEpi.position.y = -0.72;
          boneGroup.add(botEpi);

          if (!sim.growthPlateFused) {
            const plateMat = new THREE.MeshBasicMaterial({
              color: '#38bdf8',
              transparent: true,
              opacity: 0.75,
            });
            [0.54, -0.54].forEach((yp) => {
              const plate = new THREE.Mesh(
                new THREE.CylinderGeometry(0.21, 0.21, 0.045, 24),
                plateMat
              );
              plate.position.y = yp;
              boneGroup.add(plate);
            });
          }
        } else {
          const plate = new THREE.Mesh(
            new THREE.SphereGeometry(0.72, 32, 24, 0, Math.PI * 1.1, 0.3, 1.3),
            boneMat
          );
          boneGroup.add(plate);
        }

        if (sim.vascularization > 10) {
          const vesselMat = new THREE.MeshStandardMaterial({
            color: '#ef4444',
            emissive: '#dc2626',
            emissiveIntensity: 0.6,
          });
          for (let v = 0; v < 4; v++) {
            const va = (v / 4) * Math.PI * 2;
            const vessel = new THREE.Mesh(
              new THREE.CylinderGeometry(0.018, 0.012, 0.45 + (sim.vascularization / 100) * 0.5, 8),
              vesselMat
            );
            vessel.position.set(Math.cos(va) * 0.12, (v - 1.5) * 0.18, Math.sin(va) * 0.12);
            vessel.rotation.z = Math.cos(va) * 0.65;
            boneGroup.add(vessel);
          }
        }

        if (sim.marrowCavity > 10) {
          const marrow = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.08, 0.95 * (sim.marrowCavity / 100), 18),
            new THREE.MeshStandardMaterial({
              color: '#991b1b',
              emissive: '#ef4444',
              emissiveIntensity: 0.4,
            })
          );
          boneGroup.add(marrow);
        }
      }
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

      {/* 3D Bioreactor Viewport */}
      <div ref={mountRef} className="flex-1 w-full min-h-0 cursor-grab active:cursor-grabbing relative" />

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
