// -Path: "Nest TypeScript/src/user/auth/dto/register.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(2)
    @ApiProperty({
        type: String,
        required: true,
        example: 'John Doe',
        description: 'Display name',
    })
    readonly name!: string;

    @IsEmail()
    @ApiProperty({
        type: String,
        required: true,
        example: 'test@gmail.com',
        description: 'Email address',
    })
    readonly email!: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        type: String,
        required: true,
        example: 'password',
        description: 'Password (min 6 characters)',
    })
    readonly password!: string;
}
