import React, { useState, useMemo } from 'react';
import { useBioStore } from '../store';
import { useStore } from '../../store';
import { PARTICLE_TYPES } from '../../constants/particles';

const CellCreator = ({ onClose }) => {
  const { addAgent } = useBioStore();
  const { discoveredOrganelles, isSandboxMode } = useStore();

  const hasNucleus = useMemo(() => isSandboxMode || discoveredOrganelles.some(o => o.type === PARTICLE_TYPES.NUCLEUS), [discoveredOrganelles, isSandboxMode]);
  const hasMitochondria = useMemo(() => isSandboxMode || discoveredOrganelles.some(o => o.type === PARTICLE_TYPES.MITOCHONDRION), [discoveredOrganelles, isSandboxMode]);
  
  // Genome State
  const [name, setName] = useState(hasNucleus ? 'Eukaryote-1' : 'Prokaryote-1');
  const [diet, setDiet] = useState(0); // 0: Herbivore, 1: Carnivore, 2: Phototroph
  const [speed, setSpeed] = useState(1.0);
  const [size, setSize] = useState(10);
  const [sense, setSense] = useState(100);
  const [color, setColor] = useState('#4ade80');

  // Constraints
  const maxSpeed = hasMitochondria ? 5 : 2;
  const maxSize = hasNucleus ? 40 : 15;
  const maxSense = hasNucleus ? 400 : 150;

  // Calculate Cost (Basal Metabolic Rate)
  const bmr = useMemo(() => {
    let cost = 0;
    cost += size * size * 0.0005; // Square-Cube law approximation
    cost += speed * 0.05;         // Movement is expensive
    cost += sense * 0.001;        // Neural/Sensing cost
    if (diet === 1) cost *= 1.2; // Carnivores burn faster
    if (diet === 2) cost *= 0.8; // Plants are efficient but passive
    return parseFloat(cost.toFixed(2));
  }, [size, speed, sense, diet]);

  const handleCreate = () => {
    const newAgent = {
      id: `agent-${Date.now()}`,
      name,
      x: 400 + (Math.random() - 0.5) * 100,
      y: 300 + (Math.random() - 0.5) * 100,
      vx: 0,
      vy: 0,
      radius: size,
      color: color,
      energy: 100 + size * 5, // Bigger cells start with more buffer
      genome: {
        speed,
        metabolism: bmr, // Store the BMR as the 'metabolism' factor
        diet,
        sense,
        resistance: 0,
        isEukaryote: hasNucleus
      }
    };

    addAgent(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-teal-900 border border-teal-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-teal-800 bg-teal-950 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Genome Editor</h2>
            <p className="text-teal-400 text-sm">
              {hasNucleus ? 'Designing Eukaryotic Life' : 'Designing Prokaryotic Life'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-teal-500 uppercase font-bold">Metabolic Cost</p>
            <p className={`text-2xl font-mono font-bold ${bmr > 5 ? 'text-red-400' : 'text-green-400'}`}>
              {bmr} <span className="text-sm text-teal-600">/ tick</span>
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Unlocked Alerts */}
          {(!hasNucleus || !hasMitochondria) && (
            <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg text-xs text-amber-200">
              <span className="font-bold">🔒 Evolution Limited:</span> Discover organelles in the Particle Lab to unlock advanced cellular traits.
              {!hasNucleus && <div>• Nucleus needed for large size and advanced sensing.</div>}
              {!hasMitochondria && <div>• Mitochondria needed for high burst speeds.</div>}
            </div>
          )}

          {/* Identity */}
          <div>
            <label className="block text-teal-300 text-xs font-bold uppercase mb-2">Species Name & Color</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="flex-1 bg-teal-950 border border-teal-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <input 
                type="color" 
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-12 h-12 bg-transparent border-none cursor-pointer"
              />
            </div>
          </div>

          {/* Diet Strategy */}
          <div>
            <label className="block text-teal-300 text-xs font-bold uppercase mb-2">Diet Strategy</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => { setDiet(0); setColor('#4ade80'); }}
                className={`py-3 rounded-lg border-2 font-bold text-sm transition-all ${diet === 0 ? 'bg-green-900/50 border-green-500 text-green-400' : 'border-teal-800 text-teal-600'}`}
              >
                🌿 Herbivore
              </button>
              <button 
                onClick={() => { setDiet(1); setColor('#f87171'); }}
                className={`py-3 rounded-lg border-2 font-bold text-sm transition-all ${diet === 1 ? 'bg-red-900/50 border-red-500 text-red-400' : 'border-teal-800 text-teal-600'}`}
              >
                🥩 Carnivore
              </button>
              <button 
                onClick={() => { setDiet(2); setColor('#facc15'); }}
                className={`py-3 rounded-lg border-2 font-bold text-sm transition-all ${diet === 2 ? 'bg-yellow-900/50 border-yellow-500 text-yellow-400' : 'border-teal-800 text-teal-600'}`}
              >
                ☀️ Phototroph
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 bg-teal-950/30 p-4 rounded-xl border border-teal-800/50">
            <GenomeSlider label="Speed" value={speed} min={0.1} max={maxSpeed} step={0.1} set={setSpeed} unit="μm/t" locked={!hasMitochondria} />
            <GenomeSlider label="Size" value={size} min={5} max={maxSize} step={1} set={setSize} unit="μm" locked={!hasNucleus} />
            <GenomeSlider label="Sensor Range" value={sense} min={50} max={maxSense} step={10} set={setSense} unit="px" locked={!hasNucleus} />
          </div>

          {/* Spawn Button */}
          <button
            onClick={handleCreate}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/20 transition-transform active:scale-95"
          >
            SPAWN ORGANISM
          </button>
        </div>
      </div>
    </div>
  );
};

const GenomeSlider = ({ label, value, min, max, step, set, unit, locked }) => (
  <div>
    <div className="flex justify-between mb-1">
      <label className="text-teal-300 text-xs font-bold uppercase flex items-center gap-1">
        {label}
        {locked && value >= max && <span title="Further evolution requires organelle discovery">🔒</span>}
      </label>
      <span className="text-white font-mono text-xs">{value} {unit}</span>
    </div>
    <input 
      type="range" 
      min={min} max={max} step={step} 
      value={value} 
      onChange={e => set(parseFloat(e.target.value))}
      className="w-full h-2 bg-teal-900 rounded-lg appearance-none cursor-pointer accent-teal-500"
    />
  </div>
);

export default CellCreator;
