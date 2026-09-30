import type { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

/** Profile pictures live in their own collection/database, separate from general uploads. */
@Schema({ collection: 'avatars', timestamps: true })
export class Avatar {
    @Prop({ type: String, required: true, unique: true, index: true })
    userId!: string;

    @Prop({ type: String, required: true })
    mimetype!: string;

    @Prop({ type: Buffer, required: true })
    data!: Buffer;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
