import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaModule } from '@/prisma/prisma.module';

import { StatusController } from './status.controller';

@Module({
  controllers: [StatusController],
  imports: [TerminusModule, PrismaModule],
})
export class StatusModule {}
