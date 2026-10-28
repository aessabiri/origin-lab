# Code Quality & Architectural Standards: Origin Lab

This document defines code health, modularity standards, and performance invariants for Origin Lab.

---

## 🛡️ Core Architectural Invariants

### 1. Zero VRAM Leak & GPU Lifecycle Management
* All WebGL viewports (`UniverseSimulationView.jsx`, `AnatomyCanvas.jsx`, `ProteinFolder.jsx`) MUST implement explicit disposal hooks on unmount:
  - Geometries: `.dispose()`
  - Textures: `.dispose()`
  - Materials: `.dispose()`
  - Renderers: `.dispose()` and remove DOM element.
* Automated headless unit tests must run in jsdom without WebGL/Canvas context crashes (using null guards on canvas contexts).

### 2. Bundle Weight & Route-Level Code Splitting
* All heavy 3D and standalone laboratory views (`Universe`, `AnatomyLab`, `BiologyApp`, `ChemistryApp`, `PlanetaryView`) must be loaded via `React.lazy()` with `Suspense` fallbacks.
* The entry bundle must remain strictly under 450 kB.

### 3. Universal Ledger Sync
* All materials, elements, molecules, and biological seeds must synchronize with `useInventory` (`src/store/inventory.js`).
* Never mutate inventory quantities directly; use `useInventory.getState().addItem()` or `consumeItem()`.

### 4. Test Coverage & Verification
* Automated test suite (`npm test -- --run`) must remain 100% green across all 36 test suites and 169+ unit/integration tests before any PR or goal completion.
* Production builds (`npm run build`) must succeed with zero Vite warnings or chunk errors.
