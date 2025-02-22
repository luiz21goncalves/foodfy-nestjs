import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configServise = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configServise.get('PORT', { infer: true });

  await app.listen(port);
}

void bootstrap();
