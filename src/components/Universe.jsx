import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { useInventory } from '../store/inventory';

// --- CONSTANTS & DATA ---
const ERAS = {
  GALAXY: 'GALAXY',
  STELLAR: 'STELLAR'
};

const CAMERA_SETTINGS = {
  [ERAS.GALAXY]: { pos: [0, 20, 40], target: [0, 0, 0], fov: 40 },
  [ERAS.STELLAR]: { pos: [8, 4, 12], target: [5, 2, -2], fov: 35 }
};

// --- EXOPLANET GENERATION LOGIC ---

const STAR_TYPES = [
    { type: 'M (Red Dwarf)', mass: 0.3, luminosity: 0.04, color: '#ef4444', hz: 0.2 },
    { type: 'K (Orange Dwarf)', mass: 0.7, luminosity: 0.4, color: '#f97316', hz: 0.6 },
    { type: 'G (Yellow Dwarf)', mass: 1.0, luminosity: 1.0, color: '#fbbf24', hz: 1.0 }, // Sun-like
    { type: 'F (Yellow-White)', mass: 1.3, luminosity: 2.5, color: '#fef08a', hz: 1.6 },
    { type: 'A (White Main)', mass: 2.0, luminosity: 20, color: '#ffffff', hz: 4.5 },
];

const GAS_SIGNATURES = {
    H2O: { label: 'Water Vapor', color: '#60a5fa', wavelength: 650 },
    O2:  { label: 'Oxygen', color: '#4ade80', wavelength: 760 },
    CH4: { label: 'Methane', color: '#2dd4bf', wavelength: 880 },
    CO2: { label: 'Carbon Dioxide', color: '#f87171', wavelength: 1400 },
    N2:  { label: 'Nitrogen', color: '#94a3b8', wavelength: 500 }, // Inert, base
};

const generateExoplanet = () => {
    // 1. Pick a Star
    const star = STAR_TYPES[Math.floor(Math.random() * STAR_TYPES.length)];
    
    // 2. Generate Planet Orbit (AU)
    // Bias towards HZ for gameplay fun, but allow failure
    const orbit = (Math.random() * 2 * star.hz) + (star.hz * 0.2); 
    
    // 3. Determine if in Goldilocks Zone (Simple approximation)
    const deviation = Math.abs(orbit - star.hz) / star.hz; // 0 = perfect center, > 0.5 = too hot/cold
    const isInHZ = deviation < 0.35;
    
    // 4. Generate Atmosphere based on HZ
    let atmo = { N2: 0, CO2: 0, O2: 0, CH4: 0, H2O: 0 };
    let habitabilityScore = 0;
    let type = 'Unknown';
    let description = '';

    if (deviation > 1.0) {
        // Frozen World
        type = 'Cryo-Planet';
        atmo = { N2: 80, CO2: 15, CH4: 5, O2: 0, H2O: 0 }; // Frozen Methane/Nitrogen
        description = 'Surface temperatures near absolute zero. Atmosphere has collapsed.';
        habitabilityScore = 5;
    } else if (deviation < -0.8) {
        // Scorched World
        type = 'Lava World';
        atmo = { CO2: 90, N2: 10, O2: 0, CH4: 0, H2O: 0 };
        description = 'Surface molten. Atmosphere stripped or purely volcanic.';
        habitabilityScore = 0;
    } else if (isInHZ) {
        // Goldilocks Candidate
        // Roll for life
        const lifeRoll = Math.random();
        
        if (lifeRoll > 0.7) {
            // LIVING WORLD
            type = 'Terran Analog';
            atmo = { 
                N2: 70 + Math.random() * 10, 
                O2: 15 + Math.random() * 10, 
                H2O: 1 + Math.random() * 5,
                CO2: 0.04 + Math.random() * 0.1,
                CH4: Math.random() * 2
            };
            description = 'Biosignatures detected. Atmospheric equilibrium suggests active biological processes.';
            habitabilityScore = 90 + Math.random() * 10;
        } else if (lifeRoll > 0.4) {
            // Water World (Ocean)
            type = 'Thalassic Planet';
            atmo = {
                N2: 80,
                H2O: 15 + Math.random() * 5,
                CO2: 5,
                O2: Math.random() * 1, // Trace
                CH4: 0
            };
            description = 'Global ocean detected. High pressure water vapor atmosphere.';
            habitabilityScore = 60 + Math.random() * 20;
        } else {
            // Venus/Mars Analog
            type = 'Desert / Hothouse';
            atmo = {
                CO2: 95,
                N2: 3,
                H2O: 0,
                O2: 0,
                CH4: 0
            };
            description = 'Runaway greenhouse effect or sterile desert surface.';
            habitabilityScore = 15;
        }
    } else {
        // Just outside HZ
        type = 'Barren Rock';
        atmo = { CO2: 98, N2: 2, H2O: 0, O2: 0, CH4: 0 };
        description = 'No magnetic field detected. Atmosphere stripped by stellar wind.';
        habitabilityScore = 10;
    }

    // Normalize Atmo to 100%
    const total = Object.values(atmo).reduce((a,b) => a+b, 0);
    if (total > 0) {
        Object.keys(atmo).forEach(k => atmo[k] = (atmo[k] / total) * 100);
    }

    return {
        id: Math.random().toString(36).substr(2, 9),
        star,
        orbit: orbit.toFixed(2),
        radius: (0.8 + Math.random() * 1.5).toFixed(2), // Earth Radii
        type,
        atmo,
        description,
        score: Math.floor(habitabilityScore),
        spectrum: atmo // Use composition for graph peaks
    };
};

const createNoiseTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Fill with black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add noise
    for(let i=0; i<4000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const s = Math.random() * 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Add streak lines for accretion look
    for(let i=0; i<50; i++) {
        const y = Math.random() * 256;
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
        ctx.lineWidth = 1 + Math.random() * 3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
};

// --- COMPONENTS ---

const SpectroscopyHUD = ({ data, onDismiss }) => {
    const [stage, setStage] = useState('scanning'); // scanning -> transit -> spectrum -> result
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef(null);
    
    // Sequence Controller
    useEffect(() => {
        let timer;
        if (stage === 'scanning') {
            const int = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(int);
                        setStage('spectrum');
                        return 0;
                    }
                    return p + 1.5;
                });
            }, 30);
            return () => clearInterval(int);
        }
        if (stage === 'spectrum') {
            timer = setTimeout(() => setStage('result'), 3500);
        }
        return () => clearTimeout(timer);
    }, [stage]);

    // Canvas Renderer for Spectrum
    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs || stage === 'scanning') return;
        const ctx = cvs.getContext('2d');
        let animId;
        
        const draw = () => {
            if (!cvs) return;
            const w = cvs.width;
            const h = cvs.height;
            ctx.clearRect(0, 0, w, h);
            
            // Base Noise (Background Radiation)
            ctx.beginPath();
            ctx.moveTo(0, h);
            for(let x=0; x<w; x+=2) {
                const noise = Math.random() * 10;
                ctx.lineTo(x, h - 20 - noise);
            }
            ctx.strokeStyle = '#334155';
            ctx.stroke();

            // Emission Lines
            // We map wavelength 400-1500nm to canvas width
            const drawPeak = (gas, intensity, unstable) => {
                const center = ((GAS_SIGNATURES[gas].wavelength - 400) / 1100) * w;
                const height = (intensity / 100) * (h * 0.8);
                const spread = 20;

                ctx.beginPath();
                ctx.moveTo(center - spread, h - 25);
                
                // Jitter if analyzing
                const jitter = unstable ? (Math.random() - 0.5) * 10 : 0;
                const currentH = unstable ? height * Math.random() : height;

                ctx.quadraticCurveTo(center, h - 25 - currentH - jitter, center + spread, h - 25);
                
                ctx.fillStyle = unstable ? '#ffffff' : GAS_SIGNATURES[gas].color;
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.globalAlpha = 1.0;
                
                if (!unstable && intensity > 5) {
                    // Label
                    ctx.fillStyle = 'white';
                    ctx.font = '10px monospace';
                    ctx.fillText(gas, center - 5, h - 35 - height);
                }
            };

            const isStable = stage === 'result';
            
            Object.entries(data.atmo).forEach(([gas, pct]) => {
                if (pct > 1) drawPeak(gas, pct, !isStable);
            });

            // Scan Line
            if (!isStable) {
                const x = (Date.now() / 2) % w;
                ctx.strokeStyle = '#3b82f6';
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }

            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animId);
    }, [stage, data]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.3s]">
             <div className="w-full max-w-4xl bg-slate-950/95 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative">
                
                {/* 1. TOP BAR: Status & Controls */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${stage === 'result' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-400 animate-pulse'}`} />
                        <span className="font-mono text-sm tracking-widest text-slate-300 uppercase">
                            {stage === 'scanning' && `TELESCOPE ALIGNMENT... ${progress.toFixed(0)}%`}
                            {stage === 'spectrum' && 'SPECTRAL ANALYSIS IN PROGRESS...'}
                            {stage === 'result' && 'TARGET CHARACTERIZATION COMPLETE'}
                        </span>
                    </div>
                    <button onClick={onDismiss} className="text-slate-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-12 h-[500px]">
                    
                    {/* 2. LEFT: Visuals & Star Data */}
                    <div className="col-span-4 border-r border-white/10 p-6 flex flex-col gap-6 relative">
                        {/* Target Visualization (Mock) */}
                        <div className="aspect-square rounded-full border-2 border-dashed border-white/10 relative flex items-center justify-center overflow-hidden bg-black">
                            {stage !== 'scanning' && (
                                <div className="w-3/4 h-3/4 rounded-full shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.8)] relative animate-[spin_60s_linear_infinite]"
                                     style={{ 
                                         background: stage === 'result' 
                                            ? `radial-gradient(circle at 30% 30%, ${data.star.color}, #000)` 
                                            : '#1e293b' 
                                     }}>
                                    {/* Planet Surface Color Approximation based on Score */}
                                    <div className="absolute inset-0 opacity-80" 
                                        style={{ 
                                            backgroundColor: data.score > 80 ? '#22c55e' : (data.score > 40 ? '#3b82f6' : '#94a3b8') 
                                        }} 
                                    />
                                    <div className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/pmndrs/drei-assets/master/clouds/cloud1.png')] bg-cover opacity-50 mix-blend-overlay" />
                                </div>
                            )}
                            {/* Scanning Overlay */}
                            {stage === 'scanning' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-[2px] bg-blue-500/50 absolute animate-[ping_1s_infinite]" />
                                    <div className="h-full w-[2px] bg-blue-500/50 absolute animate-[ping_1s_infinite_0.5s]" />
                                </div>
                            )}
                        </div>
                        
                        {/* Star Info */}
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Host Star</span>
                                <span className="text-xs font-bold text-white" style={{color: data.star.color}}>{data.star.type}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Orbital Dist.</span>
                                <span className="text-xs font-mono text-white">{data.orbit} AU</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Planet Radius</span>
                                <span className="text-xs font-mono text-white">{data.radius} R⊕</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. CENTER: Spectroscopy Graph */}
                    <div className="col-span-8 p-6 flex flex-col">
                        <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/10 relative overflow-hidden mb-6">
                            <canvas ref={canvasRef} width={600} height={250} className="w-full h-full" />
                            {/* Axis Labels */}
                            <div className="absolute bottom-2 left-4 text-[10px] text-slate-500">400nm (UV)</div>
                            <div className="absolute bottom-2 right-4 text-[10px] text-slate-500">1500nm (IR)</div>
                            <div className="absolute top-4 left-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                Absorption Spectrum
                            </div>
                        </div>

                        {/* 4. BOTTOM: Analysis Results */}
                        <div className={`grid grid-cols-2 gap-6 transition-all duration-1000 ${stage === 'result' ? 'opacity-100' : 'opacity-20 blur-sm'}`}>
                            
                            {/* Composition Breakdown */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h4 className="text-[10px] uppercase text-slate-400 mb-3 font-bold tracking-widest">Atmospheric Composition</h4>
                                <div className="space-y-2">
                                    {Object.entries(data.atmo)
                                        .filter(([_, val]) => val > 1)
                                        .sort((a,b) => b[1] - a[1])
                                        .slice(0, 4)
                                        .map(([gas, val]) => (
                                        <div key={gas} className="flex items-center gap-2">
                                            <span className="text-[10px] w-8 font-bold text-slate-300">{gas}</span>
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" 
                                                     style={{ width: `${val}%`, backgroundColor: GAS_SIGNATURES[gas].color }} />
                                            </div>
                                            <span className="text-[10px] w-8 text-right font-mono text-slate-400">{val.toFixed(0)}%</span>
                                        </div>
                                    ))}
                                    {Object.values(data.atmo).every(v => v < 1) && <div className="text-xs text-slate-500 italic">No significant atmosphere detected.</div>}
                                </div>
                            </div>

                            {/* Habitability Score */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
                                <div>
                                    <h4 className="text-[10px] uppercase text-slate-400 mb-1 font-bold tracking-widest">Habitability Index</h4>
                                    <div className="text-4xl font-black text-white tracking-tighter tabular-nums">
                                        {data.score}<span className="text-lg text-slate-500">/100</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-2 line-clamp-2">{data.description}</div>
                                </div>
                                
                                {/* Bio-Markers */}
                                <div className="flex gap-2 mt-4">
                                    {['O2', 'H2O', 'CH4'].map(gas => {
                                        const detected = data.atmo[gas] > 1;
                                        return (
                                            <div key={gas} className={`px-2 py-1 rounded text-[10px] font-bold border ${detected ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-transparent text-slate-600'}`}>
                                                {gas}
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className={`absolute top-0 right-0 p-2`}>
                                    <div className={`w-20 h-20 rounded-full blur-2xl opacity-20 ${data.score > 50 ? 'bg-green-500' : 'bg-red-500'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="h-16 border-t border-white/10 bg-black/20 flex items-center justify-end px-8 gap-4">
                    <button onClick={onDismiss} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest px-4 py-2">
                        Dismiss
                    </button>
                    <button 
                        disabled={stage !== 'result'}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all"
                    >
                        {data.score > 70 ? 'Colonize Planet' : 'Log Discovery'}
                    </button>
                </div>
             </div>
        </div>
    );
};


// --- 3D ASSETS ---

const ScanningRing = () => {
  const ringRef = useRef();
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
      ringRef.current.rotation.z += 0.01;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });
  return (
    <mesh ref={ringRef} rotation={[Math.PI/2, 0, 0]}>
      <ringGeometry args={[10, 10.2, 64]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
};

const EnhancedBlackHole = () => {
    const diskRef = useRef();
    const warpRef = useRef();
    const noiseTex = useMemo(() => createNoiseTexture(), []);
    useEffect(() => () => noiseTex.dispose(), [noiseTex]);
    
    useFrame((state, delta) => {
        if (diskRef.current) diskRef.current.rotation.z -= delta * 0.2;
        if (warpRef.current) {
            warpRef.current.rotation.z -= delta * 0.15;
            // Slight wobble
            warpRef.current.rotation.x = Math.PI/2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group scale={1.5}>
            {/* 1. Event Horizon (The Void) */}
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* 2. Photon Ring (Bright inner edge) */}
            <mesh>
                <ringGeometry args={[1.02, 1.1, 64]} />
                <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
            
            {/* 3. Main Accretion Disk (Flat) */}
            <mesh ref={diskRef} rotation={[Math.PI / 3, 0, 0]}>
                <ringGeometry args={[1.5, 4.5, 128]} />
                <meshBasicMaterial 
                    map={noiseTex}
                    color="#f59e0b"
                    transparent 
                    opacity={0.8} 
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 4. Warped Accretion Disk (The "Halo" effect) 
                Simulating gravitational lensing by adding a vertical ring that aligns with camera view 
            */}
            <mesh ref={warpRef} rotation={[Math.PI/2 + 0.4, 0, 0]}>
                <ringGeometry args={[1.4, 4.2, 128]} />
                <meshBasicMaterial 
                    map={noiseTex}
                    color="#fbbf24"
                    transparent 
                    opacity={0.4} 
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
            
            {/* 5. Volumetric Glow */}
            <mesh scale={5}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#d97706" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
            </mesh>
             
             {/* 6. Jets (Optional) */}
             <mesh position={[0, 4, 0]} rotation={[0,0,0]}>
                <cylinderGeometry args={[0.1, 0.8, 8, 32, 1, true]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
             </mesh>
             <mesh position={[0, -4, 0]} rotation={[Math.PI,0,0]}>
                <cylinderGeometry args={[0.1, 0.8, 8, 32, 1, true]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
             </mesh>

        </group>
    );
};

const Galaxy = ({ radius = 25, count = 20000 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spiral Galaxy Math
      const branchAngle = (i % 2) * Math.PI + Math.random(); // 2 Arms
      const dist = Math.pow(Math.random(), 2) * radius; // Concentrate center
      const spin = dist * 0.8; 
      
      const angle = branchAngle + spin;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = (Math.random() - 0.5) * (Math.max(0.5, 4 - dist * 0.2)); // Thicker center

      // Add randomness/scatter
      const scatter = Math.random() * 0.5 + dist * 0.05;
      
      p[i3] = x + (Math.random()-0.5) * scatter;
      p[i3 + 1] = y;
      p[i3 + 2] = z + (Math.random()-0.5) * scatter;
      
      // Colors: Core = Warm/White, Arms = Blue/Purple
      const color = new THREE.Color();
      const distRatio = dist / radius;
      
      if (distRatio < 0.15) {
          color.setHex(0xffaa88); // Core
      } else {
          color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.5); // Blue arms
      }
      
      colors[i3] = color.r; colors[i3+1] = color.g; colors[i3+2] = color.b;
    }
    return { positions: p, colors };
  }, [radius, count]);

  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.05; 
  });

  return (
    <group ref={groupRef}>
      <EnhancedBlackHole />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={points.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={points.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} sizeAttenuation={true} depthWrite={false} vertexColors blending={THREE.AdditiveBlending} transparent opacity={0.8} />
      </points>
      {/* Dust Clouds */}
      <Sparkles count={500} scale={radius*2} size={6} speed={0} opacity={0.1} color="#60a5fa" />
    </group>
  );
};

const CosmicDust = ({ count = 2000, radius = 100 }) => {
  const texture = useMemo(() => createGlowTexture(), []); 
  useEffect(() => () => texture.dispose(), [texture]);
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Palette matching the pillars but with more yellows/oranges
    const backgroundPalette = [
        new THREE.Color('#7f1d1d'), // Deep Red
        new THREE.Color('#c2410c'), // Orange
        new THREE.Color('#b45309'), // Amber
        new THREE.Color('#fbbf24'), // Yellow
        new THREE.Color('#1e1b4b'), // Deep Indigo
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const r = radius * (0.5 + Math.random() * 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      p[i3] = r * Math.sin(phi) * Math.cos(theta);
      p[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i3 + 2] = r * Math.cos(phi);

      const color = backgroundPalette[Math.floor(Math.random() * backgroundPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    return { positions: p, colors };
  }, [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={points.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={25} 
        vertexColors 
        transparent 
        opacity={0.015} // Very faint
        map={texture} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
};

const DistantNebulas = ({ count = 10 }) => {
  const texture = useMemo(() => createGlowTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const points = useMemo(() => {
    const centers = [];
    for(let i=0; i<count; i++) {
        // Random direction far away
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const dist = 120 + Math.random() * 80; // Closer: 120-200
        centers.push({
            x: dist * Math.sin(phi) * Math.cos(theta),
            y: dist * Math.sin(phi) * Math.sin(theta),
            z: dist * Math.cos(phi),
            color: ['#4c1d95', '#7c2d12', '#064e3b', '#831843'][Math.floor(Math.random()*4)] 
        });
    }

    const particlesPerNebula = 150;
    const totalParticles = count * particlesPerNebula;
    const p = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);
    const sizes = new Float32Array(totalParticles);
    
    let idx = 0;
    centers.forEach(center => {
        const nebulaColor = new THREE.Color(center.color);
        for(let i=0; i<particlesPerNebula; i++) {
            // Cluster around center
            const r = (Math.random() * 25); 
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            p[idx*3] = center.x + r * Math.sin(phi) * Math.cos(theta);
            p[idx*3+1] = center.y + r * Math.sin(phi) * Math.sin(theta);
            p[idx*3+2] = center.z + r * Math.cos(phi);
            
            colors[idx*3] = nebulaColor.r;
            colors[idx*3+1] = nebulaColor.g;
            colors[idx*3+2] = nebulaColor.b;
            
            sizes[idx] = 25 + Math.random() * 25; // Bigger
            idx++;
        }
    });
    
    return { positions: p, colors, sizes };
  }, [count]);

  return (
    <points>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={points.positions.length/3} array={points.positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={points.colors.length/3} array={points.colors} itemSize={3} />
            <bufferAttribute attach="attributes-size" count={points.sizes.length} array={points.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial 
            map={texture} 
            vertexColors 
            transparent 
            opacity={0.12} // Much more visible
            depthWrite={false} 
            blending={THREE.AdditiveBlending} 
            sizeAttenuation
        />
    </points>
  );
};

const BackgroundStars = ({ count = 400 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
        pos: [(Math.random()-0.5)*150, (Math.random()-0.5)*150, (Math.random()-0.5)*150],
        color: ['#ef4444', '#f97316', '#fbbf24', '#ffffff', '#3b82f6'][Math.floor(Math.random()*5)]
    }));
  }, [count]);
  return (
    <>
      {stars.map((star, i) => (
        <mesh key={i} position={star.pos}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={star.color} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
};

const createGlowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
};

const StellarNursery = ({ position }) => {
    const glowTex = useMemo(() => createGlowTexture(), []);
    useEffect(() => () => glowTex.dispose(), [glowTex]);
    
    // Generate 3 pillars
    const pillars = useMemo(() => {
        const _pillars = [];
        // Pillar 1 (Tallest, Left)
        _pillars.push(createPillar({ height: 25, width: 6, pos: [-8, -12, 0], tilt: 0.2, baseColor: '#4338ca' }));
        // Pillar 2 (Medium, Right)
        _pillars.push(createPillar({ height: 18, width: 5, pos: [6, -10, 4], tilt: -0.1, baseColor: '#3b82f6' }));
        // Pillar 3 (Small, Center-Back)
        _pillars.push(createPillar({ height: 12, width: 3.5, pos: [0, -14, -6], tilt: 0.05, baseColor: '#6366f1' }));
        return _pillars;
    }, []);

    // Combine all data for instancing
    const allClouds = useMemo(() => pillars.flatMap(p => p.clouds.map(c => ({...c, parentPos: p.pos, parentTilt: p.tilt}))), [pillars]);
    const allStars = useMemo(() => pillars.flatMap(p => p.stars.map(s => ({...s, parentPos: p.pos, parentTilt: p.tilt}))), [pillars]);

    // Refs for InstancedMeshes
    const cloudMeshRef = useRef();
    const starMeshRef = useRef();
    
    // Setup Instances
    useEffect(() => {
        if (!cloudMeshRef.current || !starMeshRef.current) return;

        const dummy = new THREE.Object3D();

        // 1. CLOUDS
        allClouds.forEach((cloud, i) => {
            dummy.position.set(...cloud.parentPos);
            dummy.rotation.set(0, 0, cloud.parentTilt);
            dummy.updateMatrix(); // Apply parent transform
            
            const localDummy = new THREE.Object3D();
            localDummy.position.set(...cloud.pos);
            localDummy.rotation.set(...cloud.rot);
            localDummy.scale.set(...cloud.scale);
            localDummy.updateMatrix();

            // Combine transforms: Parent * Local
            const combinedMatrix = dummy.matrix.clone().multiply(localDummy.matrix);
            cloudMeshRef.current.setMatrixAt(i, combinedMatrix);
            cloudMeshRef.current.setColorAt(i, new THREE.Color(cloud.color));
        });
        cloudMeshRef.current.instanceMatrix.needsUpdate = true;
        cloudMeshRef.current.instanceColor.needsUpdate = true;

        // 2. STARS (Cores)
        allStars.forEach((star, i) => {
            dummy.position.set(...star.parentPos);
            dummy.rotation.set(0, 0, star.parentTilt);
            dummy.updateMatrix();

            const localDummy = new THREE.Object3D();
            localDummy.position.set(...star.pos);
            localDummy.scale.setScalar(star.size);
            localDummy.updateMatrix();

            const combinedMatrix = dummy.matrix.clone().multiply(localDummy.matrix);
            starMeshRef.current.setMatrixAt(i, combinedMatrix);
            starMeshRef.current.setColorAt(i, new THREE.Color(star.color));
        });
        starMeshRef.current.instanceMatrix.needsUpdate = true;
        starMeshRef.current.instanceColor.needsUpdate = true;

    }, [allClouds, allStars]);

    // Star Glow Points
    const glowPoints = useMemo(() => {
        const positions = new Float32Array(allStars.length * 3);
        const colors = new Float32Array(allStars.length * 3);
        const sizes = new Float32Array(allStars.length);
        
        const dummy = new THREE.Object3D();

        allStars.forEach((star, i) => {
            dummy.position.set(...star.parentPos);
            dummy.rotation.set(0, 0, star.parentTilt);
            dummy.updateMatrix();

            const vec = new THREE.Vector3(...star.pos);
            vec.applyMatrix4(dummy.matrix); // Transform to world space

            positions[i*3] = vec.x;
            positions[i*3+1] = vec.y;
            positions[i*3+2] = vec.z;

            const c = new THREE.Color(star.color);
            colors[i*3] = c.r;
            colors[i*3+1] = c.g;
            colors[i*3+2] = c.b;

            sizes[i] = star.size * 25;
        });
        return { positions, colors, sizes };
    }, [allStars]);

    // Optimized Lights: Only pick a few largest stars to emit real light
    const brightStars = useMemo(() => {
         return allStars
            .filter(s => s.size > 0.1) // Only big ones
            .slice(0, 8) // Max 8 lights
            .map(s => {
                const dummy = new THREE.Object3D();
                dummy.position.set(...s.parentPos);
                dummy.rotation.set(0, 0, s.parentTilt);
                dummy.updateMatrix();
                const vec = new THREE.Vector3(...s.pos);
                vec.applyMatrix4(dummy.matrix);
                return { ...s, worldPos: vec };
            });
    }, [allStars]);

    return (
        <group position={position}>
            {/* INSTANCED CLOUDS (1 Draw Call) */}
            <instancedMesh ref={cloudMeshRef} args={[null, null, allClouds.length]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial 
                    transparent 
                    opacity={0.05} // Lower opacity for density
                    depthWrite={false} 
                    blending={THREE.AdditiveBlending} 
                    side={THREE.DoubleSide}
                />
            </instancedMesh>

            {/* INSTANCED STAR CORES (1 Draw Call) */}
            <instancedMesh ref={starMeshRef} args={[null, null, allStars.length]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>

            {/* STAR GLOWS (Points - 1 Draw Call) */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={allStars.length} array={glowPoints.positions} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={allStars.length} array={glowPoints.colors} itemSize={3} />
                    <bufferAttribute attach="attributes-size" count={allStars.length} array={glowPoints.sizes} itemSize={1} />
                </bufferGeometry>
                <pointsMaterial 
                    map={glowTex} 
                    transparent 
                    opacity={0.6} 
                    vertexColors 
                    blending={THREE.AdditiveBlending} 
                    depthWrite={false}
                    sizeAttenuation 
                />
            </points>

            {/* REAL LIGHTS (Limited Count) */}
            {brightStars.map((s, i) => (
                <pointLight key={i} position={s.worldPos} color={s.color} intensity={0.8} distance={6} decay={2} />
            ))}

        </group>
    );
};

// Helper to generate a single pillar data
const createPillar = ({ height, width, pos, tilt, baseColor }) => {
    const clouds = [];
    const stars = [];
    const count = height * 10; // High density
    
    const palette = [
        '#7f1d1d', // Red 900
        '#991b1b', // Red 800
        '#c2410c', // Orange 700
        '#b45309', // Amber 700
        '#312e81', // Indigo 900 (Shadows)
        baseColor
    ];

    for (let i = 0; i < count; i++) {
        const yRatio = i / count; // 0 (bottom) to 1 (top)
        const currentY = yRatio * height;
        
        // Taper width: wide at bottom, narrow at top
        // Add waviness to the column
        const wave = Math.sin(yRatio * Math.PI * 3) * 0.5;
        const currentWidth = (width * (1 - yRatio * 0.5)) + wave; 
        
        // Jitter position
        const x = (Math.random() - 0.5) * currentWidth;
        const z = (Math.random() - 0.5) * currentWidth;
        const y = currentY + (Math.random() - 0.5);

        // Irregular Scaling for "Wisps"
        const scale = [
            1 + Math.random() * 2, 
            0.5 + Math.random(), 
            1 + Math.random() * 2
        ];

        // Color Variation
        const color = palette[Math.floor(Math.random() * palette.length)];
        
        clouds.push({
            pos: [x, y, z],
            scale: scale,
            rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
            opacity: 0.08 + Math.random() * 0.05, // Increased visibility
            color: color
        });
    }

    // Add stars (Star birth)
    const starCount = Math.floor(height * 0.7); // Significantly reduced density
    for(let s=0; s<starCount; s++) {
        // Bias towards top
        const yBias = Math.pow(Math.random(), 0.5); // Sqrt to push towards 1
        
        const starPos = [
            (Math.random()-0.5) * width * (1.2 - yBias * 0.5), // Tighter at top
            (yBias * height) + (Math.random() - 0.5), 
            (Math.random()-0.5) * width * 0.5
        ];

        // Richer Star Palette
        const starColors = [
            '#60a5fa', '#93c5fd', '#bae6fd', // Blues
            '#ffffff', '#f8fafc',           // White/Silver
            '#fef08a', '#fbbf24', '#f59e0b', // Yellow/Gold
            '#fb7185', '#f43f5e',           // Pinks/Reds
            '#c084fc', '#a855f7'            // Purples
        ];
        const starColor = starColors[Math.floor(Math.random() * starColors.length)];

        stars.push({
            pos: starPos,
            size: 0.02 + Math.random() * 0.08, 
            color: starColor
        });
    }

    return { pos, tilt, clouds, stars };
};


const CameraController = ({ era, controlsRef }) => {
  const { camera } = useThree();
  const transitioning = useRef(false);
  const lastEra = useRef(null);

  // Trigger transition when era changes
  useEffect(() => {
    if (lastEra.current !== era) {
        transitioning.current = true;
        lastEra.current = era;
    }
  }, [era]);

  useFrame((state, delta) => {
      if (!transitioning.current) return;

      const setting = CAMERA_SETTINGS[era];
      const targetPos = new THREE.Vector3(...setting.pos);
      const lookAt = new THREE.Vector3(...setting.target);
      
      camera.position.lerp(targetPos, 2 * delta);
      
      if (controlsRef.current) {
          controlsRef.current.target.lerp(lookAt, 2 * delta);
          controlsRef.current.update();
      } else {
          state.camera.lookAt(lookAt);
      }

      if (camera.position.distanceTo(targetPos) < 0.1) {
          transitioning.current = false;
      }
  });
  return null;
};

// --- MAIN UNIVERSE COMPONENT ---

const Universe = () => {
  const { introComplete, setIntroComplete } = useStore();
  const { triggerBigBang } = useInventory();
  const [isCinematicPlaying, setIsCinematicPlaying] = useState(false);
  const [activeEra, setActiveEra] = useState(ERAS.GALAXY);
  
  // Habitat Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  const videoRef = useRef();
  const controlsRef = useRef();

  const handleInitiate = () => {
    setIsCinematicPlaying(true);
    if (videoRef.current) videoRef.current.play();
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Generate new planet
    const target = generateExoplanet();
    
    // Pass target immediately to HUD; HUD handles the "Scanning -> Analyzed" animation timing
    setScanResult(target);
  };
  
  const handleDismissScan = () => {
    setIsScanning(false);
    setScanResult(null);
  };

  const onVideoEnd = () => {
    setIsCinematicPlaying(false);
    setIntroComplete(true);
    triggerBigBang();
    setActiveEra(ERAS.GALAXY);
  };

  return (
    <div className="w-full h-full bg-[#020617] relative overflow-hidden font-mono select-none">
      
      {/* HUD OVERLAYS */}
      {isScanning && scanResult && (
         <SpectroscopyHUD data={scanResult} onDismiss={handleDismissScan} />
      )}

      {/* VIEW CONTROLS */}
      {introComplete && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-6 pointer-events-none">
            
            {/* Scanner Button (Only in Stellar Era) */}
            <div className="h-16 flex items-center justify-center pointer-events-auto">
                {activeEra === ERAS.STELLAR && !isScanning && (
                    <button 
                        onClick={handleScan}
                        className="group relative px-8 py-3 bg-slate-900/80 backdrop-blur border border-blue-500/30 rounded-full overflow-hidden transition-all hover:scale-105 hover:border-blue-400 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                    >
                        <div className="absolute inset-0 bg-blue-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 font-black uppercase text-[10px] tracking-[0.2em] text-blue-200 group-hover:text-white flex items-center gap-2">
                            <span className="text-lg">🔭</span> Initiate Long-Range Scan
                        </span>
                    </button>
                )}
            </div>

            {/* Era Switcher */}
            <div className="flex gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 pointer-events-auto shadow-2xl">
                {Object.values(ERAS).map((era) => (
                    <button 
                        key={era}
                        onClick={() => setActiveEra(era)} 
                        className={`
                            px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300
                            ${activeEra === era 
                                ? 'bg-white text-black shadow-lg scale-105' 
                                : 'text-slate-500 hover:text-white hover:bg-white/10'}
                        `}
                    >
                        {era === ERAS.GALAXY ? 'Galactic Core' : 'Local Cluster'}
                    </button>
                ))}
            </div>
        </div>
      )}


      {/* INTRO SEQUENCER */}
      {!introComplete && !isCinematicPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40 backdrop-blur-md">
            <h1 className="text-8xl font-black mb-4 text-white tracking-tighter animate-pulse">SINGULARITY</h1>
            <button onClick={handleInitiate} className="px-16 py-6 bg-white text-black font-black text-xl hover:scale-110 transition-all duration-500 rounded-full shadow-[0_0_100px_white]">INITIATE</button>
        </div>
      )}

      {isCinematicPlaying && (
        <video ref={videoRef} src="/big_bang.mp4" className="absolute inset-0 w-full h-full object-cover z-[100]" onEnded={onVideoEnd} autoPlay muted={false} />
      )}

      {/* 3D SCENE */}
      <Canvas shadows camera={{ position: [0, 0, 20], fov: 45 }} gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <color attach="background" args={['#000']} />
        
        <Suspense fallback={null}>
          <CameraController era={activeEra} controlsRef={controlsRef} />

          {introComplete && (
            <>
              <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />
              
              <group visible={activeEra === ERAS.GALAXY}>
                <Galaxy radius={25} count={20000} />
              </group>

              <group visible={activeEra === ERAS.STELLAR}>
                {isScanning && <ScanningRing />}
                <CosmicDust count={2000} radius={100} />
                <DistantNebulas />
                <StellarNursery position={[5, 2, -5]} />
                <BackgroundStars count={400} />
              </group>
            </>
          )}
        </Suspense>

        <OrbitControls ref={controlsRef} enablePan={false} maxDistance={100} minDistance={3} enableZoom={true} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4338ca" />
        <pointLight position={[-10, -5, -10]} intensity={2} color="#fbbf24" />
      </Canvas>
    </div>
  );
};

export default Universe;