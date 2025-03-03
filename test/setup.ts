import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { afterEach, beforeEach } from 'vitest';

expand(dotenv.config({ path: [`.env.${process.env.NODE_ENV}`] }));

const prisma = new PrismaClient();

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

let schema: string;

beforeEach(async () => {
  schema = randomUUID();
  const databaseUrl = generateDatabaseUrl(schema);

  process.env.DATABASE_URL = databaseUrl;

  await prisma.$connect();

  execSync('pnpm exec prisma migrate deploy');
});

afterEach(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);

  await prisma.$disconnect();
});
