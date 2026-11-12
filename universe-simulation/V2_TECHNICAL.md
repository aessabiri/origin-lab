# 🛠️ Universe Simulation V2: Technical Specification

This document details the architectural and mathematical foundations of the V2 Graphics Engine.

## 1. The Core Lifecycle (State Machine)
The engine is driven by a centralized `SimulationManager` that acts as a high-level state machine. 
- **Stage Encapsulation:** Each cosmic epoch is an implementation of the `Stage` abstract class.
- **Async Asset-Free Pipeline:** Stages are initialized on-demand. V2 uses a "Zero-Asset" approach—all textures are generated via HTML5 Canvas or GLSL Noise during `init()`.
- **Memory Discipline:** Every stage must implement `destroy()`, which triggers recursive disposal of Geometries, Materials, and Textures via `MemoryUtils`.

## 2. Advanced Shader Implementations (GLSL)

### 🌌 Volumetric Raymarching (Stellar Dawn)
Instead of standard mesh rendering, the nebulas use a 48-step raymarching algorithm inside a `BoxGeometry`.
- **Density Accumulation:** Light is accumulated along the view ray based on a 3D noise field.
- **Procedural Color Flux:** Colors are interpolated based on local density and a global `time` uniform to simulate shifting gas clouds.

### 🌍 Rayleigh Scattering (Earth)
The atmospheric glow uses a physically-based approximation of light scattering.
- **RIM Falloff:** Uses a high-power Fresnel equation (`pow(1.0 - abs(viewDotNormal), 6.0)`) to simulate the atmospheric thickness at the horizon.
- **Sunset Transition:** Dynamically calculates the dot product between the surface normal and the `sunPosition` to shift scattering colors from blue to orange.

### ⚛️ Quantum Turbulence (Plasma)
Simulates fluid-like behavior using a custom curl-noise approximation in the vertex shader.
- **Eddy Currents:** Particles are displaced using nested trigonometric functions to create chaotic, swirling motions without expensive CPU physics.

## 3. High-Performance Particle Systems
V2 manages over 500,000 active particles across different stages.
- **Attribute Packing:** Color, size, and proximity data are packed into `Float32Array` buffer attributes.
- **GPU Twinkle:** Shimmering is calculated entirely in the fragment shader using a multi-frequency noise function (`sin(time * f1) * cos(time * f2)`).

## 4. Unified Planet Shader (Solar System)
Every celestial body shares a single modular shader.
- **Night-Side Logic:** Uses a `nightMask` to reveal emissive "city light" textures when the surface faces away from the `sunPosition`.
- **Atmospheric Halos:** An integrated scattering rim that matches the planet's primary color profile.

## 5. Performance Targets
- **Target Frame Rate:** 60-144 FPS on modern desktop GPUs.
- **VRAM Footprint:** < 200MB (due to procedural generation).
- **CPU Overhead:** Minimal (limited to orbit calculations and UI synchronization).
