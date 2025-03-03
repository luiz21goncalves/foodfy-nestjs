import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envSchema } from './env';
import { StatusModule } from './v1/status/status.module';
import { UserModule } from './v1/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      expandVariables: true,
      isGlobal: true,
      validationSchema: envSchema,
    }),
    StatusModule,
    UserModule,
  ],
})
export class AppModule {}
