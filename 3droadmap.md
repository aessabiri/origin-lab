# 3D Graphics & Engine Architecture: Origin Lab

This document outlines the 3D rendering pipelines and WebGL architecture powering Origin Lab across its three primary 3D viewports.

---

## 🎨 The 3 Three.js / WebGL Viewports

```mermaid
flowchart TD
    subgraph 🌌 Universe Simulation V2 (GLSL Pro-Graphics)
        U1["Custom GLSL Vertex & Fragment Shaders"]
        U2["PostProcessing: UnrealBloomPass & Relativistic WarpPass"]
        U3["GalaxyWorker.ts (Multi-threaded N-body Gravitational Physics)"]
        U4["MemoryUtils.ts (GPU VRAM Deallocation)"]
    end

    subgraph 🦴 3D Anatomy Lab (LUMC Clinical Rig)
        A1["18 Clinical GLTF/GLB Scans (public/models/)"]
        A2["DRACO Geometry Compression"]
        A3["MedicalMaterials.js (Physical Subsurface PBR Bone, Sheen Muscle)"]
        A4["KineticChainSolver.js (Real-time Closed-Chain Deformation)"]
        A5["Procedural Micro-Bones (Hyoid & Auditory Ossicles)"]
    end

    subgraph 🧬 3D Biophysical Protein Folder
        P1["Catmull-Rom Parametric Spline Ribbons"]
        P2["Secondary Structure Shading (Alpha Helices, Beta Sheets, Turns)"]
        P3["Covalent Disulfide (S-S) Cylindrical Bridges"]
        P4["Real-time Thermodynamic Telemetry (Delta G, Ramachandran)"]
    end
```

---

## 🚀 Performance & Memory Safeguards

1. **60 FPS Hardware Guarantee:**
   - Frustum culling and procedural geometry caching prevent redundant draw calls.
   - Post-processing render passes use half-float render targets on mobile/integrated GPUs.
2. **Zero VRAM Leak Policy:**
   - Every 3D viewport implements an explicit `dispose()` cleanup cycle unmounting textures, geometries, shaders, and framebuffers when switching tabs.
3. **Route-Level Code-Splitting:**
   - The heavy 3D viewports (`Universe` and `AnatomyLab`) are wrapped in `React.lazy()` chunks, keeping initial application bundle weight under 440 kB.
