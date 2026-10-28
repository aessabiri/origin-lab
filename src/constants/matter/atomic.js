import { PARTICLE_TYPES } from '../particles.js';
import { ATOMIC_NUMBER_TO_TYPE } from '../periodicTableLayout.js';

const {
  UP_QUARK, DOWN_QUARK, ELECTRON,
  PROTON, NEUTRON, HYDROGEN,
  DEUTERIUM, TRITIUM, HELIUM_3, CARBON_14, URANIUM_234, URANIUM_235, URANIUM_238
} = PARTICLE_TYPES;

export const ATOMIC_MATTER = {
  [PROTON]: { parents: [UP_QUARK, DOWN_QUARK] },
  [NEUTRON]: { parents: [UP_QUARK, DOWN_QUARK] },
  [HYDROGEN]: { parents: [PROTON, ELECTRON] },
  [DEUTERIUM]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [TRITIUM]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [HELIUM_3]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [CARBON_14]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [URANIUM_234]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [URANIUM_235]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [URANIUM_238]: { parents: [PROTON, NEUTRON, ELECTRON] },
};

// Automatically populate all elements from the Periodic Table into atomic matter registry
Object.values(ATOMIC_NUMBER_TO_TYPE).forEach(atomType => {
  if (atomType && !ATOMIC_MATTER[atomType]) {
    ATOMIC_MATTER[atomType] = { parents: [PROTON, NEUTRON, ELECTRON] };
  }
});
