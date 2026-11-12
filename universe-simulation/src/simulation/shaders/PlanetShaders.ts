export const PlanetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPos;
  void main() {
    vUv = uv;
    vLocalPos = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosition = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const PlanetFragmentShader = `
  uniform sampler2D map;
  uniform vec3 sunPosition;
  uniform float planetId; // Used to seed variation
  uniform float hasAtmosphere;
  uniform vec3 atmoColor;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPos;

  void main() {
    vec3 lightDir = normalize(sunPosition - vPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    vec4 texColor = texture2D(map, vUv);
    
    // Night side city lights logic (mostly for Earth-like)
    float nightMask = smoothstep(0.5, 0.2, diff);
    vec3 nightColor = vec3(1.0, 0.8, 0.4) * nightMask * 0.5;
    if (planetId != 2.0) nightColor *= 0.1; // Only Earth has bright lights

    // Atmospheric scattering halo
    float rim = pow(1.0 - max(dot(vNormal, normalize(cameraPosition - vPosition)), 0.0), 4.0);
    vec3 scattering = atmoColor * rim * diff * hasAtmosphere;

    vec3 finalColor = texColor.rgb * (diff + 0.05) + nightColor + scattering;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
