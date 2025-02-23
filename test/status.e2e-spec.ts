import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { App } from 'supertest/types';

import { makeApp } from './app';

describe('StatusController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await makeApp();

    await app.init();
  });

  it('/v1/status (GET)', async () => {
    const response = await supertest(app.getHttpServer()).get('/v1/status');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual({
      details: { postgres: { status: 'up' } },
      error: {},
      info: { postgres: { status: 'up' } },
      status: 'ok',
    });
  });
});
