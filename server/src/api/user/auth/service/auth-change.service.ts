// -Path: "server/src/api/user/auth/service/auth-change.service.ts"
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../../user.service';
import { nameDB } from '../../../../hooks/mongodb';
import { type Auth } from '../../../../types/auth';
import { AuthOtpService } from './auth-otp.service';
import type { ReqUserDto } from '../../dto/user.dto';
import { AuthHashService } from './auth-hash.service';
import { AuthTokenService } from './auth-token.service';
import type { SigninResultDto } from '../dto/signin.dto';
import { AuthProvider } from '../enum/auth-provider.enum';
import { AuthSessionService } from './auth-session.service';
import { AuthAccountService } from './auth-account.service';
import { AuthIdentityService } from './auth-identity.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User, type UserDocument } from '../../schemas/user.schema';

@Injectable()
export class AuthChangeService {
    logger = new Logger();
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: AuthSessionService,
        private readonly hashService: AuthHashService,
        private readonly otpService: AuthOtpService,
        private readonly tokenService: AuthTokenService,
        private readonly identityService: AuthIdentityService,
        private readonly accountService: AuthAccountService,
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
    ) {}

    /** Send an OTP to the NEW email address; the pending change is staged inside the token. */
    async requestEmailChange(
        user: ReqUserDto,
        newEmail: string,
        locale?: string | null,
    ): Promise<{ token: string }> {
        const normalized = newEmail.trim().toLowerCase();
        if (!normalized) throw new BadRequestException('EMAIL_INVALID');

        const userDB = await this.userModel.findById(user.userId).exec();
        if (!userDB) throw new BadRequestException('User not found');
        const currentEmail = this.userService.getUserEmail(userDB);
        if (normalized === currentEmail.toLowerCase())
            throw new BadRequestException('EMAIL_SAME_AS_CURRENT');

        const taken = await this.userModel
            .exists({ 'identities.providerEmail': normalized, _id: { $ne: user.userId } })
            .exec();
        if (taken) throw new BadRequestException('EMAIL_TAKEN');

        const otp = this.otpService.generate();
        await this.otpService.storeForUser(user.userId, otp);
        await this.otpService.sendEmail(normalized, otp, locale);

        return {
            token: this.tokenService.sign(user.userId, 'changeEmail', { newEmail: normalized }),
        };
    }

    /** Confirm the change-email OTP and move the account to the new address. */
    async confirmEmailChange(
        user: ReqUserDto,
        token: string,
        code: string,
    ): Promise<SigninResultDto> {
        const payload = this.tokenService.verify(token, 'changeEmail');
        if (!payload.newEmail || payload.userId !== user.userId)
            throw new BadRequestException('INVALID_OTP');

        const newEmail = payload.newEmail.toLowerCase();
        const taken = await this.userModel
            .exists({ 'identities.providerEmail': newEmail, _id: { $ne: user.userId } })
            .exec();
        if (taken) throw new BadRequestException('EMAIL_TAKEN');

        await this.otpService.verifyForUser(user.userId, code);

        const userDB = await this.userModel
            .findById(user.userId)
            .select('+identities.passwordHash +emailOtpHash')
            .exec();
        if (!userDB) throw new BadRequestException('User not found');

        // The account email lives on the local identity (or becomes one, for
        // provider-only accounts that never had a local slot).
        userDB.emailVerified = true;
        const localIdentity = userDB.identities?.find(
            (identity) => identity.provider === AuthProvider.LOCAL,
        );
        if (localIdentity) {
            localIdentity.providerEmail = newEmail;
            localIdentity.providerUserId = newEmail;
        } else {
            userDB.identities?.push({
                provider: AuthProvider.LOCAL,
                providerUserId: newEmail,
                providerEmail: newEmail,
                passwordHash: null,
            });
        }
        await userDB.save();
        await this.otpService.clearForUser(userDB._id.toString());

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const responseUser = await this.userService.responseUser(userDB, expiresAt);
        const payloadNext: ReqUserDto = {
            userId: userDB._id.toString(),
            name: userDB.name,
            avatar: userDB.avatar,
            role: userDB.role,
            expiresAt,
            createdAt: userDB.createdAt,
            updatedAt: userDB.updatedAt,
            lastLoginAt: userDB.lastLoginAt,
        };
        const access_token = this.sessionService.signAccessToken(payloadNext);

        return { access_token, user: responseUser, message: 'Email changed' } as SigninResultDto;
    }

    /** Verify the current password (when one exists) and email an OTP to the account address. */
    async requestPasswordChange(
        user: ReqUserDto,
        currentPassword?: string,
        locale?: string | null,
    ): Promise<{ token: string }> {
        const { userDB, localIdentity } = await this.identityService.getUserWithLocalIdentity(user);
        if (localIdentity.passwordHash) {
            const isValid = await this.hashService.verify(
                currentPassword ?? '',
                localIdentity.passwordHash,
            );
            if (!isValid) throw new BadRequestException('WRONG_CURRENT_PASSWORD');
        }

        const otp = this.otpService.generate();
        await this.otpService.storeForUser(userDB._id.toString(), otp);
        await this.otpService.sendEmail(this.userService.getUserEmail(userDB), otp, locale);

        return { token: this.tokenService.sign(userDB._id.toString(), 'changePassword') };
    }

    /** Confirm the change-password OTP and replace the local password. */
    async confirmPasswordChange(
        user: ReqUserDto,
        token: string,
        code: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<{ message: string }> {
        const payload = this.tokenService.verify(token, 'changePassword');
        if (payload.userId !== user.userId) throw new BadRequestException('INVALID_OTP');

        await this.otpService.verifyForUser(user.userId, code);
        await this.accountService.changePassword(user, currentPassword, newPassword);
        await this.otpService.clearForUser(user.userId);

        return { message: 'Password changed successfully' };
    }

    /** Unlink Google after a successful Google re-auth. The account is located
     *  by the re-verified Google identity (provider id) — the same identifier
     *  used when the identity was linked — so nothing depends on a session
     *  cookie surviving the OAuth round trip. A Google identity maps to exactly
     *  one account, so re-authing as that Google account is sufficient proof. */
    /**
     * Re-verify an OAuth provider round trip and, if it checks out, unlink it.
     * The caller must have completed the provider's OAuth flow in `mode=disconnect`
     * so the identity in `oauthUser` is proof the signed-in account still owns it.
     */
    async disconnectViaProviderReauth(
        provider: AuthProvider.GOOGLE | AuthProvider.DISCORD,
        oauthUser: Auth,
    ): Promise<void> {
        const failCode = `${provider.toUpperCase()}_VERIFY_FAILED`;
        const identity = (oauthUser as ReqUserDto)?.identities?.find(
            (entry) => entry.provider === provider,
        );
        if (!identity?.providerUserId) throw new BadRequestException(failCode);

        const userDB = await this.userModel
            .findOne({
                identities: {
                    $elemMatch: {
                        provider,
                        providerUserId: identity.providerUserId,
                    },
                },
            })
            .exec();
        if (!userDB) throw new BadRequestException(failCode);

        // Never strip the last usable sign-in method.
        await this.identityService.assertDisconnectAllowed(userDB._id.toString(), provider);
        await this.identityService.unlinkProvider(userDB._id.toString(), provider);
    }

    async disconnectViaGoogleReauth(googleUser: Auth): Promise<void> {
        return this.disconnectViaProviderReauth(AuthProvider.GOOGLE, googleUser);
    }
}
