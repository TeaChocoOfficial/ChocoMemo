// -Path: "src/api/deck/schemas/deck-word.schema.ts"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, type HydratedDocument } from 'mongoose';
import { ApiMetaSchema } from '~/types/dto';

/** One character (or kana run) of a word inside an example sentence. A kanji
 *  carries its own reading (`rt`), so a reader can hover any run rather than
 *  one reading stretched across the whole word. */
@Schema({ _id: false })
export class VocabSegment {
    @Prop({ required: true })
    ch!: string;

    @Prop()
    rt?: string;

    @Prop({ type: Object })
    mn?: Record<string, string>;

    @Prop({ type: Object })
    dt?: Record<string, string>;
}

export const VocabSegmentSchema = SchemaFactory.createForClass(VocabSegment);

/** The example sentence split into `before` / `segments` / `after` so the
 *  target's surface form and its per-character readings are stored explicitly
 *  rather than pasted from the dictionary form — pasting breaks the moment the
 *  word is conjugated (飲む → 飲みましょう). */
@Schema({ _id: false })
export class VocabExample {
    @Prop({ type: [VocabSegmentSchema], required: true })
    before!: VocabSegment[];

    @Prop({ type: [VocabSegmentSchema], required: true })
    segments!: VocabSegment[];

    @Prop({ type: [VocabSegmentSchema], required: true })
    after!: VocabSegment[];

    @Prop({ type: Object, required: true })
    meaning!: Record<string, string>;
}

export const VocabExampleSchema = SchemaFactory.createForClass(VocabExample);

export type DeckWordDocument = HydratedDocument<DeckWord>;

/** One vocabulary entry inside a deck.
 *
 *  A separate collection from `decks` so a deck stays a small document no
 *  matter how many words it holds, and so the words can be validated against a
 *  real schema — the client sends them, so they are untrusted input. */
@Schema({ collection: 'deck_words', timestamps: true })
export class DeckWord extends ApiMetaSchema {
    /** An ObjectId, not the string it arrives as. Stored that way so a
     *  `$lookup` from a content collection to `decks._id` matches without an
     *  `$toObjectId` cast — a string id silently matches nothing in a join,
     *  which is exactly the kind of bug that only shows up as empty results in
     *  the popularity and recount queries. Mongoose casts on both write and
     *  query, so callers keep passing strings. */
    @Prop({ type: Types.ObjectId, required: true, index: true })
    deckId!: Types.ObjectId;

    @Prop({ required: true })
    word!: string;

    @Prop({ default: '' })
    reading!: string;

    @Prop({ type: Object, required: true })
    meaning!: Record<string, string>;

    @Prop({ type: VocabExampleSchema, required: true })
    example!: VocabExample;

    @Prop({ type: Object })
    note?: Record<string, string>;

    @Prop()
    imageUrl?: string;

    @Prop()
    audioWordUrl?: string;

    @Prop()
    audioSentenceUrl?: string;
    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const DeckWordSchema = SchemaFactory.createForClass(DeckWord);

// Content is only ever read as one deck's whole set, so this is the only index
// it needs. The deck's own `contentIds` array carries the order.
DeckWordSchema.index({ deckId: 1 });
