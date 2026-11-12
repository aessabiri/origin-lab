import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PARTICLE_TYPES } from '../../constants/particles';

const Cell3DViewport = ({ organelles = [], compiledGenome = null, stats = {} }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 6.8);
    camera.lookAt(0, 0, 0);

    // Bio-luminescent lighting
    scene.add(new THREE.AmbientLight(0x99f6e4, 0.7));
    const keyLight = new THREE.PointLight(0x14b8a6, 2.5, 25);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x6366f1, 2.0, 25);
    rimLight.position.set(-5, -4, -3);
    scene.add(rimLight);

    const cellGroup = new THREE.Group();
    scene.add(cellGroup);

    // 1. Translucent Lipid Bilayer Membrane (Outer & Inner Leaflet)
    const hasExtraMembrane = organelles.some((o) => o.type === PARTICLE_TYPES.MEMBRANE);
    const membraneGeo = new THREE.SphereGeometry(2.15, 48, 48);
    const membraneMat = new THREE.MeshPhysicalMaterial({
      color: hasExtraMembrane ? 0x10b981 : 0x14b8a6,
      emissive: 0x042f2e,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.65,
      transparent: true,
      opacity: hasExtraMembrane ? 0.36 : 0.26,
      clearcoat: 1.0,
      side: THREE.DoubleSide
    });
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    cellGroup.add(membraneMesh);

    // Wireframe geodesic cytoskeleton cortex
    const cortexGeo = new THREE.IcosahedronGeometry(2.12, 2);
    const cortexMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      wireframe: true,
      transparent: true,
      opacity: hasExtraMembrane ? 0.18 : 0.08
    });
    cellGroup.add(new THREE.Mesh(cortexGeo, cortexMat));

    // 2. Spawn 3D Organelles inside Cytoplasm
    const floatingOrganelles = [];

    organelles.forEach((org, idx) => {
      const angle = (idx / Math.max(1, organelles.length)) * Math.PI * 2;
      const dist = org.type === PARTICLE_TYPES.NUCLEUS ? 0 : 0.95 + (idx % 2) * 0.35;
      const basePos = new THREE.Vector3(
        Math.cos(angle) * dist,
        ((idx % 3) - 1) * 0.45,
        Math.sin(angle) * dist
      );

      const itemGroup = new THREE.Group();
      itemGroup.position.copy(basePos);

      if (org.type === PARTICLE_TYPES.NUCLEUS) {
        // 3D Nuclear Envelope + Helical Chromatin TorusKnot
        const nucGeo = new THREE.SphereGeometry(0.68, 32, 32);
        const nucMat = new THREE.MeshPhysicalMaterial({
          color: 0x8b5cf6,
          emissive: 0x4c1d95,
          transparent: true,
          opacity: 0.55,
          roughness: 0.2
        });
        itemGroup.add(new THREE.Mesh(nucGeo, nucMat));

        const dnaGeo = new THREE.TorusKnotGeometry(0.32, 0.06, 64, 12, 2, 3);
        const dnaMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          roughness: 0.3
        });
        itemGroup.add(new THREE.Mesh(dnaGeo, dnaMat));
      } else if (org.type === PARTICLE_TYPES.MITOCHONDRION) {
        // 3D Mitochondrion Capsule + Inner Cristae Glow
        const mitoGeo = new THREE.CapsuleGeometry(0.24, 0.38, 12, 24);
        const mitoMat = new THREE.MeshPhysicalMaterial({
          color: 0xf59e0b,
          emissive: 0x78350f,
          roughness: 0.25,
          transparent: true,
          opacity: 0.85
        });
        const mitoMesh = new THREE.Mesh(mitoGeo, mitoMat);
        mitoMesh.rotation.z = Math.PI / 3;
        itemGroup.add(mitoMesh);
      } else if (org.type === PARTICLE_TYPES.RIBOSOME) {
        // Large + Small Ribosomal Subunit Cluster
        const largeSub = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x155e75 })
        );
        const smallSub = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x0891b2 })
        );
        smallSub.position.set(0.18, 0.16, 0);
        itemGroup.add(largeSub, smallSub);
      } else if (org.type === PARTICLE_TYPES.CHLOROPLAST) {
        // 3D Chloroplast Plastid + Stacked Emerald Thylakoid Grana Discs
        const outerPlastid = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 24, 16),
          new THREE.MeshPhysicalMaterial({
            color: 0x10b981,
            emissive: 0x064e3b,
            transparent: true,
            opacity: 0.65,
            roughness: 0.2
          })
        );
        outerPlastid.scale.set(1.3, 0.75, 1.0);
        itemGroup.add(outerPlastid);

        for (let g = -1; g <= 1; g++) {
          const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(0.11, 0.11, 0.04, 16),
            new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x059669 })
          );
          disc.position.set(g * 0.1, g * 0.04, 0);
          itemGroup.add(disc);
        }
      } else if (org.type === PARTICLE_TYPES.VACUOLE) {
        // 3D Translucent Osmotic Contractile Vacuole Bubble
        const vacMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.34, 24, 24),
          new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            emissive: 0x0c4a6e,
            transmission: 0.8,
            transparent: true,
            opacity: 0.45,
            roughness: 0.1
          })
        );
        itemGroup.add(vacMesh);
      } else if (org.type === PARTICLE_TYPES.CRISPR_ARRAY) {
        // 3D CRISPR-Cas9 Genomic Shield Ring
        const crisprMesh = new THREE.Mesh(
          new THREE.TorusKnotGeometry(0.24, 0.045, 48, 8, 2, 5),
          new THREE.MeshStandardMaterial({
            color: 0xf43f5e,
            emissive: 0x881337,
            metalness: 0.4,
            roughness: 0.2
          })
        );
        itemGroup.add(crisprMesh);
      } else if (org.type === PARTICLE_TYPES.FLAGELLUM) {
        // Basal Rotary Motor Rotor
        const basalMotor = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16),
          new THREE.MeshStandardMaterial({
            color: 0x22d3ee,
            emissive: 0x0e7490,
            metalness: 0.6
          })
        );
        itemGroup.add(basalMotor);
      } else if (org.isProtein) {
        // Folded 3D Catalytic Polypeptide Coil
        const protGeo = new THREE.TorusKnotGeometry(0.22, 0.055, 48, 8, 3, 5);
        const protMat = new THREE.MeshStandardMaterial({
          color: 0xec4899,
          emissive: 0x831843,
          roughness: 0.25,
          metalness: 0.3
        });
        itemGroup.add(new THREE.Mesh(protGeo, protMat));
      } else {
        // Membrane Ion Channel Gate
        const gateGeo = new THREE.TorusGeometry(0.24, 0.07, 16, 32);
        const gateMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x064e3b
        });
        itemGroup.add(new THREE.Mesh(gateGeo, gateMat));
      }

      cellGroup.add(itemGroup);
      floatingOrganelles.push({ group: itemGroup, basePos, phase: idx * 1.4 });
    });

    // 3. Demiurge Genomic Flagellum or Installed Flagellum Organelle
    const flagellumSegments = [];
    const hasFlagellumOrganelle = organelles.some((o) => o.type === PARTICLE_TYPES.FLAGELLUM);
    if (compiledGenome || hasFlagellumOrganelle) {
      const segGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const segMat = new THREE.MeshStandardMaterial({
        color: compiledGenome ? 0x34d399 : 0x22d3ee,
        emissive: compiledGenome ? 0x059669 : 0x0891b2
      });
      for (let i = 0; i < 18; i++) {
        const seg = new THREE.Mesh(segGeo, segMat);
        seg.position.set(0, -2.15 - i * 0.14, 0);
        cellGroup.add(seg);
        flagellumSegments.push({ mesh: seg, idx: i });
      }
    }

    // Pointer rotation
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
      cellGroup.rotation.y += (e.clientX - prevX) * 0.01;
      cellGroup.rotation.x += (e.clientY - prevY) * 0.01;
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
        cellGroup.rotation.y += 0.004;
      }

      // Organic breathing pulse of lipid bilayer
      const breathe = 1 + Math.sin(t * 2.2) * 0.03;
      membraneMesh.scale.set(breathe, 1 / Math.sqrt(breathe), breathe);

      // Cytoplasmic cyclosis motion of organelles
      floatingOrganelles.forEach((o) => {
        o.group.rotation.y += 0.015;
        o.group.rotation.x += 0.008;
        o.group.position.set(
          o.basePos.x + Math.sin(t * 1.8 + o.phase) * 0.08,
          o.basePos.y + Math.cos(t * 1.5 + o.phase) * 0.08,
          o.basePos.z + Math.sin(t * 2.1 - o.phase) * 0.08
        );
      });

      // Flagellar whip wave
      flagellumSegments.forEach(({ mesh, idx }) => {
        mesh.position.x = Math.sin(t * 8 - idx * 0.45) * (0.04 + idx * 0.018);
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
  }, [organelles, compiledGenome]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default Cell3DViewport;
