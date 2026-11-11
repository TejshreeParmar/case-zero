
class SoundEngine {
  private ctx: AudioContext | null = null;

  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  private rainGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private rainSource: AudioBufferSourceNode | null = null;
  private musicSource: AudioBufferSourceNode | null = null;
  private musicOscillators: OscillatorNode[] = [];

  private isAmbiencePlaying = false;

  private masterVolume = 0.8;
  private sfxVolume = 0.8;
  private ambientVolume = 0.3;

  // Piano is dominant; rain is barely noticeable.
  private rainVolume = 0.035;
  private musicVolume = 0.4;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }).webkitAudioContext;

      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = this.ambientVolume;
      this.ambientGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public setVolumes(master: number, sfx: number, ambient: number) {
    this.masterVolume = master;
    this.sfxVolume = sfx;
    this.ambientVolume = ambient;

    if (this.ctx && this.masterGain && this.sfxGain && this.ambientGain) {
      const now = this.ctx.currentTime;

      this.masterGain.gain.setTargetAtTime(master, now, 0.05);
      this.sfxGain.gain.setTargetAtTime(sfx, now, 0.05);
      this.ambientGain.gain.setTargetAtTime(ambient, now, 0.05);
    }
  }

  public setRainVolume(volume: number) {
    this.rainVolume = Math.max(0, Math.min(1, volume));

    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setTargetAtTime(
        this.rainVolume,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(
        this.musicVolume,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  // -------------------------
  // SOUND EFFECTS
  // -------------------------

  public playHover() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio context restriction
    }
  }

  public playClick() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio context restriction
    }
  }

  public playConfirm() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;

      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(start);
        osc.stop(start + 0.15);
      });
    } catch {
      // Audio context restriction
    }
  }

  public playBack() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;

      [587.33, 440].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(start);
        osc.stop(start + 0.12);
      });
    } catch {
      // Audio context restriction
    }
  }

  public playTerminalKey() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      const pitch = 1200 + (Math.random() - 0.5) * 400;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio context restriction
    }
  }

  public playClueFound() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      const freqs = [261.63, 311.13, 392.00, 466.16];

      freqs.forEach((freq, i) => {
        if (!this.ctx || !this.sfxGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch {
      // Audio context restriction
    }
  }

  public playSuccess() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.1;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch {
      // Audio context restriction
    }
  }

  public playError() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(110, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio context restriction
    }
  }

  public playCoffee() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;

      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 + Math.random() * 400, start);

        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.07);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(start);
        osc.stop(start + 0.08);
      }
    } catch {
      // Audio context restriction
    }
  }

  // -------------------------
  // VERY FAINT RAIN
  // -------------------------

  private createRainBuffer(): AudioBuffer {
    if (!this.ctx) {
      throw new Error('Audio context not initialized');
    }

    const duration = 8;
    const sampleRate = this.ctx.sampleRate;

    const buffer = this.ctx.createBuffer(
      1,
      sampleRate * duration,
      sampleRate
    );

    const data = buffer.getChannelData(0);
    let lastValue = 0;

    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;

      lastValue = (lastValue + 0.003 * white) / 1.003;

      // Extremely low-level background rainfall.
      data[i] = lastValue * 0.6;
    }

    return buffer;
  }

  // -------------------------
  // SLOWER, FULLER PIANO
  // -------------------------

  private createMusicBuffer(): AudioBuffer {
    if (!this.ctx) {
      throw new Error('Audio context not initialized');
    }

    const duration = 24;
    const sampleRate = this.ctx.sampleRate;

    const buffer = this.ctx.createBuffer(
      1,
      sampleRate * duration,
      sampleRate
    );

    const data = buffer.getChannelData(0);

    // Original minor-key detective melody.
    const notes = [
      { frequency: 440.00, time: 0, length: 2.2 },
      { frequency: 523.25, time: 1.1, length: 1.8 },
      { frequency: 587.33, time: 2.2, length: 2 },
      { frequency: 523.25, time: 3.3, length: 2 },

      { frequency: 392.00, time: 4.4, length: 2.2 },
      { frequency: 440.00, time: 5.5, length: 2 },
      { frequency: 523.25, time: 6.6, length: 2.2 },
      { frequency: 493.88, time: 7.7, length: 2 },

      { frequency: 349.23, time: 8.8, length: 2.2 },
      { frequency: 392.00, time: 9.9, length: 2 },
      { frequency: 440.00, time: 11, length: 2.2 },
      { frequency: 523.25, time: 12.1, length: 2 },

      { frequency: 493.88, time: 13.2, length: 2 },
      { frequency: 440.00, time: 14.3, length: 2.2 },
      { frequency: 392.00, time: 15.4, length: 2 },
      { frequency: 349.23, time: 16.5, length: 2.2 },

      { frequency: 392.00, time: 17.6, length: 2 },
      { frequency: 440.00, time: 18.7, length: 2.2 },
      { frequency: 523.25, time: 19.8, length: 2 },
      { frequency: 587.33, time: 20.9, length: 2.2 },
      { frequency: 523.25, time: 22, length: 2 }
    ];

    notes.forEach(({ frequency, time, length }) => {
      const start = Math.floor(time * sampleRate);
      const noteLength = Math.floor(length * sampleRate);

      for (
        let i = 0;
        i < noteLength && start + i < data.length;
        i++
      ) {
        const t = i / sampleRate;

        // Gentle attack and natural decay.
        const attack = Math.min(1, t / 0.025);
        const decay = Math.exp(-t * 1.5);
        const envelope = attack * decay;

        const fundamental = Math.sin(
          2 * Math.PI * frequency * t
        );

        const secondHarmonic = Math.sin(
          2 * Math.PI * frequency * 2 * t
        ) * 0.3;

        const thirdHarmonic = Math.sin(
          2 * Math.PI * frequency * 3 * t
        ) * 0.1;

        data[start + i] +=
          (fundamental + secondHarmonic + thirdHarmonic)
          * envelope * 0.16;
      }
    });

    return buffer;
  }

  // -------------------------
  // START AMBIENCE
  // -------------------------

  public startAmbience() {
    if (this.isAmbiencePlaying) return;

    try {
      this.initContext();

      if (!this.ctx || !this.ambientGain) return;

      const now = this.ctx.currentTime;

      this.rainGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.rainGain.gain.setValueAtTime(0, now);
      this.musicGain.gain.setValueAtTime(0, now);

      this.rainGain.connect(this.ambientGain);
      this.musicGain.connect(this.ambientGain);

      // RAIN LAYER
      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = this.createRainBuffer();
      rainSource.loop = true;

      const rainHighPass = this.ctx.createBiquadFilter();
      rainHighPass.type = 'highpass';
      rainHighPass.frequency.setValueAtTime(120, now);

      const rainLowPass = this.ctx.createBiquadFilter();
      rainLowPass.type = 'lowpass';
      rainLowPass.frequency.setValueAtTime(900, now);

      rainSource.connect(rainHighPass);
      rainHighPass.connect(rainLowPass);
      rainLowPass.connect(this.rainGain);

      rainSource.start(now);
      this.rainSource = rainSource;

      // PIANO CHORD LAYER
      const chordNotes = [
        146.83,
        174.61,
        220.00,
        261.63
      ];

      chordNotes.forEach((frequency) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);

        noteGain.gain.setValueAtTime(0.012, now);

        osc.connect(noteGain);
        noteGain.connect(this.musicGain!);

        osc.start(now);
        this.musicOscillators.push(osc);
      });

      // PIANO MELODY LAYER
      const musicSource = this.ctx.createBufferSource();
      musicSource.buffer = this.createMusicBuffer();
      musicSource.loop = true;

      const musicFilter = this.ctx.createBiquadFilter();
      musicFilter.type = 'lowpass';
      musicFilter.frequency.setValueAtTime(2200, now);

      musicSource.connect(musicFilter);
      musicFilter.connect(this.musicGain);

      musicSource.start(now);
      this.musicSource = musicSource;

      // Gentle fade-in.
      this.rainGain.gain.setTargetAtTime(
        this.rainVolume,
        now,
        4
      );

      this.musicGain.gain.setTargetAtTime(
        this.musicVolume,
        now,
        3
      );

      this.isAmbiencePlaying = true;

    } catch (error) {
      console.error('Ambience could not start:', error);
      this.isAmbiencePlaying = false;
    }
  }

  // -------------------------
  // STOP AMBIENCE
  // -------------------------

  public stopAmbience() {
    if (!this.isAmbiencePlaying || !this.ctx) return;

    const now = this.ctx.currentTime;

    if (this.rainGain) {
      this.rainGain.gain.cancelScheduledValues(now);
      this.rainGain.gain.setTargetAtTime(0, now, 0.3);
    }

    if (this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setTargetAtTime(0, now, 0.3);
    }

    const rain = this.rainSource;
    const music = this.musicSource;
    const oscillators = [...this.musicOscillators];

    const rainGain = this.rainGain;
    const musicGain = this.musicGain;

    window.setTimeout(() => {
      try {
        rain?.stop();
        music?.stop();

        oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // Already stopped.
          }
        });

        rain?.disconnect();
        music?.disconnect();
        rainGain?.disconnect();
        musicGain?.disconnect();

      } catch {
        // Cleanup failed.
      }
    }, 1500);

    this.rainSource = null;
    this.musicSource = null;
    this.musicOscillators = [];

    this.rainGain = null;
    this.musicGain = null;

    this.isAmbiencePlaying = false;
  }

  public toggleAmbience(): boolean {
    if (this.isAmbiencePlaying) {
      this.stopAmbience();
      return false;
    }

    this.startAmbience();
    return this.isAmbiencePlaying;
  }
}

export const sound = new SoundEngine();
