// -Path: "Nest TypeScript/src/user/user.service.ts"
import { nameDB } from '~/hooks/mongodb';
import { type Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { toNameTag } from './utils/name-tag.util';
import { AuthProvider } from './auth/enum/auth-provider.enum';
import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import type { UserJWTPayload } from './dto/user.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { ResponseUserDto } from './dto/response-user.dto';
import { User, type UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService implements OnModuleInit {
    logger = new Logger(UserService.name);

    constructor(
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async onModuleInit(): Promise<void> {
        const indexes = await this.userModel.collection.indexes();
        if (!indexes.some((index) => index.name === 'email_1')) return;

        try {
            await this.userModel.collection.dropIndex('email_1');
        } catch (error) {
            const code = (error as { code?: number }).code;
            const codeName = (error as { codeName?: string }).codeName;
            if (code !== 27 && codeName !== 'IndexNotFound') throw error;
        }
    }

    /** The account's login email: the local identity's email, else any linked provider email. */
    getUserEmail(user?: UserDocument | UserJWTPayload | null): string {
        if (!user) return '';
        const identities = (user as UserDocument).identities ?? [];
        const local = identities.find((i) => i.provider === AuthProvider.LOCAL);
        if (local?.providerEmail) return local.providerEmail;
        return identities.find((i) => i.providerEmail)?.providerEmail ?? '';
    }

    async responseUser(
        user?: UserJWTPayload | UserDocument | null,
        expiresAt?: Date,
    ): Promise<ResponseUserDto | null> {
        if (user) {
            const doc = user as UserDocument;
            const responseUser = {
                userId: doc._id ? doc._id.toString() : (user as UserJWTPayload).userId,
                name: user.name,
                nameTag: doc.nameTag ?? (user as UserJWTPayload).nameTag,
                bio: doc.bio,
                avatar: user.avatar,
                role: user.role,
                emailVerified: doc.emailVerified ?? undefined,
                expiresAt: expiresAt,
                createdAt: new Date(String(user.createdAt)),
                updatedAt: new Date(String(user.updatedAt)),
                lastLoginAt: new Date(user.lastLoginAt),
                identities: doc.identities?.map((i) => ({
                    provider: i.provider,
                    providerEmail: i.providerEmail ?? null,
                    avatar: i.avatar ?? null,
                    hasPassword: i.passwordHash !== null,
                })),
            } satisfies ResponseUserDto;
            return responseUser;
        }
        return null;
    }

    async findAll(): Promise<(ResponseUserDto | null)[]> {
        const users = await this.userModel.find().exec();
        return Promise.all(users.map((user) => this.responseUser(user)));
    }

    async findUser(user_id: string): Promise<ResponseUserDto | null> {
        try {
            const id = new Types.ObjectId(user_id);
            const user = await this.userModel.findById(id).exec();
            return this.responseUser(user);
        } catch {
            return null;
        }
    }

    /** Find a user by their public nameTag (case-insensitive, stored lowercase). */
    async findUserByNameTag(nameTag: string): Promise<ResponseUserDto | null> {
        const tag = nameTag.trim().toLowerCase();
        if (!tag) return null;
        const user = await this.userModel.findOne({ nameTag: tag }).exec();
        if (!user) return null;
        return this.responseUser(user);
    }

    async create(user: CreateUserDto): Promise<User> {
        const data: CreateUserDto = {
            ...user,
            nameTag: await this.missingNameTag(user.nameTag, user.name),
        };
        const result = new this.userModel(data);
        return result.save();
    }

    /** Derive an unused nameTag from the name when none was provided. */
    private async missingNameTag(provided: string | undefined, name: string): Promise<string> {
        const chosen = provided ? provided.trim().toLowerCase() : undefined;
        const base = chosen ?? toNameTag(name);
        let candidate = base;
        for (let suffix = 2; suffix < 1000; suffix++) {
            if (!(await this.userModel.exists({ nameTag: candidate }))) return candidate;
            candidate = `${base.slice(0, 30 - String(suffix).length)}-${suffix}`;
        }
        return candidate;
    }

    async update(user_id: string, updateUserDto: UpdateUserDto) {
        return this.userModel.updateOne({ _id: user_id }, updateUserDto).exec();
    }

    async remove(user_id: string) {
        return this.userModel.findByIdAndDelete(user_id).exec();
    }
}
