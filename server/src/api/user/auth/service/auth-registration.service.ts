// -Path: "server/src/api/user/auth/service/auth-registration.service.ts"
import { Role } from '~/types/auth';
import type { Model } from 'mongoose';
import { nameDB } from '~/hooks/mongodb';
import { InjectModel } from '@nestjs/mongoose';
import {
    PendingRegistration,
    type PendingRegistrationDocument,
} from '../schemas/pending-registration.schema';
import type { ReqUserDto } from '../../dto/user.dto';
import { AuthHashService } from './auth-hash.service';
import { SecureService } from '~/secure/secure.service';
import { AuthTokenService } from './auth-token.service';
import type { SigninResultDto } from '../dto/signin.dto';
import { AuthProvider } from '../enum/auth-provider.enum';
import { AuthAccountService } from './auth-account.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { AuthIdentity } from '../schemas/auth-identity.schema';
import { User, type UserDocument } from '../../schemas/user.schema';
import { AuthOtpService, OTP_EXPIRES_MS } from './auth-otp.service';

const SIGNUP_EXPIRES_MS = 15 * 60 * 1000;
const SIGNUP_OTP_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthRegistrationService {
    constructor(
        private readonly hashService: AuthHashService,
        private readonly otpService: AuthOtpService,
        private readonly tokenService: AuthTokenService,
        private readonly secureService: SecureService,
        private readonly accountService: AuthAccountService,
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(PendingRegistration.name, nameDB)
        private readonly pendingRegistrationModel: Model<PendingRegistrationDocument>,
    ) {}

    async registerUser(
        email: string,
        password: string,
        name: string,
        nameTag: string,
        locale?: string | null,
    ): Promise<SigninResultDto> {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedNameTag = nameTag.trim().toLowerCase();
        const existing = await this.userModel
            .findOne({ 'identities.providerEmail': normalizedEmail })
            .exec();
        if (existing) throw new BadRequestException('Email already registered');

        const tagExists = await this.userModel.findOne({ nameTag: normalizedNameTag }).exec();
        if (tagExists) throw new BadRequestException('NAME_TAG_TAKEN');

        // The account is only created AFTER the OTP is verified. Until then the
        // credentials + OTP live in a TTL-backed pending registration.
        const otp = this.otpService.generate();
        const [passwordHash, otpHash] = await Promise.all([
            this.hashService.hash(password),
            this.hashService.hash(otp),
        ]);

        const pending = await this.pendingRegistrationModel
            .findOneAndUpdate(
                { email: normalizedEmail },
                {
                    $set: {
                        email: normalizedEmail,
                        name: name.trim(),
                        nameTag: normalizedNameTag,
                        passwordHash,
                        otpHash,
                        otpExpiresAt: new Date(Date.now() + OTP_EXPIRES_MS),
                        otpAttempts: 0,
                        expiresAt: new Date(Date.now() + SIGNUP_EXPIRES_MS),
                    },
                },
                { upsert: true, returnDocument: 'after' },
            )
            .exec();

        await this.otpService.sendEmail(normalizedEmail, otp, locale);

        return {
            access_token: this.tokenService.sign(pending._id.toString(), 'signup'),
            user: null,
            message: 'Registration successful',
            devOtp: this.secureService.isDev() ? otp : undefined,
        } as SigninResultDto;
    }

    /** Resend a fresh OTP for an unverified registration and return a new signup token. */
    async resendOtp(email: string, locale?: string | null): Promise<SigninResultDto> {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.userModel
            .findOne({ 'identities.providerEmail': normalizedEmail })
            .exec();
        if (user?.emailVerified) throw new BadRequestException('ALREADY_VERIFIED');

        const pending = await this.pendingRegistrationModel
            .findOne({ email: normalizedEmail })
            .select('+otpHash +otpExpiresAt +otpAttempts')
            .exec();
        if (!pending) throw new BadRequestException('EMAIL_NOT_FOUND');

        const otp = this.otpService.generate();
        await this.otpService.storeForPending(pending._id.toString(), otp);
        await this.otpService.sendEmail(normalizedEmail, otp, locale);

        return {
            access_token: this.tokenService.sign(pending._id.toString(), 'signup'),
            user: null,
            message: 'OTP resent',
            devOtp: this.secureService.isDev() ? otp : undefined,
        } as SigninResultDto;
    }

    /** Verify an OTP against a signup token, then create the user and sign them in. */
    async verifyOtp(token: string, code: string): Promise<SigninResultDto> {
        const payload = this.tokenService.verify(token, 'signup');

        const pending = await this.pendingRegistrationModel
            .findById(payload.userId)
            .select('+passwordHash +otpHash +otpExpiresAt +otpAttempts')
            .exec();
        if (!pending || !pending.otpHash || !pending.otpExpiresAt || !pending.passwordHash)
            throw new BadRequestException('OTP_EXPIRED');

        if (pending.otpExpiresAt.getTime() < Date.now()) {
            await this.pendingRegistrationModel.deleteOne({ _id: pending._id }).exec();
            throw new BadRequestException('OTP_EXPIRED');
        }

        const attempts = (pending.otpAttempts ?? 0) + 1;
        if (attempts > SIGNUP_OTP_MAX_ATTEMPTS) {
            await this.pendingRegistrationModel.deleteOne({ _id: pending._id }).exec();
            throw new BadRequestException('OTP_EXPIRED');
        }

        const isValid = await this.hashService.verify(code, pending.otpHash);
        if (!isValid) {
            await this.pendingRegistrationModel
                .updateOne({ _id: pending._id }, { $set: { otpAttempts: attempts } })
                .exec();
            throw new BadRequestException('INVALID_OTP');
        }

        // OTP verified → now create the real account and drop the pending one.
        const newUser = await this.accountService.signup(
            {
                userId: pending._id.toString(),
                name: pending.name,
                nameTag: pending.nameTag,
                role: Role.USER,
                lastLoginAt: new Date(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                identities: [
                    {
                        provider: AuthProvider.LOCAL,
                        providerUserId: pending.email,
                        providerEmail: pending.email,
                        passwordHash: pending.passwordHash,
                    } satisfies AuthIdentity,
                ],
            } satisfies ReqUserDto,
            { emailVerified: true },
        );
        await this.pendingRegistrationModel.deleteOne({ _id: pending._id }).exec();

        return this.accountService.signin({
            userId: newUser._id.toString(),
            name: newUser.name,
            nameTag: newUser.nameTag,
            role: newUser.role,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            lastLoginAt: newUser.lastLoginAt,
        } satisfies ReqUserDto);
    }

    /** Send a password-reset OTP to an existing, verified local account. */
    async forgotPassword(email: string, locale?: string | null): Promise<SigninResultDto> {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.userModel
            .findOne({
                identities: {
                    $elemMatch: { provider: AuthProvider.LOCAL, providerEmail: normalizedEmail },
                },
            })
            .exec();
        // Generic response to avoid leaking which emails are registered.
        if (!user || !user.emailVerified) throw new BadRequestException('EMAIL_NOT_FOUND');

        const otp = this.otpService.generate();
        await this.otpService.storeForUser(user._id.toString(), otp);
        await this.otpService.sendResetEmail(normalizedEmail, otp, locale);

        return {
            access_token: this.tokenService.sign(user._id.toString(), 'reset'),
            user: null,
            message: 'Reset code sent',
            devOtp: this.secureService.isDev() ? otp : undefined,
        } as SigninResultDto;
    }

    /** Confirm the reset OTP and replace the local password for the account. */
    async resetPassword(
        token: string,
        code: string,
        newPassword: string,
    ): Promise<SigninResultDto> {
        const payload = this.tokenService.verify(token, 'reset');
        await this.otpService.verifyForUser(payload.userId, code);

        const user = await this.userModel.findById(payload.userId).exec();
        if (!user) throw new BadRequestException('User not found');

        const newPasswordHash = await this.hashService.hash(newPassword);
        await this.userModel
            .updateOne(
                { _id: user._id, 'identities.provider': AuthProvider.LOCAL },
                { $set: { 'identities.$.passwordHash': newPasswordHash } },
            )
            .exec();
        await this.otpService.clearForUser(user._id.toString());

        return this.accountService.signin({
            userId: user._id.toString(),
            name: user.name,
            nameTag: user.nameTag,
            role: user.role,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            lastLoginAt: user.lastLoginAt,
        } satisfies ReqUserDto);
    }
}
