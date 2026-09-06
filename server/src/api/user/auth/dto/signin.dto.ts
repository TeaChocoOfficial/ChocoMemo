// -Path: "Nest TypeScript/src/user/auth/dto/signin.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { ReqUserDto } from '../../dto/user.dto';
import type { ResponseUserDto } from '../../dto/response-user.dto';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class SigninResultDto {
    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: ReqUserDto,
        example: 'user',
        description: 'User',
    })
    user?: ResponseUserDto;

    @IsNumber()
    @ApiProperty({
        type: Number,
        example: 'maxAge',
        description: 'Max age',
    })
    maxAge!: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        example: 'message',
        description: 'Message',
    })
    message?: string;

    @IsString()
    @ApiProperty({
        type: String,
        example: 'access_token',
        description: 'Access token',
    })
    access_token!: string;
}
