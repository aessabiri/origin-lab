import { CHEMICAL_TYPES } from './chemicalInfo';

export const CHEMICAL_RECIPES = [
  {
    ingredients: {
      [CHEMICAL_TYPES.WATER]: 1,
      [CHEMICAL_TYPES.SALT]: 1,
    },
    product: CHEMICAL_TYPES.SALT_WATER,
  },
];
