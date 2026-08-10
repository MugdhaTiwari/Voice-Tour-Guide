/**
 * apiService.ts
 * 
 * Clean API boundary connecting NEARO frontend to the backend server.
 * Communicates with:
 * - `POST /api/voice/query` (AI + Qdrant semantic context)
 * - `POST /api/voice/tts` (Rime natural speech synthesis)
 * - `POST /api/retrieval/search` (Qdrant semantic vector search)
 * - `POST /api/retrieval/feedback` (Retrieval evaluation quality signals)
 * - `GET /api/retrieval/metrics` (Qdrant metrics & analytics)
 * 
 * Never exposes API keys or secrets in client-side code.
 */

import {
  ConversationTurn,
  LanguageCode,
  LocationContext,
  RetrievalFeedback,
  RimeSpeaker,
  UserPreferences,
  VoiceQueryResult
} from '../types';

export interface VoiceQueryPayload {
  query: string;
  conversationContext: ConversationTurn[];
  locationContext: LocationContext;
  language: LanguageCode;
  userPreferences?: UserPreferences;
}

export interface SynthesizeVoicePayload {
  text: string;
  speaker?: RimeSpeaker;
  speedAlpha?: number;
  language?: LanguageCode;
}

export interface SynthesizeResult {
  audioBlob?: Blob;
  audioUrl?: string;
  fallbackToWebSpeech?: boolean;
  reason?: string;
}

class ApiService {
  /**
   * Sends voice query to server-side Gemini AI & Qdrant semantic retrieval backend
   */
  public async queryVoiceAssistant(payload: VoiceQueryPayload): Promise<VoiceQueryResult | null> {
    try {
      const response = await fetch('/api/voice/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn(`Server API responded with status ${response.status}`);
        return null;
      }

      const data: VoiceQueryResult = await response.json();
      return data;
    } catch (error) {
      console.warn('Network error reaching /api/voice/query, falling back to local engine:', error);
      return null;
    }
  }

  /**
   * Requests neural conversational speech audio from Rime via backend
   */
  public async synthesizeVoice(payload: SynthesizeVoicePayload): Promise<SynthesizeResult> {
    try {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('Content-Type') || '';

      if (contentType.includes('application/json')) {
        const json = await response.json();
        return {
          fallbackToWebSpeech: json.fallbackToWebSpeech ?? true,
          reason: json.reason || 'Server requested browser speech synthesis fallback'
        };
      }

      if (response.ok && (contentType.includes('audio') || contentType.includes('octet-stream'))) {
        const blob = await response.blob();
        if (blob.size > 0) {
          const audioUrl = URL.createObjectURL(blob);
          return { audioBlob: blob, audioUrl };
        }
      }

      return { fallbackToWebSpeech: true, reason: 'Empty audio stream received' };
    } catch (error) {
      console.warn('Rime TTS fetch error, falling back to Web Speech:', error);
      return {
        fallbackToWebSpeech: true,
        reason: (error as Error).message || 'Network error connecting to TTS'
      };
    }
  }

  /**
   * Submits user evaluation & relevance feedback to Qdrant quality log
   */
  public async submitRetrievalFeedback(feedback: RetrievalFeedback): Promise<boolean> {
    try {
      const response = await fetch('/api/retrieval/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
      });
      return response.ok;
    } catch (err) {
      console.warn('Could not record retrieval feedback:', err);
      return false;
    }
  }

  /**
   * Retrieves live metrics from Qdrant vector memory and evaluation logs
   */
  public async getRetrievalMetrics(): Promise<any> {
    try {
      const response = await fetch('/api/retrieval/metrics');
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Could not fetch retrieval metrics:', err);
    }
    return null;
  }

  /**
   * Health check for Gemini, Rime, and Qdrant integration
   */
  public async checkHealth(): Promise<any> {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Health check failed:', err);
    }
    return { status: 'offline' };
  }
}

export const apiService = new ApiService();
