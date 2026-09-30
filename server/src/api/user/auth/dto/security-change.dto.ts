// -Path: "server/src/api/user/auth/dto/security-change.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { LocaleDto } from './locale.dto';

export class ChangeEmailRequestDto extends LocaleDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        required: true,
        example: 'new@example.com',
        description: 'The new email address to switch the account to',
    })
    readonly newEmail!: string;
}

export class ChangeEmailConfirmDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'eyJhbGciOi...',
        description: 'Change token returned by change-email/request',
    })
    readonly token!: string;

    @IsString()
    @Length(6, 6)
    @ApiProperty({
        type: String,
        required: true,
        example: '123456',
        description: '6-digit code sent to the new email',
    })
    readonly code!: string;
}

export class ChangePasswordRequestDto extends LocaleDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'currentPassword',
        description: 'Current password (omitted when setting a first-time password)',
    })
    readonly currentPassword?: string;
}

export class ChangePasswordConfirmDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'eyJhbGciOi...',
        description: 'Change token returned by change-password/request',
    })
    readonly token!: string;

    @IsString()
    @Length(6, 6)
    @ApiProperty({
        type: String,
        required: true,
        example: '123456',
        description: '6-digit code sent to the account email',
    })
    readonly code!: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'currentPassword',
        description: 'Current password (omitted when setting a first-time password)',
    })
    readonly currentPassword?: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        type: String,
        required: true,
        example: 'newPassword',
        description: 'New password (min 6 characters)',
    })
    readonly newPassword!: string;
}
