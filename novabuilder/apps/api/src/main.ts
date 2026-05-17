import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSentry } from './observability/sentry';
import { initOTel, shutdownOTel } from './observability/otel';

async function bootstrap() {
  initSentry();
  await initOTel();

  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error', 'debug'] });
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api');

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
