import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Atom, Sparkles, Maximize2 } from 'lucide-react';
import { useInventory } from '../../store/inventory';
import { useStore } from '../../store';

export const CPK_ELEMENT_STYLES = {
  H: { color: 0xf8fafc, radius: 0.24, vdw: 0.52, name: 'Hydrogen' },
  C: { color: 0x334155, emissive: 0x0f172a, radius: 0.38, vdw: 0.78, name: 'Carbon' },
  N: { color: 0x3b82f6, emissive: 0x1d4ed8, radius: 0.36, vdw: 0.74, name: 'Nitrogen' },
  O: { color: 0xf43f5e, emissive: 0x881337, radius: 0.35, vdw: 0.72, name: 'Oxygen' },
  P: { color: 0xf97316, emissive: 0x7c2d12, radius: 0.44, vdw: 0.88, name: 'Phosphorus' }
};

export const VSEPR_MOLECULES = {
  water: {
    id: 'water',
    formula: 'H₂O',
    name: 'Water (Universal Solvent)',
    geometry: 'Bent (sp³)',
    bondAngle: '104.5°',
    dipole: '1.85 D (Polar)',
    atoms: [
      { el: 'O', pos: [0, 0.15, 0] },
      { el: 'H', pos: [-0.82, -0.48, 0] },
      { el: 'H', pos: [0.82, -0.48, 0] }
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1]
    ]
  },
  ammonia: {
    id: 'ammonia',
    formula: 'NH₃',
    name: 'Ammonia',
    geometry: 'Trigonal Pyramidal (sp³)',
    bondAngle: '107.0°',
    dipole: '1.47 D (Polar)',
    atoms: [
      { el: 'N', pos: [0, 0.35, 0] },
      { el: 'H', pos: [0.88, -0.28, 0] },
      { el: 'H', pos: [-0.44, -0.28, 0.76] },
      { el: 'H', pos: [-0.44, -0.28, -0.76] }
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1]
    ]
  },
  methane: {
    id: 'methane',
    formula: 'CH₄',
    name: 'Methane',
    geometry: 'Tetrahedral (sp³)',
    bondAngle: '109.5°',
    dipole: '0.00 D (Nonpolar)',
    atoms: [
      { el: 'C', pos: [0, 0, 0] },
      { el: 'H', pos: [0.63, 0.63, 0.63] },
      { el: 'H', pos: [-0.63, -0.63, 0.63] },
      { el: 'H', pos: [-0.63, 0.63, -0.63] },
      { el: 'H', pos: [0.63, -0.63, -0.63] }
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
      [0, 4, 1]
    ]
  },
  glycine: {
    id: 'glycine',
    formula: 'NH₂-CH₂-COOH',
    name: 'Glycine (Amino Acid)',
    geometry: 'sp³ / Planar Carboxyl (sp²)',
    bondAngle: '109.5° / 120°',
    dipole: 'Zwitterion Precursor',
    atoms: [
      { el: 'N', pos: [-1.45, -0.25, 0.1] },
      { el: 'C', pos: [-0.2, 0.35, 0] },
      { el: 'C', pos: [1.05, -0.3, 0] },
      { el: 'O', pos: [1.15, -1.45, 0.15] },
      { el: 'O', pos: [2.1, 0.45, -0.15] },
      { el: 'H', pos: [-1.5, -0.95, 0.75] },
      { el: 'H', pos: [-2.15, 0.35, -0.2] },
      { el: 'H', pos: [-0.2, 1.0, 0.8] },
      { el: 'H', pos: [-0.2, 1.0, -0.8] },
      { el: 'H', pos: [2.85, -0.05, -0.15] }
    ],
    bonds: [
      [0, 1, 1],
      [1, 2, 1],
      [2, 3, 2],
      [2, 4, 1],
      [0, 5, 1],
      [0, 6, 1],
      [1, 7, 1],
      [1, 8, 1],
      [4, 9, 1]
    ]
  },
  glucose: {
    id: 'glucose',
    formula: 'C₆H₁₂O₆',
    name: 'α-D-Glucose (Pyranose)',
    geometry: 'Chair Conformation Ring',
    bondAngle: '111.5° Ring',
    dipole: 'Polyhydroxyl Polar',
    atoms: [
      { el: 'C', pos: [1.2, 0.25, 0.25] },
      { el: 'C', pos: [0.6, 1.15, -0.25] },
      { el: 'C', pos: [-0.6, 1.15, 0.25] },
      { el: 'C', pos: [-1.2, -0.25, -0.25] },
      { el: 'C', pos: [-0.6, -1.15, 0.25] },
      { el: 'O', pos: [0.6, -1.15, -0.25] },
      { el: 'O', pos: [2.15, 0.45, 0.65] },
      { el: 'O', pos: [1.15, 2.1, -0.65] },
      { el: 'O', pos: [-1.15, 2.1, 0.65] },
      { el: 'O', pos: [-2.15, -0.45, -0.65] }
    ],
    bonds: [
      [0, 1, 1],
      [1, 2, 1],
      [2, 3, 1],
      [3, 4, 1],
      [4, 5, 1],
      [5, 0, 1],
      [0, 6, 1],
      [1, 7, 1],
      [2, 8, 1],
      [3, 9, 1]
    ]
  },
  rna: {
    id: 'rna',
    formula: 'RNA Monomer',
    name: 'Ribonucleotide (PO₄-Ribose-Base)',
    geometry: 'Phosphodiester + Furanose Ring',
    bondAngle: 'C3′-endo Puckered',
    dipole: 'Polyanionic Backbone',
    atoms: [
      { el: 'P', pos: [-1.8, 0.3, 0] },
      { el: 'O', pos: [-2.6, 1.1, 0.5] },
      { el: 'O', pos: [-2.4, -0.8, -0.5] },
      { el: 'O', pos: [-0.6, 0.1, 0.3] },
      { el: 'C', pos: [0.3, 0.8, 0] },
      { el: 'C', pos: [1.2, 0.1, -0.4] },
      { el: 'O', pos: [0.8, -1.0, 0.1] },
      { el: 'N', pos: [2.1, 0.5, 0.3] },
      { el: 'C', pos: [2.8, -0.2, 0.8] }
    ],
    bonds: [
      [0, 1, 2],
      [0, 2, 1],
      [0, 3, 1],
      [3, 4, 1],
      [4, 5, 1],
      [5, 6, 1],
      [6, 4, 1],
      [5, 7, 1],
      [7, 8, 2]
    ]
  }
};

const MoleculeViewer3D = ({ temperature = 20, radiation = 0 }) => {
  const [selectedId, setSelectedId] = useState('water');
  const [cpkMode, setCpkMode] = useState(false);
  const mountRef = useRef(null);
  const tempRef = useRef(temperature);
  tempRef.current = temperature;

  const compounds = useInventory((state) => state.compounds);
  const addResource = useInventory((state) => state.addResource);

  const molecule = VSEPR_MOLECULES[selectedId] || VSEPR_MOLECULES.water;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 5.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x10b981, 1.4, 20);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    const molGroup = new THREE.Group();
    scene.add(molGroup);

    const atomMeshes = [];
    molecule.atoms.forEach((a, idx) => {
      const style = CPK_ELEMENT_STYLES[a.el] || CPK_ELEMENT_STYLES.C;
      const r = cpkMode ? style.vdw : style.radius;
      const geo = new THREE.SphereGeometry(r, 24, 24);
      const mat = new THREE.MeshPhysicalMaterial({
        color: style.color,
        emissive: style.emissive || 0x000000,
        roughness: 0.22,
        metalness: 0.15,
        clearcoat: 0.9
      });
      const mesh = new THREE.Mesh(geo, mat);
      const basePos = new THREE.Vector3(...a.pos);
      mesh.position.copy(basePos);
      molGroup.add(mesh);
      atomMeshes.push({ mesh, basePos, phase: idx * 1.7 });
    });

    // Build covalent bond cylinders in Ball-and-Stick mode
    if (!cpkMode) {
      const bondMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.35,
        metalness: 0.5
      });

      molecule.bonds.forEach(([i, j, order = 1]) => {
        const p1 = new THREE.Vector3(...molecule.atoms[i].pos);
        const p2 = new THREE.Vector3(...molecule.atoms[j].pos);
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const offsets = order === 2 ? [-0.07, 0.07] : [0];
        offsets.forEach((off) => {
          const cylGeo = new THREE.CylinderGeometry(0.055, 0.055, len, 12);
          const bondMesh = new THREE.Mesh(cylGeo, bondMat);
          bondMesh.position.copy(mid);
          bondMesh.position.y += off;
          bondMesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir.clone().normalize()
          );
          molGroup.add(bondMesh);
        });
      });
    }

    // Drag to rotate
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const onDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      molGroup.rotation.y += (e.clientX - prevX) * 0.012;
      molGroup.rotation.x += (e.clientY - prevY) * 0.012;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let animId;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      if (!isDragging) {
        molGroup.rotation.y += 0.006;
        molGroup.rotation.x = Math.sin(t * 0.5) * 0.15;
      }

      // Thermal vibration proportional to Chemistry vessel temperature
      const vibAmp = Math.min(0.06, Math.max(0.004, (tempRef.current / 1000) * 0.05));
      atomMeshes.forEach((item) => {
        item.mesh.position.set(
          item.basePos.x + Math.sin(t * 14 + item.phase) * vibAmp,
          item.basePos.y + Math.cos(t * 12 + item.phase) * vibAmp,
          item.basePos.z + Math.sin(t * 16 - item.phase) * vibAmp
        );
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      renderer.dispose();
    };
  }, [molecule, cpkMode]);

  const handleSynthesize = () => {
    addResource('compounds', molecule.id, 5);
    useStore.getState().showMessage(`🧪 Synthesized +5 ${molecule.name} (${molecule.formula}) into Ledger!`);
  };

  return (
    <div className="argon-panel rounded-2xl p-3.5 flex flex-col gap-2.5 text-white border border-cyan-500/25 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-teal-400" />
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              3D VSEPR Molecular Hologram
            </h3>
            <p className="text-[9px] font-mono text-slate-400">
              Covalent Geometry & Thermal Vibrations
            </p>
          </div>
        </div>
        <button
          onClick={() => setCpkMode((v) => !v)}
          className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
            cpkMode
              ? 'bg-teal-500/25 border-teal-400 text-teal-200'
              : 'bg-[#070b14] border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Maximize2 className="w-3 h-3" />
          {cpkMode ? 'CPK Space' : 'Ball & Stick'}
        </button>
      </div>

      {/* Molecule Tabs */}
      <div className="grid grid-cols-6 gap-1">
        {Object.values(VSEPR_MOLECULES).map((m) => {
          const isSelected = m.id === selectedId;
          const count = compounds?.[m.id] || 0;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`py-1 px-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center ${
                isSelected
                  ? 'bg-teal-500/25 border-teal-400 text-white'
                  : 'bg-[#070b14] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-mono text-[9px] font-bold text-teal-300 truncate max-w-full">
                {m.id === 'glycine' ? 'Gly' : m.id === 'glucose' ? 'Glc' : m.id === 'rna' ? 'RNA' : m.formula}
              </span>
              <span className="font-mono text-[8px] text-slate-500 tabular-telemetry">{count}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-44 rounded-xl bg-[#03060c] border border-white/[0.07] overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        <div className="absolute top-2 left-2.5 pointer-events-none">
          <div className="font-display text-sm font-bold text-teal-300">{molecule.formula}</div>
          <div className="font-mono text-[9px] text-slate-300">{molecule.name}</div>
        </div>

        <div className="absolute top-2 right-2.5 text-right pointer-events-none font-mono text-[9px] space-y-0.5">
          <div className="text-cyan-300">{molecule.geometry}</div>
          <div className="text-amber-300">∠ {molecule.bondAngle}</div>
          <div className="text-emerald-400">{molecule.dipole}</div>
        </div>
      </div>

      <button
        onClick={handleSynthesize}
        className="w-full py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/35 hover:to-cyan-500/35 border border-teal-400/40 text-teal-200 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
        <span>Synthesize +5 {molecule.formula}</span>
      </button>
    </div>
  );
};

export default MoleculeViewer3D;
