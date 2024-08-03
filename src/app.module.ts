import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    HealthModule,
    PrismaModule,
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: ['.env.development'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().port(),
        POSTGRES_HOST: Joi.string(),
        POSTGRES_PORT: Joi.number().port(),
        POSTGRES_USER: Joi.string(),
        POSTGRES_DB: Joi.string(),
        POSTGRES_PASSWORD: Joi.string(),
        DATABASE_URL: Joi.string().uri(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
