// -Path: 'src/api/deck/deck.module.ts'
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { DeckContentService } from './deck-content.service';
import { ImportsMongoose } from '~/hooks/mongodb';
import { Deck, DeckSchema } from './schemas/deck.schema';
import { DeckWord, DeckWordSchema } from './schemas/deck-word.schema';
import { DeckPassage, DeckPassageSchema } from './schemas/deck-passage.schema';
import { ExamQuestion, ExamQuestionSchema } from './schemas/exam-question.schema';
import { User, UserSchema } from '~/api/user/schemas/user.schema';

@Module({
    controllers: [DeckController],
    providers: [DeckService, DeckContentService],
    exports: [DeckService],
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        // `User` is registered here too: reading a deck joins its author, and the
        // read path must not depend on `UserModule` being loaded first.
        ...new ImportsMongoose(
            { name: Deck.name, schema: DeckSchema },
            { name: DeckWord.name, schema: DeckWordSchema },
            { name: DeckPassage.name, schema: DeckPassageSchema },
            { name: ExamQuestion.name, schema: ExamQuestionSchema },
            { name: User.name, schema: UserSchema },
        ).imports,
    ],
})
export class DeckModule {}
