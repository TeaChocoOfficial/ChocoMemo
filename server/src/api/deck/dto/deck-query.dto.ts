// -Path: "src/api/deck/dto/deck-query.dto.ts"
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeckType, Language } from '~/types/deck';

/** Hard ceiling on a page, so a crafted `limit` cannot ask for everything. */
export const MAX_PAGE_SIZE = 60;
const DEFAULT_PAGE_SIZE = 20;

export enum DeckSort {
    RECENT = 'recent',
    POPULAR = 'popular',
}

export class DeckQueryDto {
    @IsOptional()
    @IsEnum(Language)
    @ApiPropertyOptional({ type: String, enum: Language, example: Language.JAPANESE })
    language?: Language;

    @IsOptional()
    @IsEnum(DeckType)
    @ApiPropertyOptional({ type: String, enum: DeckType, example: DeckType.VOCAB })
    type?: DeckType;

    @IsOptional()
    @IsString()
    @MaxLength(32)
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @ApiPropertyOptional({ type: String, example: 'nature' })
    tag?: string;

    @IsOptional()
    @IsEnum(DeckSort)
    @ApiPropertyOptional({ type: String, enum: DeckSort, default: DeckSort.RECENT })
    sort?: DeckSort;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(MAX_PAGE_SIZE)
    @ApiPropertyOptional({ type: Number, default: DEFAULT_PAGE_SIZE, maximum: MAX_PAGE_SIZE })
    limit?: number;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    @ApiPropertyOptional({
        type: String,
        description: "Opaque cursor from a previous page. Pass `mine` for the caller's own decks.",
    })
    cursor?: string;
}
