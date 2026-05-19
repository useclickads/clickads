import { Module } from '@nestjs/common';
import { ApiDocsController } from './apidocs.controller';
import { ApiDocsService } from './apidocs.service';

@Module({
  controllers: [ApiDocsController],
  providers: [ApiDocsService],
  exports: [ApiDocsService],
})
export class ApiDocsModule {}
