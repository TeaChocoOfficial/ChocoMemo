// -Path: "Nest TypeScript/src/user/auth/auth.service.ts"
import * as argon2 from 'argon2';
import type { Model } from 'mongoose';
import { Role } from '../../../types/auth';
import { JwtService } from '@nestjs/jwt';
import { nameDB } from '../../../hooks/mongodb';
import { UserService } from '../user.service';
import { InjectModel } from '@nestjs/mongoose';
import type { ReqUserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import type { CookieSerializeOptions } from '@fastify/cookie';
import type { FastifyReply } from 'fastify';
import type { SigninResultDto } from './dto/signin.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { SecureService } from '../../../secure/secure.service';
import { User, type UserDocument } from '../schemas/user.schema';
import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
    logger = new Logger(AuthService.name);

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly secureService: SecureService,
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
    ) {}

    get cookieOption(): CookieSerializeOptions {
        const isDev = this.secureService.isDev();
        return {
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
        const user = await this.userModel.findOne({ email }).exec();

        if (email === '') throw new BadRequestException("Username can't be empty");
        else if (password === '') throw new BadRequestException("Password can't be empty");
        else {
            if (!user || !user.password) throw new BadRequestException('Invalid username or password');
            const isValid = await this.verifyHash(password, user.password);
            if (!isValid) throw new BadRequestException('Invalid username or password');
            const result = user.toObject();
            return result;
        }
    }

    async signin(user: ReqUserDto): Promise<SigninResultDto> {
        const userDB = await this.userModel.findOne({ email: user.email }).exec();
        if (!userDB) return this.signup(user);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const responseUser = await this.userService.responseUser(userDB, expiresAt);

        const payload: ReqUserDto = {
            userId: userDB._id.toString(),
            googleId: userDB.googleId,
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

    async signup(user: ReqUserDto) {
        const newUserData: User = {
            googleId: user.googleId,
            email: user.email,
            name: user.name,
            password: '',
            role: user.role,
            avatar: user.avatar,
            lastLoginAt: new Date(),
        };
        const newUser = new this.userModel(newUserData);
        await newUser.save();
        return this.signin(user);
    }

    async registerUser(email: string, password: string, name: string): Promise<SigninResultDto> {
        const existing = await this.userModel.findOne({ email }).exec();
        if (existing) throw new BadRequestException('Email already registered');

        const hashedPassword = await this.createHash(password);

        const newUserData: User = {
            email,
            password: hashedPassword,
            name,
            role: Role.USER,
            lastLoginAt: new Date(),
        };
        const newUser = new this.userModel(newUserData);
        await newUser.save();

        return this.signin({
            userId: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            lastLoginAt: newUser.lastLoginAt,
        } satisfies ReqUserDto);
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
}
