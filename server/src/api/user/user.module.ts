// -Path: "Nest TypeScript/src/user/user.module.ts"
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user.controller';
import { ImportsMongoose } from '../../hooks/mongodb';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [AuthModule, ...new ImportsMongoose({ name: User.name, schema: UserSchema }).imports],
    exports: [UserService],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
