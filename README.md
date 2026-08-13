# Particle Lab

**Particle Lab** is a multi-disciplinary scientific sandbox. It is an interactive web application that gamifies the discovery of the universe's building blocks, from Quarks to Cells.

The application is divided into three specialized laboratories:

## ⚛️ 1. Particle Lab (Physics)
The original sandbox.
*   **Mechanics:** Drag-and-drop particle fusion and decay.
*   **Goal:** Construct atoms from quarks, and simple molecules from atoms.
*   **Key Features:** Interactive canvas, Decay physics, Goal Paths, **Lab Notebook (Unified UI)**.

## ⚗️ 2. Chemistry Lab (Chemistry)
A semi-realistic laboratory simulation.
*   **Mechanics:** Tick-based simulation of Thermodynamics, Phase Changes, and Chemical Reactions.
*   **Equipment:** Beakers, Flasks, Heaters, Condensers, and High-Pressure Reactors.
*   **Key Features:**
    *   **Dynamic pH System:** Real-time acidity calculation and color indicators.
    *   **Solubility Engine:** Temperature-dependent precipitation and saturation.
    *   **Industrial Processes:** Synthesize Ammonia (Haber Process) or Plastics (Polyethylene).

## 🧫 3. Biology Lab (Biology)
*Alpha* - "The Petri Dish".
*   **Mechanics:** Agent-based simulation of cellular life.
*   **Feature:** **Visual Genome Editor** - Drag-and-drop organelle placement to design custom lifeforms.
*   **Vision:** Cells consuming nutrients, dividing (Mitosis), and evolving over generations.

---

## 🛠️ Tech Stack

*   **Framework**: [React](https://reactjs.org/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/)
*   **Testing**: [Vitest](https://vitest.dev/)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to start experimenting.

### 3. Run Tests
To verify the integrity of the physics engines:
```bash
npm test
```

## 📂 Project Structure

*   `src/`: Main source code.
    *   `src/components/`: Shared UI components.
    *   `src/chemistry-lab/`: **Isolated Module** for the Chemistry simulation (Logic, Data, Store).
    *   `src/biology-lab/`: **Isolated Module** for the Biology simulation (Planned).
    *   `src/hooks/`: Logic for the main Particle Lab.