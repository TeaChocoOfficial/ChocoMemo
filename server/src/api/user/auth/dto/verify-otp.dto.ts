// -Path: "Nest TypeScript/src/user/auth/dto/verify-otp.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyOtpDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'eyJhbGciOi...',
        description: 'Signup token returned by register/resend-otp',
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
}
