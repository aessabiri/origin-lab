import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Atom, Sparkles, Orbit, Layers } from 'lucide-react';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';

export const ATOMIC_ORBITAL_DATA = {
  hydrogen: {
    id: 'hydrogen',
    symbol: 'H',
    name: 'Hydrogen-1',
    Z: 1,
    N: 0,
    massU: 1.008,
    config: '1s¹',
    shells: [1],
    has2p: false,
    bindingMeV: 0.0,
    color: '#38bdf8',
    category: 'Primordial Nonmetal',
    description: 'Simplest baryon-lepton bound system; 75% of all baryonic matter in the cosmos.'
  },
  helium: {
    id: 'helium',
    symbol: 'He',
    name: 'Helium-4 (Alpha)',
    Z: 2,
    N: 2,
    massU: 4.0026,
    config: '1s²',
    shells: [2],
    has2p: false,
    bindingMeV: 7.07,
    color: '#fbbf24',
    category: 'Noble Gas',
    description: 'Doubly magic closed-shell nucleus forged during Big Bang & stellar pp-chain fusion.'
  },
  lithium: {
    id: 'lithium',
    symbol: 'Li',
    name: 'Lithium-7',
    Z: 3,
    N: 4,
    massU: 6.94,
    config: '1s² 2s¹',
    shells: [2, 1],
    has2p: false,
    bindingMeV: 5.61,
    color: '#a78bfa',
    category: 'Alkali Metal',
    description: 'First element with a second principal quantum shell (n=2).'
  },
  carbon: {
    id: 'carbon',
    symbol: 'C',
    name: 'Carbon-12 (Hoyle State)',
    Z: 6,
    N: 6,
    massU: 12.011,
    config: '1s² 2s² 2p²',
    shells: [2, 4],
    has2p: true,
    bindingMeV: 7.68,
    color: '#10b981',
    category: 'Tetravalent Backbone',
    description: 'Synthesized via the Triple-Alpha resonance; forms 4 covalent bonds for organic life.'
  },
  nitrogen: {
    id: 'nitrogen',
    symbol: 'N',
    name: 'Nitrogen-14',
    Z: 7,
    N: 7,
    massU: 14.007,
    config: '1s² 2s² 2p³',
    shells: [2, 5],
    has2p: true,
    bindingMeV: 7.48,
    color: '#818cf8',
    category: 'CNO Cycle Catalyst',
    description: 'Half-filled 2p subshell; essential for amino acid amine groups and nucleic bases.'
  },
  oxygen: {
    id: 'oxygen',
    symbol: 'O',
    name: 'Oxygen-16',
    Z: 8,
    N: 8,
    massU: 15.999,
    config: '1s² 2s² 2p⁴',
    shells: [2, 6],
    has2p: true,
    bindingMeV: 7.98,
    color: '#f43f5e',
    category: 'Chalcogen Oxidizer',
    description: 'High electronegativity drives H₂O polarity and aerobic cellular ATP synthesis.'
  },
  phosphorus: {
    id: 'phosphorus',
    symbol: 'P',
    name: 'Phosphorus-31',
    Z: 15,
    N: 16,
    massU: 30.974,
    config: '[Ne] 3s² 3p³',
    shells: [2, 8, 5],
    has2p: true,
    bindingMeV: 8.48,
    color: '#f97316',
    category: 'Polyphosphate Energy Carrier',
    description: 'Forms the sugar-phosphate backbone of RNA/DNA and high-energy ATP anhydrides.'
  },
  iron: {
    id: 'iron',
    symbol: 'Fe',
    name: 'Iron-56 (Nuclear Peak)',
    Z: 26,
    N: 30,
    massU: 55.845,
    config: '[Ar] 3d⁶ 4s²',
    shells: [2, 8, 14, 2],
    has2p: true,
    bindingMeV: 8.79,
    color: '#94a3b8',
    category: 'Transition Metal',
    description: 'Apex of nuclear binding stability; coordinates O₂ transport in Heme porphyry rings.'
  }
};

const QuantumAtom3D = ({ selectedAtomKey = 'carbon', onSelectAtom }) => {
  const [activeKey, setActiveKey] = useState(selectedAtomKey);
  const [showClouds, setShowClouds] = useState(true);
  const mountRef = useRef(null);

  const elementsStock = useInventory((state) => state.elements);
  const addResource = useInventory((state) => state.addResource);

  useEffect(() => {
    if (selectedAtomKey && ATOMIC_ORBITAL_DATA[selectedAtomKey]) {
      setActiveKey(selectedAtomKey);
    }
  }, [selectedAtomKey]);

  const atom = ATOMIC_ORBITAL_DATA[activeKey] || ATOMIC_ORBITAL_DATA.carbon;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 7.2);
    camera.lookAt(0, 0, 0);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const keyLight = new THREE.PointLight(0x38bdf8, 2.2, 25);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xf43f5e, 1.5, 20);
    rimLight.position.set(-5, -4, -4);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Build 3D Nucleus Cluster (Protons + Neutrons)
    const nucleusGroup = new THREE.Group();
    rootGroup.add(nucleusGroup);

    const totalNucleons = Math.min(28, atom.Z + atom.N);
    const protonMat = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      emissive: 0x881337,
      roughness: 0.25,
      metalness: 0.2,
      clearcoat: 0.8
    });
    const neutronMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0c4a6e,
      roughness: 0.3,
      metalness: 0.2,
      clearcoat: 0.8
    });
    const nucleonGeo = new THREE.SphereGeometry(0.22, 16, 16);

    const nucleons = [];
    for (let i = 0; i < totalNucleons; i++) {
      const isProton = i < Math.round((atom.Z / Math.max(1, atom.Z + atom.N)) * totalNucleons);
      const mesh = new THREE.Mesh(nucleonGeo, isProton ? protonMat : neutronMat);
      // Fibonacci sphere packing
      const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(1, totalNucleons));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = totalNucleons === 1 ? 0 : 0.18 + Math.cbrt(totalNucleons) * 0.11;
      const basePos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      mesh.position.copy(basePos);
      nucleusGroup.add(mesh);
      nucleons.push({ mesh, basePos, phase: i * 1.37 });
    }

    // 2. Quantum Probability Clouds (s & p orbitals)
    const cloudGroup = new THREE.Group();
    rootGroup.add(cloudGroup);

    if (showClouds) {
      // 1s / 2s spherical probability density shells
      atom.shells.forEach((_, sIdx) => {
        const radius = 1.35 + sIdx * 0.85;
        const sGeo = new THREE.SphereGeometry(radius, 24, 24);
        const sMat = new THREE.MeshPhongMaterial({
          color: atom.color,
          transparent: true,
          opacity: 0.07 - sIdx * 0.015,
          depthWrite: false,
          side: THREE.DoubleSide
        });
        cloudGroup.add(new THREE.Mesh(sGeo, sMat));
      });

      // 2p dumbbell lobes (px, py, pz) if atom has p-orbitals
      if (atom.has2p) {
        const axes = [
          { dir: new THREE.Vector3(1, 0, 0), color: 0x10b981 },
          { dir: new THREE.Vector3(0, 1, 0), color: 0x38bdf8 },
          { dir: new THREE.Vector3(0, 0, 1), color: 0xa855f7 }
        ];
        axes.forEach(({ dir, color }) => {
          [-1, 1].forEach((sign) => {
            const lobeGeo = new THREE.SphereGeometry(0.65, 20, 20);
            lobeGeo.scale(1.6, 0.72, 0.72);
            const lobeMat = new THREE.MeshPhongMaterial({
              color,
              transparent: true,
              opacity: 0.14,
              depthWrite: false
            });
            const lobe = new THREE.Mesh(lobeGeo, lobeMat);
            const pos = dir.clone().multiplyScalar(sign * 1.25);
            lobe.position.copy(pos);
            lobe.lookAt(dir.clone().multiplyScalar(sign * 5));
            cloudGroup.add(lobe);
          });
        });
      }
    }

    // 3. Relativistic Electron Rings & Orbiting Electrons
    const electrons = [];
    const eGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const eMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });

    atom.shells.forEach((count, shellIdx) => {
      const radius = 1.35 + shellIdx * 0.85;

      // Subtle orbital ring
      const ringGeo = new THREE.RingGeometry(radius - 0.012, radius + 0.012, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: atom.color,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3 + shellIdx * 0.45;
      ring.rotation.y = shellIdx * 0.6;
      rootGroup.add(ring);

      for (let eIdx = 0; eIdx < count; eIdx++) {
        const pivot = new THREE.Group();
        pivot.rotation.x = Math.PI / 3 + shellIdx * 0.45 + (eIdx % 3) * 0.35;
        pivot.rotation.y = shellIdx * 0.6 + (eIdx % 2) * 0.5;
        rootGroup.add(pivot);

        const eMesh = new THREE.Mesh(eGeo, eMat);
        pivot.add(eMesh);
        electrons.push({
          mesh: eMesh,
          radius,
          angle: (eIdx / count) * Math.PI * 2,
          speed: (2.6 - shellIdx * 0.45) * (eIdx % 2 === 0 ? 1 : -1)
        });
      }
    });

    // Pointer drag rotation
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      rootGroup.rotation.y += (e.clientX - prevX) * 0.01;
      rootGroup.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animId;
    let clock = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.016;

      if (!isDragging) {
        rootGroup.rotation.y += 0.005;
      }

      // Zero-point quantum jitter in nucleus
      nucleons.forEach((n) => {
        const jitter = 0.025;
        n.mesh.position.set(
          n.basePos.x + Math.sin(clock * 8 + n.phase) * jitter,
          n.basePos.y + Math.cos(clock * 7 + n.phase) * jitter,
          n.basePos.z + Math.sin(clock * 9 - n.phase) * jitter
        );
      });

      // Electron orbital motion
      electrons.forEach((el) => {
        el.angle += el.speed * 0.016;
        el.mesh.position.set(
          Math.cos(el.angle) * el.radius,
          Math.sin(el.angle) * el.radius,
          0
        );
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    };
  }, [atom, showClouds]);

  const handleSelect = (key) => {
    setActiveKey(key);
    if (onSelectAtom) onSelectAtom(key);
  };

  const handleQuickSynthesize = () => {
    addResource('elements', atom.id, 5);
    useStore.getState().showMessage(`⚛️ Quantum Resonance Forged +5 ${atom.name} (${atom.symbol})!`);
  };

  return (
    <div className="argon-panel rounded-2xl p-3.5 flex flex-col gap-3 text-white w-80 pointer-events-auto border border-cyan-500/25 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Orbit className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              3D Quantum Orbital Inspector
            </h3>
            <p className="text-[9px] font-mono text-slate-400">
              Schrödinger Wavefunction & Nucleon Core
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowClouds((v) => !v)}
          title="Toggle 2s/2p Quantum Probability Clouds"
          className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
            showClouds
              ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
              : 'bg-slate-900 border-white/10 text-slate-500'
          }`}
        >
          <Layers className="w-3 h-3" />
          {showClouds ? '2p Cloud' : 'Shells'}
        </button>
      </div>

      {/* Element Selector Ribbon */}
      <div className="grid grid-cols-8 gap-1">
        {Object.values(ATOMIC_ORBITAL_DATA).map((el) => {
          const isSelected = el.id === activeKey;
          const count = elementsStock?.[el.id] || 0;
          return (
            <button
              key={el.id}
              onClick={() => handleSelect(el.id)}
              className={`py-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center ${
                isSelected
                  ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                  : 'bg-[#070b14] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-display text-[11px] font-bold" style={{ color: el.color }}>
                {el.symbol}
              </span>
              <span className="font-mono text-[8px] text-slate-400 tabular-telemetry">{count}</span>
            </button>
          );
        })}
      </div>

      {/* 3D WebGL Viewport */}
      <div className="relative w-full h-52 rounded-xl bg-[#03060c] border border-white/[0.07] overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Overlay Telemetry Badges */}
        <div className="absolute top-2 left-2.5 pointer-events-none">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-extrabold" style={{ color: atom.color }}>
              {atom.symbol}
            </span>
            <span className="font-mono text-[10px] text-slate-300 font-bold">{atom.name}</span>
          </div>
          <span className="text-[9px] font-mono text-cyan-300 block">{atom.config}</span>
        </div>

        <div className="absolute top-2 right-2.5 text-right pointer-events-none font-mono text-[9px] space-y-0.5">
          <div className="text-rose-400 font-bold">Z = {atom.Z} Protons</div>
          <div className="text-sky-400 font-bold">N = {atom.N} Neutrons</div>
          <div className="text-emerald-400">{atom.bindingMeV} MeV/A</div>
        </div>

        <div className="absolute bottom-1.5 right-2.5 pointer-events-none text-[8px] font-mono text-slate-500">
          Drag to rotate 3D orbital
        </div>
      </div>

      {/* Description & Direct Synthesis Action */}
      <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
        {atom.description}
      </p>

      <button
        onClick={handleQuickSynthesize}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/35 hover:to-sky-500/35 border border-cyan-400/40 text-cyan-200 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Forge +5 {atom.symbol} into Ledger</span>
      </button>
    </div>
  );
};

export default QuantumAtom3D;
