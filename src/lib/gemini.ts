import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompt = `You are a dating conversation expert. Analyze the chat screenshot and generate engaging response suggestions.

Rules:
1. Understand the conversation context and tone
2. Generate responses that are natural and contextually appropriate
3. Never generate harassment, hate speech, or explicit content
4. Keep responses concise (under 150 characters ideal for dating apps)
5. Match the energy level of the conversation
6. Focus on the last 3-5 messages for context

You MUST respond with valid JSON only, no markdown, no code blocks. Format:
{
  "contextSummary": "Brief description of conversation state",
  "witty": ["response1", "response2"],
  "romantic": ["response1", "response2"],
  "savage": ["response1", "response2"]
}`;

export interface AIResponse {
  contextSummary: string;
  witty: string[];
  romantic: string[];
  savage: string[];
}

export async function analyzeScreenshot(imageBase64: string): Promise<AIResponse> {
  console.log('Starting Gemini analysis...');
  console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    console.log('Sending request to Gemini...');
    
    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      },
      'Analyze this dating app conversation and suggest responses. Return JSON only.',
    ]);

    console.log('Got response from Gemini');
    
    const response = result.response;
    const text = response.text();
    
    console.log('Response text:', text?.substring(0, 200));
    
    if (!text) {
      throw new Error('No response from AI');
    }

    // Clean up response - remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.slice(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const parsed = JSON.parse(cleanText) as AIResponse;

    // Validate response structure
    if (!parsed.contextSummary || !parsed.witty || !parsed.romantic || !parsed.savage) {
      throw new Error('Invalid response structure');
    }

    if (parsed.witty.length < 2 || parsed.romantic.length < 2 || parsed.savage.length < 2) {
      throw new Error('Insufficient responses generated');
    }

    return parsed;
  } catch (error) {
    console.error('Gemini error:', error);
    throw error;
  }
}
