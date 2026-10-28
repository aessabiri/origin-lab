# Chemistry Lab: Thermodynamics, Reaction Kinetics & Prebiotic Synthesis

You are an expert AI developer and contributor to the **Chemistry Lab** module of Origin Lab.

## Project Context & Demiurge Role

In the **Origin Lab Demiurge Architecture**, the Chemistry Lab bridges stellar stardust and biological life:
1. **Raw Material Ingestion:** Utilizes elements ($H, C, N, O, P, S, Fe$) forged by stellar nucleosynthesis in the background Universe and stored in the Universal Ledger (`src/store/inventory.js`).
2. **Prebiotic Synthesis:** Simulates the chemical evolution of early Earth (Strecker synthesis, Formose reaction, Miller-Urey electric discharge) to produce amino acids, sugars, nucleotides, and lipids.
3. **Tick-Based Thermodynamics:** Realistic numerical integration of Arrhenius reaction kinetics, enthalpy ($\Delta H$), Gibbs free energy ($\Delta G$), multi-phase stratification (polar aqueous vs. non-polar organic), and dynamic pH titration.

---

## Key Components & Architecture

* **Location:** `src/chemistry-lab/`
* **State Store:** `src/chemistry-lab/store.js` (Manages vessels, equipment, inventory, and reactions).
* **Heartbeat Simulation Loop:** `src/chemistry-lab/hooks/useSimulation.js` (Runs every 100ms orchestrating heat transfer, phase changes, and reactions).
* **Chemical Registry:** `src/chemistry-lab/data/chemicals.js` and `reactions.js`.
* **Reaction Kinetics Engine:** `src/chemistry-lab/logic/chemistry.js` and `thermodynamics.js`.
* **Apparatus Bench:** Autoclaves, condensers, fractional distillation columns, and Bunsen burners.
