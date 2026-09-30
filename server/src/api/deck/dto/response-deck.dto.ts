// -Path: 'src/api/deck/dto/response-deck.dto.ts'
// The wire shape is the client's own `DeckData`, deliberately field for field:
// the deck-list stores already speak this model, so a response drops straight
// into a store with no translation layer and the existing
// `deckWords` / `deckPassages` / `deckQuestions` resolvers keep working.
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '~/types/auth';
import { DeckContentKind, DeckType, DeckVisibility, Language } from '~/types/deck';

export class DeckAuthorDto {
    @ApiProperty({ type: String, example: '67f1c2a4e1b2c3d4e5f60718' })
    userId!: string;

    @ApiProperty({ type: String, example: 'Aoi' })
    name!: string;

    @ApiProperty({ type: String, example: 'aoi' })
    nameTag!: string;

    @ApiProperty({ type: String, required: false })
    avatar?: string;

    @ApiProperty({ type: String, enum: Role, example: Role.USER })
    role!: Role;
}

export class DeckMetaDto {
    @ApiProperty({ type: DeckAuthorDto })
    author!: DeckAuthorDto;

    @ApiProperty({ type: String, format: 'date-time' })
    createdAt!: string;

    @ApiProperty({ type: String, format: 'date-time' })
    updatedAt!: string;

    @ApiProperty({ type: String, required: false, example: '/api/img/67f1c2a4e1b2c3d4e5f60718' })
    downloadUrl?: string;

    @ApiProperty({ type: Number, default: 0 })
    downloadCount!: number;

    @ApiProperty({ type: String, example: '0.0.1' })
    version!: string;

    @ApiProperty({
        type: Number,
        required: false,
        description: 'Absent until somebody has hearted this deck',
    })
    heart?: number;

    @ApiProperty({
        type: Boolean,
        required: false,
        description: 'Whether the caller has hearted this deck',
    })
    isHeart?: boolean;

    @ApiProperty({ type: String, enum: DeckVisibility })
    visibility!: DeckVisibility;
}

export class ResponseDeckDto {
    @ApiProperty({ type: String, example: '67f1c2a4e1b2c3d4e5f60718' })
    id!: string;

    @ApiProperty({ description: 'Deck title, as a map of language code to text' })
    name!: Record<string, string>;

    @ApiProperty({ required: false, description: 'As a map of language code to text' })
    description?: Record<string, string>;

    @ApiProperty({ type: String, enum: DeckType, example: DeckType.VOCAB })
    type!: DeckType;

    @ApiProperty({ type: String, enum: Language, example: Language.JAPANESE })
    language!: Language;

    @ApiProperty({ type: [String], example: ['nature'] })
    tags!: string[];

    @ApiProperty({ type: Boolean, default: false })
    nsfw!: boolean;

    @ApiProperty({ type: String, required: false, description: 'Cover image URL' })
    image?: string;

    @ApiProperty({ type: [String], description: "The deck's items, in running order" })
    contentIds!: string[];

    @ApiProperty({ type: DeckMetaDto })
    meta!: DeckMetaDto;
}

export class ResponseDeckDetailDto extends ResponseDeckDto {
    @ApiProperty({
        required: false,
        description: "The deck's items, when requested with `include=content`",
    })
    content?: unknown[];
}

/** One page of decks, plus the cursor for the next. `nextCursor` is `null` on
 *  the last page, which is the client\'s signal to stop asking. */
export class ResponseDeckPageDto {
    @ApiProperty({ type: [ResponseDeckDto] })
    items!: ResponseDeckDto[];

    @ApiProperty({ type: String, nullable: true, description: 'Cursor for the next page, or null' })
    nextCursor!: string | null;
}

export class ResponseContentDto {
    @ApiProperty({ type: String, enum: DeckContentKind, example: DeckContentKind.WORD })
    kind!: DeckContentKind;

    @ApiProperty({ type: [String], description: "Content ids, in the deck's running order" })
    ids!: string[];

    @ApiProperty({ description: 'The items themselves, in the same order as `ids`' })
    items!: unknown[];
}
