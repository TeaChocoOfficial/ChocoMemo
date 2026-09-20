// -Path: "Nest TypeScript/src/user/auth/dto/change-password.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'currentPassword',
        description: 'Current password',
    })
    currentPassword!: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        type: String,
        required: true,
        example: 'newPassword',
        description: 'New password (min 6 characters)',
    })
    newPassword!: string;
}