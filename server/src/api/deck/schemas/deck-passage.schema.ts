// -Path: "src/api/deck/schemas/deck-passage.schema.ts"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, type HydratedDocument } from 'mongoose';
import { ApiMetaSchema } from '~/types/dto';
import { VocabSegment, VocabSegmentSchema } from './deck-word.schema';

/** One line of a passage. Segments carry per-kanji furigana, so a reader can
 *  hover a single run instead of one reading for the whole line. */
@Schema({ _id: false })
export class RenderLine {
    @Prop({ type: [VocabSegmentSchema], required: true })
    segments!: VocabSegment[];
}

export const RenderLineSchema = SchemaFactory.createForClass(RenderLine);

export type DeckPassageDocument = HydratedDocument<DeckPassage>;

/** One titled passage inside a reading deck. */
@Schema({ collection: 'deck_passages', timestamps: true })
export class DeckPassage extends ApiMetaSchema {
    /** An ObjectId, not the string it arrives as. Stored that way so a
     *  `$lookup` from a content collection to `decks._id` matches without an
     *  `$toObjectId` cast — a string id silently matches nothing in a join,
     *  which is exactly the kind of bug that only shows up as empty results in
     *  the popularity and recount queries. Mongoose casts on both write and
     *  query, so callers keep passing strings. */
    @Prop({ type: Types.ObjectId, required: true, index: true })
    deckId!: Types.ObjectId;

    @Prop({ required: true })
    title!: string;

    /** Short hint shown under the title, e.g. the grammar focus. */
    @Prop({ type: Object })
    note?: Record<string, string>;

    @Prop({ type: [RenderLineSchema], required: true })
    lines!: RenderLine[];

    @Prop({ type: Object, required: true })
    translation!: Record<string, string>;
    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const DeckPassageSchema = SchemaFactory.createForClass(DeckPassage);

DeckPassageSchema.index({ deckId: 1 });
