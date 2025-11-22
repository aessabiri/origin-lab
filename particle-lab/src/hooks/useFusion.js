import { useCallback } from 'react';
import { useStore } from '../store';

export const useFusion = () => {
  const { showMessage } = useStore();

  const handleFusion = useCallback(() => {
    // Placeholder for fusion logic
    showMessage('Fusion initiated!');
  }, [showMessage]);

  return { handleFusion };
};