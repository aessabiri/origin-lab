import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { useInventory } from '../store/inventory';

// --- CONSTANTS ---
const ERAS = {
  GALAXY: 'GALAXY',
  STELLAR: 'STELLAR'
};

// --- HELPERS ---
const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
};

// --- COMPONENTS ---

const Galaxy = ({ radius = 18, count = 35000 }) => {
  const texture = useMemo(() => createCircleTexture(), []);
  
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const dist = Math.pow(Math.random(), 1.4) * radius; 
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3);
      const spinAngle = dist * 1.0; 
      
      const armScatter = (Math.pow(Math.random(), 1.5) * (Math.random() < 0.5 ? 1 : -1) * 0.8) * dist;
      const spiralX = Math.cos(branchAngle + spinAngle) * dist + armScatter;
      const spiralZ = Math.sin(branchAngle + spinAngle) * dist + armScatter;
      
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      const theta = Math.random() * Math.PI * 2.0;
      const bulgeX = dist * Math.sin(phi) * Math.cos(theta);
      const bulgeY = dist * Math.sin(phi) * Math.sin(theta) * 0.8;
      const bulgeZ = dist * Math.cos(phi);

      const noiseX = (Math.random() - 0.5) * radius * 2.5;
      const noiseY = (Math.random() - 0.5) * (radius * 0.15);
      const noiseZ = (Math.random() - 0.5) * radius * 2.5;

      const randType = Math.random();
      const bulgeStrength = Math.exp(-dist / (radius * 0.18)); 
      
      if (randType > 0.75) { // 25% Background Noise
          p[i3] = noiseX; p[i3 + 1] = noiseY; p[i3 + 2] = noiseZ;
      } else {
          p[i3] = THREE.MathUtils.lerp(spiralX, bulgeX, bulgeStrength);
          p[i3 + 1] = THREE.MathUtils.lerp((Math.random() - 0.5) * (dist * 0.1), bulgeY, bulgeStrength); 
          p[i3 + 2] = THREE.MathUtils.lerp(spiralZ, bulgeZ, bulgeStrength);
      }

      const mixedColor = new THREE.Color();
      const colorInside = new THREE.Color('#ffcc80'); 
      const colorOutside = new THREE.Color('#4361ee'); 
      const colorDist = randType > 0.75 ? Math.random() * radius : dist;
      mixedColor.lerpColors(colorInside, colorOutside, colorDist / radius);
      
      const rand = Math.random();
      if (rand > 0.98) mixedColor.set('#f472b6'); 
      else if (rand > 0.96) mixedColor.set('#2dd4bf'); 
      else if (rand > 0.94) mixedColor.set('#ffffff'); 
      
      colors[i3] = mixedColor.r; colors[i3 + 1] = mixedColor.g; colors[i3 + 2] = mixedColor.b;
    }
    return { positions: p, colors };
  }, [radius, count]);

  const pointsRef = useRef();
  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.01; 
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={points.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.2} sizeAttenuation={true} depthWrite={false} vertexColors blending={THREE.AdditiveBlending} transparent opacity={0.8} map={texture} />
    </points>
  );
};

const StellarNursery = ({ position, color1 = "#4338ca", color2 = "#be185d", cloudCount = 15, starCount = 12 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map(() => ({
        pos: [(Math.random()-0.5)*8, (Math.random()-0.5)*10, (Math.random()-0.5)*8],
        color: ['#ef4444', '#22c55e', '#3b82f6', '#fbbf24', '#ffffff'][Math.floor(Math.random()*5)]
    }));
  }, [starCount]);

  const clouds = useMemo(() => {
    return Array.from({ length: cloudCount }).map(() => {
        const pos = [(Math.random()-0.5)*12, (Math.random()-0.5)*16, (Math.random()-0.5)*12];
        const dist = Math.sqrt(pos[0]**2 + pos[1]**2 + pos[2]**2);
        // Central clouds are MUCH bigger and lower opacity (blurrier)
        const isCore = dist < 6;
        return {
            pos,
            scale: isCore 
                ? [8 + Math.random()*6, 12 + Math.random()*10, 8 + Math.random()*6] // Giant core puffs
                : [3 + Math.random()*5, 6 + Math.random()*8, 3 + Math.random()*5],
            rot: [Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI],
            opacity: isCore ? 0.015 : 0.03 // Core is fainter/softer
        };
    });
  }, [cloudCount]);

  return (
    <group position={position}>
        {/* Irregular Volumetric Clouds */}
        {clouds.map((cloud, i) => (
            <Float key={i} speed={0.2} rotationIntensity={0.3} floatIntensity={0.3}>
                <mesh position={cloud.pos} rotation={cloud.rot} scale={cloud.scale}>
                    <sphereGeometry args={[1, 12, 12]} />
                    <meshStandardMaterial 
                        color={i % 2 === 0 ? color1 : color2} 
                        transparent opacity={cloud.opacity} 
                        depthWrite={false} 
                        blending={THREE.AdditiveBlending} 
                    />
                </mesh>
            </Float>
        ))}
        {/* Young Stars (Radiant Bloom, Vibrant, Glowing) */}
        {stars.map((star, i) => (
            <group key={i} position={star.pos}>
                {/* 1. Core (Small bright point) */}
                <mesh>
                    <sphereGeometry args={[0.04, 12, 12]} />
                    <meshStandardMaterial color={star.color} emissive={star.color} emissiveIntensity={10} toneMapped={false} />
                </mesh>
                
                {/* 2. Bloom/Halo (Soft blurred glow) */}
                <points>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" count={1} array={new Float32Array([0, 0, 0])} itemSize={3} />
                    </bufferGeometry>
                    <pointsMaterial 
                        size={1.5} 
                        color={star.color} 
                        transparent 
                        opacity={0.4} 
                        map={createCircleTexture()} 
                        blending={THREE.AdditiveBlending} 
                        depthWrite={false} 
                    />
                </points>
            </group>
        ))}
    </group>
  );
};

const CosmicDust = ({ count = 500, radius = 40, color1 = "#4338ca", color2 = "#be185d" }) => {
  const texture = useMemo(() => createCircleTexture(), []);
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      p[i3] = (Math.random() - 0.5) * radius * 2;
      p[i3 + 1] = (Math.random() - 0.5) * radius * 2;
      p[i3 + 2] = (Math.random() - 0.5) * radius * 2;

      const mixed = new THREE.Color();
      mixed.lerpColors(c1, c2, Math.random());
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }
    return { positions: p, colors };
  }, [count, radius, color1, color2]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={points.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={15} 
        vertexColors 
        transparent 
        opacity={0.02} 
        map={texture} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
};

const BackgroundStars = ({ count = 300 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
        pos: [(Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100],
        color: ['#ef4444', '#22c55e', '#3b82f6', '#fbbf24', '#ffffff'][Math.floor(Math.random()*5)]
    }));
  }, [count]);

  return (
    <>
      {stars.map((star, i) => (
        <mesh key={i} position={star.pos}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial 
                color={star.color} 
                emissive={star.color} 
                emissiveIntensity={12} 
                toneMapped={false} 
            />
        </mesh>
      ))}
    </>
  );
};

const EraButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-10 py-4 rounded-xl transition-all duration-500 border-2 font-black uppercase tracking-[0.2em] text-[10px] ${active ? 'bg-blue-500/20 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-slate-950/40 border-white/5 text-slate-500 hover:border-white/20'}`}
    >
        {label}
    </button>
);

const Universe = () => {
  const { introComplete, setIntroComplete } = useStore();
  const { triggerBigBang } = useInventory();
  
  const [isCinematicPlaying, setIsCinematicPlaying] = useState(false);
  const [activeEra, setActiveEra] = useState(ERAS.GALAXY);
  const videoRef = useRef();

  const handleInitiate = () => {
    setIsCinematicPlaying(true);
    if (videoRef.current) videoRef.current.play();
  };

  const onVideoEnd = () => {
    setIsCinematicPlaying(false);
    setIntroComplete(true);
    triggerBigBang();
    setActiveEra(ERAS.GALAXY);
  };

  return (
    <div className="w-full h-full bg-[#020617] relative overflow-hidden font-mono select-none">
      {/* ERA SELECTOR */}
      {introComplete && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex gap-4">
            <EraButton label="Galactic Stage" active={activeEra === ERAS.GALAXY} onClick={() => setActiveEra(ERAS.GALAXY)} />
            <EraButton label="Stellar Stage" active={activeEra === ERAS.STELLAR} onClick={() => setActiveEra(ERAS.STELLAR)} />
        </div>
      )}

      {/* INITIAL STATE */}
      {!introComplete && !isCinematicPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40 backdrop-blur-md">
            <h1 className="text-8xl font-black mb-4 text-white tracking-tighter animate-pulse">SINGULARITY</h1>
            <p className="text-blue-300/40 mb-12 tracking-[1em] text-[10px] uppercase">Zero Point Energy Detected</p>
            <button onClick={handleInitiate} className="px-16 py-6 bg-white text-black font-black text-xl hover:scale-110 transition-all duration-500 rounded-full shadow-[0_0_100px_white]">INITIATE</button>
        </div>
      )}

      {isCinematicPlaying && (
        <video ref={videoRef} src="/big_bang.mp4" className="absolute inset-0 w-full h-full object-cover z-[100]" onEnded={onVideoEnd} autoPlay muted={false} />
      )}

      {/* 3D CANVAS */}
      <Canvas shadows camera={{ position: [0, 0, 20], fov: 45 }} gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Suspense fallback={null}>
          {introComplete && (
            <>
              <Stars radius={100} depth={50} count={7000} factor={6} saturation={0} fade speed={0.1} />
              
              {activeEra === ERAS.GALAXY && (
                <Galaxy radius={18} count={35000} />
              )}

              {activeEra === ERAS.STELLAR && (
                <group>
                  {/* Optimized Ambient Nebulosity (Thousands of virtual clouds) */}
                  <CosmicDust count={800} radius={50} color1="#4338ca" color2="#be185d" />
                  <CosmicDust count={400} radius={60} color1="#db2777" color2="#fbbf24" />

                  {/* Universal Background Glow */}
                  <mesh scale={[-1, -1, -1]}>
                    <sphereGeometry args={[100, 32, 32]} />
                    <meshBasicMaterial color="#be185d" transparent opacity={0.02} side={THREE.BackSide} />
                  </mesh>
                  <mesh scale={[-1, -1, -1]}>
                    <sphereGeometry args={[90, 32, 32]} />
                    <meshBasicMaterial color="#fbbf24" transparent opacity={0.01} side={THREE.BackSide} />
                  </mesh>

                  {/* Dense cluster of overlapping nurseries */}
                  <StellarNursery position={[0, 0, 0]} color1="#4338ca" color2="#be185d" cloudCount={20} starCount={20} />
                  <StellarNursery position={[10, 5, -10]} color1="#be185d" color2="#7c3aed" />
                  <StellarNursery position={[-12, -4, -5]} color1="#0891b2" color2="#4338ca" />
                  <StellarNursery position={[5, -10, -15]} color1="#be185d" color2="#db2777" />
                  <StellarNursery position={[-8, 12, -10]} color1="#4338ca" color2="#0891b2" />
                  
                  {/* Background "Hot" Stars (Smaller, Brighter, Glowing) */}
                  <BackgroundStars count={300} />
                </group>
              )}
            </>
          )}
        </Suspense>
        <OrbitControls enablePan={false} maxDistance={80} minDistance={5} />
      </Canvas>
    </div>
  );
};

export default Universe;
