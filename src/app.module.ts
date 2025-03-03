import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StatusModule } from './v1/status/status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      expandVariables: true,
      isGlobal: true,
    }),
    StatusModule,
  ],
})
export class AppModule {}
