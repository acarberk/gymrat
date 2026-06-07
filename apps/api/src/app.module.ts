import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AppThrottlerModule } from './throttler/app-throttler.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    RedisModule,
    AppThrottlerModule,
    PrismaModule,
    HealthModule,
  ],
})
export class AppModule {}
