import * as THREE from 'three';
import { MemoryUtils } from './MemoryUtils';

export abstract class Stage {
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected sunLight: THREE.DirectionalLight;
  protected container: HTMLElement;
  protected stageObjects: THREE.Object3D[] = [];

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, container: HTMLElement, sunLight: THREE.DirectionalLight) {
    this.scene = scene;
    this.camera = camera;
    this.container = container;
    this.sunLight = sunLight;
  }

  abstract init(): void;
  abstract update(time: number, delta: number, renderer: THREE.WebGLRenderer): void;
  
  public destroy(): void {
    MemoryUtils.cleanup(this.stageObjects);
    this.stageObjects.forEach(obj => {
        if (obj.parent) obj.parent.remove(obj);
        else this.scene.remove(obj);
    });
    this.stageObjects = [];
  }

  protected register<T extends THREE.Object3D>(obj: T): T {
    this.stageObjects.push(obj);
    return obj;
  }

  public getFocusTarget(): THREE.Vector3 | null {
    return null; // Default to no specific focus target
  }
}
