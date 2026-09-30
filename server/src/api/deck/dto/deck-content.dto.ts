// -Path: "src/api/deck/dto/deck-content.dto.ts"
// The three kinds of thing a deck can hold, as they arrive on the wire.
//
// These mirror the client's own content types field for field, so a payload the
// client builds can be validated and stored without a translation layer, and a
// stored deck can be handed straight back to the client.
import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExamQuestionType } from '../schemas/exam-question.schema';
import {
    IsLangText,
    NormalizeLangText,
    NormalizeLangTextArray,
} from '../validators/lang-text.validator';

/** Caps on a single deck's content, so one upload cannot fill a database.
 *  A deck is a study aid, not a corpus. */
export const MAX_CONTENT_ITEMS = 2000;
export const MAX_EXAM_OPTIONS = 8;

export class VocabSegmentDto {
    @IsString()
    @MaxLength(64)
    @ApiProperty({ type: String, example: '飲' })
    ch!: string;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    @ApiProperty({ type: String, required: false, example: 'の' })
    rt?: string;

    @IsOptional()
    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ required: false, description: 'Meaning of this single character' })
    mn?: Record<string, string>;

    @IsOptional()
    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ required: false, description: 'Extra detail about this character' })
    dt?: Record<string, string>;
}

export class VocabExampleDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VocabSegmentDto)
    @ApiProperty({ type: [VocabSegmentDto], description: 'Text before the target word' })
    before!: VocabSegmentDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VocabSegmentDto)
    @ApiProperty({ type: [VocabSegmentDto], description: 'The target word, split per character' })
    segments!: VocabSegmentDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VocabSegmentDto)
    @ApiProperty({ type: [VocabSegmentDto], description: 'Text after the target word' })
    after!: VocabSegmentDto[];

    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ description: 'What the sentence means' })
    meaning!: Record<string, string>;
}

export class WordDto {
    @IsString()
    @MinLength(1)
    @MaxLength(128)
    @ApiProperty({ type: String, example: '飲む' })
    word!: string;

    @IsOptional()
    @IsString()
    @MaxLength(128)
    @ApiProperty({ type: String, required: false, example: 'のむ' })
    reading?: string;

    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ description: 'Meaning of the word' })
    meaning!: Record<string, string>;

    @ValidateNested()
    @Type(() => VocabExampleDto)
    @ApiProperty({ type: VocabExampleDto })
    example!: VocabExampleDto;

    @IsOptional()
    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ required: false, description: "Author's note" })
    note?: Record<string, string>;

    @IsOptional()
    @IsString()
    @MaxLength(2048)
    @ApiProperty({ type: String, required: false })
    imageUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2048)
    @ApiProperty({ type: String, required: false })
    audioWordUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2048)
    @ApiProperty({ type: String, required: false })
    audioSentenceUrl?: string;
}

export class RenderLineDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VocabSegmentDto)
    @ApiProperty({ type: [VocabSegmentDto] })
    segments!: VocabSegmentDto[];
}

export class PassageDto {
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @ApiProperty({ type: String, example: 'At the station' })
    title!: string;

    @IsOptional()
    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ required: false, description: 'Grammar focus or a hint' })
    note?: Record<string, string>;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RenderLineDto)
    @ApiProperty({ type: [RenderLineDto] })
    lines!: RenderLineDto[];

    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ description: 'Translation of the passage' })
    translation!: Record<string, string>;
}

/** Fields both question variants share. */
class BaseQuestionDto {
    @IsEnum(ExamQuestionType)
    @ApiProperty({ type: String, enum: ExamQuestionType, example: ExamQuestionType.MEANING })
    type!: ExamQuestionType;

    @IsArray()
    @IsLangText({ each: true })
    @NormalizeLangTextArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(MAX_EXAM_OPTIONS)
    @ApiProperty({ type: [String], description: 'Between 2 and 8 answer options' })
    options!: Record<string, string>[];

    @IsLangText()
    @NormalizeLangText()
    @ApiProperty({ description: 'The right answer, which must be one of the options' })
    correctAnswer!: Record<string, string>;
}

/** "What does this word mean?" — prompts with the word itself. */
export class MeaningQuestionDto extends BaseQuestionDto {
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @ApiProperty({ type: String, example: '飲む' })
    prompt!: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    @ApiProperty({ type: String, required: false, example: 'のむ' })
    promptReading?: string;
}

/** "Fill in the blank." — prompts with the sentence around the gap. */
export class FillBlankQuestionDto extends BaseQuestionDto {
    @IsString()
    @MaxLength(400)
    @ApiProperty({ type: String, example: '毎朝コーヒーを' })
    sentenceBefore!: string;

    @IsString()
    @MaxLength(400)
    @ApiProperty({ type: String, example: 'してから勉強します。' })
    sentenceAfter!: string;

    @IsOptional()
    @IsString()
    @MaxLength(400)
    @ApiProperty({ type: String, required: false, example: 'まいあさ' })
    sentenceReading?: string;
}

export type QuestionDto = MeaningQuestionDto | FillBlankQuestionDto;

/** The DTO class for a variant, so one array of mixed questions can still be
 *  validated item by item. */
export const QUESTION_DTO_BY_TYPE = {
    [ExamQuestionType.MEANING]: MeaningQuestionDto,
    [ExamQuestionType.FILL_BLANK]: FillBlankQuestionDto,
} as const;
