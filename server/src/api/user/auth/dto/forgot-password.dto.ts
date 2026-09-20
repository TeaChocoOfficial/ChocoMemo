// -Path: "Nest TypeScript/src/user/auth/dto/forgot-password.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        required: true,
        example: 'test@gmail.com',
        description: 'Email of the account to reset',
    })
    readonly email!: string;
}