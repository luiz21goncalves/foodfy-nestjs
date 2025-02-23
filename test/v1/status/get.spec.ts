import { INestApplication } from '@nestjs/common';
import { makeApp } from '@test/app';
import supertest from 'supertest';
import { App } from 'supertest/types';
import { beforeEach, describe, expect, test } from 'vitest';

const PATH = '/v1/status';

describe(`GET ${PATH}`, () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await makeApp();

    await app.init();
  });

  describe('Without authentication', () => {
    test('Retrieving current system status', async () => {
      const response = await supertest(app.getHttpServer()).get(PATH);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        details: { postgres: { status: 'up' } },
        error: {},
        info: { postgres: { status: 'up' } },
        status: 'ok',
      });
    });
  });
});
