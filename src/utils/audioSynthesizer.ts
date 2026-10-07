// Web Audio API Synthesizer for Indonesian Bird Masteran Sounds
// Structured by Literature Knowledge Base:
// 1. Tembakan (Cililin, Tengkek Buto)
// 2. Ngeroll (Kenari)
// 3. Besetan (Kapas Tembak, Cucak Jenggot & Gereja Tarung)

class BirdAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timeoutIds: number[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Tembakan: Cililin (Melengking tajam, sangat rapat, durasi panjang - Isian Wajib Mewah)
  playCililinBurst(durationMs = 3500) {
    const ctx = this.getContext();
    this.stop();
    this.isPlaying = true;

    const notes = [4600, 5200, 4900, 5600, 5300, 4800, 5800, 5100];
    const step = 60; // sangat rapat (staccato mesin)
    const count = Math.floor(durationMs / step);

    for (let i = 0; i < count; i++) {
      const tId = window.setTimeout(() => {
        if (!this.isPlaying) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const baseFreq = notes[i % notes.length] + (Math.random() * 150 - 75);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq - 500, ctx.currentTime + 0.045);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = baseFreq;
        filter.Q.value = 9;

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.055);
      }, i * step);
      this.timeoutIds.push(tId);
    }

    const endId = window.setTimeout(() => {
      this.isPlaying = false;
    }, durationMs + 100);
    this.timeoutIds.push(endId);
  }

  // 1. Tembakan Kasar: Tengkek Buto (Mirip Cililin tapi lebih tebal dan kasar bunyinya)
  playTengkekButo(durationMs = 3000) {
    const ctx = this.getContext();
    this.stop();
    this.isPlaying = true;

    const notes = [2900, 3200, 3100, 3400, 3000, 3300];
    const step = 95;
    const count = Math.floor(durationMs / step);

    for (let i = 0; i < count; i++) {
      const tId = window.setTimeout(() => {
        if (!this.isPlaying) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const baseFreq = notes[i % notes.length];
        osc.type = 'square'; // Lebih tebal dan kasar
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, ctx.currentTime + 0.08);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = baseFreq;
        filter.Q.value = 5;

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.085);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      }, i * step);
      this.timeoutIds.push(tId);
    }

    const endId = window.setTimeout(() => {
      this.isPlaying = false;
    }, durationMs + 100);
    this.timeoutIds.push(endId);
  }

  // 2. Ngeroll: Kenari (Melodi panjang bervariasi dengan cengkok naik turun, merapatkan jeda)
  playKenariTrill(durationMs = 3800) {
    const ctx = this.getContext();
    this.stop();
    this.isPlaying = true;

    const step = 70;
    const count = Math.floor(durationMs / step);

    for (let i = 0; i < count; i++) {
      const tId = window.setTimeout(() => {
        if (!this.isPlaying) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Cengkok meliuk-liuk khas Kenari
        const wave = Math.sin(i * 0.4) * 450;
        const freq = 3200 + wave;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.065);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      }, i * step);
      this.timeoutIds.push(tId);
    }

    const endId = window.setTimeout(() => {
      this.isPlaying = false;
    }, durationMs + 100);
    this.timeoutIds.push(endId);
  }

  // 3. Tembakan & Besetan: Kapas Tembak (Kasar, rapat crecetan, bongkar emosi lawan)
  playKapasTembak(durationMs = 3200) {
    const ctx = this.getContext();
    this.stop();
    this.isPlaying = true;

    const step = 55;
    const count = Math.floor(durationMs / step);

    for (let i = 0; i < count; i++) {
      const tId = window.setTimeout(() => {
        if (!this.isPlaying) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = 4200 + (Math.random() * 600 - 300);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.17, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }, i * step);
      this.timeoutIds.push(tId);
    }

    const endId = window.setTimeout(() => {
      this.isPlaying = false;
    }, durationMs + 100);
    this.timeoutIds.push(endId);
  }

  // 3. Besetan: Cucak Jenggot & Gereja Tarung (Kasar, pendek tapi tajam)
  playGerejaTarung(durationMs = 2600) {
    const ctx = this.getContext();
    this.stop();
    this.isPlaying = true;

    // Burst pattern: 3-4 sharp snaps then short pause
    const bursts = [0, 80, 160, 400, 480, 560, 640, 950, 1030, 1110, 1450, 1530, 1610];

    bursts.forEach((timeOffset) => {
      if (timeOffset >= durationMs) return;
      const tId = window.setTimeout(() => {
        if (!this.isPlaying) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(4500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2800, ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.065);
      }, timeOffset);
      this.timeoutIds.push(tId);
    });

    const endId = window.setTimeout(() => {
      this.isPlaying = false;
    }, durationMs + 100);
    this.timeoutIds.push(endId);
  }

  // Murai Batu Rol Kombinasi Lengkap
  playMuraiBatuRol(durationMs = 4500) {
    const ctx = this.getContext();
    this.stop();
    this.isPlaying = true;

    const patterns = [
      { f: 2900, len: 0.12, type: 'sine' },
      { f: 3400, len: 0.09, type: 'triangle' },
      { f: 4900, len: 0.16, type: 'sawtooth' }, // Cililin shot
      { f: 5200, len: 0.14, type: 'sawtooth' },
      { f: 4100, len: 0.08, type: 'sine' },
      { f: 3100, len: 0.18, type: 'triangle' },
    ];

    let currentDelay = 0;
    let index = 0;

    const playNext = () => {
      if (!this.isPlaying || currentDelay >= durationMs) {
        this.isPlaying = false;
        return;
      }

      const p = patterns[index % patterns.length];
      index++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = p.type as OscillatorType;
      osc.frequency.setValueAtTime(p.f, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(p.f * 1.15, ctx.currentTime + p.len * 0.5);
      osc.frequency.exponentialRampToValueAtTime(p.f * 0.85, ctx.currentTime + p.len);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.len);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + p.len);

      const nextDelay = (p.len + 0.06) * 1000;
      currentDelay += nextDelay;

      const tId = window.setTimeout(playNext, nextDelay);
      this.timeoutIds.push(tId);
    };

    playNext();
  }

  // Rekaman Masteran Burung Juara Nasional
  playAvatarMasterRecording(durationMs = 6000) {
    this.stop();
    // 1st part: Kenari cengkok roll (2s)
    this.playKenariTrill(2200);
    const t1 = window.setTimeout(() => {
      // 2nd part: Cililin tembakan kristal melengking (2.5s)
      this.playCililinBurst(2500);
    }, 2250);
    const t2 = window.setTimeout(() => {
      // 3rd part: Gereja Tarung rapat (1.5s)
      this.playGerejaTarung(1800);
    }, 4800);
    this.timeoutIds.push(t1, t2);
  }

  playSemarMesemRecording(durationMs = 6000) {
    this.stop();
    this.playKenariTrill(2000);
    const t1 = window.setTimeout(() => {
      this.playKapasTembak(2200);
    }, 2050);
    const t2 = window.setTimeout(() => {
      this.playCililinBurst(2200);
    }, 4300);
    this.timeoutIds.push(t1, t2);
  }

  playRajaRimbaRecording(durationMs = 6000) {
    this.stop();
    this.playTengkekButo(2500);
    const t1 = window.setTimeout(() => {
      this.playKapasTembak(2000);
    }, 2550);
    const t2 = window.setTimeout(() => {
      this.playCililinBurst(1800);
    }, 4600);
    this.timeoutIds.push(t1, t2);
  }

  playCucakIjoRecording(durationMs = 5000) {
    this.stop();
    this.playKapasTembak(2200);
    const t1 = window.setTimeout(() => {
      this.playGerejaTarung(2000);
    }, 2250);
    const t2 = window.setTimeout(() => {
      this.playKenariTrill(1500);
    }, 4300);
    this.timeoutIds.push(t1, t2);
  }

  playKacerRecording(durationMs = 5000) {
    this.stop();
    this.playKenariTrill(2000);
    const t1 = window.setTimeout(() => {
      this.playCililinBurst(2000);
    }, 2050);
    const t2 = window.setTimeout(() => {
      this.playGerejaTarung(1500);
    }, 4100);
    this.timeoutIds.push(t1, t2);
  }

  stop() {
    this.isPlaying = false;
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const birdAudioEngine = new BirdAudioEngine();

// Stitched Multi-Segment Audio Player with Loop Support
export interface StitchedPlaybackState {
  currentSegmentIndex: number;
  isPausedInterval: boolean;
  isPlaying: boolean;
  loopCount: number;
}

export class StitchedMasteranPlayer {
  private engine: BirdAudioEngine;
  private isRunning: boolean = false;
  private currentTimeout: number | null = null;
  private onStateChange?: (state: StitchedPlaybackState) => void;
  private loopCount: number = 0;

  constructor(engine: BirdAudioEngine = birdAudioEngine) {
    this.engine = engine;
  }

  playSequence(
    segments: Array<{ sound: string; durationSec: number }>,
    pauseSec: number,
    loop: boolean,
    onStateChange?: (state: StitchedPlaybackState) => void
  ) {
    this.stop();
    if (!segments || segments.length === 0) return;

    this.isRunning = true;
    this.loopCount = 0;
    this.onStateChange = onStateChange;

    const playSegmentAtIndex = (index: number) => {
      if (!this.isRunning) return;

      if (index >= segments.length) {
        // We reached the end of the sequence. Execute SOP pause interval!
        if (pauseSec > 0) {
          if (this.onStateChange) {
            this.onStateChange({
              currentSegmentIndex: -1,
              isPausedInterval: true,
              isPlaying: true,
              loopCount: this.loopCount,
            });
          }

          this.currentTimeout = window.setTimeout(() => {
            if (!this.isRunning) return;
            if (loop) {
              this.loopCount++;
              playSegmentAtIndex(0);
            } else {
              this.stop();
            }
          }, pauseSec * 1000);
          return;
        } else {
          if (loop) {
            this.loopCount++;
            playSegmentAtIndex(0);
            return;
          } else {
            this.stop();
            return;
          }
        }
      }

      // Play current segment
      const seg = segments[index];
      const durationMs = Math.max(1000, seg.durationSec * 1000);

      if (this.onStateChange) {
        this.onStateChange({
          currentSegmentIndex: index,
          isPausedInterval: false,
          isPlaying: true,
          loopCount: this.loopCount,
        });
      }

      // Trigger respective synthesizer sound
      if (seg.sound === 'cililin') {
        this.engine.playCililinBurst(durationMs);
      } else if (seg.sound === 'tengkek') {
        this.engine.playTengkekButo(durationMs);
      } else if (seg.sound === 'kenari') {
        this.engine.playKenariTrill(durationMs);
      } else if (seg.sound === 'kapas') {
        this.engine.playKapasTembak(durationMs);
      } else if (seg.sound === 'gereja') {
        this.engine.playGerejaTarung(durationMs);
      } else {
        this.engine.playMuraiBatuRol(durationMs);
      }

      this.currentTimeout = window.setTimeout(() => {
        if (!this.isRunning) return;
        playSegmentAtIndex(index + 1);
      }, durationMs);
    };

    playSegmentAtIndex(0);
  }

  stop() {
    this.isRunning = false;
    if (this.currentTimeout !== null) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.engine.stop();
    if (this.onStateChange) {
      this.onStateChange({
        currentSegmentIndex: -1,
        isPausedInterval: false,
        isPlaying: false,
        loopCount: this.loopCount,
      });
    }
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const stitchedMasteranPlayer = new StitchedMasteranPlayer();

