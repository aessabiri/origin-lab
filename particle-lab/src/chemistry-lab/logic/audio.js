// Procedural Sound System for Chemistry Lab
// Uses Web Audio API to synthesize sounds without external assets.

const SOUNDS = {
    BUBBLE: 'bubble',
    BOIL: 'boil',
    HISS: 'hiss',
    BREAK: 'break',
    SUCCESS: 'success',
    POUR: 'pour'
};

class AudioSystem {
    constructor() {
        this.ctx = null;
        this.activeLoops = new Map(); // Map<string, { nodes: AudioNode[], gain: GainNode }>
        this.isMuted = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playOneShot(soundId) {
        this.init();
        this.resume();
        if (this.isMuted || !this.ctx) return;

        switch (soundId) {
            case SOUNDS.BREAK:
                this.synthBreak();
                break;
            case SOUNDS.BUBBLE:
                this.synthBubble();
                break;
            case SOUNDS.SUCCESS:
                this.synthSuccess();
                break;
            case SOUNDS.POUR:
                this.synthPour();
                break;
        }
    }

    startLoop(soundId, vesselId) {
        this.init();
        this.resume();
        const key = `${vesselId}-${soundId}`;
        if (this.isMuted || !this.ctx || this.activeLoops.has(key)) return;

        let nodes = [];
        switch (soundId) {
            case SOUNDS.BOIL:
                nodes = this.createBoilLoop();
                break;
            case SOUNDS.HISS:
                nodes = this.createHissLoop();
                break;
        }

        if (nodes.length > 0) {
            this.activeLoops.set(key, nodes);
        }
    }

    stopLoop(soundId, vesselId) {
        const key = `${vesselId}-${soundId}`;
        const loop = this.activeLoops.get(key);
        if (!loop) return;

        loop.forEach(node => {
            if (node.stop) node.stop();
            node.disconnect();
        });
        this.activeLoops.delete(key);
    }

    // --- Synthesizers ---

    synthBreak() {
        const { ctx } = this;
        const duration = 0.5;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noise = this.createNoiseBuffer();
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noise;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        noiseSource.start();
        noiseSource.stop(ctx.currentTime + duration);
    }

    synthBubble() {
        const { ctx } = this;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150 + Math.random() * 100, now);
        osc.frequency.exponentialRampToValueAtTime(400 + Math.random() * 200, now + 0.1);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(now + 0.1);
    }

    synthSuccess() {
        const { ctx } = this;
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.4);
        });
    }

    synthPour() {
        const { ctx } = this;
        const now = ctx.currentTime;
        const duration = 0.2;
        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(400, now + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        noise.stop(now + duration);
    }

    createBoilLoop() {
        const { ctx } = this;
        const now = ctx.currentTime;

        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 2; // Bubbling speed
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 100;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gain = ctx.createGain();
        gain.gain.value = 0.05;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        lfo.start();

        return [noise, lfo, filter, gain];
    }

    createHissLoop() {
        const { ctx } = this;
        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 1;

        const gain = ctx.createGain();
        gain.gain.value = 0.02;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();

        return [noise, filter, gain];
    }

    createNoiseBuffer() {
        if (!this.ctx) return null;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }
}

export const audioSystem = new AudioSystem();
export const SFX = SOUNDS;