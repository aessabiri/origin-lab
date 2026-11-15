import * as THREE from 'three';
import { createSingleElement3DModel } from './chamberVisualEffects';

const iconCache = new Map();
let sharedRenderer = null;
let sharedScene = null;
let sharedCamera = null;

function ensureOffscreenRig() {
  if (sharedRenderer) return true;
  if (typeof document === 'undefined') return false;
  try {
    sharedRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    sharedRenderer.setSize(256, 256);
    sharedRenderer.setPixelRatio(1);
    sharedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    sharedRenderer.toneMappingExposure = 1.18;

    sharedScene = new THREE.Scene();
    sharedCamera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
    sharedCamera.position.set(0.2, 0.18, 0.6);
    sharedCamera.lookAt(0, 0, 0);

    sharedScene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xe0f2fe, 2.4);
    key.position.set(2.2, 3.0, 2.8);
    sharedScene.add(key);

    const fill = new THREE.DirectionalLight(0x38bdf8, 1.1);
    fill.position.set(-2.0, 1.2, 1.8);
    sharedScene.add(fill);

    const rim = new THREE.PointLight('#fb923c', 1.6, 8);
    rim.position.set(-1.6, -1.2, 1.4);
    sharedScene.add(rim);
    return true;
  } catch {
    return false;
  }
}

/**
 * Renders a 128x128 3D snapshot of any biology element (matching the chamber 1:1)
 * using a single shared offscreen WebGL context and caches the PNG data URL.
 */
export function renderElement3DIcon(id, color = '#38bdf8') {
  const key = `${id}__${color}`;
  if (iconCache.has(key)) return iconCache.get(key);

  if (!ensureOffscreenRig()) return null;

  const model = createSingleElement3DModel(id, color, { scale: 1.08 });
  // Auto-fit bounding box to fill the 128x128 frame nicely
  const box = new THREE.Box3().setFromObject(model);
  if (!box.isEmpty()) {
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 0.05);
    const fitScale = 0.3 / maxDim;
    model.position.sub(center.multiplyScalar(fitScale));
    model.scale.multiplyScalar(fitScale);
  }
  model.rotation.set(0.22, -0.35, 0.08);

  sharedScene.add(model);
  sharedRenderer.render(sharedScene, sharedCamera);
  const dataUrl = sharedRenderer.domElement.toDataURL('image/png');
  sharedScene.remove(model);

  // Dispose temporary geometries/materials
  model.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
  });

  iconCache.set(key, dataUrl);
  return dataUrl;
}
