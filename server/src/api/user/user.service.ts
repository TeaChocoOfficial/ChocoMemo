// -Path: "Nest TypeScript/src/user/user.service.ts"
import { nameDB } from '../../hooks/mongodb';
import { type Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import type { UserJWTPayload } from './dto/user.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { ResponseUserDto } from './dto/response-user.dto';
import { User, type UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
    logger = new Logger(UserService.name);

    constructor(
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async responseUser(
        user?: UserJWTPayload | UserDocument | null,
        expiresAt?: Date,
    ): Promise<ResponseUserDto | null> {
        if (user) {
            const responseUser = {
                userId: (user as UserDocument)._id
                    ? (user as UserDocument)._id.toString()
                    : (user as UserJWTPayload).userId,
                googleId: user.googleId,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                expiresAt: expiresAt,
                createdAt: new Date(String(user.createdAt)),
                updatedAt: new Date(String(user.updatedAt)),
                lastLoginAt: new Date(user.lastLoginAt),
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

    async create(user: CreateUserDto): Promise<User> {
        const result = new this.userModel(user);
        return result.save();
    }

    async update(user_id: string, updateUserDto: UpdateUserDto) {
        return this.userModel.updateOne({ _id: user_id }, updateUserDto).exec();
    }

    async remove(user_id: string) {
        return this.userModel.findByIdAndDelete(user_id).exec();
    }
}
