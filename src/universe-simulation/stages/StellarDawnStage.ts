import * as THREE from 'three';
import { Stage } from '../Stage';
import { TextureUtils } from '../TextureUtils';
import { MemoryUtils } from '../MemoryUtils';

export class StellarDawnStage extends Stage {
  private nebulaVolume: THREE.Mesh | null = null;
  private firstStars: THREE.Points | null = null;
  private staticStars: THREE.Points | null = null;
  private protoStars: THREE.Points | null = null;
  private particleCount = 200; 
  private staticParticleCount = 1000; 
  private starStates: { birthTime: number, pos: THREE.Vector3, color: THREE.Color }[] = [];

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, container: HTMLElement, sunLight: THREE.DirectionalLight) {
    super(scene, camera, container, sunLight);
  }

  init() {
    // 1. VOLUMETRIC RAYMARCHING NEBULA (GLSL)
    const volumeSize = 500;
    const geometry = new THREE.BoxGeometry(volumeSize, volumeSize, volumeSize);
    
    const nebulaMaterial = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
            time: { value: 0 },
            cameraPos: { value: new THREE.Vector3() }
        },
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vWorldPosition;
            void main() {
                vPosition = position;
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPos.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vPosition;
            varying vec3 vWorldPosition;
            uniform float time;
            uniform vec3 cameraPos;

            // Simple noise for GLSL
            float hash(float n) { return fract(sin(n) * 43758.5453123); }
            float noise(vec3 x) {
                vec3 p = floor(x);
                vec3 f = fract(x);
                f = f*f*(3.0-2.0*f);
                float n = p.x + p.y*57.0 + 113.0*p.z;
                return mix(mix(mix(hash(n+  0.0), hash(n+  1.0),f.x),
                               mix(hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                           mix(mix(hash(n+113.0), hash(n+114.0),f.x),
                               mix(hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
            }

            void main() {
                vec3 rayDir = normalize(vWorldPosition - cameraPos);
                vec3 rayOrigin = cameraPos;
                
                float accum = 0.0;
                vec3 colorAccum = vec3(0.0);
                float t = 0.0;
                
                // 48-Step Raymarching
                for(int i=0; i<48; i++) {
                    vec3 p = rayOrigin + rayDir * t;
                    float d = noise(p * 0.02 + time * 0.05);
                    
                    float density = smoothstep(0.4, 0.7, d) * 0.15;
                    
                    vec3 pCol = mix(vec3(1.0, 0.3, 0.1), vec3(0.4, 0.2, 1.0), d);
                    pCol = mix(pCol, vec3(0.0, 0.8, 0.7), sin(time * 0.1) * 0.5 + 0.5);
                    
                    colorAccum += pCol * density * (1.0 - accum);
                    accum += density;
                    
                    if (accum >= 0.95) break;
                    t += 8.0; 
                }
                
                gl_FragColor = vec4(colorAccum, accum * 0.8);
            }
        `
    });

    this.nebulaVolume = this.register(new THREE.Mesh(geometry, nebulaMaterial));
    this.scene.add(this.nebulaVolume);

    // 2. STELLAR IGNITION
    const starGeo = new THREE.BufferGeometry();
    this.particleCount = 1200; // Much higher density
    const posArr = new Float32Array(this.particleCount * 3);
    const colArr = new Float32Array(this.particleCount * 3);
    const sizeArr = new Float32Array(this.particleCount);
    
    const colors = [
        new THREE.Color(0xaaccff), // Blue Giant
        new THREE.Color(0xfff4bb), // Yellow
        new THREE.Color(0xffffff), // White
        new THREE.Color(0xffccaa)  // Orange/Red
    ];

    for (let i = 0; i < this.particleCount; i++) {
      const r = 30 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const pos = new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      // Staggered birth times over a long period
      this.starStates.push({ 
          birthTime: Math.random() * 500, 
          pos, 
          color: colors[Math.floor(Math.random() * colors.length)].clone() 
      });
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizeArr, 1));

    this.firstStars = this.register(new THREE.Points(starGeo, new THREE.ShaderMaterial({
      vertexShader: `attribute float size; attribute vec3 color; varying vec3 vColor; void main() { vColor = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * (500.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }`,
      fragmentShader: `varying vec3 vColor; void main() { float d = length(gl_PointCoord - vec2(0.5)); if (d > 0.5) discard; gl_FragColor = vec4(vColor, 1.0 - smoothstep(0.0, 0.5, d)); }`,
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    })));
    this.scene.add(this.firstStars);

    // 3. PROTOSTARS
    const protoCount = 10;
    const protoGeo = new THREE.BufferGeometry();
    const protoPos = new Float32Array(protoCount * 3);
    for (let i = 0; i < protoCount; i++) {
        const i3 = i * 3;
        const r = 50 + Math.random() * 150;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        protoPos[i3] = r * Math.sin(phi) * Math.cos(theta);
        protoPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        protoPos[i3 + 2] = r * Math.cos(phi);
    }
    protoGeo.setAttribute('position', new THREE.BufferAttribute(protoPos, 3));
    this.protoStars = this.register(new THREE.Points(protoGeo, new THREE.PointsMaterial({
        size: 3.0, color: 0xffffff, map: TextureUtils.createCircularParticleTexture(),
        transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending, depthWrite: false
    })));
    this.scene.add(this.protoStars);

    // 4. STATIC STARS
    const staticGeo = new THREE.BufferGeometry();
    const staticPos = new Float32Array(this.staticParticleCount * 3);
    for (let i = 0; i < this.staticParticleCount; i++) {
      const i3 = i * 3;
      const r = 100 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      staticPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      staticPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      staticPos[i3 + 2] = r * Math.cos(phi);
    }
    staticGeo.setAttribute('position', new THREE.BufferAttribute(staticPos, 3));
    this.staticStars = this.register(new THREE.Points(staticGeo, new THREE.PointsMaterial({ size: 0.5, color: 0xaaccff, transparent: true, opacity: 0.5 })));
    this.scene.add(this.staticStars);

    this.register(TextureUtils.addCosmicBackground(this.scene, 25));
    this.camera.position.set(0, 0, 10);
  }

  public getMetrics() {
    return {
      phase: "Cosmic Dawn",
      temp: "100 K",
      atmo: "Primordial Hydrogen",
      o2: "0%",
      status: "First Stars Igniting"
    };
  }

  update(time: number, delta: number, renderer: THREE.WebGLRenderer) {
    if (this.nebulaVolume) {
        const mat = this.nebulaVolume.material as THREE.ShaderMaterial;
        mat.uniforms.time.value = time * 0.001;
        mat.uniforms.cameraPos.value.copy(this.camera.position);
    }

    if (!this.firstStars) return;
    const positions = this.firstStars.geometry.attributes.position.array as Float32Array;
    const colors = this.firstStars.geometry.attributes.color.array as Float32Array;
    const sizes = (this.firstStars.geometry.attributes as any).size.array as Float32Array;
    const t = time * 0.001;

    for (let i = 0; i < this.particleCount; i++) {
        const state = this.starStates[i];
        const i3 = i * 3;
        let age = t - state.birthTime;
        let intensity = 0;
        let starSize = 0;

        if (age > 0) {
            // Ignition phase (0 to 5 seconds)
            if (age < 5.0) { 
                intensity = (age / 5.0) * 1.5; 
                starSize = intensity * 4.0; 
            } else {
                // Stable phase with twinkling
                intensity = 1.0 + Math.sin(t * (3.0 + (i % 5)) + i) * 0.15; 
                starSize = 1.2 + Math.cos(t * 2.0 + i) * 0.3;
            }
        }

        positions[i3] = state.pos.x; positions[i3+1] = state.pos.y; positions[i3+2] = state.pos.z;
        colors[i3] = state.color.r * intensity; 
        colors[i3+1] = state.color.g * intensity; 
        colors[i3+2] = state.color.b * intensity;
        sizes[i] = starSize;
    }
    this.firstStars.geometry.attributes.position.needsUpdate = true;
    this.firstStars.geometry.attributes.color.needsUpdate = true;
    (this.firstStars.geometry.attributes as any).size.needsUpdate = true;

    // Slow cinematic drift
    this.camera.position.x += Math.sin(t * 0.1) * 0.05;
    this.camera.position.y += Math.cos(t * 0.1) * 0.05;
    this.camera.lookAt(0, 0, 0);
  }

  destroy() {
    super.destroy();
  }
}
