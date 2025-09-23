import { PARTICLE_TYPES } from './constants/particles.js';

export const elementaryParticleGroups = {
  Quarks: [
    { id: 'up-1', type: PARTICLE_TYPES.UP_QUARK },
    { id: 'down-1', type: PARTICLE_TYPES.DOWN_QUARK },
    { id: 'charm-1', type: PARTICLE_TYPES.CHARM_QUARK },
    { id: 'strange-1', type: PARTICLE_TYPES.STRANGE_QUARK },
    { id: 'top-1', type: PARTICLE_TYPES.TOP_QUARK },
    { id: 'bottom-1', type: PARTICLE_TYPES.BOTTOM_QUARK },
  ],
  'Anti-Quarks': [
    { id: 'anti-up-1', type: PARTICLE_TYPES.ANTI_UP_QUARK },
    { id: 'anti-down-1', type: PARTICLE_TYPES.ANTI_DOWN_QUARK },
    { id: 'anti-charm-1', type: PARTICLE_TYPES.ANTI_CHARM_QUARK },
  ],
  Leptons: [
    { id: 'electron-1', type: PARTICLE_TYPES.ELECTRON },
    { id: 'electron-neutrino-1', type: PARTICLE_TYPES.ELECTRON_NEUTRINO },
  ],
  'Anti-Leptons': [
    { id: 'e-antineutrino-1', type: PARTICLE_TYPES.ELECTRON_ANTINEUTRINO },
  ],
  Bosons: [
    { id: 'photon-1', type: PARTICLE_TYPES.PHOTON },
    { id: 'gluon-1', type: PARTICLE_TYPES.GLUON },
    { id: 'w-boson-1', type: PARTICLE_TYPES.W_BOSON },
    { id: 'z-boson-1', type: PARTICLE_TYPES.Z_BOSON },
  ]
};

export const GOALS = [
  { name: 'Synthesize a Proton', type: PARTICLE_TYPES.PROTON },
  { name: 'Synthesize a Neutron', type: PARTICLE_TYPES.NEUTRON },
  { name: 'Synthesize a Pion+', type: PARTICLE_TYPES.PION_PLUS },
  { name: 'Form a Hydrogen Atom', type: PARTICLE_TYPES.HYDROGEN },
  { name: 'Form a Deuterium Atom', type: PARTICLE_TYPES.DEUTERIUM },
  { name: 'Form a Helium Atom', type: PARTICLE_TYPES.HELIUM },
  { name: 'Form a Carbon Atom', type: PARTICLE_TYPES.CARBON },
  { name: 'Form a Nitrogen Atom', type: PARTICLE_TYPES.NITROGEN },
  { name: 'Form an Oxygen Atom', type: PARTICLE_TYPES.OXYGEN },
  { name: 'Form a Neon Atom', type: PARTICLE_TYPES.NEON },
  { name: 'Form a Sodium Atom', type: PARTICLE_TYPES.SODIUM },
  { name: 'Form a Silicon Atom', type: PARTICLE_TYPES.SILICON },
  { name: 'Form an Argon Atom', type: PARTICLE_TYPES.ARGON },
  { name: 'Induce Neutron Decay', type: PARTICLE_TYPES.DECAYING_NEUTRON },
  { name: 'Create an Excited Electron', type: PARTICLE_TYPES.EXCITED_ELECTRON },
  { name: 'Synthesize a Water Molecule', type: PARTICLE_TYPES.WATER },
  { name: 'Synthesize a Methane Molecule', type: PARTICLE_TYPES.METHANE },
  { name: 'Synthesize an Ammonia Molecule', type: PARTICLE_TYPES.AMMONIA },
  { name: 'Synthesize Carbon Dioxide', type: PARTICLE_TYPES.CARBON_DIOXIDE },
  { name: 'Synthesize Salt (NaCl)', type: PARTICLE_TYPES.SODIUM_CHLORIDE },
  { name: 'Synthesize a Lambda Baryon', type: PARTICLE_TYPES.LAMBDA_BARYON },
  { name: 'Synthesize a J/ψ Meson', type: PARTICLE_TYPES.J_PSI_MESON },
];