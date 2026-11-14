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
import ReactorControlPanel, { RotaryDial, BreakerButton } from './ReactorControlPanel';

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
  const [sim, setSim] = useState(() => createInitialOssificationState('endochondral'));
  const [stressFeedback, setStressFeedback] = useState(null);
  const [showHyperRealAnatomy, setShowHyperRealAnatomy] = useState(false);

  const synthesizeFullOrganChain = useBioStore((s) => s.synthesizeFullOrganChain);
  const fabricateOrganForAnatomy = useAnatomyStore((s) => s.fabricateOrganForAnatomy);

  const phase = useMemo(() => getOssificationPhase(sim), [sim]);
  const stressEval = useMemo(() => evaluateMechanicalStressTest(sim), [sim]);
  const isCertified = stressEval.status === 'CERTIFIED' && sim.marrowCavity >= 60;

  // Continuous biological simulation tick (250ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setSim((prev) => stepOssification(prev, 0.25));
    }, 250);
    return () => clearInterval(timer);
  }, []);

  // Auto-unlock hyper-realistic Z-Anatomy view & deploy when certified
  useEffect(() => {
    if (isCertified && !showHyperRealAnatomy) {
      setShowHyperRealAnatomy(true);
      cosmicAudio.playSynthesisChord();
    }
  }, [isCertified, showHyperRealAnatomy]);

  // 3D Bioreactor + Live Transforming Bone / Hyper-Realistic Z-Anatomy Model
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
    const liquidGlow = new THREE.PointLight('#0ea5e9', 1.8, 10);
    liquidGlow.position.set(0, 0.1, 1.5);
    scene.add(liquidGlow);

    const chamberGroup = new THREE.Group();
    chamberGroup.scale.setScalar(0.76);
    scene.add(chamberGroup);

    // Compact Reactor Vessel Hardware
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

    const glassCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(1.12, 1.12, 2.54, 48, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: '#e2e8f0',
        transparent: true,
        opacity: 0.14,
        roughness: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    chamberGroup.add(glassCyl);

    const liquidCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(1.06, 1.06, 2.15, 48),
      new THREE.MeshPhysicalMaterial({
        color: '#0ea5e9',
        emissive: '#0284c7',
        emissiveIntensity: 0.12,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      })
    );
    liquidCyl.position.y = -0.14;
    chamberGroup.add(liquidCyl);

    let isDisposed = false;
    const clipPlane = sim.crossSectionCut
      ? new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.02)
      : null;

    if (showHyperRealAnatomy) {
      // Hyper-Realistic Z-Anatomy Skeletal Organ (identical to Anatomy Lab)
      const fallback = create3DOrganForSystem('skeletal_system');
      fallback.scale.setScalar(0.85);
      applyOrganSubPartMaterials(
        fallback,
        'skeletal_system',
        ['skel_cranium', 'skel_spine_ribs', 'skel_upper_limbs', 'skel_lower_limbs'],
        true,
        clipPlane
      );
      chamberGroup.add(fallback);

      loadZAnatomyOrganModel('skeletal_system').then((glb) => {
        if (isDisposed || !glb) return;
        glb.scale.setScalar(0.85);
        applyOrganSubPartMaterials(
          glb,
          'skeletal_system',
          ['skel_cranium', 'skel_spine_ribs', 'skel_upper_limbs', 'skel_lower_limbs'],
          true,
          clipPlane
        );
        chamberGroup.remove(fallback);
        disposeHierarchy(fallback);
        chamberGroup.add(glb);
      });
    } else {
      // Live Transforming Bone Tissue inside the Bioreactor
      const boneGroup = new THREE.Group();
      boneGroup.position.y = -0.1;
      chamberGroup.add(boneGroup);

      // 1. Mesenchymal Stem Cell Cloud (condenses as condensation -> 100)
      const spread = 0.85 - (sim.condensation / 100) * 0.55;
      const cellGeo = new THREE.SphereGeometry(0.04, 10, 10);
      const cellMat = new THREE.MeshStandardMaterial({
        color: sim.runx2Active ? '#f59e0b' : '#38bdf8',
        emissive: sim.runx2Active ? '#d97706' : '#0284c7',
        emissiveIntensity: 0.4,
      });
      for (let i = 0; i < 24; i++) {
        const c = new THREE.Mesh(cellGeo, cellMat);
        const a = (i / 24) * Math.PI * 2;
        c.position.set(
          Math.cos(a) * spread * 0.65,
          ((i % 8) - 3.5) * 0.2 * (1 - sim.condensation / 200),
          Math.sin(a) * spread * 0.65
        );
        boneGroup.add(c);
      }

      // 2. Bone / Cartilage Morphology (Endochondral Femur vs Intramembranous Skull Plate)
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
          opacity: 0.38 + minRatio * 0.62,
          roughness: 0.45 - minRatio * 0.2,
          clearcoat: 0.3 + minRatio * 0.5,
          clippingPlanes: clipPlane ? [clipPlane] : [],
          side: THREE.DoubleSide,
        });

        if (sim.pathway === 'endochondral') {
          // Shaft + Proximal/Distal Epiphyses + Glowing Growth Plates
          const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 1.35, 28), boneMat);
          boneGroup.add(shaft);

          const topEpi = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), boneMat);
          topEpi.position.y = 0.72;
          boneGroup.add(topEpi);

          const botEpi = new THREE.Mesh(new THREE.SphereGeometry(0.27, 24, 24), boneMat);
          botEpi.position.y = -0.72;
          boneGroup.add(botEpi);

          // Epiphyseal Growth Plates
          if (!sim.growthPlateFused) {
            const plateMat = new THREE.MeshBasicMaterial({
              color: '#38bdf8',
              transparent: true,
              opacity: 0.75,
            });
            [0.54, -0.54].forEach((yp) => {
              const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.045, 24), plateMat);
              plate.position.y = yp;
              boneGroup.add(plate);
            });
          }
        } else {
          // Intramembranous Cranial Vault Plate
          const plate = new THREE.Mesh(
            new THREE.SphereGeometry(0.72, 32, 24, 0, Math.PI * 1.1, 0.3, 1.3),
            boneMat
          );
          boneGroup.add(plate);
        }

        // 3. VEGF-A Invading Blood Vessels
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

        // 4. Hollow Medullary Marrow Cavity (visible in Cross-Section or when Osteoclasts active)
        if (sim.marrowCavity > 10) {
          const marrowMat = new THREE.MeshStandardMaterial({
            color: '#991b1b',
            emissive: '#ef4444',
            emissiveIntensity: 0.35,
            transparent: true,
            opacity: 0.85,
          });
          const marrow = new THREE.Mesh(
            new THREE.CylinderGeometry(0.09, 0.08, 0.95 * (sim.marrowCavity / 100), 18),
            marrowMat
          );
          boneGroup.add(marrow);
        }
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
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) chamberGroup.rotation.y += 0.0035;
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
  }, [
    sim.pathway,
    sim.condensation,
    sim.cartilageTemplate,
    sim.vascularization,
    sim.osteoidCollagen,
    sim.mineralization,
    sim.marrowCavity,
    sim.runx2Active,
    sim.vegfTriggered,
    sim.growthPlateFused,
    sim.crossSectionCut,
    showHyperRealAnatomy,
  ]);

  const handleDeployToAnatomy = () => {
    const anatomyId = synthesizeFullOrganChain('skeletal_system');
    if (fabricateOrganForAnatomy) fabricateOrganForAnatomy(anatomyId);
    cosmicAudio.playSynthesisChord();
    useStore
      .getState()
      .showMessage('🦴 Certified Living Bone deployed to 3D Anatomy Lab!');
  };

  return (
    <div className="col-span-12 flex flex-col bg-[#080d18] rounded-2xl border border-white/10 overflow-hidden relative">
      {/* Compact Phase Banner inside Viewport */}
      <div className="px-4 py-2 bg-[#090e18]/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[8.5px] font-mono font-bold text-cyan-400 uppercase block">
            {phase.code}
          </span>
          <span className="text-xs font-black text-white">{phase.title}</span>
          <span className="text-[10px] text-slate-400 ml-2 hidden md:inline">{phase.detail}</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[9px]">
          <span className="px-2 py-0.5 rounded bg-[#070b14] border border-slate-700 text-sky-300">
            Cartilage {Math.round(sim.cartilageTemplate)}%
          </span>
          <span className="px-2 py-0.5 rounded bg-[#070b14] border border-slate-700 text-amber-300">
            Osteoid {Math.round(sim.osteoidCollagen)}%
          </span>
          <span className="px-2 py-0.5 rounded bg-[#070b14] border border-slate-700 text-emerald-300">
            Mineral {Math.round(sim.mineralization)}%
          </span>
          <span className="px-2 py-0.5 rounded bg-[#070b14] border border-slate-700 text-purple-300">
            Marrow {Math.round(sim.marrowCavity)}%
          </span>
        </div>
      </div>

      {/* 3D Bioreactor Viewport */}
      <div ref={mountRef} className="flex-1 w-full min-h-0 cursor-grab active:cursor-grabbing relative" />

      {/* Mechanical Stress Test Toast Banner */}
      {stressFeedback && (
        <div
          className="mx-4 mb-2 px-3 py-1.5 rounded-xl bg-[#070b14] border font-mono text-[10px] flex items-center justify-between"
          style={{ borderColor: stressFeedback.color, color: stressFeedback.color }}
        >
          <span>
            <strong>TEST: {stressFeedback.label}</strong> — {stressFeedback.detail}
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

      {/* Nuclear-Reactor-Style 2-Tab Control Panel */}
      <ReactorControlPanel
        deckTitle="OSSIFICATION REACTOR"
        statusText={stressEval.label}
        statusColor={stressEval.color}
        elements={OSSIFICATION_ELEMENTS}
        elementLevels={sim.elements}
        onInfuseElement={(elId) => {
          setSim((p) => ({ ...p, elements: { ...p.elements, [elId]: 100 } }));
          cosmicAudio.playPulse(640);
        }}
        rightAction={
          <>
            {isCertified && (
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
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 3 Rotary Reactor Dials */}
          <div className="flex items-center gap-2">
            <RotaryDial
              label="BMP-2 / Wnt"
              value={sim.morphogenBmpWnt}
              min={0}
              max={100}
              unit="%"
              accent="#38bdf8"
              onChange={(v) => setSim((p) => ({ ...p, morphogenBmpWnt: v }))}
            />
            <RotaryDial
              label="O₂ Perfusion"
              value={sim.o2Perfusion}
              min={0}
              max={40}
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
              unit="N"
              accent="#f59e0b"
              onChange={(v) => setSim((p) => ({ ...p, mechanicalLoadN: v }))}
            />
          </div>

          {/* Illuminated Reactor Breaker Switches */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-1.5 min-w-[280px]">
            <BreakerButton
              label={sim.pathway === 'endochondral' ? 'Path: Endochondral' : 'Path: Intramembr.'}
              sublabel={sim.pathway === 'endochondral' ? 'Femur (Cartilage)' : 'Skull (Direct)'}
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
              sublabel="Cartilage Template"
              active={sim.sox9Active}
              disabled={sim.pathway === 'intramembranous'}
              ledColor="#60a5fa"
              onClick={() => {
                setSim((p) => ({ ...p, sox9Active: !p.sox9Active }));
                cosmicAudio.playPulse(520);
              }}
            />
            <BreakerButton
              label="2. VEGF-A Vessels"
              sublabel="Angiogenesis + O₂"
              active={sim.vegfTriggered}
              ledColor="#f43f5e"
              onClick={() => {
                setSim((p) => ({ ...p, vegfTriggered: !p.vegfTriggered }));
                cosmicAudio.playPulse(560);
              }}
            />
            <BreakerButton
              label="3. RUNX2 Switch"
              sublabel="Osteoblast + Mineral"
              active={sim.runx2Active}
              ledColor="#f59e0b"
              onClick={() => {
                setSim((p) => ({ ...p, runx2Active: !p.runx2Active }));
                cosmicAudio.playPulse(600);
              }}
            />
            <BreakerButton
              label="4. Osteoclasts"
              sublabel="Carve Marrow Cavity"
              active={sim.osteoclastsActive}
              ledColor="#c084fc"
              onClick={() => {
                setSim((p) => ({ ...p, osteoclastsActive: !p.osteoclastsActive }));
                cosmicAudio.playPulse(640);
              }}
            />
            <BreakerButton
              label="Cross-Section"
              sublabel="Marrow & Osteons"
              active={sim.crossSectionCut}
              ledColor="#22d3ee"
              onClick={() => setSim((p) => ({ ...p, crossSectionCut: !p.crossSectionCut }))}
            />
            <BreakerButton
              label="Stress Test"
              sublabel="Bend vs Shatter"
              active={Boolean(stressFeedback)}
              ledColor={stressEval.color}
              onClick={() => {
                setStressFeedback(evaluateMechanicalStressTest(sim));
                cosmicAudio.playPulse(480);
              }}
            />
            <BreakerButton
              label="Z-Anatomy View"
              sublabel={isCertified ? 'Hyper-Real Ready' : 'Preview 3D Bone'}
              active={showHyperRealAnatomy}
              ledColor="#10b981"
              onClick={() => setShowHyperRealAnatomy((v) => !v)}
            />
          </div>
        </div>
      </ReactorControlPanel>
    </div>
  );
};

export default BoneOssificationStudio;
