// -Path: "Nest TypeScript/src/api/img/schemas/image.schema.ts"
import type { Document } from 'mongoose';
import { ApiMetaSchema } from '../../../types/dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ImageDocument = Image & Document;

@Schema({ collection: 'images', timestamps: true })
export class Image extends ApiMetaSchema {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    mimetype: string;

    @Prop({ type: Buffer, required: true })
    data: Buffer;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
