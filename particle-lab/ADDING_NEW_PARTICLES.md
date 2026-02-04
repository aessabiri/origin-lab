# Adding New Particles & Molecules to Particle Lab

This guide outlines the steps to add a new particle, isotope, or molecule to the simulation and ensure it is fully integrated (Assembly, Disassembly, Codex, Periodic Table, and Visuals).

---

## 1. Define the Particle Type & Metadata
**File:** `src/constants/particles.js`

1.  **Add Type Constant:**
    Add a unique key to `PARTICLE_TYPES`.
    ```javascript
    export const PARTICLE_TYPES = {
      // ...
      NEW_PARTICLE: 'new-particle-id',
    };
    ```

2.  **Add Metadata (Scientific Info):**
    Add an entry to `PARTICLE_INFO`. This populates the Codex and tooltips.
    ```javascript
    [PARTICLE_TYPES.NEW_PARTICLE]: { 
      size: 80, // 35=Quark, 50=Hadron, 60=Lepton, 80=Atom, 96=Molecule
      name: 'New Particle', 
      category: 'Molecule', // or 'Atom', 'Isotope', 'Alloy'
      mass: '100 u', 
      charge: '0 e', 
      composition: 'Description of parts', 
      description: 'Scientific description.' 
    },
    ```

3.  **Add Color:**
    Add a hex color to `PARTICLE_COLORS`.
    ```javascript
    [PARTICLE_TYPES.NEW_PARTICLE]: '#10b981',
    ```

4.  **Add Name:**
    Add the display name to `PARTICLE_NAMES`.
    ```javascript
    [PARTICLE_TYPES.NEW_PARTICLE]: 'New Particle Name',
    ```

---

## 2. Define Assembly & Disassembly Recipes
**File:** `src/recipes.js` (for Atoms/Simple) OR `src/constants/moleculeRecipes.js` (for complex structures)

### Option A: Simple Composition (Bag of Ingredients)
Use this for **Atoms, Alloys, or Simple Mixtures** where structure doesn't strictly matter for creation.
**File:** `src/recipes.js`

```javascript
{
  type: PARTICLE_TYPES.NEW_PARTICLE,
  category: PARTICLE_CATEGORIES.ATOM, // or ALLOY, MOLECULE
  ingredients: {
    [PARTICLE_TYPES.PROTON]: 5,
    [PARTICLE_TYPES.NEUTRON]: 6,
    [PARTICLE_TYPES.ELECTRON]: 5,
  },
},
```

### Option B: Structured Molecule (Graph)
Use this for **Molecules** where specific bonds matter (e.g., H-O-H).
**File:** `src/constants/moleculeRecipes.js`

```javascript
{
  type: PARTICLE_TYPES.NEW_PARTICLE,
  atoms: {
    [PARTICLE_TYPES.ATOM_A]: 1,
    [PARTICLE_TYPES.ATOM_B]: 1,
  },
  bonds: {
    single: 1, // Number of bonds required
  },
  structure: {
    nodes: [
      { id: 'a1', type: PARTICLE_TYPES.ATOM_A },
      { id: 'b1', type: PARTICLE_TYPES.ATOM_B },
    ],
    edges: [
      { source: 'a1', target: 'b1', type: 'single' },
    ]
  }
},
```

---

## 3. Create & Register the Icon
**Directory:** `src/particle-lab/components/icons/`

1.  **Create the Icon Component:**
    Create a new component in the appropriate folder (`atoms/`, `molecules/`, etc.).
    *   Use `NeoAtomIcon` for atoms.
    *   Use `NeoSphere` and `NeoBond` for molecules.

    **Example (Atom):**
    ```javascript
    // src/particle-lab/components/icons/atoms/index.jsx
    export const NewParticleIcon = (p) => <NeoAtomIcon symbol="Np" p={5} n={6} e={5} {...p} />;
    ```

    **Example (Molecule):**
    ```javascript
    // src/particle-lab/components/icons/molecules/index.jsx
    export const NewMoleculeIcon = () => (
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <NeoBond x1={50} y1={50} x2={80} y2={50} />
        <NeoSphere x={50} y={50} r={15} color="#10b981" label="A" />
        <NeoSphere x={80} y={50} r={15} color="#3b82f6" label="B" />
      </svg>
    );
    ```

2.  **Register the Icon:**
    Import and map it in `src/particle-lab/components/icons/index.js`.
    ```javascript
    import * as Molecules from './molecules/index.jsx';
    
    export const PARTICLE_ICON_MAP = {
      // ...
      [PARTICLE_TYPES.NEW_PARTICLE]: Molecules.NewMoleculeIcon,
    };
    ```

---

## 4. UI Integration (Codex & Periodic Table)
**File:** `src/constants/particles.js`

1.  **Add to Codex Category:**
    Find `CODEX_PARTICLES_BY_CATEGORY` and add your `PARTICLE_TYPES.NEW_PARTICLE` to the appropriate subcategory list.

2.  **Add to Periodic Table (If Atom):**
    **File:** `src/constants/periodicTableLayout.js`
    *   Add mapping to `ATOMIC_NUMBER_TO_TYPE`.
    *   Place the Atomic Number in the `PERIODIC_TABLE_LAYOUT` grid.

---

## 5. Verification Checklist
- [ ] **Discovery:** Does it appear in the Codex?
- [ ] **Visuals:** Does it render correctly in the Lab?
- [ ] **Assembly:** Can you select ingredients and click "Assemble"?
- [ ] **Disassembly:** Can you select it and click "Disassemble"?
- [ ] **Physics:** If it's a new radioactive isotope, did you update `useDecay.js`?
