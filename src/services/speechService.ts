/**
 * speechService.ts
 * 
 * Provides an isolated speech recognition interface for NEARO.
 * Uses Web Speech Recognition API (Chrome/Safari/Edge) in browser,
 * with clean callback interfaces so a student development team
 * can easily swap this out for an external Speech-to-Text service.
 */

import { LanguageCode } from '../types';

interface SpeechRecognitionOptions {
  language?: LanguageCode;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMsg: string) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

// Window interface augmentation for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

class SpeechService {
  private recognition: any = null;
  private listening: boolean = false;
  private activeLanguage: LanguageCode = 'en';

  constructor() {
    this.initRecognition();
  }

  private getLanguageLocale(lang: LanguageCode): string {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'es':
        return 'es-ES';
      case 'fr':
        return 'fr-FR';
      case 'en':
      default:
        return 'en-US';
    }
  }

  private initRecognition() {
    const win = typeof window !== 'undefined' ? (window as IWindow) : null;
    if (!win) return;

    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (err) {
        console.warn('Could not initialize SpeechRecognition:', err);
      }
    }
  }

  /**
   * Checks if browser speech recognition is available
   */
  public isAvailable(): boolean {
    const win = typeof window !== 'undefined' ? (window as IWindow) : null;
    return !!(win && (win.SpeechRecognition || win.webkitSpeechRecognition));
  }

  /**
   * Returns current active listening state
   */
  public isListening(): boolean {
    return this.listening;
  }

  /**
   * Starts speech recognition stream
   */
  public startListening(options: SpeechRecognitionOptions): boolean {
    if (!this.isAvailable()) {
      if (options.onError) {
        options.onError('Voice input is not available in this browser. Please use a Chromium or Safari browser.');
      }
      return false;
    }

    if (this.listening) {
      this.stopListening();
    }

    try {
      this.activeLanguage = options.language || 'en';
      this.recognition.lang = this.getLanguageLocale(this.activeLanguage);

      this.recognition.onstart = () => {
        this.listening = true;
        options.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript.trim().length > 0) {
          options.onResult(finalTranscript.trim(), true);
        } else if (interimTranscript.trim().length > 0) {
          options.onResult(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        this.listening = false;
        
        let errorMessage = "I couldn't hear that. Try again.";
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorMessage = 'Microphone permission was denied. Please allow microphone access.';
        } else if (event.error === 'no-speech') {
          errorMessage = "I didn't hear anything. Tap to try again.";
        }
        
        options.onError?.(errorMessage);
      };

      this.recognition.onend = () => {
        this.listening = false;
        options.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      this.listening = false;
      options.onError?.(err?.message || "Failed to start listening.");
      return false;
    }
  }

  /**
   * Stops active speech recognition
   */
  public stopListening(): void {
    if (this.recognition && this.listening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Safe ignore
      }
      this.listening = false;
    }
  }
}

export const speechService = new SpeechService();
