import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { createMedicalMaterials } from '../utils/MedicalMaterials.js';
import {
  matchMeshToBone,
  normalizeGLTFNodeName,
  isRightSideAnatomyNode
} from '../utils/boneMatcher.js';
import { GeometryOptimizer } from '../utils/GeometryOptimizer.js';
import { BiomechanicalVisualOverlays } from '../utils/BiomechanicalVisualOverlays.js';
import {
  createProceduralMicroBones,
  createCartilageAndLigamentsLayer,
  createVascularLoopLayer,
  createNeuralConnectomeLayer
} from '../utils/anatomicalLayers.js';
import { useAnatomyStore } from '../store.js';
import { ALL_206_BONES } from '../data/humanSkeletalDatabase.js';

const GIZMO_JOINT_CONFIG = {
  pelvis: { pos: [0, 0.92, 0], param: 'pelvisTilt', axis: 'x', scale: 1.0 },
  right_foot: { pos: [-0.09, 0.06, 0.04], param: 'rightFootPronation', axis: 'z', scale: 1.0 },
  right_femur: { pos: [-0.10, 0.48, 0.01], param: 'rightKneeValgus', axis: 'z', scale: -1.0 },
  lumbar: { pos: [0, 1.08, -0.02], param: 'lumbarLordosis', axis: 'x', scale: 1.0 },
  thoracic: { pos: [0, 1.32, -0.03], param: 'thoracicKyphosis', axis: 'x', scale: -1.0 },
  cervical: { pos: [0, 1.52, 0.01], param: 'cervicalForwardHead', axis: 'x', scale: 0.5 },
};

const MUSCLE_KEYWORD_ALIASES = [
  { trigger: ['iliopsoas', 'psoas'], meshTerms: ['psoas', 'iliacus'] },
  { trigger: ['tfl', 'tensor_fasciae_latae', 'it_band'], meshTerms: ['tensor fasciae latae', 'iliotibial'] },
  { trigger: ['gluteus_medius', 'glute_med'], meshTerms: ['gluteus medius', 'gluteus minimus'] },
  { trigger: ['gluteus_maximus'], meshTerms: ['gluteus maximus'] },
  { trigger: ['adductor'], meshTerms: ['adductor', 'gracilis', 'pectineus'] },
  { trigger: ['quadratus_lumborum', 'ql_'], meshTerms: ['quadratus lumborum'] },
  { trigger: ['erector_spinae', 'multifidus'], meshTerms: ['iliocostalis', 'longissimus', 'spinalis', 'multifidus'] },
  { trigger: ['rectus_abdominis', 'oblique'], meshTerms: ['rectus abdominis', 'obliquus', 'transversus abdominis'] },
  { trigger: ['pectoralis'], meshTerms: ['pectoralis'] },
  { trigger: ['trapezius', 'rhomboid'], meshTerms: ['trapezius', 'rhomboid', 'levator scapulae'] },
  { trigger: ['scm', 'sternocleidomastoid', 'scalene', 'platysma', 'neck'], meshTerms: ['sternocleidomastoid', 'scalenus', 'platysma', 'longus colli', 'splenius'] },
  { trigger: ['gastrocnemius', 'soleus'], meshTerms: ['gastrocnemius', 'soleus', 'plantaris'] },
  { trigger: ['peroneus', 'peroneals', 'fibularis'], meshTerms: ['fibularis', 'peroneus'] },
  { trigger: ['tibialis_posterior'], meshTerms: ['tibialis posterior'] },
  { trigger: ['tibialis_anterior'], meshTerms: ['tibialis anterior'] },
  { trigger: ['hallucis', 'foot_intrinsics'], meshTerms: ['hallucis', 'digitorum', 'lumbrical', 'interosse'] },
  { trigger: ['rectus_femoris', 'vmo'], meshTerms: ['rectus femoris', 'vastus'] },
  { trigger: ['hamstrings'], meshTerms: ['biceps femoris', 'semitendinosus', 'semimembranosus'] },
  { trigger: ['latissimus'], meshTerms: ['latissimus dorsi'] },
  { trigger: ['serratus'], meshTerms: ['serratus anterior'] },
];

export function doesMeshMatchMuscleList(meshName, muscleList) {
  if (!meshName || !Array.isArray(muscleList) || muscleList.length === 0) return false;
  const normalizedMesh = normalizeGLTFNodeName(meshName).toLowerCase();
  const meshIsRight = /(\.r\.?$|_r$|\bright\b)/i.test(normalizedMesh);
  const meshIsLeft = /(\.l\.?$|_l$|\bleft\b)/i.test(normalizedMesh);

  for (const item of muscleList) {
    const rawText = typeof item === 'string'
      ? item.toLowerCase()
      : `${item.id || ''} ${item.name || ''}`.toLowerCase();
    const normalizedItem = rawText.replace(/_/g, ' ').trim();

    const itemMentionsRight = normalizedItem.includes('right');
    const itemMentionsLeft = normalizedItem.includes('left');
    if (itemMentionsRight && !itemMentionsLeft && meshIsLeft) continue;
    if (itemMentionsLeft && !itemMentionsRight && meshIsRight) continue;

    if (normalizedMesh.includes(normalizedItem) && normalizedItem.length > 3) {
      return true;
    }

    for (const rule of MUSCLE_KEYWORD_ALIASES) {
      if (rule.trigger.some(t => rawText.includes(t) || normalizedItem.includes(t.replace(/_/g, ' ')))) {
        if (rule.meshTerms.some(term => normalizedMesh.includes(term))) {
          return true;
        }
      }
    }
  }
  return false;
}

const AnatomyCanvas = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const transformControlsRef = useRef(null);
  const gizmoProxyRef = useRef(null);
  const overlaysRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Mesh and Layer References
  const humanGroupRef = useRef(null);
  const skeletalMeshesRef = useRef([]);
  const muscleMeshesRef = useRef([]);
  const optimizableMeshesRef = useRef([]);
  const layerSkeletalRef = useRef(null);
  const layerMusclesRef = useRef(null);
  const layerLigamentsRef = useRef(null);
  const layerOrgansRef = useRef(null);
  const layerNervesRef = useRef(null);
  const layerVascularRef = useRef(null);
  const materialsRef = useRef(null);

  // Animated Components & Interaction Refs
  const heartMeshRef = useRef(null);
  const hdHeartNodesRef = useRef([]);
  const synPointsRef = useRef(null);
  const shockwaveMeshRef = useRef(null);
  const shockwaveTimeRef = useRef(0);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.9, 0));
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const isGizmoDraggingRef = useRef(false);

  // Live state refs for 60fps animation loop without recreating WebGL
  const heartRateRef = useRef(0);
  const postureParamsRef = useRef({});
  const assembledBonesRef = useRef([]);
  const selectedBoneIdRef = useRef('femur_r');
  const overactiveMusclesRef = useRef([]);
  const underactiveMusclesRef = useRef([]);

  // Kinematic Joint Group References
  const kinematicJointsRef = useRef({
    pelvis: null,
    lumbar: [],
    thoracic: [],
    cervical: [],
    head: null,
    mandible: null,
    rightFemur: null,
    leftFemur: null,
    rightTibia: null,
    leftTibia: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState('Mounting Clinical Viewport...');

  const assembledBones = useAnatomyStore(state => state.assembledBones);
  const assembleBone = useAnatomyStore(state => state.assembleBone);
  const selectedBoneId = useAnatomyStore(state => state.selectedBoneId);
  const setSelectedBoneId = useAnatomyStore(state => state.setSelectedBoneId);
  const layerVisibility = useAnatomyStore(state => state.layerVisibility);
  const postureParams = useAnatomyStore(state => state.postureParams);
  const setPostureParam = useAnatomyStore(state => state.setPostureParam);
  const showVectors = useAnatomyStore(state => state.showVectors);
  const activeGizmoJoint = useAnatomyStore(state => state.activeGizmoJoint);
  const overactiveMuscles = useAnatomyStore(state => state.overactiveMuscles);
  const underactiveMuscles = useAnatomyStore(state => state.underactiveMuscles);
  const vitalSigns = useAnatomyStore(state => state.vitalSigns);
  const meshLodRatio = useAnatomyStore(state => state.meshLodRatio) || 1.0;

  // Keep refs synced for animation loop & async callbacks
  heartRateRef.current = vitalSigns.heartRate;
  postureParamsRef.current = postureParams;
  assembledBonesRef.current = assembledBones;
  selectedBoneIdRef.current = selectedBoneId;
  overactiveMusclesRef.current = overactiveMuscles;
  underactiveMusclesRef.current = underactiveMuscles;

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

  const applyMuscleMaterials = useCallback(() => {
    const materials = materialsRef.current;
    if (!materials) return;
    const over = overactiveMusclesRef.current;
    const under = underactiveMusclesRef.current;

    muscleMeshesRef.current.forEach((mesh) => {
      const name = mesh.name || '';
      if (doesMeshMatchMuscleList(name, over)) {
        mesh.material = materials.muscleTight;
      } else if (doesMeshMatchMuscleList(name, under)) {
        mesh.material = materials.muscleWeak;
      } else {
        mesh.material = materials.striatedMuscle;
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

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
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
    controls.target.set(0, 0.9, 0);
    controls.maxDistance = 6.0;
    controls.minDistance = 0.25;
    controlsRef.current = controls;

    // On-Canvas 3D Bone Rotation Gizmo (TransformControls)
    const gizmoProxy = new THREE.Object3D();
    gizmoProxy.name = 'KinematicGizmoProxy';
    scene.add(gizmoProxy);
    gizmoProxyRef.current = gizmoProxy;

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.setMode('rotate');
    transformControls.setSize(0.55);
    transformControls.visible = false;
    transformControls.enabled = false;
    scene.add(transformControls);
    transformControlsRef.current = transformControls;

    transformControls.addEventListener('dragging-changed', (event) => {
      isGizmoDraggingRef.current = event.value;
      controls.enabled = !event.value;
    });

    transformControls.addEventListener('objectChange', () => {
      const jointKey = useAnatomyStore.getState().activeGizmoJoint;
      const cfg = jointKey ? GIZMO_JOINT_CONFIG[jointKey] : null;
      if (!cfg || !gizmoProxyRef.current) return;
      const rawAngle = gizmoProxyRef.current.rotation[cfg.axis] * cfg.scale;
      const clamped = Math.max(-0.5, Math.min(0.6, rawAngle));
      useAnatomyStore.getState().setPostureParam(cfg.param, Number(clamped.toFixed(3)));
    });

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

    // Layer Hierarchies
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

    // Biomechanical Visual Force Vectors, Lasers & Kinetic Wavefront
    const overlays = new BiomechanicalVisualOverlays(humanGroup);
    overlays.root.position.set(0, 0.90, 0);
    overlays.setVisible(useAnatomyStore.getState().showVectors);
    overlaysRef.current = overlays;

    const materials = createMedicalMaterials();
    materialsRef.current = materials;

    // Load Medical GLB Models (Using local /draco/ WASM decoder for offline high-speed decompression)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.preload();
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const cacheRestTransform = (node) => {
      node.userData.restPos = node.position.clone();
      node.userData.restRot = node.rotation.clone();
    };

    const loadModels = async () => {
      try {
        setLoadStatus('Loading LUMC Clinical Skeleton Scan (3.2 MB)...');
        const skeletonGltf = await new Promise((resolve, reject) => {
          gltfLoader.load('/models/lumc_skeleton.glb', resolve, undefined, reject);
        });
        if (!isMounted) return;

        setLoadStatus('Loading Muscular Anatomy Atlas (1.5 MB)...');
        const fullbodyGltf = await new Promise((resolve, reject) => {
          gltfLoader.load('/models/fullbody.glb', resolve, undefined, reject);
        });
        if (!isMounted) return;

        setLoadStatus('Loading HD Cardiovascular, Nervous, Visceral, Lymphatic & Joint Scans...');
        const safeLoad = (url) =>
          new Promise((resolve) => {
            gltfLoader.load(url, resolve, undefined, () => resolve(null));
          });

        const [
          lowerLimbGltf,
          cardiovascularGltf,
          nervousGltf,
          visceralGltf,
          lymphaticGltf,
          jointsGltf,
        ] = await Promise.all([
          safeLoad('/models/lumc_lower_limb.glb'),
          safeLoad('/models/cardiovascular.glb'),
          safeLoad('/models/nervous.glb'),
          safeLoad('/models/visceral.glb'),
          safeLoad('/models/lymphatic.glb'),
          safeLoad('/models/joints.glb'),
        ]);
        if (!isMounted) return;

        setLoadStatus('Assembling 206-Bone Interactive Rig & Bilateral Limbs...');
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
          cacheRestTransform(child);

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
            // Clone into ligaments layer sharing GPU geometry buffer
            const rightCart = new THREE.Mesh(child.geometry, materials.hyalineCartilage);
            rightCart.position.copy(child.position);
            rightCart.rotation.copy(child.rotation);
            rightCart.scale.copy(child.scale);
            rightCart.name = normalizedName;
            layerLigaments.add(rightCart);
            optimizableMeshes.push(rightCart);
            child.visible = false;

            if (isRightSide) {
              const leftCart = new THREE.Mesh(child.geometry, materials.hyalineCartilage);
              leftCart.position.copy(child.position);
              leftCart.rotation.copy(child.rotation);
              leftCart.scale.copy(child.scale);
              leftCart.name = normalizedName.replace(/\.r(\.?)$/i, '.l$1').replace(/right/gi, 'left');
              mirroredCartilages.add(leftCart);
              optimizableMeshes.push(leftCart);
            }
          } else {
            const bone = matchMeshToBone(normalizedName, parentName);
            if (bone) {
              child.userData.boneId = bone.id;
            }
            meshes.push(child);

            // Mirror all 98 right-side bones (Femur.r, Tibia.r, Fibula.r, Humerus.r, Radius.r, Ulna.r, Foot/Hand bones) to left side
            if (isRightSide) {
              // Share child.geometry buffer directly (zero duplicate GPU VRAM allocation)
              const clone = new THREE.Mesh(child.geometry, child.material);
              clone.castShadow = true;
              clone.receiveShadow = true;
              clone.frustumCulled = true;
              clone.position.copy(child.position);
              clone.rotation.copy(child.rotation);
              clone.scale.copy(child.scale);
              clone.name = normalizedName.replace(/\.r(\.?)$/i, '.l$1').replace(/right/gi, 'left');
              cacheRestTransform(clone);

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
          cacheRestTransform(m);
          const bone = matchMeshToBone(m.name);
          if (bone) m.userData.boneId = bone.id;
          meshes.push(m);
        });
        skeletalMeshesRef.current = meshes;

        // 4. Ingest High-Definition Full-Body Joints & Ligaments (joints.glb: 349 structures, fallback to procedural)
        if (jointsGltf && jointsGltf.scene) {
          jointsGltf.scene.traverse((child) => {
            if (child.isMesh) {
              if (child.userData?.za_name) child.name = child.userData.za_name;
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.material.roughness = 0.35;
              }
              child.frustumCulled = true;
              GeometryOptimizer.registerMesh(child);
              optimizableMeshes.push(child);
            }
          });
          layerLigaments.add(jointsGltf.scene);
        } else {
          const cartilageLayer = createCartilageAndLigamentsLayer(materials);
          layerLigaments.add(cartilageLayer);
        }

        // 5. Ingest Muscular Layer (Convert Z-Anatomy centimeter units [~170cm] -> meters [~1.70m] via 0.01 scale)
        const muscleScene = fullbodyGltf.scene;
        muscleScene.scale.set(0.01, 0.01, 0.01);
        const muscleMeshes = [];
        muscleScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.frustumCulled = true;
            child.name = normalizeGLTFNodeName(child.name || '', child.parent?.name || '');
            child.material = materials.striatedMuscle;
            GeometryOptimizer.registerMesh(child);
            optimizableMeshes.push(child);
            muscleMeshes.push(child);
          }
        });
        layerMuscles.add(muscleScene);
        muscleMeshesRef.current = muscleMeshes;

        // 5b. Ingest High-Definition Visceral & Lymphatic Organs Layer (visceral.glb + lymphatic.glb: 276 structures)
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
        ingestHDSystem(visceralGltf, layerOrgans);
        ingestHDSystem(lymphaticGltf, layerOrgans);

        // 6. Ingest High-Definition Cardiovascular System (cardiovascular.glb: 676 structures including 4-Chamber Heart, Valves, Coronary & Systemic Vessels)
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
              child.userData.restScale = child.scale.clone();
              hdHeartNodes.push(child);
            }
          });
          hdHeartNodesRef.current = hdHeartNodes;
          layerVascular.add(cardiovascularGltf.scene);
        } else {
          const vascular = createVascularLoopLayer(materials);
          layerVascular.add(vascular.group);
          heartMeshRef.current = vascular.heartMesh;
        }

        // 7. Ingest High-Definition Nervous System (nervous.glb: 580 structures including Cerebral Lobes, Cerebellum, Ventricles, Spinal Cord & Peripheral Nerves)
        const neural = createNeuralConnectomeLayer(materials);
        synPointsRef.current = neural.synPoints;
        if (nervousGltf && nervousGltf.scene) {
          ingestHDSystem(nervousGltf, layerNerves);
          // Keep the glowing synaptic action-potential particle cloud overlaid on the HD brain & spinal cord
          if (neural.synPoints) {
            layerNerves.add(neural.synPoints);
          }
        } else {
          layerNerves.add(neural.group);
        }

        // 7b. Ingest LUMC Clinical 462-Node Lower-Limb Scan (46 Arteries, 42 Veins, 47 Nerves, 72 Ligaments, 14 Fascia, 38 Bursae)
        if (lowerLimbGltf && lowerLimbGltf.scene) {
          const rightLowerVascular = new THREE.Group();
          rightLowerVascular.name = 'ClinicalRightLowerVascular';
          const leftLowerVascular = new THREE.Group();
          leftLowerVascular.name = 'ClinicalLeftLowerVascular';
          leftLowerVascular.scale.x = -1;

          const rightLowerNerves = new THREE.Group();
          rightLowerNerves.name = 'ClinicalRightLowerNerves';
          const leftLowerNerves = new THREE.Group();
          leftLowerNerves.name = 'ClinicalLeftLowerNerves';
          leftLowerNerves.scale.x = -1;

          const rightLowerLigaments = new THREE.Group();
          rightLowerLigaments.name = 'ClinicalRightLowerLigaments';

          const getAncestorCategory = (node) => {
            let cur = node.parent;
            while (cur) {
              const pn = (cur.name || '').toLowerCase();
              if (pn.includes('arter')) return 'artery';
              if (pn.includes('vein') || pn.includes('venous')) return 'vein';
              if (pn.includes('nerv')) return 'nerve';
              if (pn.includes('ligament') || pn.includes('fascia') || pn.includes('bursa') || pn.includes('retinac')) return 'ligament';
              if (pn.includes('cartilage') || pn.includes('menisc')) return 'cartilage';
              if (pn.includes('bone') || pn.includes('muscle')) return 'skip';
              cur = cur.parent;
            }
            return '';
          };

          const rawLowerMeshes = [];
          lowerLimbGltf.scene.traverse((child) => {
            if (child.isMesh) rawLowerMeshes.push(child);
          });

          rawLowerMeshes.forEach((child) => {
            const normName = normalizeGLTFNodeName(child.name || '', child.parent?.name || '');
            const lower = normName.toLowerCase();
            const cat = getAncestorCategory(child);

            // Skip duplicate bones or muscles already loaded from lumc_skeleton.glb / fullbody.glb
            if (cat === 'skip') return;

            let targetRightGroup = null;
            let targetLeftGroup = null;
            let mat = null;

            if (cat === 'artery' || lower.includes('artery') || lower.includes('arteria')) {
              mat = materials.arterialVessel;
              targetRightGroup = rightLowerVascular;
              targetLeftGroup = leftLowerVascular;
            } else if (cat === 'vein' || lower.includes('vein') || lower.includes('saphenous')) {
              mat = materials.venousVessel;
              targetRightGroup = rightLowerVascular;
              targetLeftGroup = leftLowerVascular;
            } else if (
              cat === 'nerve' ||
              lower.includes('nerve') ||
              lower.includes('sciatic') ||
              lower.includes('cutaneous') ||
              lower.includes('plexus')
            ) {
              mat = materials.neuralPathway;
              targetRightGroup = rightLowerNerves;
              targetLeftGroup = leftLowerNerves;
            } else if (
              cat === 'ligament' ||
              cat === 'cartilage' ||
              lower.includes('ligament') ||
              lower.includes('fascia') ||
              lower.includes('bursa') ||
              lower.includes('meniscus') ||
              lower.includes('retinaculum') ||
              lower.includes('capsule') ||
              lower.includes('tendon')
            ) {
              mat =
                cat === 'cartilage' || lower.includes('cartilage') || lower.includes('meniscus')
                  ? materials.hyalineCartilage
                  : materials.fibrousLigament;
              targetRightGroup = rightLowerLigaments;
              targetLeftGroup = mirroredCartilages;
            }

            if (targetRightGroup && mat) {
              GeometryOptimizer.registerMesh(child);
              const rightMesh = new THREE.Mesh(child.geometry, mat);
              rightMesh.position.copy(child.position);
              rightMesh.rotation.copy(child.rotation);
              rightMesh.scale.copy(child.scale);
              rightMesh.name = normName;
              rightMesh.frustumCulled = true;
              targetRightGroup.add(rightMesh);
              optimizableMeshes.push(rightMesh);

              if (targetLeftGroup) {
                const leftMesh = new THREE.Mesh(child.geometry, mat);
                leftMesh.position.copy(child.position);
                leftMesh.rotation.copy(child.rotation);
                leftMesh.scale.copy(child.scale);
                leftMesh.name = normName.replace(/\.r(\.?)$/i, '.l$1').replace(/right/gi, 'left');
                leftMesh.frustumCulled = true;
                targetLeftGroup.add(leftMesh);
                optimizableMeshes.push(leftMesh);
              }
            }
          });

          layerVascular.add(rightLowerVascular);
          layerVascular.add(leftLowerVascular);
          layerNerves.add(rightLowerNerves);
          layerNerves.add(leftLowerNerves);
          layerLigaments.add(rightLowerLigaments);
        }

        optimizableMeshesRef.current = optimizableMeshes;
        const initialLod = useAnatomyStore.getState().meshLodRatio || 1.0;
        if (initialLod < 0.99) {
          GeometryOptimizer.applySceneLOD(optimizableMeshes, initialLod);
        }

        // 8. Cache Joint Pointers for Closed-Chain Kinematics (Using boneId & normalized names)
        const kJoints = {
          pelvis: null,
          lumbar: [],
          thoracic: [],
          cervical: [],
          head: null,
          mandible: null,
          rightFemur: null,
          leftFemur: null,
          rightTibia: null,
          leftTibia: null,
        };
        layerSkeletal.traverse((node) => {
          const n = (node.name || '').toLowerCase();
          const bId = node.userData?.boneId || '';
          if (bId === 'sacrum' || bId === 'os_coxae_r' || n.includes('hip') || n.includes('pelvis') || n.includes('sacrum')) {
            if (!kJoints.pelvis) kJoints.pelvis = node;
          }
          if (bId.startsWith('vertebra_l') || n.includes('lumbar')) kJoints.lumbar.push(node);
          if (bId.startsWith('vertebra_t') || n.includes('thoracic')) kJoints.thoracic.push(node);
          if (bId.startsWith('vertebra_c') || n.includes('cervical') || n.includes('atlas') || n.includes('axis')) kJoints.cervical.push(node);
          if (bId === 'frontal' || n.includes('frontal')) kJoints.head = node;
          if (bId === 'mandible' || n.includes('mandible')) kJoints.mandible = node;
          if (bId === 'femur_r' || (n.includes('femur') && /(\.r\.?$|\bright\b)/i.test(n))) kJoints.rightFemur = node;
          if (bId === 'femur_l' || (n.includes('femur') && /(\.l\.?$|\bleft\b)/i.test(n))) kJoints.leftFemur = node;
          if (bId === 'tibia_r' || (n.includes('tibia') && /(\.r\.?$|\bright\b)/i.test(n))) kJoints.rightTibia = node;
          if (bId === 'tibia_l' || (n.includes('tibia') && /(\.l\.?$|\bleft\b)/i.test(n))) kJoints.leftTibia = node;
        });
        kinematicJointsRef.current = kJoints;

        // 9. Normalize Scale Using Skeletal Bounding Box to Standard Standing Height (1.75m)
        const skelBbox = new THREE.Box3().setFromObject(layerSkeletal);
        const skelSize = skelBbox.getSize(new THREE.Vector3());
        const scaleFactor = 1.75 / (skelSize.y > 0.1 ? skelSize.y : 1.705);
        humanGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
        humanGroup.position.set(0, -skelBbox.min.y * scaleFactor, 0);

        // 10. Immediately apply Ghost vs Cortical Bone & Muscle Heatmap Materials
        applyBoneMaterials();
        applyMuscleMaterials();

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
      if (controls.enabled) controls.update();

      // 2. Pulsatile Ventricular Systole/Diastole Heartbeat Animation (Supports both HD Z-Anatomy 4-chamber heart and procedural fallback)
      const bpm = heartRateRef.current > 0 ? heartRateRef.current : 60;
      const freq = (bpm / 60) * Math.PI * 2;
      const pulse = Math.sin(time * 0.001 * freq);
      const systole = Math.max(0, pulse);

      if (hdHeartNodesRef.current && hdHeartNodesRef.current.length > 0) {
        // Pivot-compensated cardiac contraction around the heart's true anatomical center (0.018, 1.285, 0.035)
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
      } else if (heartMeshRef.current) {
        heartMeshRef.current.scale.set(
          1.0 + systole * 0.09,
          1.0 - systole * 0.05,
          1.0 + systole * 0.09
        );
      }

      // 3. Synaptic Action Potentials Glow Animation
      if (synPointsRef.current) {
        synPointsRef.current.rotation.y += delta * 0.15;
      }

      // 4. Biomechanical Force Vectors & Kinetic Wavefront Update
      if (overlaysRef.current && overlaysRef.current.visible) {
        overlaysRef.current.update(postureParamsRef.current, delta);
      }

      // 5. Shockwave Expansion Feedback (Resets on every bone selection via shockwaveTimeRef)
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
      if (transformControls) transformControls.dispose();
      if (overlaysRef.current) overlaysRef.current.dispose();
      dracoLoader.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [applyBoneMaterials, applyMuscleMaterials]);

  // 2. Sync Layer Visibility & Vector Overlays
  useEffect(() => {
    if (layerSkeletalRef.current) layerSkeletalRef.current.visible = !!layerVisibility.skeleton;
    if (layerLigamentsRef.current) layerLigamentsRef.current.visible = !!layerVisibility.ligaments;
    if (layerMusclesRef.current) layerMusclesRef.current.visible = !!layerVisibility.muscles;
    if (layerOrgansRef.current) layerOrgansRef.current.visible = !!layerVisibility.organs;
    if (layerNervesRef.current) layerNervesRef.current.visible = !!layerVisibility.nerves;
    if (layerVascularRef.current) layerVascularRef.current.visible = !!layerVisibility.circulation;
  }, [layerVisibility]);

  useEffect(() => {
    if (overlaysRef.current) {
      overlaysRef.current.setVisible(!!showVectors);
    }
  }, [showVectors]);

  // 3. Sync On-Canvas 3D TransformControls Gizmo
  useEffect(() => {
    const tc = transformControlsRef.current;
    const proxy = gizmoProxyRef.current;
    if (!tc || !proxy) return;

    if (!activeGizmoJoint || !GIZMO_JOINT_CONFIG[activeGizmoJoint]) {
      tc.detach();
      tc.visible = false;
      tc.enabled = false;
      return;
    }

    const cfg = GIZMO_JOINT_CONFIG[activeGizmoJoint];
    proxy.position.set(...cfg.pos);
    proxy.rotation.set(0, 0, 0);
    proxy.rotation[cfg.axis] = (postureParams[cfg.param] || 0) * cfg.scale;

    tc.attach(proxy);
    tc.visible = true;
    tc.enabled = true;
    cameraTargetRef.current.set(...cfg.pos);
  }, [activeGizmoJoint]);

  // 4. Update Bone Materials (Assembled vs. Ghost vs. Selected)
  useEffect(() => {
    applyBoneMaterials();
  }, [assembledBones, selectedBoneId, applyBoneMaterials]);

  // 5. Update Dynamic Muscle Strain Heatmap
  useEffect(() => {
    applyMuscleMaterials();
  }, [overactiveMuscles, underactiveMuscles, applyMuscleMaterials]);

  // 5b. Hardware GPU Mesh LOD Decimation (Ultra 100% / Balanced 65% / Low-Spec 35%)
  useEffect(() => {
    if (optimizableMeshesRef.current.length > 0) {
      GeometryOptimizer.applySceneLOD(optimizableMeshesRef.current, meshLodRatio);
    }
  }, [meshLodRatio]);

  // 6. Closed-Chain Kinematic Posture Deformation (Relative to Cached Rest Pose)
  useEffect(() => {
    const k = kinematicJointsRef.current;

    const {
      pelvisTilt = 0,
      pelvisDrop = 0,
      pelvisRotation = 0,
      lumbarLordosis = 0,
      spinalLateralBend = 0,
      thoracicKyphosis = 0,
      cervicalForwardHead = 0,
      rightKneeValgus = 0,
      leftKneeValgus = 0,
      rightFootPronation = 0,
      leftFootPronation = 0,
    } = postureParams;

    const applyRotOffset = (node, dx = 0, dy = 0, dz = 0) => {
      if (!node) return;
      const base = node.userData.restRot || new THREE.Euler();
      node.rotation.set(base.x + dx, base.y + dy, base.z + dz);
    };

    const applyPosOffset = (node, dx = 0, dy = 0, dz = 0) => {
      if (!node) return;
      const base = node.userData.restPos || new THREE.Vector3();
      node.position.set(base.x + dx, base.y + dy, base.z + dz);
    };

    // Pelvis
    if (k.pelvis) {
      applyRotOffset(k.pelvis, pelvisTilt, pelvisRotation, pelvisDrop);
    }

    // Lumbar Spine
    k.lumbar.forEach((vert, idx) => {
      const fraction = (idx + 1) / (k.lumbar.length || 1);
      applyRotOffset(
        vert,
        lumbarLordosis * fraction * 0.35,
        0,
        (pelvisDrop * 0.25 + spinalLateralBend * 0.35) * fraction
      );
    });

    // Thoracic Spine
    k.thoracic.forEach((vert, idx) => {
      const fraction = (idx + 1) / (k.thoracic.length || 1);
      applyRotOffset(
        vert,
        -thoracicKyphosis * fraction * 0.3,
        0,
        -spinalLateralBend * fraction * 0.25
      );
    });

    // Cervical Spine & Forward Head
    k.cervical.forEach((vert, idx) => {
      const fraction = (idx + 1) / (k.cervical.length || 1);
      applyRotOffset(vert, cervicalForwardHead * fraction * 0.3, 0, 0);
      applyPosOffset(vert, 0, 0, cervicalForwardHead * fraction * 0.025);
    });

    // Head & Mandible Downward Traction
    if (k.head) {
      applyRotOffset(k.head, -cervicalForwardHead * 0.2, 0, 0);
    }
    if (k.mandible) {
      applyRotOffset(k.mandible, cervicalForwardHead * 0.25, 0, 0);
    }

    // Femur Valgus & Tibial Torsion
    if (k.rightFemur) {
      applyRotOffset(k.rightFemur, 0, rightFootPronation * 0.35, -rightKneeValgus);
    }
    if (k.leftFemur) {
      applyRotOffset(k.leftFemur, 0, -leftFootPronation * 0.35, -leftKneeValgus);
    }
    if (k.rightTibia) {
      applyRotOffset(k.rightTibia, 0, rightFootPronation * 0.5, 0);
    }
    if (k.leftTibia) {
      applyRotOffset(k.leftTibia, 0, -leftFootPronation * 0.5, 0);
    }
  }, [postureParams]);

  // 7. Camera Focal Lerp & Multi-Use Shockwave on Selected Bone Change
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

  // 8. Orbit-Safe Click-to-Pick Raycaster (Only fires on clean click, not camera drag)
  const handlePointerDown = useCallback((e) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (isGizmoDraggingRef.current) return;
    const dx = e.clientX - pointerDownPosRef.current.x;
    const dy = e.clientY - pointerDownPosRef.current.y;
    // Ignore pointer releases after camera orbit/pan drag (> 5px movement)
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
