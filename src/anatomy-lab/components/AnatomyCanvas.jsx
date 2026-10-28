import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { createMedicalMaterials } from '../utils/MedicalMaterials.js';
import { useAnatomyStore } from '../store.js';
import { ALL_206_BONES } from '../data/humanSkeletalDatabase.js';

const AnatomyCanvas = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Mesh and Node References
  const humanGroupRef = useRef(null);
  const skeletalMeshesRef = useRef([]);
  const muscleMeshesRef = useRef([]);
  const layerSkeletalRef = useRef(null);
  const layerMusclesRef = useRef(null);
  const layerLigamentsRef = useRef(null);
  const layerNervesRef = useRef(null);
  const layerVascularRef = useRef(null);
  const materialsRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState('Mounting Clinical Viewport...');

  const assembledBones = useAnatomyStore(state => state.assembledBones);
  const assembleBone = useAnatomyStore(state => state.assembleBone);
  const selectedBoneId = useAnatomyStore(state => state.selectedBoneId);
  const setSelectedBoneId = useAnatomyStore(state => state.setSelectedBoneId);
  const layerVisibility = useAnatomyStore(state => state.layerVisibility);
  const postureParams = useAnatomyStore(state => state.postureParams);
  const overactiveMuscles = useAnatomyStore(state => state.overactiveMuscles);
  const underactiveMuscles = useAnatomyStore(state => state.underactiveMuscles);

  // 1. Initialize Scene, Lights, Camera & PBR Renderer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);
    scene.fog = new THREE.FogExp2(0x06080e, 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.95, 3.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.9, 0);
    controls.maxDistance = 6.0;
    controls.minDistance = 0.4;
    controlsRef.current = controls;

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
    fillLight.position.set(-3, 2, -1);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    // Floor Grid & Shadow Catcher
    const gridHelper = new THREE.GridHelper(6, 20, 0x0891b2, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Root Assembly Hierarchies
    const humanGroup = new THREE.Group();
    humanGroup.name = 'HumanAssemblyMaster';
    scene.add(humanGroup);
    humanGroupRef.current = humanGroup;

    const layerSkeletal = new THREE.Group();
    const layerLigaments = new THREE.Group();
    const layerMuscles = new THREE.Group();
    const layerNerves = new THREE.Group();
    const layerVascular = new THREE.Group();

    humanGroup.add(layerSkeletal);
    humanGroup.add(layerLigaments);
    humanGroup.add(layerMuscles);
    humanGroup.add(layerNerves);
    humanGroup.add(layerVascular);

    layerSkeletalRef.current = layerSkeletal;
    layerLigamentsRef.current = layerLigaments;
    layerMusclesRef.current = layerMuscles;
    layerNervesRef.current = layerNerves;
    layerVascularRef.current = layerVascular;

    const materials = createMedicalMaterials();
    materialsRef.current = materials;

    // Load Medical GLB Models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loadModels = async () => {
      try {
        setLoadStatus('Loading LUMC Clinical Skeleton Scan (3.2 MB)...');
        const skeletonGltf = await new Promise((resolve, reject) => {
          gltfLoader.load('/models/lumc_skeleton.glb', resolve, undefined, reject);
        });

        setLoadStatus('Loading Muscular Anatomy Atlas (1.5 MB)...');
        const fullbodyGltf = await new Promise((resolve, reject) => {
          gltfLoader.load('/models/fullbody.glb', resolve, undefined, reject);
        });

        setLoadStatus('Assembling 206-Bone Interactive Rig...');
        const skelScene = skeletonGltf.scene;
        const meshes = [];

        skelScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            meshes.push(child);
          }
        });

        // Mirror Left Limbs if model contains unilateral right scan
        const mirroredLimbs = new THREE.Group();
        mirroredLimbs.name = 'MirroredLeftSkeleton';
        mirroredLimbs.scale.x = -1;

        skelScene.traverse((child) => {
          if (child.isMesh && (child.name.endsWith('.r') || child.name.toLowerCase().includes('right'))) {
            const clone = new THREE.Mesh(child.geometry, child.material);
            clone.position.copy(child.position);
            clone.rotation.copy(child.rotation);
            clone.scale.copy(child.scale);
            clone.name = child.name.replace(/\.r/g, '.l');
            mirroredLimbs.add(clone);
            meshes.push(clone);
          }
        });

        layerSkeletal.add(skelScene);
        layerSkeletal.add(mirroredLimbs);
        skeletalMeshesRef.current = meshes;

        // Process Muscle Meshes
        const muscleMeshes = [];
        fullbodyGltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material = materials.striatedMuscle;
            muscleMeshes.push(child);
          }
        });
        layerMuscles.add(fullbodyGltf.scene);
        muscleMeshesRef.current = muscleMeshes;

        // Normalize Human Height to 1.75m
        const bbox = new THREE.Box3().setFromObject(humanGroup);
        const size = bbox.getSize(new THREE.Vector3());
        const scaleFactor = 1.75 / (size.y > 0 ? size.y : 1.75);
        humanGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
        humanGroup.position.set(0, -bbox.min.y * scaleFactor, 0);

        setIsLoading(false);
      } catch (err) {
        console.error('Anatomy Viewport Load Error:', err);
        setIsLoading(false);
      }
    };

    loadModels();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = 0;
    const animate = (time) => {
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      controls.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      dracoLoader.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Sync Layer Visibility
  useEffect(() => {
    if (layerSkeletalRef.current) layerSkeletalRef.current.visible = !!layerVisibility.skeleton;
    if (layerLigamentsRef.current) layerLigamentsRef.current.visible = !!layerVisibility.ligaments;
    if (layerMusclesRef.current) layerMusclesRef.current.visible = !!layerVisibility.muscles;
    if (layerNervesRef.current) layerNervesRef.current.visible = !!layerVisibility.nerves;
    if (layerVascularRef.current) layerVascularRef.current.visible = !!layerVisibility.circulation;
  }, [layerVisibility]);

  // 3. Update Bone Materials (Assembled vs. Ghost vs. Selected)
  useEffect(() => {
    const materials = materialsRef.current;
    if (!materials) return;

    skeletalMeshesRef.current.forEach((mesh) => {
      const name = (mesh.name || '').toLowerCase();
      // Match mesh name against assembled database
      const matchedBone = ALL_206_BONES.find(b => 
        name.includes(b.id) || (b.meshNode && name.includes(b.meshNode)) || name.includes(b.name.toLowerCase())
      );

      const isAssembled = matchedBone ? assembledBones.includes(matchedBone.id) : (assembledBones.length > 50);
      const isSelected = matchedBone && matchedBone.id === selectedBoneId;

      if (isSelected) {
        mesh.material = materials.boneSelected;
      } else if (isAssembled) {
        mesh.material = materials.corticalBone;
      } else {
        mesh.material = materials.ghostBone;
      }
    });
  }, [assembledBones, selectedBoneId]);

  // 4. Update Dynamic Muscle Strain Heatmap
  useEffect(() => {
    const materials = materialsRef.current;
    if (!materials) return;

    muscleMeshesRef.current.forEach((mesh) => {
      const name = (mesh.name || '').toLowerCase();
      if (overactiveMuscles.some(m => name.includes(m.toLowerCase()))) {
        mesh.material = materials.muscleTight;
      } else if (underactiveMuscles.some(m => name.includes(m.toLowerCase()))) {
        mesh.material = materials.muscleWeak;
      } else {
        mesh.material = materials.striatedMuscle;
      }
    });
  }, [overactiveMuscles, underactiveMuscles]);

  // 5. Click-to-Pick Raycaster
  const handlePointerDown = useCallback((e) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(skeletalMeshesRef.current, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const hitName = (hit.name || '').toLowerCase();

      const bone = ALL_206_BONES.find(b => 
        hitName.includes(b.id) || (b.meshNode && hitName.includes(b.meshNode)) || hitName.includes(b.name.toLowerCase())
      );

      if (bone) {
        setSelectedBoneId(bone.id);
        if (!assembledBones.includes(bone.id)) {
          assembleBone(bone.id);
        }
      }
    }
  }, [assembledBones, assembleBone, setSelectedBoneId]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#06080e]" onPointerDown={handlePointerDown}>
      <div ref={containerRef} className="w-full h-full cursor-pointer" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#06080e]/95 backdrop-blur-md flex flex-col items-center justify-center font-mono gap-3 z-30 select-none">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold">{loadStatus}</span>
          <span className="text-[10px] text-slate-500">Preparing Leiden University Clinical CT Scan...</span>
        </div>
      )}

      {/* Viewport Floating Watermark */}
      <div className="absolute bottom-4 left-6 pointer-events-none select-none text-[9px] font-mono text-slate-500">
        Leiden University Medical Center (LUMC) Clinical Musculoskeletal Atlas
      </div>
    </div>
  );
};

export default React.memo(AnatomyCanvas);
