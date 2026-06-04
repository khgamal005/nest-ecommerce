import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// If @types/node is not installed, provide a minimal fallback for `process` so
// TypeScript won't error with "Cannot find name 'process'".
declare const process: { env?: { PORT?: string } } | any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env?.PORT ?? 3000);
}
bootstrap();
