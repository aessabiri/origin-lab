import React from 'react';
import AnatomyCanvas from './components/AnatomyCanvas';
import AnatomyWorkbench from './components/AnatomyWorkbench';
import BiomechanicsHUD from './components/BiomechanicsHUD';

const AnatomyLab = () => {
  return (
    <div className="w-full h-full flex flex-row bg-[#06080e] text-white select-none overflow-hidden relative font-inter">
      {/* 3D High-Definition Human Assembly Viewport */}
      <main className="flex-1 h-full relative overflow-hidden">
        <AnatomyCanvas />
        <BiomechanicsHUD />
      </main>

      {/* Assembly Dock & 6-Layer System Workbench */}
      <AnatomyWorkbench />
    </div>
  );
};

export default AnatomyLab;
