import '@testing-library/jest-dom';

// Mock Web Audio API
class AudioContextMock {
  constructor() {
    this.state = 'suspended';
  }
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, disconnect: () => {}, start: () => {}, stop: () => {} }; }
  createGain() { return { gain: { value: 0, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {}, disconnect: () => {} }; }
  createBufferSource() { return { buffer: null, loop: false, connect: () => {}, disconnect: () => {}, start: () => {}, stop: () => {} }; }
  createBiquadFilter() { return { type: '', frequency: { value: 0, setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, Q: { value: 0 }, connect: () => {}, disconnect: () => {} }; }
  createBuffer() { return { getChannelData: () => new Float32Array(0) }; }
  resume() { this.state = 'running'; return Promise.resolve(); }
  get destination() { return {}; }
  get currentTime() { return 0; }
  get sampleRate() { return 44100; }
}

window.AudioContext = AudioContextMock;
window.webkitAudioContext = AudioContextMock;
