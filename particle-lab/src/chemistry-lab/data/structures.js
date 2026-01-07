import { CHEMICALS } from './chemicals';

// Helper for centering. SVG viewbox is 200x150. Center is 100, 75.
const CX = 100;
const CY = 75;

export const MOLECULAR_STRUCTURES = {
  H2O: {
    atoms: [
      { x: CX, y: CY, label: 'O', size: 16 },
      { x: CX - 40, y: CY + 30, label: 'H' },
      { x: CX + 40, y: CY + 30, label: 'H' }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 }
    ]
  },
  CO2: {
    atoms: [
      { x: CX, y: CY, label: 'C', size: 14 },
      { x: CX - 50, y: CY, label: 'O', size: 14 },
      { x: CX + 50, y: CY, label: 'O', size: 14 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' }
    ]
  },
  OXYGEN: {
    atoms: [
      { x: CX - 20, y: CY, label: 'O', size: 16 },
      { x: CX + 20, y: CY, label: 'O', size: 16 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' }
    ]
  },
  HYDROGEN: {
    atoms: [
      { x: CX - 20, y: CY, label: 'H' },
      { x: CX + 20, y: CY, label: 'H' }
    ],
    bonds: [
      { from: 0, to: 1 }
    ]
  },
  NITROGEN: {
    atoms: [
      { x: CX - 20, y: CY, label: 'N', size: 14 },
      { x: CX + 20, y: CY, label: 'N', size: 14 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'triple' } // We will need to support triple in renderer
    ]
  },
  NaCl: {
    labels: [{ x: CX, y: 20, text: 'Ionic Lattice' }, { x: CX - 20, y: CY - 20, text: '+' }, { x: CX + 20, y: CY - 20, text: '-' }],
    atoms: [
      { x: CX - 20, y: CY, label: 'Na', size: 16 },
      { x: CX + 20, y: CY, label: 'Cl', size: 18 }
    ]
  },
  METHANOL: {
    atoms: [
      { x: CX, y: CY, label: 'C', size: 14 },       // 0
      { x: CX + 40, y: CY, label: 'O', size: 14 },  // 1
      { x: CX - 30, y: CY - 30, label: 'H' },       // 2
      { x: CX - 30, y: CY + 30, label: 'H' },       // 3
      { x: CX - 40, y: CY, label: 'H' },            // 4
      { x: CX + 60, y: CY - 20, label: 'H' }        // 5
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 1, to: 5 }
    ]
  },
  ETHANOL: {
    atoms: [
      { x: CX - 20, y: CY, label: 'C', size: 14 }, // 0
      { x: CX + 20, y: CY, label: 'C', size: 14 }, // 1
      { x: CX + 50, y: CY - 20, label: 'O', size: 12 }, // 2
      { x: CX - 40, y: CY - 20, label: 'H' }, // 3
      { x: CX - 40, y: CY + 20, label: 'H' }, // 4
      { x: CX - 50, y: CY, label: 'H' }, // 5
      { x: CX + 20, y: CY + 30, label: 'H' }, // 6
      { x: CX + 20, y: CY - 30, label: 'H' }, // 7
      { x: CX + 70, y: CY - 10, label: 'H' } // 8
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 8 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 0, to: 5 },
      { from: 1, to: 6 },
      { from: 1, to: 7 }
    ]
  },
  VINEGAR: {
    atoms: [
      { x: CX - 20, y: CY + 10, label: 'C', size: 14 }, // 0
      { x: CX + 20, y: CY + 10, label: 'C', size: 14 }, // 1
      { x: CX + 20, y: CY - 20, label: 'O', size: 12 }, // 2
      { x: CX + 50, y: CY + 30, label: 'O', size: 12 }, // 3
      { x: CX - 40, y: CY + 30, label: 'H' }, // 4
      { x: CX - 40, y: CY - 10, label: 'H' }, // 5
      { x: CX - 50, y: CY + 10, label: 'H' }  // 6
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2, type: 'double' },
      { from: 1, to: 3 },
      { from: 0, to: 4 },
      { from: 0, to: 5 },
      { from: 0, to: 6 }
    ]
  },
  ETHYLENE: {
    atoms: [
      { x: CX - 20, y: CY, label: 'C', size: 14 },
      { x: CX + 20, y: CY, label: 'C', size: 14 },
      { x: CX - 40, y: CY - 25, label: 'H' },
      { x: CX - 40, y: CY + 25, label: 'H' },
      { x: CX + 40, y: CY - 25, label: 'H' },
      { x: CX + 40, y: CY + 25, label: 'H' }
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 1, to: 5 }
    ]
  },
  POLYETHYLENE: {
    labels: [{ x: CX, y: 30, text: 'Polymer Chain' }],
    // Simplified representation without duplicating tons of atoms
    atoms: [
      { x: CX - 60, y: CY, label: 'C', size: 12 },
      { x: CX - 20, y: CY, label: 'C', size: 12 },
      { x: CX + 20, y: CY, label: 'C', size: 12 },
      { x: CX + 60, y: CY, label: 'C', size: 12 }
    ],
    // Draw horizontal backbone manually or via bonds
    bonds: [
       { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }
    ],
    // Custom decoration for the "chain" extending out
    custom: [
       { type: 'line', x1: CX - 80, y1: CY, x2: CX - 60, y2: CY, stroke: 'white', strokeWidth: 3 },
       { type: 'line', x1: CX + 60, y1: CY, x2: CX + 80, y2: CY, stroke: 'white', strokeWidth: 3 },
       // Hydrogens
       ...[-60, -20, 20, 60].flatMap(x => [
           { type: 'line', x1: CX + x, y1: CY, x2: CX + x, y2: CY - 20, stroke: 'white' },
           { type: 'line', x1: CX + x, y1: CY, x2: CX + x, y2: CY + 20, stroke: 'white' },
           { type: 'circle', cx: CX + x, cy: CY - 25, r: 4, fill: 'white' },
           { type: 'circle', cx: CX + x, cy: CY + 25, r: 4, fill: 'white' }
       ])
    ]
  },
  AMMONIA: {
    atoms: [
      { x: CX, y: CY, label: 'N', size: 16 },
      { x: CX, y: CY - 30, label: 'H' },
      { x: CX - 25, y: CY + 20, label: 'H' },
      { x: CX + 25, y: CY + 20, label: 'H' }
    ],
    bonds: [
      { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }
    ]
  },
  SULFUR: {
    labels: [{ x: CX, y: CY, text: 'S₈', fontSize: 40, color: '#FFFF30', fontWeight: 'bold' }]
  },
  CARBON: {
    labels: [
      { x: CX, y: CY, text: 'C', fontSize: 40, color: '#333', stroke: 'white', fontWeight: 'bold' },
      { x: CX, y: CY + 40, text: 'Graphite / Diamond', fontSize: 10 }
    ]
  },
  BAKING_SODA: {
    labels: [{ x: CX, y: 20, text: 'Ionic Structure' }, { x: CX - 40, y: CY - 20, text: '+' }, { x: CX + 40, y: CY - 40, text: '-' }],
    atoms: [
      { x: CX - 40, y: CY, label: 'Na', size: 16 }, // 0
      { x: CX + 40, y: CY, label: 'C', size: 14 }, // 1 (shifted right group center)
      { x: CX + 40, y: CY - 25, label: 'O', size: 12 }, // 2
      { x: CX + 20, y: CY + 20, label: 'O', size: 12 }, // 3
      { x: CX + 65, y: CY + 15, label: 'O', size: 12 }, // 4
      { x: CX + 80, y: CY + 25, label: 'H' } // 5
    ],
    bonds: [
      { from: 1, to: 2, type: 'double' },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ]
  },
  // For metals, we can use a helper function or just static data in the renderer, 
  // but to keep it data driven, we can define the grid points.
  IRON: {
     labels: [{ x: CX, y: 20, text: 'Metallic Lattice' }],
     atoms: [-30, 0, 30].flatMap(dx => [-30, 0, 30].map(dy => ({ x: CX + dx, y: CY + dy, label: '', color: '#E06633', size: 12 })))
  },
  STEEL: {
     labels: [{ x: CX, y: 20, text: 'Metallic Lattice + Carbon' }],
     atoms: [
        ...[-30, 0, 30].flatMap(dx => [-30, 0, 30].map(dy => ({ x: CX + dx, y: CY + dy, label: '', color: '#E06633', size: 12 }))),
        { x: CX + 15, y: CY + 15, label: '', color: '#333', size: 5 }
     ]
  },
  MAGNESIUM: {
     labels: [{ x: CX, y: 20, text: 'Metallic Lattice' }],
     atoms: [-30, 0, 30].flatMap(dx => [-25, 25].map(dy => ({ x: CX + dx + (dy > 0 ? 15 : 0), y: CY + dy, label: '', color: '#8AFF00', size: 14 })))
  },
  POTASSIUM_PERMANGANATE: {
    labels: [{ x: CX - 50, y: CY - 20, text: '+' }, { x: CX + 70, y: CY - 20, text: '-' }],
    atoms: [
      { x: CX - 50, y: CY, label: 'K', size: 16 }, // 0
      { x: CX + 30, y: CY, label: 'Mn', size: 14, color: '#A020F0' }, // 1
      { x: CX + 30, y: CY - 30, label: 'O', size: 12 }, // 2
      { x: CX + 5, y: CY + 15, label: 'O', size: 12 }, // 3
      { x: CX + 55, y: CY + 15, label: 'O', size: 12 }, // 4
      { x: CX + 30, y: CY + 35, label: 'O', size: 12 } // 5
    ],
    bonds: [
      { from: 1, to: 2, type: 'double' },
      { from: 1, to: 3, type: 'double' },
      { from: 1, to: 4, type: 'double' },
      { from: 1, to: 5 }
    ]
  },
  CHLORINE: {
    atoms: [
      { x: CX - 20, y: CY, label: 'Cl', size: 18 },
      { x: CX + 20, y: CY, label: 'Cl', size: 18 }
    ],
    bonds: [{ from: 0, to: 1 }]
  },
  SODIUM_HYDROXIDE: {
    labels: [{ x: CX, y: 20, text: 'Ionic' }, { x: CX - 30, y: CY - 20, text: '+' }, { x: CX + 30, y: CY - 20, text: '-' }],
    atoms: [
      { x: CX - 30, y: CY, label: 'Na', size: 16 },
      { x: CX + 30, y: CY, label: 'O', size: 14 }, // 1
      { x: CX + 55, y: CY, label: 'H' } // 2
    ],
    bonds: [{ from: 1, to: 2 }]
  },
  HYDROCHLORIC_ACID: {
    atoms: [
      { x: CX - 20, y: CY, label: 'H' },
      { x: CX + 20, y: CY, label: 'Cl', size: 18 }
    ],
    bonds: [{ from: 0, to: 1 }]
  },
  NITRIC_ACID: {
    atoms: [
      { x: CX, y: CY, label: 'N', size: 14 }, // 0
      { x: CX - 30, y: CY + 20, label: 'O', size: 12 }, // 1
      { x: CX + 30, y: CY + 20, label: 'O', size: 12 }, // 2
      { x: CX, y: CY - 30, label: 'O', size: 12 }, // 3
      { x: CX + 20, y: CY - 40, label: 'H' } // 4
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 3, to: 4 }
    ]
  },
  ACETONE: {
    atoms: [
      { x: CX, y: CY, label: 'C', size: 14 }, // 0 Center
      { x: CX, y: CY - 30, label: 'O', size: 12 }, // 1 Top
      { x: CX - 30, y: CY + 20, label: 'C', size: 12 }, // 2 Left
      { x: CX - 45, y: CY + 35, label: 'H' }, // 3 Left H
      { x: CX + 30, y: CY + 20, label: 'C', size: 12 }, // 4 Right
      { x: CX + 45, y: CY + 35, label: 'H' } // 5 Right H
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2 },
      { from: 0, to: 4 },
      { from: 2, to: 3 },
      { from: 4, to: 5 }
    ]
  },
  IRON_OXIDE: {
    labels: [{ x: CX, y: 20, text: 'Crystal Lattice' }],
    atoms: [
      { x: CX - 20, y: CY, label: 'Fe', size: 16 }, // 0
      { x: CX + 20, y: CY, label: 'Fe', size: 16 }, // 1
      { x: CX, y: CY - 25, label: 'O', size: 12 }, // 2
      { x: CX, y: CY + 25, label: 'O', size: 12 } // 3
    ],
    bonds: [
      { from: 0, to: 2 }, { from: 1, to: 2 },
      { from: 0, to: 3 }, { from: 1, to: 3 }
    ]
  },
  SO2: {
    atoms: [
      { x: CX, y: CY, label: 'S', size: 16 }, // 0
      { x: CX - 30, y: CY + 20, label: 'O', size: 14 }, // 1
      { x: CX + 30, y: CY + 20, label: 'O', size: 14 } // 2
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' }
    ]
  },
  CARBONIC_ACID: {
    atoms: [
      { x: CX, y: CY, label: 'C', size: 14 }, // 0
      { x: CX, y: CY - 30, label: 'O', size: 12 }, // 1
      { x: CX - 30, y: CY + 20, label: 'O', size: 12 }, // 2
      { x: CX + 30, y: CY + 20, label: 'O', size: 12 }, // 3
      { x: CX - 40, y: CY + 35, label: 'H' }, // 4
      { x: CX + 40, y: CY + 35, label: 'H' } // 5
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2 }, { from: 0, to: 3 },
      { from: 2, to: 4 }, { from: 3, to: 5 }
    ]
  },
  SULFURIC_ACID: {
    atoms: [
      { x: CX, y: CY, label: 'S', size: 16 }, // 0
      { x: CX, y: CY - 30, label: 'O', size: 12 }, // 1
      { x: CX, y: CY + 30, label: 'O', size: 12 }, // 2
      { x: CX - 30, y: CY, label: 'O', size: 12 }, // 3
      { x: CX + 30, y: CY, label: 'O', size: 12 }, // 4
      { x: CX - 45, y: CY + 10, label: 'H' }, // 5
      { x: CX + 45, y: CY + 10, label: 'H' } // 6
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' },
      { from: 0, to: 3 }, { from: 0, to: 4 },
      { from: 3, to: 5 }, { from: 4, to: 6 }
    ]
  },
  IRON_SULFIDE: {
    labels: [{ x: CX, y: 20, text: 'Lattice' }],
    atoms: [
      { x: CX - 20, y: CY, label: 'Fe', size: 16 }, // 0
      { x: CX + 20, y: CY, label: 'S', size: 16 } // 1
    ],
    bonds: [{ from: 0, to: 1, type: 'double' }]
  },
  AMMONIUM_HYDROXIDE: {
    labels: [{ x: CX, y: 20, text: 'Solution' }, { x: CX - 5, y: CY - 20, text: '+' }, { x: CX + 65, y: CY - 10, text: '-' }],
    atoms: [
      // NH4
      { x: CX - 30, y: CY, label: 'N', size: 14 }, // 0
      { x: CX - 30, y: CY - 20, label: 'H' }, // 1
      { x: CX - 30, y: CY + 20, label: 'H' }, // 2
      { x: CX - 50, y: CY, label: 'H' }, // 3
      { x: CX - 10, y: CY, label: 'H' }, // 4
      // OH
      { x: CX + 40, y: CY, label: 'O', size: 12 }, // 5
      { x: CX + 60, y: CY, label: 'H' } // 6
    ],
    bonds: [
      { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 },
      { from: 5, to: 6 }
    ]
  },
  ETHYL_ACETATE: {
    atoms: [
       { x: CX - 10, y: CY, label: 'C', size: 12 }, // 0 Carbonyl C
       { x: CX - 10, y: CY - 25, label: 'O', size: 10 }, // 1 Carbonyl O
       { x: CX - 40, y: CY + 15, label: 'C', size: 12 }, // 2 Methyl C
       { x: CX - 50, y: CY + 25, label: 'H' }, // 3 Methyl H
       { x: CX + 15, y: CY + 10, label: 'O', size: 10 }, // 4 Ether O
       { x: CX + 40, y: CY, label: 'C', size: 12 }, // 5 Ethyl C1
       { x: CX + 65, y: CY + 15, label: 'C', size: 12 }, // 6 Ethyl C2
       { x: CX + 75, y: CY + 25, label: 'H' } // 7 Ethyl H
    ],
    bonds: [
       { from: 0, to: 1, type: 'double' },
       { from: 0, to: 2 }, { from: 2, to: 3 },
       { from: 0, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }
    ]
  }
};
