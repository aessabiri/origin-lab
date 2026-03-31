import React, { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text, ContactShadows, PresentationControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { MATTER_DEFINITIONS } from '../constants/matterRegistry';
import { MOLECULE_RECIPES } from '../constants/moleculeRecipes';

// Optimization: Shared geometries
const atomGeometry = new THREE.SphereGeometry(1, 32, 32);
const bondGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 16);

const Atom = ({ position, color, label, size = 1 }) => {
  return (
    <group position={position}>
      <mesh geometry={atomGeometry} scale={[size, size, size]} castShadow>
        <meshStandardMaterial 
            color={color} 
            roughness={0.1} 
            metalness={0.8}
            emissive={color}
            emissiveIntensity={0.2}
        />
      </mesh>
      <Text
        position={[0, 0, size + 0.2]}
        fontSize={size * 0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {label}
      </Text>
    </group>
  );
};

const Bond = ({ start, end, type = 'single' }) => {
  const midPoint = useMemo(() => new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5), [start, end]);
  const distance = useMemo(() => start.distanceTo(end), [start, end]);
  const direction = useMemo(() => new THREE.Vector3().subVectors(end, start).normalize(), [start, end]);
  
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    q.setFromUnitVectors(up, direction);
    return q;
  }, [direction]);

  return (
    <mesh 
      position={midPoint} 
      quaternion={quaternion} 
      geometry={bondGeometry}
      scale={[1, distance, 1]}
      castShadow
    >
      <meshStandardMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.8} 
        roughness={0} 
        metalness={1} 
      />
    </mesh>
  );
};

const MoleculeModel = ({ itemId }) => {
  const groupRef = useRef();

  const structure = useMemo(() => {
    const recipe = MOLECULE_RECIPES.find(r => r.type === itemId);
    if (!recipe || !recipe.structure) {
        return { nodes: [{ id: 'core', type: itemId }], edges: [] };
    }
    return recipe.structure;
  }, [itemId]);

  const nodesWithPositions = useMemo(() => {
    const count = structure.nodes.length;
    
    // Better 3D mapping for molecular shapes
    return structure.nodes.map((node, i) => {
      let pos;
      if (count === 1) {
        pos = new THREE.Vector3(0, 0, 0);
      } else {
        // Spherical distribution for a more "molecular" look
        const phi = Math.acos(-1 + (2 * i) / (count - 1 || 1));
        const theta = Math.sqrt(count * Math.PI) * phi;
        const radius = Math.max(4, Math.sqrt(count) * 2.5);
        
        pos = new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      }
      
      const info = MATTER_DEFINITIONS[node.type] || { color: '#ffffff', name: '?' };

      return {
        ...node,
        pos,
        color: info.color,
        label: info.name.substring(0, 2)
      };
    });
  }, [structure]);

  const edges = useMemo(() => {
    return structure.edges.map(edge => {
      const startNode = nodesWithPositions.find(n => n.id === edge.source);
      const endNode = nodesWithPositions.find(n => n.id === edge.target);
      if (!startNode || !endNode) return null;
      return { start: startNode.pos, end: endNode.pos, type: edge.type };
    }).filter(Boolean);
  }, [nodesWithPositions, structure.edges]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {nodesWithPositions.map((node) => (
        <Atom key={node.id} position={node.pos} color={node.color} label={node.label} size={1.2} />
      ))}
      {edges.map((edge, i) => (
        <Bond key={i} start={edge.start} end={edge.end} type={edge.type} />
      ))}
    </group>
  );
};

const Spectroscope3D = ({ itemId }) => {
  if (!itemId) return null;

  return (
    <div className="w-full h-full min-h-[400px] bg-slate-950 rounded-3xl overflow-hidden relative border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* UI Overlay */}
      <div className="absolute top-6 left-8 z-10 pointer-events-none">
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/60">Molecular Resonance Scan</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">{MATTER_DEFINITIONS[itemId]?.name || 'Unknown'}</h2>
        </div>
        <div className="mt-4 flex items-center gap-3">
            <div className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[10px] font-mono text-cyan-400">STRUCT_STABLE</span>
            </div>
            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-cyan-500 animate-pulse" />
            </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-8 z-10 pointer-events-none">
         <p className="text-[10px] text-white/30 font-mono">DRAG TO ROTATE // SCROLL TO ZOOM</p>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={45} />
        
        <Suspense fallback={null}>
            <PresentationControls
                global
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                rotation={[0, 0.3, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <MoleculeModel itemId={itemId} />
                </Float>
            </PresentationControls>

            <ContactShadows 
                position={[0, -10, 0]} 
                opacity={0.4} 
                scale={40} 
                blur={2} 
                far={15} 
                resolution={256} 
                color="#000000" 
            />
            
            <Environment preset="city" />
        </Suspense>

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" castShadow />
        <spotLight position={[-10, 20, 10]} angle={0.12} penumbra={1} intensity={2} castShadow color="#60a5fa" />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        <OrbitControls enablePan={false} makeDefault minDistance={10} maxDistance={40} />
      </Canvas>

      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-950/50" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.4)_100%)]" />
    </div>
  );
};

export default Spectroscope3D;
