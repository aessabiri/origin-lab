import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import ParticleIcon from './ParticleIcon.jsx';
import { PARTICLE_TYPES, PARTICLE_COLORS, PARTICLE_NAMES, CODEX_PARTICLES_BY_CATEGORY, PARTICLE_INFO, elementaryParticleGroups } from '../../constants/particles.js';
import { COMPOUND_PARTICLE_TYPES } from '../../recipes.js';
import PeriodicTable from './PeriodicTable.jsx';
import ActionToolbar from './ActionToolbar.jsx';
import ActionMenu from './ActionMenu.jsx';
import ParticleCanvasOverlay from './ParticleCanvasOverlay.jsx';
import { useParticleActions } from '../hooks/useParticleActions.js';
import { useSelection } from '../hooks/useSelection.js';
import { MOLECULE_RECIPES } from '../../constants/moleculeRecipes.js';
import { RECIPES, PARTICLE_CATEGORIES } from '../../recipes.js';
import { useDecay } from '../hooks/useDecay.js';
import { useStore } from '../../store.js';
import { useParticleStore } from '../store.js';
import { findAssemblableMolecules } from '../utils/moleculeDetection.js';
import { useDiscoveredMatter } from '../../hooks/useDiscoveredMatter.js';

const MOLECULE_PARTICLE_TYPES = new Set(
  MOLECULE_RECIPES.map(r => r.type)
);

const ParticleCanvas = ({ onDragStart }) => {
  const { isCodexVisible, setIsCodexVisible } = useStore();
  const {
    particles, setParticles,
    bonds, setBonds,
    secondaryParticles,
    uiScale, setUiScale,
    isPeriodicTablePinned, setIsPeriodicTablePinned,
    isSandboxMode,
    isPaletteVisible, setIsPaletteVisible,
    isActionMenuVisible, setIsActionMenuVisible,
    isSettingsVisible, setIsSettingsVisible,
    isResetConfirmVisible, setIsResetConfirmVisible,
    isPeriodicTableVisible, setIsPeriodicTableVisible,
    message, showMessage,
    openExclusive,
    handleReset, executeReset,
    handleToggleSandbox,
    handleEmptyCanvas,
    setInfoPanelType
  } = useParticleStore();

  const { discoveredAtoms, discoveredMolecules } = useDiscoveredMatter();

  const [visualEffects, setVisualEffects] = useState([]);
  const draggedIndexRef = useRef(null);
  const canvasRef = useRef(null);
  const bondsCanvasRef = useRef(null);

  const allDiscoveredParticles = useMemo(() => {
    if (isSandboxMode) {
      return Object.keys(PARTICLE_INFO).map(type => ({ type }));
    } else {
      const elementary = Object.values(elementaryParticleGroups).flat().map(p => ({ type: p.type }));
      return [...elementary, ...secondaryParticles, ...discoveredAtoms, ...discoveredMolecules];
    }
  }, [isSandboxMode, secondaryParticles, discoveredAtoms, discoveredMolecules]);

  const discoveredParticlesForPeriodicTable = useMemo(() => {
    if (isSandboxMode) {
      return Object.values(PARTICLE_TYPES)
        .filter(type => RECIPES.some(r => r.type === type && (r.category === PARTICLE_CATEGORIES.ATOM || r.category === PARTICLE_CATEGORIES.SECONDARY)))
        .map(type => ({ type }));
    } else {
      return [...secondaryParticles, ...discoveredAtoms];
    }
  }, [isSandboxMode, secondaryParticles, discoveredAtoms]);

  const allPossibleParticles = useMemo(() => CODEX_PARTICLES_BY_CATEGORY, []);

  const {
    selectedParticleIds,
    setSelectedParticleIds,
    selectionBox,
    canvasBind,
    handleParticleClick,
    selectionInfo,
  } = useSelection({ canvasRef });
  
  const [springs, api] = useSprings(particles.length, i => ({
    x: particles[i]?.x ?? 0,
    y: particles[i]?.y ?? 0,
    scale: particles[i]?.scale ?? 1,
  }), [particles]);

  // --- Bond Rendering Loop ---
  useEffect(() => {
    const canvas = bondsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
         canvas.width = canvas.offsetWidth;
         canvas.height = canvas.offsetHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';

      bonds.forEach(bond => {
        const idxA = particles.findIndex(p => p.id === bond.particleA_id);
        const idxB = particles.findIndex(p => p.id === bond.particleB_id);
        
        if (idxA === -1 || idxB === -1) return;
        if (!springs[idxA] || !springs[idxB]) return;

        const xA = springs[idxA].x.get();
        const yA = springs[idxA].y.get();
        const xB = springs[idxB].x.get();
        const yB = springs[idxB].y.get();

        const pA = particles[idxA];
        const pB = particles[idxB];
        const sizeA = (COMPOUND_PARTICLE_TYPES.has(pA.type) || MOLECULE_PARTICLE_TYPES.has(pA.type) ? 96 : 64) * uiScale;
        const sizeB = (COMPOUND_PARTICLE_TYPES.has(pB.type) || MOLECULE_PARTICLE_TYPES.has(pB.type) ? 96 : 64) * uiScale;
        
        const cxA = xA + sizeA / 2;
        const cyA = yA + sizeA / 2;
        const cxB = xB + sizeB / 2;
        const cyB = yB + sizeB / 2;

        if (bond.type === 'single') {
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 3;
           ctx.strokeStyle = 'white';
           ctx.stroke();
        } else if (bond.type === 'double') {
           // Outer
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 10;
           ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
           ctx.stroke();
           // Inner
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 4;
           ctx.strokeStyle = 'white';
           ctx.stroke();
        } else if (bond.type === 'triple') {
           // Outer
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 14;
           ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
           ctx.stroke();
           // Inner
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 6;
           ctx.strokeStyle = 'white';
           ctx.stroke();
        } else if (bond.type === 'peptide') {
           ctx.beginPath();
           ctx.moveTo(cxA, cyA);
           ctx.lineTo(cxB, cyB);
           ctx.lineWidth = 6;
           ctx.strokeStyle = '#ec4899';
           ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [bonds, particles, springs, uiScale]);

  const bind = useDrag(({ args: [index], active, offset: [ox, oy], tap }) => {
    if (tap) return;

    draggedIndexRef.current = active ? index : null;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const particle = particles[index];
    const baseSize = PARTICLE_INFO[particle.type]?.size || 64;
    const particleSize = baseSize * uiScale;

    const clampedX = Math.max(0, Math.min(ox, canvasBounds.width - particleSize));
    const clampedY = Math.max(0, Math.min(oy, canvasBounds.height - particleSize));

    api.start(i => {
      if (i === index) {
        return {
          x: clampedX,
          y: clampedY,
          scale: active ? 1.1 : 1,
          immediate: active,
        };
      }
    });

    if (!active) {
      setParticles(particles.map((p, i) => i === index ? { ...p, x: clampedX, y: clampedY, scale: 1 } : p));
    }
  }, {
    from: ({ args: [index] }) => [springs[index].x.get(), springs[index].y.get()],
    filterTaps: true,
    pointer: { touch: true },
  });

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (!data.type) return;
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasBounds.left - 25;
      const newY = e.clientY - canvasBounds.top - 25;
      const newParticle = {
        id: `${data.type}-${Date.now()}`,
        type: data.type,
        x: newX,
        y: newY,
        scale: 1,
      };
      setParticles([...particles, newParticle]);
      showMessage(`Added ${PARTICLE_NAMES[data.type]} to the lab!`);
    } catch (err) {
      console.error('drop parse failed', err);
    }
  }, [particles, setParticles, showMessage]);

  const handleDragOver = (e) => { e.preventDefault(); };

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

    setBonds([...bonds, newBond]);
    setSelectedParticleIds(new Set());
    showMessage(`Created a ${bondType} bond!`);
  }, [selectedParticleIds, bonds, setBonds, showMessage, setSelectedParticleIds]);

  const handleAddPeptideBond = useCallback(() => {
    if (selectedParticleIds.size !== 2) return;

    const [particleA_id, particleB_id] = Array.from(selectedParticleIds);

    const newBond = {
      id: `bond-${Date.now()}`,
      type: 'peptide',
      particleA_id,
      particleB_id,
    };

    setBonds([...bonds, newBond]);
    setSelectedParticleIds(new Set());
    showMessage('Peptide bond formed!');
  }, [selectedParticleIds, bonds, setBonds, showMessage, setSelectedParticleIds]);

  const handleBreakBonds = useCallback(() => {
    if (selectedParticleIds.size === 0) return;

    setBonds(bonds.filter(bond =>
      !selectedParticleIds.has(bond.particleA_id) && !selectedParticleIds.has(bond.particleB_id)
    ));

    showMessage('Bonds broken.');
  }, [selectedParticleIds, bonds, setBonds, showMessage]);

  const handleRemoveSelected = useCallback(() => {
    if (selectedParticleIds.size === 0) return;
    const count = selectedParticleIds.size;
    setParticles(particles.filter(p => !selectedParticleIds.has(p.id)))
    setSelectedParticleIds(new Set());
    showMessage(`${count} particle(s) removed.`);
  }, [selectedParticleIds, particles, setParticles, showMessage, setSelectedParticleIds]);
  
  const handleRemoveSelectedWithBonds = useCallback(() => {
    setBonds(bonds.filter(bond => !selectedParticleIds.has(bond.particleA_id) && !selectedParticleIds.has(bond.particleB_id)));
    handleRemoveSelected();
  }, [handleRemoveSelected, selectedParticleIds, bonds, setBonds]);

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
    const areBothAminoAcids = selected.every(p => aminoAcidTypes.has(p.type));
    if (areBothAminoAcids) return true;

    const hasCarboxyl = selected.some(p => p.type === PARTICLE_TYPES.FORMIC_ACID);
    const hasAmino = selected.some(p => p.type === PARTICLE_TYPES.AMMONIA);

    return areBothAminoAcids;
  }, [particles, selectedParticleIds]);
  
  const assemblableMoleculeIds = useMemo(() => {
    return findAssemblableMolecules(particles, bonds);
  }, [particles, bonds]);

  const handleShowInfo = useCallback((type) => setInfoPanelType(type), [setInfoPanelType]);

  const triggerRadiationBurst = useCallback((x, y) => {
    const newEffects = Array.from({ length: 7 }).map((_, i) => ({
      id: `fx-${i}-${Date.now()}`,
      x: x + 48,
      y: y + 48,
    }));
    setVisualEffects(prev => [...prev, ...newEffects]);
    newEffects.forEach(fx => {
      setTimeout(() => {
        setVisualEffects(prev => prev.filter(effect => effect.id !== fx.id));
      }, 700);
    });
  }, []);

  useDecay(triggerRadiationBurst);

  useEffect(() => {
    api.start(i => {
      if (i === draggedIndexRef.current) {
        return {};
      }
      return {
        x: particles[i]?.x ?? 0,
        y: particles[i]?.y ?? 0,
        scale: particles[i]?.scale ?? 1,
        immediate: false,
      };
    });
  }, [particles, api]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvasBounds = canvasRef.current.getBoundingClientRect();

      setParticles(particles.map(p => {
        const baseSize = PARTICLE_INFO[p.type]?.size || 64;
        const particleSize = baseSize * uiScale;

        const clampedX = Math.max(0, Math.min(p.x, canvasBounds.width - particleSize));
        const clampedY = Math.max(0, Math.min(p.y, canvasBounds.height - particleSize));

        if (clampedX !== p.x || clampedY !== p.y) {
          return { ...p, x: clampedX, y: clampedY };
        }
        return p;
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [uiScale, particles, setParticles]);

  return (
    <div
      {...canvasBind()}
      ref={canvasRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative flex-1 bg-gray-800 border-4 border-dashed border-gray-700 rounded-2xl shadow-xl overflow-hidden touch-none"
    >
      <button
        onClick={() => setIsPaletteVisible(!isPaletteVisible)}
        className="absolute top-1/2 -translate-y-1/2 right-0 z-20 bg-gray-700/50 hover:bg-gray-600/70 p-3 rounded-l-lg transition-all"
        aria-label={isPaletteVisible ? 'Hide palette' : 'Show palette'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isPaletteVisible ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          )}
        </svg>
      </button>

      {visualEffects.map(fx => (
        <div
          key={fx.id}
          className="radiation-particle"
          style={{
            left: fx.x,
            top: fx.y,
            '--i': Math.random(),
            '--j': Math.random(),
          }}
        />
      ))}

      <canvas 
        ref={bondsCanvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {selectionBox.visible && (
        <div
          className="absolute bg-blue-500/20 border-2 border-blue-400 pointer-events-none"
          style={{
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
          }}
        />
      )}

      {springs.map((props, i) => {
        const particle = particles[i];
        if (!particle) return null;

        const isSelected = selectedParticleIds.has(particle.id);
        const isCompound = COMPOUND_PARTICLE_TYPES.has(particle.type) || MOLECULE_PARTICLE_TYPES.has(particle.type);
        const isAssemblable = assemblableMoleculeIds.has(particle.id);

        const baseSize = PARTICLE_INFO[particle.type]?.size || 64;

        return (
          <animated.div
            {...bind(i)}
            key={particle.id}
            style={{
              x: props.x,
              y: props.y,
              scale: props.scale,
              zIndex: isSelected ? 10 : 1,
              touchAction: 'none',
              width: `${baseSize * uiScale}px`,
              height: `${baseSize * uiScale}px`,
            }}
            className={`absolute cursor-grab transition-colors duration-300 flex items-center justify-center font-bold text-white ${isSelected ? 'ring-2 ring-yellow-300 rounded-lg' : ''} ${isAssemblable ? 'molecule-glow' : ''}`}
            onClick={(e) => handleParticleClick(e, particle.id)}
            onDoubleClick={() => handleShowInfo(particle.type)}
            onMouseEnter={() => api.start(j => (j === i ? { scale: 1.2 } : {}))}
            onMouseLeave={() => api.start(j => (j === i ? { scale: 1 } : {}))}
          >
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-full h-full">
                <ParticleIcon type={particle.type} color={PARTICLE_COLORS[particle.type]} isCompound={isCompound} />
              </div>
              <span className="text-white text-center p-1 absolute -bottom-6 text-sm">
                {PARTICLE_NAMES[particle.type]}
              </span>
            </div>
          </animated.div>
        );
      })}

      <ParticleCanvasOverlay 
        onAssemble={handleAssemble}
        onDisassemble={handleDisassemble}
        onRevert={handleRevertToElementary}
        onRemoveSelected={handleRemoveSelectedWithBonds}
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
        
        // PASS NEW PROPS
        discoveredAtoms={discoveredAtoms}
      />
    </div>
  );
};

export default ParticleCanvas;