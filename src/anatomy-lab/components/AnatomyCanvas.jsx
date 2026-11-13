import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { createMedicalMaterials } from '../utils/MedicalMaterials.js';
import {
  matchMeshToBone,
  normalizeGLTFNodeName,
  isRightSideAnatomyNode
} from '../utils/boneMatcher.js';
import { GeometryOptimizer } from '../utils/GeometryOptimizer.js';
import {
  createProceduralMicroBones,
  createSynapticParticleCloud
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
  const optimizableMeshesRef = useRef([]);
  const layerSkeletalRef = useRef(null);
  const layerMusclesRef = useRef(null);
  const layerLigamentsRef = useRef(null);
  const layerOrgansRef = useRef(null);
  const layerNervesRef = useRef(null);
  const layerVascularRef = useRef(null);
  const materialsRef = useRef(null);

  // Animated Components & Interaction Refs
  const hdHeartNodesRef = useRef([]);
  const synPointsRef = useRef(null);
  const shockwaveMeshRef = useRef(null);
  const shockwaveTimeRef = useRef(0);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.9, 0));
  const pointerDownPosRef = useRef({ x: 0, y: 0 });

  // Live state refs for 60fps animation loop without recreating WebGL
  const heartRateRef = useRef(0);
  const assembledBonesRef = useRef([]);
  const selectedBoneIdRef = useRef('femur_r');

  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState('Mounting Clinical Viewport...');

  const assembledBones = useAnatomyStore(state => state.assembledBones);
  const assembleBone = useAnatomyStore(state => state.assembleBone);
  const selectedBoneId = useAnatomyStore(state => state.selectedBoneId);
  const setSelectedBoneId = useAnatomyStore(state => state.setSelectedBoneId);
  const layerVisibility = useAnatomyStore(state => state.layerVisibility);
  const vitalSigns = useAnatomyStore(state => state.vitalSigns);
  const meshLodRatio = useAnatomyStore(state => state.meshLodRatio) || 1.0;

  // Keep refs synced for animation loop & async callbacks
  heartRateRef.current = vitalSigns.heartRate;
  assembledBonesRef.current = assembledBones;
  selectedBoneIdRef.current = selectedBoneId;

  const applyBoneMaterials = useCallback(() => {
    const materials = materialsRef.current;
    if (!materials) return;
    const currentAssembled = assembledBonesRef.current;
    const currentSelected = selectedBoneIdRef.current;

    skeletalMeshesRef.current.forEach((mesh) => {
      const boneId = mesh.userData.boneId;
      const matchedBone = boneId ? ALL_206_BONES.find(b => b.id === boneId) : matchMeshToBone(mesh.name);

      const isAssembled = matchedBone ? currentAssembled.includes(matchedBone.id) : (currentAssembled.length > 50);
      const isSelected = matchedBone && matchedBone.id === currentSelected;

      if (isSelected) {
        mesh.material = materials.boneSelected;
      } else if (isAssembled) {
        mesh.material = materials.corticalBone;
      } else {
        mesh.material = materials.ghostBone;
      }
    });
  }, []);

  // 1. Initialize Scene, Camera, Renderer, Layers & Models (Runs Once on Mount)
  useEffect(() => {
    let isMounted = true;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);
    scene.fog = new THREE.FogExp2(0x06080e, 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.05, 50);
    camera.position.set(0, 0.95, 3.2);
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);
    } catch (e) {
      setIsLoading(false);
      return;
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 0.9, 0);
    controls.maxDistance = 6.0;
    controls.minDistance = 0.12;
    controlsRef.current = controls;

    // Studio Medical Lighting
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

    // Floor Grid
    const gridHelper = new THREE.GridHelper(6, 20, 0x0891b2, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Shockwave Ring for Bone Assembly Feedback
    const shockwaveGeo = new THREE.RingGeometry(0.015, 0.045, 32);
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

    // 6-Layer Hierarchies
    const layerSkeletal = new THREE.Group();
    layerSkeletal.name = 'LayerSkeletal';
    const layerLigaments = new THREE.Group();
    layerLigaments.name = 'LayerLigaments';
    const layerMuscles = new THREE.Group();
    layerMuscles.name = 'LayerMuscles';
    const layerOrgans = new THREE.Group();
    layerOrgans.name = 'LayerOrgans';
    const layerNerves = new THREE.Group();
    layerNerves.name = 'LayerNerves';
    const layerVascular = new THREE.Group();
    layerVascular.name = 'LayerVascular';

    humanGroup.add(layerSkeletal);
    humanGroup.add(layerLigaments);
    humanGroup.add(layerMuscles);
    humanGroup.add(layerOrgans);
    humanGroup.add(layerNerves);
    humanGroup.add(layerVascular);

    // Sync initial layer visibilities
    const initVis = useAnatomyStore.getState().layerVisibility;
    layerSkeletal.visible = !!initVis.skeleton;
    layerLigaments.visible = !!initVis.ligaments;
    layerMuscles.visible = !!initVis.muscles;
    layerOrgans.visible = !!initVis.organs;
    layerNerves.visible = !!initVis.nerves;
    layerVascular.visible = !!initVis.circulation;

    layerSkeletalRef.current = layerSkeletal;
    layerLigamentsRef.current = layerLigaments;
    layerMusclesRef.current = layerMuscles;
    layerOrgansRef.current = layerOrgans;
    layerNervesRef.current = layerNerves;
    layerVascularRef.current = layerVascular;

    const materials = createMedicalMaterials();
    materialsRef.current = materials;

    // Load Medical GLB Models (Using local /draco/ WASM decoder for offline high-speed decompression)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.preload();
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loadModels = async () => {
      try {
        setLoadStatus('Loading 206-Bone Clinical Skeleton & Muscular Atlas...');
        const [skeletonGltf, fullbodyGltf] = await Promise.all([
          new Promise((resolve, reject) => gltfLoader.load('/models/lumc_skeleton.glb', resolve, undefined, reject)),
          new Promise((resolve, reject) => gltfLoader.load('/models/fullbody.glb', resolve, undefined, reject)),
        ]);
        if (!isMounted) return;

        setLoadStatus('Loading HD Cardiovascular, Nervous, Visceral, Lymphatic & Joint Systems...');
        const safeLoad = (url) =>
          new Promise((resolve) => {
            gltfLoader.load(url, resolve, undefined, () => resolve(null));
          });

        const [
          cardiovascularGltf,
          nervousGltf,
          visceralGltf,
          lymphaticGltf,
          jointsGltf,
        ] = await Promise.all([
          safeLoad('/models/cardiovascular.glb'),
          safeLoad('/models/nervous.glb'),
          safeLoad('/models/visceral.glb'),
          safeLoad('/models/lymphatic.glb'),
          safeLoad('/models/joints.glb'),
        ]);
        if (!isMounted) return;

        setLoadStatus('Assembling High-Definition Human Systems...');
        const skelScene = skeletonGltf.scene;
        const meshes = [];
        const rawSkelMeshes = [];
        const optimizableMeshes = [];

        skelScene.traverse((child) => {
          if (child.isMesh) rawSkelMeshes.push(child);
        });

        // Mirrored Left Groups (scale.x = -1 across sagittal plane x = 0)
        const mirroredLimbs = new THREE.Group();
        mirroredLimbs.name = 'MirroredLeftSkeleton';
        mirroredLimbs.scale.x = -1;

        const mirroredCartilages = new THREE.Group();
        mirroredCartilages.name = 'MirroredLeftCartilages';
        mirroredCartilages.scale.x = -1;
        layerLigaments.add(mirroredCartilages);

        rawSkelMeshes.forEach((child) => {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = true;

          const parentName = child.parent?.name || '';
          const isRightSide = isRightSideAnatomyNode(child);
          const normalizedName = normalizeGLTFNodeName(child.name || '', parentName);
          child.name = normalizedName;
          const lowerName = normalizedName.toLowerCase();
          const isCartilage =
            parentName.toLowerCase().includes('cartilage') ||
            lowerName.includes('cart') ||
            lowerName.includes('disc') ||
            lowerName.includes('meniscus');

          GeometryOptimizer.registerMesh(child);
          optimizableMeshes.push(child);

          if (isCartilage) {
            child.material = materials.hyalineCartilage;
            const rightCart = new THREE.Mesh(child.geometry, materials.hyalineCartilage);
            rightCart.position.copy(child.position);
            rightCart.rotation.copy(child.rotation);
            rightCart.scale.copy(child.scale);
            rightCart.name = normalizedName;
            GeometryOptimizer.registerMesh(rightCart);
            layerLigaments.add(rightCart);
            optimizableMeshes.push(rightCart);
            child.visible = false;

            if (isRightSide) {
              const leftCart = new THREE.Mesh(child.geometry, materials.hyalineCartilage);
              leftCart.position.copy(child.position);
              leftCart.rotation.copy(child.rotation);
              leftCart.scale.copy(child.scale);
              leftCart.name = normalizedName.replace(/\.r(\.?)$/i, '.l$1').replace(/right/gi, 'left');
              GeometryOptimizer.registerMesh(leftCart);
              mirroredCartilages.add(leftCart);
              optimizableMeshes.push(leftCart);
            }
          } else {
            const bone = matchMeshToBone(normalizedName, parentName);
            if (bone) {
              child.userData.boneId = bone.id;
            }
            meshes.push(child);

            if (isRightSide) {
              const clone = new THREE.Mesh(child.geometry, child.material);
              clone.castShadow = true;
              clone.receiveShadow = true;
              clone.frustumCulled = true;
              clone.position.copy(child.position);
              clone.rotation.copy(child.rotation);
              clone.scale.copy(child.scale);
              clone.name = normalizedName.replace(/\.r(\.?)$/i, '.l$1').replace(/right/gi, 'left');

              const mirroredBone = matchMeshToBone(clone.name, 'Bones_left');
              if (mirroredBone) {
                clone.userData.boneId = mirroredBone.id;
              }
              GeometryOptimizer.registerMesh(clone);
              optimizableMeshes.push(clone);
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

        // 4. Ingest High-Definition Full-Body Joints & Ligaments (joints.glb: 349 structures)
        const ingestHDSystem = (gltfObj, targetLayer) => {
          if (!gltfObj || !gltfObj.scene) return;
          gltfObj.scene.traverse((child) => {
            if (child.userData?.za_name) child.name = child.userData.za_name;
            if (child.isMesh) {
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.material.roughness = Math.min(child.material.roughness ?? 0.35, 0.38);
              }
              child.castShadow = true;
              child.receiveShadow = true;
              child.frustumCulled = true;
              GeometryOptimizer.registerMesh(child);
              optimizableMeshes.push(child);
            }
          });
          targetLayer.add(gltfObj.scene);
        };
        ingestHDSystem(jointsGltf, layerLigaments);

        // 5. Ingest Muscular Layer (Convert Z-Anatomy centimeter units [~170cm] -> meters [~1.70m] via 0.01 scale)
        const muscleScene = fullbodyGltf.scene;
        muscleScene.scale.set(0.01, 0.01, 0.01);
        muscleScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = true;
            child.name = normalizeGLTFNodeName(child.name || '', child.parent?.name || '');
            child.material = materials.striatedMuscle;
            GeometryOptimizer.registerMesh(child);
            optimizableMeshes.push(child);
          }
        });
        layerMuscles.add(muscleScene);

        // 5b. Ingest High-Definition Visceral & Lymphatic Organs Layer (visceral.glb + lymphatic.glb: 276 structures)
        ingestHDSystem(visceralGltf, layerOrgans);
        ingestHDSystem(lymphaticGltf, layerOrgans);

        // 6. Ingest High-Definition Cardiovascular System (cardiovascular.glb: 676 structures)
        if (cardiovascularGltf && cardiovascularGltf.scene) {
          const hdHeartNodes = [];
          cardiovascularGltf.scene.traverse((child) => {
            const zaName = child.userData?.za_name || child.name || '';
            if (zaName) child.name = zaName;
            if (child.isMesh) {
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.material.roughness = 0.25;
              }
              child.frustumCulled = true;
              GeometryOptimizer.registerMesh(child);
              optimizableMeshes.push(child);
            }
            if (/^(left ventricle|right ventricle|left atrium|right atrium)$/i.test(zaName.trim())) {
              child.userData.restPos = child.position.clone();
              hdHeartNodes.push(child);
            }
          });
          hdHeartNodesRef.current = hdHeartNodes;
          layerVascular.add(cardiovascularGltf.scene);
        }

        // 7. Ingest High-Definition Nervous System (nervous.glb: 580 structures + Synaptic Glow Cloud)
        ingestHDSystem(nervousGltf, layerNerves);
        const synPoints = createSynapticParticleCloud();
        synPointsRef.current = synPoints;
        layerNerves.add(synPoints);

        optimizableMeshesRef.current = optimizableMeshes;
        const initialLod = useAnatomyStore.getState().meshLodRatio || 1.0;
        if (initialLod < 0.99) {
          GeometryOptimizer.applySceneLOD(optimizableMeshes, initialLod);
        }

        // 8. Normalize Scale Using Skeletal Bounding Box to Standard Standing Height (1.75m)
        const skelBbox = new THREE.Box3().setFromObject(layerSkeletal);
        const skelSize = skelBbox.getSize(new THREE.Vector3());
        const scaleFactor = 1.75 / (skelSize.y > 0.1 ? skelSize.y : 1.705);
        humanGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
        humanGroup.position.set(0, -skelBbox.min.y * scaleFactor, 0);

        // 9. Immediately apply Ghost vs Cortical vs Selected Bone Materials
        applyBoneMaterials();

        setIsLoading(false);
      } catch (err) {
        console.error('Anatomy Viewport Load Error:', err);
        if (isMounted) setIsLoading(false);
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
      const delta = Math.min(0.1, (time - lastTime) * 0.001);
      lastTime = time;

      // 1. Orbit Controls damping & smooth camera target interpolation
      controls.target.lerp(cameraTargetRef.current, 0.08);
      controls.update();

      // 2. Pulsatile Ventricular Systole/Diastole Heartbeat Animation on HD 4-Chamber Heart
      if (hdHeartNodesRef.current && hdHeartNodesRef.current.length > 0) {
        const bpm = heartRateRef.current > 0 ? heartRateRef.current : 60;
        const freq = (bpm / 60) * Math.PI * 2;
        const pulse = Math.sin(time * 0.001 * freq);
        const systole = Math.max(0, pulse);
        const s = 1.0 + systole * 0.055;
        const cx = 0.018;
        const cy = 1.285;
        const cz = 0.035;
        hdHeartNodesRef.current.forEach((node) => {
          const rp = node.userData.restPos || { x: 0, y: 0, z: 0 };
          node.scale.set(s, s, s);
          node.position.set(
            rp.x + (1 - s) * cx,
            rp.y + (1 - s) * cy,
            rp.z + (1 - s) * cz
          );
        });
      }

      // 3. Synaptic Action Potentials Glow Animation
      if (synPointsRef.current) {
        synPointsRef.current.rotation.y += delta * 0.15;
      }

      // 4. Shockwave Expansion Feedback (Resets on every bone selection via shockwaveTimeRef)
      if (shockwaveMeshRef.current && shockwaveMeshRef.current.visible) {
        shockwaveTimeRef.current += delta;
        const t = shockwaveTimeRef.current;
        const currentScale = 1.0 + t * 3.5;
        shockwaveMeshRef.current.scale.set(currentScale, currentScale, currentScale);
        shockwaveMeshRef.current.material.opacity = Math.max(0, 0.85 - t * 2.1);
        if (t > 0.42) {
          shockwaveMeshRef.current.visible = false;
        }
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      dracoLoader.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [applyBoneMaterials]);

  // 2. Sync 6-Layer Visibility
  useEffect(() => {
    if (layerSkeletalRef.current) layerSkeletalRef.current.visible = !!layerVisibility.skeleton;
    if (layerLigamentsRef.current) layerLigamentsRef.current.visible = !!layerVisibility.ligaments;
    if (layerMusclesRef.current) layerMusclesRef.current.visible = !!layerVisibility.muscles;
    if (layerOrgansRef.current) layerOrgansRef.current.visible = !!layerVisibility.organs;
    if (layerNervesRef.current) layerNervesRef.current.visible = !!layerVisibility.nerves;
    if (layerVascularRef.current) layerVascularRef.current.visible = !!layerVisibility.circulation;
  }, [layerVisibility]);

  // 3. Update Bone Materials (Assembled vs. Ghost vs. Selected)
  useEffect(() => {
    applyBoneMaterials();
  }, [assembledBones, selectedBoneId, applyBoneMaterials]);

  // 4. Hardware GPU Mesh LOD Decimation (HD 100% / Med 65% / Eco 35%)
  useEffect(() => {
    if (optimizableMeshesRef.current.length > 0) {
      GeometryOptimizer.applySceneLOD(optimizableMeshesRef.current, meshLodRatio);
    }
  }, [meshLodRatio]);

  // 5. Camera Focal Lerp & Multi-Use Shockwave on Selected Bone Change
  useEffect(() => {
    if (!selectedBoneId) return;
    const mesh = skeletalMeshesRef.current.find(m => m.userData.boneId === selectedBoneId);
    if (!mesh) return;

    const box = new THREE.Box3().setFromObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    cameraTargetRef.current.copy(center);

    // Trigger Shockwave Feedback Ring (Resets timer so every bone click animates)
    if (shockwaveMeshRef.current) {
      shockwaveTimeRef.current = 0;
      shockwaveMeshRef.current.position.copy(center);
      if (cameraRef.current) {
        shockwaveMeshRef.current.lookAt(cameraRef.current.position);
      }
      shockwaveMeshRef.current.visible = true;
      shockwaveMeshRef.current.scale.set(1, 1, 1);
      shockwaveMeshRef.current.material.opacity = 0.85;
    }
  }, [selectedBoneId]);

  // 6. Orbit-Safe Click-to-Pick Raycaster (Only fires on clean click, not camera drag)
  const handlePointerDown = useCallback((e) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e) => {
    const dx = e.clientX - pointerDownPosRef.current.x;
    const dy = e.clientY - pointerDownPosRef.current.y;
    if (Math.hypot(dx, dy) > 5) return;

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
    <div
      className="w-full h-full relative overflow-hidden bg-[#06080e]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div ref={containerRef} className="w-full h-full cursor-pointer" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#06080e]/95 backdrop-blur-md flex flex-col items-center justify-center font-mono gap-3 z-30 select-none">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold">{loadStatus}</span>
          <span className="text-[10px] text-slate-500">Decompressing Z-Anatomy High-Definition Clinical Atlas...</span>
        </div>
      )}

      {/* Viewport Floating Watermark */}
      <div className="absolute bottom-4 left-6 pointer-events-none select-none text-[9px] font-mono text-slate-500">
        Z-Anatomy & LUMC Clinical Atlas • 206 Bones • 676 Cardiovascular • 580 Nervous • 276 Visceral/Lymph • 349 Joints
      </div>
    </div>
  );
};

export default React.memo(AnatomyCanvas);
