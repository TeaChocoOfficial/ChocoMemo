// -Path: "Nest TypeScript/src/api/img/dto/create-img.dto.ts"
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiMetaDto } from '../../../types/dto';

export class CreateImgDto extends ApiMetaDto {
    @IsString()
    @ApiProperty()
    name!: string;

    @IsString()
    @ApiProperty()
    mimetype!: string;

    @Type(() => Buffer)
    @ApiProperty()
    data!: Buffer;
}
