import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { initSentry } from './observability/sentry';
import { initOTel, shutdownOTel } from './observability/otel';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  initSentry();
  await initOTel();

  const uploadsDir = join(process.cwd(), 'uploads');
  mkdirSync(uploadsDir, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: ['log', 'warn', 'error', 'debug'] });
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  console.log('NovaBuilder API listening on port', port);

  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await shutdownOTel();
    process.exit(0);
  });
}

bootstrap();
