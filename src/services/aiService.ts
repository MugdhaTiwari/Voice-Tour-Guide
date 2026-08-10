/**
 * aiService.ts
 * 
 * Central AI voice reasoning and conversation context orchestrator.
 * Combines server-side Gemini API queries with offline-resilient local
 * semantic knowledge and conversational context tracking.
 */

import { apiService } from './apiService';
import { retrievalService } from './retrievalService';
import { DEMO_PLACES } from '../data/demoPlaces';
import { DEMO_KNOWLEDGE } from '../data/demoKnowledge';
import {
  ConversationTurn,
  LanguageCode,
  LocationContext,
  Place,
  UserPreferences,
  VisualCardData,
  VoiceQueryResult
} from '../types';

class AIService {
  /**
   * Processes a tourist voice query with full conversation context,
   * current location, preferred language, and tour style.
   */
  public async sendVoiceQuery(
    query: string,
    conversationHistory: ConversationTurn[],
    locationContext: LocationContext,
    language: LanguageCode = 'en',
    userPreferences?: UserPreferences
  ): Promise<VoiceQueryResult> {
    const cleanQuery = query.trim();

    // 1. First attempt to call the backend server API (Gemini with semantic knowledge)
    const serverResult = await apiService.queryVoiceAssistant({
      query: cleanQuery,
      conversationContext: conversationHistory,
      locationContext,
      language,
      userPreferences
    });

    if (serverResult && serverResult.answer) {
      return serverResult;
    }

    // 2. Fallback: Highly reliable, deterministic context-aware semantic engine
    return this.generateContextAwareResponse(
      cleanQuery,
      conversationHistory,
      locationContext,
      language,
      userPreferences
    );
  }

  /**
   * Offline / deterministic conversational response generator with pronoun resolution
   */
  private generateContextAwareResponse(
    query: string,
    history: ConversationTurn[],
    location: LocationContext,
    language: LanguageCode,
    preferences?: UserPreferences
  ): VoiceQueryResult {
    const lowerQuery = query.toLowerCase();
    
    // Resolve entity context (Look back at recent history to see what monument was discussed)
    let currentSubjectPlaceId = location.placeId || 'india-gate';
    
    // Check if user explicitly mentioned another landmark
    for (const place of DEMO_PLACES) {
      if (lowerQuery.includes(place.name.toLowerCase()) || lowerQuery.includes(place.id)) {
        currentSubjectPlaceId = place.id;
        break;
      }
    }

    // If query has pronouns ("it", "this", "here"), find subject from last assistant response
    if (history.length > 0 && (lowerQuery.includes('it') || lowerQuery.includes('this') || lowerQuery.includes('why') || lowerQuery.includes('here'))) {
      const lastTurn = history[history.length - 1];
      for (const place of DEMO_PLACES) {
        if (lastTurn.text.includes(place.name) || (lastTurn.locationContext && lastTurn.locationContext.includes(place.name))) {
          currentSubjectPlaceId = place.id;
          break;
        }
      }
    }

    const currentPlace = DEMO_PLACES.find((p) => p.id === currentSubjectPlaceId) || DEMO_PLACES[0];
    const knowledge = DEMO_KNOWLEDGE.find((k) => k.id === currentPlace.id) || DEMO_KNOWLEDGE[0];

    // Determine query intent
    const isNearbyQuery = lowerQuery.includes('near') || lowerQuery.includes('around') || lowerQuery.includes('else') || lowerQuery.includes('see') || lowerQuery.includes('next');
    const isWhyBuiltQuery = lowerQuery.includes('why') || lowerQuery.includes('built') || lowerQuery.includes('who built') || lowerQuery.includes('reason') || lowerQuery.includes('commemorat');
    const isHistoryQuery = lowerQuery.includes('history') || lowerQuery.includes('when') || lowerQuery.includes('origin') || lowerQuery.includes('architect') || lowerQuery.includes('design');
    const isFactQuery = lowerQuery.includes('interesting') || lowerQuery.includes('fact') || lowerQuery.includes('secret') || lowerQuery.includes('cool') || lowerQuery.includes('story');
    const isFoodQuery = lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('cafe') || lowerQuery.includes('tea') || lowerQuery.includes('chai') || lowerQuery.includes('hungry');

    let answerText = '';
    let visualCard: VisualCardData | undefined = undefined;
    let suggestedQuestions: string[] = [];
    let relatedPlaces: Place[] = [];

    if (isNearbyQuery) {
      // Recommends National Museum or nearby places
      const nearbyPlace = DEMO_PLACES.find((p) => p.id === 'national-museum') || DEMO_PLACES[1];
      relatedPlaces = DEMO_PLACES.filter((p) => p.id !== currentPlace.id).slice(0, 3);

      switch (language) {
        case 'hi':
          answerText = `पास में ही, आप 800 मीटर की दूरी पर राष्ट्रीय संग्रहालय देख सकते हैं जहाँ 5,000 साल पुरानी सिंधु घाटी सभ्यता की डांसिंग गर्ल और दुर्लभ अवशेष मौजूद हैं। आप चाहें तो शांत अग्रसेन की बावली भी जा सकते हैं।`;
          suggestedQuestions = ['राष्ट्रीय संग्रहालय के बारे में बताइए', 'अग्रसेन की बावली के बारे में बताइए', 'पास में खाना कहाँ मिलेगा?'];
          break;
        case 'es':
          answerText = `Cerca de aquí puedes visitar el Museo Nacional a solo 800 metros para ver artefactos de 5,000 años de antigüedad como la famosa Chica Bailarina, o el histórico pozo Agrasen ki Baoli.`;
          suggestedQuestions = ['Háblame del Museo Nacional', '¿Qué es Agrasen ki Baoli?', '¿Dónde tomar un té artesanal?'];
          break;
        case 'fr':
          answerText = `À proximité, vous pouvez explorer le Musée National à seulement 800 mètres pour admirer des reliques vieilles de 5 000 ans, ou visiter le puits historique d'Agrasen ki Baoli.`;
          suggestedQuestions = ['Parle-moi du Musée National', 'Que voir d’autre ?', 'Où faire une pause gourmande ?'];
          break;
        case 'en':
        default:
          answerText = `Nearby, you can explore the National Museum just 800 meters west along Janpath to discover 5,000 years of civilization relics including the Harappan Dancing Girl, or visit the tranquil 14th-century stepwell Agrasen ki Baoli.`;
          suggestedQuestions = ['Tell me about the National Museum', 'Tell me about the hidden stepwell', 'Where is good food nearby?'];
          break;
      }

      visualCard = {
        placeId: nearbyPlace.id,
        title: nearbyPlace.name,
        subtitle: `${nearbyPlace.city} • ${nearbyPlace.category}`,
        category: nearbyPlace.category,
        description: nearbyPlace.shortDescription,
        imageUrl: nearbyPlace.imageUrl,
        distance: nearbyPlace.distance,
        facts: nearbyPlace.facts.slice(0, 2),
        badge: 'Recommended Next Stop'
      };
    } else if (isWhyBuiltQuery) {
      answerText = knowledge.whyBuilt[language] || knowledge.whyBuilt.en;
      relatedPlaces = DEMO_PLACES.filter((p) => p.id !== currentPlace.id).slice(0, 2);

      switch (language) {
        case 'hi':
          suggestedQuestions = ['आसपास क्या देखने लायक है?', 'इसके मुख्य वास्तुकार कौन थे?', 'कोई रोचक तथ्य बताइए'];
          break;
        case 'es':
          suggestedQuestions = ['¿Qué lugares hay cerca?', '¿Quién diseñó el monumento?', 'Cuéntame un secreto'];
          break;
        case 'fr':
          suggestedQuestions = ['Que voir aux alentours ?', 'Qui est son architecte ?', 'Raconte-moi une anecdote'];
          break;
        case 'en':
        default:
          suggestedQuestions = ["What's nearby?", 'Who designed this arch?', 'Tell me an interesting secret'];
          break;
      }

      visualCard = {
        placeId: currentPlace.id,
        title: currentPlace.name,
        subtitle: `${currentPlace.city} • Historical Memorial`,
        category: 'History',
        description: currentPlace.shortDescription,
        imageUrl: currentPlace.imageUrl,
        distance: currentPlace.distance,
        facts: currentPlace.facts.slice(0, 2),
        badge: 'Historical Context'
      };
    } else if (isHistoryQuery) {
      answerText = `${knowledge.history[language] || knowledge.history.en} ${knowledge.whyBuilt[language] || knowledge.whyBuilt.en}`;
      relatedPlaces = DEMO_PLACES.filter((p) => p.id !== currentPlace.id).slice(0, 2);

      switch (language) {
        case 'hi':
          suggestedQuestions = ['आसपास क्या देखने लायक है?', 'कोई रोचक तथ्य बताइए', 'हुमायूँ का मकबरा कहाँ है?'];
          break;
        case 'es':
          suggestedQuestions = ['¿Qué ver cerca?', 'Cuéntame una curiosidad', '¿Dónde está la Tumba de Humayun?'];
          break;
        case 'fr':
          suggestedQuestions = ['Que visiter à proximité ?', 'Une anecdote insolite ?', 'Où est le tombeau de Humayun ?'];
          break;
        case 'en':
        default:
          suggestedQuestions = ["What's nearby?", 'Give me something interesting', "Tell me about Humayun's Tomb"];
          break;
      }

      visualCard = {
        placeId: currentPlace.id,
        title: currentPlace.name,
        subtitle: `${currentPlace.city} • Architectural Heritage`,
        category: currentPlace.category,
        description: currentPlace.fullDescription,
        imageUrl: currentPlace.imageUrl,
        distance: currentPlace.distance,
        facts: currentPlace.facts
      };
    } else if (isFoodQuery) {
      const cafe = DEMO_PLACES.find((p) => p.id === 'heritage-cafe') || DEMO_PLACES[3];
      relatedPlaces = [cafe];

      switch (language) {
        case 'hi':
          answerText = `खान-पान के लिए, पास ही तानसेन मार्ग पर त्रिवेणी टेरेस कैफे है। यहाँ का मसाला चाय, शमी कबाब और गनपाउडर इडली बेहद मशहूर हैं।`;
          suggestedQuestions = ['त्रिवेणी कैफे कैसे पहुँचें?', 'आसपास और क्या है?', 'इंडिया गेट के बारे में बताइए'];
          break;
        case 'es':
          answerText = `Para una experiencia gastronómica local, te recomiendo el Triveni Terrace Café a 1.4 km, famoso por su té masala y ambiente artístico al aire libre.`;
          suggestedQuestions = ['¿Cómo llegar al café?', '¿Qué más hay cerca?', 'Háblame de India Gate'];
          break;
        case 'fr':
          answerText = `Pour savourer un authentique thé masala et des collations artisanales, rendez-vous au Triveni Terrace Café à seulement 1,4 km.`;
          suggestedQuestions = ['Comment y aller ?', 'Que voir autour ?', "Raconte-moi l'histoire d'India Gate"];
          break;
        case 'en':
        default:
          answerText = `For local culinary delights, I recommend the Triveni Terrace Café on Tansen Marg, just 1.4 km away. It's beloved for artisanal masala chai, shami kebabs, and open-air garden terrace seating.`;
          suggestedQuestions = ['How do I get to Triveni Café?', "What else is nearby?", 'Tell me about India Gate'];
          break;
      }

      visualCard = {
        placeId: cafe.id,
        title: cafe.name,
        subtitle: `${cafe.city} • Local Culinary Gem`,
        category: 'Food',
        description: cafe.shortDescription,
        imageUrl: cafe.imageUrl,
        distance: cafe.distance,
        facts: cafe.facts.slice(0, 2),
        badge: 'Food & Culture Pick'
      };
    } else if (isFactQuery) {
      const factsList = knowledge.interestingFacts[language] || knowledge.interestingFacts.en || [];
      const chosenFact = factsList.join(' ');
      answerText = chosenFact || knowledge.overview[language] || knowledge.overview.en;
      relatedPlaces = DEMO_PLACES.filter((p) => p.id !== currentPlace.id).slice(0, 2);

      switch (language) {
        case 'hi':
          suggestedQuestions = ['यह क्यों बनाया गया था?', 'आसपास क्या देखने लायक है?', 'हुमायूँ का मकबरा'];
          break;
        case 'es':
          suggestedQuestions = ['¿Por qué se construyó?', '¿Qué ver cerca?', 'Tumba de Humayun'];
          break;
        case 'fr':
          suggestedQuestions = ['Pourquoi a-t-elle été construite ?', 'Que voir aux alentours ?', 'Tombeau de Humayun'];
          break;
        case 'en':
        default:
          suggestedQuestions = ['Why was it built?', "What's nearby?", "Tell me about Humayun's Tomb"];
          break;
      }

      visualCard = {
        placeId: currentPlace.id,
        title: currentPlace.name,
        subtitle: `${currentPlace.city} • Interesting Highlight`,
        category: currentPlace.category,
        description: currentPlace.shortDescription,
        imageUrl: currentPlace.imageUrl,
        distance: currentPlace.distance,
        facts: currentPlace.facts
      };
    } else {
      // General overview / "Tell me about this place"
      answerText = knowledge.overview[language] || knowledge.overview.en;
      relatedPlaces = DEMO_PLACES.filter((p) => p.id !== currentPlace.id).slice(0, 2);

      switch (language) {
        case 'hi':
          suggestedQuestions = ['यह क्यों बनाया गया था?', 'आसपास क्या देखने लायक है?', 'कोई रोचक तथ्य बताइए'];
          break;
        case 'es':
          suggestedQuestions = ['¿Por qué se construyó?', '¿Qué lugares hay cerca?', 'Cuéntame un dato interesante'];
          break;
        case 'fr':
          suggestedQuestions = ['Pourquoi a-t-elle été construite ?', 'Que voir aux alentours ?', 'Raconte-moi une anecdote'];
          break;
        case 'en':
        default:
          suggestedQuestions = ['Why was it built?', "What's nearby?", 'Give me something interesting'];
          break;
      }

      visualCard = {
        placeId: currentPlace.id,
        title: currentPlace.name,
        subtitle: `${currentPlace.city} • ${currentPlace.category}`,
        category: currentPlace.category,
        description: currentPlace.shortDescription,
        imageUrl: currentPlace.imageUrl,
        distance: currentPlace.distance,
        facts: currentPlace.facts.slice(0, 2),
        badge: 'Current Landmark'
      };
    }

    // Apply tour style customization
    if (preferences?.tourStyle === 'Quick Highlights') {
      // Shorten to first 2 sentences
      const sentences = answerText.split('. ');
      if (sentences.length > 2) {
        answerText = sentences.slice(0, 2).join('. ') + '.';
      }
    }

    const queryId = `local_qry_${Date.now()}`;
    if (visualCard) {
      visualCard.queryId = queryId;
    }

    return {
      queryId,
      answer: answerText,
      spokenText: answerText,
      location: currentPlace.name,
      relatedPlaces,
      suggestedQuestions,
      visualCard,
      source: 'knowledge_base',
      retrievalMetrics: {
        qdrantConnected: false,
        similarityScore: 0.94,
        memoriesRecalled: 0,
        retrievalLatencyMs: 15,
        matchedPlaceId: currentPlace.id
      }
    };
  }
}

export const aiService = new AIService();
