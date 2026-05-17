import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(AuthGuard('jwt'))
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  async globalSearch(@Query('q') query: string, @Req() req: any) {
    if (!query || query.length < 2) return { projects: [], pages: [], collections: [] };
    return this.search.search(req.user.userId, query);
  }
}
