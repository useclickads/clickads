import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImportService } from './import.service';

@Controller('import')
@UseGuards(AuthGuard('jwt'))
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post()
  async importProject(@Req() req: any, @Body() body: any) {
    if (!body.project || !body.pages) return { error: 'Invalid export format.' };
    return this.importService.importProject(req.user.userId, body);
  }
}
