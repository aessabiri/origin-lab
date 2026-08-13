# Molecular Iconography Scheme

## Strict Physics Style in Codex

In the Particle Lab, visual consistency is paramount for conveying scientific accuracy. The **Universal Codex**, **Academy**, and **Bio-Inventory** views now adhere to a strict styling protocol for rendering particles and molecules.

### 1. No Lab Equipment in Physics Contexts
*   **Rule:** The `ParticleIcon` component, which is used in all "scientific" or "database" views, no longer renders `ChemicalIcon` styles that depict laboratory glassware (Flasks, Beakers, Bottles) or bulk states (Powders, Liquids).
*   **Reasoning:** In the context of Physics and molecular assembly, a single molecule of water is $H_2O$ (atoms), not a blue droplet. Methane is $CH_4$ (tetrahedral), not a gas cylinder.

### 2. Rendering Priority Pipeline
To ensure the highest quality visualization for every particle, the system follows this strict priority order:

1.  **Hand-Crafted Physics Icons (`PARTICLE_ICON_MAP`)**
    *   **What:** Custom SVG components designed specifically for fundamental particles and key molecules.
    *   **Examples:**
        *   **Proton:** Shows 3 Quarks (Up, Up, Down) with gluon exchange.
        *   **Water:** Shows the bent geometry with Oxygen and Hydrogen atoms.
        *   **Methane:** Shows the tetrahedral arrangement.
        *   **DNA:** Shows the double helix structure.
    *   **Usage:** These are the "Hero" assets used for the most common or important particles.

2.  **Data-Driven Ball-and-Stick (`MoleculeStructure`)**
    *   **What:** The newly upgraded "Neo" renderer that generates a 3D-style Ball-and-Stick model based on graph data (`MOLECULAR_STRUCTURES`).
    *   **Features:**
        *   **Scaled Atoms:** Atoms are rendered at 1.5x scale to match the visual weight of hand-crafted icons.
        *   **Neo-Style:** Uses gradients, shadows, and "NeoBond" visual primitives for a polished look.
    *   **Usage:** Used for any molecule that has a defined structure in `src/chemistry-lab/data/structures.js` but no hand-crafted icon. This covers most chemical compounds (e.g., Acetic Acid, Ethanol, Glucose).

3.  **Generic Atomic Cluster (Fallback)**
    *   **What:** A generated icon showing a central atom bonded to generic satellites.
    *   **Usage:** The final fallback for any particle ID that has no specific data. This ensures nothing ever renders as a "broken image" or a "flask".

### 3. Implementation Details
*   **Files:**
    *   `src/components/ParticleIcon.jsx`: The main dispatcher.
    *   `src/chemistry-lab/components/MoleculeStructure.jsx`: The procedural renderer.
    *   `src/components/VisualPrimitives.jsx`: Shared high-quality SVG components (`NeoSphere`, `NeoBond`).
