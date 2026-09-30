// -Path: "src/api/deck/schemas/exam-question.schema.ts"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, type HydratedDocument } from 'mongoose';
import { ApiMetaSchema } from '~/types/dto';

export enum ExamQuestionType {
    MEANING = 'meaning',
    FILL_BLANK = 'fillBlank',
}

export type ExamQuestionDocument = HydratedDocument<ExamQuestion>;

/**
 * One question inside an exam deck.
 *
 * The two variants are genuinely incompatible: a `meaning` question prompts
 * with the word and a `fillBlank` one with two sentence halves. Rather than one
 * schema where every field is optional — which happily accepts a question with
 * neither a prompt nor a sentence — the fields are all declared here and a
 * `pre('validate')` hook enforces the variant's own required set. The input DTOs
 * apply the same check before anything reaches the database.
 */
@Schema({ collection: 'exam_questions', timestamps: true })
export class ExamQuestion extends ApiMetaSchema {
    /** An ObjectId, not the string it arrives as. Stored that way so a
     *  `$lookup` from a content collection to `decks._id` matches without an
     *  `$toObjectId` cast — a string id silently matches nothing in a join,
     *  which is exactly the kind of bug that only shows up as empty results in
     *  the popularity and recount queries. Mongoose casts on both write and
     *  query, so callers keep passing strings. */
    @Prop({ type: Types.ObjectId, required: true, index: true })
    deckId!: Types.ObjectId;

    @Prop({ type: String, enum: ExamQuestionType, required: true })
    type!: ExamQuestionType;

    /** Two to eight options, pre-shuffled by the author. */
    @Prop({ type: [Object], required: true })
    options!: Record<string, string>[];

    @Prop({ type: Object, required: true })
    correctAnswer!: Record<string, string>;

    // --- `meaning` only ---
    @Prop()
    prompt?: string;

    @Prop()
    promptReading?: string;

    // --- `fillBlank` only ---
    @Prop()
    sentenceBefore?: string;

    @Prop()
    sentenceAfter?: string;

    @Prop()
    sentenceReading?: string;
    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const ExamQuestionSchema = SchemaFactory.createForClass(ExamQuestion);

/** Fields each variant cannot do without. Checked on write, in the same order
 *  the input DTOs check them, so the two errors read the same. */
const REQUIRED_BY_TYPE: Record<ExamQuestionType, (keyof ExamQuestion)[]> = {
    [ExamQuestionType.MEANING]: ['prompt'],
    [ExamQuestionType.FILL_BLANK]: ['sentenceBefore', 'sentenceAfter'],
};

ExamQuestionSchema.pre('validate', function () {
    const required = REQUIRED_BY_TYPE[this.type];
    if (!required) return;

    const missing = required.filter((field) => {
        const value = this[field];
        return typeof value !== 'string' || value.trim().length === 0;
    });
    if (missing.length > 0) {
        this.invalidate(
            `${missing.join(', ')}`,
            `a ${this.type} question needs ${missing.join(' and ')}`,
        );
    }
});

ExamQuestionSchema.index({ deckId: 1 });
