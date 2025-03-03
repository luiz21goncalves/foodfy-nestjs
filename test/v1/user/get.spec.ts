import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { makeApp } from '@test/app';
import supertest from 'supertest';
import { App } from 'supertest/types';
import { beforeEach, describe, expect, test } from 'vitest';

import { UserService } from '@/v1/user/user.service';

const PATH = '/v1/users';

describe(`GET ${PATH}`, () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await makeApp();

    await app.init();
  });

  describe('Without authentication', () => {
    describe('Retrieving all users', () => {
      test('with empty response', async () => {
        const response = await supertest(app.getHttpServer()).get(PATH);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toStrictEqual({
          users: [],
        });
      });

      test('with less than 50 users', async () => {
        const userService = app.get(UserService);
        const user1 = await userService.create({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
        });
        const user2 = await userService.create({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
        });
        const user3 = await userService.create({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
        });

        const response = await supertest(app.getHttpServer()).get(PATH);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toStrictEqual({
          users: [
            {
              created_at: user3.createdAt.toISOString(),
              email: user3.email,
              id: user3.id,
              name: user3.name,
              role: user3.role,
              updated_at: user3.updatedAt.toISOString(),
            },
            {
              created_at: user2.createdAt.toISOString(),
              email: user2.email,
              id: user2.id,
              name: user2.name,
              role: user2.role,
              updated_at: user2.updatedAt.toISOString(),
            },
            {
              created_at: user1.createdAt.toISOString(),
              email: user1.email,
              id: user1.id,
              name: user1.name,
              role: user1.role,
              updated_at: user1.updatedAt.toISOString(),
            },
          ],
        });
      });

      test('with more than 50 users', async () => {
        const userService = app.get(UserService);
        const usersPromises = Array.from({ length: 100 }).map(() => {
          return userService.create({
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: faker.internet.password(),
          });
        });

        await Promise.all(usersPromises);

        const response = await supertest(app.getHttpServer()).get(PATH);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toStrictEqual({
          users: expect.any(Array),
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.users).toHaveLength(50);
      });
    });
  });
});
