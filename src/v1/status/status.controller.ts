import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

import { PrismaService } from '@/prisma/prisma.service';

@Controller({ path: 'status', version: '1' })
export class StatusController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHeath: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHeath.pingCheck('postgres', this.prisma),
    ]);
  }
}
