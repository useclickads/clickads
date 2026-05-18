import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ABTestingService } from './abtesting.service';

@Controller('projects/:projectId/abtests')
export class ABTestingController {
  constructor(private readonly abtesting: ABTestingService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async list(@Param('projectId') projectId: string) {
    return this.abtesting.listTests(projectId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('projectId') projectId: string,
    @Body() body: { pageId: string; name: string; variants: { id: string; name: string; content: unknown; weight: number }[] },
  ) {
    if (!body.pageId || !body.name || !body.variants?.length) return { error: 'pageId, name, and variants are required.' };
    return this.abtesting.createTest(projectId, body.pageId, body);
  }

  @Get(':testId')
  @UseGuards(AuthGuard('jwt'))
  async get(@Param('testId') testId: string) {
    return this.abtesting.getTest(testId);
  }

  @Post(':testId/start')
  @UseGuards(AuthGuard('jwt'))
  async start(@Param('testId') testId: string) {
    return this.abtesting.startTest(testId);
  }

  @Post(':testId/stop')
  @UseGuards(AuthGuard('jwt'))
  async stop(@Param('testId') testId: string) {
    return this.abtesting.stopTest(testId);
  }

  @Get(':testId/results')
  @UseGuards(AuthGuard('jwt'))
  async results(@Param('testId') testId: string) {
    return this.abtesting.getResults(testId);
  }

  @Post(':testId/assign')
  async assign(@Param('testId') testId: string, @Body() body: { visitorId: string }) {
    if (!body.visitorId) return { error: 'visitorId is required.' };
    const variant = await this.abtesting.assignVariant(testId, body.visitorId);
    if (!variant) return { error: 'Test not found or not running.' };
    return { variant };
  }

  @Post(':testId/convert')
  async convert(@Param('testId') testId: string, @Body() body: { visitorId: string }) {
    if (!body.visitorId) return { error: 'visitorId is required.' };
    const result = await this.abtesting.recordConversion(testId, body.visitorId);
    if (!result) return { error: 'No assignment found for this visitor.' };
    return { ok: true };
  }

  @Delete(':testId')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('testId') testId: string) {
    await this.abtesting.deleteTest(testId);
    return { ok: true };
  }
}
