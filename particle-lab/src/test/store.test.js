import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';

describe('Particle Lab Store', () => {
  beforeEach(() => {
    useStore.setState({
      particles: [],
      bonds: [],
      message: '',
      isSandboxMode: false
    });
  });

  it('should add particles', () => {
    const { setParticles } = useStore.getState();
    const newParticles = [{ id: 'p1', type: 'proton', x: 0, y: 0 }];
    
    setParticles(newParticles);
    
    expect(useStore.getState().particles).toHaveLength(1);
    expect(useStore.getState().particles[0].type).toBe('proton');
  });

  it('should set bonds', () => {
    const { setBonds } = useStore.getState();
    const newBonds = [{ id: 'b1', particleA_id: 'p1', particleB_id: 'p2' }];
    
    setBonds(newBonds);
    
    expect(useStore.getState().bonds).toHaveLength(1);
  });

  it('should toggle sandbox mode', () => {
    const { handleToggleSandbox } = useStore.getState();
    
    handleToggleSandbox();
    expect(useStore.getState().isSandboxMode).toBe(true);
    
    handleToggleSandbox();
    expect(useStore.getState().isSandboxMode).toBe(false);
  });

  it('should clear canvas', () => {
    const { setParticles, handleEmptyCanvas } = useStore.getState();
    setParticles([{ id: 'p1', type: 'proton' }]);
    
    handleEmptyCanvas();
    
    expect(useStore.getState().particles).toHaveLength(0);
  });

  it('should show message temporarily', () => {
    // We can't easily test the timeout part without fake timers, 
    // but we can test setting the message.
    const { showMessage } = useStore.getState();
    
    showMessage('Test Message');
    expect(useStore.getState().message).toBe('Test Message');
  });
});
