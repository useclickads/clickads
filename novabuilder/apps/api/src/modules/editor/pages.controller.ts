import { Controller, Get, Param } from '@nestjs/common';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pages: PagesService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.pages.getById(id);
  }
}
