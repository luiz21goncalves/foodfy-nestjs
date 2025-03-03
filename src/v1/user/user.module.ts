import { Module } from '@nestjs/common';

import { HashModule } from '@/hash/hash.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [PrismaModule, HashModule],
  providers: [UserService],
})
export class UserModule {}
