import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

import { Env } from '@/env';

type Compare = {
  plain: string;
  hash: string;
};

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(
      plain,
      this.configService.get('HASH_SALT_LENGTH', { infer: true }),
    );
  }

  compare({ hash, plain }: Compare): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
