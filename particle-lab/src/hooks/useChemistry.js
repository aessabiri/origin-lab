import { CHEMICAL_RECIPES } from '../constants/chemicalRecipes';

export const useChemistry = () => {
  const handleMixing = (contents) => {
    const ingredientCount = contents.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    for (const recipe of CHEMICAL_RECIPES) {
      const recipeIngredients = Object.keys(recipe.ingredients);
      const flaskIngredients = Object.keys(ingredientCount);

      if (recipeIngredients.length !== flaskIngredients.length) {
        continue;
      }

      const isMatch = recipeIngredients.every(
        (ingredient) =>
          recipe.ingredients[ingredient] === ingredientCount[ingredient]
      );

      if (isMatch) {
        return [recipe.product];
      }
    }

    return contents;
  };

  return { handleMixing };
};
