import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { ConfigModule } from '../config/config.module';
import { EnvService } from '../config/env.service';
import { REDIS_CLIENT, RedisModule } from '../redis/redis.module';

import { FailClosedThrottlerGuard } from './fail-closed-throttler.guard';

import type Redis from 'ioredis';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [RedisModule, ConfigModule],
      inject: [REDIS_CLIENT, EnvService],
      useFactory: (redis: Redis, env: EnvService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: env.throttleTtlSeconds * 1000,
            limit: env.throttleLimit,
          },
        ],
        storage: new ThrottlerStorageRedisService(redis),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FailClosedThrottlerGuard,
    },
  ],
})
export class AppThrottlerModule {}
