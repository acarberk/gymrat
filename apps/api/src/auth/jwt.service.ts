import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { EnvService } from '../config/env.service';

const ALG = 'HS256' as const;

export interface AccessTokenPayload {
  sub: string;
  email: string;
  emailVerified: boolean;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  family: string;
  rotation: number;
}

type DurationLiteral = `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;

@Injectable()
export class JwtService {
  constructor(
    private readonly nest: NestJwtService,
    private readonly env: EnvService,
  ) {}

  signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const secret = this.env.jwtAccessSecret;
    if (!secret) {
      throw new InternalServerErrorException('JWT_ACCESS_SECRET is not configured');
    }
    return this.nest.signAsync(payload, {
      secret,
      algorithm: ALG,
      expiresIn: this.env.jwtAccessTtl as DurationLiteral,
    });
  }

  signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    const secret = this.env.jwtRefreshSecret;
    if (!secret) {
      throw new InternalServerErrorException('JWT_REFRESH_SECRET is not configured');
    }
    return this.nest.signAsync(payload, {
      secret,
      algorithm: ALG,
      expiresIn: this.env.jwtRefreshTtl as DurationLiteral,
    });
  }

  verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const secret = this.env.jwtAccessSecret;
    if (!secret) {
      throw new InternalServerErrorException('JWT_ACCESS_SECRET is not configured');
    }
    return this.nest.verifyAsync<AccessTokenPayload>(token, {
      secret,
      algorithms: [ALG],
    });
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const secret = this.env.jwtRefreshSecret;
    if (!secret) {
      throw new InternalServerErrorException('JWT_REFRESH_SECRET is not configured');
    }
    return this.nest.verifyAsync<RefreshTokenPayload>(token, {
      secret,
      algorithms: [ALG],
    });
  }
}
