/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for high-fidelity interactive game sounds
class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playClick() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // AudioContext fallback
    }
  }

  public playCoin() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  public playSuccess() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const noteStart = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.25);
      });
    } catch {
      // ignore
    }
  }

  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chordNotes = [
        { freq: 440, start: 0, dur: 0.15 },
        { freq: 554.37, start: 0.12, dur: 0.15 },
        { freq: 659.25, start: 0.24, dur: 0.2 },
        { freq: 880, start: 0.4, dur: 0.6 },
        { freq: 1108.73, start: 0.4, dur: 0.6 }
      ];

      chordNotes.forEach(({ freq, start, dur }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const noteStart = now + start;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.25, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteStart);
        osc.stop(noteStart + dur);
      });
    } catch {
      // ignore
    }
  }

  public playChestOpen() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.4);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore
    }
  }

  public playWrong() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  public playPageTurn() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }

  public playNarrationChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new SoundEngine();

// Robust Web Speech API Arabic Narrator Controller
class SpeechNarrator {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoiceURI: string | null = null;
  private fallbackTimer: number | null = null;
  private keepAliveTimer: number | null = null;
  private isSpeakingInternal: boolean = false;
  private isPausedInternal: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      try {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      } catch {
        // ignore
      }
    }
  }

  public loadVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
          this.voices = list;
        }
      } catch {
        // ignore
      }
    }
    return this.voices;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.voices.length) {
      this.loadVoices();
    }
    return this.voices;
  }

  public getArabicVoices(): SpeechSynthesisVoice[] {
    const all = this.getVoices();
    return all.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return (
        lang.startsWith('ar') ||
        lang.includes('arabic') ||
        name.includes('arabic') ||
        name.includes('عربي') ||
        name.includes('saudi') ||
        name.includes('egypt')
      );
    });
  }

  public getBestArabicVoice(): SpeechSynthesisVoice | null {
    const arabicVoices = this.getArabicVoices();
    if (!arabicVoices.length) {
      // Fallback: search general voices if any match
      return this.voices.find(v => (v.lang || '').toLowerCase().startsWith('ar')) || null;
    }

    if (this.selectedVoiceURI) {
      const found = arabicVoices.find(v => v.voiceURI === this.selectedVoiceURI);
      if (found) return found;
    }

    // Prioritize natural or known high-quality Arabic voices
    const preferred = arabicVoices.find(v => {
      const n = v.name.toLowerCase();
      return (
        n.includes('natural') ||
        n.includes('google') ||
        n.includes('maged') ||
        n.includes('laila') ||
        n.includes('tarik') ||
        n.includes('mariam') ||
        n.includes('hoda') ||
        n.includes('naayf')
      );
    });

    return preferred || arabicVoices[0] || null;
  }

  public setSelectedVoice(voiceURI: string | null) {
    this.selectedVoiceURI = voiceURI;
  }

  public getSelectedVoiceURI(): string | null {
    return this.selectedVoiceURI;
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    // Chrome bug: Speech pauses indefinitely after ~10-15 seconds if not poked
    if (typeof window !== 'undefined') {
      this.keepAliveTimer = window.setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }
      }, 8000);
    }
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  public speak(
    text: string,
    rate: number = 1.0,
    volume: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    this.stop();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Clean speech synthesis state if it was paused
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = Math.max(0.65, Math.min(rate, 1.5));
        utterance.volume = Math.max(0.1, Math.min(volume, 1.0));

        const chosenVoice = this.getBestArabicVoice();
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }

        // Store reference on window to prevent Garbage Collection from cutting off speech mid-sentence
        (window as unknown as { __storyReaderUtterance?: SpeechSynthesisUtterance }).__storyReaderUtterance = utterance;
        this.currentUtterance = utterance;

        let hasEnded = false;
        const completeSpeech = () => {
          if (hasEnded) return;
          hasEnded = true;
          this.stopKeepAlive();
          this.currentUtterance = null;
          this.isSpeakingInternal = false;
          this.isPausedInternal = false;
          if (onEnd) onEnd();
        };

        utterance.onstart = () => {
          this.isSpeakingInternal = true;
          this.isPausedInternal = false;
          this.startKeepAlive();
          if (onStart) onStart();
        };

        utterance.onend = () => {
          completeSpeech();
        };

        utterance.onerror = (e) => {
          // If canceled or interrupted intentionally, do NOT advance or throw cascading recursion
          if (e.error === 'interrupted' || e.error === 'canceled') {
            this.stopKeepAlive();
            this.currentUtterance = null;
            this.isSpeakingInternal = false;
            return;
          }
          console.warn('SpeechSynthesis error event:', e.error);
          completeSpeech();
        };

        // Gentle narration chime for tactile auditory feedback
        soundEffects.playNarrationChime();

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('SpeechSynthesis invocation failed, fallback to timed audio simulation', err);
      }
    }

    // Graceful Audio-Tone Fallback if browser SpeechSynthesis is disabled or unavailable
    this.isSpeakingInternal = true;
    this.isPausedInternal = false;
    soundEffects.playNarrationChime();
    if (onStart) onStart();

    // Word count timing with 2.5 words/sec default
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedDurationMs = Math.max(2200, (wordCount / 2.2) * 1000 / rate);

    this.fallbackTimer = window.setTimeout(() => {
      this.isSpeakingInternal = false;
      this.fallbackTimer = null;
      if (onEnd) onEnd();
    }, estimatedDurationMs);
  }

  public pause() {
    this.isPausedInternal = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // ignore
      }
    }
  }

  public resume() {
    this.isPausedInternal = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // ignore
      }
    }
  }

  public stop() {
    this.isSpeakingInternal = false;
    this.isPausedInternal = false;
    this.stopKeepAlive();

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.currentUtterance = null;
    if (typeof window !== 'undefined') {
      delete (window as unknown as { __storyReaderUtterance?: SpeechSynthesisUtterance }).__storyReaderUtterance;
    }
  }

  public isSpeaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking || this.isSpeakingInternal;
    }
    return this.isSpeakingInternal;
  }

  public isPaused(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.paused || this.isPausedInternal;
    }
    return this.isPausedInternal;
  }
}

export const speechNarrator = new SpeechNarrator();
