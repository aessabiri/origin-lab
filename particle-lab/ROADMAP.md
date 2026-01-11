# Development Roadmap: Project Singularity

This roadmap outlines the technical milestones required to reach the "Bigger Picture" goal: from the Big Bang to Human Consciousness.

---

## 🟢 Phase 1: Current Foundation (Polishing)
*Status: In Progress*
- [x] **Unified Navigation:** Central Hub for all laboratories.
- [x] **Rendering Optimization:** Porting Biology and Physics to Canvas for performance.
- [x] **Life Mechanics:** Implementing Metabolism, Predation, and Mitosis in Biology.
- [x] **Lab Notebook:** Unified interface for settings, codex, and progress.
- [ ] **Data Persistence:** Ensure the "Universal Ledger" saves all resources across sessions.

## 🟡 Phase 2: The Primordial & Stellar Eras
*Status: Up Next*
- [ ] **The Big Bang:** Cinematic entry-point that generates the initial Quark-Gluon plasma.
- [ ] **Universal Expansion:** Cooling logic where quarks bind into Protons/Neutrons.
- [ ] **Stellar Overhaul:**
    - [ ] Collapsing H/He clouds into Stars.
    - [ ] **Nucleosynthesis Engine:** Stars convert elements over time based on mass.
    - [ ] **Supernova Mechanic:** Detonating stars to scatter Carbon, Oxygen, and Iron into the inventory.
- [ ] **Atmosphere State:** Global state tracking O2, CO2, and N2 levels.

## 🔴 Phase 3: The Prebiotic & Molecular Bridge
*Status: Planned*
- [ ] **Reagent Pipeline:** Dynamic "Pantry" in Chemistry Lab fueled by Stellar Nursery harvests.
- [ ] **Energy Injection:** Adding "Lightning" and "Thermal Vents" to Chemistry to trigger complex organic reactions.
- [ ] **Monomer Synthesis:** Logic for creating Amino Acids and Nucleotides from C, H, N, O.
- [ ] **The Biology Export:** Ability to bottle "Nutrient Broth" and "RNA strands" for use in the Biology Lab.

## 🔴 Phase 4: Abiogenesis & Complex Life
*Status: Research*
- [ ] **Lipid Encapsulation:** Creating the first Protocell by combining Lipids and RNA.
- [ ] **Genetic Mutation 2.0:** More complex DNA strings that define behavioral AI (Aggression, Cooperation).
- [ ] **Endosymbiosis Event:** Special logic to merge cells into Eukaryotes (Mitochondria/Chloroplast discovery).
- [ ] **Multicellularity:** Logic for cells to stick together and share energy (The "Colony" update).

## 🔴 Phase 5: The Anthropocene Goal
*Status: Design*
- [ ] **Organ Systems:** Developing specialized tissues (Muscle, Nerve, Digestion).
- [ ] **The Environment Map:** Moving from the Petri Dish to a global ecosystem map.
- [ ] **The Consciousness Metric:** A final "Win Condition" based on neural complexity and tool use.
- [ ] **Human Emergence:** Guiding the simulation until the first human agent is born.

---

## Technical Debt & Performance
- **Canvas Migration:** Complete the migration of the Physics Lab (`ParticleCanvas`) to full Canvas rendering.
- **Web Workers:** Move the heavy Physics and Biology logic loops to Web Workers to keep the UI at a buttery 60FPS.
- **Global Store:** Refactor `src/store.js` to handle the mass balance between all laboratories (The "Universal Ledger").
