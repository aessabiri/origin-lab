import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  EarthVertexShader,
  EarthFragmentShader,
  AtmosphereVertexShader,
  AtmosphereFragmentShader
} from '../universe-simulation/shaders/EarthShaders';
import {
  CloudVertexShader,
  CloudFragmentShader
} from '../universe-simulation/shaders/CloudShaders';

export const ERA_TO_EVOLUTION_VAL = {
  HADEAN: 0.15,
  ARCHEAN: 0.45,
  PROTEROZOIC: 0.7,
  PHANEROZOIC: 1.0,
  ANTHROPOCENE: 1.0
};

const PlanetGlobe3D = ({
  era = 'HADEAN',
  temperature = 288,
  atmosphere = { oxygen: 21, co2: 0.04 },
  ecoMetrics = { globalBiomass: 0, cognitiveComplexity: 0 },
  activeCatastrophe = null
}) => {
  const mountRef = useRef(null);
  const propsRef = useRef({ era, temperature, atmosphere, ecoMetrics, activeCatastrophe });
  propsRef.current = { era, temperature, atmosphere, ecoMetrics, activeCatastrophe };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 6.2);
    camera.lookAt(0, 0, 0);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Desktop Universe Simulation EarthStage Shader Uniforms
    const sunPosition = new THREE.Vector3(120, 60, 180);
    const uniforms = {
      time: { value: 0 },
      seedTime: { value: (ecoMetrics?.globalBiomass ?? 0) > 0 ? 0.1 : -1.0 },
      evolution: { value: ERA_TO_EVOLUTION_VAL[era] ?? 0.15 },
      sunPosition: { value: sunPosition },
      impacts: {
        value: [
          new THREE.Vector4(1, 0.3, 0.5, 0),
          new THREE.Vector4(-0.8, 0.4, 0.6, 0),
          new THREE.Vector4(0.2, -0.7, 0.8, 0),
          new THREE.Vector4(-0.4, -0.5, -0.7, 0),
          new THREE.Vector4(0.6, 0.6, -0.4, 0)
        ]
      }
    };

    // 1. 128x128 3D Earth Sphere with Desktop EarthShaders
    const earthGeo = new THREE.SphereGeometry(2.0, 96, 96);
    const earthMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: EarthVertexShader,
      fragmentShader: EarthFragmentShader,
      transparent: false,
      depthWrite: true,
      depthTest: true
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.y = Math.PI;
    globeGroup.add(earthMesh);

    // 2. Volumetric 3D Cloud Sphere with Desktop CloudShaders
    const cloudGeo = new THREE.SphereGeometry(2.035, 96, 96);
    const cloudMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: CloudVertexShader,
      fragmentShader: CloudFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    globeGroup.add(cloudMesh);

    // 3. Rayleigh & Sunset Scattering Atmosphere with Desktop AtmosphereShaders
    const atmoGeo = new THREE.SphereGeometry(2.16, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: AtmosphereVertexShader,
      fragmentShader: AtmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // 4. Orbiting Moon (From Desktop EarthStage)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.copy(sunPosition);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x404060, 0.6));

    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 })
    );
    globeGroup.add(moonMesh);

    // 5. Anthropocene Orbital Satellite Constellation
    const satGroup = new THREE.Group();
    globeGroup.add(satGroup);

    const ringGeo = new THREE.RingGeometry(2.38, 2.4, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2.6;
    satGroup.add(orbitRing);

    const satellites = [];
    const satGeo = new THREE.OctahedronGeometry(0.05, 0);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    for (let i = 0; i < 6; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      satGroup.add(sat);
      satellites.push({ mesh: sat, angle: (i / 6) * Math.PI * 2, speed: 0.8 + (i % 2) * 0.3 });
    }

    // Interactive Drag Orbit
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
      globeGroup.rotation.y += (e.clientX - prevX) * 0.008;
      globeGroup.rotation.x = Math.max(
        -0.8,
        Math.min(0.8, globeGroup.rotation.x + (e.clientY - prevY) * 0.008)
      );
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
    let clock = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.016;

      const latest = propsRef.current;
      uniforms.time.value = clock;

      // Map Era & Temperature to Desktop EarthStage evolution value (0.0=Hadean, 0.4=Archean, 0.7=Snowball, 1.0=Modern)
      let targetEvo = ERA_TO_EVOLUTION_VAL[latest.era] ?? 0.15;
      if ((latest.temperature ?? 288) < 260 || latest.activeCatastrophe?.type === 'GLACIATION') {
        targetEvo = 0.7; // Snowball Earth shader state
      } else if (latest.activeCatastrophe?.type === 'ASTEROID_IMPACT' || latest.activeCatastrophe?.type === 'SUPERVOLCANO') {
        // Trigger impact craters on the 3D shader
        uniforms.impacts.value[0].set(0.5, 0.3, 0.8, 1.0);
        uniforms.impacts.value[1].set(-0.4, 0.5, 0.7, 0.9);
      }

      uniforms.evolution.value += (targetEvo - uniforms.evolution.value) * 0.06;

      if ((latest.ecoMetrics?.globalBiomass ?? 0) > 0 && uniforms.seedTime.value < 0) {
        uniforms.seedTime.value = Math.max(0.01, clock - 2.0);
      }

      // Hadean / Impact decay
      if (uniforms.evolution.value < 0.4) {
        if (Math.random() > 0.97) {
          const slot = Math.floor(Math.random() * 5);
          uniforms.impacts.value[slot].set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            1.0
          );
        }
      }
      uniforms.impacts.value.forEach((v) => {
        if (v.w > 0) v.w = Math.max(0, v.w - 0.01);
      });

      if (!isDragging) {
        earthMesh.rotation.y += 0.003;
      }
      cloudMesh.rotation.y += 0.0045;

      // Orbiting Moon
      moonMesh.position.set(
        Math.cos(clock * 0.35) * 2.85,
        Math.sin(clock * 0.35) * 0.35,
        Math.sin(clock * 0.35) * 2.85
      );

      // Anthropocene Satellites
      const showSats =
        latest.era === 'ANTHROPOCENE' || (latest.ecoMetrics?.cognitiveComplexity ?? 0) >= 80;
      satGroup.visible = showSats;
      if (showSats) {
        satellites.forEach((s) => {
          s.angle += s.speed * 0.016;
          s.mesh.position.set(
            Math.cos(s.angle) * 2.39,
            Math.sin(s.angle) * 0.95,
            Math.sin(s.angle) * 2.18
          );
        });
      }

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
  }, []);

  return (
    <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 flex items-center justify-center shrink-0">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Drag to orbit 3D GLSL Earth & Moon"
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-0.5 rounded-full bg-black/60 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 uppercase tracking-widest">
        3D Earth GLSL Engine // Drag to Orbit
      </div>
    </div>
  );
};

export default PlanetGlobe3D;
