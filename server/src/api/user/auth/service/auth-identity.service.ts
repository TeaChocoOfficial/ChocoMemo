// -Path: "server/src/api/user/auth/service/auth-identity.service.ts"
import type { Model } from 'mongoose';
import { nameDB } from '~/hooks/mongodb';
import { AuthProvider } from '~/types/auth';
import { InjectModel } from '@nestjs/mongoose';
import type { ReqUserDto } from '../../dto/user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User, type UserDocument } from '../../schemas/user.schema';

@Injectable()
export class AuthIdentityService {
    constructor(
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
    ) {}

    /** Return the user with its `local` identity (incl. the password hash), throwing when there is no local slot. */
    async getUserWithLocalIdentity(user: ReqUserDto) {
        const userDB = await this.userModel
            .findOne({ _id: user.userId, 'identities.provider': AuthProvider.LOCAL })
            .select('+identities.passwordHash')
            .exec();
        const localIdentity = userDB?.identities?.find(
            (identity) => identity.provider === AuthProvider.LOCAL,
        );
        if (!userDB || !localIdentity) throw new BadRequestException('NO_LOGIN_PASSWORD');
        return { userDB, localIdentity };
    }

    /** Confirm a provider is linked and that unlinking keeps at least one usable sign-in method. */
    async assertDisconnectAllowed(userId: string, provider: string): Promise<UserDocument> {
        const userDB = await this.userModel
            .findById(userId)
            .select('+identities.passwordHash')
            .exec();
        if (!userDB) throw new BadRequestException('User not found');

        const identity = userDB.identities?.find((item) => item.provider === provider);
        if (!identity) throw new BadRequestException('IDENTITY_NOT_LINKED');

        // After removal the account must still have either a non-local
        // identity or a local password set.
        const remaining = (userDB.identities ?? []).filter((item) => item.provider !== provider);
        const hasUsableMethod = remaining.some(
            (item) => item.provider !== AuthProvider.LOCAL || Boolean(item.passwordHash),
        );
        if (remaining.length === 0 || !hasUsableMethod) {
            throw new BadRequestException('LAST_SIGNIN_METHOD');
        }
        return userDB;
    }

    /** Remove a linked identity, clearing the avatar when it came from that provider. */
    async unlinkProvider(userId: string, provider: string): Promise<void> {
        const userDB = await this.userModel
            .findById(userId)
            .select('+identities.passwordHash')
            .exec();
        if (!userDB) throw new BadRequestException('User not found');

        const identity = userDB.identities?.find((item) => item.provider === provider);
        const wasAvatarSource = Boolean(identity?.avatar && userDB.avatar === identity.avatar);
        await this.userModel
            .updateOne(
                { _id: userDB._id },
                {
                    $pull: { identities: { provider } },
                    ...(wasAvatarSource ? { $unset: { avatar: 1 } } : {}),
                },
            )
            .exec();
    }
}