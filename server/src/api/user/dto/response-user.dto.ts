// -Path: "Nest TypeScript/src/user/dto/response-user.dto.ts"
import { Role } from '../../../types/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class ResponseUserDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: '1234567890',
        description: 'User ID',
    })
    userId!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'John Doe',
        description: 'First name',
    })
    name!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'example@gmail.com',
        description: 'Email',
    })
    email!: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'https://example.com/profile.jpg',
        description: 'Active avatar URL',
    })
    avatar?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'https://lh3.googleusercontent.com/...',
        description: 'Google avatar URL (if linked)',
    })
    googleAvatar?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'https://api.example.com/api/img/abc123',
        description: 'Local uploaded avatar URL',
    })
    localAvatar?: string;

    @IsEnum(() => Role)
    @ApiProperty({
        enum: Role,
        required: false,
        example: 'admin',
        description: 'Role',
    })
    role!: Role;

    @IsBoolean()
    @ApiProperty({
        type: Boolean,
        required: false,
        example: true,
        description: 'Whether the email has been verified',
    })
    emailVerified?: boolean;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: false,
        example: '2022-01-01',
        description: 'Expires at',
    })
    expiresAt?: Date;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: false,
        example: '2022-01-01',
        description: 'Created at',
    })
    createdAt?: Date;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: false,
        example: '2022-01-01',
        description: 'Updated at',
    })
    updatedAt?: Date;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: false,
        example: '2022-01-01',
        description: 'Last login at',
    })
    lastLoginAt?: Date;

    @IsOptional()
    @ApiProperty({
        type: 'array',
        required: false,
        description: 'Linked authentication providers',
        items: {
            type: 'object',
            properties: {
                provider: { type: 'string', example: 'google' },
                providerEmail: { type: 'string', nullable: true, example: 'user@gmail.com' },
            },
        },
    })
    identities?: Array<{ provider: string; providerEmail?: string | null }>;
}
