# Particle Lab

Particle Lab is an interactive web-based sandbox game where you can build everything from subatomic particles to complex molecules. Discover the fundamental rules of chemistry and physics by combining elementary particles to create new ones. Follow guided goals or experiment freely in sandbox mode.



## ✨ Features

*   **Particle Crafting**: Combine particles to discover over 50+ unique atoms, molecules, and subatomic particles.
*   **Interactive Simulation**: A fluid, physics-based canvas where you can drag, select, and interact with your creations.
*   **Chemical Bonding**: Visually create single, double, and peptide bonds to construct complex molecules.
*   **Goal-Oriented Gameplay**: Follow a "Goal Path" to guide your discoveries from simple quarks to complex organic compounds.
*   **Sandbox Mode**: Unleash your creativity with access to all particles from the start.
*   **Codex & Info Panel**: An in-game encyclopedia that tracks your discoveries and provides detailed information about each particle.
*   **Persistent State**: Your lab's progress is automatically saved to your browser's local storage.

## 🛠️ Tech Stack

*   **Framework**: [React](https://reactjs.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/)
*   **Animation**: [React Spring](https://www.react-spring.dev/)
*   **Gesture Handling**: [Use Gesture](https://use-gesture.netlify.app/)

## 🚀 Getting Started

To run this project locally, you'll need [Node.js](https://nodejs.org/) (version 20 or higher is recommended). You can use a version manager like `nvm` to easily manage Node versions.

### 1. Set up Node.js (Recommended: via nvm)

If you don't have `nvm`, you can install it:

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM into the current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use the latest Node.js LTS version (e.g., 20.x)
nvm install --lts
nvm use --lts
```

### 2. Install Dependencies and Run

Clone the repository and navigate into the project directory.

```bash
# Navigate to your project folder
# cd particle-lab

# It's good practice to remove old dependencies if you're re-installing
rm -rf node_modules package-lock.json

# Install all required packages
npm install

# Start the local development server
npm run dev
```

Your application should now be running at `http://localhost:5173` (or another port if 5173 is in use).

## 📂 Project Structure

*   `/public`: Static assets.
*   `/src`: Main application source code.
    *   `/components`: Reusable React components (e.g., `PeriodicTable`, `InfoPanel`).
    *   `/constants`: Core data like particle definitions and goal paths.
    *   `/core`: Core simulation logic (currently placeholder).
    *   `/hooks`: Custom React hooks for managing state and actions.
    *   `/recipes.js`: Definitions for how particles are combined.
    *   `App.jsx`: The main application component.
    *   `main.jsx`: The entry point for the React application.
