/**
 * retrievalService.ts
 * 
 * Semantic Knowledge Retrieval Layer.
 * In production, this layer connects via the backend to a Qdrant Vector Database
 * containing vectorized travel encyclopedias, historical monographs, and municipal records.
 * 
 * For the prototype, it provides a local semantic search engine over structured
 * knowledge records and place metadata.
 */

import { DEMO_KNOWLEDGE } from '../data/demoKnowledge';
import { DEMO_PLACES } from '../data/demoPlaces';
import { InterestCategory, KnowledgeItem, Place } from '../types';

export interface RetrievalResult {
  knowledgeItem?: KnowledgeItem;
  matchedPlace?: Place;
  relevanceScore: number;
  snippet: string;
  suggestedPlaces: Place[];
}

class RetrievalService {
  /**
   * Searches semantic knowledge for a spoken tourist query, current location context, and category
   */
  public searchKnowledge(
    query: string,
    locationContext: string = 'India Gate',
    category?: InterestCategory
  ): RetrievalResult {
    const cleanQuery = query.toLowerCase().trim();
    const cleanLocation = locationContext.toLowerCase();

    // 1. Identify primary entity being asked about
    let matchedPlace: Place | undefined = undefined;
    let matchedKnowledge: KnowledgeItem | undefined = undefined;

    // Check if query directly references a known place
    for (const place of DEMO_PLACES) {
      if (
        cleanQuery.includes(place.name.toLowerCase()) ||
        place.tags.some((tag) => cleanQuery.includes(tag.toLowerCase()))
      ) {
        matchedPlace = place;
        break;
      }
    }

    // If query uses pronouns ("this place", "it", "here", "why was it built"), use the location context
    if (!matchedPlace) {
      for (const place of DEMO_PLACES) {
        if (
          cleanLocation.includes(place.name.toLowerCase()) ||
          cleanLocation.includes(place.id.toLowerCase())
        ) {
          matchedPlace = place;
          break;
        }
      }
    }

    if (!matchedPlace) {
      matchedPlace = DEMO_PLACES[0]; // Default to India Gate
    }

    // Find associated knowledge record
    matchedKnowledge = DEMO_KNOWLEDGE.find(
      (k) =>
        k.id === matchedPlace?.id ||
        k.name.toLowerCase() === matchedPlace?.name.toLowerCase()
    ) || DEMO_KNOWLEDGE[0];

    // Determine relevant nearby places
    const relatedPlaces = DEMO_PLACES.filter(
      (p) => p.id !== matchedPlace?.id
    );

    // Build snippet
    let snippet = matchedKnowledge.overview.en;
    if (cleanQuery.includes('why') || cleanQuery.includes('built') || cleanQuery.includes('reason') || cleanQuery.includes('history')) {
      snippet = matchedKnowledge.whyBuilt.en + ' ' + matchedKnowledge.history.en;
    } else if (cleanQuery.includes('near') || cleanQuery.includes('else') || cleanQuery.includes('around') || cleanQuery.includes('see')) {
      snippet = matchedKnowledge.nearbyRecommendation.en;
    }

    return {
      knowledgeItem: matchedKnowledge,
      matchedPlace,
      relevanceScore: 0.94,
      snippet,
      suggestedPlaces: relatedPlaces.slice(0, 3)
    };
  }

  /**
   * Retrieves places matching specific tourist interest tags
   */
  public getPlacesByInterests(interests: InterestCategory[]): Place[] {
    if (!interests || interests.length === 0) {
      return DEMO_PLACES;
    }

    return DEMO_PLACES.filter((p) => interests.includes(p.category));
  }
}

export const retrievalService = new RetrievalService();
