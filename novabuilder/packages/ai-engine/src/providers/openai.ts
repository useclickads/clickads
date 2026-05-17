import fetch from 'node-fetch';
import { AIProvider, AIResponse } from '../index';

export class OpenAIProvider implements AIProvider {
  constructor(private apiKey?: string) {
    this.apiKey = this.apiKey || process.env.OPENAI_API_KEY;
  }

  async generate(prompt: string): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('OpenAI API key not configured');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 512 })
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || JSON.stringify(data);
    return { text, json: data };
  }
}
