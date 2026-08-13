import { REACTIONS } from '../data/reactions';

const reactionIndex = new Map();
let isInitialized = false;

const initReactionIndex = () => {
  if (isInitialized) return;
  
  REACTIONS.forEach(reaction => {
    Object.keys(reaction.inputs).forEach(ingredient => {
      if (!reactionIndex.has(ingredient)) {
        reactionIndex.set(ingredient, new Set());
      }
      reactionIndex.get(ingredient).add(reaction);
    });
  });
  
  isInitialized = true;
};

export const getCandidateReactions = (availableIngredients) => {
  if (!isInitialized) initReactionIndex();
  
  const candidates = new Set();
  
  // Only check reactions for ingredients we actually have
  Object.keys(availableIngredients).forEach(ing => {
    if (availableIngredients[ing] > 0) {
        const reactions = reactionIndex.get(ing);
        if (reactions) {
            reactions.forEach(r => candidates.add(r));
        }
    }
  });
  
  return candidates;
};
