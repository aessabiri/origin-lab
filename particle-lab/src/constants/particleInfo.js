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
  [PARTICLE_TYPES.CHARM_QUARK]: {
    name: 'Charm Quark',
    category: 'Quark (Fermion)',
    mass: '1.27 GeV/c²',
    charge: '+2/3 e',
    spin: '1/2',
    description: 'A heavier type of quark. Particles containing charm quarks are called "charmed" particles. The J/ψ meson is a famous example.'
  },
  [PARTICLE_TYPES.STRANGE_QUARK]: {
    name: 'Strange Quark',
    category: 'Quark (Fermion)',
    mass: '95 MeV/c²',
    charge: '-1/3 e',
    spin: '1/2',
    description: 'A third type of quark. Particles containing it are called "strange" particles because they had unexpectedly long lifetimes when first discovered. The Lambda baryon is a strange particle.'
  },
  [PARTICLE_TYPES.ELECTRON]: {
    name: 'Electron',
    category: 'Lepton (Fermion)',
    mass: '0.511 MeV/c²',
    charge: '-1 e',
    spin: '1/2',
    description: 'A stable elementary particle that orbits the nucleus of an atom. Its negative charge balances the positive charge of the protons.'
  },
  [PARTICLE_TYPES.ELECTRON_ANTINEUTRINO]: {
    name: 'Electron Antineutrino',
    category: 'Lepton (Fermion)',
    mass: '< 1 eV/c²',
    charge: '0 e',
    spin: '1/2',
    description: 'The antimatter counterpart of the electron neutrino. It is produced in beta decay when a neutron turns into a proton.'
  },
  [PARTICLE_TYPES.EXCITED_ELECTRON]: {
    name: 'Excited Electron',
    category: 'Excited State',
    charge: '-1 e',
    spin: '1/2',
    composition: 'Electron + Photon',
    description: 'An electron that has absorbed a photon and jumped to a higher energy level. This state is unstable and will quickly decay back to a stable state by emitting a photon.'
  },
  [PARTICLE_TYPES.ANTI_UP_QUARK]: {
    name: 'Anti-Up Quark',
    category: 'Antiquark (Fermion)',
    mass: '2.2 MeV/c²',
    charge: '-2/3 e',
    spin: '1/2',
    description: 'The antimatter counterpart of the up quark. When a quark and its antiquark meet, they annihilate into energy.'
  },
  [PARTICLE_TYPES.ANTI_DOWN_QUARK]: {
    name: 'Anti-Down Quark',
    category: 'Antiquark (Fermion)',
    mass: '4.7 MeV/c²',
    charge: '+1/3 e',
    spin: '1/2',
    description: 'The antimatter counterpart of the down quark. It combines with quarks to form exotic particles like mesons.'
  },
  [PARTICLE_TYPES.ANTI_CHARM_QUARK]: {
    name: 'Anti-Charm Quark',
    category: 'Antiquark (Fermion)',
    mass: '1.27 GeV/c²',
    charge: '-2/3 e',
    spin: '1/2',
    description: 'The antimatter counterpart of the charm quark. A charm and anti-charm quark pair can bind together to form "charmonium" states like the J/ψ meson.'
  },
  [PARTICLE_TYPES.PHOTON]: {
    name: 'Photon',
    category: 'Gauge Boson',
    mass: '0',
    charge: '0 e',
    spin: '1',
    description: 'The quantum of the electromagnetic field, including light. It is the force carrier for the electromagnetic force, responsible for all electric and magnetic phenomena.'
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
  [PARTICLE_TYPES.DECAYING_NEUTRON]: {
    name: 'Decaying Neutron',
    category: 'Unstable State',
    charge: '0 e',
    spin: '1/2',
    composition: 'Neutron + W Boson',
    description: 'A temporary, high-energy state created when a neutron interacts with a W boson. It rapidly undergoes beta decay, transforming into a proton, an electron, and an electron antineutrino.'
  },
  [PARTICLE_TYPES.PION_PLUS]: {
    name: 'Pion+',
    category: 'Meson',
    mass: '139.6 MeV/c²',
    charge: '+1 e',
    spin: '0',
    composition: '1 Up Quark, 1 Anti-Down Quark',
    description: 'A type of meson, composed of a quark and an antiquark. Pions are the lightest mesons and play an important role in explaining the strong nuclear force at low energies.'
  },
  [PARTICLE_TYPES.LAMBDA_BARYON]: {
    name: 'Lambda (Λ) Baryon',
    category: 'Baryon (Hadron)',
    mass: '1115.7 MeV/c²',
    charge: '0 e',
    spin: '1/2',
    composition: '1 Up, 1 Down, 1 Strange Quark',
    description: 'An uncharged, strange baryon that is slightly more massive than a proton or neutron. It was one of the first "strange" particles to be discovered.'
  },
  [PARTICLE_TYPES.J_PSI_MESON]: {
    name: 'J/ψ Meson',
    category: 'Meson (Quarkonium)',
    mass: '3096.9 MeV/c²',
    charge: '0 e',
    spin: '1',
    composition: '1 Charm, 1 Anti-Charm Quark',
    description: 'A flavorless meson whose discovery in 1974, known as the "November Revolution," proved the existence of the charm quark and helped solidify the Standard Model.'
  },
  [PARTICLE_TYPES.W_BOSON]: {
    name: 'W Boson',
    category: 'Gauge Boson',
    mass: '80.4 GeV/c²',
    charge: '±1 e',
    spin: '1',
    description: 'One of the two particles that mediate the weak nuclear force. It is responsible for radioactive decay, such as beta decay, where a neutron turns into a proton.'
  },
  [PARTICLE_TYPES.GLUON]: {
    name: 'Gluon',
    category: 'Gauge Boson',
    mass: '0',
    charge: '0 e',
    spin: '1',
    description: 'The force carrier of the strong nuclear force, which "glues" quarks together inside protons and neutrons. Unlike photons, gluons can interact with each other.'
  },
  [PARTICLE_TYPES.Z_BOSON]: {
    name: 'Z Boson',
    category: 'Gauge Boson',
    mass: '91.2 GeV/c²',
    charge: '0 e',
    spin: '1',
    description: 'A neutral particle that also mediates the weak nuclear force. It is involved in processes where charge is not exchanged, such as neutrino scattering.'
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
  [PARTICLE_TYPES.DEUTERIUM]: {
    name: 'Deuterium',
    category: 'Isotope',
    atomicNumber: 1,
    mass: '2.014 u',
    charge: '0 e',
    composition: '1 Proton, 1 Neutron, 1 Electron',
    description: 'A stable isotope of hydrogen, also known as "heavy hydrogen." Its nucleus contains one proton and one neutron. It is a key component in nuclear fusion research.'
  },
  [PARTICLE_TYPES.TRITIUM]: {
    name: 'Tritium',
    category: 'Isotope',
    atomicNumber: 1,
    mass: '3.016 u',
    charge: '0 e',
    composition: '1 Proton, 2 Neutrons, 1 Electron',
    description: 'A radioactive isotope of hydrogen. Its nucleus contains one proton and two neutrons. It is used in self-powered lighting and as a tracer in biological research.'
  },
  [PARTICLE_TYPES.HELIUM]: {
    name: 'Helium',
    category: 'Atom',
    atomicNumber: 2,
    mass: '4.0026 u',
    charge: '0 e',
    composition: '2 Protons, 2 Neutrons, 2 Electrons',
    description: 'The second lightest element. It is a noble gas, meaning it is chemically inert. It is the second most abundant element in the observable universe.'
  },
  [PARTICLE_TYPES.LITHIUM]: {
    name: 'Lithium',
    category: 'Atom',
    atomicNumber: 3,
    mass: '6.94 u',
    charge: '0 e',
    composition: '3 Protons, 4 Neutrons, 3 Electrons',
    description: 'A soft, silvery-white alkali metal. It is the lightest metal and the least dense solid element. It is highly reactive and widely used in rechargeable batteries.'
  },
  [PARTICLE_TYPES.CARBON]: {
    name: 'Carbon',
    category: 'Atom',
    atomicNumber: 6,
    mass: '12.011 u',
    charge: '0 e',
    composition: '6 Protons, 6 Neutrons, 6 Electrons',
    description: 'The basis of all known life on Earth. Its ability to form four stable bonds allows it to create a vast variety of complex organic molecules.'
  },
  [PARTICLE_TYPES.NITROGEN]: {
    name: 'Nitrogen',
    category: 'Atom',
    atomicNumber: 7,
    mass: '14.007 u',
    charge: '0 e',
    composition: '7 Protons, 7 Neutrons, 7 Electrons',
    description: 'The most abundant gas in Earth\'s atmosphere (about 78%). It is a crucial component of amino acids, and therefore proteins, and nucleic acids like DNA.'
  },
  [PARTICLE_TYPES.OXYGEN]: {
    name: 'Oxygen',
    category: 'Atom',
    atomicNumber: 8,
    mass: '15.999 u',
    charge: '0 e',
    composition: '8 Protons, 8 Neutrons, 8 Electrons',
    description: 'A highly reactive nonmetal and an oxidizing agent that readily forms oxides with most elements. It is essential for respiration in most terrestrial life.'
  },
  [PARTICLE_TYPES.NEON]: {
    name: 'Neon',
    category: 'Atom',
    atomicNumber: 10,
    mass: '20.180 u',
    charge: '0 e',
    composition: '10 Protons, 10 Neutrons, 10 Electrons',
    description: 'A noble gas that gives a distinct reddish-orange glow when used in low-voltage neon glow lamps, high-voltage discharge tubes and advertising signs.'
  },
  [PARTICLE_TYPES.SODIUM]: {
    name: 'Sodium',
    category: 'Atom',
    atomicNumber: 11,
    mass: '22.990 u',
    charge: '0 e',
    composition: '11 Protons, 12 Neutrons, 11 Electrons',
    description: 'A soft, silvery-white, highly reactive alkali metal. It is an essential element for animals for maintaining fluid balance and nerve function.'
  },
  [PARTICLE_TYPES.SILICON]: {
    name: 'Silicon',
    category: 'Atom',
    atomicNumber: 14,
    mass: '28.085 u',
    charge: '0 e',
    composition: '14 Protons, 14 Neutrons, 14 Electrons',
    description: 'A metalloid that is the second most abundant element in the Earth\'s crust. It is the basis of modern electronics and semiconductor technology.'
  },
  [PARTICLE_TYPES.ARGON]: {
    name: 'Argon',
    category: 'Atom',
    atomicNumber: 18,
    mass: '39.948 u',
    charge: '0 e',
    composition: '18 Protons, 22 Neutrons, 18 Electrons',
    description: 'A noble gas that is the third-most abundant gas in the Earth\'s atmosphere. It is often used in welding and incandescent lighting to provide an inert atmosphere.'
  },
  [PARTICLE_TYPES.WATER]: {
    name: 'Water',
    category: 'Molecule',
    mass: '18.015 u',
    charge: '0 e',
    composition: '2 Hydrogen, 1 Oxygen',
    description: 'A polar molecule essential for all known forms of life. Its unique properties, like high surface tension and solvent capabilities, stem from its bent shape and hydrogen bonds.'
  },
  [PARTICLE_TYPES.METHANE]: {
    name: 'Methane',
    category: 'Molecule',
    mass: '16.04 u',
    charge: '0 e',
    composition: '1 Carbon, 4 Hydrogen',
    description: 'The simplest alkane and the main component of natural gas. It is a potent greenhouse gas with a tetrahedral geometry.'
  },
  [PARTICLE_TYPES.AMMONIA]: {
    name: 'Ammonia',
    category: 'Molecule',
    mass: '17.031 u',
    charge: '0 e',
    composition: '1 Nitrogen, 3 Hydrogen',
    description: 'A pungent gas that is a vital building block for many pharmaceuticals and is a key component in fertilizers. It has a trigonal pyramidal shape.'
  },
  [PARTICLE_TYPES.CARBON_DIOXIDE]: {
    name: 'Carbon Dioxide',
    category: 'Molecule',
    mass: '44.01 u',
    charge: '0 e',
    composition: '1 Carbon, 2 Oxygen',
    description: 'A gas that is a natural part of Earth\'s atmosphere. It is used by plants for photosynthesis and is a major greenhouse gas. It has a linear structure.'
  },
  [PARTICLE_TYPES.SODIUM_CHLORIDE]: {
    name: 'Sodium Chloride',
    category: 'Ionic Compound',
    mass: '58.44 u',
    charge: '0 e',
    composition: '1 Sodium, 1 Chlorine',
    description: 'Commonly known as table salt. It is an ionic compound formed from sodium and chloride ions, held together by ionic bonds in a crystal lattice structure.'
  },
  [PARTICLE_TYPES.HYDROCHLORIC_ACID]: {
    name: 'Hydrochloric Acid',
    category: 'Molecule / Acid',
    mass: '36.46 u',
    charge: '0 e',
    composition: '1 Hydrogen, 1 Chlorine',
    description: 'A strong, corrosive acid. It is the main component of gastric acid in the stomach, helping to digest food.'
  },
  [PARTICLE_TYPES.CARBON_MONOXIDE]: {
    name: 'Carbon Monoxide',
    category: 'Molecule',
    mass: '28.01 u',
    charge: '0 e',
    composition: '1 Carbon, 1 Oxygen',
    description: 'A colorless, odorless, and tasteless flammable gas that is slightly less dense than air. It is toxic to humans when encountered in higher concentrations.'
  },
  [PARTICLE_TYPES.HYDROGEN_SULFIDE]: {
    name: 'Hydrogen Sulfide',
    category: 'Molecule',
    mass: '34.08 u',
    charge: '0 e',
    composition: '2 Hydrogen, 1 Sulfur',
    description: 'A colorless, flammable gas known for its characteristic foul odor of rotten eggs. It is used as an agricultural disinfectant.'
  },
  [PARTICLE_TYPES.HYDROGEN_PEROXIDE]: {
    name: 'Hydrogen Peroxide',
    category: 'Molecule',
    mass: '34.01 u',
    charge: '0 e',
    composition: '2 Hydrogen, 2 Oxygen',
    description: 'A simple peroxide, it is a colorless liquid, slightly more viscous than water. It is used as an oxidizer, bleaching agent, and antiseptic.'
  },
};