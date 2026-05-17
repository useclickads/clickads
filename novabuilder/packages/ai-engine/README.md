# AI Engine

Lightweight AI engine package with provider interface and an OpenAI adapter stub.

Usage:

1. Install the package's deps and build from workspace root:

```bash
pnpm --filter @novabuilder/ai-engine install
pnpm --filter @novabuilder/ai-engine run build
```

2. Use in server code:

```ts
import { AIEngine } from '@novabuilder/ai-engine';
import { OpenAIProvider } from '@novabuilder/ai-engine/src/providers/openai';

const engine = new AIEngine(new OpenAIProvider(process.env.OPENAI_API_KEY));
const res = await engine.generate('Write a short poem');
```
