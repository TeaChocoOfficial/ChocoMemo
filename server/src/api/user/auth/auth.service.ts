// -Path: "Nest TypeScript/src/user/auth/auth.service.ts"
import * as argon2 from 'argon2';
import { randomInt } from 'node:crypto';
import type { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../../types/auth';
import type { FastifyReply } from 'fastify';
import { UserService } from '../user.service';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from '../../../mail/mail.service';
import { nameDB } from '../../../hooks/mongodb';
import type { ReqUserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import type { SigninResultDto } from './dto/signin.dto';
import { AuthProvider } from './enum/auth-provider.enum';
import { ResponseUserDto } from '../dto/response-user.dto';
import type { CookieSerializeOptions } from '@fastify/cookie';
import { SecureService } from '../../../secure/secure.service';
import { User, type UserDocument } from '../schemas/user.schema';
import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager';
import type { AuthIdentity } from './schemas/auth-identity.schema';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import {
    PendingRegistration,
    type PendingRegistrationDocument,
} from './schemas/pending-registration.schema';

const OTP_EXPIRES_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const SIGNUP_TOKEN_EXPIRES = '15m';
const SIGNUP_EXPIRES_MS = 15 * 60 * 1000;
const RESET_TOKEN_EXPIRES = '15m';

@Injectable()
export class AuthService {
    logger = new Logger(AuthService.name);

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly secureService: SecureService,
        private readonly mailService: MailService,
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(PendingRegistration.name, nameDB)
        private readonly pendingRegistrationModel: Model<PendingRegistrationDocument>,
    ) {}

    get cookieOption(): CookieSerializeOptions {
        const isDev = this.secureService.isDev();
        return {
            path: '/',
            secure: !isDev,
            httpOnly: true,
            sameSite: isDev ? 'lax' : 'none',
        };
    }

    setCookie(res: FastifyReply, token: string, maxAge: number) {
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        const finalMaxAge = !isNaN(maxAge) && maxAge > 0 ? maxAge : sevenDays;
        res.cookie('access_token', token, {
            maxAge: finalMaxAge,
            ...this.cookieOption,
        });
    }

    clearCookie(res: FastifyReply) {
        res.clearCookie('access_token', this.cookieOption);
    }

    async login(user: ReqUserDto) {
        if (user.email) return { accessToken: this.jwtService.sign(user) };
        throw new BadRequestException({ user });
    }

    async validateUser(email: string, password: string) {
        if (email === '') throw new BadRequestException("Username can't be empty");
        else if (password === '') throw new BadRequestException("Password can't be empty");
        else {
            // Local password lives on the `local` auth identity; `passwordHash`
            // is `select: false`, so it must be requested explicitly.
            const user = await this.userModel
                .findOne({ email, 'identities.provider': AuthProvider.LOCAL })
                .select('+identities.passwordHash')
                .exec();

            const localIdentity = user?.identities?.find(
                (identity) => identity.provider === AuthProvider.LOCAL,
            );

            if (!user || !localIdentity?.passwordHash) {
                // No verified account yet, but a pending registration exists for
                // this email — surface the same flow that kicks off a resend.
                const pending = await this.pendingRegistrationModel.exists({ email }).exec();
                if (pending) throw new BadRequestException('EMAIL_NOT_VERIFIED');
                throw new BadRequestException('Invalid username or password');
            }
            const isValid = await this.verifyHash(password, localIdentity.passwordHash);
            if (!isValid) throw new BadRequestException('Invalid username or password');

            if (!user.emailVerified) throw new BadRequestException('EMAIL_NOT_VERIFIED');

            // Strip the identities so they never leak into the JWT signed by `login`.
            const { identities, ...result } = user.toObject();
            return result;
        }
    }

    async signin(user: ReqUserDto): Promise<SigninResultDto> {
        const identity = user.identities?.[0];
        let userDB: UserDocument | null = null;

        if (identity) {
            userDB = await this.userModel
                .findOne({
                    'identities.provider': identity.provider,
                    'identities.providerUserId': identity.providerUserId,
                })
                .exec();

            // The identity isn't linked to any account yet, but an existing
            // account owns the same provider-verified email (e.g. a local
            // email/password user). Link this identity to that account instead
            // of trying to create a duplicate user and tripping the unique
            // `email` index.
            if (!userDB && identity.providerEmail) {
                userDB = await this.userModel
                    .findOneAndUpdate(
                        { email: identity.providerEmail },
                        {
                            $addToSet: { identities: identity },
                            $set: { emailVerified: true, lastLoginAt: new Date() },
                        },
                        { returnDocument: 'after' },
                    )
                    .exec();
            }
        } else {
            userDB = await this.userModel.findOne({ email: user.email }).exec();
        }

        // Provider-less calls (JWT refresh, `getAuth`) always find an existing
        // user by email; creating a brand-new document requires an identity,
        // and `signup` throws when none is supplied.
        userDB ??= await this.signup(user);

        // Keep the avatar of a linked provider fresh (e.g. a changed Google
        // photo) even when the identity already existed and `$addToSet` skipped it.
        if (identity?.provider === AuthProvider.GOOGLE && user.avatar) {
            await this.userModel
                .updateOne(
                    { _id: userDB._id, 'identities.provider': AuthProvider.GOOGLE },
                    { $set: { 'identities.$.avatar': user.avatar } },
                )
                .exec();
        }

        // A verified external provider (e.g. Google) proves ownership of the
        // mailbox, so drop any leftover unverified registration for it.
        if (identity?.providerEmail) {
            await this.pendingRegistrationModel.deleteOne({ email: identity.providerEmail }).exec();
        }

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const responseUser = await this.userService.responseUser(userDB, expiresAt);

        const payload: ReqUserDto = {
            userId: userDB._id.toString(),
            email: userDB.email,
            name: userDB.name,
            avatar: userDB.avatar,
            role: userDB.role,
            expiresAt,
            createdAt: userDB.createdAt,
            updatedAt: userDB.updatedAt,
            lastLoginAt: userDB.lastLoginAt,
        };

        const access_token = this.jwtService.sign(payload);
        return { access_token, user: responseUser } as SigninResultDto;
    }

    async signup(user: ReqUserDto, options?: { emailVerified?: boolean }): Promise<UserDocument> {
        const identity = user.identities?.[0];
        if (!identity) throw new BadRequestException('Missing auth identity for signup');

        const newUserData: User = {
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            emailVerified: options?.emailVerified ?? identity.provider === AuthProvider.GOOGLE,
            lastLoginAt: new Date(),
            identities: [identity],
        };
        const newUser = new this.userModel(newUserData);
        return newUser.save();
    }

    async registerUser(email: string, password: string, name: string): Promise<SigninResultDto> {
        const existing = await this.userModel.findOne({ email }).exec();
        if (existing) throw new BadRequestException('Email already registered');

        // The account is only created AFTER the OTP is verified. Until then the
        // credentials + OTP live in a TTL-backed pending registration.
        const otp = this.generateOtp();
        const [passwordHash, otpHash] = await Promise.all([
            this.createHash(password),
            this.createHash(otp),
        ]);

        const pending = await this.pendingRegistrationModel
            .findOneAndUpdate(
                { email },
                {
                    $set: {
                        email,
                        name,
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

        await this.sendOtpEmail(email, otp);

        return {
            access_token: this.signSignupToken(pending._id.toString()),
            user: null,
            message: 'Registration successful',
            devOtp: this.secureService.isDev() ? otp : undefined,
        } as SigninResultDto;
    }

    /** Resend a fresh OTP for an unverified registration and return a new signup token. */
    async resendOtp(email: string): Promise<SigninResultDto> {
        const user = await this.userModel.findOne({ email }).exec();
        if (user?.emailVerified) throw new BadRequestException('ALREADY_VERIFIED');

        const pending = await this.pendingRegistrationModel
            .findOne({ email })
            .select('+otpHash +otpExpiresAt +otpAttempts')
            .exec();
        if (!pending) throw new BadRequestException('EMAIL_NOT_FOUND');

        const otp = this.generateOtp();
        await this.storePendingOtp(pending._id.toString(), otp);
        await this.sendOtpEmail(email, otp);

        return {
            access_token: this.signSignupToken(pending._id.toString()),
            user: null,
            message: 'OTP resent',
            devOtp: this.secureService.isDev() ? otp : undefined,
        } as SigninResultDto;
    }

    /** Verify an OTP against a signup token, then create the user and sign them in. */
    async verifyOtp(token: string, code: string): Promise<SigninResultDto> {
        let payload: { userId?: string; purpose?: string };
        try {
            payload = this.jwtService.verify(token);
        } catch {
            throw new BadRequestException('INVALID_OTP');
        }
        if (!payload?.userId || payload.purpose !== 'signup')
            throw new BadRequestException('INVALID_OTP');

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
        if (attempts > OTP_MAX_ATTEMPTS) {
            await this.pendingRegistrationModel.deleteOne({ _id: pending._id }).exec();
            throw new BadRequestException('OTP_EXPIRED');
        }

        const isValid = await this.verifyHash(code, pending.otpHash);
        if (!isValid) {
            await this.pendingRegistrationModel
                .updateOne({ _id: pending._id }, { $set: { otpAttempts: attempts } })
                .exec();
            throw new BadRequestException('INVALID_OTP');
        }

        // OTP verified → now create the real account and drop the pending one.
        const newUser = await this.signup(
            {
                userId: pending._id.toString(),
                email: pending.email,
                name: pending.name,
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

        return this.signin({
            userId: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            lastLoginAt: newUser.lastLoginAt,
        } satisfies ReqUserDto);
    }

    /** Send a password-reset OTP to an existing, verified local account. */
    async forgotPassword(email: string): Promise<SigninResultDto> {
        const user = await this.userModel
            .findOne({ email, 'identities.provider': AuthProvider.LOCAL })
            .exec();
        // Generic response to avoid leaking which emails are registered.
        if (!user || !user.emailVerified) throw new BadRequestException('EMAIL_NOT_FOUND');

        const otp = this.generateOtp();
        await this.storeResetOtp(user._id.toString(), otp);
        await this.sendResetEmail(email, otp);

        return {
            access_token: this.signResetToken(user._id.toString()),
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
        let payload: { userId?: string; purpose?: string };
        try {
            payload = this.jwtService.verify(token);
        } catch {
            throw new BadRequestException('INVALID_OTP');
        }
        if (!payload?.userId || payload.purpose !== 'reset')
            throw new BadRequestException('INVALID_OTP');

        const user = await this.userModel
            .findById(payload.userId)
            .select('+emailOtpHash +emailOtpExpiresAt +emailOtpAttempts')
            .exec();
        if (!user || !user.emailOtpHash || !user.emailOtpExpiresAt)
            throw new BadRequestException('OTP_EXPIRED');

        if (user.emailOtpExpiresAt.getTime() < Date.now()) {
            await this.clearResetOtp(user._id.toString());
            throw new BadRequestException('OTP_EXPIRED');
        }

        const attempts = (user.emailOtpAttempts ?? 0) + 1;
        if (attempts > OTP_MAX_ATTEMPTS) {
            await this.clearResetOtp(user._id.toString());
            throw new BadRequestException('OTP_EXPIRED');
        }

        const isValid = await this.verifyHash(code, user.emailOtpHash);
        if (!isValid) {
            await this.userModel
                .updateOne({ _id: user._id }, { $set: { emailOtpAttempts: attempts } })
                .exec();
            throw new BadRequestException('INVALID_OTP');
        }

        const newPasswordHash = await this.createHash(newPassword);
        await this.userModel
            .updateOne(
                { _id: user._id, 'identities.provider': AuthProvider.LOCAL },
                { $set: { 'identities.$.passwordHash': newPasswordHash } },
            )
            .exec();
        await this.clearResetOtp(user._id.toString());

        return this.signin({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            lastLoginAt: user.lastLoginAt,
        } satisfies ReqUserDto);
    }

    private generateOtp(): string {
        return randomInt(0, 1_000_000).toString().padStart(6, '0');
    }

    private async storePendingOtp(pendingId: string, otp: string): Promise<void> {
        const [otpHash, otpExpiresAt] = await Promise.all([
            this.createHash(otp),
            Promise.resolve(new Date(Date.now() + OTP_EXPIRES_MS)),
        ]);
        await this.pendingRegistrationModel
            .updateOne({ _id: pendingId }, { $set: { otpHash, otpExpiresAt, otpAttempts: 0 } })
            .exec();
    }

    /** Store a password-reset OTP on an existing user document. */
    private async storeResetOtp(userId: string, otp: string): Promise<void> {
        const [otpHash, otpExpiresAt] = await Promise.all([
            this.createHash(otp),
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

    private async clearResetOtp(userId: string): Promise<void> {
        await this.userModel
            .updateOne(
                { _id: userId },
                { $unset: { emailOtpHash: 1, emailOtpExpiresAt: 1, emailOtpAttempts: 1 } },
            )
            .exec();
    }

    private signSignupToken(userId: string): string {
        return this.jwtService.sign({ userId, purpose: 'signup' } as object, {
            expiresIn: SIGNUP_TOKEN_EXPIRES,
        });
    }

    private signResetToken(userId: string): string {
        return this.jwtService.sign({ userId, purpose: 'reset' } as object, {
            expiresIn: RESET_TOKEN_EXPIRES,
        });
    }

    private async sendOtpEmail(email: string, otp: string): Promise<void> {
        try {
            await this.mailService.sendOtp(email, otp);
        } catch (error) {
            this.logger.error(`Failed to send OTP email to ${email}`, error);
        }
    }

    private async sendResetEmail(email: string, otp: string): Promise<void> {
        try {
            await this.mailService.sendPasswordReset(email, otp);
        } catch (error) {
            this.logger.error(`Failed to send password reset email to ${email}`, error);
        }
    }

    async createHash(password: string): Promise<string> {
        const { PASSWORD_HASH_SALT } = this.secureService.getEnvConfig();

        if (!PASSWORD_HASH_SALT) throw new Error('PASSWORD_HASH_SALT is not defined');
        try {
            const hash = await argon2.hash(password, {
                type: argon2.argon2id,
                timeCost: 3,
                parallelism: 4,
                memoryCost: 64 * 1024, // 64 MB
            });
            return hash;
        } catch (error) {
            if (!(error instanceof Error)) throw new Error('Unknown error', { cause: error });
            throw new Error('Error hashing password', { cause: error });
        }
    }

    async verifyHash(password: string, storedHash: string = ''): Promise<boolean> {
        try {
            const isValid = await argon2.verify(storedHash, password);
            return isValid;
        } catch (error) {
            if (!(error instanceof Error)) throw new Error('Unknown error', { cause: error });
            throw new Error('Error verifying password', { cause: error });
        }
    }

    async updateUser(user: ReqUserDto, body: UpdateUserDto): Promise<ResponseUserDto | null> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(user.userId, body, { returnDocument: 'after' })
            .exec();
        if (!updatedUser) throw new BadRequestException('User not found');
        const responseUser = await this.userService.responseUser(updatedUser, user.expiresAt);
        return responseUser;
    }

    /** Verify the current local password and replace it with a new one. */
    async changePassword(
        user: ReqUserDto,
        currentPassword: string,
        newPassword: string,
    ): Promise<void> {
        const userDB = await this.userModel
            .findOne({ _id: user.userId, 'identities.provider': AuthProvider.LOCAL })
            .select('+identities.passwordHash')
            .exec();

        const localIdentity = userDB?.identities?.find(
            (identity) => identity.provider === AuthProvider.LOCAL,
        );

        // A google-only account, or a local slot created without a password yet.
        if (!userDB || !localIdentity) throw new BadRequestException('NO_LOGIN_PASSWORD');

        // First-time password: no current password exists, so just set the new one.
        if (!localIdentity.passwordHash) {
            const newPasswordHash = await this.createHash(newPassword);
            await this.userModel
                .updateOne(
                    { _id: userDB._id, 'identities.provider': AuthProvider.LOCAL },
                    { $set: { 'identities.$.passwordHash': newPasswordHash } },
                )
                .exec();
            return;
        }

        const isValid = await this.verifyHash(currentPassword, localIdentity.passwordHash);
        if (!isValid) throw new BadRequestException('WRONG_CURRENT_PASSWORD');

        const newPasswordHash = await this.createHash(newPassword);
        await this.userModel
            .updateOne(
                { _id: userDB._id, 'identities.provider': AuthProvider.LOCAL },
                { $set: { 'identities.$.passwordHash': newPasswordHash } },
            )
            .exec();
    }

    /** Set or activate the avatar owned by one of the linked sign-in methods. */
    async updateAvatar(
        user: ReqUserDto,
        provider: string,
        url?: string,
    ): Promise<ResponseUserDto | null> {
        const userDB = await this.userModel
            .findById(user.userId)
            .select('+identities.passwordHash')
            .exec();
        if (!userDB) throw new BadRequestException('User not found');

        let identity = userDB.identities?.find((item) => item.provider === provider);

        // Uploading a photo without a linked `local` slot yet (e.g. a google-only
        // account). Create a minimal local identity so the photo has a home; until a
        // password is set it cannot be used to sign in.
        if (!identity && provider === AuthProvider.LOCAL && url) {
            identity = {
                provider: AuthProvider.LOCAL,
                providerUserId: userDB.email,
                providerEmail: userDB.email,
                passwordHash: null,
                avatar: url,
            };
            userDB.identities?.push(identity);
        }

        if (!identity) throw new BadRequestException('IDENTITY_NOT_LINKED');

        const nextAvatar = url ?? identity.avatar ?? userDB.avatar ?? null;
        if (!nextAvatar) throw new BadRequestException('NO_AVATAR_FOR_PROVIDER');

        identity.avatar = nextAvatar;
        userDB.avatar = nextAvatar;
        await userDB.save();

        const responseUser = await this.userService.responseUser(userDB, user.expiresAt);
        return responseUser;
    }
}
