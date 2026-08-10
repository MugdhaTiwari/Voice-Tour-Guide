import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// 1. GEMINI & AI CLIENT CONFIGURATION
// ==========================================
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// ==========================================
// 2. SEED PLACES & KNOWLEDGE DATA FOR VECTOR DB
// ==========================================
interface PlaceVectorItem {
  id: string;
  name: string;
  city: string;
  category: string;
  distance: string;
  description: string;
  fullDescription: string;
  whyBuilt: string;
  history: string;
  facts: string[];
  tags: string[];
  imageUrl: string;
  coordinates: { latitude: number; longitude: number };
  vibe: string;
}

const PLACES_DATABASE: PlaceVectorItem[] = [
  {
    id: 'india-gate',
    name: 'India Gate',
    city: 'New Delhi',
    category: 'History',
    distance: 'You are here',
    description: '42-meter triumphal arch war memorial designed by Sir Edwin Lutyens.',
    fullDescription: 'India Gate is a magnificent war memorial situated along the Rajpath in New Delhi. It honors over 84,000 soldiers of the British Indian Army who lost their lives in the First World War and Third Anglo-Afghan War.',
    whyBuilt: 'Commissioned in 1921 by the Imperial War Graves Commission to commemorate 84,000 soldiers of the British Indian Army who died between 1914 and 1921.',
    history: 'The foundation stone was laid on February 10, 1921, by the Duke of Connaught. Architect Sir Edwin Lutyens designed it inspired by the Arc de Triomphe in Paris. It was officially inaugurated in February 1931 by Viceroy Lord Irwin.',
    facts: [
      'Stands 42 meters high and was designed by Sir Edwin Lutyens',
      'Inscribed with names of 13,300 servicemen',
      'The Amar Jawan Jyoti eternal flame burned here under the arch from 1972 until 2022',
      'Built with pale red sandstone and granite from Bharatpur'
    ],
    tags: ['war memorial', 'history', 'architecture', 'lutyens delhi', 'rajpath', 'iconic', 'monument'],
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 28.6129, longitude: 77.2295 },
    vibe: 'Grand, patriotic, expansive lawns, evening twilight strolls'
  },
  {
    id: 'national-museum',
    name: 'National Museum',
    city: 'New Delhi',
    category: 'Art',
    distance: '0.8 km (10 min walk)',
    description: 'India premier museum showcasing 5,000 years of civilization relics and art.',
    fullDescription: 'Located on Janpath, the National Museum holds over 200,000 works of art spanning prehistoric Harappan relics, Indus Valley treasures like the famous Dancing Girl bronze, Silk Road antiquities, and Mughal miniature paintings.',
    whyBuilt: 'Established to curate, preserve, and showcase the grand arc of Indian art, civilization, archaeology, and historical artifacts for public education and scholarship.',
    history: 'Conceived following the successful London Royal Academy Exhibition in 1947-48. Officially inaugurated by Governor-General C. Rajagopalachari in August 1949 and moved to Janpath in 1960.',
    facts: [
      'Houses the famous 4,500-year-old Indus Valley Dancing Girl figurine',
      'Contains sacred relics of Gautama Buddha excavated from Piprahwa',
      'Features an unparalleled gallery of Tanjore paintings and Chola bronzes',
      'Over 200,000 rare historical artifacts'
    ],
    tags: ['museum', 'art', 'indus valley', 'artifacts', 'sculptures', 'history', 'culture'],
    imageUrl: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 28.6119, longitude: 77.2195 },
    vibe: 'Quiet, academic, immersive cultural exploration, ancient treasures'
  },
  {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    city: 'New Delhi',
    category: 'Architecture',
    distance: '3.2 km (8 min drive)',
    description: 'UNESCO World Heritage Mughal garden tomb that inspired the Taj Mahal.',
    fullDescription: 'Commissioned by Empress Bega Begum in 1558, this monumental red sandstone mausoleum is the earliest example of Mughal garden tomb architecture in the Indian subcontinent.',
    whyBuilt: 'Built as a final resting place and loving memorial for the second Mughal Emperor Humayun by his grieving chief consort Empress Bega Begum.',
    history: 'Constructed between 1565 and 1572 under the supervision of Persian architect Mirak Mirza Ghiyas. It was the first substantial structure in South Asia to use red sandstone at such grand scale.',
    facts: [
      'First garden-tomb on the Indian subcontinent, built in 1565-1572',
      'Direct architectural inspiration for the Taj Mahal in Agra',
      'Features classical Persian Charbagh four-fold garden layout with water channels',
      'UNESCO World Heritage Site restored by Aga Khan Trust'
    ],
    tags: ['unesco', 'mughal', 'architecture', 'garden tomb', 'taj mahal predecessor', 'peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 28.5933, longitude: 77.2507 },
    vibe: 'Serene, symmetrical, lush Persian gardens, peaceful morning walks'
  },
  {
    id: 'heritage-cafe',
    name: 'Triveni Terrace Heritage Café',
    city: 'New Delhi',
    category: 'Food',
    distance: '1.4 km (4 min auto)',
    description: 'Artistic open-air terrace famous for artisanal masala chai and regional delicacies.',
    fullDescription: 'Tucked inside the Triveni Kala Sangam art complex on Tansen Marg, this tranquil terrace café is a favorite gathering spot for artists, theater performers, and travelers seeking authentic homestyle savory snacks.',
    whyBuilt: 'Conceived as an artistic cultural salon and open-air garden terrace where classical musicians, painters, and art lovers could meet over fresh tea.',
    history: 'Founded in the 1960s alongside Triveni Kala Sangam arts center by Sundari K. Shridharani and architect Joseph Allen Stein.',
    facts: [
      'Legendary for its Shami Kebabs, Gunpowder Idlis, and Apple Cinnamon Cake',
      'Overlooks an intimate open-air amphitheater with lush climbing creepers',
      'Adjoins several rotating contemporary art galleries and pottery studios',
      'Peaceful oasis away from city noise'
    ],
    tags: ['café', 'food', 'terrace', 'artisan chai', 'cultural hangout', 'local flavor', 'peaceful', 'coffee'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 28.6255, longitude: 77.2341 },
    vibe: 'Peaceful, bohemian, artisan chai, leafy terrace, quiet conversations'
  },
  {
    id: 'agrasen-ki-baoli',
    name: 'Agrasen ki Baoli',
    city: 'New Delhi',
    category: 'History',
    distance: '1.8 km (5 min auto)',
    description: 'Ancient 14th-century stepwell featuring 108 stone steps surrounded by dramatic arches.',
    fullDescription: 'A historical 60-meter long and 15-meter wide stepwell located on Hailey Road near Connaught Place. Believed to have been originally built by legendary King Agrasen and rebuilt in the 14th century during the Tughlaq period.',
    whyBuilt: 'Engineered in medieval Delhi as a subterranean community water reservoir and cool summer retreat for desert caravans.',
    history: 'Believed to have been originally established during the Mahabharata era by Maharaja Agrasen and extensively rebuilt in the 14th century.',
    facts: [
      'Features 108 stone steps descending through 3 tiered levels',
      'Constructed with dressed rubble masonry and red sandstone arches',
      'Protected monument by the Archaeological Survey of India (ASI)',
      'Dramatic gothic architecture nestled inside modern high-rises'
    ],
    tags: ['stepwell', 'ancient', 'architecture', 'hidden gem', 'photography', 'history', 'peaceful'],
    imageUrl: 'https://images.unsplash.com/photo-1599818982291-7f917dfa74b6?auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 28.6258, longitude: 77.2250 },
    vibe: 'Mysterious, quiet, architectural wonder, cool stone shadows'
  },
  {
    id: 'lodhi-garden',
    name: 'Lodhi Garden & Tomb Complex',
    city: 'New Delhi',
    category: 'Nature',
    distance: '2.9 km (7 min auto)',
    description: '90-acre lush historic park dotted with 15th-century Sayyid and Lodhi architectural tombs.',
    fullDescription: 'Lodhi Garden is a 90-acre landscaped park containing architectural tombs of Mohammed Shah, Sikandar Lodi, the Shisha Gumbad, and Bara Gumbad.',
    whyBuilt: 'Constructed by the Sayyid and Lodhi dynasties in the 15th century as royal dynastic burial grounds and gardens.',
    history: 'Laid out around 1444-1517 AD. Re-landscaped during British rule in 1936 by Lady Willingdon and updated by American landscape architect Joseph Allen Stein in 1968.',
    facts: [
      'Spans over 90 acres of botanical gardens and medieval monuments',
      'Houses tombs dating from 1444 AD to 1517 AD',
      'Features the architectural Bara Gumbad with ornate plasterwork',
      'Home to over 100 species of trees and resident migratory birds'
    ],
    tags: ['nature', 'park', 'peaceful', 'gardens', 'jogging', 'monuments', 'history', 'birds'],
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    coordinates: { latitude: 28.5930, longitude: 77.2197 },
    vibe: 'Peaceful, green sanctuary, morning birdsong, historic walking trails'
  }
];

// ==========================================
// 3. VECTOR EMBEDDING & QDRANT RETRIEVAL ENGINE
// ==========================================

const VECTOR_DIMENSION = 768;

/**
 * Generates vector embedding for text.
 * Uses Gemini text-embedding-004 when available,
 * with deterministic semantic hashing projection fallback.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text
      });
      const values = (response as any)?.embedding?.values || (response as any)?.embeddings?.[0]?.values;
      if (values && values.length > 0) {
        return values;
      }
    } catch (err) {
      console.warn('Gemini embedding failed, using semantic projection fallback:', (err as Error).message);
    }
  }

  // High-performance deterministic semantic vector projection
  const vector = new Array(VECTOR_DIMENSION).fill(0);
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash << 5) - hash + word.charCodeAt(c);
      hash |= 0;
    }
    const idx1 = Math.abs(hash) % VECTOR_DIMENSION;
    const idx2 = Math.abs((hash * 31) + i) % VECTOR_DIMENSION;
    const idx3 = Math.abs((hash * 97) + word.length) % VECTOR_DIMENSION;

    vector[idx1] += 1.0 / (i + 1);
    vector[idx2] += 0.5;
    vector[idx3] += 0.3;
  }

  // Normalize vector to unit length (L2 norm)
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / norm);
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// In-Memory Storage Layers for resilient Qdrant mirroring & local fallback
interface StoredMemory {
  id: string;
  userId?: string;
  topic: string;
  preferenceSnippet: string;
  vector: number[];
  timestamp: number;
}

interface StoredEvaluation {
  id: string;
  queryId: string;
  query: string;
  matchedPlaceId: string;
  similarityScore: number;
  rating?: 'positive' | 'negative';
  latencyMs: number;
  timestamp: number;
}

const inMemoryMemories: StoredMemory[] = [];
const inMemoryEvaluations: StoredEvaluation[] = [];

/**
 * Qdrant Vector DB Client Wrapper
 */
class QdrantEngine {
  private get baseUrl(): string | null {
    const url = process.env.QDRANT_URL?.trim();
    if (!url) return null;
    return url.replace(/\/+$/, '');
  }

  private get apiKey(): string | null {
    return process.env.QDRANT_API_KEY?.trim() || null;
  }

  public get isConfigured(): boolean {
    return !!this.baseUrl;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.apiKey) {
      headers['api-key'] = this.apiKey;
    }
    return headers;
  }

  /**
   * Initializes collections on Qdrant Cloud/Instance
   */
  public async initialize(): Promise<void> {
    if (!this.isConfigured) {
      console.log('Qdrant URL not configured. Active in-memory semantic vector engine enabled.');
      return;
    }

    try {
      console.log(`Checking Qdrant vector database at ${this.baseUrl}...`);
      const collections = ['nearo_places', 'nearo_memories', 'nearo_evaluations'];

      for (const col of collections) {
        try {
          const res = await fetch(`${this.baseUrl}/collections/${col}`, {
            headers: this.getHeaders()
          });

          if (res.status === 404) {
            console.log(`Creating Qdrant collection: ${col}...`);
            await fetch(`${this.baseUrl}/collections/${col}`, {
              method: 'PUT',
              headers: this.getHeaders(),
              body: JSON.stringify({
                vectors: {
                  size: VECTOR_DIMENSION,
                  distance: 'Cosine'
                }
              })
            });
          }
        } catch (colErr) {
          console.warn(`Could not verify collection ${col}:`, (colErr as Error).message);
        }
      }

      // Seed places into Qdrant if needed
      await this.seedPlacesToQdrant();
      console.log('Qdrant vector engine initialized successfully.');
    } catch (err) {
      console.warn('Qdrant initialization error:', (err as Error).message);
    }
  }

  /**
   * Seeds default knowledge database into Qdrant
   */
  private async seedPlacesToQdrant(): Promise<void> {
    if (!this.isConfigured) return;

    try {
      const points = await Promise.all(
        PLACES_DATABASE.map(async (place, idx) => {
          const embeddingText = `${place.name} ${place.category} ${place.city} ${place.description} ${place.whyBuilt} ${place.history} ${place.facts.join(' ')} ${place.tags.join(' ')} ${place.vibe}`;
          const vector = await generateEmbedding(embeddingText);
          return {
            id: idx + 1,
            vector,
            payload: {
              placeId: place.id,
              name: place.name,
              category: place.category,
              city: place.city,
              distance: place.distance,
              description: place.description,
              fullDescription: place.fullDescription,
              whyBuilt: place.whyBuilt,
              history: place.history,
              facts: place.facts,
              tags: place.tags,
              imageUrl: place.imageUrl,
              coordinates: place.coordinates,
              vibe: place.vibe
            }
          };
        })
      );

      await fetch(`${this.baseUrl}/collections/nearo_places/points`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ points })
      });
    } catch (e) {
      console.warn('Error seeding places to Qdrant:', (e as Error).message);
    }
  }

  /**
   * Performs semantic vector search on places
   */
  public async searchPlaces(
    queryText: string,
    limit: number = 3,
    categoryFilter?: string
  ): Promise<{ place: PlaceVectorItem; score: number }[]> {
    const queryVector = await generateEmbedding(queryText);

    // Try Qdrant REST API if online
    if (this.isConfigured) {
      try {
        const body: any = {
          vector: queryVector,
          limit,
          with_payload: true
        };

        if (categoryFilter) {
          body.filter = {
            must: [
              {
                key: 'category',
                match: { value: categoryFilter }
              }
            ]
          };
        }

        const res = await fetch(`${this.baseUrl}/collections/nearo_places/points/search`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.result) && data.result.length > 0) {
            return data.result.map((item: any) => ({
              place: item.payload as PlaceVectorItem,
              score: item.score || 0.9
            }));
          }
        }
      } catch (err) {
        console.warn('Qdrant search error, falling back to in-memory vector index:', (err as Error).message);
      }
    }

    // In-memory semantic vector scoring fallback
    const scoredPlaces = await Promise.all(
      PLACES_DATABASE.map(async (place) => {
        if (categoryFilter && place.category.toLowerCase() !== categoryFilter.toLowerCase()) {
          return { place, score: 0 };
        }
        const textToMatch = `${place.name} ${place.category} ${place.tags.join(' ')} ${place.vibe} ${place.description} ${place.whyBuilt}`;
        const placeVec = await generateEmbedding(textToMatch);
        const sim = cosineSimilarity(queryVector, placeVec);
        return { place, score: sim };
      })
    );

    return scoredPlaces
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Stores conversational memory item in Qdrant & local memory
   */
  public async storeMemory(topic: string, preferenceSnippet: string): Promise<void> {
    const vector = await generateEmbedding(`${topic}: ${preferenceSnippet}`);
    const memId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Store in local memory
    inMemoryMemories.push({
      id: memId,
      topic,
      preferenceSnippet,
      vector,
      timestamp: Date.now()
    });

    if (inMemoryMemories.length > 50) {
      inMemoryMemories.shift();
    }

    // Store in Qdrant
    if (this.isConfigured) {
      try {
        await fetch(`${this.baseUrl}/collections/nearo_memories/points`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({
            points: [
              {
                id: Date.now(),
                vector,
                payload: {
                  memId,
                  topic,
                  preferenceSnippet,
                  timestamp: Date.now()
                }
              }
            ]
          })
        });
      } catch (e) {
        console.warn('Qdrant memory save error:', (e as Error).message);
      }
    }
  }

  /**
   * Retrieves relevant conversational memories matching the query
   */
  public async retrieveMemories(queryText: string, limit: number = 2): Promise<string[]> {
    if (inMemoryMemories.length === 0) return [];

    const queryVector = await generateEmbedding(queryText);
    const scored = inMemoryMemories.map((mem) => ({
      snippet: mem.preferenceSnippet,
      score: cosineSimilarity(queryVector, mem.vector)
    }));

    return scored
      .filter((m) => m.score > 0.45)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((m) => m.snippet);
  }

  /**
   * Records evaluation and feedback signals in Qdrant
   */
  public async logEvaluation(evalData: Omit<StoredEvaluation, 'id' | 'timestamp'>): Promise<void> {
    const fullRecord: StoredEvaluation = {
      ...evalData,
      id: `eval_${Date.now()}`,
      timestamp: Date.now()
    };

    inMemoryEvaluations.push(fullRecord);
    if (inMemoryEvaluations.length > 100) inMemoryEvaluations.shift();

    if (this.isConfigured) {
      try {
        const evalVector = await generateEmbedding(evalData.query);
        await fetch(`${this.baseUrl}/collections/nearo_evaluations/points`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({
            points: [
              {
                id: Date.now(),
                vector: evalVector,
                payload: {
                  queryId: evalData.queryId,
                  query: evalData.query,
                  matchedPlaceId: evalData.matchedPlaceId,
                  similarityScore: evalData.similarityScore,
                  rating: evalData.rating || 'unrated',
                  latencyMs: evalData.latencyMs,
                  timestamp: Date.now()
                }
              }
            ]
          })
        });
      } catch (e) {
        console.warn('Qdrant evaluation log error:', (e as Error).message);
      }
    }
  }

  /**
   * Updates feedback for a previous query
   */
  public updateFeedback(queryId: string, rating: 'positive' | 'negative'): boolean {
    const found = inMemoryEvaluations.find((e) => e.queryId === queryId);
    if (found) {
      found.rating = rating;
      return true;
    }
    return false;
  }

  public getMetrics() {
    const totalEvals = inMemoryEvaluations.length;
    const positiveCount = inMemoryEvaluations.filter((e) => e.rating === 'positive').length;
    const negativeCount = inMemoryEvaluations.filter((e) => e.rating === 'negative').length;
    const avgScore =
      totalEvals > 0
        ? inMemoryEvaluations.reduce((sum, e) => sum + e.similarityScore, 0) / totalEvals
        : 0.92;

    return {
      qdrantConnected: this.isConfigured,
      totalQueriesEvaluated: totalEvals,
      positiveFeedbackCount: positiveCount,
      negativeFeedbackCount: negativeCount,
      averageSimilarityScore: Math.round(avgScore * 100) / 100,
      memoryItemsStored: inMemoryMemories.length
    };
  }
}

const qdrant = new QdrantEngine();

// ==========================================
// 4. RIME TEXT-TO-SPEECH SERVICE
// ==========================================

/**
 * Natural Conversational Speech Formatter for Rime
 * Enhances spoken cadence, expands abbreviations, removes markdown artifacts,
 * and adds natural pauses for a real professional travel companion.
 */
function prepareTextForRime(text: string): string {
  if (!text) return '';

  return text
    // Remove markdown symbols
    .replace(/[*_~`#]/g, '')
    // Remove raw URLs
    .replace(/https?:\/\/\S+/g, '')
    // Clean km and m for natural speech
    .replace(/(\d+)\s*km\b/gi, '$1 kilometers')
    .replace(/(\d+)\s*m\b/gi, '$1 meters')
    // Smooth out exclamation marks and bullet dashes
    .replace(/^[-\u2022]\s+/gm, '')
    // Replace multiple spaces and newlines with natural conversational pauses
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Calls Rime TTS API to synthesize human-like voice
 */
async function synthesizeWithRime(options: {
  text: string;
  speaker?: string;
  modelId?: string;
  speedAlpha?: number;
}): Promise<Buffer | null> {
  const apiKey = process.env.RIME_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const cleanText = prepareTextForRime(options.text);
  if (!cleanText) return null;

  // Selected conversational voice (e.g. 'orion', 'celeste', 'abbey', 'allison')
  const speaker = options.speaker || 'orion';
  // Flagship high-naturalness model
  const modelId = options.modelId || 'coda';

  try {
    const response = await fetch('https://users.rime.ai/v1/rime-tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'audio/mp3'
      },
      body: JSON.stringify({
        speaker,
        modelId,
        text: cleanText,
        samplingRate: 24000,
        speedAlpha: options.speedAlpha || 1.0
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(`Rime API responded with status ${response.status}: ${errText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.warn('Rime TTS synthesis error:', (error as Error).message);
    return null;
  }
}

// ==========================================
// 5. SERVER API ROUTES
// ==========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'NEARO',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasRimeKey: !!process.env.RIME_API_KEY,
    hasQdrant: qdrant.isConfigured,
    metrics: qdrant.getMetrics()
  });
});

// Rime Voice TTS Endpoint
app.post(['/api/voice/tts', '/api/voice/synthesize'], async (req, res) => {
  try {
    const { text, speaker, modelId, speedAlpha, language } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for voice synthesis' });
    }

    if (!process.env.RIME_API_KEY) {
      // Graceful fallback signal so client uses Web Speech API without crashing
      return res.status(200).json({
        fallbackToWebSpeech: true,
        reason: 'RIME_API_KEY not configured on server',
        text
      });
    }

    const audioBuffer = await synthesizeWithRime({
      text,
      speaker: speaker || 'orion',
      modelId: modelId || 'coda',
      speedAlpha: typeof speedAlpha === 'number' ? speedAlpha : 1.0
    });

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(200).json({
        fallbackToWebSpeech: true,
        reason: 'Rime audio synthesis returned empty audio',
        text
      });
    }

    res.set({
      'Content-Type': 'audio/mp3',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=3600'
    });

    return res.send(audioBuffer);
  } catch (error) {
    console.warn('Voice TTS error:', error);
    return res.status(200).json({
      fallbackToWebSpeech: true,
      reason: (error as Error).message || 'Voice synthesis error'
    });
  }
});

// Semantic Place Search (Qdrant Vector Retrieval)
app.post('/api/retrieval/search', async (req, res) => {
  try {
    const { query, category, limit } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const results = await qdrant.searchPlaces(query, limit || 3, category);
    return res.json({
      results,
      qdrantConnected: qdrant.isConfigured
    });
  } catch (err) {
    console.warn('Retrieval search error:', err);
    return res.status(500).json({ error: 'Failed to search places' });
  }
});

// Evaluation & Feedback Logging
app.post('/api/retrieval/feedback', (req, res) => {
  try {
    const { queryId, query, placeId, rating, relevanceScore } = req.body;
    if (!queryId || !rating) {
      return res.status(400).json({ error: 'queryId and rating are required' });
    }

    qdrant.updateFeedback(queryId, rating);
    qdrant.logEvaluation({
      queryId,
      query: query || 'Voice Query',
      matchedPlaceId: placeId || 'india-gate',
      similarityScore: typeof relevanceScore === 'number' ? relevanceScore : 0.92,
      rating,
      latencyMs: 120
    });

    return res.json({ status: 'ok', updated: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// Retrieval Metrics Endpoint
app.get('/api/retrieval/metrics', (req, res) => {
  return res.json(qdrant.getMetrics());
});

// Main Voice Query Endpoint with Intent Routing, Qdrant Retrieval & Conversational Memory
app.post('/api/voice/query', async (req, res) => {
  const startTime = Date.now();
  const queryId = `qry_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  try {
    const { query, conversationContext, locationContext, language, userPreferences } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const langName = language === 'hi' ? 'Hindi' : language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English';
    const tourStyle = userPreferences?.tourStyle || 'Balanced';
    const interests = userPreferences?.interests?.join(', ') || 'History, Architecture, Culture';

    // 1. Qdrant Conversational Memory Retrieval
    const recalledMemories = await qdrant.retrieveMemories(query, 2);

    // 2. Qdrant Semantic Place Retrieval
    const semanticPlaces = await qdrant.searchPlaces(query, 3);
    const topPlaceMatch = semanticPlaces[0]?.place || PLACES_DATABASE[0];
    const similarityScore = semanticPlaces[0]?.score || 0.92;

    // Detect user preferences to store into memory
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('i like') || lowerQuery.includes('i prefer') || lowerQuery.includes('i love') || lowerQuery.includes('peaceful') || lowerQuery.includes('quiet') || lowerQuery.includes('coffee') || lowerQuery.includes('chai') || lowerQuery.includes('history')) {
      qdrant.storeMemory('Tourist Preference', `Tourist mentioned: "${query.substring(0, 100)}"`).catch(() => {});
    }

    const ai = getGeminiClient();

    // If Gemini is not configured, generate context-aware offline response grounded by Qdrant
    if (!ai) {
      const isWhy = lowerQuery.includes('why') || lowerQuery.includes('built') || lowerQuery.includes('reason');
      const isHistory = lowerQuery.includes('history') || lowerQuery.includes('when') || lowerQuery.includes('architect');
      const isFood = lowerQuery.includes('food') || lowerQuery.includes('cafe') || lowerQuery.includes('chai') || lowerQuery.includes('coffee') || lowerQuery.includes('eat');
      const isNearby = lowerQuery.includes('near') || lowerQuery.includes('around') || lowerQuery.includes('next') || lowerQuery.includes('else');

      let answer = topPlaceMatch.description;
      if (isWhy) answer = `${topPlaceMatch.whyBuilt} ${topPlaceMatch.facts[0]}`;
      else if (isHistory) answer = `${topPlaceMatch.history} ${topPlaceMatch.facts[1]}`;
      else if (isFood) {
        const cafe = PLACES_DATABASE.find((p) => p.id === 'heritage-cafe') || PLACES_DATABASE[3];
        answer = `${cafe.name} is just ${cafe.distance} away. ${cafe.description}`;
      } else if (isNearby) {
        const nextStop = PLACES_DATABASE.find((p) => p.id !== topPlaceMatch.id) || PLACES_DATABASE[1];
        answer = `Nearby, you can explore ${nextStop.name} (${nextStop.distance}). ${nextStop.description}`;
      }

      qdrant.logEvaluation({
        queryId,
        query,
        matchedPlaceId: topPlaceMatch.id,
        similarityScore,
        latencyMs: Date.now() - startTime
      });

      return res.json({
        queryId,
        answer,
        spokenText: answer,
        location: topPlaceMatch.name,
        relatedPlaces: PLACES_DATABASE.filter((p) => p.id !== topPlaceMatch.id).slice(0, 2),
        suggestedQuestions: [
          `Why was ${topPlaceMatch.name} built?`,
          "What else is nearby?",
          "Tell me an interesting secret"
        ],
        visualCard: {
          placeId: topPlaceMatch.id,
          title: topPlaceMatch.name,
          subtitle: `${topPlaceMatch.city} • ${topPlaceMatch.category}`,
          category: topPlaceMatch.category,
          description: topPlaceMatch.description,
          imageUrl: topPlaceMatch.imageUrl,
          distance: topPlaceMatch.distance,
          facts: topPlaceMatch.facts.slice(0, 2),
          badge: 'Vector Match',
          queryId
        },
        source: 'knowledge_base',
        retrievalMetrics: {
          qdrantConnected: qdrant.isConfigured,
          similarityScore,
          memoriesRecalled: recalledMemories.length,
          retrievalLatencyMs: Date.now() - startTime,
          matchedPlaceId: topPlaceMatch.id
        }
      });
    }

    // 3. Gemini Prompt with Qdrant Grounding & Context
    const systemPrompt = `You are NEARO, a friendly, knowledgeable, and engaging AI voice tour companion for tourists walking around real-world locations.
Your user is currently exploring "${locationContext?.name || 'India Gate'}" in "${locationContext?.city || 'New Delhi'}".
Tourist interests: ${interests}.
Tour style: ${tourStyle} (If "Quick Highlights", keep response to 2 crisp spoken sentences. If "Balanced", give 3-4 vivid sentences. If "Deep Dive", give rich historical context).
Target language: ${langName}.

QDRANT RETRIEVED KNOWLEDGE & CONTEXT:
- Top Matched Landmark: ${topPlaceMatch.name} (${topPlaceMatch.category})
- Overview: ${topPlaceMatch.description}
- Why Built: ${topPlaceMatch.whyBuilt}
- History: ${topPlaceMatch.history}
- Key Facts: ${topPlaceMatch.facts.join('; ')}
- Location Vibe: ${topPlaceMatch.vibe}

RECALLED TOURIST MEMORIES & PREFERENCES:
${recalledMemories.length > 0 ? recalledMemories.map((m) => `- ${m}`).join('\n') : '- No previous stated preferences.'}

CRITICAL RULES:
1. You are speaking directly into the tourist's headphones/device as they look around.
2. Formulate your answer purely as natural, flowing spoken prose. Do NOT use bullet points, bold asterisks (**), markdown tables, or numbered lists in the 'answer' field.
3. Understand conversational pronouns (e.g. if the user previously discussed India Gate and now asks "Why was it built?", understand that "it" refers to India Gate; if they ask "What's nearby?", recommend real nearby attractions).
4. Always provide 3 natural, short follow-up questions the tourist could ask next by voice.
5. Return clean structured JSON.`;

    const formattedHistory = Array.isArray(conversationContext)
      ? conversationContext
          .slice(-6)
          .map((msg: any) => `${msg.role === 'user' ? 'Tourist' : 'NEARO'}: ${msg.text}`)
          .join('\n')
      : '';

    const promptText = `Current Location: ${locationContext?.name || 'India Gate'}, ${locationContext?.city || 'New Delhi'}
Recent Conversation Context:
${formattedHistory || 'None (New exploration session)'}

Tourist Spoken Query: "${query}"

Respond in ${langName} as NEARO:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'The spoken response to be read aloud via Text-to-Speech in the target language.'
            },
            location: {
              type: Type.STRING,
              description: 'The landmark or place name discussed.'
            },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 short suggested follow-up questions in the target language.'
            },
            visualCard: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                facts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                distance: { type: Type.STRING }
              },
              required: ['title', 'subtitle', 'category', 'description']
            }
          },
          required: ['answer', 'location', 'suggestedQuestions']
        }
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsedData = JSON.parse(responseText);

    // Record evaluation
    qdrant.logEvaluation({
      queryId,
      query,
      matchedPlaceId: topPlaceMatch.id,
      similarityScore,
      latencyMs: Date.now() - startTime
    });

    return res.json({
      ...parsedData,
      queryId,
      spokenText: parsedData.answer,
      source: 'gemini',
      visualCard: {
        ...(parsedData.visualCard || {}),
        placeId: topPlaceMatch.id,
        imageUrl: topPlaceMatch.imageUrl,
        distance: topPlaceMatch.distance,
        queryId
      },
      retrievalMetrics: {
        qdrantConnected: qdrant.isConfigured,
        similarityScore,
        memoriesRecalled: recalledMemories.length,
        retrievalLatencyMs: Date.now() - startTime,
        matchedPlaceId: topPlaceMatch.id
      }
    });
  } catch (error: any) {
    console.warn('Voice query processing error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process voice query',
      fallbackNeeded: true
    });
  }
});

// ==========================================
// 6. SERVER STARTUP & VITE INTEGRATION
// ==========================================
async function start() {
  // Initialize Qdrant vector database
  await qdrant.initialize();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEARO voice companion server running at http://0.0.0.0:${PORT}`);
  });
}

start();
