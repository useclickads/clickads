export type AIResponse = { text: string; json?: any };

export interface AIProvider {
  generate(prompt: string, opts?: any): Promise<AIResponse>;
}

export class AIEngine {
  constructor(private provider: AIProvider) {}

  async generate(prompt: string, opts?: any) {
    return this.provider.generate(prompt, opts);
  }
}
export interface AIProvider {
  generate(prompt: string): Promise<string>;
  stream(prompt: string): AsyncGenerator<string>;
  embed(text: string): Promise<number[]>;
}
export const noopProvider: AIProvider = {
  async generate(prompt) {
    return `noop:${prompt}`;
  },
  async *stream(prompt) {
    yield `noop:${prompt}`;
  },
  async embed() {
    return [];
  }
};
