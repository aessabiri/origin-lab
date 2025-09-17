import { PARTICLE_TYPES } from './particles.js';

export const PARTICLE_INFO = {
  [PARTICLE_TYPES.UP_QUARK]: {
    name: 'Up Quark',
    category: 'Quark (Fermion)',
    mass: '2.2 MeV/c²',
    charge: '+2/3 e',
    spin: '1/2',
    description: 'One of the fundamental building blocks of matter. Up quarks combine with down quarks to form protons and neutrons.'
  },
  [PARTICLE_TYPES.DOWN_QUARK]: {
    name: 'Down Quark',
    category: 'Quark (Fermion)',
    mass: '4.7 MeV/c²',
    charge: '-1/3 e',
    spin: '1/2',
    description: 'Along with the up quark, it is a primary constituent of protons and neutrons.'
  },
  [PARTICLE_TYPES.ELECTRON]: {
    name: 'Electron',
    category: 'Lepton (Fermion)',
    mass: '0.511 MeV/c²',
    charge: '-1 e',
    spin: '1/2',
    description: 'A stable elementary particle that orbits the nucleus of an atom. Its negative charge balances the positive charge of the protons.'
  },
  [PARTICLE_TYPES.PROTON]: {
    name: 'Proton',
    category: 'Baryon (Hadron)',
    mass: '938.3 MeV/c²',
    charge: '+1 e',
    spin: '1/2',
    composition: '2 Up Quarks, 1 Down Quark',
    description: 'A stable particle found in the nucleus of every atom. The number of protons determines an element\'s atomic number.'
  },
  [PARTICLE_TYPES.NEUTRON]: {
    name: 'Neutron',
    category: 'Baryon (Hadron)',
    mass: '939.6 MeV/c²',
    charge: '0 e',
    spin: '1/2',
    composition: '1 Up Quark, 2 Down Quarks',
    description: 'A neutral particle found in the nucleus of most atoms. Neutrons contribute to atomic mass and nuclear stability.'
  },
  [PARTICLE_TYPES.HYDROGEN]: {
    name: 'Hydrogen',
    category: 'Atom',
    atomicNumber: 1,
    mass: '1.008 u',
    charge: '0 e',
    composition: '1 Proton, 1 Electron',
    description: 'The simplest and most abundant element in the universe, consisting of a single proton and a single electron.'
  },
  // You can add more entries here for every particle!
};