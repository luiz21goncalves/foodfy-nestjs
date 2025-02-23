import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Env } from './env';
import { StatusModule } from './v1/status/status.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService<Env, true>) {
        const host = configService.get('POSTGRES_HOST', { infer: true });
        const port = configService.get('POSTGRES_PORT', { infer: true });
        const username = configService.get('POSTGRES_USER', {
          infer: true,
        });
        const password = configService.get('POSTGRES_PASSWORD', {
          infer: true,
        });
        const database = configService.get('POSTGRES_DB', { infer: true });

        return {
          autoLoadEntities: true,
          database,
          host,
          password,
          port,
          type: 'postgres',
          username,
        };
      },
    }),
    StatusModule,
  ],
  providers: [AppService],
})
export class AppModule {}
