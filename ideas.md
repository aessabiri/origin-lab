# Forward-Looking Expansion Ideas: Origin Lab

This document tracks future features and ambitious ideas for Origin Lab beyond the current sprint.

---

## 💡 Top Architectural Expansions

### 1. 🔬 Deep-Tissue Cellular Histology View
* **Concept:** Seamless zoom from the 3D bone or muscle in Anatomy Lab down into osteocytes, collagen triple-helices, and hydroxyapatite crystal lattices.
* **Tech:** Continuous LOD scaling using Three.js level-of-detail and dynamic texture mipmaps.

### 2. 🧬 Real-Time AlphaFold / Biophysical Residue Docking
* **Concept:** Interactive drug/ligand binding where players fold synthetic enzymes to break down toxic planetary contaminants (e.g. sulfur dioxide or plastic polymers).
* **Tech:** Extension of the existing `biophysicsFolding.js` energy minimization beam search.

### 3. 🌌 Exoplanetary Terraforming & Multiverse Branching
* **Concept:** Instead of only Earth, deploy the compiled Panspermia Seed to Mars, Titan, or TRAPPIST-1e with custom gravities (e.g., lower gravity produces taller skeletons with lower bone mineral density!).
* **Tech:** Procedural planetary shader parameters modifying the skeletal rig dimensions.

### 4. 🧠 Neural Connectome Synapse Routing Mini-Game
* **Concept:** Trace action potential pathways through the thalamus, amygdala, and prefrontal cortex to calibrate emotional and rational traits for the evolving civilization.
* **Tech:** Particle flow along Catmull-Rom splines in the neural layer.

---

## ⚡ Technical Optimizations Under Consideration
* **WebGPU Shaders:** Migrate heavy particle and stellar field calculations from WebGL to WebGPU compute pipelines.
* **Audio Synthesis Overhaul:** Expand Web Audio API procedural synthesis for dynamic orchestral swells matching cosmic epochs.
