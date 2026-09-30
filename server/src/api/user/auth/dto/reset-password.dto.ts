// -Path: "Nest TypeScript/src/user/auth/dto/reset-password.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'eyJhbGciOi...',
        description: 'Reset token returned by forgot-password',
    })
    readonly token!: string;

    @IsString()
    @Length(6, 6)
    @ApiProperty({
        type: String,
        required: true,
        example: '123456',
        description: '6-digit code sent to the email',
    })
    readonly code!: string;

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
