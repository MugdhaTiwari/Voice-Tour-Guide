/**
 * apiService.ts
 * 
 * Clean API boundary connecting NEARO frontend to the backend server.
 * Communicates with `POST /api/voice/query`.
 * 
 * Never exposes API keys or secrets in client-side code.
 */

import { ConversationTurn, LanguageCode, LocationContext, UserPreferences, VoiceQueryResult } from '../types';

export interface VoiceQueryPayload {
  query: string;
  conversationContext: ConversationTurn[];
  locationContext: LocationContext;
  language: LanguageCode;
  userPreferences?: UserPreferences;
}

class ApiService {
  /**
   * Sends voice query to server-side Gemini AI & semantic retrieval backend
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
}

export const apiService = new ApiService();
