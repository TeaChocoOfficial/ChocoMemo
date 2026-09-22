// -Path: "Nest TypeScript/src/user/auth/strategies/local.strategies.ts"
import { Strategy } from 'passport-local';
import { AuthAccountService } from '../service/auth-account.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private accountService: AuthAccountService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.accountService.validateUser(email, password);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
