import { Controller, Get } from '@nestjs/common';
import { ApiDocsService } from './apidocs.service';

@Controller('docs')
export class ApiDocsController {
  constructor(private readonly apiDocs: ApiDocsService) {}

  @Get('openapi.json')
  async openapi() {
    return this.apiDocs.getOpenApiSpec();
  }

  @Get('categories')
  async categories() {
    return this.apiDocs.getCategories();
  }
}
