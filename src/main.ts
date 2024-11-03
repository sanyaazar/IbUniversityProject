import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

  // Логирование при старте сервера
  console.log('NestJS server is running at http://localhost:3000');

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing gracefully.');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received. Closing gracefully.');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
