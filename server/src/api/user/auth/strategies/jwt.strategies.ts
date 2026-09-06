// -Path: "Nest TypeScript/src/user/auth/strategies/jwt.strategies.ts"
import { Injectable } from '@nestjs/common';
import type { Auth } from '../../../../types/auth';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user.service';
import type { UserJWTPayload } from '../../dto/user.dto';
import { SecureService } from '../../../../secure/secure.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        readonly secureService: SecureService,
        private readonly userService: UserService,
    ) {
        const { JWT_SECRET } = secureService.getEnvConfig();
        if (!JWT_SECRET) throw new Error('JWT secret is not defined');
        super({
            secretOrKey: JWT_SECRET,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request?.cookies?.access_token,
            ]),
        });
    }

    async validate(payload: UserJWTPayload): Promise<Auth> {
        const auth = (await this.userService.responseUser(payload)) as Auth;
        return auth;
    }
}
