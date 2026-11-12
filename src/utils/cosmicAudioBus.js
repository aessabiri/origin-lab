// Procedural WebAudio Synthesizer & Acoustic Telemetry Bus for Origin Lab // Argon

class CosmicAudioBus {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  initContext() {
    if (this.muted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          this.ctx = null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playChime(freq = 528, duration = 0.22, type = 'sine') {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.45, now + duration);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore in headless environments
    }
  }

  playSynthesisChord() {
    this.playChime(440, 0.28, 'triangle');
    setTimeout(() => this.playChime(659.25, 0.32, 'sine'), 70);
    setTimeout(() => this.playChime(880, 0.4, 'sine'), 140);
  }
}

export const cosmicAudio = new CosmicAudioBus();
