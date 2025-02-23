import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { StatusController } from './status.controller';

@Module({
  controllers: [StatusController],
  imports: [TerminusModule],
})
export class StatusModule {}
