# Chemistry Lab 2.0: The Alchemist's Bench

## 1. Concept: Fixed Workstation
Unlike the floating "Particle Lab", the Chemistry Lab simulates a fixed workbench environment. The user acts as a chemist manipulating specific tools to discover compounds through reactions governed by composition, temperature, and pressure.

## 2. Core Mechanics

### The Vessels
The bench features 3 distinct, fixed interaction points:
1.  **Open Beaker:**
    *   **Function:** Simple mixing at Standard Temperature and Pressure (STP).
    *   **Controls:** Stirring rod (optional).
    *   **Use Case:** Dissolving solids, simple acid-base reactions.
2.  **Reaction Flask (on Heater):**
    *   **Function:** Heated reactions.
    *   **Controls:** Temperature Dial (0°C - 1000°C).
    *   **Use Case:** Thermal decomposition, synthesis requiring activation energy.
3.  **Pressure Chamber:**
    *   **Function:** High-pressure synthesis.
    *   **Controls:** Pressure Valve (1 atm - 100 atm) + Temperature Dial.
    *   **Use Case:** Gas compression, industrial synthesis (e.g., Ammonia).

### The Reaction Engine
Reactions are no longer just "Recipe Match". They are conditional:
*   **Inputs:** Dictionary of chemicals present in the vessel.
*   **Conditions:** Current Temperature and Pressure.
*   **Logic:** `If (Inputs has A & B) AND (Temp > 100) -> Convert to C`.

### The Pantry (Inventory)
*   A side panel containing unlocked chemicals.
*   **Interaction:** Drag & Drop chemicals into vessels.
*   **Discovery:** When a new chemical is created in a vessel, the user must "bottle" it (click a button or drag a container) to add it to the Pantry.

## 3. Architecture: Strict Separation

To protect the `Particle Lab` code, all Chemistry logic resides in a dedicated directory.

### Directory Structure
```text
src/
├── chemistry-lab/           # ISOLATED MODULE
│   ├── ChemistryApp.jsx     # Entry point for this mode
│   ├── store.js             # Dedicated Zustand store (vessels, inventory)
│   ├── components/
│   │   ├── Workstation.jsx  # Main layout
│   │   ├── Vessel.jsx       # Reusable vessel (controls + fluid display)
│   │   ├── Pantry.jsx       # Inventory sidebar
│   │   └── Controls.jsx     # Dials and Sliders
│   ├── hooks/
│   │   └── useReaction.js   # Reaction tick logic
│   └── data/
│       ├── chemicals.js     # Chemical definitions (Color, State)
│       └── reactions.js     # The "Database" of chemical laws
```

### Data Structures

**Chemical Definition:**
```javascript
{
  id: 'H2O',
  name: 'Water',
  color: '#3498db', // For fluid mixing
  state: 'liquid',  // 'solid', 'liquid', 'gas'
}
```

**Vessel State (in Store):**
```javascript
vessels: {
  beaker: { contents: { H2O: 10, NaCl: 2 }, temp: 25, pressure: 1 },
  flask:  { contents: {}, temp: 25, pressure: 1 },
  chamber: { contents: {}, temp: 25, pressure: 1 }
}
```

## 4. Implementation Plan

1.  **Cleanup:** Remove old `ChemistryLab` files and strip chemistry logic from the main `store.js`.
2.  **Scaffold:** Create the `src/chemistry-lab` directory and files.
3.  **Core Components:** Build `ChemistryApp` and the `Vessel` component with UI controls.
4.  **Logic:** Implement the specialized `useChemistryStore` and reaction engine.
5.  **Integration:** Switch `App.jsx` to render `src/chemistry-lab/ChemistryApp.jsx`.
