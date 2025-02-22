import * as Joi from 'joi';

export type Env = {
  NODE_ENV: 'test' | 'development' | 'production';
  PORT: number;
};

export const envSchema = Joi.object<Env, true>({
  NODE_ENV: Joi.string().valid('test', 'development', 'production'),
  PORT: Joi.number().port(),
});
