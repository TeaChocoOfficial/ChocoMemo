// -Path: "src/user/auth/schemas/pending-registration.schema.ts"
import type { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PendingRegistrationDocument = PendingRegistration & Document;

@Schema({ collection: 'pending_registrations', timestamps: true })
export class PendingRegistration {
    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true })
    name!: string;

    @Prop({ select: false })
    passwordHash?: string;

    @Prop({ select: false })
    otpHash?: string;

    @Prop({ select: false })
    otpExpiresAt?: Date;

    @Prop({ type: Number, default: 0, select: false })
    otpAttempts?: number;

    /** When the pending registration and its OTP expire. Mongo TTL deletes the doc. */
    @Prop({ type: Date, required: true })
    expiresAt!: Date;
}

export const PendingRegistrationSchema = SchemaFactory.createForClass(PendingRegistration);

// Auto-delete expired pending registrations.
PendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });