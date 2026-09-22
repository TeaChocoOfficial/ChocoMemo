// -Path: "Nest TypeScript/src/user/dto/create-user.dto.ts"
import { Role } from '../../../types/auth';
import { ApiProperty } from '@nestjs/swagger';
import type { AuthIdentity } from '../auth/schemas/auth-identity.schema';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'John Doe',
        description: 'Name',
    })
    name!: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'https://example.com/profile.jpg',
        description: 'Profile avatar URL',
    })
    avatar?: string;

    @IsEnum(Role)
    @ApiProperty({
        enum: Role,
        required: true,
        example: Role.USER,
        description: 'Role',
    })
    role!: Role;

    @IsNumber()
    @ApiProperty({
        type: Number,
        required: true,
        example: 1633036800,
        description: 'Last login timestamp',
    })
    lastLoginAt!: number;

    @IsOptional()
    @IsArray()
    @ApiProperty({
        type: 'array',
        required: false,
        description: 'Auth identities (provider accounts) this user can sign in with',
        example: [
            {
                provider: 'google',
                providerUserId: '1234567890',
                providerEmail: 'test@gmail.com',
                passwordHash: null,
            },
        ],
    })
    identities?: AuthIdentity[];
}

export class Tokens {
    @IsNumber()
    @ApiProperty({
        type: Number,
        required: true,
        example: 1633036800,
        description: 'Expires at timestamp',
    })
    expiresAt!: number;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'access-token-12345',
        description: 'Access token',
    })
    accessToken!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'refresh-token-12345',
        description: 'Refresh token',
    })
    refreshToken!: string;
}

export type UserType = CreateUserDto & Tokens;
