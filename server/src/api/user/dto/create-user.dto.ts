// -Path: "Nest TypeScript/src/user/dto/create-user.dto.ts"
import { Role } from '../../../types/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: '1234567890',
        description: 'Google ID',
    })
    googleId!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'test@gmail.com',
        description: 'Email',
    })
    email!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'John Doe',
        description: 'Name',
    })
    name!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'https://example.com/profile.jpg',
        description: 'Profile avatar URL',
    })
    avatar!: string;

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
