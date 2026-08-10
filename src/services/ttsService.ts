/**
 * ttsService.ts
 * 
 * Unified Voice Speech Synthesis Layer for NEARO.
 * 
 * Primary Engine: RIME Neural Voice (Human-like, natural conversational travel guide voice)
 * Fallback Engine: Web SpeechSynthesis API (Offline-resilient browser fallback)
 * 
 * Features:
 * - Real-time Web Audio API frequency analysis (AnalyserNode) to drive VoiceOrb waveform visualizer
 * - Natural cadence formatting and speech pauses
 * - Full controls: play, pause, resume, interrupt, stop
 * - Safe fallback if Rime API key is missing or offline
 */

import { LanguageCode, RimeSpeaker } from '../types';
import { apiService } from './apiService';

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
  // Web Speech API state
  private utterance: SpeechSynthesisUtterance | null = null;
  
  // HTML5 Audio / Rime state
  private audioElement: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;

  // General playback state
  private speaking: boolean = false;
  private paused: boolean = false;
  private activeCallbacks: TTSCallbacks | null = null;
  private animFrameId: number | null = null;
  private waveformInterval: any = null;
  private isRimeAudio: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded in browser
      };
    }
  }

  /**
   * Cleans text for natural human-like pronunciation
   */
  private cleanSpokenText(text: string): string {
    return text
      .replace(/[*_~`#]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/(\d+)\s*km\b/gi, '$1 kilometers')
      .replace(/(\d+)\s*m\b/gi, '$1 meters')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  /**
   * Initializes Web Audio Analyser for real-time waveform visualization
   */
  private setupAudioAnalyser(audio: HTMLAudioElement, onUpdate?: (amplitudes: number[]) => void) {
    if (typeof window === 'undefined' || !onUpdate) return;

    try {
      if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioContext = new AudioContextClass();
        }
      }

      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }

      if (this.audioContext && !this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;
      }

      // Connect source node only once per audio element
      try {
        if (this.audioContext && this.analyser && !this.sourceNode) {
          this.sourceNode = this.audioContext.createMediaElementSource(audio);
          this.sourceNode.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);
        }
      } catch (e) {
        // May already be connected or CORS restricted
      }

      // Start frequency data animation loop
      this.startRealWaveformLoop(onUpdate);
    } catch (err) {
      console.warn('AudioAnalyser setup warning, fallback to simulated waveform:', err);
      this.startWaveformSimulation(onUpdate);
    }
  }

  /**
   * Reads real frequency bands from AnalyserNode
   */
  private startRealWaveformLoop(onUpdate: (amplitudes: number[]) => void) {
    this.stopWaveformLoop();

    const updateLoop = () => {
      if (!this.speaking || this.paused) {
        return;
      }

      if (this.analyser) {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        // Group into 5 frequency bands: sub-bass, bass, mid, high-mid, presence
        const bands = [
          (dataArray[1] || 40) / 255,
          (dataArray[3] || 60) / 255,
          (dataArray[6] || 80) / 255,
          (dataArray[10] || 50) / 255,
          (dataArray[14] || 30) / 255
        ].map((v) => Math.max(0.15, Math.min(1.0, v * 1.4)));

        onUpdate(bands);
      }

      this.animFrameId = requestAnimationFrame(updateLoop);
    };

    this.animFrameId = requestAnimationFrame(updateLoop);
  }

  private stopWaveformLoop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /**
   * Fallback waveform pulse simulation
   */
  private startWaveformSimulation(onUpdate?: (amplitudes: number[]) => void) {
    if (!onUpdate) return;
    this.stopWaveformSimulation();

    let phase = 0;
    this.waveformInterval = setInterval(() => {
      if (!this.speaking || this.paused) return;

      phase += 0.22;
      const bands = [
        0.35 + Math.sin(phase * 1.5) * 0.35 + Math.random() * 0.2,
        0.45 + Math.cos(phase * 2.1) * 0.4 + Math.random() * 0.25,
        0.55 + Math.sin(phase * 2.8) * 0.4 + Math.random() * 0.3,
        0.4 + Math.cos(phase * 1.9) * 0.35 + Math.random() * 0.25,
        0.3 + Math.sin(phase * 1.2) * 0.3 + Math.random() * 0.2
      ].map((v) => Math.max(0.12, Math.min(1.0, v)));

      onUpdate(bands);
    }, 60);
  }

  private stopWaveformSimulation() {
    if (this.waveformInterval) {
      clearInterval(this.waveformInterval);
      this.waveformInterval = null;
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

  public isSpeaking(): boolean {
    return this.speaking;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  /**
   * Speaks the provided text using Rime neural voice with fallback to Web Speech.
   * Interrupts any ongoing speech cleanly.
   */
  public async speak(
    text: string,
    language: LanguageCode = 'en',
    callbacks?: TTSCallbacks,
    speaker: RimeSpeaker = 'orion'
  ): Promise<boolean> {
    this.stop();

    if (!text || text.trim().length === 0) {
      return false;
    }

    const cleanText = this.cleanSpokenText(text);
    this.activeCallbacks = callbacks || null;

    // 1. Attempt RIME Voice Synthesis via server
    try {
      const rimeResult = await apiService.synthesizeVoice({
        text: cleanText,
        speaker,
        language
      });

      if (rimeResult && rimeResult.audioUrl) {
        return this.playRimeAudio(rimeResult.audioUrl, cleanText, callbacks);
      }
    } catch (err) {
      console.warn('Rime synthesis request failed, attempting Web Speech fallback:', err);
    }

    // 2. Fallback to Web SpeechSynthesis API
    return this.speakWebSpeechFallback(cleanText, language, callbacks);
  }

  /**
   * Plays Rime neural audio stream via HTML5 Audio with AnalyserNode
   */
  private playRimeAudio(audioUrl: string, cleanText: string, callbacks?: TTSCallbacks): boolean {
    try {
      this.currentAudioUrl = audioUrl;
      this.isRimeAudio = true;
      this.speaking = true;
      this.paused = false;

      const audio = new Audio(audioUrl);
      this.audioElement = audio;

      audio.onplay = () => {
        this.speaking = true;
        this.paused = false;
        callbacks?.onStart?.();
        this.setupAudioAnalyser(audio, callbacks?.onWaveformUpdate);
      };

      audio.onended = () => {
        this.speaking = false;
        this.paused = false;
        this.cleanupAudio();
        callbacks?.onEnd?.();
      };

      audio.onerror = (e) => {
        console.warn('Audio playback error, switching to Web Speech fallback:', e);
        this.cleanupAudio();
        this.speakWebSpeechFallback(cleanText, 'en', callbacks);
      };

      audio.onpause = () => {
        if (this.speaking) {
          this.paused = true;
          callbacks?.onPause?.();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play autoplay restriction / error:', err);
          // Try web speech if audio cannot play
          this.cleanupAudio();
          this.speakWebSpeechFallback(cleanText, 'en', callbacks);
        });
      }

      return true;
    } catch (e) {
      console.warn('Rime audio play error:', e);
      return this.speakWebSpeechFallback(cleanText, 'en', callbacks);
    }
  }

  /**
   * Fallback Web Speech Synthesis
   */
  private speakWebSpeechFallback(
    cleanSpokenText: string,
    language: LanguageCode,
    callbacks?: TTSCallbacks
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is unavailable in this environment.');
      callbacks?.onError?.('Speech synthesis is not supported in this browser.');
      return false;
    }

    try {
      this.isRimeAudio = false;
      const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
      const voice = this.getVoiceForLanguage(language);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US';
      }

      // Calm, clear travel guide cadence
      utterance.rate = language === 'hi' ? 0.95 : 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

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
        console.warn('Web Speech error:', e);
        this.speaking = false;
        this.paused = false;
        this.stopWaveformSimulation();
        callbacks?.onError?.('Audio playback interrupted.');
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
      console.warn('Web Speech speak failed:', err);
      this.speaking = false;
      this.stopWaveformSimulation();
      callbacks?.onError?.(err?.message || 'Could not speak response.');
      return false;
    }
  }

  /**
   * Pauses active voice playback
   */
  public pause(): void {
    if (this.isRimeAudio && this.audioElement && this.speaking) {
      this.audioElement.pause();
      this.paused = true;
      this.activeCallbacks?.onPause?.();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.speaking) {
      window.speechSynthesis.pause();
      this.paused = true;
      this.activeCallbacks?.onPause?.();
    }
  }

  /**
   * Resumes paused voice playback
   */
  public resume(): void {
    if (this.isRimeAudio && this.audioElement && this.paused) {
      this.audioElement.play().catch(() => {});
      this.paused = false;
      this.activeCallbacks?.onResume?.();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.paused) {
      window.speechSynthesis.resume();
      this.paused = false;
      this.activeCallbacks?.onResume?.();
    }
  }

  /**
   * Stops audio speech immediately and resets state
   */
  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.cleanupAudio();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.speaking = false;
    this.paused = false;
    this.stopWaveformLoop();
    this.stopWaveformSimulation();
    this.activeCallbacks?.onEnd?.();
    this.activeCallbacks = null;
    this.utterance = null;
  }

  private cleanupAudio() {
    this.stopWaveformLoop();
    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }
    this.audioElement = null;
    this.isRimeAudio = false;
  }
}

export const ttsService = new TTSService();
