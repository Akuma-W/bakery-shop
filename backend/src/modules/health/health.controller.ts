import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check health status of API and Database' })
  @ApiResponse({
    status: 200,
    description: 'System is healthy and database is connected',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-10-29T00:00:00.000Z',
        uptime: 12.34,
        environment: 'development',
        services: {
          api: { status: 'up' },
          database: { status: 'up', message: 'Connected' },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'System degraded or database disconnected',
  })
  async check(@Res() res: Response) {
    const result = await this.healthService.check();
    const httpStatus =
      result.status === 'ok' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(httpStatus).json(result);
  }
}
