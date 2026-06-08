import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { type User } from '@prisma/client';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { type AuthenticatedRequest } from '../auth/types';
import { ZodValidationPipe } from '../auth/zod-validation.pipe';

import { UpdateProfileDto, UserProfileDto } from './user.dto';
import { updateProfileSchema, type UpdateProfileInput } from './user.schema';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user full profile' })
  @ApiOkResponse({ type: UserProfileDto })
  async findMe(@Req() req: AuthenticatedRequest): Promise<UserProfileDto> {
    const user = await this.users.findById(req.user.sub);
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }
    return this.toDto(user);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ type: UserProfileDto })
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body(new ZodValidationPipe(updateProfileSchema)) input: UpdateProfileInput,
  ): Promise<UserProfileDto> {
    const updated = await this.users.updateProfile(req.user.sub, input);
    return this.toDto(updated);
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft-delete the authenticated user account' })
  @ApiNoContentResponse({ description: 'Account scheduled for deletion' })
  async deleteMe(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.users.softDelete(req.user.sub);
  }

  private toDto(user: User): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      locale: user.locale,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
