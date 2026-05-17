import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeysService } from './apikeys.service';

@Controller('api-keys')
@UseGuards(AuthGuard('jwt'))
export class ApiKeysController {
  constructor(private readonly apiKeys: ApiKeysService) {}

  @Get()
  async list(@Req() req: any) {
    return this.apiKeys.list(req.user.userId);
  }

  @Post()
  async create(@Req() req: any, @Body() body: { scopes?: string[] }) {
    return this.apiKeys.create(req.user.userId, body.scopes || ['read']);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async revoke(@Param('id') id: string) {
    await this.apiKeys.revoke(id);
    return { ok: true };
  }
}
