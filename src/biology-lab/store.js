import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInventory } from '../store/inventory.js';
import { useProgressionStore } from '../store/progressionStore.js';
import { usePlanetaryStore } from '../store/planetaryStore.js';
import {
  LEVEL_2_ORGANELLES,
  TIER_1_ORGAN_SYSTEMS,
  TIER_2_TISSUE_SCAFFOLDS,
  TIER_3_CELL_LINEAGES,
  TIER_4_FOLDED_PROTEINS
} from './data/topDownBioHierarchy.js';

// Initial Resources available in the "Soup"
const INITIAL_SOUP = {
  glucose: 100,
  aminoAcids: 50,
  lipids: 20,
};

export const useBioStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      
      // The Agents (Cells)
      agents: [],
      
      // The Environment
      soup: { ...INITIAL_SOUP },
      foodItems: [],
      toxins: [],
      worldSize: { width: 800, height: 800 },
      environment: {
        temperature: 37.0, // °C
        nutrients: 80,     // %
        radiation: 0,      // %
      },

      // Bioreactor Stress Testing & Environmental Viability Certification
      stressTrial: {
        active: false,
        stage: 'idle', // 'idle' | 'thermal_shock' | 'uv_flux' | 'starvation' | 'complete'
        elapsed: 0,
        totalDuration: 30,
        initialAgents: 0,
        fitnessScore: null,
        certified: false,
        message: 'Awaiting Stress Trial initiation.',
      },
      
      // Simulation Status
      isRunning: false,
      tickRate: 100, // ms per tick
      
      // UI State
      selectedAgentId: null,
      isCellCreatorOpen: false,

      // --- Biotech / Engineering State ---
      unlockedAminoAcids: [],
      synthesizedProteins: [],
      currentCellDesign: {
        membrane: 'phospholipid',
        organelles: [],
        cytoplasm: 'water',
        trophicMode: 'chemotroph' // 'phototroph' | 'chemotroph' | 'heterotroph' | 'omnivore'
      },

      // --- Stage 05: Cambrian Multicellular Morphogenesis Config ---
      morphogenesisConfig: {
        symmetry: 'bilateral',        // 'asymmetric' | 'radial' | 'bilateral'
        germLayers: 'triploblast',    // 'diploblast' | 'triploblast'
        skeleton: 'notochord',        // 'hydrostatic' | 'exoskeleton' | 'notochord' | 'endoskeleton'
        sensory: 'compound_optics',   // 'eyespots' | 'compound_optics' | 'tripartite_brain'
        locomotion: 'paired_fins',    // 'cilia' | 'myomeres' | 'paired_fins' | 'pentadactyl_limbs'
        segments: 7
      },

      // --- Top-Down Precision Synthesis Hierarchy (Tier 5 -> Tier 1) ---
      selectedOrganSystemId: 'cardiovascular_system',
      transcribedGenes: [],     // ['col1a1', 'myh7', 'hbb', 'scn9a', 'atp5f1a']
      foldedProteins: [],       // ['collagen_i', 'actin_myosin', 'hemoglobin', 'ion_channel', 'atp_synthase']
      assembledOrganelleParts: [], // ['nuc_envelope', 'nuc_pores', 'mito_outer', ...]
      assembledOrganelles: [],     // ['nucleus', 'mitochondrion', 'ribosome', 'plasma_membrane']
      differentiatedCells: [],  // ['osteoblast', 'cardiomyocyte', 'hepatocyte', 'endothelial_cell', 'motor_neuron']
      engineeredTissues: [],    // ['osteoid', 'myofibril', 'visceral', 'endothelial', 'neural']
      assembledOrganParts: [],  // ['cardio_ventricles', 'cardio_atria', 'cardio_valves', 'cardio_vessels', ...]

      // --- Actions ---

      setAgents: (agents) => set({ agents }),
      setFoodItems: (foodItems) => set({ foodItems }),
      setToxins: (toxins) => set({ toxins }),
      setWorldSize: (width, height) => set({ worldSize: { width, height } }),
      setEnvironment: (environment) => set((state) => ({
        environment: { ...state.environment, ...environment }
      })),
      
      updateAgent: (id, updates) => set((state) => ({
        agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
      })),

      addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
      
      // Inject the User's Design into the Simulation
      injectLuca: () => set((state) => {
        const design = state.currentCellDesign;
        if (design.organelles.length === 0) return state; // Can't inject empty cell

        // Calculate stats based on organelles
        let speed = 1;
        let metabolism = 0.5;
        let sense = 100;
        
        // Simple stat derivation
        let diet = design.trophicMode === 'phototroph' ? 2 : design.trophicMode === 'omnivore' ? 1 : 0;
        design.organelles.forEach(o => {
           if (o.type === 'mitochondrion') { metabolism += 0.5; speed += 0.5; }
           if (o.type === 'ribosome') { metabolism += 0.2; }
           if (o.type === 'membrane') { sense += 50; }
           if (o.type === 'chloroplast') { metabolism += 0.45; diet = 2; }
           if (o.type === 'flagellum') { speed += 0.9; sense += 30; }
           if (o.type === 'vacuole') { metabolism += 0.15; }
           if (o.type === 'crispr-array') { sense += 40; }
        });

        const luca = {
          id: 'LUCA',
          x: state.worldSize.width / 2, // Center of world
          y: state.worldSize.height / 2,
          vx: 0, 
          vy: 0,
          radius: 15 + (design.organelles.length * 2),
          energy: 220, // Starting energy
          color: diet === 2 ? '#10b981' : diet === 1 ? '#f43f5e' : '#ffffff',
          genome: {
            speed,
            metabolism,
            sense,
            diet,
          },
          design: design // Store the blueprint
        };

        return {
          agents: [luca], // Clear previous and add LUCA
          isRunning: true, // Auto-start
          soup: { ...INITIAL_SOUP } // Reset soup for fair test
        };
      }),

      removeAgent: (id) => set((state) => ({ agents: state.agents.filter(a => a.id !== id) })),

      updateSoup: (updates) => set((state) => ({ soup: { ...state.soup, ...updates } })),

      setIsRunning: (isRunning) => set({ isRunning }),
      
      toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),

      setSelectedAgentId: (id) => set({ selectedAgentId: id }),
      
      setIsCellCreatorOpen: (isOpen) => set({ isCellCreatorOpen: isOpen }),

      // Biotech Actions
      unlockAminoAcid: (id) => set(state => {
         if (state.unlockedAminoAcids.includes(id)) return state;
         return { unlockedAminoAcids: [...state.unlockedAminoAcids, id] };
      }),

      addSynthesizedProtein: (protein) => set(state => {
        const nextFolded = [...(state.foldedProteins || [])];
        const nextGenes = [...(state.transcribedGenes || [])];
        const pName = (protein?.name || '').toLowerCase();
        if (pName.includes('collagen') && !nextFolded.includes('collagen_i')) {
          nextFolded.push('collagen_i');
          if (!nextGenes.includes('col1a1')) nextGenes.push('col1a1');
        } else if ((pName.includes('actin') || pName.includes('myosin')) && !nextFolded.includes('actin_myosin')) {
          nextFolded.push('actin_myosin');
          if (!nextGenes.includes('myh7')) nextGenes.push('myh7');
        } else if (pName.includes('hemoglobin') && !nextFolded.includes('hemoglobin')) {
          nextFolded.push('hemoglobin');
          if (!nextGenes.includes('hbb')) nextGenes.push('hbb');
        } else if ((pName.includes('channel') || pName.includes('nav')) && !nextFolded.includes('ion_channel')) {
          nextFolded.push('ion_channel');
          if (!nextGenes.includes('scn9a')) nextGenes.push('scn9a');
        } else if (pName.includes('atp') && !nextFolded.includes('atp_synthase')) {
          nextFolded.push('atp_synthase');
          if (!nextGenes.includes('atp5f1a')) nextGenes.push('atp5f1a');
        }
        return {
          synthesizedProteins: [...state.synthesizedProteins, protein],
          foldedProteins: nextFolded,
          transcribedGenes: nextGenes
        };
      }),

      addOrganelleToDesign: (organelle) => set(state => {
        if (state.currentCellDesign.organelles.length >= 8) return state;
        return {
          currentCellDesign: {
            ...state.currentCellDesign,
            organelles: [...state.currentCellDesign.organelles, { ...organelle, id: Date.now() + Math.random() }]
          }
        };
      }),

      removeOrganelleFromDesign: (id) => set(state => ({
        currentCellDesign: {
          ...state.currentCellDesign,
          organelles: state.currentCellDesign.organelles.filter(o => o.id !== id)
        }
      })),

      addProteinToDesign: (protein) => set(state => {
        if (state.currentCellDesign.organelles.length >= 8) return state;
        return {
          currentCellDesign: {
            ...state.currentCellDesign,
            organelles: [...state.currentCellDesign.organelles, { ...protein, isProtein: true, id: Date.now() + Math.random() }]
          }
        };
      }),

      updateCellDesign: (update) => set(state => ({
        currentCellDesign: { ...state.currentCellDesign, ...update }
      })),

      autoAssembleOptimalLuca: () => set(state => ({
        currentCellDesign: {
          ...state.currentCellDesign,
          membrane: 'ether_lipid',
          trophicMode: 'phototroph',
          organelles: [
            { id: 'org-mem', type: 'membrane', stats: { metabolism: 5, stability: 30 } },
            { id: 'org-nuc', type: 'nucleus', stats: { metabolism: 10, stability: 50 } },
            { id: 'org-mit', type: 'mitochondrion', stats: { metabolism: 40, stability: 5 } },
            { id: 'org-chl', type: 'chloroplast', stats: { metabolism: 45, stability: 20 } },
            { id: 'org-flg', type: 'flagellum', stats: { metabolism: 20, stability: 15 } },
            { id: 'org-crs', type: 'crispr-array', stats: { metabolism: 15, stability: 45 } }
          ]
        }
      })),

      spawnSpeciatedGuild: () => set(state => {
        const cx = state.worldSize.width / 2;
        const cy = state.worldSize.height / 2;
        const guild = [
          // 4 Cyanobacterial Phototrophs (Green, diet 2)
          ...Array.from({ length: 4 }).map((_, i) => ({
            id: `PHOTO-${Date.now()}-${i}`,
            x: cx + Math.cos(i * 1.5) * 140,
            y: cy + Math.sin(i * 1.5) * 140,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: 17,
            energy: 210,
            color: '#10b981',
            genome: { speed: 1.4, metabolism: 0.7, sense: 130, diet: 2 }
          })),
          // 3 Grazing Herbivores (Cyan, diet 0)
          ...Array.from({ length: 3 }).map((_, i) => ({
            id: `HERB-${Date.now()}-${i}`,
            x: cx + Math.cos(i * 2.1 + 0.5) * 90,
            y: cy + Math.sin(i * 2.1 + 0.5) * 90,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: 19,
            energy: 220,
            color: '#22d3ee',
            genome: { speed: 2.1, metabolism: 0.9, sense: 160, diet: 0 }
          })),
          // 2 Heterotrophic Predators (Rose, diet 1)
          ...Array.from({ length: 2 }).map((_, i) => ({
            id: `APEX-${Date.now()}-${i}`,
            x: cx + (i === 0 ? -60 : 60),
            y: cy,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2.5,
            radius: 22,
            energy: 250,
            color: '#f43f5e',
            genome: { speed: 2.6, metabolism: 1.2, sense: 210, diet: 1 }
          }))
        ];
        return {
          agents: guild,
          isRunning: true,
          soup: { glucose: 160, aminoAcids: 90, lipids: 50 }
        };
      }),

      setMorphogenesisConfig: (updates) => set(state => ({
        morphogenesisConfig: { ...state.morphogenesisConfig, ...updates }
      })),

      // --- Top-Down Precision Actions (Tier 5 DNA -> Tier 4 Protein -> Tier 3 Cell -> Tier 2 Tissue -> Tier 1 Organ) ---
      setSelectedOrganSystemId: (id) => set({ selectedOrganSystemId: id }),

      snapOrganSubPart: (systemId, subPartId) => set((state) => {
        const sys = TIER_1_ORGAN_SYSTEMS.find((s) => s.id === systemId);
        if (!sys) return state;

        const current = state.assembledOrganParts || [];
        const nextParts = current.includes(subPartId) ? current : [...current, subPartId];
        const allSubPartsReady = (sys.subParts || []).every((sp) =>
          nextParts.includes(sp.id)
        );

        const currentTissues = state.engineeredTissues || [];
        const nextTissues =
          allSubPartsReady && !currentTissues.includes(sys.requiredTissue)
            ? [...currentTissues, sys.requiredTissue]
            : currentTissues;

        return {
          assembledOrganParts: nextParts,
          engineeredTissues: nextTissues
        };
      }),

      snapOrganellePart: (organelleId, partId) => set((state) => {
        const orgMeta = LEVEL_2_ORGANELLES[organelleId];
        if (!orgMeta) return state;

        const currentParts = state.assembledOrganelleParts || [];
        const nextParts = currentParts.includes(partId)
          ? currentParts
          : [...currentParts, partId];

        const allOrgPartsReady = orgMeta.parts.every((p) => nextParts.includes(p.id));
        const currentOrgs = state.assembledOrganelles || [];
        const nextOrgs =
          allOrgPartsReady && !currentOrgs.includes(organelleId)
            ? [...currentOrgs, organelleId]
            : currentOrgs;

        // Also ensure it is equipped in currentCellDesign.organelles when completed
        let nextCellDesign = state.currentCellDesign;
        if (allOrgPartsReady) {
          const mappedType = organelleId === 'plasma_membrane' ? 'membrane' : organelleId;
          const alreadyInCell = (state.currentCellDesign?.organelles || []).some(
            (o) => o.type === mappedType
          );
          if (!alreadyInCell) {
            nextCellDesign = {
              ...state.currentCellDesign,
              organelles: [
                ...(state.currentCellDesign?.organelles || []),
                {
                  id: `org-${organelleId}`,
                  type: mappedType,
                  stats: { metabolism: 25, stability: 25 }
                }
              ]
            };
          }
        }

        return {
          assembledOrganelleParts: nextParts,
          assembledOrganelles: nextOrgs,
          currentCellDesign: nextCellDesign
        };
      }),

      assembleCompleteOrganelle: (organelleId) => {
        const orgMeta = LEVEL_2_ORGANELLES[organelleId];
        if (!orgMeta) return;
        orgMeta.parts.forEach((p) => get().snapOrganellePart(organelleId, p.id));
      },

      transcribeAndTranslateGene: (geneId) => set((state) => {
        const current = state.transcribedGenes || [];
        if (current.includes(geneId)) return state;
        try {
          useInventory.getState().addResource('compounds', 'rna', 1);
          useInventory.getState().markDiscovered(`GENE_${geneId.toUpperCase()}`);
        } catch (e) {}
        return { transcribedGenes: [...current, geneId] };
      }),

      foldTopDownProtein: (proteinId) => set((state) => {
        const meta = TIER_4_FOLDED_PROTEINS[proteinId];
        if (!meta) return state;
        const currentGenes = state.transcribedGenes || [];
        const nextGenes = currentGenes.includes(meta.geneId)
          ? currentGenes
          : [...currentGenes, meta.geneId];
        const currentProteins = state.foldedProteins || [];
        const nextProteins = currentProteins.includes(proteinId)
          ? currentProteins
          : [...currentProteins, proteinId];

        try {
          useInventory.getState().markDiscovered(`PROTEIN_${proteinId.toUpperCase()}`);
        } catch (e) {}

        return {
          transcribedGenes: nextGenes,
          foldedProteins: nextProteins
        };
      }),

      differentiateCellLineage: (cellId) => set((state) => {
        const lineage = TIER_3_CELL_LINEAGES[cellId];
        if (!lineage) return state;

        // Ensure prerequisite proteins are folded
        const nextProteins = [...(state.foldedProteins || [])];
        const nextGenes = [...(state.transcribedGenes || [])];
        lineage.requiredProteins.forEach((pid) => {
          if (!nextProteins.includes(pid)) nextProteins.push(pid);
          const gid = TIER_4_FOLDED_PROTEINS[pid]?.geneId;
          if (gid && !nextGenes.includes(gid)) nextGenes.push(gid);
        });

        const currentCells = state.differentiatedCells || [];
        const nextCells = currentCells.includes(cellId)
          ? currentCells
          : [...currentCells, cellId];

        try {
          useInventory.getState().markDiscovered(`CELL_${cellId.toUpperCase()}`);
        } catch (e) {}

        return {
          transcribedGenes: nextGenes,
          foldedProteins: nextProteins,
          differentiatedCells: nextCells
        };
      }),

      bioprintTissueScaffold: (tissueId) => set((state) => {
        const scaffold = TIER_2_TISSUE_SCAFFOLDS[tissueId];
        if (!scaffold) return state;

        const nextProteins = [...(state.foldedProteins || [])];
        const nextGenes = [...(state.transcribedGenes || [])];
        const nextCells = [...(state.differentiatedCells || [])];

        scaffold.requiredProteins.forEach((pid) => {
          if (!nextProteins.includes(pid)) nextProteins.push(pid);
          const gid = TIER_4_FOLDED_PROTEINS[pid]?.geneId;
          if (gid && !nextGenes.includes(gid)) nextGenes.push(gid);
        });
        scaffold.requiredCells.forEach((cid) => {
          if (!nextCells.includes(cid)) nextCells.push(cid);
        });

        const currentTissues = state.engineeredTissues || [];
        const nextTissues = currentTissues.includes(tissueId)
          ? currentTissues
          : [...currentTissues, tissueId];

        try {
          const inv = useInventory.getState();
          Object.entries(scaffold.compounds || {}).forEach(([comp, amt]) => {
            if (inv.elements && comp in inv.elements) {
              inv.addResource('elements', comp, amt);
            } else {
              inv.addResource('compounds', comp, amt);
            }
          });
          inv.markDiscovered(`TISSUE_${tissueId.toUpperCase()}`);
        } catch (e) {}

        return {
          transcribedGenes: nextGenes,
          foldedProteins: nextProteins,
          differentiatedCells: nextCells,
          engineeredTissues: nextTissues
        };
      }),

      synthesizeFullOrganChain: (organSystemId) => {
        const sys =
          TIER_1_ORGAN_SYSTEMS.find((s) => s.id === organSystemId) || TIER_1_ORGAN_SYSTEMS[0];
        const state = get();
        if ((state.currentCellDesign?.organelles || []).length < 4) {
          state.autoAssembleOptimalLuca();
        }
        sys.requiredProteins.forEach((pid) => {
          const gid = TIER_4_FOLDED_PROTEINS[pid]?.geneId;
          if (gid) get().transcribeAndTranslateGene(gid);
          get().foldTopDownProtein(pid);
        });
        sys.requiredCells.forEach((cid) => get().differentiateCellLineage(cid));
        get().bioprintTissueScaffold(sys.requiredTissue);
        return sys.anatomyTissueId;
      },

      // Import from Particle Lab Inventory (Bridge)
      // This will be called when the user "drops" items from the sidebar into the dish
      importResource: (type, amount) => {
        // 1. Determine Category
        let category = 'compounds';
        if (type === 'arsenic' || type === 'hydrogen' || type === 'carbon') { // Basic check
           category = 'elements';
        }

        // 2. Consume from Global Inventory
        const success = useInventory.getState().consumeResource(category, type, amount);
        if (!success) {
           console.warn(`Transfer failed: Insufficient ${type} in Global Inventory.`);
           return;
        }

        set((state) => {
          if (type === 'arsenic') {
             const newToxins = Array.from({ length: amount }).map((_, i) => ({
               id: `toxin-${Date.now()}-${i}`,
               x: 400 + (Math.random() - 0.5) * 400, // Random within dish
               y: 400 + (Math.random() - 0.5) * 400,
               radius: 40, // Toxic Zone
             }));
             return { toxins: [...state.toxins, ...newToxins] };
          }

          // Mapping Particle Types to Bio Resources
          const resourceMap = {
            'glucose': 'glucose',
            'amino_acid': 'aminoAcids', // Generic for now
            'lipid': 'lipids',
          };
          
          const resourceKey = resourceMap[type];
          if (resourceKey) {
            return {
              soup: {
                ...state.soup,
                [resourceKey]: state.soup[resourceKey] + amount
              }
            };
          }
          return state;
        });
      },

      // Stress Trial & Bioreactor Certification Actions
      startStressTrial: () => set(state => {
        const agentCount = state.agents.length;
        if (agentCount === 0) {
          return {
            stressTrial: {
              ...state.stressTrial,
              message: 'No protocells detected. Inject LUCA or build a cell design first!'
            }
          };
        }

        return {
          isRunning: true,
          stressTrial: {
            active: true,
            stage: 'thermal_shock',
            elapsed: 0,
            totalDuration: 30,
            initialAgents: agentCount,
            fitnessScore: null,
            certified: false,
            message: 'STAGE 1/3: THERMAL SHOCK APPLIED (88.0°C)'
          },
          environment: {
            temperature: 88.0,
            nutrients: 60,
            radiation: 15
          }
        };
      }),

      updateStressTrial: (deltaSec) => set(state => {
        if (!state.stressTrial.active) return state;

        const newElapsed = state.stressTrial.elapsed + deltaSec;
        const total = state.stressTrial.totalDuration;
        const livingAgents = state.agents.filter(a => a.energy > 0).length;

        // Stage 1 (0s - 10s): Thermal Shock (88°C)
        // Stage 2 (10s - 20s): UV Radiation Flux (85% Radiation)
        // Stage 3 (20s - 30s): Nutrient Starvation (5% Nutrients)
        if (newElapsed < 10) {
          return {
            stressTrial: {
              ...state.stressTrial,
              elapsed: newElapsed,
              stage: 'thermal_shock',
              message: `STAGE 1/3: THERMAL SHOCK (88°C) • ${(10 - newElapsed).toFixed(0)}s remaining`
            }
          };
        } else if (newElapsed < 20) {
          return {
            stressTrial: {
              ...state.stressTrial,
              elapsed: newElapsed,
              stage: 'uv_flux',
              message: `STAGE 2/3: UV RADIATION FLUX (85%) • ${(20 - newElapsed).toFixed(0)}s remaining`
            },
            environment: {
              temperature: 45.0,
              nutrients: 40,
              radiation: 85
            }
          };
        } else if (newElapsed < total) {
          return {
            stressTrial: {
              ...state.stressTrial,
              elapsed: newElapsed,
              stage: 'starvation',
              message: `STAGE 3/3: NUTRIENT STARVATION (5%) • ${(total - newElapsed).toFixed(0)}s remaining`
            },
            environment: {
              temperature: 37.0,
              nutrients: 5,
              radiation: 10
            }
          };
        }

        // Trial Finished! Calculate Fitness Score
        const initial = Math.max(1, state.stressTrial.initialAgents);
        const survivalRatio = Math.min(1, livingAgents / initial);
        const baseScore = Math.round(survivalRatio * 60);
        const longevityBonus = livingAgents > 0 ? 30 : 5;
        const finalScore = Math.min(100, baseScore + longevityBonus);
        const isCertified = finalScore >= 60 && livingAgents > 0;

        if (isCertified) {
          try {
            useProgressionStore.getState().completeQuest('bio_luca');
            useInventory.getState().markDiscovered('CERTIFIED_LUCA');
          } catch (e) {}
        }

        return {
          environment: {
            temperature: 37.0,
            nutrients: 80,
            radiation: 0
          },
          stressTrial: {
            active: false,
            stage: 'complete',
            elapsed: total,
            totalDuration: total,
            initialAgents: initial,
            fitnessScore: finalScore,
            certified: isCertified,
            message: isCertified
              ? `🏆 TRIAL PASSED! Fitness Score: ${finalScore}/100. Strain certified for Earth seeding!`
              : `❌ TRIAL FAILED. Fitness Score: ${finalScore}/100. Cells failed environmental tolerance.`
          }
        };
      }),

      cancelStressTrial: () => set(state => ({
        stressTrial: {
          active: false,
          stage: 'idle',
          elapsed: 0,
          totalDuration: 30,
          initialAgents: 0,
          fitnessScore: null,
          certified: false,
          message: 'Stress trial aborted.'
        },
        environment: {
          temperature: 37.0,
          nutrients: 80,
          radiation: 0
        }
      })),

      seedCertifiedOrganismToEarth: () => {
        const state = get();
        const livingAgent = state.agents.find(a => a.energy > 0) || state.agents[0];
        const design = state.currentCellDesign;
        const fitness = state.stressTrial.fitnessScore || 85;

        // Determine traits
        const hasPhototroph = Boolean(livingAgent?.genome?.diet === 2 || design?.organelles?.some(o => o.type === 'chloroplast' || o.type === 'phototroph'));
        const hasChemotroph = !hasPhototroph;

        const organismToSeed = {
          name: livingAgent?.id === 'LUCA' ? 'LUCA Primordialis' : `Protocell Strain ${fitness}`,
          traits: {
            phototroph: hasPhototroph,
            chemotroph: hasChemotroph,
            fitness: fitness,
            membrane: design?.membrane || 'Phospholipid Bilayer'
          },
          genome: livingAgent?.genome || { speed: 1, metabolism: 0.5, sense: 100, diet: hasPhototroph ? 2 : 0 }
        };

        // Seed planetary ocean
        usePlanetaryStore.getState().seedPlanet(organismToSeed);
        try {
          useProgressionStore.getState().completeQuest('bio_luca');
          useProgressionStore.getState().checkProgress(['CERTIFIED_LUCA', 'LUCA_SURVIVAL', 'EARTH_SEEDED']);
        } catch (e) {}

        set(s => ({
          stressTrial: {
            ...s.stressTrial,
            message: '🌍 Protocell successfully deposited into Earth Archean Ocean!'
          }
        }));
      },

      resetSimulation: () => set({
        agents: [],
        soup: { ...INITIAL_SOUP },
        foodItems: [],
        toxins: [],
        isRunning: false,
        transcribedGenes: [],
        foldedProteins: [],
        assembledOrganelleParts: [],
        assembledOrganelles: [],
        differentiatedCells: [],
        engineeredTissues: [],
        assembledOrganParts: [],
        stressTrial: {
          active: false,
          stage: 'idle',
          elapsed: 0,
          totalDuration: 30,
          initialAgents: 0,
          fitnessScore: null,
          certified: false,
          message: 'Awaiting Stress Trial initiation.',
        }
      }),
    }),
    {
      name: 'biology-lab-store',
    }
  )
);
