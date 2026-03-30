import { PARTICLE_TYPES } from '../particles';

const {
  UP_QUARK, DOWN_QUARK, ELECTRON,
  PROTON, NEUTRON, HYDROGEN, HELIUM, CARBON, NITROGEN, OXYGEN, PHOSPHORUS, SULFUR, IRON
} = PARTICLE_TYPES;

export const ATOMIC_MATTER = {
  [PROTON]: { parents: [UP_QUARK, DOWN_QUARK] },
  [NEUTRON]: { parents: [UP_QUARK, DOWN_QUARK] },
  [HYDROGEN]: { parents: [PROTON, ELECTRON] },
  [HELIUM]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [CARBON]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [NITROGEN]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [OXYGEN]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [PHOSPHORUS]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [SULFUR]: { parents: [PROTON, NEUTRON, ELECTRON] },
  [IRON]: { parents: [PROTON, NEUTRON, ELECTRON] },
  // ... more can be added dynamically or manually
};
