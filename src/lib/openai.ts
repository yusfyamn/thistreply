import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are ThisReply AI - an expert dating conversation assistant. Your job is to analyze dating app screenshots and generate perfect reply suggestions.

IMPORTANT: First, verify this is a dating app conversation screenshot. If it's NOT a dating conversation (e.g., email, social media, work chat, random image), respond with:
{
  "contextSummary": "NOT_DATING_CONTENT",
  "witty": [],
  "romantic": [],
  "savage": []
}

If it IS a dating conversation, follow these rules:
1. Analyze the conversation context, tone, and energy level
2. Understand what the other person is interested in based on their messages
3. Generate flirty, engaging, and contextually appropriate responses
4. Keep responses SHORT - under 100 characters is ideal for dating apps
5. Match their energy - if they're playful, be playful back
6. Never be creepy, desperate, or inappropriate
7. Use emojis sparingly but effectively
8. Create responses that continue the conversation naturally
9. Be confident but not arrogant
10. Show genuine interest in what they said

RESPONSE STYLES:
- witty: Clever, funny, shows intelligence and humor
- romantic: Sweet, charming, shows genuine interest
- savage: Bold, confident, playfully teasing (never mean)

Output format (JSON only):
{
  "contextSummary": "Brief analysis of the conversation and what they seem interested in",
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
  console.log('Starting OpenAI analysis...');
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this dating app conversation and suggest responses:' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
          ],
        },
      ],
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('OpenAI response received');

    const parsed = JSON.parse(content) as AIResponse;

    // Check for non-dating content
    if (parsed.contextSummary === 'NOT_DATING_CONTENT') {
      throw new Error('NOT_DATING_CONTENT');
    }

    // Validate response structure
    if (!parsed.contextSummary || !parsed.witty || !parsed.romantic || !parsed.savage) {
      throw new Error('Invalid response structure');
    }

    if (parsed.witty.length < 2 || parsed.romantic.length < 2 || parsed.savage.length < 2) {
      throw new Error('Insufficient responses generated');
    }

    return parsed;
  } catch (error) {
    console.error('OpenAI error:', error);
    throw error;
  }
}
