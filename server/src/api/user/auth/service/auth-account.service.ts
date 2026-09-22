// -Path: "server/src/api/user/auth/service/auth-account.service.ts"
import type { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { nameDB } from '../../../../hooks/mongodb';
import { UserService } from '../../user.service';
import { UpdateUserDto } from '../../dto/update-user.dto';
import type { SigninResultDto } from '../dto/signin.dto';
import { AuthProvider } from '../enum/auth-provider.enum';
import { ResponseUserDto } from '../../dto/response-user.dto';
import type { ReqUserDto } from '../../dto/user.dto';
import { AuthSessionService } from './auth-session.service';
import { AuthHashService } from './auth-hash.service';
import { User, type UserDocument } from '../../schemas/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
    PendingRegistration,
    type PendingRegistrationDocument,
} from '../schemas/pending-registration.schema';

@Injectable()
export class AuthAccountService {
    constructor(
        private readonly sessionService: AuthSessionService,
        private readonly hashService: AuthHashService,
        private readonly userService: UserService,
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(PendingRegistration.name, nameDB)
        private readonly pendingRegistrationModel: Model<PendingRegistrationDocument>,
    ) {}

    async validateUser(email: string, password: string) {
        if (email === '') throw new BadRequestException("Username can't be empty");
        else if (password === '') throw new BadRequestException("Password can't be empty");
        else {
            // Local password lives on the `local` auth identity, keyed by its
            // email; `passwordHash` is `select: false`, fetched explicitly.
            const user = await this.userModel
                .findOne({
                    identities: {
                        $elemMatch: { provider: AuthProvider.LOCAL, providerEmail: email },
                    },
                })
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
            const isValid = await this.hashService.verify(password, localIdentity.passwordHash);
            if (!isValid) throw new BadRequestException('Invalid username or password');

            if (!user.emailVerified) throw new BadRequestException('EMAIL_NOT_VERIFIED');

            // Strip the identities so they never leak into the JWT signed on login.
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
            // `identities.providerEmail` index.
            if (!userDB && identity.providerEmail) {
                userDB = await this.userModel
                    .findOneAndUpdate(
                        { 'identities.providerEmail': identity.providerEmail },
                        {
                            $addToSet: { identities: identity },
                            $set: { emailVerified: true, lastLoginAt: new Date() },
                        },
                        { returnDocument: 'after' },
                    )
                    .exec();
            }
        } else {
            userDB = await this.userModel.findById(user.userId).exec();
        }

        // Provider-less calls (JWT refresh, `getAuth`) always find an existing
        // account; creating a brand-new document requires an identity, and
        // `signup` throws when none is supplied.
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
            name: userDB.name,
            avatar: userDB.avatar,
            role: userDB.role,
            expiresAt,
            createdAt: userDB.createdAt,
            updatedAt: userDB.updatedAt,
            lastLoginAt: userDB.lastLoginAt,
        };

        const access_token = this.sessionService.signAccessToken(payload);
        return { access_token, user: responseUser } as SigninResultDto;
    }

    async signup(user: ReqUserDto, options?: { emailVerified?: boolean }): Promise<UserDocument> {
        const identity = user.identities?.[0];
        if (!identity) throw new BadRequestException('Missing auth identity for signup');

        const newUserData: User = {
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

    async updateUser(user: ReqUserDto, body: UpdateUserDto): Promise<ResponseUserDto | null> {
        // The account email is owned by `identities[].providerEmail` and is only
        // changed through the verified change-email flow, so only mutable profile
        // fields are written here.
        const updatedUser = await this.userModel
            .findByIdAndUpdate(
                user.userId,
                { ...(body.name ? { name: body.name } : {}) },
                { returnDocument: 'after' },
            )
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
            const newPasswordHash = await this.hashService.hash(newPassword);
            await this.userModel
                .updateOne(
                    { _id: userDB._id, 'identities.provider': AuthProvider.LOCAL },
                    { $set: { 'identities.$.passwordHash': newPasswordHash } },
                )
                .exec();
            return;
        }

        const isValid = await this.hashService.verify(currentPassword, localIdentity.passwordHash);
        if (!isValid) throw new BadRequestException('WRONG_CURRENT_PASSWORD');

        const newPasswordHash = await this.hashService.hash(newPassword);
        await this.userModel
            .updateOne(
                { _id: userDB._id, 'identities.provider': AuthProvider.LOCAL },
                { $set: { 'identities.$.passwordHash': newPasswordHash } },
            )
            .exec();
    }

    /** Set, activate, or clear the avatar owned by one of the linked sign-in methods. */
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

        // Selecting the built-in placeholder clears the active avatar.
        if (provider === 'default') {
            if (userDB.avatar) {
                await this.userModel.updateOne({ _id: userDB._id }, { $unset: { avatar: 1 } }).exec();
                userDB.avatar = undefined;
            }
            return this.userService.responseUser(userDB, user.expiresAt);
        }

        let identity = userDB.identities?.find((item) => item.provider === provider);

        // Uploading a photo without a linked `local` slot yet (e.g. a google-only
        // account). Create a minimal local identity so the photo has a home; until a
        // password is set it cannot be used to sign in.
        if (!identity && provider === AuthProvider.LOCAL && url) {
            const accountEmail = this.userService.getUserEmail(userDB);
            identity = {
                provider: AuthProvider.LOCAL,
                providerUserId: accountEmail,
                providerEmail: accountEmail,
                passwordHash: null,
                avatar: url,
            };
            userDB.identities?.push(identity);
        }

        if (!identity) throw new BadRequestException('IDENTITY_NOT_LINKED');

        // Removing the uploaded photo (no new URL) clears the local slot's avatar.
        // Only drop the active avatar if it actually came from this local identity.
        if (provider === AuthProvider.LOCAL && !url) {
            const wasActive =
                Boolean(userDB.avatar && identity.avatar && userDB.avatar === identity.avatar);
            identity.avatar = null;
            if (wasActive) {
                await this.userModel.updateOne({ _id: userDB._id }, { $unset: { avatar: 1 } }).exec();
                userDB.avatar = undefined;
            }
            await userDB.save();
            return this.userService.responseUser(userDB, user.expiresAt);
        }

        const nextAvatar = url ?? identity.avatar ?? null;
        if (!nextAvatar) throw new BadRequestException('NO_AVATAR_FOR_PROVIDER');

        identity.avatar = nextAvatar;
        userDB.avatar = nextAvatar;
        await userDB.save();

        const responseUser = await this.userService.responseUser(userDB, user.expiresAt);
        return responseUser;
    }
}