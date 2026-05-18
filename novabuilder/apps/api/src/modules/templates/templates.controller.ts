import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Get()
  async list(@Query('category') category?: string, @Query('search') search?: string) {
    return this.templates.listTemplates(category, search);
  }

  @Get('categories')
  async categories() {
    return this.templates.getCategories();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const template = await this.templates.getTemplate(id);
    if (!template) return { error: 'Template not found' };
    return template;
  }

  @Post(':id/use')
  @UseGuards(AuthGuard('jwt'))
  async use(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { name: string; slug: string },
  ) {
    if (!body.name || !body.slug) return { error: 'name and slug are required' };
    const result = await this.templates.createProjectFromTemplate(id, req.user.userId, body.name, body.slug);
    if (!result) return { error: 'Template not found' };
    return result;
  }
}
