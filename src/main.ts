import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configServise = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configServise.get('PORT', { infer: true });

  const config = new DocumentBuilder()
    .setTitle('Foodfy NestJS')
    .setDescription(
      'Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.',
    )
    .setVersion(process.env.npm_package_version!)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(port);
}

void bootstrap();
