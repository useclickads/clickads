import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainsService } from './domains.service';

@Controller('projects/:projectId/domains')
@UseGuards(AuthGuard('jwt'))
export class DomainsController {
  constructor(private readonly domains: DomainsService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.domains.listDomains(projectId);
  }

  @Post()
  async add(@Param('projectId') projectId: string, @Body() body: { domain: string }) {
    if (!body.domain) return { error: 'Domain is required.' };
    const result = await this.domains.addDomain(projectId, body.domain);
    if (!result) return { error: 'Domain already registered.' };
    return result;
  }

  @Get(':id/dns')
  async getDns(@Param('id') id: string) {
    const domain = await this.domains.listDomains('').then(() => null);
    return { error: 'Use the domain name endpoint instead.' };
  }

  @Get('dns/:domain')
  async getDnsInstructions(@Param('domain') domain: string) {
    return this.domains.getDnsInstructions(domain);
  }

  @Patch(':id/verify')
  async verify(@Param('id') id: string) {
    return this.domains.verifyDomain(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.domains.removeDomain(id);
    return { ok: true };
  }
}
