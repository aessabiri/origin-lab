import React, { useState, useMemo } from 'react';
import { useBioStore } from '../store';
import { useStore } from '../../store';
import { PARTICLE_TYPES, PARTICLE_COLORS } from '../../constants/particles';
import ParticleIcon from '../../particle-lab/components/ParticleIcon.jsx';

const ORGANELLE_COSTS = {
  [PARTICLE_TYPES.NUCLEUS]: { energy: 50, bmr: 0.5, name: 'Nucleus', limit: 1, desc: 'Enables complex behavior & large size.' },
  [PARTICLE_TYPES.MITOCHONDRION]: { energy: 20, bmr: 0.2, name: 'Mitochondrion', limit: 5, desc: 'Boosts speed and energy recovery.' },
  [PARTICLE_TYPES.RIBOSOME]: { energy: 5, bmr: 0.05, name: 'Ribosome', limit: 20, desc: 'Increases growth rate.' },
  [PARTICLE_TYPES.MEMBRANE]: { energy: 10, bmr: 0.1, name: 'Vacuole', limit: 3, desc: 'Increases cell storage capacity.' },
  // Custom type for game logic, mapping to a visual if needed
  'CHLOROPLAST': { energy: 25, bmr: 0.1, name: 'Chloroplast', limit: 5, desc: 'Enables photosynthesis (Energy from light).', iconType: PARTICLE_TYPES.GLUCOSE } 
};

const CellCreator = ({ onClose }) => {
  const { addAgent } = useBioStore();
  const { discoveredOrganelles, isSandboxMode } = useStore();

  // State
  const [name, setName] = useState('New Organism');
  const [color, setColor] = useState('#4ade80');
  const [placedOrganelles, setPlacedOrganelles] = useState([]);

  // Available Organelles (Filtered by discovery)
  const availableOrganelles = useMemo(() => {
    const all = [
      { type: PARTICLE_TYPES.NUCLEUS },
      { type: PARTICLE_TYPES.MITOCHONDRION },
      { type: PARTICLE_TYPES.RIBOSOME },
      { type: PARTICLE_TYPES.MEMBRANE },
      { type: 'CHLOROPLAST' },
    ];
    
    if (isSandboxMode) return all;

    return all.filter(o => 
      o.type === 'CHLOROPLAST' ? true : // Always allow simple phototrophs? Or link to something?
      discoveredOrganelles.some(d => d.type === o.type)
    );
  }, [discoveredOrganelles, isSandboxMode]);

  const stats = useMemo(() => {
    let speed = 1.0;
    let size = 10;
    let sense = 50;
    let diet = 0; // 0: Herbivore, 2: Phototroph
    let bmr = 0.1; // Base existence cost

    const counts = {};

    placedOrganelles.forEach(o => {
      const type = o.type;
      counts[type] = (counts[type] || 0) + 1;

      if (type === PARTICLE_TYPES.NUCLEUS) {
        size += 10;
        sense += 100;
        bmr += ORGANELLE_COSTS[type].bmr;
      } else if (type === PARTICLE_TYPES.MITOCHONDRION) {
        speed += 1.5;
        bmr += ORGANELLE_COSTS[type].bmr;
      } else if (type === PARTICLE_TYPES.RIBOSOME) {
        bmr += ORGANELLE_COSTS[type].bmr;
        // Growth rate logic would go here
      } else if (type === PARTICLE_TYPES.MEMBRANE) { // Vacuole
        size += 5;
        bmr += ORGANELLE_COSTS[type].bmr;
      } else if (type === 'CHLOROPLAST') {
        diet = 2; // Phototroph
        bmr += ORGANELLE_COSTS[type].bmr;
      }
    });

    // Penalties for size
    speed = Math.max(0.5, speed - (size * 0.05));

    return { speed, size, sense, diet, bmr: parseFloat(bmr.toFixed(2)) };
  }, [placedOrganelles]);

  const handleAddOrganelle = (type) => {
    const config = ORGANELLE_COSTS[type];
    const currentCount = placedOrganelles.filter(o => o.type === type).length;
    
    if (currentCount >= config.limit) return;

    setPlacedOrganelles([...placedOrganelles, {
      id: Date.now() + Math.random(),
      type,
      x: (Math.random() - 0.5) * 40, // Random placement in cytoplasm
      y: (Math.random() - 0.5) * 40,
    }]);
  };

  const handleRemoveOrganelle = (id) => {
    setPlacedOrganelles(placedOrganelles.filter(o => o.id !== id));
  };

  const handleCreate = () => {
    const hasNucleus = placedOrganelles.some(o => o.type === PARTICLE_TYPES.NUCLEUS);
    
    const newAgent = {
      id: `agent-${Date.now()}`,
      name,
      x: 400 + (Math.random() - 0.5) * 100,
      y: 300 + (Math.random() - 0.5) * 100,
      vx: 0,
      vy: 0,
      radius: stats.size,
      color: color,
      energy: 100 + stats.size * 5,
      genome: {
        speed: stats.speed,
        metabolism: stats.bmr,
        diet: stats.diet,
        sense: stats.sense,
        resistance: 0,
        isEukaryote: hasNucleus,
        organelles: placedOrganelles.map(o => o.type)
      }
    };

    addAgent(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Left: Palette */}
        <div className="w-1/4 bg-slate-950 border-r border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
          <h3 className="text-teal-400 font-bold uppercase text-sm tracking-wider">Organelles</h3>
          {availableOrganelles.map(({ type }) => {
            const config = ORGANELLE_COSTS[type];
            const count = placedOrganelles.filter(o => o.type === type).length;
            const disabled = count >= config.limit;

            return (
              <button
                key={type}
                onClick={() => handleAddOrganelle(type)}
                disabled={disabled}
                className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                  disabled 
                    ? 'border-slate-800 bg-slate-900 opacity-50 cursor-not-allowed' 
                    : 'border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-teal-500'
                }`}
              >
                <div className="w-8 h-8 relative">
                   <ParticleIcon type={config.iconType || type} color={PARTICLE_COLORS[config.iconType || type] || 'bg-white'} />
                </div>
                <div className="text-left">
                  <p className="text-slate-200 font-bold text-sm">{config.name}</p>
                  <p className="text-slate-500 text-xs">{count}/{config.limit}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center: Preview */}
        <div className="flex-1 bg-slate-900 relative flex flex-col items-center justify-center">
          <div className="absolute top-4 text-center">
             <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="bg-transparent text-center text-2xl font-bold text-white focus:outline-none border-b border-transparent focus:border-teal-500 pb-1"
              />
          </div>

          <div 
            className="relative rounded-full transition-all duration-500 ease-out flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.2)]"
            style={{ 
              width: `${stats.size * 10}px`, 
              height: `${stats.size * 10}px`,
              backgroundColor: color,
              opacity: 0.8
            }}
          >
            {/* Cell Membrane Visual */}
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            
            {/* Placed Organelles */}
            {placedOrganelles.map((o, i) => (
              <div
                key={o.id}
                onClick={() => handleRemoveOrganelle(o.id)}
                className="absolute w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `calc(50% + ${o.x}px - 16px)`,
                  top: `calc(50% + ${o.y}px - 16px)`,
                }}
              >
                 <ParticleIcon type={ORGANELLE_COSTS[o.type].iconType || o.type} color={PARTICLE_COLORS[ORGANELLE_COSTS[o.type].iconType || o.type] || 'bg-white'} />
              </div>
            ))}
          </div>

          <div className="absolute bottom-8 flex items-center gap-4">
            <label className="text-xs text-slate-400 font-bold uppercase">Cytoplasm Color</label>
            <input 
              type="color" 
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
            />
          </div>
        </div>

        {/* Right: Stats */}
        <div className="w-1/4 bg-slate-950 border-l border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-teal-400 font-bold uppercase text-sm tracking-wider mb-6">Organism Stats</h3>
            
            <div className="space-y-4">
              <StatRow label="Metabolic Cost" value={stats.bmr} unit="/tick" bad={stats.bmr > 2} />
              <StatRow label="Speed" value={stats.speed.toFixed(1)} unit="μm/t" />
              <StatRow label="Size" value={stats.size} unit="μm" />
              <StatRow label="Sensor Range" value={stats.sense} unit="px" />
              <StatRow label="Diet" value={stats.diet === 2 ? 'Phototroph' : (stats.diet === 1 ? 'Carnivore' : 'Herbivore')} />
              <StatRow label="Type" value={stats.size > 20 ? 'Eukaryote' : 'Prokaryote'} />
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="w-full py-4 rounded-xl font-bold text-lg bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-transform active:scale-95"
          >
            Spawn Life
          </button>
        </div>

      </div>
    </div>
  );
};

const StatRow = ({ label, value, unit, bad }) => (
  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
    <span className="text-slate-400 text-xs font-bold uppercase">{label}</span>
    <span className={`font-mono ${bad ? 'text-red-400' : 'text-slate-200'}`}>
      {value} <span className="text-slate-600 text-xs">{unit}</span>
    </span>
  </div>
);

export default CellCreator;
