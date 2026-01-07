# Chemistry Lab 2.0 - Development Report

## Project Status
The **Chemistry Lab 2.0** is a semi-realistic chemical simulation module integrated into the Particle Lab application. It features a dedicated physics engine, thermodynamics system, and industrial chemical processing capabilities.

### Key Features Implemented
1.  **Architecture:** Strictly isolated in `src/chemistry-lab/` with its own Zustand store (`store.js`).
2.  **Workstation:** 3 fixed vessels (Beaker, Flask, Pressure Chamber) with a horizontal layout.
3.  **Physics Engine:**
    *   **Thermodynamics:** Real-time heat transfer simulation. Temperature moves towards target based on `TimeSpeed`.
    *   **Destructibility:** Glassware shatters under Thermal Shock (>800°C) or Overpressure (>5 atm).
    *   **Upgrades:** Vessels can be upgraded (Reinforced Glass, Ceramic) to withstand higher limits.
4.  **Chemical System:**
    *   **Inventory:** Tabbed Pantry (Elementary vs. Discovered).
    *   **Visuals:** Modern icons with state-specific shapes (Liquid/Solid/Gas) and dynamic gradients.
    *   **Recipes:** Includes Chloralkali Process, Haber Process, Ostwald Process, Acid Synthesis, and now **Organic Chemistry** (Esterification, Methanol Synthesis, Ethanol Dehydration, and Polymerization).
5.  **Codex:** A searchable encyclopedia tracking discovered chemicals and their synthesis recipes.
6.  **Visual Effects:** Enhanced particle effects for reactions including bubbles, fumes, steam, and solidification.
7.  **Lab Safety:** Implemented a **Fume Hood** mechanic. Toxic gases escaping from open beakers now trigger warnings unless ventilation is active.

### Current "To-Do" / Roadmap
*   **Sound:** Add audio feedback for pouring and reactions.
*   **More Reactions:** Expand into Biochemistry (Amino Acids, Proteins).
*   **Glassware Variety:** Add test tubes or distilling columns.


## Resumption Prompt

To continue working on this project, copy and paste the following into the next session:

```text
You are resuming work on the "Chemistry Lab 2.0" module for the Particle Lab project.
Context:
- The app is a split view: Particle Lab (Physics) and Chemistry Lab (Chemistry).
- Chemistry Lab is located in `src/chemistry-lab/`.
- It uses a custom Zustand store `src/chemistry-lab/store.js`.
- Key Mechanics: Heat transfer, Pressure, Vessel Upgrades, Bottling System.

Current Task:
Review `chemistryreport.md` to understand the latest features. The user may want to expand the reaction database (Organic Chemistry), improve visual effects (Steam/Explosions), or refine the UI.

Check `src/chemistry-lab/data/reactions.js` to see the current list of industrial processes before adding new ones.
```
