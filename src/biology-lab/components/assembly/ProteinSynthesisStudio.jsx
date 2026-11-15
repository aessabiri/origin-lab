import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { cosmicAudio } from '../../../utils/cosmicAudioBus';
import { useStore } from '../../../store';
import { useInventory } from '../../../store/inventory';
import {
  TIER_4_FOLDED_PROTEINS,
  computeRibosomeStep,
} from '../../data/topDownBioHierarchy';
import {
  BIO_SUB_INGREDIENTS,
  PROTEIN_RECIPES,
} from '../ProteinIngredientsStore';
import {
  buildRealisticMacromolecule,
  buildSubIngredientsPreviewGroup,
} from '../../utils/molecularImpostorEngine';
import {
  createChamberComposer,
  setupChamberStudioLighting,
  disposeHierarchy,
} from '../../utils/chamberVisualEffects';
import {
  loadAlphaFoldStructures,
  buildAlphaFoldProteinGroup,
} from '../../utils/alphaFoldRenderer';
import ChamberTelemetryScreen from './ChamberTelemetryScreen';
import ReactorControlPanel, {
  RotaryDial,
  BreakerButton,
  AnalogMeter,
} from './ReactorControlPanel';

const getInventoryStockForSub = (subId, inventoryState) => {
  if (subId === 'iron') return inventoryState.elements?.Fe ?? 0;
  return inventoryState.molecules?.[subId] ?? 0;
};

const SUB_SYMBOL_MAP = {
  glycerol: 'GLY',
  'fatty-acid': 'FA',
  'phosphoric-acid': 'PO₄',
  adenine: 'ATGC',
  ribose: 'dR',
  glycine: 'Gly',
  'glutamic-acid': 'Glu',
  arginine: 'Arg',
  iron: 'Fe²⁺',
  'nucleotide-a': 'ATP',
};

const ProteinSynthesisStudio = ({
  molecule,
  isBuilt = false,
  demiurgeSurvivalMode = false,
  onComplete,
  onNextStage,
}) => {
  const mountRef = useRef(null);
  const modelGroupRef = useRef(null);
  const timerRef = useRef(null);

  const invElements = useInventory((s) => s.elements);
  const invMolecules = useInventory((s) => s.molecules);
  const executeTransaction = useInventory((s) => s.executeTransaction);

  const [afStructures, setAfStructures] = useState(null);
  const [colorMode, setColorMode] = useState('plddt'); // 'plddt' | 'cryoem' | 'goodsell'
  const [loadedByMol, setLoadedByMol] = useState({});
  const [foldByMol, setFoldByMol] = useState({});
  const [regrowingByMol, setRegrowingByMol] = useState({});
  const [synthesisState, setSynthesisState] = useState(null);

  const [chaperoneDial, setChaperoneDial] = useState(75);
  const [ribosomeDial, setRibosomeDial] = useState(22);
  const [tempC, setTempC] = useState(37.0);
  const [phLevel, setPhLevel] = useState(7.4);

  useEffect(() => {
    loadAlphaFoldStructures().then((data) => setAfStructures(data));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const afData = afStructures?.[molecule.id] || null;
  const reqIds = PROTEIN_RECIPES[molecule.id] || [];
  const components = useMemo(
    () =>
      reqIds.map((id) => {
        const sub = BIO_SUB_INGREDIENTS.find((x) => x.id === id) || {
          id,
          name: id,
          formula: id,
          color: molecule.color,
        };
        return {
          id: sub.id,
          iconId: sub.id === 'phosphoric-acid' ? 'phosphate' : sub.id,
          symbol: SUB_SYMBOL_MAP[sub.id] || sub.formula || sub.id.slice(0, 4).toUpperCase(),
          name: sub.name,
          color: sub.color || molecule.color,
        };
      }),
    [reqIds, molecule.color]
  );

  const loadedIds = loadedByMol[molecule.id] || [];
  const effectivelyBuilt = isBuilt && !regrowingByMol[molecule.id];
  const foldPct = effectivelyBuilt ? 100 : foldByMol[molecule.id] || 0;
  const isSynthesizing = Boolean(synthesisState && synthesisState.molId === molecule.id);
  const allLoaded = components.every((c) => loadedIds.includes(c.id));

  const isTempOptimal = tempC >= 35.5 && tempC <= 38.5;
  const isPhOptimal = phLevel >= 7.2 && phLevel <= 7.6;
  const isChapOptimal = chaperoneDial >= 45 && chaperoneDial <= 90;
  const optimalCount = [isTempOptimal, isPhOptimal, isChapOptimal].filter(Boolean).length;
  const purityGrade = optimalCount === 3 ? 'S' : optimalCount >= 2 ? 'A' : 'B';

  // 1. Persistent 60 FPS WebGL Viewport
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 390;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envCleanup = setupChamberStudioLighting(renderer, scene);
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 3.6);

    const composer = createChamberComposer(renderer, scene, camera, width, height);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.6;
    controls.maxDistance = 6.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.85;

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    modelGroupRef.current = rootGroup;

    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r || r.width < 10 || r.height < 10) return;
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
      composer.setSize(r.width, r.height);
    });
    ro.observe(container);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      rootGroup.position.y = Math.sin(t * 1.4) * 0.04;
      controls.update();
      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      composer.dispose();
      envCleanup();
      disposeHierarchy(scene);
      renderer.dispose();
    };
  }, []);

  // 2. Render Real AlphaFold Protein (with live foldProgress) or DNA/Lipid Assembly
  useEffect(() => {
    const group = modelGroupRef.current;
    if (!group) return;
    while (group.children.length > 0) {
      const child = group.children.pop();
      disposeHierarchy(child);
    }

    const prog = Math.max(0, Math.min(1, foldPct / 100));

    if (afData && (prog > 0 || isSynthesizing)) {
      const afGroup = buildAlphaFoldProteinGroup(afData, {
        foldProgress: prog,
        colorMode,
        accentColor: molecule.color,
      });
      group.add(afGroup);
    } else if (effectivelyBuilt) {
      const mac = buildRealisticMacromolecule(molecule.id, {
        styleMode: colorMode === 'goodsell' ? 1 : 0,
      });
      group.add(mac);
    } else if (loadedIds.length > 0) {
      const preview = buildSubIngredientsPreviewGroup(loadedIds, {
        styleMode: colorMode === 'goodsell' ? 1 : 0,
      });
      group.add(preview);
    } else if (afData) {
      // Show subtle translucent ghost of target AlphaFold structure before folding starts
      const ghost = buildAlphaFoldProteinGroup(afData, {
        foldProgress: 1,
        colorMode: 'cryoem',
        accentColor: molecule.color,
      });
      ghost.traverse((obj) => {
        if (obj.material) {
          obj.material.transparent = true;
          obj.material.opacity = 0.16;
        }
      });
      group.add(ghost);
    }
  }, [afData, molecule.id, molecule.color, foldPct, effectivelyBuilt, isSynthesizing, loadedIds, colorMode]);

  const handleInfuseSub = (subId) => {
    if (demiurgeSurvivalMode) {
      const stock = getInventoryStockForSub(subId, { elements: invElements, molecules: invMolecules });
      if (stock < 1) {
        useStore
          .getState()
          .showMessage(`⚛️ Out of ${subId} in Physics/Chemistry Ledger! Craft it first or switch to Sandbox.`);
        return;
      }
    }
    setLoadedByMol((prev) => {
      const cur = prev[molecule.id] || [];
      if (cur.includes(subId)) return prev;
      return { ...prev, [molecule.id]: [...cur, subId] };
    });
    cosmicAudio.playPulse(620);
  };

  const handlePrimeAll = () => {
    if (demiurgeSurvivalMode) {
      const missing = reqIds.find(
        (id) => getInventoryStockForSub(id, { elements: invElements, molecules: invMolecules }) < 1
      );
      if (missing) {
        useStore
          .getState()
          .showMessage(`⚛️ Out of ${missing} in Physics/Chemistry Ledger! Craft it first or switch to Sandbox.`);
        return;
      }
    }
    setLoadedByMol((prev) => ({ ...prev, [molecule.id]: [...reqIds] }));
    cosmicAudio.playSynthesisChord();
  };

  const handleStartSynthesis = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (demiurgeSurvivalMode) {
      const costs = { elements: {}, molecules: {} };
      reqIds.forEach((subId) => {
        if (subId === 'iron') costs.elements.Fe = (costs.elements.Fe || 0) + 1;
        else costs.molecules[subId] = (costs.molecules[subId] || 0) + 1;
      });
      if (!executeTransaction(costs, {})) {
        useStore
          .getState()
          .showMessage(`⚛️ Insufficient Physics/Chemistry stock to synthesize ${molecule.name}.`);
        return;
      }
    }

    const proteinSpec = TIER_4_FOLDED_PROTEINS[molecule.id];
    if (!proteinSpec) {
      let step = 0;
      const phases = [25, 55, 82, 100];
      const advanceNonProtein = () => {
        const pct = phases[step];
        setSynthesisState({
          molId: molecule.id,
          isProtein: false,
          phase:
            molecule.id === 'bdna_chromatin'
              ? 'DNA Polymerization (No Codons)'
              : 'Lipid Self-Assembly (No Codons)',
        });
        setFoldByMol((p) => ({ ...p, [molecule.id]: pct }));
        cosmicAudio.playPulse(480 + step * 70);
        step += 1;
        if (step >= phases.length) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRegrowingByMol((p) => ({ ...p, [molecule.id]: false }));
          setSynthesisState(null);
          onComplete?.(molecule.id, null);
        }
      };
      advanceNonProtein();
      timerRef.current = setInterval(advanceNonProtein, 260);
      return;
    }

    const totalSteps = Math.min(8, Math.max(4, Math.floor(proteinSpec.dna.length / 3)));
    let step = 0;
    const advance = () => {
      const ribo = computeRibosomeStep(proteinSpec.dna, step);
      const pct = Math.min(99, Math.round(((step + 1) / totalSteps) * 95));
      setFoldByMol((p) => ({ ...p, [molecule.id]: pct }));
      setSynthesisState({
        molId: molecule.id,
        isProtein: true,
        phase: step === 0 ? 'Transcription (DNA → mRNA)' : '80S Ribosome Translation & AlphaFold Folding',
        codonIndex: step + 1,
        totalSteps,
        pSiteCodon: ribo.pSiteCodon,
        tRnaAnticodon: ribo.tRnaAnticodon,
        currentAminoAcid: ribo.currentAminoAcid,
      });
      cosmicAudio.playPulse(440 + step * 55);
      step += 1;
      if (step >= totalSteps) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setFoldByMol((p) => ({ ...p, [molecule.id]: 100 }));
        setRegrowingByMol((p) => ({ ...p, [molecule.id]: false }));
        setSynthesisState(null);
        onComplete?.(molecule.id, proteinSpec.geneId);
      }
    };
    advance();
    timerRef.current = setInterval(advance, 240);
  };

  const elementLevels = useMemo(() => {
    const map = {};
    components.forEach((c) => {
      map[c.id] = effectivelyBuilt || loadedIds.includes(c.id) ? 100 : 0;
    });
    return map;
  }, [components, loadedIds, effectivelyBuilt]);

  const annunciators = [
    { label: 'THERMAL', state: isTempOptimal ? 'ok' : 'warn' },
    { label: 'pH BUFFER', state: isPhOptimal ? 'ok' : 'warn' },
    { label: 'PRECURSORS', state: effectivelyBuilt || allLoaded ? 'ok' : 'warn' },
    { label: afData ? 'ALPHAFOLD' : 'RIBOSOME', state: isSynthesizing ? 'ok' : effectivelyBuilt ? 'ok' : 'idle' },
  ];

  return (
    <div className="col-span-12 flex-1 flex flex-col gap-2.5 min-h-0">
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-[340px]">
        {/* 3D AlphaFold / Macromolecule Folding Viewport */}
        <div className="col-span-12 lg:col-span-8 bg-[#050912] rounded-2xl border border-white/10 relative overflow-hidden min-h-[340px]">
          <div ref={mountRef} className="w-full h-full min-h-[340px] cursor-grab active:cursor-grabbing" />

          {/* Top-Left AlphaFold / Macromolecule Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 pointer-events-none">
            <div className="text-[8.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              {afData
                ? `STOP 1 // DEEPMIND ALPHAFOLD DB (${afData.modelEntityId}) • ${afData.residueCount} AA • pLDDT ${afData.globalPlddt}`
                : `STOP 1 // MACROMOLECULAR ASSEMBLY`}
            </div>
            <div className="text-xs font-black text-white">
              {molecule.icon} {molecule.name}
            </div>
          </div>

          {/* Top-Right Coloring Style Switcher */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <div className="bg-[#090d16]/90 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 flex items-center gap-1">
              {afData && (
                <button
                  type="button"
                  onClick={() => setColorMode('plddt')}
                  className={`px-2 py-0.5 rounded-lg text-[8.5px] font-mono font-bold uppercase border cursor-pointer ${
                    colorMode === 'plddt'
                      ? 'bg-blue-500/25 border-blue-400 text-blue-200'
                      : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  🧬 AlphaFold pLDDT
                </button>
              )}
              <button
                type="button"
                onClick={() => setColorMode('cryoem')}
                className={`px-2 py-0.5 rounded-lg text-[8.5px] font-mono font-bold uppercase border cursor-pointer ${
                  colorMode === 'cryoem'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                🔬 Cryo-EM
              </button>
              <button
                type="button"
                onClick={() => setColorMode('goodsell')}
                className={`px-2 py-0.5 rounded-lg text-[8.5px] font-mono font-bold uppercase border cursor-pointer ${
                  colorMode === 'goodsell'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-[#080d18] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                🎨 Goodsell
              </button>
            </div>

            {afData && colorMode === 'plddt' && (
              <div className="px-2 py-0.5 rounded bg-black/70 border border-white/10 flex items-center gap-2 text-[8px] font-mono text-slate-300">
                <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-[#0053d6] inline-block" />&gt;90</span>
                <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-[#65cbf3] inline-block" />70-90</span>
                <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-[#ffdb13] inline-block" />50-70</span>
                <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-[#ff7d45] inline-block" />&lt;50</span>
              </div>
            )}
          </div>

          {/* Live Central Dogma Codon Tape Overlay */}
          {synthesisState ? (
            <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-[#0b1426]/95 border border-cyan-400/60 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-300 font-bold uppercase">{synthesisState.phase}</span>
              </div>
              {synthesisState.isProtein ? (
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-purple-200">
                    mRNA: <strong>{synthesisState.pSiteCodon}</strong>
                  </span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-200">
                    tRNA: {synthesisState.tRnaAnticodon}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold">
                    +{synthesisState.currentAminoAcid}
                  </span>
                </div>
              ) : (
                <span className="font-mono text-[10px] text-emerald-300">
                  Direct Enzymatic Self-Assembly
                </span>
              )}
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 max-w-md px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[9.5px] text-slate-300 pointer-events-none">
              {molecule.role || molecule.description}
            </div>
          )}
        </div>

        {/* Right Telemetry & Confocal Panel */}
        <div className="col-span-12 lg:col-span-4 min-h-[340px]">
          <ChamberTelemetryScreen
            title={afData ? `${molecule.name} (${afData.uniprotId})` : molecule.name}
            organType={molecule.id === 'ion_channel' ? 'brain' : molecule.id === 'collagen_i' ? 'bone' : 'heart'}
            accentColor={molecule.color}
            isRunning={isSynthesizing}
            isComplete={effectivelyBuilt}
            progress={foldPct}
            elapsedSec={0}
            o2Level={ribosomeDial}
            morphogenLevel={chaperoneDial}
            tempC={tempC}
            phLevel={phLevel}
            purityGrade={purityGrade}
            activeTags={components.map((c) => c.symbol)}
            steps={[
              {
                id: 'precursors',
                label: '01 Precursors',
                progress: effectivelyBuilt ? 100 : (loadedIds.length / Math.max(1, components.length)) * 100,
                active: !effectivelyBuilt && !allLoaded,
                done: effectivelyBuilt || allLoaded,
                color: '#38bdf8',
              },
              {
                id: 'transcribe',
                label: '02 Transcription',
                progress: effectivelyBuilt ? 100 : Math.min(100, (foldPct / 40) * 100),
                active: isSynthesizing && foldPct < 40,
                done: effectivelyBuilt || foldPct >= 40,
                color: '#a855f7',
              },
              {
                id: 'translate',
                label: '03 80S Translation',
                progress: effectivelyBuilt ? 100 : Math.max(0, Math.min(100, ((foldPct - 40) / 40) * 100)),
                active: isSynthesizing && foldPct >= 40 && foldPct < 80,
                done: effectivelyBuilt || foldPct >= 80,
                color: '#f59e0b',
              },
              {
                id: 'fold',
                label: afData ? '04 AlphaFold 3D' : '04 Native Fold',
                progress: effectivelyBuilt ? 100 : Math.max(0, Math.min(100, ((foldPct - 80) / 20) * 100)),
                active: isSynthesizing && foldPct >= 80 && foldPct < 100,
                done: effectivelyBuilt,
                color: '#10b981',
              },
            ]}
          />
        </div>
      </div>

      {/* Bottom 3-Bay Reactor Control Console */}
      <ReactorControlPanel
        deckTitle={`RIBOSOMAL SYNTHESIS & ALPHAFOLD FOLDING // ${molecule.name.toUpperCase()}`}
        annunciators={annunciators}
        elements={components}
        elementLevels={elementLevels}
        onInfuseElement={handleInfuseSub}
        onPrimeAll={handlePrimeAll}
        dials={
          <>
            <RotaryDial
              label="Chaperones"
              value={chaperoneDial}
              min={0}
              max={100}
              optimalMin={45}
              optimalMax={90}
              unit="%"
              accent="#38bdf8"
              onChange={setChaperoneDial}
            />
            <RotaryDial
              label="80S Rate"
              value={ribosomeDial}
              min={5}
              max={40}
              optimalMin={16}
              optimalMax={28}
              unit="aa/s"
              accent="#a855f7"
              onChange={setRibosomeDial}
            />
            <RotaryDial
              label="Temp"
              value={tempC}
              min={30}
              max={43}
              step={0.5}
              optimalMin={35.5}
              optimalMax={38.5}
              unit="°C"
              accent="#f59e0b"
              onChange={setTempC}
            />
            <RotaryDial
              label="pH Buffer"
              value={phLevel}
              min={6.5}
              max={8.0}
              step={0.1}
              optimalMin={7.2}
              optimalMax={7.6}
              unit=""
              accent="#10b981"
              onChange={setPhLevel}
            />
          </>
        }
        rightAction={
          <>
            {effectivelyBuilt && (
              <button
                type="button"
                onClick={() => {
                  setRegrowingByMol((p) => ({ ...p, [molecule.id]: true }));
                  setFoldByMol((p) => ({ ...p, [molecule.id]: 0 }));
                  setLoadedByMol((p) => ({ ...p, [molecule.id]: [] }));
                }}
                className="px-2.5 py-1 rounded bg-[#0f172a] hover:bg-slate-800 border border-slate-600 text-slate-300 font-mono font-bold text-[9px] uppercase cursor-pointer"
              >
                ↻ Refold
              </button>
            )}
            {onNextStage && (
              <button
                type="button"
                onClick={onNextStage}
                className="px-2.5 py-1 rounded bg-[#0f172a] border border-cyan-400/50 text-cyan-200 font-mono font-bold text-[9px] uppercase cursor-pointer"
              >
                ⚙️ Organelles →
              </button>
            )}
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <BreakerButton
            label={
              effectivelyBuilt
                ? 'Folded 100%'
                : isSynthesizing
                ? `Folding ${Math.round(foldPct)}%`
                : TIER_4_FOLDED_PROTEINS[molecule.id]
                ? '▶ Translate & Fold'
                : '▶ Synthesize'
            }
            sublabel={allLoaded ? 'Precursors Ready' : 'Click Substrates'}
            active={isSynthesizing || effectivelyBuilt}
            disabled={!allLoaded || effectivelyBuilt || isSynthesizing}
            ledColor="#10b981"
            onClick={handleStartSynthesis}
          />
          <div className="hidden xl:flex items-center gap-1.5">
            <AnalogMeter label="Fold" value={foldPct} accent="#10b981" />
          </div>
        </div>
      </ReactorControlPanel>
    </div>
  );
};

export default ProteinSynthesisStudio;
