export const AbstractVoidVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const AbstractVoidFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                   mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,0,0.1)), f.x), f.y), // Small offset fix
               mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                   mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
  }

  void main() {
    vec3 p = normalize(vPosition);
    float n = noise(p * 3.0 + vec3(0.0, 0.0, time * 0.05));
    
    vec3 col1 = vec3(0.02, 0.0, 0.05); // Deeper Indigo
    vec3 col2 = vec3(0.0, 0.02, 0.01); // Deeper Emerald
    
    vec3 color = mix(col1, col2, n);
    
    // Subtle distant energy pulses
    float pulse = smoothstep(0.4, 0.5, noise(p * 10.0 + time * 0.2));
    color += vec3(0.0, 0.3, 0.4) * pulse * 0.2;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const MultiverseVertexShader = `
  varying vec2 vUv;
  varying vec3 vViewDir;
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(worldPos.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
  }
`;

export const MultiverseFragmentShader = `
  uniform float time;
  uniform float collapseFocus; 
  uniform float vortexStrength;
  uniform float discoveryFactor; 
  uniform float energyIntensity; 

  varying vec2 vUv;
  varying vec3 vViewDir;
  varying vec3 vPosition;
  varying vec3 vNormal;

  float map(vec3 p) {
    vec3 z = p;
    float dr = 1.0;
    float r = 0.0;
    float power = 8.0 + 2.0 * sin(time * 0.1);
    int iter = 10;
    for (int i = 0; i < 10; i++) {
        r = length(z);
        if (r > 2.0) break;
        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);
        dr = pow(r, power - 1.0) * power * dr + 1.0;
        float zr = pow(r, power);
        theta = theta * power;
        phi = phi * power;
        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += p;
    }
    return 0.5 * log(r) * r / dr;
  }

  vec3 getNormal(vec3 p) {
    float h = 0.001;
    vec2 k = vec2(1, -1);
    return normalize(k.xyy * map(p + k.xyy * h) + 
                     k.yyx * map(p + k.yyx * h) + 
                     k.yxy * map(p + k.yxy * h) + 
                     k.xxx * map(p + k.xxx * h));
  }

  void main() {
    vec3 rd = normalize(vViewDir);
    float angY = vortexStrength * 6.0 + time * 0.15;
    float angX = time * 0.1;
    mat2 rotY = mat2(cos(angY), -sin(angY), sin(angY), cos(angY));
    mat2 rotX = mat2(cos(angX), -sin(angX), sin(angX), cos(angX));
    rd.xz *= rotY;
    rd.yz *= rotX;

    // Ray origin moves in based on collapse
    vec3 ro = vec3(0.0, 0.0, 2.5) - vec3(0.0, 0.0, collapseFocus * 2.4); 
    ro.xz *= rotY;
    ro.yz *= rotX;

    float t = 0.0;
    float maxD = 5.0;
    int steps = 0;
    
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < 0.001 || t > maxD) break;
        t += d;
        steps = i;
    }

    vec3 col = vec3(0.0);
    float alpha = 0.95; // Default solid-ish black

    if (t < maxD) {
        // We hit the Mandelblob fractal
        vec3 p = ro + rd * t;
        vec3 n = getNormal(p);
        vec3 l = normalize(vec3(5.0, 5.0, 5.0) - p);
        
        float diff = max(dot(n, l), 0.0);
        float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 4.0);
        
        vec3 baseCol = 0.5 + 0.5 * cos(time * 0.2 + p.xyx * 2.0 + vec3(0, 2, 4));
        col = (baseCol * diff * 1.2 + 0.05);
        col += vec3(0.2, 0.6, 1.0) * fresnel * 1.5;
        col += vec3(1.0, 0.2, 0.4) * energyIntensity * 3.0;
        
        // Use discovery factor to reveal the fractal colors
        col *= discoveryFactor;
        alpha = max(0.95, discoveryFactor);
    } else {
        // SILHOUETTE: Show a black void sphere
        float rim = pow(1.0 - max(dot(normalize(vNormal), -normalize(vViewDir)), 0.0), 3.0);
        col = vec3(0.01, 0.0, 0.02) * rim; // Dark purple rim
        alpha = 1.0;
    }

    // Fade out entirely during final collapse
    float finalFade = 1.0 - smoothstep(0.98, 1.0, collapseFocus);
    gl_FragColor = vec4(col * finalFade, alpha * finalFade);
  }
`;

export const BeaconVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const BeaconFragmentShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  void main() {
    float flare = exp(-abs(vUv.y - 0.5) * 25.0);
    float pulse = sin(vUv.x * 20.0 - time * 15.0) * 0.5 + 0.5;
    vec3 col = vec3(0.0, 1.0, 0.8) * flare * pulse * intensity;
    gl_FragColor = vec4(col, col.r * 0.5);
  }
`;
