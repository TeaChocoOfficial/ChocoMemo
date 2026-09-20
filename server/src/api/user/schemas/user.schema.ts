// -Path: "Nest TypeScript/src/user/schemas/user.schema.ts"
import { Role } from '../../../types/auth';
import type { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthIdentity, AuthIdentitySchema } from '../auth/schemas/auth-identity.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop()
    avatar?: string;

    @Prop()
    googleAvatar?: string;

    @Prop()
    localAvatar?: string;

    @Prop({ type: String, enum: Role, required: true })
    role!: Role;

    /** Every way this user can sign in (`local`, `google`, ...). */
    @Prop({ type: [AuthIdentitySchema], default: [] })
    identities!: AuthIdentity[];

    /** Whether the email was confirmed via OTP. */
    @Prop({ type: Boolean, default: false })
    emailVerified?: boolean;

    /** Hashed email-verification OTP. Not exposed through queries by default. */
    @Prop({ select: false })
    emailOtpHash?: string;

    @Prop({ select: false })
    emailOtpExpiresAt?: Date;

    @Prop({ type: Number, default: 0, select: false })
    emailOtpAttempts?: number;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;

    @Prop({ required: true })
    lastLoginAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ createdAt: 1 });
UserSchema.index({ 'identities.provider': 1, 'identities.providerUserId': 1 });
