# Proposals for Laboratory Evolution

Based on the `initialidea.md` vision and current codebase analysis, here are proposed enhancements to align the simulation with the "Architect of Reality" theme.

## 🧬 Biology Lab: The Proving Ground

**Current State:** A "Petri Dish" sandbox where agents evolve via random mutation and simple selection (eating/starving).
**Vision:** "Designing the Seed" -> "Protein Folding" -> "Cell Assembly".

### Proposal 1: The Simulation Chamber Loop
Instead of an endless sandbox, frame the Biology Lab as an engineering bay with specific **Viability Tests**.

1.  **Design Phase:** Use the `CellCreator` (already present) to configure the genome (metabolism, diet, organelles).
2.  **Simulation Phase (The Change):**
    *   The player hits "Run Simulation".
    *   The system runs a **Time-Accelerated** version of the Petri Dish (using the new SpatialHash optimization).
    *   **Goal:** The population must stabilize or reach a certain threshold (e.g., "Sustain 50 cells for 500 years").
3.  **Result:**
    *   **Failure:** Extinction event. The player gets a log: "Metabolic failure. Starvation imminent."
    *   **Success:** The cell design is "Certified Viable" and added to the Global Inventory as a **Seed**.
4.  **Export:** Only "Certified Seeds" can be planted on Earth in the Universe View (Phase 5).

### Proposal 2: Organelle Puzzle (Simplified Protein Folding)
Replace the instant "Unlock" of proteins with a mini-game.
*   **Mechanic:** Connect amino acids (from Chemistry Lab) in specific chains to form "functional shapes".
*   **Example:** A chain of *Gly-Ala-Val* folds into a "Pump".
*   **Benefit:** Gives purpose to the specific amino acids synthesized in the Chemistry Lab.

---

## ⚗️ Chemistry Lab: Fluid Dynamics

**Current State:** Numeric simulation of vessel contents (temperature, pressure, list of chemicals). Visuals are likely static colors or simple bars.
**Vision:** "NileRed Style Reactions" -> "Realistic, visual chemical simulations".

### Proposal 3: Dynamic Fluid Rendering
Enhance the `Vessel` component to visualize the simulation state more viscously.

1.  **Particle Fluids:** Use a simplified SPH (Smoothed Particle Hydrodynamics) or grid-based fluid sim within the vessel canvas.
    *   *Implementation:* Treat the liquid as 50-100 "meta-particles".
    *   *Visuals:* Boiling = particles jittering/rising. Viscosity = slow movement.
2.  **Color Gradients:** Instead of a single mixed color (`calculateMixtureColor`), allow distinct phases or gradients before mixing completes.
    *   *Visual:* Pouring Acid into Water shows a streak of Red dispersing into Blue/Green.

---

## ⚛️ Particle Lab: The Quantum Canvas

**Current State:** Drag-and-drop fusion of particles using DOM elements.
**Vision:** "Cosmic Forge".

### Proposal 4: Unified Canvas Rendering
(Technical Proposal)
*   **Issue:** As players build complex macromolecules (DNA, Proteins) atom-by-atom, the DOM (HTML Divs) will lag.
*   **Solution:** Port `ParticleCanvas.jsx` to use the same **HTML5 Canvas** engine as the Biology Lab.
*   **Benefit:** Enables rendering of massive structures (thousands of atoms) or "gas clouds" in the sandbox without performance drops.
