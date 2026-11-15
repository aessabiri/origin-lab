import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const CRYO_GLB_PATHS = {
  ribosome: '/assets/organelles/ribosome_80s.glb',
  mitochondrion: '/assets/organelles/atp_synthase_cryo.glb',
  nucleus: '/assets/organelles/npc_cryo.glb',
  plasma_membrane: '/assets/organelles/nav_channel_cryo.glb',
};

const cryoCache = new Map();
const pendingLoads = new Map();

let sharedLoader = null;
function getLoader() {
  if (sharedLoader) return sharedLoader;
  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath('/draco/');
  loader.setDRACOLoader(draco);
  sharedLoader = loader;
  return loader;
}

/**
 * Loads and caches real experimental Cryo-EM .glb meshes derived from RCSB PDB
 * (4UG0 80S Ribosome, 6J5I ATP Synthase, 7R5K Nuclear Pore, 6AGF NaV1.4).
 */
export function loadOrganelleCryoGlb(organelleId) {
  const path = CRYO_GLB_PATHS[organelleId];
  if (!path || typeof window === 'undefined') return Promise.resolve(null);

  if (cryoCache.has(organelleId)) {
    return Promise.resolve(cryoCache.get(organelleId).clone());
  }
  if (pendingLoads.has(organelleId)) {
    return pendingLoads.get(organelleId).then((scene) => (scene ? scene.clone() : null));
  }

  const promise = new Promise((resolve) => {
    getLoader().load(
      path,
      (gltf) => {
        const root = gltf.scene;
        root.traverse((obj) => {
          if (obj.isMesh) {
            obj.material = new THREE.MeshStandardMaterial({
              vertexColors: true,
              roughness: 0.42,
              metalness: 0.1,
            });
          }
        });
        cryoCache.set(organelleId, root);
        pendingLoads.delete(organelleId);
        resolve(root.clone());
      },
      undefined,
      () => {
        pendingLoads.delete(organelleId);
        resolve(null);
      }
    );
  });

  pendingLoads.set(organelleId, promise);
  return promise;
}
