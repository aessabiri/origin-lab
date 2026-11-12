import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useBioStore } from '../store';
import { usePlanetaryStore } from '../../store/planetaryStore';
import { useAnatomyStore } from '../../anatomy-lab/store';
import { useStore } from '../../store';
import { cosmicAudio } from '../../utils/cosmicAudioBus';

/**
 * Pure deterministic calculator for Cambrian Multicellular Morphogenesis metrics.
 */
export function computeMorphogenesisMetrics(config = {}) {
  const symmetryScores = { asymmetric: 10, radial: 30, bilateral: 55 };
  const germScores = { diploblast: 15, triploblast: 40 };
  const skeletonScores = {
    hydrostatic: 15,
    exoskeleton: 45,
    notochord: 70,
    endoskeleton: 95
  };
  const sensoryScores = {
    eyespots: 15,
    compound_optics: 45,
    tripartite_brain: 85
  };
  const locomotionScores = {
    cilia: 10,
    myomeres: 35,
    paired_fins: 65,
    pentadactyl_limbs: 95
  };

  const sym = symmetryScores[config.symmetry] || 30;
  const germ = germScores[config.germLayers] || 25;
  const skel = skeletonScores[config.skeleton] || 40;
  const sens = sensoryScores[config.sensory] || 30;
  const loco = locomotionScores[config.locomotion] || 35;
  const segBonus = Math.min(20, (config.segments || 5) * 2);

  const biomechanicalReadiness = Math.min(
    100,
    Math.round((sym + germ + skel + loco + segBonus) / 3.0)
  );
  const encephalizationQuotient = Number(((sens + sym * 0.5) / 140).toFixed(2));

  let cladeId = 'ediacaran';
  let cladeTitle = 'Ediacaran Frond Metazoan';
  if (config.skeleton === 'endoskeleton' && config.locomotion === 'pentadactyl_limbs') {
    cladeId = 'tetrapoda';
    cladeTitle = 'Devonian Tetrapod (Tiktaalik Lineage)';
  } else if (config.skeleton === 'notochord' || config.skeleton === 'endoskeleton') {
    cladeId = 'chordata';
    cladeTitle = 'Early Vertebrate Chordate (Pikaia Lineage)';
  } else if (config.symmetry === 'bilateral' && config.skeleton === 'exoskeleton') {
    cladeId = 'cambrian';
    cladeTitle = 'Cambrian Arthropod (Anomalocaris Lineage)';
  }

  return {
    biomechanicalReadiness,
    encephalizationQuotient,
    metabolicDemand: Math.round(25 + skel * 0.4 + sens * 0.35 + loco * 0.3),
    cladeId,
    cladeTitle
  };
}

const CambrianMorphogenesisLab = ({ onOpenAnatomy }) => {
  const mountRef = useRef(null);
  const { morphogenesisConfig, setMorphogenesisConfig } = useBioStore();
  const bioprintedTissues = useAnatomyStore((s) => s.bioprintedTissues) || {};
  const synthesizeBioTissue = useAnatomyStore((s) => s.synthesizeBioTissue);

  const metrics = useMemo(
    () => computeMorphogenesisMetrics(morphogenesisConfig),
    [morphogenesisConfig]
  );

  // 3D Procedural Multicellular Organism Viewport
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
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 8.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x99f6e4, 0.75));
    const keyLight = new THREE.DirectionalLight(0x2dd4bf, 2.2);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x38bdf8, 2.0, 25);
    rimLight.position.set(-6, -3, 4);
    scene.add(rimLight);

    const organismGroup = new THREE.Group();
    scene.add(organismGroup);

    const segCount = morphogenesisConfig?.segments || 7;
    const isRadial = morphogenesisConfig?.symmetry === 'radial';
    const isEndo =
      morphogenesisConfig?.skeleton === 'endoskeleton' ||
      morphogenesisConfig?.skeleton === 'notochord';
    const hasLimbs = morphogenesisConfig?.locomotion === 'pentadactyl_limbs';
    const hasFins = morphogenesisConfig?.locomotion === 'paired_fins';

    const segmentMeshes = [];

    if (isRadial) {
      // Radial Cnidarian / Medusoid Body Plan
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65),
        new THREE.MeshPhysicalMaterial({
          color: 0x14b8a6,
          emissive: 0x0f766e,
          transmission: 0.7,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide
        })
      );
      organismGroup.add(dome);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const tentacle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.02, 2.4, 12),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7 })
        );
        tentacle.position.set(Math.cos(angle) * 1.1, -1.1, Math.sin(angle) * 1.1);
        organismGroup.add(tentacle);
        segmentMeshes.push({ mesh: tentacle, index: i });
      }
    } else {
      // Bilateral Segmented Metazoan / Chordate / Tetrapod Precursor
      for (let i = 0; i < segCount; i++) {
        const t = i / Math.max(1, segCount - 1);
        const radius = 0.55 * (1 - t * 0.55) + (i === 0 ? 0.18 : 0);
        const zPos = (0.5 - t) * 4.5;

        const segGroup = new THREE.Group();
        segGroup.position.set(0, 0, zPos);

        // Outer Mesoderm Somite
        const somiteMat = new THREE.MeshPhysicalMaterial({
          color: morphogenesisConfig?.skeleton === 'exoskeleton' ? 0xf59e0b : 0x14b8a6,
          emissive: morphogenesisConfig?.skeleton === 'exoskeleton' ? 0x78350f : 0x115e59,
          roughness: 0.25,
          transparent: true,
          opacity: isEndo ? 0.48 : 0.82
        });
        const somite = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), somiteMat);
        somite.scale.set(1.2, 0.85, 0.9);
        segGroup.add(somite);

        // Internal Calcified Vertebra / Notochord Core
        if (isEndo) {
          const boneCore = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.14, 0.52, 16),
            new THREE.MeshStandardMaterial({
              color: 0xf8fafc,
              emissive: 0x38bdf8,
              emissiveIntensity: 0.35,
              roughness: 0.3
            })
          );
          boneCore.rotation.x = Math.PI / 2;
          segGroup.add(boneCore);
        }

        // Cephalic Sensory Optics on Anterior Segment (i === 0)
        if (i === 0) {
          const eyeColor =
            morphogenesisConfig?.sensory === 'tripartite_brain' ? 0x34d399 : 0xf43f5e;
          [-1, 1].forEach((side) => {
            const eye = new THREE.Mesh(
              new THREE.SphereGeometry(0.16, 16, 16),
              new THREE.MeshStandardMaterial({
                color: eyeColor,
                emissive: eyeColor,
                emissiveIntensity: 0.8
              })
            );
            eye.position.set(side * radius * 0.85, 0.2, 0.35);
            segGroup.add(eye);
          });
        }

        // Paired Appendages (Fins or Pentadactyl Tetrapod Limbs)
        if ((hasFins || hasLimbs) && (i === 1 || i === Math.floor(segCount * 0.6))) {
          [-1, 1].forEach((side) => {
            const limbGeo = hasLimbs
              ? new THREE.CylinderGeometry(0.09, 0.06, 1.35, 12)
              : new THREE.BoxGeometry(1.1, 0.06, 0.45);
            const limbMat = new THREE.MeshStandardMaterial({
              color: hasLimbs ? 0xe2e8f0 : 0x2dd4bf,
              emissive: 0x0f766e
            });
            const limb = new THREE.Mesh(limbGeo, limbMat);
            limb.position.set(side * (radius + 0.45), -0.25, 0);
            if (hasLimbs) {
              limb.rotation.z = side * 0.55;
            }
            segGroup.add(limb);
          });
        }

        organismGroup.add(segGroup);
        segmentMeshes.push({ mesh: segGroup, index: i, baseZ: zPos });
      }
    }

    let animId;
    let time = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.025;
      organismGroup.rotation.y = Math.sin(time * 0.35) * 0.55 + 0.45;

      segmentMeshes.forEach(({ mesh, index }) => {
        if (isRadial) {
          mesh.rotation.z = Math.sin(time * 2 + index) * 0.18;
        } else {
          mesh.position.x = Math.sin(time * 3.2 - index * 0.55) * 0.18;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [morphogenesisConfig]);

  const handleEvolveClade = () => {
    const planetary = usePlanetaryStore.getState();
    // Unlock progressive clades up to the engineered tier
    ['cyanobacteria', 'archaea', 'eukaryota', 'ediacaran', metrics.cladeId].forEach((id) => {
      if (planetary.unlockClade) planetary.unlockClade(id);
    });

    // If Notochord or Endoskeleton is evolved, unlock axial/appendicular bones in 3D Anatomy Lab
    const anatomy = useAnatomyStore.getState();
    if (anatomy.unlockSubstage) {
      anatomy.unlockSubstage('stage1_axial');
      if (morphogenesisConfig.locomotion === 'pentadactyl_limbs') {
        anatomy.unlockSubstage('stage2_appendicular');
      }
    }

    cosmicAudio.playSynthesisChord();
    useStore
      .getState()
      .showMessage(
        `🦎 Evolved ${metrics.cladeTitle} (EQ ${metrics.encephalizationQuotient}) — Clade & Vertebrate Chassis Unlocked!`
      );
  };

  return (
    <div className="flex h-full w-full bg-[#030508] p-6 pb-20 gap-6 overflow-hidden select-none">
      {/* Left: Morphogenesis Trait Engineering Matrix */}
      <div className="w-96 flex flex-col gap-4 shrink-0">
        <div className="flex-1 flex flex-col p-5 argon-panel rounded-3xl overflow-y-auto space-y-4 custom-scrollbar">
          <div className="pb-3 border-b border-teal-500/20">
            <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-widest">
              Stage 05 // Evolutionary Bridge
            </span>
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mt-0.5">
              Cambrian Body-Plan Studio
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Bridge single-celled LUCA to the 206-bone vertebrate skeleton.
            </p>
          </div>

          {/* 1. Body Symmetry */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
              1. Body Axis Symmetry (Hox Collinearity)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'asymmetric', label: 'Asymmetric' },
                { id: 'radial', label: 'Radial' },
                { id: 'bilateral', label: 'Bilateral' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMorphogenesisConfig({ symmetry: opt.id })}
                  className={`py-2 px-2 rounded-xl font-mono text-[9px] font-bold uppercase border transition-all cursor-pointer ${
                    morphogenesisConfig.symmetry === opt.id
                      ? 'bg-teal-500/25 border-teal-400 text-teal-200'
                      : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Skeletal Structural Support */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
              2. Skeletal Chassis (Precursor to 206 Bones)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'hydrostatic', label: 'Hydrostatic Coelom' },
                { id: 'exoskeleton', label: 'Chitin Exoskeleton' },
                { id: 'notochord', label: 'Dorsal Notochord' },
                { id: 'endoskeleton', label: 'Calcified Endoskeleton' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMorphogenesisConfig({ skeleton: opt.id })}
                  className={`py-2 px-2.5 rounded-xl font-mono text-[9px] font-bold uppercase border transition-all cursor-pointer text-left ${
                    morphogenesisConfig.skeleton === opt.id
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                      : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Cephalization & Neural Optics */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
              3. Cephalization & Sensory Optics
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'eyespots', label: 'Eyespots' },
                { id: 'compound_optics', label: 'Compound Eyes' },
                { id: 'tripartite_brain', label: 'Cranial Brain' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMorphogenesisConfig({ sensory: opt.id })}
                  className={`py-2 px-2 rounded-xl font-mono text-[9px] font-bold uppercase border transition-all cursor-pointer ${
                    morphogenesisConfig.sensory === opt.id
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                      : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Locomotion Appendages */}
          <div>
            <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
              4. Appendage Morphogenesis
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'cilia', label: 'Ciliary Bands' },
                { id: 'myomeres', label: 'Undulating Myomeres' },
                { id: 'paired_fins', label: 'Paired Pelvic Fins' },
                { id: 'pentadactyl_limbs', label: 'Tetrapod Limbs (5-Digit)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMorphogenesisConfig({ locomotion: opt.id })}
                  className={`py-2 px-2.5 rounded-xl font-mono text-[9px] font-bold uppercase border transition-all cursor-pointer text-left ${
                    morphogenesisConfig.locomotion === opt.id
                      ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200'
                      : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Metameric Somite Count */}
          <div>
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 uppercase mb-1">
              <span>5. Metameric Somite Segments</span>
              <span className="text-teal-300">{morphogenesisConfig.segments || 7} Somites</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              value={morphogenesisConfig.segments || 7}
              onChange={(e) => setMorphogenesisConfig({ segments: Number(e.target.value) })}
              className="w-full h-1.5 accent-teal-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 6. 3D Bio-Tissue Printing Bridge into Anatomy Lab */}
          <div className="pt-2 border-t border-teal-500/20 space-y-1.5">
            <label className="text-[9px] font-mono font-bold text-teal-300 uppercase block">
              6. Merge Bio-Tissues into 3D Anatomy Rig
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'osteoid', label: '🦴 Osteoid (206 Bones)' },
                { id: 'myofibril', label: '💪 Myofibril & Ligaments' },
                { id: 'visceral', label: '🫁 Visceral & Lymph Organs' },
                { id: 'endothelial', label: '🫀 HD Heart & Vascular' },
                { id: 'neural', label: '🧠 HD Brain & Connectome' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => synthesizeBioTissue && synthesizeBioTissue(t.id)}
                  className={`py-1.5 px-2 rounded-xl font-mono text-[8.5px] font-bold uppercase border transition-all cursor-pointer text-left ${
                    bioprintedTissues[t.id]
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                      : 'bg-[#080d18] border-teal-500/30 text-teal-200 hover:bg-teal-500/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: 3D Multicellular Viewport & Evolutionary Telemetry */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex-1 relative border border-teal-500/25 bg-[#050912] rounded-3xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div ref={mountRef} className="w-full h-full" />

          <div className="absolute top-5 left-6 pointer-events-none">
            <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-widest block">
              3D Metazoan Morphogenesis Hologram
            </span>
            <h4 className="font-display text-lg font-bold text-white uppercase tracking-tight">
              {metrics.cladeTitle}
            </h4>
          </div>
        </div>

        {/* Bottom Telemetry & Clade Commit Bar */}
        <div className="h-28 flex gap-4 shrink-0">
          <div className="flex-1 argon-panel rounded-2xl p-4 grid grid-cols-3 gap-4 items-center">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase block">
                Biomechanical Readiness
              </span>
              <span className="text-2xl font-mono font-black text-emerald-400 tabular-telemetry">
                {metrics.biomechanicalReadiness}%
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase block">
                Encephalization (EQ)
              </span>
              <span className="text-2xl font-mono font-black text-cyan-300 tabular-telemetry">
                {metrics.encephalizationQuotient}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase block">
                ATP Metabolic Flux
              </span>
              <span className="text-2xl font-mono font-black text-amber-300 tabular-telemetry">
                {metrics.metabolicDemand} u/s
              </span>
            </div>
          </div>

          <button
            onClick={handleEvolveClade}
            className="w-64 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 rounded-2xl text-white font-mono font-black text-xs uppercase tracking-widest shadow-[0_8px_24px_rgba(20,184,166,0.35)] hover:brightness-110 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border border-teal-300/30 px-4 text-center"
          >
            <span className="text-xl">🦎</span>
            <span>Evolve Clade & Seed Skeleton</span>
          </button>

          {onOpenAnatomy && (
            <button
              onClick={onOpenAnatomy}
              className="w-44 bg-[#090f1d] hover:bg-slate-800 border border-cyan-500/40 rounded-2xl text-cyan-300 font-mono font-bold text-[10px] uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer px-3 text-center"
            >
              <span className="text-lg">🦴</span>
              <span>Open 206-Bone Lab →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CambrianMorphogenesisLab;
