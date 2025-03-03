import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { makeApp } from '@test/app';
import supertest from 'supertest';
import { App } from 'supertest/types';
import { beforeEach, describe, expect, test } from 'vitest';

const PATH = '/v1/users';

describe(`POST ${PATH}`, () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await makeApp();

    await app.init();
  });

  describe('Without authentication', () => {
    describe('Create a user', () => {
      test('with valid data and using default values', async () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password();

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          email,
          name,
          password,
        });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toStrictEqual({
          user: {
            created_at: expect.any(String),
            email: email.toLowerCase(),
            id: expect.any(String),
            name,
            role: 'USER',
            updated_at: expect.any(String),
          },
        });
      });

      test.each([['ADMIN'], ['USER']])(
        'with valid data and set role as "%s"',
        async (role) => {
          const email = faker.internet.email();
          const name = faker.person.fullName();
          const password = faker.internet.password();

          const response = await supertest(app.getHttpServer())
            .post(PATH)
            .send({
              email,
              name,
              password,
              role,
            });

          expect(response.statusCode).toEqual(201);
          expect(response.body).toStrictEqual({
            user: {
              created_at: expect.any(String),
              email: email.toLowerCase(),
              id: expect.any(String),
              name,
              role,
              updated_at: expect.any(String),
            },
          });
        },
      );

      test('with invalid role', async () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password();
        const invalidRole = 'invalid-role';

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          email,
          name,
          password,
          role: invalidRole,
        });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: ['role must be one of the following values: ADMIN, USER'],
          statusCode: 400,
        });
      });

      test('without pasword', async () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          email,
          name,
        });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: ['password must be longer than or equal to 8 characters'],
          statusCode: 400,
        });
      });

      test('without name', async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          email,
          password,
        });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: ['name must be a string'],
          statusCode: 400,
        });
      });

      test('without email', async () => {
        const name = faker.person.fullName();
        const password = faker.internet.password();

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          name,
          password,
        });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: ['email must be an email'],
          statusCode: 400,
        });
      });

      test('with invalid email', async () => {
        const email = 'invalid-email';
        const name = faker.person.fullName();
        const password = faker.internet.password();

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          email,
          name,
          password,
        });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: ['email must be an email'],
          statusCode: 400,
        });
      });

      test('with less than 8 characters in the password', async () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = '1234567';

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          email,
          name,
          password,
        });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: ['password must be longer than or equal to 8 characters'],
          statusCode: 400,
        });
      });

      test('with more than 72 characters in the password', async () => {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 73 });

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          email,
          name,
          password,
        });

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
          error: 'Bad Request',
          message: ['password must be shorter than or equal to 72 characters'],
          statusCode: 400,
        });
      });

      test('with the same email in capitalized letters', async () => {
        const email = faker.internet.email().toUpperCase();

        await supertest(app.getHttpServer()).post(PATH).send({
          email,
          name: faker.person.fullName(),
          password: faker.internet.password(),
        });

        const response = await supertest(app.getHttpServer()).post(PATH).send({
          email: email.toLowerCase(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
        });

        expect(response.status).toBe(409);
        expect(response.body).toStrictEqual({
          error: 'Conflict',
          message: `User with the identifier ${email.toLowerCase()} already exists.`,
          statusCode: 409,
        });
      });
    });
  });
});
