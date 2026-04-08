import React, { useMemo, useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Float, 
  PresentationControls, 
  BakeShadows,
  Points,
  PointMaterial,
  useGLTF,
  MeshTransmissionMaterial,
  Center
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  Noise, 
  Vignette, 
  ChromaticAberration
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { MATTER_DEFINITIONS } from '../constants/matterRegistry';
import { MOLECULE_RECIPES } from '../constants/moleculeRecipes';

// --- Quantum Constants ---
const POINTS_PER_ATOM = 800; 
const JITTER_STRENGTH = 1.5;
const ATOM_SPACING_FACTOR = 2.2; 

// --- Smart Model Loader (Handles AI-generated meshes) ---
const ExternalModel = ({ url, color }) => {
  const { scene } = useGLTF(url);
  
  // Apply our Clockwork "Jelly" look to the AI mesh
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // We replace the AI material with our high-end one
        child.material = new THREE.MeshPhysicalMaterial({
          color: color,
          transmission: 1,
          thickness: 2,
          roughness: 0.2,
          ior: 1.5,
          attenuationColor: color,
          attenuationDistance: 0.5,
          clearcoat: 1
        });
      }
    });
  }, [scene, color]);

  return <primitive object={scene} scale={2} />;
};

// --- The Quantum Space-Filling Component (Procedural Fallback) ---
const QuantumMolecule = ({ itemId }) => {
  const pointsRef = useRef();
  
  const structure = useMemo(() => {
    const recipe = MOLECULE_RECIPES.find(r => r.type === itemId);
    if (!recipe || !recipe.structure) {
        return { nodes: [{ id: 'core', type: itemId }], edges: [] };
    }
    return recipe.structure;
  }, [itemId]);

  const { positions, colors } = useMemo(() => {
    const nodeCount = structure.nodes.length;
    const totalPoints = nodeCount * POINTS_PER_ATOM;
    
    const posArr = new Float32Array(totalPoints * 3);
    const colArr = new Float32Array(totalPoints * 3);
    
    const nodes = structure.nodes.map((node) => ({
        ...node,
        pos: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5),
        color: new THREE.Color(MATTER_DEFINITIONS[node.type]?.color || '#ffffff')
    }));

    // FIXED: Corrected loop variable from 'i' to 'iter'
    for (let iter = 0; iter < 50; iter++) {
        structure.edges.forEach(edge => {
            const a = nodes.find(n => n.id === edge.source);
            const b = nodes.find(n => n.id === edge.target);
            if (!a || !b) return;
            const delta = b.pos.clone().sub(a.pos);
            const dist = delta.length();
            const target = ATOM_SPACING_FACTOR;
            const force = (dist - target) * 0.5;
            const move = delta.normalize().multiplyScalar(force);
            a.pos.add(move);
            b.pos.sub(move);
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                const delta = b.pos.clone().sub(a.pos);
                const dist = delta.length();
                if (dist < ATOM_SPACING_FACTOR * 0.8) {
                    const force = (ATOM_SPACING_FACTOR * 0.8 - dist) * 0.5;
                    const move = delta.normalize().multiplyScalar(force);
                    a.pos.sub(move);
                    b.pos.add(move);
                }
            }
        }
    }

    let pointer = 0;
    nodes.forEach(node => {
        for (let i = 0; i < POINTS_PER_ATOM; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = (Math.random() ** 2) * JITTER_STRENGTH * 1.8;
            posArr[pointer * 3] = node.pos.x + r * Math.sin(phi) * Math.cos(theta);
            posArr[pointer * 3 + 1] = node.pos.y + r * Math.sin(phi) * Math.sin(theta);
            posArr[pointer * 3 + 2] = node.pos.z + r * Math.cos(phi);
            colArr[pointer * 3] = node.color.r;
            colArr[pointer * 3 + 1] = node.color.g;
            colArr[pointer * 3 + 2] = node.color.b;
            pointer++;
        }
    });

    return { positions: posArr, colors: colArr };
  }, [itemId, structure]);

  useFrame((state) => {
    if (pointsRef.current) {
        const t = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = t * 0.15;
        pointsRef.current.material.size = 0.15 + Math.sin(t * 12) * 0.03;
    }
  });

  return (
    <group scale={1.2}>
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
        <PointMaterial transparent vertexColors size={0.18} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
      </Points>
    </group>
  );
};

// --- Error Boundary for 3D Loading ---
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <QuantumMolecule itemId={this.props.itemId} />;
    return this.props.children;
  }
}

// --- Main Container ---
const Spectroscope3D = ({ itemId }) => {
  const [hasModel, setHasModel] = useState(false);
  const modelUrl = `/models/${itemId}.glb`;

  // Check if a 3D model exists for this item
  useEffect(() => {
    setHasModel(false);
    // Robust check: ensure it's not returning an HTML page (common in SPA dev servers)
    fetch(modelUrl, { method: 'GET' })
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && !contentType.includes('text/html')) {
            setHasModel(true);
        } else {
            setHasModel(false);
        }
      })
      .catch(() => setHasModel(false));
  }, [itemId, modelUrl]);

  if (!itemId) return null;

  return (
    <div className="w-full h-full min-h-[600px] bg-black rounded-[3rem] overflow-hidden relative border border-white/5 shadow-2xl">
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 p-12 z-10 pointer-events-none flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_15px_#06b6d4] animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-400/60 font-bold tracking-[0.6em] uppercase">
                        {hasModel ? 'Neural_Mesh_Active' : 'Density_Field_Analysis'}
                    </span>
                </div>
                <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                    {MATTER_DEFINITIONS[itemId]?.name || 'Unknown'}
                </h2>
            </div>
        </div>

        <div className="flex justify-between items-end">
            <div className="max-w-xs space-y-4">
                <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1">Observation_Depth</span>
                    <span className="text-xl font-mono text-cyan-400 font-bold tracking-tight italic">
                        {hasModel ? 'MACROSCOPIC' : 'QUANTUM'}
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
        <color attach="background" args={['#000000']} />
        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={30} />
        
        <Suspense fallback={null}>
            <PresentationControls
                global
                config={{ mass: 5, tension: 200, friction: 40 }}
                snap={{ mass: 10, tension: 1000 }} 
                rotation={[0, 0.5, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.2, Math.PI / 1.2]}
            >
                <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                    <Center>
                        <ModelErrorBoundary key={itemId} itemId={itemId}>
                            {hasModel ? (
                                <ExternalModel url={modelUrl} color={MATTER_DEFINITIONS[itemId]?.color} />
                            ) : (
                                <QuantumMolecule itemId={itemId} />
                            )}
                        </ModelErrorBoundary>
                    </Center>
                </Float>
            </PresentationControls>

            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom luminanceThreshold={0.1} mipmapBlur intensity={2.2} radius={0.5} />
                <ChromaticAberration offset={[0.002, 0.002]} />
                <Noise opacity={0.15} />
                <Vignette eskil={false} offset={0.1} darkness={1.3} />
            </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Spectroscope3D;
