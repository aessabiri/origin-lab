// Placeholder for SoundManager. 
// In a real app, this would load audio contexts.
// Here we provide a simple interface to be hooked up to audio files later.

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
        this.activeLoops = new Set();
        this.isMuted = false;
        // console.log('Audio System Initialized');
    }

    playOneShot(soundId) {
        if (this.isMuted) return;
        // console.log(`🔊 Playing SFX: ${soundId}`);
        // Implementation: new Audio(`/assets/sfx/${soundId}.mp3`).play();
    }

    startLoop(soundId, vesselId) {
        const key = `${vesselId}-${soundId}`;
        if (this.activeLoops.has(key)) return;
        
        this.activeLoops.add(key);
        // console.log(`🔄 Starting Loop: ${soundId} for ${vesselId}`);
    }

    stopLoop(soundId, vesselId) {
        const key = `${vesselId}-${soundId}`;
        if (!this.activeLoops.has(key)) return;
        
        this.activeLoops.delete(key);
        // console.log(`⏹️ Stopping Loop: ${soundId} for ${vesselId}`);
    }
}

export const audioSystem = new AudioSystem();
export const SFX = SOUNDS;
