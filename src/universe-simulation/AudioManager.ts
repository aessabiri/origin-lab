import * as THREE from 'three';

export class AudioManager {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private listener: THREE.AudioListener | null = null;
  private isStarted = false;
  private narrativeVoices: Record<string, string> = {
    'BIG_BANG': "The singularity ignites. Space and time begin their violent expansion.",
    'PLASMA': "Quark-gluon plasma forms a hot, opaque soup. The universe is a brilliant, blinding furnace.",
    'STELLAR_DAWN': "Darkness breaks. Gravity pulls primordial gases into the first stars, ending the cosmic dark ages.",
    'GALAXY_FORMATION': "Vast structures collapse. Stars cluster into spiraling islands of light across the void.",
    'SOLAR_SYSTEM': "A local nursery collapses. Our Sun ignites, forging a disk of dust into nine distinct worlds.",
    'EARTH': "A terrestrial spark. Cooling crust and heavy bombardment prepare the stage for the first breath of life."
  };

  public setListener(listener: THREE.AudioListener) {
    this.listener = listener;
  }

  public init() {
    if (this.isStarted) return;
    
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.context.createGain();
    this.filter = this.context.createBiquadFilter();
    
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(40, this.context.currentTime); // Low bass drone
    
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(200, this.context.currentTime);
    this.filter.Q.setValueAtTime(1, this.context.currentTime);

    this.oscillator.connect(this.filter);
    this.filter.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 2); // Fade in

    this.oscillator.start();
    this.isStarted = true;

    // Add subtle LFO for movement
    const lfo = this.context.createOscillator();
    const lfoGain = this.context.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, this.context.currentTime);
    lfoGain.gain.setValueAtTime(50, this.context.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    lfo.start();
  }

  public setIntensity(val: number) {
    if (!this.context || !this.oscillator || !this.filter) return;
    const freq = 40 + (val * 20);
    this.oscillator.frequency.setTargetAtTime(freq, this.context.currentTime, 0.5);
    
    // Dynamically adjust filter based on value
    const filterFreq = 200 + (val * 1500);
    this.filter.frequency.setTargetAtTime(filterFreq, this.context.currentTime, 1.0);
  }

  public playNarrative(epochKey: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const text = this.narrativeVoices[epochKey];
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.7;
    utterance.rate = 0.85;
    utterance.volume = 0.6;
    
    const voices = window.speechSynthesis.getVoices();
    const techVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('Google')));
    if (techVoice) utterance.voice = techVoice;

    window.speechSynthesis.speak(utterance);
  }
}
