# Codebase Quality & Modularity Report

## 🔍 Investigation Findings

### 1. Particle Lab
*   **`ParticleCanvas.jsx` Monolith:** This file is currently 600+ lines long and handles mixed concerns:
    *   **State Management:** accessing `useParticleStore` and `useStore`.
    *   **Drag & Drop Logic:** `useDrag` and `useSprings`.
    *   **Canvas Rendering:** The bond rendering loop via `requestAnimationFrame`.
    *   **DOM Rendering:** The particle rendering loop mapping `springs`.
    *   **UI Overlay:** Toolbars, hint cards, action menus, and absolute-positioned buttons.
*   **Recommendation:** Split into `ParticleRenderer` (Visuals) and `ParticleCanvasOverlay` (UI).

### 2. Chemistry Lab
*   **`useSimulation.js` God Hook:** This hook orchestrates the entire simulation loop. While it delegates logic to `logic/*.js`, it still manually handles every step (Integrity -> Safety -> Thermo -> Phase -> Physics -> Reactions).
*   **Recommendation:** While working, a "Pipeline" pattern or "System" classes could act as a better abstraction if complexity grows. For now, it is manageable but dense.

### 3. Biology Lab
*   **Recent Optimization:** The `SpatialHash` addition has improved scalability.
*   **Rendering:** `PetriDish.jsx` uses Canvas 2D API effectively. This is the most performant renderer in the project currently.

### 4. General
*   **Hardcoded Constants:** Many constants (colors, radii, tick rates) are hardcoded in components or scattered across `constants/` files.
*   **Testing:** Tests cover logic well but UI component testing is sparse.

---

## 🛠️ Proposed Refactor Plan

### Phase 1: ParticleCanvas Decomposition (Immediate)
We will split `ParticleCanvas.jsx` to separate the "View" from the "Controls".

1.  **`ParticleCanvasOverlay.jsx`**: Handles all HTML/UI elements (Toolbar, Menu, Hints, Buttons).
2.  **`ParticleCanvas.jsx`**: Retains the Physics/Drag logic and rendering loops.

### Phase 2: Chemistry Simulation Composition (Future)
We can abstract the simulation steps into a `SimulationEngine` class that `useSimulation` simply instantiates and ticks. This decouples the React Lifecycle from the Simulation Loop logic.
