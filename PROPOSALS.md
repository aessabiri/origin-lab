# Engineering Proposals: Origin Lab

This document tracks completed proposals and defines active architectural proposals for upcoming sprints.

---

## 🟢 Completed Proposals

- [x] **Proposal 1: Environmental Bioreactor Viability Trials:** 3-stage stress tests (Thermal Shock $\to$ UV Flux $\to$ Starvation) certifying cells in `IncubationChamber.jsx`.
- [x] **Proposal 2: 3D Biophysical Protein Folding:** Catmull-Rom spline ribbons, $\alpha$-helices, $\beta$-sheets, and disulfide bridges in `ProteinFolder.jsx`.
- [x] **Proposal 3: Multi-Phase Chemistry & Stratification:** Immiscible fluid layering, precipitate settling, and Henry's law headspace partitioning in `chemistry-lab`.
- [x] **Proposal 4: 206-Bone Granular Human Skeletal Assembly:** Full individual bone snap-fit matrix with clinical CT node matching in `anatomy-lab`.

---

## 🚀 Active Proposals for Upcoming Sprints

### Proposal A: Persistent Background Universe Clock
* **Concept:** Run a lightweight Web Worker (`CosmicClockWorker.ts`) that ticks cosmic epochs forward even while the player works in the Particle, Chemistry, Bio, or Anatomy labs.
* **Benefit:** Eliminates the static feeling of the universe; players feel the passage of cosmic deep time.

### Proposal B: Astrophysical Nucleosynthesis Gating
* **Concept:** Connect bone assembly and hemoglobin synthesis to background cosmic epochs.
* **Mechanism:**
  - Before stars ignite, only $H$ and $He$ are available.
  - When Supernovae occur in the background, a cosmic notification alerts the player: *"Stellar core collapse has forged Calcium & Phosphorus!"*
  - Unlocks hydroxyapatite bone mineral synthesis in the Anatomy Lab.

### Proposal C: The 3D-to-Genomic Blueprint Compiler
* **Concept:** A translation engine (`blueprintCompiler.js`) that reads the player's assembled 3D anatomy (bone ratios, muscular posture, neural volume) and encodes it into an encrypted synthetic genome string packaged into LUCA.
* **Benefit:** Gives direct mechanical causality between what the player builds in the 3D Anatomy Lab and what emerges on Earth.
