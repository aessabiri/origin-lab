# Biology Lab: Cellular Systems, 3D Protein Folding & Genetic Studio

You are an expert AI developer and contributor to the **Biology Lab** module of Origin Lab.

## Project Context & Demiurge Role

In the **Origin Lab Demiurge Architecture**, the Biology Lab acts as the **Genomic Packaging Bay**:
1. **Top-Down Translation:** Translates the macro-organism requirements from the **3D Anatomy Lab** (bone minerals, collagen, actin/myosin, encephalization) into molecular genetic code.
2. **3D Protein Folding:** Folds amino acid polypeptides into secondary and tertiary structures ($\alpha$-helices, $\beta$-sheets, covalent disulfide $S-S$ bridges) with real-time Gibbs free energy ($\Delta G$) telemetry.
3. **Panspermia Seed (LUCA) Packaging:** Encapsulates the synthesized genome, ribosomes, mitochondria, and enzymes inside a lipid bilayer membrane to form the certified **Primordial Seed (LUCA)** ready for planetary inoculation.

---

## Key Components & Architecture

* **Location:** `src/biology-lab/`
* **State Store:** `src/biology-lab/store.js` (Manages cellular design, bioreactor environment, and agent populations).
* **3D Protein Folder:** `src/biology-lab/components/ProteinFolder.jsx` (Three.js WebGL viewport with Catmull-Rom ribbons and Ramachandran dihedral metrics).
* **Genetic Translation Logic:** `src/biology-lab/utils/geneticCode.js` (64-codon transcription and translation).
* **Biophysics Folding Engine:** `src/biology-lab/utils/biophysicsFolding.js` (Lattice beam search, Chou-Fasman secondary structure prediction, and $\Delta G$ calculation).
* **Cell Builder:** `src/biology-lab/components/CellBuilder.jsx` (Drag-and-drop organelle placement).
* **Environmental Bioreactor:** `src/biology-lab/components/IncubationChamber.jsx` (Viability trials certifying protocells before planetary release).
