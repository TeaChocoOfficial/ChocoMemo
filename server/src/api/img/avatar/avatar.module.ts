import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { PassportModule } from '@nestjs/passport';
import { AvatarController } from './avatar.controller';
import { ImportsMongoose } from '../../../hooks/mongodb';
import { Avatar, AvatarSchema } from './schemas/avatar.schema';

@Module({
    controllers: [AvatarController],
    providers: [AvatarService],
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ...new ImportsMongoose({ name: Avatar.name, schema: AvatarSchema }).imports,
    ],
})
export class AvatarModule {}
