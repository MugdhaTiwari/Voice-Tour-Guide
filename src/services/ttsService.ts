/**
 * ttsService.ts
 * 
 * Provides voice speech synthesis for NEARO.
 * Uses Web SpeechSynthesis API as the initial prototype fallback,
 * while structured cleanly so a development team can replace it with
 * high-fidelity neural voices (such as Rime TTS or Gemini Live TTS).
 * 
 * Includes dynamic soundwave / amplitude generation so the VoiceOrb
 * animates in real-time while NEARO is speaking.
 */

import { LanguageCode } from '../types';

export interface TTSCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (err: string) => void;
  onBoundary?: (charIndex: number, word: string) => void;
  onWaveformUpdate?: (amplitudes: number[]) => void;
}

class TTSService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private speaking: boolean = false;
  private paused: boolean = false;
  private animFrameId: number | null = null;
  private activeCallbacks: TTSCallbacks | null = null;
  private waveformInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Pre-load voices on first interaction
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  private getVoiceForLanguage(lang: LanguageCode): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const prefixMap: Record<LanguageCode, string[]> = {
      en: ['en-US', 'en-GB', 'en-IN', 'en'],
      hi: ['hi-IN', 'hi'],
      es: ['es-ES', 'es-MX', 'es'],
      fr: ['fr-FR', 'fr-CA', 'fr']
    };

    const prefixes = prefixMap[lang] || ['en'];

    for (const prefix of prefixes) {
      // Prioritize natural/Google/Apple/Microsoft enhanced voices
      const preferred = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(prefix.toLowerCase()) &&
          (v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Siri') ||
            v.name.includes('Samantha') ||
            v.name.includes('Premium') ||
            v.name.includes('Neural'))
      );
      if (preferred) return preferred;

      const fallbackMatch = voices.find((v) =>
        v.lang.toLowerCase().startsWith(prefix.toLowerCase())
      );
      if (fallbackMatch) return fallbackMatch;
    }

    return voices[0] || null;
  }

  /**
   * Generates simulated realistic voice amplitude pulses for the VoiceOrb
   */
  private startWaveformSimulation(onUpdate?: (amplitudes: number[]) => void) {
    if (!onUpdate) return;

    let phase = 0;
    this.waveformInterval = setInterval(() => {
      if (!this.speaking || this.paused) return;

      phase += 0.2;
      // 5-band frequency representation
      const bands = [
        0.35 + Math.sin(phase * 1.5) * 0.35 + Math.random() * 0.2,
        0.45 + Math.cos(phase * 2.1) * 0.4 + Math.random() * 0.25,
        0.55 + Math.sin(phase * 2.8) * 0.4 + Math.random() * 0.3,
        0.4 + Math.cos(phase * 1.9) * 0.35 + Math.random() * 0.25,
        0.3 + Math.sin(phase * 1.2) * 0.3 + Math.random() * 0.2,
      ].map((v) => Math.max(0.1, Math.min(1.0, v)));

      onUpdate(bands);
    }, 60);
  }

  private stopWaveformSimulation() {
    if (this.waveformInterval) {
      clearInterval(this.waveformInterval);
      this.waveformInterval = null;
    }
  }

  public isSpeaking(): boolean {
    return this.speaking;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  /**
   * Speaks the provided text using synthesized voice.
   * Interrupts any ongoing speech cleanly.
   */
  public speak(
    text: string,
    language: LanguageCode = 'en',
    callbacks?: TTSCallbacks
  ): boolean {
    this.stop();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is unavailable in this environment.');
      callbacks?.onError?.('Speech synthesis is not supported in this browser.');
      return false;
    }

    if (!text || text.trim().length === 0) {
      return false;
    }

    try {
      // Clean clean text for natural speech pronunciation (remove markdown asterisks or raw urls)
      const cleanSpokenText = text
        .replace(/[*_~`#]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
      const voice = this.getVoiceForLanguage(language);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US';
      }

      // Calm, clear tour guide pacing
      utterance.rate = language === 'hi' ? 0.95 : 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      this.activeCallbacks = callbacks || null;
      this.utterance = utterance;
      this.speaking = true;
      this.paused = false;

      utterance.onstart = () => {
        this.speaking = true;
        this.paused = false;
        callbacks?.onStart?.();
        this.startWaveformSimulation(callbacks?.onWaveformUpdate);
      };

      utterance.onend = () => {
        this.speaking = false;
        this.paused = false;
        this.stopWaveformSimulation();
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn('TTS error encountered:', e);
        this.speaking = false;
        this.paused = false;
        this.stopWaveformSimulation();
        callbacks?.onError?.('Audio playback was interrupted.');
      };

      utterance.onpause = () => {
        this.paused = true;
        callbacks?.onPause?.();
      };

      utterance.onresume = () => {
        this.paused = false;
        callbacks?.onResume?.();
      };

      utterance.onboundary = (e: SpeechSynthesisEvent) => {
        const word = cleanSpokenText.substring(e.charIndex, e.charIndex + (e.charLength || 6));
        callbacks?.onBoundary?.(e.charIndex, word);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: any) {
      console.warn('TTS speak failed:', err);
      this.speaking = false;
      this.stopWaveformSimulation();
      callbacks?.onError?.(err?.message || 'Could not speak response.');
      return false;
    }
  }

  /**
   * Pauses voice playback
   */
  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.speaking) {
      window.speechSynthesis.pause();
      this.paused = true;
      this.activeCallbacks?.onPause?.();
    }
  }

  /**
   * Resumes paused voice playback
   */
  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.paused) {
      window.speechSynthesis.resume();
      this.paused = false;
      this.activeCallbacks?.onResume?.();
    }
  }

  /**
   * Immediately stops audio speech and resets orb state
   */
  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.speaking = false;
    this.paused = false;
    this.stopWaveformSimulation();
    this.activeCallbacks?.onEnd?.();
    this.activeCallbacks = null;
    this.utterance = null;
  }
}

export const ttsService = new TTSService();
