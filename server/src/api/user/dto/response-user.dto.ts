// -Path: "Nest TypeScript/src/user/dto/response-user.dto.ts"
import { Role } from '~/types/auth';
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

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'john_doe',
        description: 'Public handle used to find this user',
    })
    nameTag?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'I learn languages with ChocoMemo.',
        description: 'Short self-description shown on the public profile',
    })
    bio?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'https://example.com/profile.jpg',
        description: 'Active avatar URL',
    })
    avatar?: string;

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
        required: true,
        example: '2022-01-01',
        description: 'Created at',
    })
    createdAt!: Date;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: true,
        example: '2022-01-01',
        description: 'Updated at',
    })
    updatedAt!: Date;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: true,
        example: '2022-01-01',
        description: 'Last login at',
    })
    lastLoginAt!: Date;

    @ApiProperty({
        type: 'array',
        description: 'Linked authentication providers',
        items: {
            type: 'object',
            properties: {
                provider: { type: 'string', example: 'google' },
                providerEmail: { type: 'string', nullable: true, example: 'user@gmail.com' },
                hasPassword: { type: 'boolean', example: false },
                avatar: {
                    type: 'string',
                    nullable: true,
                    example: 'https://example.com/profile.jpg',
                },
            },
        },
    })
    identities!: Array<{
        provider: string;
        providerEmail: string | null;
        hasPassword?: boolean;
        avatar: string | null;
    }>;
}
