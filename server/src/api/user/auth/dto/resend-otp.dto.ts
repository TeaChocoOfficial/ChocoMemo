// -Path: "Nest TypeScript/src/user/auth/dto/resend-otp.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { LocaleDto } from './locale.dto';

export class ResendOtpDto extends LocaleDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        required: true,
        example: 'test@gmail.com',
        description: 'Email of the unverified account',
    })
    readonly email!: string;
}
