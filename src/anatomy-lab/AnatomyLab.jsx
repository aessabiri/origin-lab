import React from 'react';
import AnatomyCanvas from './components/AnatomyCanvas';
import AnatomyWorkbench from './components/AnatomyWorkbench';
import BiomechanicsHUD from './components/BiomechanicsHUD';
import ConsciousnessAwakening from './components/ConsciousnessAwakening';
import { useAnatomyStore } from './store';

const AnatomyLab = () => {
  const isAwakened = useAnatomyStore(state => state.isAwakened);

  return (
    <div className="w-full h-full flex flex-row bg-[#06080e] text-white select-none overflow-hidden relative font-inter">
      {/* 3D Medical Assembly Viewport */}
      <main className="flex-1 h-full relative overflow-hidden">
        <AnatomyCanvas />
        <BiomechanicsHUD />
      </main>

      {/* Assembly Dock & Inventory Workbench */}
      <AnatomyWorkbench />

      {/* Climactic Awakening Modal */}
      {isAwakened && <ConsciousnessAwakening />}
    </div>
  );
};

export default AnatomyLab;
