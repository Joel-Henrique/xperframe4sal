import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('searching-as-learning');
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, async () =>
    console.log(`Application is running on: ${await app.getUrl()}`),
  );
}
bootstrap();
