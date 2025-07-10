// pages/api/detect-phase.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText as generateTextAi } from 'ai';

const SYSTEM_PROMPT = `You are a Socratic phase classifier.

Your job is to classify a student's message into one of three learning phases: "before", "during", or "after".

Definitions:
- "before": The student is asking for help, expressing confusion, or initiating a new question (e.g., "How do I...?" or "What is 9 - 3?")
- "during": The student is reasoning through a problem, asking a clarifying question about their own thought process (e.g., "Should I factor this next?" or "Is -2 one of the answers?")
- "after": The student is reflecting on what they did, or summarizing their approach (e.g., "So I rewrote the expression as..." or "Then I got x = 3")

Instructions:
- Analyze the **intention** behind the message, not just its format.
- Even if the message is a question, classify it based on the student's role in the learning process.
- Respond with ONLY one word: "before", "during", or "after".
`;

const provider = createOpenAICompatible({
  name: process.env.AI_PROVIDER || 'openrouter',
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'https://chat.bloombot.ai',
    'X-Title': 'Bloombot',
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userInput } = req.body;
    if (!userInput) {
      return res.status(400).json({ error: 'Missing user input' });
    }

    const result = await generateTextAi({
      model: provider(process.env.MODEL || 'gpt-3.5-turbo'),
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userInput },
      ],
      temperature: 0,
      providerOptions: {
        openrouter: {
          max_tokens: 5,
        },
      },
    });

    const response = result.text?.toLowerCase().trim();

    const phase = response?.includes('during')
      ? 'during'
      : response?.includes('after')
      ? 'after'
      : 'before';

    res.status(200).json({ phase });
  } catch (error) {
    console.error('Phase detection error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
