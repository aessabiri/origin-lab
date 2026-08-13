# Development Plan: Project Singularity

This document outlines the step-by-step implementation strategy to transform the Particle Lab into the full "Genesis Simulation" vision.

## 📋 Strategy: The Backbone First
The goal is to connect the isolated labs into one linear progression system before expanding the content.

---

## 🏗️ Phase 1: The Universe Engine (Global State)
*Goal: Connect the isolated labs into one linear progression system.*

- [x] **Create `UniverseStore`:** (Completed `src/store/universeStore.js`)
    - Tracks the current **Era** (Void, Big Bang, Particle, Stellar, Chemical, Biological).
    - Controls "Cosmic Gates" (locking/unlocking labs).
    - Manages the **Cosmic Inventory** (distinct from lab inventory).
- [ ] **Integrate Store:**
    - Update `App.jsx` to read from `UniverseStore`.
    - Implement conditional rendering based on the current Era.

## 🌑 Phase 2: The Void & Big Bang (The Beginning)
*Goal: Give the player agency over the start of existence.*

- [ ] **The Void Screen Component:**
    - Interactive canvas for "Before the Big Bang".
    - Visuals: Quantum fluctuations (particles appearing/disappearing).
    - Interaction: Click to stabilize fluctuations.
- [ ] **Cinematic Transition:**
    - Connect the "Stability Threshold" to the `big_bang.mp4` video.
    - Auto-transition to **Particle Lab** after video ends.

## ⚛️ Phase 3: Particle Lab & Nucleosynthesis
*Goal: Turn atomic discovery into cosmic scale production.*

- [ ] **Unlock Mechanic:**
    - Player manually crafts the first atom of a type (Discovery).
- [ ] **Cosmic Production UI:**
    - New panel in Universe View: "Stellar Nucleosynthesis".
    - Allow player to "automate" production of discovered atoms (e.g., H, He).
    - Output goes to **Cosmic Inventory**.

## 🌌 Phase 4: Stellar Evolution
*Goal: Use particles to build the map.*

- [ ] **Star Formation System:**
    - Action: "Ignite Star" (Costs H + He from Cosmic Inventory).
    - Visual: Spawns a star on the Universe Map.
- [ ] **Supernova Event:**
    - Scripted event where massive stars die.
    - **Reward:** Grants heavy elements (C, O, Fe) to Cosmic Inventory.
    - **Unlock:** Opens the **Chemistry Lab**.

## ⚗️ Phase 5: The Chemistry Bridge
*Goal: From Stardust to Soup.*

- [ ] **Inventory Link:**
    - Update `ChemistryApp` to check Cosmic Inventory for reactants.
    - Prevent reactions if the universe lacks the raw elements (e.g., no Oxygen = no Water).
- [ ] **The "Soup" Objective:**
    - Specific goal: Synthesize Amino Acids.
    - **Unlock:** Opens the **Biology Lab**.

## 🧬 Phase 6: Biology & The Seed
*Goal: Design the Ancestor.*

- [ ] **LUCA Builder:**
    - Use organic molecules to build the cell components.
- [ ] **Seeding Mechanic:**
    - "Drop" the cell into the Earth view.
    - Triggers the planetary simulation.

---

## 🚀 Immediate Next Steps
1.  **Integrate Universe Store:** Modify `App.jsx` to control flow.
2.  **Build Void Screen:** Create the interactive intro.
3.  **Link Inventory:** connect Particle Lab output to Universe Store.
