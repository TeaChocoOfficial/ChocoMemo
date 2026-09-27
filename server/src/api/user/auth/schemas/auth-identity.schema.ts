// -Path: "src/user/auth/schemas/auth-identity.schema.ts"
import { AuthProvider } from '~/types/auth';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuthIdentityDocument = HydratedDocument<AuthIdentity>;

@Schema({ _id: false })
export class AuthIdentity {
    @Prop({ type: String, required: true, enum: AuthProvider })
    provider!: AuthProvider;

    @Prop({ required: true })
    providerUserId!: string;

    @Prop({ type: String, default: null })
    providerEmail!: string | null;

    @Prop({ type: String, default: null })
    avatar?: string | null;

    @Prop({ type: String, default: null, select: false })
    passwordHash!: string | null;
}

export const AuthIdentitySchema = SchemaFactory.createForClass(AuthIdentity);
