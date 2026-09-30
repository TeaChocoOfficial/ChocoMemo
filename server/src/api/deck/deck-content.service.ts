// -Path: 'src/api/deck/deck-content.service.ts'
// A deck's items, kept in their own collections.
//
// Split out of `DeckService` because this is the half of the problem with three
// different shapes behind it: a vocabulary deck and a review deck hold words, a
// reading deck holds passages, an exam deck holds questions. Everything above
// this line works in terms of "ids in running order" and never learns which.
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { nameDB } from '~/hooks/mongodb';
import { DeckContentKind } from '~/types/deck';
import { DeckWord, type DeckWordDocument } from './schemas/deck-word.schema';
import { DeckPassage, type DeckPassageDocument } from './schemas/deck-passage.schema';
import { ExamQuestion, type ExamQuestionDocument } from './schemas/exam-question.schema';

type ContentDocument = DeckWordDocument | DeckPassageDocument | ExamQuestionDocument;

@Injectable()
export class DeckContentService {
    logger = new Logger(DeckContentService.name);

    constructor(
        @InjectModel(DeckWord.name, nameDB)
        private readonly wordModel: Model<DeckWord>,
        @InjectModel(DeckPassage.name, nameDB)
        private readonly passageModel: Model<DeckPassage>,
        @InjectModel(ExamQuestion.name, nameDB)
        private readonly questionModel: Model<ExamQuestion>,
    ) {}

    /** The model holding this kind of item. */
    private modelFor(kind: DeckContentKind): Model<ContentDocument> {
        if (kind === DeckContentKind.WORD) return this.wordModel as Model<ContentDocument>;
        if (kind === DeckContentKind.PASSAGE) return this.passageModel as Model<ContentDocument>;
        return this.questionModel as Model<ContentDocument>;
    }

    /**
     * Replaces a deck's items with `items`, wholesale, and returns their ids in
     * the order they were given.
     *
     * Replace rather than merge: the deck's `contentIds` is the running order,
     * so it is rewritten either way, and merging would need per-item identity
     * that the API deliberately does not keep — an item is identified by its
     * position, which is exactly what a reorder changes.
     *
     * The caller has already validated the items against the DTO for this kind.
     * @param userId Recorded on every item so ownership and delete cascades can
     *  both be answered from the item itself.
     */
    async replace(
        deckId: string,
        kind: DeckContentKind,
        items: unknown[],
        userId: string,
    ): Promise<string[]> {
        const model = this.modelFor(kind);
        const m = require('mongoose');
        this.logger.warn(
            `PROBE ${kind} instance=${model.schema.path('deckId')?.instance}` +
                ` Types=${typeof m.Types} SchemaTypes=${typeof m.Schema?.Types}` +
                ` TypesObjId=${typeof m.Types?.ObjectId} viaCtor=${typeof new m.Schema({ x: { type: m.Types.ObjectId } }).path('x').instance}`,
        );
        await model.deleteMany({ deckId });

        const created = await model.insertMany(
            items.map((item) => ({
                ...(item as object),
                deckId,
                // `ApiMetaSchema` wants all three, and they are the same person
                // here: a deck's items are authored with the deck, never apart.
                userId,
                createdBy: userId,
                updatedBy: userId,
            })),
        );
        return created.map((document) => String(document._id));
    }

    /** A deck's items, keyed by id. The order comes from the deck, not from
     *  here — Mongo makes no promise about insertion order across a filtered
     *  read, so the caller re-orders by looking each id up. */
    async findByDeckId(deckId: string, kind: DeckContentKind): Promise<Map<string, unknown>> {
        const documents = await this.modelFor(kind).find({ deckId }).exec();
        return new Map(documents.map((document) => [String(document._id), document.toObject()]));
    }

    /** Removes a deck's items. Called after the deck row is gone, so a failed
     *  delete never orphans content. */
    async removeAll(deckId: string, kind: DeckContentKind): Promise<void> {
        await this.modelFor(kind).deleteMany({ deckId });
    }
}
