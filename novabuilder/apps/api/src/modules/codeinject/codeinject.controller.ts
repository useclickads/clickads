import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CodeInjectService } from './codeinject.service';

@Controller('projects/:projectId/code-inject')
@UseGuards(AuthGuard('jwt'))
export class CodeInjectController {
  constructor(private readonly codeInject: CodeInjectService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.codeInject.listSnippets(projectId);
  }

  @Post()
  async add(
    @Param('projectId') projectId: string,
    @Body() body: { name: string; code: string; location: 'head' | 'body_start' | 'body_end'; pages?: string[]; enabled?: boolean },
  ) {
    return this.codeInject.addSnippet(projectId, {
      name: body.name,
      code: body.code,
      location: body.location,
      pages: body.pages || [],
      enabled: body.enabled !== false,
    });
  }

  @Patch(':snippetId')
  async update(
    @Param('projectId') projectId: string,
    @Param('snippetId') snippetId: string,
    @Body() body: Partial<{ name: string; code: string; location: 'head' | 'body_start' | 'body_end'; pages: string[]; enabled: boolean }>,
  ) {
    const result = await this.codeInject.updateSnippet(projectId, snippetId, body);
    if (!result) return { error: 'Snippet not found' };
    return result;
  }

  @Delete(':snippetId')
  async remove(@Param('projectId') projectId: string, @Param('snippetId') snippetId: string) {
    return this.codeInject.deleteSnippet(projectId, snippetId);
  }

  @Get('render')
  async render(@Param('projectId') projectId: string, @Query('pageId') pageId?: string) {
    return this.codeInject.getInjectedCode(projectId, pageId);
  }
}
