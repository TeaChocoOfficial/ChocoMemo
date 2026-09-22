// -Path: "server/src/api/user/auth/service/auth-session.service.ts"
import { JwtService } from '@nestjs/jwt';
import type { FastifyReply } from 'fastify';
import type { ReqUserDto } from '../../dto/user.dto';
import type { CookieSerializeOptions } from '@fastify/cookie';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SecureService } from '../../../../secure/secure.service';

@Injectable()
export class AuthSessionService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly secureService: SecureService,
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

    /** Sign an account access token for a freshly loaded user. */
    signAccessToken(payload: ReqUserDto): string {
        return this.jwtService.sign(payload);
    }

    /** Issue the initial token for an authenticated principal (local/Google). */
    async login(user: ReqUserDto) {
        if (user.userId) return { accessToken: this.jwtService.sign(user) };
        throw new BadRequestException({ user });
    }
}
