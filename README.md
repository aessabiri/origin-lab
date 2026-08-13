# 🌌 Origin Lab — From Quarks to Planetary Civilization

**Origin Lab** is an interactive, multi-disciplinary scientific simulation sandbox gamifying the evolution of universal matter from subatomic quantum physics to macroscopic cellular life and planetary civilizations.

---

## 🔬 The 5 Scientific Laboratories & Epochs

### ⚛️ 1. Physics Lab (Particle Physics & Quantum Mechanics)
* **Mechanics**: 60 FPS HTML5 Canvas simulation with Coulomb electrostatic forces, strong nuclear binding, Lennard-Jones molecular potentials, and gravitational clustering.
* **Quantum Features**:
  * Elementary vector particle icons (Quarks with $+2/3e, -1/3e$ fractional charges, Leptons, Gauge Bosons, Baryons, Antimatter annihilation).
  * Isotope fusion & beta/alpha radioactive decay timeout cascades.
  * **Interactive Periodic Table**: Categorized element families, standard atomic weights, atomic series filters, and pin controls.
  * **Recursive Subatomic Lineage Tree**: Trace any macroscopic element or compound down to its exact constituent protons, neutrons, electrons, and fundamental quarks.

### ⚗️ 2. Chemistry Lab (Thermodynamics & Reaction Kinetics)
* **Mechanics**: Real-time numerical integration of Arrhenius chemical kinetics, enthalpy ($\Delta H$), Gibbs free energy ($\Delta G$), phase transitions, and boiling/condensation curves.
* **Apparatus**: Beakers, Erlenmeyer Flasks, Distillation Condensers, High-Pressure Autoclaves, and Bunsen Burners.
* **Dynamic Systems**: Local and global reagent exchange, dynamic acid-base pH titration with universal indicator color mapping, saturated solubility curves, and toxic gas detection with active ventilation.

### 🧫 3. Biology Lab (Genetics, Protein Folding & Cellular Ecology)
* **Interactive Genetic Code Studio**:
  * 64-Codon translation engine transcribing $5' \rightarrow 3'$ coding DNA into mRNA and amino acid residues.
  * Point mutation tools and frame-shift detection.
  * **Real-time 3D Biophysical Protein Folding**: Continuous Catmull-Rom spline ribbons, translucent residue spheres, disulfide ($S-S$) bridges, and live $\Delta G$ thermodynamic telemetry.
* **LUCA Cell Builder**: Drag-and-drop organelle engineering (Nucleus, Mitochondria, Ribosomes, Lipid Membranes).
* **Agent-Based Petri Dish**: 32-bit bitwise spatial hashing, 60 FPS in-place agent simulation, phototropism, predator-prey dynamics, and Darwinian mitosis with genome mutation.

### 🌍 4. Planetary View (Darwinian Planetary Biosphere)
* Real-time planetary evolution engine seeded with LUCA.
* Interactive environmental controllers: Volcanic $CO_2$ venting, Ocean temperature regulators, and Solar radiation shields.
* Simulates the Great Oxidation Event, Snowball Earth, Cambrian Explosion, Terrestrial Conquest, and Civilization rise.

### ✨ 5. Cosmic Timeline & Stellar Nursery (Astrophysics)
* Big Bang nucleosynthesis timeline, Dark Ages expansion, and Stellar Nursery star formation.
* Time-scrubbing controls and procedural stellar lifecycle progression.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **3D Visualizations**: [Three.js](https://threejs.org/) / [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) / [@react-three/drei](https://github.com/pmndrs/drei)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) with Universal Ledger (`useInventory`)
* **Styling**: Vanilla Tailwind CSS with custom sci-fi glassmorphism design system
* **Testing**: [Vitest](https://vitest.dev/) (32 Test Suites, 142 Unit & Integration Tests)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to start experimenting.

### 3. Run Test Suite
```bash
npm test run
```

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Zero-Config Vercel Deployment
The repository is structured with `package.json`, `index.html`, and `vite.config.mjs` directly in the root directory. Vercel automatically detects the Vite framework and builds the project with zero configuration.