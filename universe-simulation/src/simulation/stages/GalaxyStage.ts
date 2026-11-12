import * as THREE from 'three';
import { Stage } from '../Stage';
import { TextureUtils } from '../TextureUtils';
import { MemoryUtils } from '../MemoryUtils';
import { GalaxyVertexShader, GalaxyFragmentShader } from '../shaders/GalaxyShaders';

export class GalaxyStage extends Stage {
  private galaxyGroup: THREE.Group = new THREE.Group();
  private stars: THREE.Points | null = null;
  private bulge: THREE.Points | null = null;
  private dust: THREE.Points | null = null;
  private nebulae: THREE.Points | null = null;
  private timeUniform = { value: 0 };
  private worker: Worker | null = null;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, container: HTMLElement, sunLight: THREE.DirectionalLight) {
    super(scene, camera, container, sunLight);
  }

  init() {
    this.register(this.galaxyGroup);
    this.scene.add(this.galaxyGroup);

    const config = {
      radius: 25,
      branches: 3,
      spin: 4.5, 
      randomness: 0.06, 
      randomnessPower: 6.0, 
      coreRadius: 4
    };

    // Use Web Worker for background generation
    this.worker = new Worker(new URL('../workers/GalaxyWorker.ts', import.meta.url), { type: 'module' });
    
    this.worker.onmessage = (e) => {
      const { starPos, starCol, starSiz, starProx, corePos, coreCol, coreSiz } = e.data;
      
      this.createStars(starPos, starCol, starSiz, starProx);
      this.createBulge(corePos, coreCol, coreSiz);
      this.createDust(config);
      this.createNebulae(config);
      this.createCoreGlow();
    };

    this.worker.postMessage({
      config,
      starCount: 65000,
      coreCount: 15000,
      dustCount: 18000,
      nurseryCount: 1200
    });

    this.register(TextureUtils.addCosmicBackground(this.scene, 60));
    this.camera.position.set(0, 20, 30);
    this.camera.lookAt(0, 0, 0);
  }

  private createStars(pos: Float32Array, col: Float32Array, siz: Float32Array, prox: Float32Array) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(siz, 1));
    geo.setAttribute('armProximity', new THREE.BufferAttribute(prox, 1));

    this.stars = this.register(new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: { time: this.timeUniform, pointTexture: { value: TextureUtils.createCircularParticleTexture() } },
      vertexShader: GalaxyVertexShader,
      fragmentShader: GalaxyFragmentShader,
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    })));
    this.galaxyGroup.add(this.stars);
  }

  private createBulge(pos: Float32Array, col: Float32Array, siz: Float32Array) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(siz, 1));

    this.bulge = this.register(new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: { time: this.timeUniform, pointTexture: { value: TextureUtils.createCircularParticleTexture() } },
      vertexShader: GalaxyVertexShader,
      fragmentShader: GalaxyFragmentShader,
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    })));
    this.galaxyGroup.add(this.bulge);
  }

  private createDust(config: any) {
    const count = 18000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * config.radius;
      const spinAngle = radius * config.spin + 0.4; 
      const branchAngle = ((i % config.branches) / config.branches) * Math.PI * 2;
      const rX = Math.pow(Math.random(), 3.0) * (Math.random() < 0.5 ? 1 : -1) * config.randomness * radius;
      const rZ = Math.pow(Math.random(), 3.0) * (Math.random() < 0.5 ? 1 : -1) * config.randomness * radius;
      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + rX;
      pos[i3+1] = (Math.random()-0.5) * 0.2;
      pos[i3+2] = Math.sin(branchAngle + spinAngle) * radius + rZ;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.dust = this.register(new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.12, color: '#0a0502', transparent: true, opacity: 0.4, depthWrite: false
    })));
    this.galaxyGroup.add(this.dust);
  }

  private createNebulae(config: any) {
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * (config.radius - 5);
      const spinAngle = radius * config.spin;
      const branchAngle = ((i % config.branches) / config.branches) * Math.PI * 2;
      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + (Math.random()-0.5)*1.5;
      pos[i3+1] = (Math.random()-0.5)*0.2;
      pos[i3+2] = Math.sin(branchAngle + spinAngle) * radius + (Math.random()-0.5)*1.5;
      const c = new THREE.Color('#ff4488').lerp(new THREE.Color('#ff00ff'), Math.random());
      col[i3] = c.r; col[i3+1] = c.g; col[i3+2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.nebulae = this.register(new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.25, vertexColors: true, map: TextureUtils.createCircularParticleTexture(),
      transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false
    })));
    this.galaxyGroup.add(this.nebulae);
  }

  private createCoreGlow() {
    const coreGlow = this.register(new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    ));
    this.galaxyGroup.add(coreGlow);
  }

  public getMetrics() {
    return {
      phase: "Galactic Maturation",
      temp: "2.73 K (CMB)",
      atmo: "Interstellar Medium",
      o2: "0%",
      status: "Star Formation Peak"
    };
  }

  update(time: number, delta: number, renderer: THREE.WebGLRenderer) {
    const t = time * 0.001;
    this.timeUniform.value = t;
    if (this.galaxyGroup) {
      this.galaxyGroup.rotation.y = t * 0.05; 
    }
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    super.destroy();
  }
}
