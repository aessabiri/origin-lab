import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInventory } from './inventory';

export const COSMIC_EPOCHS = [
  {
    id: 'PLANCK_INFLATION',
    name: 'Planck & Inflation',
    minYears: 0,
    maxYears: 0.001,
    tempK: '10³² K',
    color: '#f43f5e',
    description: 'Quantum gravity fluctuations expand exponentially across space-time.'
  },
  {
    id: 'QUARK_GLUON',
    name: 'Quark-Gluon Plasma',
    minYears: 0.001,
    maxYears: 380000,
    tempK: '10¹² K → 3000 K',
    color: '#fb923c',
    description: 'Baryogenesis and primordial nucleosynthesis forge Protons, Neutrons, H, and He.'
  },
  {
    id: 'RECOMBINATION',
    name: 'Recombination (CMB)',
    minYears: 380000,
    maxYears: 100e6,
    tempK: '3,000 K → 60 K',
    color: '#f59e0b',
    description: 'Electrons bind to nuclei; photons decouple as the Cosmic Microwave Background.'
  },
  {
    id: 'COSMIC_DAWN',
    name: 'Cosmic Dawn (Pop III Stars)',
    minYears: 100e6,
    maxYears: 1e9,
    tempK: '30 K',
    color: '#38bdf8',
    description: 'First massive Population III stars ignite, forging Carbon, Oxygen, and Iron.'
  },
  {
    id: 'GALACTIC_NOON',
    name: 'Galactic Noon & Heavy Elements',
    minYears: 1e9,
    maxYears: 9.2e9,
    tempK: '10 K',
    color: '#818cf8',
    description: 'Supernovae and neutron star mergers enrich spiral galaxies with periodic elements.'
  },
  {
    id: 'SOLAR_IGNITION',
    name: 'Proto-Solar Nebula & Hadean Earth',
    minYears: 9.2e9,
    maxYears: 10.0e9,
    tempK: '4.5 K (288 K Local)',
    color: '#10b981',
    description: 'Accretion of Sol and rocky proto-Earth; prebiotic chemistry in hydrothermal vents.'
  },
  {
    id: 'BIOSPHERE_ANTHROPOCENE',
    name: 'Present Cosmic Era (13.8 Ga)',
    minYears: 10.0e9,
    maxYears: 13.8e9,
    tempK: '2.725 K (CMB)',
    color: '#06b6d4',
    description: 'RNA world, LUCA, Cambrian radiation, 206-bone vertebrate biomechanics, and sapience.'
  }
];

export function resolveCosmicEpoch(years) {
  for (let i = COSMIC_EPOCHS.length - 1; i >= 0; i--) {
    if (years >= COSMIC_EPOCHS[i].minYears) {
      return COSMIC_EPOCHS[i];
    }
  }
  return COSMIC_EPOCHS[0];
}

export function formatCosmicAge(years) {
  if (years < 1) {
    const seconds = Math.max(1, Math.round(years * 3.154e7));
    return `T + ${seconds.toLocaleString()} s`;
  }
  if (years < 1e6) {
    return `T + ${(years / 1e3).toFixed(1)} ka`;
  }
  if (years < 1e9) {
    return `T + ${(years / 1e6).toFixed(1)} Ma`;
  }
  return `T + ${(years / 1e9).toFixed(3)} Ga`;
}

export const useCosmicClockStore = create(
  persist(
    (set, get) => ({
      cosmicAgeYears: 380000, // Starts at Recombination (380 ka)
      timeScale: 1, // 0 = Paused, 1 = 1x, 10 = 10x, 100 = 100x
      autoHarvestEnabled: true,
      harvestAccumulator: 0,
      totalTicks: 0,

      // Demiurge Genomic Blueprint compiled from the 3D Anatomy Lab (206 bones + posture)
      compiledGenome: null,

      setTimeScale: (scale) => set({ timeScale: scale }),
      togglePause: () => set((state) => ({ timeScale: state.timeScale === 0 ? 1 : 0 })),
      setCosmicAgeYears: (years) => set({ cosmicAgeYears: Math.max(0, Math.min(13.8e9, years)) }),
      setAutoHarvestEnabled: (enabled) => set({ autoHarvestEnabled: enabled }),

      setCompiledGenome: (genome) => set({ compiledGenome: genome }),

      tickCosmicClock: (deltaSec = 1) => {
        const state = get();
        if (state.timeScale <= 0) return;

        // Logarithmic-adaptive progression so early universe and billions of years both feel alive
        const baseStep = Math.max(25000, state.cosmicAgeYears * 0.0025 + 50000);
        const deltaYears = baseStep * state.timeScale * deltaSec;
        const nextAge = Math.min(13.8e9, state.cosmicAgeYears + deltaYears);
        const nextAcc = state.harvestAccumulator + deltaSec * state.timeScale;

        // Passive primordial nucleosynthesis & stellar dust trickle
        if (state.autoHarvestEnabled && nextAcc >= 3) {
          const inv = useInventory.getState();
          inv.addResource('elements', 'hydrogen', 2);
          inv.addResource('elements', 'helium', 1);
          if (nextAge >= 100e6) {
            inv.addResource('elements', 'carbon', 1);
            inv.addResource('elements', 'oxygen', 1);
          }
          if (nextAge >= 1e9) {
            inv.addResource('elements', 'nitrogen', 1);
          }
          set({
            cosmicAgeYears: nextAge,
            harvestAccumulator: 0,
            totalTicks: state.totalTicks + 1
          });
        } else {
          set({
            cosmicAgeYears: nextAge,
            harvestAccumulator: nextAcc,
            totalTicks: state.totalTicks + 1
          });
        }
      },

      // Zero-friction sandbox booster: seeds all labs with essential elements & compounds
      quickSeedAllLabs: () => {
        const inv = useInventory.getState();
        ['up', 'down', 'Strange', 'Charm'].forEach((q) => inv.addResource('quarks', q.toLowerCase(), 25));
        [
          ['hydrogen', 100],
          ['helium', 50],
          ['lithium', 20],
          ['carbon', 60],
          ['nitrogen', 40],
          ['oxygen', 60],
          ['phosphorus', 30],
          ['sulfur', 25],
          ['iron', 30],
          ['calcium', 20]
        ].forEach(([el, amt]) => inv.addResource('elements', el, amt));
        [
          ['water', 50],
          ['ammonia', 30],
          ['methane', 30],
          ['glucose', 25],
          ['glycine', 20],
          ['alanine', 15],
          ['lipid', 20],
          ['phospholipid', 20],
          ['rna', 10],
          ['dna', 10]
        ].forEach(([comp, amt]) => inv.addResource('compounds', comp, amt));
      }
    }),
    {
      name: 'origin-lab-cosmic-clock'
    }
  )
);
