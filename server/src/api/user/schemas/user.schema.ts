// -Path: "Nest TypeScript/src/user/schemas/user.schema.ts"
import type { Document } from 'mongoose';
import { Role } from '../../../types/auth';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
    @Prop({ sparse: true, unique: true })
    googleId?: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop()
    password?: string;

    @Prop({ required: true })
    name!: string;

    @Prop()
    avatar?: string;

    @Prop({ type: String, enum: Role, required: true })
    role!: Role;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;

    @Prop({ required: true })
    lastLoginAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ createdAt: 1 });
