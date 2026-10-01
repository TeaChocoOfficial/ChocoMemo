// -Path: 'src/api/deck/deck.module.ts'
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { ImportsMongoose } from '~/hooks/mongodb';
import { Deck, DeckSchema } from './schemas/deck.schema';
import { User, UserSchema } from '~/api/user/schemas/user.schema';

@Module({
    controllers: [DeckController],
    providers: [DeckService],
    exports: [DeckService],
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        // `User` is registered here too: reading a deck joins its author, and the
        // read path must not depend on `UserModule` being loaded first.
        ...new ImportsMongoose(
            { name: Deck.name, schema: DeckSchema },
            { name: User.name, schema: UserSchema },
        ).imports,
    ],
})
export class DeckModule {}
