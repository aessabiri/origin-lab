import { PARTICLE_TYPES } from '../constants/particles.js';

export const MOLECULE_RECIPES = [
  {
    type: PARTICLE_TYPES.WATER,
    atoms: {
      [PARTICLE_TYPES.HYDROGEN]: 2,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
    bonds: {
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN }
      ],
      edges: [
        { source: 'o1', target: 'h1', type: 'single' },
        { source: 'o1', target: 'h2', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.METHANE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 4,
    },
    bonds: {
      single: 4,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'h4', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.AMMONIA,
    atoms: {
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 3,
    },
    bonds: {
      single: 3,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'h3', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.CARBON_DIOXIDE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      double: 2,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN }
      ],
      edges: [
        { source: 'c1', target: 'o1', type: 'double' },
        { source: 'c1', target: 'o2', type: 'double' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.CARBON_MONOXIDE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
    bonds: {
      triple: 1,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN }
      ],
      edges: [
        { source: 'c1', target: 'o1', type: 'triple' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.GLYCINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 2,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 5,
    },
    bonds: {
      single: 8,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'c1', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'h4', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h5', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ALANINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 3,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 7,
    },
    bonds: {
      single: 10,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h6', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h7', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'c1', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c1', target: 'c3', type: 'single' },
        { source: 'c3', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' },
        { source: 'c3', target: 'h6', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h7', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.VALINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 5,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 11,
    },
    bonds: {
      single: 16,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h6', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h7', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h8', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h9', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h10', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h11', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'c1', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c1', target: 'c3', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h11', type: 'single' },
        { source: 'c3', target: 'h4', type: 'single' },
        { source: 'c3', target: 'c4', type: 'single' },
        { source: 'c3', target: 'c5', type: 'single' },
        { source: 'c4', target: 'h5', type: 'single' },
        { source: 'c4', target: 'h6', type: 'single' },
        { source: 'c4', target: 'h7', type: 'single' },
        { source: 'c5', target: 'h8', type: 'single' },
        { source: 'c5', target: 'h9', type: 'single' },
        { source: 'c5', target: 'h10', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.LEUCINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 6,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 13,
    },
    bonds: {
      single: 19,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h6', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h7', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h8', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h9', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h10', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h11', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h12', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h13', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'c1', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c1', target: 'c3', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h13', type: 'single' },
        { source: 'c3', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' },
        { source: 'c3', target: 'c4', type: 'single' },
        { source: 'c4', target: 'h6', type: 'single' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c4', target: 'c6', type: 'single' },
        { source: 'c5', target: 'h7', type: 'single' },
        { source: 'c5', target: 'h8', type: 'single' },
        { source: 'c5', target: 'h9', type: 'single' },
        { source: 'c6', target: 'h10', type: 'single' },
        { source: 'c6', target: 'h11', type: 'single' },
        { source: 'c6', target: 'h12', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.SERINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 3,
      [PARTICLE_TYPES.OXYGEN]: 3,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 7,
    },
    bonds: {
      single: 11,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h6', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h7', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'c1', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c1', target: 'c3', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h6', type: 'single' },
        { source: 'c3', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' },
        { source: 'c3', target: 'o3', type: 'single' },
        { source: 'o3', target: 'h7', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ADENINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 5,
      [PARTICLE_TYPES.HYDROGEN]: 5,
      [PARTICLE_TYPES.NITROGEN]: 5,
    },
    bonds: {
      single: 12,
      double: 4,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'n3', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        { id: 'n7', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c8', type: PARTICLE_TYPES.CARBON },
        { id: 'n9', type: PARTICLE_TYPES.NITROGEN },
        { id: 'n10', type: PARTICLE_TYPES.NITROGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'c6', type: 'double' },
        { source: 'n1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'n3', type: 'double' },
        { source: 'c2', target: 'h1', type: 'single' },
        { source: 'n3', target: 'c4', type: 'single' },
        { source: 'c4', target: 'c5', type: 'double' },
        { source: 'c4', target: 'n9', type: 'single' },
        { source: 'c5', target: 'c6', type: 'single' },
        { source: 'c5', target: 'n7', type: 'single' },
        { source: 'c6', target: 'n10', type: 'single' },
        { source: 'n7', target: 'c8', type: 'double' },
        { source: 'c8', target: 'n9', type: 'single' },
        { source: 'c8', target: 'h2', type: 'single' },
        { source: 'n9', target: 'h3', type: 'single' },
        { source: 'n10', target: 'h4', type: 'single' },
        { source: 'n10', target: 'h5', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.GUANINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 5,
      [PARTICLE_TYPES.HYDROGEN]: 5,
      [PARTICLE_TYPES.NITROGEN]: 5,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
    bonds: {
      single: 13,
      double: 4,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'n3', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        { id: 'n7', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c8', type: PARTICLE_TYPES.CARBON },
        { id: 'n9', type: PARTICLE_TYPES.NITROGEN },
        { id: 'n10', type: PARTICLE_TYPES.NITROGEN },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'c2', type: 'single' },
        { source: 'n1', target: 'c6', type: 'single' },
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'c2', target: 'n3', type: 'double' },
        { source: 'c2', target: 'n10', type: 'single' },
        { source: 'n3', target: 'c4', type: 'single' },
        { source: 'c4', target: 'c5', type: 'double' },
        { source: 'c4', target: 'n9', type: 'single' },
        { source: 'c5', target: 'c6', type: 'single' },
        { source: 'c5', target: 'n7', type: 'single' },
        { source: 'c6', target: 'o1', type: 'double' },
        { source: 'n7', target: 'c8', type: 'double' },
        { source: 'c8', target: 'n9', type: 'single' },
        { source: 'c8', target: 'h2', type: 'single' },
        { source: 'n9', target: 'h3', type: 'single' },
        { source: 'n10', target: 'h4', type: 'single' },
        { source: 'n10', target: 'h5', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.CYTOSINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 4,
      [PARTICLE_TYPES.HYDROGEN]: 5,
      [PARTICLE_TYPES.NITROGEN]: 3,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
    bonds: {
      single: 10,
      double: 3,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'n3', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        { id: 'n4', type: PARTICLE_TYPES.NITROGEN },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'c2', type: 'single' },
        { source: 'n1', target: 'c6', type: 'single' },
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'n3', type: 'single' },
        { source: 'n3', target: 'c4', type: 'double' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c4', target: 'n4', type: 'single' },
        { source: 'c5', target: 'c6', type: 'double' },
        { source: 'c5', target: 'h2', type: 'single' },
        { source: 'c6', target: 'h3', type: 'single' },
        { source: 'n4', target: 'h4', type: 'single' },
        { source: 'n4', target: 'h5', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.THYMINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 5,
      [PARTICLE_TYPES.HYDROGEN]: 6,
      [PARTICLE_TYPES.NITROGEN]: 2,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      single: 12,
      double: 3,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'n3', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        { id: 'c7', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h6', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'c2', type: 'single' },
        { source: 'n1', target: 'c6', type: 'single' },
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'n3', type: 'single' },
        { source: 'n3', target: 'c4', type: 'single' },
        { source: 'n3', target: 'h2', type: 'single' },
        { source: 'c4', target: 'o2', type: 'double' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c5', target: 'c6', type: 'double' },
        { source: 'c5', target: 'c7', type: 'single' },
        { source: 'c6', target: 'h3', type: 'single' },
        { source: 'c7', target: 'h4', type: 'single' },
        { source: 'c7', target: 'h5', type: 'single' },
        { source: 'c7', target: 'h6', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ACETIC_ACID,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 2,
      [PARTICLE_TYPES.HYDROGEN]: 4,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      single: 6,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h4', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.URACIL,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 4,
      [PARTICLE_TYPES.HYDROGEN]: 4,
      [PARTICLE_TYPES.NITROGEN]: 2,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      single: 9,
      double: 3,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'n3', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'c2', type: 'single' },
        { source: 'n1', target: 'c6', type: 'single' },
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'n3', type: 'single' },
        { source: 'n3', target: 'c4', type: 'single' },
        { source: 'n3', target: 'h2', type: 'single' },
        { source: 'c4', target: 'o2', type: 'double' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c5', target: 'c6', type: 'double' },
        { source: 'c5', target: 'h3', type: 'single' },
        { source: 'c6', target: 'h4', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ETHANOL,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 2,
      [PARTICLE_TYPES.HYDROGEN]: 6,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
    bonds: {
      single: 8,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h6', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'h4', type: 'single' },
        { source: 'c2', target: 'h5', type: 'single' },
        { source: 'c2', target: 'o1', type: 'single' },
        { source: 'o1', target: 'h6', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.SULFURIC_ACID,
    atoms: {
      [PARTICLE_TYPES.SULFUR]: 1,
      [PARTICLE_TYPES.OXYGEN]: 4,
      [PARTICLE_TYPES.HYDROGEN]: 2,
    },
    bonds: {
      single: 4,
      double: 2,
    },
    structure: {
      nodes: [
        { id: 's1', type: PARTICLE_TYPES.SULFUR },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o4', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 's1', target: 'o1', type: 'double' },
        { source: 's1', target: 'o2', type: 'double' },
        { source: 's1', target: 'o3', type: 'single' },
        { source: 's1', target: 'o4', type: 'single' },
        { source: 'o3', target: 'h1', type: 'single' },
        { source: 'o4', target: 'h2', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NITROGEN_GAS,
    atoms: {
      [PARTICLE_TYPES.NITROGEN]: 2,
    },
    bonds: {
      triple: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'n2', type: PARTICLE_TYPES.NITROGEN },
      ],
      edges: [
        { source: 'n1', target: 'n2', type: 'triple' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.OXYGEN_GAS,
    atoms: {
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
      ],
      edges: [
        { source: 'o1', target: 'o2', type: 'double' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.PHOSPHATE,
    atoms: {
      [PARTICLE_TYPES.PHOSPHORUS]: 1,
      [PARTICLE_TYPES.OXYGEN]: 4,
      [PARTICLE_TYPES.HYDROGEN]: 3,
    },
    bonds: {
      single: 6,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'p1', type: PARTICLE_TYPES.PHOSPHORUS },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o4', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'p1', target: 'o1', type: 'double' },
        { source: 'p1', target: 'o2', type: 'single' },
        { source: 'p1', target: 'o3', type: 'single' },
        { source: 'p1', target: 'o4', type: 'single' },
        { source: 'o2', target: 'h1', type: 'single' },
        { source: 'o3', target: 'h2', type: 'single' },
        { source: 'o4', target: 'h3', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.DEOXYRIBOSE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 5,
      [PARTICLE_TYPES.HYDROGEN]: 10,
      [PARTICLE_TYPES.OXYGEN]: 4,
    },
    bonds: {
      single: 14,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'o_ring', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o5', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h_c1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c2_1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c2_2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c5_1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c5_2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_o1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_o3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_o5', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c3', target: 'c4', type: 'single' },
        { source: 'c4', target: 'o_ring', type: 'single' },
        { source: 'o_ring', target: 'c1', type: 'single' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c1', target: 'o1', type: 'single' },
        { source: 'o1', target: 'h_o1', type: 'single' },
        { source: 'c3', target: 'o3', type: 'single' },
        { source: 'o3', target: 'h_o3', type: 'single' },
        { source: 'c5', target: 'o5', type: 'single' },
        { source: 'o5', target: 'h_o5', type: 'single' },
        { source: 'c1', target: 'h_c1', type: 'single' },
        { source: 'c2', target: 'h_c2_1', type: 'single' },
        { source: 'c2', target: 'h_c2_2', type: 'single' },
        { source: 'c3', target: 'h_c3', type: 'single' },
        { source: 'c4', target: 'h_c4', type: 'single' },
        { source: 'c5', target: 'h_c5_1', type: 'single' },
        { source: 'c5', target: 'h_c5_2', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.RIBOSE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 5,
      [PARTICLE_TYPES.HYDROGEN]: 10,
      [PARTICLE_TYPES.OXYGEN]: 5,
    },
    bonds: {
      single: 15,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'o_ring', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o5', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h_c1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c5_1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_c5_2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_o1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_o2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_o3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h_o5', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c3', target: 'c4', type: 'single' },
        { source: 'c4', target: 'o_ring', type: 'single' },
        { source: 'o_ring', target: 'c1', type: 'single' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c1', target: 'o1', type: 'single' },
        { source: 'o1', target: 'h_o1', type: 'single' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h_o2', type: 'single' },
        { source: 'c3', target: 'o3', type: 'single' },
        { source: 'o3', target: 'h_o3', type: 'single' },
        { source: 'c5', target: 'o5', type: 'single' },
        { source: 'o5', target: 'h_o5', type: 'single' },
        { source: 'c1', target: 'h_c1', type: 'single' },
        { source: 'c2', target: 'h_c2', type: 'single' },
        { source: 'c3', target: 'h_c3', type: 'single' },
        { source: 'c4', target: 'h_c4', type: 'single' },
        { source: 'c5', target: 'h_c5_1', type: 'single' },
        { source: 'c5', target: 'h_c5_2', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NUCLEOTIDE_A,
    atoms: {
      [PARTICLE_TYPES.ADENINE]: 1,
      [PARTICLE_TYPES.DEOXYRIBOSE]: 1,
      [PARTICLE_TYPES.PHOSPHATE]: 1,
    },
    bonds: {
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'base', type: PARTICLE_TYPES.ADENINE },
        { id: 'sugar', type: PARTICLE_TYPES.DEOXYRIBOSE },
        { id: 'phos', type: PARTICLE_TYPES.PHOSPHATE }
      ],
      edges: [
        { source: 'base', target: 'sugar', type: 'single' },
        { source: 'sugar', target: 'phos', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NUCLEOTIDE_T,
    atoms: {
      [PARTICLE_TYPES.THYMINE]: 1,
      [PARTICLE_TYPES.DEOXYRIBOSE]: 1,
      [PARTICLE_TYPES.PHOSPHATE]: 1,
    },
    bonds: {
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'base', type: PARTICLE_TYPES.THYMINE },
        { id: 'sugar', type: PARTICLE_TYPES.DEOXYRIBOSE },
        { id: 'phos', type: PARTICLE_TYPES.PHOSPHATE }
      ],
      edges: [
        { source: 'base', target: 'sugar', type: 'single' },
        { source: 'sugar', target: 'phos', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NUCLEOTIDE_G,
    atoms: {
      [PARTICLE_TYPES.GUANINE]: 1,
      [PARTICLE_TYPES.DEOXYRIBOSE]: 1,
      [PARTICLE_TYPES.PHOSPHATE]: 1,
    },
    bonds: {
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'base', type: PARTICLE_TYPES.GUANINE },
        { id: 'sugar', type: PARTICLE_TYPES.DEOXYRIBOSE },
        { id: 'phos', type: PARTICLE_TYPES.PHOSPHATE }
      ],
      edges: [
        { source: 'base', target: 'sugar', type: 'single' },
        { source: 'sugar', target: 'phos', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NUCLEOTIDE_C,
    atoms: {
      [PARTICLE_TYPES.CYTOSINE]: 1,
      [PARTICLE_TYPES.DEOXYRIBOSE]: 1,
      [PARTICLE_TYPES.PHOSPHATE]: 1,
    },
    bonds: {
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'base', type: PARTICLE_TYPES.CYTOSINE },
        { id: 'sugar', type: PARTICLE_TYPES.DEOXYRIBOSE },
        { id: 'phos', type: PARTICLE_TYPES.PHOSPHATE }
      ],
      edges: [
        { source: 'base', target: 'sugar', type: 'single' },
        { source: 'sugar', target: 'phos', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NUCLEOTIDE_U,
    atoms: {
      [PARTICLE_TYPES.URACIL]: 1,
      [PARTICLE_TYPES.RIBOSE]: 1,
      [PARTICLE_TYPES.PHOSPHATE]: 1,
    },
    bonds: {
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'base', type: PARTICLE_TYPES.URACIL },
        { id: 'sugar', type: PARTICLE_TYPES.RIBOSE },
        { id: 'phos', type: PARTICLE_TYPES.PHOSPHATE }
      ],
      edges: [
        { source: 'base', target: 'sugar', type: 'single' },
        { source: 'sugar', target: 'phos', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.DNA,
    atoms: {
      [PARTICLE_TYPES.NUCLEOTIDE_A]: 1,
      [PARTICLE_TYPES.NUCLEOTIDE_T]: 1,
      [PARTICLE_TYPES.NUCLEOTIDE_G]: 1,
      [PARTICLE_TYPES.NUCLEOTIDE_C]: 1,
    },
    bonds: {
      single: 3,
    },
  },
  {
    type: PARTICLE_TYPES.RNA,
    atoms: {
      [PARTICLE_TYPES.NUCLEOTIDE_A]: 1,
      [PARTICLE_TYPES.NUCLEOTIDE_U]: 1,
      [PARTICLE_TYPES.NUCLEOTIDE_G]: 1,
      [PARTICLE_TYPES.NUCLEOTIDE_C]: 1,
    },
    bonds: {
      single: 3,
    },
  },
  {
    type: PARTICLE_TYPES.GLYCEROL,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 3,
      [PARTICLE_TYPES.HYDROGEN]: 8,
      [PARTICLE_TYPES.OXYGEN]: 3,
    },
    bonds: {
      single: 11,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h6', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h7', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h8', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c1', target: 'o1', type: 'single' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'c3', target: 'o3', type: 'single' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c2', target: 'h3', type: 'single' },
        { source: 'c3', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' },
        { source: 'o1', target: 'h6', type: 'single' },
        { source: 'o2', target: 'h7', type: 'single' },
        { source: 'o3', target: 'h8', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.FATTY_ACID,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 8,
      [PARTICLE_TYPES.HYDROGEN]: 16,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      single: 23,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        { id: 'c7', type: PARTICLE_TYPES.CARBON },
        { id: 'c8', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h_o', type: PARTICLE_TYPES.HYDROGEN },
        // Simplified chain hydrogens (represented by generic nodes for signature)
        // Actually need unique IDs
        ...Array.from({ length: 15 }, (_, i) => ({ id: `h${i}`, type: PARTICLE_TYPES.HYDROGEN })),
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c3', target: 'c4', type: 'single' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c5', target: 'c6', type: 'single' },
        { source: 'c6', target: 'c7', type: 'single' },
        { source: 'c7', target: 'c8', type: 'single' },
        { source: 'c8', target: 'o1', type: 'double' },
        { source: 'c8', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h_o', type: 'single' },
        // Connecting hydrogens roughly (not validating exact H placement on specific carbons to save verbose code, just ensuring topology allows for it)
        // Actually, to pass graph signature, edges MUST be exact.
        // C1 (Methyl end): 3 H
        { source: 'c1', target: 'h0', type: 'single' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        // C2-C7: 2 H each
        { source: 'c2', target: 'h3', type: 'single' }, { source: 'c2', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' }, { source: 'c3', target: 'h6', type: 'single' },
        { source: 'c4', target: 'h7', type: 'single' }, { source: 'c4', target: 'h8', type: 'single' },
        { source: 'c5', target: 'h9', type: 'single' }, { source: 'c5', target: 'h10', type: 'single' },
        { source: 'c6', target: 'h11', type: 'single' }, { source: 'c6', target: 'h12', type: 'single' },
        { source: 'c7', target: 'h13', type: 'single' }, { source: 'c7', target: 'h14', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.LIPID,
    atoms: {
      [PARTICLE_TYPES.GLYCEROL]: 1,
      [PARTICLE_TYPES.FATTY_ACID]: 3,
    },
    bonds: {
      single: 3,
    },
    structure: {
      nodes: [
        { id: 'gly', type: PARTICLE_TYPES.GLYCEROL },
        { id: 'fa1', type: PARTICLE_TYPES.FATTY_ACID },
        { id: 'fa2', type: PARTICLE_TYPES.FATTY_ACID },
        { id: 'fa3', type: PARTICLE_TYPES.FATTY_ACID },
      ],
      edges: [
        { source: 'gly', target: 'fa1', type: 'single' },
        { source: 'gly', target: 'fa2', type: 'single' },
        { source: 'gly', target: 'fa3', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ATP,
    atoms: {
      [PARTICLE_TYPES.ADENINE]: 1,
      [PARTICLE_TYPES.RIBOSE]: 1,
      [PARTICLE_TYPES.PHOSPHATE]: 3,
    },
    bonds: {
      single: 4,
    },
    structure: {
      nodes: [
        { id: 'base', type: PARTICLE_TYPES.ADENINE },
        { id: 'sugar', type: PARTICLE_TYPES.RIBOSE },
        { id: 'p1', type: PARTICLE_TYPES.PHOSPHATE },
        { id: 'p2', type: PARTICLE_TYPES.PHOSPHATE },
        { id: 'p3', type: PARTICLE_TYPES.PHOSPHATE },
      ],
      edges: [
        { source: 'base', target: 'sugar', type: 'single' },
        { source: 'sugar', target: 'p1', type: 'single' },
        { source: 'p1', target: 'p2', type: 'single' },
        { source: 'p2', target: 'p3', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.BENZENE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 6,
      [PARTICLE_TYPES.HYDROGEN]: 6,
    },
    bonds: {
      single: 3,
      double: 3,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        ...Array.from({length: 6}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN })),
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'double' },
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c3', target: 'c4', type: 'double' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c5', target: 'c6', type: 'double' },
        { source: 'c6', target: 'c1', type: 'single' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c2', target: 'h2', type: 'single' },
        { source: 'c3', target: 'h3', type: 'single' },
        { source: 'c4', target: 'h4', type: 'single' },
        { source: 'c5', target: 'h5', type: 'single' },
        { source: 'c6', target: 'h6', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.CYSTEINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 3,
      [PARTICLE_TYPES.HYDROGEN]: 7,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.OXYGEN]: 2,
      [PARTICLE_TYPES.SULFUR]: 1,
    },
    bonds: {
      single: 12,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 's1', type: PARTICLE_TYPES.SULFUR },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h6', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h7', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'c1', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c1', target: 'c3', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' },
        { source: 'c3', target: 'h6', type: 'single' },
        { source: 'c3', target: 's1', type: 'single' },
        { source: 's1', target: 'h7', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.PHENYLALANINE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 9,
      [PARTICLE_TYPES.HYDROGEN]: 11,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      single: 20,
      double: 4,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'r1', type: PARTICLE_TYPES.CARBON },
        { id: 'r2', type: PARTICLE_TYPES.CARBON },
        { id: 'r3', type: PARTICLE_TYPES.CARBON },
        { id: 'r4', type: PARTICLE_TYPES.CARBON },
        { id: 'r5', type: PARTICLE_TYPES.CARBON },
        { id: 'r6', type: PARTICLE_TYPES.CARBON },
        ...Array.from({length: 11}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN })),
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'c1', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c1', target: 'c3', type: 'single' },
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' },
        { source: 'c3', target: 'h6', type: 'single' },
        { source: 'c3', target: 'r1', type: 'single' },
        { source: 'r1', target: 'r2', type: 'double' },
        { source: 'r2', target: 'r3', type: 'single' },
        { source: 'r3', target: 'r4', type: 'double' },
        { source: 'r4', target: 'r5', type: 'single' },
        { source: 'r5', target: 'r6', type: 'double' },
        { source: 'r6', target: 'r1', type: 'single' },
        { source: 'r2', target: 'h7', type: 'single' },
        { source: 'r3', target: 'h8', type: 'single' },
        { source: 'r4', target: 'h9', type: 'single' },
        { source: 'r5', target: 'h10', type: 'single' },
        { source: 'r6', target: 'h11', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.FRUCTOSE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 6,
      [PARTICLE_TYPES.HYDROGEN]: 12,
      [PARTICLE_TYPES.OXYGEN]: 6,
    },
    bonds: {
      single: 20,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        { id: 'c5', type: PARTICLE_TYPES.CARBON },
        { id: 'c6', type: PARTICLE_TYPES.CARBON },
        { id: 'o_ring', type: PARTICLE_TYPES.OXYGEN },
        ...Array.from({length: 5}, (_, i) => ({ id: `o${i+1}`, type: PARTICLE_TYPES.OXYGEN })),
        ...Array.from({length: 12}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN })),
      ],
      edges: [
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c3', target: 'c4', type: 'single' },
        { source: 'c4', target: 'c5', type: 'single' },
        { source: 'c5', target: 'o_ring', type: 'single' },
        { source: 'o_ring', target: 'c2', type: 'single' },
        { source: 'c2', target: 'c1', type: 'single' },
        { source: 'c5', target: 'c6', type: 'single' },
        // Simplified connectivity
        { source: 'c1', target: 'o1', type: 'single' }, { source: 'o1', target: 'h1', type: 'single' },
        { source: 'c2', target: 'o2', type: 'single' }, { source: 'o2', target: 'h2', type: 'single' },
        { source: 'c3', target: 'o3', type: 'single' }, { source: 'o3', target: 'h3', type: 'single' },
        { source: 'c4', target: 'o4', type: 'single' }, { source: 'o4', target: 'h4', type: 'single' },
        { source: 'c6', target: 'o5', type: 'single' }, { source: 'o5', target: 'h5', type: 'single' },
        { source: 'c1', target: 'h6', type: 'single' }, { source: 'c1', target: 'h7', type: 'single' },
        { source: 'c3', target: 'h8', type: 'single' },
        { source: 'c4', target: 'h9', type: 'single' },
        { source: 'c5', target: 'h10', type: 'single' },
        { source: 'c6', target: 'h11', type: 'single' }, { source: 'c6', target: 'h12', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NITROUS_OXIDE,
    atoms: {
      [PARTICLE_TYPES.NITROGEN]: 2,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
    bonds: {
      triple: 1,
      single: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'n2', type: PARTICLE_TYPES.NITROGEN },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN }
      ],
      edges: [
        { source: 'n1', target: 'n2', type: 'triple' },
        { source: 'n2', target: 'o1', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.FORMALDEHYDE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 2,
    },
    bonds: {
      double: 1,
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'o1', type: 'double' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ACETYLENE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 2,
      [PARTICLE_TYPES.HYDROGEN]: 2,
    },
    bonds: {
      triple: 1,
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'triple' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c2', target: 'h2', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.HYDROGEN_CYANIDE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 1,
    },
    bonds: {
      triple: 1,
      single: 1,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'n1', type: 'triple' },
        { source: 'c1', target: 'h1', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.METHANOL,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 4,
    },
    bonds: {
      single: 5,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
      ],
      edges: [
        { source: 'c1', target: 'o1', type: 'single' },
        { source: 'o1', target: 'h4', type: 'single' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.SULFUR_DIOXIDE,
    atoms: {
      [PARTICLE_TYPES.SULFUR]: 1,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      double: 2,
    },
    structure: {
      nodes: [
        { id: 's1', type: PARTICLE_TYPES.SULFUR },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
      ],
      edges: [
        { source: 's1', target: 'o1', type: 'double' },
        { source: 's1', target: 'o2', type: 'double' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NITROGEN_DIOXIDE,
    atoms: {
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      single: 1,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
      ],
      edges: [
        { source: 'n1', target: 'o1', type: 'double' },
        { source: 'n1', target: 'o2', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.PROPANE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 3,
      [PARTICLE_TYPES.HYDROGEN]: 8,
    },
    bonds: {
      single: 10,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        ...Array.from({length: 8}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN })),
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c2', target: 'h4', type: 'single' },
        { source: 'c2', target: 'h5', type: 'single' },
        { source: 'c3', target: 'h6', type: 'single' },
        { source: 'c3', target: 'h7', type: 'single' },
        { source: 'c3', target: 'h8', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.BUTANE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 4,
      [PARTICLE_TYPES.HYDROGEN]: 10,
    },
    bonds: {
      single: 13,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        ...Array.from({length: 10}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN })),
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'single' },
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c3', target: 'c4', type: 'single' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c2', target: 'h4', type: 'single' },
        { source: 'c2', target: 'h5', type: 'single' },
        { source: 'c3', target: 'h6', type: 'single' },
        { source: 'c3', target: 'h7', type: 'single' },
        { source: 'c4', target: 'h8', type: 'single' },
        { source: 'c4', target: 'h9', type: 'single' },
        { source: 'c4', target: 'h10', type: 'single' },
      ]
    }
  },
  {
    type: PARTICLE_TYPES.SODIUM_HYDROXIDE,
    atoms: {
      [PARTICLE_TYPES.SODIUM]: 1,
      [PARTICLE_TYPES.OXYGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 1,
    },
    bonds: {
      single: 2,
    },
    structure: {
      nodes: [
        { id: 'na1', type: PARTICLE_TYPES.SODIUM },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN }
      ],
      edges: [
        { source: 'na1', target: 'o1', type: 'single' },
        { source: 'o1', target: 'h1', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.NITRIC_ACID,
    atoms: {
      [PARTICLE_TYPES.HYDROGEN]: 1,
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.OXYGEN]: 3,
    },
    bonds: {
      single: 3,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN }
      ],
      edges: [
        { source: 'n1', target: 'o1', type: 'double' },
        { source: 'n1', target: 'o2', type: 'single' },
        { source: 'n1', target: 'o3', type: 'single' },
        { source: 'o3', target: 'h1', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.IRON_OXIDE,
    atoms: {
      [PARTICLE_TYPES.IRON]: 2,
      [PARTICLE_TYPES.OXYGEN]: 3,
    },
    bonds: {
      single: 6,
    },
    structure: {
      nodes: [
        { id: 'fe1', type: PARTICLE_TYPES.IRON },
        { id: 'fe2', type: PARTICLE_TYPES.IRON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN }
      ],
      edges: [
        { source: 'fe1', target: 'o1', type: 'single' },
        { source: 'fe1', target: 'o2', type: 'single' },
        { source: 'fe1', target: 'o3', type: 'single' },
        { source: 'fe2', target: 'o1', type: 'single' },
        { source: 'fe2', target: 'o2', type: 'single' },
        { source: 'fe2', target: 'o3', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.IRON_SULFIDE,
    atoms: {
      [PARTICLE_TYPES.IRON]: 1,
      [PARTICLE_TYPES.SULFUR]: 1,
    },
    bonds: {
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'fe1', type: PARTICLE_TYPES.IRON },
        { id: 's1', type: PARTICLE_TYPES.SULFUR }
      ],
      edges: [
        { source: 'fe1', target: 's1', type: 'double' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ETHYLENE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 2,
      [PARTICLE_TYPES.HYDROGEN]: 4,
    },
    bonds: {
      double: 1,
      single: 4,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN }
      ],
      edges: [
        { source: 'c1', target: 'c2', type: 'double' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c2', target: 'h3', type: 'single' },
        { source: 'c2', target: 'h4', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.BAKING_SODA,
    atoms: {
      [PARTICLE_TYPES.SODIUM]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 1,
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 3,
    },
    bonds: {
      single: 4,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'na1', type: PARTICLE_TYPES.SODIUM },
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN }
      ],
      edges: [
        { source: 'c1', target: 'o1', type: 'double' },
        { source: 'c1', target: 'o2', type: 'single' },
        { source: 'c1', target: 'o3', type: 'single' },
        { source: 'o3', target: 'h1', type: 'single' },
        { source: 'o2', target: 'na1', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.CARBONIC_ACID,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 1,
      [PARTICLE_TYPES.OXYGEN]: 3,
      [PARTICLE_TYPES.HYDROGEN]: 2,
    },
    bonds: {
      single: 4,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN }
      ],
      edges: [
        { source: 'c1', target: 'o1', type: 'double' },
        { source: 'c1', target: 'o2', type: 'single' },
        { source: 'c1', target: 'o3', type: 'single' },
        { source: 'o2', target: 'h1', type: 'single' },
        { source: 'o3', target: 'h2', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.AMMONIUM_HYDROXIDE,
    atoms: {
      [PARTICLE_TYPES.NITROGEN]: 1,
      [PARTICLE_TYPES.HYDROGEN]: 5,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
    bonds: {
      single: 6,
    },
    structure: {
      nodes: [
        { id: 'n1', type: PARTICLE_TYPES.NITROGEN },
        { id: 'h1', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h2', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h3', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'h4', type: PARTICLE_TYPES.HYDROGEN },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'h5', type: PARTICLE_TYPES.HYDROGEN }
      ],
      edges: [
        { source: 'n1', target: 'h1', type: 'single' },
        { source: 'n1', target: 'h2', type: 'single' },
        { source: 'n1', target: 'h3', type: 'single' },
        { source: 'n1', target: 'h4', type: 'single' },
        { source: 'n1', target: 'o1', type: 'single' },
        { source: 'o1', target: 'h5', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ACETONE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 3,
      [PARTICLE_TYPES.HYDROGEN]: 6,
      [PARTICLE_TYPES.OXYGEN]: 1,
    },
    bonds: {
      single: 8,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        ...Array.from({length: 6}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN }))
      ],
      edges: [
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'c1', type: 'single' },
        { source: 'c2', target: 'c3', type: 'single' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c3', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' },
        { source: 'c3', target: 'h6', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.ETHYL_ACETATE,
    atoms: {
      [PARTICLE_TYPES.CARBON]: 4,
      [PARTICLE_TYPES.HYDROGEN]: 8,
      [PARTICLE_TYPES.OXYGEN]: 2,
    },
    bonds: {
      single: 11,
      double: 1,
    },
    structure: {
      nodes: [
        { id: 'c1', type: PARTICLE_TYPES.CARBON },
        { id: 'c2', type: PARTICLE_TYPES.CARBON },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'c3', type: PARTICLE_TYPES.CARBON },
        { id: 'c4', type: PARTICLE_TYPES.CARBON },
        ...Array.from({length: 8}, (_, i) => ({ id: `h${i+1}`, type: PARTICLE_TYPES.HYDROGEN }))
      ],
      edges: [
        { source: 'c2', target: 'o1', type: 'double' },
        { source: 'c2', target: 'c1', type: 'single' },
        { source: 'c2', target: 'o2', type: 'single' },
        { source: 'o2', target: 'c3', type: 'single' },
        { source: 'c3', target: 'c4', type: 'single' },
        { source: 'c1', target: 'h1', type: 'single' },
        { source: 'c1', target: 'h2', type: 'single' },
        { source: 'c1', target: 'h3', type: 'single' },
        { source: 'c3', target: 'h4', type: 'single' },
        { source: 'c3', target: 'h5', type: 'single' },
        { source: 'c4', target: 'h6', type: 'single' },
        { source: 'c4', target: 'h7', type: 'single' },
        { source: 'c4', target: 'h8', type: 'single' }
      ]
    }
  },
  {
    type: PARTICLE_TYPES.POTASSIUM_PERMANGANATE,
    atoms: {
      [PARTICLE_TYPES.POTASSIUM]: 1,
      [PARTICLE_TYPES.MANGANESE]: 1,
      [PARTICLE_TYPES.OXYGEN]: 4,
    },
    bonds: {
      single: 2,
      double: 3,
    },
    structure: {
      nodes: [
        { id: 'k1', type: PARTICLE_TYPES.POTASSIUM },
        { id: 'mn1', type: PARTICLE_TYPES.MANGANESE },
        { id: 'o1', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o2', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o3', type: PARTICLE_TYPES.OXYGEN },
        { id: 'o4', type: PARTICLE_TYPES.OXYGEN }
      ],
      edges: [
        { source: 'mn1', target: 'o1', type: 'double' },
        { source: 'mn1', target: 'o2', type: 'double' },
        { source: 'mn1', target: 'o3', type: 'double' },
        { source: 'mn1', target: 'o4', type: 'single' },
        { source: 'o4', target: 'k1', type: 'single' }
      ]
    }
  },
];