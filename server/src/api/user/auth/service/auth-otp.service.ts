// -Path: "server/src/api/user/auth/service/auth-otp.service.ts"
import type { Model } from 'mongoose';
import { randomInt } from 'node:crypto';
import { InjectModel } from '@nestjs/mongoose';
import {
    PendingRegistration,
    type PendingRegistrationDocument,
} from '../schemas/pending-registration.schema';
import { nameDB } from '../../../../hooks/mongodb';
import { AuthHashService } from './auth-hash.service';
import { MailService } from '../../../../mail/mail.service';
import { User, type UserDocument } from '../../schemas/user.schema';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

export const OTP_EXPIRES_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthOtpService {
    private readonly logger = new Logger(AuthOtpService.name);

    constructor(
        private readonly hashService: AuthHashService,
        private readonly mailService: MailService,
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(PendingRegistration.name, nameDB)
        private readonly pendingRegistrationModel: Model<PendingRegistrationDocument>,
    ) {}

    /** Generate a fresh 6-digit code. */
    generate(): string {
        return randomInt(0, 1_000_000).toString().padStart(6, '0');
    }

    /** Store a signup OTP on a pending registration. */
    async storeForPending(pendingId: string, otp: string): Promise<void> {
        const [otpHash, otpExpiresAt] = await Promise.all([
            this.hashService.hash(otp),
            Promise.resolve(new Date(Date.now() + OTP_EXPIRES_MS)),
        ]);
        await this.pendingRegistrationModel
            .updateOne({ _id: pendingId }, { $set: { otpHash, otpExpiresAt, otpAttempts: 0 } })
            .exec();
    }

    /** Store a generic email OTP on an existing user document. */
    async storeForUser(userId: string, otp: string): Promise<void> {
        const [otpHash, otpExpiresAt] = await Promise.all([
            this.hashService.hash(otp),
            Promise.resolve(new Date(Date.now() + OTP_EXPIRES_MS)),
        ]);
        await this.userModel
            .updateOne(
                { _id: userId },
                {
                    $set: {
                        emailOtpHash: otpHash,
                        emailOtpExpiresAt: otpExpiresAt,
                        emailOtpAttempts: 0,
                    },
                },
            )
            .exec();
    }

    /** Remove the stored email OTP from a user document. */
    async clearForUser(userId: string): Promise<void> {
        await this.userModel
            .updateOne(
                { _id: userId },
                { $unset: { emailOtpHash: 1, emailOtpExpiresAt: 1, emailOtpAttempts: 1 } },
            )
            .exec();
    }

    /** Verify a 6-digit OTP stored on the user document; throws on wrong/expired code. */
    async verifyForUser(userId: string, code: string): Promise<void> {
        const user = await this.userModel
            .findById(userId)
            .select('+emailOtpHash +emailOtpExpiresAt +emailOtpAttempts')
            .exec();
        if (!user || !user.emailOtpHash || !user.emailOtpExpiresAt)
            throw new BadRequestException('OTP_EXPIRED');

        if (user.emailOtpExpiresAt.getTime() < Date.now()) {
            await this.clearForUser(user._id.toString());
            throw new BadRequestException('OTP_EXPIRED');
        }

        const attempts = (user.emailOtpAttempts ?? 0) + 1;
        if (attempts > OTP_MAX_ATTEMPTS) {
            await this.clearForUser(user._id.toString());
            throw new BadRequestException('OTP_EXPIRED');
        }

        const isValid = await this.hashService.verify(code, user.emailOtpHash);
        if (!isValid) {
            await this.userModel
                .updateOne({ _id: user._id }, { $set: { emailOtpAttempts: attempts } })
                .exec();
            throw new BadRequestException('INVALID_OTP');
        }
    }

    async sendEmail(email: string, otp: string): Promise<void> {
        try {
            await this.mailService.sendOtp(email, otp);
        } catch (error) {
            this.logger.error(`Failed to send OTP email to ${email}`, error);
        }
    }

    async sendResetEmail(email: string, otp: string): Promise<void> {
        try {
            await this.mailService.sendPasswordReset(email, otp);
        } catch (error) {
            this.logger.error(`Failed to send password reset email to ${email}`, error);
        }
    }
}