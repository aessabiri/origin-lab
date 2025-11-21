# Detailed Codebase Analysis: Particle Lab

This document provides a detailed breakdown of the Particle Lab application, analyzing the role and function of every file in the project.

## Project Overview

Particle Lab is a sophisticated, data-driven educational game developed with React. It allows users to explore the world of particle physics and chemistry, from fundamental quarks and leptons to complex molecules and even DNA. The application is built around a core principle of "assembly," where users combine particles according to predefined recipes to discover new ones.

The architecture is well-structured, separating concerns into distinct data files, custom hooks for logic, and presentational components. State is managed centrally and persisted to `localStorage`, providing a seamless user experience across sessions.

---

## 1. Project Configuration & Entry Point

These files handle the project's setup, dependencies, and initial loading.

### `package.json`
- **Role**: Project manifest and dependency management.
- **Details**: Defines project metadata, scripts for development (`dev`), production builds (`build`), and previewing. It lists coredependencies like `react`, `react-dom`, `@react-spring/web` (for animation), and `@use-gesture/react` (for drag gestures). Development dependencies include `vite` (the build tool), `tailwindcss`, and `postcss`.

### `vite.config.mjs`
- **Role**: Configuration for the Vite build tool.
- **Details**: This file configures the development server. It uses the `@vitejs/plugin-react` to enable React support (including Fast Refresh) and sets the development server port to `5173`.

### `tailwind.config.cjs` & `postcss.config.cjs`
- **Role**: Styling configuration.
- **Details**:
  - `postcss.config.cjs`: Configures PostCSS to use `tailwindcss` and `autoprefixer`, which automatically adds vendor prefixes to CSS for better browser compatibility.
  - `tailwind.config.cjs`: Configures Tailwind CSS. It specifies the files to be scanned for utility classes and extends Tailwind's default theme with a vast library of custom CSS `keyframes` and `animation` utilities. These are crucial for the application's rich, dynamic visual effects, such as `float`, `shake`, `pulse-glow`, and `qcd-color-cycle`.

### `index.html`
- **Role**: The main HTML entry point of the application.
- **Details**: A minimal HTML file that contains the root `<div>` (with `id="root"`) where the entire React application is mounted. It includes the main JavaScript module, `src/main.jsx`.

---

## 2. Application Core (`src/`)

This is where the main application logic resides.

### `src/main.jsx`
- **Role**: The entry point for the React application.
- **Details**: This file performs the initial render. It imports the main `App` component, the global stylesheet `index.css`, and uses `createRoot` to render the `App` component inside the `#root` div defined in `index.html`. It wraps `<App />` in `<React.StrictMode>` to enable checks for potential problems.

### `src/App.jsx`
- **Role**: The monolithic root component; the heart and brain of the application.
- **Details**: This massive component manages the entire application state, orchestrates all UI components, and integrates all the business logic from custom hooks.
  - **State Management**: Uses `usePersistentState` to manage and persist all critical data, including the particles on the canvas (`particles`), the bonds between them (`bonds`), all discovered particle types, and user settings like `uiScale`.
  - **UI Orchestration**: Renders all other major components, including the main canvas, the particle palette, the `ActionToolbar`, `ActionMenu`, `Codex`, `PeriodicTable`, and `InfoPanel`. It contains the logic for showing and hiding these elements, ensuring that modal views like the Codex and Periodic Table are handled exclusively.
  - **Animation & Gestures**: Leverages `useSprings` from `react-spring` to animate particle positions and `useDrag` from `use-gesture` to handle both dragging individual particles and drag-to-select functionality on the canvas.
  - **Core Logic Integration**: It is the central integration point for all custom hooks: `useSelection`, `useParticleActions`, and `useDecay`. It passes state and state-setting functions to these hooks and receives computed data and action handlers in return.
  - **Rendering**: It maps over the `particles` and `bonds` arrays to render them on the canvas. Particles are rendered as `animated.div` elements, and bonds are rendered using an `<svg>` overlay.

### `src/index.css`
- **Role**: Global stylesheet.
- **Details**: This file imports Tailwind's base, components, and utilities. It also defines several custom animations and classes used for visual effects, such as the 3D hover effect on palette items (`.particle-palette-item`), the radioactive decay burst (`.radiation-particle`), and the glow effect for assemblable molecules (`.molecule-glow`).

---

## 3. Reusable Logic: Custom Hooks (`src/hooks/`)

The application's complex logic is cleanly encapsulated into these reusable custom hooks.

### `usePersistentState.js`
- **Role**: A generic hook to persist state to `localStorage`.
- **Details**: A wrapper around `useState` that automatically reads its initial value from `localStorage` and writes back to it whenever the state changes. It uses `JSON.stringify` and `JSON.parse`, allowing it to handle complex data like arrays and objects. This is the foundation of the game's save system.

### `useSelection.js`
- **Role**: Manages all user selection and determines possible actions.
- **Details**: This is a critical hook for interactivity.
  - **Selection Management**: It handles selecting particles via single clicks (with Ctrl/Cmd for multi-select) and via a drag-to-select box.
  - **`selectionInfo`**: Its primary output is the `selectionInfo` object, which is memoized for performance. This object analyzes the currently selected particles and bonds, compares them against all known recipes (`RECIPES`, `MOLECULE_RECIPES`, `POLYPEPTIDE_RECIPES`), and determines if the selection can be assembled, disassembled, or reverted. This object is the "brain" that drives the contextual `ActionToolbar`.

### `useParticleActions.js`
- **Role**: Centralizes the logic for creating and destroying particles.
- **Details**: This hook provides the functions that execute the actions identified by `useSelection`.
  - `handleAssemble`: Takes an assembly recipe and transforms the selected ingredient particles into the new target particle. It updates particle discovery lists and checks for goal completion.
  - `handleDisassemble`: Breaks a compound particle into its immediate components.
  - `handleRevertToElementary`: Recursively breaks a particle down into its fundamental, elementary constituents.

### `useDecay.js`
- **Role**: Manages the radioactive decay of unstable particles.
- **Details**: This hook uses a `useEffect` to find unstable particles (e.g., `DECAYING_NEUTRON`). For each one, it starts a `setTimeout`. When the timer completes, it replaces the particle with its decay products and triggers a visual effect. It includes a cleanup function to clear timers, preventing bugs.

---

## 4. UI Components (`src/components/`)

These are the building blocks of the user interface.

### `ParticleIcon.jsx`
- **Role**: Renders the visual SVG icon for every particle.
- **Details**: A large and crucial component that acts as a dispatcher. It contains a `PARTICLE_ICON_MAP` that maps a particle's type to a specific SVG-based React component. It includes a vast library of individual icon components, many of which are animated and structurally representative of the particle they depict (e.g., showing quarks in a proton, or electron shells in an atom). This is the heart of the application's visual identity.

### `ActionToolbar.jsx`
- **Role**: The main contextual toolbar for particle interaction.
- **Details**: This toolbar displays buttons for `Assemble`, `Disassemble`, `Add Bond`, `Break Bonds`, and `Remove`. The buttons are dynamically enabled or disabled based on the `selectionInfo` object passed down from `App.jsx`.

### `ActionMenu.jsx`
- **Role**: A secondary menu for global application actions.
- **Details**: This menu, opened via a button on the main canvas, provides access to less-frequent actions like changing the goal path ("Road to DNA"), opening the Codex/Periodic Table, clearing the canvas, and resetting all progress.

### `Codex.jsx`
- **Role**: The in-game encyclopedia for all particles.
- **Details**: A full-screen modal that displays all particles, grouped by category. It grays out undiscovered particles and allows the user to search for particles or toggle a "Show All" mode. Clicking a discovered particle opens the `InfoPanel`.

### `InfoPanel.jsx`
- **Role**: A modal that shows detailed information about a particle.
- **Details**: When a particle type is passed to it, this component displays the rich data from `particleInfo.js`, including its name, category, physical properties, composition, and a detailed description.

### `PeriodicTable.jsx`
- **Role**: A visual and interactive periodic table.
- **Details**: Renders the periodic table of elements, a separate list of isotopes, and other special particles. Discovered elements are colored and can be dragged onto the canvas. Undiscovered elements are grayed out. The table can be "pinned" to remain visible. Its layout is driven entirely by data from `periodicTableLayout.js`.

---

## 5. The Data Layer (`src/constants/` & `src/recipes.js`)

These files define the "rules" and content of the game. The entire application is built on this data-driven foundation.

### `particles.js`
- **Role**: The master file for particle definitions.
- **Details**: This file exports all the core particle data:
  - `PARTICLE_TYPES`: An enum of unique string identifiers for every particle.
  - `PARTICLE_NAMES`: Maps identifiers to user-friendly names.
  - `PARTICLE_COLORS`: Maps identifiers to Tailwind CSS color classes.
  - `PARTICLE_COLOR_MAP`: Maps color names to hex codes for SVG rendering.
  - `CODEX_PARTICLE_BY_CATEGORY`: Defines the structure of the Codex.
  - `elementaryParticleGroups`: Defines the initial set of particles available in the palette.

### `particleInfo.js`
- **Role**: The database of detailed particle information.
- **Details**: Contains the `PARTICLE_INFO` object, which is a massive dictionary mapping a particle's type to its detailed properties: `name`, `category`, `mass`, `charge`, `spin`, `composition`, and a multi-line `description`. This data is displayed in the `InfoPanel`.

### `recipes.js`
- **Role**: Defines the simplest "ingredient-count" assembly recipes.
- **Details**: Contains the `RECIPES` array, where each object defines how to form a new particle from a simple count of other particles (e.g., 2 Up Quarks + 1 Down Quark = 1 Proton). It also exports helper data structures (`COMPOSITION_MAP`, `COMPOUND_PARTICLE_TYPES`) for quick lookups.

### `moleculeRecipes.js`
- **Role**: Defines recipes for molecules where structure (bonding) is important.
- **Details**: Contains the `MOLECULE_RECIPES` array. These recipes are more advanced, requiring a specific count of atoms AND a specific count of `single` or `double` bonds. This is used for creating amino acids and other complex molecules.

### `polypeptideRecipes.js`
- **Role**: Defines the most advanced recipes for creating polypeptide chains.
- **Details**: Contains `POLYPEPTIDE_RECIPES`. These recipes are unique in that their ingredients are other molecules (amino acids), and they require a specific number of `peptideBonds` to be formed.

### `periodicTableLayout.js`
- **Role**: Defines the data structure for the `PeriodicTable` component.
- **Details**: Exports arrays and objects that define the grid layout of the periodic table, the mapping of atomic numbers to particle types, and the lists of elements in the Lanthanide/Actinide series.

### `goals.js` & `goalPaths.js`
- **Role**: Defines the game's progression system.
- **Details**:
  - `goals.js`: Contains a default list of goals.
  - `goalPaths.js`: Defines three distinct progression paths (`fast`, `medium`, `slow`) with different sets of goals. This allows the user to choose their desired game length and difficulty. `App.jsx` uses this to determine the current goal.