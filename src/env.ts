import * as Joi from 'joi';

export type Env = {
  NODE_ENV: 'test' | 'development' | 'production';
  PORT: number;
  POSTGRES_HOST: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
};

export const envSchema = Joi.object<Env, true>({
  NODE_ENV: Joi.string().valid('test', 'development', 'production'),
  PORT: Joi.number().port(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port(),
  POSTGRES_USER: Joi.string().required(),
});
