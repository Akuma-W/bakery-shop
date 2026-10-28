import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface HealthCheckResult {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    api: {
      status: 'up';
    };
    database: {
      status: 'up' | 'down';
      message?: string;
    };
  };
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthCheckResult> {
    const isDbHealthy = await this.prisma.isHealthy();

    return {
      status: isDbHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        api: {
          status: 'up',
        },
        database: {
          status: isDbHealthy ? 'up' : 'down',
          message: isDbHealthy ? 'Connected' : 'Database connection unavailable',
        },
      },
    };
  }
}
