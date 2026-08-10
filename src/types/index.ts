/**
 * Type definitions for NEARO voice-first AI tour companion.
 */

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export type LanguageCode = 'en' | 'hi' | 'es' | 'fr';

export type RimeSpeaker = 'orion' | 'celeste' | 'abbey' | 'allison' | 'amber' | 'colin';

export interface RimeVoiceOption {
  id: RimeSpeaker;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  tone: string;
  description: string;
}

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  sampleGreeting: string;
}

export type InterestCategory = 
  | 'History' 
  | 'Architecture' 
  | 'Culture' 
  | 'Food' 
  | 'Art' 
  | 'Nature';

export type TourStyle = 'Quick Highlights' | 'Balanced' | 'Deep Dive';

export interface AccessibilitySettings {
  largerText: boolean;
  highContrast: boolean;
  voiceFirstMode: boolean;
  reducedMotion: boolean;
  showLiveCaptions: boolean;
}

export interface UserPreferences {
  language: LanguageCode;
  interests: InterestCategory[];
  tourStyle: TourStyle;
  voiceSpeaker?: RimeSpeaker;
  accessibility: AccessibilitySettings;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  name: string;
  city: string;
  category: InterestCategory;
  distance: string; // e.g. "0.2 km", "450 m"
  shortDescription: string;
  fullDescription: string;
  facts: string[];
  tags: string[];
  imageUrl: string;
  coordinates: Coordinates;
  recommendedWhy?: string;
  bestTimeToVisit?: string;
  audioHighlights?: string;
}

export interface LocationContext {
  placeId: string;
  name: string;
  city: string;
  coordinates: Coordinates;
  isManualSelection: boolean;
  landmarkDetails?: string;
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  locationContext?: string;
  spokenAudioUrl?: string;
}

export interface VisualCardData {
  placeId?: string;
  title: string;
  subtitle: string;
  category: InterestCategory | string;
  description: string;
  facts?: string[];
  imageUrl?: string;
  distance?: string;
  badge?: string;
  queryId?: string;
}

export interface RetrievalMetrics {
  qdrantConnected: boolean;
  similarityScore?: number;
  memoriesRecalled?: number;
  retrievalLatencyMs?: number;
  intent?: string;
  matchedPlaceId?: string;
}

export interface RetrievalFeedback {
  queryId: string;
  query: string;
  placeId?: string;
  placeName?: string;
  rating: 'positive' | 'negative';
  relevanceScore?: number;
  timestamp: number;
}

export interface VoiceQueryResult {
  queryId?: string;
  answer: string;
  spokenText: string;
  location: string;
  relatedPlaces: Place[];
  suggestedQuestions: string[];
  visualCard?: VisualCardData;
  source?: 'gemini' | 'knowledge_base' | 'qdrant' | 'demo';
  retrievalMetrics?: RetrievalMetrics;
}

export interface KnowledgeItem {
  id: string;
  name: string;
  location: string;
  category: InterestCategory;
  overview: Record<LanguageCode, string>;
  history: Record<LanguageCode, string>;
  whyBuilt: Record<LanguageCode, string>;
  nearbyRecommendation: Record<LanguageCode, string>;
  interestingFacts: Record<LanguageCode, string[]>;
  tags: string[];
  relatedAttractions: string[];
}

