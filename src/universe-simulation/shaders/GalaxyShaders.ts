export const GalaxyVertexShader = `
  attribute float size;
  attribute float armProximity; 
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vProximity;
  uniform float time;

  void main() {
    vColor = color;
    vProximity = armProximity;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Sharper twinkle
    float t = time * 2.0;
    vTwinkle = pow(sin(t + length(position.xz) * 0.1) * 0.5 + 0.5, 3.0);
    
    gl_PointSize = size * (280.0 / -mvPosition.z) * (0.8 + vTwinkle * 0.4);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const GalaxyFragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vProximity;
  uniform sampler2D pointTexture;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    
    // Circular glow
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Temperature shift: Arms are hotter (bluer)
    vec3 hotColor = vec3(0.6, 0.8, 1.0);
    vec3 baseColor = mix(vColor, hotColor, vProximity * 0.6);
    
    // Dimmer overall to avoid white blob, but allow twinkles to pop
    float intensity = 0.6 + (vTwinkle * 1.5) * vProximity;
    
    gl_FragColor = vec4(baseColor * intensity, alpha * 0.8);
  }
`;
