import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store.js';
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
  const allInteractiveMeshesRef = useRef([]);
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
  const selectedStructureRef = useRef(null);
  const xrayMeshKeysRef = useRef([]);
  const peeledMeshKeysRef = useRef([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState('Mounting Clinical Skeleton...');
  const [streamingSystem, setStreamingSystem] = useState('');

  const assembledBones = useAnatomyStore(state => state.assembledBones);
  const assembleBone = useAnatomyStore(state => state.assembleBone);
  const selectedBoneId = useAnatomyStore(state => state.selectedBoneId);
  const setSelectedBoneId = useAnatomyStore(state => state.setSelectedBoneId);
  const selectedStructure = useAnatomyStore(state => state.selectedStructure);
  const setSelectedStructure = useAnatomyStore(state => state.setSelectedStructure);
  const xrayMeshKeys = useAnatomyStore(state => state.xrayMeshKeys) || [];
  const peeledMeshKeys = useAnatomyStore(state => state.peeledMeshKeys) || [];
  const layerVisibility = useAnatomyStore(state => state.layerVisibility);
  const vitalSigns = useAnatomyStore(state => state.vitalSigns);
  const meshLodRatio = useAnatomyStore(state => state.meshLodRatio) || 1.0;

  // Keep refs synced
  heartRateRef.current = vitalSigns.heartRate;
  assembledBonesRef.current = assembledBones;
  selectedBoneIdRef.current = selectedBoneId;
  selectedStructureRef.current = selectedStructure;
  xrayMeshKeysRef.current = xrayMeshKeys;
  peeledMeshKeysRef.current = peeledMeshKeys;

  const applyMeshVisualStates = useCallback(() => {
    const materials = materialsRef.current;
    if (!materials) return;
    const currentAssembled = assembledBonesRef.current;
    const currentSelectedBone = selectedBoneIdRef.current;
    const currentSelectedStruct = selectedStructureRef.current;
    const xraySet = new Set(xrayMeshKeysRef.current);
    const peeledSet = new Set(peeledMeshKeysRef.current);

    // 1. Update Skeletal Bone Materials + X-Ray / Peel State
    skeletalMeshesRef.current.forEach((mesh) => {
      const key = mesh.userData.meshKey || mesh.name;
      if (peeledSet.has(key)) {
        mesh.visible = false;
        return;
      }
      if (!mesh.userData.hiddenCartilage) {
        mesh.visible = true;
      }

      const boneId = mesh.userData.boneId;
      const matchedBone = boneId ? ALL_206_BONES.find(b => b.id === boneId) : matchMeshToBone(mesh.name);
      const isAssembled = matchedBone ? currentAssembled.includes(matchedBone.id) : (currentAssembled.length > 50);
      const isSelected =
        (matchedBone && matchedBone.id === currentSelectedBone) ||
        (currentSelectedStruct && currentSelectedStruct.meshKey === key);

      if (xraySet.has(key)) {
        mesh.material = materials.ghostBone;
      } else if (isSelected) {
        mesh.material = materials.boneSelected;
      } else if (isAssembled) {
        mesh.material = materials.corticalBone;
      } else {
        mesh.material = materials.ghostBone;
      }
    });

    // 2. Update Non-Skeletal HD Structures (Organs, Heart/Vessels, Brain/Nerves, Muscles, Ligaments)
    allInteractiveMeshesRef.current.forEach((mesh) => {
      if (mesh.userData.isBoneMesh) return;
      const key = mesh.userData.meshKey || mesh.name;

      if (peeledSet.has(key)) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;

      const baseMat = mesh.userData.baseMaterial;
      if (!baseMat) return;

      const isSelected = currentSelectedStruct && currentSelectedStruct.meshKey === key;
      const isXRay = xraySet.has(key);

      if (isSelected) {
        mesh.material = materials.boneSelected;
      } else if (isXRay) {
        if (!mesh.userData.xrayMaterial) {
          const xm = baseMat.clone();
          xm.transparent = true;
          xm.opacity = 0.2;
          xm.depthWrite = false;
          xm.side = THREE.DoubleSide;
          mesh.userData.xrayMaterial = xm;
        }
        mesh.material = mesh.userData.xrayMaterial;
      } else {
        mesh.material = baseMat;
      }
    });
  }, []);

  // 1. Initialize Scene, Camera, Renderer, Layers & Progressive Model Streamer
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
    controls.minDistance = 0.08;
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

    // Shockwave Ring for Bone/Organ Selection Feedback
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

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.preload();
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const safeLoad = (url) =>
      new Promise((resolve) => {
        gltfLoader.load(url, resolve, undefined, () => resolve(null));
      });

    const loadModelsProgressively = async () => {
      try {
        // STAGE A: Instant (<0.5s) Primary 206-Bone Skeleton Load
        setLoadStatus('Loading 206-Bone Clinical Skeleton...');
        const skeletonGltf = await new Promise((resolve, reject) =>
          gltfLoader.load('/models/lumc_skeleton.glb', resolve, undefined, reject)
        );
        if (!isMounted) return;

        const skelScene = skeletonGltf.scene;
        const meshes = [];
        const interactiveMeshes = [];
        const optimizableMeshes = [];
        const rawSkelMeshes = [];

        skelScene.traverse((child) => {
          if (child.isMesh) rawSkelMeshes.push(child);
        });

        const mirroredLimbs = new THREE.Group();
        mirroredLimbs.name = 'MirroredLeftSkeleton';
        mirroredLimbs.scale.x = -1;

        const mirroredCartilages = new THREE.Group();
        mirroredCartilages.name = 'MirroredLeftCartilages';
        mirroredCartilages.scale.x = -1;
        layerLigaments.add(mirroredCartilages);

        rawSkelMeshes.forEach((child, idx) => {
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
            child.userData.hiddenCartilage = true;
            const rightCart = new THREE.Mesh(child.geometry, materials.hyalineCartilage);
            rightCart.position.copy(child.position);
            rightCart.rotation.copy(child.rotation);
            rightCart.scale.copy(child.scale);
            rightCart.name = normalizedName;
            rightCart.userData.meshKey = `ligament_${normalizedName}_${idx}`;
            rightCart.userData.system = 'Ligaments & Cartilage';
            rightCart.userData.baseMaterial = materials.hyalineCartilage;
            GeometryOptimizer.registerMesh(rightCart);
            layerLigaments.add(rightCart);
            optimizableMeshes.push(rightCart);
            interactiveMeshes.push(rightCart);
            child.visible = false;

            if (isRightSide) {
              const leftName = normalizedName.replace(/\.r(\.?)$/i, '.l$1').replace(/right/gi, 'left');
              const leftCart = new THREE.Mesh(child.geometry, materials.hyalineCartilage);
              leftCart.position.copy(child.position);
              leftCart.rotation.copy(child.rotation);
              leftCart.scale.copy(child.scale);
              leftCart.name = leftName;
              leftCart.userData.meshKey = `ligament_${leftName}_${idx}`;
              leftCart.userData.system = 'Ligaments & Cartilage';
              leftCart.userData.baseMaterial = materials.hyalineCartilage;
              GeometryOptimizer.registerMesh(leftCart);
              mirroredCartilages.add(leftCart);
              optimizableMeshes.push(leftCart);
              interactiveMeshes.push(leftCart);
            }
          } else {
            const bone = matchMeshToBone(normalizedName, parentName);
            if (bone) {
              child.userData.boneId = bone.id;
            }
            child.userData.isBoneMesh = true;
            child.userData.meshKey = bone ? bone.id : `bone_${normalizedName}_${idx}`;
            child.userData.system = 'Skeletal System (206 Bones)';
            meshes.push(child);
            interactiveMeshes.push(child);

            if (isRightSide) {
              const leftName = normalizedName.replace(/\.r(\.?)$/i, '.l$1').replace(/right/gi, 'left');
              const clone = new THREE.Mesh(child.geometry, child.material);
              clone.castShadow = true;
              clone.receiveShadow = true;
              clone.frustumCulled = true;
              clone.position.copy(child.position);
              clone.rotation.copy(child.rotation);
              clone.scale.copy(child.scale);
              clone.name = leftName;

              const mirroredBone = matchMeshToBone(clone.name, 'Bones_left');
              if (mirroredBone) {
                clone.userData.boneId = mirroredBone.id;
              }
              clone.userData.isBoneMesh = true;
              clone.userData.meshKey = mirroredBone ? mirroredBone.id : `bone_${leftName}_${idx}`;
              clone.userData.system = 'Skeletal System (206 Bones)';
              GeometryOptimizer.registerMesh(clone);
              optimizableMeshes.push(clone);
              mirroredLimbs.add(clone);
              meshes.push(clone);
              interactiveMeshes.push(clone);
            }
          }
        });

        layerSkeletal.add(skelScene);
        layerSkeletal.add(mirroredLimbs);

        const microBones = createProceduralMicroBones(materials);
        layerSkeletal.add(microBones.group);
        microBones.meshes.forEach((m) => {
          const bone = matchMeshToBone(m.name);
          if (bone) m.userData.boneId = bone.id;
          m.userData.isBoneMesh = true;
          m.userData.meshKey = m.userData.boneId || m.name;
          m.userData.system = 'Skeletal System (Micro-Ossicles)';
          meshes.push(m);
          interactiveMeshes.push(m);
        });

        skeletalMeshesRef.current = meshes;
        allInteractiveMeshesRef.current = interactiveMeshes;
        optimizableMeshesRef.current = optimizableMeshes;

        // Normalize Scale Using Skeletal Bounding Box to Standard Standing Height (1.75m)
        const skelBbox = new THREE.Box3().setFromObject(layerSkeletal);
        const skelSize = skelBbox.getSize(new THREE.Vector3());
        const scaleFactor = 1.75 / (skelSize.y > 0.1 ? skelSize.y : 1.705);
        humanGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
        humanGroup.position.set(0, -skelBbox.min.y * scaleFactor, 0);

        applyMeshVisualStates();
        // Dismiss blocking loader immediately once 206-bone skeleton is ready!
        setIsLoading(false);

        // Exclude only external penis & testicle structures from 3D anatomy rendering & picking
        const isExcludedGenitalMesh = (name = '') =>
          /\b(penis|glans penis|corpus cavernosum|corpus spongiosum|testis|testicular|epididymis|scrotum|prepuce)\b/i.test(
            name
          );

        // STAGE B: Progressive Non-Blocking Background Streaming of 5 HD Organ/Vascular/Neural/Muscle/Joint Systems
        const ingestHDSystem = (gltfObj, targetLayer, systemLabel) => {
          if (!gltfObj || !gltfObj.scene || !isMounted) return;
          let count = 0;
          gltfObj.scene.traverse((child) => {
            if (child.userData?.za_name) child.name = child.userData.za_name;
            if (child.isMesh) {
              if (isExcludedGenitalMesh(child.name)) {
                child.visible = false;
                return;
              }
              count++;
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.material.roughness = Math.min(child.material.roughness ?? 0.35, 0.38);
                child.userData.baseMaterial = child.material;
              }
              child.castShadow = true;
              child.receiveShadow = true;
              child.frustumCulled = true;
              child.userData.system = systemLabel;
              child.userData.meshKey = `${systemLabel}_${child.name || count}_${child.uuid.slice(0, 6)}`;
              GeometryOptimizer.registerMesh(child);
              optimizableMeshesRef.current.push(child);
              allInteractiveMeshesRef.current.push(child);
            }
          });
          targetLayer.add(gltfObj.scene);
        };

        setStreamingSystem('Streaming HD Joints & Muscular Systems...');
        const [jointsGltf, fullbodyGltf] = await Promise.all([
          safeLoad('/models/joints.glb'),
          safeLoad('/models/fullbody.glb'),
        ]);
        if (!isMounted) return;

        ingestHDSystem(jointsGltf, layerLigaments, 'Articular Joints & Ligaments');

        if (fullbodyGltf && fullbodyGltf.scene) {
          const muscleScene = fullbodyGltf.scene;
          muscleScene.scale.set(0.01, 0.01, 0.01);
          let mIdx = 0;
          muscleScene.traverse((child) => {
            if (child.isMesh) {
              mIdx++;
              child.castShadow = true;
              child.receiveShadow = true;
              child.frustumCulled = true;
              child.name = normalizeGLTFNodeName(child.name || '', child.parent?.name || '');
              child.material = materials.striatedMuscle;
              child.userData.baseMaterial = materials.striatedMuscle;
              child.userData.system = 'Muscular System';
              child.userData.meshKey = `muscle_${child.name}_${mIdx}`;
              GeometryOptimizer.registerMesh(child);
              optimizableMeshesRef.current.push(child);
              allInteractiveMeshesRef.current.push(child);
            }
          });
          layerMuscles.add(muscleScene);
        }

        setStreamingSystem('Streaming HD Visceral Organs, 4-Chamber Heart & Brain...');
        const [visceralGltf, lymphaticGltf, cardiovascularGltf, nervousGltf] = await Promise.all([
          safeLoad('/models/visceral.glb'),
          safeLoad('/models/lymphatic.glb'),
          safeLoad('/models/cardiovascular.glb'),
          safeLoad('/models/nervous.glb'),
        ]);
        if (!isMounted) return;

        ingestHDSystem(visceralGltf, layerOrgans, 'Visceral Organs (Splanchnology)');
        ingestHDSystem(lymphaticGltf, layerOrgans, 'Lymphatic & Immune Organs');

        if (cardiovascularGltf && cardiovascularGltf.scene) {
          const hdHeartNodes = [];
          let cIdx = 0;
          cardiovascularGltf.scene.traverse((child) => {
            const zaName = child.userData?.za_name || child.name || '';
            if (zaName) child.name = zaName;
            if (child.isMesh) {
              if (isExcludedGenitalMesh(zaName)) {
                child.visible = false;
                return;
              }
              cIdx++;
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.material.roughness = 0.25;
                child.userData.baseMaterial = child.material;
              }
              child.frustumCulled = true;
              child.userData.system = 'Cardiovascular System';
              child.userData.meshKey = `cardio_${zaName || cIdx}_${child.uuid.slice(0, 6)}`;
              GeometryOptimizer.registerMesh(child);
              optimizableMeshesRef.current.push(child);
              allInteractiveMeshesRef.current.push(child);
            }
            if (/^(left ventricle|right ventricle|left atrium|right atrium)$/i.test(zaName.trim())) {
              child.userData.restPos = child.position.clone();
              hdHeartNodes.push(child);
            }
          });
          hdHeartNodesRef.current = hdHeartNodes;
          layerVascular.add(cardiovascularGltf.scene);
        }

        ingestHDSystem(nervousGltf, layerNerves, 'Nervous System (Brain & Connectome)');
        const synPoints = createSynapticParticleCloud();
        synPointsRef.current = synPoints;
        layerNerves.add(synPoints);

        const currentLod = useAnatomyStore.getState().meshLodRatio || 1.0;
        if (currentLod < 0.99) {
          GeometryOptimizer.applySceneLOD(optimizableMeshesRef.current, currentLod);
        }

        applyMeshVisualStates();
        setStreamingSystem('');
      } catch (err) {
        console.error('Anatomy Viewport Load Error:', err);
        if (isMounted) {
          setIsLoading(false);
          setStreamingSystem('');
        }
      }
    };

    loadModelsProgressively();

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

      controls.target.lerp(cameraTargetRef.current, 0.08);
      controls.update();

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

      if (synPointsRef.current) {
        synPointsRef.current.rotation.y += delta * 0.15;
      }

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
  }, [applyMeshVisualStates]);

  // 2. Sync 6-Layer Visibility
  useEffect(() => {
    if (layerSkeletalRef.current) layerSkeletalRef.current.visible = !!layerVisibility.skeleton;
    if (layerLigamentsRef.current) layerLigamentsRef.current.visible = !!layerVisibility.ligaments;
    if (layerMusclesRef.current) layerMusclesRef.current.visible = !!layerVisibility.muscles;
    if (layerOrgansRef.current) layerOrgansRef.current.visible = !!layerVisibility.organs;
    if (layerNervesRef.current) layerNervesRef.current.visible = !!layerVisibility.nerves;
    if (layerVascularRef.current) layerVascularRef.current.visible = !!layerVisibility.circulation;
  }, [layerVisibility]);

  // 3. Update Mesh Visual States (Assembled vs Ghost vs Selected vs X-Ray vs Peeled)
  useEffect(() => {
    applyMeshVisualStates();
  }, [assembledBones, selectedBoneId, selectedStructure, xrayMeshKeys, peeledMeshKeys, applyMeshVisualStates]);

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

  // 6. Universal 2,200-Structure Click-to-Inspect & X-Ray Raycaster
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

    // Collect only meshes belonging to currently visible layers and not peeled
    const visibleLayerRoots = [
      layerSkeletalRef.current,
      layerLigamentsRef.current,
      layerMusclesRef.current,
      layerOrgansRef.current,
      layerVascularRef.current,
      layerNervesRef.current,
    ].filter((grp) => grp && grp.visible);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(visibleLayerRoots, true);

    const hitEntry = intersects.find(
      (item) => item.object && item.object.isMesh && item.object.visible && item.object.name !== 'SynapticActionPotentials'
    );

    if (hitEntry) {
      const hit = hitEntry.object;
      const meshKey = hit.userData.meshKey || hit.name;
      const boneId = hit.userData.boneId;
      const bone = boneId
        ? ALL_206_BONES.find(b => b.id === boneId)
        : hit.userData.isBoneMesh
        ? matchMeshToBone(hit.name)
        : null;

      // Focus camera & trigger selection shockwave at the hit structure's 3D center
      const box = new THREE.Box3().setFromObject(hit);
      const center = box.getCenter(new THREE.Vector3());
      cameraTargetRef.current.copy(center);
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

      if (bone) {
        setSelectedBoneId(bone.id);
        setSelectedStructure({
          name: bone.name,
          latinName: bone.latinName,
          system: 'Skeletal System (206 Bones)',
          meshKey: bone.id,
          boneId: bone.id,
          isBone: true,
        });
        if (!assembledBones.includes(bone.id)) {
          assembleBone(bone.id);
        }
      } else {
        const rawLabel = (hit.userData.za_name || hit.name || 'Anatomical Structure')
          .replace(/\.r$/i, ' (Right)')
          .replace(/\.l$/i, ' (Left)')
          .replace(/_/g, ' ');
        setSelectedStructure({
          name: rawLabel,
          system: hit.userData.system || 'Anatomical System',
          meshKey,
          isBone: false,
        });
      }
    }
  }, [assembledBones, assembleBone, setSelectedBoneId, setSelectedStructure]);

  const [dropFeedback, setDropFeedback] = useState(null); // { ok: boolean, text: string }

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/json');
    if (!raw || !containerRef.current || !cameraRef.current) return;

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const anatomicalPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitPoint = new THREE.Vector3();
    const intersected = raycaster.ray.intersectPlane(anatomicalPlane, hitPoint);

    if (!intersected) return;

    const result = useAnatomyStore
      .getState()
      .attemptAnatomicalSnap(payload.kind, payload.id, { x: hitPoint.x, y: hitPoint.y, z: hitPoint.z }, payload.region);

    setDropFeedback({ ok: result.snapped, text: result.reason });
    setTimeout(() => setDropFeedback(null), 2600);
    useStore.getState().showMessage(result.snapped ? `✓ ${result.reason}` : `⚠️ ${result.reason}`);
  }, []);

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-[#06080e]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div ref={containerRef} className="w-full h-full cursor-pointer" />

      {dropFeedback && (
        <div
          className={`absolute top-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl border font-mono text-xs font-bold shadow-2xl backdrop-blur-md pointer-events-none ${
            dropFeedback.ok
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
              : 'bg-rose-950/90 border-rose-400 text-rose-200'
          }`}
        >
          {dropFeedback.ok ? '✓ ' : '⚠️ '}
          {dropFeedback.text}
        </div>
      )}

      {/* Instant Skeleton Loader */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#06080e]/95 backdrop-blur-md flex flex-col items-center justify-center font-mono gap-3 z-30 select-none">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold">{loadStatus}</span>
          <span className="text-[10px] text-slate-500">Preparing 206-Bone Interactive Rig...</span>
        </div>
      )}

      {/* Non-Blocking Progressive Layer Streaming Badge */}
      {!isLoading && streamingSystem && (
        <div className="absolute bottom-10 left-6 z-20 pointer-events-none flex items-center gap-2 bg-[#070c18]/90 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-[10px] font-mono text-cyan-300 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{streamingSystem}</span>
        </div>
      )}

      {/* Viewport Floating Watermark */}
      <div className="absolute bottom-4 left-6 pointer-events-none select-none text-[9px] font-mono text-slate-500">
        Z-Anatomy & LUMC Clinical Atlas • Click Any Bone, Organ, Heart Chamber, Vessel, Nerve, or Muscle to Inspect / X-Ray / Peel
      </div>
    </div>
  );
};

export default React.memo(AnatomyCanvas);
