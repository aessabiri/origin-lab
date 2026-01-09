import { describe, it, expect } from 'vitest';
import { PARTICLE_TYPES } from '../constants/particles';
import { RECIPES } from '../recipes';
import { MOLECULE_RECIPES } from '../constants/moleculeRecipes';
import { POLYPEPTIDE_RECIPES } from '../constants/polypeptideRecipes';

describe('Data Integrity', () => {
  const validTypes = new Set(Object.values(PARTICLE_TYPES));

  it('all RECIPES outputs should be valid particle types', () => {
    RECIPES.forEach(recipe => {
      expect(validTypes.has(recipe.type), `Recipe output ${recipe.type} is not a defined PARTICLE_TYPE`).toBe(true);
    });
  });

  it('all RECIPES ingredients should be valid particle types', () => {
    RECIPES.forEach(recipe => {
      Object.keys(recipe.ingredients).forEach(ingredient => {
        expect(validTypes.has(ingredient), `Ingredient ${ingredient} in ${recipe.type} is not a valid PARTICLE_TYPE`).toBe(true);
      });
    });
  });

  it('all MOLECULE_RECIPES outputs should be valid', () => {
    MOLECULE_RECIPES.forEach(recipe => {
      expect(validTypes.has(recipe.type), `Molecule recipe output ${recipe.type} is invalid`).toBe(true);
    });
  });

  it('all MOLECULE_RECIPES atoms should be valid', () => {
    MOLECULE_RECIPES.forEach(recipe => {
      Object.keys(recipe.atoms).forEach(atom => {
        expect(validTypes.has(atom), `Atom ${atom} in ${recipe.type} is invalid`).toBe(true);
      });
    });
  });

  it('all POLYPEPTIDE_RECIPES outputs should be valid', () => {
    POLYPEPTIDE_RECIPES.forEach(recipe => {
      expect(validTypes.has(recipe.type), `Polypeptide recipe output ${recipe.type} is invalid`).toBe(true);
    });
  });
});
