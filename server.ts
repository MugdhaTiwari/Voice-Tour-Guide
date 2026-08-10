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

// Lazy Gemini client helper
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'NEARO',
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
});

// Voice Query Endpoint
app.post('/api/voice/query', async (req, res) => {
  try {
    const { query, conversationContext, locationContext, language, userPreferences } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const ai = getGeminiClient();

    // If no Gemini API key is configured, return null so frontend gracefully uses local knowledge base
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured on server',
        fallbackNeeded: true
      });
    }

    const langName = language === 'hi' ? 'Hindi' : language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'English';
    const tourStyle = userPreferences?.tourStyle || 'Balanced';
    const interests = userPreferences?.interests?.join(', ') || 'History, Architecture, Culture';

    const systemPrompt = `You are NEARO, a friendly, knowledgeable, and engaging AI voice tour companion for tourists walking around real-world locations.
Your user is currently exploring "${locationContext?.name || 'India Gate'}" in "${locationContext?.city || 'New Delhi'}".
Tourist interests: ${interests}.
Tour style: ${tourStyle} (If "Quick Highlights", keep response to 2 crisp spoken sentences. If "Balanced", give 3-4 vivid sentences. If "Deep Dive", give rich historical context).
Target language: ${langName}.

CRITICAL RULES:
1. You are speaking directly into the tourist's headphones/device as they look around the monument.
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
    return res.json({
      ...parsedData,
      spokenText: parsedData.answer,
      source: 'gemini'
    });
  } catch (error: any) {
    console.warn('Gemini server query error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process voice query with Gemini',
      fallbackNeeded: true
    });
  }
});

async function start() {
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
