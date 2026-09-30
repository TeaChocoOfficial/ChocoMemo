// -Path: "src/api/deck/dto/create-deck.dto.ts"
import { Transform, plainToInstance } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    registerDecorator,
    validateSync,
    type ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
    CONTENT_KIND_BY_TYPE,
    DeckContentKind,
    DeckType,
    DeckVisibility,
    Language,
} from '~/types/deck';
import { ExamQuestionType } from '../schemas/exam-question.schema';
import {
    MAX_CONTENT_ITEMS,
    MeaningQuestionDto,
    PassageDto,
    QUESTION_DTO_BY_TYPE,
    WordDto,
} from './deck-content.dto';
import { IsLangText, NormalizeLangText } from '../validators/lang-text.validator';

const MAX_TAGS = 8;

/** The DTO each content kind is validated against. `vocab` and `review` share
 *  words, which is why this is keyed by content kind and not by deck type. */
const CONTENT_DTO_BY_KIND: Record<DeckContentKind, new () => object> = {
    [DeckContentKind.WORD]: WordDto,
    [DeckContentKind.PASSAGE]: PassageDto,
    // Questions are a union with no single class; each item is matched to its
    // variant by its own `type` field, so this entry is only a placeholder.
    [DeckContentKind.QUESTION]: MeaningQuestionDto,
};

/** Validates one content item against the DTO for its kind, and for a question
 *  against the DTO for its own variant. Returns every field problem found, so a
 *  client fixing a malformed upload sees all of them at once. */
function contentItemProblems(kind: DeckContentKind, item: unknown): string[] {
    const type = (item as { type?: unknown } | null)?.type;
    const Dto =
        kind === DeckContentKind.QUESTION
            ? typeof type === 'string' && type in QUESTION_DTO_BY_TYPE
                ? QUESTION_DTO_BY_TYPE[type as ExamQuestionType]
                : null
            : CONTENT_DTO_BY_KIND[kind];

    if (Dto === null) {
        return [`type must be one of: ${Object.values(ExamQuestionType).join(', ')}`];
    }
    return validateSync(plainToInstance(Dto, item)).flatMap((error) =>
        Object.values(error.constraints ?? {}),
    );
}

/** Checks that `content` is a non-empty array whose items match the deck's
 *  `type`. Split out as a pure function so it can be reasoned about — and
 *  tested — without a decorator. */
export function checkDeckContent(
    value: unknown,
    type: DeckType | undefined,
): { ok: boolean; reason: string } {
    const pass = { ok: true, reason: '' };
    const fail = (reason: string) => ({ ok: false, reason });

    const kind = type ? CONTENT_KIND_BY_TYPE[type] : undefined;
    if (!kind) return fail('this deck type holds no content');
    if (!Array.isArray(value) || value.length === 0) return fail('a deck needs at least one item');
    if (value.length > MAX_CONTENT_ITEMS) {
        return fail(`a deck holds at most ${MAX_CONTENT_ITEMS} items`);
    }

    const problems: string[] = [];
    value.forEach((item, index) => {
        for (const message of contentItemProblems(kind, item)) {
            problems.push(`content[${index}]: ${message}`);
        }
    });
    if (problems.length > 0) {
        // A deck can fail hundreds of ways; reporting the first handful is
        // enough to act on without turning one response into a wall of text.
        return fail(
            problems.length > 10
                ? `${problems.slice(0, 10).join('; ')} (+${problems.length - 10} more)`
                : problems.join('; '),
        );
    }
    return pass;
}

/** Property-level wrapper around `checkDeckContent`. Applied at the class level
 *  in spirit — the valid shape depends on the sibling `type` field, which a
 *  property validator cannot see. */
export function ValidateDeckContent() {
    return function (object: object, propertyName: string) {
        let reason = 'deck content does not match the deck type';
        registerDecorator({
            name: 'deckContentMatchesType',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            // The message lives on `options`, not beside `validator`: this is
            // where class-validator looks for it, and reading it at validation
            // time is what lets one decorator carry a per-failure reason.
            options: { message: () => reason },
            validator: {
                // The sibling `type` is read from the validation arguments, not
                // from the closure: a decorator runs once, when its class is
                // defined, so the `object` captured above is the prototype and
                // every one of its properties is undefined.
                validate: (value: unknown, args?: ValidationArguments) => {
                    const result = checkDeckContent(
                        value,
                        (args?.object as { type?: DeckType } | undefined)?.type,
                    );
                    reason = result.reason || reason;
                    return result.ok;
                },
            },
        });
    };
}

export class CreateDeckDto {
    @IsEnum(DeckType)
    @ApiProperty({ type: String, enum: DeckType, example: DeckType.VOCAB })
    type!: DeckType;

    @IsEnum(Language)
    @ApiProperty({ type: String, enum: Language, example: Language.JAPANESE })
    language!: Language;

    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ description: 'Deck title, as a string or a map of language to string' })
    name!: Record<string, string>;

    @IsOptional()
    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ required: false, description: 'One or two sentences about the deck' })
    description?: Record<string, string>;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(MAX_TAGS)
    @IsString({ each: true })
    @MaxLength(32, { each: true })
    @Transform(({ value }: { value: unknown }) =>
        Array.isArray(value)
            ? value.map((tag: unknown) => String(tag).trim().toLowerCase()).filter(Boolean)
            : value,
    )
    @ApiProperty({ type: [String], required: false, example: ['nature', 'beginner'] })
    tags?: string[];

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ type: Boolean, required: false, default: false })
    nsfw?: boolean;

    @IsOptional()
    @IsEnum(DeckVisibility)
    @ApiProperty({ type: String, enum: DeckVisibility, required: false })
    visibility?: DeckVisibility;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    @ApiProperty({ type: String, required: false, description: 'Cover image id' })
    coverImageId?: string;

    /** Words, passages or questions depending on `type`; validated one level
     *  down against that type's DTO. */
    @ValidateDeckContent()
    @ArrayMinSize(1)
    @ApiProperty({
        description: "The deck's items: an array of words, passages or questions",
    })
    content!: unknown[];
}
