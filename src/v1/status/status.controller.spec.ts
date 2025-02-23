import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Env } from '@/env';

import { StatusController } from './status.controller';

describe('StatusController', () => {
  let controller: StatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      imports: [
        TerminusModule,
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
      ],
    }).compile();

    controller = module.get<StatusController>(StatusController);
  });

  it('should be able to get the app status', async () => {
    const status = await controller.check();

    expect(status).toStrictEqual({
      details: { postgres: { status: 'up' } },
      error: {},
      info: { postgres: { status: 'up' } },
      status: 'ok',
    });
  });
});
