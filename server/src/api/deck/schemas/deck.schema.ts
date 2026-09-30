// -Path: "src/api/deck/schemas/deck.schema.ts"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { ApiMetaSchema } from '~/types/dto';
import { DeckType, DeckVisibility, Language } from '~/types/deck';

export type DeckDocument = HydratedDocument<Deck>;

/** A deck published to an account: its metadata, and an ordered list of the
 *  content it points at.
 *
 *  The content itself lives in one of three collections keyed by `deckId`, and
 *  `contentIds` is the deck's running order — so reordering a deck is a single
 *  array write, and reading a deck is one indexed lookup plus one ordered read.
 *
 *  Nothing about the author is stored here. The response joins `users`, because
 *  a copied snapshot would go stale the moment somebody renames themselves. */
@Schema({ collection: 'decks', timestamps: true })
export class Deck extends ApiMetaSchema {
    @Prop({ type: String, enum: DeckType, required: true })
    type!: DeckType;

    @Prop({ type: String, enum: Language, required: true })
    language!: Language;

    /** Always stored as a map, even when the client sent a bare string. */
    @Prop({ type: Object, required: true })
    name!: Record<string, string>;

    @Prop({ type: Object })
    description?: Record<string, string>;

    @Prop({ type: [String], default: [] })
    tags!: string[];

    @Prop({ default: false })
    nsfw!: boolean;

    @Prop({ type: String, enum: DeckVisibility, default: DeckVisibility.PRIVATE })
    visibility!: DeckVisibility;

    /** Ordered: this is the deck's running order, which is why the content
     *  documents need no ordinal of their own. */
    @Prop({ type: [String], required: true, default: [] })
    contentIds!: string[];

    /** -> the `images` collection; the client renders `/api/img/:id`. */
    @Prop()
    coverImageId?: string;

    /**
     * Heart count. Denormalised for the popular sort; `deck_heart_totals` is
     * the authority and a recount migration repairs drift. Bundled official
     * decks have no document here, so their counts live only in that table.
     */
    @Prop({ default: 0, min: 0 })
    heart!: number;

    @Prop({ default: 0, min: 0 })
    downloadCount!: number;

    /** Bumped on every content change, so a client can tell whether its cached
     *  copy is stale. */
    @Prop({ default: '0.0.1' })
    version!: string;

    /** Normalised, lowercased `name` + `description` + `tags` across every
     *  language, so a deck titled in Japanese is searchable in Japanese.
     *  Excluded from reads by default: the list endpoints filter on it but
     *  never return it. */
    @Prop({ select: false })
    searchText?: string;

    /** Added by `timestamps: true`; declared so the document type carries them. */
    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);

// Browse: the deck-list query, and the popular sort when there is no search.
DeckSchema.index({ visibility: 1, language: 1, type: 1, heart: -1, createdAt: -1 });
// Cursor pagination over a feed that only ever grows. `skip` would scan further
// on every page; this walks the index instead.
DeckSchema.index({ visibility: 1, language: 1, createdAt: -1, _id: -1 });
// "My decks", newest first.
DeckSchema.index({ userId: 1, updatedAt: -1 });
