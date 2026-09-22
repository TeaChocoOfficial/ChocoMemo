// -Path: "Nest TypeScript/src/user/dto/user.dto.ts"
import { Role } from '../../../types/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import type { AuthIdentity } from '../auth/schemas/auth-identity.schema';

export class UserLoginDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        description: 'Email',
        example: 'test@gmail.com',
        default: 'test@gmail.com',
    })
    readonly email!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        description: 'Password',
        example: 'password',
        default: 'password',
    })
    readonly password!: string;
}

export class ReqUserDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: '1234567890',
        description: 'User ID',
    })
    readonly userId!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'John Doe',
        description: 'Name',
    })
    readonly name!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'https://example.com/profile.jpg',
        description: 'avatar',
    })
    readonly avatar?: string;

    @IsEnum(Role)
    @ApiProperty({
        type: String,
        required: true,
        example: 'admin',
        description: 'Role',
    })
    readonly role!: Role;

    /** Identities supplied at sign-in time (provider + external id).
     *  Transient: never persisted via this DTO nor embedded in the JWT. */
    @IsOptional()
    @IsArray()
    @ApiProperty({
        type: 'array',
        required: false,
        description: 'Auth identities used to locate the user during sign-in',
    })
    readonly identities?: AuthIdentity[];

    @IsDate()
    @ApiProperty({
        type: Date,
        required: false,
        example: '2022-01-01',
        description: 'Created at',
    })
    readonly createdAt?: Date;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: false,
        example: '2022-01-01',
        description: 'Updated at',
    })
    readonly updatedAt?: Date;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: false,
        example: '2022-01-01',
        description: 'Expires at',
    })
    readonly expiresAt!: Date;

    @IsDate()
    @ApiProperty({
        type: Date,
        required: false,
        example: '2022-01-01',
        description: 'Last login at',
    })
    readonly lastLoginAt!: Date;
}

export class UserJWTPayload {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: '1234567890',
        description: 'User ID',
    })
    readonly userId!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'John Doe',
        description: 'Name',
    })
    readonly name!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'John',
        description: 'avatar',
    })
    readonly avatar?: string;

    @IsEnum(Role)
    @ApiProperty({
        type: String,
        required: true,
        example: 'admin',
        description: 'Role',
    })
    readonly role!: Role;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: '2022-01-01',
        description: 'Created at',
    })
    readonly createdAt?: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: '2022-01-01',
        description: 'Updated at',
    })
    readonly updatedAt?: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: '2022-01-01',
        description: 'Expires at',
    })
    readonly expiresAt!: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: '2022-01-01',
        description: 'Last login at',
    })
    readonly lastLoginAt!: string;

    @IsNumber()
    @ApiProperty({
        type: Number,
        required: true,
        example: 1,
        description: 'IAT',
    })
    readonly iat!: number;

    @IsNumber()
    @ApiProperty({
        type: Number,
        required: true,
        example: 1,
        description: 'EXP',
    })
    readonly exp!: number;
}
