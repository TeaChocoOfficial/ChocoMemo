// -Path: "Nest TypeScript/src/api/user/auth/dto/update-avatar.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAvatarDto {
    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'google',
        description: 'Target sign-in provider (e.g. local, google, discord, ...)',
    })
    provider!: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        example: 'http://127.0.0.1:3000/api/img/123456789',
        description: 'New avatar URL. Omit to activate the provider’s stored avatar.',
    })
    url?: string;
}
