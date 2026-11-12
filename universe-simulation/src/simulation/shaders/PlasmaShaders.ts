export const PlasmaVertexShader = `
  attribute float size;
  varying vec3 vColor;
  varying float vEnergy;
  varying float vTurbulence;
  uniform float time;

  // Simple curl-noise-like turbulence
  vec3 turbulence(vec3 p) {
    float t = time * 2.0;
    return vec3(
      sin(p.y + t) * cos(p.z + t),
      sin(p.z + t) * cos(p.x + t),
      sin(p.x + t) * cos(p.y + t)
    );
  }

  void main() {
    vColor = color;
    vec3 turb = turbulence(position * 0.5);
    vTurbulence = length(turb);
    
    vec3 newPos = position + turb * (0.5 + sin(time) * 0.2);
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    
    vEnergy = sin(time * 10.0 + length(position)) * 0.5 + 0.5;
    
    gl_PointSize = size * (450.0 / -mvPosition.z) * (0.8 + vTurbulence * 0.4);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const PlasmaFragmentShader = `
  varying vec3 vColor;
  varying float vEnergy;
  varying float vTurbulence;
  uniform sampler2D pointTexture;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    
    // Quantum energy colors
    vec3 coreColor = mix(vColor, vec3(1.0, 1.0, 1.0), vEnergy * 0.5);
    vec3 shiftColor = mix(coreColor, vec3(1.0, 0.2, 0.8), vTurbulence * 0.3);
    
    float intensity = 1.0 + vEnergy * 1.5 + vTurbulence * 0.5;
    gl_FragColor = vec4(shiftColor * intensity, alpha * 0.9);
  }
`;
