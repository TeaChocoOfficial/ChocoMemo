// -Path: "server/src/api/user/auth/service/auth-account.service.ts"
import type { Model } from 'mongoose';
import { nameDB } from '~/hooks/mongodb';
import { InjectModel } from '@nestjs/mongoose';
import {
    PendingRegistration,
    type PendingRegistrationDocument,
} from '../schemas/pending-registration.schema';
import { UserService } from '../../user.service';
import type { ReqUserDto } from '../../dto/user.dto';
import { AuthHashService } from './auth-hash.service';
import type { SigninResultDto } from '../dto/signin.dto';
import { AuthProvider } from '../enum/auth-provider.enum';
import { toNameTag } from '../../utils/name-tag.util';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { AuthSessionService } from './auth-session.service';
import { ResponseUserDto } from '../../dto/response-user.dto';
import { User, type UserDocument } from '../../schemas/user.schema';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthAccountService {
    logger = new Logger();
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
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail === '') throw new BadRequestException("Username can't be empty");
        else if (password === '') throw new BadRequestException("Password can't be empty");
        else {
            // Local password lives on the `local` auth identity, keyed by its
            // email; `passwordHash` is `select: false`, fetched explicitly.
            const user = await this.userModel
                .findOne({
                    identities: {
                        $elemMatch: {
                            provider: AuthProvider.LOCAL,
                            providerEmail: normalizedEmail,
                        },
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
                const pending = await this.pendingRegistrationModel
                    .exists({ email: normalizedEmail })
                    .exec();
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
        const identity = user.identities?.[0]
            ? {
                  ...user.identities[0],
                  providerEmail: user.identities[0].providerEmail?.trim().toLowerCase() ?? null,
              }
            : undefined;
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
            nameTag: userDB.nameTag,
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

    private duplicateKeyField(error: unknown): 'nameTag' | 'providerEmail' | undefined {
        if (typeof error !== 'object' || error === null) return;
        const duplicate = error as {
            code?: number;
            keyPattern?: Record<string, unknown>;
            keyValue?: Record<string, unknown>;
        };
        if (duplicate.code !== 11000) return;
        const fields = new Set([
            ...Object.keys(duplicate.keyPattern ?? {}),
            ...Object.keys(duplicate.keyValue ?? {}),
        ]);
        if (fields.has('nameTag')) return 'nameTag';
        if (fields.has('identities.providerEmail')) return 'providerEmail';
        return;
    }

    async signup(user: ReqUserDto, options?: { emailVerified?: boolean }): Promise<UserDocument> {
        const identity = user.identities?.[0];
        if (!identity) throw new BadRequestException('Missing auth identity for signup');
        const normalizedIdentity = {
            ...identity,
            providerEmail: identity.providerEmail?.trim().toLowerCase() ?? null,
        };

        const fallbackId = user.userId || identity.providerUserId;
        const newUserData: User = {
            name: user.name.trim(),
            nameTag: await this.resolveNameTag(user.nameTag, user.name, fallbackId),
            bio: user.bio,
            role: user.role,
            avatar: user.avatar,
            emailVerified:
                options?.emailVerified ?? normalizedIdentity.provider === AuthProvider.GOOGLE,
            lastLoginAt: new Date(),
            identities: [normalizedIdentity],
        };
        const newUser = new this.userModel(newUserData);
        try {
            return await newUser.save();
        } catch (error) {
            const duplicateField = this.duplicateKeyField(error);
            if (duplicateField === 'nameTag') throw new BadRequestException('NAME_TAG_TAKEN');
            if (duplicateField === 'providerEmail') throw new BadRequestException('EMAIL_IN_USE');
            throw error;
        }
    }

    private async resolveNameTag(
        provided: string | undefined,
        name: string,
        fallbackId?: string,
    ): Promise<string> {
        if (provided) {
            const chosen = toNameTag(provided);
            if (!chosen) throw new BadRequestException('NAME_TAG_INVALID');
            if (await this.userModel.exists({ nameTag: chosen }))
                throw new BadRequestException('NAME_TAG_TAKEN');
            return chosen;
        }

        const derived = toNameTag(name);
        const fallback = derived || `user_${fallbackId || 'unknown'}`.slice(0, 30);
        return this.uniqueNameTag(fallback);
    }

    private async uniqueNameTag(base: string): Promise<string> {
        if (!base) throw new Error('uniqueNameTag: base is required');

        let candidate = base;
        for (let suffix = 2; ; suffix++) {
            if (!(await this.userModel.exists({ nameTag: candidate }))) return candidate;
            const suffixStr = `-${suffix}`;
            candidate = `${base.slice(0, 30 - suffixStr.length)}${suffixStr}`;
        }
    }

    async updateUser(user: ReqUserDto, body: UpdateUserDto): Promise<ResponseUserDto | null> {
        // The account email is owned by `identities[].providerEmail` and is only
        // changed through the verified change-email flow, so only mutable profile
        // fields are written here.
        const update: Record<string, unknown> = {};
        if (body.name) update.name = body.name;
        if (body.nameTag !== undefined) {
            // DTO validation already guarantees a valid, non-empty tag here.
            update.nameTag = body.nameTag;
        }
        if (body.bio !== undefined) update.bio = body.bio;

        let updatedUser: UserDocument | null;
        try {
            updatedUser = await this.userModel
                .findByIdAndUpdate(user.userId, update, { returnDocument: 'after' })
                .exec();
        } catch (error) {
            if (this.duplicateKeyField(error) === 'nameTag')
                throw new BadRequestException('NAME_TAG_TAKEN');
            throw error;
        }
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
                await this.userModel
                    .updateOne({ _id: userDB._id }, { $unset: { avatar: 1 } })
                    .exec();
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
            const wasActive = Boolean(
                userDB.avatar && identity.avatar && userDB.avatar === identity.avatar,
            );
            identity.avatar = null;
            if (wasActive) {
                await this.userModel
                    .updateOne({ _id: userDB._id }, { $unset: { avatar: 1 } })
                    .exec();
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
