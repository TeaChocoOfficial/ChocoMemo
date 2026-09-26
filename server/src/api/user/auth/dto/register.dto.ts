// -Path: "Nest TypeScript/src/user/auth/dto/register.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

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

    @IsString()
    @Matches(/^[A-Za-z0-9_-]{3,30}$/, {
        message:
            'Name tag must be 3-30 characters: English letters, numbers, underscores or hyphens only (no spaces).',
    })
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @ApiProperty({
        type: String,
        required: true,
        example: 'john_doe',
        description: 'Public handle used to find this user. English only, no spaces.',
    })
    readonly nameTag!: string;

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
