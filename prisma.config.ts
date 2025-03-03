import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

expand(dotenv.config({ path: `.env.${process.env.NODE_ENV}` }));

export default defineConfig({
  earlyAccess: true,
});
