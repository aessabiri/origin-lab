import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import ParticleIcon from './ParticleIcon.jsx';
import { PARTICLE_TYPES, PARTICLE_COLORS, PARTICLE_NAMES, PARTICLE_INFO } from '../../constants/particles.js';
import { COMPOUND_PARTICLE_TYPES } from '../../recipes.js';
import ActionToolbar from './ActionToolbar.jsx';
import ParticleCanvasOverlay from './ParticleCanvasOverlay.jsx';
import { useParticleActions } from '../hooks/useParticleActions.js';
import { useSelection } from '../hooks/useSelection.js';
import { MOLECULE_RECIPES } from '../../constants/moleculeRecipes.js';
import { useDecay } from '../hooks/useDecay.js';
import { useParticleStore } from '../store.js';
import { findAssemblableMolecules } from '../utils/moleculeDetection.js';
import { useDiscoveredMatter } from '../../hooks/useDiscoveredMatter.js';

const MOLECULE_PARTICLE_TYPES = new Set(
  MOLECULE_RECIPES.map(r => r.type)
);

// Highly Optimized Draggable Atom Component
const DraggableParticle = React.memo(({
  id,
  type,
  initialX,
  initialY,
  initialScale,
  springRegistry,
  uiScale,
  isSelected,
  isAssemblable,
  onDragEnd,
  onParticleClick,
  onShowInfo,
  canvasRef,
}) => {
  const isCompound = COMPOUND_PARTICLE_TYPES.has(type) || MOLECULE_PARTICLE_TYPES.has(type);
  const baseSize = PARTICLE_INFO[type]?.size || 64;
  const size = baseSize * uiScale;

  const [springs, api] = useSpring(() => ({
    x: initialX,
    y: initialY,
    scale: initialScale ?? 1,
    config: { tension: 350, friction: 28 }
  }), [initialX, initialY, initialScale]);

  useEffect(() => {
    if (springRegistry.current) {
      springRegistry.current.set(id, springs);
    }
    return () => {
      if (springRegistry.current) {
        springRegistry.current.delete(id);
      }
    };
  }, [id, springs, springRegistry]);

  const bind = useDrag(({ active, offset: [ox, oy], tap }) => {
    if (tap) return;
    if (!canvasRef.current) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(ox, canvasBounds.width - size));
    const clampedY = Math.max(0, Math.min(oy, canvasBounds.height - size));

    api.start({
      x: clampedX,
      y: clampedY,
      scale: active ? 1.12 : 1,
      immediate: active, // 60 FPS zero-lag tracking while dragging
    });

    if (!active) {
      onDragEnd(id, clampedX, clampedY);
    }
  }, {
    from: () => [springs.x.get(), springs.y.get()],
    filterTaps: true,
    pointer: { touch: true },
  });

  return (
    <animated.div
      {...bind()}
      style={{
        x: springs.x,
        y: springs.y,
        scale: springs.scale,
        zIndex: isSelected ? 30 : 10,
        touchAction: 'none',
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`absolute cursor-grab active:cursor-grabbing flex items-center justify-center font-bold text-white select-none transition-shadow duration-200 group ${
        isSelected ? 'selection-halo rounded-2xl ring-2 ring-cyan-400' : ''
      } ${isAssemblable ? 'molecule-glow rounded-2xl' : ''}`}
      onClick={(e) => onParticleClick(e, id)}
      onDoubleClick={() => onShowInfo(type)}
      onMouseEnter={() => !isSelected && api.start({ scale: 1.1 })}
      onMouseLeave={() => !isSelected && api.start({ scale: 1 })}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full p-1">
        
        {/* Subtle glowing quantum energy orbit */}
        <div className={`absolute inset-0 rounded-full border border-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isCompound ? 'scale-110' : 'scale-125'}`}></div>
        
        {/* Core Icon */}
        <div className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <ParticleIcon 
            type={type} 
            color={PARTICLE_COLORS[type]} 
            isCompound={isCompound} 
          />
        </div>

        {/* Clean Scientific Label Pill */}
        <div className="absolute -bottom-5 px-2 py-0.5 rounded-md bg-[#0a0f18]/90 border border-slate-700/60 shadow-lg text-[10px] font-mono tracking-tight text-slate-200 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors pointer-events-none whitespace-nowrap">
          {PARTICLE_NAMES[type]}
        </div>
      </div>
    </animated.div>
  );
}, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.type === next.type &&
    prev.initialX === next.initialX &&
    prev.initialY === next.initialY &&
    prev.initialScale === next.initialScale &&
    prev.uiScale === next.uiScale &&
    prev.isSelected === next.isSelected &&
    prev.isAssemblable === next.isAssemblable &&
    prev.onDragEnd === next.onDragEnd &&
    prev.onParticleClick === next.onParticleClick &&
    prev.onShowInfo === next.onShowInfo
  );
});

const ParticleCanvas = ({ onDragStart }) => {
  const {
    particles: rawParticles, setParticles,
    bonds: rawBonds, setBonds,
    uiScale,
    isPeriodicTablePinned,
    isPeriodicTableVisible,
    showMessage,
    handleEmptyCanvas,
    setInfoPanelType
  } = useParticleStore();

  const particles = Array.isArray(rawParticles) ? rawParticles : [];
  const bonds = Array.isArray(rawBonds) ? rawBonds : [];

  const { discoveredAtoms } = useDiscoveredMatter();

  const [visualEffects, setVisualEffects] = useState([]);
  const canvasRef = useRef(null);
  const bondsCanvasRef = useRef(null);
  const springRegistry = useRef(new Map());

  const latestParticlesRef = useRef(particles);
  const latestBondsRef = useRef(bonds);
  
  useEffect(() => {
    latestParticlesRef.current = particles;
  }, [particles]);

  useEffect(() => {
    latestBondsRef.current = bonds;
  }, [bonds]);

  const {
    selectedParticleIds,
    setSelectedParticleIds,
    selectionBox,
    canvasBind,
    handleParticleClick,
    selectionInfo,
  } = useSelection({ canvasRef });

  // --- High Performance Bond Rendering Loop (RAF with zero React re-render tie-in) ---
  useEffect(() => {
    const canvas = bondsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let pulsePhase = 0;

    const render = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
         canvas.width = canvas.offsetWidth;
         canvas.height = canvas.offsetHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      pulsePhase = (pulsePhase + 0.03) % (Math.PI * 2);

      const activeBonds = latestBondsRef.current;
      const activeParticles = latestParticlesRef.current;
      const springsMap = springRegistry.current;

      for (let i = 0; i < activeBonds.length; i++) {
        const bond = activeBonds[i];
        const springA = springsMap.get(bond.particleA_id);
        const springB = springsMap.get(bond.particleB_id);
        const pA = activeParticles.find(p => p.id === bond.particleA_id);
        const pB = activeParticles.find(p => p.id === bond.particleB_id);
        
        if (!springA || !springB || !pA || !pB) continue;

        const xA = springA.x.get();
        const yA = springA.y.get();
        const xB = springB.x.get();
        const yB = springB.y.get();

        const sizeA = (COMPOUND_PARTICLE_TYPES.has(pA.type) || MOLECULE_PARTICLE_TYPES.has(pA.type) ? 96 : 64) * uiScale;
        const sizeB = (COMPOUND_PARTICLE_TYPES.has(pB.type) || MOLECULE_PARTICLE_TYPES.has(pB.type) ? 96 : 64) * uiScale;
        
        const cxA = xA + sizeA / 2;
        const cyA = yA + sizeA / 2;
        const cxB = xB + sizeB / 2;
        const cyB = yB + sizeB / 2;

        if (bond.type === 'single') {
           // Outer Glow
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 6;
           ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
           ctx.stroke();

           // Core Line
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 2.5;
           ctx.strokeStyle = '#e0f2fe';
           ctx.stroke();
        } else if (bond.type === 'double') {
           // Double bond lines
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 10;
           ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
           ctx.stroke();

           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 4;
           ctx.strokeStyle = '#38bdf8';
           ctx.stroke();

           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 1.5;
           ctx.strokeStyle = '#ffffff';
           ctx.stroke();
        } else if (bond.type === 'triple') {
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 14;
           ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
           ctx.stroke();

           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 6;
           ctx.strokeStyle = '#c084fc';
           ctx.stroke();

           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 2;
           ctx.strokeStyle = '#ffffff';
           ctx.stroke();
        } else if (bond.type === 'peptide') {
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 8;
           ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
           ctx.stroke();

           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 3.5;
           ctx.strokeStyle = '#f472b6';
           ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [uiScale]);

  // Stable drag end callback that doesn't recreate when particles change
  const handleParticleDragEnd = useCallback((id, x, y) => {
    setParticles(prev => prev.map(p => p.id === id ? { ...p, x, y, scale: 1 } : p));
  }, [setParticles]);

  // Smooth drop handler with functional state update
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      if (!data.type) return;

      if (!canvasRef.current) return;
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(e.clientX - canvasBounds.left - 32, canvasBounds.width - 64));
      const newY = Math.max(0, Math.min(e.clientY - canvasBounds.top - 32, canvasBounds.height - 64));
      
      const newParticle = {
        id: `${data.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: data.type,
        x: newX,
        y: newY,
        scale: 1,
      };

      setParticles(prev => [...prev, newParticle]);
      showMessage(`Added ${PARTICLE_NAMES[data.type]} to the reaction chamber`);
    } catch (err) {
      console.error('Drop parse error', err);
    }
  }, [setParticles, showMessage]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const {
    handleAssemble,
    handleDisassemble,
    handleRevertToElementary,
  } = useParticleActions({
    selectionInfo,
    setSelectedParticleIds,
  });

  const handleAddBond = useCallback((bondType) => {
    if (selectedParticleIds.size !== 2) return;
    const [particleA_id, particleB_id] = Array.from(selectedParticleIds);

    const newBond = {
      id: `bond-${Date.now()}`,
      type: bondType,
      particleA_id,
      particleB_id,
    };

    setBonds(prev => [...prev, newBond]);
    setSelectedParticleIds(new Set());
    showMessage(`Formed ${bondType} covalent bond`);
  }, [selectedParticleIds, setBonds, showMessage, setSelectedParticleIds]);

  const handleAddPeptideBond = useCallback(() => {
    if (selectedParticleIds.size !== 2) return;
    const [particleA_id, particleB_id] = Array.from(selectedParticleIds);

    const newBond = {
      id: `bond-${Date.now()}`,
      type: 'peptide',
      particleA_id,
      particleB_id,
    };

    setBonds(prev => [...prev, newBond]);
    setSelectedParticleIds(new Set());
    showMessage('Formed peptide bond');
  }, [selectedParticleIds, setBonds, showMessage, setSelectedParticleIds]);

  const handleBreakBonds = useCallback(() => {
    if (selectedParticleIds.size === 0) return;
    setBonds(prev => prev.filter(bond =>
      !selectedParticleIds.has(bond.particleA_id) && !selectedParticleIds.has(bond.particleB_id)
    ));
    showMessage('Severed covalent bonds');
  }, [selectedParticleIds, setBonds, showMessage]);

  const handleRemoveSelected = useCallback(() => {
    if (selectedParticleIds.size === 0) return;
    
    setParticles(prev => prev.filter(p => !selectedParticleIds.has(p.id)));
    setBonds(prev => prev.filter(b => !selectedParticleIds.has(b.particleA_id) && !selectedParticleIds.has(b.particleB_id)));
    setSelectedParticleIds(new Set());
    showMessage(`Purged selection from chamber`);
  }, [selectedParticleIds, setParticles, setBonds, showMessage, setSelectedParticleIds]);

  const canBreakBonds = useMemo(() => {
    if (selectedParticleIds.size === 0) return false;
    const selectedIds = Array.from(selectedParticleIds);
    return bonds.some(bond =>
      selectedIds.includes(bond.particleA_id) || selectedIds.includes(bond.particleB_id)
    );
  }, [bonds, selectedParticleIds]);

  const canAddPeptideBond = useMemo(() => {
    if (selectedParticleIds.size !== 2) return false;
    const selected = particles.filter(p => selectedParticleIds.has(p.id));
    const aminoAcidTypes = new Set([
      PARTICLE_TYPES.GLYCINE,
      PARTICLE_TYPES.ALANINE,
      PARTICLE_TYPES.VALINE,
      PARTICLE_TYPES.LEUCINE,
      PARTICLE_TYPES.SERINE,
    ]);
    return selected.length === 2 && selected.every(p => aminoAcidTypes.has(p.type));
  }, [particles, selectedParticleIds]);
  
  const assemblableMoleculeIds = useMemo(() => {
    return findAssemblableMolecules(particles, bonds);
  }, [particles, bonds]);

  const handleShowInfo = useCallback((type) => setInfoPanelType(type), [setInfoPanelType]);

  const triggerRadiationBurst = useCallback((x, y) => {
    const newEffects = Array.from({ length: 6 }).map((_, i) => ({
      id: `fx-${i}-${Date.now()}`,
      x: x + 32,
      y: y + 32,
    }));
    setVisualEffects(prev => [...prev, ...newEffects]);
    setTimeout(() => {
      setVisualEffects(prev => prev.filter(fx => !newEffects.some(ne => ne.id === fx.id)));
    }, 700);
  }, []);

  useDecay(triggerRadiationBurst);

  return (
    <div
      {...canvasBind()}
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative flex-1 min-w-0 min-h-0 w-full h-full lab-grid-bg border border-cyan-500/25 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden touch-none select-none transition-all duration-300"
    >
      {/* Radiation Decay FX */}
      {visualEffects.map(fx => (
        <div
          key={fx.id}
          className="radiation-particle pointer-events-none"
          style={{
            left: fx.x,
            top: fx.y,
            '--i': Math.random(),
            '--j': Math.random(),
          }}
        />
      ))}

      {/* High-Performance Canvas for Bonds */}
      <canvas 
        ref={bondsCanvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Selection Box */}
      {selectionBox.visible && (
        <div
          className="absolute bg-cyan-500/15 border-2 border-cyan-400/80 rounded-lg pointer-events-none shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          style={{
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
          }}
        />
      )}

      {/* Active Atoms & Particles */}
      {particles.map(particle => (
        <DraggableParticle
          key={particle.id}
          id={particle.id}
          type={particle.type}
          initialX={particle.x}
          initialY={particle.y}
          initialScale={particle.scale}
          springRegistry={springRegistry}
          uiScale={uiScale}
          isSelected={selectedParticleIds.has(particle.id)}
          isAssemblable={assemblableMoleculeIds.has(particle.id)}
          onDragEnd={handleParticleDragEnd}
          onParticleClick={handleParticleClick}
          onShowInfo={handleShowInfo}
          canvasRef={canvasRef}
        />
      ))}

      {/* Canvas HUD & Toolbars */}
      <ParticleCanvasOverlay 
        onAssemble={handleAssemble}
        onDisassemble={handleDisassemble}
        onRevert={handleRevertToElementary}
        onRemoveSelected={handleRemoveSelected}
        onBreakBonds={handleBreakBonds}
        onAddSingleBond={() => handleAddBond('single')}
        onAddDoubleBond={() => handleAddBond('double')}
        onAddTripleBond={() => handleAddBond('triple')}
        onAddPeptideBond={handleAddPeptideBond}
        onEmptyCanvas={handleEmptyCanvas}
        onDragStart={onDragStart}
        onShowInfo={handleShowInfo}
        
        selectionInfo={selectionInfo}
        canBreakBonds={canBreakBonds}
        canAddBond={selectedParticleIds.size === 2 && !selectionInfo.isMoleculeAssembly && !canAddPeptideBond}
        canAddPeptideBond={canAddPeptideBond}
        selectedParticleIds={selectedParticleIds}
        hasParticles={particles.length > 0}
        
        isPeriodicTableVisible={isPeriodicTableVisible}
        isPeriodicTablePinned={isPeriodicTablePinned}
        discoveredAtoms={discoveredAtoms}
      />
    </div>
  );
};

export default React.memo(ParticleCanvas);