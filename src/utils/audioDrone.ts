// Audio helper for gentle temple bell chime (zero oscillator drones to prevent noise)

class SacredAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playBellChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = 587.33; // Soft D5 bell

      [baseFreq, baseFreq * 2.01].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = 0.08 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.0);
      });
    } catch {
      // Audio autoplay restrictions
    }
  }

  // Safe dummy methods to prevent breaking any callers
  public startDrone(_vol?: number) {}
  public stopDrone() {}
  public toggleDrone(_vol?: number): boolean { return false; }
  public getStatus(): boolean { return false; }
}

export const sacredAudio = new SacredAudioSynthesizer();
