// -Path: "Nest TypeScript/src/user/auth/dto/resend-otp.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendOtpDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        required: true,
        example: 'test@gmail.com',
        description: 'Email of the unverified account',
    })
    readonly email!: string;
}