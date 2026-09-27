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

    /** Public handle used to find this user (e.g. `/profile/:nameTag`).
     *  English letters/numbers/`_-` only, no spaces; stored lowercased. */
    @Prop({ lowercase: true })
    nameTag?: string;

    /** Short self-description shown on the public profile. */
    @Prop({ type: String, maxlength: 160, default: '' })
    bio?: string;

    /** Sign-in email lives on each `identities[].providerEmail`, not here. */
    @Prop()
    avatar?: string;

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
UserSchema.index({ nameTag: 1 }, { unique: true, sparse: true });
// A verified email is unique across accounts: it may appear on at most one
// identity (local `providerEmail` = account email, or a linked provider).
//
// `partialFilterExpression` rather than `sparse`: providers that don't hand out
// an email (LINE by default, X without the `users.email` grant) store an
// explicit `null`, and a sparse index still indexes a present-but-null field —
// so every email-less account collided on the single `null` key and the second
// one failed to sign up with `EMAIL_IN_USE`. Restricting the index to strings
// keeps the uniqueness guarantee for real emails while letting any number of
// email-less identities coexist.
UserSchema.index(
    { 'identities.providerEmail': 1 },
    {
        unique: true,
        partialFilterExpression: { 'identities.providerEmail': { $type: 'string' } },
    },
);
