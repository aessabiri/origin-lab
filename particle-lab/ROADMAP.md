# Development Roadmap: Project Singularity

This roadmap outlines the technical milestones required to reach the "Bigger Picture" goal: from the Big Bang to Human Consciousness.

---

## 🟢 Phase 1: Current Foundation (Polishing)
*Status: Completed*
- [x] **Unified Navigation:** Central Hub for all laboratories.
- [x] **Rendering Optimization:** Porting Biology and Physics to Canvas for performance.
- [x] **Life Mechanics:** Implementing Metabolism, Predation, and Mitosis in Biology.
- [x] **Lab Notebook:** Unified interface for settings, codex, and progress.
- [x] **Global Inventory:** "Universal Ledger" tracking resources across all labs.
- [x] **Big Bang Sequence:** Initial cinematic and resource reset.

## 🟡 Phase 2: The Cosmic & Stellar Stage
*Status: Up Next*
- [ ] **Stellar Nursery Overhaul:**
    - [ ] **Nebula Mechanics:** Gas clouds that respond to gravity.
    - [ ] **Star Formation:** Accreting mass to ignite fusion.
    - [ ] **Nucleosynthesis:** Converting H/He into heavier elements (Inventory Integration).
- [ ] **Planetary System:**
    - [ ] **Accretion Disk:** forming planets from stellar dust.
    - [ ] **Terraforming Earth:** Comet bombardment to add Water to the planet.

## 🔴 Phase 3: The Engineering Phase (Labs)
*Status: Planned*
- [ ] **Chemistry Lab Expansion:**
    - [ ] Synthesize "Prebiotic Broth" (Amino Acids, Lipids) using elements forged in stars.
- [ ] **Biology Lab Integration:**
    - [ ] **The "Seed" Project:** A special mode to design the LUCA (Last Universal Common Ancestor).
    - [ ] **Complexity Metric:** Calculate a score for the LUCA based on organelles and genome stats to determine evolutionary difficulty.
    - [ ] **Export to Earth:** Ability to "Freeze" the LUCA design for transport to the Stellar Nursery.

## 🔴 Phase 4: The Evolutionary Sandbox (Earth)
*Status: Research*
- [ ] **Earth View:** A zoomed-in view of the planet within the Stellar Nursery.
- [ ] **The Seeding:** Deploying the LUCA into the Earth's ocean.
- [ ] **Global Simulation:** Running the biology simulation on a planetary scale (using statistical approximation for millions of agents).
- [ ] **Environmental Controls:** Player modifies Temp/O2/CO2 to drive Natural Selection.

## 🔴 Phase 5: The Anthropocene Goal
*Status: Design*
- [ ] **Evolution Tree:** Visualization of species diverging from LUCA.
- [ ] **Intelligence Metric:** Tracking neural complexity.
- [ ] **Human Emergence:** The final "Win Condition".

---

## Technical Debt & Architecture
- **Web Workers:** Move the planetary simulation loop to a worker thread.
- **Save System:** Persist the state of the Galaxy and Earth.
- **Zoom Levels:** Seamless transition from Galaxy -> Solar System -> Earth -> Surface.