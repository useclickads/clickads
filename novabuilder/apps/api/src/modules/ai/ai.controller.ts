import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('generate-page')
  async generatePage(@Body() body: { prompt: string }) {
    if (!body.prompt) return { error: 'Prompt is required.' };
    return this.ai.generatePage(body.prompt);
  }

  @Post('suggest-blocks')
  async suggestBlocks(@Body() body: { existingBlocks: any[]; prompt?: string }) {
    return this.ai.suggestBlocks({
      existingBlocks: body.existingBlocks || [],
      prompt: body.prompt,
    });
  }

  @Post('generate-copy')
  async generateCopy(@Body() body: { type: 'headline' | 'paragraph' | 'cta' | 'tagline'; topic?: string; tone?: string }) {
    if (!body.type) return { error: 'Type is required.' };
    return this.ai.generateCopyWithLLM(body);
  }

  @Post('improve')
  async improve(@Body() body: { content: string }) {
    if (!body.content) return { error: 'Content is required.' };
    return this.ai.improveContent(body.content);
  }
}
