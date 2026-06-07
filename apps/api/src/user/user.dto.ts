import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ nullable: true, format: 'uri' })
  avatarUrl!: string | null;

  @ApiProperty({ example: 'tr' })
  locale!: string;

  @ApiProperty()
  emailVerified!: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: false, minLength: 1, maxLength: 100 })
  displayName?: string;

  @ApiProperty({ required: false, nullable: true, format: 'uri' })
  avatarUrl?: string | null;

  @ApiProperty({ required: false, example: 'tr', minLength: 2, maxLength: 2 })
  locale?: string;
}
