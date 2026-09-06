// -Path: "Nest TypeScript/src/user/dto/response-user.dto.ts"
import { Role } from '../../../types/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsString } from 'class-validator';

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
        example: '1234567890',
        description: 'Google ID',
    })
    googleId?: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'example@gmail.com',
        description: 'Email',
    })
    email!: string;

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
        example: 'https://example.com/profile.jpg',
        description: 'Avatar',
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
}
