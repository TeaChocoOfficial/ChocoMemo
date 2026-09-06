// -Path: "Nest TypeScript/src/types/dto.ts"
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ApiMetaDto {
    @IsString()
    @ApiProperty({
        type: String,
        example: '123456789',
        description: 'ID',
    })
    _id!: string;

    @IsString()
    @ApiProperty({
        type: String,
        example: '123456789',
        description: 'User ID',
    })
    userId!: string;

    @IsNumber()
    @ApiProperty({
        type: Number,
        example: 1672236000000,
        description: 'Created At',
    })
    createdAt!: number;

    @IsNumber()
    @ApiProperty({
        type: Number,
        example: 1672236000000,
        description: 'Updated At',
    })
    updatedAt!: number;

    @IsString()
    @ApiProperty({
        type: String,
        example: '123456789',
        description: 'Created By',
    })
    createdBy!: string;

    @IsString()
    @ApiProperty({
        type: String,
        example: '123456789',
        description: 'Updated By',
    })
    updatedBy!: string;

    @IsNumber()
    @ApiProperty({
        type: Number,
        example: 0,
        description: 'Version',
    })
    __v!: number;
}

export class ApiMetaSchema {
    @Prop({ type: String, required: true })
    userId!: string;

    @Prop({ type: String, required: true })
    createdBy!: string;

    @Prop({ type: String, required: true })
    updatedBy!: string;
}

export type ApiOutMetaSchema<Schema> = Omit<Schema, keyof ApiMetaSchema>;
