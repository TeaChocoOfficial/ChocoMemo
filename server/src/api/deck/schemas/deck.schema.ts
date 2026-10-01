// -Path: 'src/api/deck/schemas/deck.schema.ts'
import { ApiMetaSchema } from '~/types/dto';
import type { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeckType, DeckVisibility, Language } from '~/types/deck';

export type DeckDocument = HydratedDocument<Deck>;

/** A published deck: its metadata, and the ids of the content it points at.
 *
 *  The content itself lives in its own collections, which this phase does not
 *  serve yet — so `contentIds` is present and ordered, but empty until decks
 *  gain items. Kept because it is part of the model the client stores, and a
 *  deck that never had one would otherwise be a lie about its shape.
 *
 *  Nothing about the author is stored here. The response joins `users`, because
 *  a copied snapshot would go stale the moment somebody renames themselves. */
@Schema({ collection: 'decks', timestamps: true })
export class Deck extends ApiMetaSchema {
    @Prop({ type: String, enum: DeckType, required: true })
    type!: DeckType;

    @Prop({ type: String, enum: Language, required: true })
    language!: Language;

    /** Always stored as a map, even when a client sends a bare string. */
    @Prop({ type: Object, required: true })
    name!: Record<string, string>;

    @Prop({ type: Object })
    description?: Record<string, string>;

    @Prop({ type: [String], default: [] })
    tags!: string[];

    @Prop({ default: false })
    nsfw!: boolean;

    @Prop({ type: String, enum: DeckVisibility, default: DeckVisibility.PUBLIC })
    visibility!: DeckVisibility;

    /** Ordered: this is the deck's running order. Empty until decks carry
     *  content — see the note on the class. */
    @Prop({ type: [String], required: true, default: [] })
    contentIds!: string[];

    /** -> the `images` collection; the client renders `/api/img/:id`. */
    @Prop()
    coverImageId?: string;

    /**
     * Heart count, denormalised for the `popular` sort.
     *
     * @todo Nothing writes this yet. A heart is server state for a published
     * deck but client state for a bundled one, so the authority is still to be
     * decided; see the plan. Until then it is always 0 and the response leaves
     * `meta.heart` out entirely, which the client reads as "nobody has hearted
     * this" rather than inventing a number.
     */
    @Prop({ default: 0, min: 0 })
    heart!: number;

    @Prop({ default: 0, min: 0 })
    downloadCount!: number;

    @Prop({ default: '0.0.1' })
    version!: string;

    /** Added by `timestamps: true`; declared so the document type carries them. */
    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const DeckSchema = SchemaFactory.createForClass(Deck);

// The deck-list query, and the popular sort when there is no search.
DeckSchema.index({ visibility: 1, language: 1, type: 1, heart: -1, createdAt: -1 });
// Cursor pagination over a feed that only ever grows. `skip` would scan further
// on every page; this walks the index instead.
DeckSchema.index({ visibility: 1, language: 1, createdAt: -1, _id: -1 });
// "My decks", newest first.
DeckSchema.index({ userId: 1, updatedAt: -1 });
