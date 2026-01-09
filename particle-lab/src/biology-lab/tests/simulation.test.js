import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBioSimulation } from '../hooks/useBioSimulation';
import { useBioStore } from '../store';

// Mock requestAnimationFrame to control ticks
const mockRequestAnimationFrame = (callback) => {
  return setTimeout(() => callback(performance.now()), 16);
};
const mockCancelAnimationFrame = (id) => clearTimeout(id);

describe('Biology Lab Simulation', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', mockRequestAnimationFrame);
    vi.stubGlobal('cancelAnimationFrame', mockCancelAnimationFrame);
    vi.useFakeTimers();
    
    useBioStore.setState({
      agents: [],
      foodItems: [],
      soup: { glucose: 100, aminoAcids: 0, lipids: 0 },
      isRunning: false,
    });
  });

  it('should move agents when running', () => {
    const agent = { 
        id: 'a1', x: 400, y: 400, vx: 1, vy: 0, energy: 100, radius: 15,
        genome: { speed: 1, metabolism: 1, diet: 0 } 
    };
    useBioStore.setState({ agents: [agent], isRunning: true });

    renderHook(() => useBioSimulation());

    // Advance time
    vi.advanceTimersByTime(100);

    const updatedAgent = useBioStore.getState().agents[0];
    expect(updatedAgent.x).not.toBe(400); // Should have moved
  });

  it('should consume food when colliding', () => {
    const agent = { 
        id: 'a1', x: 400, y: 400, vx: 0, vy: 0, energy: 100, radius: 15,
        genome: { speed: 1, metabolism: 1, diet: 0 } 
    };
    const food = { id: 'f1', x: 405, y: 400, energy: 20 }; // Within radius
    
    useBioStore.setState({ agents: [agent], foodItems: [food], isRunning: true });

    renderHook(() => useBioSimulation());

    vi.advanceTimersByTime(100); 

    const state = useBioStore.getState();
    expect(state.foodItems).toHaveLength(0); // Food eaten
    expect(state.agents[0].energy).toBeGreaterThan(100); 
  });

  it('should reproduce (mitosis) when energy is high', () => {
    const agent = { 
        id: 'a1', x: 400, y: 400, energy: 1000, 
        radius: 5,
        genome: { speed: 1, metabolism: 1, diet: 0 } 
    };
    
    useBioStore.setState({ agents: [agent], isRunning: true });

    renderHook(() => useBioSimulation());

    // Stage 1: Prime the timer
    vi.advanceTimersByTime(100);
    // Stage 2: Run the logic
    vi.advanceTimersByTime(100);

    const agents = useBioStore.getState().agents;
    expect(agents.length).toBeGreaterThanOrEqual(2);
  });

  it('should die (starvation) when energy is zero', () => {
    const agent = { 
        id: 'a1', x: 400, y: 400, energy: 0.1, radius: 15,
        genome: { speed: 1, metabolism: 100, diet: 0 } // High burn
    };
    
    useBioStore.setState({ agents: [agent], isRunning: true });

    renderHook(() => useBioSimulation());

    vi.advanceTimersByTime(100);

    const agents = useBioStore.getState().agents;
    expect(agents).toHaveLength(0); // Should be dead
  });

  it('should exhibit chemotaxis (move towards food)', () => {
    const agent = { 
        id: 'a1', x: 400, y: 400, vx: 0, vy: 0, energy: 100, radius: 15,
        genome: { speed: 5, metabolism: 1, diet: 0, sense: 300 } 
    };
    // Food placed to the right
    const food = { id: 'f1', x: 450, y: 400, energy: 20 }; 
    
    useBioStore.setState({ agents: [agent], foodItems: [food], isRunning: true });

    renderHook(() => useBioSimulation());

    vi.advanceTimersByTime(100);

    const updatedAgent = useBioStore.getState().agents[0];
    expect(updatedAgent.vx).toBeGreaterThan(0);
  });
});
