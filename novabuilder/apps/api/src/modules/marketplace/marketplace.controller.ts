import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
@UseGuards(AuthGuard('jwt'))
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @Get('plugins')
  async listPlugins(@Query('q') query?: string) {
    return this.marketplace.listPlugins(query);
  }

  @Get('plugins/:id')
  async getPlugin(@Param('id') id: string) {
    return this.marketplace.getPlugin(id);
  }

  @Post('plugins')
  async publishPlugin(@Req() req: any, @Body() body: { name: string; version: string; manifest: unknown; price?: number }) {
    if (!body.name || !body.version) return { error: 'Name and version are required.' };
    return this.marketplace.publishPlugin(req.user.userId, body);
  }

  @Post('plugins/:pluginId/install')
  async installPlugin(@Req() req: any, @Param('pluginId') pluginId: string, @Body() body: { projectId: string; config?: unknown }) {
    if (!body.projectId) return { error: 'Project ID is required.' };
    return this.marketplace.installPlugin(req.user.userId, body.projectId, pluginId, body.config);
  }

  @Delete('plugins/:pluginId/uninstall')
  async uninstallPlugin(@Body() body: { projectId: string }, @Param('pluginId') pluginId: string) {
    if (!body.projectId) return { error: 'Project ID is required.' };
    return this.marketplace.uninstallPlugin(body.projectId, pluginId);
  }

  @Get('installed/:projectId')
  async listInstalled(@Param('projectId') projectId: string) {
    return this.marketplace.listInstalled(projectId);
  }

  @Post('purchase/:itemId')
  async purchase(@Req() req: any, @Param('itemId') itemId: string) {
    return this.marketplace.purchaseItem(req.user.userId, itemId);
  }

  @Get('purchases')
  async listPurchases(@Req() req: any) {
    return this.marketplace.listPurchases(req.user.userId);
  }
}
