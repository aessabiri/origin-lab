import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProgressionStore } from './progressionStore.js';

export const INITIAL_CLADOGRAM = [
  {
    id: 'luca',
    name: 'LUCA Primordialis',
    commonName: 'Primordial Ancestor',
    parentId: null,
    era: 'ARCHEAN',
    unlocked: true,
    extinct: false,
    biomassShare: 100,
    trophicRole: 'Chemotroph / Phototroph',
    innovation: 'Membrane compartmentalization & RNA translation',
    eq: 0.0,
    cognitiveScore: 0.0,
    description: 'The Last Universal Common Ancestor, thriving in hydrothermal alkaline vent chimneys.'
  },
  {
    id: 'cyanobacteria',
    name: 'Proto-Cyanobacteria',
    commonName: 'Cyanobacteria',
    parentId: 'luca',
    era: 'ARCHEAN',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Photoautotroph',
    innovation: 'Oxygenic Photosynthesis (Water Oxidation)',
    eq: 0.0,
    cognitiveScore: 0.0,
    description: 'Pioneered split of H2O into O2, establishing the photosynthetic foundation of Earth.'
  },
  {
    id: 'archaea',
    name: 'Methanogenic Archaea',
    commonName: 'Extremophile Archaea',
    parentId: 'luca',
    era: 'ARCHEAN',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Chemolithoautotroph',
    innovation: 'Ether-lipid membranes & Methanogenesis',
    eq: 0.0,
    cognitiveScore: 0.0,
    description: 'Extremophiles colonizing hydrothermal abyssal rifts with hyper-thermal stability.'
  },
  {
    id: 'eukaryota',
    name: 'Eukaryota Primaria',
    commonName: 'First Protist',
    parentId: 'archaea',
    era: 'PROTEROZOIC',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Mixotroph',
    innovation: 'Mitochondrial Endosymbiosis & Nuclear Envelope',
    eq: 0.05,
    cognitiveScore: 5.0,
    description: 'Asgard archaeon engulfs alphaproteobacteria, yielding cellular energy multiplication.'
  },
  {
    id: 'ediacaran',
    name: 'Ediacaran Biota',
    commonName: 'Vendian Metazoan',
    parentId: 'eukaryota',
    era: 'PROTEROZOIC',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Detritivore / Filter Feeder',
    innovation: 'Multicellular Tissue & Extracellular Matrix',
    eq: 0.1,
    cognitiveScore: 12.0,
    description: 'Quilted frond-like macro-organisms carpeting the anoxic seafloor without hard shells.'
  },
  {
    id: 'cambrian',
    name: 'Cambrian Metazoa',
    commonName: 'Trilobites & Anomalocaris',
    parentId: 'ediacaran',
    era: 'PHANEROZOIC',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Apex Predator / Herbivore',
    innovation: 'Bilateral Symmetry, Compound Eyes & Exoskeleton',
    eq: 0.25,
    cognitiveScore: 25.0,
    description: 'Rapid explosive radiation of arthropods, sensory optics, and active hunting arms race.'
  },
  {
    id: 'chordata',
    name: 'Pikaia / Early Chordates',
    commonName: 'First Vertebrate',
    parentId: 'cambrian',
    era: 'PHANEROZOIC',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Filter / Swimmer',
    innovation: 'Notochord, Dorsal Nerve Cord & Tripartite Brain',
    eq: 0.45,
    cognitiveScore: 40.0,
    description: 'Proto-vertebrate ancestral lineage with segmented myomeres and dorsal nerve tube.'
  },
  {
    id: 'tetrapoda',
    name: 'Tiktaalik Roseae',
    commonName: 'Devonian Tetrapod',
    parentId: 'chordata',
    era: 'PHANEROZOIC',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Amphibious Carnivore',
    innovation: 'Limb Joints, Ribs & Atmospheric Lung Respiration',
    eq: 0.9,
    cognitiveScore: 55.0,
    description: 'Transition of vertebrate life from shallows onto barren terrestrial continents.'
  },
  {
    id: 'mammalia',
    name: 'Cynodontia / Morganucodon',
    commonName: 'Primordial Mammal',
    parentId: 'tetrapoda',
    era: 'PHANEROZOIC',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Nocturnal Insectivore',
    innovation: 'Endothermy, Limbic Cortex & Auditory Ossicles',
    eq: 1.8,
    cognitiveScore: 72.0,
    description: 'Nocturnal survival specialist with acute acoustic processing and parental care.'
  },
  {
    id: 'primates',
    name: 'Prosimian & Hominoid',
    commonName: 'Arboreal Primate',
    parentId: 'mammalia',
    era: 'PHANEROZOIC',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Frugivore / Omnivore',
    innovation: 'Stereoscopic Vision, Opposable Grasp & Prefrontal Expansion',
    eq: 3.5,
    cognitiveScore: 86.0,
    description: 'Canopy navigators developing social hierarchies, spatial mapping, and tool manipulation.'
  },
  {
    id: 'hominini',
    name: 'Homo sapiens Primordialis',
    commonName: 'Conscious Sapiens',
    parentId: 'primates',
    era: 'ANTHROPOCENE',
    unlocked: false,
    extinct: false,
    biomassShare: 0,
    trophicRole: 'Planetary Steward / Tool Synthesizer',
    innovation: 'Symbolic Language, Abstract Metacognition & Technosphere',
    eq: 7.5,
    cognitiveScore: 100.0,
    description: 'Sapience milestone achieved. The universe awakens to perceive and understand itself.'
  }
];

export const usePlanetaryStore = create(
  persist(
    (set, get) => ({
      // --- Planetary Physics & Stats ---
      temperature: 288, // Kelvin (15°C) - Standard Earth
      atmosphere: {
        nitrogen: 78,
        oxygen: 21,
        co2: 0.04,
        methane: 0.0001,
      },
      seaLevel: 0, // Meters relative to baseline
      ph: 8.1, // Ocean pH

      // --- Planetary Ecology & Phylogeny ---
      seededOrganism: null, // LUCA prototype details
      species: [], // Array of evolved species
      cladogram: INITIAL_CLADOGRAM, // Deep phylogenetic tree
      ecoMetrics: {
        biodiversityIndex: 0,
        oxygenationLevel: 0,
        globalBiomass: 0,
        cephalizationIndex: 0.0, // EQ (Encephalization Quotient)
        cognitiveComplexity: 0,  // 0 - 100%
        surfaceUVFlux: 85,       // % UV penetrating to surface
        fossilRecord: [],
      },
      events: [], // Historical timeline of planetary milestones

      // --- Active Catastrophes & FX ---
      activeCatastrophe: null, // { type, label, duration, icon }
      catastropheCooldowns: {
        SUPERVOLCANO: 0,
        ASTEROID_IMPACT: 0,
        SOLAR_SUPERFLARE: 0,
        GLACIATION: 0,
        GEOENGINEERING: 0
      },

      // --- Simulation State ---
      era: 'HADEAN', // HADEAN -> ARCHEAN -> PROTEROZOIC -> PHANEROZOIC -> ANTHROPOCENE
      population: 0, // Global biomass (legacy compat)
      
      // --- Actions ---
      seedPlanet: (organism) => set(state => {
        const isPhototroph = Boolean(organism?.traits?.phototroph || organism?.genome?.diet === 2);

        const initialCladogram = INITIAL_CLADOGRAM.map(node => 
          node.id === 'luca' 
            ? { ...node, name: organism?.name || node.name, unlocked: true }
            : { ...node, unlocked: false }
        );

        return {
          seededOrganism: organism,
          species: [organism],
          cladogram: initialCladogram,
          era: state.era === 'HADEAN' ? 'ARCHEAN' : state.era,
          ecoMetrics: {
            ...state.ecoMetrics,
            biodiversityIndex: 1,
            oxygenationLevel: isPhototroph ? 5 : 0,
            globalBiomass: 1,
            cephalizationIndex: 0.0,
            cognitiveComplexity: 0,
            surfaceUVFlux: 80,
            fossilRecord: [{ 
              name: organism?.name || 'LUCA Primordialis', 
              timestamp: Date.now(), 
              impact: 'First Self-Replicating Proto-Lineage Seeded' 
            }],
          },
          events: [
            ...state.events, 
            { type: `Biosphere Seeded: ${organism?.name || 'LUCA'}`, timestamp: Date.now() }
          ]
        };
      }),

      evolveStep: (deltaTime = 1, playerInterventions = {}) => set(state => {
        if (!state.seededOrganism) return state;

        // 1. Thermal & Ocean Chemistry Habitability Curve
        const tempK = state.temperature;
        const tempHabitability = (tempK >= 260 && tempK <= 350) 
          ? 1.0 - Math.abs(tempK - 288) / 150 
          : Math.max(0.05, 1 - Math.abs(tempK - 288) / 100);

        // Ocean pH buffering: high CO2 drives carbonic acid formation (ocean acidification)
        const targetPH = 8.2 - Math.min(2.5, state.atmosphere.co2 * 0.4);
        const newPH = Math.max(5.5, Math.min(9.0, state.ph + (targetPH - state.ph) * 0.05 * deltaTime));
        const phHabitability = (newPH >= 7.3 && newPH <= 8.5) ? 1.0 : Math.max(0.1, 1 - Math.abs(newPH - 8.1) * 0.5);

        // Combined ecological growth factor
        const ecoFactor = Math.max(0.05, tempHabitability * phHabitability);

        // 2. Atmospheric Carbon-Oxygen Cycle
        const hasPhototroph = state.species.some(s => s.traits?.phototroph) || state.cladogram.some(n => n.unlocked && n.trophicRole.includes('Photo'));
        let newO2 = state.atmosphere.oxygen;
        let newCO2 = state.atmosphere.co2;

        if (hasPhototroph && state.atmosphere.co2 > 0.005) {
          const conversion = deltaTime * 0.08 * ecoFactor;
          newO2 = Math.min(25, newO2 + conversion);
          newCO2 = Math.max(0.01, newCO2 - conversion * 0.4);
        }

        // Ozone formation reduces surface UV radiation as O2 expands
        const newUVFlux = Math.max(5, Math.round(90 - (newO2 / 21) * 85));

        // Biomass growth using logistic carrying capacity
        const carryingCapacity = Math.max(100, 1500 * ecoFactor * (newO2 / 21));
        const currentBiomass = state.ecoMetrics.globalBiomass;
        const biomassDelta = deltaTime * 0.45 * ecoFactor * (1 - currentBiomass / (carryingCapacity + 10));
        const newBiomass = Math.max(0.1, currentBiomass + biomassDelta);

        // 3. Phylogenetic Cladogram Unlocking & Speciation
        let newCladogram = [...state.cladogram];
        let newSpecies = [...state.species];
        let newEvents = [...state.events];
        let newEra = state.era;
        let newFossilRecord = [...(state.ecoMetrics.fossilRecord || [])];

        const unlockClade = (id, eventMsg) => {
          const idx = newCladogram.findIndex(n => n.id === id);
          if (idx !== -1 && !newCladogram[idx].unlocked) {
            newCladogram[idx] = { ...newCladogram[idx], unlocked: true };
            newEvents.push({ type: eventMsg, timestamp: Date.now() });
            newFossilRecord.push({ name: newCladogram[idx].name, timestamp: Date.now(), impact: newCladogram[idx].innovation });
            
            // Also keep legacy/compact species array in sync
            if (!newSpecies.some(s => s.name === newCladogram[idx].name)) {
              newSpecies.push({
                name: newCladogram[idx].name,
                traits: { 
                  phototroph: newCladogram[idx].trophicRole.includes('Photo'),
                  chemotroph: newCladogram[idx].trophicRole.includes('Chemo'),
                  fitness: Math.min(100, Math.round(75 + newCladogram[idx].cognitiveScore * 0.25))
                },
                originTimestamp: Date.now()
              });
            }
          }
        };

        // Radiations governed by biomass, oxygenation, and era
        if (newBiomass >= 15) {
          unlockClade('cyanobacteria', 'Speciation: Cyanobacteria Oxygenic Photosynthesis');
        }
        if (newBiomass >= 35) {
          unlockClade('archaea', 'Speciation: Hydrothermal Methanogenic Archaea');
        }
        if (newBiomass >= 75 && newO2 >= 1.0) {
          unlockClade('eukaryota', 'Endosymbiosis: First Eukaryotic Protists');
        }
        if (newBiomass >= 120 && newO2 >= 5.0) {
          unlockClade('ediacaran', 'Metazoan Radiation: Ediacaran Multicellular Biota');
        }
        if (newBiomass >= 180 && newO2 >= 12.0) {
          unlockClade('cambrian', 'Cambrian Explosion: Bilateral Symmetry & Sensory Vision');
        }
        if (newBiomass >= 260 && newO2 >= 15.0) {
          unlockClade('chordata', 'Chordate Evolution: Dorsal Nerve Cord & Tripartite Brain');
        }
        if (newBiomass >= 350 && newO2 >= 17.0 && newUVFlux <= 25) {
          unlockClade('tetrapoda', 'Devonian Terrestrial Invasion: Tiktaalik Walks on Land');
        }
        if (newBiomass >= 450 && newO2 >= 18.5) {
          unlockClade('mammalia', 'Mammalian Emergence: Endothermy & Limbic System');
        }
        if (newBiomass >= 550 && newO2 >= 19.5) {
          unlockClade('primates', 'Primate Evolution: Stereoscopic Vision & Prefrontal Expansion');
        }
        if (newBiomass >= 650 && newO2 >= 20.0) {
          unlockClade('hominini', 'Dawn of Consciousness: Homo sapiens & Abstract Metacognition');
        }

        // 4. Era Progression
        if (newO2 > 1.0 && newEra === 'ARCHEAN') {
          newEra = 'PROTEROZOIC';
          newEvents.push({ type: 'Great Oxidation Event (GOE): Diatomic Oxygen Flood', timestamp: Date.now() });
          try { useProgressionStore.getState().completeMilestone('great_oxidation'); } catch (_) {}
        }
        if (newCladogram.find(n => n.id === 'cambrian')?.unlocked && newEra === 'PROTEROZOIC') {
          newEra = 'PHANEROZOIC';
          newEvents.push({ type: 'Phanerozoic Eon: The Age of Complex Visible Animals', timestamp: Date.now() });
          try { useProgressionStore.getState().completeMilestone('cambrian_explosion'); } catch (_) {}
        }
        if (newCladogram.find(n => n.id === 'tetrapoda')?.unlocked) {
          try { useProgressionStore.getState().completeMilestone('terrestrial_invasion'); } catch (_) {}
        }
        if (newCladogram.find(n => n.id === 'mammalia')?.unlocked) {
          try { useProgressionStore.getState().completeMilestone('cephalization'); } catch (_) {}
        }
        if (newCladogram.find(n => n.id === 'hominini')?.unlocked && newEra === 'PHANEROZOIC') {
          newEra = 'ANTHROPOCENE';
          newEvents.push({ type: 'The Anthropocene Epoch: Cosmic Self-Awareness & Technological Civilization', timestamp: Date.now() });
          try { useProgressionStore.getState().completeMilestone('anthropocene'); } catch (_) {}
        }

        // 5. Cephalization & Cognitive Metrics
        const activeNodes = newCladogram.filter(n => n.unlocked && !n.extinct);
        const maxEQ = activeNodes.reduce((max, n) => Math.max(max, n.eq || 0), 0);
        const maxCognitive = activeNodes.reduce((max, n) => Math.max(max, n.cognitiveScore || 0), 0);

        // Decrement active catastrophe if any
        let newCatastrophe = state.activeCatastrophe;
        if (newCatastrophe) {
          const remaining = newCatastrophe.duration - deltaTime;
          newCatastrophe = remaining > 0 ? { ...newCatastrophe, duration: remaining } : null;
        }

        // Decrement catastrophe cooldowns
        const newCooldowns = { ...state.catastropheCooldowns };
        Object.keys(newCooldowns).forEach(k => {
          if (newCooldowns[k] > 0) {
            newCooldowns[k] = Math.max(0, newCooldowns[k] - deltaTime);
          }
        });

        return {
          era: newEra,
          temperature: tempK,
          ph: Number(newPH.toFixed(2)),
          atmosphere: {
            ...state.atmosphere,
            oxygen: Number(newO2.toFixed(3)),
            co2: Number(newCO2.toFixed(4))
          },
          species: newSpecies,
          cladogram: newCladogram,
          events: newEvents,
          activeCatastrophe: newCatastrophe,
          catastropheCooldowns: newCooldowns,
          ecoMetrics: {
            ...state.ecoMetrics,
            globalBiomass: Number(newBiomass.toFixed(2)),
            biodiversityIndex: activeNodes.length,
            oxygenationLevel: Math.round((newO2 / 21) * 100),
            cephalizationIndex: Number(maxEQ.toFixed(2)),
            cognitiveComplexity: Math.round(maxCognitive),
            surfaceUVFlux: newUVFlux,
            fossilRecord: newFossilRecord
          }
        };
      }),

      // --- Interactive Catastrophic Events ---
      triggerCatastrophicEvent: (type) => set(state => {
        if (state.catastropheCooldowns[type] > 0) return state;

        let tempDelta = 0;
        let co2Delta = 0;
        let o2Delta = 0;
        let biomassMultiplier = 1.0;
        let phDelta = 0;
        let eventTitle = '';
        let impactDesc = '';
        let label = '';
        let icon = '⚡';
        let duration = 8;
        let cooldown = 30;

        switch (type) {
          case 'SUPERVOLCANO':
            tempDelta = -18; // Volcanic winter
            co2Delta = 2.5;  // Massive greenhouse degassing
            phDelta = -0.4;  // Acid rain & sulfur acidification
            biomassMultiplier = 0.6; // 40% biomass decimated
            eventTitle = 'Cataclysm: Supervolcano Caldera Collapse';
            impactDesc = '-40% Biomass / Volcanic Winter / Ocean Acidification';
            label = 'Volcanic Ash Shroud';
            icon = '🌋';
            cooldown = 45;
            break;

          case 'ASTEROID_IMPACT':
            tempDelta = -28; // Impact winter & dust shroud
            co2Delta = 1.2;
            phDelta = -0.5;
            biomassMultiplier = 0.25; // 75% mass extinction
            eventTitle = 'Mass Extinction: Chicxulub-Scale Asteroid Kinetic Strike';
            impactDesc = '-75% Biomass / Global Firestorm & Stratospheric Ejecta';
            label = 'Chicxulub Kinetic Strike';
            icon = '☄️';
            cooldown = 60;
            break;

          case 'SOLAR_SUPERFLARE':
            o2Delta = -3.0; // Ozone stripping
            tempDelta = 4;
            biomassMultiplier = 0.75;
            eventTitle = 'Cosmic Event: Carrington-Class Solar Superflare';
            impactDesc = 'Ozone Stripped / Mutagenic Radiation Surge';
            label = 'Ionizing Solar Superflare';
            icon = '☀️';
            cooldown = 40;
            break;

          case 'GLACIATION':
            tempDelta = -35; // Snowball Earth freeze
            co2Delta = -0.02;
            biomassMultiplier = 0.5;
            eventTitle = 'Cryogenian Plunge: Global Snowball Earth Glaciation';
            impactDesc = 'Continental Ice Caps / Albedo Runaway';
            label = 'Cryogenian Glaciation';
            icon = '❄️';
            cooldown = 50;
            break;

          case 'GEOENGINEERING':
            co2Delta = -1.5;
            tempDelta = (288 - state.temperature) * 0.5;
            phDelta = (8.1 - state.ph) * 0.5;
            biomassMultiplier = 1.15;
            eventTitle = 'Anthropocene Stewardship: Planetary Geo-Engineering';
            impactDesc = 'Carbon Sequestration & Atmospheric Equilibrium';
            label = 'Biosphere Geo-Engineering';
            icon = '🌐';
            cooldown = 20;
            break;

          default:
            return state;
        }

        const newTemp = Math.max(220, Math.min(380, state.temperature + tempDelta));
        const newCO2 = Math.max(0.005, state.atmosphere.co2 + co2Delta);
        const newO2 = Math.max(0.01, state.atmosphere.oxygen + o2Delta);
        const newPH = Math.max(5.5, Math.min(9.0, state.ph + phDelta));
        const newBiomass = Math.max(0.1, state.ecoMetrics.globalBiomass * biomassMultiplier);

        const newFossil = [
          ...(state.ecoMetrics.fossilRecord || []),
          { name: eventTitle, timestamp: Date.now(), impact: impactDesc }
        ];

        return {
          temperature: newTemp,
          ph: Number(newPH.toFixed(2)),
          atmosphere: {
            ...state.atmosphere,
            co2: Number(newCO2.toFixed(4)),
            oxygen: Number(newO2.toFixed(3))
          },
          activeCatastrophe: { type, label, duration, icon },
          catastropheCooldowns: {
            ...state.catastropheCooldowns,
            [type]: cooldown
          },
          events: [
            ...state.events,
            { type: eventTitle, timestamp: Date.now() }
          ],
          ecoMetrics: {
            ...state.ecoMetrics,
            globalBiomass: Number(newBiomass.toFixed(2)),
            fossilRecord: newFossil
          }
        };
      }),

      triggerEvent: (type) => set(state => ({
        events: [...state.events, { type, timestamp: Date.now() }]
      })),

      updateAtmosphere: (gas, delta) => set(state => ({
        atmosphere: {
          ...state.atmosphere,
          [gas]: Math.max(0, (state.atmosphere[gas] || 0) + delta)
        }
      })),

      changeTemperature: (delta) => set(state => ({
        temperature: state.temperature + delta
      })),

      setEra: (newEra) => set({ era: newEra }),
      
      resetPlanet: () => set({
        temperature: 288,
        atmosphere: { nitrogen: 78, oxygen: 21, co2: 0.04, methane: 0.0001 },
        seaLevel: 0,
        ph: 8.1,
        seededOrganism: null,
        species: [],
        cladogram: INITIAL_CLADOGRAM,
        activeCatastrophe: null,
        catastropheCooldowns: {
          SUPERVOLCANO: 0,
          ASTEROID_IMPACT: 0,
          SOLAR_SUPERFLARE: 0,
          GLACIATION: 0,
          GEOENGINEERING: 0
        },
        ecoMetrics: {
          biodiversityIndex: 0,
          oxygenationLevel: 0,
          globalBiomass: 0,
          cephalizationIndex: 0.0,
          cognitiveComplexity: 0,
          surfaceUVFlux: 85,
          fossilRecord: [],
        },
        events: [],
        era: 'HADEAN',
        population: 0
      })
    }),
    {
      name: 'origin-lab-planetary',
    }
  )
);
