// -Path: "Nest TypeScript/src/user/auth/auth.module.ts"
import { importJwt } from '~/hooks/jwt';
import { UserModule } from '../user.module';
import { ConfigModule } from '@nestjs/config';
import {
    PendingRegistration,
    PendingRegistrationSchema,
} from './schemas/pending-registration.schema';
import { MailModule } from '~/mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { ImportsMongoose } from '~/hooks/mongodb';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { XStrategy } from './strategies/x.strategy';
import { JwtStrategy } from './strategies/jwt.strategies';
import { LineStrategy } from './strategies/line.strategy';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthOtpService } from './service/auth-otp.service';
import googleOauthConfig from '~/config/google-oauth.config';
import { LocalStrategy } from './strategies/local.strategies';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthHashService } from './service/auth-hash.service';
import { DiscordStrategy } from './strategies/discord.strategy';
import { AuthTokenService } from './service/auth-token.service';
import { AuthChangeService } from './service/auth-change.service';
import { AuthSessionService } from './service/auth-session.service';
import { AuthAccountService } from './service/auth-account.service';
import { AuthIdentityService } from './service/auth-identity.service';
import { AuthRegistrationService } from './service/auth-registration.service';

@Module({
    providers: [
        XStrategy,
        JwtStrategy,
        LineStrategy,
        LocalStrategy,
        GoogleStrategy,
        AuthOtpService,
        DiscordStrategy,
        AuthHashService,
        AuthTokenService,
        AuthChangeService,
        AuthSessionService,
        AuthAccountService,
        AuthIdentityService,
        AuthRegistrationService,
    ],
    controllers: [AuthController],
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        importJwt(),
        MailModule,
        ConfigModule.forFeature(googleOauthConfig),
        forwardRef(() => UserModule),
        ...new ImportsMongoose(
            { name: User.name, schema: UserSchema },
            { name: PendingRegistration.name, schema: PendingRegistrationSchema },
        ).imports,
    ],
})
export class AuthModule {}
