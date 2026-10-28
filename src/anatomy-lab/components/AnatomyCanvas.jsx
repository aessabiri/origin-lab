import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { createMedicalMaterials } from '../utils/MedicalMaterials.js';
import { matchMeshToBone } from '../utils/boneMatcher.js';
import {
  createProceduralMicroBones,
  createCartilageAndLigamentsLayer,
  createVascularLoopLayer,
  createNeuralConnectomeLayer
} from '../utils/anatomicalLayers.js';
import { useAnatomyStore } from '../store.js';
import { ALL_206_BONES } from '../data/humanSkeletalDatabase.js';

const AnatomyCanvas = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Mesh and Layer References
  const humanGroupRef = useRef(null);
  const skeletalMeshesRef = useRef([]);
  const muscleMeshesRef = useRef([]);
  const layerSkeletalRef = useRef(null);
  const layerMusclesRef = useRef(null);
  const layerLigamentsRef = useRef(null);
  const layerNervesRef = useRef(null);
  const layerVascularRef = useRef(null);
  const materialsRef = useRef(null);

  // Animated Components
  const heartMeshRef = useRef(null);
  const synPointsRef = useRef(null);
  const shockwaveMeshRef = useRef(null);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.9, 0));

  // Kinematic Joint Group References
  const kinematicJointsRef = useRef({
    pelvis: null,
    lumbar: [],
    thoracic: [],
    cervical: [],
    head: null,
    mandible: null,
    leftShoulder: null,
    rightShoulder: null,
    leftFemur: null,
    rightFemur: null,
  });

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
  const vitalSigns = useAnatomyStore(state => state.vitalSigns);

  // 1. Initialize Scene, Camera, Renderer, Layers & Models
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
    controls.minDistance = 0.35;
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

    // Shockwave Ring for Bone Assembly Feedback
    const shockwaveGeo = new THREE.RingGeometry(0.01, 0.04, 32);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.visible = false;
    scene.add(shockwaveMesh);
    shockwaveMeshRef.current = shockwaveMesh;

    // Root Master Group
    const humanGroup = new THREE.Group();
    humanGroup.name = 'HumanAssemblyMaster';
    scene.add(humanGroup);
    humanGroupRef.current = humanGroup;

    // Layer Hierarchies
    const layerSkeletal = new THREE.Group();
    layerSkeletal.name = 'LayerSkeletal';
    const layerLigaments = new THREE.Group();
    layerLigaments.name = 'LayerLigaments';
    const layerMuscles = new THREE.Group();
    layerMuscles.name = 'LayerMuscles';
    const layerNerves = new THREE.Group();
    layerNerves.name = 'LayerNerves';
    const layerVascular = new THREE.Group();
    layerVascular.name = 'LayerVascular';

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

        // 1. Process Unilateral Right & Axial Bones
        skelScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const bone = matchMeshToBone(child.name);
            if (bone) {
              child.userData.boneId = bone.id;
            }
            if (child.name.toLowerCase().includes('cart')) {
              child.material = materials.hyalineCartilage;
              layerLigaments.add(child.clone());
            } else {
              meshes.push(child);
            }
          }
        });

        // 2. Mirror Left Limbs
        const mirroredLimbs = new THREE.Group();
        mirroredLimbs.name = 'MirroredLeftSkeleton';
        mirroredLimbs.scale.x = -1;

        skelScene.traverse((child) => {
          if (child.isMesh && (child.name.endsWith('.r') || child.name.toLowerCase().includes('right'))) {
            const clone = new THREE.Mesh(child.geometry, child.material);
            clone.position.copy(child.position);
            clone.rotation.copy(child.rotation);
            clone.scale.copy(child.scale);
            clone.name = child.name.replace(/\.r/g, '.l').replace(/right/gi, 'left');
            const bone = matchMeshToBone(clone.name);
            if (bone) {
              clone.userData.boneId = bone.id;
            }
            if (child.name.toLowerCase().includes('cart')) {
              clone.material = materials.hyalineCartilage;
              layerLigaments.add(clone);
            } else {
              mirroredLimbs.add(clone);
              meshes.push(clone);
            }
          }
        });

        layerSkeletal.add(skelScene);
        layerSkeletal.add(mirroredLimbs);

        // 3. Ingest Procedural Micro-Bones (Auditory ossicles & hyoid bone)
        const microBones = createProceduralMicroBones(materials);
        layerSkeletal.add(microBones.group);
        microBones.meshes.forEach((m) => {
          const bone = matchMeshToBone(m.name);
          if (bone) m.userData.boneId = bone.id;
          meshes.push(m);
        });
        skeletalMeshesRef.current = meshes;

        // 4. Ingest Procedural Cartilage & Ligaments
        const cartilageLayer = createCartilageAndLigamentsLayer(materials);
        layerLigaments.add(cartilageLayer);

        // 5. Ingest Muscular Layer
        const muscleMeshes = [];
        fullbodyGltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material = materials.striatedMuscle;
            muscleMeshes.push(child);
          }
        });
        layerMuscles.add(fullbodyGltf.scene);
        muscleMeshesRef.current = muscleMeshes;

        // 6. Ingest Pulsatile Vascular Loop Layer
        const vascular = createVascularLoopLayer(materials);
        layerVascular.add(vascular.group);
        heartMeshRef.current = vascular.heartMesh;

        // 7. Ingest Neural Connectome Layer
        const neural = createNeuralConnectomeLayer(materials);
        layerNerves.add(neural.group);
        synPointsRef.current = neural.synPoints;

        // 8. Cache Joint Pointers for Kinematics
        const kJoints = kinematicJointsRef.current;
        skelScene.traverse((node) => {
          const n = (node.name || '').toLowerCase();
          if (n.includes('hip') || n.includes('pelvis')) kJoints.pelvis = node;
          if (n.includes('lumbar')) kJoints.lumbar.push(node);
          if (n.includes('thoracic')) kJoints.thoracic.push(node);
          if (n.includes('cervical')) kJoints.cervical.push(node);
          if (n.includes('frontal') || n.includes('occipital')) kJoints.head = node;
          if (n.includes('mandible')) kJoints.mandible = node;
          if (n.includes('femur.r')) kJoints.rightFemur = node;
        });

        // 9. Normalize Scale to Standard Anatomical Standing Height (1.75m)
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
    let shockwaveTime = 0;

    const animate = (time) => {
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // 1. Orbit Controls damping
      controls.update();

      // 2. Camera target smooth interpolation
      controls.target.lerp(cameraTargetRef.current, 0.08);

      // 3. Pulsatile Heartbeat Animation (Synced to BPM)
      if (heartMeshRef.current) {
        const bpm = vitalSigns.heartRate > 0 ? vitalSigns.heartRate : 60;
        const freq = (bpm / 60) * Math.PI * 2;
        const pulse = Math.sin(time * 0.001 * freq);
        const s = 1.0 + Math.max(0, pulse) * 0.12;
        heartMeshRef.current.scale.set(s, s, s);
      }

      // 4. Synaptic Action Potentials Glow Animation
      if (synPointsRef.current) {
        synPointsRef.current.rotation.y += delta * 0.15;
      }

      // 5. Shockwave Expansion Feedback
      if (shockwaveMeshRef.current && shockwaveMeshRef.current.visible) {
        shockwaveTime += delta;
        const currentScale = 1.0 + shockwaveTime * 3.5;
        shockwaveMeshRef.current.scale.set(currentScale, currentScale, currentScale);
        shockwaveMeshRef.current.material.opacity = Math.max(0, 0.8 - shockwaveTime * 2.2);
        if (shockwaveTime > 0.4) {
          shockwaveMeshRef.current.visible = false;
        }
      }

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
  }, [vitalSigns.heartRate]);

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
      const boneId = mesh.userData.boneId;
      const matchedBone = boneId ? ALL_206_BONES.find(b => b.id === boneId) : matchMeshToBone(mesh.name);

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

  // 5. Closed-Chain Kinematic Posture Deformation
  useEffect(() => {
    const k = kinematicJointsRef.current;
    if (!k.pelvis) return;

    const {
      pelvisTilt = 0,
      pelvisDrop = 0,
      pelvisRotation = 0,
      lumbarLordosis = 0,
      thoracicKyphosis = 0,
      cervicalForwardHead = 0,
      rightKneeValgus = 0,
    } = postureParams;

    // Pelvis
    k.pelvis.rotation.x = pelvisTilt;
    k.pelvis.rotation.z = pelvisDrop;
    k.pelvis.rotation.y = pelvisRotation;

    // Lumbar Spine
    k.lumbar.forEach((vert, idx) => {
      const fraction = (idx + 1) / (k.lumbar.length || 1);
      vert.rotation.x = lumbarLordosis * fraction * 0.35;
      vert.rotation.z = pelvisDrop * fraction * 0.25;
    });

    // Thoracic Spine
    k.thoracic.forEach((vert, idx) => {
      const fraction = (idx + 1) / (k.thoracic.length || 1);
      vert.rotation.x = -thoracicKyphosis * fraction * 0.3;
    });

    // Cervical Spine & Forward Head
    k.cervical.forEach((vert, idx) => {
      const fraction = (idx + 1) / (k.cervical.length || 1);
      vert.rotation.x = cervicalForwardHead * fraction * 0.3;
      vert.position.z = cervicalForwardHead * fraction * 0.02;
    });

    // Head
    if (k.head) {
      k.head.rotation.x = -cervicalForwardHead * 0.2;
    }

    // Femur Valgus
    if (k.rightFemur) {
      k.rightFemur.rotation.z = -rightKneeValgus;
    }
  }, [postureParams]);

  // 6. Camera Focal Lerp to Selected Bone
  useEffect(() => {
    if (!selectedBoneId) return;
    const mesh = skeletalMeshesRef.current.find(m => m.userData.boneId === selectedBoneId);
    if (!mesh) return;

    const box = new THREE.Box3().setFromObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    cameraTargetRef.current.copy(center);

    // Trigger Shockwave Feedback Ring
    if (shockwaveMeshRef.current) {
      shockwaveMeshRef.current.position.copy(center);
      shockwaveMeshRef.current.visible = true;
      shockwaveMeshRef.current.scale.set(1, 1, 1);
      shockwaveMeshRef.current.material.opacity = 0.8;
    }
  }, [selectedBoneId]);

  // 7. Click-to-Pick Raycaster
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
      const boneId = hit.userData.boneId;
      const bone = boneId ? ALL_206_BONES.find(b => b.id === boneId) : matchMeshToBone(hit.name);

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
        Leiden University Medical Center (LUMC) Clinical Musculoskeletal Atlas • 206 Granular Bones
      </div>
    </div>
  );
};

export default React.memo(AnatomyCanvas);
