// -Path: "Nest TypeScript/src/user/auth/auth.module.ts"
import { UserModule } from '../user.module';
import { ConfigModule } from '@nestjs/config';
import {
    PendingRegistration,
    PendingRegistrationSchema,
} from './schemas/pending-registration.schema';
import { importJwt } from '../../../hooks/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { MailModule } from '../../../mail/mail.module';
import { ImportsMongoose } from '../../../hooks/mongodb';
import { JwtStrategy } from './strategies/jwt.strategies';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthOtpService } from './service/auth-otp.service';
import { LocalStrategy } from './strategies/local.strategies';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthHashService } from './service/auth-hash.service';
import { AuthTokenService } from './service/auth-token.service';
import { AuthChangeService } from './service/auth-change.service';
import googleOauthConfig from '../../../config/google-oauth.config';
import { AuthSessionService } from './service/auth-session.service';
import { AuthAccountService } from './service/auth-account.service';
import { AuthIdentityService } from './service/auth-identity.service';
import { AuthRegistrationService } from './service/auth-registration.service';

@Module({
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
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        LocalStrategy,
        GoogleStrategy,
        AuthOtpService,
        AuthHashService,
        AuthTokenService,
        AuthChangeService,
        AuthSessionService,
        AuthAccountService,
        AuthIdentityService,
        AuthRegistrationService,
    ],
})
export class AuthModule {}
