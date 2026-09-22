// -Path: "Nest TypeScript/src/api/img/schemas/image.schema.ts"
import type { HydratedDocument } from 'mongoose';
import { ApiMetaSchema } from '../../../types/dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ collection: 'images', timestamps: true })
export class Image extends ApiMetaSchema {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    mimetype!: string;

    @Prop({ type: Buffer, required: true })
    data!: Buffer;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
