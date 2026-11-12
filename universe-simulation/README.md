# 🌌 Universe Simulation V2: Big Bang to Earth

An interactive, world-class 3D cosmic journey built with **Three.js**, **TypeScript**, and **Advanced GLSL Pro-Graphics**. This simulation allows users to traverse 13.8 billion years of cosmic history, from the initial singularity to the evolution of a habitable Earth.

## 🚀 The V2 Graphics Engine
The V2 engine represents a massive leap in visual fidelity, bringing desktop-grade cosmic effects to the browser:

- **Volumetric Raymarching (Nebulas):** True 3D cosmic dust volumes with internal light scattering and procedural color shifting.
- **Rayleigh Scattering (Atmosphere):** A physically-based atmospheric engine for Earth, creating realistic blue horizons and fiery sunsets.
- **4D Cosmic Flux (Big Bang):** Primordial energy rendered using multi-dimensional noise fields for a more chaotic, high-energy "Origin" event.
- **Quantum Turbulence (Plasma):** Fluid-dynamics-inspired shader simulation for the ultra-hot quark-gluon soup.
- **Relativistic Star Shifting:** Galaxy stars dynamically shift colors based on orbital proximity and density wave theory.
- **Unified Planet Shader:** Physically-based planetary rendering with dynamic night-side city lights and atmospheric halos.

---

## 🛠️ Technical Architecture

### 🎨 Visual Engineering
- **GLSL Pro-Graphics:** Custom shaders for every epoch, bypassing standard material limitations for maximum artistic control and performance.
- **Cinematic Post-Processing:** Advanced Bloom and Tone Mapping pipeline optimized for high-dynamic-range cosmic visuals.
- **Procedural Universe:** 100% of textures and geometries (from galaxies to lava flows) are generated on the GPU using procedural noise.

### ⚙️ Performance & Architecture
- **State-Driven Timeline:** A centralized `SimulationManager` manages seamless transitions across 13.8 billion years.
- **Robust Memory Lifecycle:** Explicit GPU resource disposal (`init()`/`destroy()` pattern) ensures zero VRAM leaks during stage transitions.
- **Optimized Particle Systems:** Millions of concurrent particles managed through efficient buffer attributes and GPU-side logic.

---

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation
```bash
git clone https://github.com/aessabiri/universe-simulation.git
cd universe-simulation
npm install
```

### Development
```bash
npm run dev
```

### Controls
- **Timeline Slider:** Scrub through 13.8 billion years of cosmic history.
- **WASD + Mouse:** Navigate through the Big Bang and Plasma stages.
- **Planet Focus:** In Solar System mode, lock the camera to specific worlds to begin atmospheric analysis.

---

## 📖 Future Roadmap
See [PLAN.md](./PLAN.md) for the next phases of our world-class evolution.

## 🤖 AI Interaction Mandates
See [GEMINI.md](./GEMINI.md) for the foundational instructions used to develop this project.
