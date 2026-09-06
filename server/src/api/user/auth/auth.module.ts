// -Path: "Nest TypeScript/src/user/auth/auth.module.ts"
import { importJwt } from '../../../hooks/jwt';
import { UserModule } from '../user.module';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { ImportsMongoose } from '../../../hooks/mongodb';
import { JwtStrategy } from './strategies/jwt.strategies';
import { User, UserSchema } from '../schemas/user.schema';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategies';
import googleOauthConfig from '../../../config/google-oauth.config';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        importJwt(),
        ConfigModule.forFeature(googleOauthConfig),
        forwardRef(() => UserModule),
        ...new ImportsMongoose({ name: User.name, schema: UserSchema }).imports,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy, LocalStrategy],
})
export class AuthModule {}
